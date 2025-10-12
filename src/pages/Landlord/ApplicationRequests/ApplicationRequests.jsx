import React, { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FaHome, FaList, FaPlusCircle, FaUsers, FaBuilding } from "react-icons/fa";
import apiClient from "../../../apiClient";
import { useAuth } from "../../../contexts/AuthContext";

export default function ApplicationRequests() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [landlord, setLandlord] = useState(null);

  // Fetch landlord and applications from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.landlordId) {
          const landlordRes = await apiClient.get(`/landlord/${user.landlordId}`);
          setLandlord(landlordRes.data);
          const appsRes = await apiClient.get(`/applications/landlord/${user.landlordId}`);
          setApplications(appsRes.data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Approve application
  const handleApprove = async (id) => {
    try {
      await apiClient.put(`/applications/${id}/approve`);
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: "APPROVED" } : app
        )
      );
    } catch (err) {
      console.error("Error approving application:", err);
    }
  };

  // Revoke application
  const handleRevoke = async (id) => {
    try {
      await apiClient.put(`/applications/${id}/revoke`);
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: "REVOKED" } : app
        )
      );
    } catch (err) {
      console.error("Error revoking application:", err);
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
            <span className="profile-name">{landlord ? `${landlord.landlordFirstName} ${landlord.landlordLastName}` : 'Loading...'}</span>
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
                           <FaList /> My Accomodationss
                         </NavLink>
                       </li>
                       <li>
                         <NavLink to="/add-accomodation" end>
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
          <h1>Applications</h1>
        </header>

        <div className="applications-card">
          {loading ? (
            <p>Loading applications...</p>
          ) : applications.length === 0 ? (
            <p>No applications found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Accommodation</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td>{app.studentName}</td>
                    <td>{app.accommodationName}</td>
                    <td>
                      <span
                        className={`badge ${
                          app.status.toLowerCase()
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td>
                      {app.status === "PENDING" ? (
                        <button
                          className="btn-primary"
                          onClick={() => handleApprove(app.id)}
                        >
                          Approve
                        </button>
                      ) : (
                        <button
                          className="btn-primary"
                          onClick={() => handleRevoke(app.id)}
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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

        /* Applications Card */
        .applications-card {
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 14px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }

        th {
          background: #f9f9f9;
          font-weight: 600;
        }

        tr:hover td {
          background: #fafafa;
        }

        /* Badges */
        .badge {
          padding: 5px 10px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .badge.pending {
          background: #fff3cd;
          color: #856404;
        }

        .badge.approved {
          background: #d4edda;
          color: #155724;
        }

        .badge.revoked {
          background: #f8d7da;
          color: #721c24;
        }

        /* Buttons */
        .btn-primary {
          background: #483ab0;
          color: white;
          padding: 8px 14px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: 0.2s;
        }

        .btn-primary:hover {
          background: #372a8a;
        }
      `}</style>
    </div>
  );
}
