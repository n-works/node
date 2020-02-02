const CSSAsset = require('parcel-bundler/src/assets/CSSAsset')

module.exports = class ParcelCSSAsset extends CSSAsset {
  async collectDependencies () {
    // オリジナルの walk の処理を変更
    this.ast.root = new Proxy(this.ast.root, {
      get (target, key) {
        if (key === 'walk') {
          return _walk.call(target, target[key])
        }

        return target[key]
      }
    })

    return CSSAsset.prototype.collectDependencies.call(this)
  }
}

function _walk (walk) {
  return walker => walk.call(this, node => {
    // 外部アセットの読込みを無効化
    if (
      node.value && (
        // e.g. background-image: url(...);
        node.value.startsWith('url(')
      )
    ) {
      return node
    }

    return walker(node)
  })
}
