const express = require("express");
const router = express.Router();
const Property = require("../models/Property");
const auth = require("../middlewares/authMiddleware");
const Booking = require("../models/Booking");
const Review = require("../models/Review");

// Helper: Convert DB property to frontend shape
function formatProperty(p, avgRating = 0) {
  return {
    _id: p._id.toString(),
    title: p.title,
    location: p.location,
    pricePerNight: p.pricePerNight,
    images: p.images && p.images.length > 0 ? p.images : [p.imageUrl || ""],
    avgRating: avgRating ?? 0,
    rating: typeof p.rating === "number" ? p.rating : 0,
    numberOfGuests: p.numberOfGuests,
    description: p.description || "",
    amenities: p.amenities || [],
    latitude: p.coordinates?.lat ?? 0,
    longitude: p.coordinates?.lng ?? 0,
  };
}

// ---------- HOST ROUTES FIRST ----------

// 📍 GET /properties/host/analytics
router.get("/host/analytics", auth, async (req, res) => {
  try {
    if (req.user.role !== "host") {
      return res.status(403).json({ msg: "Only hosts can access analytics" });
    }

    const hostId = req.user._id;
    const properties = await Property.find({ hostId });
    const bookings = await Booking.find({
      propertyId: { $in: properties.map((p) => p._id) },
      status: "confirmed",
    });

    const totalBookings = bookings.length;
    const totalEarnings = bookings.reduce(
      (sum, booking) => sum + booking.totalPrice,
      0
    );

    res.json({
      totalListings: properties.length,
      totalBookings,
      totalEarnings,
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ msg: "Failed to fetch analytics" });
  }
});

// 📍 GET /properties/host - Get properties for current host
router.get("/host", auth, async (req, res) => {
  try {
    const properties = await Property.find({ hostId: req.user._id }).lean();

    // If you want same shape as public route, also compute avg ratings:
    const ratings = await Review.aggregate([
      { $match: { property: { $in: properties.map((p) => p._id) } } },
      { $group: { _id: "$property", avgRating: { $avg: "$rating" } } },
    ]);

    const result = properties.map((p) => {
      const r = ratings.find((x) => x._id.toString() === p._id.toString());
      return formatProperty(p, r ? r.avgRating : 0);
    });

    res.json(result);
  } catch (err) {
    console.error("Failed to fetch host properties:", err);
    res.status(400).json({ msg: "Failed to fetch host properties" });
  }
});

// ---------- PUBLIC ROUTES ----------

// 📌 GET /properties - Public list with filters
router.get("/", async (req, res) => {
  try {
    const { location, guests } = req.query;
    const filter = {};
    if (location) filter.location = { $regex: location, $options: "i" };
    if (guests) filter.numberOfGuests = { $gte: parseInt(guests) };

    const properties = await Property.find(filter).lean();

    // Get avg ratings in bulk
    const ratings = await Review.aggregate([
      { $match: { property: { $in: properties.map((p) => p._id) } } },
      { $group: { _id: "$property", avgRating: { $avg: "$rating" } } },
    ]);

    const result = properties.map((p) => {
      const r = ratings.find((x) => x._id.toString() === p._id.toString());
      return formatProperty(p, r ? r.avgRating : 0);
    });

    res.json(result);
  } catch (err) {
    console.error("Error fetching filtered properties:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// 📌 GET /properties/:id - Single property
router.get("/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).lean();
    if (!property) return res.status(404).json({ msg: "Property not found" });

    const avgRatingData = await Review.aggregate([
      { $match: { property: property._id } },
      { $group: { _id: "$property", avgRating: { $avg: "$rating" } } },
    ]);

    res.json(formatProperty(property, avgRatingData[0]?.avgRating || 0));
  } catch (err) {
    console.error("Error fetching property:", err);
    res.status(400).json({ msg: "Invalid property ID" });
  }
});

// ---------- CREATE / UPDATE / DELETE ----------

// 📌 POST /properties - Host only
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "host") {
      return res.status(403).json({ msg: "Only hosts can add properties" });
    }

    const newProperty = new Property({
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      images: req.body.images,
      pricePerNight: req.body.pricePerNight,
      numberOfGuests: req.body.numberOfGuests,
      amenities: req.body.amenities,
      coordinates: req.body.coordinates,
      hostId: req.user._id,
      availability: [],
    });

    const saved = await newProperty.save();
    res.status(201).json(formatProperty(saved, 0));
  } catch (err) {
    console.error("Error adding property:", err);
    res.status(500).json({ msg: "Server error while adding property" });
  }
});

// 📌 PUT /properties/:id - Host only
router.put("/:id", auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ msg: "Property not found" });

    if (property.hostId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ msg: "Not authorized to update this property" });
    }

    const updates = {
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      pricePerNight: req.body.pricePerNight,
      images: req.body.images,
      numberOfGuests: req.body.numberOfGuests,
      amenities: req.body.amenities,
      coordinates: req.body.coordinates,
    };

    const updated = await Property.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).lean();

    const avgRatingData = await Review.aggregate([
      { $match: { property: updated._id } },
      { $group: { _id: "$property", avgRating: { $avg: "$rating" } } },
    ]);

    res.json(formatProperty(updated, avgRatingData[0]?.avgRating || 0));
  } catch (err) {
    console.error("Error updating property:", err);
    res.status(500).json({ msg: "Server error while updating property" });
  }
});

// 📌 DELETE /properties/:id - Host only
router.delete("/:id", auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ msg: "Property not found" });

    if (property.hostId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ msg: "Not authorized to delete this property" });
    }

    await Property.findByIdAndDelete(req.params.id);
    res.json({ msg: "Property deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
