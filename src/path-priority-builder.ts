interface GeneratorCallbackResult {
  priority: number;
  path: string;
}

export type FinderCallback<OptionType = never> = (
  fileName?: string,
  options?: OptionType,
) => Promise<string>;

export type GeneratePathMethod<OptionType = never> = (
  ...args: Parameters<FinderCallback<OptionType>>
) => PathPriorityBuilder;

export const pathMethodInjector = <OptionType>(
  fn: FinderCallback<OptionType>,
): GeneratePathMethod<OptionType> => {
  const newMethod: GeneratePathMethod<OptionType> = function (
    this: PathPriorityBuilder,
    ...args: Parameters<FinderCallback<OptionType>>
  ) {
    const usedFileName = args[0] || this.fileNameArg;
    const result: GeneratorCallbackResult = {
      priority: this.priorityCount++,
      path: '',
    };
    const promiseResult = fn(usedFileName, args[1]).then((filePath) => {
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
