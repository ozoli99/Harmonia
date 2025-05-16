import React from "react";
import { ToastProvider } from "@shared/contexts/ToastContext";
import { DarkModeProvider } from "@shared/contexts/DarkModeContext";
import { SidebarProvider } from "@shared/contexts/SidebarContext";
import ToastContainer from "@features/notifications/components/ToastContainer";
import ScrollToTop from "@components/layout/ScrollToTop";
import ProtectedLayoutRoute from "@components/layout/ProtectedLayoutRoute";
import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import {
    SkipToContent,
    PageTransition,
    ErrorBoundary,
    LoadingScreen,
} from "kaida-ui";

const Home = lazy(() => import("@pages/Home"));
const Login = lazy(() => import("@pages/Login"));
const Dashboard = lazy(() => import("@features/dashboard/pages/Dashboard"));
const Appointments = lazy(() => import("@pages/Appointments"));
const Profile = lazy(() => import("@pages/Profile"));
const Calendar = lazy(() => import("@pages/Calendar"));
const ClientManagement = lazy(
    () => import("@features/clients/pages/ClientsPage")
);
const PaymentProcessingView = lazy(
    () => import("@pages/PaymentProcessingView")
);
const Messages = lazy(() => import("@pages/Messages"));
const Support = lazy(() => import("@pages/Support"));
const StaffManagement = lazy(() => import("@pages/StaffManagement"));
const Analytics = lazy(() => import("@pages/Analytics"));
const Marketing = lazy(() => import("@features/marketing/pages/Marketing"));
const Customisation = lazy(() => import("@pages/Customisation"));

const App: React.FC = () => {
    return (
        <ToastProvider>
            <DarkModeProvider>
                <SidebarProvider>
                    <div className="min-h-screen bg-background dark:bg-background-dark text-body transition-colors duration-300">
                        <SkipToContent />
                        <ScrollToTop />

                        <ErrorBoundary>
                            <Suspense
                                fallback={
                                    <LoadingScreen message="Loading page..." />
                                }>
                                <Routes>
                                    <Route
                                        path="/"
                                        element={
                                            <PageTransition>
                                                <Home />
                                            </PageTransition>
                                        }
                                    />
                                    <Route
                                        path="/login"
                                        element={
                                            <PageTransition>
                                                <Login />
                                            </PageTransition>
                                        }
                                    />

                                    <Route
                                        path="/dashboard"
                                        element={
                                            <ProtectedLayoutRoute>
                                                <Dashboard />
                                            </ProtectedLayoutRoute>
                                        }
                                    />
                                    <Route
                                        path="/appointments"
                                        element={
                                            <ProtectedLayoutRoute>
                                                <Appointments />
                                            </ProtectedLayoutRoute>
                                        }
                                    />
                                    <Route
                                        path="/profile"
                                        element={
                                            <ProtectedLayoutRoute>
                                                <Profile />
                                            </ProtectedLayoutRoute>
                                        }
                                    />
                                    <Route
                                        path="/calendar"
                                        element={
                                            <ProtectedLayoutRoute>
                                                <Calendar />
                                            </ProtectedLayoutRoute>
                                        }
                                    />
                                    <Route
                                        path="/clients"
                                        element={
                                            <ProtectedLayoutRoute>
                                                <ClientManagement />
                                            </ProtectedLayoutRoute>
                                        }
                                    />
                                    <Route
                                        path="/payments"
                                        element={
                                            <ProtectedLayoutRoute>
                                                <PaymentProcessingView />
                                            </ProtectedLayoutRoute>
                                        }
                                    />
                                    <Route
                                        path="/messages"
                                        element={
                                            <ProtectedLayoutRoute>
                                                <Messages />
                                            </ProtectedLayoutRoute>
                                        }
                                    />
                                    <Route
                                        path="/support"
                                        element={
                                            <ProtectedLayoutRoute>
                                                <Support />
                                            </ProtectedLayoutRoute>
                                        }
                                    />
                                    <Route
                                        path="/staff"
                                        element={
                                            <ProtectedLayoutRoute>
                                                <StaffManagement />
                                            </ProtectedLayoutRoute>
                                        }
                                    />
                                    <Route
                                        path="/analytics"
                                        element={
                                            <ProtectedLayoutRoute>
                                                <Analytics />
                                            </ProtectedLayoutRoute>
                                        }
                                    />
                                    <Route
                                        path="/marketing"
                                        element={
                                            <ProtectedLayoutRoute>
                                                <Marketing />
                                            </ProtectedLayoutRoute>
                                        }
                                    />
                                    <Route
                                        path="/customisation"
                                        element={
                                            <ProtectedLayoutRoute>
                                                <Customisation />
                                            </ProtectedLayoutRoute>
                                        }
                                    />
                                </Routes>
                            </Suspense>
                        </ErrorBoundary>

                        <ToastContainer />
                    </div>
                </SidebarProvider>
            </DarkModeProvider>
        </ToastProvider>
    );
};

export default App;
