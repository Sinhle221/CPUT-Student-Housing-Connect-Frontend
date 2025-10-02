import React, { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FaHome, FaList, FaPlusCircle, FaUsers, FaBuilding } from "react-icons/fa";

export default function MyListings() {
  const [accommodations, setAccommodations] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/Accommodation/getAllAccommodations")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch accommodations");
        return res.json();
      })
      .then((data) => setAccommodations(data))
      .catch((err) => console.error(err));
  }, []);

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
              <NavLink to="/my-listings" end className="active-link">
                <FaList /> My Listings
              </NavLink>
            </li>
            <li>
              <NavLink to="/add-listing" end>
                <FaPlusCircle /> Add Listing
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
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <h1>My Listings</h1>
          <Link to="/add-listing">
            <button className="btn-primary">+ Add Listing</button>
          </Link>
        </header>

        <section className="listing-grid">
          {accommodations.length > 0 ? (
            accommodations.map((acc) => (
              <div className="listing-card" key={acc.accommodationID}>
                <h3>{acc.name}</h3>
                <p>
                  {acc.totalRooms || 0} Rooms · {acc.occupiedRooms || 0} Occupied
                </p>
                <div className="progress-bar">
                  <span
                    style={{
                      width: `${
                        acc.totalRooms
                          ? Math.round((acc.occupiedRooms / acc.totalRooms) * 100)
                          : 0
                      }%`,
                    }}
                  ></span>
                </div>
              </div>
            ))
          ) : (
            <p>No listings available</p>
          )}
        </section>
      </main>

      {/* Styles (same as your version) */}
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
          padding: 30px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        h1 {
          font-size: 24px;
        }

        .btn-primary {
          background: #483ab0;
          color: white;
          padding: 10px 18px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: 0.2s;
        }

        .btn-primary:hover {
          background: #372a8a;
        }

        /* Listings */
        .listing-grid {
          display: grid;
          gap: 20px;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        }

        .listing-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }

        .listing-card:hover {
          transform: translateY(-5px);
        }

        .listing-card h3 {
          margin-bottom: 8px;
          color: #222;
        }

        .listing-card p {
          color: #666;
          margin-bottom: 10px;
        }

        /* Progress Bar */
        .progress-bar {
          width: 100%;
          background: #eee;
          border-radius: 8px;
          overflow: hidden;
          height: 10px;
        }

        .progress-bar span {
          display: block;
          height: 100%;
          background: #27ae60;
        }
      `}</style>
    </div>
  );
}
