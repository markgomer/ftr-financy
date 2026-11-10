import { Navigate, Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { useAuth } from "../lib/auth";

export function AppLayout() {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Navigate to="/" replace />;

    return (
        <>
            <Navbar />
            <main className="mx-auto w-full max-w-7xl px-12 py-12">
                <Outlet />
            </main>
        </>
    );
}
