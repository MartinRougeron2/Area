import {
    BayActionModel,
    LinksModel,
    ServiceModel,
    UniqueAction,
    UniqueActionModel
} from "../types";
import {Ref} from "@typegoose/typegoose";
import {gql} from "apollo-boost";
import {client as apolloClient} from "../../authentification_server/apollo_client";

const cron = require('node-cron');
const {WebClient, LogLevel} = require("@slack/web-api");

/*
cron.schedule('* * * * * *')
               | | | | | |
               | | | | | day of week
               | | | | month
               | | | day of month
               | | hour
               | minute
               second ( optional )
 */

const client = new WebClient(process.env.SLACK_BOT_TOKEN, {
    logLevel: LogLevel.DEBUG
});

console.log("im in")

async function dispatch_event(action_effect_ref: Ref<UniqueAction>, msg: string) {
    console.log(action_effect_ref, msg)
    if (!action_effect_ref) return
    if (!msg) return

    const action_effect = action_effect_ref as UniqueAction // populate before : Ref => Complete Model

    if (!action_effect) return null

    const effect_base = action_effect.action
    const effect_service = await ServiceModel.findOne({actions: effect_base}).then((res) => res)

    if (!effect_service) return
    if (!effect_service.out_url) return

    const mutation = gql`
        mutation NewEventMutation($action_id: String!, $text: String!) {
            ${effect_service.out_url}(data: {action_effect_id: $action_id, message: $text})
        }`;

    apolloClient.mutate({
        mutation: mutation,
        variables: {
            action_id: action_effect.id,
            text: msg
        }
    }).catch((err: any) => {
        console.log(err)
    }).then((result: any) => {
        console.log(result)
    })
    return true

}


async function getMessages(channel_id: string, token: string) {
    return await client.conversations.history({
        // The token you used to initialize your app
        channel: channel_id,
        token: token
    });
}

var task = cron.schedule('15 * * * * *', () => {
    ServiceModel.findOne({name: "slack"}).populate('actions').then((res) => {
        if (!res?.actions) return // null verif

        UniqueActionModel.find({action: {"$in": res.actions}}).then(async (res_unique_actions) => {
            if (!res_unique_actions) return // null verif

            for (let unique_actions of res_unique_actions) {
                const obj = JSON.parse(unique_actions.parameters)
                LinksModel.findOne({action: unique_actions}).then(async (link_res) => {
                    if (!link_res) return // null verif

                    const messages = (await getMessages(obj.channel_id, link_res.token.split('|')[0])).messages

                    if (unique_actions.old_values != JSON.stringify(messages)) {
                        BayActionModel.find({action_trigger: unique_actions}).populate('action_effect').then(async (res_bay) => {
                            for (const i in res_bay) {
                                await res_bay[i].populate('action_effect.action')
                                if (!res_bay[i]) return;
                                if (!res_bay[i].action_effect) return;

                                await dispatch_event(res_bay[i].action_effect, messages[messages.length - 1].text)
                                unique_actions.old_values = JSON.stringify(messages)
                                await unique_actions.save()
                            }
                        })
                    }
                })
            }
        })

    })
})


export {task}
