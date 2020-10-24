interface GeneratorCallbackResult {
  priority: number;
  path: string;
}

export type FinderCallback = (
  fileName?: string,
  folderName?: string,
  options?: any,
) => Promise<string>;

export type GeneratePathMethod = (
  fileName?: string,
  folderName?: string,
  options?: any,
) => PathPriorityBuilder;

export const pathMethodInjector = (fn: FinderCallback) => {
  const newMethod: GeneratePathMethod = function (
    this: PathPriorityBuilder,
    fileName?: string,
    folderName?: string,
    options?: string,
  ) {
    const usedFileName = fileName || this.fileNameArg;
    const usedFolderName = folderName || this.folderNameArg;
    const result: GeneratorCallbackResult = {
      priority: this.priorityCount++,
      path: '',
    };
    const promiseResult = fn(usedFileName, usedFolderName, options).then(
      (filePath) => {
        result.path = filePath;
        return result;
      },
    );
    this.generatorFunctions.push(promiseResult);
    return this;
  };
  return newMethod;
};

export class PathPriorityBuilder {
  protected generatorFunctions: Array<Promise<GeneratorCallbackResult>> = [];
  protected priorityCount = 0;
  protected fileNameArg?: string;
  protected folderNameArg?: string;

  public findPaths(fileName?: string, folderName?: string): this {
    this.fileNameArg = fileName;
    this.folderNameArg = folderName;
    return this;
  }

  public async generate(): Promise<Array<string>> {
    // Resolve all promises
    const promiseResult = await Promise.allSettled(this.generatorFunctions);
    const pathResult = promiseResult.map((element) => {
      if (element.status === 'fulfilled') {
        return element.value;
      }
    });

    pathResult.sort((a, b) => {
      return (a?.priority as number) - (b?.priority as number);
    });

    const finalResult = pathResult.map((element) => element?.path as string);

    return finalResult;
  }
}
