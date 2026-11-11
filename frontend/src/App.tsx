import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { AppLayout } from "./components/AppLayout";
import { useAuth } from "./lib/auth";
import Categories from "./pages/Categories";
import Transactions from "./pages/Transactions";
import Profile from "./pages/Profile";

export default function App() {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route path="/signup" element={<Signup />} />

            <Route path="/" element={isAuthenticated ? <AppLayout /> : <Login />}>
                <Route index element={<Dashboard />} />
            </Route>

            <Route element={<AppLayout />}>
                <Route path="/categories" element={<Categories />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/profile" element={<Profile />} />
            </Route>
        </Routes>
    );
}
