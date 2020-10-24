interface GeneratorCallbackResult {
  priority: number;
  path: string;
}

export type FinderCallback<OptionType = never> = (
  fileName?: string,
  options?: OptionType,
) => Promise<string>;

export type GeneratePathMethod<OptionType> = (
  fileName?: string,
  options?: OptionType,
) => PathPriorityBuilder;

export const pathMethodInjector = <OptionType>(
  fn: FinderCallback<OptionType>,
) => {
  const newMethod: GeneratePathMethod<OptionType> = function (
    this: PathPriorityBuilder,
    fileName?: string,
    options?: OptionType,
  ) {
    const usedFileName = fileName || this.fileNameArg;
    const result: GeneratorCallbackResult = {
      priority: this.priorityCount++,
      path: '',
    };
    const promiseResult = fn(usedFileName, options).then((filePath) => {
      result.path = filePath;
      return result;
    });
    this.generatorFunctions.push(promiseResult);
    return this;
  };
  return newMethod;
};

export class PathPriorityBuilder {
  protected generatorFunctions: Array<Promise<GeneratorCallbackResult>> = [];
  protected priorityCount = 0;
  protected fileNameArg?: string;

  public findPaths(fileName?: string): this {
    this.fileNameArg = fileName;
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
