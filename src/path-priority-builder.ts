/* eslint-disable @typescript-eslint/no-explicit-any */
import { isMatch } from 'picomatch';
import path from 'path';

type EnvConditionalValue = { [key: string]: string };

type HelpDescriptionCallback = (filename?: string) => string;

type AsyncGeneratorReturnType = Array<() => Promise<string | Array<string>>>;
type SyncGeneratorReturnType = Array<() => string | Array<string>>;

export interface PrintFormat {
  condition: EnvConditionalValue | null;
  description: string;
  absolute: boolean;
  conditionPass: boolean;
}

export interface FinderCallback<OptionType = never> {
  (fileName?: string, options?: OptionType): Promise<string | Array<string>>;
}

export interface FinderCallbackSync<OptionType = never> {
  (fileName?: string, options?: OptionType): string | Array<string>;
}

export type GeneratePathMethod<OptionType = never> = (
  ...args: Parameters<FinderCallback<OptionType>>
) => PathPriorityBuilder;

export type GeneratePathMethodSync<OptionType = never> = (
  ...args: Parameters<FinderCallbackSync<OptionType>>
) => PathPriorityBuilderSync;

export const pathMethodInjector = <
  T extends FinderCallback<OptionType> | FinderCallbackSync<OptionType>,
  OptionType = never
>(
  fn: T,
  description?: HelpDescriptionCallback,
): T extends FinderCallback<OptionType>
  ? GeneratePathMethod<OptionType>
  : GeneratePathMethodSync<OptionType> => {
  const newMethod = function (
    this: T extends FinderCallback<OptionType>
      ? PathPriorityBuilder
      : PathPriorityBuilderSync,
    ...args: T extends FinderCallback<OptionType>
      ? Parameters<FinderCallback<OptionType>>
      : Parameters<FinderCallbackSync<OptionType>>
  ) {
    const usedFileName = args[0] || (this as any).fileNameArg;

    (this as any).generatorFunctions.push(
      () => fn(usedFileName, args[1]) as any,
    );

    if (!description) {
      (this as any).helpDescriptions.push(
        `path priority with file name ${args[0]}`,
      );
    } else {
      (this as any).helpDescriptions.push(description(usedFileName));
    }
    return this;
  };
  return newMethod as any;
};

export class BasePriorityBuilder {
  protected generatorFunctions:
    | AsyncGeneratorReturnType
    | SyncGeneratorReturnType = [];
  protected helpDescriptions: Array<string> = [];
  protected fileNameArg?: string;
  protected envConditional: { [key: number]: EnvConditionalValue } = {};

  public findPaths(fileName?: string): this {
    this.fileNameArg = fileName;
    return this;
  }

  public ifEnv(conditions: EnvConditionalValue): this {
    const envKeys = Object.keys(conditions);
    if (envKeys.length < 1) {
      throw new Error('at least one environment variable must be defined');
    }

    this.envConditional[this.generatorFunctions.length] = conditions;
    return this;
  }

  public printPriorities(): Array<PrintFormat> {
    if (this.helpDescriptions.length === 0) return [];

    const print = this.helpDescriptions.map(
      (description, index): PrintFormat => {
        const printFormat: PrintFormat = {
          description,
          absolute: path.isAbsolute(description) ?? false,
          condition: this.envConditional[index] ?? null,
          conditionPass: this.envConditionPass(index),
        };

        return printFormat;
      },
    );
    return print;
  }

  protected envConditionPass(index: number): boolean {
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
  }
}

export class PathPriorityBuilderSync extends BasePriorityBuilder {
  public generateSync(): Array<string> {
    // Resolve all promises
    const functionArrays: Array<string | Array<string> | undefined> = [];
    const generatorFunction = this.generatorFunctions as Array<
      () => string | Array<string>
    >;
    generatorFunction.forEach((element) => {
      try {
        const filePath = element();
        functionArrays.push(filePath);
      } catch (error) {
        functionArrays.push(undefined);
      }
    });

    const envConditionResult = functionArrays.filter((element, index) => {
      if (!element) {
        return false;
      }

      return this.envConditionPass(index);
    });

    let resultAsArray: Array<string> = [];
    envConditionResult.forEach((element) => {
      if (element) {
        if (Array.isArray(element)) {
          resultAsArray = resultAsArray.concat(element);
        } else if (typeof element === 'string') {
          resultAsArray.push(element);
        }
      } else {
        throw new Error(
          `found undefined element in generator result ${envConditionResult}`,
        );
      }
    });

    return resultAsArray;
  }
}

export class PathPriorityBuilder extends BasePriorityBuilder {
  public async generate(): Promise<Array<string>> {
    // Resolve all promises
    const functionArrays: Array<Promise<string | Array<string>>> = [];
    const generatorFunction = this.generatorFunctions as Array<
      () => Promise<string | Array<string>>
    >;
    generatorFunction.forEach((element) => {
      functionArrays.push(
        element().then((filePath) => {
          return filePath;
        }),
      );
    });

    const promiseResult = await Promise.allSettled(functionArrays);

    const envConditionResult = promiseResult.filter((element, index) => {
      return this.envConditionPass(index);
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
