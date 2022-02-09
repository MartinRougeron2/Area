import '../styles/globals.css'
import React from 'react'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";

import "./styles.css";

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQLAPI,
  cache: new InMemoryCache()
});

function MyApp({ Component, pageProps }) {
  return (
  <React.Fragment>
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  </React.Fragment>
  )
}

export default MyApp
