import {useState,useEffect} from 'react';
import {money,sellingPrice} from '../lib/helpers';
import {useShop} from '../context/ShopContext';
import Icon from './Icon';
import type {Product} from '../types/shop';
import {useLanguage} from '../context/LanguageContext';

const symbols={spark:'✳',pot:'✺',wheel:'❋',sky:'✧',gift:'✦'};
export default function ProductCard({product:p,label='',variant='default',preview=false}:{product:Product;label?:string;variant?:'default'|'giftbox';preview?:boolean}){
 const {addToCart,cart,openCart}=useShop(),{t,category}=useLanguage(),[failed,setFailed]=useState(false),[detailsOpen,setDetailsOpen]=useState(false);
 useEffect(()=>setFailed(false),[p.image]);
 const art=Object.hasOwn(symbols,p.art)?p.art:'gift',quantity=cart.find(item=>item.id===p.id)?.qty||0;
 return <article className={'product-card'+(variant==='giftbox'?' giftbox-product-card'+(p.featured?' is-featured':''):'')}>
  <div className={`product-art art-${art}`}>
   {variant==='giftbox'&&p.price>0&&p.discount>0&&<span className="product-discount">{p.discount}% {t('OFF')}</span>}
   {p.image&&!failed?<img src={p.image} alt={p.name} loading="lazy" decoding="async" width="240" height="200" onError={()=>setFailed(true)}/>:<div className="illustration" aria-hidden="true"><div className="pack"><span>{symbols[art]}</span><b>KST</b><small>{category(p.category)}</small></div><span className="art-spark">{symbols[art]}</span></div>}
   {variant==='giftbox'&&<div className="giftbox-image-meta"><span className="giftbox-image-category">{category(p.category)}</span>{label&&<span className="giftbox-image-label">{t(label)}</span>}</div>}
   {quantity>0&&<span className="product-cart-status"><Icon name="check"/>{t('{count} in cart',{count:quantity})}</span>}
  </div>
  <div className="product-info">
   {variant!=='giftbox'&&<div className="product-meta"><span className="product-category">{category(p.category)}</span>{label&&<span className="product-label">{t(label)}</span>}</div>}
   <button className="product-title-button" type="button" onClick={()=>setDetailsOpen(true)}><h3>{p.name}</h3></button><div className="unit">{p.packQuantity>0?t('Pack of {count}',{count:p.packQuantity}):p.unit}</div>{variant==='giftbox'&&p.description&&<p className="giftbox-description">{p.description}</p>}
   {p.price>0&&<div className="product-pricing"><span className="price">{money(sellingPrice(p))}</span>{variant==='giftbox'&&p.discount>0&&<span className="mrp"><del>{money(p.price)}</del></span>}</div>}
   <div className={'stock-note '+(!p.stock?'stock-unavailable':'')}>{p.stock?t('Available for order'):t('Currently unavailable')}</div>
   <div className={variant==='giftbox'?'giftbox-actions':''}><button className="add-button" disabled={!p.stock||preview} onClick={()=>addToCart(p.id)}>{p.stock?<><Icon name="cart"/>{t(quantity?'Add another':'Add to cart')}</>:t('Sold out')}</button>{(variant==='giftbox'||p.price<=0)&&<button className={variant==='giftbox'?'giftbox-enquire':'giftbox-enquire'} disabled={!p.stock||preview} onClick={()=>{if(!quantity)addToCart(p.id);openCart();}}>{t(p.price>0&&variant==='giftbox'?'Enquire box':'Get quote from shop')}</button>}</div>
  </div>
  <button type="button" className="product-details-link" onClick={()=>setDetailsOpen(true)}>{t('View details')}</button>
  {detailsOpen&&<div className="product-details-backdrop" role="presentation" onClick={()=>setDetailsOpen(false)}><section className="product-details-dialog" role="dialog" aria-modal="true" aria-labelledby={`product-details-${p.id}`} onClick={event=>event.stopPropagation()} onKeyDown={event=>{if(event.key==='Escape')setDetailsOpen(false);}}><button className="product-details-close" type="button" aria-label={t('Close details')} onClick={()=>setDetailsOpen(false)}>×</button><div className="product-details-images">{p.image&&!failed?<img src={p.image} alt={p.name}/>:<div className="product-details-image-placeholder">{category(p.category)}</div>}{p.image2&&<img src={p.image2} alt={t('Secondary product view')}/>}</div>{p.video&&<video className="product-details-video" controls playsInline preload="metadata" poster={p.image}><source src={p.video}/>{t('Your browser does not support video playback.')}</video>}<div className="product-details-copy"><span className="product-category">{category(p.category)}</span><h2 id={`product-details-${p.id}`}>{p.name}</h2><p className="product-details-pack">{p.packQuantity>0?t('Pack of {count}',{count:p.packQuantity}):p.unit}</p>{p.description&&<p>{p.description}</p>}{p.price>0&&<div className="product-pricing"><span className="price">{money(sellingPrice(p))}</span>{variant==='giftbox'&&p.discount>0&&<span className="mrp"><del>{money(p.price)}</del></span>}{variant==='giftbox'&&p.discount>0&&<span className="product-discount-details">{p.discount}% {t('OFF')}</span>}</div>}<p className="stock-note">{p.stock?t('Available for order'):t('Currently unavailable')}</p><button className="add-button" disabled={!p.stock||preview} onClick={()=>{addToCart(p.id);setDetailsOpen(false);}}>{p.stock?t('Add to cart'):t('Sold out')}</button></div></section></div>}
 </article>;
}
