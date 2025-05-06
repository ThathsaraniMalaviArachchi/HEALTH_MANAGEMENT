import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import DoctorManagement from './components/DoctorManagement';
import AppointmentBooking from './components/AppointmentBooking';
import AppointmentManagement from './components/AppointmentManagement';
import UserManagement from './components/UserManagement';
import MedicationManagement from './components/MedicationManagement';
import { AuthProvider } from './context/AuthContext';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public routes */}
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    
                    {/* Protected routes  */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/doctors" element={<DoctorManagement />} />
                        <Route path="/book-appointment" element={<AppointmentBooking />} />
                        <Route path="/manage-appointments" element={<AppointmentManagement />} />
                        <Route path="/manage-users" element={<UserManagement />} />
                        <Route path="/medications" element={<MedicationManagement />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
