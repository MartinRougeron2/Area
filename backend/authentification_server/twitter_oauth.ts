import passport from "passport"
import {Strategy as TwitterStrategy} from "passport-twitter"
import express from "express";
// const authMiddleWare = require("firebase-auth-express-middleware");

function getToken(token: string, tokenSecret: string, __profile: any): void {
    console.log(token)
    console.log(tokenSecret)
    console.log(__profile)
}

passport.use(new TwitterStrategy({
        consumerKey: process.env.TWITTER_API ?? "",
        consumerSecret: process.env.TWITTER_API_SECRET ?? "",
        callbackURL: "https://localhost:3000" + "/auth/twitter/callback",
    }, (accessToken, refreshToken, profile) => getToken(accessToken, refreshToken, profile)
));

module.exports = (app: any) => {

    app.use(passport.initialize());
    app.use(passport.session());
    // app.use(authMiddleWare.authn());

    console.log(app.options.databaseURL)
    app.get('/auth/twitter', passport.authenticate('twitter'))

    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {failureRedirect: '/'}),
        function (__req: express.Request, res: any) {
            console.log(__req, res)
            res.redirect('/');
        });
}
