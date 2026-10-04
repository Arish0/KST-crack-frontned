import {useLanguage} from '../context/LanguageContext';

export default function CelebrationPacks({discount}:{discount:number}){
 const {t}=useLanguage();
 return <div className="celebration-packs" role="img" aria-label={discount>0?t('Save up to {discount}% on selected crackers',{discount}):t('KST celebration packs')}>
  <img className="celebration-gift-art" src="/images/festival-gift-cards.png" alt="" loading="eager" decoding="async" />
 </div>;
}
