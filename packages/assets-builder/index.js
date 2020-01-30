#!/usr/bin/env node

const path = require('path')
const commander = require('commander')
const dotenv = require('dotenv')
const ParcelBuilder = require('./builders/ParcelBuilder')
const ImageminBuilder = require('./builders/ImageminBuilder')

commander
  .option('-w, --watch', 'watch file changes')
  .parse(process.argv)

dotenv.config({
  path: path.resolve(commander.args[0] || '.env')
})

const parcelBuilder = new ParcelBuilder(process.env)
const imageminBuilder = new ImageminBuilder(process.env)

if (commander.watch) {
  parcelBuilder.start()
  imageminBuilder.start()
} else {
  parcelBuilder.build()
  imageminBuilder.build()
}
