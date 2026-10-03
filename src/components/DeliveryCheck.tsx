import React from 'react';
import {useShop} from '../context/ShopContext';
import {useLanguage} from '../context/LanguageContext';
export default function DeliveryCheck(){const {locationMessage,location,locate,locating}=useShop(),{t}=useLanguage();return <section className="delivery-strip" aria-label={t('Delivery availability')}><span className="pin-icon">⌖</span><div><strong>{t('Check delivery to your location')}</strong><p aria-live="polite" className={location?.eligible?'success':''}>{locationMessage}</p></div><button className="button outline" onClick={locate} disabled={locating}>{locating?t('Checking…'):location?t('Update location'):t('Enable location')}</button></section>;}
