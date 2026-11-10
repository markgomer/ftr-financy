import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import { useAuth } from "./lib/auth";

function Home() {
  const { isAuthenticated, signOut } = useAuth();
  if (!isAuthenticated) return <Login />;
  return <button onClick={signOut}>Dashboard (provisório), sair</button>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}
