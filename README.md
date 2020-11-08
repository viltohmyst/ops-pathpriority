# PathPriority

Never again shall you second guess how and where you get your (config) files. Define the priority of where to search for your files, and get an array of results from searching in those locations.

**The Why? :**

> I find myself redoing alot of the boilerplate required to look for a config file. Then months later I forget where exactly the program is going to look for it.

## Features

- Use a clean API (method chaining) to define a priority list of locations to search for a file / directory.
- Use environment variables (i.e. NODE_ENV) and match them with regex or glob patterns as conditionals to control which locations should be searched.
- Easy to use, good preset defaults for a CLI (Command Line Interface) or server app to look for config files in a development or production environment (based on the value of NODE_ENV).
- Print your configuration of priority paths, to use in a README or help command.
- Extensible, if none of the predefined location finders or priority presets satisfy your needs, you can easily extend this module with your own custom solution.
- Supports CommonJs (CJS) and EcmaScript Modules (ESM)
- Has both synchronous and asynchronous versions

## Install

```bash
npm install path-priority # already includes typescript definitions
```

## Usage

Easiest way is to use a priority preset :

```typescript
// example-cli.ts
import { PathPriorityBuilder } from 'path-priority';
import 'path-prioity/lib/cjs/presets/cli'; // import the preset

async function runPb() {
  try {
    const pb = new PathPriorityBuilder();
    const result = await pb.useCliPreset('config/config.json').generate();

    console.log(result);
  } catch (error) {
    console.log(error);
  }
}

runPb();
// Result :
//[
//  '/home/user/code/myproject/config/config.json',
//  '/home/user/.config/config/config.json'
//]
```

There is also a synchronous version, simply use `PathPriorityBuilderSync` and invoke `generateSync` instead of `generate` :

```typescript
// example-cli.ts
import { PathPriorityBuilderSync } from 'path-priority';
import 'path-prioity/lib/cjs/presets/cli'; // import the preset

function runPbSync() {
  try {
    const pb = new PathPriorityBuilderSync();
    const result = pb.useCliPreset('config/config.json').generateSync();

    console.log(result);
  } catch (error) {
    console.log(error);
  }
}

runPbSync();
// Result :
//[
//  '/home/user/code/myproject/config/config.json',
//  '/home/user/.config/config/config.json'
//]
```

This project uses 'module augmentation' to make it extensible whilst giving you the flexibility to only import what you need.

Define your own priority list :

```typescript
// example-custom-priority.ts
import { PathPriorityBuilder } from 'path-priority';
import 'path-priority/lib/cjs/finders'; // import the finders

async function runPb() {
  try {
    const pb = new PathPriorityBuilder();
    const result = await pb
      .findPaths('config/config.json')
      // if NODE_ENV is 'development' or 'debug' then
      // look into your project's root directory
      .ifEnv({ NODE_ENV: '?(development)?(debug)' })
      .appRoot()
      // if NODE_ENV is 'development' or 'debug' then
      // starting from Current Working Directory, look up parent directories
      .ifEnv({ NODE_ENV: '?(development)?(debug)' })
      .findInParents()
      // look in your default OS config location
      .defaultConfig()
      .defaultHome() // look in your user's home directory
      .generate(); // start the asynchronous search

    console.log(result);
  } catch (error) {
    console.log(error);
  }
}

runPb();
// Result :
//[
//  '/home/user/code/myproject/config/config.json',
//  '/home/user/.config/config/config.json'
//]
```

The configuration above is actually exactly the same as the CLI preset.

Want a verbose description of where your files will be searched and in what order? Just print it :

```typescript
// with the priorities defined in the previous example,
const description = pb.printPriorities(); // this is a synchrounous operation

console.log(description);
//[
//  'if env vars satisfy {"NODE_ENV":"?(development)?(debug)"} then find:',
//  '/home/user/code/myporject/config/config.json',
//  'if env vars satisfy {"NODE_ENV":"?(development)?(debug)"} then find:',
//  'parent directories with filename config/config.json',
//  '/home/user/.config/config/config.json',
//  '/home/user/config/config.json'
//]
```

