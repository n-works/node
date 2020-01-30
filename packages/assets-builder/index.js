#!/usr/bin/env node

const commander = require('commander')
const ParcelBuilder = require('./builders/ParcelBuilder')
const ImageminBuilder = require('./builders/ImageminBuilder')

commander
  .option('-w, --watch', 'watch file changes')
  .parse(process.argv)

const parcelBuilder = new ParcelBuilder(process.env)
const imageminBuilder = new ImageminBuilder(process.env)

if (commander.watch) {
  parcelBuilder.start()
  imageminBuilder.start()
} else {
  parcelBuilder.build()
  imageminBuilder.build()
}
