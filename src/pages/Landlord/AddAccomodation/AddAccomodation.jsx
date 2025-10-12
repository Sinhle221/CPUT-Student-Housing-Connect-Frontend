import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FaHome, FaList, FaPlusCircle, FaUsers, FaBuilding } from "react-icons/fa";
import apiClient from "../../../apiClient";

export default function AddAccomodations() {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    accommodationName: "",
    numberOfRooms: "",
    description: "",
    rent: "",
    wifiAvailable: false,
    furnished: false,
    distanceFromCampus: "",
    utilitiesIncluded: false,
    roomType: "SINGLE",
    bathroomType: "SHARED",
    accommodationStatus: "AVAILABLE",
    streetNumber: "",
    streetName: "",
    suburb: "",
    city: "",
    postalCode: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Build request body according to backend model
    const newListing = {
      accommodationName: formData.accommodationName,
      numberOfRooms: parseInt(formData.numberOfRooms),
      rent: parseFloat(formData.rent),
      wifiAvailable: formData.wifiAvailable,
      furnished: formData.furnished,
      distanceFromCampus: parseFloat(formData.distanceFromCampus),
      utilitiesIncluded: formData.utilitiesIncluded,
      roomType: formData.roomType,
      bathroomType: formData.bathroomType,
      accommodationStatus: formData.accommodationStatus,
      address: {
        streetNumber: formData.streetNumber,
        streetName: formData.streetName,
        suburb: formData.suburb,
        city: formData.city,
        postalCode: parseInt(formData.postalCode),
      },
      description: formData.description,
    };

    try {
      const res = await apiClient.post("/Accommodation/create", newListing);
      console.log("Created:", res.data);

      alert("Listing created successfully!");
      navigate("/my-listings"); // Redirect after success
    } catch (err) {
      console.error("Error creating listing:", err);
      alert("Failed to create listing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-profile">
          <Link to="/landlord-profile" className="profile-link">
            <p className="profile-role">Landlord</p>
            <img src="/profile-pic.jpg" alt="Profile" className="profile-img" />
            <span className="profile-name">John Doe</span>
          </Link>
        </div>

        <nav>
          <ul>
            <li>
              <NavLink to="/landlord/dashboard" end>
                <FaHome /> Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/my-accomodations" end>
                <FaList /> My Accomodations
              </NavLink>
            </li>
            <li>
              <NavLink to="/add-accomodation" end className="active-link">
                <FaPlusCircle /> Add Accomodation
              </NavLink>
            </li>
            <li>
              <NavLink to="/applications-requests" end>
                <FaUsers /> Applications
              </NavLink>
            </li>
            <li>
              <NavLink to="/assign-accommodation" end>
                <FaBuilding /> Assign Accommodation
              </NavLink>
            </li>
            <li>
              <NavLink to="/" >
                <FaBuilding /> Logout
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <h1>Create New Listing</h1>
        </header>

        <div className="form-card">
          <form className="listing-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="accommodationName"
              placeholder="Accommodation Name"
              value={formData.accommodationName}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="numberOfRooms"
              placeholder="Number of Rooms"
              value={formData.numberOfRooms}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="rent"
              placeholder="Rent Amount"
              value={formData.rent}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="distanceFromCampus"
              placeholder="Distance from Campus (km)"
              value={formData.distanceFromCampus}
              onChange={handleChange}
              required
            />
            <select name="roomType" value={formData.roomType} onChange={handleChange} required>
              <option value="SINGLE">Single</option>
              <option value="DOUBLE">Double</option>
              <option value="SHARED">Shared</option>
            </select>
            <select name="bathroomType" value={formData.bathroomType} onChange={handleChange} required>
              <option value="PRIVATE">Private</option>
              <option value="SHARED">Shared</option>
            </select>
            <select name="accommodationStatus" value={formData.accommodationStatus} onChange={handleChange} required>
              <option value="AVAILABLE">Available</option>
              <option value="OCCUPIED">Occupied</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
            <label>
              <input
                type="checkbox"
                name="wifiAvailable"
                checked={formData.wifiAvailable}
                onChange={handleChange}
              />
              WiFi Available
            </label>
            <label>
              <input
                type="checkbox"
                name="furnished"
                checked={formData.furnished}
                onChange={handleChange}
              />
              Furnished
            </label>
            <label>
              <input
                type="checkbox"
                name="utilitiesIncluded"
                checked={formData.utilitiesIncluded}
                onChange={handleChange}
              />
              Utilities Included
            </label>
            <input
              type="text"
              name="streetNumber"
              placeholder="Street Number"
              value={formData.streetNumber}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="streetName"
              placeholder="Street Name"
              value={formData.streetName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="suburb"
              placeholder="Suburb"
              value={formData.suburb}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="postalCode"
              placeholder="Postal Code"
              value={formData.postalCode}
              onChange={handleChange}
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save Listing"}
            </button>
          </form>
        </div>
      </main>

      {/* Styles */}
      <style>{`
        .dashboard-layout {
          display: flex;
          min-height: 100vh;
          font-family: "Segoe UI", sans-serif;
          background: #f5f7fb;
        }

        /* Sidebar */
        .sidebar {
          width: 260px;
          background: linear-gradient(180deg, #003366, #0055aa);
          color: white;
          padding: 25px;
          flex-shrink: 0;
        }

        .sidebar-profile {
          text-align: center;
          margin-bottom: 40px;
        }

        .profile-img {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          margin-bottom: 10px;
        }

        .profile-name {
          font-size: 18px;
          color: #1485f7ff;
          font-weight: bold;
        }

        .profile-role {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #1485f7ff;
        }
        .profile-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }

        .sidebar nav ul {
          list-style: none;
          padding: 0;
        }

        .sidebar nav li {
          margin: 20px 0;
        }

        .sidebar nav a {
          color: #ddd;
          text-decoration: none;
          font-size: 15px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border-radius: 8px;
          transition: background 0.3s;
        }

        .sidebar nav a:hover,
        .active-link {
          background: #483ab0;
          color: #fff !important;
        }

        /* Main Content */
        .main-content {
          flex: 1;
          padding: 40px;
        }

        .header h1 {
          font-size: 26px;
          margin-bottom: 25px;
        }

        /* Form Card */
        .form-card {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          max-width: 500px;
        }

        .listing-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        input,
        textarea,
        select {
          padding: 12px 14px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 15px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        input:focus,
        textarea:focus,
        select:focus {
          outline: none;
          border-color: #483ab0;
          box-shadow: 0 0 0 2px rgba(72,58,176,0.2);
        }

        label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
        }

        textarea {
          resize: none;
          height: 100px;
        }

        .btn-primary {
          background: #483ab0;
          color: white;
          padding: 12px 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 500;
          transition: background 0.2s;
        }

        .btn-primary:hover {
          background: #372a8a;
        }
      `}</style>
    </div>
  );
}
