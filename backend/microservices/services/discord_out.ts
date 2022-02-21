import {Arg, Mutation, Resolver} from 'type-graphql';
import {CommunicationInput, LinksModel, UniqueActionModel} from "../types";

const fetch = require("node-fetch");

module.exports = (app: any) => {
    console.log("send message")
    app.get('/auth/discord-send', async (__req: any, __res: any, __next: any) => {
        try {
            // feel free to modify the scopes
            let body = {
                "content" : "test",
                "username" : "Bayarea",
            }
            const url = `https://discord.com/api/webhooks/945378582568534048/_06LsxHnU06bnfvpABycMtL85YNuSVUtJKPQl2s4CQtryL0nbWupKmstwceSvov15F3U`
            let response = await fetch(url, {
                "method" : "POST",
                "body" : JSON.stringify(body),
                "headers" : {"Content-Type" : "application/json"}
            })
            console.log(response)

        } catch (error) {
            console.log(error)
        }
    });
}

async function publishMessage(url: string, text: string): Promise<JSON> {
    let body = {
        "content" : text,
        "username" : "Bayarea",
    }

    return await fetch(url, {
        "method" : "POST",
        "body" : JSON.stringify(body),
        "headers" : {"Content-Type" : "application/json"}
    })
}

@Resolver()
export class DiscordOutResolver {
    @Mutation(() => Boolean)
    async SendDiscordMessage(@Arg('data') {action_effect_id, message}: CommunicationInput) {
        return await UniqueActionModel.findOne({id: action_effect_id}).then(async (action_effect_res) => {
            if (!action_effect_res) return false
            if (!action_effect_res.parameters) return false

            return await LinksModel.findOne({action: action_effect_res})
                .then(async (res) => {
                    if (!res) return false

                    let parameters = JSON.parse(action_effect_res.parameters)
                    const tokens = res.token.split("|") // cf slack_oauth:35
                    if (!parameters.channel_id) return false

                    const result_post = await publishMessage(, message)
                    return result_post.ok
                })
        })
    }
}
