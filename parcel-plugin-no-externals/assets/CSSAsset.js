const CSSAsset = require('parcel-bundler/src/assets/CSSAsset')

module.exports = class CSSNoExternalsAsset extends CSSAsset {
  async collectDependencies () {
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
    if (node.value && node.value.startsWith('url(')) {
      return node
    }

    return walker(node)
  })
}
