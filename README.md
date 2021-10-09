# versiongit-webpack-plugin
服务于 web端

## description
自动化控制当前 版本的 对于 webpack 的插件

## effects
> 1. 自动化 修改 package.json 并针对性的 修改 对应的version
> 2. 获取 当前最新 git 的 commit 版本 和 tag值 以及 时间
> 3. 动态 注入到 web项目 中 在 命令行中 有对应的 显示

## usage
> 1. 在对应 的 scripts 的命令行 键入 --ver=[major|minor|patch]
更新对应的版本：
```json
  major: 'major', // update first
  minor: 'minor', // update second
  patch: 'patch', // update third
```
> 2. 可以 不键入 version 字段，默认 会 更新 patch 版本

> 3. 开启或者 禁用 此插件 enable 来控制

> 4. 键入 desc 用于生成 description.json 用于记录更新信息

## example
```javascript
  const path = require('path')
  const { VersiongitWebpackPlugin } = require('versiongit-webpack-plugin')
  new VersiongitWebpackPlugin({
    package_url: path.resolve(__dirname, '../package.json'), // package.json的路径
    git_url: path.resolve(__dirname, './'), // .git文件的路径
    enable: process.env.NODE_ENV === 'production', // 是否开启 版本 只能在 build 的时候开启
    desc: {
      update: {
        1: '更新信息1',
        2: '更新信息2',
        3: '更新信息3'
      }
    }
  })
```
