import {useState,useEffect} from 'react';
import {money,sellingPrice} from '../lib/helpers';
import {useShop} from '../context/ShopContext';
import Icon from './Icon';
import type {Product} from '../types/shop';
import {useLanguage} from '../context/LanguageContext';

const symbols={spark:'✳',pot:'✺',wheel:'❋',sky:'✧',gift:'✦'};
export default function ProductCard({product:p,label='',variant='default',preview=false}:{product:Product;label?:string;variant?:'default'|'giftbox';preview?:boolean}){
 const {addToCart,cart,openCart}=useShop(),{t,category}=useLanguage(),[failed,setFailed]=useState(false);
 useEffect(()=>setFailed(false),[p.image]);
 const art=Object.hasOwn(symbols,p.art)?p.art:'gift',quantity=cart.find(item=>item.id===p.id)?.qty||0;
 return <article className={'product-card'+(variant==='giftbox'?' giftbox-product-card'+(p.featured?' is-featured':''):'')}>
  <div className={`product-art art-${art}`}>
   {p.discount>0&&<span className="product-discount">{p.discount}% {t('OFF')}</span>}
   {p.image&&!failed?<img src={p.image} alt={p.name} loading="lazy" decoding="async" width="240" height="200" onError={()=>setFailed(true)}/>:<div className="illustration" aria-hidden="true"><div className="pack"><span>{symbols[art]}</span><b>KST</b><small>{category(p.category)}</small></div><span className="art-spark">{symbols[art]}</span></div>}
   {variant==='giftbox'&&<div className="giftbox-image-meta"><span className="giftbox-image-category">{category(p.category)}</span>{label&&<span className="giftbox-image-label">{t(label)}</span>}</div>}
   {quantity>0&&<span className="product-cart-status"><Icon name="check"/>{t('{count} in cart',{count:quantity})}</span>}
  </div>
  <div className="product-info">
   {variant!=='giftbox'&&<div className="product-meta"><span className="product-category">{category(p.category)}</span>{label&&<span className="product-label">{t(label)}</span>}</div>}
   <h3>{p.name}</h3><div className="unit">{p.unit}</div>{variant==='giftbox'&&p.description&&<p className="giftbox-description">{p.description}</p>}
   <div className="product-pricing"><span className="price">{money(sellingPrice(p))}</span>{p.discount>0&&<span className="mrp"><del>{money(p.price)}</del></span>}</div>
   {p.discount>0&&<div className="product-save">{t('Save {amount}',{amount:money(p.price-sellingPrice(p))})}</div>}
   <div className={'stock-note '+(!p.stock?'stock-unavailable':'')}>{p.stock?t('Available for order'):t('Currently unavailable')}</div>
   <div className={variant==='giftbox'?'giftbox-actions':''}><button className="add-button" disabled={!p.stock||preview} onClick={()=>addToCart(p.id)}>{p.stock?<><Icon name="cart"/>{t(quantity?'Add another':'Add to cart')}</>:t('Sold out')}</button>{variant==='giftbox'&&<button className="giftbox-enquire" disabled={!p.stock||preview} onClick={()=>{addToCart(p.id);openCart();}}>{t('Enquire box')}</button>}</div>
  </div>
 </article>;
}
