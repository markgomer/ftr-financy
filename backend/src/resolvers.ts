import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";
import { prisma } from "./prisma";

const signToken = (userId: string) =>
  jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "7d" });

export const resolvers = {
  Query: { health: () => "ok" },

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
  },
};
