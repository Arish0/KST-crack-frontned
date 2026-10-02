import React from 'react';
import {useShop} from '../context/ShopContext';
import ProductCard from './ProductCard';
import LoadingGrid from './LoadingGrid';
export default function ProductSection({id,title,kicker,products,label,link,onLink}){const {loading}=useShop();return <section className="store-section" id={id}><div className="section-heading"><div><span className="section-kicker">{kicker}</span><h2>{title}</h2></div><button className="text-link" onClick={onLink}>{link} →</button></div>{loading?<LoadingGrid/>:<div className="product-grid">{products.map(p=><ProductCard key={p.id} product={p} label={label}/>)}{!products.length&&<p className="muted">New products coming soon.</p>}</div>}</section>;}
