import {useShop} from '../context/ShopContext';
import {useLanguage} from '../context/LanguageContext';
import {money} from '../lib/helpers';
import BundleVisual from './BundleVisual';
import Icon from './Icon';
import type {Bundle} from '../types/shop';

export default function BundleSection(){
 const {catalog,findProduct,addToCart,loading,cart,openCart}=useShop(),{t}=useLanguage();
 return <section className="store-section bundle-section" id="bundles">
  <div className="section-heading"><div><span className="section-kicker">{t('CURATED CELEBRATION SETS')}</span><h2>{t('Celebration bundles')}</h2></div><a className="text-link" href="#catalog">{t('Shop all crackers')} <Icon name="arrow"/></a></div>
  {loading?<p className="muted">{t('Loading bundle offers…')}</p>:<div className="bundle-grid">{catalog?.bundles.map((b:Bundle)=>{
   const original=b.items.reduce((sum,item)=>sum+(findProduct(item.id)?.price||0)*item.qty,0),discount=b.price>0&&original>b.price?Math.round((original-b.price)/original*100):0,count=b.items.reduce((sum,item)=>sum+item.qty,0);
   return <article className="bundle-card curated-bundle" key={b.id}>
    <BundleVisual/>
    <div className="bundle-content">
     <div className="bundle-meta"><span>{t('{count} packs · {varieties} varieties',{count,varieties:b.items.length})}</span>{discount>0&&<span className="bundle-saving">{discount}% {t('OFF')}</span>}</div>
     <h3>{b.name}</h3><p className="bundle-description">{b.description}</p>
     <details className="bundle-inclusions"><summary>{t('What’s in the box')} <Icon name="chevron"/></summary><ul>{b.items.map(item=><li key={item.id}><span>{findProduct(item.id)?.name||t('Product')}</span><b>× {item.qty}</b></li>)}</ul></details>
     <div className="bundle-purchase">{b.price>0&&<div className="bundle-price"><span className="price">{money(b.price)}</span>{discount>0&&<del>{money(original)}</del>}<small>{t('Bundle price')}</small></div>}<button className="add-button" disabled={!b.stock} onClick={()=>addToCart(b.id)}>{b.stock?<><Icon name="cart"/>{t('Add bundle')}</>:t('Sold out')}</button>{b.price<=0&&<button className="button outline" disabled={!b.stock} onClick={()=>{if(!cart.some(item=>item.id===b.id))addToCart(b.id);openCart();}}>{t('Get quote from shop')}</button>}</div>
    </div>
   </article>;
  })}{!catalog?.bundles.length&&<p className="muted">{t('New bundles coming soon.')}</p>}</div>}
 </section>;
}
