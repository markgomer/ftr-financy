import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    icon: ReactNode;
    variant?: "default" | "danger";
};

const variants = {
    default: "text-gray-600 hover:bg-gray-200",
    danger: "text-danger hover:bg-red-light",
};

export function IconButton({
    icon,
    variant = "default",
    className = "",
    ...props
}: Props) {
    return (
        <button
            {...props}
            className={`inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white transition-colors disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white ${variants[variant]} ${className}`}
        >
            {icon}
        </button>
    );
}
