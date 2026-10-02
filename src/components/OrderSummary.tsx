import React from 'react';
import {money} from '../lib/helpers';
export default function OrderSummary({subtotal,savings,deliveryFee}){return <div className="totals"><div><span>You save</span><strong>{money(savings)}</strong></div><div><span>Products</span><strong>{money(subtotal)}</strong></div><div><span>Delivery</span><strong>{money(deliveryFee)}</strong></div><div className="total"><span>Quote total</span><strong>{money(subtotal+deliveryFee)}</strong></div></div>;}
