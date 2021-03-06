/*!
 * JavaScript Cookie v2.1.3
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
(function(m){var h=!1;"function"===typeof define&&define.amd&&(define(m),h=!0);"object"===typeof exports&&(module.exports=m(),h=!0);if(!h){var f=window.Cookies,a=window.Cookies=m();a.noConflict=function(){window.Cookies=f;return a}}})(function(){function m(){for(var f=0,a={};f<arguments.length;f++){var b=arguments[f],d;for(d in b)a[d]=b[d]}return a}function h(f){function a(b,d,e){var c;if("undefined"!==typeof document){if(1<arguments.length){e=m({path:"/"},a.defaults,e);if("number"===typeof e.expires){var k=
new Date;k.setMilliseconds(k.getMilliseconds()+864E5*e.expires);e.expires=k}e.expires=e.expires?e.expires.toUTCString():"";try{c=JSON.stringify(d),/^[\{\[]/.test(c)&&(d=c)}catch(h){}d=f.write?f.write(d,b):encodeURIComponent(String(d)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent);b=encodeURIComponent(String(b));b=b.replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent);b=b.replace(/[\(\)]/g,escape);c="";for(var l in e)e[l]&&(c+="; "+l,!0!==e[l]&&(c+="="+e[l]));
return document.cookie=b+"="+d+c}b||(c={});l=document.cookie?document.cookie.split("; "):[];for(var p=/(%[0-9A-Z]{2})+/g,n=0;n<l.length;n++){var q=l[n].split("="),g=q.slice(1).join("=");'"'===g.charAt(0)&&(g=g.slice(1,-1));try{k=q[0].replace(p,decodeURIComponent);g=f.read?f.read(g,k):f(g,k)||g.replace(p,decodeURIComponent);if(this.json)try{g=JSON.parse(g)}catch(h){}if(b===k){c=g;break}b||(c[k]=g)}catch(h){}}return c}}a.set=a;a.get=function(b){return a.call(a,b)};a.getJSON=function(){return a.apply({json:!0},
[].slice.call(arguments))};a.defaults={};a.remove=function(b,d){a(b,"",m(d,{expires:-1}))};a.withConverter=h;return a}return h(function(){})});
