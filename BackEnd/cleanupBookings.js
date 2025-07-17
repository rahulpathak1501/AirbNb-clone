const mongoose = require("mongoose");
const Booking = require("./models/Booking");
require("dotenv").config();

async function cleanUpOldCancelledBookings() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const today = new Date();

    const result = await Booking.deleteMany({
      status: "cancelled",
      checkOut: { $lt: today },
    });

    console.log(`✅ Deleted ${result.deletedCount} old cancelled bookings.`);
    process.exit();
  } catch (err) {
    console.error("❌ Cleanup failed:", err);
    process.exit(1);
  }
}

cleanUpOldCancelledBookings();
