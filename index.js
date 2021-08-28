'use strict';

const CommandClient = require('./CommandClient');

function ECH(token, options, commandOptions) {
  return new CommandClient(token, options, commandOptions);
}

ECH.Command = require('./Command');
ECH.CommandClient = CommandClient;

module.exports = ECH;