## CommonJs and EcmaScript Modules

If your project uses CommonJs, then to specify the `presets` or `finders` sub-modules, suffix them with the `lib/cjs/` directory (such as in the previous examples). If instead you use EcmaScript Modules, then suffix them with `lib/esm/` instead.

I know this is a bit verbose, but until TypeScript officially supports "exports" fields in package.json files, this in my opinion is the cleanest way to define which module system to use.

## Preset Priorities

Instantly get good defaults for finding config files for a **CLI** or **Server** app. The config file locations are prioritized depending on whether you are running your app in a production environment or from a development environment (i.e. debugging in your IDE).

```typescript
// example-cli.ts
import { PathPriorityBuilder } from 'path-priority';
import 'path-priority/lib/cjs/presets/server';

async function runPb() {
  try {
    const pb = new PathPriorityBuilder();
    const result = await pb.useServerPreset('config/config.json').generate();

    console.log(result);
  } catch (error) {
    console.log(error);
  }
}

runPb();
//[
//  '/home/user/code/myproject/config/config.json',
//  '/home/user/code/config/config.json',
//  '/home/user/.config/config/config.json'
//]
```

The server preset is the same as defining a priority list of locations to search below :

```typescript
import { PathPriorityBuilder } from 'path-priority';
import 'path-priority/lib/cjs/finders';
import path from 'path';

async function runPb() {
  try {
    const pb = new PathPriorityBuilder();
    const result = await pb
      .findPaths('config/config.json')
      // if NODE_ENV is 'development' or 'debug' then
      // look into your project's root directory
      .ifEnv({ NODE_ENV: '?(development)?(debug)' })
      .appRoot()
      // if NODE_ENV is 'development' or 'debug' then
      // starting from CWD, look up parent directories
      .ifEnv({ NODE_ENV: '?(development)?(debug)' })
      .findInParents()
      // find in child directories a matching glob pattern
      .findWithGlob(`**${path.sep}*${path.sep}config.json`)
      .defaultConfig() // look in your default OS config location
      .generate(); // start the asynchronous search

    console.log(result);
  } catch (error) {
    console.log(error);
  }
}

runPb();
```

In case you missed it, an explanation on what the CLI preset does can be seen in the **Usage** section earlier in this README.

## Predefined Finders

This module comes with predefined location finders which range from basic (i.e. default OS home, config, data, temp directories) to advanced (i.e. crawl parent directories for a certain filename or child directories with glob patterns).

You can choose to import all finders via `import 'path-priority/lib/cjs/finders'` or you can import certain finders only along with their (non-nodejs core) dependencies :

