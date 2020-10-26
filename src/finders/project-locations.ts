import {
  PathPriorityBuilder,
  pathMethodInjector,
  FinderCallback,
} from './../path-priority-builder';
import path from 'path';
import fs from 'fs/promises';
import { constants } from 'fs';
import * as root from 'app-root-path';

declare module './../path-priority-builder' {
  interface PathPriorityBuilder {
    appRoot: GeneratePathMethod;
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

  const promiseResult = fs.access(filePath, constants.F_OK).then(() => {
    return filePath;
  });

  return promiseResult;
};

PathPriorityBuilder.prototype.appRoot = pathMethodInjector(
  appRootFn,
  (fileName?: string) => `${path.join(root.path, fileName as string)}`,
);
