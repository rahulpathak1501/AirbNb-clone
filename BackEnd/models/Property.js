const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    location: { type: String, required: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    pricePerNight: { type: Number, required: true },
    numberOfGuests: { type: Number, required: true },
    images: [String],
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amenities: [String],
    availability: [availabilitySchema],
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);
