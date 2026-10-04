import {useEffect,useRef,useState} from 'react';
import type {PointerEvent as ReactPointerEvent} from 'react';
import Icon from './Icon';
import {useLanguage} from '../context/LanguageContext';

export default function FloatingDiwaliGifts({onClick,count}:{onClick:()=>void;count:number}){
 const {t}=useLanguage(),[corner,setCorner]=useState('br'),button=useRef<HTMLButtonElement>(null),gesture=useRef<{x:number;y:number;left:number;top:number;pointerId:number;moved:boolean}|null>(null),suppressClick=useRef(false);
 useEffect(()=>{try{const saved=localStorage.getItem('kst-diwali-float-corner');if(saved&&['tl','tr','bl','br'].includes(saved))setCorner(saved);}catch{}},[]);
 function startDrag(event:ReactPointerEvent<HTMLButtonElement>){
  if(window.matchMedia('(min-width: 641px)').matches||event.button!==0)return;
  const rect=event.currentTarget.getBoundingClientRect();gesture.current={x:event.clientX,y:event.clientY,left:rect.left,top:rect.top,pointerId:event.pointerId,moved:false};event.currentTarget.setPointerCapture(event.pointerId);
 }
 function moveDrag(event:ReactPointerEvent<HTMLButtonElement>){
  const drag=gesture.current,node=button.current;if(!drag||drag.pointerId!==event.pointerId||!node)return;
  const dx=event.clientX-drag.x,dy=event.clientY-drag.y;if(!drag.moved&&Math.hypot(dx,dy)<6)return;
  drag.moved=true;event.preventDefault();const rect=node.getBoundingClientRect(),left=Math.max(12,Math.min(window.innerWidth-rect.width-12,drag.left+dx)),top=Math.max(12,Math.min(window.innerHeight-rect.height-145,drag.top+dy));node.style.transform=`translate3d(${left-drag.left}px,${top-drag.top}px,0)`;
 }
 function endDrag(event:ReactPointerEvent<HTMLButtonElement>){
  const drag=gesture.current,node=button.current;if(!drag||drag.pointerId!==event.pointerId||!node)return;
  gesture.current=null;if(!drag.moved)return;
  const rect=node.getBoundingClientRect(),left=drag.left+event.clientX-drag.x,top=drag.top+event.clientY-drag.y,middleX=window.innerWidth/2,middleY=(12+window.innerHeight-rect.height-145)/2,nextCorner=(top<middleY?'t':'b')+(left+rect.width/2<middleX?'l':'r');
  setCorner(nextCorner);try{localStorage.setItem('kst-diwali-float-corner',nextCorner);}catch{}node.style.transform='';suppressClick.current=true;window.setTimeout(()=>{suppressClick.current=false;},0);
 }
 const click=()=>{if(suppressClick.current){suppressClick.current=false;return;}onClick();};
 return <button ref={button} className="floating-diwali-gifts" data-corner={corner} type="button" onClick={click} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} aria-haspopup="dialog" aria-label={t('View Diwali Special Prizes')}>
  <span className="floating-diwali-icon"><Icon name="gift"/></span>
  <span className="floating-diwali-copy"><strong>{t('Diwali Special Prizes')}</strong><small>{t('{count} gifts · random selection',{count})}</small></span>
  <span className="floating-diwali-count" aria-hidden="true">{count}</span>
 </button>;
}
