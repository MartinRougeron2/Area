import {
    LinksModel,
    ServiceModel,
    UniqueActionModel
} from "../types";

import {trigger_effects} from "../common";
const {google} = require('googleapis');

const cron = require('node-cron');

async function getMessages(__email: string, token: string) {
    const oAuth2Client = new google.auth.OAuth2()
    oAuth2Client.setCredentials({access_token: token})
    console.log(oAuth2Client)
    const gmail = google.gmail({version: 'v1', oAuth2Client});
    const a = await gmail.users.labels.list({
        userId: 'me',
    })
    console.log(a)
    return ""
}

var task = cron.schedule('* * * * * *', () => {
    ServiceModel.findOne({name: "Gmail"}).populate('actions').then((res: any | null) => {
        if (!res?.actions) return // null verif

        UniqueActionModel.find({action: {"$in": res.actions}}).populate('action').then(async (res_unique_actions) => {
            if (!res_unique_actions) return // null verif

            for (let unique_actions of res_unique_actions) {
                // @ts-ignore
                if (unique_actions.action.type == 1) continue;

                const obj = JSON.parse(unique_actions.parameters)

                LinksModel.findOne({action: unique_actions}).then(async (link_res) => {
                    if (!link_res) return // null verif

                    console.log(unique_actions.action)

                    const messages = (await getMessages(obj.from_email, link_res.token.split('|')[0]))

                    if (unique_actions.old_values != JSON.stringify(messages)) {
                        await trigger_effects(unique_actions, messages[messages.length - 1])
                        unique_actions.old_values = JSON.stringify(messages)
                        await unique_actions.save()
                    }
                })
            }
        })

    })
})


export {task}
// ya29.A0ARrdaM9TnCAHWun4jwBipuk6JBnHx2RQ2theoxVZ-_2PhHPUF66DYh1gzr3ICFxJDwuc1wdpSPi6pxNJ8qZWg0EdDVAPfM8qrKjeLs5rXz0EiUxiU8xRWZ9AHToi4p7C5NjdsdN13l5LUhpY7Fc9HOlnmeee
