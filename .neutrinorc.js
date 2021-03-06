const standard = require('@neutrinojs/standardjs');
const reactComponents = require('@neutrinojs/react-components');
const mocha = require('@neutrinojs/mocha');
const web = require('@neutrinojs/web');

module.exports = {
  options: {
    root: __dirname,
    output: 'dist'
  },
  use: [
    standard(),
    reactComponents(),
    mocha()
  ],
};
