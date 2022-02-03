import {Arg, Mutation, Resolver} from 'type-graphql';
import {BayActionModel, CommunicationInput, LinksModel, UniqueAction} from "../types";
import {ChatPostMessageResponse} from "@slack/web-api/dist/response/ChatPostMessageResponse";

const {WebClient, LogLevel} = require("@slack/web-api");


async function publishMessage(id: string, text: string, token: string): Promise<ChatPostMessageResponse> {

    const client = new WebClient(token, {
        // LogLevel can be imported and used to make debugging simpler
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
    async SendSlackMessage(@Arg('data') {user_id, bayaction_id, message}: CommunicationInput) {
        if (!message) {
            return false
        }

        if (user_id || bayaction_id) {
            return false
        }

        const result_post = await publishMessage("C031J8D5C84", message, "xoxe.xoxb-1-MS0yLTMwNzM3Mjg2MTA0OTYtMzAzNjMwMDE1MTM5OS0zMDQ4MDEwNTAyMTk3LTMwMzY2NDM4NDgyMzEtYzllMmZhZWQ3YmE0MjNiNWY3MzBmMGY1OThlZjhiZWZjZGQ2OGYzMjBlZWExNTNhNDA3MDNlZWUyY2JhZDAxYQ")
        console.log(result_post)
        return result_post.ok

        return await BayActionModel.findOne({id: bayaction_id}).populate({
            path: 'action_effect',
            populate: {path: 'parameters', model: 'string'}
        }).then(async (bayaction_res) => {
            let effect = bayaction_res?.action_effect as UniqueAction

            if (!effect.parameters) {
                return false
            }

            return await LinksModel.findOne({action: {id: effect.id}})
                .then(async (res) => {
                    if (!res) {
                        return false
                    }

                    let parameters = JSON.parse(effect.parameters)
                    const tokens = parameters.token.split("|") // cf slack_oauth:35
                    if (!parameters.channel_id) {
                        return false
                    }

                    const result_post = await publishMessage(parameters.channel_id, message, tokens[0])
                    console.log(result_post)
                    return result_post.ok
                })
        })
    }
}
