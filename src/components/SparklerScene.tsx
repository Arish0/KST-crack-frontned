import {useEffect,useRef} from 'react';
import * as THREE from 'three';

type Spark={position:THREE.Vector3;velocity:THREE.Vector3;age:number;life:number;size:number;color:THREE.Color;};

/** A live, transparent sparkler for the magenta carousel slide. */
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
  const camera=new THREE.OrthographicCamera(-4.2,4.2,2.1,-2.1,.1,30);camera.position.z=12;
  const artwork=new THREE.Group();scene.add(artwork);
  const origin=new THREE.Vector3(.08,.38,.15);

  // Slim dark wire with a hot, irregularly flickering tip, as in a real sparkler.
  const stickEnd=new THREE.Vector3(1.42,-2.05,-.12),stickAxis=stickEnd.clone().sub(origin),stickLength=stickAxis.length(),stickDirection=stickAxis.clone().normalize();
  const makeRod=(radius:number,color:number,z:number,opacity:number)=>{const mesh=new THREE.Mesh(new THREE.CylinderGeometry(radius*.72,radius,stickLength,8,1,true),new THREE.MeshBasicMaterial({color,transparent:true,opacity,depthWrite:false,side:THREE.DoubleSide,blending:color===0xffb84b?THREE.AdditiveBlending:THREE.NormalBlending}));mesh.position.copy(origin).add(stickEnd).multiplyScalar(.5);mesh.position.z=z;mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),stickDirection);artwork.add(mesh);return mesh;};
  makeRod(.037,0x292a32,-.24,.98);
  const filament=makeRod(.008,0xffb84b,-.18,.75);

  // A radial canvas glow gives the hot end a soft bloom without a bitmap asset.
  const glowCanvas=document.createElement('canvas');glowCanvas.width=glowCanvas.height=128;
  const context=glowCanvas.getContext('2d');
  if(context){const gradient=context.createRadialGradient(64,64,1,64,64,64);gradient.addColorStop(0,'rgba(255,255,238,1)');gradient.addColorStop(.08,'rgba(255,239,177,.95)');gradient.addColorStop(.24,'rgba(255,174,62,.48)');gradient.addColorStop(.58,'rgba(255,93,35,.14)');gradient.addColorStop(1,'rgba(255,55,30,0)');context.fillStyle=gradient;context.fillRect(0,0,128,128);}
  const glowTexture=new THREE.CanvasTexture(glowCanvas);glowTexture.colorSpace=THREE.SRGBColorSpace;
  const makeGlow=(size:number,color:number,opacity:number,z:number)=>{const material=new THREE.SpriteMaterial({map:glowTexture,color,transparent:true,opacity,depthWrite:false,blending:THREE.AdditiveBlending});const sprite=new THREE.Sprite(material);sprite.position.copy(origin);sprite.position.z=z;sprite.scale.set(size,size,1);artwork.add(sprite);return sprite;};
  const outerGlow=makeGlow(2.15,0xff6a2a,.55,-.1);
  const goldGlow=makeGlow(1.03,0xffb33e,.82,.1);
  const whiteGlow=makeGlow(.48,0xffedb0,1,.3);
  const core=makeGlow(.19,0xffffff,1,.55);

  // Uneven, layered incandescent filaments around the ignition point.
  const rayCount=88,rayPositions=new Float32Array(rayCount*6),rayColors=new Float32Array(rayCount*6);
  const gold=new THREE.Color(0xffc45b),hot=new THREE.Color(0xfff1c2),orange=new THREE.Color(0xff8b38);
  for(let i=0;i<rayCount;i++){
   const angle=Math.random()*Math.PI*2;
   const inner=.045+Math.random()*.3,outer=.18+Math.pow(Math.random(),1.85)*1.55;
   const dx=Math.cos(angle),dy=Math.sin(angle),offset=i*6;
   rayPositions.set([origin.x+dx*inner,origin.y+dy*inner,.24,origin.x+dx*outer,origin.y+dy*outer,.18],offset);
   const color=i%7===0?hot:i%4===0?orange:gold;
   rayColors.set([hot.r,hot.g,hot.b,color.r,color.g,color.b],offset);
  }
  const rayGeometry=new THREE.BufferGeometry();rayGeometry.setAttribute('position',new THREE.BufferAttribute(rayPositions,3));rayGeometry.setAttribute('color',new THREE.BufferAttribute(rayColors,3));
  const rays=new THREE.LineSegments(rayGeometry,new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:.78,depthWrite:false,blending:THREE.AdditiveBlending}));artwork.add(rays);

  // A four-point white flare cuts through the amber burst at the burn point.
  const flareGeometry=new THREE.BufferGeometry().setFromPoints([
   origin.clone().add(new THREE.Vector3(0,-.22,.45)),origin.clone().add(new THREE.Vector3(0,.22,.45)),
   origin.clone().add(new THREE.Vector3(-.22,0,.45)),origin.clone().add(new THREE.Vector3(.22,0,.45)),
   origin.clone().add(new THREE.Vector3(-.12,-.12,.45)),origin.clone().add(new THREE.Vector3(.12,.12,.45)),
   origin.clone().add(new THREE.Vector3(-.12,.12,.45)),origin.clone().add(new THREE.Vector3(.12,-.12,.45))
  ]);
  const flare=new THREE.LineSegments(flareGeometry,new THREE.LineBasicMaterial({color:0xffffed,transparent:true,opacity:.95,depthWrite:false,blending:THREE.AdditiveBlending}));artwork.add(flare);

  const count=170,sparks:Spark[]=[],pointPositions=new Float32Array(count*3),pointColors=new Float32Array(count*3),pointSizes=new Float32Array(count),pointFades=new Float32Array(count),trailPositions=new Float32Array(count*6),trailColors=new Float32Array(count*6);
  const emberColors=[new THREE.Color(0xfff1c4),new THREE.Color(0xffd068),new THREE.Color(0xffa140),new THREE.Color(0xff883b),new THREE.Color(0xffe5a0)];
  const respawn=(spark:Spark,index:number)=>{
   // Mostly radial ejection, with varied velocity, length and gravity for a natural burn.
   const angle=Math.random()*Math.PI*2+(Math.random()-.5)*.18;
   const speed=1.35+Math.pow(Math.random(),.62)*3.85;
   spark.position.copy(origin).add(new THREE.Vector3(Math.cos(angle)*(.08+Math.random()*.12),Math.sin(angle)*(.08+Math.random()*.12),.25+Math.random()*.18));
   spark.velocity.set(Math.cos(angle)*speed,Math.sin(angle)*speed,.02+Math.random()*.35);
   spark.age=0;spark.life=.28+Math.random()*.76;spark.size=1.6+Math.random()*3.2;spark.color=emberColors[Math.floor(Math.random()*emberColors.length)];
   const p=index*3;pointColors.set([spark.color.r,spark.color.g,spark.color.b],p);pointSizes[index]=spark.size;
  };
  for(let i=0;i<count;i++){const spark={position:new THREE.Vector3(),velocity:new THREE.Vector3(),age:0,life:1,size:2,color:hot};respawn(spark,i);spark.age=Math.random()*spark.life;sparks.push(spark);}

  const pointGeometry=new THREE.BufferGeometry();
  pointGeometry.setAttribute('position',new THREE.BufferAttribute(pointPositions,3));
  pointGeometry.setAttribute('aColor',new THREE.BufferAttribute(pointColors,3));
  pointGeometry.setAttribute('aSize',new THREE.BufferAttribute(pointSizes,1));
  pointGeometry.setAttribute('aFade',new THREE.BufferAttribute(pointFades,1));
  const points=new THREE.Points(pointGeometry,new THREE.ShaderMaterial({
   transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
   vertexShader:`attribute vec3 aColor;attribute float aSize;attribute float aFade;varying vec3 vColor;varying float vFade;void main(){vColor=aColor;vFade=aFade;vec4 mvPosition=modelViewMatrix*vec4(position,1.0);gl_Position=projectionMatrix*mvPosition;gl_PointSize=aSize;}`,
   fragmentShader:`varying vec3 vColor;varying float vFade;void main(){float r=length(gl_PointCoord-vec2(0.5))*2.0;float glow=exp(-r*5.2)*0.48;float hotCore=1.0-smoothstep(0.03,0.42,r);float alpha=max(glow,hotCore*0.95)*vFade;if(alpha<0.012)discard;gl_FragColor=vec4(vColor*(1.0+hotCore*1.25),alpha);}`
  }));artwork.add(points);

  const trailGeometry=new THREE.BufferGeometry();trailGeometry.setAttribute('position',new THREE.BufferAttribute(trailPositions,3));trailGeometry.setAttribute('color',new THREE.BufferAttribute(trailColors,3));
  const trails=new THREE.LineSegments(trailGeometry,new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:.88,depthWrite:false,blending:THREE.AdditiveBlending}));artwork.add(trails);

  const resize=()=>{const width=element.clientWidth,height=element.clientHeight;if(!width||!height)return;const aspect=width/height;camera.left=-2.1*aspect;camera.right=2.1*aspect;camera.top=2.1;camera.bottom=-2.1;camera.updateProjectionMatrix();renderer.setSize(width,height,false);};resize();
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(element);
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let visible=true,frame=0,lastTime=0,elapsed=0;
  const draw=(time=0)=>{
   frame=0;if(!visible)return;
   const delta=Math.min((time-lastTime)/1000,.035)||.016;lastTime=time;elapsed+=delta;
   const flicker=.88+Math.random()*.24;
   outerGlow.material.opacity=.48*flicker;outerGlow.scale.setScalar(1.02+.08*Math.sin(elapsed*7));
   goldGlow.scale.setScalar(.96+.13*Math.sin(elapsed*13));whiteGlow.scale.setScalar(.94+.1*Math.sin(elapsed*19));core.scale.setScalar(.92+.22*Math.sin(elapsed*27));
   flare.rotation.z=Math.sin(elapsed*17)*.035;flare.material.opacity=.76+Math.random()*.23;filament.material.opacity=.45+Math.random()*.4;
   if(!reduced){
    for(let i=0;i<count;i++){
     const spark=sparks[i];spark.age+=delta;if(spark.age>=spark.life)respawn(spark,i);
     const fade=Math.max(0,1-spark.age/spark.life),tail=i*6,point=i*3;
     spark.velocity.y-=2.35*delta;spark.position.addScaledVector(spark.velocity,delta);
     const tailX=spark.position.x-spark.velocity.x*(.035+fade*.075),tailY=spark.position.y-spark.velocity.y*(.035+fade*.075);
     pointPositions.set([spark.position.x,spark.position.y,spark.position.z],point);pointFades[i]=Math.sin((spark.age/spark.life)*Math.PI)*(.68+.32*Math.random());
     trailPositions.set([tailX,tailY,spark.position.z-.01,spark.position.x,spark.position.y,spark.position.z],tail);
     trailColors.set([spark.color.r*.55,spark.color.g*.38,spark.color.b*.22,spark.color.r,spark.color.g,spark.color.b],tail);
    }
    pointGeometry.attributes.position.needsUpdate=true;pointGeometry.attributes.aFade.needsUpdate=true;
    trailGeometry.attributes.position.needsUpdate=true;trailGeometry.attributes.color.needsUpdate=true;
   }
   renderer.render(scene,camera);
   if(!reduced)frame=requestAnimationFrame(draw);
  };
  const intersection=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??true;if(visible&&!reduced&&!frame)frame=requestAnimationFrame(draw);},{threshold:.08});intersection.observe(element);
  if(reduced){for(let i=0;i<count;i++){const spark=sparks[i];pointPositions.set([spark.position.x,spark.position.y,spark.position.z],i*3);}pointGeometry.attributes.position.needsUpdate=true;draw(0);}else frame=requestAnimationFrame(draw);
  return()=>{
   if(frame)cancelAnimationFrame(frame);intersection.disconnect();resizeObserver.disconnect();
   for(const child of artwork.children){if(child instanceof THREE.Mesh||child instanceof THREE.Line||child instanceof THREE.Points){child.geometry.dispose();const material=child.material;if(Array.isArray(material))material.forEach(m=>m.dispose());else material.dispose();}}
   glowTexture.dispose();renderer.dispose();renderer.domElement.remove();element.classList.remove('sparkler-ready');
  };
 },[]);
 return <div className="sparkler-scene" ref={host} aria-hidden="true"><svg className="sparkler-fallback" viewBox="0 0 440 300"><defs><radialGradient id="sparklerGlow"><stop stopColor="#fffce8"/><stop offset=".12" stopColor="#ffe187" stopOpacity=".9"/><stop offset=".48" stopColor="#ff9a37" stopOpacity=".25"/><stop offset="1" stopColor="#ff6b30" stopOpacity="0"/></radialGradient></defs><path d="m216 117 98 165" stroke="#282a34" strokeWidth="5"/><path d="m216 117 98 165" stroke="#ffc264" strokeWidth="1" opacity=".8"/><circle cx="216" cy="117" r="69" fill="url(#sparklerGlow)"/><g stroke="#ffe7a1" strokeLinecap="round">{Array.from({length:40},(_,i)=>{const a=i*2.39996,r=22+(i*17%47),x=216+Math.cos(a)*r,y=117+Math.sin(a)*r,len=9+(i*13%29);return <path key={i} d={`M${x} ${y} L${x+Math.cos(a)*len} ${y+Math.sin(a)*len}`} strokeWidth={i%5===0?2.6:1.2} opacity={.45+(i%5)*.1}/>})}</g><circle cx="216" cy="117" r="9" fill="#fffdf0"/><circle cx="216" cy="117" r="18" fill="#fff3c8" opacity=".58"/></svg></div>;
}
