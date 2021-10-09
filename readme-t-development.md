# 实现一个 对于 版本自动化注入 页面的 plugin

# 版本 在 满足 webpack5 

# 实现 的问题
> 1. 实现 packages.json 的 版本 根据 命令的 相应自增；
> 2. 实现 获取 git 版本 最新的 commit ，有 tag 拿 tag，还有 当前提交的 date
> 3. 最后 把 集成好的 信息 输出到 对应的 web 浏览器上

# 问题的点
> 1. 如何动态在 webpack 插件中，动态 加入 js，并且在 html 中注入这个 脚本 [解决url](https://segmentfault.com/q/1010000020167718)
> 2. 如何动态生成 对应的 js 文件 [解决url](https://www.cnblogs.com/jingouli/p/12336272.html)
> 3. 如何 将 package.json 拿出 对应的 version，并且 回写回去

> 4. 对于版本管理的 规范以及解决方式 [解决url](https://segmentfault.com/a/1190000014405355)

# 引入对于 semver 规范的理解，对于版本管理的规范
> 1. 了解到 npm 有相关的 命令 对于 package.json 进行 对应的 版本 操作
```shell
npm version patch # 更新 小版本，对于 fix
npm version minor # 添加了 功能性新增，可以理解为Feature版本
npm version major # 大功能的 开发以及 变更
```