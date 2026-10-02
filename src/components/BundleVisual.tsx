import {useCallback,useEffect,useRef,useState} from 'react';
import dynamic from 'next/dynamic';
const BundleScene=dynamic(()=>import('./BundleScene'),{ssr:false});

export default function BundleVisual(){
 const host=useRef<HTMLDivElement>(null),[near,setNear]=useState(false),[ready,setReady]=useState(false);
 const onReady=useCallback(()=>setReady(true),[]);
 useEffect(()=>{const element=host.current;if(!element)return;if(!('IntersectionObserver' in window)){setNear(true);return;}const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){setNear(true);observer.disconnect();}},{rootMargin:'150px'});observer.observe(element);return()=>observer.disconnect();},[]);
 return <div ref={host} className={'bundle-art-stage'+(ready?' scene-ready':'')}>
  <div className="bundle-art-halo"/>
  <div className="bundle-art-fallback" aria-hidden="true"><span>✦</span><strong>KST</strong><small>CELEBRATION BOX</small></div>
  {near&&<BundleScene onReady={onReady}/>}
  <span className="bundle-art-label">THE KST BUNDLE COLLECTION</span>
 </div>;
}
