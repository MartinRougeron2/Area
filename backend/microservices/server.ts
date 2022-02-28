import express from 'express';
const dotenv = require('dotenv');

const app = express();
const port = 5000;

dotenv.config()
app.listen(port, () => {
  console.log(`micro-services communication is running on port http://localhost:${port}/graphql.`);
});

require('./graphql')(app);

//const {task} = require('./services/slack_in')
// require('./services/gcalendar_in')
require('./services/oauth2')

//task.start()

