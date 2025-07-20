const mongoose = require("mongoose");
const Booking = require("../models/Booking");
require("dotenv").config();

const runCleanup = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const now = new Date();
  const result = await Booking.deleteMany({
    $or: [
      { status: "cancelled" },
      { checkOut: { $lt: now }, status: "confirmed" },
    ],
  });

  console.log(`✅ Deleted ${result.deletedCount} expired/cancelled bookings`);
  mongoose.disconnect();
};

runCleanup();
