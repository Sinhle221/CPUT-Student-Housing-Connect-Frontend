import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RoleSelectPage({ onRoleSelect }) {
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setRole(e.target.value);
    if (onRoleSelect) onRoleSelect(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role === 'student') {
      navigate('/signup/student');
    } else if (role === 'landlord') {
      navigate('/landlord/signup/form');
    } else if (role) {
      alert(`Selected role: ${role} (navigation not implemented yet)`);
    } else {
      alert('Please select a role.');
    }
  };

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
      textAlign: 'center'
    }}>
      <h1 style={{ color: '#003366', fontSize: '2.5rem', marginBottom: '10px' }}>
        Let's start by choosing your Role
      </h1>
      <form onSubmit={handleSubmit} style={{ marginTop: '40px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '40px',
          marginBottom: '30px'
        }}>
          <label style={{ color: '#555', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="radio"
              name="role"
              value="student"
              checked={role === 'student'}
              onChange={handleChange}
            />
            Student
          </label>
          <label style={{ color: '#555', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="radio"
              name="role"
              value="landlord"
              checked={role === 'landlord'}
              onChange={handleChange}
            />
            Landlord
          </label>
          <label style={{ color: '#555', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="radio"
              name="role"
              value="administrator"
              checked={role === 'administrator'}
              onChange={handleChange}
            />
            Administrator
          </label>
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: '#ff6600',
            color: 'white',
            padding: '12px 32px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Continue
        </button>
      </form>
    </div>
  );
}

export default RoleSelectPage;