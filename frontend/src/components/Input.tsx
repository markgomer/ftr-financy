import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    icon?: ReactNode;
    helper?: string;
    error?: string;
    suffix?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
    { label, icon, helper, error, className = "", id, ...props },
    ref
) {
    const inputId = id ?? props.name;

    return (
        <div className={`group flex flex-col gap-1 ${className}`}>
            {label && (
                <label
                    htmlFor={inputId}
                    className={`text-sm font-medium transition-colors ${error ? "text-danger" : "text-gray-700 group-focus-within:text-brand-base"
                        }`}
                >
                    {label}
                </label>
            )}

            <div
                className={`flex h-12 items-center gap-3 rounded-lg border bg-white px-3 transition-colors has-disabled:bg-gray-100 has-disabled:text-gray-400 ${error
                    ? "border-danger"
                    : "border-gray-300 focus-within:border-brand-base"
                    }`}
            >
                {icon && <span className="text-gray-400">{icon}</span>}
                <input
                    id={inputId}
                    ref={ref}
                    className="w-full bg-transparent text-base text-gray-800 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed"
                    {...props}
                />
            </div>

            {(error || helper) && (
                <span className={`text-xs ${error ? "text-danger" : "text-gray-500"}`}>
                    {error ?? helper}
                </span>
            )}
        </div>
    );
});
