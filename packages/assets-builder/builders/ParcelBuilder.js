2ytconst path = require('path')
const chokidar = require('chokidar')
const ParcelBundler = require('parcel-bundler')

module.exports = class Builder {
constructor (env = {}) {
  this.PATH = {
    src: env.ASSETS_PATH_SRC || 'src',
    dist: env.ASSETS_PATH_DIST || 'dist',
    html: env.ASSETS_PATH_HTML,
    css: env.ASSETS_PATH_CSS,
    js: env.ASSETS_PATH_JS,
    vue: env.ASSETS_PATH_VUE
  }
  this.MINIFY = (env.ASSETS_MINIFY || 'true') === 'true'
  this.SOURCEMAPS = (env.ASSETS_SOURCEMAPS || 'false') === 'true'
  this.CACHE = (env.ASSETS_CACHE || 'true') === 'true'
}

start () {
  const srcPath = path.resolve(this.PATH.src)
  const distPath = path.resolve(this.PATH.dist)

  const entries = []
  const entriesToWatch = []

  if (this.PATH.html !== null) {
    entries.push(`${path.join(srcPath, this.PATH.html)}/*.html`)
    entriesToWatch.push(`${path.join(srcPath, this.PATH.html)}/*.html`)
  }
  if (this.PATH.css !== null) {
    entries.push(`${path.join(srcPath, this.PATH.css)}/*.css`)
    entriesToWatch.push(`${path.join(srcPath, this.PATH.css)}/**/*.css`)
  }
  if (this.PATH.js !== null) {
    entries.push(`${path.join(srcPath, this.PATH.js)}/*.js`)
    entriesToWatch.push(`${path.join(srcPath, this.PATH.js)}/**/*.js`)
  }
  if (this.PATH.vue !== null) {
    entries.push(`${path.join(srcPath, this.PATH.vue)}/*.js`)
    entriesToWatch.push(`${path.join(srcPath, this.PATH.vue)}/**/*.vue`)
    entriesToWatch.push(`${path.join(srcPath, this.PATH.vue)}/**/*.css`)
    entriesToWatch.push(`${path.join(srcPath, this.PATH.vue)}/**/*.js`)
  }

  chokidar.watch(entriesToWatch, { ignoreInitial: true })
    .on('ready', () => {
      this.build(entries, distPath)
    })
    .on('all', e => {
      switch (e) {
        case 'add':
        case 'change':
          this.build(entries, distPath)
          break
      }
    })
}

async build (entries, distPath) {
  const parcel = new ParcelBundler(entries, {
    outDir: distPath,
    publicUrl: '.',
    minify: this.MINIFY,
    sourceMaps: this.SOURCEMAPS,
    cache: this.CACHE,
    watch: false,
    hmr: false
  })

  await parcel.bundle()
}
}
2ytconst path = require('path')
const chokidar = require('chokidar')
const ParcelBundler = require('parcel-bundler')

module.exports = class Builder {
constructor (env = {}) {
  this.PATH = {
    src: env.ASSETS_PATH_SRC || 'src',
    dist: env.ASSETS_PATH_DIST || 'dist',
    html: env.ASSETS_PATH_HTML,
    css: env.ASSETS_PATH_CSS,
    js: env.ASSETS_PATH_JS,
    vue: env.ASSETS_PATH_VUE
  }
  this.MINIFY = (env.ASSETS_MINIFY || 'true') === 'true'
  this.SOURCEMAPS = (env.ASSETS_SOURCEMAPS || 'false') === 'true'
  this.CACHE = (env.ASSETS_CACHE || 'true') === 'true'
}

start () {
  const srcPath = path.resolve(this.PATH.src)
  const distPath = path.resolve(this.PATH.dist)

  const entries = []
  const entriesToWatch = []

  if (this.PATH.html !== null) {
    entries.push(`${path.join(srcPath, this.PATH.html)}/*.html`)
    entriesToWatch.push(`${path.join(srcPath, this.PATH.html)}/*.html`)
  }
  if (this.PATH.css !== null) {
    entries.push(`${path.join(srcPath, this.PATH.css)}/*.css`)
    entriesToWatch.push(`${path.join(srcPath, this.PATH.css)}/**/*.css`)
  }
  if (this.PATH.js !== null) {
    entries.push(`${path.join(srcPath, this.PATH.js)}/*.js`)
    entriesToWatch.push(`${path.join(srcPath, this.PATH.js)}/**/*.js`)
  }
  if (this.PATH.vue !== null) {
    entries.push(`${path.join(srcPath, this.PATH.vue)}/*.js`)
    entriesToWatch.push(`${path.join(srcPath, this.PATH.vue)}/**/*.vue`)
    entriesToWatch.push(`${path.join(srcPath, this.PATH.vue)}/**/*.css`)
    entriesToWatch.push(`${path.join(srcPath, this.PATH.vue)}/**/*.js`)
  }

  chokidar.watch(entriesToWatch, { ignoreInitial: true })
    .on('ready', () => {
      this.build(entries, distPath)
    })
    .on('all', e => {
      switch (e) {
        case 'add':
        case 'change':
          this.build(entries, distPath)
          break
      }
    })
}

async build (entries, distPath) {
  const parcel = new ParcelBundler(entries, {
    outDir: distPath,
    publicUrl: '.',
    minify: this.MINIFY,
    sourceMaps: this.SOURCEMAPS,
    cache: this.CACHE,
    watch: false,
    hmr: false
  })

  await parcel.bundle()
}
}
2ytconst path = require('path')
const chokidar = require('chokidar')
const ParcelBundler = require('parcel-bundler')

