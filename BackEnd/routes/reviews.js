const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Review = require("../models/Review");
const Booking = require("../models/Booking");
const Property = require("../models/Property");
const authenticateUser = require("../middlewares/authMiddleware");

// Helper to update avgRating on the property
const updatePropertyAvgRating = async (propertyId) => {
  const objectId = new mongoose.Types.ObjectId(propertyId);
  const reviews = await Review.find({ property: objectId });
  const avg =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  await Property.findByIdAndUpdate(objectId, { avgRating: avg.toFixed(1) });
};

// POST review (only after stay)
router.post("/:propertyId", authenticateUser, async (req, res) => {
  const { rating, comment } = req.body;
  const { propertyId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    return res.status(400).json({ error: "Invalid property ID" });
  }

  const objectId = new mongoose.Types.ObjectId(propertyId);

  try {
    const existingReview = await Review.findOne({
      property: objectId,
      user: userId,
    });
    if (existingReview) {
      return res
        .status(400)
        .json({ error: "You have already reviewed this property." });
    }

    const hasStayed = await Booking.findOne({
      propertyId: new mongoose.Types.ObjectId(propertyId),
      userId,
      checkOut: { $lt: new Date() },
      status: "confirmed",
    });
    if (!hasStayed) {
      return res.status(403).json({
        error: "Only guests who have completed their stay can review.",
      });
    }

    const review = new Review({
      property: objectId,
      user: userId,
      rating,
      comment,
    });
    await review.save();
    await updatePropertyAvgRating(propertyId);

    res.status(201).json(review);
  } catch (err) {
    console.error("Error creating review:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET all reviews for a property
router.get("/:propertyId", async (req, res) => {
  const { propertyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    return res.status(400).json({ error: "Invalid property ID" });
  }

  const objectId = new mongoose.Types.ObjectId(propertyId);

  try {
    const reviews = await Review.find({ property: objectId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    const avgRating = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.json({ reviews, avgRating });
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ error: "Error fetching reviews" });
  }
});

// GET eligibility check for review
router.get("/eligibility/:propertyId", authenticateUser, async (req, res) => {
  const { propertyId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    return res.status(400).json({ error: "Invalid property ID" });
  }

  try {
    const hasStayed = await Booking.findOne({
      propertyId: new mongoose.Types.ObjectId(propertyId),
      userId,
      checkOut: { $lt: new Date() },
      status: "confirmed",
    });
    const alreadyReviewed = await Review.findOne({
      property: new mongoose.Types.ObjectId(propertyId),
      user: userId,
    });
    res.json({ eligible: !!hasStayed && !alreadyReviewed });
  } catch (err) {
    console.error("Eligibility check error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT update review
router.put("/:reviewId", authenticateUser, async (req, res) => {
  const { reviewId } = req.params;

  try {
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ error: "Review not found" });

    if (review.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Unauthorized to update this review" });
    }

    review.comment = req.body.comment;
    review.rating = req.body.rating;

    await review.save();
    await updatePropertyAvgRating(review.property);

    res.json(review);
  } catch (err) {
    console.error("Error updating review:", err);
    res.status(500).json({ error: "Error updating review" });
  }
});

// DELETE review
router.delete("/:reviewId", authenticateUser, async (req, res) => {
  const { reviewId } = req.params;

  try {
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ error: "Review not found" });

    if (review.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this review" });
    }

    await review.deleteOne();
    await updatePropertyAvgRating(review.property);

    res.json({ msg: "Review deleted" });
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).json({ error: "Error deleting review" });
  }
});

module.exports = router;
