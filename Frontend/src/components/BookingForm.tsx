import React, { useState } from "react";
import axios from "axios";
import "../style/BookingForm.css";
import { data, useParams } from "react-router-dom";
import { bookingApi } from "../apiServices/apiServices";

interface BookingFormProps {
  onBookingSuccess: (message: string) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onBookingSuccess }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const today = new Date();
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (!customerName.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (checkInDate < today) {
      setError("Check-in date cannot be in the past.");
      return;
    }

    if (checkOutDate <= checkInDate) {
      setError("Check-out date must be after check-in date.");
      return;
    }

    try {
      const bookingData = {
        propertyId: id,
        checkIn,
        checkOut,
        guests,
        customerName,
      };

      const res = await bookingApi.createBooking(bookingData);

      if (res.status === 201) {
        onBookingSuccess("✅ Booking successful!");
      }
    } catch (err: any) {
      const errorMsg = err?.response?.data?.msg || "❌ Booking failed.";
      setError(errorMsg);
    }
  };

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <h3>Book This Property</h3>

      <input
        type="text"
        placeholder="Your Full Name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        required
      />

      <label>Check-in Date:</label>
      <input
        type="date"
        min={new Date().toISOString().split("T")[0]}
        value={checkIn}
        onChange={(e) => setCheckIn(e.target.value)}
        required
      />

      <label>Check-out Date:</label>
      <input
        type="date"
        min={checkIn || new Date().toISOString().split("T")[0]}
        value={checkOut}
        onChange={(e) => setCheckOut(e.target.value)}
        required
      />

      <label>Number of Guests:</label>
      <input
        type="number"
        min="1"
        value={guests}
        onChange={(e) => setGuests(parseInt(e.target.value))}
        required
      />

      {error && <p className="error">{error}</p>}
      <button type="submit">Book Now</button>
    </form>
  );
};

export default BookingForm;
