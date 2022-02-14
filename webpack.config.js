// Whilst the configuration object can be modified here, the recommended way of making
// changes is via the presets' options or Neutrino's API in `.neutrinorc.js` instead.
// Neutrino's inspect feature can be used to view/export the generated configuration.
const neutrino = require('neutrino')

module.exports = neutrino().webpack()

module.exports.devServer = {
  proxy: {
    '/semapi': {
      target: 'http://sui-demo-prism.apps.dbmi.cloud/api',
      pathRewrite: { '^/semapi': '' },
      changeOrigin: true
    },
    '/coreapi': {
      target: 'http://core-api.apps.dbmi.cloud/v1',
      pathRewrite: { '^/coreapi': '' },
      changeOrigin: true
    },
    '/api': {
      target: 'http://127.0.0.1:8080/v1',
      pathRewrite: { '^/api': '' },
      changeOrigin: true
    }
  },
  historyApiFallback: true
}
