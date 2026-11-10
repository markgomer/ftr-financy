import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";

export type Context = { userId: string | null };

export function getContext(authHeader?: string): Context {
    const token = authHeader?.replace("Bearer ", "");
    if (!token) return { userId: null };
    try {
        const { userId } = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        return { userId };
    } catch {
        return { userId: null };
    }
}

export function requireAuth(ctx: Context): string {
    if (!ctx.userId) throw new GraphQLError("Não autenticado");
    return ctx.userId;
}
