import {create_unique_action} from "./common";
import express from "express";

const git_scop = "repo,user,notifications,admin:repo_hook"
const git_redirect = "https://localhost:5001/auth/github/redirect"

const request = require('request')

module.exports = (app: any) => {

    console.log("installing trello app...")

    app.get('/auth/github', async (req: express.Request, res: any, __next: any) => {
        try {
            const url = `https://github.com/login/oauth/authorize?scope=${git_scop}&client_id=${process.env.GITHUB_ID}&state=${req.query.id}&redirect_uri=${git_redirect}`
            res.redirect(url)
        } catch (error) {
            console.log(error)
        }
    });

    app.get('/auth/github/redirect', async (req: express.Request, res: any) => {
        await request.post({
            url: `https://github.com/login/oauth/access_token/?client_id=${process.env.GITHUB_ID}&client_secret=${process.env.GITHUB_SECRET}&code=${req.query.code}`,
            headers: {
                'User-Agent': 'request',
                'Accept': 'application/json'
            }
        }, async function(__error: any, __response: any, body: any) {
            const acces = JSON.parse(body)
            const action_id = (req.query.state ?? "") as unknown as string
            const parameters = {
                access_token: acces.access_token,
            }
            create_unique_action(action_id, JSON.stringify(parameters), "");
        })
        res.redirect("/auth/finish");
    });
}