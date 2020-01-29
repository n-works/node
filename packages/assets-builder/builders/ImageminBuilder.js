const fs = require('fs')
const path = require('path')
const imagemin = require('imagemin')
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminPngquant = require('imagemin-pngquant')
const imageminSvgo = require('imagemin-svgo')
const imageminWebp = require('imagemin-webp')
const chalk = require('chalk')

module.exports = class Builder {
  constructor (env = {}) {
    this.PATH = {
      src: env.ASSETS_PATH_SRC || 'src',
      dist: env.ASSETS_PATH_DIST || 'dist',
      img: env.ASSETS_PATH_IMG || 'img'
    }
    this.JPEG_QUALITY = parseInt(env.ASSETS_JPEG_QUALITY) || 70
    this.PNG_QUALITY = parseInt(env.ASSETS_PNG_QUALITY) || 70
    this.WEBP_QUALITY = parseInt(env.ASSETS_WEBP_QUALITY) || 70
  }

  getEntries (basePath) {
    const entries =
      fs.readdirSync(basePath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => this.getEntries(path.join(basePath, dirent.name)))

    return [basePath, ...entries].flat()
  }

  async build () {
    const srcPath = path.join(path.resolve(this.PATH.src), this.PATH.img)
    const distPath = path.join(path.resolve(this.PATH.dist), this.PATH.img)

    if (!fs.existsSync(srcPath)) {
      return
    }

    return Promise.all(this.getEntries(srcPath).map(entry => {
      const destination = entry.replace(srcPath, distPath)

      return Promise.all([
        imagemin([`${entry}/*.{jpg,png,svg}`], {
          destination: destination,
          plugins: [
            imageminMozjpeg({
              quality: this.JPEG_QUALITY
            }),
            imageminPngquant({
              quality: [
                this.PNG_QUALITY / 100,
                Math.min(this.PNG_QUALITY + 5, 100) / 100
              ],
              speed: 1
            }),
            imageminSvgo({
              plugins: [
                { removeUnknownsAndDefaults: { keepDataAttrs: false } }
              ]
            })
          ]
        }),
        imagemin([`${entry}/*.{jpg,png}`], {
          destination: destination,
          plugins: [
            imageminWebp({
              quality: this.WEBP_QUALITY
            })
          ]
        })
      ])
    })).then(files => {
      console.log('')

      files
        .flat(2)
        .sort((f1, f2) =>
          f1.destinationPath > f2.destinationPath ? 1 : -1
        )
        .forEach(file => {
          const filePath = file.destinationPath.replace(distPath + '/', '')
          const fileSizeOriginal = fs.statSync(file.sourcePath).size
          const fileSizeMinified = file.data.length

          console.log(
            `${this.PATH.dist}/${this.PATH.img}/` + chalk.cyan.bold(filePath),
            `${(fileSizeOriginal / 1000).toFixed(1)} KB ->`,
            chalk.magenta.bold(`${(fileSizeMinified / 1000).toFixed(1)} KB`)
          )
        })

      console.log('')
    })
  }
}
