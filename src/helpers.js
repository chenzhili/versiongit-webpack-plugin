const { exec } = require('child_process')
const { promisify } = require('util')
const path = require('path')
const fs = require('fs')
const semver = require('semver')
const chalk = require('chalk')

const execPromise = promisify(exec)
const writeFilePromise = promisify(fs.writeFile)

/* 获取 get 相关 */
export const gitCMD = async function (command, gitWorkTree, callback) {
  gitWorkTree = gitWorkTree || path.join(__dirname, '.')
  const gitCommand = gitWorkTree
    ? [
      'git',
      '--git-dir="' + path.join(gitWorkTree, '.git') + '"',
      '--work-tree=' + `"${gitWorkTree}"`,
      command
    ].join(' ')
    : ['git', command].join(' ')
  const callbackExist = callback instanceof Function
  try {
    console.log(chalk.yellow(gitCommand))
    const { stdout, stderr } = await execPromise(gitCommand)
    if (callbackExist) {
      callback(stdout || stderr)
    } else {
      return (stdout || stderr)
    }
  } catch (error) {
    console.log(chalk.red(error))
    if (callbackExist) {
      callback(error)
    } else {
      console.log(chalk.red(error))
      return error
    }
  }
}

/* 操作 对于 package.json 相关 */
// 获取 package.json 的文件
function getPackageFile (url) {
  return JSON.parse(fs.readFileSync(path.resolve(__dirname, url), 'utf8'))
}
// 重写 package.json 文件

async function setPackageFile (url, file, indent) {
  try {
    const pkg = JSON.stringify(file, null, indent)
    await writeFilePromise(path.resolve(__dirname, url), pkg)
    console.log(chalk.green('package.json version modify success'))
  } catch (error) {
    console.log(chalk.red(error))
  }
}
export async function coopPackage (url = './package.json', type, indent) {
  try {
    const pkg = getPackageFile(url)
    pkg.version = semver.inc(pkg.version, type)
    await setPackageFile(url, pkg, indent)
    console.log(chalk.green('package.json set version successful'))
    return pkg.version
  } catch (error) {
    console.log(chalk.red(error))
    return ''
  }
}
