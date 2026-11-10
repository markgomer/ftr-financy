import { Button } from "./components/Button";
import { Lock, Mail, SquarePen, Trash, User } from "lucide-react";
import { Input } from "./components/Input";
import { Tag, TAG_COLORS } from "./components/Tag";
import { IconButton } from "./components/IconButton";
import { Link } from "./components/Link";
import { PaginationButton } from "./components/PaginationButton";
import { TransactionType } from "./components/TransactionType";
import { Select } from "./components/Select";
import { useState } from "react";


export default function App() {
    const [v, setV] = useState("");

    return (
        <>
            <div className="flex gap-4 p-8">
                <Button icon={<User size={16} />}>Label</Button>
                <Button variant="secondary" size="sm">Label</Button>
                <Button disabled>Label</Button>
                <Input label="E-mail" placeholder="mail@exemplo.com" icon={<Mail size={16} />} helper="Ajuda" />
                <Input label="Senha" type="password" icon={<Lock size={16} />} error="Senha inválida" />
            </div>
            <div className="flex gap-2">
                {TAG_COLORS.map((c) => <Tag key={c} color={c}>{c}</Tag>)}
            </div>
            <div className="flex gap-2">
                <IconButton icon={<SquarePen size={16} />} />
                <IconButton icon={<Trash size={16} />} variant="danger" />
                <IconButton icon={<SquarePen size={16} />} disabled />
            </div>
            <Link to="/">Label</Link>
            <div className="flex gap-2">
                <PaginationButton>1</PaginationButton>
                <PaginationButton active>2</PaginationButton>
                <PaginationButton disabled>3</PaginationButton>
            </div>
            <div className="flex gap-4">
                <TransactionType type="INCOME" />
                <TransactionType type="EXPENSE" />
            </div>
            <Select
                label="Categoria"
                value={v}
                onChange={setV}
                options={[
                    { value: "1", label: "Option 1" },
                    { value: "2", label: "Option 2" },
                ]}
            />
        </>
    );
}
