(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{4174:function(e,i,n){"use strict";n.d(i,{V:function(){return t}});var t=n(7379).ZP.div.withConfig({displayName:"content__Content",componentId:"sc-1przdw9-0"})(["width:100%;max-width:800px;padding:0 30px;margin:auto;"])},1043:function(e,i,n){"use strict";n.r(i),n.d(i,{__N_SSG:function(){return ie},default:function(){return ne}});var t=n(9008),r=n(7294),o=n(4174),a=n(1324),c=n(7379),s=n(9499),d=n(4730),p=n(6513),l=n(5417),f=n(2640),h=n(5893),m=["children"];function x(e,i){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);i&&(t=t.filter((function(i){return Object.getOwnPropertyDescriptor(e,i).enumerable}))),n.push.apply(n,t)}return n}function u(e){for(var i=1;i<arguments.length;i++){var n=null!=arguments[i]?arguments[i]:{};i%2?x(Object(n),!0).forEach((function(i){(0,s.Z)(e,i,n[i])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):x(Object(n)).forEach((function(i){Object.defineProperty(e,i,Object.getOwnPropertyDescriptor(n,i))}))}return e}var g=function(e){var i=e.children,n=(0,d.Z)(e,m),t=(0,r.useRef)(),o=(0,p._)(),a=function(e){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"0px",n=(0,r.useState)(!1),t=n[0],o=n[1];return(0,r.useEffect)((function(){var n=e.current,t=new IntersectionObserver((function(e){var i=(0,f.Z)(e,1)[0];o(i.isIntersecting)}),{rootMargin:i});return n&&t.observe(n),function(){n&&t.unobserve(n)}}),[e]),t}(t),c=(0,r.useMemo)((function(){return 1}),[]);return(0,r.useEffect)((function(){a&&o.start({y:0,opacity:1,scale:1,transition:{duration:c,ease:"easeOut"}})}),[o,a]),(0,h.jsx)(l.E.div,u(u({},n),{},{ref:t,initial:{y:"100%"},animate:o,children:i}))},_=c.ZP.div.withConfig({displayName:"experiences__OuterOuter",componentId:"sc-1evy0ik-0"})(["margin-top:100px;"]),y=c.ZP.div.withConfig({displayName:"experiences__Wrapper",componentId:"sc-1evy0ik-1"})(["margin-bottom:50px;"]),j=c.ZP.div.withConfig({displayName:"experiences__Outer",componentId:"sc-1evy0ik-2"})(["position:relative;"]),w=c.ZP.div.withConfig({displayName:"experiences__ExperienceWrapper",componentId:"sc-1evy0ik-3"})(["margin-left:20px;padding:20px 40px;border-left:solid 1px #eee;&::after{content:'';position:absolute;width:10px;height:10px;background:#ccc;border-radius:50%;top:50%;left:15px;translate:transformY(-50%);}line-height:1.8rem;letter-spacing:0.5px;p + p:first-letter{padding-left:20px;}"]),v=(0,c.ZP)(g).withConfig({displayName:"experiences__Inner",componentId:"sc-1evy0ik-4"})(["border:solid 1px #eee;padding:20px;"]),b=c.ZP.h5.withConfig({displayName:"experiences__CompanyName",componentId:"sc-1evy0ik-5"})([""]),P=c.ZP.h4.withConfig({displayName:"experiences__JobTitle",componentId:"sc-1evy0ik-6"})(["font-size:1.3rem;"]),I=c.ZP.div.withConfig({displayName:"experiences__Time",componentId:"sc-1evy0ik-7"})(["font-size:0.8rem;"]),N=c.ZP.h2.withConfig({displayName:"experiences__Title",componentId:"sc-1evy0ik-8"})(["margin:2rem 0;text-align:center;"]),C=c.ZP.div.withConfig({displayName:"experiences__More",componentId:"sc-1evy0ik-9"})(["color:#3498db;cursor:pointer;font-size:0.8rem;margin-top:10px;"]),Z=c.ZP.div.withConfig({displayName:"experiences__Hidden",componentId:"sc-1evy0ik-10"})(["overflow:hidden;transition:all 0.3s ease-out;"]),k=function(e){var i=e.experience,n=(0,r.useState)(!1),t=n[0],o=n[1];return(0,h.jsx)(j,{children:(0,h.jsx)(w,{children:(0,h.jsxs)(v,{children:[(0,h.jsx)(b,{children:i.company.name}),(0,h.jsx)(P,{children:i.title}),(0,h.jsxs)(I,{children:[i.startDate," - ",i.endDate]}),(0,h.jsx)(Z,{style:{maxHeight:t?1e3:0,opacity:t?1:0},children:(0,h.jsx)(a.D,{children:i.content})}),(0,h.jsxs)(C,{onClick:function(){return o(!t)},children:["Show ",t?"less":"more"]})]})})})},O=function(e){var i=e.experiences;return(0,h.jsx)(_,{children:(0,h.jsxs)(y,{children:[(0,h.jsx)(N,{children:"Experiences"}),i.map((function(e){return(0,h.jsx)(k,{experience:e},e.id)}))]})})},z=c.ZP.div.withConfig({displayName:"featured__Wrapper",componentId:"sc-17h7y68-0"})([""]),q=c.ZP.h2.withConfig({displayName:"featured__Title",componentId:"sc-17h7y68-1"})(["margin:2rem 0;text-align:center;"]),S=c.ZP.div.withConfig({displayName:"featured__Items",componentId:"sc-17h7y68-2"})(["display:flex;flex-wrap:wrap;&> *{border:solid 1px #efefef;max-width:calc(50% - 20px);min-width:calc(300px);margin:10px;}"]),E=function(e){var i=e.title,n=e.children;return(0,h.jsxs)(z,{children:[(0,h.jsx)(q,{children:i}),(0,h.jsx)(S,{children:n})]})},D=c.ZP.div.withConfig({displayName:"hero__Wrapper",componentId:"sc-qshhjz-0"})(["position:relative;min-height:900px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:30px;"]),T=c.ZP.div.withConfig({displayName:"hero__Avatar",componentId:"sc-qshhjz-1"})(["background-image:url('","');max-width:400px;width:100%;border-radius:50%;background-size:cover;border:solid 5px #f0f0f0;box-shadow:0 0 15px rgba(0,0,0,0.5);transform:scaleX(-1);margin-bottom:-30px;"],(function(e){return e.src})),W=c.ZP.div.withConfig({displayName:"hero__AvatarSpacer",componentId:"sc-qshhjz-2"})(["padding-bottom:100%;"]),F=c.ZP.h1.withConfig({displayName:"hero__Name",componentId:"sc-qshhjz-3"})(['background:#000;font-size:3rem;line-height:4rem;font-weight:400;font-family:"Pacifico";color:#fff;margin:0;padding:10px;text-shadow:0 0 15px rgba(0,0,0,0.5);text-align:center;transform:rotate(-3deg);']),M=c.ZP.h2.withConfig({displayName:"hero__Tagline",componentId:"sc-qshhjz-4"})(['display:block;background:#f0f0f0;font-size:1.5rem;font-weight:100;font-family:"Pacifico";font-family:"Fredoka";color:#000;padding:5px;margin:0;text-align:center;border:solid 1px #000;transform:translateY(-5px) rotate(2deg);']),H=c.ZP.div.withConfig({displayName:"hero__Social",componentId:"sc-qshhjz-5"})(["margin-top:40px;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;"]),X=c.ZP.a.withConfig({displayName:"hero__SocialItem",componentId:"sc-qshhjz-6"})(["display:flex;align-items:center;justify-content:center;padding:20px;color:#000;"]),A=c.ZP.div.withConfig({displayName:"hero__SocialText",componentId:"sc-qshhjz-7"})(['margin-left:20px;font-family:"Fredoka";']),L=c.ZP.div.withConfig({displayName:"hero__SocialLogo",componentId:"sc-qshhjz-8"})(["background-image:url('","');width:50px;height:50px;background-size:cover;"],(function(e){return e.src})),R=function(e){var i=e.profile,t=(0,r.useState)(),o=t[0],a=t[1];return(0,r.useEffect)((function(){Promise.all([n.e(737),n.e(875),n.e(232)]).then(n.bind(n,232)).then((function(e){var i=e.default;a((0,h.jsx)(i,{}))}))}),[]),(0,h.jsxs)(D,{children:[(0,h.jsx)(T,{src:i.avatar,children:(0,h.jsx)(W,{})}),(0,h.jsx)(F,{children:i.name}),(0,h.jsx)(M,{children:i.tagline}),(0,h.jsxs)(H,{children:[(0,h.jsx)(g,{children:(0,h.jsx)(X,{href:i.resume,target:"_blank",children:(0,h.jsx)(A,{children:"Resum\xe9"})})}),i.social.map((function(e){return(0,h.jsx)(g,{children:(0,h.jsxs)(X,{href:e.link,target:"_blank",children:[(0,h.jsx)(L,{src:e.logo}),(0,h.jsx)(A,{children:e.name})]},e.name)},e.name)}))]}),o]})},V=n(1664),Y=n(9879),G=(0,c.ZP)(g).withConfig({displayName:"article__Wrapper",componentId:"sc-1powp4q-0"})(["cursor:pointer;display:flex;padding:15px;"]),J=c.ZP.div.withConfig({displayName:"article__Inner",componentId:"sc-1powp4q-1"})(["flex:1;display:flex;flex-direction:column;justify-content:center;"]),B=c.ZP.div.withConfig({displayName:"article__ImageWrapper",componentId:"sc-1powp4q-2"})(["width:160px;max-height:100%;position:relative;margin-left:20px;"]),K=c.ZP.h3.withConfig({displayName:"article__Header",componentId:"sc-1powp4q-3"})(["margin:0;font-weight:600;"]),Q=c.ZP.time.withConfig({displayName:"article__Meta",componentId:"sc-1powp4q-4"})(["display:block;font-size:0.8rem;padding-bottom:1rem;"]),U=c.ZP.time.withConfig({displayName:"article__Published",componentId:"sc-1powp4q-5"})([""]),$=c.ZP.div.withConfig({displayName:"article__Image",componentId:"sc-1powp4q-6"})(["position:absolute;top:0;left:0;right:0;bottom:0;background-image:url('","');background-size:cover;background-position:center;"],(function(e){return e.src})),ee=function(e){var i=e.article;return(0,h.jsx)(V.default,{href:"/articles/".concat(i.id),children:(0,h.jsxs)(G,{children:[(0,h.jsxs)(J,{children:[(0,h.jsx)(Q,{children:(0,h.jsx)(U,{children:(0,Y.Z)(new Date(i.published||0),{addSuffix:!0})})}),(0,h.jsx)(K,{children:i.title}),(0,h.jsxs)(Q,{children:[(0,h.jsx)("br",{}),i.stats.minutes.toFixed(0)," min read"]})]}),i.cover&&(0,h.jsx)(B,{children:(0,h.jsx)($,{src:i.cover})})]})})},ie=!0,ne=function(e){var i=e.articles,n=e.profile,r=e.experiences;return(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(t.default,{children:(0,h.jsxs)("title",{children:[n.name," - ",n.tagline]})}),(0,h.jsx)(R,{profile:n}),(0,h.jsxs)(o.V,{children:[(0,h.jsx)(E,{title:"Latest articles",children:i.map((function(e){return(0,h.jsx)(ee,{article:e},e.id)}))}),(0,h.jsx)(O,{experiences:r})]})]})}},5301:function(e,i,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return n(1043)}])}},function(e){e.O(0,[143,681,774,888,179],(function(){return i=5301,e(e.s=i);var i}));var i=e.O();_N_E=i}]);