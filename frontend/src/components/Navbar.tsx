import { Link, NavLink } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import logo from "../assets/logo.svg";
import { ME } from "../graphql/user";
import { getInitials } from "../lib/format";

const links = [
    { to: "/", label: "Dashboard", end: true },
    { to: "/transactions", label: "Transações" },
    { to: "/categories", label: "Categorias" },
];

export function Navbar() {
    const { data } = useQuery<{ me: { name: string } }>(ME);

    return (
        <header className="border-b border-gray-200 bg-white">
            <div className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-y-3 px-4 py-4 md:h-[68px] md:flex-nowrap md:px-12 md:py-0">
                <Link to="/">
                    <img src={logo} alt="Financy" className="h-6" />
                </Link>

                <nav className="order-3 flex w-full justify-center gap-5 md:absolute md:left-1/2 md:order-none md:w-auto md:-translate-x-1/2">
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
                    {getInitials(data?.me.name)}
                </Link>
            </div>
        </header>
    );
}
