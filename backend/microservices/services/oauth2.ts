import {LinksModel} from "../types";
import fetch, {Response} from 'node-fetch';

const cron = require('node-cron');

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

const fillTemplate = function (templateString: String, templateVars: any) {
    return new Function("return `" + templateString + "`;").call(templateVars);
}


cron.schedule('0 0 0 * * *', () => {

    LinksModel.find({}).then((res) => {
        if (!res) return // check null

        res.forEach(async link => {
            const refresh_token = link.token.split("|")[1]
            const url = link.refresh_token_url

            const refresh_url = fillTemplate(url, {
                refresh_token: refresh_token,
                process: process
            })

            await fetch(refresh_url, {method: "POST"}).then(async (res: Response) => {
                const res_json = (await res.json())
                let new_token = (res_json.refresh_token) ? res_json.refresh_token : refresh_token
                new_token += res_json.access_token
                link.token = new_token
                link.save()
            })
        })
    })

})
