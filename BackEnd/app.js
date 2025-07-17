const express = require("express");
const cors = require("cors");

const app = express();

// ✅ Middlewares (order matters)
app.use(cors());
app.use(express.json());

// ✅ Route handlers
app.use("/auth", require("./routes/authRoutes"));
app.use("/properties", require("./routes/propertyRoutes"));
app.use("/bookings", require("./routes/bookingRoutes"));

app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;