- `import 'path-priority/lib/cjs/finders/default-locations'`

  These finders look for filePath inside your OS's default directories.

  - `defaultData(filePath: string) `

  - `defaultConfig(filePath: string)`

  - `defaultCache(filePath: string)`

  - `defaultLog(filePath: string)`

  - `defaultTemp(filePath: string)`

  - `defaultHome(filePath: string)`

  - depencencies :

    - [env-paths](https://github.com/sindresorhus/env-paths)

- `import 'path-priority/lib/cjs/finders/project-locations'`

  This finder looks for filePath inside your project's root directory

  - `appRoot(filePath: string)`

  - dependencies :

    - [app-root-path](https://github.com/inxilpro/node-app-root-path)

- `import 'path-priority/lib/cjs/finders/relative-locations'`

  - `findWithGlobfn(glob:string, options?:findWithGlobOptions)`

    This function crawls child directories for a matching regex / glob pattern. You can provide options to modify its behaviour :

    - `maxDepth?: number` specifies how deep you should search child directories. Defaults to 3 levels deep.

    - `startPath?: string` specifies the starting point of your search. Defaults to current working directory..

    - `findAll: boolean` specifies whether to search for all matching files or just return the first matching file. Defaults to false.

  - `findInParents(filePath:string)`

    This function searches for a matching filepath starting from current working directory, and walks up its parent directories.

  - dependencies :

    - [find-up](https://github.com/sindresorhus/find-up)

    - [fdir](https://github.com/thecodrr/fdir)

    - [picomatch](https://github.com/micromatch/picomatch)

### Conditional Path Priority based on Environment Variables

For convenience, we provide a method `ifEnv(conditions: object)` which can be called to make the next finder in the chain call conditionally evaluated depending on the value of an environment variable.

The conditions should be provided as a javascript object, where the keys are the names of the env vars and the values is a regex / glob matcher. Internally it uses picomatch, so check out picomatch's github project to learn more about possible matchers.

```typescript
.ifEnv({REGEX: 'this\s+is\s+text', GLOB: '**/*/path'})
```

The boolean result of `ifEnv` is evaluated using an AND expression, thus `ifEnv` returns true if all conditions are true.

```typescript
pb.findPaths('config.json')
  .ifEnv({ MUST_BE_TRUE: 'true', MUST_ALSO_BE_TRUE: 'true' })
  .defaultHome() // both env vars above must be true in order for defaultHome to be searched
  .generate();
```

Each finder can only use one `ifEnv` before it, if more than one is provided, only the last `ifEnv` before the call to the finder is used.

```typescript
pb.findPaths('config.json')
  .ifEnv({ NOT_USED: 'not_used' }) // this will not be used
  .ifEnv({ USED: 'used' }) // this conditional will be used
  .defaultHome()
  .generate();
```

If an environment variable is not defined (i.e. NODE_ENV is not set to any value for example), then it will be treated as an empty string `''`.

## API

### findPaths(fileName?: string)

Sets the default file name (path) to search for. All finders will default to using the value as their search target. If you do not set a fileName when calling this function, all finders will need to be provided a fileName string each.

Also, each finder can have a different target file to look for.

```typescript
const pb = new PathPriorityBuilder();
await pb
  .findPaths('default.txt')
  .defaultHome() // will look for default.txt in home directory
  .defaultConfig('mycli/config.json') // will look for mycli/config.json in default OS config directory
  .generate();
// if findPaths is omitted, or given an empty argument,
// then all finders must pass a fileName
await pb
  .findPaths()
  .defaultHome('config.json')
  .findInParents('otherConfig.json') // file targets don't have to be the same
  .generate();
```

### printPriorities()

Returns an array of strings describing the path priorities as well as the conditionals for the configured PathPriorityBuilder object. This function is synchronous and does not require `generate` to be called beforehand.

```typescript
import { PathPriorityBuilder } from 'path-priority';
import 'path-priority/lib/cjs/finders';
import path from 'path';

async function runPb() {
  try {
    const pb = new PathPriorityBuilder();
    pb.findPaths('default.txt')
      .defaultHome()
      .defaultConfig('mycli/config.json')
      .ifEnv({ IMPORTANT_URL: 'http://important.internal' })
      .findInParents('otherConfig.json')
      .findWithGlob('*file.conf');

    const description = pb.printPriorities();
    const stringDescription = description.reduce((accum, value) => {
      accum += value + '\n';
      return accum;
    }, '');
    // notice that you don't need to call generate before using printPriorities
    console.log(stringDescription);
  } catch (error) {
    console.log(error);
  }
}

runPb();
// Result :
// /home/user/default.txt
// /home/user/.config/mycli/config.json
// if env vars satisfy {"IMPORTANT_URL":"http://important.internal"} then find:
// parent directories with filename otherConfig.json
// child directories with glob pattern *file.conf
```

**Question :** Why aren't you returning an actual string and instead an array of strings?

**Answer :** So it is easier for you to format and present it to the user according to your needs.

### generate()

An asynchronous method to start searching for the files. Returns an array of found file locations.

```typescript
const pb = new PathPriorityBuilder();
const result = await pb.findPaths('config.conf').defaultHome().generate();
```

## Extending the module

This project uses [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation) in order to enable it to be easily extensible (and flexible). If you're not familiar with the concept, the link provided gives a good read on the concept.

### Create Your Own Preset

To create your own preset, simply assign a new method to the `PathPriorirtyBuilder`'s prototype.

```typescript
// myPreset.ts
import { PathPriorityBuilder } from 'path-priority/lib/cjs/path-priority-builder';
import 'path-priority/lib/cjs/finders'; // import finders
import './myFinder'; // or import your own custom finders

declare module 'path-priority/lib/cjs/path-priority-builder' {
  interface PathPriorityBuilder {
    myPreset: (fileName: string) => PathPriorityBuilder;
  }
}

PathPriorityBuilder.prototype.myPreset = function (fileName: string) {
  this.findPaths(fileName)
    .myFinder() // your own custom finder, if you need it
    .defaultCache()
    .defaultTemp()
    .defaultData();
  return this;
};
```

To use it, just import your preset

```typescript
import { PathPriorityBuilder } from 'path-priority';
import './myPreset';

async function runPb() {
  try {
    const pb = new PathPriorityBuilder();
    const result = await pb.myPreset('config/config.json').generate();

    const description = pb.printPriorities();
    console.log('result: ', result);
  } catch (error) {
    console.log(error);
  }
}

runPb();
```

### Create Your Own Finder

To create your own finder, define a function with the FinderCallback type signature :

```typescript
type FinderCallback<OptionType = never> = (
  fileName?: string,
  options?: OptionType,
) => Promise<string | Array<string>>;
```

It means that your function should optionally take a filename and a javascript Object (i.e. `{option1: 'value', option2: 'value}`) as its options and asynchronously return a string or array of strings which are the result of your callback's async search across the OS's directories.

Next, use the `pathMethodInjector` method factory to assign your callback into the `PathPriorityBuilder` prototype.

```typescript
//my-finder.ts
import {
  PathPriorityBuilder,
  pathMethodInjector,
  FinderCallback,
} from 'path-priority/lib/cjs/path-priority-builder';
import fs from 'fs/promises';
import { constants } from 'fs';
import path from 'path';

// if you want to define options, declare your options interface signature
// interface MyOptions {
//   maxDepth?: number;
//   startPath?: string;
//   findAll?: boolean;
// }

declare module 'path-priority/lib/cjs/path-priority-builder' {
  interface PathPriorityBuilder {
    myFinder: GeneratePathMethod; // if using options then use "myFinder: GeneratePathMethod<MyOptions>"
  }
}

// if using options, the parameters should be "(fileName?: string, options?: MYOptions)"
export const myFinder: FinderCallback = (fileName?: string) => {
  if (!fileName) {
    return Promise.reject(
      new Error(
        'The argument fileName must be specified either in findPaths(fileName) or in myFinder',
      ),
    );
  }

  const filePath = path.join('/home/user/.config', fileName); // basically just look in home's .config dir

  const promiseResult = fs.access(filePath, constants.F_OK).then(() => {
    return filePath;
  });

  return promiseResult;
};

PathPriorityBuilder.prototype.myFinder = pathMethodInjector(
  myFinder,
  (fileName?: string) =>
    `looking in ${path.join('/home/user/.config', fileName as string)}`,
);
```

Import your finder to use it.

```typescript
import { PathPriorityBuilder } from 'path-priority';
import './my-finder';

async function runPb() {
  try {
    const pb = new PathPriorityBuilder();
    const result = await pb
      .findPaths('config/config.json')
      .myFinder()
      .generate();

    const description = pb.printPriorities();
    console.log('description :', description);
    console.log('result: ', result);
  } catch (error) {
    console.log(error);
  }
}

runPb();
// description : [ 'looking in /home/user/.config/config/config.json' ]
// result:  [ '/home/user/.config/config/config.json' ]
```
