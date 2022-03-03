import {
    ServiceModel,
    UniqueActionModel,
} from "../types";

import {trigger_effects} from "../common";

const cron = require('node-cron');
const fetch = require("node-fetch");

async function getNumberRepo(token_access: string) : Promise<string> {
    const response = await fetch("https://api.github.com/user/repos?type=owner", {
        headers: {
            Authorization: `token ${token_access}`
        }
    })
    const repo = await response.json()
   return repo.length.toString()
}

var task = cron.schedule('15 * * * * *', () => {
    ServiceModel.findOne({name: "Discord"}).populate('actions').then((res) => {
        if (!res?.actions) return // null verif
        UniqueActionModel.find({action: {"$in": res.actions}}).populate('action').then(async (res_unique_actions) => {
                if (!res_unique_actions) return // null verif

                for (let unique_actions of res_unique_actions) {
                    // @ts-ignore
                    if (unique_actions.action.type == 1) continue;
                    if (unique_actions.action == null) continue;
                    console.log(unique_actions)
                    const obj = JSON.parse(unique_actions.parameters)
                    if (!unique_actions.old_values) {
                        unique_actions.old_values = JSON.stringify({number: "0"})
                    }
                    // @ts-ignore
                    if (unique_actions.action.name == "fetchNewRepositories") {
                        const params = {number: await getNumberRepo(obj.access_token)}
                        if (unique_actions.old_values != JSON.stringify(params)) {
                            if (parseInt(params.number) > parseInt(JSON.parse(unique_actions.old_values).number)) {
                                await trigger_effects(unique_actions, `New repository github have been created`)
                            }
                            unique_actions.old_values = JSON.stringify(params)
                            await unique_actions.save()
                        }
                    }
                    await unique_actions.save()
                }
            }
        )

    })
})


export {task}
