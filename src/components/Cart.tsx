import React,{useRef,useEffect,useState} from 'react';
import {useShop} from '../context/ShopContext';
import {useLanguage} from '../context/LanguageContext';
import {money,sellingPrice} from '../lib/helpers';
import Checkout from './Checkout';
import FinalQuote from './FinalQuote';
import Icon from './Icon';

export default function Cart(){
 const {catalog,cart,cartOpen,setCartOpen,findProduct,changeQuantity,addToCart,lastOrder}=useShop(),{t}=useLanguage(),dialog=useRef<HTMLDialogElement>(null),[busy,setBusy]=useState(false),[purchaseType,setPurchaseType]=useState<'normal'|'bulk'>('normal'),[bulkGiftId,setBulkGiftId]=useState('');
 const giftBoxes=(catalog?.products||[]).filter(p=>p.category==='Gift Boxes'),bulkGiftCount=cart.reduce((sum,item)=>sum+(findProduct(item.id)?.category==='Gift Boxes'?item.qty:0),0);
 useEffect(()=>{const el=dialog.current;if(cartOpen&&!el.open)el.showModal();if(!cartOpen&&el.open)el.close();},[cartOpen]);
 useEffect(()=>{if(!bulkGiftId&&giftBoxes.length)setBulkGiftId(giftBoxes[0].id);},[bulkGiftId,giftBoxes]);
 const addBulkGift=()=>{if(bulkGiftId)addToCart(bulkGiftId,true);};
 return <dialog ref={dialog} aria-labelledby="cart-title" onCancel={e=>{e.preventDefault();if(!busy)setCartOpen(false);}} onClose={()=>setCartOpen(false)}>
  <div className="modal-heading"><div><span className="section-kicker">{t('YOUR CELEBRATION CART')}</span><h2 id="cart-title">{t('Shopping cart')}</h2></div><button className="close" aria-label={t('Close cart')} disabled={busy} onClick={()=>setCartOpen(false)}><Icon name="close"/></button></div>
  {lastOrder?<FinalQuote order={lastOrder}/>:!catalog?<p className="muted">{t('The shop is loading. Please retry shortly.')}</p>:<>
   <div className="purchase-tabs" role="tablist" aria-label={t('Purchase type')}>
    <button type="button" role="tab" aria-selected={purchaseType==='normal'} className={purchaseType==='normal'?'active':''} onClick={()=>setPurchaseType('normal')}>{t('Normal purchase')}</button>
    <button type="button" role="tab" aria-selected={purchaseType==='bulk'} className={purchaseType==='bulk'?'active':''} onClick={()=>setPurchaseType('bulk')}>{t('Bulk purchase')}</button>
   </div>
   <p className="purchase-note">{purchaseType==='bulk'?t('Bulk orders require at least 25 gift boxes and can be delivered throughout the Nilgiris district. Advance payment is required before delivery; the shop will confirm the amount and payment details.'):t('For small-scale orders, doorstep delivery is available within about {radius} km of our shop. Choose shop pickup for locations outside this area.',{radius:catalog.settings.radius??15})}</p>
   {purchaseType==='bulk'&&<div className="bulk-gift-picker"><label className="field">{t('Choose a gift box to add')}<select value={bulkGiftId} onChange={e=>setBulkGiftId(e.target.value)}>{giftBoxes.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label><button className="button outline" type="button" disabled={!bulkGiftId||busy} onClick={addBulkGift}><Icon name="plus"/>{t('Add one gift box')}</button><span className="bulk-progress" aria-live="polite">{t('{count} of 25 gift boxes in this request',{count:bulkGiftCount})}</span></div>}
   {!cart.length?<div className="empty-state"><h3>{t('Your cart is empty')}</h3><p>{purchaseType==='bulk'?t('Add gift boxes above to start your bulk request.'):t('Explore the latest offers and add your celebration favourites.')}</p>{purchaseType==='normal'&&<a className="button primary" href="#catalog" onClick={()=>setCartOpen(false)}>{t('Start shopping')}</a>}</div>:<>
    {cart.map(i=>{const p=findProduct(i.id);if(!p)return null;const quoteOnly=p.price<=0,bulkGift=p.category==='Gift Boxes'&&purchaseType==='bulk',canIncrease=bulkGift?i.qty<500:i.qty<p.stock;return <div className="cart-row" key={i.id}><div><strong>{p.name}</strong><span className="muted">{quoteOnly?t('Price to be confirmed by the shop'):`${money(sellingPrice(p))} ${t('each')}`}</span></div><div className="quantity"><button aria-label={t('Remove one {name}',{name:p.name})} disabled={busy} onClick={()=>changeQuantity(i.id,-1,purchaseType==='bulk')}><Icon name="minus"/></button><span>{i.qty}</span><button aria-label={t('Add one {name}',{name:p.name})} disabled={busy||!canIncrease} onClick={()=>changeQuantity(i.id,1,purchaseType==='bulk')}><Icon name="plus"/></button></div>{!quoteOnly&&<strong>{money(sellingPrice(p)*i.qty)}</strong>}</div>;})}
    {purchaseType==='bulk'&&bulkGiftCount<25&&<p className="bulk-validation" role="status">{t('Add {count} more gift boxes to reach the 25-box minimum.',{count:25-bulkGiftCount})}</p>}
    <Checkout onBusy={setBusy} purchaseType={purchaseType}/>
   </>}
  </>}
 </dialog>;
}
