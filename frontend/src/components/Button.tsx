import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary";
    size?: "md" | "sm";
    icon?: ReactNode;
};

const variants = {
    primary: "bg-brand-base text-white hover:bg-brand-dark disabled:bg-brand-base/40",
    secondary:
        "border border-gray-300 bg-white text-gray-700 hover:bg-gray-200 disabled:text-gray-400 disabled:hover:bg-white",
};

const sizes = {
    md: "h-12 px-4 text-base",
    sm: "h-9 px-4 text-sm",
};

export function Button({
    variant = "primary",
    size = "md",
    icon,
    children,
    className = "",
    ...props
}: Props) {
    return (
        <button
            {...props}
            className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
        >
            {icon}
            {children}
        </button>
    );
}
