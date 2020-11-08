import {
  PathPriorityBuilder,
  PathPriorityBuilderSync,
  pathMethodInjector,
  FinderCallback,
  FinderCallbackSync,
} from './../path-priority-builder';
import envPaths from 'env-paths';
import path from 'path';
import fs, { promises as fsAsync } from 'fs';
import { constants } from 'fs';
import os from 'os';

declare module './../path-priority-builder' {
  interface PathPriorityBuilder {
    defaultData: GeneratePathMethod;
    defaultConfig: GeneratePathMethod;
    defaultCache: GeneratePathMethod;
    defaultLog: GeneratePathMethod;
    defaultTemp: GeneratePathMethod;
    defaultHome: GeneratePathMethod;
  }

  interface PathPriorityBuilderSync {
    defaultData: GeneratePathMethodSync;
    defaultConfig: GeneratePathMethodSync;
    defaultCache: GeneratePathMethodSync;
    defaultLog: GeneratePathMethodSync;
    defaultTemp: GeneratePathMethodSync;
    defaultHome: GeneratePathMethodSync;
  }
}

const defaultCallbackMaker = (pathToFind: keyof envPaths.Paths) => {
  return (fileName?: string) => {
    if (!fileName) {
      return Promise.reject(
        new Error(
          'fileName must be specified in findPaths(fileName) or in this function',
        ),
      );
    }

    const filePath = envPaths(fileName, { suffix: '' })[pathToFind];

    const promiseResult = fsAsync.access(filePath, constants.F_OK).then(() => {
      return filePath;
    });

    return promiseResult;
  };
};

const defaultCallbackMakerSync = (pathToFind: keyof envPaths.Paths) => {
  return (fileName?: string) => {
    if (!fileName) {
      throw new Error(
        'The argument fileName must be specified either in findPaths(fileName) or in this function',
      );
    }

    const filePath = envPaths(fileName, { suffix: '' })[pathToFind];

    fs.accessSync(filePath, constants.F_OK);

    return filePath;
  };
};

export const defaultDataFn = defaultCallbackMaker('data');
export const defaultDataSyncFn = defaultCallbackMakerSync('data');
export const defaultConfigFn = defaultCallbackMaker('config');
export const defaultConfigSyncFn = defaultCallbackMakerSync('config');
export const defaultCacheFn = defaultCallbackMaker('cache');
export const defaultCacheSyncFn = defaultCallbackMakerSync('cache');
export const defaultLogFn = defaultCallbackMaker('log');
export const defaultLogSyncFn = defaultCallbackMakerSync('log');
export const defaultTempFn = defaultCallbackMaker('temp');
export const defaultTempSyncFn = defaultCallbackMakerSync('temp');

export const defaultHomeFn: FinderCallback = (fileName?: string) => {
  if (!fileName) {
    return Promise.reject(
      new Error(
        'The argument fileName must be specified either in findPaths(fileName) or in defaultHome',
      ),
    );
  }

  const filePath = `${path.join(os.homedir(), fileName)}`;

  const promiseResult = fsAsync.access(filePath, constants.F_OK).then(() => {
    return filePath;
  });

  return promiseResult;
};

export const defaultHomeSyncFn: FinderCallbackSync = (fileName?: string) => {
  if (!fileName) {
    throw new Error(
      'The argument fileName must be specified either in findPaths(fileName) or in defaultHomeSyncFn',
    );
  }

  const filePath = `${path.join(os.homedir(), fileName)}`;

  fs.accessSync(filePath, constants.F_OK);

  return filePath;
};

PathPriorityBuilder.prototype.defaultData = pathMethodInjector(
  defaultDataFn,
  (fileName?: string) => `${envPaths(fileName as string, { suffix: '' }).data}`,
);
PathPriorityBuilderSync.prototype.defaultData = pathMethodInjector(
  defaultDataSyncFn,
  (fileName?: string) =>
    `${envPaths(fileName as string, { suffix: '' }).config}`,
);

PathPriorityBuilder.prototype.defaultConfig = pathMethodInjector(
  defaultConfigFn,
  (fileName?: string) =>
    `${envPaths(fileName as string, { suffix: '' }).config}`,
);
PathPriorityBuilderSync.prototype.defaultConfig = pathMethodInjector(
  defaultConfigSyncFn,
  (fileName?: string) =>
    `${envPaths(fileName as string, { suffix: '' }).config}`,
);

PathPriorityBuilder.prototype.defaultCache = pathMethodInjector(
  defaultCacheFn,
  (fileName?: string) =>
    `${envPaths(fileName as string, { suffix: '' }).cache}`,
);
PathPriorityBuilderSync.prototype.defaultCache = pathMethodInjector(
  defaultCacheSyncFn,
  (fileName?: string) =>
    `${envPaths(fileName as string, { suffix: '' }).cache}`,
);

PathPriorityBuilder.prototype.defaultLog = pathMethodInjector(
  defaultLogFn,
  (fileName?: string) => `${envPaths(fileName as string, { suffix: '' }).log}`,
);
PathPriorityBuilderSync.prototype.defaultLog = pathMethodInjector(
  defaultLogSyncFn,
  (fileName?: string) => `${envPaths(fileName as string, { suffix: '' }).log}`,
);

PathPriorityBuilder.prototype.defaultTemp = pathMethodInjector(
  defaultTempFn,
  (fileName?: string) => `${envPaths(fileName as string, { suffix: '' }).temp}`,
);
PathPriorityBuilderSync.prototype.defaultTemp = pathMethodInjector(
  defaultTempSyncFn,
  (fileName?: string) => `${envPaths(fileName as string, { suffix: '' }).temp}`,
);

PathPriorityBuilder.prototype.defaultHome = pathMethodInjector(
  defaultHomeFn,
  (fileName?: string) => `${path.join(os.homedir(), fileName as string)}`,
);
PathPriorityBuilderSync.prototype.defaultHome = pathMethodInjector(
  defaultHomeSyncFn,
  (fileName?: string) => `${path.join(os.homedir(), fileName as string)}`,
);
