import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@apollo/client/react";
import { Modal } from "./Modal";
import { Input } from "./Input";
import { Button } from "./Button";
import {
    CATEGORIES,
    CREATE_CATEGORY,
    UPDATE_CATEGORY,
    type Category,
} from "../graphql/categories";
import {
    CATEGORY_COLORS,
    CATEGORY_ICONS,
    COLOR_STYLES,
} from "../lib/categories";

const schema = z.object({
    name: z.string().min(1, "Informe o título"),
    description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const PICKER_ICONS = Object.entries(CATEGORY_ICONS).filter(([k]) => k !== "tag");

type Props = { onClose: () => void; category?: Category };

export function CategoryModal({ onClose, category }: Props) {
    const [icon, setIcon] = useState(category?.icon ?? "briefcase-business");
    const [color, setColor] = useState<string>(category?.color ?? "green");
    const [serverError, setServerError] = useState("");

    const [createCategory, { loading: creating }] = useMutation(CREATE_CATEGORY, {
        refetchQueries: [CATEGORIES],
    });
    const [updateCategory, { loading: updating }] = useMutation(UPDATE_CATEGORY);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: category?.name ?? "",
            description: category?.description ?? "",
        },
    });

    const onSubmit = async (data: FormData) => {
        setServerError("");
        try {
            if (category) {
                await updateCategory({
                    variables: {
                        id: category.id,
                        name: data.name,
                        description: data.description || null,
                        icon,
                        color,
                    },
                });
            } else {
                await createCategory({
                    variables: {
                        name: data.name,
                        description: data.description || undefined,
                        icon,
                        color,
                    },
                });
            }
            onClose();
        } catch (e) {
            setServerError(e instanceof Error ? e.message : "Erro ao salvar");
        }
    };

    return (
        <Modal
            onClose={onClose}
            title={category ? "Editar categoria" : "Nova categoria"}
            description="Organize suas transações com categorias"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                    <Input
                        label="Título"
                        placeholder="Ex. Alimentação"
                        error={errors.name?.message}
                        {...register("name")}
                    />
                    <Input
                        label="Descrição"
                        placeholder="Descrição da categoria"
                        helper="Opcional"
                        {...register("description")}
                    />

                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-gray-700">Ícone</span>
                        <div className="grid grid-cols-8 gap-2">
                            {PICKER_ICONS.map(([key, Icon]) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setIcon(key)}
                                    className={`flex aspect-square cursor-pointer items-center justify-center rounded-lg border bg-white ${icon === key
                                            ? "border-brand-base text-gray-800 ring-1 ring-brand-base"
                                            : "border-gray-300 text-gray-500 hover:bg-gray-100"
                                        }`}
                                >
                                    <Icon size={20} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-gray-700">Cor</span>
                        <div className="flex gap-2">
                            {CATEGORY_COLORS.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setColor(c)}
                                    className={`h-[30px] flex-1 cursor-pointer rounded-lg border bg-white p-[5px] ${color === c
                                            ? "border-brand-base ring-1 ring-brand-base"
                                            : "border-gray-300"
                                        }`}
                                >
                                    <span className={`block h-full rounded ${COLOR_STYLES[c].swatch}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {serverError && <p className="text-center text-sm text-danger">{serverError}</p>}

                <Button type="submit" disabled={creating || updating}>
                    Salvar
                </Button>
            </form>
        </Modal>
    );
}
