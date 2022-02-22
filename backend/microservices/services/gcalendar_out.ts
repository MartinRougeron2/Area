import {Arg, Mutation, Resolver} from 'type-graphql';
import {CommunicationInput, LinksModel, UniqueActionModel} from "../types";
import {google} from "googleapis";
import { OAuth2Client } from 'google-auth-library';



const Event = (title: string, __date: string) => {
    return {
        'summary': title,
        'start':
            {
                'dateTime': "2015-05-28T09:00:00-07:00",
            }
        ,
        'end':
            {
                'dateTime': "2015-05-28T09:00:00-08:00",
            }
        ,
    }
}
;

// @ts-ignore
async function createEvent(event: any, auth: OAuth2Client) {

    const calendar = google.calendar({version: 'v3', auth: auth});
    console.log(calendar.events.insert({calendarId: "martin.rougeron@gmail.com", requestBody: {summary: event.summary, start: event.start, end: event.end}}))
    return await calendar.events.insert({calendarId: "martin.rougeron@gmail.com", requestBody: {summary: event.summary, start: event.start, end: event.end}, });
}


@Resolver()
export class GCalendarOutResolver {
    @Mutation(() => Boolean)
    async CreateEvent(@Arg('data') {action_effect_id, message}: CommunicationInput) {
        console.log("ouo")
        return await UniqueActionModel.findById(action_effect_id).populate('action').then(async (action_effect_res) => {
            console.log(action_effect_res)
            if (!action_effect_res) return false
            if (!action_effect_res.parameters) return false

            return await LinksModel.findOne({action: action_effect_res})
                .then(async (res) => {
                    if (!res) return false


                    let parameters = JSON.parse(action_effect_res.parameters)
                    const tokens = res.token.split("|") // cf slack_oauth:35
                    console.log(parameters.date)
                    console.log(tokens[0])
                    // if (!parameters.date) return false
                    if (!tokens[0]) return false

                    const oAuth2Client = new google.auth.OAuth2()
                    oAuth2Client.setCredentials({access_token: tokens[0]})

                    console.log(oAuth2Client)

                    return (await createEvent(Event(message, parameters.date), oAuth2Client)).status === 200

                })
        })
    }

}
