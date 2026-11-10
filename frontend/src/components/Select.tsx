import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, ChevronDown } from "lucide-react";

type Option = { value: string; label: string };

type Props = {
    label?: string;
    icon?: ReactNode;
    placeholder?: string;
    options: Option[];
    value?: string;
    onChange: (value: string) => void;
    error?: string;
    disabled?: boolean;
};

export function Select({
    label,
    icon,
    placeholder = "Selecione",
    options,
    value,
    onChange,
    error,
    disabled,
}: Props) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const selected = options.find((o) => o.value === value);

    useEffect(() => {
        const close = (e: MouseEvent) => {
            if (!ref.current?.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);

    return (
        <div ref={ref} className="relative flex flex-col gap-1">
            {label && (
                <span
                    className={`text-sm font-medium ${error ? "text-danger" : open ? "text-brand-base" : "text-gray-700"
                        }`}
                >
                    {label}
                </span>
            )}

            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen((o) => !o)}
                className={`flex h-12 cursor-pointer items-center gap-3 rounded-lg border bg-white px-3 text-left transition-colors disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 ${error ? "border-danger" : open ? "border-brand-base" : "border-gray-300"
                    }`}
            >
                {icon && <span className="text-gray-400">{icon}</span>}
                <span className={`flex-1 ${selected ? "text-gray-800" : "text-gray-400"}`}>
                    {selected?.label ?? placeholder}
                </span>
                <ChevronDown size={16} className="text-gray-500" />
            </button>

            {open && (
                <ul className="absolute top-full z-10 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                    {options.map((o) => (
                        <li key={o.value}>
                            <button
                                type="button"
                                onClick={() => {
                                    onChange(o.value);
                                    setOpen(false);
                                }}
                                className="flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left hover:bg-gray-100"
                            >
                                {o.label}
                                {o.value === value && <Check size={16} className="text-brand-base" />}
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {error && <span className="text-xs text-danger">{error}</span>}
        </div>
    );
}
