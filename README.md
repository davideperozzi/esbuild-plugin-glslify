# @undesigned/esbuild-plugin-glslify
[![Version](https://badgen.net/npm/v/@undesigned/esbuild-plugin-glslify?color=green)](https://www.npmjs.com/package/@undesigned/esbuild-plugin-glslify)

A plugin for ESBuild to inline and process shader files for WebGL with glslify

## Installation
```sh
npm install -D @undesigned/esbuild-plugin-glslify
```
or
```sh
yarn add -D @undesigned/esbuild-plugin-glslify
```

## Usage
```ts
import { build } from 'esbuild';
import glslify from '@undesigned/esbuild-plugin-glslify';

build({
  ...
  plugins: [
    ...

    glslify({
      /**
       * Whether to minify the code before inlining it
       *
       * Default = true
       */
      minify: false,

      /**
       * Whether to use glslify or switch it of and only
       * inline the source code
       *
       * Default = true
       */
      useGlslify: false,

      /**
       * Which file extensions to look for and use for
       * transforming and inlining
       *
       * Default = ['frag', 'vert', 'wgsl', 'vs', 'fs', 'glsl']
       */
      fileTypes: ['vert', 'frag']
    })
  ]
})
```
> Note: all settings are optional

## Declarations
Here are the file declarations for TypeScript when using the default file types:

```ts
declare module "*.frag" {
	const value: string;
	export default value;
}

declare module "*.vert" {
	const value: string;
	export default value;
}

declare module "*.wgsl" {
	const value: string;
	export default value;
}

declare module "*.glsl" {
	const value: string;
	export default value;
}

declare module "*.vs" {
	const value: string;
	export default value;
}

declare module "*.fs" {
	const value: string;
	export default value;
}
```
> You can put them in andy `.d.ts` file in your project

## License
MIT