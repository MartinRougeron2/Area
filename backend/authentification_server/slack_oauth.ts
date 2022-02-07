import {Installation, InstallationQuery} from "@slack/oauth";
import {LinksModel, UniqueActionModel} from "../microservices/types";

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
            storeInstallation: async (installation: Installation) => {
                console.log(installation)
                const action_id = installation.metadata
                const parameters = {channel_id: installation?.incomingWebhook?.channelId}

                UniqueActionModel.findOne({id: action_id}).then((res) => {
                    if (!res) return

                    res.parameters = JSON.stringify(parameters)

                    const link = new LinksModel({
                        action: res,
                        token: installation.bot?.token + "|" + installation.bot?.refreshToken
                    })
                    link.save()
                    res.save()
                })

            },
            fetchInstallation: async (installQuery: InstallationQuery<boolean>) => {
                console.log(installQuery)
            },
            deleteInstallation: async (installQuery: InstallationQuery<boolean>) => {
                console.log(installQuery)
            },
        }
    })

    app.get('/auth/slack', async (__req: any, res: any, __next: any) => {
        try {
            // feel free to modify the scopes
            const url = await installer.generateInstallUrl({
                scopes: [
                    'incoming-webhook', 'chat:write',
                    'calls:read', 'channels:read', 'groups:read', 'mpim:read', 'im:read',
                    'channels:history', 'groups:history', 'im:history', 'mpim:history'],
                metadata: 'reno',
                redirectUri: 'https://localhost:3000/auth/slack-redirect'
            })

            res.redirect(url)
        } catch (error) {
            console.log(error)
        }
    });

    app.get('/auth/slack-redirect', async (req: any, res: any) => {
        await installer.handleCallback(req, res);
    });

}
