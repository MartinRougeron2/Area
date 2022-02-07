const fs = require('fs');
const https = require('https');
const dotenv = require('dotenv');
import express from "express";

dotenv.config()

let certificate = fs.readFileSync('./certs/selfsigned.crt', 'utf8');
let privateKey = fs.readFileSync('./certs/selfsigned.key', 'utf8');
let credentials = {key: privateKey, cert: certificate};
let auth_server = express();


require("./slack_oauth")(auth_server)

auth_server.get('/auth/finish', ((__req: any, res: any) => {
    res.send('<h1> Finished ! </h1><h4>You can close it</h4>')
}))


let httpsServer = https.createServer(credentials, auth_server);

httpsServer.listen(3000);