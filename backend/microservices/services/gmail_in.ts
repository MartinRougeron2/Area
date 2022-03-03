import {
    LinksModel,
    ServiceModel,
    UniqueActionModel
} from "../types";

import {trigger_effects} from "../common";
import * as https from "https";
import {IncomingMessage} from "http";

// const {google} = require('googleapis');

const cron = require('node-cron');

async function getMessages(email: string, token: string) {
    https.get(`https://gmail.googleapis.com/gmail/v1/users/${email}/messages`, {headers: {"Authorization": `Bearer ${token}`}}, (res: IncomingMessage) => {
        console.log(res.statusCode)
        res.on('data', function (d) {
            process.stdout.write(d);
        });
    })
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
