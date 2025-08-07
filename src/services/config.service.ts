import { nanoid } from 'nanoid';
import { prisma } from '../lib/prisma.js';
import type {
  CreateConfigRequest,
  ExportSingleConfigResponseItem,
  ImportSingleConfigRequest,
  ImportSingleConfigResponse,
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

  async exportSingle(
    id: string,
  ): Promise<ExportSingleConfigResponseItem | null> {
    const found = await prisma.config.findUnique({
      where: { id },
      select: { id: true, user: true, name: true, content: true },
    });
    return found ?? null;
  },

  async importSingle(
    id: string,
    payload: ImportSingleConfigRequest,
  ): Promise<ImportSingleConfigResponse> {
    const mode = payload.mode ?? 'upsert';
    const existing = await prisma.config.findUnique({ where: { id } });

    if (existing) {
      if (mode === 'insert-only') {
        return { id, user: existing.user, action: 'skipped' };
      }

      const updated = await prisma.config.update({
        where: { id },
        data: {
          content: payload.content,
          // allow optional rename
          ...(payload.name ? { name: payload.name } : {}),
          user: payload.user,
        },
      });
      return { id: updated.id, user: updated.user, action: 'updated' };
    }

    // creating new requires name
    if (!payload.name) {
      throw new Error('Missing required field: name');
    }

    const created = await prisma.config.create({
      data: {
        id,
        user: payload.user,
        name: payload.name,
        content: payload.content,
      },
    });
    return { id: created.id, user: created.user, action: 'created' };
  },
};
