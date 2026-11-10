import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, UserPlus } from "lucide-react";
import { AuthLayout } from "../components/AuthLayout";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Link } from "../components/Link";

const schema = z.object({
    email: z.email("E-mail inválido"),
    password: z.string().min(6, "Mínimo de 6 caracteres"),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({ resolver: zodResolver(schema) });

    const onSubmit = (data: FormData) => console.log(data);

    return (
        <AuthLayout title="Fazer login" subtitle="Entre na sua conta para continuar">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
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
                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input type="checkbox" className="size-4 accent-brand-base" />
                            Lembrar-me
                        </label>
                        <Link to="#">Recuperar senha</Link>
                    </div>
                </div>

                <Button type="submit">Entrar</Button>

                <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="h-px flex-1 bg-gray-200" />
                    ou
                    <span className="h-px flex-1 bg-gray-200" />
                </div>

                <div className="flex flex-col gap-4">
                    <p className="text-center text-sm text-gray-600">Ainda não tem uma conta?</p>
                    <Button
                        type="button"
                        variant="secondary"
                        icon={<UserPlus size={16} />}
                        onClick={() => navigate("/signup")}
                    >
                        Criar conta
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}
