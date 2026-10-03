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
import BulkWelcome from './components/BulkWelcome';
import {useLanguage} from './context/LanguageContext';
export default function App(){
 const {t,language}=useLanguage();
 const {catalog,loading,error,loadCatalog,toast,online}=useShop(),[search,setSearch]=useState(''),[category,setCategory]=useState('All'),[sort,setSort]=useState('featured'),[theme,setTheme]=useState<FestivalTheme>('orange');
 const offers=useMemo(()=>[...(catalog?.products||[])].filter(p=>p.discount>0).sort((a,b)=>b.discount-a.discount).slice(0,4),[catalog]),sold=useMemo(()=>(catalog?.products||[]).filter(p=>p.sold>0).sort((a,b)=>b.sold-a.sold),[catalog]),favourites=(sold.length?sold:catalog?.products.filter(p=>p.featured)||[]).slice(0,4);
 const scroll=()=>document.getElementById('catalog')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 const browse=(value:string)=>{setSort(value);scroll();};
 const browseGiftBoxes=()=>{setSearch('');setCategory('Gift Boxes');setSort('featured');requestAnimationFrame(scroll);};
 return <div className="festival-app" lang={language} data-theme={theme}><BulkWelcome onBrowse={browseGiftBoxes}/><Header search={search} setSearch={setSearch} category={category} setCategory={setCategory} onSearch={scroll} onOffers={()=>browse('offers')}/>{!online&&<div className="connection-status" role="status">{t('You’re offline. Your cart is safe. Reconnect to load products or save an order.')}</div>}<main aria-busy={loading}><Hero onThemeChange={setTheme}/>{(loading||error)&&<div className={'load-status '+(error?'error':'')} role="status">{loading?t('Finding your festival favourites…'):<><span>{t(error)}</span><button className="button outline" onClick={loadCatalog}>{t('Retry loading')}</button></>}</div>}<ServiceHighlights/><ProductSection id="offers" title={t('Festival deals')} kicker={t('SAVE ON YOUR CELEBRATION')} products={offers} label={t('Festival offer')} link={t('See all offers')} onLink={()=>browse('offers')}/><BundleSection/><ProductSection id="favourites" title={t(sold.length?'Your most-loved crackers':'Featured crackers')} kicker={t('EXPLORE THE COLLECTION')} products={favourites} label={t(sold.length?'Best seller':'Shop favourite')} link={t('Browse favourites')} onLink={()=>browse('bestsellers')}/><Catalog search={search} setSearch={setSearch} category={category} setCategory={setCategory} sort={sort} setSort={setSort}/><HowItWorks/></main><Footer/><Cart/><MobileCart/><BottomNavigation/><div id="toast" className={toast?'visible':''} role="status" aria-live="polite">{t(toast)}</div></div>;
}
