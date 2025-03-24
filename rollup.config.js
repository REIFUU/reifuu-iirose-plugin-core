import resolve, { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from "rollup-plugin-typescript2";
import nodePolyfills from 'rollup-plugin-polyfill-node';
import server from 'rollup-plugin-serve';
import { readdirSync } from 'fs';
import path from 'path';
import terser from '@rollup/plugin-terser';
import replace from "@rollup/plugin-replace";

const outputDir = './dist'; // 更改为您的输出目录路径

const extendRegex = /new class (\w+) extends REIFUU_Plugin/g;

let rollupConfigList = [
  {
    input: 'lib/main.ts',
    output: {
      dir: 'dist', // 使用 dir 让 Rollup 自动匹配文件
      format: 'esm',
      name: 'reifuuPluginCore',
    },
    plugins: [
      resolve(), // 解析第三方模块
      commonjs(), // 将 CommonJS 模块转换为 ES6 模块
      typescript({ tsconfig: './tsconfig.json' }),
      nodePolyfills(),
      server({
        contentBase: [outputDir],
        port: 8080
      }),
    ],
  },
  {
    input: 'lib/index.ts',
    output: {
      dir: 'dist', // 使用 dir 让 Rollup 自动匹配文件
      format: 'umd',
      name: 'reifuuPluginCore',
    },
    plugins: [
      resolve(), // 解析第三方模块
      commonjs(), // 将 CommonJS 模块转换为 ES6 模块
      typescript({ tsconfig: './tsconfig.json' }),
      nodePolyfills(),
    ],
  }
];

const srcDir = './src';

rollupConfigList = rollupConfigList.concat(readdirSync(srcDir).map(file =>
{
  const outputPath = path.join('dist', 'src', file.replace('.ts', '.js'));

  return {
    input: path.join(srcDir, file),
    output: {
      file: outputPath,
      format: 'esm', // 你可以根据需要选择其他格式，如 'esm'
      name: 'reifuuPluginCore',
    },
    plugins: [
      resolve(), // 解析第三方模块
      commonjs(), // 将 CommonJS 模块转换为 ES6 模块
      typescript({ tsconfig: './tsconfig.json' }),
      nodePolyfills(),

      // terser(),
      replace({
        preventAssignment: true,
        values: {
          'import { REIFUU_Plugin } from "./main"': "",
          'import "../lib/main";': ''
        },
      }),
      {
        name: "replace-class-extension",
        transform(code, id)
        {

          if (id.endsWith(".ts"))
          {
            return {
              code: code.replace(extendRegex, `new class $1 extends window.reifuuPluginCore.REIFUU_Plugin`),
              map: null,
            };
          }
        },
        generateBundle(options, bundle) {
          // 遍历所有生成的 chunk
          for (const fileName in bundle) {
            const chunk = bundle[fileName];
    
            // 只处理 JavaScript 文件
            if (chunk.type === 'chunk') {
              // 删除指定的 import 语句
              chunk.code = chunk.code.replace(/import\s+['"]\.\.\/lib\/main['"];\s*/g, '');
            }
          }
        }
      }
    ],
    external: ['../lib/main'],
  };
}));

export default rollupConfigList;