import React from 'react';
export default function LoadingGrid(){return <div className="product-grid" aria-label="Loading products">{Array.from({length:4},(_,i)=><div key={i} className="skeleton-card" aria-hidden="true"><div className="skeleton image"/><div className="skeleton line"/><div className="skeleton line short"/></div>)}</div>;}