module.exports = class Builder {
constructor (env = {}) {
  this.PATH = {
    src: env.ASSETS_PATH_SRC || 'src',
    dist: env.ASSETS_PATH_DIST || 'dist',
    html: env.ASSETS_PATH_HTML,
    css: env.ASSETS_PATH_CSS,
    js: env.ASSETS_PATH_JS,
    vue: env.ASSETS_PATH_VUE
  }
  this.MINIFY = (env.ASSETS_MINIFY || 'true') === 'true'
  this.SOURCEMAPS = (env.ASSETS_SOURCEMAPS || 'false') === 'true'
  this.CACHE = (env.ASSETS_CACHE || 'true') === 'true'
}

start () {
  const srcPath = path.resolve(this.PATH.src)
  const distPath = path.resolve(this.PATH.dist)

  const entries = []
  const entriesToWatch = []

  if (this.PATH.html !== null) {
    entries.push(`${path.join(srcPath, this.PATH.html)}/*.html`)
    entriesToWatch.push(`${path.join(srcPath, this.PATH.html)}/*.html`)
  }
  if (this.PATH.css !== null) {
    entries.push(`${path.join(srcPath, this.PATH.css)}/*.css`)
    entriesToWatch.push(`${path.join(srcPath, this.PATH.css)}/**/*.css`)
  }
  if (this.PATH.js !== null) {
    entries.push(`${path.join(srcPath, this.PATH.js)}/*.js`)
    entriesToWatch.push(`${path.join(srcPath, this.PATH.js)}/**/*.js`)
  }
  if (this.PATH.vue !== null) {
    entries.push(`${path.join(srcPath, this.PATH.vue)}/*.js`)
    entriesToWatch.push(`${path.join(srcPath, this.PATH.vue)}/**/*.vue`)
    entriesToWatch.push(`${path.join(srcPath, this.PATH.vue)}/**/*.css`)
    entriesToWatch.push(`${path.join(srcPath, this.PATH.vue)}/**/*.js`)
  }

  chokidar.watch(entriesToWatch, { ignoreInitial: true })
    .on('ready', () => {
      this.build(entries, distPath)
    })
    .on('all', e => {
      switch (e) {
        case 'add':
        case 'change':
          this.build(entries, distPath)
          break
      }
    })
}

async build (entries, distPath) {
  const parcel = new ParcelBundler(entries, {
    outDir: distPath,
    publicUrl: '.',
    minify: this.MINIFY,
    sourceMaps: this.SOURCEMAPS,
    cache: this.CACHE,
    watch: false,
    hmr: false
  })

  await parcel.bundle()
}
}
2ytconst path = require('path')
const chokidar = require('chokidar')
const ParcelBundler = require('parcel-bundler')

