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
    this.QUALITY_JPEG =
      env.ASSETS_QUALITY_JPEG !== undefined
        ? parseInt(env.ASSETS_QUALITY_JPEG)
        : 70

    this.QUALITY_PNG =
      env.ASSETS_QUALITY_PNG !== undefined
        ? parseInt(env.ASSETS_QUALITY_PNG)
        : 70

    this.QUALITY_WEBP =
      env.ASSETS_QUALITY_WEBP !== undefined
        ? parseInt(env.ASSETS_QUALITY_WEBP)
        : 70

    this.entries = []
    this.entriesToWatch = []

    if (env.ASSETS_PATH_IMG === undefined) {
      return
    }

    this.PATH_SRC = path.join(
      path.resolve(env.ASSETS_PATH_SRC || 'src'),
      env.ASSETS_PATH_IMG
    )

    this.PATH_DIST = path.join(
      path.resolve(env.ASSETS_PATH_DIST || 'dist'),
      env.ASSETS_PATH_IMG
    )

    this.PATH_DIST_RELATIVE = path.relative(
      path.resolve(),
      this.PATH_DIST
    )

    if (fs.existsSync(this.PATH_SRC)) {
      this.entries = this.getDirectoryPaths(this.PATH_SRC)
      this.entriesToWatch = [
        `${this.PATH_SRC}/**/*.jpg`,
        `${this.PATH_SRC}/**/*.png`,
        `${this.PATH_SRC}/**/*.svg`
      ]
    }
  }

  getDirectoryPaths (basePath) {
    const directoryPaths =
      fs.readdirSync(basePath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => this.getDirectoryPaths(path.join(basePath, dirent.name)))

    return [basePath, ...directoryPaths].flat()
  }

  async build () {
    return Promise.all(this.entries.map(entry => {
      const destination = path.join(
        this.PATH_DIST,
        entry.replace(this.PATH_SRC, '.')
      )

      return Promise.all([
        imagemin([`${entry}/*.{jpg,png,svg}`], {
          destination: destination,
          plugins: [
            imageminMozjpeg({
              quality: this.QUALITY_JPEG
            }),
            imageminPngquant({
              quality: [
                this.QUALITY_PNG / 100,
                Math.min(this.QUALITY_PNG + 5, 100) / 100
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
              quality: this.QUALITY_WEBP
            })
          ]
        })
      ])
    })).then(files => {
      files
        .flat(2)
        .sort((f1, f2) =>
          f1.destinationPath > f2.destinationPath ? 1 : -1
        )
        .forEach(file => {
          const filePath = file.destinationPath.replace(this.PATH_DIST + '/', '')
          const fileSizeOriginal = fs.statSync(file.sourcePath).size
          const fileSizeMinified = file.data.length

          console.log(
            `${this.PATH_DIST_RELATIVE}/` + chalk.cyan.bold(filePath),
            `${(fileSizeOriginal / 1000).toFixed(1)} KB ->`,
            chalk.magenta.bold(`${(fileSizeMinified / 1000).toFixed(1)} KB`)
          )
        })
    })
  }
}
