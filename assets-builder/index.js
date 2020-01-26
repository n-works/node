#!/usr/bin/env node

const Commander = require('commander')
const ParcelBuilder = require('./builders/parcel-builder')
const ImageminBuilder = require('./builders/imagemin-builder')

Commander
  .option('-w, --watch', 'watch file changes')
  .parse(process.argv)

new ParcelBuilder(process.env).build()
new ImageminBuilder(process.env).build()
