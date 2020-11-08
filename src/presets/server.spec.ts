import {
  PathPriorityBuilder,
  PathPriorityBuilderSync,
} from './../path-priority-builder';
import './server';
import * as root from 'app-root-path';
import os from 'os';
import mockFs from 'mock-fs';

describe('PathPriorityBuilder', () => {
  const rootPath = root.path;
  const dirStructure = {
    '/mycli/config.conf': 'dummy content',
    '/home/mycli/config.conf': 'dummy content',
    '/home/otheruser/child/mycli/config.conf': 'dummy content',
    [`${os.homedir()}/mycli/config.conf`]: 'dummy content',
    [`${os.homedir()}/.config/mycli/config.conf`]: 'dummy content',
    [`${rootPath}/mycli/config.conf`]: 'dummy content',
    [`${rootPath}/node_modules/module/other.js`]: 'dummy content',
    [`${rootPath}/src/index.js`]: 'dummy content',
    [`${rootPath}/package.json`]: 'dummy content',
  };

  describe('useServerPreset', () => {
    afterEach(() => {
      // Reset the mocked fs
      mockFs.restore();
    });

    it('should return the correct priorities', async () => {
      mockFs(dirStructure);

      const spy = jest.spyOn(process, 'cwd');
      spy.mockReturnValue('/home/otheruser/');
      process.env.NODE_ENV = 'development';

      const pb = new PathPriorityBuilder();
      const result = await pb.useServerPreset('mycli/config.conf').generate();
      expect(result.length).toEqual(4);
      expect(result[0]).toContain(`${rootPath}/mycli/config.conf`);
      expect(result[1]).toContain('/home/mycli/config.conf');
      expect(result[2]).toContain('/home/otheruser/child/mycli/config.conf');
      expect(result[3]).toContain(`${os.homedir()}/.config/mycli/config.conf`);

      spy.mockRestore();
    });
  });

  describe('useServerPresetSync', () => {
    afterEach(() => {
      // Reset the mocked fs
      mockFs.restore();
    });

    it('should return the correct priorities', () => {
      mockFs(dirStructure);

      const spy = jest.spyOn(process, 'cwd');
      spy.mockReturnValue('/home/otheruser/');
      process.env.NODE_ENV = 'development';

      const pb = new PathPriorityBuilderSync();
      const result = pb.useServerPreset('mycli/config.conf').generateSync();
      expect(result.length).toEqual(4);
      expect(result[0]).toContain(`${rootPath}/mycli/config.conf`);
      expect(result[1]).toContain('/home/mycli/config.conf');
      expect(result[2]).toContain('/home/otheruser/child/mycli/config.conf');
      expect(result[3]).toContain(`${os.homedir()}/.config/mycli/config.conf`);

      spy.mockRestore();
    });
  });
});
