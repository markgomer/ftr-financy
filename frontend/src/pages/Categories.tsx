import { useQuery } from "@apollo/client/react";
import { ArrowUpDown, Plus, SquarePen, Tag as TagIcon, Trash } from "lucide-react";
import { CATEGORIES, type Category } from "../graphql/categories";
import { TRANSACTIONS, type Transaction } from "../graphql/transactions";
import { Button } from "../components/Button";
import { IconButton } from "../components/IconButton";
import { Tag, type TagColor } from "../components/Tag";
import { CategoryIcon } from "../components/CategoryIcon";
import { COLOR_STYLES, getCategoryIcon } from "../lib/categories";
import { useState } from "react";
import { CategoryModal } from "../components/CategoryModal";

const itemsLabel = (n: number) => `${n} ${n === 1 ? "item" : "itens"}`;

export default function Categories() {
    const [modalOpen, setModalOpen] = useState(false);
    const { data: catData } = useQuery<{ categories: Category[] }>(CATEGORIES);
    const { data: txData } = useQuery<{ transactions: Transaction[] }>(TRANSACTIONS);

    const categories = catData?.categories ?? [];
    const transactions = txData?.transactions ?? [];

    const counts: Record<string, number> = {};
    for (const t of transactions) {
        if (t.category) counts[t.category.id] = (counts[t.category.id] ?? 0) + 1;
    }

    const top = [...categories].sort(
        (a, b) => (counts[b.id] ?? 0) - (counts[a.id] ?? 0)
    )[0];
    const TopIcon = top ? getCategoryIcon(top.icon) : TagIcon;
    const topStyle = top ? COLOR_STYLES[top.color] : undefined;

    return (
        <div className="flex flex-col gap-8">
            <header className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Categorias</h1>
                    <p className="text-gray-600">Organize suas transações por categorias</p>
                </div>
                <Button size="sm" icon={<Plus size={16} />} onClick={() => setModalOpen(true)}>
                </Button>
            </header>

            <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <StatCard
                    icon={<TagIcon size={24} className="text-gray-600" />}
                    value={String(categories.length)}
                    label="Total de categorias"
                />
                <StatCard
                    icon={<ArrowUpDown size={24} className="text-purple-base" />}
                    value={String(transactions.length)}
                    label="Total de transações"
                />
                <StatCard
                    icon={
                        <TopIcon
                            size={24}
                            className={topStyle ? topStyle.box.split(" ")[1] : "text-gray-400"}
                        />
                    }
                    value={top && counts[top.id] ? top.name : "—"}
                    label="Categoria mais utilizada"
                />
            </section>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {categories.map((c) => (
                    <article
                        key={c.id}
                        className="flex flex-col gap-5 rounded-xl border border-gray-200 bg-white p-6"
                    >
                        <div className="flex items-start justify-between">
                            <CategoryIcon icon={c.icon} color={c.color} />
                            <div className="flex gap-2">
                                <IconButton variant="danger" icon={<Trash size={16} />} />
                                <IconButton icon={<SquarePen size={16} />} />
                            </div>
                        </div>

                        <div>
                            <h2 className="font-semibold text-gray-800">{c.name}</h2>
                            <p className="min-h-10 text-sm text-gray-600">{c.description}</p>
                        </div>

                        <div className="flex items-center justify-between">
                            <Tag color={c.color as TagColor}>{c.name}</Tag>
                            <span className="text-sm text-gray-600">
                                {itemsLabel(counts[c.id] ?? 0)}
                            </span>
                        </div>
                    </article>
                ))}
            </section>
            {modalOpen && <CategoryModal onClose={() => setModalOpen(false)} />}
        </div>
    );
}

function StatCard({
    icon,
    value,
    label,
}: {
    icon: React.ReactNode;
    value: string;
    label: string;
}) {
    return (
        <div className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-6">
            {icon}
            <div>
                <p className="text-3xl leading-8 font-bold text-gray-800">{value}</p>
                <p className="mt-2 text-xs tracking-wider text-gray-500 uppercase">{label}</p>
            </div>
        </div>
    );
}
