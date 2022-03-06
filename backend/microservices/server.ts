import express from 'express';
const dotenv = require('dotenv');

const app = express();
const port = process.env.PORT_GQL || 8080;

dotenv.config()
app.listen(port, () => {
  console.log(`micro-services communication is running on port http://localhost:${port}/graphql.`);
});

const {Client, Intents} = require('discord.js');

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]})
client.login(process.env.BOT_DISCORD_TOKEN)
client.once('ready', () => {
    console.log("Discord bot online")
});
module.exports = client

require('./graphql')(app);
require('./about')(app);
require('./mobile')(app);

require('./services/slack_in')
require('./services/gcalendar_in')
require('./services/oauth2')
require('./services/discord_in')
require('./services/github_in')
require('./services/gmail_in')
require('./services/gdrive_in')
