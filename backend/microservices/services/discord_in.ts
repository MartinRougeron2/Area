import {
    ServiceModel,
    UniqueActionModel
} from "../types";

import {trigger_effects} from "../common";

interface DMessage {
    id: string,
    content: string,
}

const cron = require('node-cron');
const {Client, Intents} = require('discord.js');

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]})
client.login(process.env.BOT_DISCORD_TOKEN)
client.once('ready', () => {
    console.log("Discord bot online")
});

async function getMessages(channel_id: string) : Promise<[DMessage]> {
    const channel = client.channels.cache.get(channel_id)
    return await channel.messages.fetch({limit: 1});
}

var task = cron.schedule('15 * * * * *', () => {
    ServiceModel.findOne({name: "Discord"}).populate('actions').then((res) => {
        if (!res?.actions) return // null verif


        console.log("im in")

        UniqueActionModel.find({action: {"$in": res.actions}}).populate('action').then(async (res_unique_actions) => {
                if (!res_unique_actions) return // null verif

                for (let unique_actions of res_unique_actions) {
                    // @ts-ignore
                    if (unique_actions.action.type == 1) continue;
                    const obj = JSON.parse(unique_actions.parameters)
                    if (!obj) return // null verif
                    console.log(unique_actions)
                    if (!obj.channel_id) return // null verif

                    let msgs = await getMessages(obj.channel_id)
                    msgs = JSON.parse(JSON.stringify(msgs))
                    const {id, content} = msgs[0]

                    if (unique_actions.old_values != id) {
                        await trigger_effects(unique_actions, content)
                        unique_actions.old_values = id
                        await unique_actions.save()
                    }
                }
            }
        )

    })
})


export {task}
