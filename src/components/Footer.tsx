import React from 'react';
import {useShop} from '../context/ShopContext';
import {useLanguage} from '../context/LanguageContext';

export default function Footer({onDiwaliGifts,showDiwaliGifts=false}:{onDiwaliGifts:()=>void;showDiwaliGifts?:boolean}) {
 const {catalog}=useShop(),{t}=useLanguage();
 return <footer className="store-footer">
  <a className="back-top" href="#">{t('Back to top')}</a>
  <div>
   <a className="store-brand" href="/">kst<span>crackers</span></a>
   <p>{catalog?.settings.name||'KST Crackers'}</p>
   <p>{t('Every celebration starts with a little sparkle.')}</p>
   {showDiwaliGifts&&<button className="footer-diwali-link" type="button" onClick={onDiwaliGifts}>{t('View Diwali Special Prizes')} &middot; {t('5 gifts - random selection')}</button>}
   <small>{t('Sample catalogue. Product artwork is illustrative. All requests require shop confirmation.')}</small>
  </div>
  <div className="store-copyright">&copy; 2026 KST Crackers (kstcrackers.shop). All rights reserved.</div>
 </footer>;
}