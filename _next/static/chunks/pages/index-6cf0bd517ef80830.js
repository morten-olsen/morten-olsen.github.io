(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{1615:function(e,n,i){"use strict";i.d(n,{V:function(){return t}});var t=i(7379).ZP.div.withConfig({displayName:"content__Content",componentId:"sc-1przdw9-0"})(["width:100%;max-width:800px;padding:0 30px;margin:auto;"])},4573:function(e,n,i){"use strict";i.r(n),i.d(n,{__N_SSG:function(){return de},default:function(){return pe}});var t=i(9008),r=i(7294),o=i(1615),a=i(4425),s=i(7379),c=i(9499),d=i(4730),p=i(6513),l=i(5417),f=i(2640),h=i(5893),m=["children"];function u(e,n){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),i.push.apply(i,t)}return i}function x(e){for(var n=1;n<arguments.length;n++){var i=null!=arguments[n]?arguments[n]:{};n%2?u(Object(i),!0).forEach((function(n){(0,c.Z)(e,n,i[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):u(Object(i)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(i,n))}))}return e}var g=function(e){var n=e.children,i=(0,d.Z)(e,m),t=(0,r.useRef)(),o=(0,p._)(),a=function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"0px",i=(0,r.useState)(!1),t=i[0],o=i[1];return(0,r.useEffect)((function(){var i=e.current,t=new IntersectionObserver((function(e){var n=(0,f.Z)(e,1)[0];o(n.isIntersecting)}),{rootMargin:n});return i&&t.observe(i),function(){i&&t.unobserve(i)}}),[e]),t}(t),s=(0,r.useMemo)((function(){return 1}),[]);return(0,r.useEffect)((function(){a&&o.start({y:0,opacity:1,scale:1,transition:{duration:s,ease:"easeOut"}})}),[o,a]),(0,h.jsx)(l.E.div,x(x({},i),{},{ref:t,initial:{y:50,opacity:0,scale:1.3},animate:o,children:n}))},w=s.ZP.div.withConfig({displayName:"experiences__OuterOuter",componentId:"sc-1evy0ik-0"})(["margin-top:100px;"]),j=s.ZP.div.withConfig({displayName:"experiences__Wrapper",componentId:"sc-1evy0ik-1"})(["margin-bottom:50px;"]),y=s.ZP.div.withConfig({displayName:"experiences__Outer",componentId:"sc-1evy0ik-2"})(["position:relative;"]),_=s.ZP.div.withConfig({displayName:"experiences__ExperienceWrapper",componentId:"sc-1evy0ik-3"})(["margin-left:20px;padding:20px 40px;border-left:solid 1px #eee;&::after{content:'';position:absolute;width:10px;height:10px;background:#ccc;border-radius:50%;top:50%;left:15px;translate:transformY(-50%);}line-height:1.8rem;letter-spacing:0.5px;p + p:first-letter{padding-left:20px;}"]),v=(0,s.ZP)(g).withConfig({displayName:"experiences__Inner",componentId:"sc-1evy0ik-4"})(["border:solid 1px #eee;padding:20px;"]),b=s.ZP.h5.withConfig({displayName:"experiences__CompanyName",componentId:"sc-1evy0ik-5"})([""]),P=s.ZP.h4.withConfig({displayName:"experiences__JobTitle",componentId:"sc-1evy0ik-6"})(["font-size:1.3rem;"]),C=s.ZP.div.withConfig({displayName:"experiences__Time",componentId:"sc-1evy0ik-7"})(["font-size:0.8rem;"]),I=s.ZP.h2.withConfig({displayName:"experiences__Title",componentId:"sc-1evy0ik-8"})(["margin:2rem 0;text-align:center;"]),N=s.ZP.div.withConfig({displayName:"experiences__More",componentId:"sc-1evy0ik-9"})(["color:#3498db;cursor:pointer;font-size:0.8rem;margin-top:10px;"]),k=s.ZP.div.withConfig({displayName:"experiences__Hidden",componentId:"sc-1evy0ik-10"})(["overflow:hidden;transition:all 0.3s ease-out;"]),Z=function(e){var n=e.experience,i=(0,r.useState)(!1),t=i[0],o=i[1];return(0,h.jsx)(y,{children:(0,h.jsx)(_,{children:(0,h.jsxs)(v,{children:[(0,h.jsx)(b,{children:n.company.name}),(0,h.jsx)(P,{children:n.title}),(0,h.jsxs)(C,{children:[n.startDate," - ",n.endDate]}),(0,h.jsx)(k,{style:{maxHeight:t?1e3:0,opacity:t?1:0},children:(0,h.jsx)(a.D,{children:n.content})}),(0,h.jsxs)(N,{onClick:function(){return o(!t)},children:["Show ",t?"less":"more"]})]})})})},O=function(e){var n=e.experiences;return(0,h.jsx)(w,{children:(0,h.jsxs)(j,{children:[(0,h.jsx)(I,{children:"Experiences"}),n.map((function(e){return(0,h.jsx)(Z,{experience:e},e.id)}))]})})},z=s.ZP.div.withConfig({displayName:"featured__Wrapper",componentId:"sc-17h7y68-0"})([""]),q=s.ZP.h2.withConfig({displayName:"featured__Title",componentId:"sc-17h7y68-1"})(["margin:2rem 0;text-align:center;"]),E=s.ZP.div.withConfig({displayName:"featured__Items",componentId:"sc-17h7y68-2"})(["display:flex;flex-wrap:wrap;&> *{border:solid 1px #efefef;max-width:calc(50% - 20px);min-width:calc(300px);margin:10px;}"]),S=function(e){var n=e.title,i=e.children;return(0,h.jsxs)(z,{children:[(0,h.jsx)(q,{children:n}),(0,h.jsx)(E,{children:i})]})},M=i(6447),W=i(9477),T=i(9845),D=i(5550).default,L=s.ZP.div.withConfig({displayName:"background__Wrapper",componentId:"sc-18g26hy-0"})(["position:absolute;left:0;right:0;top:0;bottom:0;z-index:-1;"]),V=function(){var e=r.useState(new W.Clock),n=(0,f.Z)(e,1)[0],i=r.useState(10),t=(0,f.Z)(i,1)[0];return(0,M.xQ)((function(e){e.ready=!1;var i=1e3/t-n.getDelta();setTimeout((function(){e.ready=!0,e.invalidate()}),Math.max(0,i))})),(0,h.jsx)(h.Fragment,{})},H=function(e){var n=e.texture,i=(0,r.useRef)(),t=window.innerWidth/2,o=window.innerHeight/2;return(0,M.xQ)((function(){i.current&&(i.current.rotation.z-=.003)})),(0,h.jsxs)("mesh",{ref:i,rotation:new W.Euler(1.16,-.12,Math.random()*Math.PI*2),position:new W.Vector3(Math.random()*t-t/2,500,Math.random()*o-o/2),children:[(0,h.jsx)("planeBufferGeometry",{args:[500,500]}),(0,h.jsx)("meshLambertMaterial",{opacity:.55,args:[{map:n,transparent:!0}]})]})},F=function(){var e=(0,M.U2)(T.d,D),n=(0,r.useMemo)((function(){return new Array(30).fill(void 0)}),[]);return(0,h.jsx)(h.Fragment,{children:n.map((function(n,i){return(0,h.jsx)(H,{texture:e},i)}))})},X=function(){return(0,h.jsxs)(M.Xz,{onCreated:function(e){e.gl.setClearColor("#f0f0f0")},gl:{antialias:!1},camera:{fov:60,aspect:1,near:1,far:1e3,position:[0,0,1],rotation:[1.16,-.12,.27]},children:[(0,h.jsx)(V,{}),(0,h.jsxs)("scene",{children:[(0,h.jsx)("perspectiveCamera",{args:[60,window.innerWidth/window.innerHeight,1,1e3],position:new W.Vector3(0,0,1),rotation:new W.Euler(1.16,-.12,.27)}),(0,h.jsx)("ambientLight",{args:[5592405]}),(0,h.jsx)("fogExp2",{args:[218190,.001]}),(0,h.jsx)("directionalLight",{args:[16747545],position:new W.Vector3(0,0,1)}),(0,h.jsx)("pointLight",{args:[13395456,50,450,1.7],position:new W.Vector3(200,300,100)}),(0,h.jsx)("pointLight",{args:[14177406,50,450,1.7],position:new W.Vector3(100,300,100)}),(0,h.jsx)("pointLight",{args:[3569580,50,450,1.7],position:new W.Vector3(300,300,200)}),(0,h.jsx)(r.Suspense,{fallback:null,children:(0,h.jsx)(F,{})})]})]})},A=function(){return(0,h.jsx)(L,{suppressHydrationWarning:!0,children:(0,h.jsx)(X,{})})},G=s.ZP.div.withConfig({displayName:"hero__Wrapper",componentId:"sc-qshhjz-0"})(["position:relative;min-height:900px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:30px;"]),Q=s.ZP.div.withConfig({displayName:"hero__Avatar",componentId:"sc-qshhjz-1"})(["background-image:url('","');max-width:400px;width:100%;border-radius:50%;background-size:cover;border:solid 5px #f0f0f0;box-shadow:0 0 15px rgba(0,0,0,0.5);transform:scaleX(-1);margin-bottom:-30px;"],(function(e){return e.src})),R=s.ZP.div.withConfig({displayName:"hero__AvatarSpacer",componentId:"sc-qshhjz-2"})(["padding-bottom:100%;"]),Y=s.ZP.h1.withConfig({displayName:"hero__Name",componentId:"sc-qshhjz-3"})(['background:#000;font-size:3rem;line-height:4rem;font-weight:400;font-family:"Pacifico";color:#fff;margin:0;padding:10px;text-shadow:0 0 15px rgba(0,0,0,0.5);text-align:center;transform:rotate(-3deg);']),B=s.ZP.h2.withConfig({displayName:"hero__Tagline",componentId:"sc-qshhjz-4"})(['display:block;background:#f0f0f0;font-size:1.5rem;font-weight:100;font-family:"Pacifico";font-family:"Fredoka";color:#000;padding:5px;margin:0;text-align:center;border:solid 1px #000;transform:translateY(-5px) rotate(2deg);']),J=s.ZP.div.withConfig({displayName:"hero__Social",componentId:"sc-qshhjz-5"})(["margin-top:40px;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;"]),U=s.ZP.a.withConfig({displayName:"hero__SocialItem",componentId:"sc-qshhjz-6"})(["display:flex;align-items:center;justify-content:center;padding:20px;color:#000;"]),K=s.ZP.div.withConfig({displayName:"hero__SocialText",componentId:"sc-qshhjz-7"})(['margin-left:20px;font-family:"Fredoka";']),$=s.ZP.div.withConfig({displayName:"hero__SocialLogo",componentId:"sc-qshhjz-8"})(["background-image:url('","');width:50px;height:50px;background-size:cover;"],(function(e){return e.src})),ee=function(e){var n=e.profile;return(0,h.jsxs)(G,{children:[(0,h.jsx)(Q,{src:n.avatar,children:(0,h.jsx)(R,{})}),(0,h.jsx)(Y,{children:n.name}),(0,h.jsx)(B,{children:n.tagline}),(0,h.jsx)(J,{children:n.social.map((function(e){return(0,h.jsx)(g,{children:(0,h.jsxs)(U,{href:e.link,target:"_blank",children:[(0,h.jsx)($,{src:e.logo}),(0,h.jsx)(K,{children:e.name})]},e.name)},e.name)}))}),(0,h.jsx)(A,{})]})},ne=i(1664),ie=(0,s.ZP)(g).withConfig({displayName:"article__Wrapper",componentId:"sc-1powp4q-0"})(["cursor:pointer;display:flex;padding:15px;"]),te=s.ZP.div.withConfig({displayName:"article__Inner",componentId:"sc-1powp4q-1"})(["flex:1;display:flex;flex-direction:column;justify-content:center;"]),re=s.ZP.div.withConfig({displayName:"article__ImageWrapper",componentId:"sc-1powp4q-2"})(["width:160px;max-height:100%;position:relative;margin-left:20px;"]),oe=s.ZP.h3.withConfig({displayName:"article__Header",componentId:"sc-1powp4q-3"})(["margin:0;font-weight:600;"]),ae=s.ZP.time.withConfig({displayName:"article__Published",componentId:"sc-1powp4q-4"})(["display:block;font-size:0.8rem;padding-bottom:1rem;"]),se=s.ZP.div.withConfig({displayName:"article__Image",componentId:"sc-1powp4q-5"})(["position:absolute;top:0;left:0;right:0;bottom:0;background-image:url('","');background-size:cover;background-position:center;"],(function(e){return e.src})),ce=function(e){var n=e.article;return(0,h.jsx)(ne.default,{href:"/articles/".concat(n.id),children:(0,h.jsxs)(ie,{children:[(0,h.jsxs)(te,{children:[(0,h.jsx)(oe,{children:n.title}),(0,h.jsx)(ae,{children:n.published})]}),n.cover&&(0,h.jsx)(re,{children:(0,h.jsx)(se,{src:n.cover})})]})})},de=!0,pe=function(e){var n=e.articles,i=e.profile,r=e.experiences;return(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(t.default,{children:(0,h.jsxs)("title",{children:[i.name," - ",i.tagline]})}),(0,h.jsx)(ee,{profile:i}),(0,h.jsxs)(o.V,{children:[(0,h.jsx)(S,{title:"Latest articles",children:n.map((function(e){return(0,h.jsx)(ce,{article:e},e.id)}))}),(0,h.jsx)(O,{experiences:r})]})]})}},5301:function(e,n,i){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return i(4573)}])},5550:function(e,n,i){"use strict";i.r(n),n.default="/_next/static/images/smoke-7c256a053bfa962dead91acbcb1d847d.png"}},function(e){e.O(0,[737,584,643,774,888,179],(function(){return n=5301,e(e.s=n);var n}));var n=e.O();_N_E=n}]);