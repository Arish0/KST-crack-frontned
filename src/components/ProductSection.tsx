import React from 'react';
import {useShop} from '../context/ShopContext';
import ProductCard from './ProductCard';
import LoadingGrid from './LoadingGrid';
import {useLanguage} from '../context/LanguageContext';
export default function ProductSection({id,title,kicker,products,label,link,onLink}){const {loading}=useShop(),{t}=useLanguage();return <section className="store-section" id={id}><div className="section-heading"><div><span className="section-kicker">{kicker}</span><h2>{title}</h2></div><button className="text-link" onClick={onLink}>{link} <span aria-hidden="true">→</span></button></div>{loading?<LoadingGrid/>:<div className="product-grid">{products.map(p=><ProductCard key={p.id} product={p} label={label}/>)}{!products.length&&<p className="muted">{t('New products coming soon.')}</p>}</div>}</section>;}
