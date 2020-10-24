import { findWithGlobFn, findInParentsFn } from './relative-locations';
import mockFs from 'mock-fs';

describe('finders', () => {
  const dirStructure = {
    '/root/first/target.txt': 'dummy content',
    '/root/first/second/target.txt': 'dummy content',
    '/root/cwd/first/target.txt': 'dummy content',
    '/root/cwd/firstb/target.txt': 'dummy content',
    '/root/cwd/firstb/second/target.txt': 'dummy content',
    '/root/firstb/target.txt': 'dummy content',
    '/root/firstb/secondb/target.txt': 'dummy content',
    '/root/this/is/a/deep/folder/deeptarget.txt': 'dummy content',
    '/root/this/parenttarget.txt': 'dummy content',
  };
  describe('findWithGlob', () => {
    afterEach(() => {
      // Reset the mocked fs
      mockFs.restore();
    });

    it('should use startPath as directory to crawl', () => {
      mockFs(dirStructure);
      const result = findWithGlobFn('./**/target.txt', { startPath: '/' });
      return expect(result).resolves.toContain('/root/first/target.txt');
    });

    it('should default to CWD as directory to crawl if no startPath given', async () => {
      mockFs(dirStructure);
      const spy = jest.spyOn(process, 'cwd');
      spy.mockReturnValue('/root/cwd');

      const result = await findWithGlobFn('./**/target.txt');
      expect(result).toContain('/root/cwd/first/target.txt');

      spy.mockRestore();
    });

    it('should throw error if file not found', () => {
      mockFs(dirStructure);
      const result = findWithGlobFn('./**/target.json', { startPath: '/' });
      return expect(result).rejects.toThrowError();
    });

    it('should throw error if file and folder not supplied', async () => {
      try {
        await findWithGlobFn();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    it('should extend max depth if specified', async () => {
      mockFs(dirStructure);
      const result = await findWithGlobFn('./**/deeptarget.txt', {
        startPath: '/',
        maxDepth: 6,
      });
      expect(result).toContain('/root/this/is/a/deep/folder/deeptarget.txt');
      try {
        await findWithGlobFn('./**/deeptarget.txt', '/');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('findInParent', () => {
    afterEach(() => {
      // Reset the mocked fs
      mockFs.restore();
    });

    it('should return string if file is found', async () => {
      mockFs(dirStructure);
      const spy = jest.spyOn(process, 'cwd');
      spy.mockReturnValue('/root/this/is/a/deep/folder/');

      const result = await findInParentsFn('parenttarget.txt');
      expect(result).toContain('/root/this/parenttarget.txt');

      spy.mockRestore();
    });

    it('should throw error if file not found', async () => {
      mockFs(dirStructure);
      const spy = jest.spyOn(process, 'cwd');
      spy.mockReturnValue('/root/this/is/a/deep/folder/');

      try {
        await findInParentsFn('parenttarget.json');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }

      spy.mockRestore();
    });

    it('should throw error if file and / or folder not supplied', async () => {
      try {
        await findInParentsFn();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });
});
