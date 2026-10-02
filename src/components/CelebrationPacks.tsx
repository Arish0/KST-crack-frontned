export default function CelebrationPacks({discount}:{discount:number}){
 return <div className="celebration-packs" aria-label={discount>0?`Save up to ${discount}% on selected crackers`:'KST celebration packs'}>
  <div className="celebration-pack pack-navy"><span>✦</span><strong>KST</strong><small>CELEBRATE TOGETHER</small></div>
  <div className="celebration-pack pack-coral"><span>✳</span><strong>FESTIVAL</strong><small>A LITTLE MAGIC</small></div>
  {discount>0&&<div className="celebration-saving"><small>SAVE UP TO</small><strong>{discount}%</strong><span>on selected crackers</span></div>}
  <span className="pack-spark spark-one">✦</span><span className="pack-spark spark-two">✦</span><span className="pack-spark spark-three">●</span>
 </div>;
}
