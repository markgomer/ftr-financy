import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { AppLayout } from "./components/AppLayout";
import { useAuth } from "./lib/auth";

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={isAuthenticated ? <AppLayout /> : <Login />}>
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
