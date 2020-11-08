import {
  defaultDataFn,
  defaultDataSyncFn,
  defaultConfigFn,
  defaultConfigSyncFn,
  defaultCacheFn,
  defaultCacheSyncFn,
  defaultLogFn,
  defaultLogSyncFn,
  defaultTempFn,
  defaultTempSyncFn,
  defaultHomeFn,
  defaultHomeSyncFn,
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
      const result = defaultDataFn('test/test.txt');
      return expect(result).resolves.toContain('test.txt');
    });
    it('should throw error if file not found', () => {
      const dataPath = envPaths('test', { suffix: '' }).data;
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = defaultDataFn('test/test.txt');
      return expect(result).rejects.toThrowError();
    });
    it('should throw error if folder not found', () => {
      const dataPath = envPaths('test.txt', { suffix: '' }).data;
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = defaultDataFn('test/test.txt');
      return expect(result).rejects.toThrowError();
    });
    it('should throw error if file and / or folder not supplied', async () => {
      try {
        await defaultDataFn();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('defaultDataSync', () => {
    afterEach(() => {
      // Reset the mocked fs
      mockFs.restore();
    });

    it('should return string if file is found', () => {
      const dataPath = envPaths(`test${path.sep}test.txt`, { suffix: '' }).data;
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = defaultDataSyncFn('test/test.txt');
      expect(result).toContain('test.txt');
    });
    it('should throw error if file not found', () => {
      const dataPath = envPaths('test', { suffix: '' }).data;
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      expect(() => defaultDataSyncFn('test/test.txt')).toThrowError();
    });
    it('should throw error if folder not found', () => {
      const dataPath = envPaths('test.txt', { suffix: '' }).data;
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      expect(() => defaultDataSyncFn('test/test.txt')).toThrowError();
    });
    it('should throw error if file and / or folder not supplied', () => {
      try {
        defaultDataSyncFn();
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
      const result = defaultConfigFn('test/test.txt');
      return expect(result).resolves.toContain('test.txt');
    });
    it('should throw error if file not found', () => {
      const dataPath = envPaths('test', { suffix: '' }).config;
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = defaultConfigFn('test/test.txt');
      return expect(result).rejects.toThrowError();
    });
    it('should throw error if folder not found', () => {
      const dataPath = envPaths('test.txt', { suffix: '' }).config;
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = defaultConfigFn('test/test.txt');
      return expect(result).rejects.toThrowError();
    });
    it('should throw error if file and / or folder not supplied', async () => {
      try {
        await defaultConfigFn();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('defaultConfigSync', () => {
    afterEach(() => {
      // Reset the mocked fs
      mockFs.restore();
    });

    it('should return string if file is found', () => {
      const configPath = envPaths(`test${path.sep}test.txt`, { suffix: '' })
        .config;
      const dirStructure: any = { [configPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = defaultConfigSyncFn('test/test.txt');
      expect(result).toContain('test.txt');
    });
    it('should throw error if file not found', () => {
      const configPath = envPaths('test', { suffix: '' }).config;
      const dirStructure: any = { [configPath]: 'dummy content' };
      mockFs(dirStructure);
      expect(() => defaultConfigSyncFn('test/test.txt')).toThrowError();
    });
    it('should throw error if folder not found', () => {
      const configPath = envPaths('test.txt', { suffix: '' }).config;
      const dirStructure: any = { [configPath]: 'dummy content' };
      mockFs(dirStructure);
      expect(() => defaultConfigSyncFn('test/test.txt')).toThrowError();
    });
    it('should throw error if file and / or folder not supplied', () => {
      try {
        defaultConfigSyncFn();
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
      const result = defaultCacheFn('test/test.txt');
      return expect(result).resolves.toContain('test.txt');
    });
    it('should throw error if file not found', () => {
      const dataPath = envPaths('test', { suffix: '' }).cache;
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = defaultCacheFn('test/test.txt');
      return expect(result).rejects.toThrowError();
    });
    it('should throw error if folder not found', () => {
      const dataPath = envPaths('test.txt', { suffix: '' }).cache;
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = defaultCacheFn('test/test.txt');
      return expect(result).rejects.toThrowError();
    });
    it('should throw error if file and / or folder not supplied', async () => {
      try {
        await defaultCacheFn();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('defaultCacheSync', () => {
    afterEach(() => {
      // Reset the mocked fs
      mockFs.restore();
    });

    it('should return string if file is found', () => {
      const cachePath = envPaths(`test${path.sep}test.txt`, { suffix: '' })
        .cache;
      const dirStructure: any = { [cachePath]: 'dummy content' };
      mockFs(dirStructure);
      const result = defaultCacheSyncFn('test/test.txt');
      expect(result).toContain('test.txt');
    });
    it('should throw error if file not found', () => {
      const cachePath = envPaths('test', { suffix: '' }).cache;
      const dirStructure: any = { [cachePath]: 'dummy content' };
      mockFs(dirStructure);
      expect(() => defaultCacheSyncFn('test/test.txt')).toThrowError();
    });
    it('should throw error if folder not found', () => {
      const cachePath = envPaths('test.txt', { suffix: '' }).cache;
      const dirStructure: any = { [cachePath]: 'dummy content' };
      mockFs(dirStructure);
      expect(() => defaultCacheSyncFn('test/test.txt')).toThrowError();
    });
    it('should throw error if file and / or folder not supplied', () => {
      try {
        defaultCacheSyncFn();
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
      const result = defaultLogFn('test/test.txt');
      return expect(result).resolves.toContain('test.txt');
    });
    it('should throw error if file not found', () => {
      const dataPath = envPaths('test', { suffix: '' }).log;
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = defaultLogFn('test/test.txt');
      return expect(result).rejects.toThrowError();
    });
    it('should throw error if folder not found', () => {
      const dataPath = envPaths('test.txt', { suffix: '' }).log;
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = defaultLogFn('test/test.txt');
      return expect(result).rejects.toThrowError();
    });
    it('should throw error if file and / or folder not supplied', async () => {
      try {
        await defaultLogFn();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('defaultLogSync', () => {
    afterEach(() => {
      // Reset the mocked fs
      mockFs.restore();
    });

    it('should return string if file is found', () => {
      const logPath = envPaths(`test${path.sep}test.txt`, { suffix: '' }).log;
      const dirStructure: any = { [logPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = defaultLogSyncFn('test/test.txt');
      expect(result).toContain('test.txt');
    });
    it('should throw error if file not found', () => {
      const logPath = envPaths('test', { suffix: '' }).log;
      const dirStructure: any = { [logPath]: 'dummy content' };
      mockFs(dirStructure);
      expect(() => defaultLogSyncFn('test/test.txt')).toThrowError();
    });
    it('should throw error if folder not found', () => {
      const logPath = envPaths('test.txt', { suffix: '' }).log;
      const dirStructure: any = { [logPath]: 'dummy content' };
      mockFs(dirStructure);
      expect(() => defaultLogSyncFn('test/test.txt')).toThrowError();
    });
    it('should throw error if file and / or folder not supplied', () => {
      try {
        defaultLogSyncFn();
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
      const result = defaultTempFn('test/test.txt');
      return expect(result).resolves.toContain('test.txt');
    });
    it('should throw error if file not found', () => {
      const dataPath = envPaths('test', { suffix: '' }).temp;
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = defaultTempFn('test/test.txt');
      return expect(result).rejects.toThrowError();
    });
    it('should throw error if folder not found', () => {
      const dataPath = envPaths('test.txt', { suffix: '' }).temp;
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = defaultTempFn('test/test.txt');
      return expect(result).rejects.toThrowError();
    });
    it('should throw error if file and / or folder not supplied', async () => {
      try {
        await defaultTempFn();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('defaultTempSync', () => {
    afterEach(() => {
      // Reset the mocked fs
      mockFs.restore();
    });

    it('should return string if file is found', () => {
      const tempPath = envPaths(`test${path.sep}test.txt`, { suffix: '' }).temp;
      const dirStructure: any = { [tempPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = defaultTempSyncFn('test/test.txt');
      expect(result).toContain('test.txt');
    });
    it('should throw error if file not found', () => {
      const tempPath = envPaths('test', { suffix: '' }).temp;
      const dirStructure: any = { [tempPath]: 'dummy content' };
      mockFs(dirStructure);
      expect(() => defaultTempSyncFn('test/test.txt')).toThrowError();
    });
    it('should throw error if folder not found', () => {
      const tempPath = envPaths('test.txt', { suffix: '' }).temp;
      const dirStructure: any = { [tempPath]: 'dummy content' };
      mockFs(dirStructure);
      expect(() => defaultTempSyncFn('test/test.txt')).toThrowError();
    });
    it('should throw error if file and / or folder not supplied', () => {
      try {
        defaultTempSyncFn();
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
      const result = defaultHomeFn('test/test.txt');
      return expect(result).resolves.toContain('test.txt');
    });
    it('should throw error if file not found', () => {
      const dataPath = `${path.join(os.homedir(), 'test')}`;
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = defaultHomeFn('test/test.txt');
      return expect(result).rejects.toThrowError();
    });
    it('should throw error if folder not found', () => {
      const dataPath = `${path.join(os.homedir(), 'test.txt')}`;
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = defaultHomeFn('test/test.txt');
      return expect(result).rejects.toThrowError();
    });
    it('should find file in home directory if folder not supplied', () => {
      const dataPath = `${path.join(os.homedir(), '.test.txt')}`;
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = defaultHomeFn('.test.txt');
      return expect(result).resolves.toContain('.test.txt');
    });
    it('should throw error if file and folder not supplied', async () => {
      try {
        await defaultHomeFn();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('defaultHomeSync', () => {
    afterEach(() => {
      // Reset the mocked fs
      mockFs.restore();
    });

    it('should return string if file is found', () => {
      const dataPath = `${path.join(os.homedir(), 'test', 'test.txt')}`;
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = defaultHomeSyncFn('test/test.txt');
      expect(result).toContain('test.txt');
    });
    it('should throw error if file not found', () => {
      const dataPath = `${path.join(os.homedir(), 'test')}`;
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      expect(() => defaultHomeSyncFn('test/test.txt')).toThrowError();
    });
    it('should throw error if folder not found', () => {
      const dataPath = `${path.join(os.homedir(), 'test.txt')}`;
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      expect(() => defaultHomeSyncFn('test/test.txt')).toThrowError();
    });
    it('should find file in home directory if folder not supplied', () => {
      const dataPath = `${path.join(os.homedir(), '.test.txt')}`;
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = defaultHomeSyncFn('.test.txt');
      expect(result).toContain('.test.txt');
    });
    it('should throw error if file and folder not supplied', () => {
      try {
        defaultHomeSyncFn();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });
});
