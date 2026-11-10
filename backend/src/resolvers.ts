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
        transactions: (_: unknown, __: unknown, ctx: Context) =>
            prisma.transaction.findMany({
                where: { userId: requireAuth(ctx) },
                orderBy: { date: "desc" },
            }),
    },

    Transaction: {
        date: (t: { date: Date }) => t.date.toISOString(),
        category: (t: { categoryId: string | null }) =>
            t.categoryId ? prisma.category.findUnique({ where: { id: t.categoryId } }) : null,
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

        deleteCategory: async (_: unknown, args: { id: string }, ctx: Context) => {
            const userId = requireAuth(ctx);
            const category = await prisma.category.findFirst({
                where: { id: args.id, userId },
            });
            if (!category) throw new GraphQLError("Categoria não encontrada");

            await prisma.category.delete({ where: { id: args.id } });
            return true;
        },

        createTransaction: async (
            _: unknown,
            { input }: { input: { description: string; amount: number; type: string; date?: string; categoryId?: string } },
            ctx: Context
        ) => {
            const userId = requireAuth(ctx);

            if (input.categoryId) {
                const category = await prisma.category.findFirst({
                    where: { id: input.categoryId, userId },
                });
                if (!category) throw new GraphQLError("Categoria não encontrada");
            }

            return prisma.transaction.create({
                data: {
                    description: input.description,
                    amount: input.amount,
                    type: input.type,
                    date: input.date ? new Date(input.date) : undefined,
                    categoryId: input.categoryId,
                    userId,
                },
            });
        },

        updateTransaction: async (
            _: unknown,
            args: {
                id: string;
                input: {
                    description?: string;
                    amount?: number;
                    type?: string;
                    date?: string;
                    categoryId?: string;
                };
            },
            ctx: Context
        ) => {
            const userId = requireAuth(ctx);
            const { input } = args;

            const transaction = await prisma.transaction.findFirst({
                where: { id: args.id, userId },
            });
            if (!transaction) throw new GraphQLError("Transação não encontrada");

            if (input.categoryId) {
                const category = await prisma.category.findFirst({
                    where: { id: input.categoryId, userId },
                });
                if (!category) throw new GraphQLError("Categoria não encontrada");
            }

            return prisma.transaction.update({
                where: { id: args.id },
                data: {
                    description: input.description ?? undefined,
                    amount: input.amount ?? undefined,
                    type: input.type ?? undefined,
                    date: input.date ? new Date(input.date) : undefined,
                    categoryId: input.categoryId ?? undefined,
                },
            });
        },

        deleteTransaction: async (_: unknown, args: { id: string }, ctx: Context) => {
            const userId = requireAuth(ctx);
            const transaction = await prisma.transaction.findFirst({
                where: { id: args.id, userId },
            });
            if (!transaction) throw new GraphQLError("Transação não encontrada");

            await prisma.transaction.delete({ where: { id: args.id } });
            return true;
        },
    },
};
