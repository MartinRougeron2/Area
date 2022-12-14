import {Application} from "express";
import {ApolloServer} from 'apollo-server-express';
import {ApolloServerPluginLandingPageGraphQLPlayground, AuthenticationError} from 'apollo-server-core';
import 'reflect-metadata';
import {buildSchema} from 'type-graphql';
import {connect} from "mongoose";

import {
    BaseActionResolver,
    UniqueActionResolver,
    BayActionResolver,
    ServiceResolver,
    UserResolver,
    LinksResolver,
} from "./resolvers";
import {SlackOutResolver} from "./services/slack_out";
import {GmailOutResolver} from "./services/gmail_out";
import {GCalendarOutResolver} from "./services/gcalendar_out";
import { UserModel } from "./types";
import {DiscordOutResolver} from "./services/discord_out"
import {GithubOutResolver} from "./services/github_out"
import {GDriveOutResolver} from "./services/gdrive_out"

const jwt = require('jsonwebtoken');


module.exports = async function (app: Application) {

    const schema = await buildSchema({
        resolvers: [
            BaseActionResolver,
            UniqueActionResolver,
            BayActionResolver,
            ServiceResolver,
            UserResolver,
            LinksResolver,

            SlackOutResolver,
            GmailOutResolver,
            GCalendarOutResolver,
            DiscordOutResolver,
            GithubOutResolver,
            GDriveOutResolver

        ],
        emitSchemaFile: true,
        validate: true,
    });

    //TODO create mongoose connection
    const mongoose = await connect(
        `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@areacluster.ebfjt.mongodb.net/areaDatabase?retryWrites=true&w=majority`
    );
    await mongoose.connection;

    const server = new ApolloServer({
        schema,
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
        context: async ({req}) => {
            // console.log(req)
            if (req.body.query.includes("mutation {\n  CreateUser(")) return

            const token = req.headers["x-token"] || '';

            if (req.body.query.includes("CreateUser")) return
            if (req.body.query.includes("LoginUser")) return
            const decoded_token = jwt.verify(token, process.env.TOKEN_JWT)
            if (!decoded_token) return

            const user = await UserModel.findById(decoded_token.id).then((res) => res)

            if(!user) throw new AuthenticationError('You must be logged in');
            if(user.id !== decoded_token.id) throw new AuthenticationError('You must be logged in');

            return user;
        },
    });


    await server.start();

    server.applyMiddleware({app});
}
