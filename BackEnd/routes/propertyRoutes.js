const express = require("express");
const router = express.Router();
const Property = require("../models/Property");
const auth = require("../middlewares/authMiddleware");

// router.get("/", async (req, res) => {
//   try {
//     const properties = await Property.find();
//     res.json(properties);
//   } catch (err) {
//     console.error("Error fetching properties:", err);
//     res.status(500).json({ msg: "Server error" });
//   }
// });
// Fetch all properties
router.get("/", async (req, res) => {
  try {
    const { location, guests } = req.query;
    const filter = {};

    // Fuzzy search by location
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    // Filter by minimum number of guests
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

    // Ensure the logged-in host owns the property
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

// ✅ Fetch single property by ID
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
      imageUrl,
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
      imageUrl,
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

module.exports = router;
