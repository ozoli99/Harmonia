import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Container from "./components/Container";
import Footer from "./components/Footer";
import { ToastProvider } from "./contexts/ToastContext";
import ToastContainer from "./components/ToastContainer";
import ErrorBoundary from "./components/ErrorBoundary";
import PageTransition from "./components/PageTransition";
import SkeletonLoader from "./components/SkeletonLoader";
import ProtectedRoute from "./components/ProtectedRoute";

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
                    <ErrorBoundary>
                        <Suspense fallback={
                            <div className="space-y-4 p-8">
                                <SkeletonLoader height="h-8" width="w-3/4" />
                                <SkeletonLoader height="h-6" width="w-full" />
                                <SkeletonLoader height="h-6" width="w-full" />
                            </div>
                        }>
                            <Routes>
                                <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                                <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
                                
                                <Route path="/dashboard" element={<ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute>} />
                                <Route path="/appointments" element={<ProtectedRoute><PageTransition><Appointments /></PageTransition></ProtectedRoute>} />
                                <Route path="/profile" element={<ProtectedRoute><PageTransition><Profile /></PageTransition></ProtectedRoute>} />
                                <Route path="/analytics" element={<ProtectedRoute><PageTransition><AnalyticsDashboard /></PageTransition></ProtectedRoute>} />
                                <Route path="/calendar" element={<ProtectedRoute><PageTransition><Calendar /></PageTransition></ProtectedRoute>} />
                                <Route path="/settings" element={<ProtectedRoute><PageTransition><ProfileEditor /></PageTransition></ProtectedRoute>} />
                                <Route path="/book" element={<ProtectedRoute><PageTransition><AppointmentBookingForm /></PageTransition></ProtectedRoute>} />
                                <Route path="/clients" element={<ProtectedRoute><PageTransition><ClientManagement /></PageTransition></ProtectedRoute>} />
                                <Route path="/payments" element={<ProtectedRoute><PageTransition><PaymentProcessingView /></PageTransition></ProtectedRoute>} />
                                <Route path="/messages" element={<ProtectedRoute><PageTransition><Messages /></PageTransition></ProtectedRoute>} />
                                <Route path="/sessions" element={<ProtectedRoute><PageTransition><SessionManagement /></PageTransition></ProtectedRoute>} />
                                <Route path="/services" element={<ProtectedRoute><PageTransition><ServiceMenu /></PageTransition></ProtectedRoute>} />
                            </Routes>
                        </Suspense>
                    </ErrorBoundary>
                </Container>

                <Footer />
                <ToastContainer />
            </div>
        </ToastProvider>
    );
};

export default App;