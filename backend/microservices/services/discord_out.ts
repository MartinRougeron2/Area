import {Arg, Mutation, Resolver} from 'type-graphql';
import {CommunicationInput, UniqueActionModel} from "../types";

const fetch = require("node-fetch");

const client = require("../server")

async function publishMessage(url: string, text: string): Promise<any> {
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

async function reactMessages(channel_id : string) : Promise<any> {
    const channel = client.channels.cache.get(channel_id)
    return await channel.messages.fetch({ limit: 1 }).then((messages: any) => {
        let lastMessage = messages.first();
        lastMessage.react('🤖')
    })
}

@Resolver()
export class DiscordOutResolver {
    @Mutation(() => Boolean)
    async SendDiscordMessage(@Arg('data') {action_effect_id, message}: CommunicationInput) {
        return await UniqueActionModel.findById(action_effect_id).then(async (action_effect_res) => {
            if (!action_effect_res) return false
            if (!action_effect_res.parameters) return false
            
            let parameters = JSON.parse(action_effect_res.parameters)
            console.log(parameters.url);
            if (!parameters.url) return false
            const result_post = await publishMessage(parameters.url, message)
            return !result_post.error
        })
    }

    @Mutation(() => Boolean)
    // @ts-ignore
    async SendDiscordReaction(@Arg('data') {action_effect_id, message}: CommunicationInput) {
        return await UniqueActionModel.findById(action_effect_id).then(async (action_effect_res) => {
            if (!action_effect_res) return false
            if (!action_effect_res.parameters) return false
            
            let parameters = JSON.parse(action_effect_res.parameters)
            if (!parameters.channel_id) return false
            const result_post = await reactMessages(parameters.channel_id)
            return result_post
        })
    }
}