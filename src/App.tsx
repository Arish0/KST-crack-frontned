import {useState,useMemo,useEffect,useRef} from 'react';
import {useShop} from './context/ShopContext';
import Header from './components/Header';
import ServiceHighlights from './components/ServiceHighlights';
import Hero,{type FestivalTheme} from './components/Hero';
import ProductSection from './components/ProductSection';
import GiftBoxSection from './components/GiftBoxSection';
import BundleSection from './components/BundleSection';
import Catalog from './components/Catalog';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import Cart from './components/Cart';
import MobileCart from './components/MobileCart';
import BottomNavigation from './components/BottomNavigation';
import BulkWelcome from './components/BulkWelcome';
import DiwaliGiftsWelcome from './components/DiwaliGiftsWelcome';
import FloatingDiwaliGifts from './components/FloatingDiwaliGifts';
import {useLanguage} from './context/LanguageContext';
type WelcomeStage='diwali-gifts'|'bulk'|null;
const localDiwaliPreview={id:'local-diwali-preview',enabled:true,title:'Diwali Special Prizes',titleTa:'தீபாவளி சிறப்புப் பரிசுகள்',drawAt:'',terms:'Local visual preview only. In the live promotion, eligible customers with a confirmed cracker purchase may submit one entry per order. Five eligible customers are selected at random during the announced draw window. Entry does not guarantee a prize.',termsTa:'உள்ளூர் காட்சி முன்னோட்டம் மட்டும். நேரலை வழங்கலில், கடை உறுதிசெய்த பட்டாசு வாங்கிய தகுதியான வாடிக்கையாளர்கள் ஒவ்வொரு ஆர்டருக்கும் ஒரு பதிவு செய்யலாம். அறிவிக்கப்பட்ட நேரத்தில் ஐந்து பேர் சீரற்ற முறையில் தேர்வு செய்யப்படுவார்கள். பதிவு செய்தால் பரிசு உறுதி இல்லை.',gifts:[{name:'VIP Gift Box',nameTa:'VIP பரிசுப் பெட்டி',description:'Diwali Special Prize 1',descriptionTa:'தீபாவளி சிறப்புப் பரிசு 1'},{name:'Family Pack Gift Box',nameTa:'குடும்பப் பரிசுத் தொகுப்பு',description:'Diwali Special Prize 2',descriptionTa:'தீபாவளி சிறப்புப் பரிசு 2'},{name:'240 Shot Cracker',nameTa:'240 ஷாட் பட்டாசு',description:'Diwali Special Prize 3',descriptionTa:'தீபாவளி சிறப்புப் பரிசு 3'},{name:'Disney Packed Gift Box',nameTa:'டிஸ்னி பரிசுப் பெட்டி',description:'Diwali Special Prize 4',descriptionTa:'தீபாவளி சிறப்புப் பரிசு 4'},{name:'1000 Wala Crackers',nameTa:'1000 வாலா பட்டாசுகள்',description:'Diwali Special Prize 5',descriptionTa:'தீபாவளி சிறப்புப் பரிசு 5'}],drawn:false} as const;
export default function App(){
 const {t,language}=useLanguage();
 const {catalog,loading,error,loadCatalog,toast,online}=useShop();
 const [search,setSearch]=useState(''),[category,setCategory]=useState('All'),[sort,setSort]=useState('featured'),[theme,setTheme]=useState<FestivalTheme>('orange'),[welcomeStage,setWelcomeStage]=useState<WelcomeStage>(null),[previewDiwali,setPreviewDiwali]=useState(false),[previewGiftBoxes,setPreviewGiftBoxes]=useState(false);
 const welcomeChecked=useRef(false),diwaliFirst=useRef(false);
 const promotion=catalog?.diwaliGifts||(previewDiwali?localDiwaliPreview:null);
 useEffect(()=>{if(process.env.NODE_ENV==='development'){const preview=new URLSearchParams(window.location.search).get('preview');if(preview==='diwali'||preview==='giftboxes')setPreviewDiwali(true);if(preview==='giftboxes')setPreviewGiftBoxes(true);}},[]);
 useEffect(()=>{
  if(loading||welcomeChecked.current)return;
  welcomeChecked.current=true;
  let offerSeen=false,bulkSeen=false;
  try{offerSeen=Boolean(catalog?.diwaliGifts?.id&&sessionStorage.getItem(`kst-diwali-gifts-seen-${catalog.diwaliGifts.id}`));bulkSeen=Boolean(sessionStorage.getItem('kst-bulk-welcome-seen'));}catch{}
  const showOffer=Boolean(promotion?.enabled&&!offerSeen);
  diwaliFirst.current=showOffer;
  if(showOffer)setWelcomeStage('diwali-gifts');else if(!bulkSeen)setWelcomeStage('bulk');
 },[loading,catalog,promotion]);
 const offers=useMemo(()=>[...(catalog?.products||[])].filter(p=>p.discount>0).sort((a,b)=>b.discount-a.discount).slice(0,4),[catalog]);
 const sold=useMemo(()=>(catalog?.products||[]).filter(p=>p.sold>0).sort((a,b)=>b.sold-a.sold),[catalog]);
 const favourites=(sold.length?sold:catalog?.products.filter(p=>p.featured)||[]).slice(0,4);
 const scroll=()=>document.getElementById('catalog')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 const browse=(value:string)=>{setSort(value);scroll();};
 const browseGiftBoxes=()=>{setSearch('');setCategory('Gift Boxes');setSort('featured');requestAnimationFrame(scroll);};
 function openDiwaliGifts(){diwaliFirst.current=false;if(promotion)setWelcomeStage('diwali-gifts');}
 return <div className="festival-app" lang={language} data-theme={theme}>
  {welcomeStage==='diwali-gifts'&&promotion&&<DiwaliGiftsWelcome offer={promotion} preview={previewDiwali&&!catalog?.diwaliGifts?.enabled} onClose={()=>setWelcomeStage(diwaliFirst.current?'bulk':null)}/>}
  {welcomeStage==='bulk'&&<BulkWelcome onBrowse={browseGiftBoxes} onClose={()=>setWelcomeStage(null)}/>}
  <Header search={search} setSearch={setSearch} category={category} setCategory={setCategory} onSearch={scroll} onOffers={()=>browse('offers')} onDiwaliGifts={openDiwaliGifts} diwaliGiftsEnabled={Boolean(promotion)}/>
  {promotion&&<FloatingDiwaliGifts onClick={openDiwaliGifts}/>}
  {!online&&<div className="connection-status" role="status">{t('You’re offline. Your cart is safe. Reconnect to load products or save an order.')}</div>}
  <main aria-busy={loading}>
   <Hero onThemeChange={setTheme}/>
   {(loading||error)&&<div className={'load-status '+(error?'error':'')} role="status">{loading?t('Finding your festival favourites…'):<><span>{t(error)}</span><button className="button outline" onClick={loadCatalog}>{t('Retry loading')}</button></>}</div>}
   <ServiceHighlights/>
   <GiftBoxSection onViewAll={browseGiftBoxes} preview={previewGiftBoxes}/>
   <ProductSection id="offers" title={t('Festival deals')} kicker={t('SAVE ON YOUR CELEBRATION')} products={offers} label={t('Festival offer')} link={t('See all offers')} onLink={()=>browse('offers')}/>
   <BundleSection/>
   <ProductSection id="favourites" title={t(sold.length?'Your most-loved crackers':'Featured crackers')} kicker={t('EXPLORE THE COLLECTION')} products={favourites} label={t(sold.length?'Best seller':'Shop favourite')} link={t('Browse favourites')} onLink={()=>browse('bestsellers')}/>
   <Catalog search={search} setSearch={setSearch} category={category} setCategory={setCategory} sort={sort} setSort={setSort}/>
   <HowItWorks/>
  </main>
  <Footer onDiwaliGifts={openDiwaliGifts} showDiwaliGifts={Boolean(promotion)}/><Cart/><MobileCart/><BottomNavigation/><div id="toast" className={toast?'visible':''} role="status" aria-live="polite">{t(toast)}</div>
 </div>;
}
