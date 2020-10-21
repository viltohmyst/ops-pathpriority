# Use this template

```
npx degit --force viltohmyst/templit-typescript-module#main
```

# How this template is created

```
npm init -y
npm install --save-dev typescript
npm install --save-dev jest @types/jest ts-jest ts-node
npm install --save @types/node reflect-metadata
npx tsc --init
```

Edit tsconfig.json to add the following :

```json
{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true,
    "jsx": "preserve",
    "declaration": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "moduleResolution": "node",
    "baseUrl": "./src",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "exclude": ["node_modules", "./dist"]
}
```

Edit the package.json file with the following changes:

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node ./lib/index.js",
    "dev": "NODE_ENV=development node ./lib/index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "jest": {
    "preset": "ts-jest",
    "testEnvironment": "node"
  }
}
```

Ignore compiled code in .gitignore

```
lib/
```

Add support for linting :

```
npm install --save-dev eslint typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin

touch .eslintrc
```

Edit .eslintrc :

```
{
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
}
```

install vs code eslint module
edit .vscode/settings.json

```json
"eslint.validate": [
    {
      "language": "typescript",
      "autoFix": true
    },
    {
      "language": "typescriptreact",
      "autoFix": true
    }
  ],
  "eslint.autoFixOnSave": true
```

Add prettier to the mix

```
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```

Add .prettierrc

```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "tabWidth": 2
}
```

Add husky

```bash
npm install --save-dev husky
```

Edit package.json

```json
"husky": {
      "hooks": {
          "pre-commit": "lint-staged"
      }
  },
  "lint-staged": {
      "*.{js,ts,tsx}": [
          "eslint --fix"
      ]
  }
```

Whitelist files for npm publish

```json
"files": [
    "lib",
    "bin"
  ],
```

Add testing to your package.json

```
"jest": {
    "preset": "ts-jest",
    "testEnvironment": "node"
  }
  "scripts": {
    "test": "jest"
  }
```

Add hooks

```
"prepare": "npm run build",
"prepublishOnly": "npm test && npm run lint",
"preversion": "npm run lint",
```
