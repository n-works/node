const fs = require('fs')
const path = require('path')
const ParcelBundler = require('parcel-bundler')

module.exports = class Builder {
  constructor (config) {
    // キャッシュ有効
    this.cache = config.cache

    // 圧縮有効
    this.minify = config.minify

    // ソースマップ有効
    this.sourcemaps = config.sourcemaps

    // エントリーポイント
    this.entries = []

    // エントリーファイル
    this.entryFiles = new Map()

    this.srcPath = path.resolve(config.src)
    this.distPath = path.resolve(config.dist)

    config.directories.html.forEach(dir => {
      const srcPath = path.join(this.srcPath, dir)
      this.entries.push(`${srcPath}/*.html`)
    })

    config.directories.css.forEach(dir => {
      const srcPath = path.join(this.srcPath, dir)
      this.entries.push(`${srcPath}/*.css`)
    })

    config.directories.js.forEach(dir => {
      const srcPath = path.join(this.srcPath, dir)
      this.entries.push(`${srcPath}/*.js`)
    })

    config.directories.vue.forEach(dir => {
      const srcPath = path.join(this.srcPath, dir)
      this.entries.push(`${srcPath}/*.js`)
    })

    // ウォッチパターン
    this.watchPatterns = [
      `${this.srcPath}/**/*.html`,
      `${this.srcPath}/**/*.css`,
      `${this.srcPath}/**/*.js`,
      `${this.srcPath}/**/*.vue`
    ]
  }

  updateEntryFiles (bundle) {
    // エントリーファイルを更新
    if (bundle.entryAsset) {
      this.entryFiles.set(
        bundle.entryAsset.name,
        new Set(Array.from(bundle.assets).map(
          asset => asset.name
        ))
      )
    }

    // 再帰的に子バンドルを処理
    bundle.childBundles.forEach(childBundle => {
      this.updateEntryFiles(childBundle)
    })
  }

  async build (entryFiles) {
    // エントリーポイントの基準ファイルを作成
    const entryAsset = path.join(this.srcPath, 'entry.asset')
    if (!fs.existsSync(entryAsset)) {
      fs.writeFileSync(entryAsset, '')
    }

    const entries = [entryAsset, ...(entryFiles || this.entries)]
    const parcel = new ParcelBundler(entries, {
      outDir: this.distPath,
      publicUrl: '.',
      cache: this.cache,
      minify: this.minify,
      sourceMaps: this.sourcemaps,
      watch: false,
      hmr: false
    })

    // 外部アセットの読込みを無効化
    parcel.addAssetType('html', require.resolve('./ParcelHTMLAsset'))
    parcel.addAssetType('css', require.resolve('./ParcelCSSAsset'))

    const bundle = await parcel.bundle()
    this.updateEntryFiles(bundle)

    // エントリーポイントの基準ファイルを削除
    if (fs.existsSync(entryAsset)) {
      fs.unlinkSync(entryAsset)
    }

    // ビルド後のエントリーポイントの基準ファイルを削除
    const entryAssetDist = path.join(this.distPath, 'entry.asset')
    if (fs.existsSync(entryAssetDist)) {
      fs.unlinkSync(entryAssetDist)
    }
  }
}
