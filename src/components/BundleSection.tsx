import {useShop} from '../context/ShopContext';
import {money} from '../lib/helpers';
import BundleVisual from './BundleVisual';
import Icon from './Icon';
import type {Bundle} from '../types/shop';

export default function BundleSection(){
 const {catalog,findProduct,addToCart,loading}=useShop();
 return <section className="store-section bundle-section" id="bundles">
  <div className="section-heading"><div><span className="section-kicker">CURATED CELEBRATION SETS</span><h2>Celebration bundles</h2></div><a className="text-link" href="#catalog">Shop all crackers <Icon name="arrow"/></a></div>
  {loading?<p className="muted">Loading bundle offers…</p>:<div className="bundle-grid">{catalog?.bundles.map((b:Bundle)=>{
   const original=b.items.reduce((sum,item)=>sum+(findProduct(item.id)?.price||0)*item.qty,0),saving=Math.max(0,original-b.price),count=b.items.reduce((sum,item)=>sum+item.qty,0);
   return <article className="bundle-card curated-bundle" key={b.id}>
    <BundleVisual/>
    <div className="bundle-content">
     <div className="bundle-meta"><span>{count} packs · {b.items.length} varieties</span>{saving>0&&<span className="bundle-saving"><Icon name="tag"/>Save {money(saving)}</span>}</div>
     <h3>{b.name}</h3><p className="bundle-description">{b.description}</p>
     <details className="bundle-inclusions"><summary>What's in the box <Icon name="chevron"/></summary><ul>{b.items.map(item=><li key={item.id}><span>{findProduct(item.id)?.name||'Product'}</span><b>× {item.qty}</b></li>)}</ul></details>
     <div className="bundle-purchase"><div className="bundle-price"><span className="price">{money(b.price)}</span>{saving>0&&<del>{money(original)}</del>}<small>Bundle price</small></div><button className="add-button" disabled={!b.stock} onClick={()=>addToCart(b.id)}>{b.stock?<><Icon name="cart"/>Add bundle</>:'Sold out'}</button></div>
    </div>
   </article>;
  })}{!catalog?.bundles.length&&<p className="muted">New bundles coming soon.</p>}</div>}
 </section>;
}
