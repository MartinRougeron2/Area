import {
    LinksModel,
    ServiceModel,
    UniqueActionModel
} from "../types";

// import {trigger_effects} from "../common";
import {google} from "googleapis";
import {OAuth2Client} from "google-auth-library";
import {trigger_effects} from "../common";

interface Events {
    "kind": "calendar#event",
    "id": string,
    "status": string,
    "htmlLink": string,
    "summary": string,
    "description": string,
    "location": string,
    "colorId": string,
    "creator": {
        "id": string,
        "email": string,
        "displayName": string,
        "self": boolean
    },
    "organizer": {
        "id": string,
        "email": string,
        "displayName": string,
        "self": boolean
    },
    "start": {
        "date": any,
        "dateTime": any,
        "timeZone": string
    },
    "end": {
        "date": any,
        "dateTime": any,
        "timeZone": string
    },
    "endTimeUnspecified": boolean,
    "recurrence": [
        string
    ],
    "recurringEventId": string,
    "originalStartTime": {
        "date": any,
        "dateTime": any,
        "timeZone": string
    },
    "transparency": string,
    "visibility": string,
    "iCalUID": string,
    "sequence": number,
    "attendees": [
        {
            "id": string,
            "email": string,
            "displayName": string,
            "organizer": boolean,
            "self": boolean,
            "resource": boolean,
            "optional": boolean,
            "responseStatus": string,
            "comment": string,
            "additionalGuests": number
        }
    ],
    "attendeesOmitted": boolean,
    "extendedProperties": {
        "private": {
            key: string
        },
        "shared": {
            key: string
        }
    },
    "hangoutLink": string,
    "conferenceData": {
        "createRequest": {
            "requestId": string,
            "conferenceSolutionKey": {
                "type": string
            },
            "status": {
                "statusCode": string
            }
        },
        "entryPoints": [
            {
                "entryPointType": string,
                "uri": string,
                "label": string,
                "pin": string,
                "accessCode": string,
                "meetingCode": string,
                "passcode": string,
                "password": string
            }
        ],
        "conferenceSolution": {
            "key": {
                "type": string
            },
            "name": string,
            "iconUri": string
        },
        "conferenceId": string,
        "signature": string,
        "notes": string,
    },
    "gadget": {
        "type": string,
        "title": string,
        "link": string,
        "iconLink": string,
        "width": number,
        "height": number,
        "display": string,
        "preferences": {}
    },
    "anyoneCanAddSelf": boolean,
    "guestsCanInviteOthers": boolean,
    "guestsCanModify": boolean,
    "guestsCanSeeOtherGuests": boolean,
    "privateCopy": boolean,
    "locked": boolean,
    "reminders": {
        "useDefault": boolean,
        "overrides": [
            {
                "method": string,
                "minutes": number
            }
        ]
    },
    "source": {
        "url": string,
        "title": string
    },
    "attachments": [
        {
            "fileUrl": string,
            "title": string,
            "mimeType": string,
            "iconLink": string,
            "fileId": string
        }
    ],
    "eventType": string

}

// const {google} = require('googleapis');

const cron = require('node-cron');

async function getMessages(email: string, __token: string, auth: OAuth2Client): Promise<string[]> {

    const calendar = google.calendar({version: 'v3', auth: auth});
    const res = await calendar.events.list({calendarId: email});
    console.log(res.data.items)
    // @ts-ignore
    const items = res.data.items as any as [Events]
    return items.map(i => i.summary)
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

                const obj = JSON.parse(unique_actions.parameters)

                LinksModel.findOne({action: unique_actions}).then(async (link_res) => {
                    console.log("link_res", link_res)
                    if (!link_res) return // null verif

                    const tokens = link_res.token.split("|")
                    const oAuth2Client = new google.auth.OAuth2()
                    oAuth2Client.setCredentials({access_token: tokens[0]})

                    console.log(oAuth2Client)

                    const messages: string[] = await getMessages(obj.from_email, link_res.token.split('|')[0], oAuth2Client)

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
