import {Arg, Field, InputType, Mutation, Resolver} from 'type-graphql';
import {LinksModel} from "../types";
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
    channel_id!: string;

    @Field()
    message!: string;
}


@Resolver()
export class SlackOutResolver {
    @Mutation(() => Boolean)
    async SendSlackMessage(@Arg('data') {user_id, channel_id, message}: SlackInput) {
        if (!channel_id || !message) {
            return false
        }
        LinksModel.find({user: {id: user_id}, service: {name: "slack"}}).then(async (res) => {
            let response_api = await publishMessage(channel_id, message, res[0].token)
            return response_api.ok
        })
        return false
    }
}
