import { appRootFn } from './project-locations';
import mockFs from 'mock-fs';
import * as root from 'app-root-path';
import path from 'path';

describe('finders', () => {
  describe('appRootFn', () => {
    afterEach(() => {
      // Reset the mocked fs
      mockFs.restore();
    });

    it('should return string if file is found', () => {
      const dataPath = path.join(root.path, 'test', 'test.txt');
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = appRootFn('test.txt', 'test');
      return expect(result).resolves.toContain('test.txt');
    });
    it('should throw error if file not found', () => {
      const dataPath = path.join(root.path, 'test');
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = appRootFn('test.txt', 'test');
      return expect(result).rejects.toThrowError();
    });
    it('should throw error if folder not found', () => {
      const dataPath = path.join(root.path, 'test.txt');
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = appRootFn('test.txt', 'test');
      return expect(result).rejects.toThrowError();
    });
    it('should find file in root directory if folder not supplied', () => {
      const dataPath = path.join(root.path, '.test.txt');
      const dirStructure: any = { [dataPath]: 'dummy content' };
      mockFs(dirStructure);
      const result = appRootFn('.test.txt');
      return expect(result).resolves.toContain('.test.txt');
    });
    it('should throw error if file and folder not supplied', async () => {
      try {
        await appRootFn();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });
});
