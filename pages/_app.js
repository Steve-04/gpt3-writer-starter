import './styles.css';
import { Analytics } from '@vercel/analytics/react';
import Head from "next/head";

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.jpg" />
      </Head>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
export default App;