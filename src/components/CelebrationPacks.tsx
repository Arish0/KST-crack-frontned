import {useLanguage} from '../context/LanguageContext';
export default function CelebrationPacks({discount}:{discount:number}){
 const {t}=useLanguage();
 return <div className="celebration-packs" aria-label={discount>0?t('Save up to {discount}% on selected crackers',{discount}):t('KST celebration packs')}>
  <div className="celebration-pack pack-navy"><span>✦</span><strong>KST</strong><small>CELEBRATE TOGETHER</small></div>
  <div className="celebration-pack pack-coral"><span>✳</span><strong>FESTIVAL</strong><small>A LITTLE MAGIC</small></div>
  {discount>0&&<div className="celebration-saving"><small>{t('SAVE UP TO')}</small><strong>{discount}%</strong><span>{t('on selected crackers')}</span></div>}
  <span className="pack-spark spark-one">✦</span><span className="pack-spark spark-two">✦</span><span className="pack-spark spark-three">●</span>
 </div>;
}
