import { useState, type ReactNode } from "react";
import { useQuery } from "@apollo/client/react";
import {
    ChevronRight,
    CircleArrowDown,
    CircleArrowUp,
    Plus,
    Wallet,
} from "lucide-react";
import { TRANSACTIONS, type Transaction } from "../graphql/transactions";
import type { Category } from "../graphql/categories";
import { Link } from "../components/Link";
import { Tag, type TagColor } from "../components/Tag";
import { CategoryIcon } from "../components/CategoryIcon";
import { TransactionModal } from "../components/TransactionModal";
import { formatCurrency, formatDate, formatItems } from "../lib/format";

const sectionTitle = "text-xs font-medium tracking-wider text-gray-500 uppercase";

const sum = (list: Transaction[], type: Transaction["type"]) =>
    list.filter((t) => t.type === type).reduce((acc, t) => acc + t.amount, 0);

export default function Dashboard() {
    const [modalOpen, setModalOpen] = useState(false);
    const { data } = useQuery<{ transactions: Transaction[] }>(TRANSACTIONS);
    const transactions = data?.transactions ?? [];

    const now = new Date();
    const thisMonth = transactions.filter((t) => {
        const d = new Date(t.date);
        return d.getUTCFullYear() === now.getFullYear() && d.getUTCMonth() === now.getMonth();
    });

    const balance = sum(transactions, "INCOME") - sum(transactions, "EXPENSE");
    const income = sum(thisMonth, "INCOME");
    const expense = sum(thisMonth, "EXPENSE");
    const recent = transactions.slice(0, 5);

    const byCategory = new Map<string, { category: Category; count: number; total: number }>();
    for (const t of transactions) {
        if (!t.category) continue;
        const item = byCategory.get(t.category.id) ?? { category: t.category, count: 0, total: 0 };
        item.count += 1;
        item.total += t.amount;
        byCategory.set(t.category.id, item);
    }
    const topCategories = [...byCategory.values()]
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    return (
        <div className="flex flex-col gap-6">
            <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <SummaryCard
                    icon={<Wallet size={20} className="text-purple-base" />}
                    label="Saldo total"
                    value={formatCurrency(balance)}
                />
                <SummaryCard
                    icon={<CircleArrowUp size={20} className="text-brand-base" />}
                    label="Receitas do mês"
                    value={formatCurrency(income)}
                />
                <SummaryCard
                    icon={<CircleArrowDown size={20} className="text-danger" />}
                    label="Despesas do mês"
                    value={formatCurrency(expense)}
                />
            </section>

            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
                <section className="overflow-hidden rounded-xl border border-gray-200 bg-white lg:col-span-2">
                    <header className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
                        <h2 className={sectionTitle}>Transações recentes</h2>
                        <Link to="/transactions" className="inline-flex items-center gap-1">
                            Ver todas <ChevronRight size={16} />
                        </Link>
                    </header>

                    <ul>
                        {recent.map((t) => (
                            <li
                                key={t.id}
                                className="flex items-center gap-4 border-b border-gray-200 px-6 py-5"
                            >
                                <CategoryIcon
                                    icon={t.category?.icon ?? "tag"}
                                    color={t.category?.color ?? "gray"}
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-medium text-gray-800">{t.description}</p>
                                    <p className="text-sm text-gray-600">{formatDate(t.date)}</p>
                                </div>
                                <div className="hidden w-40 justify-center sm:flex">
                                    {t.category ? (
                                        <Tag color={t.category.color as TagColor}>{t.category.name}</Tag>
                                    ) : (
                                        <Tag>Sem categoria</Tag>
                                    )}
                                </div>
                                <div className="flex items-center justify-end gap-2 text-sm font-semibold text-gray-800 sm:w-40">
                                    {t.type === "INCOME" ? "+" : "-"} {formatCurrency(t.amount)}
                                    {t.type === "INCOME" ? (
                                        <CircleArrowUp size={16} className="text-brand-base" />
                                    ) : (
                                        <CircleArrowDown size={16} className="text-danger" />
                                    )}
                                </div>
                            </li>
                        ))}
                        {recent.length === 0 && (
                            <li className="px-6 py-10 text-center text-gray-500">
                                Nenhuma transação ainda
                            </li>
                        )}
                    </ul>

                    <button
                        type="button"
                        onClick={() => setModalOpen(true)}
                        className="flex w-full cursor-pointer items-center justify-center gap-2 py-5 text-sm font-medium text-brand-base transition-colors hover:bg-gray-100"
                    >
                        <Plus size={16} /> Nova transação
                    </button>
                </section>

                <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                    <header className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
                        <h2 className={sectionTitle}>Categorias</h2>
                        <Link to="/categories" className="inline-flex items-center gap-1">
                            Gerenciar <ChevronRight size={16} />
                        </Link>
                    </header>

                    <ul className="flex flex-col gap-5 p-6">
                        {topCategories.map(({ category, count, total }) => (
                            <li key={category.id} className="flex items-center gap-3">
                                <Tag color={category.color as TagColor}>{category.name}</Tag>
                                <span className="ml-auto text-sm text-gray-600">{formatItems(count)}</span>
                                <span className="w-24 text-right text-sm font-semibold text-gray-800">
                                    {formatCurrency(total)}
                                </span>
                            </li>
                        ))}
                        {topCategories.length === 0 && (
                            <li className="text-center text-gray-500">Nenhuma categoria em uso</li>
                        )}
                    </ul>
                </section>
            </div>

            {modalOpen && <TransactionModal onClose={() => setModalOpen(false)} />}
        </div>
    );
}

function SummaryCard({
    icon,
    label,
    value,
}: {
    icon: ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-3">
                {icon}
                <span className={sectionTitle}>{label}</span>
            </div>
            <p className="mt-4 text-3xl leading-8 font-bold text-gray-800">{value}</p>
        </div>
    );
}
