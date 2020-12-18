# ramUI-Svelte-Bootstrap

a UI component for Svelte，It will be kept up to date

> 这是一个基于Svelte和Bootstrap的UI组件封装实践
> 本项目基于Svelte3.X 和 Bootstrap 5.X，同时支持自定义主题

### 设计思考
* 非数据交互类的组件不需要封装，例如点击按钮，下拉选择按钮则可以考虑封装。
* 封装组件考虑自定义样式的配置，留给使用者一部分冗余空间，避免hack方式的样式使用。
* 坚持“适量”和“少即是多”的原则，保证灵活性的同时，降低组件复杂度。

### 主要依赖
> 使用rollup作为打包工具
```javascript
import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';

import sveltePreprocess from 'svelte-preprocess'
```
### 与vscode开发环境相关问题
> 需要在src目录下增加svelte.config.js才可以在.svelte文件内使用scss语法样式
```javascript
const sveltePreprocess = require('svelte-preprocess');
module.exports = {
  preprocess: sveltePreprocess({
    scss: {
      includePaths: ['src'],
    },
    postcss: {
      plugins: [],
    },
  }),
};
```

###  基本使用方法

> 将RamUI文件夹内文件放入工程目录中
> 在所需要的文件中引入所需要的组件

```javascript
    import 'bootstrap/dist/css/bootstrap.min.css';
    import RamContainer from '../src/components/Container.svelte';
    import RamRow from '../src/components/Row.svelte';
    import RamCol from '../src/components/Col.svelte';
```
```javascript
  <RamContainer type="fluid">
     <RamRow exClass="row-cols-auto">
        <RamCol rowNum="3"></RamCol>
        <RamCol rowNum="3"></RamCol>
     </RamRow>
   </RamContainer>
```
### 基础说明 

> 本文件当前处于研究尝试的一个基本路线，代码会不断完善、优化和规范。

  欢迎有兴趣的人给予建议和指导。

