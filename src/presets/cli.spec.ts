import { PathPriorityBuilder } from './../path-priority-builder';
import './cli';
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

    it('should discard unfound targets', async () => {
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
        .defaultLog(path.join('log', 'log.txt'))
        .defaultConfig(path.join('config', 'config.txt'))
        .findWithGlob('**/config.txt', { startPath: '/' })
        .generate();
      expect(result[0]).toContain('data.txt');
      expect(result[1]).toContain('config.txt');
    });
  });
});
