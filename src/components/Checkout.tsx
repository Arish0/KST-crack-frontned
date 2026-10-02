import React,{useState,useRef} from 'react';
import {useShop} from '../context/ShopContext';
import {request} from '../lib/api';
import LocationPicker from './LocationPicker';
import OrderSummary from './OrderSummary';
export default function Checkout({onBusy}){
 const {catalog,cart,setCart,totals,location,setLastOrder,online}=useShop(),[name,setName]=useState(''),[address,setAddress]=useState(''),[mode,setMode]=useState('delivery'),[saving,setSaving]=useState(false),[error,setError]=useState(''),lock=useRef(false),pending=useRef(null);
 async function submit(e){e.preventDefault();if(lock.current)return;if(mode==='delivery'&&!location?.eligible){setError('Confirm a location inside our delivery area, or choose shop pickup.');return;}const data={name,address:mode==='delivery'?address:'',mode,lat:mode==='delivery'?location.lat:null,lng:mode==='delivery'?location.lng:null,items:cart.map(i=>({...i}))},signature=JSON.stringify(data);
 if(!pending.current){try{pending.current=JSON.parse(sessionStorage.getItem('kst-pending')||'null');}catch{}}
 if(pending.current?.signature!==signature){pending.current={signature,key:crypto.randomUUID()};try{sessionStorage.setItem('kst-pending',JSON.stringify(pending.current));}catch{}}
 lock.current=true;setSaving(true);onBusy(true);setError('');
 try{const order=await request('/api/orders',{data,timeout:15000,headers:{'Idempotency-Key':pending.current.key}});setLastOrder(order);setCart([]);try{sessionStorage.removeItem('kst-pending');}catch{}pending.current=null;}
 catch(err){setError(err.message+' Your cart is safe; retry when ready.');}
 finally{lock.current=false;setSaving(false);onBusy(false);}
 }
 return <><OrderSummary subtotal={totals.subtotal} savings={totals.savings} deliveryFee={mode==='delivery'?catalog.settings.deliveryFee:0}/><form onSubmit={submit}><fieldset className="checkout-fieldset" disabled={saving}><div className="form-grid"><label className="field">Your name<input value={name} onChange={e=>setName(e.target.value)} required maxLength={100} autoComplete="name"/></label><label className="field">Delivery option<select value={mode} onChange={e=>setMode(e.target.value)}><option value="delivery">Door delivery</option><option value="pickup">Shop pickup</option></select></label>{mode==='delivery'&&<div className="wide"><label className="field">Full delivery address<textarea value={address} onChange={e=>setAddress(e.target.value)} required maxLength={1000} placeholder="House number, street, locality, PIN code, landmark" autoComplete="street-address"/></label><LocationPicker/></div>}</div><p className="notice">Delivery is limited to a {catalog.settings.radius} km straight-line radius. Your address and map location are shared only with the shop admin when you save the request. Stock is confirmed by the shop.</p><p className="error" role="alert">{error}</p>{!online&&<p className="error">Reconnect to save your order. Your cart is safe.</p>}<button className="button primary" type="submit" disabled={!online||saving}>{saving?'Saving your request…':error?'Retry saving request':'Save request & get final quote'}</button></fieldset></form></>;
}
