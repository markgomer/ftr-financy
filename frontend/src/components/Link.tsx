import { Link as RouterLink, type LinkProps } from "react-router-dom";

export function Link({ className = "", ...props }: LinkProps) {
    return (
        <RouterLink
            {...props}
            className={`text-sm font-medium text-brand-base transition-colors hover:text-brand-dark hover:underline ${className}`}
        />
    );
}
