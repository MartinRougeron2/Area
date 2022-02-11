import '../styles/globals.css'
import React from 'react'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider
} from "@apollo/client";

import "./styles.css";

const client = new ApolloClient({
  uri: "http://localhost:5000/graphql",
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
