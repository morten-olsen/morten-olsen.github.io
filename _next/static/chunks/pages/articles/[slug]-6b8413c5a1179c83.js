(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[850],{2672:function(n,r,e){(window.__NEXT_P=window.__NEXT_P||[]).push(["/articles/[slug]",function(){return e(6728)}])},6728:function(n,r,e){"use strict";e.r(r),e.d(r,{__N_SSG:function(){return Z}});var t=e(9989),o=e(4246),i=e(8228),a=e(7378),u=e(6166),c=e(1724),f=e(7028),l=e(8394);function d(){var n=(0,t.Z)(["\n  background: ",";\n"]);return d=function(){return n},n}function s(){var n=(0,t.Z)(["\n  margin-right: 40%;\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  background: ",";\n  min-height: 100vh;\n\n  @media only screen and (max-width: 700px) {\n    margin-right: 0;\n  }\n"]);return s=function(){return n},n}function m(){var n=(0,t.Z)(["\n  max-width: 900px;\n  padding: 50px;\n  letter-spacing: 0.5px;\n  line-height: 2.1rem;\n  color: ",";\n\n  img {\n    max-width: 100%;\n  }\n\n  p:first-of-type::first-letter {\n    font-size: 6rem;\n    float: left;\n    padding: 1rem;\n    margin: 0px 2rem;\n    font-weight: 100;\n    margin-left: 0rem;\n  }\n\n  p + p::first-letter {\n    margin-left: 1.8rem;\n  }\n\n  p {\n    margin-left: 50px;\n    @media only screen and (max-width: 700px) {\n      margin-left: 0;\n    }\n  }\n\n  a {\n    text-decoration: none;\n    color: ",";\n    background: ",";\n    padding: 0.2rem 0.4rem;\n  }\n\n  h2,\n  h3,\n  h4,\n  h5,\n  h6 {\n    display: inline-block;\n    padding: 15px;\n    text-transform: uppercase;\n    margin: 5px 0;\n    background: ",";\n    color: ",";\n    font-family: 'Black Ops One', sans-serif;\n\n    @media only screen and (max-width: 700px) {\n      background: transparent;\n      padding: 0;\n    }\n  }\n"]);return m=function(){return n},n}function h(){var n=(0,t.Z)(["\n  width: 40%;\n  position: fixed;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  background: ",";\n  background-size: cover;\n  background-position: center;\n  opacity: 0.7;\n  ","\n\n  @media only screen and (max-width: 700px) {\n    position: static;\n    width: 100%;\n    opacity: 1;\n    height: 200px;\n  }\n}\n"]);return h=function(){return n},n}function p(){var n=(0,t.Z)(["\n  font-size: 4rem;\n  line-height: 4.1rem;\n  display: inline-block;\n  background: ",";\n  color: ",";\n  padding: 0 15px;\n  text-transform: uppercase;\n  margin: 5px;\n  font-family: 'Black Ops One', sans-serif;\n\n  @media only screen and (max-width: 900px) {\n    font-size: 2.5rem;\n    line-height: 3.1rem;\n  }\n\n  @media only screen and (max-width: 700px) {\n    padding: 5px;\n    font-size: 2rem;\n    line-height: 2.1rem;\n  }\n"]);return p=function(){return n},n}function g(){var n=(0,t.Z)(["\n  font-size: 0.8rem;\n"]);return g=function(){return n},n}var x=i.ZP.div(d(),(function(n){return n.theme.colors.background})),b=i.ZP.article(s(),(function(n){return n.theme.colors.background})),v=i.ZP.div(m(),(function(n){return n.theme.colors.foreground}),(function(n){return n.theme.colors.primary}),(function(n){return n.theme.colors.foreground}),(function(n){return n.theme.colors.primary}),(function(n){return n.theme.colors.foreground})),y=i.ZP.aside(h(),(function(n){return n.theme.colors.primary}),(function(n){var r=n.image;return r?"background-image: url(".concat(r,");"):""})),k=(0,i.ZP)(c.bn)(p(),(function(n){return n.theme.colors.primary}),(function(n){return n.theme.colors.foreground})),w=(0,i.ZP)(c.Lh)(g()),Z=!0;r.default=function(n){var r=n.article,e=(0,a.useMemo)((function(){return(0,l.j)({baseColor:r.meta.color})}),[r.meta.color]);return(0,o.jsx)(f.f,{theme:e,children:(0,o.jsx)(x,{children:(0,o.jsx)(b,{children:(0,o.jsxs)(v,{children:[r.title.split(" ").map((function(n,r){return(0,o.jsx)(k,{children:n},r)})),(0,o.jsx)("div",{children:(0,o.jsxs)(w,{children:["By Morten Olsen - ",r.stats.text," ",r.pdf&&(0,o.jsx)("a",{href:r.pdf,target:"_blank",children:"download as PDF"})]})}),(0,o.jsx)(y,{image:r.cover}),(0,o.jsx)(u.D,{children:r.content})]})})})})}},1724:function(n,r,e){"use strict";e.d(r,{Lh:function(){return s},bn:function(){return l},wo:function(){return d}});var t=e(9989),o=e(8228);function i(){var n=(0,t.Z)(["\n  ","\n  color: ",";\n  font-weight: ",";\n  font-size: ","px;\n"]);return i=function(){return n},n}function a(){var n=(0,t.Z)(["\n    font-size: ","px;\n    font-weight: ",";\n    ","\n  "]);return a=function(){return n},n}var u=o.ZP.span(i(),(function(n){var r=n.theme;return r.font.family?"font-family: ".concat(r.font.family,";"):""}),(function(n){var r=n.color,e=n.theme;return r?e.colors[r]:e.colors.foreground}),(function(n){return n.bold?"bold":"normal"}),(function(n){return n.theme.font.baseSize})),c=function(n,r){return r.typography[n]},f=function(n){return(0,o.ZP)(u)(a(),(function(r){var e=r.theme;return e.font.baseSize*(c(n,e).size||1)}),(function(r){var e=r.bold,t=r.theme;return"undefined"!==typeof e?"bold":c(n,t).weight||"normal"}),(function(r){var e=r.theme;return c(n,e).upperCase?"text-transform: uppercase;":""}))},l=f("Jumbo"),d=(f("Title2"),f("Title1")),s=(f("Body1"),f("Overline"));f("Caption"),f("Link")}},function(n){n.O(0,[166,774,888,179],(function(){return r=2672,n(n.s=r);var r}));var r=n.O();_N_E=r}]);