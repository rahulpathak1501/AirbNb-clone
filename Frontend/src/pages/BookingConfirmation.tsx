// pages/BookingInvoice.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../style/BookingInvoice.css";

const BookingInvoice = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/bookings/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBooking(res.data);
      } catch (err: any) {
        setError("Failed to load booking invoice.");
      }
    };

    fetchBooking();
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!booking) return <p>Loading...</p>;

  const {
    propertyId,
    customerName,
    guests,
    checkIn,
    checkOut,
    totalPrice,
    status,
  } = booking;
  const nights =
    Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
    ) || 1;

  return (
    <div className="invoice-container">
      <h2>Booking Invoice</h2>
      <img
        src={propertyId.imageUrl}
        alt={propertyId.title}
        className="invoice-img"
      />
      <div className="invoice-details">
        <h3>{propertyId.title}</h3>
        <p>Location: {propertyId.location}</p>
        <p>Guest: {customerName}</p>
        <p>Guests: {guests}</p>
        <p>Check-In: {new Date(checkIn).toDateString()}</p>
        <p>Check-Out: {new Date(checkOut).toDateString()}</p>
        <p>Nights: {nights}</p>
        <p>Total Price: ₹{totalPrice}</p>
        <p>
          Status: <strong>{status}</strong>
        </p>
      </div>
    </div>
  );
};

export default BookingInvoice;
