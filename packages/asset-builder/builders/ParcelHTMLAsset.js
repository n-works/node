const HTMLAsset = require('parcel-bundler/src/assets/HTMLAsset')

module.exports = class ParcelHTMLAsset extends HTMLAsset {
  async collectDependencies () {
    // オリジナルの walk の処理を変更
    this.ast = new Proxy(this.ast, {
      get (target, key) {
        if (key === 'walk') {
          return _walk.call(target, target[key])
        }

        return target[key]
      }
    })

    return HTMLAsset.prototype.collectDependencies.call(this)
  }
}

function _walk (walk) {
  return walker => walk.call(this, node => {
    // 外部アセットの読込みを無効化
    if (
      node.attrs && (
        // e.g. <link href="...">
        (node.tag === 'link' && node.attrs.href) ||

        // e.g. <script src="...">
        (node.tag === 'script' && node.attrs.src) ||

        // e.g. <img src="...">
        (node.tag === 'img' && node.attrs.src) ||

        // e.g. <source srcset="...">
        (node.tag === 'source' && node.attrs.srcset)
      )
    ) {
      return node
    }

    return walker(node)
  })
}
