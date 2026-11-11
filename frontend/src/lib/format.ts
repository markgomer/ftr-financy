export const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        timeZone: "UTC",
    });

export const formatItems = (n: number) => `${n} ${n === 1 ? "item" : "itens"}`;

export function getInitials(name = "") {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (parts[0][0] + last).toUpperCase();
}
