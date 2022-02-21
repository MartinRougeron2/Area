import express from "express";

const DiscordOauth2 = require("discord-oauth2");

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
                scope: ["identify", "guilds", "messages.read", "bot"],
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
            }).then(console.log)
        } catch (error) {
            console.log(error)
        }
    });
}
