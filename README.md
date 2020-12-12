# ramUI-Svelte-Bootstrap

a UI component for Svelte，It will be kept up to date

> 这是一个基于Svelte和Bootstrap的UI组件封装实践
> 本项目基于Svelte3.X 和 Bootstrap 5.X

## 基本使用方法

- 将RamUI文件夹内文件放入工程目录中

- 在所需要的文件中引入所需要的组件

  ```javascript
  例如 
  import RamRow from '../src/RamUI/RamRow.svelte';
  import RamCell from '../src/RamUI/RamCell.svelte';
  ```

  ```javascript
  <RamRow {...{valign:"top",align:"center",style:"border:1px solid red;"}}>
  	<RamCell rowNum={2}>hello</RamCell>
  	<RamCell {...{rowNum:3,style:"border:1px solid green"}}>world</RamCell>
  </RamRow>
  ```
## 基础说明  

  本文件当前处于研究尝试的一个基本路线，代码会不断完善、优化和规范。

  欢迎有兴趣的人给予建议和指导。
  
