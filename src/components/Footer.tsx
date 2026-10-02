import React from 'react';
import {useShop} from '../context/ShopContext';
export default function Footer(){const {catalog}=useShop();return <footer className="store-footer"><a className="back-top" href="#">Back to top ↑</a><div><a className="store-brand" href="/">kst<span>crackers</span></a><p>{catalog?.settings.name||'KST Crackers'}</p><p>Every celebration starts with a little sparkle.</p><small>Sample catalogue. Product artwork is illustrative. All requests require shop confirmation.</small></div></footer>;}
