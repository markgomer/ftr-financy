import type { ReactNode } from "react";
import logo from "../assets/logo.svg";

type Props = { title: string; subtitle: string; children: ReactNode };

export function AuthLayout({ title, subtitle, children }: Props) {
    return (
        <main className="flex min-h-screen flex-col items-center gap-8 px-4 py-12">
            <img src={logo} alt="Financy" className="h-8" />
            <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8">
                <header className="mb-8 text-center">
                    <h1 className="text-xl font-bold text-gray-800">{title}</h1>
                    <p className="text-gray-600">{subtitle}</p>
                </header>
                {children}
            </div>
        </main>
    );
}
