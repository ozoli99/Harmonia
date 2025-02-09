import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Container from "./components/Container";
import Footer from "./components/Footer";
import { ToastProvider } from "./contexts/ToastContext";
import ToastContainer from "./components/ToastContainer";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Appointments = lazy(() => import("./pages/Appointments"));
const Profile = lazy(() => import("./pages/Profile"));
const AnalyticsDashboard = lazy(() => import("./pages/AnalyticsDashboard"));
const Calendar = lazy(() => import("./pages/Calendar"));
const ProfileEditor = lazy(() => import("./pages/ProfileEditor"));
const AppointmentBookingForm = lazy(() => import("./pages/AppointmentBookingForm"));
const ClientManagement = lazy(() => import("./pages/ClientManagement"));
const PaymentProcessingView = lazy(() => import("./pages/PaymentProcessingView"));
const Messages = lazy(() => import("./pages/Messages"));
const SessionManagement = lazy(() => import("./pages/SessionManagement"));
const ServiceMenu = lazy(() => import("./pages/ServiceMenu"));

const App: React.FC = () => {
    return (
        <ToastProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <Navbar />

                <Container className="py-20">
                    <Suspense fallback={<div className="text-center mt-8">Loading...</div>}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/appointments" element={<Appointments />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/analytics" element={<AnalyticsDashboard />} />
                            <Route path="/calendar" element={<Calendar />} />
                            <Route path="/settings" element={<ProfileEditor />} />
                            <Route path="/book" element={<AppointmentBookingForm />} />
                            <Route path="/clients" element={<ClientManagement />} />
                            <Route path="/payments" element={<PaymentProcessingView />} />
                            <Route path="/messages" element={<Messages />} />
                            <Route path="/sessions" element={<SessionManagement />} />
                            <Route path="/services" element={<ServiceMenu />} />
                        </Routes>
                    </Suspense>
                </Container>

                <Footer />
                <ToastContainer />
            </div>
        </ToastProvider>
    );
};

export default App;