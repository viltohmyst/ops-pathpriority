import {
  PathPriorityBuilder,
  PathPriorityBuilderSync,
} from './../path-priority-builder';
import './../finders';
import path from 'path';
declare module './../path-priority-builder' {
  interface PathPriorityBuilder {
    useServerPreset: (fileName: string) => PathPriorityBuilder;
  }

  interface PathPriorityBuilderSync {
    useServerPreset: (fileName: string) => PathPriorityBuilderSync;
  }
}

PathPriorityBuilder.prototype.useServerPreset = function (fileName: string) {
  this.findPaths(fileName)
    .ifEnv({ NODE_ENV: '?(development)?(debug)' })
    .appRoot()
    .ifEnv({ NODE_ENV: '?(development)?(debug)' })
    .findInParents()
    .findWithGlob(`**${path.sep}*${path.sep}${fileName}`)
    .defaultConfig();
  return this;
};

PathPriorityBuilderSync.prototype.useServerPreset = function (
  fileName: string,
) {
  this.findPaths(fileName)
    .ifEnv({ NODE_ENV: '?(development)?(debug)' })
    .appRoot()
    .ifEnv({ NODE_ENV: '?(development)?(debug)' })
    .findInParents()
    .findWithGlob(`**${path.sep}*${path.sep}${fileName}`)
    .defaultConfig();
  return this;
};
