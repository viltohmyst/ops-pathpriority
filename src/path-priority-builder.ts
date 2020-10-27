import { isMatch } from 'picomatch';

type EnvConditionalValue = { [key: string]: string };

type HelpDescriptionCallback = (filename?: string) => string;

export type FinderCallback<OptionType = never> = (
  fileName?: string,
  options?: OptionType,
) => Promise<string | Array<string>>;

export type GeneratePathMethod<OptionType = never> = (
  ...args: Parameters<FinderCallback<OptionType>>
) => PathPriorityBuilder;

export const pathMethodInjector = <OptionType>(
  fn: FinderCallback<OptionType>,
  description?: HelpDescriptionCallback,
): GeneratePathMethod<OptionType> => {
  const newMethod: GeneratePathMethod<OptionType> = function (
    this: PathPriorityBuilder,
    ...args: Parameters<FinderCallback<OptionType>>
  ) {
    const usedFileName = args[0] || this.fileNameArg;

    this.generatorFunctions.push(() => fn(usedFileName, args[1]));

    if (!description) {
      this.helpDescriptions.push(`path priority with file name ${args[0]}`);
    } else {
      this.helpDescriptions.push(description(usedFileName));
    }
    return this;
  };
  return newMethod;
};

export class PathPriorityBuilder {
  protected generatorFunctions: Array<
    () => Promise<string | Array<string>>
  > = [];
  protected helpDescriptions: Array<string> = [];
  protected fileNameArg?: string;
  private envConditional: { [key: number]: EnvConditionalValue } = {};

  public findPaths(fileName?: string): this {
    this.fileNameArg = fileName;
    return this;
  }

  public ifEnv(conditions: EnvConditionalValue): PathPriorityBuilder {
    const envKeys = Object.keys(conditions);
    if (envKeys.length < 1) {
      throw new Error('at least one environment variable must be defined');
    }

    this.envConditional[this.generatorFunctions.length] = conditions;
    this.helpDescriptions.push(
      `if env vars satisfy ${JSON.stringify(conditions)} then find:`,
    );
    return this;
  }

  public printPriorities() {
    return this.helpDescriptions;
  }

  public async generate(): Promise<Array<string>> {
    // Resolve all promises
    const functionArrays: Array<Promise<string | Array<string>>> = [];
    this.generatorFunctions.forEach((element) => {
      functionArrays.push(
        element().then((filePath) => {
          if (typeof filePath === 'string') {
            return filePath;
          }

          const arrayResult = filePath.map((path) => {
            return path;
          });
          return arrayResult;
        }),
      );
    });

    const promiseResult = await Promise.allSettled(functionArrays);

    const envConditionResult = promiseResult.filter((element, index) => {
      const conditions = this.envConditional[index];
      if (!conditions) {
        return true;
      }

      const conditionKeys = Object.keys(conditions);
      const passEnvConditions = conditionKeys.every((element) => {
        const envKey = element;
        const envValue = conditions[element];
        const matching = process.env[envKey] || '';
        return isMatch(matching, envValue);
      });

      return passEnvConditions;
    });

    const pathResult = envConditionResult.reduce(
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
