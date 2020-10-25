export type FinderCallback<OptionType = never> = (
  fileName?: string,
  options?: OptionType,
) => Promise<string | Array<string>>;

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

    const promiseResult = fn(usedFileName, args[1]).then((filePath) => {
      if (typeof filePath === 'string') {
        return filePath;
      }

      const arrayResult = filePath.map((path) => {
        return path;
      });
      return arrayResult;
    });

    this.generatorFunctions.push(promiseResult);
    return this;
  };
  return newMethod;
};

export class PathPriorityBuilder {
  protected generatorFunctions: Array<Promise<string | Array<string>>> = [];
  protected fileNameArg?: string;

  public findPaths(fileName?: string): this {
    this.fileNameArg = fileName;
    return this;
  }

  public async generate(): Promise<Array<string>> {
    // Resolve all promises
    const promiseResult = await Promise.allSettled(this.generatorFunctions);

    const pathResult = promiseResult.reduce(
      (result: Array<string | string[]>, element) => {
        if (element.status === 'fulfilled') {
          result.push(element.value);
        }
        return result;
      },
      [],
    );

    let resultAsArray: Array<string> = [];
    pathResult.forEach((element) => {
      if (element) {
        if (Array.isArray(element)) {
          resultAsArray = resultAsArray.concat(element);
        } else if (typeof element === 'string') {
          resultAsArray.push(element);
        }
      } else {
        throw new Error(
          `found undefined element in generator result ${pathResult}`,
        );
      }
    });

    return resultAsArray;
  }
}
