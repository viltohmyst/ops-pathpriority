/* eslint-disable @typescript-eslint/no-explicit-any */
import { pathFn, pathSyncFn } from './path-locations';
import mockFs from 'mock-fs';
import path from 'path';

describe('finders', () => {
  describe('pathFn', () => {
    afterEach(() => {
      // Reset the mocked fs
      mockFs.restore();
    });

    it('should return string if file is found', () => {
      const dataPath = '/test/test.txt';
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = pathFn('/test/test.txt');
      return expect(result).resolves.toContain('test.txt');
    });
    it('should throw error if file not found', () => {
      const dataPath = '/test/test.txt';
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = pathFn('/test/nofile.txt');
      return expect(result).rejects.toThrowError();
    });
    it('should throw error if folder not found', () => {
      const dataPath = '/nofolder/test.txt';
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = pathFn('/test/test.txt');
      return expect(result).rejects.toThrowError();
    });
    it('should find file in relative directory', () => {
      const dataPath = `${path.resolve(process.cwd(), '../')}/test.txt`;
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = pathFn('../test.txt');
      return expect(result).resolves.toContain('test.txt');
    });
    it('should throw error if file and folder not supplied', async () => {
      try {
        await pathFn();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('appRootSyncFn', () => {
    afterEach(() => {
      // Reset the mocked fs
      mockFs.restore();
    });

    it('should return string if file is found', () => {
      const dataPath = '/test/test.txt';
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = pathSyncFn('/test/test.txt');
      expect(result).toContain('test.txt');
    });
    it('should throw error if file not found', () => {
      const dataPath = '/test/test.txt';
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      expect(() => pathSyncFn('/test/nofile.txt')).toThrowError();
    });
    it('should throw error if folder not found', () => {
      const dataPath = '/test/test.txt';
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      expect(() => pathSyncFn('/nofolder/test.txt')).toThrowError();
    });
    it('should find file in relative directory', () => {
      const dataPath = `${path.resolve(process.cwd(), '../')}/test.txt`;
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = pathSyncFn('../test.txt');
      expect(result).toContain('test.txt');
    });
    it('should throw error if file and folder not supplied', async () => {
      try {
        pathSyncFn();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });
});
