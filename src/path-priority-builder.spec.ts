import { PathPriorityBuilder } from './path-priority-builder';
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

    it('should discard envConditions', async () => {
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

    it('should discard print help arrays and can be generated multiple times', async () => {
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
        .findWithGlob('**/config.txt', {
          startPath: '/',
          maxDepth: 5,
          findAll: true,
        })
        .defaultCache(path.join('cache', 'cache.txt'));

      const arrayStrings1 = pb.printArrayOfPriorities();
      expect(arrayStrings1.length).toEqual(5);

      const result = await pb.generate();
      expect(result.length).toEqual(5);
      expect(result[0]).toContain('data.txt');
      expect(result[1]).toContain('config.txt');
      expect(result[2]).toContain('/root/config.txt');
      expect(result[3]).toContain('.config/config/config.txt');
      expect(result[4]).toContain('cache.txt');

      const arrayStrings2 = pb.printArrayOfPriorities();
      expect(arrayStrings2.length).toEqual(5);

      const dirStructure2 = {
        '/root/config.txt': 'dummy content',
      };
      mockFs.restore();
      mockFs(dirStructure2);
      const result2 = await pb.generate();
      expect(result2.length).toEqual(1);
      expect(result2[0]).toContain('cache.txt');
    });
  });
});
