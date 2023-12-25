import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default [
  {
    input: 'src/index.js',
    output: {
      dir: 'dist',
      format: 'umd',
      name:'reifuuPluginCore'
    },
    plugins: [
      resolve(), // 解析第三方模块
      commonjs() // 将 CommonJS 模块转换为 ES6 模块
    ]
  },
  {
    input: 'src/demo1.js',
    output: {
      dir: 'dist',
      format: 'umd'
    },
    plugins: [
      resolve(), // 解析第三方模块
      commonjs() // 将 CommonJS 模块转换为 ES6 模块
    ]
  },
  {
    input: 'src/demo2.js',
    output: {
      dir: 'dist',
      format: 'umd'
    },
    plugins: [
      resolve(), // 解析第三方模块
      commonjs() // 将 CommonJS 模块转换为 ES6 模块
    ]
  },
  {
    input: 'src/demo3.js',
    output: {
      dir: 'dist',
      format: 'umd'
    },
    plugins: [
      resolve(), // 解析第三方模块
      commonjs() // 将 CommonJS 模块转换为 ES6 模块
    ]
  }
];
