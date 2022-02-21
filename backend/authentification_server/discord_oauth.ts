const DiscordOauth2 = require("discord-oauth2");

module.exports = (app: any) => {
    console.log("installing discord auth")
    const oauth = new DiscordOauth2();
    app.get('/auth/discord', async (__req: any, res: any, __next: any) => {
        try {
            // feel free to modify the scopes
            oauth.tokenRequest({
                clientId: process.env.DISCORD_CLIENT_ID,
                clientSecret: process.env.DISCORD_CLIENT_SECRET,
            
                code: "query code",
                scope: "identify guilds",
                grantType: "authorization_code",
                
                redirectUri: "https://localhost:3000/auth/discord-redirect",
            }).then(console.log)
            res.redirect()
        } catch (error) {
            console.log(error)
        }
    });
}
