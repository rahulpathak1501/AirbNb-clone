import React, { useEffect, useState } from "react";
import "../style/HostDashboard.css";
import { useNavigate, Link } from "react-router-dom";
import { hostApi } from "../apiServices/apiServices";

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
  const [analytics, setAnalytics] = useState<{
    totalBookings: number;
    totalEarnings: number;
    totalListings: number;
  } | null>(null);
  const navigate = useNavigate();

  const fetchAnalytics = async () => {
    try {
      const res = await hostApi.getAnalytics();
      setAnalytics(res.data);
    } catch (err) {
      console.error("Error fetching analytics:", err);
    }
  };

  const fetchProperties = async () => {
    try {
      const res = await hostApi.getProperties();
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

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this property?"
    );
    if (!confirmDelete) return;

    try {
      await hostApi.deleteProperty(id);
      setProperties((prev) => prev.filter((p: any) => p._id !== id));
    } catch (err: any) {
      console.error("Failed to delete property:", err);
      alert(err.response?.data?.msg || "Failed to delete.");
    }
  };

  useEffect(() => {
    if (user && user.role === "host") {
      fetchAnalytics();
      fetchProperties();
    }
  }, [user]);

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
                <img src={property.images?.[0]} alt={property.title} />
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
