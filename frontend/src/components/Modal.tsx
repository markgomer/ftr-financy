import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { IconButton } from "./IconButton";

type Props = {
    onClose: () => void;
    title: string;
    description?: string;
    children: ReactNode;
};

export function Modal({ onClose, title, description, children }: Props) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
            onMouseDown={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                className="w-full max-w-md rounded-xl bg-white p-6"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <header className="mb-6 flex items-start justify-between gap-4">
                    <div>
                        <h2 className="font-semibold text-gray-800">{title}</h2>
                        {description && <p className="text-sm text-gray-600">{description}</p>}
                    </div>
                    <IconButton
                        type="button"
                        aria-label="Fechar"
                        icon={<X size={16} />}
                        onClick={onClose}
                    />
                </header>
                {children}
            </div>
        </div>
    );
}
