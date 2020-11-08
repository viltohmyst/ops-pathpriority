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
import * as root from 'app-root-path';

declare module './../path-priority-builder' {
  interface PathPriorityBuilder {
    appRoot: GeneratePathMethod;
  }

  interface PathPriorityBuilderSync {
    appRoot: GeneratePathMethodSync;
  }
}

export const appRootFn: FinderCallback = (fileName?: string) => {
  if (!fileName) {
    return Promise.reject(
      new Error(
        'The argument fileName must be specified either in findPaths(fileName) or in appRoot',
      ),
    );
  }

  const filePath = path.join(root.path, fileName);

  const promiseResult = fsAsync.access(filePath, constants.F_OK).then(() => {
    return filePath;
  });

  return promiseResult;
};

export const appRootSyncFn: FinderCallbackSync = (fileName?: string) => {
  if (!fileName) {
    throw new Error(
      'The argument fileName must be specified either in findPaths(fileName) or in appRoot',
    );
  }

  const filePath = path.join(root.path, fileName);

  fs.accessSync(filePath, constants.F_OK);

  return filePath;
};

PathPriorityBuilder.prototype.appRoot = pathMethodInjector(
  appRootFn,
  (fileName?: string) => `${path.join(root.path, fileName as string)}`,
);

PathPriorityBuilderSync.prototype.appRoot = pathMethodInjector(
  appRootSyncFn,
  (fileName?: string) => `${path.join(root.path, fileName as string)}`,
);
