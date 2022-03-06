import ApolloClient from "apollo-boost";
import 'cross-fetch/polyfill';

const client = new ApolloClient({
    uri: "http://server:8080/graphql",
    headers: {
        "x-token": process.env.ADMIN_JWT
    }
});

export {client};
