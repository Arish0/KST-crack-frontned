import type {SVGProps} from 'react';

export type IconName='search'|'pin'|'cart'|'home'|'sparkles'|'gift'|'flower'|'wheel'|'rocket'|'tag'|'list'|'chevron'|'arrow'|'check'|'play'|'pause'|'close'|'minus'|'plus';
const paths:Record<IconName,React.ReactNode>={
 search:<><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
 pin:<><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
 cart:<><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 2-1.6L22 8H6"/><circle cx="10" cy="21" r="1"/><circle cx="19" cy="21" r="1"/></>,
 home:<><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/></>,
 sparkles:<><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z"/><path d="M20 2v4m-2-2h4M3 19v3m-1.5-1.5h3"/></>,
 gift:<><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v9h14v-9M12 8v13"/><path d="M12 8H8a2.5 2.5 0 1 1 2.4-3.2L12 8Zm0 0h4a2.5 2.5 0 1 0-2.4-3.2L12 8Z"/></>,
 flower:<><path d="m6 21 2-8h8l2 8ZM8 17h8M12 3v6M5 5l3 5m11-5-3 5M2 11l5 1m15-1-5 1"/></>,
 wheel:<><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2"/><path d="m12 4 3 6m5 2-6 3m-2 5-3-6m-5-2 6-3"/></>,
 rocket:<><path d="M14 3c4-1 7-1 7-1s0 3-1 7l-9 9-5-5Z"/><circle cx="16" cy="7" r="2"/><path d="m13 4-6 1-4 4 5 1m11 1-1 6-4 4-1-5M5 16l-3 6 6-3"/></>,
 tag:<><path d="M3 3h8l10 10-8 8L3 11Z"/><circle cx="7.5" cy="7.5" r="1"/></>,
 list:<><path d="M9 5h12M9 12h12M9 19h12M3 5h1M3 12h1M3 19h1"/></>,
 chevron:<path d="m9 5 7 7-7 7"/>,
 arrow:<path d="M4 12h16m-6-6 6 6-6 6"/>,
 check:<path d="m5 12 4 4L19 6"/>,
 play:<path d="m8 4 12 8-12 8Z"/>,
 pause:<><path d="M8 4v16M16 4v16"/></>
 ,close:<path d="m6 6 12 12M18 6 6 18"/>,
 minus:<path d="M5 12h14"/>,
 plus:<path d="M12 5v14m-7-7h14"/>
};
export default function Icon({name,...props}:SVGProps<SVGSVGElement>&{name:IconName}){return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;}
