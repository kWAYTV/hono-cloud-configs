import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { prisma } from '../../src/lib/prisma.js';
import { configService } from '../../src/services/config.service.js';

// Test data
const testUser = 'serviceuser';
const testConfig = {
  user: testUser,
  name: 'service-test-config',
  content: 'service test content',
};

describe('Config Service', () => {
  beforeEach(async () => {
    // Clean up test data
    await prisma.config.deleteMany({
      where: { user: testUser },
    });
  });

  afterEach(async () => {
    // Clean up test data
    await prisma.config.deleteMany({
      where: { user: testUser },
    });
  });

  describe('getMultiple', () => {
    it('Should return empty array for user with no configs', async () => {
      const configs = await configService.getMultiple('nonexistentuser');
      expect(configs).toEqual([]);
    });

    it('Should return user configs ordered by updatedAt desc', async () => {
      // Create multiple configs with different timestamps
      const config1 = await prisma.config.create({
        data: {
          id: 'service-1',
          ...testConfig,
          name: 'config-1',
          updatedAt: new Date('2024-01-01'),
        },
      });

      const config2 = await prisma.config.create({
        data: {
          id: 'service-2',
          ...testConfig,
          name: 'config-2',
          updatedAt: new Date('2024-01-02'),
        },
      });

      const configs = await configService.getMultiple(testUser);

      expect(configs).toHaveLength(2);
      expect(configs[0].id).toBe(config2.id); // More recent first
      expect(configs[1].id).toBe(config1.id);
    });
  });

  describe('getSingle', () => {
    it('Should return null for non-existent config', async () => {
      const config = await configService.getSingle('non-existent-id');
      expect(config).toBeNull();
    });

    it('Should return specific config', async () => {
      const createdConfig = await prisma.config.create({
        data: {
          id: 'service-3',
          ...testConfig,
        },
      });

      const config = await configService.getSingle(createdConfig.id);

      expect(config).not.toBeNull();
      expect(config?.id).toBe(createdConfig.id);
      expect(config?.name).toBe(testConfig.name);
      expect(config?.user).toBe(testConfig.user);
      expect(config?.content).toBe(testConfig.content);
    });
  });

  describe('create', () => {
    it('Should create new config with auto-generated UUID', async () => {
      const config = await configService.create(testConfig);

      expect(config.id).toBeDefined();
      expect(config.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
      expect(config.name).toBe(testConfig.name);
      expect(config.user).toBe(testConfig.user);
      expect(config.content).toBe(testConfig.content);
      expect(config.createdAt).toBeDefined();
      expect(config.updatedAt).toBeDefined();
    });

    it('Should create config with all required fields', async () => {
      const config = await configService.create(testConfig);

      // Verify in database
      const dbConfig = await prisma.config.findUnique({
        where: { id: config.id },
      });

      expect(dbConfig).not.toBeNull();
      expect(dbConfig?.name).toBe(testConfig.name);
      expect(dbConfig?.user).toBe(testConfig.user);
      expect(dbConfig?.content).toBe(testConfig.content);
    });
  });

  describe('update', () => {
    it('Should update config content', async () => {
      const createdConfig = await prisma.config.create({
        data: {
          id: 'service-4',
          ...testConfig,
        },
      });

      const updatedContent = 'updated service content';
      const updatedConfig = await configService.update(createdConfig.id, {
        content: updatedContent,
      });

      expect(updatedConfig.content).toBe(updatedContent);
      expect(updatedConfig.id).toBe(createdConfig.id);
      expect(updatedConfig.name).toBe(testConfig.name); // unchanged
      expect(updatedConfig.user).toBe(testConfig.user); // unchanged
    });

    it('Should update updatedAt timestamp', async () => {
      const createdConfig = await prisma.config.create({
        data: {
          id: 'service-5',
          ...testConfig,
        },
      });

      // Wait a bit to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 10));

      const updatedConfig = await configService.update(createdConfig.id, {
        content: 'new content',
      });

      expect(updatedConfig.updatedAt.getTime()).toBeGreaterThan(
        createdConfig.updatedAt.getTime(),
      );
    });
  });

  describe('delete', () => {
    it('Should delete config and return success message', async () => {
      const createdConfig = await prisma.config.create({
        data: {
          id: 'service-6',
          ...testConfig,
        },
      });

      const result = await configService.delete(createdConfig.id);

      expect(result.message).toBe('Config successfully deleted');

      // Verify config is deleted
      const deletedConfig = await prisma.config.findUnique({
        where: { id: createdConfig.id },
      });
      expect(deletedConfig).toBeNull();
    });

    it('Should throw error when deleting non-existent config', async () => {
      await expect(configService.delete('non-existent-id')).rejects.toThrow();
    });
  });
});
