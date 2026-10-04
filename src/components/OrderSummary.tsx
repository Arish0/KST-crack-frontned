import React from 'react';
import {money} from '../lib/helpers';
import {useLanguage} from '../context/LanguageContext';
export default function OrderSummary({subtotal,savings,deliveryFee,quoteRequired=false}){const {t}=useLanguage();return <div className="totals">{!quoteRequired&&<><div><span>{t('You save')}</span><strong>{money(savings)}</strong></div><div><span>{t('Products')}</span><strong>{money(subtotal)}</strong></div><div><span>{t('Delivery')}</span><strong>{money(deliveryFee)}</strong></div><div className="total"><span>{t('Quote total')}</span><strong>{money(subtotal+deliveryFee)}</strong></div></>}<p className="notice wide">{quoteRequired?t('The shop will confirm the price before you buy.') : t('Get your quote, then confirm your order.')}</p></div>;}
