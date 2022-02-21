// import {
//     LinksModel,
//     ServiceModel,
//     UniqueActionModel
// } from "../types";
//
// import {trigger_effects} from "../common";
import * as https from "https";
import {IncomingMessage} from "http";

// const {google} = require('googleapis');

const cron = require('node-cron');

async function getMessages(__email: string, __token: string) {
    https.get('https://developers.google.com/oauthplayground/#step3&apisSelect=https%3A%2F%2Fmail.google.com%2F%2Chttps%3A%2F%2Fmail.google.com%2Fmail%2Ffeed%2Fatom&auth_code=4%2F0AX4XfWhzy77Johmo5Vq48PrsZYVBgQSAD-z3e0SSl4dgcGA6pU3o4fIDt2xDr8iToayjIw&refresh_token=1%2F%2F04RnPbPS0zNo1CgYIARAAGAQSNwF-L9IrPjYjZoKvp2vidKZEVWtqlybmOjsB-QzCM6xcPqJcquq2CMl_eBsoHJkcB8doXEvlZzU&access_token_field=ya29.A0ARrdaM-o8NL9ZuUtPSsee8dRBLzAwLTIKz4A1K2SwU7YpZYhdaUsQ9RljV3rIqwFjVo1Pl7HE-3lXwORxzJd3cQMdOXLUgH2b8qF74xLlKUnRZEoleuZeZCaMbT4-vzLISz0XHOiOZRCuJ-dWY-t2hpJECz5&url=https%3A%2F%2Fgmail.googleapis.com%2Fgmail%2Fv1%2Fusers%2Fme%2Fmessages&content_type=application%2Fjson&http_method=GET&useDefaultOauthCred=unchecked&oauthEndpointSelect=Google&oauthAuthEndpointValue=https%3A%2F%2Faccounts.google.com%2Fo%2Foauth2%2Fv2%2Fauth&oauthTokenEndpointValue=https%3A%2F%2Foauth2.googleapis.com%2Ftoken&expires_in=3598&access_token_issue_date=1645195980&for_access_token=ya29.A0ARrdaM-o8NL9ZuUtPSsee8dRBLzAwLTIKz4A1K2SwU7YpZYhdaUsQ9RljV3rIqwFjVo1Pl7HE-3lXwORxzJd3cQMdOXLUgH2b8qF74xLlKUnRZEoleuZeZCaMbT4-vzLISz0XHOiOZRCuJ-dWY-t2hpJECz5&includeCredentials=checked&accessTokenType=bearer&autoRefreshToken=unchecked&accessType=offline&prompt=consent&response_type=code&wrapLines=on', {}, (res: IncomingMessage) => {
        console.log(res.statusCode)
        res.on('data', function (d) {
            process.stdout.write(d);
        });
    })
    return ""
}

console.log(getMessages("martin.rougeron@gmail.com", "ya29.A0ARrdaM8cViAA881tAD1-9_gPEMespoEO-R6LtIoyaWpbety8nW_Gnr7DT_CK9TX-_1-QVtOKfc016KOwY5oxqGOunsEQ6f5WxmKJ9yLFrJuIgUlFI8bLpxb5YVZJOJPIDPQ0GsDCymYqXRRtpx27KWzae04v"))

var task = cron.schedule('* * * * * *', () => {
    // ServiceModel.findOne({name: "Gmail"}).populate('actions').then((res: any | null) => {
    //     if (!res?.actions) return // null verif
    //
    //     UniqueActionModel.find({action: {"$in": res.actions}}).populate('action').then(async (res_unique_actions) => {
    //         if (!res_unique_actions) return // null verif
    //
    //         for (let unique_actions of res_unique_actions) {
    //             // @ts-ignore
    //             if (unique_actions.action.type == 1) continue;
    //
    //             const obj = JSON.parse(unique_actions.parameters)
    //
    //             LinksModel.findOne({action: unique_actions}).then(async (link_res) => {
    //                 if (!link_res) return // null verif
    //
    //                 console.log(unique_actions.action)
    //
    //                 const messages = (await getMessages(obj.from_email, link_res.token.split('|')[0]))
    //
    //                 if (unique_actions.old_values != JSON.stringify(messages)) {
    //                     await trigger_effects(unique_actions, messages[messages.length - 1])
    //                     unique_actions.old_values = JSON.stringify(messages)
    //                     await unique_actions.save()
    //                 }
    //             })
    //         }
    //     })
    //
    // })
})


export {task}
