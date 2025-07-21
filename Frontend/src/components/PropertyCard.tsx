import React from "react";
import { Link } from "react-router-dom";
import { Property } from "../types/Property";
import "../style/PropertyCard.css";
import ImageWithFallback from "./ImageWithFallback";

interface Props {
  property: Property;
}

const PropertyCard: React.FC<Props> = ({ property }) => {
  const firstImage = property.images?.[0];
  return (
    <Link to={`/property/${property._id}`} className="property-card">
      <div className="image-wrapper">
        <ImageWithFallback
          src={firstImage}
          alt={property.title}
          className="property-image"
        />
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
          ⭐ {property.rating} · Guests: {property.numberOfGuests}
        </p>
      </div>
    </Link>
  );
};

export default PropertyCard;
