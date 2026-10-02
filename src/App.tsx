import {useState,useMemo} from 'react';
import {useShop} from './context/ShopContext';
import Header from './components/Header';
import ServiceHighlights from './components/ServiceHighlights';
import Hero,{type FestivalTheme} from './components/Hero';
import ProductSection from './components/ProductSection';
import BundleSection from './components/BundleSection';
import Catalog from './components/Catalog';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import Cart from './components/Cart';
import MobileCart from './components/MobileCart';
import BottomNavigation from './components/BottomNavigation';
export default function App(){
 const {catalog,loading,error,loadCatalog,toast,online}=useShop(),[search,setSearch]=useState(''),[category,setCategory]=useState('All'),[sort,setSort]=useState('featured'),[theme,setTheme]=useState<FestivalTheme>('orange');
 const offers=useMemo(()=>[...(catalog?.products||[])].filter(p=>p.discount>0).sort((a,b)=>b.discount-a.discount).slice(0,4),[catalog]),sold=useMemo(()=>(catalog?.products||[]).filter(p=>p.sold>0).sort((a,b)=>b.sold-a.sold),[catalog]),favourites=(sold.length?sold:catalog?.products.filter(p=>p.featured)||[]).slice(0,4);
 const scroll=()=>document.getElementById('catalog')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 const browse=(value:string)=>{setSort(value);scroll();};
 return <div className="festival-app" data-theme={theme}><Header search={search} setSearch={setSearch} category={category} setCategory={setCategory} onSearch={scroll} onOffers={()=>browse('offers')}/>{!online&&<div className="connection-status" role="status">You're offline. Your cart is safe. Reconnect to load products or save an order.</div>}<main aria-busy={loading}><Hero onThemeChange={setTheme}/>{(loading||error)&&<div className={'load-status '+(error?'error':'')} role="status">{loading?'Finding your festival favourites…':<><span>{error}</span><button className="button outline" onClick={loadCatalog}>Retry loading</button></>}</div>}<ServiceHighlights/><ProductSection id="offers" title="Festival deals" kicker="SAVE ON YOUR CELEBRATION" products={offers} label="Festival offer" link="See all offers" onLink={()=>browse('offers')}/><BundleSection/><ProductSection id="favourites" title={sold.length?'Your most-loved crackers':'Featured crackers'} kicker="EXPLORE THE COLLECTION" products={favourites} label={sold.length?'Best seller':'Shop favourite'} link="Browse favourites" onLink={()=>browse('bestsellers')}/><Catalog search={search} setSearch={setSearch} category={category} setCategory={setCategory} sort={sort} setSort={setSort}/><HowItWorks/></main><Footer/><Cart/><MobileCart/><BottomNavigation/><div id="toast" className={toast?'visible':''} role="status" aria-live="polite">{toast}</div></div>;
}
