(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{9536:function(e,n,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return t(4552)}])},1528:function(e,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.getDomainLocale=function(e,n,t,r){return!1};("function"===typeof n.default||"object"===typeof n.default&&null!==n.default)&&"undefined"===typeof n.default.__esModule&&(Object.defineProperty(n.default,"__esModule",{value:!0}),Object.assign(n.default,n),e.exports=n.default)},1453:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=t(9854).Z;t(2271).default;Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var o=t(2619).Z,u=t(518).Z,i=o(t(7378)),a=t(194),c=t(4087),f=t(9756),l=t(7868),s=t(1842),d=t(1528),p=t(1470),v={};function h(e,n,t,r){if(e&&a.isLocalURL(n)){Promise.resolve(e.prefetch(n,t,r)).catch((function(e){0}));var o=r&&"undefined"!==typeof r.locale?r.locale:e&&e.locale;v[n+"%"+t+(o?"%"+o:"")]=!0}}var m=i.default.forwardRef((function(e,n){var t,o=e.href,m=e.as,g=e.children,x=e.prefetch,y=e.passHref,b=e.replace,j=e.shallow,_=e.scroll,C=e.locale,k=e.onClick,Z=e.onMouseEnter,w=e.onTouchStart,P=e.legacyBehavior,M=void 0===P?!0!==Boolean(!1):P,L=u(e,["href","as","children","prefetch","passHref","replace","shallow","scroll","locale","onClick","onMouseEnter","onTouchStart","legacyBehavior"]);t=g,!M||"string"!==typeof t&&"number"!==typeof t||(t=i.default.createElement("a",null,t));var O=!1!==x,E=i.default.useContext(f.RouterContext),R=i.default.useContext(l.AppRouterContext);R&&(E=R);var T,S=i.default.useMemo((function(){var e=r(a.resolveHref(E,o,!0),2),n=e[0],t=e[1];return{href:n,as:m?a.resolveHref(E,m):t||n}}),[E,o,m]),z=S.href,I=S.as,N=i.default.useRef(z),A=i.default.useRef(I);M&&(T=i.default.Children.only(t));var B=M?T&&"object"===typeof T&&T.ref:n,U=r(s.useIntersection({rootMargin:"200px"}),3),H=U[0],D=U[1],K=U[2],G=i.default.useCallback((function(e){A.current===I&&N.current===z||(K(),A.current=I,N.current=z),H(e),B&&("function"===typeof B?B(e):"object"===typeof B&&(B.current=e))}),[I,B,z,K,H]);i.default.useEffect((function(){var e=D&&O&&a.isLocalURL(z),n="undefined"!==typeof C?C:E&&E.locale,t=v[z+"%"+I+(n?"%"+n:"")];e&&!t&&h(E,z,I,{locale:n})}),[I,z,D,C,O,E]);var X={ref:G,onClick:function(e){M||"function"!==typeof k||k(e),M&&T.props&&"function"===typeof T.props.onClick&&T.props.onClick(e),e.defaultPrevented||function(e,n,t,r,o,u,c,f,l,s){if("A"!==e.currentTarget.nodeName.toUpperCase()||!function(e){var n=e.currentTarget.target;return n&&"_self"!==n||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.nativeEvent&&2===e.nativeEvent.which}(e)&&a.isLocalURL(t)){e.preventDefault();var d=function(){"beforePopState"in n?n[o?"replace":"push"](t,r,{shallow:u,locale:f,scroll:c}):n[o?"replace":"push"](t,{forceOptimisticNavigation:!s})};l?i.default.startTransition(d):d()}}(e,E,z,I,b,j,_,C,Boolean(R),O)},onMouseEnter:function(e){M||"function"!==typeof Z||Z(e),M&&T.props&&"function"===typeof T.props.onMouseEnter&&T.props.onMouseEnter(e),!O&&R||a.isLocalURL(z)&&h(E,z,I,{priority:!0})},onTouchStart:function(e){M||"function"!==typeof w||w(e),M&&T.props&&"function"===typeof T.props.onTouchStart&&T.props.onTouchStart(e),!O&&R||a.isLocalURL(z)&&h(E,z,I,{priority:!0})}};if(!M||y||"a"===T.type&&!("href"in T.props)){var q="undefined"!==typeof C?C:E&&E.locale,F=E&&E.isLocaleDomain&&d.getDomainLocale(I,q,E.locales,E.domainLocales);X.href=F||p.addBasePath(c.addLocale(I,q,E&&E.defaultLocale))}return M?i.default.cloneElement(T,X):i.default.createElement("a",Object.assign({},L,X),t)}));n.default=m,("function"===typeof n.default||"object"===typeof n.default&&null!==n.default)&&"undefined"===typeof n.default.__esModule&&(Object.defineProperty(n.default,"__esModule",{value:!0}),Object.assign(n.default,n),e.exports=n.default)},1842:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=t(9854).Z;Object.defineProperty(n,"__esModule",{value:!0}),n.useIntersection=function(e){var n=e.rootRef,t=e.rootMargin,f=e.disabled||!i,l=r(o.useState(!1),2),s=l[0],d=l[1],p=r(o.useState(null),2),v=p[0],h=p[1];o.useEffect((function(){if(i){if(f||s)return;if(v&&v.tagName){var e=function(e,n,t){var r=function(e){var n,t={root:e.root||null,margin:e.rootMargin||""},r=c.find((function(e){return e.root===t.root&&e.margin===t.margin}));if(r&&(n=a.get(r)))return n;var o=new Map,u=new IntersectionObserver((function(e){e.forEach((function(e){var n=o.get(e.target),t=e.isIntersecting||e.intersectionRatio>0;n&&t&&n(t)}))}),e);return n={id:t,observer:u,elements:o},c.push(t),a.set(t,n),n}(t),o=r.id,u=r.observer,i=r.elements;return i.set(e,n),u.observe(e),function(){if(i.delete(e),u.unobserve(e),0===i.size){u.disconnect(),a.delete(o);var n=c.findIndex((function(e){return e.root===o.root&&e.margin===o.margin}));n>-1&&c.splice(n,1)}}}(v,(function(e){return e&&d(e)}),{root:null==n?void 0:n.current,rootMargin:t});return e}}else if(!s){var r=u.requestIdleCallback((function(){return d(!0)}));return function(){return u.cancelIdleCallback(r)}}}),[v,f,t,n,s]);var m=o.useCallback((function(){d(!1)}),[]);return[h,s,m]};var o=t(7378),u=t(2878),i="function"===typeof IntersectionObserver,a=new Map,c=[];("function"===typeof n.default||"object"===typeof n.default&&null!==n.default)&&"undefined"===typeof n.default.__esModule&&(Object.defineProperty(n.default,"__esModule",{value:!0}),Object.assign(n.default,n),e.exports=n.default)},7868:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.TemplateContext=n.GlobalLayoutRouterContext=n.LayoutRouterContext=n.AppRouterContext=void 0;var r=(0,t(2619).Z)(t(7378)),o=r.default.createContext(null);n.AppRouterContext=o;var u=r.default.createContext(null);n.LayoutRouterContext=u;var i=r.default.createContext(null);n.GlobalLayoutRouterContext=i;var a=r.default.createContext(null);n.TemplateContext=a},4552:function(e,n,t){"use strict";t.r(n),t.d(n,{__N_SSG:function(){return z},default:function(){return I}});var r=t(9989),o=t(4246),u=t(7378),i=t(8228),a=t(1724),c=t(8394),f=t(7028);function l(){var e=(0,r.Z)(["\n  background: ",";\n  color: ",";\n  min-height: 70%;\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-direction: column;\n"]);return l=function(){return e},e}function s(){var e=(0,r.Z)(["\n  position: absolute;\n  left: 0;\n  top: 0;\n  bottom: 0;\n  right: 0;\n  background-size: cover;\n  background-position: center;\n  opacity: 0.2;\n  ","\n"]);return s=function(){return e},e}function d(){var e=(0,r.Z)(["\n  z-index: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-direction: column;\n"]);return d=function(){return e},e}var p=i.ZP.div(l(),(function(e){return e.theme.colors.background}),(function(e){return e.theme.colors.foreground})),v=i.ZP.div(s(),(function(e){var n=e.image;return n?"background-image: url(".concat(n,");"):""})),h=i.ZP.div(d()),m=function(e){var n=e.background,t=e.children,r=(0,u.useMemo)((function(){return(0,c.j)({})}),[]);return(0,o.jsx)(f.f,{theme:r,children:(0,o.jsxs)(p,{children:[(0,o.jsx)(v,{image:n}),(0,o.jsx)(h,{children:t})]})})},g=t(9894),x=t.n(g);function y(){var e=(0,r.Z)(["\n  height: 300px;\n  width: 300px;\n  position: relative;\n  margin: 10px;\n"]);return y=function(){return e},e}function b(){var e=(0,r.Z)(["\n  background: ",";\n  padding: 5px 0;\n  line-height: 40px;\n"]);return b=function(){return e},e}function j(){var e=(0,r.Z)(["\n  position: absolute;\n  top: 0;\n  left: 10px;\n"]);return j=function(){return e},e}function _(){var e=(0,r.Z)(["\n  background: ",";\n  background-size: cover;\n  background-position: center;\n  ","\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  right: 0;\n  left: 0;\n}\n"]);return _=function(){return e},e}var C=i.ZP.div(y()),k=(0,i.ZP)(a.wo)(b(),(function(e){return e.theme.colors.primary})),Z=i.ZP.div(j()),w=i.ZP.aside(_(),(function(e){return e.theme.colors.primary}),(function(e){var n=e.image;return n?"background-image: url(".concat(n,");"):""})),P=function(e){var n=e.article;return(0,o.jsx)(x(),{href:"/articles/".concat(n.meta.slug),children:(0,o.jsxs)(C,{children:[(0,o.jsx)(w,{image:n.cover}),(0,o.jsx)(Z,{children:(0,o.jsx)(k,{children:n.title})})]})})};function M(){var e=(0,r.Z)(["\n  display: flex;\n  flex-wrap: wrap;\n"]);return M=function(){return e},e}function L(){var e=(0,r.Z)(["\n  font-size: 60px;\n  line-height: 80px;\n  display: inline-block;\n  background: ",";\n  color: ",";\n  padding: 0 15px;\n  text-transform: uppercase;\n  margin: 10px;\n  box-shadow: 0 0 20px ",";\n\n  @media only screen and (max-width: 700px) {\n    margin: 5px;\n    font-size: 2rem;\n    line-height: 2.1rem;\n  }\n"]);return L=function(){return e},e}function O(){var e=(0,r.Z)(["\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  margin: 0 auto;\n  align-items: center;\n  justify-content: center;\n"]);return O=function(){return e},e}var E=t(5827),R=i.ZP.div(M()),T=(0,i.ZP)(a.bn)(L(),(function(e){return e.theme.colors.primary}),(function(e){return e.theme.colors.foreground}),(function(e){return e.theme.colors.background})),S=i.ZP.div(O()),z=!0,I=function(e){var n=e.articles;return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(m,{background:E,children:[(0,o.jsx)(R,{children:"Hi, I'm Morten".split(" ").map((function(e,n){return(0,o.jsx)(T,{children:e},n)}))}),(0,o.jsx)(R,{children:"And I make software".split(" ").map((function(e,n){return(0,o.jsx)(T,{children:e},n)}))})]}),(0,o.jsxs)(m,{children:[(0,o.jsx)("h2",{children:"Articles"}),(0,o.jsx)(S,{children:n.map((function(e){return(0,o.jsx)(P,{article:e},e.title)}))})]})]})}},1724:function(e,n,t){"use strict";t.d(n,{Lh:function(){return d},bn:function(){return l},wo:function(){return s}});var r=t(9989),o=t(8228);function u(){var e=(0,r.Z)(["\n  ","\n  color: ",";\n  font-weight: ",";\n  font-size: ","px;\n"]);return u=function(){return e},e}function i(){var e=(0,r.Z)(["\n    font-size: ","px;\n    font-weight: ",";\n    ","\n  "]);return i=function(){return e},e}var a=o.ZP.span(u(),(function(e){var n=e.theme;return n.font.family?"font-family: ".concat(n.font.family,";"):""}),(function(e){var n=e.color,t=e.theme;return n?t.colors[n]:t.colors.foreground}),(function(e){return e.bold?"bold":"normal"}),(function(e){return e.theme.font.baseSize})),c=function(e,n){return n.typography[e]},f=function(e){return(0,o.ZP)(a)(i(),(function(n){var t=n.theme;return t.font.baseSize*(c(e,t).size||1)}),(function(n){var t=n.bold,r=n.theme;return"undefined"!==typeof t?"bold":c(e,r).weight||"normal"}),(function(n){var t=n.theme;return c(e,t).upperCase?"text-transform: uppercase;":""}))},l=f("Jumbo"),s=(f("Title2"),f("Title1")),d=(f("Body1"),f("Overline"));f("Caption"),f("Link")},9894:function(e,n,t){e.exports=t(1453)},5827:function(e){e.exports="/_next/static/images/cover-830bc1104f32333fe5627458f3f95ed3.png"}},function(e){e.O(0,[774,888,179],(function(){return n=9536,e(e.s=n);var n}));var n=e.O();_N_E=n}]);