import {useShop} from '../context/ShopContext';
import Icon from './Icon';

export default function ServiceHighlights(){
 const {catalog}=useShop();
 const highlights=[
  {icon:'pin' as const,title:'Local delivery',description:`Within ${catalog?.settings.radius??15} km of our shop`},
  {icon:'tag' as const,title:'Clear pricing',description:'See discounts in your itemised quote'},
  {icon:'check' as const,title:'Shop-confirmed orders',description:'Confirm stock and delivery on WhatsApp'}
 ];
 return <section className="service-highlights" aria-label="Shopping with KST">{highlights.map(item=><div key={item.title}><span className="service-icon"><Icon name={item.icon}/></span><div><h2>{item.title}</h2><p>{item.description}</p></div></div>)}</section>;
}
