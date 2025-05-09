import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, SidebarLayout, PageTransition } from "kaida-ui";
import ProtectedRoute from "@features/user/components/ProtectedRoute";
import RightSidebar from "@components/layout/RightSidebar";
import { UserButton } from "@clerk/clerk-react";
import harmoniaLogo from "@assets/Harmonia_Logo.png";
import { navItems } from "@shared/constants/navItems";

interface Props {
    children: React.ReactNode;
}

const ProtectedLayoutRoute: React.FC<Props> = ({ children }) => {
    const location = useLocation();

    return (
        <ProtectedRoute>
            <SidebarLayout
                navbar={
                    <Navbar
                        logo={
                            <img
                                src={harmoniaLogo}
                                alt="Harmonia Logo"
                                className="w-10 h-10 rounded-full object-contain"
                            />
                        }
                        navItems={navItems}
                        helpHref="/help"
                        userSlot={<UserButton />}
                        activeHref={location.pathname}
                        linkComponent={({ href, children, className }) => (
                            <Link to={href} className={className}>
                                {children}
                            </Link>
                        )}
                    />
                }
                sidebar={
                    <RightSidebar appointmentsToday={5} unreadMessages={3} />
                }>
                <PageTransition>{children}</PageTransition>
            </SidebarLayout>
        </ProtectedRoute>
    );
};

export default ProtectedLayoutRoute;
