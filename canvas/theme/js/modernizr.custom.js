window.Modernizr=function(e,t,n){function r(e){g.cssText=e}function o(e,t){return typeof e===t}function i(e,t){return!!~(""+e).indexOf(t)}function s(e,t){for(var r in e){var o=e[r];if(!i(o,"-")&&g[o]!==n)return"pfx"==t?o:!0}return!1}function a(e,t,r){for(var i in e){var s=t[e[i]];if(s!==n)return r===!1?e[i]:o(s,"function")?s.bind(r||t):s}return!1}function c(e,t,n){var r=e.charAt(0).toUpperCase()+e.slice(1),i=(e+" "+w.join(r+" ")+r).split(" ");return o(t,"string")||o(t,"undefined")?s(i,t):(i=(e+" "+j.join(r+" ")+r).split(" "),a(i,t,n))}var u,l,d,f="2.8.3",p={},m=!0,y=t.documentElement,h="modernizr",v=t.createElement(h),g=v.style,b=({}.toString," -webkit- -moz- -o- -ms- ".split(" ")),x="Webkit Moz O ms",w=x.split(" "),j=x.toLowerCase().split(" "),z={},T=[],C=T.slice,E=function(e,n,r,o){var i,s,a,c,u=t.createElement("div"),l=t.body,d=l||t.createElement("body");if(parseInt(r,10))for(;r--;)a=t.createElement("div"),a.id=o?o[r]:h+(r+1),u.appendChild(a);return i=["&#173;",'<style id="s',h,'">',e,"</style>"].join(""),u.id=h,(l?u:d).innerHTML+=i,d.appendChild(u),l||(d.style.background="",d.style.overflow="hidden",c=y.style.overflow,y.style.overflow="hidden",y.appendChild(d)),s=n(u,e),l?u.parentNode.removeChild(u):(d.parentNode.removeChild(d),y.style.overflow=c),!!s},S={}.hasOwnProperty;d=o(S,"undefined")||o(S.call,"undefined")?function(e,t){return t in e&&o(e.constructor.prototype[t],"undefined")}:function(e,t){return S.call(e,t)},Function.prototype.bind||(Function.prototype.bind=function(e){var t=this;if("function"!=typeof t)throw new TypeError;var n=C.call(arguments,1),r=function(){if(this instanceof r){var o=function(){};o.prototype=t.prototype;var i=new o,s=t.apply(i,n.concat(C.call(arguments)));return Object(s)===s?s:i}return t.apply(e,n.concat(C.call(arguments)))};return r}),z.flexbox=function(){return c("flexWrap")},z.touch=function(){var n;return"ontouchstart"in e||e.DocumentTouch&&t instanceof DocumentTouch?n=!0:E(["@media (",b.join("touch-enabled),("),h,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(e){n=9===e.offsetTop}),n},z.borderradius=function(){return c("borderRadius")},z.boxshadow=function(){return c("boxShadow")},z.cssanimations=function(){return c("animationName")},z.csscolumns=function(){return c("columnCount")},z.csstransforms=function(){return!!c("transform")},z.csstransforms3d=function(){var e=!!c("perspective");return e&&"webkitPerspective"in y.style&&E("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}",function(t,n){e=9===t.offsetLeft&&3===t.offsetHeight}),e};for(var M in z)d(z,M)&&(l=M.toLowerCase(),p[l]=z[M](),T.push((p[l]?"":"no-")+l));return p.addTest=function(e,t){if("object"==typeof e)for(var r in e)d(e,r)&&p.addTest(r,e[r]);else{if(e=e.toLowerCase(),p[e]!==n)return p;t="function"==typeof t?t():t,"undefined"!=typeof m&&m&&(y.className+=" "+(t?"":"no-")+e),p[e]=t}return p},r(""),v=u=null,p._version=f,p._prefixes=b,p._domPrefixes=j,p._cssomPrefixes=w,p.testProp=function(e){return s([e])},p.testAllProps=c,p.testStyles=E,y.className=y.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(m?" js "+T.join(" "):""),p}(this,this.document),function(e,t,n){function r(e){return"[object Function]"==h.call(e)}function o(e){return"string"==typeof e}function i(){}function s(e){return!e||"loaded"==e||"complete"==e||"uninitialized"==e}function a(){var e=v.shift();g=1,e?e.t?m(function(){("c"==e.t?f.injectCss:f.injectJs)(e.s,0,e.a,e.x,e.e,1)},0):(e(),a()):g=0}function c(e,n,r,o,i,c,u){function l(t){if(!p&&s(d.readyState)&&(b.r=p=1,!g&&a(),d.onload=d.onreadystatechange=null,t)){"img"!=e&&m(function(){w.removeChild(d)},50);for(var r in E[n])E[n].hasOwnProperty(r)&&E[n][r].onload()}}var u=u||f.errorTimeout,d=t.createElement(e),p=0,h=0,b={t:r,s:n,e:i,a:c,x:u};1===E[n]&&(h=1,E[n]=[]),"object"==e?d.data=n:(d.src=n,d.type=e),d.width=d.height="0",d.onerror=d.onload=d.onreadystatechange=function(){l.call(this,h)},v.splice(o,0,b),"img"!=e&&(h||2===E[n]?(w.insertBefore(d,x?null:y),m(l,u)):E[n].push(d))}function u(e,t,n,r,i){return g=0,t=t||"j",o(e)?c("c"==t?z:j,e,t,this.i++,n,r,i):(v.splice(this.i++,0,e),1==v.length&&a()),this}function l(){var e=f;return e.loader={load:u,i:0},e}var d,f,p=t.documentElement,m=e.setTimeout,y=t.getElementsByTagName("script")[0],h={}.toString,v=[],g=0,b="MozAppearance"in p.style,x=b&&!!t.createRange().compareNode,w=x?p:y.parentNode,p=e.opera&&"[object Opera]"==h.call(e.opera),p=!!t.attachEvent&&!p,j=b?"object":p?"script":"img",z=p?"script":j,T=Array.isArray||function(e){return"[object Array]"==h.call(e)},C=[],E={},S={timeout:function(e,t){return t.length&&(e.timeout=t[0]),e}};f=function(e){function t(e){var t,n,r,e=e.split("!"),o=C.length,i=e.pop(),s=e.length,i={url:i,origUrl:i,prefixes:e};for(n=0;s>n;n++)r=e[n].split("="),(t=S[r.shift()])&&(i=t(i,r));for(n=0;o>n;n++)i=C[n](i);return i}function s(e,o,i,s,a){var c=t(e),u=c.autoCallback;c.url.split(".").pop().split("?").shift(),c.bypass||(o&&(o=r(o)?o:o[e]||o[s]||o[e.split("/").pop().split("?")[0]]),c.instead?c.instead(e,o,i,s,a):(E[c.url]?c.noexec=!0:E[c.url]=1,i.load(c.url,c.forceCSS||!c.forceJS&&"css"==c.url.split(".").pop().split("?").shift()?"c":n,c.noexec,c.attrs,c.timeout),(r(o)||r(u))&&i.load(function(){l(),o&&o(c.origUrl,a,s),u&&u(c.origUrl,a,s),E[c.url]=2})))}function a(e,t){function n(e,n){if(e){if(o(e))n||(d=function(){var e=[].slice.call(arguments);f.apply(this,e),p()}),s(e,d,t,0,u);else if(Object(e)===e)for(c in a=function(){var t,n=0;for(t in e)e.hasOwnProperty(t)&&n++;return n}(),e)e.hasOwnProperty(c)&&(!n&&!--a&&(r(d)?d=function(){var e=[].slice.call(arguments);f.apply(this,e),p()}:d[c]=function(e){return function(){var t=[].slice.call(arguments);e&&e.apply(this,t),p()}}(f[c])),s(e[c],d,t,c,u))}else!n&&p()}var a,c,u=!!e.test,l=e.load||e.both,d=e.callback||i,f=d,p=e.complete||i;n(u?e.yep:e.nope,!!l),l&&n(l)}var c,u,d=this.yepnope.loader;if(o(e))s(e,0,d,0);else if(T(e))for(c=0;c<e.length;c++)u=e[c],o(u)?s(u,0,d,0):T(u)?f(u):Object(u)===u&&a(u,d);else Object(e)===e&&a(e,d)},f.addPrefix=function(e,t){S[e]=t},f.addFilter=function(e){C.push(e)},f.errorTimeout=1e4,null==t.readyState&&t.addEventListener&&(t.readyState="loading",t.addEventListener("DOMContentLoaded",d=function(){t.removeEventListener("DOMContentLoaded",d,0),t.readyState="complete"},0)),e.yepnope=l(),e.yepnope.executeStack=a,e.yepnope.injectJs=function(e,n,r,o,c,u){var l,d,p=t.createElement("script"),o=o||f.errorTimeout;p.src=e;for(d in r)p.setAttribute(d,r[d]);n=u?a:n||i,p.onreadystatechange=p.onload=function(){!l&&s(p.readyState)&&(l=1,n(),p.onload=p.onreadystatechange=null)},m(function(){l||(l=1,n(1))},o),c?p.onload():y.parentNode.insertBefore(p,y)},e.yepnope.injectCss=function(e,n,r,o,s,c){var u,o=t.createElement("link"),n=c?a:n||i;o.href=e,o.rel="stylesheet",o.type="text/css";for(u in r)o.setAttribute(u,r[u]);s||(y.parentNode.insertBefore(o,y),m(n,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))},Modernizr.addTest("csscalc",function(){var e="width:",t="calc(10px);",n=document.createElement("div");return n.style.cssText=e+Modernizr._prefixes.join(t+e),!!n.style.length}),Modernizr.addTest("cssfilters",function(){var e=document.createElement("div");return e.style.cssText=Modernizr._prefixes.join("filter:blur(2px); "),!!e.style.length&&(void 0===document.documentMode||document.documentMode>9)}),Modernizr.addTest("csspositionsticky",function(){var e="position:",t="sticky",n=document.createElement("modernizr"),r=n.style;return r.cssText=e+Modernizr._prefixes.join(t+";"+e).slice(0,-e.length),-1!==r.position.indexOf(t)}),Modernizr.addTest("cssremunit",function(){var e=document.createElement("div");try{e.style.fontSize="3rem"}catch(t){}return/rem/.test(e.style.fontSize)}),Modernizr.addTest("cssvhunit",function(){var e;return Modernizr.testStyles("#modernizr { height: 50vh; }",function(t,n){var r=parseInt(window.innerHeight/2,10),o=parseInt((window.getComputedStyle?getComputedStyle(t,null):t.currentStyle).height,10);e=o==r}),e});