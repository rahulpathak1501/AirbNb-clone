import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/HostDashboard.css";
import { useNavigate, Link } from "react-router-dom";

interface HostDashboardProps {
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
}

const HostDashboard: React.FC<HostDashboardProps> = ({ user }) => {
  const [properties, setProperties] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<{
    totalBookings: number;
    totalEarnings: number;
    totalListings: number;
  } | null>(null);
  const fetchAnalytics = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get(
        "http://localhost:5000/properties/host/analytics",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAnalytics(res.data);
    } catch (err) {
      console.error("Error fetching analytics:", err);
    }
  };
  const fetchProperties = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get("http://localhost:5000/properties/host", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.length === 0) {
        setMessage("You haven’t listed any properties yet.");
      } else {
        setProperties(res.data);
      }
    } catch (err) {
      console.error("Failed to load host properties:", err);
      setMessage("Error loading your properties.");
    }
  };

  useEffect(() => {
    fetchAnalytics();
    fetchProperties();
  }, [user]);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this property?"
    );
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/properties/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Remove the deleted property from UI
      setProperties((prev) => prev.filter((p: any) => p._id !== id));
    } catch (err: any) {
      console.error("Failed to delete property:", err);
      alert(err.response?.data?.msg || "Failed to delete.");
    }
  };

  if (!user || user.role !== "host") {
    return (
      <div className="not-authorized">
        <h2>Access Denied</h2>
        <p>This page is only accessible to hosts.</p>
      </div>
    );
  }

  return (
    <div className="host-dashboard">
      <h2>My Hosted Properties</h2>

      {message ? (
        <div className="host-message">
          <p>{message}</p>
          <Link to="/host/add-property" className="add-property-link">
            ➕ Add New Property
          </Link>
        </div>
      ) : (
        <>
          <div className="property-list">
            {properties.map((property: any) => (
              <div key={property._id} className="property-card">
                <img src={property.imageUrl} alt={property.title} />
                <div className="property-details">
                  <h3>{property.title}</h3>
                  <p>{property.location}</p>
                  <p>₹{property.pricePerNight} / night</p>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(property._id)}
                >
                  🗑 Delete
                </button>
                <Link to={`/host/edit/${property._id}`} className="edit-btn">
                  ✏️ Edit
                </Link>
              </div>
            ))}
            <Link to="/host/add-property" className="add-property-link">
              ➕ Add New Property
            </Link>
          </div>
          {analytics && (
            <div className="analytics-box">
              <h3>Host Analytics</h3>
              <p>Total Listings: {analytics.totalListings}</p>
              <p>Bookings: {analytics.totalBookings}</p>
              <p>Earnings: ₹{analytics.totalEarnings}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HostDashboard;
