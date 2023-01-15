import { OnLoadArgs, Plugin, PluginBuild } from 'esbuild';
import glslify from 'glslify';
import * as fs from 'node:fs';
import { dirname } from 'node:path';
import * as util from 'node:util';

export interface GLSLOptions {
	minify?: boolean;
  fileTypes?: string[];
  useGlslify?: boolean;
}

function minifyShader(text: string) {
  let forceNewline = false;
  const lines = text.replace(
    /\\(?:\r\n|\n\r|\n|\r)|\/\*.*?\*\/|\/\/(?:\\(?:\r\n|\n\r|\n|\r)|[^\n\r])*/g,
    ''
  ).split(/\n+/);

  return lines.reduce((result: string[], line) => {
      line = line.trim().replace(/\s{2,}|\t/, ' ');

      if (line.charAt(0) === '#') {
        if (forceNewline) {
          result.push('\n');
        }

        result.push(line, '\n');

        forceNewline = false;
      } else {
        result.push(
          line.replace(
            /\s*({|}|=|\*|,|\+|\/|>|<|&|\||\[|\]|\(|\)|-|!|;)\s*/g, '$1'
          )
        );

        forceNewline = true;
      }

      return result;
  }, []).join('').replace(/\n+/g, '\n');
}

export default function glsl({
  minify = true,
  useGlslify = true,
  fileTypes = ['frag', 'vert', 'wgsl', 'vs', 'fs', 'glsl']
}: GLSLOptions = {}): Plugin {
	const readFile = util.promisify(fs.readFile);
  const filter = new RegExp(`\.(?:${fileTypes.join('|')})$`);

	return {
		name: 'glsl',
		setup: (build: PluginBuild) => {
			build.onLoad({ filter }, async (args: OnLoadArgs) => {
				let source = await readFile(args.path, 'utf8');

        if (useGlslify) {
          source = glslify.compile(source, { basedir: dirname(args.path) });
        }

				return {
					loader: 'text',
					contents: minify ? minifyShader(source) : source
				};
			});
		}
	};
}