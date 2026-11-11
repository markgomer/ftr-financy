import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@apollo/client/react";
import { CircleArrowDown, CircleArrowUp } from "lucide-react";
import { Modal } from "./Modal";
import { Input } from "./Input";
import { Select } from "./Select";
import { Button } from "./Button";
import { CATEGORIES, type Category } from "../graphql/categories";
import {
    CREATE_TRANSACTION,
    TRANSACTIONS,
    UPDATE_TRANSACTION,
    type Transaction,
} from "../graphql/transactions";

const schema = z.object({
    description: z.string().min(1, "Informe a descrição"),
    date: z.string().min(1, "Informe a data"),
    amount: z
        .number({ message: "Informe o valor" })
        .positive("Informe um valor maior que zero"),
});

type FormData = z.infer<typeof schema>;

type Props = { onClose: () => void; transaction?: Transaction };

export function TransactionModal({ onClose, transaction }: Props) {
    const [type, setType] = useState<"EXPENSE" | "INCOME">(
        transaction?.type ?? "EXPENSE"
    );
    const [categoryId, setCategoryId] = useState(transaction?.category?.id ?? "");
    const [serverError, setServerError] = useState("");

    const { data } = useQuery<{ categories: Category[] }>(CATEGORIES);
    const [createTransaction, { loading: creating }] = useMutation(
        CREATE_TRANSACTION,
        { refetchQueries: [TRANSACTIONS] }
    );
    const [updateTransaction, { loading: updating }] =
        useMutation(UPDATE_TRANSACTION);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            description: transaction?.description ?? "",
            date: transaction?.date.slice(0, 10) ?? "",
            amount: transaction?.amount,
        },
    });

    const onSubmit = async (form: FormData) => {
        setServerError("");
        const input = {
            description: form.description,
            amount: form.amount,
            date: form.date,
            type,
            categoryId: categoryId || undefined,
        };

        try {
            if (transaction) {
                await updateTransaction({ variables: { id: transaction.id, input } });
            } else {
                await createTransaction({ variables: { input } });
            }
            onClose();
        } catch (e) {
            setServerError(e instanceof Error ? e.message : "Erro ao salvar");
        }
    };

    const typeButton = (value: "EXPENSE" | "INCOME", label: string) => {
        const active = type === value;
        const isExpense = value === "EXPENSE";
        const Icon = isExpense ? CircleArrowDown : CircleArrowUp;

        return (
            <button
                type="button"
                onClick={() => setType(value)}
                className={`flex h-[46px] cursor-pointer items-center justify-center gap-3 rounded-lg border font-medium transition-colors ${active
                        ? `bg-gray-100 text-gray-800 ${isExpense ? "border-danger" : "border-brand-base"}`
                        : "border-transparent text-gray-600 hover:bg-gray-100"
                    }`}
            >
                <Icon
                    size={16}
                    className={
                        active ? (isExpense ? "text-danger" : "text-brand-base") : "text-gray-400"
                    }
                />
                {label}
            </button>
        );
    };

    return (
        <Modal
            onClose={onClose}
            title={transaction ? "Editar transação" : "Nova transação"}
            description="Registre sua despesa ou receita"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-2 rounded-xl border border-gray-200 bg-white p-2">
                    {typeButton("EXPENSE", "Despesa")}
                    {typeButton("INCOME", "Receita")}
                </div>

                <div className="flex flex-col gap-4">
                    <Input
                        label="Descrição"
                        placeholder="Ex. Almoço no restaurante"
                        error={errors.description?.message}
                        {...register("description")}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Data"
                            type="date"
                            error={errors.date?.message}
                            {...register("date")}
                        />
                        <Input
                            label="Valor"
                            type="number"
                            step="0.01"
                            placeholder="0,00"
                            icon={<span className="text-sm text-gray-700">R$</span>}
                            error={errors.amount?.message}
                            {...register("amount", { valueAsNumber: true })}
                        />
                    </div>

                    <Select
                        label="Categoria"
                        placeholder="Selecione"
                        value={categoryId}
                        onChange={setCategoryId}
                        options={(data?.categories ?? []).map((c) => ({
                            value: c.id,
                            label: c.name,
                        }))}
                    />
                </div>

                {serverError && <p className="text-center text-sm text-danger">{serverError}</p>}

                <Button type="submit" disabled={creating || updating}>
                    Salvar
                </Button>
            </form>
        </Modal>
    );
}
