import {useEffect,useRef} from 'react';
import * as THREE from 'three';

type Orbiter={phase:number;speed:number;radiusX:number;radiusY:number;tilt:number;depth:number;size:number;twinkle:number;color:THREE.Color};

/** Small additive particles orbit the product in a slowly turning 3D ellipse. */
export default function OrbitSparkles(){
 const host=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const element=host.current;if(!element)return;
  let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:false,powerPreference:'low-power'});}catch{return;}
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.25));renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;element.appendChild(renderer.domElement);

  const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-3,3,2.25,-2.25,.1,30);camera.position.z=12;
  const count=34,positions=new Float32Array(count*3),colors=new Float32Array(count*3),sizes=new Float32Array(count),alphas=new Float32Array(count),particles:Orbiter[]=[];
  const palette=[0xffdc86,0xffb849,0xfff3cd,0xff934c];
  for(let i=0;i<count;i++){
   const tint=new THREE.Color(palette[i%palette.length]);
   particles.push({phase:Math.random()*Math.PI*2,speed:.2+Math.random()*.42,radiusX:1.45+Math.random()*1.65,radiusY:.55+Math.random()*1.1,tilt:Math.random()*.32,depth:.65+Math.random()*.75,size:3+Math.random()*6,twinkle:2+Math.random()*4,color:tint});
   colors.set([tint.r,tint.g,tint.b],i*3);sizes[i]=particles[i].size;
  }
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setAttribute('aColor',new THREE.BufferAttribute(colors,3));geometry.setAttribute('aSize',new THREE.BufferAttribute(sizes,1));geometry.setAttribute('aAlpha',new THREE.BufferAttribute(alphas,1));
  const material=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,vertexShader:`attribute vec3 aColor;attribute float aSize;attribute float aAlpha;varying vec3 vColor;varying float vAlpha;void main(){vColor=aColor;vAlpha=aAlpha;vec4 mvPosition=modelViewMatrix*vec4(position,1.0);gl_Position=projectionMatrix*mvPosition;gl_PointSize=aSize*min(1.7,12.0/max(1.0,-mvPosition.z));}`,fragmentShader:`varying vec3 vColor;varying float vAlpha;void main(){float d=length(gl_PointCoord-vec2(.5));float glow=exp(-d*12.0)*.52+exp(-d*42.0)*.9;gl_FragColor=vec4(vColor,glow*vAlpha);}`});
  const points=new THREE.Points(geometry,material);scene.add(points);
  const resize=()=>{const width=Math.max(element.clientWidth,1),height=Math.max(element.clientHeight,1),halfHeight=2.25,halfWidth=halfHeight*width/height;camera.left=-halfWidth;camera.right=halfWidth;camera.top=halfHeight;camera.bottom=-halfHeight;camera.updateProjectionMatrix();renderer.setSize(width,height,false);};
  resize();const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(element);
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;let visible=false,frame=0,start=performance.now();
  const draw=(now:number)=>{
   const time=(now-start)/1000,yaw=time*.32;
   for(let i=0;i<count;i++){
    const p=particles[i],angle=p.phase+time*p.speed,orbitalX=Math.cos(angle)*p.radiusX;
    positions[i*3]=orbitalX*Math.cos(yaw+p.tilt);positions[i*3+1]=.18+Math.sin(angle)*p.radiusY;positions[i*3+2]=p.depth+orbitalX*Math.sin(yaw+p.tilt);
    alphas[i]=.22+.62*(.5+.5*Math.sin(time*p.twinkle+p.phase));
   }
   geometry.attributes.position.needsUpdate=true;geometry.attributes.aAlpha.needsUpdate=true;renderer.render(scene,camera);
   if(visible&&!reduced)frame=requestAnimationFrame(draw);
  };
  const intersection=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;if(visible&&!reduced&&!frame)frame=requestAnimationFrame(draw);if(!visible&&frame){cancelAnimationFrame(frame);frame=0;}},{threshold:.05});intersection.observe(element);
  draw(start);
  return()=>{if(frame)cancelAnimationFrame(frame);intersection.disconnect();resizeObserver.disconnect();geometry.dispose();material.dispose();renderer.dispose();renderer.domElement.remove();};
 },[]);
 return <div className="orbiting-sparkles" ref={host} aria-hidden="true"/>;
}
