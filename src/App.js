import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';

import LandlordLogin from "./pages/Landlord/LandlordAuth/LandlordLogin";
import LandlordSignUp from "./pages/Landlord/LandlordAuth/LandlordSignUp";
import LandlordDashboard from "./pages/Landlord/LandlordDashboard";
import MyListings from "./pages/Landlord/MyListings/MyListings";
import AddListing from "./pages/Landlord/AddListings/AddListing";
import AssignAccommodation from "./pages/Landlord/AssignAccommodation/AssignAccommodation";
import ApplicationsRequests from "./pages/Landlord/ApplicationRequests/ApplicationRequests";
import LandlordProfile from "./pages/Landlord/LndlordProfile";


import LandingPage from "./pages/Shared/LandingPage";
import LoginPage from "./pages/Shared/Login";
import RoleSelectPage from "./pages/Shared/RoleSelectPage.jsx";
import StudentSignUpForm from "./pages/Student/StudentSignUpForm";
import Contact from "./pages/Shared/Contact";
import StudentDashboard from "./pages/Student/Dashboard/StudentDashboard.jsx";
import BookingForm from "./pages/Student/BookingForm.jsx";
import LandLordSignup from "./pages/Landlord/LandLordSignup";

// Landlord components
import MyListings from "./pages/Landlord/MyListings/MyListings";
import AddListing from "./pages/Landlord/AddListings/AddListing";
import ApplicationRequests from "./pages/Landlord/ApplicationRequests/ApplicationRequests";
import AssignAccommodation from "./pages/Landlord/AssignAccommodation/AssignAccommodation";



function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Landlord routes */}
          <Route path="/landlord/login" element={<LoginPage />} />
          <Route path="/landlord/signup" element={<RoleSelectPage />} />
          <Route path="/landlord/signup/form" element={<LandLordSignup />} />
          <Route path="/my-listings" element={<MyListings />} />
          <Route path="/add-listing" element={<AddListing />} />
          <Route path="/applications-requests" element={<ApplicationRequests />} />
          <Route path="/assign-accommodation" element={<AssignAccommodation />} />

          {/* Student routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<RoleSelectPage />} />
          <Route path="/signup/student" element={<StudentSignUpForm />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookingform"
            element={
              <ProtectedRoute>
                <BookingForm />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
