const {Random} = require('mockjs')
const {join, relative} = require('path')
const fs = require('fs')

/**
 * @description 随机生成图片url。
 * @param width
 * @param height
 * @returns {string}
 */
function handleRandomImage(width = 50, height = 50) {
  return `https://picsum.photos/${width}/${height}?random=${Random.guid()}`
}

/**
 * @description 处理所有 controller 模块，npm run serve时在node环境中自动输出controller文件夹下Mock接口，请勿修改。
 * @returns {[]}
 */
function handleMockArray() {
  const mockArray = []
  const controllerDir = join(process.cwd(), 'mock', 'controller')
  
  const getFiles = (dir) => {
    const files = fs.readdirSync(dir)
    files.forEach((item) => {
      const fPath = join(dir, item)
      const stat = fs.statSync(fPath)
      if (stat.isDirectory()) {
        getFiles(fPath)
      } else if (stat.isFile() && item.endsWith('.js')) {
        // 获取相对于controller目录的相对路径
        const relPath = relative(controllerDir, fPath)
        mockArray.push(`./controller/${relPath}`)
      }
    })
  }
  
  getFiles(controllerDir)
  return mockArray
}

module.exports = {
  handleRandomImage,
  handleMockArray,
}
