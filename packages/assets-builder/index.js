#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const commander = require('commander')
const dotenv = require('dotenv')
const ParcelBuilder = require('./builders/ParcelBuilder')
const ImageminBuilder = require('./builders/ImageminBuilder')

commander
  .arguments('[envfile]')
  .option('-w, --watch', 'watch file changes')
  .parse(process.argv)

const envfilePath = path.resolve(commander.args[0] || '.env.assets')
if (fs.existsSync(envfilePath)) {
  dotenv.config({ path: envfilePath })
}

const parcelBuilder = new ParcelBuilder(process.env)
const imageminBuilder = new ImageminBuilder(process.env)

if (commander.watch) {
  parcelBuilder.start()
  imageminBuilder.start()
} else {
  parcelBuilder.build()
  imageminBuilder.build()
}
