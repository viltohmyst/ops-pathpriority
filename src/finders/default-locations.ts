import {
  PathPriorityBuilder,
  pathMethodInjector,
  FinderCallback,
} from './../path-priority-builder';
import envPaths from 'env-paths';
import path from 'path';
import fs from 'fs/promises';
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
}

const defaultCallbackMaker = (pathToFind: keyof envPaths.Paths) => {
  return (fileName?: string, folderName?: string) => {
    if (!fileName || !folderName) {
      return Promise.reject(
        new Error(
          'To conform with XDGDefaults, both fileName and folderName must be specified in findPaths(fileName, folderName) or in this function',
        ),
      );
    }

    const dir = `${folderName}${path.sep}${fileName}`;
    const filePath = envPaths(dir, { suffix: '' })[pathToFind];

    const promiseResult = fs
      .access(filePath, constants.W_OK | constants.R_OK)
      .then(() => {
        return filePath;
      });

    return promiseResult;
  };
};
export const defaultDataFn = defaultCallbackMaker('data');
export const defaultConfigFn = defaultCallbackMaker('config');
export const defaultCacheFn = defaultCallbackMaker('cache');
export const defaultLogFn = defaultCallbackMaker('log');
export const defaultTempFn = defaultCallbackMaker('temp');

export const defaultHomeFn: FinderCallback = (
  fileName?: string,
  folderName?: string,
) => {
  if (!fileName) {
    return Promise.reject(
      new Error(
        'The argument fileName must be specified either in findPaths(fileName) or in defaultHome',
      ),
    );
  }

  const usedFolderName = folderName || '.';

  const filePath = `${path.join(os.homedir(), usedFolderName, fileName)}`;

  const promiseResult = fs
    .access(filePath, constants.W_OK | constants.R_OK)
    .then(() => {
      return filePath;
    });

  return promiseResult;
};

PathPriorityBuilder.prototype.defaultData = pathMethodInjector(defaultDataFn);
PathPriorityBuilder.prototype.defaultConfig = pathMethodInjector(
  defaultConfigFn,
);
PathPriorityBuilder.prototype.defaultCache = pathMethodInjector(defaultCacheFn);
PathPriorityBuilder.prototype.defaultLog = pathMethodInjector(defaultLogFn);
PathPriorityBuilder.prototype.defaultTemp = pathMethodInjector(defaultTempFn);
PathPriorityBuilder.prototype.defaultHome = pathMethodInjector(defaultHomeFn);
