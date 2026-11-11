import { useQuery } from "@apollo/client/react";
import { Plus, SquarePen, Trash } from "lucide-react";
import { TRANSACTIONS, type Transaction } from "../graphql/transactions";
import { Button } from "../components/Button";
import { IconButton } from "../components/IconButton";
import { Tag, type TagColor } from "../components/Tag";
import { CategoryIcon } from "../components/CategoryIcon";
import { TransactionType } from "../components/TransactionType";
import { formatCurrency, formatDate } from "../lib/format";
import { useState } from "react";
import { TransactionModal } from "../components/TransactionModal";

const th = "px-3 py-5 text-xs font-medium tracking-wider text-gray-500 uppercase";

export default function Transactions() {
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Transaction | null>(null);
    const { data } = useQuery<{ transactions: Transaction[] }>(TRANSACTIONS);
    const transactions = data?.transactions ?? [];

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

            <section className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
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
                        {transactions.map((t) => (
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
                                        <IconButton variant="danger" icon={<Trash size={16} />} />
                                        <IconButton icon={<SquarePen size={16} />} onClick={() => setEditing(t)} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {transactions.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                    Nenhuma transação encontrada
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>
            {modalOpen && <TransactionModal onClose={() => setModalOpen(false)} />}
            {editing && (
                <TransactionModal transaction={editing} onClose={() => setEditing(null)} />
            )}
        </div>
    );
}
