import React from 'react';
import {useShop} from '../context/ShopContext';
import {useLanguage} from '../context/LanguageContext';
export default function Footer(){const {catalog}=useShop(),{t}=useLanguage();return <footer className="store-footer"><a className="back-top" href="#">{t('Back to top ↑')}</a><div><a className="store-brand" href="/">kst<span>crackers</span></a><p>{catalog?.settings.name||'KST Crackers'}</p><p>{t('Every celebration starts with a little sparkle.')}</p><small>{t('Sample catalogue. Product artwork is illustrative. All requests require shop confirmation.')}</small></div></footer>;}
