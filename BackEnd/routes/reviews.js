const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const authenticateUser = require("../middlewares/authMiddleware");

// POST review
router.post("/:propertyId", authenticateUser, async (req, res) => {
  const { rating, comment } = req.body;
  try {
    const review = new Review({
      property: req.params.propertyId,
      user: req.user._id,
      rating,
      comment,
    });
    const existingReview = await Review.findOne({
      property: req.params.propertyId,
      user: req.user._id,
    });
    if (existingReview) {
      return res
        .status(400)
        .json({ error: "You have already reviewed this property." });
    }
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: "Error posting review" });
  }
});

// GET reviews for a property
router.get("/:propertyId", async (req, res) => {
  try {
    const reviews = await Review.find({ property: req.params.propertyId })
      .populate("user", "name")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Error fetching reviews" });
  }
});

module.exports = router;

// PUT update review
router.put("/:reviewId", authenticateUser, async (req, res) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review || review.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: "Unauthorized" });
  }
  review.comment = req.body.comment;
  review.rating = req.body.rating;
  await review.save();
  res.json(review);
});

// DELETE review
router.delete("/:reviewId", authenticateUser, async (req, res) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review || review.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: "Unauthorized" });
  }
  await review.deleteOne();
  res.json({ msg: "Review deleted" });
});
