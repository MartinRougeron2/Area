import '../styles/globals.css'
import React from 'react'

function MyApp({ Component, pageProps }) {
  return (
  <React.Fragment>
    <Component {...pageProps} />
  </React.Fragment>
  )
}

export default MyApp
