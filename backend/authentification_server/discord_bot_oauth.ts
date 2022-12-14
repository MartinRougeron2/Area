import express from "express";
import {create_unique_action, DResponse} from "./common";

const DiscordOauth2 = require("discord-oauth2");

module.exports = (app: any) => {
    console.log("installing discord bot auth")
    const oauth = new DiscordOauth2({
        clientId: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        redirectUri: "https://localhost:5001/auth/discord/bot/redirect",
    });
    app.get('/auth/discord/bot', async (req: any, res: any, __next: any) => {
        try {
            // feel free to modify the scopes
            const url = oauth.generateAuthUrl({
                permissions: "1644637453377",
                scope: "webhook.incoming bot identify",
                state: req.query.id
            })

            res.redirect(url)
        } catch (error) {
            console.log(error)
        }
    });
    app.get('/auth/discord/bot/redirect', async (req: express.Request, res: express.Response, __next: any) => {
        try {
            // feel free to modify the scopes
            oauth.tokenRequest({
                code: req.query.code,
                grantType: "authorization_code",
            }).then(async (d: DResponse) => {
                const token = d?.access_token + "|" + d?.refresh_token
                const paramaters = {channel_id: d.webhook.channel_id}
                const action_id = (req.query.state ?? "") as unknown as string

                const newId = await create_unique_action(action_id, JSON.stringify(paramaters), token);
                res.redirect("http://localhost:8081/auth/win?id=" + newId)
            })
        } catch (error) {
            console.log(error)
        }
    });
}
