import { PathPriorityBuilder } from './../path-priority-builder';
import './../finders';
declare module './../path-priority-builder' {
  interface PathPriorityBuilder {
    useServerPreset: (fileName: string) => PathPriorityBuilder;
  }
}

PathPriorityBuilder.prototype.useServerPreset = function (fileName: string) {
  this.findPaths(fileName);
  return this;
};
