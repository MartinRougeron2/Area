import {Application} from "express";
import {ApolloServer} from 'apollo-server-express';
import {ApolloServerPluginLandingPageGraphQLPlayground} from 'apollo-server-core';
import 'reflect-metadata';
import {buildSchema} from 'type-graphql';
import {BaseActionResolver, UniqueActionResolver, BayActionResolver, ServiceResolver, UserResolver, LinksResolver} from "./resolvers";


module.exports = async function (app: Application) {

    const schema = await buildSchema({
        resolvers: [
            BaseActionResolver,
            UniqueActionResolver,
            BayActionResolver,
            ServiceResolver,
            UserResolver,
            LinksResolver
        ],
        emitSchemaFile: true,
        validate: false,
    });

    // create mongoose connection

    const server = new ApolloServer({
        schema,
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
    });


    await server.start();

    server.applyMiddleware({app});
}
