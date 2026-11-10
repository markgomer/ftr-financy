import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    active?: boolean;
};

export function PaginationButton({
    active = false,
    className = "",
    children,
    ...props
}: Props) {
    return (
        <button
            {...props}
            className={`inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:bg-white ${active
                    ? "border-brand-base bg-brand-base text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-200"
                } ${className}`}
        >
            {children}
        </button>
    );
}
