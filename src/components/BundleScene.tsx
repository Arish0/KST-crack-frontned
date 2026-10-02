import {useEffect,useRef} from 'react';
import * as THREE from 'three';

export default function BundleScene({onReady}:{onReady:()=>void}){
 const host=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const element=host.current;if(!element)return;
  let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch{return;}
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.25));
  renderer.setClearColor(0,0);element.appendChild(renderer.domElement);
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.1,30);
  camera.position.set(0,1.4,6.8);camera.lookAt(0,.2,0);
  scene.add(new THREE.AmbientLight(0xffffff,2));
  const light=new THREE.DirectionalLight(0xffefcc,3);light.position.set(3,5,4);scene.add(light);
  const gift=new THREE.Group();scene.add(gift);gift.rotation.set(.07,-.45,-.07);
  const plum=new THREE.MeshStandardMaterial({color:0x684c65,roughness:.5,metalness:.12});
  const gold=new THREE.MeshStandardMaterial({color:0xe8bc69,roughness:.35,metalness:.5});
  function box(w:number,h:number,d:number,material:THREE.Material,parent:THREE.Group,x=0,y=0,z=0){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);mesh.position.set(x,y,z);parent.add(mesh);return mesh;}
  box(1.5,1.25,1.2,plum,gift,0,-.05);
  box(.19,1.27,1.22,gold,gift,0,-.05);box(1.52,.19,1.22,gold,gift,0,-.05);
  const lid=new THREE.Group();lid.position.y=.64;gift.add(lid);
  box(1.62,.19,1.32,plum,lid);box(.19,.21,1.34,gold,lid);box(1.64,.21,.19,gold,lid);
  for(const direction of [-1,1]){const bow=new THREE.Mesh(new THREE.TorusGeometry(.23,.035,6,28),gold);bow.scale.set(1.3,.7,1);bow.position.set(direction*.23,.25,0);bow.rotation.set(-.5,0,direction*.3);lid.add(bow);}
  const particles=new THREE.Group();scene.add(particles);
  const sparkleGeometry=new THREE.OctahedronGeometry(.045),sparkleMaterial=new THREE.MeshBasicMaterial({color:0xd5a85f});
  for(let i=0;i<12;i++){const mesh=new THREE.Mesh(sparkleGeometry,sparkleMaterial),angle=i/12*Math.PI*2;mesh.position.set(Math.cos(angle)*1.4,.5+Math.sin(angle)*.9,Math.sin(angle)*.5);particles.add(mesh);}
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)'),pointer={x:0,y:0};let frame=0,visible=false,disposed=false;
  const draw=(time=0)=>{frame=0;if(disposed)return;const seconds=time/1000;
   gift.position.y=reduced.matches?0:Math.sin(seconds*1.3)*.07;
   gift.rotation.y=-.45+(reduced.matches?0:Math.sin(seconds*.7)*.16+pointer.x*.2);
   gift.rotation.x=.07+(reduced.matches?0:pointer.y*.1);
   lid.position.y=.64+(reduced.matches?0:(Math.sin(seconds*1.1)+1)*.035);
   particles.rotation.y=reduced.matches?0:seconds*.12;
   renderer.render(scene,camera);
   if(visible&&!document.hidden&&!reduced.matches)frame=requestAnimationFrame(draw);
  };
  const update=()=>{if(frame)cancelAnimationFrame(frame);frame=0;draw(performance.now());};
  const resize=()=>{const width=element.clientWidth,height=element.clientHeight;if(!width||!height)return;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();update();};
  const observer=new ResizeObserver(resize);observer.observe(element);resize();onReady();
  const visibility=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;update();});visibility.observe(element);
  const move=(event:PointerEvent)=>{if(reduced.matches||event.pointerType==='touch')return;const rect=element.getBoundingClientRect();pointer.x=(event.clientX-rect.left)/rect.width-.5;pointer.y=(event.clientY-rect.top)/rect.height-.5;};
  const leave=()=>{pointer.x=0;pointer.y=0;};
  element.addEventListener('pointermove',move);element.addEventListener('pointerleave',leave);document.addEventListener('visibilitychange',update);reduced.addEventListener('change',update);
  return()=>{disposed=true;if(frame)cancelAnimationFrame(frame);observer.disconnect();visibility.disconnect();element.removeEventListener('pointermove',move);element.removeEventListener('pointerleave',leave);document.removeEventListener('visibilitychange',update);reduced.removeEventListener('change',update);const geometries=new Set<THREE.BufferGeometry>();scene.traverse(child=>{if(child instanceof THREE.Mesh)geometries.add(child.geometry);});geometries.forEach(geometry=>geometry.dispose());plum.dispose();gold.dispose();sparkleMaterial.dispose();renderer.dispose();renderer.domElement.remove();};
 },[onReady]);
 return <div className="bundle-three" ref={host} aria-hidden="true"/>;
}
