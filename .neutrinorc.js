const standard = require('@neutrinojs/standardjs');
const reactComponents = require('@neutrinojs/react-components');
const mocha = require('@neutrinojs/mocha');
const web = require('@neutrinojs/web');

module.exports = {
  options: {
    root: __dirname,
    devServer: {
      proxy: {
        '/api': {
          target: 'http://sui-demo-prism.apps.dbmi.cloud',
          pathRewrite: { '^/api': '' },
          changeOrigin: true
        }
      }
    }
  },
  use: [
    standard(),
    reactComponents(),
    mocha()
  ],
};
