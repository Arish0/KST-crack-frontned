import React from 'react';
import {useLanguage} from '../context/LanguageContext';
function ErrorFallback(){const {t}=useLanguage();return <main><div className="load-status error" role="alert"><span>{t('The shop could not display this page. Your saved cart is safe.')}</span><button className="button outline" onClick={()=>window.location.reload()}>{t('Reload shop')}</button></div></main>;}
export default class ErrorBoundary extends React.Component<React.PropsWithChildren>{state={failed:false};static getDerivedStateFromError(){return{failed:true};}componentDidCatch(error:Error){console.error('Storefront error:',error);}render(){return this.state.failed?<ErrorFallback/>:this.props.children;}}
