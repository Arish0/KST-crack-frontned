import {useShop} from '../context/ShopContext';
import {useLanguage} from '../context/LanguageContext';
import type {Product} from '../types/shop';
import ProductCard from './ProductCard';
import LoadingGrid from './LoadingGrid';
import Icon from './Icon';

const previewGiftBoxes:Product[]=[
 {id:'preview-vip-box',name:'Sree Balaji Andal VIP Gift Box',category:'Gift Boxes',unit:'Grand assorted festival box',description:'Grand assorted festival box featuring premium multi-colour flower pots, sparkling chakkars, whistling aerial rockets, and floral garlands.',price:2800,discount:34,stock:12,featured:false,art:'gift',sold:0},
 {id:'preview-family-box',name:'Mahalaxmi Prosperity Family Pack',category:'Gift Boxes',unit:'Complete family celebration hamper',description:'The complete family celebration box packed with child-safe sparklers, colour fountains, ground spinners, and festive gift novelties.',price:3200,discount:33,stock:20,featured:true,art:'pot',sold:0},
 {id:'preview-disney-box',name:'Balaji Disney Marvel Wonder Pack',category:'Gift Boxes',unit:'Child-safe wonder pack',description:'Enchanted fairytale celebration pack designed for kids and teens with dazzling visual aerial sparklers, magic pops, and soundless novelty crackers.',price:2100,discount:31,stock:8,featured:false,art:'spark',sold:0},
];
export default function GiftBoxSection({onViewAll,preview=false}:{onViewAll:()=>void;preview?:boolean}){
 const {catalog,loading}=useShop(),{t}=useLanguage();
 const giftBoxes:Product[]=(catalog?.products||[]).filter((product:Product)=>product.category==='Gift Boxes').sort((a:Product,b:Product)=>Number(b.featured)-Number(a.featured)||b.discount-a.discount);
 const products=preview&&!giftBoxes.length?previewGiftBoxes:giftBoxes;
 if(!preview&&!loading&&!products.length)return null;
 return <section className="store-section giftbox-showcase" id="gift-boxes">
  <div className="giftbox-heading"><div><span className="giftbox-kicker"><Icon name="sparkles"/>{t('KST curated festival collection')}</span><h2>{t('Festive Celebration Gift Boxes')}</h2><p>{t('Thoughtfully packed gift boxes for family celebrations and special moments.')}</p></div><button className="giftbox-view-all" type="button" onClick={onViewAll}>{t('View all gift boxes')}<Icon name="arrow"/></button></div>
  {loading&&!preview?<LoadingGrid/>:<div className="giftbox-grid">{products.slice(0,3).map((product,index)=><ProductCard key={product.id} product={product} variant="giftbox" label={product.featured?t('Family favourite'):index===0?t('Signature gift box'):t('Gift box')} preview={preview&&!giftBoxes.length}/>)}</div>}
  {preview&&!giftBoxes.length&&<p className="giftbox-preview-note">Local design preview · sample products · ordering buttons are disabled</p>}
 </section>;
}
