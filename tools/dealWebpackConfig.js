const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

// 测试 用
import { VersiongitWebpackPlugin } from '../src/index'
export default function (config, type) {
  const modeObj = {
    watch: 'development',
    demo: 'development',
    build: 'production',
  }
  config.mode = modeObj[type]
  if (type === 'build') {
    config.output.path = path.resolve(process.cwd(), 'dist')
  } else {
    config.output.path = path.resolve(process.cwd(), 'demo')
  }
  if (type === 'demo') {
    config.plugins = [
      new VersiongitWebpackPlugin({
        package_url: path.resolve(__dirname, '../package.json'),
        git_url: path.resolve(__dirname, '../'),
        enable: true, // 是否开启 版本
        desc: {
          update: {
            1: '更新信息1',
            2: '更新信息2',
            3: '更新信息3'
          },
          '随便搞点': 'sdfsdfsdfsdkfjsdlkfsflsdf'
        }
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, '../test-html/index.html'),
      }),
    ]
  }
  return config
}
