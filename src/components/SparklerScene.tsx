import {useEffect,useRef} from 'react';
import * as THREE from 'three';

type Particle={position:THREE.Vector3;velocity:THREE.Vector3;age:number;life:number;}

/** A lightweight, transparent Three.js sparkler scene for the pink carousel card. */
export default function SparklerScene(){
 const host=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const element=host.current;if(!element)return;
  let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch{return;}
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
  renderer.setClearColor(0x000000,0);
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  element.appendChild(renderer.domElement);element.classList.add('sparkler-ready');

  const scene=new THREE.Scene();
  const camera=new THREE.OrthographicCamera(-4.4,4.4,3,-3,.1,30);camera.position.z=12;
  const artwork=new THREE.Group();scene.add(artwork);
  const origin=new THREE.Vector3(-.08,.58,0);

  // Fine, warm metallic stem and a small wrapped grip, angled like the reference.
  const stemEnd=new THREE.Vector3(1.45,-2.62,0);
  const stemGeometry=new THREE.BufferGeometry().setFromPoints([origin,stemEnd]);
  const stem=new THREE.Line(stemGeometry,new THREE.LineBasicMaterial({color:0x34313c,transparent:true,opacity:.9}));artwork.add(stem);
  const stemHighlight=new THREE.Line(stemGeometry,new THREE.LineBasicMaterial({color:0xffd28a,transparent:true,opacity:.72}));stemHighlight.position.x=-.025;artwork.add(stemHighlight);
  const grip=new THREE.Mesh(new THREE.CylinderGeometry(.045,.06,.36,8),new THREE.MeshBasicMaterial({color:0x9e5e43}));
  grip.position.copy(origin).add(stemEnd).multiplyScalar(.5);grip.position.z=.02;
  grip.rotation.z=Math.atan2(stemEnd.y-origin.y,stemEnd.x-origin.x)-Math.PI/2;artwork.add(grip);

  // Soft amber aura and bright layered ignition core.
  const aura=new THREE.Mesh(new THREE.CircleGeometry(.86,48),new THREE.MeshBasicMaterial({color:0xff9b35,transparent:true,opacity:.12,depthWrite:false,blending:THREE.AdditiveBlending}));
  aura.position.copy(origin);aura.position.z=-.25;artwork.add(aura);
  const halo=new THREE.Mesh(new THREE.CircleGeometry(.29,40),new THREE.MeshBasicMaterial({color:0xffc45e,transparent:true,opacity:.38,depthWrite:false,blending:THREE.AdditiveBlending}));
  halo.position.copy(origin);halo.position.z=.2;artwork.add(halo);
  const core=new THREE.Mesh(new THREE.CircleGeometry(.105,32),new THREE.MeshBasicMaterial({color:0xfff8ce,transparent:true,opacity:.98,depthWrite:false,blending:THREE.AdditiveBlending}));
  core.position.copy(origin);core.position.z=.4;artwork.add(core);
  const glint=new THREE.Mesh(new THREE.OctahedronGeometry(.16,0),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.96,blending:THREE.AdditiveBlending}));
  glint.position.copy(origin);glint.position.z=.6;artwork.add(glint);

  // A fine radial crown stays visible even when motion is reduced.
  const rayPositions:number[]=[];
  for(let i=0;i<34;i++){
   const angle=(i/34)*Math.PI*2,inner=.2+(i%3)*.035,outer=.45+(i%5)*.09;
   rayPositions.push(origin.x+Math.cos(angle)*inner,origin.y+Math.sin(angle)*inner,.1,origin.x+Math.cos(angle)*outer,origin.y+Math.sin(angle)*outer,.1);
  }
  const rayGeometry=new THREE.BufferGeometry();rayGeometry.setAttribute('position',new THREE.Float32BufferAttribute(rayPositions,3));
  const rays=new THREE.LineSegments(rayGeometry,new THREE.LineBasicMaterial({color:0xffd979,transparent:true,opacity:.58,depthWrite:false,blending:THREE.AdditiveBlending}));artwork.add(rays);

  const count=96,particles:Particle[]=[],pointValues=new Float32Array(count*3),trailValues=new Float32Array(count*6),colors=new Float32Array(count*3);
  const colorChoices=[new THREE.Color(0xffefb0),new THREE.Color(0xffbf50),new THREE.Color(0xff873b),new THREE.Color(0xffd575)];
  const respawn=(p:Particle,index:number,spread=1)=>{
   const angle=Math.random()*Math.PI*2,speed=(.8+Math.random()*2.15)*spread;
   p.position.copy(origin).add(new THREE.Vector3(Math.cos(angle)*(.18+Math.random()*.08),Math.sin(angle)*(.18+Math.random()*.08),.18+Math.random()*.15));
   p.velocity.set(Math.cos(angle)*speed,Math.sin(angle)*speed,.05+Math.random()*.18);
   p.age=0;p.life=.42+Math.random()*.9;
   const c=colorChoices[index%colorChoices.length];colors[index*3]=c.r;colors[index*3+1]=c.g;colors[index*3+2]=c.b;
  };
  for(let i=0;i<count;i++){const p={position:new THREE.Vector3(),velocity:new THREE.Vector3(),age:Math.random(),life:1};respawn(p,i);p.age=Math.random()*p.life;particles.push(p);}
  const pointGeometry=new THREE.BufferGeometry();pointGeometry.setAttribute('position',new THREE.BufferAttribute(pointValues,3));pointGeometry.setAttribute('color',new THREE.BufferAttribute(colors,3));
  for(let i=0;i<count;i++){const p=particles[i];pointValues.set([p.position.x,p.position.y,p.position.z],i*3);trailValues.set([p.position.x,p.position.y,p.position.z,p.position.x,p.position.y,p.position.z],i*6);}
  const points=new THREE.Points(pointGeometry,new THREE.PointsMaterial({size:.055,sizeAttenuation:true,vertexColors:true,transparent:true,opacity:.95,depthWrite:false,blending:THREE.AdditiveBlending}));artwork.add(points);
  const trailGeometry=new THREE.BufferGeometry();trailGeometry.setAttribute('position',new THREE.BufferAttribute(trailValues,3));
  const trails=new THREE.LineSegments(trailGeometry,new THREE.LineBasicMaterial({color:0xffc768,transparent:true,opacity:.7,depthWrite:false,blending:THREE.AdditiveBlending}));artwork.add(trails);

  const resize=()=>{const width=element.clientWidth,height=element.clientHeight;if(!width||!height)return;const aspect=width/height;camera.left=-3*aspect;camera.right=3*aspect;camera.top=3;camera.bottom=-3;camera.updateProjectionMatrix();renderer.setSize(width,height,false);};resize();
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(element);
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let visible=true,frame=0,lastTime=0,elapsed=0;
  const intersection=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??true;if(visible&&!reduced&&!frame)frame=requestAnimationFrame(draw);},{threshold:.08});intersection.observe(element);
  const draw=(time=0)=>{
   frame=0;if(!visible)return;
   const delta=Math.min((time-lastTime)/1000,.04)||.016;lastTime=time;elapsed+=delta;
   aura.scale.setScalar(1+.07*Math.sin(elapsed*3));halo.scale.setScalar(1+.16*Math.sin(elapsed*7));core.scale.setScalar(.9+.18*Math.sin(elapsed*12));glint.rotation.z+=delta*.7;glint.scale.setScalar(.78+.23*Math.sin(elapsed*10));
   if(!reduced){
    for(let i=0;i<count;i++){
     const p=particles[i];p.age+=delta;
     if(p.age>=p.life)respawn(p,i);
     const oldX=p.position.x,oldY=p.position.y,fade=Math.max(0,1-p.age/p.life);
     p.velocity.y-=1.05*delta;p.position.addScaledVector(p.velocity,delta);
     pointValues[i*3]=p.position.x;pointValues[i*3+1]=p.position.y;pointValues[i*3+2]=p.position.z;
     trailValues[i*6]=p.position.x-p.velocity.x*.075;trailValues[i*6+1]=p.position.y-p.velocity.y*.075;trailValues[i*6+2]=p.position.z;
     trailValues[i*6+3]=p.position.x;trailValues[i*6+4]=p.position.y;trailValues[i*6+5]=p.position.z;
     colors[i*3]*=fade>.25?1:.97;colors[i*3+1]*=fade>.25?1:.97;colors[i*3+2]*=fade>.25?1:.97;
     // A few tiny hot sparks flare outward more brightly near ignition.
     if(p.age<.12){pointValues[i*3]=oldX;pointValues[i*3+1]=oldY;}
    }
    pointGeometry.attributes.position.needsUpdate=true;pointGeometry.attributes.color.needsUpdate=true;trailGeometry.attributes.position.needsUpdate=true;
   }
   renderer.render(scene,camera);
   if(!reduced)frame=requestAnimationFrame(draw);
  };
  if(reduced)draw(0);else frame=requestAnimationFrame(draw);
  return()=>{
   if(frame)cancelAnimationFrame(frame);intersection.disconnect();resizeObserver.disconnect();
   for(const child of artwork.children){if(child instanceof THREE.Mesh||child instanceof THREE.Line||child instanceof THREE.Points){child.geometry.dispose();const material=child.material;if(Array.isArray(material))material.forEach(m=>m.dispose());else material.dispose();}}
   renderer.dispose();renderer.domElement.remove();element.classList.remove('sparkler-ready');
  };
 },[]);
 return <div className="sparkler-scene" ref={host} aria-hidden="true"><svg className="sparkler-fallback" viewBox="0 0 440 300"><circle cx="216" cy="121" r="64" fill="#ffd16c" opacity=".09"/><path d="m218 121 74 157" stroke="#34313c" strokeWidth="4"/><path d="m218 121 74 157" stroke="#ffd58a" strokeWidth="1" opacity=".7"/><circle cx="218" cy="121" r="15" fill="#fff6cc"/><circle cx="218" cy="121" r="37" fill="#ffbd54" opacity=".35"/><g stroke="#ffe09a" strokeWidth="3" strokeLinecap="round">{Array.from({length:16},(_,i)=>{const a=i*Math.PI/8;return <path key={i} d={`M${218+Math.cos(a)*25} ${121+Math.sin(a)*25} L${218+Math.cos(a)*(48+i%3*8)} ${121+Math.sin(a)*(48+i%3*8)}`}/>})}</g></svg></div>;
}
