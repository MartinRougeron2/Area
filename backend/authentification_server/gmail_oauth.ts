import express from "express";
import {google} from "googleapis";
import {create_unique_action} from "./common";
import {LoginTicket} from "google-auth-library/build/src/auth/loginticket";

const SCOPES = ['https://mail.google.com/', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email', "email"];

interface Query {
   code:string;
   state:string;
}

const oAuth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID ?? "", process.env.GOOGLE_CLIENT_SECRET ?? "", "https://localhost:5001/auth/gmail/callback");

module.exports = (app: any) => {

    // app.use(authMiddleWare.authn());

    console.log(oAuth2Client)
    app.get('/auth/gmail', (req: express.Request, res: express.Response) => {

        const email_to_send = req.query.email  ?? "" as unknown as string
        const id = req.query.id as unknown as string

        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
            state: email_to_send + "|" + id
        });
        console.log(oAuth2Client)
        res.redirect(authUrl)
    })

    // app.get('/auth/google/callback',
    //     passport.authenticate('google', {failureRedirect: '/fail'}),
    //     function (__req: express.Request, res: express.Response) {
    //         res.redirect('/auth/google/win');
    //     });

    app.get('/auth/gmail/callback', async (req: express.Request, _res: express.Response) => {
        const {code, state} = req.query as unknown as Query;
        const [to_email, id] = state.split("|")
        let unique_id = ""

        oAuth2Client.getToken(code, (err: any, token: any | string, __res: any) => {
            if (err)
                return console.error('Error retrieving access token', err);
            console.log(token);
            oAuth2Client.verifyIdToken({idToken: token.id_token, audience: process.env.GOOGLE_CLIENT_ID ?? ""})
                .catch((err) => console.log(err))
                .then(async (res: LoginTicket | void) => {
                    console.log(res);
                    if (!res)
                        return;
                    const payload = res.getPayload()
                    if (!payload)
                        return;
                    const params = {from_email: payload.email, to_email: to_email ?? ""};
                    unique_id = await create_unique_action(id, JSON.stringify(params), token.access_token + "|" + token.refresh_token);
                    _res.redirect('http://localhost:8081/auth/win?id=' + unique_id)
                });
        });
    })

    app.get('/auth/google/win', (__req: express.Request, res: express.Response) => {
        res.send('Ca marche !')
    })
}
