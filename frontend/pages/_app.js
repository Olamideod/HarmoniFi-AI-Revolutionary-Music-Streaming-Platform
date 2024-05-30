import '@/styles/globals.css'
import { SessionProvider } from "next-auth/react"
import Player from './Player'; // Adjust the path as necessary

function App() {
  return (
    <div>
      <Player />
    </div>
  );
}
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
