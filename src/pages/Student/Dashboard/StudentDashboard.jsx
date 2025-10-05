import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function StudentDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [activeSection, setActiveSection] = useState('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);

  // Initialize with empty/default values
  const [profileData, setProfileData] = useState({
    studentID: '',
    studentName: '',
    studentSurname: '',
    dateOfBirth: '',
    gender: '',
    fundingStatus: ''
  });

  const [contactData, setContactData] = useState({
    email: '',
    phoneNumber: '',
    alternatePhoneNumber: '',
    preferredContactMethod: 'EMAIL'
  });

  // Fetch student data on component mount
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        console.log('User object in StudentDashboard:', user); // Debug log
        
        // Use studentId from auth context instead of authentication ID
        const studentId = user.studentId;
        if (!studentId) {
          console.log('No studentId found in user object'); // Debug log
          setError('Student ID not found. Please log in again.');
          setLoading(false);
          return;
        }

        console.log('Fetching student data for ID:', studentId); // Debug log
        
        const response = await fetch(`http://localhost:8080/HouseConnect/Student/read/${studentId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Student API response status:', response.status); // Debug log

        if (response.ok) {
          const data = await response.json();
          console.log('Student data received:', data); // Debug log
          setStudentData(data);
          
          // Initialize profile data with fetched data
          setProfileData({
            studentID: data.studentID || '',
            studentName: data.studentName || '',
            studentSurname: data.studentSurname || '',
            dateOfBirth: data.dateOfBirth || '',
            gender: data.gender || '',
            fundingStatus: data.fundingStatus || ''
          });

          // Initialize contact data with fetched data
          if (data.contact) {
            setContactData({
              email: data.contact.email || '',
              phoneNumber: data.contact.phoneNumber || '',
              alternatePhoneNumber: data.contact.alternatePhoneNumber || '',
              preferredContactMethod: data.contact.preferredContactMethod || 'EMAIL'
            });
          }
        } else {
          const errorText = await response.text();
          console.error('Failed to fetch student data. Response:', errorText);
          setError('Failed to fetch student data. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
        setError('Network error. Please try again. Check if backend server is running.');
      } finally {
        setLoading(false);
      }
    };

    if (user && token && user.studentId) {
      fetchStudentData();
    } else if (user && token) {
      setError('Student information not available. Please log in again.');
      setLoading(false);
    }
  }, [user, token]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const fundingClass = (status) => {
    if (!status) return "";
    return status.toLowerCase().replace('_', '-');
  };

  // Handle profile field changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  // Handle contact field changes
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactData({ ...contactData, [name]: value });
  };

  // Update profile in database
  const handleProfileSave = async () => {
    try {
      const studentId = user.studentId;
      if (!studentId) {
        setError('Student ID not found. Please log in again.');
        return;
      }

      // Include contact data in the profile update to avoid losing it
      const payload = {
        ...profileData,
        studentID: studentId,
        registrationDate: studentData.registrationDate, // Include registrationDate to avoid null
        contact: {
          ...studentData.contact,
          ...contactData
        }
      };

      const response = await fetch(`http://localhost:8080/HouseConnect/Student/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const updatedData = await response.json();
        setStudentData(updatedData);
        setIsEditingProfile(false);
        alert('Profile updated successfully!');
      } else {
        const errorText = await response.text();
        console.error('Failed to update profile. Response:', errorText);
        setError('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Network error. Please try again.');
    }
  };

  // Update contact in database
  const handleContactSave = async () => {
    try {
      const studentId = user.studentId;
      if (!studentId) {
        setError('Student ID not found. Please log in again.');
        return;
      }

      // Instead of separate contact update, update student with new contact info
      const payload = {
        ...profileData,
        studentID: studentId,
        registrationDate: studentData.registrationDate, // Include registrationDate to avoid null
        contact: {
          ...studentData.contact,
          ...contactData
        }
      };

      const response = await fetch(`http://localhost:8080/HouseConnect/Student/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const updatedData = await response.json();
        setStudentData(updatedData);
        setIsEditingContact(false);
        alert('Contact information updated successfully!');
      } else {
        const errorText = await response.text();
        console.error('Failed to update contact. Response:', errorText);
        setError('Failed to update contact information. Please try again.');
      }
    } catch (error) {
      console.error('Error updating contact:', error);
      setError('Network error. Please try again.');
    }
  };

  const handleProfileCancel = () => {
    if (studentData) {
      setProfileData({
        studentID: studentData.studentID || '',
        studentName: studentData.studentName || '',
        studentSurname: studentData.studentSurname || '',
        dateOfBirth: studentData.dateOfBirth || '',
        gender: studentData.gender || '',
        fundingStatus: studentData.fundingStatus || ''
      });
    }
    setIsEditingProfile(false);
  };

  const handleContactCancel = () => {
    if (studentData && studentData.contact) {
      setContactData({
        email: studentData.contact.email || '',
        phoneNumber: studentData.contact.phoneNumber || '',
        alternatePhoneNumber: studentData.contact.alternatePhoneNumber || '',
        preferredContactMethod: studentData.contact.preferredContactMethod || 'EMAIL'
      });
    }
    setIsEditingContact(false);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard-page">
      <aside className="sidebar">
        <div className="sidebar-title">Student Dashboard</div>
        <nav>
          <ul>
            <li
              className={activeSection === 'profile' ? 'active' : ''}
              onClick={() => setActiveSection('profile')}
            >
              Profile
            </li>
            <li
              className={activeSection === 'contact' ? 'active' : ''}
              onClick={() => setActiveSection('contact')}
            >
              Contact Info
            </li>
            <li
              className={activeSection === 'bookings' ? 'active' : ''}
              onClick={() => setActiveSection('bookings')}
            >
              My Bookings
            </li>
            <li
              className="logout-item"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              Logout
            </li>
          </ul>
        </nav>
      </aside>
      <main className="dashboard-content">
        {activeSection === 'profile' && (
          <section className="profile">
            <div className="profile-banner"></div>
            <div className="profile-header-modern">
              <div className="avatar-large">
                {profileData.studentName.charAt(0)}
                {profileData.studentSurname.charAt(0)}
                <span className="avatar-edit" title="Edit Photo">📷</span>
              </div>
              <div className="profile-main-info">
                {isEditingProfile ? (
                  <>
                    <input
                      type="text"
                      name="studentName"
                      value={profileData.studentName}
                      onChange={handleProfileChange}
                      className="edit-input"
                    />
                    <input
                      type="text"
                      name="studentSurname"
                      value={profileData.studentSurname}
                      onChange={handleProfileChange}
                      className="edit-input"
                    />
                  </>
                ) : (
                  <h2>{profileData.studentName} {profileData.studentSurname}</h2>
                )}
                <p className="student-id">
                  Student #:{" "}
                  <span>{profileData.studentID}</span>
                </p>
                <div className="profile-chips">
                  <span className={studentData?.isStudentVerified ? "chip verified" : "chip not-verified"}>
                    {studentData?.isStudentVerified ? "Verified" : "Not Verified"}
                  </span>
                  {isEditingProfile ? (
                    <select
                      name="fundingStatus"
                      value={profileData.fundingStatus}
                      onChange={handleProfileChange}
                      className="edit-input small"
                    >
                      <option value="FUNDED">FUNDED</option>
                      <option value="SELF_FUNDED">SELF FUNDED</option>
                      <option value="NOT_FUNDED">NOT FUNDED</option>
                    </select>
                  ) : (
                    <span className={`chip funding ${fundingClass(profileData.fundingStatus)}`}>
                      {profileData.fundingStatus.replace('_', ' ')}
                    </span>
                  )}
                </div>
              </div>
              {!isEditingProfile ? (
                <button className="edit-btn-modern" onClick={() => setIsEditingProfile(true)}>Edit Profile</button>
              ) : (
                <div className="edit-actions">
                  <button className="save-btn" onClick={handleProfileSave}>Save</button>
                  <button className="cancel-btn" onClick={handleProfileCancel}>Cancel</button>
                </div>
              )}
            </div>
            <div className="profile-details-modern">
              <div>
                <strong>Date of Birth:</strong>{" "}
                {isEditingProfile ? (
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={profileData.dateOfBirth}
                    onChange={handleProfileChange}
                    className="edit-input"
                  />
                ) : (
                  formatDate(profileData.dateOfBirth)
                )}
              </div>
              <div>
                <strong>Gender:</strong>{" "}
                {isEditingProfile ? (
                  <select
                    name="gender"
                    value={profileData.gender}
                    onChange={handleProfileChange}
                    className="edit-input"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  profileData.gender
                )}
              </div>
              <div>
                <strong>Registered:</strong> {studentData?.registrationDate ? formatDate(studentData.registrationDate) : ''}
              </div>
            </div>
          </section>
        )}

        {activeSection === 'contact' && (
          <section className={`contact ${isEditingContact ? 'contact-edit-mode' : ''}`}>
            <div className="contact-banner"></div>
            <h2>Contact Information</h2>

            {isEditingContact ? (
              <>
                <div className="contact-field">
                  <label><strong>Email:</strong></label>
                  <input
                    type="email"
                    name="email"
                    value={contactData.email}
                    onChange={handleContactChange}
                    className="edit-input"
                  />
                </div>
                <div className="contact-field">
                  <label><strong>Phone:</strong></label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={contactData.phoneNumber}
                    onChange={handleContactChange}
                    className="edit-input"
                  />
                </div>
                <div className="contact-field">
                  <label><strong>Alternate:</strong></label>
                  <input
                    type="text"
                    name="alternatePhoneNumber"
                    value={contactData.alternatePhoneNumber}
                    onChange={handleContactChange}
                    className="edit-input"
                  />
                </div>
                        <div className="contact-field">
                          <label><strong>Preferred:</strong></label>
                          <select
                            name="preferredContactMethod"
                            value={contactData.preferredContactMethod}
                            onChange={handleContactChange}
                            className="edit-input"
                          >
                            <option value="EMAIL">EMAIL</option>
                            <option value="PHONE">PHONE</option>
                            <option value="ALTERNATE_PHONE">ALTERNATE_PHONE</option>
                          </select>
                        </div>

                <div className="edit-actions">
                  <button className="save-btn" onClick={handleContactSave}>Save</button>
                  <button className="cancel-btn" onClick={handleContactCancel}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <p><strong>Email:</strong> {contactData.email}</p>
                <p><strong>Phone:</strong> {contactData.phoneNumber}</p>
                <p><strong>Alternate:</strong> {contactData.alternatePhoneNumber}</p>
                <p><strong>Preferred:</strong> {contactData.preferredContactMethod}</p>

                <button
                  className="edit-btn-modern"
                  onClick={() => setIsEditingContact(true)}
                >
                  Edit Contact
                </button>
              </>
            )}
          </section>
        )}

        {activeSection === 'bookings' && (
  <section className="bookings">
    <h2>My Bookings</h2>
    {studentData?.bookings && studentData.bookings.length > 0 ? (
      studentData.bookings.map((booking) => (
        <div key={booking.bookingID} className="booking-card">
          <h3>
            {booking.accommodation?.address?.streetNumber}{" "}
            {booking.accommodation?.address?.streetName},{" "}
            {booking.accommodation?.address?.city}
          </h3>
          <p>
            <strong>Check-in:</strong>{" "}
            {new Date(booking.checkInDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Check-out:</strong>{" "}
            {new Date(booking.checkOutDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Total Rent:</strong> R {booking.totalAmount.toFixed(2)}
          </p>
          <div className="booking-chips">
            <span
              className={`chip payment ${booking.paymentStatus.toLowerCase()}`}
            >
              {booking.paymentStatus}
            </span>
            <span
              className={`chip status ${booking.bookingStatus.toLowerCase()}`}
            >
              {booking.bookingStatus.replace("_", " ")}
            </span>
          </div>
          <p className="landlord-info">
            <strong>Landlord:</strong>{" "}
            {booking.accommodation?.landlord?.landlordFirstName}{" "}
            {booking.accommodation?.landlord?.landlordLastName}
          </p>
        </div>
      ))
    ) : (
      <div className="empty-bookings">
        <p>You don’t have any bookings yet.</p>
        <button
          className="browse-btn"
          onClick={() => navigate("/bookingform")}
        >
          Create Booking
        </button>
        <button
          className="browse-btn"
          onClick={() => navigate("/accommodations")}
        >
          Browse Accommodations
        </button>
      </div>
    )}
  </section>
)}

      </main>
      <style>{`
        .dashboard-page {
          display: flex;
          min-height: 100vh;
          background: #f4f7fa;
        }
        .sidebar {
          width: 220px;
          background: #003366;
          color: #fff;
          padding: 0;
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }
        .sidebar-title {
          font-size: 1.4rem;
          font-weight: bold;
          padding: 32px 0 24px 0;
          text-align: center;
          border-bottom: 1px solid #224477;
          letter-spacing: 1px;
        }
        .sidebar nav ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .sidebar nav ul li {
          padding: 18px 32px;
          cursor: pointer;
          font-size: 1.08rem;
          border-left: 4px solid transparent;
          transition: background 0.2s, border-color 0.2s;
        }
        .sidebar nav ul li.active,
        .sidebar nav ul li:hover {
          background: #224477;
          border-left: 4px solid #ff6600;
        }
        .dashboard-content {
          flex: 1;
          padding: 48px 40px;
          background: #f4f7fa;
          min-height: 100vh;
        }
        /* Modern Profile Section */
        .profile-banner {
          height: 80px;
          background: linear-gradient(90deg, #003366 60%, #ff6600 100%);
          border-radius: 12px 12px 0 0;
          margin-bottom: -40px;
        }
        .profile-header-modern {
          display: flex;
          align-items: flex-end;
          gap: 32px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07);
          padding: 40px 48px 24px 48px;
          position: relative;
          z-index: 1;
        }
        .avatar-large {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: #003366;
          color: #fff;
          font-size: 4.2rem;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          margin-top: -60px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.10);
        }
        .avatar-edit {
          position: absolute;
          bottom: 6px;
          right: 6px;
          width: 32px;
          height: 32px;
          background: #fff;
          border-radius: 50%;
          border: 1px solid #eee;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
        }

        .profile-main-info {
          flex: 1;
        }
        .profile-main-info h2 {
          margin: 0 0 12px 0;
          font-size: 2.2rem;
          font-weight: 700;
          color: #003366;
        }
        .student-id {
          font-size: 1.1rem;
          color: #555;
          margin-bottom: 12px;
        }
        .student-id span {
          color: #ff6600;
          font-weight: bold;
        }
        .profile-chips {
          display: flex;
          gap: 16px;
          margin-bottom: 8px;
        }
        .chip {
          display: inline-block;
          padding: 4px 14px;
          border-radius: 16px;
          font-size: 0.98em;
          font-weight: 600;
          background: #eee;
        }
        .chip.verified {
          background: #e6f9ed;
          color: #1bbf4c;
        }
        .chip.not-verified {
          background: #fff3e6;
          color: #ff6600;
        }
        .chip.funding.funded {
          background: #e6f9ed;
          color: #1bbf4c;
        }
        .chip.funding.self-funded {
          background: #e6e9f9;
          color: #003366;
        }
        .chip.funding.not-funded {
          background: #fff3e6;
          color: #ff6600;
        }
        .edit-btn-modern {
          background: #ff6600;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 8px 18px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s;
          margin-left: 16px;
          margin-bottom: 8px;
        }
        .edit-btn-modern:hover {
          background: #e65c00;
        }
        .save-btn {
          background: #ff6600;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 8px 18px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s;
          margin-left: 16px;
          margin-bottom: 8px;
        }
        .save-btn:hover {
          background: #e65c00;
        }
        .cancel-btn {
          background: #dc3545;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 8px 18px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s;
          margin-left: 16px;
          margin-bottom: 8px;
        }
        .cancel-btn:hover {
          background: #c82333;
        }
        .profile-details-modern {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 40px 60px;
          background: #fff;
          border-radius: 0 0 12px 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.03);
          padding: 48px 56px;
          margin-top: -8px;
          font-size: 1.15rem;
        }

        .profile-details-modern div {
          margin-bottom: 18px;
        }

        /* Contact & Bookings Section */
        
        .contact-banner {
          height: 80px;
          background: linear-gradient(90deg, #003366 60%, #ff6600 100%);
          border-radius: 12px 12px 0 0;
          margin: -48px -40px 40px -40px;
        }

        /* Contact card styling like profile */
        .contact, .contact.contact-edit-mode {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07);
          padding: 48px 40px 36px 40px;
          max-width: 750px;
          margin: 0 auto 40px auto;
          position: relative;
        }

        .contact .edit-actions {
          margin-top: 24px;
          display: flex;
          gap: 12px;
        }

        .contact.contact-edit-mode {
          padding: 48px 40px;
          max-width: 750px;
        }

        .contact-field {
          margin-bottom: 18px;
        }

        .edit-input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 1.05rem;
          margin-top: 8px;
          box-sizing: border-box;
        }

        .contact, .bookings {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07);
          padding: 36px 32px;
          max-width: 600px;
          margin: 0 auto;
        }
        .profile h2, .contact h2, .bookings h2 {
          color: #003366;
          margin-bottom: 24px;
        }
        .profile p, .contact p, .bookings p {
          font-size: 1.08rem;
          margin-bottom: 14px;
        }
        .verified {
          color: #1bbf4c;
          font-weight: bold;
        }
        .not-verified {
          color: #ff6600;
          font-weight: bold;
        }
        .booking-card {
          background: #f8f8f8;
          border-radius: 8px;
          padding: 18px 16px;
          margin-bottom: 18px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        @media (max-width: 900px) {
          .dashboard-content {
            padding: 24px 8px;
          }
          .profile-header-modern, .profile-details-modern, .contact, .bookings {
            padding: 16px 8px;
          }
          .sidebar {
            width: 140px;
          }
        }
        @media (max-width: 600px) {
          .dashboard-page {
            flex-direction: column;
          }
          .sidebar {
            width: 100%;
            flex-direction: row;
            justify-content: space-around;
            padding: 0;
            border-bottom: 2px solid #224477;
          }
          .sidebar-title {
            display: none;
          }
          .sidebar nav ul {
            display: flex;
            flex-direction: row;
            width: 100%;
          }
          .sidebar nav ul li {
            flex: 1;
            padding: 14px 0;
            text-align: center;
            border-left: none;
            border-bottom: 4px solid transparent;
          }
          .sidebar nav ul li.active,
          .sidebar nav ul li:hover {
            background: #224477;
            border-left: none;
            border-bottom: 4px solid #ff6600;
          }
          .profile-details-modern {
            grid-template-columns: 1fr;
            padding: 12px 4px;
            gap: 12px;
          }
          .profile-header-modern {
            flex-direction: column;
            align-items: center;
            gap: 12px;
            text-align: center;
          }
        }
        .loading, .error {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          font-size: 1.2rem;
        }
        .error {
          color: #dc3545;
        }


        .booking-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
  transition: transform 0.2s;
}
.booking-card:hover {
  transform: translateY(-2px);
}
.booking-card h3 {
  color: #003366;
  margin-bottom: 10px;
}
.booking-chips {
  display: flex;
  gap: 12px;
  margin: 12px 0;
}
.chip.payment.pending { background: #fff3e6; color: #ff6600; }
.chip.payment.paid { background: #e6f9ed; color: #1bbf4c; }
.chip.payment.partially_paid { background: #fff9e6; color: #d4a017; }
.chip.payment.overdue { background: #ffe6e6; color: #dc3545; }
.chip.status.confirmed { background: #e6f9ed; color: #1bbf4c; }
.chip.status.in_progress { background: #e6e9f9; color: #003366; }
.chip.status.failed { background: #ffe6e6; color: #dc3545; }
.landlord-info {
  font-size: 0.95rem;
  color: #555;
  margin-top: 6px;
}
.empty-bookings {
  text-align: center;
  padding: 40px 20px;
  background: #f8f8f8;
  border-radius: 12px;
}
.browse-btn {
  margin-top: 16px;
  background: #ff6600;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
}
.browse-btn:hover {
  background: #e65c00;
}
      `}</style>
    </div>
  );
}

export default StudentDashboard;
