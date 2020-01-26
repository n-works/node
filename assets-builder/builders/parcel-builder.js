const Path = require('path')
const Bundler = require('parcel-bundler')

module.exports = class Builder {
  constructor (env = {}) {
    this.PATH = {
      src: env.ASSETS_PATH_SRC || 'src',
      dist: env.ASSETS_PATH_DIST || 'dist',
      html: env.ASSETS_PATH_HTML || '',
      css: env.ASSETS_PATH_CSS || 'css',
      js: env.ASSETS_PATH_JS || 'js',
      vue: env.ASSETS_PATH_VUE || 'vue'
    }
    this.MINIFY = (env.ASSETS_MINIFY || 'true') === 'true'
    this.SOURCEMAPS = (env.ASSETS_SOURCEMAPS || 'false') === 'true'
    this.CACHE = (env.ASSETS_CACHE || 'true') === 'true'
  }

  async build () {
    const src = Path.resolve(this.PATH.src)
    const dist = Path.resolve(this.PATH.dist)
    const entryFiles = [
      `${Path.join(src, this.PATH.html)}/*.html`,
      `${Path.join(src, this.PATH.css)}/*.css`,
      `${Path.join(src, this.PATH.js)}/*.js`,
      `${Path.join(src, this.PATH.vue)}/*.js`
    ]

    const bundler = new Bundler(entryFiles, {
      outDir: dist,
      publicUrl: '.',
      minify: this.MINIFY,
      sourceMaps: this.SOURCEMAPS,
      cache: this.CACHE,
      watch: false,
      hmr: false,
      detailedReport: true
    })

    await bundler.bundle()
  }
}
