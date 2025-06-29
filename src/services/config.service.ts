import { nanoid } from 'nanoid';
import { prisma } from '../lib/prisma.js';
import type {
  CreateConfigRequest,
  UpdateConfigRequest,
} from '../types/config.types.js';

export const configService = {
  async getMultiple(user: string) {
    return await prisma.config.findMany({
      where: { user },
      orderBy: { updatedAt: 'desc' },
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
        id: nanoid(),
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
    return { message: 'Config successfully deleted' };
  },
};
