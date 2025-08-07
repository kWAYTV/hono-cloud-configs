import { z } from 'zod';

export const userQuerySchema = z.object({
  user: z.string().min(1),
});

export const idParamSchema = z.object({
  id: z.string().min(1),
});

export const createConfigSchema = z.object({
  user: z.string().min(1),
  name: z.string().min(1),
  content: z.string().min(1),
});

export const updateConfigSchema = z.object({
  content: z.string().min(1),
});

export const importModeEnum = z.enum(['upsert', 'insert-only']);

export const importSingleSchema = z.object({
  user: z.string().min(1),
  content: z.string().min(1),
  name: z.string().min(1).optional(),
  mode: importModeEnum.optional(),
});

export type GetConfigsQuery = z.infer<typeof userQuerySchema>;
export type CreateConfigRequest = z.infer<typeof createConfigSchema>;
export type UpdateConfigRequest = z.infer<typeof updateConfigSchema>;
export type ImportMode = z.infer<typeof importModeEnum>;
export type ImportSingleConfigRequest = z.infer<typeof importSingleSchema>;
