import { describe, expect, it } from 'bun:test';
import { prisma } from '../../src/lib/prisma.js';

describe('Prisma Client', () => {
  it('Should be defined and be a PrismaClient instance', () => {
    expect(prisma).toBeDefined();
    expect(prisma.config).toBeDefined();
    expect(typeof prisma.config.findMany).toBe('function');
    expect(typeof prisma.config.findUnique).toBe('function');
    expect(typeof prisma.config.create).toBe('function');
    expect(typeof prisma.config.update).toBe('function');
    expect(typeof prisma.config.delete).toBe('function');
  });

  it('Should be able to connect to database', async () => {
    // Simple connection test - just verify it doesn't throw
    try {
      await prisma.$connect();
      expect(true).toBe(true); // If we reach here, connection worked
    } catch (error) {
      throw new Error(`Database connection failed: ${error}`);
    }
  });

  it('Should be able to query database', async () => {
    // Simple query test
    const result = await prisma.config.findMany({
      take: 1,
    });
    expect(Array.isArray(result)).toBe(true);
  });
});
