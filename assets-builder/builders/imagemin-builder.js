const Fs = require('fs')
const Path = require('path')
const Imagemin = require('imagemin')
const ImageminMozjpeg = require('imagemin-mozjpeg')
const ImageminPngquant = require('imagemin-pngquant')
const ImageminSvgo = require('imagemin-svgo')
const ImageminWebp = require('imagemin-webp')
const Chalk = require('chalk')

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

  getDirectories (path) {
    const directories =
      Fs.readdirSync(path, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => this.getDirectories(Path.join(path, dirent.name)))

    return [path, ...directories].flat()
  }

  async build () {
    const src = Path.join(Path.resolve(this.PATH.src), this.PATH.img)
    const dist = Path.join(Path.resolve(this.PATH.dist), this.PATH.img)

    if (!Fs.existsSync(src)) {
      return
    }

    return Promise.all(this.getDirectories(src).map(path => {
      const destination = path.replace(src, dist)

      return Promise.all([
        Imagemin([`${path}/*.{jpg,png,svg}`], {
          destination: destination,
          plugins: [
            ImageminMozjpeg({
              quality: this.JPEG_QUALITY
            }),
            ImageminPngquant({
              quality: [
                this.PNG_QUALITY / 100,
                Math.min(this.PNG_QUALITY + 5, 100) / 100
              ],
              speed: 1
            }),
            ImageminSvgo({
              plugins: [
                {
                  removeUnknownsAndDefaults: {
                    keepDataAttrs: false
                  }
                }
              ]
            })
          ]
        }),
        Imagemin([`${path}/*.{jpg,png}`], {
          destination: destination,
          plugins: [
            ImageminWebp({
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
          const path = file.destinationPath.replace(dist + '/', '')
          const originalSize = Fs.statSync(file.sourcePath).size
          const minifiedSize = file.data.length

          console.log(
            `${this.PATH.dist}/${this.PATH.img}/` + Chalk.cyan.bold(path),
            `${(originalSize / 1000).toFixed(1)} KB ->`,
            Chalk.magenta.bold(`${(minifiedSize / 1000).toFixed(1)} KB`)
          )
        })

      console.log('')
    })
  }
}
