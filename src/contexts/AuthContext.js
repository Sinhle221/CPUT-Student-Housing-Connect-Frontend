import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check for stored authentication data on app load
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:8080/HouseConnect/UserAuthentication/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login response:', data); // Debug log
        console.log('User role:', data.userRole); // Debug log
        console.log('Student object:', data.student); // Debug log
        
        // Extract student ID if user is a student
        let studentId = null;
        if (data.userRole === 'STUDENT' && data.studentId) {
          studentId = data.studentId;
          console.log('Extracted student ID from login response:', studentId); // Debug log
        } else if (data.userRole === 'STUDENT') {
          console.log('No student ID found in login response for student user'); // Debug log
        } else {
          console.log('No student ID extracted - user is not a student'); // Debug log
        }

        // Store authentication data
        localStorage.setItem('authToken', data.authenticationId);
        localStorage.setItem('user', JSON.stringify({
          id: data.authenticationId,
          username: data.username,
          role: data.userRole,
          studentId: studentId
        }));
        
        setToken(data.authenticationId);
        setUser({
          id: data.authenticationId,
          username: data.username,
          role: data.userRole,
          studentId: studentId
        });
        
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!user && !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
