import { PathPriorityBuilder } from './../path-priority-builder';
import './../finders';
declare module './../path-priority-builder' {
  interface PathPriorityBuilder {
    useCliPreset: (fileName: string) => PathPriorityBuilder;
  }
}

PathPriorityBuilder.prototype.useCliPreset = function (fileName: string) {
  this.findPaths(fileName);
  return this;
};
