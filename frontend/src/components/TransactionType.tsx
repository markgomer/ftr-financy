import { CircleArrowUp, CircleArrowDown } from "lucide-react";

export type TransactionKind = "INCOME" | "EXPENSE";

export function TransactionType({ type }: { type: TransactionKind }) {
    const isIncome = type === "INCOME";

    return (
        <span
            className={`inline-flex items-center gap-2 text-sm font-medium ${isIncome ? "text-green-dark" : "text-red-dark"
                }`}
        >
            {isIncome ? <CircleArrowUp size={16} /> : <CircleArrowDown size={16} />}
            {isIncome ? "Entrada" : "Saída"}
        </span>
    );
}
