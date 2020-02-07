const fs = require('fs')
const path = require('path')
const imagemin = require('imagemin')
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminPngquant = require('imagemin-pngquant')
const imageminSvgo = require('imagemin-svgo')
const imageminWebp = require('imagemin-webp')
const chalk = require('chalk')

module.exports = class Builder {
  constructor (config) {
    // JPEG画質
    this.jpegQuality = config.imageQuality.jpeg

    // PNG画質
    this.pngQuality = config.imageQuality.png

    // WebP画質
    this.webpQuality = config.imageQuality.webp

    // エントリーポイント
    this.entries = []

    // エントリーファイル
    this.entryFiles = new Map()

    this.srcPath = path.resolve(config.src)
    this.distPath = path.resolve(config.dist)
    this.distPathRelative = path.relative(path.resolve(), this.distPath)

    config.directories.image.forEach(dir => {
      const srcPath = path.join(this.srcPath, dir)
      if (fs.existsSync(srcPath)) {
        this.entries = this.entries.concat(this.getDirectoryPaths(srcPath))
      }
    })

    // ウォッチパターン
    this.watchPatterns = [
      `${this.srcPath}/**/*.jpg`,
      `${this.srcPath}/**/*.png`,
      `${this.srcPath}/**/*.svg`
    ]
  }

  getDirectoryPaths (basePath) {
    // 再帰的にディレクトリパスを取得
    const directoryPaths =
      fs.readdirSync(basePath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => this.getDirectoryPaths(path.join(basePath, dirent.name)))

    return [basePath, ...directoryPaths].flat()
  }

  async minify (enrty, distPath) {
    return imagemin([enrty], {
      destination: distPath,
      plugins: [
        // https://github.com/imagemin/imagemin-mozjpeg
        imageminMozjpeg({
          quality: this.jpegQuality
        }),

        // https://github.com/imagemin/imagemin-pngquant
        imageminPngquant({
          quality: [
            this.pngQuality / 100,
            Math.min(this.pngQuality + 5, 100) / 100
          ],
          speed: 1
        }),

        // https://github.com/imagemin/imagemin-svgo
        // dara-name を削除 (https://github.com/svg/svgo/issues/799)
        imageminSvgo({
          plugins: [
            { removeUnknownsAndDefaults: { keepDataAttrs: false } }
          ]
        })
      ]
    })
  }

  async minifyWebp (enrty, distPath) {
    return imagemin([enrty], {
      destination: distPath,
      plugins: [
        // https://github.com/imagemin/imagemin-webp
        imageminWebp({
          quality: this.webpQuality
        })
      ]
    })
  }

  async build (entryFiles) {
    return Promise.all((entryFiles || this.entries).map(entry => {
      // エントリーポイントごとにビルド先を設定
      const basePath = path.extname(entry) === '' ? entry : path.dirname(entry)
      const distPath = basePath.replace(this.srcPath, this.distPath)

      if (entry.match(/\.svg$/)) {
        // SVG圧縮
        return Promise.all([
          this.minify(entry, distPath)
        ])
      } else if (entry.match(/\.(jpg|png)$/)) {
        // JPEG、PNG圧縮とWebP変換
        return Promise.all([
          this.minify(entry, distPath),
          this.minifyWebp(entry, distPath)
        ])
      } else {
        // ディレクトリ配下の圧縮とWebP変換
        return Promise.all([
          this.minify(`${entry}/*.{jpg,png,svg}`, distPath),
          this.minifyWebp(`${entry}/*.{jpg,png}`, distPath)
        ])
      }
    })).then(result => {
      // imagemin 実行分のファイルリストを結合
      const files = result
        .flat(2)
        .sort((f1, f2) => f1.destinationPath > f2.destinationPath ? 1 : -1)

      files.forEach(file => {
        // エントリーファイルを更新
        this.entryFiles.set(file.sourcePath, new Set([file.sourcePath]))

        const filePath = file.destinationPath.replace(this.distPath + '/', '')
        const fileSizeOriginal = fs.statSync(file.sourcePath).size
        const fileSizeMinified = file.data.length

        // ビルド結果出力
        console.log(
          `${this.distPathRelative}/` + chalk.cyan.bold(filePath),
          `${(fileSizeOriginal / 1000).toFixed(1)} KB ->`,
          chalk.magenta.bold(`${(fileSizeMinified / 1000).toFixed(1)} KB`)
        )
      })
    })
  }
}
