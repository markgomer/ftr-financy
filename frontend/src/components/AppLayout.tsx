import { Navigate, Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { useAuth } from "../lib/auth";

export function AppLayout() {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Navigate to="/" replace />;

    return (
        <>
            <Navbar />
            <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-12 md:py-12">
                <Outlet />
            </main>
        </>
    );
}
