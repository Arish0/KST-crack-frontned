import React from 'react';
import {useShop} from '../context/ShopContext';
import {useLanguage} from '../context/LanguageContext';

export default function Footer({onDiwaliGifts,showDiwaliGifts=false}:{onDiwaliGifts:()=>void;showDiwaliGifts?:boolean}) {
 const {catalog}=useShop(),{t}=useLanguage();
 const shop=catalog?.settings,contact=(shop?.whatsapp||shop?.phone||'').replace(/\D/g,'');
 const whatsappUrl=contact?`https://wa.me/${contact}?text=${encodeURIComponent('Hello KST Crackers, I would like a bulk gift box quotation.')}`:'';
 return <footer className="store-footer">
  <a className="back-top" href="#">Back to top</a>
  <div className="store-footer-main">
   <section className="footer-brand-block"><a className="store-brand" href="/">kst<span>crackers</span></a><p>Celebrating Diwali, Pongal, and life moments with safety-tested authentic fireworks delivered direct from our trusted hubs.</p><span className="footer-trust-badge">&#10003; &nbsp;100% Genuine Sivakasi Stock</span>{showDiwaliGifts&&<button className="footer-diwali-link" type="button" onClick={onDiwaliGifts}>View Diwali Special Prizes &middot; 5 gifts</button>}</section>
   <section className="footer-links-block"><h3>Celebration Catalogs</h3><a href="#offers">Hot Festival Offers</a><a href="#catalog">Deluxe &amp; Color Sparklers</a><a href="#gift-boxes">Family Celebration Boxes</a><a href="#catalog">Night Sky Aerial Shots</a><a href="#catalog">Complete Price List</a></section>
   <section className="footer-delivery-block"><h3>Nilgiris &amp; Hub Delivery</h3><p>Priority same-day and scheduled doorstep supply across Kotagiri, Coonoor, Ooty, and surrounding 15 km radius.</p><div className="footer-hub-note"><strong>&#9906; Nilgiris Safe Dispatch Center</strong><span>Temperature-controlled, safe dry storage facility.</span></div></section>
   <section className="footer-support-block"><h3>Instant Support</h3><p>Need a custom corporate package or bulk festival quotation?</p>{whatsappUrl?<a className="footer-whatsapp" href={whatsappUrl} target="_blank" rel="noopener noreferrer">&#9993; &nbsp;WhatsApp Fast Quote</a>:<span className="footer-contact-pending">WhatsApp contact is being set up</span>}<small>&#9673; &nbsp;Responses in under 15 minutes</small></section>
  </div>
  <div className="footer-manufacturer"><span className="footer-manufacturer-icon">&#10022;</span><div className="footer-manufacturer-copy"><div><strong>Balaji Sankar Company</strong><span className="footer-partner-tag">Official Manufacturing Partner</span></div><p>Certified Sivakasi Fireworks Sourcing &amp; Quality Assured Production</p><small>&#9638; Directly sourced from Sivakasi, Tamil Nadu &nbsp; &nbsp; &#9906; 3/266-C3, Chinnakamanpatti, Sattur Main Road, Sivakasi</small></div><span className="footer-authenticity">&#9813; &nbsp;100% Authentic Sivakasi Guarantee</span></div>
  <div className="store-copyright"><span>&copy; 2026 KST Crackers (kstcrackers.shop). All rights reserved.</span><nav aria-label="Legal information"><a href="#safety">Safety Guidelines</a><a href="#terms">Terms of Supply</a><a href="#privacy">Privacy Policy</a></nav></div>
 </footer>;
}
