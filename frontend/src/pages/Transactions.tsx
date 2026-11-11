import { useMutation, useQuery } from "@apollo/client/react";
import { Plus, SquarePen, Trash } from "lucide-react";
import { DELETE_TRANSACTION, TRANSACTIONS, type Transaction } from "../graphql/transactions";
import { Button } from "../components/Button";
import { IconButton } from "../components/IconButton";
import { Tag, type TagColor } from "../components/Tag";
import { CategoryIcon } from "../components/CategoryIcon";
import { TransactionType } from "../components/TransactionType";
import { formatCurrency, formatDate } from "../lib/format";
import { useState } from "react";
import { TransactionModal } from "../components/TransactionModal";
import { Search } from "lucide-react";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { CATEGORIES, type Category } from "../graphql/categories";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationButton } from "../components/PaginationButton";

const PAGE_SIZE = 10;

const th = "px-3 py-5 text-xs font-medium tracking-wider text-gray-500 uppercase";

const MONTHS = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const monthLabel = (m: string) => {
    const [year, month] = m.split("-");
    return `${MONTHS[Number(month) - 1]} / ${year}`;
};


export default function Transactions() {
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Transaction | null>(null);
    const [deleteTransaction] = useMutation(DELETE_TRANSACTION, {
        refetchQueries: [TRANSACTIONS],
    });
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("ALL");
    const [categoryFilter, setCategoryFilter] = useState("ALL");
    const [period, setPeriod] = useState("ALL");
    const [page, setPage] = useState(1);

    const withReset = (setter: (value: string) => void) => (value: string) => {
        setter(value);
        setPage(1);
    };

    const { data } = useQuery<{ transactions: Transaction[] }>(TRANSACTIONS);
    const transactions = data?.transactions ?? [];
    const { data: catData } = useQuery<{ categories: Category[] }>(CATEGORIES);
    const months = [...new Set(transactions.map((t) => t.date.slice(0, 7)))].sort().reverse();
    const filtered = transactions.filter(
        (t) =>
            t.description.toLowerCase().includes(search.trim().toLowerCase()) &&
            (typeFilter === "ALL" || t.type === typeFilter) &&
            (categoryFilter === "ALL" || t.category?.id === categoryFilter) &&
            (period === "ALL" || t.date.slice(0, 7) === period)
    );

    // INFO: PAGINATION
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const from = filtered.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
    const to = Math.min(currentPage * PAGE_SIZE, filtered.length);

    const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
    const end = Math.min(totalPages, start + 4);
    const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
    /////

    return (
        <div className="flex flex-col gap-8">
            <header className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Transações</h1>
                    <p className="text-gray-600">Gerencie todas as suas transações financeiras</p>
                </div>
                <Button size="sm" icon={<Plus size={16} />} onClick={() => setModalOpen(true)}>
                    Nova transação
                </Button>
            </header>

            <section className="grid grid-cols-1 gap-4 rounded-xl border border-gray-200 bg-white p-6 sm:grid-cols-2 lg:grid-cols-4">
                <Input
                    label="Buscar"
                    placeholder="Buscar por descrição"
                    icon={<Search size={16} />}
                    value={search}
                    onChange={(e) => withReset(setSearch)(e.target.value)}
                />
                <Select
                    label="Tipo"
                    value={typeFilter}
                    onChange={withReset(setTypeFilter)}
                    options={[
                        { value: "ALL", label: "Todos" },
                        { value: "INCOME", label: "Entrada" },
                        { value: "EXPENSE", label: "Saída" },
                    ]}
                />
                <Select
                    label="Categoria"
                    value={categoryFilter}
                    onChange={withReset(setCategoryFilter)}
                    options={[
                        { value: "ALL", label: "Todas" },
                        ...(catData?.categories ?? []).map((c) => ({ value: c.id, label: c.name })),
                    ]}
                />
                <Select
                    label="Período"
                    value={period}
                    onChange={withReset(setPeriod)}
                    options={[
                        { value: "ALL", label: "Todos" },
                        ...months.map((m) => ({ value: m, label: monthLabel(m) })),
                    ]}
                />
            </section>

            <section className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                <div className="overflow-x-auto">

                    <table className="w-full min-w-[900px]">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className={`${th} px-6 text-left`}>Descrição</th>
                                <th className={th}>Data</th>
                                <th className={th}>Categoria</th>
                                <th className={th}>Tipo</th>
                                <th className={`${th} pr-16 text-right`}>Valor</th>
                                <th className={`${th} px-6`}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map((t) => (
                                <tr key={t.id} className="border-b border-gray-200 last:border-b-0">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <CategoryIcon
                                                icon={t.category?.icon ?? "tag"}
                                                color={t.category?.color ?? "gray"}
                                            />
                                            <span className="font-medium text-gray-800">{t.description}</span>
                                        </div>
                                    </td>
                                    <td className="px-3 text-center text-sm text-gray-600">
                                        {formatDate(t.date)}
                                    </td>
                                    <td className="px-3 text-center">
                                        {t.category ? (
                                            <Tag color={t.category.color as TagColor}>{t.category.name}</Tag>
                                        ) : (
                                            <Tag>Sem categoria</Tag>
                                        )}
                                    </td>
                                    <td className="px-3">
                                        <div className="flex justify-center">
                                            <TransactionType type={t.type} />
                                        </div>
                                    </td>
                                    <td className="px-3 pr-16 text-right text-sm font-semibold text-gray-800">
                                        {t.type === "INCOME" ? "+" : "-"} {formatCurrency(t.amount)}
                                    </td>
                                    <td className="px-6">
                                        <div className="flex justify-center gap-2">
                                            <IconButton
                                                variant="danger"
                                                icon={<Trash size={16} />}
                                                onClick={() => deleteTransaction({ variables: { id: t.id } })}
                                            />
                                            <IconButton icon={<SquarePen size={16} />} onClick={() => setEditing(t)} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                        Nenhuma transação encontrada
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 px-6 py-5">
                    <p className="text-sm text-gray-600">
                        <span className="font-medium text-gray-800">
                            {from} a {to}
                        </span>{" "}
                        | {filtered.length} resultados
                    </p>

                    <div className="flex gap-2">
                        <IconButton
                            aria-label="Página anterior"
                            icon={<ChevronLeft size={16} />}
                            disabled={currentPage === 1}
                            onClick={() => setPage(currentPage - 1)}
                        />
                        {pages.map((p) => (
                            <PaginationButton key={p} active={p === currentPage} onClick={() => setPage(p)}>
                                {p}
                            </PaginationButton>
                        ))}
                        <IconButton
                            aria-label="Próxima página"
                            icon={<ChevronRight size={16} />}
                            disabled={currentPage === totalPages}
                            onClick={() => setPage(currentPage + 1)}
                        />
                    </div>
                </footer>
            </section>
            {modalOpen && <TransactionModal onClose={() => setModalOpen(false)} />}
            {editing && (
                <TransactionModal transaction={editing} onClose={() => setEditing(null)} />
            )}
        </div>
    );
}
