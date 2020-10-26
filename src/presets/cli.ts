import { PathPriorityBuilder } from './../path-priority-builder';
import './../finders';
declare module './../path-priority-builder' {
  interface PathPriorityBuilder {
    useCliPreset: (fileName: string) => PathPriorityBuilder;
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
