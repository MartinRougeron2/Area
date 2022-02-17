const fs = require('fs');
const https = require('https');
const dotenv = require('dotenv');
import express from "express";
var session = require('express-session');

dotenv.config()

let certificate = fs.readFileSync('./certs/selfsigned.crt', 'utf8');
let privateKey = fs.readFileSync('./certs/selfsigned.key', 'utf8');
let credentials = {key: privateKey, cert: certificate};
let auth_server = express();


auth_server.use(session({ secret: 'reno' }));

auth_server.get('/', (__req, res) => {
  res.send('Hello World!')
})

auth_server.get('/fail', (__req, res) => {
  res.send('auth failed!')
})

require("./slack_oauth")(auth_server)
require("./google_oauth")(auth_server)


auth_server.get('/auth/finish', ((__req: express.Request, res: any) => {
    res.send('<h1> Finished ! </h1><h4>You can close it</h4>')
}))


let httpsServer = https.createServer(credentials, auth_server);

httpsServer.listen(3000);
