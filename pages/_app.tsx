import type {AppProps} from 'next/app';
import '../src/styles/storefront.css';
import '../src/styles/react.css';
import '../src/styles/festival.css';
import '../src/styles/celebration.css';
import '../src/styles/polish.css';
import '../src/styles/bundles.css';
import '../src/styles/bulk-welcome.css';

export default function KstApp({Component,pageProps}:AppProps){
  return <Component {...pageProps}/>;
}
