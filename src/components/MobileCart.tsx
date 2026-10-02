import React from 'react';
import {useShop} from '../context/ShopContext';
import {money} from '../lib/helpers';
export default function MobileCart(){const {totals,openCart}=useShop();return totals.count>0&&<button className="mobile-cart" onClick={openCart}><span>View cart · <b>{totals.count}</b> items</span><strong>{money(totals.subtotal)}</strong></button>;}
