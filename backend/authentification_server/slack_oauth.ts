import {Installation, InstallationQuery} from "@slack/oauth";
import {create_unique_action} from "./common";
import express from "express";

const {InstallProvider} = require('@slack/oauth');
const {createEventAdapter} = require('@slack/events-api');


module.exports = (app: any) => {

    console.log("installing app...")


    const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET, {
        includeBody: true,
    });
    app.use('/slack/events', slackEvents.requestListener());

    const installer = new InstallProvider({
        clientId: process.env.SLACK_CLIENT_ID,
        clientSecret: process.env.SLACK_CLIENT_SECRET,
        authVersion: 'v2',
        stateSecret: 'putain-je-suis-un-lover-reno-2022',
        installationStore: {
            storeInstallation: async (_installation: Installation,) => {

            },
            fetchInstallation: async (installQuery: InstallationQuery<boolean>) => {
                console.log(installQuery)
            },
            deleteInstallation: async (installQuery: InstallationQuery<boolean>) => {
                console.log(installQuery)
            },
        }
    })

    app.get('/auth/slack', async (req: express.Request, res: any, __next: any) => {
        try {
            // feel free to modify the scopes
            const url = await installer.generateInstallUrl({
                scopes: [
                    'incoming-webhook', 'chat:write',
                    'calls:read', 'channels:read', 'groups:read', 'mpim:read', 'im:read',
                    'channels:history', 'groups:history', 'im:history', 'mpim:history'],
                metadata: req.query.id,
                redirectUri: 'https://localhost:5001/auth/slack-redirect'
            })

            res.redirect(url)
        } catch (error) {
            console.log(error)
        }
    });

    const callbackOptions = {
        success: async (installation: any, _metadata: any, _req: any, res: any) => {
            const action_id = installation.metadata ?? ""
            const parameters = {channel_id: installation?.incomingWebhook?.channelId}
            const parameters_json = JSON.stringify(parameters)
            const token = installation.bot?.token + "|" + installation.bot?.refreshToken

            const id = await create_unique_action(action_id, parameters_json, token)
            res.redirect('http://localhost:8081/auth/win?id=' + id)
        },
        failure: (_error: any, _installOptions: any, _req: any, res: any) => {
            res.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'});
            res.end('<html><body><h1>Oops, Something Went Wrong! Please Try Again or Contact the App Owner</h1></body></html>');
        }
    }

    app.get('/auth/slack-redirect', async (req: express.Request, res: any) => {
        installer.handleCallback(req, res, callbackOptions)
    });

}
