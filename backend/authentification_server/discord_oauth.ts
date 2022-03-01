import express from "express";
import {create_unique_action, IResponse} from "./common";

const DiscordOauth2 = require("discord-oauth2");

module.exports = (app: any) => {
    console.log("installing discord auth")
    const oauth = new DiscordOauth2({
        clientId: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        redirectUri: "https://localhost:5001/auth/discord/redirect",
    });
    app.get('/auth/discord', async (req: any, res: any, __next: any) => {
        try {
            // feel free to modify the scopes
            const url = oauth.generateAuthUrl({
                permissions: "1644637453377",
                scope: ["webhook.incoming bot"],
                state: req.query.id
            })

            res.redirect(url)
        } catch (error) {
            console.log(error)
        }
    });
    app.get('/auth/discord/redirect', async (req: express.Request, res: express.Response, __next: any) => {
        try {
            // feel free to modify the scopes
            oauth.tokenRequest({
                code: req.query.code,
                grantType: "authorization_code",
            }).then((d: IResponse) => {
                const paramaters = {url: d.webhook.url, channel_id : d.webhook.channel_id}
                const action_id = (req.query.state ?? "") as unknown as string

                create_unique_action(action_id, JSON.stringify(paramaters), "");
            }).then(() => {
                res.redirect("/auth/finish")
            })

        } catch (error) {
            console.log(error)
        }
    });
}
