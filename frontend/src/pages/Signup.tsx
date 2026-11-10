import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { Eye, EyeOff, Lock, LogIn, Mail, User } from "lucide-react";
import { AuthLayout } from "../components/AuthLayout";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { REGISTER } from "../graphql/auth";
import { useAuth } from "../lib/auth";

const schema = z.object({
    name: z.string().min(2, "Informe seu nome"),
    email: z.email("E-mail inválido"),
    password: z.string().min(6, "Mínimo de 6 caracteres"),
});

type FormData = z.infer<typeof schema>;

export default function Signup() {
    const navigate = useNavigate();
    const { signIn } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState("");
    const [registerUser, { loading }] =
        useMutation<{ register: { token: string } }>(REGISTER);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({ resolver: zodResolver(schema) });

    const onSubmit = async (data: FormData) => {
        setServerError("");
        try {
            const { data: res } = await registerUser({ variables: data });
            signIn(res!.register.token);
            navigate("/");
        } catch (e) {
            setServerError(e instanceof Error ? e.message : "Erro ao cadastrar");
        }
    };

    return (
        <AuthLayout
            title="Criar conta"
            subtitle="Comece a controlar suas finanças ainda hoje"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                    <Input
                        label="Nome completo"
                        placeholder="Seu nome completo"
                        icon={<User size={16} />}
                        error={errors.name?.message}
                        {...register("name")}
                    />
                    <Input
                        label="E-mail"
                        placeholder="mail@exemplo.com"
                        icon={<Mail size={16} />}
                        error={errors.email?.message}
                        {...register("email")}
                    />
                    <Input
                        label="Senha"
                        placeholder="Digite sua senha"
                        type={showPassword ? "text" : "password"}
                        icon={<Lock size={16} />}
                        helper="A senha deve ter no mínimo 6 caracteres"
                        suffix={
                            <button
                                type="button"
                                onClick={() => setShowPassword((s) => !s)}
                                className="cursor-pointer text-gray-500"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        }
                        error={errors.password?.message}
                        {...register("password")}
                    />
                </div>

                {serverError && (
                    <p className="text-center text-sm text-danger">{serverError}</p>
                )}

                <Button type="submit" disabled={loading}>
                    Cadastrar
                </Button>

                <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="h-px flex-1 bg-gray-200" />
                    ou
                    <span className="h-px flex-1 bg-gray-200" />
                </div>

                <div className="flex flex-col gap-4">
                    <p className="text-center text-sm text-gray-600">Já tem uma conta?</p>
                    <Button
                        type="button"
                        variant="secondary"
                        icon={<LogIn size={16} />}
                        onClick={() => navigate("/")}
                    >
                        Fazer login
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}
