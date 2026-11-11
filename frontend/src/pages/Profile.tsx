import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";
import { LogOut, Mail, User } from "lucide-react";
import { ME, UPDATE_PROFILE } from "../graphql/user";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useAuth } from "../lib/auth";
import { getInitials } from "../lib/format";

const schema = z.object({
    name: z.string().min(2, "Informe seu nome"),
});

type FormData = z.infer<typeof schema>;

export default function Profile() {
    const navigate = useNavigate();
    const { signOut } = useAuth();
    const [message, setMessage] = useState("");
    const [serverError, setServerError] = useState("");

    const { data } = useQuery<{ me: { name: string; email: string } }>(ME);
    const [updateProfile, { loading }] = useMutation(UPDATE_PROFILE);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        values: { name: data?.me.name ?? "" },
    });

    const onSubmit = async (form: FormData) => {
        setMessage("");
        setServerError("");
        try {
            await updateProfile({ variables: { name: form.name } });
            setMessage("Alterações salvas");
        } catch (e) {
            setServerError(e instanceof Error ? e.message : "Erro ao salvar");
        }
    };

    const handleSignOut = () => {
        signOut();
        navigate("/");
    };

    return (
        <div className="mx-auto w-full max-w-md rounded-xl border border-gray-200 bg-white p-8">
            <header className="flex flex-col items-center gap-4 border-b border-gray-200 pb-8">
                <div className="flex size-16 items-center justify-center rounded-full bg-gray-300 text-2xl text-gray-800">
                    {getInitials(data?.me.name)}
                </div>
                <div className="text-center">
                    <h1 className="text-lg font-semibold text-gray-800">{data?.me.name}</h1>
                    <p className="text-gray-500">{data?.me.email}</p>
                </div>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                    <Input
                        label="Nome completo"
                        icon={<User size={16} />}
                        error={errors.name?.message}
                        {...register("name")}
                    />
                    <Input
                        label="E-mail"
                        icon={<Mail size={16} />}
                        value={data?.me.email ?? ""}
                        helper="O e-mail não pode ser alterado"
                        disabled
                    />
                </div>

                {message && <p className="text-center text-sm text-success">{message}</p>}
                {serverError && <p className="text-center text-sm text-danger">{serverError}</p>}

                <div className="flex flex-col gap-4">
                    <Button type="submit" disabled={loading}>
                        Salvar alterações
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        icon={<LogOut size={16} className="text-danger" />}
                        onClick={handleSignOut}
                    >
                        Sair da conta
                    </Button>
                </div>
            </form>
        </div>
    );
}
