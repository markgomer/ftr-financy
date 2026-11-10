import { Link, NavLink } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import logo from "../assets/logo.svg";
import { ME } from "../graphql/user";

const links = [
    { to: "/", label: "Dashboard", end: true },
    { to: "/transactions", label: "Transações" },
    { to: "/categories", label: "Categorias" },
];

function initials(name = "") {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (parts[0][0] + last).toUpperCase();
}

export function Navbar() {
    const { data } = useQuery<{ me: { name: string } }>(ME);

    return (
        <header className="border-b border-gray-200 bg-white">
            <div className="relative mx-auto flex h-[68px] max-w-7xl items-center justify-between px-12">
                <Link to="/">
                    <img src={logo} alt="Financy" className="h-6" />
                </Link>

                <nav className="absolute left-1/2 flex -translate-x-1/2 gap-5">
                    {links.map((l) => (
                        <NavLink
                            key={l.to}
                            to={l.to}
                            end={l.end}
                            className={({ isActive }) =>
                                `text-sm transition-colors ${isActive
                                    ? "font-semibold text-brand-base"
                                    : "text-gray-600 hover:text-gray-800"
                                }`
                            }
                        >
                            {l.label}
                        </NavLink>
                    ))}
                </nav>

                <Link
                    to="/profile"
                    className="flex size-9 items-center justify-center rounded-full bg-gray-300 text-sm font-medium text-gray-800"
                >
                    {initials(data?.me.name)}
                </Link>
            </div>
        </header>
    );
}
