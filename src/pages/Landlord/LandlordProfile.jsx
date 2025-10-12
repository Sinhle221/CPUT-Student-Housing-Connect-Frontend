import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHome,
  FaList,
  FaUser,
  FaUsers,
   FaCheckCircle,
    FaTimesCircle,
  FaBuilding, } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import apiClient from "../../apiClient";

export default function LandlordProfilePage() {
  const { user } = useAuth();
  const [landlord, setLandlord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.landlordId) {
      apiClient.get(`/landlord/${user.landlordId}`)
        .then(res => setLandlord(res.data))
        .catch(err => console.error('Error fetching landlord:', err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  return (
    <div className="landlord-profile-page">
      {/* Sidebar can be reused from Dashboard if needed */}
      <aside className="sidebar">
      <div className="sidebar-profile">
        <Link to="/landlord-profile" className="profile-link">
          <p className="profile-role">Landlord</p>
          <img src="/profile-pic.jpg" alt="Profile" className="profile-img" />
          <span className="profile-name">{landlord ? `${landlord.landlordFirstName} ${landlord.landlordLastName}` : 'Loading...'}</span>
        </Link>
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/landlord/dashboard">
              <FaHome style={{ marginRight: "8px" }} /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/my-accomodations">
              <FaList style={{ marginRight: "8px" }} /> My Accomodations
            </Link>
          </li>
          <li>
            <Link to="/applications-requests">
              <FaUsers style={{ marginRight: "8px" }} /> Applications
            </Link>
          </li>
          <li>
            <Link to="/assign-accommodation">
              <FaBuilding style={{ marginRight: "8px" }} /> Assign Accommodation
            </Link>
          </li>
          <li>
            <Link to="/add-accomodation">
              <FaBuilding style={{ marginRight: "8px" }} /> Add Accomodation
            </Link>
          </li>
          <li>
            <Link to="/">
              <FaUser style={{ marginRight: "8px" }} /> Logout
            </Link>
          </li>
        </ul>
      </nav>
    </aside>

      {/* Main content */}
      <main className="main-content">
        <header className="header">
          <h1>My Profile</h1>
        </header>

        <section className="profile-details">
          {loading ? (
            <p>Loading profile...</p>
          ) : landlord ? (
            <div className="profile-card">
              <img
                src={landlord.profilePicture || "/profile-pic.jpg"}
                alt="Profile"
                className="profile-img-large"
              />
              <h2>
                {landlord.landlordFirstName} {landlord.landlordLastName}{" "}
                {landlord.isVerified ? (
                  <FaCheckCircle className="verified-icon" />
                ) : (
                  <FaTimesCircle className="unverified-icon" />
                )}
              </h2>
              <p>
                <strong>Landlord ID:</strong> {landlord.landlordID}
              </p>
              <p>
                <strong>Date Registered:</strong> {landlord.dateRegistered}
              </p>
              {landlord.contact && (
                <>
                  <p>
                    <strong>Email:</strong> {landlord.contact.email}
                  </p>
                  <p>
                    <strong>Phone Number:</strong> {landlord.contact.phoneNumber}
                  </p>
                  {landlord.contact.alternatePhoneNumber && (
                    <p>
                      <strong>Alternate Phone Number:</strong> {landlord.contact.alternatePhoneNumber}
                    </p>
                  )}
                  <p>
                    <strong>Email Verified:</strong> {landlord.contact.isEmailVerified ? 'Yes' : 'No'}
                  </p>
                  <p>
                    <strong>Phone Verified:</strong> {landlord.contact.isPhoneVerified ? 'Yes' : 'No'}
                  </p>
                  <p>
                    <strong>Preferred Contact Method:</strong> {landlord.contact.preferredContactMethod}
                  </p>
                </>
              )}
              <Link to="/edit-profile">
                <button className="btn-primary">Edit Profile</button>
              </Link>
            </div>
          ) : (
            <p>Failed to load profile.</p>
          )}
        </section>
      </main>

      {/* Styles */}
      <style>{`
        .landlord-profile-page {
          display: flex;
          min-height: 100vh;
          font-family: "Segoe UI", sans-serif;
          background: #f5f7fb;
        }

        .sidebar {
          width: 260px;
          background: linear-gradient(180deg, #003366, #0055aa);
          color: white;
          padding: 25px;
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
          font-weight: bold;
        }

        .profile-role {
  font-size: 20px; /* make it big */
  font-weight: bold;
  margin-bottom: 10px;
  color: #1485f7ff; /* adjust to match your theme */
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
          display: block;
          padding: 10px;
          border-radius: 8px;
          transition: background 0.3s;
        }

        .sidebar nav a:hover {
          background: #483ab0;
          color: #fff;
        }

        .main-content {
          flex: 1;
          padding: 30px;
        }

        .header h1 {
          margin-bottom: 30px;
        }

        .profile-details {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .profile-card {
          background: white;
          border-radius: 15px;
          padding: 30px;
          text-align: center;
          width: 400px;
          box-shadow: 0 3px 8px rgba(0,0,0,0.1);
        }

        .profile-img-large {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          margin-bottom: 15px;
        }

        .verified-icon {
          color: #27ae60;
          margin-left: 8px;
        }

        .unverified-icon {
          color: #e74c3c;
          margin-left: 8px;
        }

        .btn-primary {
          background: #483ab0;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
}