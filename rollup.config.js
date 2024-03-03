import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from "rollup-plugin-typescript2";
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { readdirSync } from 'fs';
import path from 'path';

const inputDir = './src'; // 更改为您的输入目录路径
const outputDir = './dist'; // 更改为您的输出目录路径

const files = readdirSync(inputDir);
const override = { compilerOptions: { module: 'ESNext',moduleResolution:'node' } }

export default files.map(file => ({
  input: path.join(inputDir, file),
  output: {
    dir: outputDir,
    format: 'umd',
    name: 'reifuuPluginCore'
  },
  plugins: [
    resolve(), // 解析第三方模块
    commonjs(), // 将 CommonJS 模块转换为 ES6 模块
    typescript({ tsconfig: './tsconfig.json', tsconfigOverride: override }),
    nodePolyfills()
  ]
}));


// export default [
//   {
//     input: 'src/index.js',
//     output: {
//       dir: 'dist',
//       format: 'umd',
//       name:'reifuuPluginCore'
//     },
//     plugins: [
//       resolve(), // 解析第三方模块
//       commonjs() // 将 CommonJS 模块转换为 ES6 模块
//     ]
//   },
//   {
//     input: 'src/demo1.js',
//     output: {
//       dir: 'dist',
//       format: 'umd'
//     },
//     plugins: [
//       resolve(), // 解析第三方模块
//       commonjs() // 将 CommonJS 模块转换为 ES6 模块
//     ]
//   },
//   {
//     input: 'src/demo2.js',
//     output: {
//       dir: 'dist',
//       format: 'umd'
//     },
//     plugins: [
//       resolve(), // 解析第三方模块
//       commonjs() // 将 CommonJS 模块转换为 ES6 模块
//     ]
//   },
//   {
//     input: 'src/demo3.js',
//     output: {
//       dir: 'dist',
//       format: 'umd'
//     },
//     plugins: [
//       resolve(), // 解析第三方模块
//       commonjs() // 将 CommonJS 模块转换为 ES6 模块
//     ]
//   }
// ];
