import {useState,useEffect} from 'react';
import {money,sellingPrice} from '../lib/helpers';
import {useShop} from '../context/ShopContext';
import Icon from './Icon';
import type {Product} from '../types/shop';

const symbols={spark:'✳',pot:'✺',wheel:'❋',sky:'✧',gift:'✦'};
export default function ProductCard({product:p,label=''}:{product:Product;label?:string}){
 const {addToCart,cart}=useShop(),[failed,setFailed]=useState(false);
 useEffect(()=>setFailed(false),[p.image]);
 const art=Object.hasOwn(symbols,p.art)?p.art:'gift',quantity=cart.find(item=>item.id===p.id)?.qty||0;
 return <article className="product-card">
  <div className={`product-art art-${art}`}>
   {p.discount>0&&<span className="product-discount">{p.discount}% OFF</span>}
   {p.image&&!failed?<img src={p.image} alt={p.name} loading="lazy" decoding="async" width="240" height="200" onError={()=>setFailed(true)}/>:<div className="illustration" aria-hidden="true"><div className="pack"><span>{symbols[art]}</span><b>KST</b><small>{p.category}</small></div><span className="art-spark">{symbols[art]}</span></div>}
   {quantity>0&&<span className="product-cart-status"><Icon name="check"/>{quantity} in cart</span>}
  </div>
  <div className="product-info">
   <div className="product-meta"><span className="product-category">{p.category}</span>{label&&<span className="product-label">{label}</span>}</div>
   <h3>{p.name}</h3><div className="unit">{p.unit}</div>
   <div className="product-pricing"><span className="price">{money(sellingPrice(p))}</span>{p.discount>0&&<span className="mrp"><del>{money(p.price)}</del></span>}</div>
   {p.discount>0&&<div className="product-save">Save {money(p.price-sellingPrice(p))}</div>}
   <div className={'stock-note '+(!p.stock?'stock-unavailable':'')}>{p.stock?'Available for order':'Currently unavailable'}</div>
   <button className="add-button" disabled={!p.stock} onClick={()=>addToCart(p.id)}>{p.stock?<><Icon name="cart"/>{quantity?'Add another':'Add to cart'}</>:'Sold out'}</button>
  </div>
 </article>;
}
