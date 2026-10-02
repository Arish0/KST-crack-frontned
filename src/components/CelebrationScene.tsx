import {useEffect,useRef} from 'react';
import * as THREE from 'three';

export default function CelebrationScene(){
  const host=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const element=host.current;if(!element)return;
    let renderer:THREE.WebGLRenderer;
    try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch{return;}
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5));
    renderer.setClearColor(0x000000,0);element.appendChild(renderer.domElement);
    const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(42,1,.1,100);camera.position.set(0,0,7);
    const group=new THREE.Group();scene.add(group);
    const colors=[0xff9900,0xffd814,0xc74634,0x2f6f5e];
    for(let i=0;i<28;i++){
      const geometry=i%3===0?new THREE.TetrahedronGeometry(.11):new THREE.SphereGeometry(.055,10,10);
      const material=new THREE.MeshBasicMaterial({color:colors[i%colors.length]});
      const spark=new THREE.Mesh(geometry,material);const angle=(i/28)*Math.PI*2,radius=1.2+(i%5)*.19;
      spark.position.set(Math.cos(angle)*radius,Math.sin(angle)*radius,(i%4)*-.18);spark.rotation.set(angle,angle/2,0);group.add(spark);
    }
    const ring=new THREE.Mesh(new THREE.TorusGeometry(1.05,.025,8,80),new THREE.MeshBasicMaterial({color:0xffb84d,transparent:true,opacity:.65}));group.add(ring);
    const resize=()=>{const width=element.clientWidth,height=element.clientHeight;renderer.setSize(width,height,false);camera.aspect=width/Math.max(height,1);camera.updateProjectionMatrix();};resize();
    const observer=new ResizeObserver(resize);observer.observe(element);
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;let frame=0;
    const draw=()=>{group.rotation.z+=reduced?0:.0025;group.rotation.y+=reduced?0:.0015;renderer.render(scene,camera);if(!reduced)frame=requestAnimationFrame(draw);};draw();
    return()=>{if(frame)cancelAnimationFrame(frame);observer.disconnect();for(const child of group.children){if(child instanceof THREE.Mesh){child.geometry.dispose();const material=child.material;if(Array.isArray(material))material.forEach(m=>m.dispose());else material.dispose();}}renderer.dispose();renderer.domElement.remove();};
  },[]);
  return <div className="three-scene" ref={host} aria-hidden="true"/>;
}
