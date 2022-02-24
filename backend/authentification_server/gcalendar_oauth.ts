import express from "express";
import {google} from "googleapis";
import {create_unique_action} from "./common";
import {LoginTicket} from "google-auth-library/build/src/auth/loginticket";

const SCOPES = ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events', 'https://www.googleapis.com/auth/calendar.events.readonly', 'https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'];

interface Query {
   code:string;
   state:string;
}

const oAuth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID ?? "", process.env.GOOGLE_CLIENT_SECRET ?? "", "https://localhost:3000/auth/gcalendar/callback");

module.exports = (app: any) => {

    // app.use(authMiddleWare.authn());

    console.log(oAuth2Client)
    app.get('/auth/gcalendar', (__req: express.Request, res: express.Response) => {

        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
            state: ""
        });
        console.log(oAuth2Client)
        res.redirect(authUrl)
    })

    // app.get('/auth/google/callback',
    //     passport.authenticate('google', {failureRedirect: '/fail'}),
    //     function (__req: express.Request, res: express.Response) {
    //         res.redirect('/auth/google/win');
    //     });

    app.get('/auth/gcalendar/callback', async (req: express.Request, res: express.Response) => {
        const {code} = req.query as unknown as Query;

        oAuth2Client.getToken(code, (err: any, token: any | string, __res: any) => {
            if (err)
                return console.error('Error retrieving access token', err);
            console.log(token);
            oAuth2Client.verifyIdToken({idToken: token.id_token, audience: process.env.GOOGLE_CLIENT_ID ?? ""})
                .catch((err) => console.log(err))
                .then((res: LoginTicket | void) => {
                    console.log(res);
                    if (!res)
                        return;
                    const payload = res.getPayload()
                    if (!payload)
                        return;
                    const params = {date: ""};
                    create_unique_action("6214ef5ebf6badb7f46d12a3", JSON.stringify(params), token.access_token + "|" + token.refresh_token);
                });

        });

        res.redirect('/auth/google/win')
    })

    app.get('/auth/google/win', (__req: express.Request, res: express.Response) => {
        res.send('Ca marche !')
    })
}
