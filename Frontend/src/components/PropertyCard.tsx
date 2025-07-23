import React from "react";
import { Link } from "react-router-dom";
import { Property } from "../types/Property";
import "../style/PropertyCard.css";
import ImageWithFallback from "./ImageWithFallback";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { FaStar } from "react-icons/fa";

interface Props {
  property: Property;
}

const PropertyCard: React.FC<Props> = ({ property }) => {
  return (
    <Link to={`/property/${property._id}`} className="property-card">
      <div className="image-wrapper">
        <Swiper
          spaceBetween={5}
          slidesPerView={1}
          loop={property.images.length > 1}
          pagination={{ clickable: true }}
          modules={[Pagination]}
          style={{ height: "250px", borderRadius: "1rem" }}
        >
          {property.images?.map((imageUrl, index) => (
            <SwiperSlide key={index}>
              <ImageWithFallback
                src={imageUrl}
                alt={`${property.title} image ${index + 1}`}
                className="property-image"
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <span className="badge">Guest favourite</span>
        {/* <span className="heart">♥</span> */}
      </div>
      <div className="property-details">
        <h2 className="property-title">{property.title}</h2>
        <p className="property-location">{property.location}</p>
        <p className="property-price">
          ₹{property.pricePerNight.toLocaleString()} / night
        </p>
        <p className="property-meta">
          <FaStar className="icon star-icon" /> {property.rating} · Guests:{" "}
          {property.numberOfGuests}
        </p>
      </div>
    </Link>
  );
};

export default PropertyCard;
