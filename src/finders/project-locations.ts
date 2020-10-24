import {
  PathPriorityBuilder,
  pathMethodInjector,
  FinderCallback,
} from './../path-priority-builder';
import path from 'path';
import fs from 'fs/promises';
import { constants } from 'fs';
import * as root from 'app-root-path';

type appRootOptions = never;
declare module './../path-priority-builder' {
  interface PathPriorityBuilder {
    appRoot: GeneratePathMethod<appRootOptions>;
  }
}

export const appRootFn: FinderCallback<appRootOptions> = (
  fileName?: string,
) => {
  if (!fileName) {
    return Promise.reject(
      new Error(
        'The argument fileName must be specified either in findPaths(fileName) or in appRoot',
      ),
    );
  }

  const filePath = path.join(root.path, fileName);

  const promiseResult = fs
    .access(filePath, constants.W_OK | constants.R_OK)
    .then(() => {
      return filePath;
    });

  return promiseResult;
};

PathPriorityBuilder.prototype.appRoot = pathMethodInjector(appRootFn);