module.exports = class Builder {
constructor (env = {}) {
  this.PATH = {
    src: env.ASSETS_PATH_SRC || 'src',
    dist: env.ASSETS_PATH_DIST || 'dist',
    html: env.ASSETS_PATH_HTML,
    css: env.ASSETS_PATH_CSS,
    js: env.ASSETS_PATH_JS,
    vue: env.ASSETS_PATH_VUE
  }
  this.MINIFY = (env.ASSETS_MINIFY || 'true') === 'true'
  this.SOURCEMAPS = (env.ASSETS_SOURCEMAPS || 'false') === 'true'
  this.CACHE = (env.ASSETS_CACHE || 'true') === 'true'
}

start () {
  const srcPath = path.resolve(this.PATH.src)
  const distPath = path.resolve(this.PATH.dist)

  const entries = []
  const entriesToWatch = []

  if (this.PATH.html !== null) {
    entries.push(`${path.join(srcPath, this.PATH.html)}/*.html`)
    entriesToWatch.push(`${path.join(srcPath, this.PATH.html)}/*.html`)
  }
  if (this.PATH.css !== null) {
    entries.push(`${path.join(srcPath, this.PATH.css)}/*.css`)
    entriesToWatch.push(`${path.join(srcPath, this.PATH.css)}/**/*.css`)
  }
  if (this.PATH.js !== null) {
    entries.push(`${path.join(srcPath, this.PATH.js)}/*.js`)
    entriesToWatch.push(`${path.join(srcPath, this.PATH.js)}/**/*.js`)
  }
  if (this.PATH.vue !== null) {
    entries.push(`${path.join(srcPath, this.PATH.vue)}/*.js`)
    entriesToWatch.push(`${path.join(srcPath, this.PATH.vue)}/**/*.vue`)
    entriesToWatch.push(`${path.join(srcPath, this.PATH.vue)}/**/*.css`)
    entriesToWatch.push(`${path.join(srcPath, this.PATH.vue)}/**/*.js`)
  }

  chokidar.watch(entriesToWatch, { ignoreInitial: true })
    .on('ready', () => {
      this.build(entries, distPath)
    })
    .on('all', e => {
      switch (e) {
        case 'add':
        case 'change':
          this.build(entries, distPath)
          break
      }
    })
}

async build (entries, distPath) {
  const parcel = new ParcelBundler(entries, {
    outDir: distPath,
    publicUrl: '.',
    minify: this.MINIFY,
    sourceMaps: this.SOURCEMAPS,
    cache: this.CACHE,
    watch: false,
    hmr: false
  })

  await parcel.bundle()
}
}
2ytconst path = require('path')
const chokidar = require('chokidar')
const ParcelBundler = require('parcel-bundler')

module.exports = class Builder {
constructor (env = {}) {
  this.PATH = {
    src: env.ASSETS_PATH_SRC || 'src',
    dist: env.ASSETS_PATH_DIST || 'dist',
    html: env.ASSETS_PATH_HTML,
    css: env.ASSETS_PATH_CSS,
    js: env.ASSETS_PATH_JS,
    vue: env.ASSETS_PATH_VUE
  }
  this.MINIFY = (env.ASSETS_MINIFY || 'true') === 'true'
  this.SOURCEMAPS = (env.ASSETS_SOURCEMAPS || 'false') === 'true'
  this.CACHE = (env.ASSETS_CACHE || 'true') === 'true'
}

start () {
  const srcPath = path.resolve(this.PATH.src)
  const distPath = path.resolve(this.PATH.dist)

  const entries = []
  const entriesToWatch = []

  if (this.PATH.html !== null) {
    entries.push(`${path.join(srcPath, this.PATH.html)}/*.html`)
    entriesToWatch.push(`${path.join(srcPath, this.PATH.html)}/*.html`)
  }
  if (this.PATH.css !== null) {
    entries.push(`${path.join(srcPath, this.PATH.css)}/*.css`)
    entriesToWatch.push(`${path.join(srcPath, this.PATH.css)}/**/*.css`)
  }
  if (this.PATH.js !== null) {
    entries.push(`${path.join(srcPath, this.PATH.js)}/*.js`)
    entriesToWatch.push(`${path.join(srcPath, this.PATH.js)}/**/*.js`)
  }
  if (this.PATH.vue !== null) {
    entries.push(`${path.join(srcPath, this.PATH.vue)}/*.js`)
    entriesToWatch.push(`${path.join(srcPath, this.PATH.vue)}/**/*.vue`)
    entriesToWatch.push(`${path.join(srcPath, this.PATH.vue)}/**/*.css`)
    entriesToWatch.push(`${path.join(srcPath, this.PATH.vue)}/**/*.js`)
  }

  chokidar.watch(entriesToWatch, { ignoreInitial: true })
    .on('ready', () => {
      this.build(entries, distPath)
    })
    .on('all', e => {
      switch (e) {
        case 'add':
        case 'change':
          this.build(entries, distPath)
          break
      }
    })
}

async build (entries, distPath) {
  const parcel = new ParcelBundler(entries, {
    outDir: distPath,
    publicUrl: '.',
    minify: this.MINIFY,
    sourceMaps: this.SOURCEMAPS,
    cache: this.CACHE,
    watch: false,
    hmr: false
  })

  await parcel.bundle()
}
}
