#!/usr/bin/env node

const path = require('path')
const fs = require('fs-extra')

const templatePath = path.join(path.dirname(__filename), 'template')

fs.readdirSync(templatePath, { withFileTypes: true })
  .forEach(dirent => {
    fs.copy(
      path.join(templatePath, dirent.name),
      path.join(path.resolve('.'), dirent.name),
      { overwrite: false }
    )
  })
