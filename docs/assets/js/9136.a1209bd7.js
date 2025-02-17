"use strict";(self.webpackChunkrxdb=self.webpackChunkrxdb||[]).push([[9136],{5363:(e,n,t)=>{t.d(n,{A:()=>r});t(6540);var a=t(9136),o=t(4848);function r(e){let{children:n,fallback:t}=e;return(0,a.A)()?(0,o.jsx)(o.Fragment,{children:n?.()}):t??null}},7680:(e,n,t)=>{t.d(n,{A:()=>U});var a=t(6540),o=t(8168);const r={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"}}]},name:"right",theme:"outlined"};var i=t(6653),l=function(e,n){return a.createElement(i.A,(0,o.A)({},e,{ref:n,icon:r}))};const c=a.forwardRef(l);var s=t(6942),d=t.n(s),p=t(8339),u=t(641),m=t(2284),f=t(2533),g=t(8210),b=t(45),v=t(2546),h=t(9379),$=t(4467),x=t(8612),y=t(6928),A=a.forwardRef((function(e,n){var t=e.prefixCls,o=e.forceRender,r=e.className,i=e.style,l=e.children,c=e.isActive,s=e.role,p=e.classNames,m=e.styles,f=a.useState(c||o),g=(0,u.A)(f,2),b=g[0],v=g[1];return a.useEffect((function(){(o||c)&&v(!0)}),[o,c]),b?a.createElement("div",{ref:n,className:d()("".concat(t,"-content"),(0,$.A)((0,$.A)({},"".concat(t,"-content-active"),c),"".concat(t,"-content-inactive"),!c),r),style:i,role:s},a.createElement("div",{className:d()("".concat(t,"-content-box"),null==p?void 0:p.body),style:null==m?void 0:m.body},l)):null}));A.displayName="PanelContent";const C=A;var I=["showArrow","headerClass","isActive","onItemClick","forceRender","className","classNames","styles","prefixCls","collapsible","accordion","panelKey","extra","header","expandIcon","openMotion","destroyInactivePanel","children"];const k=a.forwardRef((function(e,n){var t=e.showArrow,r=void 0===t||t,i=e.headerClass,l=e.isActive,c=e.onItemClick,s=e.forceRender,p=e.className,u=e.classNames,m=void 0===u?{}:u,f=e.styles,g=void 0===f?{}:f,v=e.prefixCls,A=e.collapsible,k=e.accordion,N=e.panelKey,E=e.extra,O=e.header,P=e.expandIcon,w=e.openMotion,S=e.destroyInactivePanel,M=e.children,R=(0,b.A)(e,I),j="disabled"===A,z=null!=E&&"boolean"!=typeof E,B=(0,$.A)((0,$.A)((0,$.A)({onClick:function(){null==c||c(N)},onKeyDown:function(e){"Enter"!==e.key&&e.keyCode!==y.A.ENTER&&e.which!==y.A.ENTER||null==c||c(N)},role:k?"tab":"button"},"aria-expanded",l),"aria-disabled",j),"tabIndex",j?-1:0),H="function"==typeof P?P(e):a.createElement("i",{className:"arrow"}),K=H&&a.createElement("div",(0,o.A)({className:"".concat(v,"-expand-icon")},["header","icon"].includes(A)?B:{}),H),L=d()("".concat(v,"-item"),(0,$.A)((0,$.A)({},"".concat(v,"-item-active"),l),"".concat(v,"-item-disabled"),j),p),T=d()(i,"".concat(v,"-header"),(0,$.A)({},"".concat(v,"-collapsible-").concat(A),!!A),m.header),G=(0,h.A)({className:T,style:g.header},["header","icon"].includes(A)?{}:B);return a.createElement("div",(0,o.A)({},R,{ref:n,className:L}),a.createElement("div",G,r&&K,a.createElement("span",(0,o.A)({className:"".concat(v,"-header-text")},"header"===A?B:{}),O),z&&a.createElement("div",{className:"".concat(v,"-extra")},E)),a.createElement(x.Ay,(0,o.A)({visible:l,leavedClassName:"".concat(v,"-content-hidden")},w,{forceRender:s,removeOnLeave:S}),(function(e,n){var t=e.className,o=e.style;return a.createElement(C,{ref:n,prefixCls:v,className:t,classNames:m,style:o,styles:g,isActive:l,forceRender:s,role:k?"tabpanel":void 0},M)})))}));var N=["children","label","key","collapsible","onItemClick","destroyInactivePanel"];const E=function(e,n,t){return Array.isArray(e)?function(e,n){var t=n.prefixCls,r=n.accordion,i=n.collapsible,l=n.destroyInactivePanel,c=n.onItemClick,s=n.activeKey,d=n.openMotion,p=n.expandIcon;return e.map((function(e,n){var u=e.children,m=e.label,f=e.key,g=e.collapsible,v=e.onItemClick,h=e.destroyInactivePanel,$=(0,b.A)(e,N),x=String(null!=f?f:n),y=null!=g?g:i,A=null!=h?h:l,C=!1;return C=r?s[0]===x:s.indexOf(x)>-1,a.createElement(k,(0,o.A)({},$,{prefixCls:t,key:x,panelKey:x,isActive:C,accordion:r,openMotion:d,expandIcon:p,header:m,collapsible:y,onItemClick:function(e){"disabled"!==y&&(c(e),null==v||v(e))},destroyInactivePanel:A}),u)}))}(e,t):(0,v.A)(n).map((function(e,n){return function(e,n,t){if(!e)return null;var o=t.prefixCls,r=t.accordion,i=t.collapsible,l=t.destroyInactivePanel,c=t.onItemClick,s=t.activeKey,d=t.openMotion,p=t.expandIcon,u=e.key||String(n),m=e.props,f=m.header,g=m.headerClass,b=m.destroyInactivePanel,v=m.collapsible,h=m.onItemClick,$=!1;$=r?s[0]===u:s.indexOf(u)>-1;var x=null!=v?v:i,y={key:u,panelKey:u,header:f,headerClass:g,isActive:$,prefixCls:o,destroyInactivePanel:null!=b?b:l,openMotion:d,accordion:r,children:e.props.children,onItemClick:function(e){"disabled"!==x&&(c(e),null==h||h(e))},expandIcon:p,collapsible:x};return"string"==typeof e.type?e:(Object.keys(y).forEach((function(e){void 0===y[e]&&delete y[e]})),a.cloneElement(e,y))}(e,n,t)}))};var O=t(2065);function P(e){var n=e;if(!Array.isArray(n)){var t=(0,m.A)(n);n="number"===t||"string"===t?[n]:[]}return n.map((function(e){return String(e)}))}var w=a.forwardRef((function(e,n){var t=e.prefixCls,r=void 0===t?"rc-collapse":t,i=e.destroyInactivePanel,l=void 0!==i&&i,c=e.style,s=e.accordion,m=e.className,b=e.children,v=e.collapsible,h=e.openMotion,$=e.expandIcon,x=e.activeKey,y=e.defaultActiveKey,A=e.onChange,C=e.items,I=d()(r,m),k=(0,f.A)([],{value:x,onChange:function(e){return null==A?void 0:A(e)},defaultValue:y,postState:P}),N=(0,u.A)(k,2),w=N[0],S=N[1];(0,g.Ay)(!b,"[rc-collapse] `children` will be removed in next major version. Please use `items` instead.");var M=E(C,b,{prefixCls:r,accordion:s,openMotion:h,expandIcon:$,collapsible:v,destroyInactivePanel:l,onItemClick:function(e){return S((function(){return s?w[0]===e?[]:[e]:w.indexOf(e)>-1?w.filter((function(n){return n!==e})):[].concat((0,p.A)(w),[e])}))},activeKey:w});return a.createElement("div",(0,o.A)({ref:n,className:I,style:c,role:s?"tablist":void 0},(0,O.A)(e,{aria:!0,data:!0})),M)}));const S=Object.assign(w,{Panel:k}),M=S;S.Panel;var R=t(9853),j=t(3723),z=t(682),B=t(2279),H=t(829);const K=a.forwardRef(((e,n)=>{const{getPrefixCls:t}=a.useContext(B.QO),{prefixCls:o,className:r,showArrow:i=!0}=e,l=t("collapse",o),c=d()({[`${l}-no-arrow`]:!i},r);return a.createElement(M.Panel,Object.assign({ref:n},e,{prefixCls:l,className:c}))}));var L=t(7689),T=t(5905);const G=e=>({[e.componentCls]:{[`${e.antCls}-motion-collapse-legacy`]:{overflow:"hidden","&-active":{transition:`height ${e.motionDurationMid} ${e.motionEaseInOut},\n        opacity ${e.motionDurationMid} ${e.motionEaseInOut} !important`}},[`${e.antCls}-motion-collapse`]:{overflow:"hidden",transition:`height ${e.motionDurationMid} ${e.motionEaseInOut},\n        opacity ${e.motionDurationMid} ${e.motionEaseInOut} !important`}}});var D=t(7358),X=t(2180);const F=e=>{const{componentCls:n,contentBg:t,padding:a,headerBg:o,headerPadding:r,collapseHeaderPaddingSM:i,collapseHeaderPaddingLG:l,collapsePanelBorderRadius:c,lineWidth:s,lineType:d,colorBorder:p,colorText:u,colorTextHeading:m,colorTextDisabled:f,fontSizeLG:g,lineHeight:b,lineHeightLG:v,marginSM:h,paddingSM:$,paddingLG:x,paddingXS:y,motionDurationSlow:A,fontSizeIcon:C,contentPadding:I,fontHeight:k,fontHeightLG:N}=e,E=`${(0,L.zA)(s)} ${d} ${p}`;return{[n]:Object.assign(Object.assign({},(0,T.dF)(e)),{backgroundColor:o,border:E,borderRadius:c,"&-rtl":{direction:"rtl"},[`& > ${n}-item`]:{borderBottom:E,"&:first-child":{[`\n            &,\n            & > ${n}-header`]:{borderRadius:`${(0,L.zA)(c)} ${(0,L.zA)(c)} 0 0`}},"&:last-child":{[`\n            &,\n            & > ${n}-header`]:{borderRadius:`0 0 ${(0,L.zA)(c)} ${(0,L.zA)(c)}`}},[`> ${n}-header`]:Object.assign(Object.assign({position:"relative",display:"flex",flexWrap:"nowrap",alignItems:"flex-start",padding:r,color:m,lineHeight:b,cursor:"pointer",transition:`all ${A}, visibility 0s`},(0,T.K8)(e)),{[`> ${n}-header-text`]:{flex:"auto"},[`${n}-expand-icon`]:{height:k,display:"flex",alignItems:"center",paddingInlineEnd:h},[`${n}-arrow`]:Object.assign(Object.assign({},(0,T.Nk)()),{fontSize:C,transition:`transform ${A}`,svg:{transition:`transform ${A}`}}),[`${n}-header-text`]:{marginInlineEnd:"auto"}}),[`${n}-collapsible-header`]:{cursor:"default",[`${n}-header-text`]:{flex:"none",cursor:"pointer"}},[`${n}-collapsible-icon`]:{cursor:"unset",[`${n}-expand-icon`]:{cursor:"pointer"}}},[`${n}-content`]:{color:u,backgroundColor:t,borderTop:E,[`& > ${n}-content-box`]:{padding:I},"&-hidden":{display:"none"}},"&-small":{[`> ${n}-item`]:{[`> ${n}-header`]:{padding:i,paddingInlineStart:y,[`> ${n}-expand-icon`]:{marginInlineStart:e.calc($).sub(y).equal()}},[`> ${n}-content > ${n}-content-box`]:{padding:$}}},"&-large":{[`> ${n}-item`]:{fontSize:g,lineHeight:v,[`> ${n}-header`]:{padding:l,paddingInlineStart:a,[`> ${n}-expand-icon`]:{height:N,marginInlineStart:e.calc(x).sub(a).equal()}},[`> ${n}-content > ${n}-content-box`]:{padding:x}}},[`${n}-item:last-child`]:{borderBottom:0,[`> ${n}-content`]:{borderRadius:`0 0 ${(0,L.zA)(c)} ${(0,L.zA)(c)}`}},[`& ${n}-item-disabled > ${n}-header`]:{"\n          &,\n          & > .arrow\n        ":{color:f,cursor:"not-allowed"}},[`&${n}-icon-position-end`]:{[`& > ${n}-item`]:{[`> ${n}-header`]:{[`${n}-expand-icon`]:{order:1,paddingInlineEnd:0,paddingInlineStart:h}}}}})}},q=e=>{const{componentCls:n}=e,t=`> ${n}-item > ${n}-header ${n}-arrow`;return{[`${n}-rtl`]:{[t]:{transform:"rotate(180deg)"}}}},Q=e=>{const{componentCls:n,headerBg:t,paddingXXS:a,colorBorder:o}=e;return{[`${n}-borderless`]:{backgroundColor:t,border:0,[`> ${n}-item`]:{borderBottom:`1px solid ${o}`},[`\n        > ${n}-item:last-child,\n        > ${n}-item:last-child ${n}-header\n      `]:{borderRadius:0},[`> ${n}-item:last-child`]:{borderBottom:0},[`> ${n}-item > ${n}-content`]:{backgroundColor:"transparent",borderTop:0},[`> ${n}-item > ${n}-content > ${n}-content-box`]:{paddingTop:a}}}},V=e=>{const{componentCls:n,paddingSM:t}=e;return{[`${n}-ghost`]:{backgroundColor:"transparent",border:0,[`> ${n}-item`]:{borderBottom:0,[`> ${n}-content`]:{backgroundColor:"transparent",border:0,[`> ${n}-content-box`]:{paddingBlock:t}}}}}},W=(0,D.OF)("Collapse",(e=>{const n=(0,X.oX)(e,{collapseHeaderPaddingSM:`${(0,L.zA)(e.paddingXS)} ${(0,L.zA)(e.paddingSM)}`,collapseHeaderPaddingLG:`${(0,L.zA)(e.padding)} ${(0,L.zA)(e.paddingLG)}`,collapsePanelBorderRadius:e.borderRadiusLG});return[F(n),Q(n),V(n),q(n),G(n)]}),(e=>({headerPadding:`${e.paddingSM}px ${e.padding}px`,headerBg:e.colorFillAlter,contentPadding:`${e.padding}px 16px`,contentBg:e.colorBgContainer}))),J=a.forwardRef(((e,n)=>{const{getPrefixCls:t,direction:o,collapse:r}=a.useContext(B.QO),{prefixCls:i,className:l,rootClassName:s,style:p,bordered:u=!0,ghost:m,size:f,expandIconPosition:g="start",children:b,expandIcon:h}=e,$=(0,H.A)((e=>{var n;return null!==(n=null!=f?f:e)&&void 0!==n?n:"middle"})),x=t("collapse",i),y=t(),[A,C,I]=W(x);const k=a.useMemo((()=>"left"===g?"start":"right"===g?"end":g),[g]),N=null!=h?h:null==r?void 0:r.expandIcon,E=a.useCallback((function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const n="function"==typeof N?N(e):a.createElement(c,{rotate:e.isActive?"rtl"===o?-90:90:void 0,"aria-label":e.isActive?"expanded":"collapsed"});return(0,z.Ob)(n,(()=>{var e;return{className:d()(null===(e=null==n?void 0:n.props)||void 0===e?void 0:e.className,`${x}-arrow`)}}))}),[N,x]),O=d()(`${x}-icon-position-${k}`,{[`${x}-borderless`]:!u,[`${x}-rtl`]:"rtl"===o,[`${x}-ghost`]:!!m,[`${x}-${$}`]:"middle"!==$},null==r?void 0:r.className,l,s,C,I),P=Object.assign(Object.assign({},(0,j.A)(y)),{motionAppear:!1,leavedClassName:`${x}-content-hidden`}),w=a.useMemo((()=>b?(0,v.A)(b).map(((e,n)=>{var t,a;const o=e.props;if(null==o?void 0:o.disabled){const r=null!==(t=e.key)&&void 0!==t?t:String(n),i=Object.assign(Object.assign({},(0,R.A)(e.props,["disabled"])),{key:r,collapsible:null!==(a=o.collapsible)&&void 0!==a?a:"disabled"});return(0,z.Ob)(e,i)}return e})):null),[b]);return A(a.createElement(M,Object.assign({ref:n,openMotion:P},(0,R.A)(e,["rootClassName"]),{expandIcon:E,prefixCls:x,className:O,style:Object.assign(Object.assign({},null==r?void 0:r.style),p)}),w))}));const U=Object.assign(J,{Panel:K})}}]);