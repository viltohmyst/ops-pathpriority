import {
  PathPriorityBuilder,
  PathPriorityBuilderSync,
  PrintFormat,
} from './path-priority-builder';
import './finders/default-locations';
import './finders/relative-locations';
import mockFs from 'mock-fs';
import envPaths from 'env-paths';
import path from 'path';

describe('PathPriorityBuilder', () => {
  describe('generate', () => {
    afterEach(() => {
      // Reset the mocked fs
      mockFs.restore();
    });

    it('should use arguments from findPaths', async () => {
      const dataPath = envPaths(`test${path.sep}test.txt`, { suffix: '' }).data;
      const dirStructure = {
        [dataPath]: 'dummy content',
      };
      mockFs(dirStructure);
      const pb = new PathPriorityBuilder();
      const result = await pb
        .findPaths(path.join('test', 'test.txt'))
        .defaultData()
        .generate();
      expect(result[0]).toContain('test.txt');
    });

    it('should use arguments from finders', async () => {
      const dataPath = envPaths(`test${path.sep}test.txt`, { suffix: '' }).data;
      const dirStructure = {
        [dataPath]: 'dummy content',
      };
      mockFs(dirStructure);
      const pb = new PathPriorityBuilder();
      const result = await pb
        .findPaths()
        .defaultData(path.join('test', 'test.txt'))
        .generate();
      expect(result[0]).toContain('test.txt');
    });

    it('should use arguments from pathFinder', async () => {
      const dataPath = envPaths(`target${path.sep}target.txt`, { suffix: '' })
        .data;
      const dirStructure = {
        [dataPath]: 'dummy content',
      };
      mockFs(dirStructure);
      const pb = new PathPriorityBuilder();
      const result = await pb
        .findPaths()
        .defaultData(path.join('target', 'target.txt'))
        .generate();
      expect(result[0]).toContain('target.txt');
    });

    it('should prioritize using args from pathFinder', async () => {
      const dataPath = envPaths(`target${path.sep}target.txt`, { suffix: '' })
        .data;
      const dirStructure = {
        [dataPath]: 'dummy content',
      };
      mockFs(dirStructure);
      const pb = new PathPriorityBuilder();
      const result = await pb
        .findPaths(path.join('test', 'test.txt'))
        .defaultData(path.join('target', 'target.txt'))
        .generate();
      expect(result[0]).toContain('target.txt');
    });

    it('should find all targets in order', async () => {
      const dataPath = envPaths(`data${path.sep}data.txt`, { suffix: '' }).data;
      const configPath = envPaths(`config${path.sep}config.txt`, { suffix: '' })
        .config;

      const dirStructure = {
        [dataPath]: 'dummy content',
        [configPath]: 'dummy content',
      };
      mockFs(dirStructure);
      const pb = new PathPriorityBuilder();
      const result = await pb
        .findPaths(path.join('test', 'test.txt'))
        .defaultData(path.join('data', 'data.txt'))
        .defaultConfig(path.join('config', 'config.txt'))
        .generate();
      expect(result[0]).toContain('data.txt');
      expect(result[1]).toContain('config.txt');
    });

    it('should discard unfound targets and present results in order', async () => {
      const dataPath = envPaths(`data${path.sep}data.txt`, { suffix: '' }).data;
      const configPath = envPaths(`config${path.sep}config.txt`, { suffix: '' })
        .config;
      const cachePath = envPaths(`cache${path.sep}cache.txt`, { suffix: '' })
        .cache;

      const dirStructure = {
        [dataPath]: 'dummy content',
        [configPath]: 'dummy content',
        [cachePath]: 'dummy content',
        '/root/config.txt': 'dummy content',
      };
      mockFs(dirStructure);
      const pb = new PathPriorityBuilder();
      const result = await pb
        .findPaths(path.join('test', 'test.txt'))
        .defaultData(path.join('data', 'data.txt'))
        .defaultLog(path.join('log', 'log.txt'))
        .defaultConfig(path.join('config', 'config.txt'))
        .findWithGlob('**/config.txt', {
          startPath: '/',
          maxDepth: 5,
          findAll: true,
        })
        .defaultCache(path.join('cache', 'cache.txt'))
        .generate();
      expect(result.length).toEqual(5);
      expect(result[0]).toContain('data.txt');
      expect(result[1]).toContain('config.txt');
      expect(result[2]).toContain('/root/config.txt');
      expect(result[3]).toContain('.config/config/config.txt');
      expect(result[4]).toContain('cache.txt');
    });

    it('should discard envConditions if not both conditions true', async () => {
      const dataPath = envPaths(`data${path.sep}data.txt`, { suffix: '' }).data;
      const configPath = envPaths(`config${path.sep}config.txt`, { suffix: '' })
        .config;
      const cachePath = envPaths(`cache${path.sep}cache.txt`, { suffix: '' })
        .cache;

      const dirStructure = {
        [dataPath]: 'dummy content',
        [configPath]: 'dummy content',
        [cachePath]: 'dummy content',
        '/root/config.txt': 'dummy content',
      };
      mockFs(dirStructure);
      process.env.PASS_COND = 'true';
      process.env.OTHER_PASS_COND = 'true';
      const pb = new PathPriorityBuilder();
      const result = await pb
        .findPaths(path.join('test', 'test.txt'))
        .ifEnv({ PASS_COND: '?(ooglay)?(true)', OTHER_PASS_COND: 'tr?e' })
        .defaultData(path.join('data', 'data.txt'))
        .ifEnv({ NON_EXISTENT: 'notExist' })
        .defaultLog(path.join('log', 'log.txt'))
        .ifEnv({ PASS_COND: 'false', OTHER_PASS_COND: 'false' })
        .defaultConfig(path.join('config', 'config.txt'))
        .findWithGlob('**/config.txt', {
          startPath: '/',
          maxDepth: 5,
          findAll: true,
        })
        .ifEnv({ PASS_COND: 'false', OTHER_PASS_COND: 'true' })
        .defaultCache(path.join('cache', 'cache.txt'))
        .generate();
      expect(result.length).toEqual(3);
      expect(result[0]).toContain('data.txt');
      expect(result[1]).toContain('config.txt');
      expect(result[2]).toContain('.config/config/config.txt');
    });

    it('should print help arrays and can be generated multiple times', async () => {
      const dataPath = envPaths(`data${path.sep}data.txt`, { suffix: '' }).data;
      const configPath = envPaths(`config${path.sep}config.txt`, { suffix: '' })
        .config;
      const cachePath = envPaths(`cache${path.sep}cache.txt`, { suffix: '' })
        .cache;

      const dirStructure = {
        [dataPath]: 'dummy content',
        [configPath]: 'dummy content',
        [cachePath]: 'dummy content',
        '/root/config.txt': 'dummy content',
      };
      mockFs(dirStructure);
      const pb = new PathPriorityBuilder();
      pb.findPaths(path.join('test', 'test.txt'))
        .defaultData(path.join('data', 'data.txt'))
        .defaultLog(path.join('log', 'log.txt'))
        .defaultConfig(path.join('config', 'config.txt'))
        .ifEnv({ NODE_ENV: '?(debug)?(development)' })
        .findWithGlob('**/config.txt', {
          startPath: '/',
          maxDepth: 5,
          findAll: true,
        })
        .defaultCache(path.join('cache', 'cache.txt'));

      const arrayPrint = pb.printPriorities();
      expect(arrayPrint.length).toEqual(5);
      expect(arrayPrint[0]).toEqual({
        absolute: true,
        condition: null,
        description: dataPath,
        conditionPass: true,
      });
      expect(arrayPrint[3]).toMatchObject({
        absolute: false,
        condition: { NODE_ENV: '?(debug)?(development)' },
        conditionPass: false,
      });
      const result = await pb.generate();
      expect(result.length).toEqual(3);
      expect(result[0]).toContain('data.txt');
      expect(result[1]).toContain('config.txt');
      expect(result[2]).toContain('cache.txt');

      const arrayStrings2 = pb.printPriorities();
      expect(arrayStrings2.length).toEqual(5);

      const dirStructure2 = {
        [dataPath]: 'dummy content',
      };
      mockFs.restore();
      mockFs(dirStructure2);
      const result2 = await pb.generate();
      expect(result2.length).toEqual(1);
      expect(result2[0]).toContain('data.txt');
    });
  });
});

