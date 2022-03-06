import '../styles/globals.css'
import React, {useEffect} from 'react'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  useQuery,
  gql
} from "@apollo/client";

import { setContext } from '@apollo/client/link/context';

import "./styles.css";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const GET_USER = gql`
  query FetchUser {
    GetUser {
      name
      id
      email
    }
  }
`

const REFRESH_TOKEN = gql`
  query RefreshToken {
    RefreshToken
  }
`

const httpLink = createHttpLink({
  uri: 'http://localhost:8080/graphql',
});

const authLink = setContext((_, {headers}) => {
  const token = cookies.get('x-token');
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
  useEffect(() => {
    if (!cookies.get('x-token')) return;
    client.query({query: GET_USER})
      .then(async res => {const token = await client.query({query: REFRESH_TOKEN}).catch(error=>console.log(error)); cookies.set('x-token', token.data.RefreshToken)})
      .catch(error => {cookies.remove('x-token'); location.reload()})
  }, [])

  return (
  <React.Fragment>
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  </React.Fragment>
  )
}

export default MyApp
