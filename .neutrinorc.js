const standard = require('@neutrinojs/standardjs');
const reactComponents = require('@neutrinojs/react-components');
const mocha = require('@neutrinojs/mocha');

module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    standard(),
    reactComponents(),
    mocha(),
  ],
};
