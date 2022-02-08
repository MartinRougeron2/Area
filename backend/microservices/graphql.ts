import {Application} from "express";
import {ApolloServer} from 'apollo-server-express';
import {ApolloServerPluginLandingPageGraphQLPlayground} from 'apollo-server-core';
import 'reflect-metadata';
import {buildSchema} from 'type-graphql';
import {connect} from "mongoose";

import {
    BaseActionResolver,
    UniqueActionResolver,
    BayActionResolver,
    ServiceResolver,
    UserResolver,
    LinksResolver
} from "./resolvers";
import {SlackOutResolver} from "./services/slack_out";


module.exports = async function (app: Application) {

    const schema = await buildSchema({
        resolvers: [
            BaseActionResolver,
            UniqueActionResolver,
            BayActionResolver,
            ServiceResolver,
            UserResolver,
            LinksResolver,
            SlackOutResolver
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
    });


    await server.start();

    server.applyMiddleware({app});
}
