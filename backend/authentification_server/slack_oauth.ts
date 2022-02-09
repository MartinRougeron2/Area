import {Installation, InstallationQuery} from "@slack/oauth";
import {gql} from "apollo-boost";

const {InstallProvider} = require('@slack/oauth');
const {createEventAdapter} = require('@slack/events-api');
const {client} = require("./apollo_client")


const CREATE_UNIQUE_ACTION = gql`
    mutation CreateUniqueActionByBaseActionIdMutation($action_id: String!, $parameters: String!, $old_values: String!) {
        CreateUniqueActionByBaseActionId(data: {action_id: $action_id, parameters: $parameters, old_values: $old_values}) {
            id
            action {
                id
            }
        }
    }
`;

const CREATE_LINK = gql`
    mutation CreateLinksWithActionIdMutation($action_id: String!, $token: String!) {
        CreateLinksWithActionId(data: {action_id: $action_id, token: $token}) {
            id
            action {
                id
            }
        }
    }
`;

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
                const parameters_json = JSON.stringify(parameters)
                const token = installation.bot?.token + "|" + installation.bot?.refreshToken

                client.mutate({
                    mutation: CREATE_UNIQUE_ACTION,
                    variables: {
                        action_id: action_id,
                        parameters: parameters_json,
                        old_values: ""
                    }
                }).catch((err: any) => {console.log(err)}).then((result: any) => {
                    console.log(result.data.CreateUniqueActionByBaseActionId.id)
                     client.mutate({
                        mutation: CREATE_LINK,
                        variables: {
                            action_id: result.data.CreateUniqueActionByBaseActionId.id,
                            token: token
                        }
                    }).catch((err: any) => {console.log(err)}).then((result: any) => console.log(result));
                });


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
                metadata: '6201258de033cc96c3ff41cd',
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
