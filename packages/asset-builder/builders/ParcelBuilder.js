const path = require('path')
const ParcelBundler = require('parcel-bundler')

module.exports = class Builder {
  constructor (env = {}) {
    // 圧縮有効
    this.MINIFY =
      env.ASSETS_MINIFY !== undefined
        ? env.ASSETS_MINIFY === 'true'
        : true

    // ソースマップ有効
    this.SOURCEMAPS =
      env.ASSETS_SOURCEMAPS !== undefined
        ? env.ASSETS_SOURCEMAPS === 'true'
        : false

    // キャッシュ有効
    this.CACHE =
      env.ASSETS_CACHE !== undefined
        ? env.ASSETS_CACHE === 'true'
        : true

    // エントリーポイント、ウォッチパターン
    this.entries = []
    this.watchPatterns = []

    this.PATH_SRC = path.resolve(env.ASSETS_PATH_SRC || 'src')
    this.PATH_DIST = path.resolve(env.ASSETS_PATH_DIST || 'dist')

    if (env.ASSETS_PATH_HTML !== undefined) {
      const srcPath = path.join(this.PATH_SRC, env.ASSETS_PATH_HTML)
      this.entries.push(`${srcPath}/*.html`)
      this.watchPatterns.push(`${srcPath}/*.html`)
    }

    if (env.ASSETS_PATH_CSS !== undefined) {
      const srcPath = path.join(this.PATH_SRC, env.ASSETS_PATH_CSS)
      this.entries.push(`${srcPath}/*.css`)
      this.watchPatterns.push(`${srcPath}/**/*.css`)
    }

    if (env.ASSETS_PATH_JS !== undefined) {
      const srcPath = path.join(this.PATH_SRC, env.ASSETS_PATH_JS)
      this.entries.push(`${srcPath}/*.js`)
      this.watchPatterns.push(`${srcPath}/**/*.js`)
    }

    if (env.ASSETS_PATH_VUE !== undefined) {
      const srcPath = path.join(this.PATH_SRC, env.ASSETS_PATH_VUE)
      this.entries.push(`${srcPath}/*.js`)
      this.watchPatterns.push(`${srcPath}/**/*.vue`)
      this.watchPatterns.push(`${srcPath}/**/*.css`)
      this.watchPatterns.push(`${srcPath}/**/*.js`)
    }
  }

  async build () {
    const parcel = new ParcelBundler(this.entries, {
      outDir: this.PATH_DIST,
      publicUrl: '.',
      minify: this.MINIFY,
      sourceMaps: this.SOURCEMAPS,
      cache: this.CACHE,
      watch: false,
      hmr: false
    })

    // 外部アセットの読込みを無効化
    parcel.addAssetType('html', require.resolve('./ParcelHTMLAsset'))
    parcel.addAssetType('css', require.resolve('./ParcelCSSAsset'))

    await parcel.bundle()
  }
}
