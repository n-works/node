#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const browserSync = require('browser-sync')
const commander = require('commander')
const dotenv = require('dotenv')

const ParcelBuilder = require('./builders/ParcelBuilder')
const ImageminBuilder = require('./builders/ImageminBuilder')

commander
  .option('-w, --watch', 'watch file changes')
  .option('-s, --serve', 'watch file changes and launch server')
  .option('-p, --proxy <url>', 'server proxy')
  .parse(process.argv)

const envfilePath = path.resolve('.env.assets')
if (fs.existsSync(envfilePath)) {
  dotenv.config({ path: envfilePath })
}

const parcelBuilder = new ParcelBuilder(process.env)
const imageminBuilder = new ImageminBuilder(process.env)

if (commander.watch || commander.serve) {
  (async () => {
    const bs = browserSync.create()

    await parcelBuilder.build()
    await imageminBuilder.build()

    bs.watch(parcelBuilder.entriesToWatch, { ignoreInitial: true }, () => {
      parcelBuilder.build().then(() => {
        if (commander.serve) {
          bs.reload()
        }
      })
    })

    bs.watch(imageminBuilder.entriesToWatch, { ignoreInitial: true }, () => {
      imageminBuilder.build().then(() => {
        if (commander.serve) {
          bs.reload()
        }
      })
    })

    if (commander.serve) {
      const options = {}

      if (process.env.ASSETS_PATH_SERVER) {
        options.server = process.env.ASSETS_PATH_SERVER
      }

      if (commander.proxy) {
        options.proxy = commander.proxy
      }

      if (options.server || options.proxy) {
        bs.init(options)
      }
    }
  })()
} else {
  parcelBuilder.build()
  imageminBuilder.build()
}
