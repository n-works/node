const HTMLAsset = require('parcel-bundler/src/assets/HTMLAsset')

module.exports = class ParcelHTMLAsset extends HTMLAsset {
  async collectDependencies () {
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
    if (node.attrs && (
      (node.tag === 'link' && node.attrs.href) ||
      (node.tag === 'script' && node.attrs.src) ||
      (node.tag === 'img' && node.attrs.src)
    )) {
      return node
    }

    return walker(node)
  })
}
