import { v4 as uuidv4 } from "uuid";
import { prisma } from "../lib/prisma.js";
import type {
  CreateConfigRequest,
  UpdateConfigRequest,
} from "../types/config.types.js";

export const configService = {
  async getMultiple(user: string) {
    return await prisma.config.findMany({
      where: { user },
      orderBy: { updatedAt: "desc" },
    });
  },

  async getSingle(id: string) {
    return await prisma.config.findUnique({
      where: { id },
    });
  },

  async create(data: CreateConfigRequest) {
    return await prisma.config.create({
      data: {
        id: uuidv4(),
        ...data,
      },
    });
  },

  async update(id: string, data: UpdateConfigRequest) {
    return await prisma.config.update({
      where: { id },
      data,
    });
  },

  async delete(id: string) {
    await prisma.config.delete({
      where: { id },
    });
    return { message: "Config successfully deleted" };
  },
};
