import React, { useEffect, useState } from "react";
import axios from "axios";
import { Property } from "../types/Property";
import SearchBar from "../components/SearchBar";
import PropertyCard from "../components/PropertyCard";
import "../style/Home.css";

const Home: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProperties = async (query = "", guests = 0) => {
    try {
      const res = await axios.get(`${apiUrl}/properties`, {
        params: {
          location: query,
          guests: guests,
        },
      });
      setProperties(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError(err);
    }
  };

  useEffect(() => {
    fetchProperties(); // Load all on mount
  }, []);

  const filteredProperties = properties.filter((property) => {
    const matchesSearch = property.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesGuests = property.numberOfGuests >= guests;
    return matchesSearch && matchesGuests;
  });

  return (
    <div className="home-container">
      <h1 className="home-title">Find your next stay 🏡</h1>

      <SearchBar onSearch={fetchProperties} />

      <h2 className="section-title">Popular homes</h2>

      {loading ? (
        <p>Loading properties...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <div className="property-carousel">
          {filteredProperties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
