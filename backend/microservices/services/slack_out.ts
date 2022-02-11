import {Arg, Mutation, Resolver} from 'type-graphql';
import {CommunicationInput, LinksModel, UniqueActionModel} from "../types";
import {ChatPostMessageResponse} from "@slack/web-api/dist/response/ChatPostMessageResponse";

const {WebClient, LogLevel} = require("@slack/web-api");


async function publishMessage(id: string, text: string, token: string): Promise<ChatPostMessageResponse> {

    const client = new WebClient(token, {
        logLevel: LogLevel.DEBUG
    }) as typeof WebClient;

    return await client.chat.postMessage({
        channel: id,
        text: text,
        token: token,
    })
}


@Resolver()
export class SlackOutResolver {
    @Mutation(() => Boolean)
    async SendSlackMessage(@Arg('data') {action_effect_id, message}: CommunicationInput) {
        return await UniqueActionModel.findOne({id: action_effect_id}).then(async (action_effect_res) => {
            if (!action_effect_res) return false
            if (!action_effect_res.parameters) return false

            return await LinksModel.findOne({action: action_effect_res})
                .then(async (res) => {
                    if (!res) return false

                    let parameters = JSON.parse(action_effect_res.parameters)
                    const tokens = res.token.split("|") // cf slack_oauth:35
                    if (!parameters.channel_id) return false

                    const result_post = await publishMessage(parameters.channel_id, message, tokens[0])
                    return result_post.ok
                })
        })
    }
}
