import '../styles/globals.css'
import React, {useEffect} from 'react'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink
} from "@apollo/client";

import { setContext } from '@apollo/client/link/context';

import "./styles.css";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const httpLink = createHttpLink({
  uri: 'http://localhost:5000/graphql',
  credentials: 'include'
});

const authLink = setContext((_, { headers }) => {
  console.log(_)
  const token = cookies.getItem('x-token');
  return {
    headers: {
      ...headers,
      'x-token': token ?? '',
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
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
