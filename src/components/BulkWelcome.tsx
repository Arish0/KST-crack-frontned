import {useEffect,useRef,useState} from 'react';
import {useLanguage} from '../context/LanguageContext';

export default function BulkWelcome({onBrowse}:{onBrowse:()=>void}){
 const {t}=useLanguage();
 const dialog=useRef<HTMLDialogElement>(null),[visible,setVisible]=useState(false);
 useEffect(()=>{try{if(sessionStorage.getItem('kst-bulk-welcome-seen'))return;}catch{}setVisible(true);},[]);
 useEffect(()=>{const element=dialog.current;if(visible&&!element?.open)element?.showModal();},[visible]);
 function close(){try{sessionStorage.setItem('kst-bulk-welcome-seen','1');}catch{}dialog.current?.close();setVisible(false);}
 function browse(){close();onBrowse();}
 return <dialog ref={dialog} className="bulk-welcome" aria-labelledby="bulk-welcome-title" aria-describedby="bulk-welcome-description" onCancel={event=>{event.preventDefault();close();}}>
  <div className="bulk-welcome-card">
   <button className="bulk-welcome-close" type="button" onClick={close} aria-label={t('Close bulk gift box offer')}>×</button>
   <div className="bulk-welcome-copy">
    <span className="bulk-welcome-kicker"><span aria-hidden="true">✦</span> {t('KST CELEBRATION SPECIAL')}</span>
    <h2 id="bulk-welcome-title">{t('Big moments deserve a beautiful box.')}</h2>
    <p id="bulk-welcome-description">{t('Planning for a wedding, a team or a whole community? Explore gift boxes for bulk celebrations across the Nilgiris.')}</p>
    <div className="bulk-welcome-points"><span>✦ {t('Gift boxes in bulk')}</span><span>✦ {t('Nilgiris-wide enquiries')}</span><span>✦ {t('Personal quote')}</span></div>
    <button className="bulk-welcome-primary" type="button" onClick={browse}>{t('Explore gift boxes')} <span aria-hidden="true">↗</span></button>
    <button className="bulk-welcome-secondary" type="button" onClick={close}>{t('Continue to the shop')}</button>
    <small>{t('Bulk delivery, stock and final price are confirmed by the shop.')}</small>
   </div>
   <div className="bulk-welcome-art" aria-hidden="true">
    <span className="bulk-star star-a">✦</span><span className="bulk-star star-b">✧</span><span className="bulk-star star-c">✦</span>
    <span className="bulk-orbit orbit-a"/><span className="bulk-orbit orbit-b"/>
    <div className="bulk-box-shadow"/>
    <div className="bulk-gift-box"><div className="bulk-gift-lid"/><div className="bulk-gift-ribbon"/><div className="bulk-gift-label"><span>✦</span><strong>KST</strong><small>CELEBRATION BOX</small></div></div>
    <span className="bulk-art-caption">MADE FOR MOMENTS TOGETHER</span>
   </div>
  </div>
 </dialog>;
}
