import {
  PathPriorityBuilder,
  PathPriorityBuilderSync,
  pathMethodInjector,
  FinderCallback,
  FinderCallbackSync,
} from './../path-priority-builder';
import findUp from 'find-up';
import fs, { promises as fsAsync } from 'fs';
import { constants } from 'fs';
import { fdir } from 'fdir';
import path from 'path';

interface findWithGlobOptions {
  maxDepth?: number;
  startPath?: string;
  findAll?: boolean;
}
declare module './../path-priority-builder' {
  interface PathPriorityBuilder {
    findWithGlob: GeneratePathMethod<findWithGlobOptions>;
    findInParents: GeneratePathMethod;
  }

  interface PathPriorityBuilderSync {
    findWithGlob: GeneratePathMethodSync<findWithGlobOptions>;
    findInParents: GeneratePathMethodSync;
  }
}

export const findWithGlobFn: FinderCallback<findWithGlobOptions> = (
  fileName?: string,
  options?: findWithGlobOptions,
) => {
  if (!fileName) {
    return Promise.reject(
      new Error(
        'The argument fileName must be specified either in findPaths(fileName) or in defaultHome',
      ),
    );
  }

  let folderPath = process.cwd();
  if (options?.startPath !== undefined) {
    folderPath = options?.startPath;
  }

  const filePath = fileName;

  const maxDepth = options?.maxDepth || 3;
  const findAll = options?.findAll || false;
  const findFiles = new fdir()
    .glob(filePath)
    .withFullPaths()
    .withMaxDepth(maxDepth)
    .crawl(folderPath)
    .withPromise();

  const promiseResult = findFiles.then((output) => {
    const result = output as Array<string>;
    if (result.length === 0) {
      throw new Error('found no matches');
    }
    if (findAll) {
      return result;
    } else {
      return result[0];
    }
  });

  return promiseResult;
};

export const findWithGlobSyncFn: FinderCallbackSync<findWithGlobOptions> = (
  fileName?: string,
  options?: findWithGlobOptions,
) => {
  if (!fileName) {
    throw new Error(
      'The argument fileName must be specified either in findPaths(fileName) or in findWithGlobSyncFn',
    );
  }

  let folderPath = process.cwd();
  if (options?.startPath !== undefined) {
    folderPath = options?.startPath;
  }

  const filePath = fileName;

  const maxDepth = options?.maxDepth || 3;
  const findAll = options?.findAll || false;
  const findFiles = new fdir()
    .glob(filePath)
    .withFullPaths()
    .withMaxDepth(maxDepth)
    .crawl(folderPath)
    .sync() as Array<string>;

  if (findFiles.length === 0) {
    throw new Error('found no matches');
  }
  const findReversed = findFiles.reverse();
  if (findAll) {
    return findReversed;
  } else {
    return findReversed[0];
  }
};

export const findInParentsFn: FinderCallback = (fileName?: string) => {
  if (!fileName) {
    return Promise.reject(
      new Error(
        'The argument fileName must be specified either in findPaths(fileName) or in findInParents',
      ),
    );
  }

  const parentDirStart = path.join(process.cwd(), '../');
  const promiseResult = findUp(fileName, {
    cwd: parentDirStart,
  })
    .then((foundPath) => {
      if (foundPath === undefined) {
        throw new Error('No file found in parents');
      }
      return foundPath;
    })
    .then((foundPath) => {
      return fsAsync.access(foundPath, constants.F_OK).then(() => {
        return foundPath;
      });
    });

  return promiseResult;
};

export const findInParentsSyncFn: FinderCallbackSync = (fileName?: string) => {
  if (!fileName) {
    throw new Error(
      'The argument fileName must be specified either in findPaths(fileName) or in findInParents',
    );
  }

  const parentDirStart = path.join(process.cwd(), '../');
  const result = findUp.sync(fileName, {
    cwd: parentDirStart,
  });

  if (result === undefined) {
    throw new Error('No file found in parents');
  }

  fs.accessSync(result, constants.F_OK);

  return result;
};

PathPriorityBuilder.prototype.findWithGlob = pathMethodInjector(
  findWithGlobFn,
  (fileName?: string) => `child directories with glob pattern ${fileName}`,
);
PathPriorityBuilderSync.prototype.findWithGlob = pathMethodInjector(
  findWithGlobSyncFn,
  (fileName?: string) => `child directories with glob pattern ${fileName}`,
);

PathPriorityBuilder.prototype.findInParents = pathMethodInjector(
  findInParentsFn,
  (fileName?: string) => `parent directories with filename ${fileName}`,
);
PathPriorityBuilderSync.prototype.findInParents = pathMethodInjector(
  findInParentsSyncFn,
  (fileName?: string) => `parent directories with filename ${fileName}`,
);
