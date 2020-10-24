import {
  defaultDataFn,
  defaultConfigFn,
  defaultCacheFn,
  defaultLogFn,
  defaultTempFn,
  defaultHomeFn,
} from './default-locations';
import mockFs from 'mock-fs';
import envPaths from 'env-paths';
import path from 'path';
import os from 'os';

describe('finders', () => {
  describe('defaultData', () => {
    afterEach(() => {
      // Reset the mocked fs
      mockFs.restore();
    });

    it('should return string if file is found', () => {
      const dataPath = envPaths(`test${path.sep}test.txt`, { suffix: '' }).data;
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = defaultDataFn('test.txt', 'test');
      return expect(result).resolves.toContain('test.txt');
    });
    it('should throw error if file not found', () => {
      const dataPath = envPaths('test', { suffix: '' }).data;
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = defaultDataFn('test.txt', 'test');
      return expect(result).rejects.toThrowError();
    });
    it('should throw error if folder not found', () => {
      const dataPath = envPaths('test.txt', { suffix: '' }).data;
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = defaultDataFn('test.txt', 'test');
      return expect(result).rejects.toThrowError();
    });
    it('should throw error if file and / or folder not supplied', async () => {
      try {
        await defaultDataFn('test.txt');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
      try {
        await defaultDataFn();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('defaultConfig', () => {
    afterEach(() => {
      // Reset the mocked fs
      mockFs.restore();
    });

    it('should return string if file is found', () => {
      const dataPath = envPaths(`test${path.sep}test.txt`, { suffix: '' })
        .config;
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = defaultConfigFn('test.txt', 'test');
      return expect(result).resolves.toContain('test.txt');
    });
    it('should throw error if file not found', () => {
      const dataPath = envPaths('test', { suffix: '' }).config;
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = defaultConfigFn('test.txt', 'test');
      return expect(result).rejects.toThrowError();
    });
    it('should throw error if folder not found', () => {
      const dataPath = envPaths('test.txt', { suffix: '' }).config;
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = defaultConfigFn('test.txt', 'test');
      return expect(result).rejects.toThrowError();
    });
    it('should throw error if file and / or folder not supplied', async () => {
      try {
        await defaultConfigFn('test.txt');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
      try {
        await defaultConfigFn();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('defaultCache', () => {
    afterEach(() => {
      // Reset the mocked fs
      mockFs.restore();
    });

    it('should return string if file is found', () => {
      const dataPath = envPaths(`test${path.sep}test.txt`, { suffix: '' })
        .cache;
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = defaultCacheFn('test.txt', 'test');
      return expect(result).resolves.toContain('test.txt');
    });
    it('should throw error if file not found', () => {
      const dataPath = envPaths('test', { suffix: '' }).cache;
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = defaultCacheFn('test.txt', 'test');
      return expect(result).rejects.toThrowError();
    });
    it('should throw error if folder not found', () => {
      const dataPath = envPaths('test.txt', { suffix: '' }).cache;
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = defaultCacheFn('test.txt', 'test');
      return expect(result).rejects.toThrowError();
    });
    it('should throw error if file and / or folder not supplied', async () => {
      try {
        await defaultCacheFn('test.txt');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
      try {
        await defaultCacheFn();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('defaultLog', () => {
    afterEach(() => {
      // Reset the mocked fs
      mockFs.restore();
    });

    it('should return string if file is found', () => {
      const dataPath = envPaths(`test${path.sep}test.txt`, { suffix: '' }).log;
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = defaultLogFn('test.txt', 'test');
      return expect(result).resolves.toContain('test.txt');
    });
    it('should throw error if file not found', () => {
      const dataPath = envPaths('test', { suffix: '' }).log;
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = defaultLogFn('test.txt', 'test');
      return expect(result).rejects.toThrowError();
    });
    it('should throw error if folder not found', () => {
      const dataPath = envPaths('test.txt', { suffix: '' }).log;
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = defaultLogFn('test.txt', 'test');
      return expect(result).rejects.toThrowError();
    });
    it('should throw error if file and / or folder not supplied', async () => {
      try {
        await defaultLogFn('test.txt');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
      try {
        await defaultLogFn();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('defaultTemp', () => {
    afterEach(() => {
      // Reset the mocked fs
      mockFs.restore();
    });

    it('should return string if file is found', () => {
      const dataPath = envPaths(`test${path.sep}test.txt`, { suffix: '' }).temp;
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = defaultTempFn('test.txt', 'test');
      return expect(result).resolves.toContain('test.txt');
    });
    it('should throw error if file not found', () => {
      const dataPath = envPaths('test', { suffix: '' }).temp;
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = defaultTempFn('test.txt', 'test');
      return expect(result).rejects.toThrowError();
    });
    it('should throw error if folder not found', () => {
      const dataPath = envPaths('test.txt', { suffix: '' }).temp;
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = defaultTempFn('test.txt', 'test');
      return expect(result).rejects.toThrowError();
    });
    it('should throw error if file and / or folder not supplied', async () => {
      try {
        await defaultTempFn('test.txt');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
      try {
        await defaultTempFn();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('defaultHome', () => {
    afterEach(() => {
      // Reset the mocked fs
      mockFs.restore();
    });

    it('should return string if file is found', () => {
      const dataPath = `${path.join(os.homedir(), 'test', 'test.txt')}`;
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = defaultHomeFn('test.txt', 'test');
      return expect(result).resolves.toContain('test.txt');
    });
    it('should throw error if file not found', () => {
      const dataPath = `${path.join(os.homedir(), 'test')}`;
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = defaultHomeFn('test.txt', 'test');
      return expect(result).rejects.toThrowError();
    });
    it('should throw error if folder not found', () => {
      const dataPath = `${path.join(os.homedir(), 'test.txt')}`;
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = defaultHomeFn('test.txt', 'test');
      return expect(result).rejects.toThrowError();
    });
    it('should find file in home directory if folder not supplied', () => {
      const dataPath = `${path.join(os.homedir(), '.test.txt')}`;
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = defaultHomeFn('.test.txt');
      return expect(result).resolves.toContain('test.txt');
    });
    it('should throw error if file and folder not supplied', async () => {
      try {
        await defaultHomeFn();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });
});
