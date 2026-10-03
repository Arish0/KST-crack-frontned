import {useShop} from '../context/ShopContext';
import Icon from './Icon';
import {useLanguage} from '../context/LanguageContext';

export default function ServiceHighlights(){
 const {catalog}=useShop(),{t}=useLanguage();
 const highlights=[
  {icon:'pin' as const,title:t('Local delivery'),description:t('Within {radius} km of our shop',{radius:catalog?.settings.radius??15})},
  {icon:'tag' as const,title:t('Clear pricing'),description:t('See discounts in your itemised quote')},
  {icon:'check' as const,title:t('Shop-confirmed orders'),description:t('Confirm stock and delivery on WhatsApp')}
 ];
 return <section className="service-highlights" aria-label={t('Shopping with KST')}>{highlights.map(item=><div key={item.title}><span className="service-icon"><Icon name={item.icon}/></span><div><h2>{item.title}</h2><p>{item.description}</p></div></div>)}</section>;
}
