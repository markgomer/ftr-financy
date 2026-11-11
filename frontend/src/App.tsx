import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { AppLayout } from "./components/AppLayout";
import { useAuth } from "./lib/auth";
import Categories from "./pages/Categories";

export default function App() {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={isAuthenticated ? <AppLayout /> : <Login />}>
                <Route element={<AppLayout />}>
                    <Route path="/categories" element={<Categories />} />
                </Route>
                <Route index element={<Dashboard />} />
            </Route>
        </Routes>
    );
}
