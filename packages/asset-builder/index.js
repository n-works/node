#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const browserSync = require('browser-sync')
const commander = require('commander')
const dotenv = require('dotenv')
const ImageminBuilder = require('./builders/ImageminBuilder')
const ParcelBuilder = require('./builders/ParcelBuilder')

commander
  .option('-w, --watch', 'build automatically when a file changes')
  .option('-s, --serve <path>', 'launch development server')
  .option('-p, --proxy <url>', 'launch development server with proxy')
  .parse(process.argv)

// process.env に環境変数を設定
const configPath = path.resolve('.env.assets')
if (fs.existsSync(configPath)) {
  dotenv.config({ path: configPath })
}

(async () => {
  const builders = [
    new ParcelBuilder(process.env),
    new ImageminBuilder(process.env)
  ]

  // 初回ビルド実行
  for (const builder of builders) {
    await builder.build()
  }

  if (commander.watch || commander.serve || commander.proxy) {
    const bs = browserSync.create()

    // ファイル変更時に自動ビルド、ブラウザ再読込み
    builders.forEach(builder => {
      bs.watch(builder.entriesForWatch, { ignoreInitial: true }, e => {
        if (e === 'change' || e === 'add') {
          builder.build().then(() => {
            if (commander.serve || commander.proxy) {
              bs.reload()
            }
          })
        }
      })
    })

    // 開発サーバを起動
    if (commander.serve) {
      bs.init({ server: commander.serve })
    } else if (commander.proxy) {
      bs.init({ proxy: commander.proxy })
    }
  }
})()
