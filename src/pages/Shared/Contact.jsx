import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Contact() {
  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: '',
    alternatePhoneNumber: '',
    isEmailVerified: false,
    isPhoneVerified: false,
    preferredContactMethod: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  // Basic validation: Check if required fields are filled
  if (formData.email && formData.phoneNumber && formData.preferredContactMethod) {
    alert('Contact form submitted!\n\n' + JSON.stringify(formData, null, 2));

    // Redirect to login page after successful sign-up
    navigate('/login');
  } else {
    alert('Please fill all required fields.');
  }
};

  return (
    <div className="form-container">
      <h2 className="form-title">Contact Sign Up Form</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email" style={{ fontWeight: 'bold', marginTop: 10 }}>Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="phoneNumber" style={{ fontWeight: 'bold', marginTop: 10 }}>Phone Number</label>
        <input
          type="text"
          id="phoneNumber"
          name="phoneNumber"
          placeholder="Enter your Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />

        <label htmlFor="alternatePhoneNumber" style={{ fontWeight: 'bold', marginTop: 10 }}>Alternate Phone Number</label>
        <input
          type="text"
          id="alternatePhoneNumber"
          name="alternatePhoneNumber"
          placeholder="Enter your Alternate Phone Number"
          value={formData.alternatePhoneNumber}
          onChange={handleChange}
        />

        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              name="isEmailVerified"
              checked={formData.isEmailVerified}
              onChange={handleChange}
            />
            Email Verified
          </label>
          <label>
            <input
              type="checkbox"
              name="isPhoneVerified"
              checked={formData.isPhoneVerified}
              onChange={handleChange}
            />
            Phone Verified
          </label>
        </div>

        <label style={{ fontWeight: 'bold', marginTop: 10, display: 'block' }}>
          Which contact method do you prefer?
        </label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="preferredContactMethod"
              value="EMAIL"
              checked={formData.preferredContactMethod === 'EMAIL'}
              onChange={handleChange}
              required
            />
            Email
          </label>
          <label>
            <input
              type="radio"
              name="preferredContactMethod"
              value="PHONE"
              checked={formData.preferredContactMethod === 'PHONE'}
              onChange={handleChange}
              required
            />
            Phone
          </label>
          <label>
            <input
              type="radio"
              name="preferredContactMethod"
              value="ALTERNATE_PHONE"
              checked={formData.preferredContactMethod === 'ALTERNATE_PHONE'}
              onChange={handleChange}
              required
            />
            Alternate Phone
          </label>
        </div>

        <button type="submit" className="login-button orange">Sign Up</button>
        <button
          type="button"
          className="login-button cancel"
          onClick={() => navigate('/signup/student')}
        >
          Cancel
        </button>
      </form>

      {/* Inline CSS for consistent form style */}
      <style>{`
        .form-container {
          max-width: 600px;
          margin: 60px auto;
          padding: 40px 40px;
          background-color: #f8f8f8;
          border-radius: 16px;
          box-shadow: 0 0 16px rgba(0, 0, 0, 0.12);
          position: relative;
        }
        .form-title {
          font-weight: bold;
          text-align: center;
          margin-bottom: 18px;
          font-size: 22px;
          color: #000;
        }
        input[type="email"],
        input[type="text"] {
          width: 100%;
          padding: 16px 18px;
          margin: 16px 0;
          border-radius: 10px;
          border: 1px solid #ccc;
          background-color: #eaeaea;
          font-size: 17px;
          box-sizing: border-box;
        }
        .login-button {
          width: 100%;
          padding: 18px;
          margin-top: 18px;
          border: none;
          border-radius: 10px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: 0.3s;
        }
        .login-button.orange {
          background-color: #ff6600;
          color: white;
        }
        .login-button:hover {
          opacity: 0.9;
        }
        .checkbox-group {
          display: flex;
          gap: 35px;
          margin: 24px 0;
        }
        .checkbox-group label {
          font-size: 18px;
          color: #333;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .radio-group {
          display: flex;
          justify-content: flex-start;
          gap: 35px;
          margin: 24px 0;
        }
        .radio-group label {
          font-size: 18px;
          color: #333;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        @media (max-width: 700px) {
          .form-container {
            width: 98%;
            padding: 16px;
            max-width: 98vw;
          }
          .form-title {
            font-size: 18px;
          }
          .login-button {
            font-size: 16px;
          }
          input[type="email"],
          input[type="text"] {
            font-size: 15px;
            padding: 12px 10px;
          }
        }
      `}</style>
    </div>
  );
}