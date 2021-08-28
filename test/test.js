'use strict';
const path = require('path');
require('dotenv').config({path: path.resolve(module.path, '.env')});
const CommandClient = require('../index'),
client = new CommandClient(process.env.DISCORD_TOKEN, {}, {prefix: 'test!'});

client.registerCommand('test', (msg, args) => {
    msg.channel.createMessage('So far so good. Exiting...').then(() => {
        client.disconnect();
        process.exit(0);
    });
});

client.connect();