import {
    ServiceModel,
    UniqueActionModel,
    LinksModel
} from "../types";

import {trigger_effects, DMessage, DUser} from "../common";
const client = require("../server")

const cron = require('node-cron');
const fetch = require("node-fetch");

async function getMessages(channel_id: string) : Promise<[DMessage]> {
    const channel = client.channels.cache.get(channel_id)
    return await channel.messages.fetch({limit: 1});
}

async function getUsername(token_access: string) : Promise<DUser> {
    const response = await fetch(`https://discord.com/api/v9/users/@me`, {
    headers: {
      Authorization: `Bearer ${token_access}`
    }
  })
   return await response.json()
}

var task = cron.schedule('1 * * * * *', () => {
    ServiceModel.findOne({name: "Discord"}).populate('actions').then((res) => {
        if (!res?.actions) return // null verif


        console.log("im in")

        UniqueActionModel.find({action: {"$in": res.actions}}).populate('action').then(async (res_unique_actions) => {
                if (!res_unique_actions) return // null verif

                for (let unique_actions of res_unique_actions) {
                    // @ts-ignore
                    if (unique_actions.action.type == 1) continue;
                    if (unique_actions.action == null) continue;
                    const obj = JSON.parse(unique_actions.parameters)
                    if (!obj) return // null verif
                    console.log(unique_actions)
                    if (!obj.channel_id) return // null verif
                    if (unique_actions.old_values == "") {
                        unique_actions.old_values = JSON.stringify({id: "", username: ""})
                    }
                    if (!unique_actions.old_values) return // null verif
                    let get_old_values = JSON.parse(unique_actions.old_values)

                    // @ts-ignore
                    if (unique_actions.action.name == "fetchDiscordMessage") {
                        let msgs = await getMessages(obj.channel_id)
                        msgs = JSON.parse(JSON.stringify(msgs))
                        const {id, content, authorId, guildId} = msgs[0]
                        if (get_old_values["id"] != id) {
                            await trigger_effects(unique_actions, `**${client.users.cache.get(authorId).username}** send : **${content}** | server : **${client.guilds.cache.get(guildId).name}** | channel : **${client.channels.cache.get(obj.channel_id).name}**`)
                            get_old_values["id"] = id
                            unique_actions.old_values = JSON.stringify(get_old_values)
                            await unique_actions.save()
                        }
                    }
                    // @ts-ignore
                    if (unique_actions.action.name == "fetchDiscordUsername") {
                        LinksModel.findOne({action: unique_actions}).then(async (link_res) => {
                            if (!link_res) return // null verif
                            const {username} = (await getUsername(link_res.token.split('|')[0]))
                            if (get_old_values["username"] != username) {
                                await trigger_effects(unique_actions, `${get_old_values["username"]} : change username to ${username}`)
                                get_old_values["username"] = username
                                unique_actions.old_values = JSON.stringify(get_old_values)
                                await unique_actions.save()
                            }
                        })
                    }
                    await unique_actions.save()
                }
            }
        )

    })
})


export {task}
