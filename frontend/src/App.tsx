import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Container from "./components/Container";
import { ToastProvider } from "./contexts/ToastContext";
import ToastContainer from "./components/ToastContainer";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Appointments = lazy(() => import("./pages/Appointments"));
const Profile = lazy(() => import("./pages/Profile"));

const App: React.FC = () => {
    return (
        <ToastProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <Navbar />
          
                <Container className="py-8">
                    <Suspense fallback={<div className="text-center mt-8">Loading...</div>}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/appointments" element={<Appointments />} />
                            <Route path="/profile" element={<Profile />} />
                        </Routes>
                    </Suspense>
                </Container>
          
                <ToastContainer />
            </div>
        </ToastProvider>
    );
};

export default App;