module.exports = bundler => {
  bundler.addAssetType('html', require.resolve('./assets/HTMLAsset'))
  bundler.addAssetType('css', require.resolve('./assets/CSSAsset'))
}
