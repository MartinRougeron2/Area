import {
    LinksModel,
    ServiceModel,
    UniqueActionModel
} from "../types";

// import {trigger_effects} from "../common";
import {google} from "googleapis";
import {OAuth2Client} from "google-auth-library";
import {trigger_effects} from "../common";

// const {google} = require('googleapis');

const cron = require('node-cron');

async function getFiles(auth: OAuth2Client): Promise<string[]> {

    const drive = google.drive({version: 'v3', auth: auth});
    const res = await drive.files.list({});
    console.log(res.data.files)
    // @ts-ignore
    const items = res.data.files
    if (!items) return []
    return items.map(i => i.name ?? "")
}

async function getDrives(auth: OAuth2Client): Promise<string[]> {

    const drive = google.drive({version: 'v3', auth: auth});
    const res = await drive.teamdrives.list({});
    console.log(res.data.teamDrives)
    // @ts-ignore
    const items = res.data.teamDrives
    if (!items) return []
    return items.map(i => i.name ?? "")
}


var task = cron.schedule('15 * * * * *', () => {
    ServiceModel.findOne({name: "GCalendar"}).populate('actions').then((res: any | null) => {
        if (!res?.actions) return // null verif


        UniqueActionModel.find({action: {"$in": res.actions}}).populate('action').then(async (res_unique_actions) => {
            console.log(res_unique_actions)
            if (!res_unique_actions) return // null verif

            for (let unique_actions of res_unique_actions) {
                // @ts-ignore
                if (unique_actions.action.type == 1) continue;

                LinksModel.findOne({action: unique_actions}).then(async (link_res) => {
                    console.log("link_res", link_res)
                    if (!link_res) return // null verif

                    const tokens = link_res.token.split("|")
                    const oAuth2Client = new google.auth.OAuth2()
                    oAuth2Client.setCredentials({access_token: tokens[0]})

                    console.log(oAuth2Client)

                    // @ts-ignore
                    const messages: string[] = await (unique_actions.action.name == "getFiles" ? getFiles(oAuth2Client) : getDrives(oAuth2Client))

                    if (unique_actions.old_values != JSON.stringify(messages)) {
                        trigger_effects(unique_actions, messages[messages.length - 1] ?? "")
                        console.log(messages[messages.length - 1])
                        unique_actions.old_values = JSON.stringify(messages)
                        await unique_actions.save()
                    }
                })
            }
        })

    })
})


export {task}
