#!/usr/bin/env node

const commander = require('commander')
const ParcelBuilder = require('./builders/ParcelBuilder')
// const ImageminBuilder = require('./builders/ImageminBuilder')

commander
  .option('-w, --watch', 'watch file changes')
  .parse(process.argv)

new ParcelBuilder(process.env).build()
// new ImageminBuilder(process.env).build()
