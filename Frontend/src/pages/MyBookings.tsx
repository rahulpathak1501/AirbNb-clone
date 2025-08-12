import React, { useEffect, useState } from "react";
import axios from "axios";
import { Booking } from "../types/Booking";
import "../style/MyBookings.css";
import { Link, useNavigate } from "react-router-dom";
import ImageWithFallback from "../components/ImageWithFallback";
import { bookingApi } from "../apiServices/apiServices";

const MyBookings: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await bookingApi.getBookings();
      setBookings(res.data);
    } catch (err) {
      console.error("Failed to load bookings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;

    try {
      const token = localStorage.getItem("token");
      await bookingApi.cancelBooking(bookingId);
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: "cancelled" } : b
        )
      );
    } catch (err) {
      console.error("Cancellation failed", err);
      alert("Something went wrong.");
    }
  };

  if (loading) return <div className="loading">Loading bookings...</div>;

  return (
    <div className="bookings-container">
      <h1>Your Bookings</h1>
      {bookings.filter((b) => b.propertyId).length === 0 ? (
        <p>You have no bookings yet.</p>
      ) : (
        bookings
          .filter((booking) => booking.propertyId)
          .map((booking) => {
            const checkOutDate = new Date(booking.checkOut);
            const today = new Date();
            const hasStayed = checkOutDate < today;

            return (
              <div key={booking._id} className="booking-card">
                <div
                  className="clickable"
                  onClick={() =>
                    navigate(`/property/${booking.propertyId._id}`)
                  }
                >
                  <ImageWithFallback
                    src={booking.propertyId.images[0]}
                    alt={booking.propertyId.title}
                    className="booking-image"
                  />
                </div>

                <div className="booking-details">
                  <h2
                    className="clickable"
                    onClick={() =>
                      navigate(`/property/${booking.propertyId._id}`)
                    }
                  >
                    {booking.propertyId.title}
                  </h2>
                  <p>{booking.propertyId.location}</p>
                  <p>
                    {new Date(booking.checkIn).toLocaleDateString()} →{" "}
                    {new Date(booking.checkOut).toLocaleDateString()}
                  </p>
                  <p>Guests: {booking.guests}</p>
                  <p>Total: ₹{booking.totalPrice}</p>
                  <p>Status: {booking.status}</p>

                  {booking.status === "confirmed" &&
                    (hasStayed ? (
                      <Link
                        to={`/property/${booking.propertyId._id}#review-form`}
                        className="review-btn"
                      >
                        Leave a Review
                      </Link>
                    ) : (
                      <button
                        className="cancel-btn"
                        onClick={() => handleCancel(booking._id)}
                      >
                        Cancel Booking
                      </button>
                    ))}
                </div>

                <Link
                  to={`/booking/${booking._id}/invoice`}
                  className="invoice-link"
                >
                  View Invoice
                </Link>
              </div>
            );
          })
      )}
    </div>
  );
};

export default MyBookings;
