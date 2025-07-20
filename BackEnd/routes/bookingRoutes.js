const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Property = require("../models/Property");
const auth = require("../middlewares/authMiddleware");

// Helper: check if dates overlap
function isOverlap(start1, end1, start2, end2) {
  return start1 < end2 && start2 < end1;
}

// ✅ POST /bookings - Create a new booking
router.post("/", auth, async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut, guests, customerName } = req.body;

    const today = new Date().setHours(0, 0, 0, 0);
    if (
      new Date(checkIn).setHours(0, 0, 0, 0) < today ||
      new Date(checkOut).setHours(0, 0, 0, 0) < today
    ) {
      return res.status(400).json({ msg: "Cannot book for past dates" });
    }

    if (!customerName || customerName.trim() === "") {
      return res.status(400).json({ msg: "Customer name is required" });
    }

    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ msg: "Property not found" });

    // Check for overlapping bookings
    const overlap = property.availability.some((range) =>
      isOverlap(
        new Date(checkIn),
        new Date(checkOut),
        new Date(range.startDate),
        new Date(range.endDate)
      )
    );

    if (overlap) {
      return res.status(400).json({ msg: "Selected dates are not available" });
    }

    const nights = Math.ceil(
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
    );
    const totalPrice = property.pricePerNight * nights;

    // Save booking
    const booking = new Booking({
      userId: req.user._id,
      propertyId,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      customerName,
      status: "confirmed",
    });

    await booking.save();

    // Update property availability
    property.availability.push({ startDate: checkIn, endDate: checkOut });
    await property.save();

    res.status(201).json(booking);
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ GET /bookings - Get bookings for the logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).populate(
      "propertyId"
    );
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ GET /bookings/:id - Get booking by ID (for invoice)
router.get("/:id", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("propertyId", "title location pricePerNight hostId")
      .populate("userId", "name email");

    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    // Check if requester is owner or host
    const isOwner = booking.userId._id.toString() === req.user._id.toString();
    const isHost =
      booking.propertyId?.hostId?.toString() === req.user._id.toString();

    if (!isOwner && !isHost) {
      return res
        .status(403)
        .json({ msg: "Not authorized to view this booking" });
    }

    res.json(booking);
  } catch (err) {
    console.error("Booking fetch error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ GET /bookings/host - Get bookings for host’s properties
router.get("/host", auth, async (req, res) => {
  try {
    if (req.user.role !== "host")
      return res.status(403).json({ msg: "Only hosts can access this" });

    const properties = await Property.find({ hostId: req.user._id });
    const propertyIds = properties.map((p) => p._id);

    const bookings = await Booking.find({
      propertyId: { $in: propertyIds },
    }).populate("propertyId userId");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ DELETE /bookings/:id - Cancel a booking
router.delete("/:id", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ msg: "Booking not found" });

    const isOwner = booking.userId.toString() === req.user._id.toString();
    const property = await Property.findById(booking.propertyId);
    const isHost = property?.hostId.toString() === req.user._id.toString();

    if (!isOwner && !isHost) {
      return res
        .status(403)
        .json({ msg: "Not authorized to cancel this booking" });
    }

    booking.status = "cancelled";
    await booking.save();

    // Remove the availability range
    if (property) {
      property.availability = property.availability.filter(
        (range) =>
          !(
            range.startDate.toISOString() === booking.checkIn.toISOString() &&
            range.endDate.toISOString() === booking.checkOut.toISOString()
          )
      );
      await property.save();
    }

    res.json({ msg: "Booking cancelled" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
