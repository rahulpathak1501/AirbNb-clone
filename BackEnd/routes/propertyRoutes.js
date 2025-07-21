const express = require("express");
const router = express.Router();
const Property = require("../models/Property");
const auth = require("../middlewares/authMiddleware");
const Booking = require("../models/Booking");

// 📌 GET /properties - Public fetch with optional filters
router.get("/", async (req, res) => {
  try {
    const { location, guests } = req.query;
    const filter = {};

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (guests) {
      filter.numberOfGuests = { $gte: parseInt(guests) };
    }

    const properties = await Property.find(filter);
    res.json(properties);
  } catch (err) {
    console.error("Error fetching filtered properties:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// 📌 GET /properties/host - Get properties for current host
router.get("/host", auth, async (req, res) => {
  try {
    const properties = await Property.find({ hostId: req.user._id });
    res.json(properties);
  } catch (err) {
    res.status(400).json({ msg: "Failed to fetch host properties" });
  }
});

// 📌 DELETE /properties/:id - Delete a property by host
router.delete("/:id", auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ msg: "Property not found" });
    }

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

// 📌 GET /properties/:id - Fetch single property by ID
router.get("/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ msg: "Property not found" });
    }
    res.json(property);
  } catch (err) {
    res.status(400).json({ msg: "Invalid property ID" });
  }
});

// 📌 POST /properties - Add new property (host only)
router.post("/", auth, async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      images,
      pricePerNight,
      numberOfGuests,
      amenities,
    } = req.body;

    if (req.user.role !== "host") {
      return res.status(403).json({ msg: "Only hosts can add properties" });
    }

    const newProperty = new Property({
      title,
      description,
      location,
      images,
      pricePerNight,
      numberOfGuests,
      amenities,
      hostId: req.user._id,
      availability: [],
    });

    await newProperty.save();
    res.status(201).json(newProperty);
  } catch (err) {
    console.error("Error adding property:", err);
    res.status(500).json({ msg: "Server error while adding property" });
  }
});

// 📌 PUT /properties/:id - Edit a property (host only)
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
    };

    const updated = await Property.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    console.error("Error updating property:", err);
    res.status(500).json({ msg: "Server error while updating property" });
  }
});

// 📍 GET /host/analytics - Host Dashboard Stats
router.get("/host/analytics", auth, async (req, res) => {
  try {
    if (req.user.role !== "host") {
      return res.status(403).json({ msg: "Only hosts can access analytics" });
    }

    const hostId = req.user._id;

    // 1. Active listings
    const properties = await Property.find({ hostId });

    // 2. Bookings for host's properties
    const bookings = await Booking.find({
      propertyId: { $in: properties.map((p) => p._id) },
      status: "confirmed",
    });

    const totalBookings = bookings.length;

    // 3. Earnings
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

module.exports = router;
