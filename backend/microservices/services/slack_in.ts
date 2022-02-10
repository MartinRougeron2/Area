import {BayActionModel, LinksModel, ServiceModel, UniqueAction, UniqueActionModel} from "../types";
import {Ref} from "@typegoose/typegoose";

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

function dispatch_event(action_effect: Ref<UniqueAction>, msg: string) {
    if (!action_effect) return
    if (!msg) return
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
                console.log(unique_actions.parameters)
                const obj = JSON.parse(unique_actions.parameters)
                console.log("unique_actions - " + unique_actions)
                LinksModel.findOne({action: unique_actions}).then(async (link_res) => {
                    console.log("uniqueaction - ", link_res)
                    if (!link_res) return // null verif

                    const messages = (await getMessages(obj.channel_id, link_res.token.split('|')[0])).messages

                    console.log(messages)
                    console.log(link_res.token.split('|')[0])

                    if (unique_actions.old_values != messages) {
                        console.log("diff")
                        BayActionModel.find({action_trigger: {id: unique_actions.id}}).then((res_bay) => {
                            for (const i in res_bay) {
                                dispatch_event(res_bay[i].action_effect, messages[messages.lenght - 1].text)
                                unique_actions.old_values = messages
                            }
                        })
                    }
                })

            }
        })

    })
})


export {task}
