import {
  PathPriorityBuilder,
  PathPriorityBuilderSync,
} from './../path-priority-builder';
import './../finders';
declare module './../path-priority-builder' {
  interface PathPriorityBuilder {
    useCliPreset: (fileName: string) => PathPriorityBuilder;
  }

  interface PathPriorityBuilderSync {
    useCliPreset: (fileName: string) => PathPriorityBuilderSync;
  }
}

PathPriorityBuilder.prototype.useCliPreset = function (fileName: string) {
  this.findPaths(fileName)
    .ifEnv({ NODE_ENV: '?(development)?(debug)' })
    .appRoot()
    .ifEnv({ NODE_ENV: '?(development)?(debug)' })
    .findInParents()
    .defaultConfig()
    .defaultHome();
  return this;
};

PathPriorityBuilderSync.prototype.useCliPreset = function (fileName: string) {
  this.findPaths(fileName)
    .ifEnv({ NODE_ENV: '?(development)?(debug)' })
    .appRoot()
    .ifEnv({ NODE_ENV: '?(development)?(debug)' })
    .findInParents()
    .defaultConfig()
    .defaultHome();
  return this;
};
