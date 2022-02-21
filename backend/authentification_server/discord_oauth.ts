import express from "express";
import {create_unique_action} from "./common";

const DiscordOauth2 = require("discord-oauth2");

interface IResponse {
    access_token: string,
    expires_in: number,
    refresh_token: string,
    scope: string,
    token_type: string,
    webhook: {
      type: number,
      id: string,
      name: string,
      avatar: string,
      channel_id: string,
      guild_id: string,
      application_id: string,
      token: string,
      url: string
    }
  }

module.exports = (app: any) => {
    console.log("installing discord auth")
    const oauth = new DiscordOauth2({
        clientId: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        redirectUri: "https://localhost:3000/auth/discord-redirect",
    });
    app.get('/auth/discord', async (__req: any, res: any, __next: any) => {
        try {
            // feel free to modify the scopes
            const url = oauth.generateAuthUrl({
                scope: ["webhook.incoming"],
                state: "renoleplusbo"
            })

            res.redirect(url)
        } catch (error) {
            console.log(error)
        }
    });
    app.get('/auth/discord-redirect', async (req: express.Request, __res: express.Response, __next: any) => {
        try {
            // feel free to modify the scopes
            oauth.tokenRequest({
                code: req.query.code,
                grantType: "authorization_code",
            }).then((d: IResponse) => {
                console.log(d.webhook.url)
                const paramaters = {url: d.webhook.url}
                create_unique_action("62te6384ca747da158dr189y", JSON.stringify(paramaters), "");
            });

        } catch (error) {
            console.log(error)
        }
    });
}
