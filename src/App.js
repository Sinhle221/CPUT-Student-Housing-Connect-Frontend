import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';

import LandlordSignUp from "./pages/Landlord/LandLordSignup.jsx";
import LandlordDashboard from "./pages/Landlord/LandlordDashboard";
import MyAccomodations from "./pages/Landlord/MyAccomodations/MyAccomodations";
import AddAccomodation from "./pages/Landlord/AddAccomodation/AddAccomodation";
import AssignAccommodation from "./pages/Landlord/AssignAccommodation/AssignAccommodation";
import ApplicationsRequests from "./pages/Landlord/ApplicationRequests/ApplicationRequests";
import LandlordProfile from "./pages/Landlord/LandlordProfile.jsx";

import LandingPage from "./pages/Shared/LandingPage";
import LoginPage from "./pages/Shared/Login";
import RoleSelectPage from "./pages/Shared/RoleSelectPage.jsx";
import StudentSignUpForm from "./pages/Student/StudentSignUpForm";
import Contact from "./pages/Shared/Contact";
import StudentDashboard from "./pages/Student/Dashboard/StudentDashboard.jsx";
import BookingForm from "./pages/Student/BookingForm.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
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
          {/* Landlord routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/landlord/signup" element={<LandlordSignUp />} />
          <Route path="/landlord-profile" element={<LandlordProfile />} />
          <Route path="/landlord/dashboard" element={<LandlordDashboard />} />
          <Route path="/my-accomodations" element={<MyAccomodations />} />
          <Route path="/add-accomodation" element={<AddAccomodation />} />
          <Route path="/applications-requests" element={<ApplicationsRequests />} />
          <Route path="/assign-accommodation" element={<AssignAccommodation />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
export default App;

