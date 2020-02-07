#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const browserSync = require('browser-sync')
const commander = require('commander')
const ImageminBuilder = require('./builders/ImageminBuilder')
const ParcelBuilder = require('./builders/ParcelBuilder')

commander
  .option('-w, --watch', 'build automatically when a file changes')
  .option('-s, --serve <path>', 'launch development server')
  .option('-p, --proxy <url>', 'launch development server with proxy')
  .parse(process.argv)

// 設定ファイルを読込み
const config = JSON.parse(fs.readFileSync(path.resolve('.assetrc')));

(async () => {
  const builders = [
    new ParcelBuilder(config),
    new ImageminBuilder(config)
  ]

  // 初回ビルド実行
  for (const builder of builders) {
    await builder.build()
  }

  if (commander.watch || commander.serve || commander.proxy) {
    const bs = browserSync.create()

    // https://github.com/paulmillr/chokidar
    const watchOptions = {
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 200
      }
    }

    // ファイル変更時に自動ビルド
    builders.forEach(builder => {
      bs.watch(builder.watchPatterns, watchOptions, (eventType, filePath) => {
        if (eventType === 'change' || eventType === 'add') {
          // 変更ファイルのエントリーポイントを検索
          const entries = []
          if (builder instanceof ImageminBuilder) {
            entries.push(filePath)
          } else {
            builder.entryFiles.forEach((assets, entry) => {
              if (assets.has(filePath)) {
                entries.push(entry)
              }
            })
          }

          // 再ビルド、ブラウザ再読込み
          builder.build(entries.length > 0 ? entries : null).then(() => {
            if (commander.serve || commander.proxy) {
              bs.reload()
            }
          })
        }
      })
    })

    // 追加のウォッチパターン
    if (config.extraWatchPatterns.length > 0) {
      bs.watch(config.extraWatchPatterns, watchOptions, () => {
        if (commander.serve || commander.proxy) {
          bs.reload()
        }
      })
    }

    // 開発サーバを起動
    if (commander.serve) {
      bs.init({ server: commander.serve })
    } else if (commander.proxy) {
      bs.init({ proxy: commander.proxy })
    }
  }
})()
