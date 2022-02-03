import '../styles/globals.css'
import React from 'react'

import "./styles.css";

function MyApp({ Component, pageProps }) {
  return (
  <React.Fragment>
    <Component {...pageProps} />
  </React.Fragment>
  )
}

export default MyApp
