import {Arg, Mutation, Resolver} from 'type-graphql';
import {CommunicationInput, LinksModel, UniqueActionModel} from "../types";
const {google} = require('googleapis');

function makeBody(to: string, from: string, message: string) {
    var str = ["Content-Type: text/plain; charset=\"UTF-8\"\n",
        "MIME-Version: 1.0\n",
        "Content-Transfer-Encoding: 7bit\n",
        "to: ", to, "\n",
        "from: ", from, "\n",
        "subject: ", message.split(" ")[0], "\n\n",
        message
    ].join('');

    return new Buffer(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
}

function sendMessage(auth: any, to: string, from: string, message: string) {
    const gmail = google.gmail({version: 'v1', auth});
    return gmail.users.messages.send({
        auth: auth,
        userId: 'me',
        resource: {
            raw: makeBody(to, from, message)
        }
    })
}

function publishMessage(from: string, to: string, text: string, token: string) {
    const oAuth2Client = new google.auth.OAuth2()
    oAuth2Client.setCredentials({access_token: token})
    return sendMessage(oAuth2Client, from, to, text)
}


@Resolver()
export class GmailOutResolver {
    @Mutation(() => Boolean)
    async SendGmailMail(@Arg('data') {action_effect_id, message}: CommunicationInput) {
        return await UniqueActionModel.findById(action_effect_id).populate('action').then(async (action_effect_res) => {
            if (!action_effect_res) return false
            if (!action_effect_res.parameters) return false

            return await LinksModel.findOne({action: action_effect_res})
                .then(async (res) => {
                    if (!res) return false

                    let parameters = JSON.parse(action_effect_res.parameters)
                    const tokens = res.token.split("|") // cf slack_oauth:35
                    if (!parameters.from_email || !parameters.to_email) return false

                    const res_published = await publishMessage(parameters.from_email, parameters.to_email, message, tokens[0])
                    return res_published.status === 200
                })
        })
    }
}