describe('PathPriorityBuilderSync', () => {
  describe('generateSync', () => {
    afterEach(() => {
      // Reset the mocked fs
      mockFs.restore();
    });

    it('should use arguments from findPaths', () => {
      const dataPath = envPaths(`test${path.sep}test.txt`, { suffix: '' }).data;
      const dirStructure = {
        [dataPath]: 'dummy content',
      };
      mockFs(dirStructure);
      const pb = new PathPriorityBuilderSync();
      const result = pb
        .findPaths(path.join('test', 'test.txt'))
        .defaultData()
        .generateSync();
      expect(result[0]).toContain('test.txt');
    });

    it('should use arguments from finders', () => {
      const dataPath = envPaths(`test${path.sep}test.txt`, { suffix: '' }).data;
      const dirStructure = {
        [dataPath]: 'dummy content',
      };
      mockFs(dirStructure);
      const pb = new PathPriorityBuilderSync();
      const result = pb
        .findPaths()
        .defaultData(path.join('test', 'test.txt'))
        .generateSync();
      expect(result[0]).toContain('test.txt');
    });

    it('should use arguments from pathFinder', () => {
      const dataPath = envPaths(`target${path.sep}target.txt`, { suffix: '' })
        .data;
      const dirStructure = {
        [dataPath]: 'dummy content',
      };
      mockFs(dirStructure);
      const pb = new PathPriorityBuilderSync();
      const result = pb
        .findPaths()
        .defaultData(path.join('target', 'target.txt'))
        .generateSync();
      expect(result[0]).toContain('target.txt');
    });

    it('should prioritize using args from pathFinder', () => {
      const dataPath = envPaths(`target${path.sep}target.txt`, { suffix: '' })
        .data;
      const dirStructure = {
        [dataPath]: 'dummy content',
      };
      mockFs(dirStructure);
      const pb = new PathPriorityBuilderSync();
      const result = pb
        .findPaths(path.join('test', 'test.txt'))
        .defaultData(path.join('target', 'target.txt'))
        .generateSync();
      expect(result[0]).toContain('target.txt');
    });

    it('should find all targets in order', () => {
      const dataPath = envPaths(`data${path.sep}data.txt`, { suffix: '' }).data;
      const configPath = envPaths(`config${path.sep}config.txt`, { suffix: '' })
        .config;

      const dirStructure = {
        [dataPath]: 'dummy content',
        [configPath]: 'dummy content',
      };
      mockFs(dirStructure);
      const pb = new PathPriorityBuilderSync();
      const result = pb
        .findPaths(path.join('test', 'test.txt'))
        .defaultData(path.join('data', 'data.txt'))
        .defaultConfig(path.join('config', 'config.txt'))
        .generateSync();
      expect(result[0]).toContain('data.txt');
      expect(result[1]).toContain('config.txt');
    });

    it('should discard unfound targets and present results in order', () => {
      const dataPath = envPaths(`data${path.sep}data.txt`, { suffix: '' }).data;
      const configPath = envPaths(`config${path.sep}config.txt`, { suffix: '' })
        .config;
      const cachePath = envPaths(`cache${path.sep}cache.txt`, { suffix: '' })
        .cache;

      const dirStructure = {
        '/root/another/config.txt': 'dummy content',
        [dataPath]: 'dummy content',
        [configPath]: 'dummy content',
        [cachePath]: 'dummy content',
        '/root/config.txt': 'dummy content',
      };
      mockFs(dirStructure);
      const pb = new PathPriorityBuilderSync();
      const result = pb
        .findPaths(path.join('test', 'test.txt'))
        .defaultData(path.join('data', 'data.txt'))
        .defaultLog(path.join('log', 'log.txt'))
        .defaultConfig(path.join('config', 'config.txt'))
        .findWithGlob('**/config.txt', {
          startPath: '/',
          maxDepth: 5,
          findAll: true,
        })
        .defaultCache(path.join('cache', 'cache.txt'))
        .generateSync();
      expect(result.length).toEqual(6);
      expect(result[0]).toContain('data.txt');
      expect(result[1]).toContain('config.txt');
      expect(result[2]).toContain('/root/config.txt');
      expect(result[3]).toContain('/root/another/config.txt');
      expect(result[4]).toContain('.config/config/config.txt');
      expect(result[5]).toContain('cache.txt');
    });

    it('should discard envConditions if not both conditions true', () => {
      const dataPath = envPaths(`data${path.sep}data.txt`, { suffix: '' }).data;
      const configPath = envPaths(`config${path.sep}config.txt`, { suffix: '' })
        .config;
      const cachePath = envPaths(`cache${path.sep}cache.txt`, { suffix: '' })
        .cache;

      const dirStructure = {
        [dataPath]: 'dummy content',
        [configPath]: 'dummy content',
        [cachePath]: 'dummy content',
        '/root/config.txt': 'dummy content',
      };
      mockFs(dirStructure);
      process.env.PASS_COND = 'true';
      process.env.OTHER_PASS_COND = 'true';
      const pb = new PathPriorityBuilderSync();
      const result = pb
        .findPaths(path.join('test', 'test.txt'))
        .ifEnv({ PASS_COND: '?(ooglay)?(true)', OTHER_PASS_COND: 'tr?e' })
        .defaultData(path.join('data', 'data.txt'))
        .ifEnv({ NON_EXISTENT: 'notExist' })
        .defaultLog(path.join('log', 'log.txt'))
        .ifEnv({ PASS_COND: 'false', OTHER_PASS_COND: 'false' })
        .defaultConfig(path.join('config', 'config.txt'))
        .findWithGlob('**/config.txt', {
          startPath: '/',
          maxDepth: 5,
          findAll: true,
        })
        .ifEnv({ PASS_COND: 'false', OTHER_PASS_COND: 'true' })
        .defaultCache(path.join('cache', 'cache.txt'))
        .generateSync();
      expect(result.length).toEqual(3);
      expect(result[0]).toContain('data.txt');
      expect(result[1]).toContain('config.txt');
      expect(result[2]).toContain('.config/config/config.txt');
    });

    it('should print help arrays and can be generated multiple times', () => {
      const dataPath = envPaths(`data${path.sep}data.txt`, { suffix: '' }).data;
      const configPath = envPaths(`config${path.sep}config.txt`, { suffix: '' })
        .config;
      const cachePath = envPaths(`cache${path.sep}cache.txt`, { suffix: '' })
        .cache;

      const dirStructure = {
        [dataPath]: 'dummy content',
        [configPath]: 'dummy content',
        [cachePath]: 'dummy content',
        '/root/config.txt': 'dummy content',
      };
      mockFs(dirStructure);
      const pb = new PathPriorityBuilderSync();
      pb.findPaths(path.join('test', 'test.txt'))
        .defaultData(path.join('data', 'data.txt'))
        .defaultLog(path.join('log', 'log.txt'))
        .defaultConfig(path.join('config', 'config.txt'))
        .ifEnv({ NODE_ENV: '?(debug)?(development)' })
        .findWithGlob('**/config.txt', {
          startPath: '/',
          maxDepth: 5,
          findAll: true,
        })
        .defaultCache(path.join('cache', 'cache.txt'));

      const arrayPrint = pb.printPriorities();
      expect(arrayPrint.length).toEqual(5);
      expect(arrayPrint[0]).toEqual({
        absolute: true,
        condition: null,
        description: dataPath,
        conditionPass: true,
      });
      expect(arrayPrint[3]).toMatchObject({
        absolute: false,
        condition: { NODE_ENV: '?(debug)?(development)' },
        conditionPass: false,
      });
      const result = pb.generateSync();
      expect(result.length).toEqual(3);
      expect(result[0]).toContain('data.txt');
      expect(result[1]).toContain('config.txt');
      expect(result[2]).toContain('cache.txt');

      const arrayStrings2 = pb.printPriorities();
      expect(arrayStrings2.length).toEqual(5);

      const dirStructure2 = {
        [dataPath]: 'dummy content',
      };
      mockFs.restore();
      mockFs(dirStructure2);
      const result2 = pb.generateSync();
      expect(result2.length).toEqual(1);
      expect(result2[0]).toContain('data.txt');
    });
  });
});
