import express from "express";
import {create_unique_action} from "./common";

const DiscordOauth2 = require("discord-oauth2");

interface DResponse {
    access_token: string,
    expires_in: number,
    refresh_token: string,
    scope: string,
    token_type: string,
    guild: {
      id: string,
      name: string,
      icon: object,
      description: string,
      splash: string,
      discovery_splash: string,
      features: any,
      emojis: any,
      stickers: any,
      banner: string,
      owner_id: string,
      application_id: string,
      region: string,
      afk_channel_id: string,
      afk_timeout: number,
      system_channel_id: string,
      widget_enabled: boolean,
      widget_channel_id: string,
      verification_level: number,
      roles: any,
      default_message_notifications: number,
      mfa_level: number,
      explicit_content_filter: number,
      max_presences: number,
      max_members: number,
      max_video_channel_users: number,
      vanity_url_code: string,
      premium_tier: number,
      premium_subscription_count: number,
      system_channel_flags: number,
      preferred_locale: string,
      rules_channel_id: string,
      public_updates_channel_id: string,
      hub_type: string,
      premium_progress_bar_enabled: boolean,
      nsfw: boolean,
      nsfw_level: number,
      embed_enabled: boolean,
      embed_channel_id: string
    }
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
    console.log("installing discord bot auth")
    const oauth = new DiscordOauth2({
        clientId: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        redirectUri: "https://localhost:3000/auth/discord/bot/redirect",
    });
    app.get('/auth/discord/bot', async (__req: any, res: any, __next: any) => {
        try {
            // feel free to modify the scopes
            const url = oauth.generateAuthUrl({
                permissions: "1644637453377",
                scope: "webhook.incoming bot identify",
                state: "renoleplusbo"
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
            }).then((d: DResponse) => {
                const token = d?.access_token + "|" + d?.refresh_token
                const paramaters = {channel_id: d.webhook.channel_id}
                create_unique_action("6216719c0012d003d60780b3", JSON.stringify(paramaters), token);
            }).then(() => {
                res.redirect("/auth/finish")
            })
        } catch (error) {
            console.log(error)
        }
    });
}
