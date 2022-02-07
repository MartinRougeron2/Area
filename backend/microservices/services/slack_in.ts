import {BaseAction, BayActionModel, LinksModel, ServiceModel, UniqueAction, UniqueActionModel} from "../types";
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

var task = cron.schedule('* * * * *', () => {
    ServiceModel.findOne({name: "slack"}).populate({
        path: 'actions',
        model: 'BaseActionModel',
    }).then((res) => {
        if (!res?.actions) return // null verif

        res.actions?.forEach((action: BaseAction) => {
            if (!action.id) return // null verif

            UniqueActionModel.find({action: {id: action.id}}).then((res_unique_actions) => {
                if (!res_unique_actions) return // null verif
                for (let unique_actions of res_unique_actions) {
                    const obj = JSON.parse(unique_actions.parameters)
                    LinksModel.findOne({action: {id: unique_actions.id}}).then(async (link_res) => {
                        if (!link_res) return // null verif

                        const messages = (await getMessages(obj.channel_id, link_res.token)).messages

                        if (unique_actions.old_values != messages) {
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
})


export {task}
