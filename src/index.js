import { gitCMD, coopPackage } from './helpers'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import chalk from 'chalk'

export class VersiongitWebpackPlugin {
  static versionObj = Object.freeze({
    major: 'major', // update first
    minor: 'minor', // update second
    patch: 'patch', // update third
  })

  // 识别 命令行中的 版本相关信息
  static getVerionType(argv) {
    try {
      argv = JSON.parse(argv).original
      if (argv instanceof Array && argv.length) {
        const versionReg = /^--ver=/
        let result = argv.filter((a) => versionReg.test(a))[0]
        if (result) {
          result = result.split('=')
          return result[result.length - 1]
        }
      }
      return ''
    } catch (error) {
      console.log(chalk.red('getVerionType' + error))
      return ''
    }
  }

  constructor(options = {}) {
    // 初始化信息
    this.options = Object.assign(
      {
        package_url: './package.json',
        git_url: './',
        package_indent: 2,
        enable: false,
        desc: '暂时没有任何信息', // 这是 用于存储 部署相关信息
      },
      options
    )
  }

  apply(compiler) {
    // console.log(compiler)
    /* version cooperation */
    if (!this.options.enable) {
      console.log(chalk.yellow('cannt set version and cannt get git'))
      return
    }
    compiler.hooks.emit.tapAsync(
      'VersiongitWebpackPlugin',
      async (compilation, cb) => {
        try {
          let result = await this.getCommitLog()
          const version = await this.getPkgVersion()
          result.version = version
          // 操作版本
          result = `console.table(${JSON.stringify(result)})`
          compilation.assets['version.js'] = {
            source: function () {
              return result
            },
            size: function () {
              return result.length
            },
          }
          const self = this
          // 存储 更新以及 部署信息
          let updateDesc = ''
          const desc = {
            version: '版本',
            update: '更新内容',
          }
          const optionDesc = self.options.desc
          if (typeof optionDesc === 'string') {
            updateDesc = optionDesc
          } else if (optionDesc instanceof Object) {
            updateDesc = {}
            const { update, version: ver, ...others } = optionDesc
            if (!ver) {
              updateDesc[desc.version] = version
            }
            if (typeof update === 'string') {
              updateDesc[desc.update] = update
            } else if (update instanceof Object) {
              updateDesc[desc.update] = update
            } else if (
              update instanceof Array &&
              update.length
            ) {
              updateDesc[desc.update] = update.reduce(
                (prev, next, index) => {
                  prev[index + 1] = next
                  return prev
                },
                {}
              )
            }
            updateDesc = {
              ...updateDesc,
              ...others
            }
            updateDesc = JSON.stringify(updateDesc, null, 2)
          }
          compilation.assets['description.json'] = {
            source: function () {
              return updateDesc
            },
            size: function () {
              return updateDesc.length
            },
          }
        } catch (error) {
          console.log(chalk.red(error))
        }
        cb()
      }
    )
    /* git cooperation */
    compiler.hooks.compilation.tap('VersiongitWebpackPlugin', (compilation) => {
      // Static Plugin interface |compilation |HOOK NAME | register listener
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync(
        'VersiongitWebpackPlugin', // <-- Set a meaningful name here for stacktraces
        (data, cb) => {
          /* 测试 动态添加 script */
          const verisonJs = {
            attributes: {
              defer: false,
              src: 'version.js',
            },
            tagName: 'script',
          }
          data.assetTags.scripts.push(verisonJs)
          cb(null, data)
        }
      )
    })
  }

  /* 处理 package.json 的 版本 */
  async getPkgVersion() {
    let type = VersiongitWebpackPlugin.getVerionType(
      process.env.npm_config_argv
    )
    if (!(type = VersiongitWebpackPlugin.versionObj[type])) {
      console.log(
        chalk.blue('version type is not found，replace with default patch')
      )
      type = 'patch'
    }
    const res = await coopPackage(
      this.options.package_url,
      type,
      this.options.package_indent
    )
    console.log(chalk.yellow('version', res))
    return res
  }

  /* 获取 有关 git 相关 版本信息 */
  async getCommitLog(result = {}) {
    const commitMSG = 'describe --always'
    const dateMSG = 'show --pretty=format:"%ci %cr"'
    try {
      let cmt = await gitCMD(commitMSG, this.options.git_url)
      const date = await gitCMD(dateMSG, this.options.git_url)
      if (cmt) {
        cmt = cmt.split('-')
        if (cmt.length >= 2) {
          result.commitId = cmt[2].slice(1, -1)
          // 当前commit 有 tag 的时候
          cmt[1] === 0 && (result.tag = cmt[0])
        } else if (cmt.length === 1) {
          result.commitId = cmt[0].slice(0, -1)
        }
      }
      if (date) {
        result.date = date.split('\n')[0]
      }
      console.log(chalk.green('git message success'))
    } catch (error) {
      console.log(chalk.red('git message error'))
    }
    return result
  }
}
