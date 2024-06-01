import '@/styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import Player from '../components/Player'; // Adjust the path as necessary

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <div>
        <Player />
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}

export default MyApp;
