import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";
import { prisma } from "./prisma";
import { requireAuth, type Context } from "./context";

const signToken = (userId: string) =>
    jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "7d" });

export const resolvers = {
    Query: {
        health: () => "ok",
        me: (_: unknown, __: unknown, ctx: Context) =>
            prisma.user.findUniqueOrThrow({ where: { id: requireAuth(ctx) } }),
        categories: (_: unknown, __: unknown, ctx: Context) =>
            prisma.category.findMany({
                where: { userId: requireAuth(ctx) },
                orderBy: { createdAt: "desc" },
            }),
    },

    Mutation: {
        register: async (
            _: unknown,
            args: { name: string; email: string; password: string }
        ) => {
            const exists = await prisma.user.findUnique({ where: { email: args.email } });
            if (exists) throw new GraphQLError("E-mail já cadastrado");

            const user = await prisma.user.create({
                data: { ...args, password: await bcrypt.hash(args.password, 10) },
            });
            return { token: signToken(user.id), user };
        },

        login: async (_: unknown, args: { email: string; password: string }) => {
            const user = await prisma.user.findUnique({ where: { email: args.email } });
            if (!user || !(await bcrypt.compare(args.password, user.password))) {
                throw new GraphQLError("Credenciais inválidas");
            }
            return { token: signToken(user.id), user };
        },

        createCategory: (_: unknown, args: { name: string }, ctx: Context) =>
            prisma.category.create({
                data: { name: args.name, userId: requireAuth(ctx) },
            }),

        updateCategory: async (
            _: unknown,
            args: { id: string; name: string },
            ctx: Context
        ) => {
            const userId = requireAuth(ctx);
            const category = await prisma.category.findFirst({
                where: { id: args.id, userId },
            });
            if (!category) throw new GraphQLError("Categoria não encontrada");

            return prisma.category.update({
                where: { id: args.id },
                data: { name: args.name },
            });
        },
    },
};
