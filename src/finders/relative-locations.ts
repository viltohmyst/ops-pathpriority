import {
  PathPriorityBuilder,
  pathMethodInjector,
  FinderCallback,
} from './../path-priority-builder';
import findUp from 'find-up';
import path from 'path';
import fs from 'fs/promises';
import { constants } from 'fs';
import { fdir } from 'fdir';

interface findWithGlobOptions {
  maxDepth?: number;
  startPath?: string;
}
declare module './../path-priority-builder' {
  interface PathPriorityBuilder {
    findWithGlob: GeneratePathMethod<findWithGlobOptions>;
    findInParents: GeneratePathMethod;
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
    return fs
      .access((output as Array<string>)[0], constants.W_OK | constants.R_OK)
      .then(() => {
        return (output as Array<string>)[0];
      });
  });

  return promiseResult;
};

export const findInParentsFn: FinderCallback = (fileName?: string) => {
  if (!fileName) {
    return Promise.reject(
      new Error(
        'The argument fileName must be specified either in findPaths(fileName) or in findInParents',
      ),
    );
  }

  const promiseResult = findUp(fileName, { cwd: process.cwd() })
    .then((foundPath) => {
      if (foundPath === undefined) {
        throw new Error('No file found in parents');
      }
      return foundPath;
    })
    .then((foundPath) => {
      return fs.access(foundPath, constants.W_OK | constants.R_OK).then(() => {
        return foundPath;
      });
    });

  return promiseResult;
};

PathPriorityBuilder.prototype.findWithGlob = pathMethodInjector(findWithGlobFn);
PathPriorityBuilder.prototype.findInParents = pathMethodInjector(
  findInParentsFn,
);
