import React from 'react';
import {useShop} from '../context/ShopContext';
export default function DeliveryCheck(){const {locationMessage,location,locate,locating}=useShop();return <section className="delivery-strip" aria-label="Delivery availability"><span className="pin-icon">⌖</span><div><strong>Check delivery to your location</strong><p aria-live="polite" className={location?.eligible?'success':''}>{locationMessage}</p></div><button className="button outline" onClick={locate} disabled={locating}>{locating?'Checking…':location?'Update location':'Enable location'}</button></section>;}
