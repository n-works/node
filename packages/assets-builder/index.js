#!/usr/bin/env node

const ParcelBuilder = require('./builders/ParcelBuilder')
const ImageminBuilder = require('./builders/ImageminBuilder')

new ParcelBuilder(process.env).start()
new ImageminBuilder(process.env).start()
