import React from 'react';
import {useShop} from '../context/ShopContext';
import {money} from '../lib/helpers';
import {useLanguage} from '../context/LanguageContext';
export default function MobileCart(){const {totals,openCart}=useShop(),{t}=useLanguage();return totals.count>0&&<button className="mobile-cart" onClick={openCart}><span>{t('View cart')} · <b>{totals.count}</b> {t('items')}</span><strong>{money(totals.subtotal)}</strong></button>;}
