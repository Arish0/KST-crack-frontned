import Icon from './Icon';
import {useLanguage} from '../context/LanguageContext';

export default function FloatingDiwaliGifts({onClick,count}:{onClick:()=>void;count:number}){
 const {t}=useLanguage();
 return <button className="floating-diwali-gifts" type="button" onClick={onClick} aria-haspopup="dialog" aria-label={t('View Diwali Special Prizes')}>
  <span className="floating-diwali-icon"><Icon name="gift"/></span>
  <span className="floating-diwali-copy"><strong>{t('Diwali Special Prizes')}</strong><small>{t('{count} gifts · random selection',{count})}</small></span>
  <span className="floating-diwali-count" aria-hidden="true">{count}</span>
 </button>;
}
