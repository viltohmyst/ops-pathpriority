import {
  PathPriorityBuilder,
  PathPriorityBuilderSync,
  pathMethodInjector,
  FinderCallback,
  FinderCallbackSync,
} from './../path-priority-builder';
import path from 'path';
import fs, { promises as fsAsync } from 'fs';
import { constants } from 'fs';

declare module './../path-priority-builder' {
  interface PathPriorityBuilder {
    path: GeneratePathMethod;
  }

  interface PathPriorityBuilderSync {
    path: GeneratePathMethodSync;
  }
}

export const pathFn: FinderCallback = (fileName?: string) => {
  if (!fileName) {
    return Promise.reject(
      new Error(
        'The argument fileName must be specified either in findPaths(fileName) or in path',
      ),
    );
  }

  const promiseResult = fsAsync.access(fileName, constants.F_OK).then(() => {
    return fileName;
  });

  return promiseResult;
};

export const pathSyncFn: FinderCallbackSync = (fileName?: string) => {
  if (!fileName) {
    throw new Error(
      'The argument fileName must be specified either in findPaths(fileName) or in path',
    );
  }

  fs.accessSync(fileName, constants.F_OK);

  return fileName;
};

PathPriorityBuilder.prototype.path = pathMethodInjector(
  pathFn,
  (fileName?: string) => `${fileName as string}`,
);

PathPriorityBuilderSync.prototype.path = pathMethodInjector(
  pathSyncFn,
  (fileName?: string) => `${fileName as string}`,
);
