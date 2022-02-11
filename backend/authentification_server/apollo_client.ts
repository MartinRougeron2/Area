import ApolloClient from "apollo-boost";
import 'cross-fetch/polyfill';

const client = new ApolloClient({
    uri: "http://localhost:5000/graphql"
});

export {client};
