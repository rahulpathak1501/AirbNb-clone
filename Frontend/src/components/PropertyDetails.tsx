import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ImageWithFallback from "../components/ImageWithFallback";
import { FaMapMarkerAlt, FaStar, FaRegStar } from "react-icons/fa";
// import { FaStar, FaRegStar } from "react-icons/fa";
import BookingForm from "./BookingForm";
import "../style/PropertyDetail.css";
import { Property } from "../types/Property";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import ReviewList from "./ReviewList";
import ReviewForm from "./ReviewForm";

const PropertyDetail: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [message, setMessage] = useState("");
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    const res = await axios.get(`${apiUrl}/reviews/${property?._id}`);
    setReviews(res.data);
  };

  useEffect(() => {
    fetchReviews();
  }, [property?._id]);

  useEffect(() => {
    if (!id) return;
    axios.get(`${apiUrl}/properties/${id}`).then((res) => {
      setProperty(res.data);
    });
  }, [id]);

  if (!property) return <div className="property-not-found">Loading...</div>;

  return (
    <div className="property-detail-container">
      <div className="property-card-detail">
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          loop={property.images.length > 1}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          modules={[Pagination, Autoplay]}
          className="property-image-swiper"
        >
          {property.images.map((imageUrl, index) => (
            <SwiperSlide key={index}>
              <ImageWithFallback
                src={imageUrl}
                alt={`${property.title} image ${index + 1}`}
                className="property-detail-image"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="property-detail-content">
          <h1 className="property-detail-title">{property.title}</h1>
          <div className="property-detail-location">
            <FaMapMarkerAlt className="icon location-icon" />
            {property.location}
          </div>
          <div className="property-detail-price">
            ₹{property.pricePerNight}
            <span className="night-label"> / night</span>
          </div>
          <p className="property-detail-description">{property.description}</p>
          <div className="property-detail-rating">
            {/* <FaStar className="icon star-icon" /> */}
            {property.avgRating?.toFixed(1) || "0.0"}{" "}
            <FaStar className="icon star-icon" /> · Guests:{" "}
            {property.numberOfGuests}
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

          <BookingForm onBookingSuccess={setMessage} />
          <ReviewList reviews={reviews} />
          <ReviewForm
            propertyId={property._id}
            onReviewSubmitted={fetchReviews}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
