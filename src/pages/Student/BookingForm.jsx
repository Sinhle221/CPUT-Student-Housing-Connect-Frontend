import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const BookingForm = ({ accommodation }) => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    checkInDate: "",
    checkOutDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [calculatedAmount, setCalculatedAmount] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Calculate total amount when dates change
    if (name === 'checkInDate' || name === 'checkOutDate') {
      const updatedFormData = { ...formData, [name]: value };
      const checkIn = new Date(updatedFormData.checkInDate);
      const checkOut = new Date(updatedFormData.checkOutDate);
      if (updatedFormData.checkInDate && updatedFormData.checkOutDate && checkOut > checkIn) {
        const months = (checkOut.getFullYear() - checkIn.getFullYear()) * 12 + (checkOut.getMonth() - checkIn.getMonth());
        const totalAmount = accommodation.rent * months;
        setCalculatedAmount(totalAmount);
      } else {
        setCalculatedAmount(0);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate dates
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    if (checkOut <= checkIn) {
      setError("Check-out date must be after check-in date.");
      setLoading(false);
      return;
    }

    // Calculate number of months
    const months = (checkOut.getFullYear() - checkIn.getFullYear()) * 12 + (checkOut.getMonth() - checkIn.getMonth());
    const totalAmount = accommodation.rent * months;

    try {
      const payload = {
        student: { studentID: user.studentId },
        accommodation: { accommodationID: accommodation.accommodationID },
        requestDate: new Date().toISOString().split("T")[0],
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        totalAmount: totalAmount,
        paymentStatus: "PENDING",
        bookingStatus: "IN_PROGRESS",
        // Remove createdAt and updatedAt as they should be set by the backend
      };

      const response = await fetch(
        `/HouseConnect/Booking/create`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        setSuccess("Booking created successfully!");
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        const errorText = await response.text();
        setError(errorText || "Failed to create booking.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-form">
      <h2>Book Accommodation</h2>
      {accommodation ? (
        <div className="accommodation-info">
          <h3>{accommodation.address?.streetName}, {accommodation.address?.city}</h3>
          <p><strong>Rent:</strong> R {accommodation.rent}</p>
          <p><strong>Room Type:</strong> {accommodation.roomType}</p>
        </div>
      ) : (
        <p>No accommodation selected</p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Check-in Date</label>
          <input
            type="date"
            name="checkInDate"
            value={formData.checkInDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Check-out Date</label>
          <input
            type="date"
            name="checkOutDate"
            value={formData.checkOutDate}
            onChange={handleChange}
            required
          />
        </div>

        {calculatedAmount > 0 && (
          <div className="total-amount">
            <p><strong>Total Amount:</strong> R {calculatedAmount}</p>
          </div>
        )}

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      </form>

      <style>{`
        .booking-form {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07);
          padding: 36px 32px;
          max-width: 500px;
          margin: 40px auto;
        }
        .booking-form h2 {
          color: #003366;
          margin-bottom: 20px;
          text-align: center;
        }
        .accommodation-info {
          background: #f8f9fa;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .form-group {
          margin-bottom: 16px;
        }
        .form-group label {
          display: block;
          font-weight: 600;
          margin-bottom: 6px;
          color: #003366;
        }
        .form-group input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 6px;
        }
        .submit-btn {
          width: 100%;
          padding: 12px;
          background: #ff6600;
          color: #fff;
          font-size: 1rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }
        .submit-btn:hover {
          background: #e65c00;
        }
        .error {
          color: #dc3545;
          margin: 10px 0;
          text-align: center;
        }
        .success {
          color: #1bbf4c;
          margin: 10px 0;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default BookingForm;
