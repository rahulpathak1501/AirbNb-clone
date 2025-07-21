import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ImageWithFallback from "../components/ImageWithFallback";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import BookingForm from "./BookingForm";
import "../style/PropertyDetail.css";
import { Property } from "../types/Property";

// interface Property {
//   _id: string;
//   title: string;
//   location: string;
//   description: string;
//   images: string[];
//   pricePerNight: number;
//   numberOfGuests: number;
//   rating: number;
//   amenities: string[];
// }

const PropertyDetail: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!id) return;
    axios.get(`${apiUrl}/properties/${id}`).then((res) => {
      setProperty(res.data);
    });
  }, [id]);

  // const handleBooking = async () => {
  //   const token = localStorage.getItem("token");
  //   if (!token) return setMessage("Please log in first.");

  //   try {
  //     await axios.post(
  //       "http://localhost:5000/bookings",
  //       {
  //         propertyId: id,
  //         checkIn,
  //         checkOut,
  //         guests,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     setMessage("✅ Booking successful!");
  //   } catch (err: any) {
  //     setMessage(err?.response?.data?.msg || "❌ Booking failed.");
  //   }
  // };

  if (!property) return <div className="property-not-found">Loading...</div>;

  return (
    <div className="property-detail-container">
      <div className="property-card-detail">
        <ImageWithFallback
          src={property.images?.[0]}
          alt={property.title}
          className="property-image"
        />
        <div className="property-detail-content">
          <h1 className="property-detail-title">{property.title}</h1>
          <div className="property-detail-location">
            <FaMapMarkerAlt className="icon location-icon" />
            {property.location}
          </div>
          <div className="property-detail-price">
            ₹{property.pricePerNight}{" "}
            <span className="night-label">/ night</span>
          </div>
          <p className="property-detail-description">{property.description}</p>
          <div className="property-detail-rating">
            <FaStar className="icon star-icon" />
            {property.rating} · Guests: {property.numberOfGuests}
          </div>

          <div className="property-amenities-section">
            <h3>Amenities</h3>
            <ul className="property-amenities-list">
              {property.amenities.map((amenity, index) => (
                <li key={index} className="property-amenity">
                  • {amenity}
                </li>
              ))}
            </ul>
          </div>

          {/* <div className="booking-form">
            <h3>Book this property</h3>
            <label>Check In</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
            <label>Check Out</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
            <label>Guests</label>
            <input
              type="number"
              min={1}
              max={property.numberOfGuests}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
            />
            <button onClick={handleBooking} className="book-now-btn">
              Book Now
            </button>
            {message && <p className="booking-message">{message}</p>}
          </div> */}
          <BookingForm onBookingSuccess={setMessage} />
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
