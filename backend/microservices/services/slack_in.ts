import {
    LinksModel,
    ServiceModel,
    UniqueActionModel
} from "../types";

import {trigger_effects} from "../common";

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

async function getMessages(channel_id: string, token: string) {
    return await client.conversations.history({
        // The token you used to initialize your app
        channel: channel_id,
        token: token
    });
}

cron.schedule('15 * * * * *', () => {
    ServiceModel.findOne({name: "slack"}).populate('actions').then((res) => {
        if (!res?.actions) return // null verif

        UniqueActionModel.find({action: {"$in": res.actions}}).then(async (res_unique_actions) => {
            if (!res_unique_actions) return // null verif

            for (let unique_actions of res_unique_actions) {
                // @ts-ignore
                if (unique_actions.action.type == 1) continue;

                const obj = JSON.parse(unique_actions.parameters)

                LinksModel.findOne({action: unique_actions}).then(async (link_res) => {
                    if (!link_res) return // null verif

                    const messages = (await getMessages(obj.channel_id, link_res.token.split('|')[0])).messages

                    if (unique_actions.old_values != JSON.stringify(messages)) {
                        await trigger_effects(unique_actions, messages[messages.length - 1].text)
                        unique_actions.old_values = JSON.stringify(messages)
                        await unique_actions.save()
                    }
                })
            }
        })

    })
})


