import {Arg, Field, InputType, Mutation, Resolver} from 'type-graphql';
import {BayActionModel, LinksModel, UniqueAction} from "../types";
import {ChatPostMessageResponse} from "@slack/web-api/dist/response/ChatPostMessageResponse";

const {WebClient, LogLevel} = require("@slack/web-api");


async function publishMessage(id: string, text: string, token: string): Promise<ChatPostMessageResponse> {

    const client = new WebClient(token, {
        // LogLevel can be imported and used to make debugging simpler
        logLevel: LogLevel.DEBUG
    });

    return client.chat.postMessage({
        token: token,
        channel: id,
        text: text
    })

}

@InputType()
export class SlackInput {
    @Field()
    user_id!: string;

    @Field()
    bayaction_id!: string;

    @Field()
    message!: string;
}


@Resolver()
export class SlackOutResolver {
    @Mutation(() => Boolean)
    async SendSlackMessage(@Arg('data') {user_id, bayaction_id, message}: SlackInput) {
        if (!message) {
            return false
        }

        return await BayActionModel.findOne({id: bayaction_id}).populate({
            path: 'action_effect',
            populate: {path: 'parameters', model: 'string'}
        }).then(async (bayaction_res) => {
            let effect = bayaction_res?.action_effect as UniqueAction

            if (!effect.parameters) {
                return false
            }

            return await LinksModel.findOne({user: {id: user_id}, service: {name: "slack"}})
                .then(async (res) => {
                    if (!res) {
                        return false
                    }

                    let parameters = JSON.parse(effect.parameters)
                    if (!parameters.channel_id) {
                        return false
                    }

                    let response_api = await publishMessage(parameters.channel_id, message, res.token)
                    return response_api.ok
                })
        })
    }
}
