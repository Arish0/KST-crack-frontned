import Head from 'next/head';
import App from '../src/App';
import ErrorBoundary from '../src/components/ErrorBoundary';
import {ShopProvider} from '../src/context/ShopContext';

export default function StorefrontPage(){
  return <>
    <Head>
      <title>KST Crackers | Festival offers & bundles</title>
      <meta name="description" content="Shop festival crackers, discounts and family bundles. Request local delivery within 15 km."/>
      <meta name="theme-color" content="#131921"/>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
    </Head>
    <ErrorBoundary><ShopProvider><App/></ShopProvider></ErrorBoundary>
  </>;
}
