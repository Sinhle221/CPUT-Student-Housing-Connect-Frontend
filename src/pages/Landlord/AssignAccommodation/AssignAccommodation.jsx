import React, { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FaHome, FaList, FaPlusCircle, FaUsers, FaBuilding } from "react-icons/fa";
import axios from "axios";

const API_BASE = "http://localhost:8080"; // adjust if different

export default function AssignAccommodation() {
  const [students, setStudents] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedAccommodation, setSelectedAccommodation] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const [sRes, aRes] = await Promise.all([
          axios.get(`${API_BASE}/students`), // ensure this endpoint exists
          axios.get(`${API_BASE}/Accommodation/getAllAccommodations`)
        ]);

        if (!mounted) return;
        setStudents(Array.isArray(sRes.data) ? sRes.data : []);
        setAccommodations(Array.isArray(aRes.data) ? aRes.data : []);
      } catch (err) {
        console.error("Failed to load students or accommodations", err);
        setError("Failed to load data from server.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, []);

  const handleAssign = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedStudent || !selectedAccommodation) {
      setError("Please select both a student and an accommodation.");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${API_BASE}/assign`, {
        studentId: selectedStudent,
        accommodationId: selectedAccommodation
      });
      alert("Accommodation assigned successfully!");
      setSelectedStudent("");
      setSelectedAccommodation("");
    } catch (err) {
      console.error("Assign failed", err);
      setError("Failed to assign accommodation. See console for details.");
    } finally {
      setSubmitting(false);
    }
  };

  // helpers to cope with differing backend field names
  const studentKey = (s) => s.id ?? s.studentID ?? s.studentId ?? s.studentId;
  const studentLabel = (s) =>
    (s.firstName && s.lastName) ? `${s.firstName} ${s.lastName}` :
    s.name ?? s.studentName ?? s.email ?? `Student ${studentKey(s)}`;

  const accommodationKey = (a) => a.accommodationID ?? a.id ?? a.accommodationId;
  const accommodationLabel = (a) =>
    a.address?.streetName ? `${a.address.streetName}, ${a.address.suburb ?? ""}` :
    a.name ?? a.address?.suburb ?? `Accommodation ${accommodationKey(a)}`;

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
          <h1>Assign Accommodation</h1>
        </header>

        <div className="assign-card">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <form className="assign-form" onSubmit={handleAssign}>
              {error && <p style={{ color: "red" }}>{error}</p>}

              <label>Select Student</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
              >
                <option value="">-- Choose Student --</option>
                {students.map((student) => {
                  const key = studentKey(student);
                  return (
                    <option key={key} value={key}>
                      {studentLabel(student)}
                    </option>
                  );
                })}
              </select>

              <label>Select Accommodation</label>
              <select
                value={selectedAccommodation}
                onChange={(e) => setSelectedAccommodation(e.target.value)}
              >
                <option value="">-- Choose Accommodation --</option>
                {accommodations.map((acc) => {
                  const key = accommodationKey(acc);
                  return (
                    <option key={key} value={key}>
                      {accommodationLabel(acc)}
                    </option>
                  );
                })}
              </select>

              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? "Assigning..." : "Assign"}
              </button>
            </form>
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
  color: inherit; /* Keeps the white text */
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

        /* Assign Form Card */
        .assign-card {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          max-width: 450px;
        }

        .assign-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        label {
          font-weight: 500;
          color: #333;
        }

        select {
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 8px;
          background: #fff;
          font-size: 14px;
          transition: border 0.2s;
        }

        select:focus {
          outline: none;
          border: 1px solid #483ab0;
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
          transition: 0.2s;
        }

        .btn-primary:hover {
          background: #372a8a;
        }
      `}</style>
    </div>
  );
}
