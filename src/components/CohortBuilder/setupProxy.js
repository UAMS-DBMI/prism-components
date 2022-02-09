const createProxyMiddleware = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://sui-demo-prism.apps.dbmi.cloud/api',
      pathRewrite: { '^/api': '' },
      changeOrigin: true
    })
  )
}
