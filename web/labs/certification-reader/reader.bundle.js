/** @license
Three.js Copyright 2010-2026 Three.js Authors.
Pavel Fluid Copyright (c) 2017 Pavel Dobryakov.
Copyright (C) 2011 by Ashima Arts (Simplex noise)
Copyright (C) 2011-2016 by Stefan Gustavson (Classic noise and others)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
var Qf=Object.defineProperty;var Xl=(i,e)=>{for(var t in e)Qf(i,t,{get:e[t],enumerable:!0})};/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */var ju=0,Rc=1,Ju=2;var ji=1,fo=2,Vs=3,Gn=0,Jt=1,Dt=2,Wn=0,Hs=1,Cc=2,Ic=3,Pc=4,Qu=5;var Ji=100,ed=101,td=102,nd=103,id=104,sd=200,rd=201,ad=202,od=203,Lc=204,Dc=205,ld=206,cd=207,hd=208,ud=209,dd=210,fd=211,pd=212,md=213,gd=214,Ha=0,Ga=1,Wa=2,ws=3,Xa=4,qa=5,Ya=6,$a=7,Nc=0,xd=1,_d=2,pn=0,Uc=1,Fc=2,Oc=3,Vr=4,Bc=5,zc=6,kc=7,gc="attached",vd="detached",Vc=300,Pi=301,Qi=302,po=303,mo=304,Hr=306,_n=1e3,Ot=1001,Es=1002,Mt=1003,go=1004;var es=1005;var pt=1006,Gs=1007;var vn=1008;var an=1009,Hc=1010,Gc=1011,Ws=1012,xo=1013,In=1014,zt=1015,Qt=1016,_o=1017,vo=1018,Xs=1020,Wc=35902,Xc=35899,qc=1021,Yc=1022,en=1023,On=1026,Li=1027,yo=1028,So=1029,Di=1030,Mo=1031;var bo=1033,Gr=33776,Wr=33777,Xr=33778,qr=33779,To=35840,wo=35841,Eo=35842,Ao=35843,Ro=36196,Co=37492,Io=37496,Po=37488,Lo=37489,Yr=37490,Do=37491,No=37808,Uo=37809,Fo=37810,Oo=37811,Bo=37812,zo=37813,ko=37814,Vo=37815,Ho=37816,Go=37817,Wo=37818,Xo=37819,qo=37820,Yo=37821,$o=36492,Ko=36494,Zo=36495,jo=36283,Jo=36284,$r=36285,Qo=36286;var Wi=2300,Xi=2301,za=2302,xc=2303,_c=2400,vc=2401,yc=2402,yd=2500;var $c=0,Kr=1,qs=2,Sd=3200,Zr=3201;var el=0,Md=1,Pn="",xt="srgb",kt="srgb-linear",_r="linear",st="srgb";var ka=7680;var bd=519,Td=512,wd=513,Ed=514,tl=515,Ad=516,Rd=517,nl=518,Cd=519,Kc=35044,Zc=35048;var jc="300 es",An=2e3,As=2001;function ep(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function tp(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function Rs(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Id(){let i=Rs("canvas");return i.style.display="block",i}var pu={},Cs=null;function vr(...i){let e="THREE."+i.shift();Cs?Cs("log",e,...i):console.log(e,...i)}function Pd(i){let e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Ce(...i){i=Pd(i);let e="THREE."+i.shift();if(Cs)Cs("warn",e,...i);else{let t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function Fe(...i){i=Pd(i);let e="THREE."+i.shift();if(Cs)Cs("error",e,...i);else{let t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function Gi(...i){let e=i.join(" ");e in pu||(pu[e]=!0,Ce(...i))}function Ld(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var Dd={[Ha]:Ga,[Wa]:Ya,[Xa]:$a,[ws]:qa,[Ga]:Ha,[Ya]:Wa,[$a]:Xa,[qa]:ws},Bn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}},Ht=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],mu=1234567,gr=Math.PI/180,qi=180/Math.PI;function Rn(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ht[i&255]+Ht[i>>8&255]+Ht[i>>16&255]+Ht[i>>24&255]+"-"+Ht[e&255]+Ht[e>>8&255]+"-"+Ht[e>>16&15|64]+Ht[e>>24&255]+"-"+Ht[t&63|128]+Ht[t>>8&255]+"-"+Ht[t>>16&255]+Ht[t>>24&255]+Ht[n&255]+Ht[n>>8&255]+Ht[n>>16&255]+Ht[n>>24&255]).toLowerCase()}function $e(i,e,t){return Math.max(e,Math.min(t,i))}function Jc(i,e){return(i%e+e)%e}function np(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function ip(i,e,t){return i!==e?(t-i)/(e-i):0}function xr(i,e,t){return(1-t)*i+t*e}function sp(i,e,t,n){return xr(i,e,1-Math.exp(-t*n))}function rp(i,e=1){return e-Math.abs(Jc(i,e*2)-e)}function ap(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function op(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function lp(i,e){return i+Math.floor(Math.random()*(e-i+1))}function cp(i,e){return i+Math.random()*(e-i)}function hp(i){return i*(.5-Math.random())}function up(i){i!==void 0&&(mu=i);let e=mu+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function dp(i){return i*gr}function fp(i){return i*qi}function pp(i){return i>0&&Number.isInteger(i)&&2**Math.round(Math.log2(i))===i}function mp(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function gp(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function xp(i,e,t,n,s){let r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+n)/2),h=a((e+n)/2),d=r((e-n)/2),u=a((e-n)/2),p=r((n-e)/2),g=a((n-e)/2);switch(s){case"XYX":i.set(o*h,l*d,l*u,o*c);break;case"YZY":i.set(l*u,o*h,l*d,o*c);break;case"ZXZ":i.set(l*d,l*u,o*h,o*c);break;case"XZX":i.set(o*h,l*g,l*p,o*c);break;case"YXY":i.set(l*p,o*h,l*g,o*c);break;case"ZYZ":i.set(l*g,l*p,o*h,o*c);break;default:Ce("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function En(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:case Uint8ClampedArray:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function rt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var At={DEG2RAD:gr,RAD2DEG:qi,generateUUID:Rn,clamp:$e,euclideanModulo:Jc,mapLinear:np,inverseLerp:ip,lerp:xr,damp:sp,pingpong:rp,smoothstep:ap,smootherstep:op,randInt:lp,randFloat:cp,randFloatSpread:hp,seededRandom:up,degToRad:dp,radToDeg:fp,isPowerOfTwo:pp,ceilPowerOfTwo:mp,floorPowerOfTwo:gp,setQuaternionFromProperEuler:xp,normalize:rt,denormalize:En},Ge=class i{static{i.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar($e(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos($e(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Xt=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],d=n[s+3],u=r[a+0],p=r[a+1],g=r[a+2],y=r[a+3];if(d!==y||l!==u||c!==p||h!==g){let m=l*u+c*p+h*g+d*y;m<0&&(u=-u,p=-p,g=-g,y=-y,m=-m);let f=1-o;if(m<.9995){let M=Math.acos(m),A=Math.sin(M);f=Math.sin(f*M)/A,o=Math.sin(o*M)/A,l=l*f+u*o,c=c*f+p*o,h=h*f+g*o,d=d*f+y*o}else{l=l*f+u*o,c=c*f+p*o,h=h*f+g*o,d=d*f+y*o;let M=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=M,c*=M,h*=M,d*=M}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,s,r,a){let o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],d=r[a],u=r[a+1],p=r[a+2],g=r[a+3];return e[t]=o*g+h*d+l*p-c*u,e[t+1]=l*g+h*u+c*d-o*p,e[t+2]=c*g+h*p+o*u-l*d,e[t+3]=h*g-o*d-l*u-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),d=o(r/2),u=l(n/2),p=l(s/2),g=l(r/2);switch(a){case"XYZ":this._x=u*h*d+c*p*g,this._y=c*p*d-u*h*g,this._z=c*h*g+u*p*d,this._w=c*h*d-u*p*g;break;case"YXZ":this._x=u*h*d+c*p*g,this._y=c*p*d-u*h*g,this._z=c*h*g-u*p*d,this._w=c*h*d+u*p*g;break;case"ZXY":this._x=u*h*d-c*p*g,this._y=c*p*d+u*h*g,this._z=c*h*g+u*p*d,this._w=c*h*d-u*p*g;break;case"ZYX":this._x=u*h*d-c*p*g,this._y=c*p*d+u*h*g,this._z=c*h*g-u*p*d,this._w=c*h*d+u*p*g;break;case"YZX":this._x=u*h*d+c*p*g,this._y=c*p*d+u*h*g,this._z=c*h*g-u*p*d,this._w=c*h*d-u*p*g;break;case"XZY":this._x=u*h*d-c*p*g,this._y=c*p*d-u*h*g,this._z=c*h*g+u*p*d,this._w=c*h*d+u*p*g;break;default:Ce("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],d=t[10],u=n+o+d;if(u>0){let p=.5/Math.sqrt(u+1);this._w=.25/p,this._x=(h-l)*p,this._y=(r-c)*p,this._z=(a-s)*p}else if(n>o&&n>d){let p=2*Math.sqrt(1+n-o-d);this._w=(h-l)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+c)/p}else if(o>d){let p=2*Math.sqrt(1+o-n-d);this._w=(r-c)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(l+h)/p}else{let p=2*Math.sqrt(1+d-n-o);this._w=(a-s)/p,this._x=(r+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs($e(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){let c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},V=class i{static{i.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(gu.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(gu.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*n),h=2*(o*t-r*s),d=2*(r*n-a*t);return this.x=t+l*c+a*d-o*h,this.y=n+l*h+o*c-r*d,this.z=s+l*d+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this.z=$e(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this.z=$e(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar($e(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return ql.copy(this).projectOnVector(e),this.sub(ql)}reflect(e){return this.sub(ql.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos($e(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},ql=new V,gu=new Xt,Oe=class i{static{i.prototype.isMatrix3=!0}constructor(e,t,n,s,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c)}set(e,t,n,s,r,a,o,l,c){let h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],d=n[7],u=n[2],p=n[5],g=n[8],y=s[0],m=s[3],f=s[6],M=s[1],A=s[4],S=s[7],b=s[2],T=s[5],C=s[8];return r[0]=a*y+o*M+l*b,r[3]=a*m+o*A+l*T,r[6]=a*f+o*S+l*C,r[1]=c*y+h*M+d*b,r[4]=c*m+h*A+d*T,r[7]=c*f+h*S+d*C,r[2]=u*y+p*M+g*b,r[5]=u*m+p*A+g*T,r[8]=u*f+p*S+g*C,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=h*a-o*c,u=o*l-h*r,p=c*r-a*l,g=t*d+n*u+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let y=1/g;return e[0]=d*y,e[1]=(s*c-h*n)*y,e[2]=(o*n-s*a)*y,e[3]=u*y,e[4]=(h*t-s*l)*y,e[5]=(s*r-o*t)*y,e[6]=p*y,e[7]=(n*l-c*t)*y,e[8]=(a*t-n*r)*y,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return Gi("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Yl.makeScale(e,t)),this}rotate(e){return Gi("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Yl.makeRotation(-e)),this}translate(e,t){return Gi("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Yl.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Yl=new Oe,xu=new Oe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),_u=new Oe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function _p(){let i={enabled:!0,workingColorSpace:kt,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===st&&(s.r=ii(s.r),s.g=ii(s.g),s.b=ii(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===st&&(s.r=Ts(s.r),s.g=Ts(s.g),s.b=Ts(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Pn?_r:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Gi("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Gi("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[kt]:{primaries:e,whitePoint:n,transfer:_r,toXYZ:xu,fromXYZ:_u,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:xt},outputColorSpaceConfig:{drawingBufferColorSpace:xt}},[xt]:{primaries:e,whitePoint:n,transfer:st,toXYZ:xu,fromXYZ:_u,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:xt}}}),i}var Ye=_p();function ii(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ts(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var hs,Ka=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{hs===void 0&&(hs=Rs("canvas")),hs.width=e.width,hs.height=e.height;let s=hs.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=hs}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Rs("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=ii(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(ii(t[n]/255)*255):t[n]=ii(t[n]);return{data:t,width:e.width,height:e.height}}else return Ce("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},vp=0,Is=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:vp++}),this.uuid=Rn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push($l(s[a].image)):r.push($l(s[a]))}else r=$l(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function $l(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Ka.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Ce("Texture: Unable to serialize Texture."),{})}var yp=0,Kl=new V,bt=class i extends Bn{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=Ot,s=Ot,r=pt,a=vn,o=en,l=an,c=i.DEFAULT_ANISOTROPY,h=Pn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:yp++}),this.uuid=Rn(),this.name="",this.source=new Is(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Ge(0,0),this.repeat=new Ge(1,1),this.center=new Ge(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Oe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Kl).x}get height(){return this.source.getSize(Kl).y}get depth(){return this.source.getSize(Kl).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){Ce(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Ce(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Vc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case _n:e.x=e.x-Math.floor(e.x);break;case Ot:e.x=e.x<0?0:1;break;case Es:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case _n:e.y=e.y-Math.floor(e.y);break;case Ot:e.y=e.y<0?0:1;break;case Es:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};bt.DEFAULT_IMAGE=null;bt.DEFAULT_MAPPING=Vc;bt.DEFAULT_ANISOTROPY=1;var at=class i{static{i.prototype.isVector4=!0}constructor(e=0,t=0,n=0,s=1){this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],h=l[4],d=l[8],u=l[1],p=l[5],g=l[9],y=l[2],m=l[6],f=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-y)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+y)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let A=(c+1)/2,S=(p+1)/2,b=(f+1)/2,T=(h+u)/4,C=(d+y)/4,_=(g+m)/4;return A>S&&A>b?A<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(A),s=T/n,r=C/n):S>b?S<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(S),n=T/s,r=_/s):b<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(b),n=C/r,s=_/r),this.set(n,s,r,t),this}let M=Math.sqrt((m-g)*(m-g)+(d-y)*(d-y)+(u-h)*(u-h));return Math.abs(M)<.001&&(M=1),this.x=(m-g)/M,this.y=(d-y)/M,this.z=(u-h)/M,this.w=Math.acos((c+p+f-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this.z=$e(this.z,e.z,t.z),this.w=$e(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this.z=$e(this.z,e,t),this.w=$e(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar($e(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Za=class extends Bn{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:pt,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new at(0,0,e,t),this.scissorTest=!1,this.viewport=new at(0,0,e,t),this.textures=[];let s={width:e,height:t,depth:n.depth},r=new bt(s),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:pt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new Is(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},tn=class extends Za{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},yr=class extends bt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Mt,this.minFilter=Mt,this.wrapR=Ot,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var ja=class extends bt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Mt,this.minFilter=Mt,this.wrapR=Ot,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var ke=class i{static{i.prototype.isMatrix4=!0}constructor(e,t,n,s,r,a,o,l,c,h,d,u,p,g,y,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c,h,d,u,p,g,y,m)}set(e,t,n,s,r,a,o,l,c,h,d,u,p,g,y,m){let f=this.elements;return f[0]=e,f[4]=t,f[8]=n,f[12]=s,f[1]=r,f[5]=a,f[9]=o,f[13]=l,f[2]=c,f[6]=h,f[10]=d,f[14]=u,f[3]=p,f[7]=g,f[11]=y,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,s=1/us.setFromMatrixColumn(e,0).length(),r=1/us.setFromMatrixColumn(e,1).length(),a=1/us.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){let u=a*h,p=a*d,g=o*h,y=o*d;t[0]=l*h,t[4]=-l*d,t[8]=c,t[1]=p+g*c,t[5]=u-y*c,t[9]=-o*l,t[2]=y-u*c,t[6]=g+p*c,t[10]=a*l}else if(e.order==="YXZ"){let u=l*h,p=l*d,g=c*h,y=c*d;t[0]=u+y*o,t[4]=g*o-p,t[8]=a*c,t[1]=a*d,t[5]=a*h,t[9]=-o,t[2]=p*o-g,t[6]=y+u*o,t[10]=a*l}else if(e.order==="ZXY"){let u=l*h,p=l*d,g=c*h,y=c*d;t[0]=u-y*o,t[4]=-a*d,t[8]=g+p*o,t[1]=p+g*o,t[5]=a*h,t[9]=y-u*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let u=a*h,p=a*d,g=o*h,y=o*d;t[0]=l*h,t[4]=g*c-p,t[8]=u*c+y,t[1]=l*d,t[5]=y*c+u,t[9]=p*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let u=a*l,p=a*c,g=o*l,y=o*c;t[0]=l*h,t[4]=y-u*d,t[8]=g*d+p,t[1]=d,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=p*d+g,t[10]=u-y*d}else if(e.order==="XZY"){let u=a*l,p=a*c,g=o*l,y=o*c;t[0]=l*h,t[4]=-d,t[8]=c*h,t[1]=u*d+y,t[5]=a*h,t[9]=p*d-g,t[2]=g*d-p,t[6]=o*h,t[10]=y*d+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Sp,e,Mp)}lookAt(e,t,n){let s=this.elements;return hn.subVectors(e,t),hn.lengthSq()===0&&(hn.z=1),hn.normalize(),yi.crossVectors(n,hn),yi.lengthSq()===0&&(Math.abs(n.z)===1?hn.x+=1e-4:hn.z+=1e-4,hn.normalize(),yi.crossVectors(n,hn)),yi.normalize(),pa.crossVectors(hn,yi),s[0]=yi.x,s[4]=pa.x,s[8]=hn.x,s[1]=yi.y,s[5]=pa.y,s[9]=hn.y,s[2]=yi.z,s[6]=pa.z,s[10]=hn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],d=n[5],u=n[9],p=n[13],g=n[2],y=n[6],m=n[10],f=n[14],M=n[3],A=n[7],S=n[11],b=n[15],T=s[0],C=s[4],_=s[8],E=s[12],D=s[1],P=s[5],z=s[9],U=s[13],w=s[2],O=s[6],W=s[10],$=s[14],Q=s[3],Y=s[7],j=s[11],se=s[15];return r[0]=a*T+o*D+l*w+c*Q,r[4]=a*C+o*P+l*O+c*Y,r[8]=a*_+o*z+l*W+c*j,r[12]=a*E+o*U+l*$+c*se,r[1]=h*T+d*D+u*w+p*Q,r[5]=h*C+d*P+u*O+p*Y,r[9]=h*_+d*z+u*W+p*j,r[13]=h*E+d*U+u*$+p*se,r[2]=g*T+y*D+m*w+f*Q,r[6]=g*C+y*P+m*O+f*Y,r[10]=g*_+y*z+m*W+f*j,r[14]=g*E+y*U+m*$+f*se,r[3]=M*T+A*D+S*w+b*Q,r[7]=M*C+A*P+S*O+b*Y,r[11]=M*_+A*z+S*W+b*j,r[15]=M*E+A*U+S*$+b*se,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],d=e[6],u=e[10],p=e[14],g=e[3],y=e[7],m=e[11],f=e[15],M=l*p-c*u,A=o*p-c*d,S=o*u-l*d,b=a*p-c*h,T=a*u-l*h,C=a*d-o*h;return t*(y*M-m*A+f*S)-n*(g*M-m*b+f*T)+s*(g*A-y*b+f*C)-r*(g*S-y*T+m*C)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[1],a=e[5],o=e[9],l=e[2],c=e[6],h=e[10];return t*(a*h-o*c)-n*(r*h-o*l)+s*(r*c-a*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=e[9],u=e[10],p=e[11],g=e[12],y=e[13],m=e[14],f=e[15],M=t*o-n*a,A=t*l-s*a,S=t*c-r*a,b=n*l-s*o,T=n*c-r*o,C=s*c-r*l,_=h*y-d*g,E=h*m-u*g,D=h*f-p*g,P=d*m-u*y,z=d*f-p*y,U=u*f-p*m,w=M*U-A*z+S*P+b*D-T*E+C*_;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let O=1/w;return e[0]=(o*U-l*z+c*P)*O,e[1]=(s*z-n*U-r*P)*O,e[2]=(y*C-m*T+f*b)*O,e[3]=(u*T-d*C-p*b)*O,e[4]=(l*D-a*U-c*E)*O,e[5]=(t*U-s*D+r*E)*O,e[6]=(m*S-g*C-f*A)*O,e[7]=(h*C-u*S+p*A)*O,e[8]=(a*z-o*D+c*_)*O,e[9]=(n*D-t*z-r*_)*O,e[10]=(g*T-y*S+f*M)*O,e[11]=(d*S-h*T-p*M)*O,e[12]=(o*E-a*P-l*_)*O,e[13]=(t*P-n*E+s*_)*O,e[14]=(y*A-g*b-m*M)*O,e[15]=(h*b-d*A+u*M)*O,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,d=o+o,u=r*c,p=r*h,g=r*d,y=a*h,m=a*d,f=o*d,M=l*c,A=l*h,S=l*d,b=n.x,T=n.y,C=n.z;return s[0]=(1-(y+f))*b,s[1]=(p+S)*b,s[2]=(g-A)*b,s[3]=0,s[4]=(p-S)*T,s[5]=(1-(u+f))*T,s[6]=(m+M)*T,s[7]=0,s[8]=(g+A)*C,s[9]=(m-M)*C,s[10]=(1-(u+y))*C,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let a=us.set(s[0],s[1],s[2]).length(),o=us.set(s[4],s[5],s[6]).length(),l=us.set(s[8],s[9],s[10]).length();r<0&&(a=-a),Mn.copy(this);let c=1/a,h=1/o,d=1/l;return Mn.elements[0]*=c,Mn.elements[1]*=c,Mn.elements[2]*=c,Mn.elements[4]*=h,Mn.elements[5]*=h,Mn.elements[6]*=h,Mn.elements[8]*=d,Mn.elements[9]*=d,Mn.elements[10]*=d,t.setFromRotationMatrix(Mn),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,s,r,a,o=An,l=!1){let c=this.elements,h=2*r/(t-e),d=2*r/(n-s),u=(t+e)/(t-e),p=(n+s)/(n-s),g,y;if(l)g=r/(a-r),y=a*r/(a-r);else if(o===An)g=-(a+r)/(a-r),y=-2*a*r/(a-r);else if(o===As)g=-a/(a-r),y=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=d,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=y,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=An,l=!1){let c=this.elements,h=2/(t-e),d=2/(n-s),u=-(t+e)/(t-e),p=-(n+s)/(n-s),g,y;if(l)g=1/(a-r),y=a/(a-r);else if(o===An)g=-2/(a-r),y=-(a+r)/(a-r);else if(o===As)g=-1/(a-r),y=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=d,c[9]=0,c[13]=p,c[2]=0,c[6]=0,c[10]=g,c[14]=y,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},us=new V,Mn=new ke,Sp=new V(0,0,0),Mp=new V(1,1,1),yi=new V,pa=new V,hn=new V,vu=new ke,yu=new Xt,si=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],d=s[2],u=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin($e(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-$e(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin($e(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,p),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-$e(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin($e(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-$e(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,p),this._y=0);break;default:Ce("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return vu.makeRotationFromQuaternion(e),this.setFromRotationMatrix(vu,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return yu.setFromEuler(this),this.setFromQuaternion(yu,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};si.DEFAULT_ORDER="XYZ";var Sr=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},bp=0,Su=new V,ds=new Xt,Zn=new ke,ma=new V,lr=new V,Tp=new V,wp=new Xt,Mu=new V(1,0,0),bu=new V(0,1,0),Tu=new V(0,0,1),wu={type:"added"},Ep={type:"removed"},fs={type:"childadded",child:null},Zl={type:"childremoved",child:null},_t=class i extends Bn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:bp++}),this.uuid=Rn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new V,t=new si,n=new Xt,s=new V(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ke},normalMatrix:{value:new Oe}}),this.matrix=new ke,this.matrixWorld=new ke,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Sr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ds.setFromAxisAngle(e,t),this.quaternion.multiply(ds),this}rotateOnWorldAxis(e,t){return ds.setFromAxisAngle(e,t),this.quaternion.premultiply(ds),this}rotateX(e){return this.rotateOnAxis(Mu,e)}rotateY(e){return this.rotateOnAxis(bu,e)}rotateZ(e){return this.rotateOnAxis(Tu,e)}translateOnAxis(e,t){return Su.copy(e).applyQuaternion(this.quaternion),this.position.add(Su.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Mu,e)}translateY(e){return this.translateOnAxis(bu,e)}translateZ(e){return this.translateOnAxis(Tu,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Zn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?ma.copy(e):ma.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),lr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Zn.lookAt(lr,ma,this.up):Zn.lookAt(ma,lr,this.up),this.quaternion.setFromRotationMatrix(Zn),s&&(Zn.extractRotation(s.matrixWorld),ds.setFromRotationMatrix(Zn),this.quaternion.premultiply(ds.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Fe("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(wu),fs.child=e,this.dispatchEvent(fs),fs.child=null):Fe("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Ep),Zl.child=e,this.dispatchEvent(Zl),Zl.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Zn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Zn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Zn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(wu),fs.child=e,this.dispatchEvent(fs),fs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(lr,e,Tp),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(lr,wp,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let d=l[c];r(e.shapes,d)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),d=a(e.shapes),u=a(e.skeletons),p=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){let l=[];for(let c in o){let h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};_t.DEFAULT_UP=new V(0,1,0);_t.DEFAULT_MATRIX_AUTO_UPDATE=!0;_t.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Wt=class extends _t{constructor(){super(),this.isGroup=!0,this.type="Group"}},Ap={type:"move"},Ps=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Wt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Wt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new V,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new V),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Wt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new V,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new V,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let y of e.hand.values()){let m=t.getJointPose(y,n),f=this._getHandJoint(c,y);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}let h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),p=.02,g=.005;c.inputState.pinching&&u>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&u<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Ap)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Wt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Nd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Si={h:0,s:0,l:0},ga={h:0,s:0,l:0};function jl(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var Ne=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=xt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ye.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=Ye.workingColorSpace){return this.r=e,this.g=t,this.b=n,Ye.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=Ye.workingColorSpace){if(e=Jc(e,1),t=$e(t,0,1),n=$e(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=jl(a,r,e+1/3),this.g=jl(a,r,e),this.b=jl(a,r,e-1/3)}return Ye.colorSpaceToWorking(this,s),this}setStyle(e,t=xt){function n(r){r!==void 0&&parseFloat(r)<1&&Ce("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Ce("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Ce("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=xt){let n=Nd[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Ce("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ii(e.r),this.g=ii(e.g),this.b=ii(e.b),this}copyLinearToSRGB(e){return this.r=Ts(e.r),this.g=Ts(e.g),this.b=Ts(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=xt){return Ye.workingToColorSpace(Gt.copy(this),e),Math.round($e(Gt.r*255,0,255))*65536+Math.round($e(Gt.g*255,0,255))*256+Math.round($e(Gt.b*255,0,255))}getHexString(e=xt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ye.workingColorSpace){Ye.workingToColorSpace(Gt.copy(this),t);let n=Gt.r,s=Gt.g,r=Gt.b,a=Math.max(n,s,r),o=Math.min(n,s,r),l,c,h=(o+a)/2;if(o===a)l=0,c=0;else{let d=a-o;switch(c=h<=.5?d/(a+o):d/(2-a-o),a){case n:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-n)/d+2;break;case r:l=(n-s)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=Ye.workingColorSpace){return Ye.workingToColorSpace(Gt.copy(this),t),e.r=Gt.r,e.g=Gt.g,e.b=Gt.b,e}getStyle(e=xt){Ye.workingToColorSpace(Gt.copy(this),e);let t=Gt.r,n=Gt.g,s=Gt.b;return e!==xt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Si),this.setHSL(Si.h+e,Si.s+t,Si.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Si),e.getHSL(ga);let n=xr(Si.h,ga.h,t),s=xr(Si.s,ga.s,t),r=xr(Si.l,ga.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Gt=new Ne;Ne.NAMES=Nd;var Mr=class extends _t{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new si,this.environmentIntensity=1,this.environmentRotation=new si,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},bn=new V,jn=new V,Jl=new V,Jn=new V,ps=new V,ms=new V,Eu=new V,Ql=new V,ec=new V,tc=new V,nc=new at,ic=new at,sc=new at,Ei=class i{constructor(e=new V,t=new V,n=new V){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),bn.subVectors(e,t),s.cross(bn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){bn.subVectors(s,t),jn.subVectors(n,t),Jl.subVectors(e,t);let a=bn.dot(bn),o=bn.dot(jn),l=bn.dot(Jl),c=jn.dot(jn),h=jn.dot(Jl),d=a*c-o*o;if(d===0)return r.set(0,0,0),null;let u=1/d,p=(c*l-o*h)*u,g=(a*h-o*l)*u;return r.set(1-p-g,g,p)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Jn)===null?!1:Jn.x>=0&&Jn.y>=0&&Jn.x+Jn.y<=1}static getInterpolation(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,Jn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Jn.x),l.addScaledVector(a,Jn.y),l.addScaledVector(o,Jn.z),l)}static getInterpolatedAttribute(e,t,n,s,r,a){return nc.setScalar(0),ic.setScalar(0),sc.setScalar(0),nc.fromBufferAttribute(e,t),ic.fromBufferAttribute(e,n),sc.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(nc,r.x),a.addScaledVector(ic,r.y),a.addScaledVector(sc,r.z),a}static isFrontFacing(e,t,n,s){return bn.subVectors(n,t),jn.subVectors(e,t),bn.cross(jn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return bn.subVectors(this.c,this.b),jn.subVectors(this.a,this.b),bn.cross(jn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,a,o;ps.subVectors(s,n),ms.subVectors(r,n),Ql.subVectors(e,n);let l=ps.dot(Ql),c=ms.dot(Ql);if(l<=0&&c<=0)return t.copy(n);ec.subVectors(e,s);let h=ps.dot(ec),d=ms.dot(ec);if(h>=0&&d<=h)return t.copy(s);let u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(ps,a);tc.subVectors(e,r);let p=ps.dot(tc),g=ms.dot(tc);if(g>=0&&p<=g)return t.copy(r);let y=p*c-l*g;if(y<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(ms,o);let m=h*g-p*d;if(m<=0&&d-h>=0&&p-g>=0)return Eu.subVectors(r,s),o=(d-h)/(d-h+(p-g)),t.copy(s).addScaledVector(Eu,o);let f=1/(m+y+u);return a=y*f,o=u*f,t.copy(n).addScaledVector(ps,a).addScaledVector(ms,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},dn=class{constructor(e=new V(1/0,1/0,1/0),t=new V(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Tn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Tn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Tn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Tn):Tn.fromBufferAttribute(r,a),Tn.applyMatrix4(e.matrixWorld),this.expandByPoint(Tn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),xa.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),xa.copy(n.boundingBox)),xa.applyMatrix4(e.matrixWorld),this.union(xa)}let s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Tn),Tn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(cr),_a.subVectors(this.max,cr),gs.subVectors(e.a,cr),xs.subVectors(e.b,cr),_s.subVectors(e.c,cr),Mi.subVectors(xs,gs),bi.subVectors(_s,xs),zi.subVectors(gs,_s);let t=[0,-Mi.z,Mi.y,0,-bi.z,bi.y,0,-zi.z,zi.y,Mi.z,0,-Mi.x,bi.z,0,-bi.x,zi.z,0,-zi.x,-Mi.y,Mi.x,0,-bi.y,bi.x,0,-zi.y,zi.x,0];return!rc(t,gs,xs,_s,_a)||(t=[1,0,0,0,1,0,0,0,1],!rc(t,gs,xs,_s,_a))?!1:(va.crossVectors(Mi,bi),t=[va.x,va.y,va.z],rc(t,gs,xs,_s,_a))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Tn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Tn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Qn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Qn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Qn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Qn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Qn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Qn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Qn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Qn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Qn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Qn=[new V,new V,new V,new V,new V,new V,new V,new V],Tn=new V,xa=new dn,gs=new V,xs=new V,_s=new V,Mi=new V,bi=new V,zi=new V,cr=new V,_a=new V,va=new V,ki=new V;function rc(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){ki.fromArray(i,r);let o=s.x*Math.abs(ki.x)+s.y*Math.abs(ki.y)+s.z*Math.abs(ki.z),l=e.dot(ki),c=t.dot(ki),h=n.dot(ki);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}var ni=Rp();function Rp(){let i=new ArrayBuffer(4),e=new Float32Array(i),t=new Uint32Array(i),n=new Uint32Array(512),s=new Uint32Array(512);for(let l=0;l<256;++l){let c=l-127;c<-27?(n[l]=0,n[l|256]=32768,s[l]=24,s[l|256]=24):c<-14?(n[l]=1024>>-c-14,n[l|256]=1024>>-c-14|32768,s[l]=-c-1,s[l|256]=-c-1):c<=15?(n[l]=c+15<<10,n[l|256]=c+15<<10|32768,s[l]=13,s[l|256]=13):c<128?(n[l]=31744,n[l|256]=64512,s[l]=24,s[l|256]=24):(n[l]=31744,n[l|256]=64512,s[l]=13,s[l|256]=13)}let r=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,h=0;for(;(c&8388608)===0;)c<<=1,h-=8388608;c&=-8388609,h+=947912704,r[l]=c|h}for(let l=1024;l<2048;++l)r[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)a[l]=l<<23;a[31]=1199570944,a[32]=2147483648;for(let l=33;l<63;++l)a[l]=2147483648+(l-32<<23);a[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(o[l]=1024);return{floatView:e,uint32View:t,baseTable:n,shiftTable:s,mantissaTable:r,exponentTable:a,offsetTable:o}}function Cp(i){Math.abs(i)>65504&&Ce("DataUtils.toHalfFloat(): Value out of range."),i=$e(i,-65504,65504),ni.floatView[0]=i;let e=ni.uint32View[0],t=e>>23&511;return ni.baseTable[t]+((e&8388607)>>ni.shiftTable[t])}function Ip(i){let e=i>>10;return ni.uint32View[0]=ni.mantissaTable[ni.offsetTable[e]+(i&1023)]+ni.exponentTable[e],ni.floatView[0]}var Ai=class{static toHalfFloat(e){return Cp(e)}static fromHalfFloat(e){return Ip(e)}},Pt=new V,ya=new Ge,Pp=0,St=class extends Bn{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Pp++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Kc,this.updateRanges=[],this.gpuType=zt,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)ya.fromBufferAttribute(this,t),ya.applyMatrix3(e),this.setXY(t,ya.x,ya.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.applyMatrix3(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.applyMatrix4(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.applyNormalMatrix(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.transformDirection(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=En(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=rt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=En(t,this.array)),t}setX(e,t){return this.normalized&&(t=rt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=En(t,this.array)),t}setY(e,t){return this.normalized&&(t=rt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=En(t,this.array)),t}setZ(e,t){return this.normalized&&(t=rt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=En(t,this.array)),t}setW(e,t){return this.normalized&&(t=rt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=rt(t,this.array),n=rt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=rt(t,this.array),n=rt(n,this.array),s=rt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=rt(t,this.array),n=rt(n,this.array),s=rt(s,this.array),r=rt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}};var br=class extends St{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Tr=class extends St{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var Lt=class extends St{constructor(e,t,n){super(new Float32Array(e),t,n)}},Lp=new dn,hr=new V,ac=new V,nn=class{constructor(e=new V,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Lp.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;hr.subVectors(e,this.center);let t=hr.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(hr,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ac.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(hr.copy(e.center).add(ac)),this.expandByPoint(hr.copy(e.center).sub(ac))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Dp=0,xn=new ke,oc=new _t,vs=new V,un=new dn,ur=new dn,Ft=new V,Bt=class i extends Bn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Dp++}),this.uuid=Rn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(ep(e)?Tr:br)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Oe().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return xn.makeRotationFromQuaternion(e),this.applyMatrix4(xn),this}rotateX(e){return xn.makeRotationX(e),this.applyMatrix4(xn),this}rotateY(e){return xn.makeRotationY(e),this.applyMatrix4(xn),this}rotateZ(e){return xn.makeRotationZ(e),this.applyMatrix4(xn),this}translate(e,t,n){return xn.makeTranslation(e,t,n),this.applyMatrix4(xn),this}scale(e,t,n){return xn.makeScale(e,t,n),this.applyMatrix4(xn),this}lookAt(e){return oc.lookAt(e),oc.updateMatrix(),this.applyMatrix4(oc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(vs).negate(),this.translate(vs.x,vs.y,vs.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Lt(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Ce("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new dn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Fe("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new V(-1/0,-1/0,-1/0),new V(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];un.setFromBufferAttribute(r),this.morphTargetsRelative?(Ft.addVectors(this.boundingBox.min,un.min),this.boundingBox.expandByPoint(Ft),Ft.addVectors(this.boundingBox.max,un.max),this.boundingBox.expandByPoint(Ft)):(this.boundingBox.expandByPoint(un.min),this.boundingBox.expandByPoint(un.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Fe('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new nn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Fe("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new V,1/0);return}if(e){let n=this.boundingSphere.center;if(un.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];ur.setFromBufferAttribute(o),this.morphTargetsRelative?(Ft.addVectors(un.min,ur.min),un.expandByPoint(Ft),Ft.addVectors(un.max,ur.max),un.expandByPoint(Ft)):(un.expandByPoint(ur.min),un.expandByPoint(ur.max))}un.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)Ft.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Ft));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Ft.fromBufferAttribute(o,c),l&&(vs.fromBufferAttribute(e,c),Ft.add(vs)),s=Math.max(s,n.distanceToSquared(Ft))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Fe('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Fe("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv,a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new St(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));let o=[],l=[];for(let _=0;_<n.count;_++)o[_]=new V,l[_]=new V;let c=new V,h=new V,d=new V,u=new Ge,p=new Ge,g=new Ge,y=new V,m=new V;function f(_,E,D){c.fromBufferAttribute(n,_),h.fromBufferAttribute(n,E),d.fromBufferAttribute(n,D),u.fromBufferAttribute(r,_),p.fromBufferAttribute(r,E),g.fromBufferAttribute(r,D),h.sub(c),d.sub(c),p.sub(u),g.sub(u);let P=1/(p.x*g.y-g.x*p.y);isFinite(P)&&(y.copy(h).multiplyScalar(g.y).addScaledVector(d,-p.y).multiplyScalar(P),m.copy(d).multiplyScalar(p.x).addScaledVector(h,-g.x).multiplyScalar(P),o[_].add(y),o[E].add(y),o[D].add(y),l[_].add(m),l[E].add(m),l[D].add(m))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let _=0,E=M.length;_<E;++_){let D=M[_],P=D.start,z=D.count;for(let U=P,w=P+z;U<w;U+=3)f(e.getX(U+0),e.getX(U+1),e.getX(U+2))}let A=new V,S=new V,b=new V,T=new V;function C(_){b.fromBufferAttribute(s,_),T.copy(b);let E=o[_];A.copy(E),A.sub(b.multiplyScalar(b.dot(E))).normalize(),S.crossVectors(T,E);let P=S.dot(l[_])<0?-1:1;a.setXYZW(_,A.x,A.y,A.z,P)}for(let _=0,E=M.length;_<E;++_){let D=M[_],P=D.start,z=D.count;for(let U=P,w=P+z;U<w;U+=3)C(e.getX(U+0)),C(e.getX(U+1)),C(e.getX(U+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new St(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let u=0,p=n.count;u<p;u++)n.setXYZ(u,0,0,0);let s=new V,r=new V,a=new V,o=new V,l=new V,c=new V,h=new V,d=new V;if(e)for(let u=0,p=e.count;u<p;u+=3){let g=e.getX(u+0),y=e.getX(u+1),m=e.getX(u+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,y),a.fromBufferAttribute(t,m),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,y),c.fromBufferAttribute(n,m),o.add(h),l.add(h),c.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(y,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let u=0,p=t.count;u<p;u+=3)s.fromBufferAttribute(t,u+0),r.fromBufferAttribute(t,u+1),a.fromBufferAttribute(t,u+2),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Ft.fromBufferAttribute(e,t),Ft.normalize(),e.setXYZ(t,Ft.x,Ft.y,Ft.z)}toNonIndexed(){function e(o,l){let c=o.array,h=o.itemSize,d=o.normalized,u=new c.constructor(l.length*h),p=0,g=0;for(let y=0,m=l.length;y<m;y++){o.isInterleavedBufferAttribute?p=l[y]*o.data.stride+o.offset:p=l[y]*h;for(let f=0;f<h;f++)u[g++]=c[p++]}return new St(u,h,d)}if(this.index===null)return Ce("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let o in s){let l=s[o],c=e(l,n);t.setAttribute(o,c)}let r=this.morphAttributes;for(let o in r){let l=[],c=r[o];for(let h=0,d=c.length;h<d;h++){let u=c[h],p=e(u,n);l.push(p)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){let p=c[d];h.push(p.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(t))}let r=e.morphAttributes;for(let c in r){let h=[],d=r[c];for(let u=0,p=d.length;u<p;u++)h.push(d[u].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,h=a.length;c<h;c++){let d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},Ls=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Kc,this.updateRanges=[],this.version=0,this.uuid=Rn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Rn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Rn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}},Kt=new V,Ds=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Kt.fromBufferAttribute(this,t),Kt.applyMatrix4(e),this.setXYZ(t,Kt.x,Kt.y,Kt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Kt.fromBufferAttribute(this,t),Kt.applyNormalMatrix(e),this.setXYZ(t,Kt.x,Kt.y,Kt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Kt.fromBufferAttribute(this,t),Kt.transformDirection(e),this.setXYZ(t,Kt.x,Kt.y,Kt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=En(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=rt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=rt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=rt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=rt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=rt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=En(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=En(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=En(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=En(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=rt(t,this.array),n=rt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=rt(t,this.array),n=rt(n,this.array),s=rt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=rt(t,this.array),n=rt(n,this.array),s=rt(s,this.array),r=rt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){vr("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new St(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){vr("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},lc=new V,Np=new V,Up=new Oe,wn=class{constructor(e=new V(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=lc.subVectors(n,t).cross(Np.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let s=e.delta(lc),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Up.getNormalMatrix(e),s=this.coplanarPoint(lc).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},Fp=0,Zt=class extends Bn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Fp++}),this.uuid=Rn(),this.name="",this.type="Material",this.blending=Hs,this.side=Gn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Lc,this.blendDst=Dc,this.blendEquation=Ji,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ne(0,0,0),this.blendAlpha=0,this.depthFunc=ws,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=bd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ka,this.stencilZFail=ka,this.stencilZPass=ka,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){Ce(`Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Ce(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(t){let r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Ne().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new wn().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new Ge().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Ge().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}};var ei=new V,cc=new V,Sa=new V,Ma=new V,Yi=class{constructor(e=new V,t=new V(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ei)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=ei.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ei.copy(this.origin).addScaledVector(this.direction,t),ei.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){cc.copy(e).add(t).multiplyScalar(.5),Sa.copy(t).sub(e).normalize(),Ma.copy(this.origin).sub(cc);let r=e.distanceTo(t)*.5,a=-this.direction.dot(Sa),o=Ma.dot(this.direction),l=-Ma.dot(Sa),c=Ma.lengthSq(),h=Math.abs(1-a*a),d,u,p,g;if(h>0)if(d=a*l-o,u=a*o-l,g=r*h,d>=0)if(u>=-g)if(u<=g){let y=1/h;d*=y,u*=y,p=d*(d+a*u+2*o)+u*(a*d+u+2*l)+c}else u=r,d=Math.max(0,-(a*u+o)),p=-d*d+u*(u+2*l)+c;else u=-r,d=Math.max(0,-(a*u+o)),p=-d*d+u*(u+2*l)+c;else u<=-g?(d=Math.max(0,-(-a*r+o)),u=d>0?-r:Math.min(Math.max(-r,-l),r),p=-d*d+u*(u+2*l)+c):u<=g?(d=0,u=Math.min(Math.max(-r,-l),r),p=u*(u+2*l)+c):(d=Math.max(0,-(a*r+o)),u=d>0?r:Math.min(Math.max(-r,-l),r),p=-d*d+u*(u+2*l)+c);else u=a>0?-r:r,d=Math.max(0,-(a*u+o)),p=-d*d+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(cc).addScaledVector(Sa,u),p}intersectSphere(e,t){if(e.radius<0)return null;ei.subVectors(e.center,this.origin);let n=ei.dot(this.direction),s=ei.dot(ei)-n*n,r=e.radius*e.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l,c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(n=(e.min.x-u.x)*c,s=(e.max.x-u.x)*c):(n=(e.max.x-u.x)*c,s=(e.min.x-u.x)*c),h>=0?(r=(e.min.y-u.y)*h,a=(e.max.y-u.y)*h):(r=(e.max.y-u.y)*h,a=(e.min.y-u.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),d>=0?(o=(e.min.z-u.z)*d,l=(e.max.z-u.z)*d):(o=(e.max.z-u.z)*d,l=(e.min.z-u.z)*d),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,ei)!==null}intersectTriangle(e,t,n,s,r){let a=this.origin,o=this.direction,l=o.x,c=o.y,h=o.z,d=e.x-a.x,u=e.y-a.y,p=e.z-a.z,g=t.x-a.x,y=t.y-a.y,m=t.z-a.z,f=n.x-a.x,M=n.y-a.y,A=n.z-a.z,S=Math.abs(l),b=Math.abs(c),T=Math.abs(h),C,_,E,D,P,z,U,w,O,W,$,Q;if(S>=b&&S>=T?(E=l,z=d,O=g,Q=f,l>=0?(C=c,_=h,D=u,P=p,U=y,w=m,W=M,$=A):(C=h,_=c,D=p,P=u,U=m,w=y,W=A,$=M)):b>=T?(E=c,z=u,O=y,Q=M,c>=0?(C=h,_=l,D=p,P=d,U=m,w=g,W=A,$=f):(C=l,_=h,D=d,P=p,U=g,w=m,W=f,$=A)):(E=h,z=p,O=m,Q=A,h>=0?(C=l,_=c,D=d,P=u,U=g,w=y,W=f,$=M):(C=c,_=l,D=u,P=d,U=y,w=g,W=M,$=f)),E===0)return null;let Y=C/E,j=_/E,se=1/E,ae=D-Y*z,Me=P-j*z,Ue=U-Y*O,_e=w-j*O,Je=W-Y*Q,J=$-j*Q,te=Je*_e-J*Ue,Se=ae*J-Me*Je,De=Ue*Me-_e*ae;if(s){if(te<0||Se<0||De<0)return null}else if((te<0||Se<0||De<0)&&(te>0||Se>0||De>0))return null;let ye=te+Se+De;if(ye===0)return null;let Ve=se*(te*z+Se*O+De*Q);return(ye>0?Ve<0:Ve>0)?null:this.at(Ve/ye,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},jt=class extends Zt{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ne(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new si,this.combine=Nc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Au=new ke,Vi=new Yi,ba=new nn,Ru=new V,Ta=new V,wa=new V,Ea=new V,hc=new V,Aa=new V,Cu=new V,Ra=new V,ht=class extends _t{constructor(e=new Bt,t=new jt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let o=this.morphTargetInfluences;if(r&&o){Aa.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=o[l],d=r[l];h!==0&&(hc.fromBufferAttribute(d,e),a?Aa.addScaledVector(hc,h):Aa.addScaledVector(hc.sub(t),h))}t.add(Aa)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ba.copy(n.boundingSphere),ba.applyMatrix4(r),Vi.copy(e.ray).recast(e.near),!(ba.containsPoint(Vi.origin)===!1&&(Vi.intersectSphere(ba,Ru)===null||Vi.origin.distanceToSquared(Ru)>(e.far-e.near)**2))&&(Au.copy(r).invert(),Vi.copy(e.ray).applyMatrix4(Au),!(n.boundingBox!==null&&Vi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Vi)))}_computeIntersections(e,t,n){let s,r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,y=u.length;g<y;g++){let m=u[g],f=a[m.materialIndex],M=Math.max(m.start,p.start),A=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let S=M,b=A;S<b;S+=3){let T=o.getX(S),C=o.getX(S+1),_=o.getX(S+2);s=Ca(this,f,e,n,c,h,d,T,C,_),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,p.start),y=Math.min(o.count,p.start+p.count);for(let m=g,f=y;m<f;m+=3){let M=o.getX(m),A=o.getX(m+1),S=o.getX(m+2);s=Ca(this,a,e,n,c,h,d,M,A,S),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,y=u.length;g<y;g++){let m=u[g],f=a[m.materialIndex],M=Math.max(m.start,p.start),A=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let S=M,b=A;S<b;S+=3){let T=S,C=S+1,_=S+2;s=Ca(this,f,e,n,c,h,d,T,C,_),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,p.start),y=Math.min(l.count,p.start+p.count);for(let m=g,f=y;m<f;m+=3){let M=m,A=m+1,S=m+2;s=Ca(this,a,e,n,c,h,d,M,A,S),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}};function Op(i,e,t,n,s,r,a,o){let l;if(e.side===Jt?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===Gn,o),l===null)return null;Ra.copy(o),Ra.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(Ra);return c<t.near||c>t.far?null:{distance:c,point:Ra.clone(),object:i}}function Ca(i,e,t,n,s,r,a,o,l,c){i.getVertexPosition(o,Ta),i.getVertexPosition(l,wa),i.getVertexPosition(c,Ea);let h=Op(i,e,t,n,Ta,wa,Ea,Cu);if(h){let d=new V;Ei.getBarycoord(Cu,Ta,wa,Ea,d),s&&(h.uv=Ei.getInterpolatedAttribute(s,o,l,c,d,new Ge)),r&&(h.uv1=Ei.getInterpolatedAttribute(r,o,l,c,d,new Ge)),a&&(h.normal=Ei.getInterpolatedAttribute(a,o,l,c,d,new V),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let u={a:o,b:l,c,normal:new V,materialIndex:0};Ei.getNormal(Ta,wa,Ea,u.normal),h.face=u,h.barycoord=d}return h}var dr=new at,Iu=new at,Pu=new at,Bp=new at,Lu=new ke,Ia=new V,uc=new nn,Du=new ke,dc=new Yi,wr=class extends ht{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=gc,this.bindMatrix=new ke,this.bindMatrixInverse=new ke,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new dn),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Ia),this.boundingBox.expandByPoint(Ia)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new nn),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Ia),this.boundingSphere.expandByPoint(Ia)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,s=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),uc.copy(this.boundingSphere),uc.applyMatrix4(s),e.ray.intersectsSphere(uc)!==!1&&(Du.copy(s).invert(),dc.copy(e.ray).applyMatrix4(Du),!(this.boundingBox!==null&&dc.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,dc)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new at,t=this.geometry.attributes.skinWeight;for(let n=0,s=t.count;n<s;n++){e.fromBufferAttribute(t,n);let r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===gc?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===vd?this.bindMatrixInverse.copy(this.bindMatrix).invert():Ce("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,s=this.geometry;Iu.fromBufferAttribute(s.attributes.skinIndex,e),Pu.fromBufferAttribute(s.attributes.skinWeight,e),t.isVector4?(dr.copy(t),t.set(0,0,0,0)):(dr.set(...t,1),t.set(0,0,0)),dr.applyMatrix4(this.bindMatrix);for(let r=0;r<4;r++){let a=Pu.getComponent(r);if(a!==0){let o=Iu.getComponent(r);Lu.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector(Bp.copy(dr).applyMatrix4(Lu),a)}}return t.isVector4&&(t.w=dr.w),t.applyMatrix4(this.bindMatrixInverse)}},Ns=class extends _t{constructor(){super(),this.isBone=!0,this.type="Bone"}},zn=class extends bt{constructor(e=null,t=1,n=1,s,r,a,o,l,c=Mt,h=Mt,d,u){super(null,a,o,l,c,h,s,r,d,u),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Nu=new ke,zp=new ke,Er=class i{constructor(e=[],t=[]){this.uuid=Rn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){Ce("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,s=this.bones.length;n<s;n++)this.boneInverses.push(new ke)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let n=new ke;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,s=this.boneTexture;for(let r=0,a=e.length;r<a;r++){let o=e[r]?e[r].matrixWorld:zp;Nu.multiplyMatrices(o,t[r]),Nu.toArray(n,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new i(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new zn(t,e,e,en,zt);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let s=this.bones[t];if(s.name===e)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,s=e.bones.length;n<s;n++){let r=e.bones[n],a=t[r];a===void 0&&(Ce("Skeleton: No bone found with UUID:",r),a=new Ns),this.bones.push(a),this.boneInverses.push(new ke().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let s=0,r=t.length;s<r;s++){let a=t[s];e.bones.push(a.uuid);let o=n[s];e.boneInverses.push(o.toArray())}return e}},ri=class extends St{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},ys=new ke,Uu=new ke,Pa=[],Fu=new dn,kp=new ke,fr=new ht,pr=new nn,Ar=class extends ht{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new ri(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,kp)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new dn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ys),Fu.copy(e.boundingBox).applyMatrix4(ys),this.boundingBox.union(Fu)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new nn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ys),pr.copy(e.boundingSphere).applyMatrix4(ys),this.boundingSphere.union(pr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(fr.geometry=this.geometry,fr.material=this.material,fr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),pr.copy(this.boundingSphere),pr.applyMatrix4(n),e.ray.intersectsSphere(pr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,ys),Uu.multiplyMatrices(n,ys),fr.matrixWorld=Uu,fr.raycast(e,Pa);for(let a=0,o=Pa.length;a<o;a++){let l=Pa[a];l.instanceId=r,l.object=this,t.push(l)}Pa.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new ri(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new zn(new Float32Array(s*this.count),s,this.count,yo,zt));let r=this.morphTexture.source.data.data,a=0;for(let c=0;c<n.length;c++)a+=n[c];let o=this.geometry.morphTargetsRelative?1:1-a,l=s*e;return r[l]=o,r.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Hi=new nn,Vp=new Ge(.5,.5),La=new V,Us=class{constructor(e=new wn,t=new wn,n=new wn,s=new wn,r=new wn,a=new wn){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=An,n=!1){let s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],d=r[5],u=r[6],p=r[7],g=r[8],y=r[9],m=r[10],f=r[11],M=r[12],A=r[13],S=r[14],b=r[15];if(s[0].setComponents(c-a,p-h,f-g,b-M).normalize(),s[1].setComponents(c+a,p+h,f+g,b+M).normalize(),s[2].setComponents(c+o,p+d,f+y,b+A).normalize(),s[3].setComponents(c-o,p-d,f-y,b-A).normalize(),n)s[4].setComponents(l,u,m,S).normalize(),s[5].setComponents(c-l,p-u,f-m,b-S).normalize();else if(s[4].setComponents(c-l,p-u,f-m,b-S).normalize(),t===An)s[5].setComponents(c+l,p+u,f+m,b+S).normalize();else if(t===As)s[5].setComponents(l,u,m,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Hi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Hi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Hi)}intersectsSprite(e){Hi.center.set(0,0,0);let t=Vp.distanceTo(e.center);return Hi.radius=.7071067811865476+t,Hi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Hi)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(La.x=s.normal.x>0?e.max.x:e.min.x,La.y=s.normal.y>0?e.max.y:e.min.y,La.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(La)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Fs=class extends Zt{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ne(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Ja=new V,Qa=new V,Ou=new ke,mr=new Yi,Da=new nn,fc=new V,Bu=new V,$i=class extends _t{constructor(e=new Bt,t=new Fs){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Ja.fromBufferAttribute(t,s-1),Qa.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Ja.distanceTo(Qa);e.setAttribute("lineDistance",new Lt(n,1))}else Ce("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Da.copy(n.boundingSphere),Da.applyMatrix4(s),Da.radius+=r,e.ray.intersectsSphere(Da)===!1)return;Ou.copy(s).invert(),mr.copy(e.ray).applyMatrix4(Ou);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,u=n.attributes.position;if(h!==null){let p=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let y=p,m=g-1;y<m;y+=c){let f=h.getX(y),M=h.getX(y+1),A=Na(this,e,mr,l,f,M,y);A&&t.push(A)}if(this.isLineLoop){let y=h.getX(g-1),m=h.getX(p),f=Na(this,e,mr,l,y,m,g-1);f&&t.push(f)}}else{let p=Math.max(0,a.start),g=Math.min(u.count,a.start+a.count);for(let y=p,m=g-1;y<m;y+=c){let f=Na(this,e,mr,l,y,y+1,y);f&&t.push(f)}if(this.isLineLoop){let y=Na(this,e,mr,l,g-1,p,g-1);y&&t.push(y)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function Na(i,e,t,n,s,r,a){let o=i.geometry.attributes.position;if(Ja.fromBufferAttribute(o,s),Qa.fromBufferAttribute(o,r),t.distanceSqToSegment(Ja,Qa,fc,Bu)>n)return;fc.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(fc);if(!(c<e.near||c>e.far))return{distance:c,point:Bu.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}var zu=new V,ku=new V,Rr=class extends $i{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)zu.fromBufferAttribute(t,s),ku.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+zu.distanceTo(ku);e.setAttribute("lineDistance",new Lt(n,1))}else Ce("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},Cr=class extends $i{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},Os=class extends Zt{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ne(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Vu=new ke,Sc=new Yi,Ua=new nn,Fa=new V,Ir=class extends _t{constructor(e=new Bt,t=new Os){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ua.copy(n.boundingSphere),Ua.applyMatrix4(s),Ua.radius+=r,e.ray.intersectsSphere(Ua)===!1)return;Vu.copy(s).invert(),Sc.copy(e.ray).applyMatrix4(Vu);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,d=n.attributes.position;if(c!==null){let u=Math.max(0,a.start),p=Math.min(c.count,a.start+a.count);for(let g=u,y=p;g<y;g++){let m=c.getX(g);Fa.fromBufferAttribute(d,m),Hu(Fa,m,l,s,e,t,this)}}else{let u=Math.max(0,a.start),p=Math.min(d.count,a.start+a.count);for(let g=u,y=p;g<y;g++)Fa.fromBufferAttribute(d,g),Hu(Fa,g,l,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function Hu(i,e,t,n,s,r,a){let o=Sc.distanceSqToPoint(i);if(o<t){let l=new V;Sc.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}var Pr=class extends bt{constructor(e=[],t=Pi,n,s,r,a,o,l,c,h){super(e,t,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Ri=class extends bt{constructor(e,t,n,s,r,a,o,l,c){super(e,t,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Ci=class extends bt{constructor(e,t,n=In,s,r,a,o=Mt,l=Mt,c,h=On,d=1){if(h!==On&&h!==Li)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let u={width:e,height:t,depth:d};super(u,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Is(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},eo=class extends Ci{constructor(e,t=In,n=Pi,s,r,a=Mt,o=Mt,l,c=On){let h={width:e,height:e,depth:1},d=[h,h,h,h,h,h];super(e,e,t,n,s,r,a,o,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Lr=class extends bt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Bs=class i extends Bt{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let l=[],c=[],h=[],d=[],u=0,p=0;g("z","y","x",-1,-1,n,t,e,a,r,0),g("z","y","x",1,-1,n,t,-e,a,r,1),g("x","z","y",1,1,e,n,t,s,a,2),g("x","z","y",1,-1,e,n,-t,s,a,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new Lt(c,3)),this.setAttribute("normal",new Lt(h,3)),this.setAttribute("uv",new Lt(d,2));function g(y,m,f,M,A,S,b,T,C,_,E){let D=S/C,P=b/_,z=S/2,U=b/2,w=T/2,O=C+1,W=_+1,$=0,Q=0,Y=new V;for(let j=0;j<W;j++){let se=j*P-U;for(let ae=0;ae<O;ae++){let Me=ae*D-z;Y[y]=Me*M,Y[m]=se*A,Y[f]=w,c.push(Y.x,Y.y,Y.z),Y[y]=0,Y[m]=0,Y[f]=T>0?1:-1,h.push(Y.x,Y.y,Y.z),d.push(ae/C),d.push(1-j/_),$+=1}}for(let j=0;j<_;j++)for(let se=0;se<C;se++){let ae=u+se+O*j,Me=u+se+O*(j+1),Ue=u+(se+1)+O*(j+1),_e=u+(se+1)+O*j;l.push(ae,Me,_e),l.push(Me,Ue,_e),Q+=6}o.addGroup(p,Q,E),p+=Q,u+=$}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};var sn=class i extends Bt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,d=e/o,u=t/l,p=[],g=[],y=[],m=[];for(let f=0;f<h;f++){let M=f*u-a;for(let A=0;A<c;A++){let S=A*d-r;g.push(S,-M,0),y.push(0,0,1),m.push(A/o),m.push(1-f/l)}}for(let f=0;f<l;f++)for(let M=0;M<o;M++){let A=M+c*f,S=M+c*(f+1),b=M+1+c*(f+1),T=M+1+c*f;p.push(A,S,T),p.push(S,b,T)}this.setIndex(p),this.setAttribute("position",new Lt(g,3)),this.setAttribute("normal",new Lt(y,3)),this.setAttribute("uv",new Lt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}};var Dr=class extends Zt{constructor(e){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new Ne(0),this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.fog=e.fog,this}};function ts(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];if(Gu(s))s.isRenderTargetTexture?(Ce("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone();else if(Array.isArray(s))if(Gu(s[0])){let r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[t][n]=r}else e[t][n]=s.slice();else e[t][n]=s}}return e}function Yt(i){let e={};for(let t=0;t<i.length;t++){let n=ts(i[t]);for(let s in n)e[s]=n[s]}return e}function Gu(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function Hp(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Qc(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ye.workingColorSpace}var Ud={clone:ts,merge:Yt},Gp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Wp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,fn=class extends Zt{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Gp,this.fragmentShader=Wp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ts(e.uniforms),this.uniformsGroups=Hp(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let s=e.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=t[s.value]||null;break;case"c":this.uniforms[n].value=new Ne().setHex(s.value);break;case"v2":this.uniforms[n].value=new Ge().fromArray(s.value);break;case"v3":this.uniforms[n].value=new V().fromArray(s.value);break;case"v4":this.uniforms[n].value=new at().fromArray(s.value);break;case"m3":this.uniforms[n].value=new Oe().fromArray(s.value);break;case"m4":this.uniforms[n].value=new ke().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},to=class extends fn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},ai=class extends Zt{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ne(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ne(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=el,this.normalScale=new Ge(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new si,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},qt=class extends ai{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Ge(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return $e(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ne(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ne(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ne(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var Ii=class extends Zt{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Sd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},no=class extends Zt{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function wi(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function Va(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}function Xp(i){function e(s,r){return i[s]-i[r]}let t=i.length,n=new Array(t);for(let s=0;s!==t;++s)n[s]=s;return n.sort(e),n}function Wu(i,e,t){let n=i.length,s=new i.constructor(n);for(let r=0,a=0;a!==n;++r){let o=t[r]*e;for(let l=0;l!==e;++l)s[a++]=i[o+l]}return s}function qp(i,e,t,n){let s=1,r=i[0];for(;r!==void 0&&r[n]===void 0;)r=i[s++];if(r===void 0)return;let a=r[n];if(a!==void 0)if(Array.isArray(a))do a=r[n],a!==void 0&&(e.push(r.time),t.push(...a)),r=i[s++];while(r!==void 0);else if(a.toArray!==void 0)do a=r[n],a!==void 0&&(e.push(r.time),a.toArray(t,t.length)),r=i[s++];while(r!==void 0);else do a=r[n],a!==void 0&&(e.push(r.time),t.push(a)),r=i[s++];while(r!==void 0)}var kn=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let a;t:{i:if(!(e<s)){for(let o=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=t[++n],e<s)break e}a=t.length;break t}if(!(e>=r)){let o=t[1];e<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}a=n,n=0;break t}break n}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},io=class extends kn{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:_c,endingEnd:_c}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,a=e+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case vc:r=e,o=2*t-n;break;case yc:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case vc:a=e,l=2*n-t;break;case yc:a=1,l=n+s[1]-s[0];break;default:a=e-1,l=t}let c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,d=this._offsetNext,u=this._weightPrev,p=this._weightNext,g=(n-t)/(s-t),y=g*g,m=y*g,f=-u*m+2*u*y-u*g,M=(1+u)*m+(-1.5-2*u)*y+(-.5+u)*g+1,A=(-1-p)*m+(1.5+p)*y+.5*g,S=p*m-p*y;for(let b=0;b!==o;++b)r[b]=f*a[h+b]+M*a[c+b]+A*a[l+b]+S*a[d+b];return r}},so=class extends kn{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(n-t)/(s-t),d=1-h;for(let u=0;u!==o;++u)r[u]=a[c+u]*d+a[l+u]*h;return r}},ro=class extends kn{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},ao=class extends kn{interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this.inTangents,d=this.outTangents;if(!h||!d){let g=(n-t)/(s-t),y=1-g;for(let m=0;m!==o;++m)r[m]=a[c+m]*y+a[l+m]*g;return r}let u=o*2,p=e-1;for(let g=0;g!==o;++g){let y=a[c+g],m=a[l+g],f=p*u+g*2,M=d[f],A=d[f+1],S=e*u+g*2,b=h[S],T=h[S+1],C=$p(n,t,M,b,s);r[g]=Fd(C,y,A,T,m)}return r}};function Fd(i,e,t,n,s){let r=1-i;return r*r*r*e+3*r*r*i*t+3*r*i*i*n+i*i*i*s}function Yp(i,e,t,n,s){let r=1-i;return 3*r*r*(t-e)+6*r*i*(n-t)+3*i*i*(s-n)}function $p(i,e,t,n,s){let r=(i-e)/(s-e);for(let a=0;a<8;a++){let o=Fd(r,e,t,n,s)-i;if(Math.abs(o)<1e-10)break;let l=Yp(r,e,t,n,s);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-o/l))}return r}var rn=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=wi(t,this.TimeBufferType),this.values=wi(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:wi(e.times,Array),values:wi(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s),Va(e.settings)&&(n.settings={inTangents:wi(e.settings.inTangents,Array),outTangents:wi(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new ro(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new so(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new io(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new ao(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Wi:t=this.InterpolantFactoryMethodDiscrete;break;case Xi:t=this.InterpolantFactoryMethodLinear;break;case za:t=this.InterpolantFactoryMethodSmooth;break;case xc:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Ce("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Wi;case this.InterpolantFactoryMethodLinear:return Xi;case this.InterpolantFactoryMethodSmooth:return za;case this.InterpolantFactoryMethodBezier:return xc}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e;Va(this.settings)&&(Xu(this.settings.inTangents,e),Xu(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(Fe("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(Fe("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){Fe("KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){Fe("KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(s!==void 0&&tp(s))for(let o=0,l=s.length;o!==l;++o){let c=s[o];if(isNaN(c)){Fe("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===za,r=e.length-1,a=1;for(let o=1;o<r;++o){let l=!1,c=e[o],h=e[o+1];if(c!==h&&(o!==1||c!==e[0]))if(s)l=!0;else{let d=o*n,u=d-n,p=d+n;for(let g=0;g!==n;++g){let y=t[d+g];if(y!==t[u+g]||y!==t[p+g]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let d=o*n,u=a*n;for(let p=0;p!==n;++p)t[u+p]=t[d+p]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,Va(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function Xu(i,e){for(let t=0,n=i.length;t!==n;t+=2)i[t]*=e}rn.prototype.ValueTypeName="";rn.prototype.TimeBufferType=Float32Array;rn.prototype.ValueBufferType=Float32Array;rn.prototype.DefaultInterpolation=Xi;var oi=class extends rn{constructor(e,t,n){super(e,t,n)}};oi.prototype.ValueTypeName="bool";oi.prototype.ValueBufferType=Array;oi.prototype.DefaultInterpolation=Wi;oi.prototype.InterpolantFactoryMethodLinear=void 0;oi.prototype.InterpolantFactoryMethodSmooth=void 0;var Nr=class extends rn{constructor(e,t,n,s){super(e,t,n,s)}};Nr.prototype.ValueTypeName="color";var li=class extends rn{constructor(e,t,n,s){super(e,t,n,s)}};li.prototype.ValueTypeName="number";var oo=class extends kn{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(s-t),c=e*o;for(let h=c+o;c!==h;c+=4)Xt.slerpFlat(r,0,a,c-o,a,c,l);return r}},Vn=class extends rn{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new oo(this.times,this.values,this.getValueSize(),e)}};Vn.prototype.ValueTypeName="quaternion";Vn.prototype.InterpolantFactoryMethodSmooth=void 0;var ci=class extends rn{constructor(e,t,n){super(e,t,n)}};ci.prototype.ValueTypeName="string";ci.prototype.ValueBufferType=Array;ci.prototype.DefaultInterpolation=Wi;ci.prototype.InterpolantFactoryMethodLinear=void 0;ci.prototype.InterpolantFactoryMethodSmooth=void 0;var hi=class extends rn{constructor(e,t,n,s){super(e,t,n,s)}};hi.prototype.ValueTypeName="vector";var zs=class{constructor(e="",t=-1,n=[],s=yd){this.name=e,this.tracks=n,this.duration=t,this.blendMode=s,this.uuid=Rn(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,s=1/(e.fps||1);for(let a=0,o=n.length;a!==o;++a)t.push(Zp(n[a]).scale(s));let r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){let t=[],n=e.tracks,s={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,a=n.length;r!==a;++r)t.push(rn.toJSON(n[r]));return s}static CreateFromMorphTargetSequence(e,t,n,s){let r=t.length,a=[];for(let o=0;o<r;o++){let l=[],c=[];l.push((o+r-1)%r,o,(o+1)%r),c.push(0,1,0);let h=Xp(l);l=Wu(l,1,h),c=Wu(c,1,h),!s&&l[0]===0&&(l.push(r),c.push(c[0])),a.push(new li(".morphTargetInfluences["+t[o].name+"]",l,c).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let s=e;n=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<n.length;s++)if(n[s].name===t)return n[s];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let s={},r=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){let c=e[o],h=c.name.match(r);if(h&&h.length>1){let d=h[1],u=s[d];u||(s[d]=u=[]),u.push(c)}}let a=[];for(let o in s)a.push(this.CreateFromMorphTargetSequence(o,s[o],t,n));return a}resetDuration(){let e=this.tracks,t=0;for(let n=0,s=e.length;n!==s;++n){let r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};function Kp(i){switch(i.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return li;case"vector":case"vector2":case"vector3":case"vector4":return hi;case"color":return Nr;case"quaternion":return Vn;case"bool":case"boolean":return oi;case"string":return ci}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+i)}function Zp(i){if(i.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=Kp(i.type);if(i.times===void 0){let n=[],s=[];qp(i.keys,n,s,"value"),i.times=n,i.values=s}let t;return e.parse!==void 0?t=e.parse(i):t=new e(i.name,i.times,i.values,i.interpolation),Va(i.settings)&&(t.settings={inTangents:wi(i.settings.inTangents,Float32Array),outTangents:wi(i.settings.outTangents,Float32Array)}),t}var Fn={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(qu(i)||(this.files[i]=e))},get:function(i){if(this.enabled!==!1&&!qu(i))return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};function qu(i){try{let e=i.slice(i.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}var lo=class{constructor(e,t,n){let s=this,r=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,d){return c.push(h,d),this},this.removeHandler=function(h){let d=c.indexOf(h);return d!==-1&&c.splice(d,2),this},this.getHandler=function(h){for(let d=0,u=c.length;d<u;d+=2){let p=c[d],g=c[d+1];if(p.global&&(p.lastIndex=0),p.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Od=new lo,Cn=class{constructor(e){this.manager=e!==void 0?e:Od,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};Cn.DEFAULT_MATERIAL_NAME="__DEFAULT";var ti={},Mc=class extends Error{constructor(e,t){super(e),this.response=t}},Ki=class extends Cn{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=Fn.get(`file:${e}`);if(r!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0);return}if(ti[e]!==void 0){ti[e].push({onLoad:t,onProgress:n,onError:s});return}ti[e]=[],ti[e].push({onLoad:t,onProgress:n,onError:s});let a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&Ce("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;let h=ti[e],d=c.body.getReader(),u=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),p=u?parseInt(u):0,g=p!==0,y=0,m=new ReadableStream({start(f){M();function M(){d.read().then(({done:A,value:S})=>{if(A)f.close();else{y+=S.byteLength;let b=new ProgressEvent("progress",{lengthComputable:g,loaded:y,total:p});for(let T=0,C=h.length;T<C;T++){let _=h[T];_.onProgress&&_.onProgress(b)}f.enqueue(S),M()}},A=>{f.error(A)})}}});return new Response(m)}else throw new Mc(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return c.json();default:if(o==="")return c.text();{let d=/charset="?([^;"\s]*)"?/i.exec(o),u=d&&d[1]?d[1].toLowerCase():void 0,p=new TextDecoder(u);return c.arrayBuffer().then(g=>p.decode(g))}}}).then(c=>{Fn.add(`file:${e}`,c);let h=ti[e];delete ti[e];for(let d=0,u=h.length;d<u;d++){let p=h[d];p.onLoad&&p.onLoad(c)}}).catch(c=>{let h=ti[e];if(h===void 0)throw this.manager.itemError(e),c;delete ti[e];for(let d=0,u=h.length;d<u;d++){let p=h[d];p.onError&&p.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var Ss=new WeakMap,co=class extends Cn{constructor(e){super(e)}load(e,t,n,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,a=Fn.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);else{let d=Ss.get(a);d===void 0&&(d=[],Ss.set(a,d)),d.push({onLoad:t,onError:s})}return a}let o=Rs("img");function l(){h(),t&&t(this);let d=Ss.get(this)||[];for(let u=0;u<d.length;u++){let p=d[u];p.onLoad&&p.onLoad(this)}Ss.delete(this),r.manager.itemEnd(e)}function c(d){h(),s&&s(d),Fn.remove(`image:${e}`);let u=Ss.get(this)||[];for(let p=0;p<u.length;p++){let g=u[p];g.onError&&g.onError(d)}Ss.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),Fn.add(`image:${e}`,o),r.manager.itemStart(e),o.src=e,o}};var Ur=class extends Cn{constructor(e){super(e)}load(e,t,n,s){let r=this,a=new zn,o=new Ki(this.manager);return o.setResponseType("arraybuffer"),o.setRequestHeader(this.requestHeader),o.setPath(this.path),o.setWithCredentials(r.withCredentials),o.load(e,function(l){let c;try{c=r.parse(l)}catch(h){s!==void 0?s(h):Fe(h);return}r._applyTexData(a,c),t&&t(a,c)},n,s),a}createDataTexture(e){let t=new zn;return this._applyTexData(t,this.parse(e)),t}_applyTexData(e,t){t.image!==void 0?e.image=t.image:t.data!==void 0&&(e.image.width=t.width,e.image.height=t.height,e.image.data=t.data),e.wrapS=t.wrapS!==void 0?t.wrapS:Ot,e.wrapT=t.wrapT!==void 0?t.wrapT:Ot,e.magFilter=t.magFilter!==void 0?t.magFilter:pt,e.minFilter=t.minFilter!==void 0?t.minFilter:pt,e.anisotropy=t.anisotropy!==void 0?t.anisotropy:1,t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.mipmaps!==void 0&&(e.mipmaps=t.mipmaps,e.minFilter=vn),t.mipmapCount===1&&(e.minFilter=pt),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),e.needsUpdate=!0}},ui=class extends Cn{constructor(e){super(e)}load(e,t,n,s){let r=new bt,a=new co(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},n,s),r}},Zi=class extends _t{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ne(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},Fr=class extends Zi{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(_t.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ne(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},pc=new ke,Yu=new V,$u=new V,ks=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ge(512,512),this.mapType=an,this.map=null,this.mapPass=null,this.matrix=new ke,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Us,this._frameExtents=new Ge(1,1),this._viewportCount=1,this._viewports=[new at(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Yu.setFromMatrixPosition(e.matrixWorld),t.position.copy(Yu),$u.setFromMatrixPosition(e.target.matrixWorld),t.lookAt($u),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,s){pc.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(pc,e.coordinateSystem,e.reversedDepth);let r=this._frameExtents,a=s?s.z/r.x:1,o=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;e.coordinateSystem===As||e.reversedDepth?t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(pc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Oa=new V,Ba=new Xt,Un=new V,Or=class extends _t{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ke,this.projectionMatrix=new ke,this.projectionMatrixInverse=new ke,this.coordinateSystem=An,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Oa,Ba,Un),Un.x===1&&Un.y===1&&Un.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Oa,Ba,Un.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Oa,Ba,Un),Un.x===1&&Un.y===1&&Un.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Oa,Ba,Un.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Ti=new V,Ku=new Ge,Zu=new Ge,wt=class extends Or{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=qi*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(gr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return qi*2*Math.atan(Math.tan(gr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Ti.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ti.x,Ti.y).multiplyScalar(-e/Ti.z),Ti.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ti.x,Ti.y).multiplyScalar(-e/Ti.z)}getViewSize(e,t){return this.getViewBounds(e,Ku,Zu),t.subVectors(Zu,Ku)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(gr*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},bc=class extends ks{constructor(){super(new wt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=qi*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){let e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}},Br=class extends Zi{constructor(e,t,n=0,s=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(_t.DEFAULT_UP),this.updateMatrix(),this.target=new _t,this.distance=n,this.angle=s,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new bc}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},Tc=class extends ks{constructor(){super(new wt(90,1,.5,500)),this.isPointLightShadow=!0}},zr=class extends Zi{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Tc}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},Hn=class extends Or{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},wc=class extends ks{constructor(){super(new Hn(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},di=class extends Zi{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(_t.DEFAULT_UP),this.updateMatrix(),this.target=new _t,this.shadow=new wc}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}};var fi=class{static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}};var mc=new WeakMap,kr=class extends Cn{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&Ce("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&Ce("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,a=Fn.get(`image-bitmap:${e}`);if(a!==void 0){if(r.manager.itemStart(e),a.then){a.then(c=>{mc.has(a)===!0?(s&&s(mc.get(a)),r.manager.itemError(e),r.manager.itemEnd(e)):(t&&t(c),r.manager.itemEnd(e))});return}setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);return}let o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let l=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign({},r.options,{colorSpaceConversion:"none"}))}).then(function(c){return Fn.add(`image-bitmap:${e}`,c),t&&t(c),r.manager.itemEnd(e),c}).catch(function(c){s&&s(c),mc.set(l,c),Fn.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});Fn.add(`image-bitmap:${e}`,l),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var Ms=-90,bs=1,ho=class extends _t{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new wt(Ms,bs,e,t);s.layers=this.layers,this.add(s);let r=new wt(Ms,bs,e,t);r.layers=this.layers,this.add(r);let a=new wt(Ms,bs,e,t);a.layers=this.layers,this.add(a);let o=new wt(Ms,bs,e,t);o.layers=this.layers,this.add(o);let l=new wt(Ms,bs,e,t);l.layers=this.layers,this.add(l);let c=new wt(Ms,bs,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,l]=t;for(let c of t)this.remove(c);if(e===An)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===As)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,l,c,h]=this.children,d=e.getRenderTarget(),u=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let y=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=y,e.setRenderTarget(n,5,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(d,u,p),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},uo=class extends wt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var eh="\\[\\]\\.:\\/",jp=new RegExp("["+eh+"]","g"),th="[^"+eh+"]",Jp="[^"+eh.replace("\\.","")+"]",Qp=/((?:WC+[\/:])*)/.source.replace("WC",th),em=/(WCOD+)?/.source.replace("WCOD",Jp),tm=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",th),nm=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",th),im=new RegExp("^"+Qp+em+tm+nm+"$"),sm=["material","materials","bones","map"],Ec=class{constructor(e,t,n){let s=n||ft.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},ft=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(jp,"")}static parseTrackName(e){let t=im.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);sm.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let l=n(o.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Ce("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){Fe("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Fe("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Fe("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Fe("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Fe("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){Fe("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){Fe("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let a=e[s];if(a===void 0){let c=t.nodeName;Fe("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){Fe("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Fe("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ft.Composite=Ec;ft.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ft.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ft.prototype.GetterByBindingType=[ft.prototype._getValue_direct,ft.prototype._getValue_array,ft.prototype._getValue_arrayElement,ft.prototype._getValue_toArray];ft.prototype.SetterByBindingTypeAndVersioning=[[ft.prototype._setValue_direct,ft.prototype._setValue_direct_setNeedsUpdate,ft.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ft.prototype._setValue_array,ft.prototype._setValue_array_setNeedsUpdate,ft.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ft.prototype._setValue_arrayElement,ft.prototype._setValue_arrayElement_setNeedsUpdate,ft.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ft.prototype._setValue_fromArray,ft.prototype._setValue_fromArray_setNeedsUpdate,ft.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Fv=new Float32Array(1);var Ac=class i{static{i.prototype.isMatrix2=!0}constructor(e,t,n,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,s){let r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=s,this}};function nh(i,e,t,n){let s=rm(n);switch(t){case qc:return i*e;case yo:return i*e/s.components*s.byteLength;case So:return i*e/s.components*s.byteLength;case Di:return i*e*2/s.components*s.byteLength;case Mo:return i*e*2/s.components*s.byteLength;case Yc:return i*e*3/s.components*s.byteLength;case en:return i*e*4/s.components*s.byteLength;case bo:return i*e*4/s.components*s.byteLength;case Gr:case Wr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Xr:case qr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case wo:case Ao:return Math.max(i,16)*Math.max(e,8)/4;case To:case Eo:return Math.max(i,8)*Math.max(e,8)/2;case Ro:case Co:case Po:case Lo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Io:case Yr:case Do:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case No:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Uo:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Fo:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Oo:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Bo:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case zo:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case ko:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Vo:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Ho:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Go:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Wo:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Xo:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case qo:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Yo:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case $o:case Ko:case Zo:return Math.ceil(i/4)*Math.ceil(e/4)*16;case jo:case Jo:return Math.ceil(i/4)*Math.ceil(e/4)*8;case $r:case Qo:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function rm(i){switch(i){case an:case Hc:return{byteLength:1,components:1};case Ws:case Gc:case Qt:return{byteLength:2,components:1};case _o:case vo:return{byteLength:2,components:4};case In:case xo:case zt:return{byteLength:4,components:1};case Wc:case Xc:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?Ce("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function af(){let i=null,e=!1,t=null,n=null;function s(r,a){n=i.requestAnimationFrame(s),t(r,a)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function cm(i){let e=new WeakMap;function t(o,l){let c=o.array,h=o.usage,d=c.byteLength,u=i.createBuffer();i.bindBuffer(l,u),i.bufferData(l,c,h),o.onUploadCallback();let p;if(c instanceof Float32Array)p=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=i.SHORT;else if(c instanceof Uint32Array)p=i.UNSIGNED_INT;else if(c instanceof Int32Array)p=i.INT;else if(c instanceof Int8Array)p=i.BYTE;else if(c instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,l,c){let h=l.array,d=l.updateRanges;if(i.bindBuffer(c,o),d.length===0)i.bufferSubData(c,0,h);else{d.sort((p,g)=>p.start-g.start);let u=0;for(let p=1;p<d.length;p++){let g=d[u],y=d[p];y.start<=g.start+g.count+1?g.count=Math.max(g.count,y.start+y.count-g.start):(++u,d[u]=y)}d.length=u+1;for(let p=0,g=d.length;p<g;p++){let y=d[p];i.bufferSubData(c,y.start*h.BYTES_PER_ELEMENT,h,y.start,y.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var hm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,um=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,dm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,fm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,pm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,mm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,gm=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,xm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,_m=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,vm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,ym=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Sm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Mm=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,bm=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Tm=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,wm=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Em=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Am=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Rm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Cm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Im=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Pm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Lm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Dm=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Nm=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Um=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,Fm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Om=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Bm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,zm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,km="gl_FragColor = linearToOutputTexel( gl_FragColor );",Vm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Hm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Gm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Wm=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Xm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,qm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Ym=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,$m=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Km=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Zm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,jm=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Jm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Qm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,eg=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,tg=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,ng=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,ig=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,sg=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,rg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,ag=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,og=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lg=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,cg=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,hg=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,ug=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,dg=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,fg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,pg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,mg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,gg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,xg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,_g=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,vg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,yg=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Sg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Mg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,bg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Tg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,wg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Eg=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Ag=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Rg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Cg=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Ig=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Pg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Lg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Dg=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Ng=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Ug=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Fg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Og=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Bg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,zg=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,kg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Vg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Hg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Gg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Wg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Xg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,qg=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Yg=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,$g=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Kg=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Zg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,jg=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Jg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Qg=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,e0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,t0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,n0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,i0=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,s0=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,r0=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,a0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,o0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,l0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,c0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,h0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,u0=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,d0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,f0=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,p0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,m0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,g0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,x0=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,_0=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,v0=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,y0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,S0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,M0=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,b0=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,T0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,w0=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,E0=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,A0=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,R0=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,C0=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,I0=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,P0=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,L0=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,D0=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,N0=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,U0=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,F0=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,O0=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,B0=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,z0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,k0=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,V0=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,H0=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,G0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Xe={alphahash_fragment:hm,alphahash_pars_fragment:um,alphamap_fragment:dm,alphamap_pars_fragment:fm,alphatest_fragment:pm,alphatest_pars_fragment:mm,aomap_fragment:gm,aomap_pars_fragment:xm,batching_pars_vertex:_m,batching_vertex:vm,begin_vertex:ym,beginnormal_vertex:Sm,bsdfs:Mm,iridescence_fragment:bm,bumpmap_pars_fragment:Tm,clipping_planes_fragment:wm,clipping_planes_pars_fragment:Em,clipping_planes_pars_vertex:Am,clipping_planes_vertex:Rm,color_fragment:Cm,color_pars_fragment:Im,color_pars_vertex:Pm,color_vertex:Lm,common:Dm,cube_uv_reflection_fragment:Nm,defaultnormal_vertex:Um,displacementmap_pars_vertex:Fm,displacementmap_vertex:Om,emissivemap_fragment:Bm,emissivemap_pars_fragment:zm,colorspace_fragment:km,colorspace_pars_fragment:Vm,envmap_fragment:Hm,envmap_common_pars_fragment:Gm,envmap_pars_fragment:Wm,envmap_pars_vertex:Xm,envmap_physical_pars_fragment:ng,envmap_vertex:qm,fog_vertex:Ym,fog_pars_vertex:$m,fog_fragment:Km,fog_pars_fragment:Zm,gradientmap_pars_fragment:jm,lightmap_pars_fragment:Jm,lights_lambert_fragment:Qm,lights_lambert_pars_fragment:eg,lights_pars_begin:tg,lights_toon_fragment:ig,lights_toon_pars_fragment:sg,lights_phong_fragment:rg,lights_phong_pars_fragment:ag,lights_physical_fragment:og,lights_physical_pars_fragment:lg,lights_fragment_begin:cg,lights_fragment_maps:hg,lights_fragment_end:ug,lightprobes_pars_fragment:dg,logdepthbuf_fragment:fg,logdepthbuf_pars_fragment:pg,logdepthbuf_pars_vertex:mg,logdepthbuf_vertex:gg,map_fragment:xg,map_pars_fragment:_g,map_particle_fragment:vg,map_particle_pars_fragment:yg,metalnessmap_fragment:Sg,metalnessmap_pars_fragment:Mg,morphinstance_vertex:bg,morphcolor_vertex:Tg,morphnormal_vertex:wg,morphtarget_pars_vertex:Eg,morphtarget_vertex:Ag,normal_fragment_begin:Rg,normal_fragment_maps:Cg,normal_pars_fragment:Ig,normal_pars_vertex:Pg,normal_vertex:Lg,normalmap_pars_fragment:Dg,clearcoat_normal_fragment_begin:Ng,clearcoat_normal_fragment_maps:Ug,clearcoat_pars_fragment:Fg,iridescence_pars_fragment:Og,opaque_fragment:Bg,packing:zg,premultiplied_alpha_fragment:kg,project_vertex:Vg,dithering_fragment:Hg,dithering_pars_fragment:Gg,roughnessmap_fragment:Wg,roughnessmap_pars_fragment:Xg,shadowmap_pars_fragment:qg,shadowmap_pars_vertex:Yg,shadowmap_vertex:$g,shadowmask_pars_fragment:Kg,skinbase_vertex:Zg,skinning_pars_vertex:jg,skinning_vertex:Jg,skinnormal_vertex:Qg,specularmap_fragment:e0,specularmap_pars_fragment:t0,tonemapping_fragment:n0,tonemapping_pars_fragment:i0,transmission_fragment:s0,transmission_pars_fragment:r0,uv_pars_fragment:a0,uv_pars_vertex:o0,uv_vertex:l0,worldpos_vertex:c0,background_vert:h0,background_frag:u0,backgroundCube_vert:d0,backgroundCube_frag:f0,cube_vert:p0,cube_frag:m0,depth_vert:g0,depth_frag:x0,distance_vert:_0,distance_frag:v0,equirect_vert:y0,equirect_frag:S0,linedashed_vert:M0,linedashed_frag:b0,meshbasic_vert:T0,meshbasic_frag:w0,meshlambert_vert:E0,meshlambert_frag:A0,meshmatcap_vert:R0,meshmatcap_frag:C0,meshnormal_vert:I0,meshnormal_frag:P0,meshphong_vert:L0,meshphong_frag:D0,meshphysical_vert:N0,meshphysical_frag:U0,meshtoon_vert:F0,meshtoon_frag:O0,points_vert:B0,points_frag:z0,shadow_vert:k0,shadow_frag:V0,sprite_vert:H0,sprite_frag:G0},xe={common:{diffuse:{value:new Ne(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Oe},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Oe}},envmap:{envMap:{value:null},envMapRotation:{value:new Oe},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Oe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Oe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Oe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Oe},normalScale:{value:new Ge(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Oe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Oe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Oe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Oe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ne(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new V},probesMax:{value:new V},probesResolution:{value:new V}},points:{diffuse:{value:new Ne(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0},uvTransform:{value:new Oe}},sprite:{diffuse:{value:new Ne(16777215)},opacity:{value:1},center:{value:new Ge(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Oe},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0}}},qn={basic:{uniforms:Yt([xe.common,xe.specularmap,xe.envmap,xe.aomap,xe.lightmap,xe.fog]),vertexShader:Xe.meshbasic_vert,fragmentShader:Xe.meshbasic_frag},lambert:{uniforms:Yt([xe.common,xe.specularmap,xe.envmap,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.fog,xe.lights,{emissive:{value:new Ne(0)},envMapIntensity:{value:1}}]),vertexShader:Xe.meshlambert_vert,fragmentShader:Xe.meshlambert_frag},phong:{uniforms:Yt([xe.common,xe.specularmap,xe.envmap,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.fog,xe.lights,{emissive:{value:new Ne(0)},specular:{value:new Ne(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Xe.meshphong_vert,fragmentShader:Xe.meshphong_frag},standard:{uniforms:Yt([xe.common,xe.envmap,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.roughnessmap,xe.metalnessmap,xe.fog,xe.lights,{emissive:{value:new Ne(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag},toon:{uniforms:Yt([xe.common,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.gradientmap,xe.fog,xe.lights,{emissive:{value:new Ne(0)}}]),vertexShader:Xe.meshtoon_vert,fragmentShader:Xe.meshtoon_frag},matcap:{uniforms:Yt([xe.common,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.fog,{matcap:{value:null}}]),vertexShader:Xe.meshmatcap_vert,fragmentShader:Xe.meshmatcap_frag},points:{uniforms:Yt([xe.points,xe.fog]),vertexShader:Xe.points_vert,fragmentShader:Xe.points_frag},dashed:{uniforms:Yt([xe.common,xe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xe.linedashed_vert,fragmentShader:Xe.linedashed_frag},depth:{uniforms:Yt([xe.common,xe.displacementmap]),vertexShader:Xe.depth_vert,fragmentShader:Xe.depth_frag},normal:{uniforms:Yt([xe.common,xe.bumpmap,xe.normalmap,xe.displacementmap,{opacity:{value:1}}]),vertexShader:Xe.meshnormal_vert,fragmentShader:Xe.meshnormal_frag},sprite:{uniforms:Yt([xe.sprite,xe.fog]),vertexShader:Xe.sprite_vert,fragmentShader:Xe.sprite_frag},background:{uniforms:{uvTransform:{value:new Oe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xe.background_vert,fragmentShader:Xe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Oe}},vertexShader:Xe.backgroundCube_vert,fragmentShader:Xe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xe.cube_vert,fragmentShader:Xe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xe.equirect_vert,fragmentShader:Xe.equirect_frag},distance:{uniforms:Yt([xe.common,xe.displacementmap,{referencePosition:{value:new V},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xe.distance_vert,fragmentShader:Xe.distance_frag},shadow:{uniforms:Yt([xe.lights,xe.fog,{color:{value:new Ne(0)},opacity:{value:1}}]),vertexShader:Xe.shadow_vert,fragmentShader:Xe.shadow_frag}};qn.physical={uniforms:Yt([qn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Oe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Oe},clearcoatNormalScale:{value:new Ge(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Oe},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Oe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Oe},sheen:{value:0},sheenColor:{value:new Ne(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Oe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Oe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Oe},transmissionSamplerSize:{value:new Ge},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Oe},attenuationDistance:{value:0},attenuationColor:{value:new Ne(0)},specularColor:{value:new Ne(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Oe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Oe},anisotropyVector:{value:new Ge},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Oe}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag};var il={r:0,b:0,g:0},W0=new ke,of=new Oe;of.set(-1,0,0,0,1,0,0,0,1);function X0(i,e,t,n,s,r){let a=new Ne(0),o=s===!0?0:1,l,c,h=null,d=0,u=null;function p(M){let A=M.isScene===!0?M.background:null;if(A&&A.isTexture){let S=M.backgroundBlurriness>0;A=e.get(A,S)}return A}function g(M){let A=!1,S=p(M);S===null?m(a,o):S&&S.isColor&&(m(S,1),A=!0);let b=i.xr.getEnvironmentBlendMode();b==="additive"?t.buffers.color.setClear(0,0,0,1,r):b==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||A)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function y(M,A){let S=p(A);S&&(S.isCubeTexture||S.mapping===Hr)?(c===void 0&&(c=new ht(new Bs(1,1,1),new fn({name:"BackgroundCubeMaterial",uniforms:ts(qn.backgroundCube.uniforms),vertexShader:qn.backgroundCube.vertexShader,fragmentShader:qn.backgroundCube.fragmentShader,side:Jt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(b,T,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=S,c.material.uniforms.backgroundBlurriness.value=A.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(W0.makeRotationFromEuler(A.backgroundRotation)).transpose(),S.isCubeTexture&&S.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(of),c.material.toneMapped=Ye.getTransfer(S.colorSpace)!==st,(h!==S||d!==S.version||u!==i.toneMapping)&&(c.material.needsUpdate=!0,h=S,d=S.version,u=i.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null)):S&&S.isTexture&&(l===void 0&&(l=new ht(new sn(2,2),new fn({name:"BackgroundMaterial",uniforms:ts(qn.background.uniforms),vertexShader:qn.background.vertexShader,fragmentShader:qn.background.fragmentShader,side:Gn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=S,l.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,l.material.toneMapped=Ye.getTransfer(S.colorSpace)!==st,S.matrixAutoUpdate===!0&&S.updateMatrix(),l.material.uniforms.uvTransform.value.copy(S.matrix),(h!==S||d!==S.version||u!==i.toneMapping)&&(l.material.needsUpdate=!0,h=S,d=S.version,u=i.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null))}function m(M,A){M.getRGB(il,Qc(i)),t.buffers.color.setClear(il.r,il.g,il.b,A,r)}function f(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(M,A=1){a.set(M),o=A,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(M){o=M,m(a,o)},render:g,addToRenderList:y,dispose:f}}function q0(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null),r=s,a=!1;function o(P,z,U,w,O){let W=!1,$=d(P,w,U,z);r!==$&&(r=$,c(r.object)),W=p(P,w,U,O),W&&g(P,w,U,O),O!==null&&e.update(O,i.ELEMENT_ARRAY_BUFFER),(W||a)&&(a=!1,S(P,z,U,w),O!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(O).buffer))}function l(){return i.createVertexArray()}function c(P){return i.bindVertexArray(P)}function h(P){return i.deleteVertexArray(P)}function d(P,z,U,w){let O=w.wireframe===!0,W=n[z.id];W===void 0&&(W={},n[z.id]=W);let $=P.isInstancedMesh===!0?P.id:0,Q=W[$];Q===void 0&&(Q={},W[$]=Q);let Y=Q[U.id];Y===void 0&&(Y={},Q[U.id]=Y);let j=Y[O];return j===void 0&&(j=u(l()),Y[O]=j),j}function u(P){let z=[],U=[],w=[];for(let O=0;O<t;O++)z[O]=0,U[O]=0,w[O]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:z,enabledAttributes:U,attributeDivisors:w,object:P,attributes:{},index:null}}function p(P,z,U,w){let O=r.attributes,W=z.attributes,$=0,Q=U.getAttributes();for(let Y in Q)if(Q[Y].location>=0){let se=O[Y],ae=W[Y];if(ae===void 0&&(Y==="instanceMatrix"&&P.instanceMatrix&&(ae=P.instanceMatrix),Y==="instanceColor"&&P.instanceColor&&(ae=P.instanceColor)),se===void 0||se.attribute!==ae||ae&&se.data!==ae.data)return!0;$++}return r.attributesNum!==$||r.index!==w}function g(P,z,U,w){let O={},W=z.attributes,$=0,Q=U.getAttributes();for(let Y in Q)if(Q[Y].location>=0){let se=W[Y];se===void 0&&(Y==="instanceMatrix"&&P.instanceMatrix&&(se=P.instanceMatrix),Y==="instanceColor"&&P.instanceColor&&(se=P.instanceColor));let ae={};ae.attribute=se,se&&se.data&&(ae.data=se.data),O[Y]=ae,$++}r.attributes=O,r.attributesNum=$,r.index=w}function y(){let P=r.newAttributes;for(let z=0,U=P.length;z<U;z++)P[z]=0}function m(P){f(P,0)}function f(P,z){let U=r.newAttributes,w=r.enabledAttributes,O=r.attributeDivisors;U[P]=1,w[P]===0&&(i.enableVertexAttribArray(P),w[P]=1),O[P]!==z&&(i.vertexAttribDivisor(P,z),O[P]=z)}function M(){let P=r.newAttributes,z=r.enabledAttributes;for(let U=0,w=z.length;U<w;U++)z[U]!==P[U]&&(i.disableVertexAttribArray(U),z[U]=0)}function A(P,z,U,w,O,W,$){$===!0?i.vertexAttribIPointer(P,z,U,O,W):i.vertexAttribPointer(P,z,U,w,O,W)}function S(P,z,U,w){y();let O=w.attributes,W=U.getAttributes(),$=z.defaultAttributeValues;for(let Q in W){let Y=W[Q];if(Y.location>=0){let j=O[Q];if(j===void 0&&(Q==="instanceMatrix"&&P.instanceMatrix&&(j=P.instanceMatrix),Q==="instanceColor"&&P.instanceColor&&(j=P.instanceColor)),j!==void 0){let se=j.normalized,ae=j.itemSize,Me=e.get(j);if(Me===void 0)continue;let Ue=Me.buffer,_e=Me.type,Je=Me.bytesPerElement,J=_e===i.INT||_e===i.UNSIGNED_INT||j.gpuType===xo;if(j.isInterleavedBufferAttribute){let te=j.data,Se=te.stride,De=j.offset;if(te.isInstancedInterleavedBuffer){for(let ye=0;ye<Y.locationSize;ye++)f(Y.location+ye,te.meshPerAttribute);P.isInstancedMesh!==!0&&w._maxInstanceCount===void 0&&(w._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let ye=0;ye<Y.locationSize;ye++)m(Y.location+ye);i.bindBuffer(i.ARRAY_BUFFER,Ue);for(let ye=0;ye<Y.locationSize;ye++)A(Y.location+ye,ae/Y.locationSize,_e,se,Se*Je,(De+ae/Y.locationSize*ye)*Je,J)}else{if(j.isInstancedBufferAttribute){for(let te=0;te<Y.locationSize;te++)f(Y.location+te,j.meshPerAttribute);P.isInstancedMesh!==!0&&w._maxInstanceCount===void 0&&(w._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let te=0;te<Y.locationSize;te++)m(Y.location+te);i.bindBuffer(i.ARRAY_BUFFER,Ue);for(let te=0;te<Y.locationSize;te++)A(Y.location+te,ae/Y.locationSize,_e,se,ae*Je,ae/Y.locationSize*te*Je,J)}}else if($!==void 0){let se=$[Q];if(se!==void 0)switch(se.length){case 2:i.vertexAttrib2fv(Y.location,se);break;case 3:i.vertexAttrib3fv(Y.location,se);break;case 4:i.vertexAttrib4fv(Y.location,se);break;default:i.vertexAttrib1fv(Y.location,se)}}}}M()}function b(){E();for(let P in n){let z=n[P];for(let U in z){let w=z[U];for(let O in w){let W=w[O];for(let $ in W)h(W[$].object),delete W[$];delete w[O]}}delete n[P]}}function T(P){if(n[P.id]===void 0)return;let z=n[P.id];for(let U in z){let w=z[U];for(let O in w){let W=w[O];for(let $ in W)h(W[$].object),delete W[$];delete w[O]}}delete n[P.id]}function C(P){for(let z in n){let U=n[z];for(let w in U){let O=U[w];if(O[P.id]===void 0)continue;let W=O[P.id];for(let $ in W)h(W[$].object),delete W[$];delete O[P.id]}}}function _(P){for(let z in n){let U=n[z],w=P.isInstancedMesh===!0?P.id:0,O=U[w];if(O!==void 0){for(let W in O){let $=O[W];for(let Q in $)h($[Q].object),delete $[Q];delete O[W]}delete U[w],Object.keys(U).length===0&&delete n[z]}}}function E(){D(),a=!0,r!==s&&(r=s,c(r.object))}function D(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:E,resetDefaultState:D,dispose:b,releaseStatesOfGeometry:T,releaseStatesOfObject:_,releaseStatesOfProgram:C,initAttributes:y,enableAttribute:m,disableUnusedAttributes:M}}function Y0(i,e,t){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),t.update(c,n,1)}function a(l,c,h){h!==0&&(i.drawArraysInstanced(n,l,c,h),t.update(c,n,h))}function o(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let u=0;for(let p=0;p<h;p++)u+=c[p];t.update(u,n,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function $0(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let C=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(C){return!(C!==en&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){let _=C===Qt&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==an&&C!==zt&&!_&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function l(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",h=l(c);h!==c&&(Ce("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let d=t.logarithmicDepthBuffer===!0,u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&u===!1&&Ce("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),M=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),A=i.getParameter(i.MAX_VARYING_VECTORS),S=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),b=i.getParameter(i.MAX_SAMPLES),T=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:p,maxVertexTextures:g,maxTextureSize:y,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:M,maxVaryings:A,maxFragmentUniforms:S,maxSamples:b,samples:T}}function K0(i){let e=this,t=null,n=0,s=!1,r=!1,a=new wn,o=new Oe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){let p=d.length!==0||u||n!==0||s;return s=u,n=d.length,p},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){t=h(d,u,0)},this.setState=function(d,u,p){let g=d.clippingPlanes,y=d.clipIntersection,m=d.clipShadows,f=i.get(d);if(!s||g===null||g.length===0||r&&!m)r?h(null):c();else{let M=r?0:n,A=M*4,S=f.clippingState||null;l.value=S,S=h(g,u,A,p);for(let b=0;b!==A;++b)S[b]=t[b];f.clippingState=S,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(d,u,p,g){let y=d!==null?d.length:0,m=null;if(y!==0){if(m=l.value,g!==!0||m===null){let f=p+y*4,M=u.matrixWorldInverse;o.getNormalMatrix(M),(m===null||m.length<f)&&(m=new Float32Array(f));for(let A=0,S=p;A!==y;++A,S+=4)a.copy(d[A]).applyMatrix4(M,o),a.normal.toArray(m,S),m[S+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=y,e.numIntersection=0,m}}var $s=4,Z0=6,j0=20,J0=256,jr=new Hn,Bd=new Ne,ih=null,sh=0,rh=0,ah=!1,Q0=new V,ns=new V,Zs=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){let{size:a=256,position:o=Q0}=r;ih=this._renderer.getRenderTarget(),sh=this._renderer.getActiveCubeFace(),rh=this._renderer.getActiveMipmapLevel(),ah=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Vd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=kd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(ih,sh,rh),this._renderer.xr.enabled=ah,e.scissorTest=!1,Ys(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Pi||e.mapping===Qi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ih=this._renderer.getRenderTarget(),sh=this._renderer.getActiveCubeFace(),rh=this._renderer.getActiveMipmapLevel(),ah=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:pt,minFilter:pt,generateMipmaps:!1,type:Qt,format:en,colorSpace:kt,depthBuffer:!1},s=zd(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=zd(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=ex(r)),this._blurMaterial=nx(r,e,t),this._ggxMaterial=tx(r,e,t)}return s}_compileMaterial(e){let t=new ht(new Bt,e);this._renderer.compile(t,jr)}_sceneToCubeUV(e,t,n,s,r){let l=new wt(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,p=d.toneMapping;d.getClearColor(Bd),d.toneMapping=pn,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new ht(new Bs,new jt({name:"PMREM.Background",side:Jt,depthWrite:!1,depthTest:!1})));let y=this._backgroundBox,m=y.material,f=!1,M=e.background;M?M.isColor&&(m.color.copy(M),e.background=null,f=!0):(m.color.copy(Bd),f=!0);for(let A=0;A<6;A++){let S=A%3;S===0?(l.up.set(0,c[A],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[A],r.y,r.z)):S===1?(l.up.set(0,0,c[A]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[A],r.z)):(l.up.set(0,c[A],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[A]));let b=this._cubeSize;Ys(s,S*b,A>2?b:0,b,b),d.setRenderTarget(s),f&&d.render(y,l),d.render(e,l)}d.toneMapping=p,d.autoClear=u,e.background=M}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===Pi||e.mapping===Qi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Vd()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=kd());let r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;let o=r.uniforms;o.envMap.value=e;let l=this._cubeSize;Ys(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,jr)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){let s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let l=a.uniforms,c=n/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),d=Math.sqrt(c*c-h*h),u=c*1.25,p=d*u,{_lodMax:g}=this,y=this._sizeLods[n],m=3*y*(n>g-$s?n-g+$s:0),f=4*(this._cubeSize-y);l.envMap.value=e.texture,l.roughness.value=p,l.mipInt.value=g-t,Ys(r,m,f,3*y,2*y),s.setRenderTarget(r),s.render(o,jr),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=g-n,Ys(e,m,f,3*y,2*y),s.setRenderTarget(e),s.render(o,jr)}_blur(e,t,n,s){let r=this._pingPongRenderTarget,a=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(e,r,t,n,a),this._blurPass(r,e,n,n,a)}_blurPass(e,t,n,s,r){let a=this._renderer,o=this._blurMaterial,l=this._lodMeshes[s];l.material=o;let c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-n;let h=this._sizeLods[s],d=3*h*(s>this._lodMax-$s?s-this._lodMax+$s:0),u=4*(this._cubeSize-h);Ys(t,d,u,3*h,2*h),a.setRenderTarget(t),a.render(l,jr)}};function ex(i){let e=[],t=[],n=i,s=i-$s+1+Z0;for(let r=0;r<s;r++){let a=Math.pow(2,n);e.push(a);let o=1/(a-2),l=-o,c=1+o,h=[l,l,c,l,c,c,l,l,c,c,l,c],d=6,u=6,p=3,g=new Float32Array(p*u*d),y=new Float32Array(p*u*d);for(let f=0;f<d;f++){let M=f%3*2/3-1,A=f>2?0:-1,S=[M,A,0,M+2/3,A,0,M+2/3,A+1,0,M,A,0,M+2/3,A+1,0,M,A+1,0];g.set(S,p*u*f);for(let b=0;b<u;b++){let T=h[b*2]*2-1,C=h[b*2+1]*2-1;f===0?ns.set(1,C,T):f===1?ns.set(-T,1,-C):f===2?ns.set(-T,C,1):f===3?ns.set(-1,C,-T):f===4?ns.set(-T,-1,C):ns.set(T,C,-1),ns.toArray(y,(f*u+b)*p)}}let m=new Bt;m.setAttribute("position",new St(g,p)),m.setAttribute("outputDirection",new St(y,p)),t.push(new ht(m,null)),n>$s&&n--}return{lodMeshes:t,sizeLods:e}}function zd(i,e,t){let n=new tn(i,e,t);return n.texture.mapping=Hr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ys(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function tx(i,e,t){return new fn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:J0,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:ol(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Wn,depthTest:!1,depthWrite:!1})}function nx(i,e,t){return new fn({name:"SphericalGaussianBlur",defines:{SAMPLES:j0,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:ol(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:Wn,depthTest:!1,depthWrite:!1})}function kd(){return new fn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ol(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Wn,depthTest:!1,depthWrite:!1})}function Vd(){return new fn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ol(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Wn,depthTest:!1,depthWrite:!1})}function ol(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var rl=class extends tn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Pr(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Bs(5,5,5),r=new fn({name:"CubemapFromEquirect",uniforms:ts(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Jt,blending:Wn});r.uniforms.tEquirect.value=t;let a=new ht(s,r),o=t.minFilter;return t.minFilter===vn&&(t.minFilter=pt),new ho(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}};function ix(i){let e=new WeakMap,t=new WeakMap,n=null;function s(u,p=!1){return u==null?null:p?a(u):r(u)}function r(u){if(u&&u.isTexture){let p=u.mapping;if(p===po||p===mo)if(e.has(u)){let g=e.get(u).texture;return o(g,u.mapping)}else{let g=u.image;if(g&&g.height>0){let y=new rl(g.height);return y.fromEquirectangularTexture(i,u),e.set(u,y),u.addEventListener("dispose",c),o(y.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture){let p=u.mapping,g=p===po||p===mo,y=p===Pi||p===Qi;if(g||y){let m=t.get(u),f=m!==void 0?m.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==f)return n===null&&(n=new Zs(i)),m=g?n.fromEquirectangular(u,m):n.fromCubemap(u,m),m.texture.pmremVersion=u.pmremVersion,t.set(u,m),m.texture;if(m!==void 0)return m.texture;{let M=u.image;return g&&M&&M.height>0||y&&M&&l(M)?(n===null&&(n=new Zs(i)),m=g?n.fromEquirectangular(u):n.fromCubemap(u),m.texture.pmremVersion=u.pmremVersion,t.set(u,m),u.addEventListener("dispose",h),m.texture):null}}}return u}function o(u,p){return p===po?u.mapping=Pi:p===mo&&(u.mapping=Qi),u}function l(u){let p=0,g=6;for(let y=0;y<g;y++)u[y]!==void 0&&p++;return p===g}function c(u){let p=u.target;p.removeEventListener("dispose",c);let g=e.get(p);g!==void 0&&(e.delete(p),g.dispose())}function h(u){let p=u.target;p.removeEventListener("dispose",h);let g=t.get(p);g!==void 0&&(t.delete(p),g.dispose())}function d(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:d}}function sx(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&Gi("WebGLRenderer: "+n+" extension not supported."),s}}}function rx(i,e,t,n){let s={},r=new WeakMap;function a(d){let u=d.target;u.index!==null&&e.remove(u.index);for(let g in u.attributes)e.remove(u.attributes[g]);u.removeEventListener("dispose",a),delete s[u.id];let p=r.get(u);p&&(e.remove(p),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function o(d,u){return s[u.id]===!0||(u.addEventListener("dispose",a),s[u.id]=!0,t.memory.geometries++),u}function l(d){let u=d.attributes;for(let p in u)e.update(u[p],i.ARRAY_BUFFER)}function c(d){let u=[],p=d.index,g=d.attributes.position,y=0;if(g===void 0)return;if(p!==null){let M=p.array;y=p.version;for(let A=0,S=M.length;A<S;A+=3){let b=M[A+0],T=M[A+1],C=M[A+2];u.push(b,T,T,C,C,b)}}else{let M=g.array;y=g.version;for(let A=0,S=M.length/3-1;A<S;A+=3){let b=A+0,T=A+1,C=A+2;u.push(b,T,T,C,C,b)}}let m=new(g.count>=65535?Tr:br)(u,1);m.version=y;let f=r.get(d);f&&e.remove(f),r.set(d,m)}function h(d){let u=r.get(d);if(u){let p=d.index;p!==null&&u.version<p.version&&c(d)}else c(d);return r.get(d)}return{get:o,update:l,getWireframeAttribute:h}}function ax(i,e,t){let n;function s(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function l(d,u){i.drawElements(n,u,r,d*a),t.update(u,n,1)}function c(d,u,p){p!==0&&(i.drawElementsInstanced(n,u,r,d*a,p),t.update(u,n,p))}function h(d,u,p){if(p===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,d,0,p);let y=0;for(let m=0;m<p;m++)y+=u[m];t.update(y,n,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function ox(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:Fe("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function lx(i,e,t){let n=new WeakMap,s=new at;function r(a,o,l){let c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0,u=n.get(o);if(u===void 0||u.count!==d){let E=function(){C.dispose(),n.delete(o),o.removeEventListener("dispose",E)};u!==void 0&&u.texture.dispose();let p=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,y=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],f=o.morphAttributes.normal||[],M=o.morphAttributes.color||[],A=0;p===!0&&(A=1),g===!0&&(A=2),y===!0&&(A=3);let S=o.attributes.position.count*A,b=1;S>e.maxTextureSize&&(b=Math.ceil(S/e.maxTextureSize),S=e.maxTextureSize);let T=new Float32Array(S*b*4*d),C=new yr(T,S,b,d);C.type=zt,C.needsUpdate=!0;let _=A*4;for(let D=0;D<d;D++){let P=m[D],z=f[D],U=M[D],w=S*b*4*D;for(let O=0;O<P.count;O++){let W=O*_;p===!0&&(s.fromBufferAttribute(P,O),T[w+W+0]=s.x,T[w+W+1]=s.y,T[w+W+2]=s.z,T[w+W+3]=0),g===!0&&(s.fromBufferAttribute(z,O),T[w+W+4]=s.x,T[w+W+5]=s.y,T[w+W+6]=s.z,T[w+W+7]=0),y===!0&&(s.fromBufferAttribute(U,O),T[w+W+8]=s.x,T[w+W+9]=s.y,T[w+W+10]=s.z,T[w+W+11]=U.itemSize===4?s.w:1)}}u={count:d,texture:C,size:new Ge(S,b)},n.set(o,u),o.addEventListener("dispose",E)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let p=0;for(let y=0;y<c.length;y++)p+=c[y];let g=o.morphTargetsRelative?1:1-p;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",u.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function cx(i,e,t,n,s){let r=new WeakMap;function a(c){let h=s.render.frame,d=c.geometry,u=e.get(c,d);if(r.get(u)!==h&&(e.update(u),r.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){let p=c.skeleton;r.get(p)!==h&&(p.update(),r.set(p,h))}return u}function o(){r=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}var hx={[Uc]:"LINEAR_TONE_MAPPING",[Fc]:"REINHARD_TONE_MAPPING",[Oc]:"CINEON_TONE_MAPPING",[Vr]:"ACES_FILMIC_TONE_MAPPING",[zc]:"AGX_TONE_MAPPING",[kc]:"NEUTRAL_TONE_MAPPING",[Bc]:"CUSTOM_TONE_MAPPING"};function ux(i,e,t,n,s,r){let a=new tn(e,t,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,l=null,c=new Bt;c.setAttribute("position",new Lt([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new Lt([0,2,0,0,2,0],2));let h=new to({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new ht(c,h),u=new Hn(-1,1,1,-1,0,1),p=null,g=null,y=!1,m,f=null,M=[],A=!1;this.setSize=function(S,b){a.setSize(S,b),o!==null&&o.setSize(S,b),l!==null&&l.setSize(S,b);for(let T=0;T<M.length;T++){let C=M[T];C.setSize&&C.setSize(S,b)}},this.setEffects=function(S){M=S,A=M.length>0&&M[0].isRenderPass===!0;let b=a.width,T=a.height;M.length>0&&o===null&&(o=new tn(b,T,{type:Qt,depthBuffer:!1,stencilBuffer:!1}),l=new tn(b,T,{type:Qt,depthBuffer:!1,stencilBuffer:!1}));for(let C=0;C<M.length;C++){let _=M[C];_.setSize&&_.setSize(b,T)}},this.begin=function(S,b){if(y||S.toneMapping===pn&&M.length===0)return!1;if(f=b,b!==null){let T=b.width,C=b.height;(a.width!==T||a.height!==C)&&this.setSize(T,C)}return A===!1&&S.setRenderTarget(a),m=S.toneMapping,S.toneMapping=pn,!0},this.hasRenderPass=function(){return A},this.end=function(S,b){S.toneMapping=m,y=!0;let T=a,C=o;for(let _=0;_<M.length;_++){let E=M[_];E.enabled!==!1&&(E.render(S,C,T,b),E.needsSwap!==!1&&(T=C,C=C===o?l:o))}if(p!==S.outputColorSpace||g!==S.toneMapping){p=S.outputColorSpace,g=S.toneMapping,h.defines={},Ye.getTransfer(p)===st&&(h.defines.SRGB_TRANSFER="");let _=hx[g];_&&(h.defines[_]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=T.texture,S.setRenderTarget(f),S.render(d,u),f=null,y=!1},this.isCompositing=function(){return y},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),h.dispose()}}var lf=new bt,ch=new Ci(1,1),cf=new yr,hf=new ja,uf=new Pr,Hd=[],Gd=[],Wd=new Float32Array(16),Xd=new Float32Array(9),qd=new Float32Array(4);function js(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=Hd[s];if(r===void 0&&(r=new Float32Array(s),Hd[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function Nt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Ut(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function ll(i,e){let t=Gd[e];t===void 0&&(t=new Int32Array(e),Gd[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function dx(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function fx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Nt(t,e))return;i.uniform2fv(this.addr,e),Ut(t,e)}}function px(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Nt(t,e))return;i.uniform3fv(this.addr,e),Ut(t,e)}}function mx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Nt(t,e))return;i.uniform4fv(this.addr,e),Ut(t,e)}}function gx(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Nt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Ut(t,e)}else{if(Nt(t,n))return;qd.set(n),i.uniformMatrix2fv(this.addr,!1,qd),Ut(t,n)}}function xx(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Nt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Ut(t,e)}else{if(Nt(t,n))return;Xd.set(n),i.uniformMatrix3fv(this.addr,!1,Xd),Ut(t,n)}}function _x(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Nt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Ut(t,e)}else{if(Nt(t,n))return;Wd.set(n),i.uniformMatrix4fv(this.addr,!1,Wd),Ut(t,n)}}function vx(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function yx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Nt(t,e))return;i.uniform2iv(this.addr,e),Ut(t,e)}}function Sx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Nt(t,e))return;i.uniform3iv(this.addr,e),Ut(t,e)}}function Mx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Nt(t,e))return;i.uniform4iv(this.addr,e),Ut(t,e)}}function bx(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Tx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Nt(t,e))return;i.uniform2uiv(this.addr,e),Ut(t,e)}}function wx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Nt(t,e))return;i.uniform3uiv(this.addr,e),Ut(t,e)}}function Ex(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Nt(t,e))return;i.uniform4uiv(this.addr,e),Ut(t,e)}}function Ax(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(ch.compareFunction=t.isReversedDepthBuffer()?nl:tl,r=ch):r=lf,t.setTexture2D(e||r,s)}function Rx(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||hf,s)}function Cx(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||uf,s)}function Ix(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||cf,s)}function Px(i){switch(i){case 5126:return dx;case 35664:return fx;case 35665:return px;case 35666:return mx;case 35674:return gx;case 35675:return xx;case 35676:return _x;case 5124:case 35670:return vx;case 35667:case 35671:return yx;case 35668:case 35672:return Sx;case 35669:case 35673:return Mx;case 5125:return bx;case 36294:return Tx;case 36295:return wx;case 36296:return Ex;case 35678:case 36198:case 36298:case 36306:case 35682:return Ax;case 35679:case 36299:case 36307:return Rx;case 35680:case 36300:case 36308:case 36293:return Cx;case 36289:case 36303:case 36311:case 36292:return Ix}}function Lx(i,e){i.uniform1fv(this.addr,e)}function Dx(i,e){let t=js(e,this.size,2);i.uniform2fv(this.addr,t)}function Nx(i,e){let t=js(e,this.size,3);i.uniform3fv(this.addr,t)}function Ux(i,e){let t=js(e,this.size,4);i.uniform4fv(this.addr,t)}function Fx(i,e){let t=js(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Ox(i,e){let t=js(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Bx(i,e){let t=js(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function zx(i,e){i.uniform1iv(this.addr,e)}function kx(i,e){i.uniform2iv(this.addr,e)}function Vx(i,e){i.uniform3iv(this.addr,e)}function Hx(i,e){i.uniform4iv(this.addr,e)}function Gx(i,e){i.uniform1uiv(this.addr,e)}function Wx(i,e){i.uniform2uiv(this.addr,e)}function Xx(i,e){i.uniform3uiv(this.addr,e)}function qx(i,e){i.uniform4uiv(this.addr,e)}function Yx(i,e,t){let n=this.cache,s=e.length,r=ll(t,s);Nt(n,r)||(i.uniform1iv(this.addr,r),Ut(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=ch:a=lf;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function $x(i,e,t){let n=this.cache,s=e.length,r=ll(t,s);Nt(n,r)||(i.uniform1iv(this.addr,r),Ut(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||hf,r[a])}function Kx(i,e,t){let n=this.cache,s=e.length,r=ll(t,s);Nt(n,r)||(i.uniform1iv(this.addr,r),Ut(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||uf,r[a])}function Zx(i,e,t){let n=this.cache,s=e.length,r=ll(t,s);Nt(n,r)||(i.uniform1iv(this.addr,r),Ut(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||cf,r[a])}function jx(i){switch(i){case 5126:return Lx;case 35664:return Dx;case 35665:return Nx;case 35666:return Ux;case 35674:return Fx;case 35675:return Ox;case 35676:return Bx;case 5124:case 35670:return zx;case 35667:case 35671:return kx;case 35668:case 35672:return Vx;case 35669:case 35673:return Hx;case 5125:return Gx;case 36294:return Wx;case 36295:return Xx;case 36296:return qx;case 35678:case 36198:case 36298:case 36306:case 35682:return Yx;case 35679:case 36299:case 36307:return $x;case 35680:case 36300:case 36308:case 36293:return Kx;case 36289:case 36303:case 36311:case 36292:return Zx}}var hh=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Px(t.type)}},uh=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=jx(t.type)}},dh=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(e,t[o.id],n)}}},oh=/(\w+)(\])?(\[|\.)?/g;function Yd(i,e){i.seq.push(e),i.map[e.id]=e}function Jx(i,e,t){let n=i.name,s=n.length;for(oh.lastIndex=0;;){let r=oh.exec(n),a=oh.lastIndex,o=r[1],l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Yd(t,c===void 0?new hh(o,i,e):new uh(o,i,e));break}else{let d=t.map[o];d===void 0&&(d=new dh(o),Yd(t,d)),t=d}}}var Ks=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){let o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);Jx(o,l,this)}let s=[],r=[];for(let a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){let o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let a=e[s];a.id in t&&n.push(a)}return n}};function $d(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var Qx=37297,e_=0;function t_(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}var Kd=new Oe;function n_(i){Ye._getMatrix(Kd,Ye.workingColorSpace,i);let e=`mat3( ${Kd.elements.map(t=>t.toFixed(4))} )`;switch(Ye.getTransfer(i)){case _r:return[e,"LinearTransferOETF"];case st:return[e,"sRGBTransferOETF"];default:return Ce("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Zd(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+t_(i.getShaderSource(e),o)}else return r}function i_(i,e){let t=n_(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}var s_={[Uc]:"Linear",[Fc]:"Reinhard",[Oc]:"Cineon",[Vr]:"ACESFilmic",[zc]:"AgX",[kc]:"Neutral",[Bc]:"Custom"};function r_(i,e){let t=s_[e];return t===void 0?(Ce("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var sl=new V;function a_(){Ye.getLuminanceCoefficients(sl);let i=sl.x.toFixed(4),e=sl.y.toFixed(4),t=sl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function o_(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Qr).join(`
`)}function l_(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function c_(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Qr(i){return i!==""}function jd(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Jd(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var h_=/^[ \t]*#include +<([\w\d./]+)>/gm;function fh(i){return i.replace(h_,d_)}var u_=new Map;function d_(i,e){let t=Xe[e];if(t===void 0){let n=u_.get(e);if(n!==void 0)t=Xe[n],Ce('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return fh(t)}var f_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Qd(i){return i.replace(f_,p_)}function p_(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function ef(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}var m_={[ji]:"SHADOWMAP_TYPE_PCF",[Vs]:"SHADOWMAP_TYPE_VSM"};function g_(i){return m_[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var x_={[Pi]:"ENVMAP_TYPE_CUBE",[Qi]:"ENVMAP_TYPE_CUBE",[Hr]:"ENVMAP_TYPE_CUBE_UV"};function __(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":x_[i.envMapMode]||"ENVMAP_TYPE_CUBE"}var v_={[Qi]:"ENVMAP_MODE_REFRACTION"};function y_(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":v_[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var S_={[Nc]:"ENVMAP_BLENDING_MULTIPLY",[xd]:"ENVMAP_BLENDING_MIX",[_d]:"ENVMAP_BLENDING_ADD"};function M_(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":S_[i.combine]||"ENVMAP_BLENDING_NONE"}function b_(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function T_(i,e,t,n){let s=i.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,l=g_(t),c=__(t),h=y_(t),d=M_(t),u=b_(t),p=o_(t),g=l_(r),y=s.createProgram(),m,f,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Qr).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Qr).join(`
`),f.length>0&&(f+=`
`)):(m=[ef(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Qr).join(`
`),f=[ef(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==pn?"#define TONE_MAPPING":"",t.toneMapping!==pn?Xe.tonemapping_pars_fragment:"",t.toneMapping!==pn?r_("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Xe.colorspace_pars_fragment,i_("linearToOutputTexel",t.outputColorSpace),a_(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Qr).join(`
`)),a=fh(a),a=jd(a,t),a=Jd(a,t),o=fh(o),o=jd(o,t),o=Jd(o,t),a=Qd(a),o=Qd(o),t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",t.glslVersion===jc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===jc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);let A=M+m+a,S=M+f+o,b=$d(s,s.VERTEX_SHADER,A),T=$d(s,s.FRAGMENT_SHADER,S);s.attachShader(y,b),s.attachShader(y,T),t.index0AttributeName!==void 0?s.bindAttribLocation(y,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(y,0,"position"),s.linkProgram(y);function C(P){if(i.debug.checkShaderErrors){let z=s.getProgramInfoLog(y)||"",U=s.getShaderInfoLog(b)||"",w=s.getShaderInfoLog(T)||"",O=z.trim(),W=U.trim(),$=w.trim(),Q=!0,Y=!0;if(s.getProgramParameter(y,s.LINK_STATUS)===!1)if(Q=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,y,b,T);else{let j=Zd(s,b,"vertex"),se=Zd(s,T,"fragment");Fe("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(y,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+O+`
`+j+`
`+se)}else O!==""?Ce("WebGLProgram: Program Info Log:",O):(W===""||$==="")&&(Y=!1);Y&&(P.diagnostics={runnable:Q,programLog:O,vertexShader:{log:W,prefix:m},fragmentShader:{log:$,prefix:f}})}s.deleteShader(b),s.deleteShader(T),_=new Ks(s,y),E=c_(s,y)}let _;this.getUniforms=function(){return _===void 0&&C(this),_};let E;this.getAttributes=function(){return E===void 0&&C(this),E};let D=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return D===!1&&(D=s.getProgramParameter(y,Qx)),D},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(y),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=e_++,this.cacheKey=e,this.usedTimes=1,this.program=y,this.vertexShader=b,this.fragmentShader=T,this}var w_=0,ph=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new mh(e),t.set(e,n)),n}},mh=class{constructor(e){this.id=w_++,this.code=e,this.usedTimes=0}};function E_(i){return i===Di||i===Yr||i===$r}function A_(i,e,t,n,s,r){let a=new Sr,o=new ph,l=new Set,c=[],h=new Map,d=n.logarithmicDepthBuffer,u=n.precision,p={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(_){return l.add(_),_===0?"uv":`uv${_}`}function y(_,E,D,P,z,U){let w=P.fog,O=z.geometry,W=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?P.environment:null,$=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,Q=e.get(_.envMap||W,$),Y=Q&&Q.mapping===Hr?Q.image.height:null,j=p[_.type];_.precision!==null&&(u=n.getMaxPrecision(_.precision),u!==_.precision&&Ce("WebGLProgram.getParameters:",_.precision,"not supported, using",u,"instead."));let se=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,ae=se!==void 0?se.length:0,Me=0;O.morphAttributes.position!==void 0&&(Me=1),O.morphAttributes.normal!==void 0&&(Me=2),O.morphAttributes.color!==void 0&&(Me=3);let Ue,_e,Je,J;if(j){let lt=qn[j];Ue=lt.vertexShader,_e=lt.fragmentShader}else{Ue=_.vertexShader,_e=_.fragmentShader;let lt=o.getVertexShaderStage(_),tt=o.getFragmentShaderStage(_);o.update(_,lt,tt),Je=lt.id,J=tt.id}let te=i.getRenderTarget(),Se=i.state.buffers.depth.getReversed(),De=z.isInstancedMesh===!0,ye=z.isBatchedMesh===!0,Ve=!!_.map,Tt=!!_.matcap,Be=!!Q,Qe=!!_.aoMap,nt=!!_.lightMap,qe=!!_.bumpMap&&_.wireframe===!1,ut=!!_.normalMap,vt=!!_.displacementMap,Ct=!!_.emissiveMap,ot=!!_.metalnessMap,yt=!!_.roughnessMap,B=_.anisotropy>0,Ze=_.clearcoat>0,He=_.dispersion>0,R=_.retroreflectivity>0,v=_.iridescence>0,G=_.sheen>0,X=_.transmission>0,Z=B&&!!_.anisotropyMap,le=Ze&&!!_.clearcoatMap,ue=Ze&&!!_.clearcoatNormalMap,ee=Ze&&!!_.clearcoatRoughnessMap,ie=v&&!!_.iridescenceMap,ce=v&&!!_.iridescenceThicknessMap,Ee=G&&!!_.sheenColorMap,me=G&&!!_.sheenRoughnessMap,de=!!_.specularMap,Ie=!!_.specularColorMap,Le=!!_.specularIntensityMap,ze=X&&!!_.transmissionMap,F=X&&!!_.thicknessMap,fe=!!_.gradientMap,ne=!!_.alphaMap,pe=_.alphaTest>0,ve=!!_.alphaHash,re=!!_.extensions,Pe=pn;_.toneMapped&&(te===null||te.isXRRenderTarget===!0)&&(Pe=i.toneMapping);let Ae={shaderID:j,shaderType:_.type,shaderName:_.name,vertexShader:Ue,fragmentShader:_e,defines:_.defines,customVertexShaderID:Je,customFragmentShaderID:J,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:u,batching:ye,batchingColor:ye&&z._colorsTexture!==null,instancing:De,instancingColor:De&&z.instanceColor!==null,instancingMorph:De&&z.morphTexture!==null,outputColorSpace:te===null?i.outputColorSpace:te.isXRRenderTarget===!0?te.texture.colorSpace:Ye.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:Ve,matcap:Tt,envMap:Be,envMapMode:Be&&Q.mapping,envMapCubeUVHeight:Y,aoMap:Qe,lightMap:nt,bumpMap:qe,normalMap:ut,displacementMap:vt,emissiveMap:Ct,normalMapObjectSpace:ut&&_.normalMapType===Md,normalMapTangentSpace:ut&&_.normalMapType===el,packedNormalMap:ut&&_.normalMapType===el&&E_(_.normalMap.format),metalnessMap:ot,roughnessMap:yt,anisotropy:B,anisotropyMap:Z,clearcoat:Ze,clearcoatMap:le,clearcoatNormalMap:ue,clearcoatRoughnessMap:ee,dispersion:He,retroreflection:R,iridescence:v,iridescenceMap:ie,iridescenceThicknessMap:ce,sheen:G,sheenColorMap:Ee,sheenRoughnessMap:me,specularMap:de,specularColorMap:Ie,specularIntensityMap:Le,transmission:X,transmissionMap:ze,thicknessMap:F,gradientMap:fe,opaque:_.transparent===!1&&_.blending===Hs&&_.alphaToCoverage===!1,alphaMap:ne,alphaTest:pe,alphaHash:ve,combine:_.combine,mapUv:Ve&&g(_.map.channel),aoMapUv:Qe&&g(_.aoMap.channel),lightMapUv:nt&&g(_.lightMap.channel),bumpMapUv:qe&&g(_.bumpMap.channel),normalMapUv:ut&&g(_.normalMap.channel),displacementMapUv:vt&&g(_.displacementMap.channel),emissiveMapUv:Ct&&g(_.emissiveMap.channel),metalnessMapUv:ot&&g(_.metalnessMap.channel),roughnessMapUv:yt&&g(_.roughnessMap.channel),anisotropyMapUv:Z&&g(_.anisotropyMap.channel),clearcoatMapUv:le&&g(_.clearcoatMap.channel),clearcoatNormalMapUv:ue&&g(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ee&&g(_.clearcoatRoughnessMap.channel),iridescenceMapUv:ie&&g(_.iridescenceMap.channel),iridescenceThicknessMapUv:ce&&g(_.iridescenceThicknessMap.channel),sheenColorMapUv:Ee&&g(_.sheenColorMap.channel),sheenRoughnessMapUv:me&&g(_.sheenRoughnessMap.channel),specularMapUv:de&&g(_.specularMap.channel),specularColorMapUv:Ie&&g(_.specularColorMap.channel),specularIntensityMapUv:Le&&g(_.specularIntensityMap.channel),transmissionMapUv:ze&&g(_.transmissionMap.channel),thicknessMapUv:F&&g(_.thicknessMap.channel),alphaMapUv:ne&&g(_.alphaMap.channel),vertexTangents:!!O.attributes.tangent&&(ut||B),vertexNormals:!!O.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!O.attributes.uv&&(Ve||ne),fog:!!w,useFog:_.fog===!0,fogExp2:!!w&&w.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||O.attributes.normal===void 0&&ut===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:Se,skinning:z.isSkinnedMesh===!0,hasPositionAttribute:O.attributes.position!==void 0,morphTargets:O.morphAttributes.position!==void 0,morphNormals:O.morphAttributes.normal!==void 0,morphColors:O.morphAttributes.color!==void 0,morphTargetsCount:ae,morphTextureStride:Me,numSunLights:E.sun.length,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numSunLightShadows:E.sunShadowMap.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numLightProbeGrids:U.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:i.shadowMap.enabled&&D.length>0,shadowMapType:i.shadowMap.type,toneMapping:Pe,decodeVideoTexture:Ve&&_.map.isVideoTexture===!0&&Ye.getTransfer(_.map.colorSpace)===st,decodeVideoTextureEmissive:Ct&&_.emissiveMap.isVideoTexture===!0&&Ye.getTransfer(_.emissiveMap.colorSpace)===st,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Dt,flipSided:_.side===Jt,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:re&&_.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(re&&_.extensions.multiDraw===!0||ye)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Ae.vertexUv1s=l.has(1),Ae.vertexUv2s=l.has(2),Ae.vertexUv3s=l.has(3),l.clear(),Ae}function m(_){let E=[];if(_.shaderID?E.push(_.shaderID):(E.push(_.customVertexShaderID),E.push(_.customFragmentShaderID)),_.defines!==void 0)for(let D in _.defines)E.push(D),E.push(_.defines[D]);return _.isRawShaderMaterial===!1&&(f(E,_),M(E,_),E.push(i.outputColorSpace)),E.push(_.customProgramCacheKey),E.join()}function f(_,E){_.push(E.precision),_.push(E.outputColorSpace),_.push(E.envMapMode),_.push(E.envMapCubeUVHeight),_.push(E.mapUv),_.push(E.alphaMapUv),_.push(E.lightMapUv),_.push(E.aoMapUv),_.push(E.bumpMapUv),_.push(E.normalMapUv),_.push(E.displacementMapUv),_.push(E.emissiveMapUv),_.push(E.metalnessMapUv),_.push(E.roughnessMapUv),_.push(E.anisotropyMapUv),_.push(E.clearcoatMapUv),_.push(E.clearcoatNormalMapUv),_.push(E.clearcoatRoughnessMapUv),_.push(E.iridescenceMapUv),_.push(E.iridescenceThicknessMapUv),_.push(E.sheenColorMapUv),_.push(E.sheenRoughnessMapUv),_.push(E.specularMapUv),_.push(E.specularColorMapUv),_.push(E.specularIntensityMapUv),_.push(E.transmissionMapUv),_.push(E.thicknessMapUv),_.push(E.combine),_.push(E.fogExp2),_.push(E.sizeAttenuation),_.push(E.morphTargetsCount),_.push(E.morphAttributeCount),_.push(E.numSunLights),_.push(E.numDirLights),_.push(E.numPointLights),_.push(E.numSpotLights),_.push(E.numSpotLightMaps),_.push(E.numHemiLights),_.push(E.numRectAreaLights),_.push(E.numSunLightShadows),_.push(E.numDirLightShadows),_.push(E.numPointLightShadows),_.push(E.numSpotLightShadows),_.push(E.numSpotLightShadowsWithMaps),_.push(E.numLightProbes),_.push(E.shadowMapType),_.push(E.toneMapping),_.push(E.numClippingPlanes),_.push(E.numClipIntersection),_.push(E.depthPacking)}function M(_,E){a.disableAll(),E.instancing&&a.enable(0),E.instancingColor&&a.enable(1),E.instancingMorph&&a.enable(2),E.matcap&&a.enable(3),E.envMap&&a.enable(4),E.normalMapObjectSpace&&a.enable(5),E.normalMapTangentSpace&&a.enable(6),E.clearcoat&&a.enable(7),E.iridescence&&a.enable(8),E.alphaTest&&a.enable(9),E.vertexColors&&a.enable(10),E.vertexAlphas&&a.enable(11),E.vertexUv1s&&a.enable(12),E.vertexUv2s&&a.enable(13),E.vertexUv3s&&a.enable(14),E.vertexTangents&&a.enable(15),E.anisotropy&&a.enable(16),E.alphaHash&&a.enable(17),E.batching&&a.enable(18),E.dispersion&&a.enable(19),E.retroreflection&&a.enable(24),E.batchingColor&&a.enable(20),E.gradientMap&&a.enable(21),E.packedNormalMap&&a.enable(22),E.vertexNormals&&a.enable(23),_.push(a.mask),a.disableAll(),E.fog&&a.enable(0),E.useFog&&a.enable(1),E.flatShading&&a.enable(2),E.logarithmicDepthBuffer&&a.enable(3),E.reversedDepthBuffer&&a.enable(4),E.skinning&&a.enable(5),E.morphTargets&&a.enable(6),E.morphNormals&&a.enable(7),E.morphColors&&a.enable(8),E.premultipliedAlpha&&a.enable(9),E.shadowMapEnabled&&a.enable(10),E.doubleSided&&a.enable(11),E.flipSided&&a.enable(12),E.useDepthPacking&&a.enable(13),E.dithering&&a.enable(14),E.transmission&&a.enable(15),E.sheen&&a.enable(16),E.opaque&&a.enable(17),E.pointsUvs&&a.enable(18),E.decodeVideoTexture&&a.enable(19),E.decodeVideoTextureEmissive&&a.enable(20),E.alphaToCoverage&&a.enable(21),E.numLightProbeGrids>0&&a.enable(22),E.hasPositionAttribute&&a.enable(23),_.push(a.mask)}function A(_){let E=p[_.type],D;if(E){let P=qn[E];D=Ud.clone(P.uniforms)}else D=_.uniforms;return D}function S(_,E){let D=h.get(E);return D!==void 0?++D.usedTimes:(D=new T_(i,E,_,s),c.push(D),h.set(E,D)),D}function b(_){if(--_.usedTimes===0){let E=c.indexOf(_);c[E]=c[c.length-1],c.pop(),h.delete(_.cacheKey),_.destroy()}}function T(_){o.remove(_)}function C(){o.dispose()}return{getParameters:y,getProgramCacheKey:m,getUniforms:A,acquireProgram:S,releaseProgram:b,releaseShaderCache:T,programs:c,dispose:C}}function R_(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function C_(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function tf(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function nf(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(u){let p=0;return u.isInstancedMesh&&(p+=2),u.isSkinnedMesh&&(p+=1),p}function o(u,p,g,y,m,f){let M=i[e];return M===void 0?(M={id:u.id,object:u,geometry:p,material:g,materialVariant:a(u),groupOrder:y,renderOrder:u.renderOrder,z:m,group:f},i[e]=M):(M.id=u.id,M.object=u,M.geometry=p,M.material=g,M.materialVariant=a(u),M.groupOrder=y,M.renderOrder=u.renderOrder,M.z=m,M.group=f),e++,M}function l(u,p,g,y,m,f,M){M.reversedDepth===!0&&(m=-m);let A=o(u,p,g,y,m,f);g.transmission>0?n.push(A):g.transparent===!0?s.push(A):t.push(A)}function c(u,p,g,y,m,f){let M=o(u,p,g,y,m,f);g.transmission>0?n.unshift(M):g.transparent===!0?s.unshift(M):t.unshift(M)}function h(u,p){t.length>1&&t.sort(u||C_),n.length>1&&n.sort(p||tf),s.length>1&&s.sort(p||tf)}function d(){for(let u=e,p=i.length;u<p;u++){let g=i[u];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:d,sort:h}}function I_(){let i=new WeakMap;function e(n,s){let r=i.get(n),a;return r===void 0?(a=new nf,i.set(n,[a])):s>=r.length?(a=new nf,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function P_(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new V,color:new Ne};break;case"SpotLight":t={position:new V,direction:new V,color:new Ne,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new V,color:new Ne,distance:0,decay:0};break;case"HemisphereLight":t={direction:new V,skyColor:new Ne,groundColor:new Ne};break;case"RectAreaLight":t={color:new Ne,position:new V,halfWidth:new V,halfHeight:new V};break}return i[e.id]=t,t}}}function L_(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ge};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ge};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ge,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var D_=0;function N_(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function U_(i){let e=new P_,t=L_(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new V);let s=new V,r=new ke,a=new ke;function o(c){let h=0,d=0,u=0;for(let z=0;z<9;z++)n.probe[z].set(0,0,0);let p=0,g=0,y=0,m=0,f=0,M=0,A=0,S=0,b=0,T=0,C=0,_=0,E=0,D=0;c.sort(N_);for(let z=0,U=c.length;z<U;z++){let w=c[z],O=w.color,W=w.intensity,$=w.distance,Q=null;if(w.shadow&&w.shadow.map&&(w.shadow.map.texture.format===Di?Q=w.shadow.map.texture:Q=w.shadow.map.depthTexture||w.shadow.map.texture),w.isAmbientLight)h+=O.r*W,d+=O.g*W,u+=O.b*W;else if(w.isLightProbe){for(let Y=0;Y<9;Y++)n.probe[Y].addScaledVector(w.sh.coefficients[Y],W);D++}else if(w.isSunLight){let Y=e.get(w);if(Y.color.copy(w.color).multiplyScalar(w.intensity),w.castShadow){let j=w.shadow,se=t.get(w);se.shadowIntensity=j.intensity,se.shadowBias=j.bias,se.shadowNormalBias=j.normalBias,se.shadowRadius=j.radius,se.shadowMapSize.copy(j.mapSize).multiply(j.getFrameExtents()),n.sunShadow[g]=se,n.sunShadowMap[g]=Q;let ae=j.getViewportCount();for(let Me=0;Me<ae;Me++)n.sunShadowMatrix[y+Me]=j.getMatrix(Me),n.sunShadowCascade[y+Me]=j._cascadeData[Me];y+=ae,g++}n.sun[p]=Y,p++}else if(w.isDirectionalLight){let Y=e.get(w);if(Y.color.copy(w.color).multiplyScalar(w.intensity),w.castShadow){let j=w.shadow,se=t.get(w);se.shadowIntensity=j.intensity,se.shadowBias=j.bias,se.shadowNormalBias=j.normalBias,se.shadowRadius=j.radius,se.shadowMapSize=j.mapSize,n.directionalShadow[m]=se,n.directionalShadowMap[m]=Q,n.directionalShadowMatrix[m]=w.shadow.matrix,b++}n.directional[m]=Y,m++}else if(w.isSpotLight){let Y=e.get(w);Y.position.setFromMatrixPosition(w.matrixWorld),Y.color.copy(O).multiplyScalar(W),Y.distance=$,Y.coneCos=Math.cos(w.angle),Y.penumbraCos=Math.cos(w.angle*(1-w.penumbra)),Y.decay=w.decay,n.spot[M]=Y;let j=w.shadow;if(w.map&&(n.spotLightMap[_]=w.map,_++,j.updateMatrices(w),w.castShadow&&E++),n.spotLightMatrix[M]=j.matrix,w.castShadow){let se=t.get(w);se.shadowIntensity=j.intensity,se.shadowBias=j.bias,se.shadowNormalBias=j.normalBias,se.shadowRadius=j.radius,se.shadowMapSize=j.mapSize,n.spotShadow[M]=se,n.spotShadowMap[M]=Q,C++}M++}else if(w.isRectAreaLight){let Y=e.get(w);Y.color.copy(O).multiplyScalar(W),Y.halfWidth.set(w.width*.5,0,0),Y.halfHeight.set(0,w.height*.5,0),n.rectArea[A]=Y,A++}else if(w.isPointLight){let Y=e.get(w);if(Y.color.copy(w.color).multiplyScalar(w.intensity),Y.distance=w.distance,Y.decay=w.decay,w.castShadow){let j=w.shadow,se=t.get(w);se.shadowIntensity=j.intensity,se.shadowBias=j.bias,se.shadowNormalBias=j.normalBias,se.shadowRadius=j.radius,se.shadowMapSize=j.mapSize,se.shadowCameraNear=j.camera.near,se.shadowCameraFar=j.camera.far,n.pointShadow[f]=se,n.pointShadowMap[f]=Q,n.pointShadowMatrix[f]=w.shadow.matrix,T++}n.point[f]=Y,f++}else if(w.isHemisphereLight){let Y=e.get(w);Y.skyColor.copy(w.color).multiplyScalar(W),Y.groundColor.copy(w.groundColor).multiplyScalar(W),n.hemi[S]=Y,S++}}A>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=xe.LTC_FLOAT_1,n.rectAreaLTC2=xe.LTC_FLOAT_2):(n.rectAreaLTC1=xe.LTC_HALF_1,n.rectAreaLTC2=xe.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;let P=n.hash;(P.sunLength!==p||P.directionalLength!==m||P.pointLength!==f||P.spotLength!==M||P.rectAreaLength!==A||P.hemiLength!==S||P.numSunShadows!==g||P.numDirectionalShadows!==b||P.numPointShadows!==T||P.numSpotShadows!==C||P.numSpotMaps!==_||P.numLightProbes!==D)&&(n.sun.length=p,n.directional.length=m,n.spot.length=M,n.rectArea.length=A,n.point.length=f,n.hemi.length=S,n.sunShadow.length=g,n.sunShadowMap.length=g,n.sunShadowMatrix.length=y,n.sunShadowCascade.length=y,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.directionalShadowMatrix.length=b,n.pointShadow.length=T,n.pointShadowMap.length=T,n.pointShadowMatrix.length=T,n.spotShadow.length=C,n.spotShadowMap.length=C,n.spotLightMatrix.length=C+_-E,n.spotLightMap.length=_,n.numSpotLightShadowsWithMaps=E,n.numLightProbes=D,P.sunLength=p,P.directionalLength=m,P.pointLength=f,P.spotLength=M,P.rectAreaLength=A,P.hemiLength=S,P.numSunShadows=g,P.numDirectionalShadows=b,P.numPointShadows=T,P.numSpotShadows=C,P.numSpotMaps=_,P.numLightProbes=D,n.version=D_++)}function l(c,h){let d=0,u=0,p=0,g=0,y=0,m=0,f=h.matrixWorldInverse;for(let M=0,A=c.length;M<A;M++){let S=c[M];if(S.isSunLight){let b=n.sun[d];b.direction.setFromMatrixPosition(S.matrixWorld),b.direction.transformDirection(f),d++}else if(S.isDirectionalLight){let b=n.directional[u];b.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(f),u++}else if(S.isSpotLight){let b=n.spot[g];b.position.setFromMatrixPosition(S.matrixWorld),b.position.applyMatrix4(f),b.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(f),g++}else if(S.isRectAreaLight){let b=n.rectArea[y];b.position.setFromMatrixPosition(S.matrixWorld),b.position.applyMatrix4(f),a.identity(),r.copy(S.matrixWorld),r.premultiply(f),a.extractRotation(r),b.halfWidth.set(S.width*.5,0,0),b.halfHeight.set(0,S.height*.5,0),b.halfWidth.applyMatrix4(a),b.halfHeight.applyMatrix4(a),y++}else if(S.isPointLight){let b=n.point[p];b.position.setFromMatrixPosition(S.matrixWorld),b.position.applyMatrix4(f),p++}else if(S.isHemisphereLight){let b=n.hemi[m];b.direction.setFromMatrixPosition(S.matrixWorld),b.direction.transformDirection(f),m++}}}return{setup:o,setupView:l,state:n}}function sf(i){let e=new U_(i),t=[],n=[],s=[];function r(u){d.camera=u,t.length=0,n.length=0,s.length=0}function a(u){t.push(u)}function o(u){n.push(u)}function l(u){s.push(u)}function c(){e.setup(t)}function h(u){e.setupView(t,u)}let d={lightsArray:t,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:c,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function F_(i){let e=new WeakMap;function t(s,r=0){let a=e.get(s),o;return a===void 0?(o=new sf(i),e.set(s,[o])):r>=a.length?(o=new sf(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}var O_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,B_=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,z_=[new V(1,0,0),new V(-1,0,0),new V(0,1,0),new V(0,-1,0),new V(0,0,1),new V(0,0,-1)],k_=[new V(0,-1,0),new V(0,-1,0),new V(0,0,1),new V(0,0,-1),new V(0,-1,0),new V(0,-1,0)],rf=new ke,Jr=new V,lh=new V;function V_(i,e,t){let n=new Us,s=new Ge,r=new Ge,a=new at,o=new Ii,l=new no,c={},h=t.maxTextureSize,d={[Gn]:Jt,[Jt]:Gn,[Dt]:Dt},u=new fn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ge},radius:{value:4}},vertexShader:O_,fragmentShader:B_}),p=u.clone();p.defines.HORIZONTAL_PASS=1;let g=new Bt;g.setAttribute("position",new St(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let y=new ht(g,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ji;let f=this.type;this.render=function(T,C,_){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;this.type===fo&&(Ce("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=ji);let E=i.getRenderTarget(),D=i.getActiveCubeFace(),P=i.getActiveMipmapLevel(),z=i.state;z.setBlending(Wn),z.buffers.depth.getReversed()===!0?z.buffers.color.setClear(0,0,0,0):z.buffers.color.setClear(1,1,1,1),z.buffers.depth.setTest(!0),z.setScissorTest(!1);let U=f!==this.type;U&&C.traverse(function(w){w.material&&(Array.isArray(w.material)?w.material.forEach(O=>O.needsUpdate=!0):w.material.needsUpdate=!0)});for(let w=0,O=T.length;w<O;w++){let W=T[w],$=W.shadow;if($===void 0){Ce("WebGLShadowMap:",W,"has no shadow.");continue}if($.autoUpdate===!1&&$.needsUpdate===!1)continue;s.copy($.mapSize);let Q=$.getFrameExtents();s.multiply(Q),r.copy($.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/Q.x),s.x=r.x*Q.x,$.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/Q.y),s.y=r.y*Q.y,$.mapSize.y=r.y));let Y=i.state.buffers.depth.getReversed();if($.camera._reversedDepth=Y,$.map===null||U===!0){if($.map!==null&&($.map.depthTexture!==null&&($.map.depthTexture.dispose(),$.map.depthTexture=null),$.map.dispose()),this.type===Vs){if(W.isPointLight){Ce("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}$.map=new tn(s.x,s.y,{format:Di,type:Qt,minFilter:pt,magFilter:pt,generateMipmaps:!1}),$.map.texture.name=W.name+".shadowMap",$.map.depthTexture=new Ci(s.x,s.y,zt),$.map.depthTexture.name=W.name+".shadowMapDepth",$.map.depthTexture.format=On,$.map.depthTexture.compareFunction=null,$.map.depthTexture.minFilter=Mt,$.map.depthTexture.magFilter=Mt}else W.isPointLight?($.map=new rl(s.x),$.map.depthTexture=new eo(s.x,In)):($.map=new tn(s.x,s.y),$.map.depthTexture=new Ci(s.x,s.y,In)),$.map.depthTexture.name=W.name+".shadowMap",$.map.depthTexture.format=On,this.type===ji?($.map.depthTexture.compareFunction=Y?nl:tl,$.map.depthTexture.minFilter=pt,$.map.depthTexture.magFilter=pt):($.map.depthTexture.compareFunction=null,$.map.depthTexture.minFilter=Mt,$.map.depthTexture.magFilter=Mt);$.camera.updateProjectionMatrix()}$.map.isWebGLCubeRenderTarget!==!0&&($.map.width!==s.x||$.map.height!==s.y)&&$.map.setSize(s.x,s.y);let j=$.map.isWebGLCubeRenderTarget?6:$.getViewportCount();W.isPointLight!==!0&&$.updateMatrices(W,_);for(let se=0;se<j;se++){let ae=$.getCamera(se);if(W.isPointLight){let Me=$.camera,Ue=$.matrix,_e=W.distance||Me.far;_e!==Me.far&&(Me.far=_e,Me.updateProjectionMatrix()),Jr.setFromMatrixPosition(W.matrixWorld),Me.position.copy(Jr),lh.copy(Me.position),lh.add(z_[se]),Me.up.copy(k_[se]),Me.lookAt(lh),Me.updateMatrixWorld(),Ue.makeTranslation(-Jr.x,-Jr.y,-Jr.z),rf.multiplyMatrices(Me.projectionMatrix,Me.matrixWorldInverse),$._frustum.setFromProjectionMatrix(rf,Me.coordinateSystem,Me.reversedDepth)}if($.map.isWebGLCubeRenderTarget)i.setRenderTarget($.map,se),i.clear();else{se===0&&(i.setRenderTarget($.map),i.clear());let Me=$.getViewport(se);a.set(r.x*Me.x,r.y*Me.y,r.x*Me.z,r.y*Me.w),z.viewport(a)}n=$.getFrustum(se),S(C,_,ae,W,this.type)}$.isPointLightShadow!==!0&&this.type===Vs&&M($,_),$.needsUpdate=!1}f=this.type,m.needsUpdate=!1,i.setRenderTarget(E,D,P)};function M(T,C){let _=e.update(y);u.defines.VSM_SAMPLES!==T.blurSamples&&(u.defines.VSM_SAMPLES=T.blurSamples,p.defines.VSM_SAMPLES=T.blurSamples,u.needsUpdate=!0,p.needsUpdate=!0),T.mapPass===null?T.mapPass=new tn(s.x,s.y,{format:Di,type:Qt}):(T.mapPass.width!==T.map.width||T.mapPass.height!==T.map.height)&&T.mapPass.setSize(T.map.width,T.map.height),u.uniforms.shadow_pass.value=T.map.depthTexture,u.uniforms.resolution.value.set(T.map.width,T.map.height),u.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(C,null,_,u,y,null),p.uniforms.shadow_pass.value=T.mapPass.texture,p.uniforms.resolution.value.set(T.map.width,T.map.height),p.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(C,null,_,p,y,null)}function A(T,C,_,E){let D=null,P=_.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(P!==void 0)D=P;else if(D=_.isPointLight===!0?l:o,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){let z=D.uuid,U=C.uuid,w=c[z];w===void 0&&(w={},c[z]=w);let O=w[U];O===void 0&&(O=D.clone(),w[U]=O,C.addEventListener("dispose",b)),D=O}if(D.visible=C.visible,D.wireframe=C.wireframe,E===Vs?D.side=C.shadowSide!==null?C.shadowSide:C.side:D.side=C.shadowSide!==null?C.shadowSide:d[C.side],D.alphaMap=C.alphaMap,D.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,D.map=C.map,D.clipShadows=C.clipShadows,D.clippingPlanes=C.clippingPlanes,D.clipIntersection=C.clipIntersection,D.displacementMap=C.displacementMap,D.displacementScale=C.displacementScale,D.displacementBias=C.displacementBias,D.wireframeLinewidth=C.wireframeLinewidth,D.linewidth=C.linewidth,_.isPointLight===!0&&D.isMeshDistanceMaterial===!0){let z=i.properties.get(D);z.light=_}return D}function S(T,C,_,E,D){if(T.visible===!1)return;if(T.layers.test(C.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&D===Vs)&&(!T.frustumCulled||T.intersectsFrustum(n))){T.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,T.matrixWorld);let U=e.update(T),w=T.material;if(Array.isArray(w)){let O=U.groups;for(let W=0,$=O.length;W<$;W++){let Q=O[W],Y=w[Q.materialIndex];if(Y&&Y.visible){let j=A(T,Y,E,D);T.onBeforeShadow(i,T,C,_,U,j,Q),i.renderBufferDirect(_,null,U,j,T,Q),T.onAfterShadow(i,T,C,_,U,j,Q)}}}else if(w.visible){let O=A(T,w,E,D);T.onBeforeShadow(i,T,C,_,U,O,null),i.renderBufferDirect(_,null,U,O,T,null),T.onAfterShadow(i,T,C,_,U,O,null)}}let z=T.children;for(let U=0,w=z.length;U<w;U++)S(z[U],C,_,E,D)}function b(T){T.target.removeEventListener("dispose",b);for(let _ in c){let E=c[_],D=T.target.uuid;D in E&&(E[D].dispose(),delete E[D])}}}function H_(i,e){function t(){let F=!1,fe=new at,ne=null,pe=new at(0,0,0,0);return{setMask:function(ve){ne!==ve&&!F&&(i.colorMask(ve,ve,ve,ve),ne=ve)},setLocked:function(ve){F=ve},setClear:function(ve,re,Pe,Ae,lt){lt===!0&&(ve*=Ae,re*=Ae,Pe*=Ae),fe.set(ve,re,Pe,Ae),pe.equals(fe)===!1&&(i.clearColor(ve,re,Pe,Ae),pe.copy(fe))},reset:function(){F=!1,ne=null,pe.set(-1,0,0,0)}}}function n(){let F=!1,fe=!1,ne=null,pe=null,ve=null;return{setReversed:function(re){if(fe!==re){let Pe=e.get("EXT_clip_control");re?Pe.clipControlEXT(Pe.LOWER_LEFT_EXT,Pe.ZERO_TO_ONE_EXT):Pe.clipControlEXT(Pe.LOWER_LEFT_EXT,Pe.NEGATIVE_ONE_TO_ONE_EXT),fe=re;let Ae=ve;ve=null,this.setClear(Ae)}},getReversed:function(){return fe},setTest:function(re){re?te(i.DEPTH_TEST):Se(i.DEPTH_TEST)},setMask:function(re){ne!==re&&!F&&(i.depthMask(re),ne=re)},setFunc:function(re){if(fe&&(re=Dd[re]),pe!==re){switch(re){case Ha:i.depthFunc(i.NEVER);break;case Ga:i.depthFunc(i.ALWAYS);break;case Wa:i.depthFunc(i.LESS);break;case ws:i.depthFunc(i.LEQUAL);break;case Xa:i.depthFunc(i.EQUAL);break;case qa:i.depthFunc(i.GEQUAL);break;case Ya:i.depthFunc(i.GREATER);break;case $a:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}pe=re}},setLocked:function(re){F=re},setClear:function(re){ve!==re&&(ve=re,fe&&(re=1-re),i.clearDepth(re))},reset:function(){F=!1,ne=null,pe=null,ve=null,fe=!1}}}function s(){let F=!1,fe=null,ne=null,pe=null,ve=null,re=null,Pe=null,Ae=null,lt=null;return{setTest:function(tt){F||(tt?te(i.STENCIL_TEST):Se(i.STENCIL_TEST))},setMask:function(tt){fe!==tt&&!F&&(i.stencilMask(tt),fe=tt)},setFunc:function(tt,cn,mn){(ne!==tt||pe!==cn||ve!==mn)&&(i.stencilFunc(tt,cn,mn),ne=tt,pe=cn,ve=mn)},setOp:function(tt,cn,mn){(re!==tt||Pe!==cn||Ae!==mn)&&(i.stencilOp(tt,cn,mn),re=tt,Pe=cn,Ae=mn)},setLocked:function(tt){F=tt},setClear:function(tt){lt!==tt&&(i.clearStencil(tt),lt=tt)},reset:function(){F=!1,fe=null,ne=null,pe=null,ve=null,re=null,Pe=null,Ae=null,lt=null}}}let r=new t,a=new n,o=new s,l=new WeakMap,c=new WeakMap,h={},d={},u={},p=new WeakMap,g=[],y=null,m=!1,f=null,M=null,A=null,S=null,b=null,T=null,C=null,_=new Ne(0,0,0),E=0,D=!1,P=null,z=null,U=null,w=null,O=null,W=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),$=!1,Q=0,Y=i.getParameter(i.VERSION);Y.indexOf("WebGL")!==-1?(Q=parseFloat(/^WebGL (\d)/.exec(Y)[1]),$=Q>=1):Y.indexOf("OpenGL ES")!==-1&&(Q=parseFloat(/^OpenGL ES (\d)/.exec(Y)[1]),$=Q>=2);let j=null,se={},ae=i.getParameter(i.SCISSOR_BOX),Me=i.getParameter(i.VIEWPORT),Ue=new at().fromArray(ae),_e=new at().fromArray(Me);function Je(F,fe,ne,pe){let ve=new Uint8Array(4),re=i.createTexture();i.bindTexture(F,re),i.texParameteri(F,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(F,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Pe=0;Pe<ne;Pe++)F===i.TEXTURE_3D||F===i.TEXTURE_2D_ARRAY?i.texImage3D(fe,0,i.RGBA,1,1,pe,0,i.RGBA,i.UNSIGNED_BYTE,ve):i.texImage2D(fe+Pe,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ve);return re}let J={};J[i.TEXTURE_2D]=Je(i.TEXTURE_2D,i.TEXTURE_2D,1),J[i.TEXTURE_CUBE_MAP]=Je(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),J[i.TEXTURE_2D_ARRAY]=Je(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),J[i.TEXTURE_3D]=Je(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),te(i.DEPTH_TEST),a.setFunc(ws),qe(!1),ut(Rc),te(i.CULL_FACE),Qe(Wn);function te(F){h[F]!==!0&&(i.enable(F),h[F]=!0)}function Se(F){h[F]!==!1&&(i.disable(F),h[F]=!1)}function De(F,fe){return u[F]!==fe?(i.bindFramebuffer(F,fe),u[F]=fe,F===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=fe),F===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=fe),!0):!1}function ye(F,fe){let ne=g,pe=!1;if(F){ne=p.get(fe),ne===void 0&&(ne=[],p.set(fe,ne));let ve=F.textures;if(ne.length!==ve.length||ne[0]!==i.COLOR_ATTACHMENT0){for(let re=0,Pe=ve.length;re<Pe;re++)ne[re]=i.COLOR_ATTACHMENT0+re;ne.length=ve.length,pe=!0}}else ne[0]!==i.BACK&&(ne[0]=i.BACK,pe=!0);pe&&i.drawBuffers(ne)}function Ve(F){return y!==F?(i.useProgram(F),y=F,!0):!1}let Tt={[Ji]:i.FUNC_ADD,[ed]:i.FUNC_SUBTRACT,[td]:i.FUNC_REVERSE_SUBTRACT};Tt[nd]=i.MIN,Tt[id]=i.MAX;let Be={[sd]:i.ZERO,[rd]:i.ONE,[ad]:i.SRC_COLOR,[Lc]:i.SRC_ALPHA,[dd]:i.SRC_ALPHA_SATURATE,[hd]:i.DST_COLOR,[ld]:i.DST_ALPHA,[od]:i.ONE_MINUS_SRC_COLOR,[Dc]:i.ONE_MINUS_SRC_ALPHA,[ud]:i.ONE_MINUS_DST_COLOR,[cd]:i.ONE_MINUS_DST_ALPHA,[fd]:i.CONSTANT_COLOR,[pd]:i.ONE_MINUS_CONSTANT_COLOR,[md]:i.CONSTANT_ALPHA,[gd]:i.ONE_MINUS_CONSTANT_ALPHA};function Qe(F,fe,ne,pe,ve,re,Pe,Ae,lt,tt){if(F===Wn){m===!0&&(Se(i.BLEND),m=!1);return}if(m===!1&&(te(i.BLEND),m=!0),F!==Qu){if(F!==f||tt!==D){if((M!==Ji||b!==Ji)&&(i.blendEquation(i.FUNC_ADD),M=Ji,b=Ji),tt)switch(F){case Hs:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Cc:i.blendFunc(i.ONE,i.ONE);break;case Ic:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Pc:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Fe("WebGLState: Invalid blending: ",F);break}else switch(F){case Hs:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Cc:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Ic:Fe("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Pc:Fe("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Fe("WebGLState: Invalid blending: ",F);break}A=null,S=null,T=null,C=null,_.set(0,0,0),E=0,f=F,D=tt}return}ve=ve||fe,re=re||ne,Pe=Pe||pe,(fe!==M||ve!==b)&&(i.blendEquationSeparate(Tt[fe],Tt[ve]),M=fe,b=ve),(ne!==A||pe!==S||re!==T||Pe!==C)&&(i.blendFuncSeparate(Be[ne],Be[pe],Be[re],Be[Pe]),A=ne,S=pe,T=re,C=Pe),(Ae.equals(_)===!1||lt!==E)&&(i.blendColor(Ae.r,Ae.g,Ae.b,lt),_.copy(Ae),E=lt),f=F,D=!1}function nt(F,fe){F.side===Dt?Se(i.CULL_FACE):te(i.CULL_FACE);let ne=F.side===Jt;fe&&(ne=!ne),qe(ne),F.blending===Hs&&F.transparent===!1?Qe(Wn):Qe(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),a.setFunc(F.depthFunc),a.setTest(F.depthTest),a.setMask(F.depthWrite),r.setMask(F.colorWrite);let pe=F.stencilWrite;o.setTest(pe),pe&&(o.setMask(F.stencilWriteMask),o.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),o.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),Ct(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?te(i.SAMPLE_ALPHA_TO_COVERAGE):Se(i.SAMPLE_ALPHA_TO_COVERAGE)}function qe(F){P!==F&&(F?i.frontFace(i.CW):i.frontFace(i.CCW),P=F)}function ut(F){F!==ju?(te(i.CULL_FACE),F!==z&&(F===Rc?i.cullFace(i.BACK):F===Ju?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Se(i.CULL_FACE),z=F}function vt(F){F!==U&&($&&i.lineWidth(F),U=F)}function Ct(F,fe,ne){F?(te(i.POLYGON_OFFSET_FILL),(w!==fe||O!==ne)&&(w=fe,O=ne,a.getReversed()&&(fe=-fe),i.polygonOffset(fe,ne))):Se(i.POLYGON_OFFSET_FILL)}function ot(F){F?te(i.SCISSOR_TEST):Se(i.SCISSOR_TEST)}function yt(F){F===void 0&&(F=i.TEXTURE0+W-1),j!==F&&(i.activeTexture(F),j=F)}function B(F,fe,ne){ne===void 0&&(j===null?ne=i.TEXTURE0+W-1:ne=j);let pe=se[ne];pe===void 0&&(pe={type:void 0,texture:void 0},se[ne]=pe),(pe.type!==F||pe.texture!==fe)&&(j!==ne&&(i.activeTexture(ne),j=ne),i.bindTexture(F,fe||J[F]),pe.type=F,pe.texture=fe)}function Ze(){let F=se[j];F!==void 0&&F.type!==void 0&&(i.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function He(){try{i.compressedTexImage2D(...arguments)}catch(F){Fe("WebGLState:",F)}}function R(){try{i.compressedTexImage3D(...arguments)}catch(F){Fe("WebGLState:",F)}}function v(){try{i.texSubImage2D(...arguments)}catch(F){Fe("WebGLState:",F)}}function G(){try{i.texSubImage3D(...arguments)}catch(F){Fe("WebGLState:",F)}}function X(){try{i.compressedTexSubImage2D(...arguments)}catch(F){Fe("WebGLState:",F)}}function Z(){try{i.compressedTexSubImage3D(...arguments)}catch(F){Fe("WebGLState:",F)}}function le(){try{i.texStorage2D(...arguments)}catch(F){Fe("WebGLState:",F)}}function ue(){try{i.texStorage3D(...arguments)}catch(F){Fe("WebGLState:",F)}}function ee(){try{i.texImage2D(...arguments)}catch(F){Fe("WebGLState:",F)}}function ie(){try{i.texImage3D(...arguments)}catch(F){Fe("WebGLState:",F)}}function ce(F){return d[F]!==void 0?d[F]:i.getParameter(F)}function Ee(F,fe){d[F]!==fe&&(i.pixelStorei(F,fe),d[F]=fe)}function me(F){Ue.equals(F)===!1&&(i.scissor(F.x,F.y,F.z,F.w),Ue.copy(F))}function de(F){_e.equals(F)===!1&&(i.viewport(F.x,F.y,F.z,F.w),_e.copy(F))}function Ie(F,fe){let ne=c.get(fe);ne===void 0&&(ne=new WeakMap,c.set(fe,ne));let pe=ne.get(F);pe===void 0&&(pe=i.getUniformBlockIndex(fe,F.name),ne.set(F,pe))}function Le(F,fe){let pe=c.get(fe).get(F);l.get(fe)!==pe&&(i.uniformBlockBinding(fe,pe,F.__bindingPointIndex),l.set(fe,pe))}function ze(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},d={},j=null,se={},u={},p=new WeakMap,g=[],y=null,m=!1,f=null,M=null,A=null,S=null,b=null,T=null,C=null,_=new Ne(0,0,0),E=0,D=!1,P=null,z=null,U=null,w=null,O=null,Ue.set(0,0,i.canvas.width,i.canvas.height),_e.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:te,disable:Se,bindFramebuffer:De,drawBuffers:ye,useProgram:Ve,setBlending:Qe,setMaterial:nt,setFlipSided:qe,setCullFace:ut,setLineWidth:vt,setPolygonOffset:Ct,setScissorTest:ot,activeTexture:yt,bindTexture:B,unbindTexture:Ze,compressedTexImage2D:He,compressedTexImage3D:R,texImage2D:ee,texImage3D:ie,pixelStorei:Ee,getParameter:ce,updateUBOMapping:Ie,uniformBlockBinding:Le,texStorage2D:le,texStorage3D:ue,texSubImage2D:v,texSubImage3D:G,compressedTexSubImage2D:X,compressedTexSubImage3D:Z,scissor:me,viewport:de,reset:ze}}function G_(i,e,t,n,s,r,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Ge,h=new WeakMap,d=new Set,u,p=new WeakMap,g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function y(R,v){return g?new OffscreenCanvas(R,v):Rs("canvas")}function m(R,v,G){let X=1,Z=He(R);if((Z.width>G||Z.height>G)&&(X=G/Math.max(Z.width,Z.height)),X<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){let le=Math.floor(X*Z.width),ue=Math.floor(X*Z.height);u===void 0&&(u=y(le,ue));let ee=v?y(le,ue):u;return ee.width=le,ee.height=ue,ee.getContext("2d").drawImage(R,0,0,le,ue),Ce("WebGLRenderer: Texture has been resized from ("+Z.width+"x"+Z.height+") to ("+le+"x"+ue+")."),ee}else return"data"in R&&Ce("WebGLRenderer: Image in DataTexture is too big ("+Z.width+"x"+Z.height+")."),R;return R}function f(R){return R.generateMipmaps}function M(R){i.generateMipmap(R)}function A(R){return R.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?i.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function S(R,v,G,X,Z,le=!1){if(R!==null){if(i[R]!==void 0)return i[R];Ce("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let ue;X&&(ue=e.get("EXT_texture_norm16"),ue||Ce("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let ee=v;if(v===i.RED&&(G===i.FLOAT&&(ee=i.R32F),G===i.HALF_FLOAT&&(ee=i.R16F),G===i.UNSIGNED_BYTE&&(ee=i.R8),G===i.UNSIGNED_SHORT&&ue&&(ee=ue.R16_EXT),G===i.SHORT&&ue&&(ee=ue.R16_SNORM_EXT)),v===i.RED_INTEGER&&(G===i.UNSIGNED_BYTE&&(ee=i.R8UI),G===i.UNSIGNED_SHORT&&(ee=i.R16UI),G===i.UNSIGNED_INT&&(ee=i.R32UI),G===i.BYTE&&(ee=i.R8I),G===i.SHORT&&(ee=i.R16I),G===i.INT&&(ee=i.R32I)),v===i.RG&&(G===i.FLOAT&&(ee=i.RG32F),G===i.HALF_FLOAT&&(ee=i.RG16F),G===i.UNSIGNED_BYTE&&(ee=i.RG8),G===i.UNSIGNED_SHORT&&ue&&(ee=ue.RG16_EXT),G===i.SHORT&&ue&&(ee=ue.RG16_SNORM_EXT)),v===i.RG_INTEGER&&(G===i.UNSIGNED_BYTE&&(ee=i.RG8UI),G===i.UNSIGNED_SHORT&&(ee=i.RG16UI),G===i.UNSIGNED_INT&&(ee=i.RG32UI),G===i.BYTE&&(ee=i.RG8I),G===i.SHORT&&(ee=i.RG16I),G===i.INT&&(ee=i.RG32I)),v===i.RGB_INTEGER&&(G===i.UNSIGNED_BYTE&&(ee=i.RGB8UI),G===i.UNSIGNED_SHORT&&(ee=i.RGB16UI),G===i.UNSIGNED_INT&&(ee=i.RGB32UI),G===i.BYTE&&(ee=i.RGB8I),G===i.SHORT&&(ee=i.RGB16I),G===i.INT&&(ee=i.RGB32I)),v===i.RGBA_INTEGER&&(G===i.UNSIGNED_BYTE&&(ee=i.RGBA8UI),G===i.UNSIGNED_SHORT&&(ee=i.RGBA16UI),G===i.UNSIGNED_INT&&(ee=i.RGBA32UI),G===i.BYTE&&(ee=i.RGBA8I),G===i.SHORT&&(ee=i.RGBA16I),G===i.INT&&(ee=i.RGBA32I)),v===i.RGB&&(G===i.UNSIGNED_SHORT&&ue&&(ee=ue.RGB16_EXT),G===i.SHORT&&ue&&(ee=ue.RGB16_SNORM_EXT),G===i.UNSIGNED_INT_5_9_9_9_REV&&(ee=i.RGB9_E5),G===i.UNSIGNED_INT_10F_11F_11F_REV&&(ee=i.R11F_G11F_B10F)),v===i.RGBA){let ie=le?_r:Ye.getTransfer(Z);G===i.FLOAT&&(ee=i.RGBA32F),G===i.HALF_FLOAT&&(ee=i.RGBA16F),G===i.UNSIGNED_BYTE&&(ee=ie===st?i.SRGB8_ALPHA8:i.RGBA8),G===i.UNSIGNED_SHORT&&ue&&(ee=ue.RGBA16_EXT),G===i.SHORT&&ue&&(ee=ue.RGBA16_SNORM_EXT),G===i.UNSIGNED_SHORT_4_4_4_4&&(ee=i.RGBA4),G===i.UNSIGNED_SHORT_5_5_5_1&&(ee=i.RGB5_A1)}return(ee===i.R16F||ee===i.R32F||ee===i.RG16F||ee===i.RG32F||ee===i.RGBA16F||ee===i.RGBA32F)&&e.get("EXT_color_buffer_float"),ee}function b(R,v){let G;return R?v===null||v===In||v===Xs?G=i.DEPTH24_STENCIL8:v===zt?G=i.DEPTH32F_STENCIL8:v===Ws&&(G=i.DEPTH24_STENCIL8,Ce("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===In||v===Xs?G=i.DEPTH_COMPONENT24:v===zt?G=i.DEPTH_COMPONENT32F:v===Ws&&(G=i.DEPTH_COMPONENT16),G}function T(R,v){return f(R)===!0||R.isFramebufferTexture&&R.minFilter!==Mt&&R.minFilter!==pt?Math.log2(Math.max(v.width,v.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?v.mipmaps.length:1}function C(R){let v=R.target;v.removeEventListener("dispose",C),E(v),v.isVideoTexture&&h.delete(v),v.isHTMLTexture&&d.delete(v)}function _(R){let v=R.target;v.removeEventListener("dispose",_),P(v)}function E(R){let v=n.get(R);if(v.__webglInit===void 0)return;let G=R.source,X=p.get(G);if(X){let Z=X[v.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&D(R),Object.keys(X).length===0&&p.delete(G)}n.remove(R)}function D(R){let v=n.get(R);i.deleteTexture(v.__webglTexture);let G=R.source,X=p.get(G);delete X[v.__cacheKey],a.memory.textures--}function P(R){let v=n.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),n.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(v.__webglFramebuffer[X]))for(let Z=0;Z<v.__webglFramebuffer[X].length;Z++)i.deleteFramebuffer(v.__webglFramebuffer[X][Z]);else i.deleteFramebuffer(v.__webglFramebuffer[X]);v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer[X])}else{if(Array.isArray(v.__webglFramebuffer))for(let X=0;X<v.__webglFramebuffer.length;X++)i.deleteFramebuffer(v.__webglFramebuffer[X]);else i.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&i.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let X=0;X<v.__webglColorRenderbuffer.length;X++)v.__webglColorRenderbuffer[X]&&i.deleteRenderbuffer(v.__webglColorRenderbuffer[X]);v.__webglDepthRenderbuffer&&i.deleteRenderbuffer(v.__webglDepthRenderbuffer)}let G=R.textures;for(let X=0,Z=G.length;X<Z;X++){let le=n.get(G[X]);le.__webglTexture&&(i.deleteTexture(le.__webglTexture),a.memory.textures--),n.remove(G[X])}n.remove(R)}let z=0;function U(){z=0}function w(){return z}function O(R){z=R}function W(){let R=z;return R>=s.maxTextures&&Ce("WebGLTextures: Trying to use "+(R+1)+" texture units while this GPU supports only "+s.maxTextures),z+=1,R}function $(R){let v=[];return v.push(R.wrapS),v.push(R.wrapT),v.push(R.wrapR||0),v.push(R.magFilter),v.push(R.minFilter),v.push(R.anisotropy),v.push(R.internalFormat),v.push(R.format),v.push(R.type),v.push(R.generateMipmaps),v.push(R.premultiplyAlpha),v.push(R.flipY),v.push(R.unpackAlignment),v.push(R.colorSpace),v.join()}function Q(R,v){let G=n.get(R);if(R.isVideoTexture&&B(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&G.__version!==R.version){let X=R.image;if(X===null)Ce("WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)Ce("WebGLRenderer: Texture marked for update but image is incomplete");else{Se(G,R,v);return}}else R.isExternalTexture&&(G.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,G.__webglTexture,i.TEXTURE0+v)}function Y(R,v){let G=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&G.__version!==R.version){Se(G,R,v);return}else R.isExternalTexture&&(G.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,G.__webglTexture,i.TEXTURE0+v)}function j(R,v){let G=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&G.__version!==R.version){Se(G,R,v);return}t.bindTexture(i.TEXTURE_3D,G.__webglTexture,i.TEXTURE0+v)}function se(R,v){let G=n.get(R);if(R.isCubeDepthTexture!==!0&&R.version>0&&G.__version!==R.version){De(G,R,v);return}t.bindTexture(i.TEXTURE_CUBE_MAP,G.__webglTexture,i.TEXTURE0+v)}let ae={[_n]:i.REPEAT,[Ot]:i.CLAMP_TO_EDGE,[Es]:i.MIRRORED_REPEAT},Me={[Mt]:i.NEAREST,[go]:i.NEAREST_MIPMAP_NEAREST,[es]:i.NEAREST_MIPMAP_LINEAR,[pt]:i.LINEAR,[Gs]:i.LINEAR_MIPMAP_NEAREST,[vn]:i.LINEAR_MIPMAP_LINEAR},Ue={[Td]:i.NEVER,[Cd]:i.ALWAYS,[wd]:i.LESS,[tl]:i.LEQUAL,[Ed]:i.EQUAL,[nl]:i.GEQUAL,[Ad]:i.GREATER,[Rd]:i.NOTEQUAL};function _e(R,v){if(v.type===zt&&e.has("OES_texture_float_linear")===!1&&(v.magFilter===pt||v.magFilter===Gs||v.magFilter===es||v.magFilter===vn||v.minFilter===pt||v.minFilter===Gs||v.minFilter===es||v.minFilter===vn)&&Ce("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(R,i.TEXTURE_WRAP_S,ae[v.wrapS]),i.texParameteri(R,i.TEXTURE_WRAP_T,ae[v.wrapT]),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,ae[v.wrapR]),i.texParameteri(R,i.TEXTURE_MAG_FILTER,Me[v.magFilter]),i.texParameteri(R,i.TEXTURE_MIN_FILTER,Me[v.minFilter]),v.compareFunction&&(i.texParameteri(R,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(R,i.TEXTURE_COMPARE_FUNC,Ue[v.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===Mt||v.minFilter!==es&&v.minFilter!==vn||v.type===zt&&e.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||n.get(v).__currentAnisotropy){let G=e.get("EXT_texture_filter_anisotropic");i.texParameterf(R,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,s.getMaxAnisotropy())),n.get(v).__currentAnisotropy=v.anisotropy}}}function Je(R,v){let G=!1;R.__webglInit===void 0&&(R.__webglInit=!0,v.addEventListener("dispose",C));let X=v.source,Z=p.get(X);Z===void 0&&(Z={},p.set(X,Z));let le=$(v);if(le!==R.__cacheKey){Z[le]===void 0&&(Z[le]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,G=!0),Z[le].usedTimes++;let ue=Z[R.__cacheKey];ue!==void 0&&(Z[R.__cacheKey].usedTimes--,ue.usedTimes===0&&D(v)),R.__cacheKey=le,R.__webglTexture=Z[le].texture}return G}function J(R,v,G){return Math.floor(Math.floor(R/G)/v)}function te(R,v,G,X){let le=R.updateRanges;if(le.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,v.width,v.height,G,X,v.data);else{le.sort((Ee,me)=>Ee.start-me.start);let ue=0;for(let Ee=1;Ee<le.length;Ee++){let me=le[ue],de=le[Ee],Ie=me.start+me.count,Le=J(de.start,v.width,4),ze=J(me.start,v.width,4);de.start<=Ie+1&&Le===ze&&J(de.start+de.count-1,v.width,4)===Le?me.count=Math.max(me.count,de.start+de.count-me.start):(++ue,le[ue]=de)}le.length=ue+1;let ee=t.getParameter(i.UNPACK_ROW_LENGTH),ie=t.getParameter(i.UNPACK_SKIP_PIXELS),ce=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,v.width);for(let Ee=0,me=le.length;Ee<me;Ee++){let de=le[Ee],Ie=Math.floor(de.start/4),Le=Math.ceil(de.count/4),ze=Ie%v.width,F=Math.floor(Ie/v.width),fe=Le,ne=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,ze),t.pixelStorei(i.UNPACK_SKIP_ROWS,F),t.texSubImage2D(i.TEXTURE_2D,0,ze,F,fe,ne,G,X,v.data)}R.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,ee),t.pixelStorei(i.UNPACK_SKIP_PIXELS,ie),t.pixelStorei(i.UNPACK_SKIP_ROWS,ce)}}function Se(R,v,G){let X=i.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(X=i.TEXTURE_2D_ARRAY),v.isData3DTexture&&(X=i.TEXTURE_3D);let Z=Je(R,v),le=v.source;t.bindTexture(X,R.__webglTexture,i.TEXTURE0+G);let ue=n.get(le);if(le.version!==ue.__version||Z===!0){if(t.activeTexture(i.TEXTURE0+G),(typeof ImageBitmap<"u"&&v.image instanceof ImageBitmap)===!1){let ne=Ye.getPrimaries(Ye.workingColorSpace),pe=v.colorSpace===Pn?null:Ye.getPrimaries(v.colorSpace),ve=v.colorSpace===Pn||ne===pe?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ve)}t.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment);let ie=m(v.image,!1,s.maxTextureSize);ie=Ze(v,ie);let ce=r.convert(v.format,v.colorSpace),Ee=r.convert(v.type),me=S(v.internalFormat,ce,Ee,v.normalized,v.colorSpace,v.isVideoTexture);_e(X,v);let de,Ie=v.mipmaps,Le=v.isVideoTexture!==!0,ze=ue.__version===void 0||Z===!0,F=le.dataReady,fe=T(v,ie);if(v.isDepthTexture)me=b(v.format===Li,v.type),ze&&(Le?t.texStorage2D(i.TEXTURE_2D,1,me,ie.width,ie.height):t.texImage2D(i.TEXTURE_2D,0,me,ie.width,ie.height,0,ce,Ee,null));else if(v.isDataTexture)if(Ie.length>0){Le&&ze&&t.texStorage2D(i.TEXTURE_2D,fe,me,Ie[0].width,Ie[0].height);for(let ne=0,pe=Ie.length;ne<pe;ne++)de=Ie[ne],Le?F&&t.texSubImage2D(i.TEXTURE_2D,ne,0,0,de.width,de.height,ce,Ee,de.data):t.texImage2D(i.TEXTURE_2D,ne,me,de.width,de.height,0,ce,Ee,de.data);v.generateMipmaps=!1}else Le?(ze&&t.texStorage2D(i.TEXTURE_2D,fe,me,ie.width,ie.height),F&&te(v,ie,ce,Ee)):t.texImage2D(i.TEXTURE_2D,0,me,ie.width,ie.height,0,ce,Ee,ie.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){Le&&ze&&t.texStorage3D(i.TEXTURE_2D_ARRAY,fe,me,Ie[0].width,Ie[0].height,ie.depth);for(let ne=0,pe=Ie.length;ne<pe;ne++)if(de=Ie[ne],v.format!==en)if(ce!==null)if(Le){if(F)if(v.layerUpdates.size>0){let ve=nh(de.width,de.height,v.format,v.type);for(let re of v.layerUpdates){let Pe=de.data.subarray(re*ve/de.data.BYTES_PER_ELEMENT,(re+1)*ve/de.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ne,0,0,re,de.width,de.height,1,ce,Pe)}}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ne,0,0,0,de.width,de.height,ie.depth,ce,de.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ne,me,de.width,de.height,ie.depth,0,de.data,0,0);else Ce("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Le?F&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,ne,0,0,0,de.width,de.height,ie.depth,ce,Ee,de.data):t.texImage3D(i.TEXTURE_2D_ARRAY,ne,me,de.width,de.height,ie.depth,0,ce,Ee,de.data);v.layerUpdates.size>0&&v.clearLayerUpdates()}else{Le&&ze&&t.texStorage2D(i.TEXTURE_2D,fe,me,Ie[0].width,Ie[0].height);for(let ne=0,pe=Ie.length;ne<pe;ne++)de=Ie[ne],v.format!==en?ce!==null?Le?F&&t.compressedTexSubImage2D(i.TEXTURE_2D,ne,0,0,de.width,de.height,ce,de.data):t.compressedTexImage2D(i.TEXTURE_2D,ne,me,de.width,de.height,0,de.data):Ce("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Le?F&&t.texSubImage2D(i.TEXTURE_2D,ne,0,0,de.width,de.height,ce,Ee,de.data):t.texImage2D(i.TEXTURE_2D,ne,me,de.width,de.height,0,ce,Ee,de.data)}else if(v.isDataArrayTexture)if(Le){if(ze&&t.texStorage3D(i.TEXTURE_2D_ARRAY,fe,me,ie.width,ie.height,ie.depth),F)if(v.layerUpdates.size>0){let ne=nh(ie.width,ie.height,v.format,v.type);for(let pe of v.layerUpdates){let ve=ie.data.subarray(pe*ne/ie.data.BYTES_PER_ELEMENT,(pe+1)*ne/ie.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,pe,ie.width,ie.height,1,ce,Ee,ve)}v.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ie.width,ie.height,ie.depth,ce,Ee,ie.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,me,ie.width,ie.height,ie.depth,0,ce,Ee,ie.data);else if(v.isData3DTexture)Le?(ze&&t.texStorage3D(i.TEXTURE_3D,fe,me,ie.width,ie.height,ie.depth),F&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ie.width,ie.height,ie.depth,ce,Ee,ie.data)):t.texImage3D(i.TEXTURE_3D,0,me,ie.width,ie.height,ie.depth,0,ce,Ee,ie.data);else if(v.isFramebufferTexture){if(ze)if(Le)t.texStorage2D(i.TEXTURE_2D,fe,me,ie.width,ie.height);else{let ne=ie.width,pe=ie.height;for(let ve=0;ve<fe;ve++)t.texImage2D(i.TEXTURE_2D,ve,me,ne,pe,0,ce,Ee,null),ne>>=1,pe>>=1}}else if(v.isHTMLTexture){if("texElementImage2D"in i){let ne=i.canvas;if(ne.hasAttribute("layoutsubtree")||ne.setAttribute("layoutsubtree","true"),ie.parentNode!==ne){ne.appendChild(ie),d.add(v),ne.onpaint=pe=>{let ve=pe.changedElements;for(let re of d)ve.includes(re.image)&&(re.needsUpdate=!0)},ne.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,ie);else{let ve=i.RGBA,re=i.RGBA,Pe=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,ve,re,Pe,ie)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(Ie.length>0){if(Le&&ze){let ne=He(Ie[0]);t.texStorage2D(i.TEXTURE_2D,fe,me,ne.width,ne.height)}for(let ne=0,pe=Ie.length;ne<pe;ne++)de=Ie[ne],Le?F&&t.texSubImage2D(i.TEXTURE_2D,ne,0,0,ce,Ee,de):t.texImage2D(i.TEXTURE_2D,ne,me,ce,Ee,de);v.generateMipmaps=!1}else if(Le){if(ze){let ne=He(ie);t.texStorage2D(i.TEXTURE_2D,fe,me,ne.width,ne.height)}F&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ce,Ee,ie)}else t.texImage2D(i.TEXTURE_2D,0,me,ce,Ee,ie);f(v)&&M(X),ue.__version=le.version,v.onUpdate&&v.onUpdate(v)}R.__version=v.version}function De(R,v,G){if(v.image.length!==6)return;let X=Je(R,v),Z=v.source;t.bindTexture(i.TEXTURE_CUBE_MAP,R.__webglTexture,i.TEXTURE0+G);let le=n.get(Z);if(Z.version!==le.__version||X===!0){t.activeTexture(i.TEXTURE0+G);let ue=Ye.getPrimaries(Ye.workingColorSpace),ee=v.colorSpace===Pn?null:Ye.getPrimaries(v.colorSpace),ie=v.colorSpace===Pn||ue===ee?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ie);let ce=v.isCompressedTexture||v.image[0].isCompressedTexture,Ee=v.image[0]&&v.image[0].isDataTexture,me=[];for(let re=0;re<6;re++)!ce&&!Ee?me[re]=m(v.image[re],!0,s.maxCubemapSize):me[re]=Ee?v.image[re].image:v.image[re],me[re]=Ze(v,me[re]);let de=me[0],Ie=r.convert(v.format,v.colorSpace),Le=r.convert(v.type),ze=S(v.internalFormat,Ie,Le,v.normalized,v.colorSpace),F=v.isVideoTexture!==!0,fe=le.__version===void 0||X===!0,ne=Z.dataReady,pe=T(v,de);_e(i.TEXTURE_CUBE_MAP,v);let ve;if(ce){F&&fe&&t.texStorage2D(i.TEXTURE_CUBE_MAP,pe,ze,de.width,de.height);for(let re=0;re<6;re++){ve=me[re].mipmaps;for(let Pe=0;Pe<ve.length;Pe++){let Ae=ve[Pe];v.format!==en?Ie!==null?F?ne&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Pe,0,0,Ae.width,Ae.height,Ie,Ae.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Pe,ze,Ae.width,Ae.height,0,Ae.data):Ce("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):F?ne&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Pe,0,0,Ae.width,Ae.height,Ie,Le,Ae.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Pe,ze,Ae.width,Ae.height,0,Ie,Le,Ae.data)}}}else{if(ve=v.mipmaps,F&&fe){ve.length>0&&pe++;let re=He(me[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,pe,ze,re.width,re.height)}for(let re=0;re<6;re++)if(Ee){F?ne&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,me[re].width,me[re].height,Ie,Le,me[re].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,ze,me[re].width,me[re].height,0,Ie,Le,me[re].data);for(let Pe=0;Pe<ve.length;Pe++){let lt=ve[Pe].image[re].image;F?ne&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Pe+1,0,0,lt.width,lt.height,Ie,Le,lt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Pe+1,ze,lt.width,lt.height,0,Ie,Le,lt.data)}}else{F?ne&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,Ie,Le,me[re]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,ze,Ie,Le,me[re]);for(let Pe=0;Pe<ve.length;Pe++){let Ae=ve[Pe];F?ne&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Pe+1,0,0,Ie,Le,Ae.image[re]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Pe+1,ze,Ie,Le,Ae.image[re])}}}f(v)&&M(i.TEXTURE_CUBE_MAP),le.__version=Z.version,v.onUpdate&&v.onUpdate(v)}R.__version=v.version}function ye(R,v,G,X,Z,le){let ue=r.convert(G.format,G.colorSpace),ee=r.convert(G.type),ie=S(G.internalFormat,ue,ee,G.normalized,G.colorSpace),ce=n.get(v),Ee=n.get(G);if(Ee.__renderTarget=v,!ce.__hasExternalTextures){let me=Math.max(1,v.width>>le),de=Math.max(1,v.height>>le);Z===i.TEXTURE_3D||Z===i.TEXTURE_2D_ARRAY?t.texImage3D(Z,le,ie,me,de,v.depth,0,ue,ee,null):t.texImage2D(Z,le,ie,me,de,0,ue,ee,null)}t.bindFramebuffer(i.FRAMEBUFFER,R),yt(v)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,X,Z,Ee.__webglTexture,0,ot(v)):(Z===i.TEXTURE_2D||Z>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,X,Z,Ee.__webglTexture,le),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ve(R,v,G){if(i.bindRenderbuffer(i.RENDERBUFFER,R),v.depthBuffer){let X=v.depthTexture,Z=X&&X.isDepthTexture?X.type:null,le=b(v.stencilBuffer,Z),ue=v.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;yt(v)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ot(v),le,v.width,v.height):G?i.renderbufferStorageMultisample(i.RENDERBUFFER,ot(v),le,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,le,v.width,v.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,ue,i.RENDERBUFFER,R)}else{let X=v.textures;for(let Z=0;Z<X.length;Z++){let le=X[Z],ue=r.convert(le.format,le.colorSpace),ee=r.convert(le.type),ie=S(le.internalFormat,ue,ee,le.normalized,le.colorSpace);yt(v)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ot(v),ie,v.width,v.height):G?i.renderbufferStorageMultisample(i.RENDERBUFFER,ot(v),ie,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,ie,v.width,v.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Tt(R,v,G){let X=v.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,R),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let Z=n.get(v.depthTexture);if(Z.__renderTarget=v,(!Z.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),X){if(Z.__webglInit===void 0&&(Z.__webglInit=!0,v.depthTexture.addEventListener("dispose",C)),Z.__webglTexture===void 0){Z.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,Z.__webglTexture),_e(i.TEXTURE_CUBE_MAP,v.depthTexture);let ce=r.convert(v.depthTexture.format),Ee=r.convert(v.depthTexture.type),me;v.depthTexture.format===On?me=i.DEPTH_COMPONENT24:v.depthTexture.format===Li&&(me=i.DEPTH24_STENCIL8);for(let de=0;de<6;de++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+de,0,me,v.width,v.height,0,ce,Ee,null)}}else Q(v.depthTexture,0);let le=Z.__webglTexture,ue=ot(v),ee=X?i.TEXTURE_CUBE_MAP_POSITIVE_X+G:i.TEXTURE_2D,ie=v.depthTexture.format===Li?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(v.depthTexture.format===On)yt(v)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ie,ee,le,0,ue):i.framebufferTexture2D(i.FRAMEBUFFER,ie,ee,le,0);else if(v.depthTexture.format===Li)yt(v)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ie,ee,le,0,ue):i.framebufferTexture2D(i.FRAMEBUFFER,ie,ee,le,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Be(R){let v=n.get(R),G=R.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==R.depthTexture){let X=R.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),X){let Z=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,X.removeEventListener("dispose",Z)};X.addEventListener("dispose",Z),v.__depthDisposeCallback=Z}v.__boundDepthTexture=X}if(R.depthTexture&&!v.__autoAllocateDepthBuffer)if(G)for(let X=0;X<6;X++)Tt(v.__webglFramebuffer[X],R,X);else{let X=R.texture.mipmaps;X&&X.length>0?Tt(v.__webglFramebuffer[0],R,0):Tt(v.__webglFramebuffer,R,0)}else if(G){v.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(t.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer[X]),v.__webglDepthbuffer[X]===void 0)v.__webglDepthbuffer[X]=i.createRenderbuffer(),Ve(v.__webglDepthbuffer[X],R,!1);else{let Z=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,le=v.__webglDepthbuffer[X];i.bindRenderbuffer(i.RENDERBUFFER,le),i.framebufferRenderbuffer(i.FRAMEBUFFER,Z,i.RENDERBUFFER,le)}}else{let X=R.texture.mipmaps;if(X&&X.length>0?t.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=i.createRenderbuffer(),Ve(v.__webglDepthbuffer,R,!1);else{let Z=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,le=v.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,le),i.framebufferRenderbuffer(i.FRAMEBUFFER,Z,i.RENDERBUFFER,le)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Qe(R,v,G){let X=n.get(R);v!==void 0&&ye(X.__webglFramebuffer,R,R.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),G!==void 0&&Be(R)}function nt(R){let v=R.texture,G=n.get(R),X=n.get(v);R.addEventListener("dispose",_);let Z=R.textures,le=R.isWebGLCubeRenderTarget===!0,ue=Z.length>1;if(ue||(X.__webglTexture===void 0&&(X.__webglTexture=i.createTexture()),X.__version=v.version,a.memory.textures++),le){G.__webglFramebuffer=[];for(let ee=0;ee<6;ee++)if(v.mipmaps&&v.mipmaps.length>0){G.__webglFramebuffer[ee]=[];for(let ie=0;ie<v.mipmaps.length;ie++)G.__webglFramebuffer[ee][ie]=i.createFramebuffer()}else G.__webglFramebuffer[ee]=i.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){G.__webglFramebuffer=[];for(let ee=0;ee<v.mipmaps.length;ee++)G.__webglFramebuffer[ee]=i.createFramebuffer()}else G.__webglFramebuffer=i.createFramebuffer();if(ue)for(let ee=0,ie=Z.length;ee<ie;ee++){let ce=n.get(Z[ee]);ce.__webglTexture===void 0&&(ce.__webglTexture=i.createTexture(),a.memory.textures++)}if(R.samples>0&&yt(R)===!1){G.__webglMultisampledFramebuffer=i.createFramebuffer(),G.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let ee=0;ee<Z.length;ee++){let ie=Z[ee];G.__webglColorRenderbuffer[ee]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,G.__webglColorRenderbuffer[ee]);let ce=r.convert(ie.format,ie.colorSpace),Ee=r.convert(ie.type),me=S(ie.internalFormat,ce,Ee,ie.normalized,ie.colorSpace,R.isXRRenderTarget===!0),de=ot(R);i.renderbufferStorageMultisample(i.RENDERBUFFER,de,me,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ee,i.RENDERBUFFER,G.__webglColorRenderbuffer[ee])}i.bindRenderbuffer(i.RENDERBUFFER,null),R.depthBuffer&&(G.__webglDepthRenderbuffer=i.createRenderbuffer(),Ve(G.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(le){t.bindTexture(i.TEXTURE_CUBE_MAP,X.__webglTexture),_e(i.TEXTURE_CUBE_MAP,v);for(let ee=0;ee<6;ee++)if(v.mipmaps&&v.mipmaps.length>0)for(let ie=0;ie<v.mipmaps.length;ie++)ye(G.__webglFramebuffer[ee][ie],R,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,ie);else ye(G.__webglFramebuffer[ee],R,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0);f(v)&&M(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ue){for(let ee=0,ie=Z.length;ee<ie;ee++){let ce=Z[ee],Ee=n.get(ce),me=i.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(me=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(me,Ee.__webglTexture),_e(me,ce),ye(G.__webglFramebuffer,R,ce,i.COLOR_ATTACHMENT0+ee,me,0),f(ce)&&M(me)}t.unbindTexture()}else{let ee=i.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(ee=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ee,X.__webglTexture),_e(ee,v),v.mipmaps&&v.mipmaps.length>0)for(let ie=0;ie<v.mipmaps.length;ie++)ye(G.__webglFramebuffer[ie],R,v,i.COLOR_ATTACHMENT0,ee,ie);else ye(G.__webglFramebuffer,R,v,i.COLOR_ATTACHMENT0,ee,0);f(v)&&M(ee),t.unbindTexture()}R.depthBuffer&&Be(R)}function qe(R){let v=R.textures;for(let G=0,X=v.length;G<X;G++){let Z=v[G];if(f(Z)){let le=A(R),ue=n.get(Z).__webglTexture;t.bindTexture(le,ue),M(le),t.unbindTexture()}}}let ut=[],vt=[];function Ct(R){if(R.samples>0){if(yt(R)===!1){let v=R.textures,G=R.width,X=R.height,Z=i.COLOR_BUFFER_BIT,le=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ue=n.get(R),ee=v.length>1;if(ee)for(let ce=0;ce<v.length;ce++)t.bindFramebuffer(i.FRAMEBUFFER,ue.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ce,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,ue.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ce,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,ue.__webglMultisampledFramebuffer);let ie=R.texture.mipmaps;ie&&ie.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ue.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ue.__webglFramebuffer);for(let ce=0;ce<v.length;ce++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(Z|=i.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(Z|=i.STENCIL_BUFFER_BIT)),ee){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,ue.__webglColorRenderbuffer[ce]);let Ee=n.get(v[ce]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Ee,0)}i.blitFramebuffer(0,0,G,X,0,0,G,X,Z,i.NEAREST),l===!0&&(ut.length=0,vt.length=0,ut.push(i.COLOR_ATTACHMENT0+ce),R.depthBuffer&&R.storeMultisampledDepthBuffer===!1&&(ut.push(le),vt.push(le),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,vt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ut))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ee)for(let ce=0;ce<v.length;ce++){t.bindFramebuffer(i.FRAMEBUFFER,ue.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ce,i.RENDERBUFFER,ue.__webglColorRenderbuffer[ce]);let Ee=n.get(v[ce]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,ue.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ce,i.TEXTURE_2D,Ee,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ue.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.storeMultisampledDepthBuffer===!1&&l){let v=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[v])}}}function ot(R){return Math.min(s.maxSamples,R.samples)}function yt(R){let v=n.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function B(R){let v=a.render.frame;h.get(R)!==v&&(h.set(R,v),R.update())}function Ze(R,v){let G=R.colorSpace,X=R.format,Z=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||G!==kt&&G!==Pn&&(Ye.getTransfer(G)===st?(X!==en||Z!==an)&&Ce("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Fe("WebGLTextures: Unsupported texture color space:",G)),v}function He(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=W,this.resetTextureUnits=U,this.getTextureUnits=w,this.setTextureUnits=O,this.setTexture2D=Q,this.setTexture2DArray=Y,this.setTexture3D=j,this.setTextureCube=se,this.rebindTextures=Qe,this.setupRenderTarget=nt,this.updateRenderTargetMipmap=qe,this.updateMultisampleRenderTarget=Ct,this.setupDepthRenderbuffer=Be,this.setupFrameBufferTexture=ye,this.useMultisampledRTT=yt,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function W_(i,e){function t(n,s=Pn){let r,a=Ye.getTransfer(s);if(n===an)return i.UNSIGNED_BYTE;if(n===_o)return i.UNSIGNED_SHORT_4_4_4_4;if(n===vo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Wc)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Xc)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Hc)return i.BYTE;if(n===Gc)return i.SHORT;if(n===Ws)return i.UNSIGNED_SHORT;if(n===xo)return i.INT;if(n===In)return i.UNSIGNED_INT;if(n===zt)return i.FLOAT;if(n===Qt)return i.HALF_FLOAT;if(n===qc)return i.ALPHA;if(n===Yc)return i.RGB;if(n===en)return i.RGBA;if(n===On)return i.DEPTH_COMPONENT;if(n===Li)return i.DEPTH_STENCIL;if(n===yo)return i.RED;if(n===So)return i.RED_INTEGER;if(n===Di)return i.RG;if(n===Mo)return i.RG_INTEGER;if(n===bo)return i.RGBA_INTEGER;if(n===Gr||n===Wr||n===Xr||n===qr)if(a===st)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Gr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Wr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Xr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===qr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Gr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Wr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Xr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===qr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===To||n===wo||n===Eo||n===Ao)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===To)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===wo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Eo)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ao)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ro||n===Co||n===Io||n===Po||n===Lo||n===Yr||n===Do)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Ro||n===Co)return a===st?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Io)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Po)return r.COMPRESSED_R11_EAC;if(n===Lo)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Yr)return r.COMPRESSED_RG11_EAC;if(n===Do)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===No||n===Uo||n===Fo||n===Oo||n===Bo||n===zo||n===ko||n===Vo||n===Ho||n===Go||n===Wo||n===Xo||n===qo||n===Yo)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===No)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Uo)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Fo)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Oo)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Bo)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===zo)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ko)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Vo)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ho)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Go)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Wo)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Xo)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===qo)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Yo)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===$o||n===Ko||n===Zo)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===$o)return a===st?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Ko)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Zo)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===jo||n===Jo||n===$r||n===Qo)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===jo)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Jo)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===$r)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Qo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Xs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var X_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,q_=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,gh=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Lr(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new fn({vertexShader:X_,fragmentShader:q_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ht(new sn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},xh=class extends Bn{constructor(e,t){super();let n=this,s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,d=null,u=null,p=null,g=null,y=typeof XRWebGLBinding<"u",m=new gh,f={},M=t.getContextAttributes(),A=null,S=null,b=[],T=[],C=new Ge,_=null,E=null,D=new wt;D.viewport=new at;let P=new wt;P.viewport=new at;let z=[D,P],U=new uo,w=null,O=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let te=b[J];return te===void 0&&(te=new Ps,b[J]=te),te.getTargetRaySpace()},this.getControllerGrip=function(J){let te=b[J];return te===void 0&&(te=new Ps,b[J]=te),te.getGripSpace()},this.getHand=function(J){let te=b[J];return te===void 0&&(te=new Ps,b[J]=te),te.getHandSpace()};function W(J){let te=T.indexOf(J.inputSource);if(te===-1)return;let Se=b[te];Se!==void 0&&(Se.update(J.inputSource,J.frame,c||a),Se.dispatchEvent({type:J.type,data:J.inputSource}))}function $(){s.removeEventListener("select",W),s.removeEventListener("selectstart",W),s.removeEventListener("selectend",W),s.removeEventListener("squeeze",W),s.removeEventListener("squeezestart",W),s.removeEventListener("squeezeend",W),s.removeEventListener("end",$),s.removeEventListener("inputsourceschange",Q);for(let J=0;J<b.length;J++){let te=T[J];te!==null&&(T[J]=null,b[J].disconnect(te))}w=null,O=null,m.reset();for(let J in f)delete f[J];if(e.setRenderTarget(A),p=null,u=null,d=null,s=null,S=null,Je.stop(),n.isPresenting=!1,e.setPixelRatio(_),e.setSize(C.width,C.height,!1),E!==null){let J=E.camera;J.fov=E.fov,J.zoom=E.zoom,J.updateProjectionMatrix(),E=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){r=J,n.isPresenting===!0&&Ce("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){o=J,n.isPresenting===!0&&Ce("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(J){c=J},this.getBaseLayer=function(){return u!==null?u:p},this.getBinding=function(){return d===null&&y&&(d=new XRWebGLBinding(s,t)),d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(J){if(s=J,s!==null){if(A=e.getRenderTarget(),s.addEventListener("select",W),s.addEventListener("selectstart",W),s.addEventListener("selectend",W),s.addEventListener("squeeze",W),s.addEventListener("squeezestart",W),s.addEventListener("squeezeend",W),s.addEventListener("end",$),s.addEventListener("inputsourceschange",Q),M.xrCompatible!==!0&&await t.makeXRCompatible(),_=e.getPixelRatio(),e.getSize(C),y&&"createProjectionLayer"in XRWebGLBinding.prototype){let Se=null,De=null,ye=null;M.depth&&(ye=M.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Se=M.stencil?Li:On,De=M.stencil?Xs:In);let Ve={colorFormat:t.RGBA8,depthFormat:ye,scaleFactor:r};d=this.getBinding(),u=d.createProjectionLayer(Ve),s.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),S=new tn(u.textureWidth,u.textureHeight,{format:en,type:an,depthTexture:new Ci(u.textureWidth,u.textureHeight,De,void 0,void 0,void 0,void 0,void 0,void 0,Se),stencilBuffer:M.stencil,colorSpace:e.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{let Se={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,Se),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),S=new tn(p.framebufferWidth,p.framebufferHeight,{format:en,type:an,colorSpace:e.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1,storeMultisampledDepthBuffer:p.ignoreDepthValues===!1,storeMultisampledStencilBuffer:p.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Je.setContext(s),Je.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function Q(J){for(let te=0;te<J.removed.length;te++){let Se=J.removed[te],De=T.indexOf(Se);De>=0&&(T[De]=null,b[De].disconnect(Se))}for(let te=0;te<J.added.length;te++){let Se=J.added[te],De=T.indexOf(Se);if(De===-1){for(let Ve=0;Ve<b.length;Ve++)if(Ve>=T.length){T.push(Se),De=Ve;break}else if(T[Ve]===null){T[Ve]=Se,De=Ve;break}if(De===-1)break}let ye=b[De];ye&&ye.connect(Se)}}let Y=new V,j=new V;function se(J,te,Se){Y.setFromMatrixPosition(te.matrixWorld),j.setFromMatrixPosition(Se.matrixWorld);let De=Y.distanceTo(j),ye=te.projectionMatrix.elements,Ve=Se.projectionMatrix.elements,Tt=ye[14]/(ye[10]-1),Be=ye[14]/(ye[10]+1),Qe=(ye[9]+1)/ye[5],nt=(ye[9]-1)/ye[5],qe=(ye[8]-1)/ye[0],ut=(Ve[8]+1)/Ve[0],vt=Tt*qe,Ct=Tt*ut,ot=De/(-qe+ut),yt=ot*-qe;if(te.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(yt),J.translateZ(ot),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),ye[10]===-1)J.projectionMatrix.copy(te.projectionMatrix),J.projectionMatrixInverse.copy(te.projectionMatrixInverse);else{let B=Tt+ot,Ze=Be+ot,He=vt-yt,R=Ct+(De-yt),v=Qe*Be/Ze*B,G=nt*Be/Ze*B;J.projectionMatrix.makePerspective(He,R,v,G,B,Ze),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function ae(J,te){te===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(te.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(s===null)return;let te=J.near,Se=J.far;m.texture!==null&&(m.depthNear>0&&(te=m.depthNear),m.depthFar>0&&(Se=m.depthFar)),U.near=P.near=D.near=te,U.far=P.far=D.far=Se,(w!==U.near||O!==U.far)&&(s.updateRenderState({depthNear:U.near,depthFar:U.far}),w=U.near,O=U.far),U.layers.mask=J.layers.mask|6,D.layers.mask=U.layers.mask&-5,P.layers.mask=U.layers.mask&-3;let De=J.parent,ye=U.cameras;ae(U,De);for(let Ve=0;Ve<ye.length;Ve++)ae(ye[Ve],De);ye.length===2?se(U,D,P):U.projectionMatrix.copy(D.projectionMatrix),E===null&&J.isPerspectiveCamera&&(E={camera:J,fov:J.fov,zoom:J.zoom}),Me(J,U,De)};function Me(J,te,Se){Se===null?J.matrix.copy(te.matrixWorld):(J.matrix.copy(Se.matrixWorld),J.matrix.invert(),J.matrix.multiply(te.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(te.projectionMatrix),J.projectionMatrixInverse.copy(te.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=qi*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return U},this.getFoveation=function(){if(!(u===null&&p===null))return l},this.setFoveation=function(J){l=J,u!==null&&(u.fixedFoveation=J),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=J)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(U)},this.getCameraTexture=function(J){return f[J]};let Ue=null;function _e(J,te){if(h=te.getViewerPose(c||a),g=te,h!==null){let Se=h.views;p!==null&&(e.setRenderTargetFramebuffer(S,p.framebuffer),e.setRenderTarget(S));let De=!1;Se.length!==U.cameras.length&&(U.cameras.length=0,De=!0);for(let Be=0;Be<Se.length;Be++){let Qe=Se[Be],nt=null;if(p!==null)nt=p.getViewport(Qe);else{let ut=d.getViewSubImage(u,Qe);nt=ut.viewport,Be===0&&(e.setRenderTargetTextures(S,ut.colorTexture,ut.depthStencilTexture),e.setRenderTarget(S))}let qe=z[Be];qe===void 0&&(qe=new wt,qe.layers.enable(Be),qe.viewport=new at,z[Be]=qe),qe.matrix.fromArray(Qe.transform.matrix),qe.matrix.decompose(qe.position,qe.quaternion,qe.scale),qe.projectionMatrix.fromArray(Qe.projectionMatrix),qe.projectionMatrixInverse.copy(qe.projectionMatrix).invert(),qe.viewport.set(nt.x,nt.y,nt.width,nt.height),Be===0&&(U.matrix.copy(qe.matrix),U.matrix.decompose(U.position,U.quaternion,U.scale)),De===!0&&U.cameras.push(qe)}let ye=s.enabledFeatures;if(ye&&ye.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&y){d=n.getBinding();let Be=d.getDepthInformation(Se[0]);Be&&Be.isValid&&Be.texture&&m.init(Be,s.renderState)}if(ye&&ye.includes("camera-access")&&y){e.state.unbindTexture(),d=n.getBinding();for(let Be=0;Be<Se.length;Be++){let Qe=Se[Be].camera;if(Qe){let nt=f[Qe];nt||(nt=new Lr,f[Qe]=nt);let qe=d.getCameraImage(Qe);nt.sourceTexture=qe}}}}for(let Se=0;Se<b.length;Se++){let De=T[Se],ye=b[Se];De!==null&&ye!==void 0&&ye.update(De,te,c||a)}Ue&&Ue(J,te),te.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:te}),g=null}let Je=new af;Je.setAnimationLoop(_e),this.setAnimationLoop=function(J){Ue=J},this.dispose=function(){}}},Y_=new ke,df=new Oe;df.set(-1,0,0,0,1,0,0,0,1);function $_(i,e){function t(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,Qc(i)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function s(m,f,M,A,S){f.isNodeMaterial?f.uniformsNeedUpdate=!1:f.isMeshBasicMaterial?r(m,f):f.isMeshLambertMaterial?(r(m,f),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)):f.isMeshToonMaterial?(r(m,f),d(m,f)):f.isMeshPhongMaterial?(r(m,f),h(m,f),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)):f.isMeshStandardMaterial?(r(m,f),u(m,f),f.isMeshPhysicalMaterial&&p(m,f,S)):f.isMeshMatcapMaterial?(r(m,f),g(m,f)):f.isMeshDepthMaterial?r(m,f):f.isMeshDistanceMaterial?(r(m,f),y(m,f)):f.isMeshNormalMaterial?r(m,f):f.isLineBasicMaterial?(a(m,f),f.isLineDashedMaterial&&o(m,f)):f.isPointsMaterial?l(m,f,M,A):f.isSpriteMaterial?c(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,t(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Jt&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,t(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Jt&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,t(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,t(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);let M=e.get(f),A=M.envMap,S=M.envMapRotation;A&&(m.envMap.value=A,m.envMapRotation.value.setFromMatrix4(Y_.makeRotationFromEuler(S)).transpose(),A.isCubeTexture&&A.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(df),m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,m.aoMapTransform))}function a(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform))}function o(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function l(m,f,M,A){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*M,m.scale.value=A*.5,f.map&&(m.map.value=f.map,t(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function c(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function h(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function d(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function u(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,M){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Jt&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.retroreflectivity>0&&(m.retroreflectivity.value=f.retroreflectivity),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=M.texture,m.transmissionSamplerSize.value.set(M.width,M.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function y(m,f){let M=e.get(f).light;m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),m.nearDistance.value=M.shadow.camera.near,m.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function K_(i,e,t,n){let s={},r={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(S,b){let T=b.program;n.uniformBlockBinding(S,T)}function c(S,b){let T=s[S.id];T===void 0&&(m(S),T=h(S),s[S.id]=T,S.addEventListener("dispose",M));let C=b.program;n.updateUBOMapping(S,C);let _=e.render.frame;r[S.id]!==_&&(u(S),r[S.id]=_)}function h(S){let b=d();S.__bindingPointIndex=b;let T=i.createBuffer(),C=S.__size,_=S.usage;return i.bindBuffer(i.UNIFORM_BUFFER,T),i.bufferData(i.UNIFORM_BUFFER,C,_),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,b,T),T}function d(){for(let S=0;S<o;S++)if(a.indexOf(S)===-1)return a.push(S),S;return Fe("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(S){let b=s[S.id],T=S.uniforms,C=S.__cache;i.bindBuffer(i.UNIFORM_BUFFER,b);for(let _=0,E=T.length;_<E;_++){let D=T[_];if(Array.isArray(D))for(let P=0,z=D.length;P<z;P++)p(D[P],_,P,C);else p(D,_,0,C)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(S,b,T,C){if(y(S,b,T,C)===!0){let _=S.__offset,E=S.value;if(Array.isArray(E)){let D=0;for(let P=0;P<E.length;P++){let z=E[P],U=f(z);g(z,S.__data,D),typeof z!="number"&&typeof z!="boolean"&&!z.isMatrix3&&!ArrayBuffer.isView(z)&&(D+=U.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(E,S.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,_,S.__data)}}function g(S,b,T){typeof S=="number"||typeof S=="boolean"?b[0]=S:S.isMatrix3?(b[0]=S.elements[0],b[1]=S.elements[1],b[2]=S.elements[2],b[3]=0,b[4]=S.elements[3],b[5]=S.elements[4],b[6]=S.elements[5],b[7]=0,b[8]=S.elements[6],b[9]=S.elements[7],b[10]=S.elements[8],b[11]=0):ArrayBuffer.isView(S)?b.set(new S.constructor(S.buffer,S.byteOffset,b.length)):S.toArray(b,T)}function y(S,b,T,C){let _=S.value,E=b+"_"+T;if(C[E]===void 0)return typeof _=="number"||typeof _=="boolean"?C[E]=_:ArrayBuffer.isView(_)?C[E]=_.slice():C[E]=_.clone(),!0;{let D=C[E];if(typeof _=="number"||typeof _=="boolean"){if(D!==_)return C[E]=_,!0}else{if(ArrayBuffer.isView(_))return!0;if(D.equals(_)===!1)return D.copy(_),!0}}return!1}function m(S){let b=S.uniforms,T=0,C=16;for(let E=0,D=b.length;E<D;E++){let P=Array.isArray(b[E])?b[E]:[b[E]];for(let z=0,U=P.length;z<U;z++){let w=P[z],O=Array.isArray(w.value)?w.value:[w.value];for(let W=0,$=O.length;W<$;W++){let Q=O[W],Y=f(Q),j=T%C,se=j%Y.boundary,ae=j+se;T+=se,ae!==0&&C-ae<Y.storage&&(T+=C-ae),w.__data=new Float32Array(Y.storage/Float32Array.BYTES_PER_ELEMENT),w.__offset=T,T+=Y.storage}}}let _=T%C;return _>0&&(T+=C-_),S.__size=T,S.__cache={},this}function f(S){let b={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(b.boundary=4,b.storage=4):S.isVector2?(b.boundary=8,b.storage=8):S.isVector3||S.isColor?(b.boundary=16,b.storage=12):S.isVector4?(b.boundary=16,b.storage=16):S.isMatrix3?(b.boundary=48,b.storage=48):S.isMatrix4?(b.boundary=64,b.storage=64):S.isTexture?Ce("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(S)?(b.boundary=16,b.storage=S.byteLength):Ce("WebGLRenderer: Unsupported uniform value type.",S),b}function M(S){let b=S.target;b.removeEventListener("dispose",M);let T=a.indexOf(b.__bindingPointIndex);a.splice(T,1),i.deleteBuffer(s[b.id]),delete s[b.id],delete r[b.id]}function A(){for(let S in s)i.deleteBuffer(s[S]);a=[],s={},r={}}return{bind:l,update:c,dispose:A}}var Z_=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Xn=null;function j_(){return Xn===null&&(Xn=new zn(Z_,16,16,Di,Qt),Xn.name="DFG_LUT",Xn.minFilter=pt,Xn.magFilter=pt,Xn.wrapS=Ot,Xn.wrapT=Ot,Xn.generateMipmaps=!1,Xn.needsUpdate=!0),Xn}var al=class{constructor(e={}){let{canvas:t=Id(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1,outputBufferType:p=an}=e;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=a;let y=p,m=new Set([bo,Mo,So]),f=new Set([an,In,Ws,Xs,_o,vo]),M=new Uint32Array(4),A=new Int32Array(4),S=new V,b=null,T=null,C=[],_=[],E=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=pn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let D=this,P=!1,z=null,U=null,w=null,O=null;this._outputColorSpace=xt;let W=0,$=0,Q=null,Y=-1,j=null,se=new at,ae=new at,Me=null,Ue=new Ne(0),_e=0,Je=t.width,J=t.height,te=1,Se=null,De=null,ye=new at(0,0,Je,J),Ve=new at(0,0,Je,J),Tt=!1,Be=new Us,Qe=!1,nt=!1,qe=new ke,ut=new V,vt=new at,Ct={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},ot=!1;function yt(){return Q===null?te:1}let B=n;function Ze(x,I){return t.getContext(x,I)}let He,R,v,G,X,Z,le,ue,ee,ie,ce,Ee,me,de,Ie,Le,ze,F,fe,ne,pe,ve,re;try{let x={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"186"}`),t.addEventListener("webglcontextlost",lt,!1),t.addEventListener("webglcontextrestored",tt,!1),t.addEventListener("webglcontextcreationerror",cn,!1),B===null){let I="webgl2";if(B=Ze(I,x),B===null)throw Ze(I)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Pe()}catch(x){throw t.removeEventListener("webglcontextlost",lt,!1),t.removeEventListener("webglcontextrestored",tt,!1),t.removeEventListener("webglcontextcreationerror",cn,!1),Fe("WebGLRenderer: "+x.message),x}function Pe(){He=new sx(B),He.init(),pe=new W_(B,He),R=new $0(B,He,e,pe),v=new H_(B,He),R.reversedDepthBuffer&&u&&v.buffers.depth.setReversed(!0),U=B.createFramebuffer(),w=B.createFramebuffer(),O=B.createFramebuffer(),G=new ox(B),X=new R_,Z=new G_(B,He,v,X,R,pe,G),le=new ix(D),ue=new cm(B),ve=new q0(B,ue),ee=new rx(B,ue,G,ve),ie=new cx(B,ee,ue,ve,G),F=new lx(B,R,Z),Ie=new K0(X),ce=new A_(D,le,He,R,ve,Ie),Ee=new $_(D,X),me=new I_,de=new F_(He),ze=new X0(D,le,v,ie,g,l),Le=new V_(D,ie,R),re=new K_(B,G,R,v),fe=new Y0(B,He,G),ne=new ax(B,He,G),G.programs=ce.programs,D.capabilities=R,D.extensions=He,D.properties=X,D.renderLists=me,D.shadowMap=Le,D.state=v,D.info=G}y!==an&&(E=new ux(y,t.width,t.height,o,s,r));let Ae=new xh(D,B);this.xr=Ae,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){let x=He.get("WEBGL_lose_context");x&&x.loseContext()},this.forceContextRestore=function(){let x=He.get("WEBGL_lose_context");x&&x.restoreContext()},this.getPixelRatio=function(){return te},this.setPixelRatio=function(x){x!==void 0&&(te=x,this.setSize(Je,J,!1))},this.getSize=function(x){return x.set(Je,J)},this.setSize=function(x,I,H=!0){if(Ae.isPresenting){Ce("WebGLRenderer: Can't change size while VR device is presenting.");return}Je=x,J=I,t.width=Math.floor(x*te),t.height=Math.floor(I*te),H===!0&&(t.style.width=x+"px",t.style.height=I+"px"),E!==null&&E.setSize(t.width,t.height),this.setViewport(0,0,x,I)},this.getDrawingBufferSize=function(x){return x.set(Je*te,J*te).floor()},this.setDrawingBufferSize=function(x,I,H){Je=x,J=I,te=H,t.width=Math.floor(x*H),t.height=Math.floor(I*H),this.setViewport(0,0,x,I)},this.setEffects=function(x){if(y===an){Fe("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(x){for(let I=0;I<x.length;I++)if(x[I].isOutputPass===!0){Ce("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}E.setEffects(x||[])},this.getCurrentViewport=function(x){return x.copy(se)},this.getViewport=function(x){return x.copy(ye)},this.setViewport=function(x,I,H,N){x.isVector4?ye.set(x.x,x.y,x.z,x.w):ye.set(x,I,H,N),v.viewport(se.copy(ye).multiplyScalar(te).round())},this.getScissor=function(x){return x.copy(Ve)},this.setScissor=function(x,I,H,N){x.isVector4?Ve.set(x.x,x.y,x.z,x.w):Ve.set(x,I,H,N),v.scissor(ae.copy(Ve).multiplyScalar(te).round())},this.getScissorTest=function(){return Tt},this.setScissorTest=function(x){v.setScissorTest(Tt=x)},this.setOpaqueSort=function(x){Se=x},this.setTransparentSort=function(x){De=x},this.getClearColor=function(x){return x.copy(ze.getClearColor())},this.setClearColor=function(){ze.setClearColor(...arguments)},this.getClearAlpha=function(){return ze.getClearAlpha()},this.setClearAlpha=function(){ze.setClearAlpha(...arguments)},this.clear=function(x=!0,I=!0,H=!0){let N=0;if(x){let k=!1;if(Q!==null){let oe=Q.texture.format;k=m.has(oe)}if(k){let oe=Q.texture.type,ge=f.has(oe),he=ze.getClearColor(),Te=ze.getClearAlpha(),Re=he.r,We=he.g,je=he.b;ge?(M[0]=Re,M[1]=We,M[2]=je,M[3]=Te,B.clearBufferuiv(B.COLOR,0,M)):(A[0]=Re,A[1]=We,A[2]=je,A[3]=Te,B.clearBufferiv(B.COLOR,0,A))}else N|=B.COLOR_BUFFER_BIT}I&&(N|=B.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),H&&(N|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),N!==0&&B.clear(N)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(x){x.setRenderer(this),z=x},this.dispose=function(){t.removeEventListener("webglcontextlost",lt,!1),t.removeEventListener("webglcontextrestored",tt,!1),t.removeEventListener("webglcontextcreationerror",cn,!1),ze.dispose(),me.dispose(),de.dispose(),X.dispose(),le.dispose(),ie.dispose(),ve.dispose(),re.dispose(),ce.dispose(),Ae.dispose(),Ae.removeEventListener("sessionstart",Vl),Ae.removeEventListener("sessionend",Hl),$n.stop()};function lt(x){x.preventDefault(),vr("WebGLRenderer: Context Lost."),P=!0}function tt(){vr("WebGLRenderer: Context Restored."),P=!1;let x=G.autoReset,I=Le.enabled,H=Le.autoUpdate,N=Le.needsUpdate,k=Le.type;Pe(),G.autoReset=x,Le.enabled=I,Le.autoUpdate=H,Le.needsUpdate=N,Le.type=k}function cn(x){Fe("WebGLRenderer: A WebGL context could not be created. Reason: ",x.statusMessage)}function mn(x){let I=x.target;I.removeEventListener("dispose",mn),zl(I)}function zl(x){kl(x),X.remove(x)}function kl(x){let I=X.get(x).programs;I!==void 0&&(I.forEach(function(H){ce.releaseProgram(H)}),x.isShaderMaterial&&ce.releaseShaderCache(x))}this.renderBufferDirect=function(x,I,H,N,k,oe){I===null&&(I=Ct);let ge=k.isMesh&&k.matrixWorld.determinantAffine()<0,he=Wl(x,I,H,N,k);v.setMaterial(N,ge);let Te=H.index,Re=1;if(N.wireframe===!0){if(Te=ee.getWireframeAttribute(H),Te===void 0)return;Re=2}let We=H.drawRange,je=H.attributes.position,we=We.start*Re,it=(We.start+We.count)*Re;oe!==null&&(we=Math.max(we,oe.start*Re),it=Math.min(it,(oe.start+oe.count)*Re)),Te!==null?(we=Math.max(we,0),it=Math.min(it,Te.count)):je!=null&&(we=Math.max(we,0),it=Math.min(it,je.count));let It=it-we;if(It<0||It===1/0)return;ve.setup(k,N,he,H,Te);let gt,dt=fe;if(Te!==null&&(gt=ue.get(Te),dt=ne,dt.setIndex(gt)),k.isMesh)N.wireframe===!0?(v.setLineWidth(N.wireframeLinewidth*yt()),dt.setMode(B.LINES)):dt.setMode(B.TRIANGLES);else if(k.isLine){let Vt=N.linewidth;Vt===void 0&&(Vt=1),v.setLineWidth(Vt*yt()),k.isLineSegments?dt.setMode(B.LINES):k.isLineLoop?dt.setMode(B.LINE_LOOP):dt.setMode(B.LINE_STRIP)}else k.isPoints?dt.setMode(B.POINTS):k.isSprite&&dt.setMode(B.TRIANGLES);if(k.isBatchedMesh)if(He.get("WEBGL_multi_draw"))dt.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else{let Vt=k._multiDrawStarts,be=k._multiDrawCounts,$t=k._multiDrawCount,et=Te?ue.get(Te).bytesPerElement:1,gn=X.get(N).currentProgram.getUniforms();for(let Nn=0;Nn<$t;Nn++)gn.setValue(B,"_gl_DrawID",Nn),dt.render(Vt[Nn]/et,be[Nn])}else if(k.isInstancedMesh)dt.renderInstances(we,It,k.count);else if(H.isInstancedBufferGeometry){let Vt=H._maxInstanceCount!==void 0?H._maxInstanceCount:1/0,be=Math.min(H.instanceCount,Vt);dt.renderInstances(we,It,be)}else dt.render(we,It)};function rr(x,I,H,N){z!==null&&x.isNodeMaterial&&z.setObject(N,x),Qe===!0&&Ie.setState(x,H,!1),x.transparent===!0&&x.side===Dt&&x.forceSinglePass===!1?(x.side=Jt,x.needsUpdate=!0,Kn(x,I,N),x.side=Gn,x.needsUpdate=!0,Kn(x,I,N),x.side=Dt):Kn(x,I,N)}this.compile=function(x,I,H=null){H===null&&(H=x),z!==null&&z.renderStart(x,I,H),T=de.get(H),T.init(I),_.push(T),H.traverseVisible(function(k){k.isLight&&k.layers.test(I.layers)&&(T.pushLight(k),k.castShadow&&T.pushShadow(k))}),x!==H&&x.traverseVisible(function(k){k.isLight&&k.layers.test(I.layers)&&(T.pushLight(k),k.castShadow&&T.pushShadow(k))}),T.setupLights(),z!==null&&z.updateLights(T.state.lightsArray),nt=this.localClippingEnabled,Qe=Ie.init(this.clippingPlanes,nt),Qe===!0&&Ie.setGlobalState(this.clippingPlanes,I),z!==null&&Le.render(T.state.shadowsArray,H,I);let N=new Set;return x.traverse(function(k){if(!(k.isMesh||k.isPoints||k.isLine||k.isSprite))return;let oe=k.material;if(oe)if(Array.isArray(oe))for(let ge=0;ge<oe.length;ge++){let he=oe[ge];rr(he,H,I,k),N.add(he)}else rr(oe,H,I,k),N.add(oe)}),T=_.pop(),z!==null&&z.renderEnd(),N},this.compileAsync=function(x,I,H=null){let N=this.compile(x,I,H);return new Promise(k=>{function oe(){if(N.forEach(function(ge){let Te=X.get(ge).currentProgram;(Te===void 0||Te.isReady())&&N.delete(ge)}),N.size===0){k(x);return}setTimeout(oe,10)}He.get("KHR_parallel_shader_compile")!==null?oe():setTimeout(oe,10)})};let Bi=null;function du(x){Bi&&Bi(x)}function Vl(){$n.stop()}function Hl(){$n.start()}let $n=new af;$n.setAnimationLoop(du),typeof self<"u"&&$n.setContext(self),this.setAnimationLoop=function(x){Bi=x,Ae.setAnimationLoop(x),x===null?$n.stop():$n.start()},Ae.addEventListener("sessionstart",Vl),Ae.addEventListener("sessionend",Hl),this.render=function(x,I){if(I!==void 0&&I.isCamera!==!0){Fe("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;z!==null&&z.renderStart(x,I);let H=Ae.enabled===!0&&Ae.isPresenting===!0,N=E!==null&&(Q===null||H)&&E.begin(D,Q);if(x.matrixWorldAutoUpdate===!0&&x.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),Ae.enabled===!0&&Ae.isPresenting===!0&&(E===null||E.isCompositing()===!1)&&(Ae.cameraAutoUpdate===!0&&Ae.updateCamera(I),I=Ae.getCamera()),x.isScene===!0&&x.onBeforeRender(D,x,I,Q),T=de.get(x,_.length),T.init(I),T.state.textureUnits=Z.getTextureUnits(),_.push(T),qe.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),Be.setFromProjectionMatrix(qe,An,I.reversedDepth),nt=this.localClippingEnabled,Qe=Ie.init(this.clippingPlanes,nt),b=me.get(x,C.length),b.init(),C.push(b),Ae.enabled===!0&&Ae.isPresenting===!0){let ge=D.xr.getDepthSensingMesh();ge!==null&&ar(ge,I,-1/0,D.sortObjects)}ar(x,I,0,D.sortObjects),b.finish(),z!==null&&z.updateLights(T.state.lightsArray),D.sortObjects===!0&&b.sort(Se,De),ot=Ae.enabled===!1||Ae.isPresenting===!1||Ae.hasDepthSensing()===!1,ot&&ze.addToRenderList(b,x),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Qe===!0&&Ie.beginShadows();let k=T.state.shadowsArray;if(Le.render(k,x,I),Qe===!0&&Ie.endShadows(),(N&&E.hasRenderPass())===!1){let ge=b.opaque,he=b.transmissive;if(T.setupLights(),I.isArrayCamera){let Te=I.cameras;if(he.length>0)for(let Re=0,We=Te.length;Re<We;Re++){let je=Te[Re];ua(ge,he,x,je)}ot&&ze.render(x);for(let Re=0,We=Te.length;Re<We;Re++){let je=Te[Re];as(b,x,je,je.viewport)}}else he.length>0&&ua(ge,he,x,I),ot&&ze.render(x),as(b,x,I)}Q!==null&&$===0&&(Z.updateMultisampleRenderTarget(Q),Z.updateRenderTargetMipmap(Q)),N&&E.end(D),x.isScene===!0&&x.onAfterRender(D,x,I),ve.resetDefaultState(),Y=-1,j=null,_.pop(),_.length>0?(T=_[_.length-1],Z.setTextureUnits(T.state.textureUnits),Qe===!0&&Ie.setGlobalState(D.clippingPlanes,T.state.camera)):T=null,C.pop(),C.length>0?b=C[C.length-1]:b=null,z!==null&&z.renderEnd()};function ar(x,I,H,N){if(x.visible===!1)return;if(x.layers.test(I.layers)){if(x.isGroup)H=x.renderOrder;else if(x.isLOD)x.autoUpdate===!0&&x.update(I);else if(x.isLightProbeGrid)T.pushLightProbeGrid(x);else if(x.isLight)T.pushLight(x),x.castShadow&&T.pushShadow(x);else if(x.isSprite){if(!x.frustumCulled||x.intersectsFrustum(Be)){N&&vt.setFromMatrixPosition(x.matrixWorld).applyMatrix4(qe);let ge=ie.update(x),he=x.material;he.visible&&b.push(x,ge,he,H,vt.z,null,I)}}else if((x.isMesh||x.isLine||x.isPoints)&&(!x.frustumCulled||x.intersectsFrustum(Be))){let ge=ie.update(x),he=x.material;if(N&&(x.boundingSphere!==void 0?(x.boundingSphere===null&&x.computeBoundingSphere(),vt.copy(x.boundingSphere.center)):(ge.boundingSphere===null&&ge.computeBoundingSphere(),vt.copy(ge.boundingSphere.center)),vt.applyMatrix4(x.matrixWorld).applyMatrix4(qe)),Array.isArray(he)){let Te=ge.groups;for(let Re=0,We=Te.length;Re<We;Re++){let je=Te[Re],we=he[je.materialIndex];we&&we.visible&&b.push(x,ge,we,H,vt.z,je,I)}}else he.visible&&b.push(x,ge,he,H,vt.z,null,I)}}let oe=x.children;for(let ge=0,he=oe.length;ge<he;ge++)ar(oe[ge],I,H,N)}function as(x,I,H,N){let{opaque:k,transmissive:oe,transparent:ge}=x;T.setupLightsView(H),Qe===!0&&Ie.setGlobalState(D.clippingPlanes,H),N&&v.viewport(se.copy(N)),k.length>0&&os(k,I,H),oe.length>0&&os(oe,I,H),ge.length>0&&os(ge,I,H),v.buffers.depth.setTest(!0),v.buffers.depth.setMask(!0),v.buffers.color.setMask(!0),v.setPolygonOffset(!1)}function ua(x,I,H,N){if((H.isScene===!0?H.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[N.id]===void 0){let we=He.has("EXT_color_buffer_half_float")||He.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[N.id]=new tn(1,1,{generateMipmaps:!0,type:we?Qt:an,minFilter:vn,samples:Math.max(4,R.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Ye.workingColorSpace})}let oe=T.state.transmissionRenderTarget[N.id],ge=N.viewport||se;oe.setSize(ge.z*D.transmissionResolutionScale,ge.w*D.transmissionResolutionScale);let he=D.getRenderTarget(),Te=D.getActiveCubeFace(),Re=D.getActiveMipmapLevel();D.setRenderTarget(oe),D.getClearColor(Ue),_e=D.getClearAlpha(),_e<1&&D.setClearColor(16777215,.5),D.clear(),ot&&ze.render(H);let We=D.toneMapping;D.toneMapping=pn;let je=N.viewport;if(N.viewport!==void 0&&(N.viewport=void 0),T.setupLightsView(N),Qe===!0&&Ie.setGlobalState(D.clippingPlanes,N),os(x,H,N),Z.updateMultisampleRenderTarget(oe),Z.updateRenderTargetMipmap(oe),He.has("WEBGL_multisampled_render_to_texture")===!1){let we=!1;for(let it=0,It=I.length;it<It;it++){let gt=I[it],{object:dt,geometry:Vt,material:be,group:$t}=gt;if(be.side===Dt&&dt.layers.test(N.layers)){let et=be.side;be.side=Jt,be.needsUpdate=!0,da(dt,H,N,Vt,be,$t),be.side=et,be.needsUpdate=!0,we=!0}}we===!0&&(Z.updateMultisampleRenderTarget(oe),Z.updateRenderTargetMipmap(oe))}D.setRenderTarget(he,Te,Re),D.setClearColor(Ue,_e),je!==void 0&&(N.viewport=je),D.toneMapping=We}function os(x,I,H){let N=I.isScene===!0?I.overrideMaterial:null;for(let k=0,oe=x.length;k<oe;k++){let ge=x[k],{object:he,geometry:Te,group:Re}=ge,We=ge.material;We.allowOverride===!0&&N!==null&&(We=N),he.layers.test(H.layers)&&da(he,I,H,Te,We,Re)}}function da(x,I,H,N,k,oe){z!==null&&k.isNodeMaterial&&z.setObject(x,k),x.onBeforeRender(D,I,H,N,k,oe),x.modelViewMatrix.multiplyMatrices(H.matrixWorldInverse,x.matrixWorld),x.normalMatrix.getNormalMatrix(x.modelViewMatrix),k.onBeforeRender(D,I,H,N,x,oe),k.transparent===!0&&k.side===Dt&&k.forceSinglePass===!1?(k.side=Jt,k.needsUpdate=!0,D.renderBufferDirect(H,I,N,k,x,oe),k.side=Gn,k.needsUpdate=!0,D.renderBufferDirect(H,I,N,k,x,oe),k.side=Dt):D.renderBufferDirect(H,I,N,k,x,oe),x.onAfterRender(D,I,H,N,k,oe)}function Kn(x,I,H){I.isScene!==!0&&(I=Ct);let N=X.get(x),k=T.state.lights,oe=T.state.shadowsArray,ge=k.state.version,he=ce.getParameters(x,k.state,oe,I,H,T.state.lightProbeGridArray),Te=ce.getProgramCacheKey(he),Re=N.programs;N.environment=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?I.environment:null,N.fog=I.fog;let We=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap;N.envMap=le.get(x.envMap||N.environment,We),N.envMapRotation=N.environment!==null&&x.envMap===null?I.environmentRotation:x.envMapRotation,Re===void 0&&(x.addEventListener("dispose",mn),Re=new Map,N.programs=Re);let je=Re.get(Te);if(je!==void 0){if(N.currentProgram===je&&N.lightsStateVersion===ge)return or(x,he),je}else he.uniforms=ce.getUniforms(x),z!==null&&x.isNodeMaterial&&z.build(x,H,he),x.onBeforeCompile(he,D),je=ce.acquireProgram(he,Te),Re.set(Te,je),N.uniforms=he.uniforms;let we=N.uniforms;return(!x.isShaderMaterial&&!x.isRawShaderMaterial||x.clipping===!0)&&(we.clippingPlanes=Ie.uniform),or(x,he),N.needsLights=K(x),N.lightsStateVersion=ge,N.needsLights&&(we.ambientLightColor.value=k.state.ambient,we.lightProbe.value=k.state.probe,we.sunLights.value=k.state.sun,we.sunLightShadows.value=k.state.sunShadow,we.directionalLights.value=k.state.directional,we.directionalLightShadows.value=k.state.directionalShadow,we.spotLights.value=k.state.spot,we.spotLightShadows.value=k.state.spotShadow,we.rectAreaLights.value=k.state.rectArea,we.ltc_1.value=k.state.rectAreaLTC1,we.ltc_2.value=k.state.rectAreaLTC2,we.pointLights.value=k.state.point,we.pointLightShadows.value=k.state.pointShadow,we.hemisphereLights.value=k.state.hemi,we.sunShadowMatrix.value=k.state.sunShadowMatrix,we.sunShadowCascade.value=k.state.sunShadowCascade,we.directionalShadowMatrix.value=k.state.directionalShadowMatrix,we.spotLightMatrix.value=k.state.spotLightMatrix,we.spotLightMap.value=k.state.spotLightMap,we.pointShadowMatrix.value=k.state.pointShadowMatrix),N.lightProbeGrid=T.state.lightProbeGridArray.length>0,N.currentProgram=je,N.uniformsList=null,je}function fa(x){if(x.uniformsList===null){let I=x.currentProgram.getUniforms();x.uniformsList=Ks.seqWithValue(I.seq,x.uniforms)}return x.uniformsList}function or(x,I){let H=X.get(x);H.outputColorSpace=I.outputColorSpace,H.batching=I.batching,H.batchingColor=I.batchingColor,H.instancing=I.instancing,H.instancingColor=I.instancingColor,H.instancingMorph=I.instancingMorph,H.skinning=I.skinning,H.morphTargets=I.morphTargets,H.morphNormals=I.morphNormals,H.morphColors=I.morphColors,H.morphTargetsCount=I.morphTargetsCount,H.numClippingPlanes=I.numClippingPlanes,H.numIntersection=I.numClipIntersection,H.vertexAlphas=I.vertexAlphas,H.vertexTangents=I.vertexTangents,H.toneMapping=I.toneMapping}function Gl(x,I){if(x.length===0)return null;if(x.length===1)return x[0].texture!==null?x[0]:null;S.setFromMatrixPosition(I.matrixWorld);for(let H=0,N=x.length;H<N;H++){let k=x[H];if(k.texture!==null&&k.boundingBox.containsPoint(S))return k}return null}function Wl(x,I,H,N,k){I.isScene!==!0&&(I=Ct),Z.resetTextureUnits();let oe=I.fog,ge=N.isMeshStandardMaterial||N.isMeshLambertMaterial||N.isMeshPhongMaterial?I.environment:null,he=Q===null?D.outputColorSpace:Q.isXRRenderTarget===!0?Q.texture.colorSpace:Ye.workingColorSpace,Te=N.isMeshStandardMaterial||N.isMeshLambertMaterial&&!N.envMap||N.isMeshPhongMaterial&&!N.envMap,Re=le.get(N.envMap||ge,Te),We=N.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,je=!!H.attributes.tangent&&(!!N.normalMap||N.anisotropy>0),we=!!H.morphAttributes.position,it=!!H.morphAttributes.normal,It=!!H.morphAttributes.color,gt=pn;N.toneMapped&&(Q===null||Q.isXRRenderTarget===!0)&&(gt=D.toneMapping);let dt=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,Vt=dt!==void 0?dt.length:0,be=X.get(N),$t=T.state.lights;if(Qe===!0&&(nt===!0||x!==j)){let mt=x===j&&N.id===Y;Ie.setState(N,x,mt)}let et=!1;N.version===be.__version?(be.needsLights&&be.lightsStateVersion!==$t.state.version||be.outputColorSpace!==he||k.isBatchedMesh&&be.batching===!1||!k.isBatchedMesh&&be.batching===!0||k.isBatchedMesh&&be.batchingColor===!0&&k._colorsTexture===null||k.isBatchedMesh&&be.batchingColor===!1&&k._colorsTexture!==null||k.isInstancedMesh&&be.instancing===!1||!k.isInstancedMesh&&be.instancing===!0||k.isSkinnedMesh&&be.skinning===!1||!k.isSkinnedMesh&&be.skinning===!0||k.isInstancedMesh&&be.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&be.instancingColor===!1&&k.instanceColor!==null||k.isInstancedMesh&&be.instancingMorph===!0&&k.morphTexture===null||k.isInstancedMesh&&be.instancingMorph===!1&&k.morphTexture!==null||be.envMap!==Re||N.fog===!0&&be.fog!==oe||be.numClippingPlanes!==void 0&&(be.numClippingPlanes!==Ie.numPlanes||be.numIntersection!==Ie.numIntersection)||be.vertexAlphas!==We||be.vertexTangents!==je||be.morphTargets!==we||be.morphNormals!==it||be.morphColors!==It||be.toneMapping!==gt||be.morphTargetsCount!==Vt||!!be.lightProbeGrid!=T.state.lightProbeGridArray.length>0)&&(et=!0):(et=!0,be.__version=N.version);let gn=be.currentProgram;et===!0&&(gn=Kn(N,I,k),z&&N.isNodeMaterial&&z.onUpdateProgram(N,gn,be));let Nn=!1,xi=!1,ls=!1,ct=gn.getUniforms(),Et=be.uniforms;if(v.useProgram(gn.program)&&(Nn=!0,xi=!0,ls=!0),N.id!==Y&&(Y=N.id,xi=!0),be.needsLights){let mt=Gl(T.state.lightProbeGridArray,k);be.lightProbeGrid!==mt&&(be.lightProbeGrid=mt,xi=!0)}if(Nn||j!==x){v.buffers.depth.getReversed()&&x.reversedDepth!==!0&&(x._reversedDepth=!0,x.updateProjectionMatrix()),ct.setValue(B,"projectionMatrix",x.projectionMatrix),ct.setValue(B,"viewMatrix",x.matrixWorldInverse);let vi=ct.map.cameraPosition;vi!==void 0&&vi.setValue(B,ut.setFromMatrixPosition(x.matrixWorld)),R.logarithmicDepthBuffer&&ct.setValue(B,"logDepthBufFC",2/(Math.log(x.far+1)/Math.LN2)),(N.isMeshPhongMaterial||N.isMeshToonMaterial||N.isMeshLambertMaterial||N.isMeshBasicMaterial||N.isMeshStandardMaterial||N.isShaderMaterial)&&ct.setValue(B,"isOrthographic",x.isOrthographicCamera===!0),j!==x&&(j=x,xi=!0,ls=!0)}if(be.needsLights&&($t.state.sunShadowMap.length>0&&ct.setValue(B,"sunShadowMap",$t.state.sunShadowMap,Z),$t.state.directionalShadowMap.length>0&&ct.setValue(B,"directionalShadowMap",$t.state.directionalShadowMap,Z),$t.state.spotShadowMap.length>0&&ct.setValue(B,"spotShadowMap",$t.state.spotShadowMap,Z),$t.state.pointShadowMap.length>0&&ct.setValue(B,"pointShadowMap",$t.state.pointShadowMap,Z)),k.isSkinnedMesh){ct.setOptional(B,k,"bindMatrix"),ct.setOptional(B,k,"bindMatrixInverse");let mt=k.skeleton;mt&&(mt.boneTexture===null&&mt.computeBoneTexture(),ct.setValue(B,"boneTexture",mt.boneTexture,Z))}k.isBatchedMesh&&(ct.setOptional(B,k,"batchingTexture"),ct.setValue(B,"batchingTexture",k._matricesTexture,Z),ct.setOptional(B,k,"batchingIdTexture"),ct.setValue(B,"batchingIdTexture",k._indirectTexture,Z),ct.setOptional(B,k,"batchingColorTexture"),k._colorsTexture!==null&&ct.setValue(B,"batchingColorTexture",k._colorsTexture,Z));let _i=H.morphAttributes;if((_i.position!==void 0||_i.normal!==void 0||_i.color!==void 0)&&F.update(k,H,gn),(xi||be.receiveShadow!==k.receiveShadow)&&(be.receiveShadow=k.receiveShadow,ct.setValue(B,"receiveShadow",k.receiveShadow)),(N.isMeshStandardMaterial||N.isMeshLambertMaterial||N.isMeshPhongMaterial)&&N.envMap===null&&I.environment!==null&&(Et.envMapIntensity.value=I.environmentIntensity),Et.dfgLUT!==void 0&&(Et.dfgLUT.value=j_()),xi){if(ct.setValue(B,"toneMappingExposure",D.toneMappingExposure),be.needsLights&&L(Et,ls),oe&&N.fog===!0&&Ee.refreshFogUniforms(Et,oe),Ee.refreshMaterialUniforms(Et,N,te,J,T.state.transmissionRenderTarget[x.id]),be.needsLights&&be.lightProbeGrid){let mt=be.lightProbeGrid;Et.probesSH.value=mt.texture,Et.probesMin.value.copy(mt.boundingBox.min),Et.probesMax.value.copy(mt.boundingBox.max),Et.probesResolution.value.copy(mt.resolution)}Ks.upload(B,fa(be),Et,Z)}if(N.isShaderMaterial&&N.uniformsNeedUpdate===!0&&(Ks.upload(B,fa(be),Et,Z),N.uniformsNeedUpdate=!1),N.isSpriteMaterial&&ct.setValue(B,"center",k.center),ct.setValue(B,"modelViewMatrix",k.modelViewMatrix),ct.setValue(B,"normalMatrix",k.normalMatrix),ct.setValue(B,"modelMatrix",k.matrixWorld),N.uniformsGroups!==void 0){let mt=N.uniformsGroups;for(let vi=0,cs=mt.length;vi<cs;vi++){let fu=mt[vi];re.update(fu,gn),re.bind(fu,gn)}}return gn}function L(x,I){x.ambientLightColor.needsUpdate=I,x.lightProbe.needsUpdate=I,x.sunLights.needsUpdate=I,x.sunLightShadows.needsUpdate=I,x.directionalLights.needsUpdate=I,x.directionalLightShadows.needsUpdate=I,x.pointLights.needsUpdate=I,x.pointLightShadows.needsUpdate=I,x.spotLights.needsUpdate=I,x.spotLightShadows.needsUpdate=I,x.rectAreaLights.needsUpdate=I,x.hemisphereLights.needsUpdate=I}function K(x){return x.isMeshLambertMaterial||x.isMeshToonMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isShadowMaterial||x.isShaderMaterial&&x.lights===!0}this.getActiveCubeFace=function(){return W},this.getActiveMipmapLevel=function(){return $},this.getRenderTarget=function(){return Q},this.setRenderTargetTextures=function(x,I,H){let N=X.get(x);N.__autoAllocateDepthBuffer=x.resolveDepthBuffer===!1,N.__autoAllocateDepthBuffer===!1&&(N.__useRenderToTexture=!1),X.get(x.texture).__webglTexture=I,X.get(x.depthTexture).__webglTexture=N.__autoAllocateDepthBuffer?void 0:H,N.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(x,I){let H=X.get(x);H.__webglFramebuffer=I,H.__useDefaultFramebuffer=I===void 0},this.setRenderTarget=function(x,I=0,H=0){Q=x,W=I,$=H;let N=null,k=!1,oe=!1;if(x){let he=X.get(x);if(he.__useDefaultFramebuffer!==void 0){v.bindFramebuffer(B.FRAMEBUFFER,he.__webglFramebuffer),se.copy(x.viewport),ae.copy(x.scissor),Me=x.scissorTest,v.viewport(se),v.scissor(ae),v.setScissorTest(Me),Y=-1;return}else if(he.__webglFramebuffer===void 0)Z.setupRenderTarget(x);else if(he.__hasExternalTextures)Z.rebindTextures(x,X.get(x.texture).__webglTexture,X.get(x.depthTexture).__webglTexture);else if(x.depthBuffer){let We=x.depthTexture;if(he.__boundDepthTexture!==We){if(We!==null&&X.has(We)&&(x.width!==We.image.width||x.height!==We.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Z.setupDepthRenderbuffer(x)}}let Te=x.texture;(Te.isData3DTexture||Te.isDataArrayTexture||Te.isCompressedArrayTexture)&&(oe=!0);let Re=X.get(x).__webglFramebuffer;x.isWebGLCubeRenderTarget?(Array.isArray(Re[I])?N=Re[I][H]:N=Re[I],k=!0):x.samples>0&&Z.useMultisampledRTT(x)===!1?N=X.get(x).__webglMultisampledFramebuffer:Array.isArray(Re)?N=Re[H]:N=Re,se.copy(x.viewport),ae.copy(x.scissor),Me=x.scissorTest}else se.copy(ye).multiplyScalar(te).floor(),ae.copy(Ve).multiplyScalar(te).floor(),Me=Tt;if(H!==0&&(N=U),v.bindFramebuffer(B.FRAMEBUFFER,N)&&v.drawBuffers(x,N),v.viewport(se),v.scissor(ae),v.setScissorTest(Me),k){let he=X.get(x.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+I,he.__webglTexture,H)}else if(oe){let he=I;for(let Te=0;Te<x.textures.length;Te++){let Re=X.get(x.textures[Te]);B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0+Te,Re.__webglTexture,H,he)}}else if(x!==null&&H!==0){let he=X.get(x.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,he.__webglTexture,H)}Y=-1};function q(x){let I=X.get(x);return(I.__readFormat!==x.format||I.__readType!==x.type)&&(I.__readFormat=x.format,I.__readType=x.type,I.__formatReadable=R.textureFormatReadable(x.format),I.__typeReadable=R.textureTypeReadable(x.type)),I}this.readRenderTargetPixels=function(x,I,H,N,k,oe,ge,he=0){if(!(x&&x.isWebGLRenderTarget)){Fe("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Te=X.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&ge!==void 0&&(Te=Te[ge]),Te){v.bindFramebuffer(B.FRAMEBUFFER,Te);try{let Re=x.textures[he],We=Re.format,je=Re.type;x.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+he);let we=q(Re);if(we.__formatReadable===!1){Fe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(we.__typeReadable===!1){Fe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=x.width-N&&H>=0&&H<=x.height-k&&B.readPixels(I,H,N,k,pe.convert(We),pe.convert(je),oe)}finally{let Re=Q!==null?X.get(Q).__webglFramebuffer:null;v.bindFramebuffer(B.FRAMEBUFFER,Re)}}},this.readRenderTargetPixelsAsync=async function(x,I,H,N,k,oe,ge,he=0){if(!(x&&x.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Te=X.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&ge!==void 0&&(Te=Te[ge]),Te)if(I>=0&&I<=x.width-N&&H>=0&&H<=x.height-k){v.bindFramebuffer(B.FRAMEBUFFER,Te);let Re=x.textures[he],We=Re.format,je=Re.type;x.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+he);let we=q(Re);if(we.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(we.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let it=B.createBuffer();B.bindBuffer(B.PIXEL_PACK_BUFFER,it),B.bufferData(B.PIXEL_PACK_BUFFER,oe.byteLength,B.STREAM_READ),B.readPixels(I,H,N,k,pe.convert(We),pe.convert(je),0),B.bindBuffer(B.PIXEL_PACK_BUFFER,null);let It=Q!==null?X.get(Q).__webglFramebuffer:null;v.bindFramebuffer(B.FRAMEBUFFER,It);let gt=B.fenceSync(B.SYNC_GPU_COMMANDS_COMPLETE,0);return B.flush(),await Ld(B,gt,4),B.bindBuffer(B.PIXEL_PACK_BUFFER,it),B.getBufferSubData(B.PIXEL_PACK_BUFFER,0,oe),B.bindBuffer(B.PIXEL_PACK_BUFFER,null),B.deleteBuffer(it),B.deleteSync(gt),oe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(x,I=null,H=0){let N=Math.pow(2,-H),k=Math.floor(x.image.width*N),oe=Math.floor(x.image.height*N),ge=I!==null?I.x:0,he=I!==null?I.y:0;Z.setTexture2D(x,0),B.copyTexSubImage2D(B.TEXTURE_2D,H,0,0,ge,he,k,oe),v.unbindTexture()},this.copyTextureToTexture=function(x,I,H=null,N=null,k=0,oe=0){let ge,he,Te,Re,We,je,we,it,It,gt=x.isCompressedTexture?x.mipmaps[oe]:x.image;if(H!==null)ge=H.max.x-H.min.x,he=H.max.y-H.min.y,Te=H.isBox3?H.max.z-H.min.z:1,Re=H.min.x,We=H.min.y,je=H.isBox3?H.min.z:0;else{let Et=Math.pow(2,-k);ge=Math.floor(gt.width*Et),he=Math.floor(gt.height*Et),x.isDataArrayTexture?Te=gt.depth:x.isData3DTexture?Te=Math.floor(gt.depth*Et):Te=1,Re=0,We=0,je=0}N!==null?(we=N.x,it=N.y,It=N.z):(we=0,it=0,It=0);let dt=pe.convert(I.format),Vt=pe.convert(I.type),be;I.isData3DTexture?(Z.setTexture3D(I,0),be=B.TEXTURE_3D):I.isDataArrayTexture||I.isCompressedArrayTexture?(Z.setTexture2DArray(I,0),be=B.TEXTURE_2D_ARRAY):(Z.setTexture2D(I,0),be=B.TEXTURE_2D),v.activeTexture(B.TEXTURE0),v.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,I.flipY),v.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),v.pixelStorei(B.UNPACK_ALIGNMENT,I.unpackAlignment);let $t=v.getParameter(B.UNPACK_ROW_LENGTH),et=v.getParameter(B.UNPACK_IMAGE_HEIGHT),gn=v.getParameter(B.UNPACK_SKIP_PIXELS),Nn=v.getParameter(B.UNPACK_SKIP_ROWS),xi=v.getParameter(B.UNPACK_SKIP_IMAGES);v.pixelStorei(B.UNPACK_ROW_LENGTH,gt.width),v.pixelStorei(B.UNPACK_IMAGE_HEIGHT,gt.height),v.pixelStorei(B.UNPACK_SKIP_PIXELS,Re),v.pixelStorei(B.UNPACK_SKIP_ROWS,We),v.pixelStorei(B.UNPACK_SKIP_IMAGES,je);let ls=x.isDataArrayTexture||x.isData3DTexture,ct=I.isDataArrayTexture||I.isData3DTexture;if(x.isDepthTexture){let Et=X.get(x),_i=X.get(I),mt=X.get(Et.__renderTarget),vi=X.get(_i.__renderTarget);v.bindFramebuffer(B.READ_FRAMEBUFFER,mt.__webglFramebuffer),v.bindFramebuffer(B.DRAW_FRAMEBUFFER,vi.__webglFramebuffer);for(let cs=0;cs<Te;cs++)ls&&(B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,X.get(x).__webglTexture,k,je+cs),B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,X.get(I).__webglTexture,oe,It+cs)),B.blitFramebuffer(Re,We,ge,he,we,it,ge,he,B.DEPTH_BUFFER_BIT,B.NEAREST);v.bindFramebuffer(B.READ_FRAMEBUFFER,null),v.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else if(k!==0||x.isRenderTargetTexture||X.has(x)){let Et=X.get(x),_i=X.get(I);v.bindFramebuffer(B.READ_FRAMEBUFFER,w),v.bindFramebuffer(B.DRAW_FRAMEBUFFER,O);for(let mt=0;mt<Te;mt++)ls?B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Et.__webglTexture,k,je+mt):B.framebufferTexture2D(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,Et.__webglTexture,k),ct?B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,_i.__webglTexture,oe,It+mt):B.framebufferTexture2D(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,_i.__webglTexture,oe),k!==0?B.blitFramebuffer(Re,We,ge,he,we,it,ge,he,B.COLOR_BUFFER_BIT,B.NEAREST):ct?B.copyTexSubImage3D(be,oe,we,it,It+mt,Re,We,ge,he):B.copyTexSubImage2D(be,oe,we,it,Re,We,ge,he);v.bindFramebuffer(B.READ_FRAMEBUFFER,null),v.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else ct?x.isDataTexture||x.isData3DTexture?B.texSubImage3D(be,oe,we,it,It,ge,he,Te,dt,Vt,gt.data):I.isCompressedArrayTexture?B.compressedTexSubImage3D(be,oe,we,it,It,ge,he,Te,dt,gt.data):B.texSubImage3D(be,oe,we,it,It,ge,he,Te,dt,Vt,gt):x.isDataTexture?B.texSubImage2D(B.TEXTURE_2D,oe,we,it,ge,he,dt,Vt,gt.data):x.isCompressedTexture?B.compressedTexSubImage2D(B.TEXTURE_2D,oe,we,it,gt.width,gt.height,dt,gt.data):B.texSubImage2D(B.TEXTURE_2D,oe,we,it,ge,he,dt,Vt,gt);v.pixelStorei(B.UNPACK_ROW_LENGTH,$t),v.pixelStorei(B.UNPACK_IMAGE_HEIGHT,et),v.pixelStorei(B.UNPACK_SKIP_PIXELS,gn),v.pixelStorei(B.UNPACK_SKIP_ROWS,Nn),v.pixelStorei(B.UNPACK_SKIP_IMAGES,xi),oe===0&&I.generateMipmaps&&B.generateMipmap(be),v.unbindTexture()},this.initRenderTarget=function(x){X.get(x).__webglFramebuffer===void 0&&Z.setupRenderTarget(x)},this.initTexture=function(x){x.isCubeTexture?Z.setTextureCube(x,0):x.isData3DTexture?Z.setTexture3D(x,0):x.isDataArrayTexture||x.isCompressedArrayTexture?Z.setTexture2DArray(x,0):Z.setTexture2D(x,0),v.unbindTexture()},this.resetState=function(){W=0,$=0,Q=null,v.reset(),ve.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return An}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Ye._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ye._getUnpackColorSpace()}};var J_=Math.PI*2,ff=.08;function Q_(i,e,t){if(t<=0)return i/e;let n=e*ff,s=(e-n)/t,r=e*s-t*s*s/2;return i>=r?s+(i-r)/n:2*i/(e+Math.sqrt(e*e-2*t*i))}function Ni(i,e,t){return Math.sqrt(e*e+Math.max(0,i)*t/Math.PI)}function cl(i,e,t,n,s,r){let a=-e-n;if(a<=0)return[i,e,t];let o=r/J_,l=Q_(a,s,o),c=Math.max(s-o*l,s*ff)-t;return[i,-(n+c*Math.sin(l)),s-c*Math.cos(l)]}var hl=class extends Ur{constructor(e){super(e),this.type=Qt}parse(e){let a=function(_,E){switch(_){case 1:throw new Error("THREE.HDRLoader: Read Error: "+(E||""));case 2:throw new Error("THREE.HDRLoader: Write Error: "+(E||""));case 3:throw new Error("THREE.HDRLoader: Bad File Format: "+(E||""));default:case 4:throw new Error("THREE.HDRLoader: Memory Error: "+(E||""))}},d=function(_,E,D){E=E||1024;let z=_.pos,U=-1,w=0,O="",W=String.fromCharCode.apply(null,new Uint16Array(_.subarray(z,z+128)));for(;0>(U=W.indexOf(`
`))&&w<E&&z<_.byteLength;)O+=W,w+=W.length,z+=128,W=String.fromCharCode.apply(null,new Uint16Array(_.subarray(z,z+128)));return-1<U?(D!==!1&&(_.pos+=w+U+1),O+W.slice(0,U)):!1},u=function(_){let E=/^#\?(\S+)/,D=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,P=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,z=/^\s*FORMAT=(\S+)\s*$/,U=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,w={valid:0,string:"",comments:"",programtype:"RGBE",format:"",gamma:1,exposure:1,width:0,height:0},O,W;for((_.pos>=_.byteLength||!(O=d(_)))&&a(1,"no header found"),(W=O.match(E))||a(3,"bad initial token"),w.valid|=1,w.programtype=W[1],w.string+=O+`
`;O=d(_),O!==!1;){if(w.string+=O+`
`,O.charAt(0)==="#"){w.comments+=O+`
`;continue}if((W=O.match(D))&&(w.gamma=parseFloat(W[1])),(W=O.match(P))&&(w.exposure=parseFloat(W[1])),(W=O.match(z))&&(w.valid|=2,w.format=W[1]),(W=O.match(U))&&(w.valid|=4,w.height=parseInt(W[1],10),w.width=parseInt(W[2],10)),w.valid&2&&w.valid&4)break}return w.valid&2||a(3,"missing format specifier"),w.valid&4||a(3,"missing image size specifier"),w},p=function(_,E,D){let P=E;if(P<8||P>32767||_[0]!==2||_[1]!==2||_[2]&128)return new Uint8Array(_);P!==(_[2]<<8|_[3])&&a(3,"wrong scanline width");let z=new Uint8Array(4*E*D);z.length||a(4,"unable to allocate buffer space");let U=0,w=0,O=4*P,W=new Uint8Array(4),$=new Uint8Array(O),Q=D;for(;Q>0&&w<_.byteLength;){w+4>_.byteLength&&a(1),W[0]=_[w++],W[1]=_[w++],W[2]=_[w++],W[3]=_[w++],(W[0]!=2||W[1]!=2||(W[2]<<8|W[3])!=P)&&a(3,"bad rgbe scanline format");let Y=0,j;for(;Y<O&&w<_.byteLength;){j=_[w++];let ae=j>128;if(ae&&(j-=128),(j===0||Y+j>O)&&a(3,"bad scanline data"),ae){let Me=_[w++];for(let Ue=0;Ue<j;Ue++)$[Y++]=Me}else $.set(_.subarray(w,w+j),Y),Y+=j,w+=j}let se=P;for(let ae=0;ae<se;ae++){let Me=0;z[U]=$[ae+Me],Me+=P,z[U+1]=$[ae+Me],Me+=P,z[U+2]=$[ae+Me],Me+=P,z[U+3]=$[ae+Me],U+=4}Q--}return z},g=function(_,E,D,P){let z=_[E+3],U=Math.pow(2,z-128)/255;D[P+0]=_[E+0]*U,D[P+1]=_[E+1]*U,D[P+2]=_[E+2]*U,D[P+3]=1},y=function(_,E,D,P){let z=_[E+3],U=Math.pow(2,z-128)/255;D[P+0]=Ai.toHalfFloat(Math.min(_[E+0]*U,65504)),D[P+1]=Ai.toHalfFloat(Math.min(_[E+1]*U,65504)),D[P+2]=Ai.toHalfFloat(Math.min(_[E+2]*U,65504)),D[P+3]=Ai.toHalfFloat(1)},m=new Uint8Array(e);m.pos=0;let f=u(m),M=f.width,A=f.height,S=p(m.subarray(m.pos),M,A),b,T,C;switch(this.type){case zt:C=S.length/4;let _=new Float32Array(C*4);for(let D=0;D<C;D++)g(S,D*4,_,D*4);b=_,T=zt;break;case Qt:C=S.length/4;let E=new Uint16Array(C*4);for(let D=0;D<C;D++)y(S,D*4,E,D*4);b=E,T=Qt;break;default:throw new Error("THREE.HDRLoader: Unsupported type: "+this.type)}return{width:M,height:A,data:b,header:f.string,gamma:f.gamma,exposure:f.exposure,type:T,colorSpace:kt,minFilter:pt,magFilter:pt,generateMipmaps:!1,flipY:!0}}setDataType(e){return this.type=e,this}};var _h=i=>(i=At.clamp(i,0,1),i*i*(3-2*i)),ul=class{constructor(e,t,n,s){this.template=s,this.width=s.width,this.height=s.height,this.progress=0,this.renderCount=0,this.paperProgress=0,this.renderer=new al({canvas:e,antialias:!0,alpha:!0,preserveDrawingBuffer:!0,powerPreference:"low-power"});let r=this.renderer;r.setPixelRatio(Math.min(devicePixelRatio,2)),r.setClearColor(0,0),r.outputColorSpace=xt,r.toneMapping=Vr,r.toneMappingExposure=1.08,r.shadowMap.enabled=!0,r.shadowMap.type=ji,this.scene=new Mr,this.camera=new Hn(-4,4,4,-4,.1,30),this.camera.position.set(0,0,12),this.camera.lookAt(0,0,0),this.scene.add(new Fr(15851452,4935767,1.1));let a=new di(16769978,2.8);a.position.set(-3,4,6),a.castShadow=!0,a.shadow.mapSize.set(1024,1024),Object.assign(a.shadow.camera,{left:-4,right:4,top:5,bottom:-5,near:.1,far:20}),a.shadow.normalBias=.015,this.scene.add(a);let o=new di(12175825,.9);o.position.set(4,0,4),this.scene.add(o);let l=new di(16043907,.7);l.position.set(-3,-2,-1),this.scene.add(l),this.maps=[new Ri(t.front),new Ri(t.back),new bt(n)];for(let u of this.maps)u.needsUpdate=!0,u.colorSpace=xt,u.anisotropy=Math.min(8,r.capabilities.getMaxAnisotropy());let[c,h,d]=this.maps;this.geometry=new sn(this.width,this.height,40,300),this.geometry.attributes.position.setUsage(Zc),this.base=new Float32Array(this.geometry.attributes.position.array),this.material=new qt({map:c,roughness:.84,metalness:0,side:Dt,alphaTest:.55,bumpMap:h,bumpScale:.009,sheen:.16,sheenRoughness:.9,sheenColor:15782049}),this.material.onBeforeCompile=u=>{u.uniforms.backPaper={value:h},u.fragmentShader=`uniform sampler2D backPaper;
`+u.fragmentShader,u.fragmentShader=u.fragmentShader.replace("#include <map_fragment>",`#ifdef USE_MAP
    vec4 sheetColor=gl_FrontFacing?texture2D(map,vMapUv):texture2D(backPaper,vMapUv);
    diffuseColor*=sheetColor;
    #endif`)},this.material.customProgramCacheKey=()=>"vellum-front-reverse-v3",this.sheet=new ht(this.geometry,this.material),this.sheet.castShadow=!0,this.sheet.receiveShadow=!0,this.scene.add(this.sheet),this.keeper=new ht(new sn(.53,.99),new jt({map:d,transparent:!0,depthWrite:!1,toneMapped:!1})),this.keeper.renderOrder=5,this.scene.add(this.keeper),this.environmentReady=new hl().loadAsync(s.environment).then(u=>{let p=new Zs(r);this.environment=p.fromEquirectangular(u),this.scene.environment=this.environment.texture,this.scene.environmentIntensity=.22,u.dispose(),p.dispose()}).catch(()=>{})}setProgress(e){this.progress=At.clamp(e,0,1);let t=_h(this.progress/.18),n=At.clamp((this.progress-.18)/.82,0,1);this.paperProgress=n,this.keeper.position.set(-t*3.05,-.01+.1*Math.sin(t*Math.PI),.62),this.keeper.rotation.z=t*.2,this.keeper.material.opacity=1-_h((t-.72)/.28),this.keeper.visible=t<.999;let s=-this.height/2+n*this.height,r=Math.max(0,this.height/2-s),a=Ni(r,this.template.coreRadius,this.template.layerThickness),o=this.geometry.attributes.position,l=1/0,c=-1/0;for(let h=0;h<o.count;h++){let d=this.base[h*3],u=this.base[h*3+1],p=Math.pow(Math.abs(d)/(this.width/2),6),g=.009*Math.sin(u*4+d*2)+.038*p*Math.sin(u*3.2+.4),[y,m,f]=cl(d,u,g,s,a,this.template.layerThickness),M=n>.94?.055*_h((n-.94)/.06)*Math.exp(-Math.pow((u+this.height/2)/.17,2)):0;o.setXYZ(h,y,m,f+M),l=Math.min(l,m),c=Math.max(c,m)}o.needsUpdate=!0,this.geometry.computeVertexNormals(),this.geometry.computeBoundingSphere(),this.sheet.position.y=-(l+c)/2,this.bounds={bottom:l+this.sheet.position.y,top:c+this.sheet.position.y}}resize(e,t){if(!e||!t)return;this.renderer.setSize(e,t,!1);let n=e/t,s=Math.max(this.height+.7,(this.width+.45)/n);this.viewHeight=s,Object.assign(this.camera,{left:-s*n/2,right:s*n/2,top:s/2,bottom:-s/2}),this.camera.updateProjectionMatrix()}render(){this.renderer.render(this.scene,this.camera),this.renderCount++}snapshot(){return{progress:this.progress,paperProgress:this.paperProgress,renderCount:this.renderCount,vertices:this.geometry.attributes.position.count,camera:this.camera.position.toArray(),keeperVisible:this.keeper.visible,viewHeight:this.viewHeight}}exportObject(){return this.render(),this.renderer.domElement.toDataURL("image/png")}dispose(){this.geometry.dispose(),this.material.dispose(),this.keeper.geometry.dispose(),this.keeper.material.dispose();for(let e of this.maps)e.dispose();this.environment?.dispose(),this.renderer.dispose()}};var pf=`
uniform float scrollBoundary,scrollRadius,scrollThickness,scrollHeight,scrollWidth,scrollOpen;
vec3 parchment(vec3 q){
 float edge=pow(abs(q.x)/(scrollWidth*.5),6.0);
 float s=-q.y-scrollBoundary;
 vec3 v=q;
 v.z=.009*sin(q.y*4.0+q.x*2.0)+.025*edge*sin(q.y*3.2+.4);
 if(s>0.0){
  float k=scrollThickness/6.28318530718;
  float rmin=scrollRadius*.08,tf=(scrollRadius-rmin)/k,sf=scrollRadius*tf-.5*k*tf*tf;
  float theta=s>=sf?tf+(s-sf)/rmin:2.0*s/(scrollRadius+sqrt(max(0.0,scrollRadius*scrollRadius-2.0*k*s)));
  float r=max(scrollRadius-k*theta,rmin)-v.z;
  v.y=-(scrollBoundary+r*sin(theta));v.z=scrollRadius-r*cos(theta);
 }
 // Residual displacement is evaluated on BOTH sides of the winding tangent.
 // The previous branch-only completion blend reopened a height discontinuity
 // during the last turn, which made normals flash as a broken bright stripe.
 {
  float open=smoothstep(.35,1.0,scrollOpen)*mix(smoothstep(-.12,.45,-s),1.0,smoothstep(.91,1.0,scrollOpen));
  float bottom=max(0.0,.56-(q.y+scrollHeight*.5)),top=max(0.0,.37-(scrollHeight*.5-q.y));
  float rb=.64+.07*sin(q.x*1.5),rt=.78+.09*cos(q.x*1.2);
  v.y+=open*(bottom-rb*sin(bottom/rb)-top+rt*sin(top/rt));
  v.z+=open*(rb*(1.0-cos(bottom/rb))+rt*(1.0-cos(top/rt))+.043*sin(q.y*1.37+q.x*.43)+.024*sin(q.y*2.7-q.x*.85)+edge*(.09+.038*sin(q.y*2.0+q.x)));
 }
 return v;
}
`,Js=class extends ul{constructor(e,t,n,s){super(e,t,n,s),this.renderer.setPixelRatio(1),this.renderer.toneMapping=pn,this.renderer.toneMappingExposure=1;for(let h of this.scene.children.filter(d=>d.isLight))h.color.set(16777215),h.isHemisphereLight?(h.groundColor.set(12959665),h.intensity=.9):h.castShadow?h.intensity=2.4:h.intensity=h.position.z>0?.35:.12;this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=fo,this.geometry.dispose(),this.geometry=new sn(this.width,this.height,52,280),this.sheet.geometry=this.geometry,this.sheet.frustumCulled=!1,this.sheet.castShadow=!0,this.sheet.receiveShadow=!1,this.keeper.geometry.dispose(),this.keeper.geometry=new sn(.41,.77),this.uniforms={scrollBoundary:{value:0},scrollRadius:{value:.2},scrollThickness:{value:s.layerThickness},scrollHeight:{value:this.height},scrollWidth:{value:this.width},scrollOpen:{value:0}},this.material.bumpMap=null,this.material.sheen=0,this.material.specularIntensity=0,this.material.roughness=.97,this.material.envMapIntensity=.07;let r=this.material.onBeforeCompile;this.material.onBeforeCompile=h=>{r(h),Object.assign(h.uniforms,this.uniforms),h.vertexShader=pf+h.vertexShader,h.vertexShader=h.vertexShader.replace("#include <beginnormal_vertex>","vec3 objectNormal=normalize(cross(parchment(position+vec3(.001,0.,0.))-parchment(position-vec3(.001,0.,0.)),parchment(position+vec3(0.,.001,0.))-parchment(position-vec3(0.,.001,0.))));"),h.vertexShader=h.vertexShader.replace("#include <begin_vertex>","vec3 transformed=parchment(position);"),h.fragmentShader=h.fragmentShader.replace("#include <roughnessmap_fragment>",`float roughnessFactor=roughness;
    #ifdef USE_ROUGHNESSMAP
      roughnessFactor=.88+.10*texture2D(roughnessMap,vRoughnessMapUv).g;
    #endif`),h.fragmentShader=h.fragmentShader.replace("#include <opaque_fragment>",`outgoingLight=mix(outgoingLight,diffuseColor.rgb,.45*smoothstep(.65,.98,abs(normal.z)));
    #include <opaque_fragment>`)},this.material.customProgramCacheKey=()=>"charter-continuous-matte-v6",this.material.needsUpdate=!0;let a=new Ii({map:this.maps[0],alphaTest:.55,side:Dt,depthPacking:Zr});a.onBeforeCompile=h=>{Object.assign(h.uniforms,this.uniforms),h.vertexShader=pf+h.vertexShader,h.vertexShader=h.vertexShader.replace("#include <begin_vertex>","vec3 transformed=parchment(position);")},a.customProgramCacheKey=()=>"charter-continuous-shadow-v6",this.sheet.customDepthMaterial=a;let o=new ht(new sn(20,20),new Dr({opacity:.2}));o.position.z=-.1,o.receiveShadow=!0,this.scene.add(o),this.renderer.shadowMap.autoUpdate=!1;let l=new ui,c=this.environmentReady;this.environmentReady=Promise.all([c,l.loadAsync(s.paperNormal||"../chapter-scroll-v4/assets/skin-normal.jpg"),l.loadAsync(s.paperRoughness||"../chapter-scroll-v4/assets/skin-roughness.jpg")]).then(([,h,d])=>{for(let u of[h,d])u.wrapS=u.wrapT=_n,u.repeat.set(1.4,2.1),this.maps.push(u);this.material.normalMap=h,this.material.normalScale.set(.035,.035),this.material.roughnessMap=d,this.material.needsUpdate=!0}),this.dirty=!0}setProgress(e){this.progress=At.clamp(e,0,1);let t=At.smoothstep(this.progress,0,.18),n=At.clamp((this.progress-.18)/.82,0,1);this.paperProgress=n,this.keeper.position.set(-t*3.05,-.01+.1*Math.sin(t*Math.PI),.62),this.keeper.rotation.z=t*.2,this.keeper.material.opacity=1-At.smoothstep(t,.72,1),this.keeper.visible=t<.999;let s=-this.height/2+n*this.height,r=Ni(this.height*(1-n),this.template.coreRadius,this.template.layerThickness);this.uniforms.scrollBoundary.value=s,this.uniforms.scrollRadius.value=r,this.uniforms.scrollOpen.value=n;let a=1/0,o=-1/0;for(let l=0;l<=280;l++){let c=-this.height/2+l*this.height/280,[,h]=cl(0,c,0,s,r,this.template.layerThickness);a=Math.min(a,h),o=Math.max(o,h)}this.sheet.position.y=-(a+o)/2,this.bounds={bottom:a+this.sheet.position.y,top:o+this.sheet.position.y},this.renderer.shadowMap.needsUpdate=!0,this.dirty=!0}advance(){}settle(){this.dirty=!0}get needsMotion(){return!1}resize(e,t){if(!e||!t)return;let n=window.devicePixelRatio||1,s=35e5,r=Math.min(1,Math.sqrt(s/(e*t*n*n)));this.renderer.setSize(Math.floor(e*n*r),Math.floor(t*n*r),!1);let a=e/t,o=Math.max(this.height+.66,(this.width+.45)/a);this.viewHeight=o,Object.assign(this.camera,{left:-o*a/2,right:o*a/2,top:o/2,bottom:-o/2}),this.camera.updateProjectionMatrix(),this.dirty=!0}render(){super.render(),this.dirty=!1}snapshot(){return{...super.snapshot(),drawBuffer:{width:this.renderer.domElement.width,height:this.renderer.domElement.height},deformation:"Continuous GPU winding and shared rest displacement",keeperMotion:"v4 rigid take-off",keeperSize:[.41,.77],specularIntensity:this.material.specularIntensity,toneMapping:"none; preserve source colors",restCurl:!0}}};var dl=(i,e,t)=>{let n=Math.max(0,Math.min(1,(t-i)/(e-i)));return n*n*(3-2*n)},on=Object.freeze({releaseEnd:.24,width:.41,height:.77,bandWidth:.216,closedGap:.058,looseGap:.13});function ea(i,e){let t=Math.max(0,Math.min(1,i/on.releaseEnd)),n=dl(0,.27,t),s=dl(.27,.82,t),r=dl(.82,1,t),a=Ni(e.height,e.coreRadius,e.layerThickness);return{x:-(e.width/2+on.width/2+.11)*s-.7*r,y:-.025*r,z:.045*n+.85*r,rotationZ:-.11*r,rotationY:.16*r,loosen:n,opacity:1-dl(.89,1,t),visible:i<on.releaseEnd,phase:t<.27?"loosen":t<.82?"unthread":t<1?"depart":"off",radius:a,paperProgress:Math.max(0,Math.min(1,(i-on.releaseEnd)/(1-on.releaseEnd)))}}var ev=`
float iy=1.0-vMapUv.y;
float left=mix(.305,.262,smoothstep(.28,.34,iy))+.043*smoothstep(.76,.9,iy);
float right=mix(.704,.758,smoothstep(.28,.35,iy))-.046*smoothstep(.76,.91,iy);
if(vMapUv.x<left||vMapUv.x>right)discard;
`;function mf(i,e){let t=new jt({map:i,transparent:!0,alphaTest:.08,depthWrite:!0,depthTest:!0,toneMapped:!1,side:Dt});return t.onBeforeCompile=n=>{n.fragmentShader=n.fragmentShader.replace("#include <alphatest_fragment>",`#include <alphatest_fragment>
${ev}
${e?"if(iy<.30||iy>.76)discard;":"if(iy>=.30&&iy<=.76)discard;"}`)},t.customProgramCacheKey=()=>`keeper-layer-v8-${e}`,t}function gf(i,e,t,n){let s=i.clone();for(let r=0;r<i.count;r++){let a=i.getX(r),o=i.getY(r),l=Math.max(0,Math.abs(o)-.16),c=n?o:o+Math.sign(o)*l*.31*t,h=e+on.closedGap+(on.looseGap-on.closedGap)*t,d=n?h+.029:Math.sqrt(Math.max(.002,h*h-c*c))+.016;s.setXYZ(r,a,c,e+d)}return s}function xf(i,e){let t=new sn(on.width,on.height,12,84),n=t.attributes.position.clone();return t.setAttribute("position",gf(n,i,0,e)),t.morphAttributes.position=[gf(n,i,1,e)],t.computeVertexNormals(),t}function tv(i){let e=[],t=[],n=[],s=[];for(let o=0;o<=112;o++)for(let l=0;l<4;l++){let c=o/112*Math.PI*2,h=(l%2?.5:-.5)*on.bandWidth,d=l>=2?.009:0;for(let[u,p]of[[e,on.closedGap],[t,on.looseGap]]){let g=i+p-d;u.push(h,Math.sin(c)*g,i+Math.cos(c)*g)}n.push(.38+.22*(l%2),.795+.06*(.5+.5*Math.cos(c*4)))}for(let o=0;o<112;o++)for(let[l,c]of[[0,1],[1,3],[3,2],[2,0]]){let h=o*4;s.push(h+l,h+c,h+c+4,h+l,h+c+4,h+l+4)}let a=new Bt;return a.setAttribute("position",new Lt(e,3)),a.setAttribute("uv",new Lt(n,2)),a.setIndex(s),a.morphAttributes.position=[new Lt(t,3)],a.computeVertexNormals(),a}var fl=class{constructor(e,t,n){this.template=n,this.group=new Wt,e.add(this.group);let{radius:s}=ea(0,n);this.band=new ht(tv(s),new ai({map:t,roughness:.96,metalness:0,side:Dt})),this.front=new ht(xf(s,!1),mf(t,!1)),this.plate=new ht(xf(s,!0),mf(t,!0)),this.parts=[this.band,this.front,this.plate],this.group.add(...this.parts);for(let r of this.parts)r.frustumCulled=!1,r.renderOrder=0}update(e,t){let n=this.pose=ea(e,this.template);this.group.visible=n.visible,this.group.position.set(n.x,t+n.y,n.z),this.group.rotation.set(0,n.rotationY,n.rotationZ);for(let s of this.parts)s.morphTargetInfluences[0]=n.loosen,s.material.opacity=n.opacity,s.material.transparent=n.opacity<1||s!==this.band}snapshot(){return{...this.pose,model:"layered hoop + rigid buckle + authored tight/loose morph",depthTest:!0,depthWrite:!0}}dispose(){for(let e of this.parts)e.geometry.dispose(),e.material.dispose();this.group.removeFromParent()}};var pl=class extends Js{constructor(e,t,n,s){super(e,t,n,s),this.scene.remove(this.keeper),this.keeper.visible=!1,this.closure=new fl(this.scene,this.maps[2],s),this.camera=new wt(35,1,.1,40),this.camera.position.set(0,0,12),this.camera.lookAt(0,0,0),this.sealBump=new Ri(t.relief),this.sealBump.needsUpdate=!0,this.material.bumpMap=this.sealBump,this.material.bumpScale=.0025;let r=this.material.onBeforeCompile;this.material.onBeforeCompile=a=>{r(a),a.fragmentShader=a.fragmentShader.replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
    #if defined(USE_BUMPMAP) && defined(USE_NORMALMAP_TANGENTSPACE)
     normal=perturbNormalArb(-vViewPosition,normal,dHdxy_fwd(),faceDirection);
    #endif`)},this.material.customProgramCacheKey=()=>"charter-v8-composed-impression",this.material.needsUpdate=!0}setProgress(e){let t=At.clamp(e,0,1),n=ea(t,this.template);super.setProgress(.18+.82*n.paperProgress),this.progress=t,this.closure&&this.closure.update(t,this.height/2+this.sheet.position.y)}resize(e,t){if(!e||!t)return;let n=window.devicePixelRatio||1,s=Math.min(1,Math.sqrt(35e5/(e*t*n*n)));this.renderer.setSize(Math.floor(e*n*s),Math.floor(t*n*s),!1);let r=e/t,a=Math.max(this.height+.76,(this.width+.6)/r);this.viewHeight=a,this.camera.aspect=r,this.camera.fov=At.radToDeg(2*Math.atan(a/(2*this.camera.position.z))),this.camera.updateProjectionMatrix(),this.dirty=!0}snapshot(){return{...super.snapshot(),cameraType:"PerspectiveCamera",keeperVisible:this.closure?.group.visible??!1,keeperMotion:"loosen, unthread, then approach; exact reverse on closing",keeperPose:this.closure?.snapshot(),sealRelief:!0}}dispose(){this.closure.dispose(),this.sealBump.dispose(),super.dispose()}};var ml=class extends pl{constructor(...e){super(...e),this.material.bumpScale=.0045}setSurfaces(e){this.maps[0].image=e.front,this.maps[0].needsUpdate=!0,this.maps[1].image=e.back,this.maps[1].needsUpdate=!0,this.sealBump.image=e.relief,this.sealBump.needsUpdate=!0,this.dirty=!0}};var gl=class extends ml{constructor(...e){super(...e),this.motionPrepared=!1;let t=this.closure.update.bind(this.closure);this.closure.update=(...n)=>{t(...n);for(let s of this.closure.parts)s.material.transparent=!0},this.closure.update(0,0)}async prepareMotion(e){let t=performance.now();await this.environmentReady;for(let n of new Set([...this.maps,this.sealBump]))this.renderer.initTexture(n);await this.renderer.compileAsync(this.scene,this.camera);for(let n of[0,.11,.225,1,e])this.setProgress(n),this.render(),await new Promise(s=>requestAnimationFrame(s));this.motionPrepared=!0,this.preparationMs=performance.now()-t,this.preparedPrograms=this.renderer.info.programs.length}snapshot(){return{...super.snapshot(),runtime:{motionPrepared:this.motionPrepared,preparationMs:this.preparationMs,preparedPrograms:this.preparedPrograms,programs:this.renderer.info.programs.length}}}};function vh(i,e){if(e===$c)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),i;if(e===qs||e===Kr){let t=i.getIndex();if(t===null){let r=[],a=i.getAttribute("position");if(a!==void 0){for(let o=0;o<a.count;o++)r.push(o);i.setIndex(r),t=i.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),i}let n=t.count-2,s=[];if(e===qs)for(let r=1;r<=n;r++)s.push(t.getX(0)),s.push(t.getX(r)),s.push(t.getX(r+1));else for(let r=0;r<n;r++)r%2===0?(s.push(t.getX(r)),s.push(t.getX(r+1)),s.push(t.getX(r+2))):(s.push(t.getX(r+2)),s.push(t.getX(r+1)),s.push(t.getX(r)));return s.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles."),i.setIndex(s),i.clearGroups(),i}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),i}function _f(i){let e=new Map,t=new Map,n=i.clone();return vf(i,n,function(s,r){e.set(r,s),t.set(s,r)}),n.traverse(function(s){if(!s.isSkinnedMesh)return;let r=s,a=e.get(s),o=a.skeleton.bones;r.skeleton=a.skeleton.clone(),r.bindMatrix.copy(a.bindMatrix),r.skeleton.bones=o.map(function(l){return t.get(l)}),r.bind(r.skeleton,r.bindMatrix)}),n}function vf(i,e,t){t(i,e);for(let n=0;n<i.children.length;n++)vf(i.children[n],e.children[n],t)}var xl=class extends Cn{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Eh(t)}),this.register(function(t){return new Ah(t)}),this.register(function(t){return new Fh(t)}),this.register(function(t){return new Oh(t)}),this.register(function(t){return new Bh(t)}),this.register(function(t){return new Ch(t)}),this.register(function(t){return new Ih(t)}),this.register(function(t){return new Ph(t)}),this.register(function(t){return new Lh(t)}),this.register(function(t){return new wh(t)}),this.register(function(t){return new Dh(t)}),this.register(function(t){return new Rh(t)}),this.register(function(t){return new Uh(t)}),this.register(function(t){return new Nh(t)}),this.register(function(t){return new bh(t)}),this.register(function(t){return new _l(t,Ke.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new _l(t,Ke.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new zh(t)})}load(e,t,n,s){let r=this,a;if(this.resourcePath!=="")a=this.resourcePath;else if(this.path!==""){let c=fi.extractUrlBase(e);a=fi.resolveURL(c,this.path)}else a=fi.extractUrlBase(e);this.manager.itemStart(e);let o=function(c){s?s(c):console.error(c),r.manager.itemError(e),r.manager.itemEnd(e)},l=new Ki(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{r.parse(c,a,function(h){t(h),r.manager.itemEnd(e)},o)}catch(h){o(h)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,s){let r,a={},o={},l=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===Tf){try{a[Ke.KHR_BINARY_GLTF]=new kh(e)}catch(d){s&&s(d);return}r=JSON.parse(a[Ke.KHR_BINARY_GLTF].content)}else r=JSON.parse(l.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){s&&s(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let c=new Yh(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){let d=this.pluginCallbacks[h](c);d.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[d.name]=d,a[d.name]=!0}if(r.extensionsUsed)for(let h=0;h<r.extensionsUsed.length;++h){let d=r.extensionsUsed[h],u=r.extensionsRequired||[];switch(d){case Ke.KHR_MATERIALS_UNLIT:a[d]=new Th;break;case Ke.KHR_DRACO_MESH_COMPRESSION:a[d]=new Vh(r,this.dracoLoader);break;case Ke.KHR_TEXTURE_TRANSFORM:a[d]=new Hh;break;case Ke.KHR_MESH_QUANTIZATION:a[d]=new Gh;break;default:u.indexOf(d)>=0&&o[d]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+d+'".')}}c.setExtensions(a),c.setPlugins(o),c.parse(n,s)}parseAsync(e,t){let n=this;return new Promise(function(s,r){n.parse(e,t,s,r)})}};function nv(){let i={};return{get:function(e){return i[e]},add:function(e,t){i[e]=t},remove:function(e){delete i[e]},removeAll:function(){i={}}}}function Rt(i,e,t){let n=i.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}var Ke={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},bh=class{constructor(e){this.parser=e,this.name=Ke.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,s=t.length;n<s;n++){let r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n="light:"+e,s=t.cache.get(n);if(s)return s;let r=t.json,l=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e],c,h=new Ne(16777215);l.color!==void 0&&h.setRGB(l.color[0],l.color[1],l.color[2],kt);let d=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new di(h),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new zr(h),c.distance=d;break;case"spot":c=new Br(h),c.distance=d,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),Yn(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),s=Promise.resolve(c),t.cache.add(n,s),s}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,r=n.json.nodes[e],o=(r.extensions&&r.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(l){return n._getNodeRef(t.cache,o,l)})}},Th=class{constructor(){this.name=Ke.KHR_MATERIALS_UNLIT}getMaterialType(){return jt}extendParams(e,t,n){let s=[];e.color=new Ne(1,1,1),e.opacity=1;let r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){let a=r.baseColorFactor;e.color.setRGB(a[0],a[1],a[2],kt),e.opacity=a[3]}r.baseColorTexture!==void 0&&s.push(n.assignTexture(e,"map",r.baseColorTexture,xt))}return Promise.all(s)}},wh=class{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let n=Rt(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}},Eh=class{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return Rt(this.parser,e,this.name)!==null?qt:null}extendMaterialParams(e,t){let n=Rt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(s.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){let r=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new Ge(r,r)}return Promise.all(s)}},Ah=class{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_DISPERSION}getMaterialType(e){return Rt(this.parser,e,this.name)!==null?qt:null}extendMaterialParams(e,t){let n=Rt(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}},Rh=class{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return Rt(this.parser,e,this.name)!==null?qt:null}extendMaterialParams(e,t){let n=Rt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(s)}},Ch=class{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_SHEEN}getMaterialType(e){return Rt(this.parser,e,this.name)!==null?qt:null}extendMaterialParams(e,t){let n=Rt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];if(t.sheenColor=new Ne(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){let r=n.sheenColorFactor;t.sheenColor.setRGB(r[0],r[1],r[2],kt)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,xt)),n.sheenRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(s)}},Ih=class{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return Rt(this.parser,e,this.name)!==null?qt:null}extendMaterialParams(e,t){let n=Rt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&s.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(s)}},Ph=class{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_VOLUME}getMaterialType(e){return Rt(this.parser,e,this.name)!==null?qt:null}extendMaterialParams(e,t){let n=Rt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;let r=n.attenuationColor||[1,1,1];return t.attenuationColor=new Ne().setRGB(r[0],r[1],r[2],kt),Promise.all(s)}},Lh=class{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_IOR}getMaterialType(e){return Rt(this.parser,e,this.name)!==null?qt:null}extendMaterialParams(e,t){let n=Rt(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}},Dh=class{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_SPECULAR}getMaterialType(e){return Rt(this.parser,e,this.name)!==null?qt:null}extendMaterialParams(e,t){let n=Rt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));let r=n.specularColorFactor||[1,1,1];return t.specularColor=new Ne().setRGB(r[0],r[1],r[2],kt),n.specularColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,xt)),Promise.all(s)}},Nh=class{constructor(e){this.parser=e,this.name=Ke.EXT_MATERIALS_BUMP}getMaterialType(e){return Rt(this.parser,e,this.name)!==null?qt:null}extendMaterialParams(e,t){let n=Rt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&s.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(s)}},Uh=class{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return Rt(this.parser,e,this.name)!==null?qt:null}extendMaterialParams(e,t){let n=Rt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&s.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(s)}},Fh=class{constructor(e){this.parser=e,this.name=Ke.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,s=n.textures[e];if(!s.extensions||!s.extensions[this.name])return null;let r=s.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,a)}},Oh=class{constructor(e){this.parser=e,this.name=Ke.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;let a=r.extensions[t],o=s.images[a.source],l=n.textureLoader;if(o.uri){let c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}},Bh=class{constructor(e){this.parser=e,this.name=Ke.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;let a=r.extensions[t],o=s.images[a.source],l=n.textureLoader;if(o.uri){let c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}},_l=class{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let s=n.extensions[this.name],r=this.parser.getDependency("buffer",s.buffer),a=this.parser.options.meshoptDecoder;if(!a||!a.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(o){let l=s.byteOffset||0,c=s.byteLength||0,h=s.count,d=s.byteStride,u=new Uint8Array(o,l,c);return a.decodeGltfBufferAsync?a.decodeGltfBufferAsync(h,d,u,s.mode,s.filter).then(function(p){return p.buffer}):a.ready.then(function(){let p=new ArrayBuffer(h*d);return a.decodeGltfBuffer(new Uint8Array(p),h,d,u,s.mode,s.filter),p})})}else return null}},zh=class{constructor(e){this.name=Ke.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let s=t.meshes[n.mesh];for(let c of s.primitives)if(c.mode!==yn.TRIANGLES&&c.mode!==yn.TRIANGLE_STRIP&&c.mode!==yn.TRIANGLE_FAN&&c.mode!==void 0)return null;let a=n.extensions[this.name].attributes,o=[],l={};for(let c in a)o.push(this.parser.getDependency("accessor",a[c]).then(h=>(l[c]=h,l[c])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(c=>{let h=c.pop(),d=h.isGroup?h.children:[h],u=c[0].count,p=[];for(let g of d){let y=new ke,m=new V,f=new Xt,M=new V(1,1,1),A=new Ar(g.geometry,g.material,u);for(let b=0;b<u;b++)l.TRANSLATION&&m.fromBufferAttribute(l.TRANSLATION,b),l.ROTATION&&f.fromBufferAttribute(l.ROTATION,b),l.SCALE&&M.fromBufferAttribute(l.SCALE,b),A.setMatrixAt(b,y.compose(m,f,M));let S=null;for(let b in l)if(b==="_COLOR_0"){let T=l[b];A.instanceColor=new ri(T.array,T.itemSize,T.normalized)}else if(b!=="TRANSLATION"&&b!=="ROTATION"&&b!=="SCALE"){if(S===null){let C=A.geometry;S=new Bt,S.name=C.name;for(let _ in C.attributes)S.setAttribute(_,C.attributes[_]);for(let _ in C.morphAttributes)S.morphAttributes[_]=C.morphAttributes[_];C.index!==null&&S.setIndex(C.index),S.morphTargetsRelative=C.morphTargetsRelative;for(let _ of C.groups)S.addGroup(_.start,_.count,_.materialIndex);C.boundingBox!==null&&(S.boundingBox=C.boundingBox.clone()),C.boundingSphere!==null&&(S.boundingSphere=C.boundingSphere.clone()),S.drawRange.start=C.drawRange.start,S.drawRange.count=C.drawRange.count,S.userData=Object.assign({},C.userData),A.geometry=S}let T=l[b];S.setAttribute(b,new ri(T.array,T.itemSize,T.normalized))}_t.prototype.copy.call(A,g),this.parser.assignFinalMaterial(A),p.push(A)}return h.isGroup?(h.clear(),h.add(...p),h):p[0]}))}},Tf="glTF",ta=12,yf={JSON:1313821514,BIN:5130562},kh=class{constructor(e){this.name=Ke.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,ta),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Tf)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let s=this.header.length-ta,r=new DataView(e,ta),a=0;for(;a<s;){let o=r.getUint32(a,!0);a+=4;let l=r.getUint32(a,!0);if(a+=4,l===yf.JSON){let c=new Uint8Array(e,ta+a,o);this.content=n.decode(c)}else if(l===yf.BIN){let c=ta+a;this.body=e.slice(c,c+o)}a+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},Vh=class{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=Ke.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,s=this.dracoLoader,r=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},l={},c={};for(let h in a){let d=Xh[h]||h.toLowerCase();o[d]=a[h]}for(let h in e.attributes){let d=Xh[h]||h.toLowerCase();if(a[h]!==void 0){let u=n.accessors[e.attributes[h]],p=Qs[u.componentType];c[d]=p.name,l[d]=u.normalized===!0}}return t.getDependency("bufferView",r).then(function(h){return new Promise(function(d,u){s.decodeDracoFile(h,function(p){for(let g in p.attributes){let y=p.attributes[g],m=l[g];m!==void 0&&(y.normalized=m)}d(p)},o,c,kt,u)})})}},Hh=class{constructor(){this.name=Ke.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){if((t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0)return e;if(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),t.rotation!==void 0){let n=Math.cos(e.rotation),s=Math.sin(e.rotation);e.matrix.set(e.repeat.x*n,e.repeat.y*s,e.offset.x,-e.repeat.x*s,e.repeat.y*n,e.offset.y,0,0,1),e.matrixAutoUpdate=!1}return e.needsUpdate=!0,e}},Gh=class{constructor(){this.name=Ke.KHR_MESH_QUANTIZATION}},vl=class extends kn{constructor(e,t,n,s){super(e,t,n,s)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s*3+s;for(let a=0;a!==s;a++)t[a]=n[r+a];return t}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=o*2,c=o*3,h=s-t,d=(n-t)/h,u=d*d,p=u*d,g=e*c,y=g-c,m=-2*p+3*u,f=p-u,M=1-m,A=f-u+d;for(let S=0;S!==o;S++){let b=a[y+S+o],T=a[y+S+l]*h,C=a[g+S+o],_=a[g+S]*h;r[S]=M*b+A*T+m*C+f*_}return r}},iv=new Xt,Wh=class extends vl{interpolate_(e,t,n,s){let r=super.interpolate_(e,t,n,s);return iv.fromArray(r).normalize().toArray(r),r}},yn={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},Qs={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Sf={9728:Mt,9729:pt,9984:go,9985:Gs,9986:es,9987:vn},Mf={33071:Ot,33648:Es,10497:_n},yh={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Xh={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Ui={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},sv={CUBICSPLINE:void 0,LINEAR:Xi,STEP:Wi},Sh={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function rv(i){return i.DefaultMaterial===void 0&&(i.DefaultMaterial=new ai({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Gn})),i.DefaultMaterial}function is(i,e,t){for(let n in t.extensions)i[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function Yn(i,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(i.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function av(i,e,t){let n=!1,s=!1,r=!1;for(let c=0,h=e.length;c<h;c++){let d=e[c];if(d.POSITION!==void 0&&(n=!0),d.NORMAL!==void 0&&(s=!0),d.COLOR_0!==void 0&&(r=!0),n&&s&&r)break}if(!n&&!s&&!r)return Promise.resolve(i);let a=[],o=[],l=[];for(let c=0,h=e.length;c<h;c++){let d=e[c];if(n){let u=d.POSITION!==void 0?t.getDependency("accessor",d.POSITION):i.attributes.position;a.push(u)}if(s){let u=d.NORMAL!==void 0?t.getDependency("accessor",d.NORMAL):i.attributes.normal;o.push(u)}if(r){let u=d.COLOR_0!==void 0?t.getDependency("accessor",d.COLOR_0):i.attributes.color;l.push(u)}}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l)]).then(function(c){let h=c[0],d=c[1],u=c[2];return n&&(i.morphAttributes.position=h),s&&(i.morphAttributes.normal=d),r&&(i.morphAttributes.color=u),i.morphTargetsRelative=!0,i})}function ov(i,e){if(i.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)i.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){let t=e.extras.targetNames;if(i.morphTargetInfluences.length===t.length){i.morphTargetDictionary={};for(let n=0,s=t.length;n<s;n++)i.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function lv(i){let e,t=i.extensions&&i.extensions[Ke.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Mh(t.attributes):e=i.indices+":"+Mh(i.attributes)+":"+i.mode,i.targets!==void 0)for(let n=0,s=i.targets.length;n<s;n++)e+=":"+Mh(i.targets[n]);return e}function Mh(i){let e="",t=Object.keys(i).sort();for(let n=0,s=t.length;n<s;n++)e+=t[n]+":"+i[t[n]]+";";return e}function qh(i){switch(i){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function cv(i){return i.search(/\.jpe?g($|\?)/i)>0||i.search(/^data\:image\/jpeg/)===0?"image/jpeg":i.search(/\.webp($|\?)/i)>0||i.search(/^data\:image\/webp/)===0?"image/webp":i.search(/\.ktx2($|\?)/i)>0||i.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}var hv=new ke,Yh=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new nv,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,s=-1,r=!1,a=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){let o=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(o)===!0;let l=o.match(/Version\/(\d+)/);s=n&&l?parseInt(l[1],10):-1,r=o.indexOf("Firefox")>-1,a=r?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&s<17||r&&a<98?this.textureLoader=new ui(this.options.manager):this.textureLoader=new kr(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Ki(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,s=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(a){return a._markDefs&&a._markDefs()}),Promise.all(this._invokeAll(function(a){return a.beforeRoot&&a.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(a){let o={scene:a[0][s.scene||0],scenes:a[0],animations:a[1],cameras:a[2],asset:s.asset,parser:n,userData:{}};return is(r,o,s),Yn(o,s),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(o)})).then(function(){for(let l of o.scenes)l.updateMatrixWorld();e(o)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let s=0,r=t.length;s<r;s++){let a=t[s].joints;for(let o=0,l=a.length;o<l;o++)e[a[o]].isBone=!0}for(let s=0,r=e.length;s<r;s++){let a=e[s];a.mesh!==void 0&&(this._addNodeRef(this.meshCache,a.mesh),a.skin!==void 0&&(n[a.mesh].isSkinnedMesh=!0)),a.camera!==void 0&&this._addNodeRef(this.cameraCache,a.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let s=n.clone(),r=(a,o)=>{let l=this.associations.get(a);l!=null&&this.associations.set(o,l);for(let[c,h]of a.children.entries())r(h,o.children[c])};return r(n,s),s.name+="_instance_"+e.uses[t]++,s}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let s=e(t[n]);if(s)return s}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let s=0;s<t.length;s++){let r=e(t[s]);r&&n.push(r)}return n}getDependency(e,t){let n=e+":"+t,s=this.cache.get(n);if(!s){switch(e){case"scene":s=this.loadScene(t);break;case"node":s=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":s=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":s=this.loadAccessor(t);break;case"bufferView":s=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":s=this.loadBuffer(t);break;case"material":s=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":s=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":s=this.loadSkin(t);break;case"animation":s=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":s=this.loadCamera(t);break;default:if(s=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!s)throw new Error("Unknown type: "+e);break}this.cache.add(n,s)}return s}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,s=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(s.map(function(r,a){return n.getDependency(e,a)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[Ke.KHR_BINARY_GLTF].body);let s=this.options;return new Promise(function(r,a){n.load(fi.resolveURL(t.uri,s.path),r,void 0,function(){a(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){let s=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+s)})}loadAccessor(e){let t=this,n=this.json,s=this.json.accessors[e];if(s.bufferView===void 0&&s.sparse===void 0){let a=yh[s.type],o=Qs[s.componentType],l=s.normalized===!0,c=new o(s.count*a);return Promise.resolve(new St(c,a,l))}let r=[];return s.bufferView!==void 0?r.push(this.getDependency("bufferView",s.bufferView)):r.push(null),s.sparse!==void 0&&(r.push(this.getDependency("bufferView",s.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",s.sparse.values.bufferView))),Promise.all(r).then(function(a){let o=a[0],l=yh[s.type],c=Qs[s.componentType],h=c.BYTES_PER_ELEMENT,d=h*l,u=s.byteOffset||0,p=s.bufferView!==void 0?n.bufferViews[s.bufferView].byteStride:void 0,g=s.normalized===!0,y,m;if(p&&p!==d){let f=Math.floor(u/p),M="InterleavedBuffer:"+s.bufferView+":"+s.componentType+":"+f+":"+s.count,A=t.cache.get(M);A||(y=new c(o,f*p,s.count*p/h),A=new Ls(y,p/h),t.cache.add(M,A)),m=new Ds(A,l,u%p/h,g)}else o===null?y=new c(s.count*l):y=new c(o,u,s.count*l),m=new St(y,l,g);if(s.sparse!==void 0){let f=yh.SCALAR,M=Qs[s.sparse.indices.componentType],A=s.sparse.indices.byteOffset||0,S=s.sparse.values.byteOffset||0,b=new M(a[1],A,s.sparse.count*f),T=new c(a[2],S,s.sparse.count*l);o!==null&&(m=new St(m.array.slice(),m.itemSize,m.normalized)),m.normalized=!1;for(let C=0,_=b.length;C<_;C++){let E=b[C];if(m.setX(E,T[C*l]),l>=2&&m.setY(E,T[C*l+1]),l>=3&&m.setZ(E,T[C*l+2]),l>=4&&m.setW(E,T[C*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}m.normalized=g}return m})}loadTexture(e){let t=this.json,n=this.options,r=t.textures[e].source,a=t.images[r],o=this.textureLoader;if(a.uri){let l=n.manager.getHandler(a.uri);l!==null&&(o=l)}return this.loadTextureImage(e,r,o)}loadTextureImage(e,t,n){let s=this,r=this.json,a=r.textures[e],o=r.images[t],l=(o.uri||o.bufferView)+":"+a.sampler;if(this.textureCache[l])return this.textureCache[l];let c=this.loadImageSource(t,n).then(function(h){h.flipY=!1,h.name=a.name||o.name||"",h.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(h.name=o.uri);let u=(r.samplers||{})[a.sampler]||{};return h.magFilter=Sf[u.magFilter]||pt,h.minFilter=Sf[u.minFilter]||vn,h.wrapS=Mf[u.wrapS]||_n,h.wrapT=Mf[u.wrapT]||_n,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==Mt&&h.minFilter!==pt,s.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){let n=this,s=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(d=>d.clone());let a=s.images[e],o=self.URL||self.webkitURL,l=a.uri||"",c=!1;if(a.bufferView!==void 0)l=n.getDependency("bufferView",a.bufferView).then(function(d){c=!0;let u=new Blob([d],{type:a.mimeType});return l=o.createObjectURL(u),l});else if(a.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");let h=Promise.resolve(l).then(function(d){return new Promise(function(u,p){let g=u;t.isImageBitmapLoader===!0&&(g=function(y){let m=new bt(y);m.needsUpdate=!0,u(m)}),t.load(fi.resolveURL(d,r.path),g,void 0,p)})}).then(function(d){return c===!0&&o.revokeObjectURL(l),Yn(d,a),d.userData.mimeType=a.mimeType||cv(a.uri),d}).catch(function(d){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),d});return this.sourceCache[e]=h,h}assignTexture(e,t,n,s){let r=this;return this.getDependency("texture",n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),r.extensions[Ke.KHR_TEXTURE_TRANSFORM]){let o=n.extensions!==void 0?n.extensions[Ke.KHR_TEXTURE_TRANSFORM]:void 0;if(o){let l=r.associations.get(a);a=r.extensions[Ke.KHR_TEXTURE_TRANSFORM].extendTexture(a,o),r.associations.set(a,l)}}return s!==void 0&&(a.colorSpace=s),e[t]=a,a})}assignFinalMaterial(e){let t=e.geometry,n=e.material,s=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){let o="PointsMaterial:"+n.uuid,l=this.cache.get(o);l||(l=new Os,Zt.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(o,l)),n=l}else if(e.isLine){let o="LineBasicMaterial:"+n.uuid,l=this.cache.get(o);l||(l=new Fs,Zt.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(o,l)),n=l}if(s||r||a){let o="ClonedMaterial:"+n.uuid+":";s&&(o+="derivative-tangents:"),r&&(o+="vertex-colors:"),a&&(o+="flat-shading:");let l=this.cache.get(o);l||(l=n.clone(),r&&(l.vertexColors=!0),a&&(l.flatShading=!0),s&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(o,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return ai}loadMaterial(e){let t=this,n=this.json,s=this.extensions,r=n.materials[e],a,o={},l=r.extensions||{},c=[];if(l[Ke.KHR_MATERIALS_UNLIT]){let d=s[Ke.KHR_MATERIALS_UNLIT];a=d.getMaterialType(),c.push(d.extendParams(o,r,t))}else{let d=r.pbrMetallicRoughness||{};if(o.color=new Ne(1,1,1),o.opacity=1,Array.isArray(d.baseColorFactor)){let u=d.baseColorFactor;o.color.setRGB(u[0],u[1],u[2],kt),o.opacity=u[3]}d.baseColorTexture!==void 0&&c.push(t.assignTexture(o,"map",d.baseColorTexture,xt)),o.metalness=d.metallicFactor!==void 0?d.metallicFactor:1,o.roughness=d.roughnessFactor!==void 0?d.roughnessFactor:1,d.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(o,"metalnessMap",d.metallicRoughnessTexture)),c.push(t.assignTexture(o,"roughnessMap",d.metallicRoughnessTexture))),a=this._invokeOne(function(u){return u.getMaterialType&&u.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(u){return u.extendMaterialParams&&u.extendMaterialParams(e,o)})))}r.doubleSided===!0&&(o.side=Dt);let h=r.alphaMode||Sh.OPAQUE;if(h===Sh.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,h===Sh.MASK&&(o.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&a!==jt&&(c.push(t.assignTexture(o,"normalMap",r.normalTexture)),o.normalScale=new Ge(1,1),r.normalTexture.scale!==void 0)){let d=r.normalTexture.scale;o.normalScale.set(d,d)}if(r.occlusionTexture!==void 0&&a!==jt&&(c.push(t.assignTexture(o,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&a!==jt){let d=r.emissiveFactor;o.emissive=new Ne().setRGB(d[0],d[1],d[2],kt)}return r.emissiveTexture!==void 0&&a!==jt&&c.push(t.assignTexture(o,"emissiveMap",r.emissiveTexture,xt)),Promise.all(c).then(function(){let d=new a(o);return r.name&&(d.name=r.name),Yn(d,r),t.associations.set(d,{materials:e}),r.extensions&&is(s,d,r),d})}createUniqueName(e){let t=ft.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,s=this.primitiveCache;function r(o){return n[Ke.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,t).then(function(l){return bf(l,o,t)})}let a=[];for(let o=0,l=e.length;o<l;o++){let c=e[o],h=lv(c),d=s[h];if(d)a.push(d.promise);else{let u;c.extensions&&c.extensions[Ke.KHR_DRACO_MESH_COMPRESSION]?u=r(c):u=bf(new Bt,c,t),c.mode===yn.TRIANGLE_STRIP?u=u.then(p=>vh(p,Kr)):c.mode===yn.TRIANGLE_FAN&&(u=u.then(p=>vh(p,qs))),s[h]={primitive:c,promise:u},a.push(u)}}return Promise.all(a)}loadMesh(e){let t=this,n=this.json,s=this.extensions,r=n.meshes[e],a=r.primitives,o=[];for(let l=0,c=a.length;l<c;l++){let h=a[l].material===void 0?rv(this.cache):this.getDependency("material",a[l].material);o.push(h)}return o.push(t.loadGeometries(a)),Promise.all(o).then(async function(l){let c=l.slice(0,l.length-1),h=l[l.length-1],d=[];for(let p=0,g=h.length;p<g;p++){let y=h[p],m=a[p],f,M=c[p];if(m.mode===yn.TRIANGLES||m.mode===yn.TRIANGLE_STRIP||m.mode===yn.TRIANGLE_FAN||m.mode===void 0){let A=r.isSkinnedMesh===!0,S=y.hasAttribute("skinIndex")&&y.hasAttribute("skinWeight");A&&S===!1&&console.warn("THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled."),f=A&&S?new wr(y,M):new ht(y,M),f.isSkinnedMesh===!0&&f.normalizeSkinWeights()}else if(m.mode===yn.LINES)f=new Rr(y,M);else if(m.mode===yn.LINE_STRIP)f=new $i(y,M);else if(m.mode===yn.LINE_LOOP)f=new Cr(y,M);else if(m.mode===yn.POINTS)f=new Ir(y,M);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+m.mode);Object.keys(f.geometry.morphAttributes).length>0&&ov(f,r),f.name=t.createUniqueName(r.name||"mesh_"+e),Yn(f,r),m.extensions&&is(s,f,m),t.assignFinalMaterial(f),d.push(f)}for(let p=0,g=d.length;p<g;p++)t.associations.set(d[p],{meshes:e,primitives:p});if(d.length===1)return r.extensions&&is(s,d[0],r),d[0];let u=new Wt;r.extensions&&is(s,u,r),t.associations.set(u,{meshes:e});for(let p=0,g=d.length;p<g;p++)u.add(d[p]);return u})}loadCamera(e){let t,n=this.json.cameras[e],s=n[n.type];if(!s){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new wt(At.radToDeg(s.yfov),s.aspectRatio||1,s.znear||1,s.zfar||2e6):n.type==="orthographic"&&(t=new Hn(-s.xmag,s.xmag,s.ymag,-s.ymag,s.znear,s.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),Yn(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let s=0,r=t.joints.length;s<r;s++)n.push(this._loadNodeShallow(t.joints[s]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(s){let r=s.pop(),a=s,o=[],l=[];for(let c=0,h=a.length;c<h;c++){let d=a[c];if(d){o.push(d);let u=new ke;r!==null&&u.fromArray(r.array,c*16),l.push(u)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new Er(o,l)})}loadAnimation(e){let t=this.json,n=this,s=t.animations[e],r=s.name?s.name:"animation_"+e,a=[],o=[],l=[],c=[],h=[];for(let d=0,u=s.channels.length;d<u;d++){let p=s.channels[d],g=s.samplers[p.sampler],y=p.target,m=y.node,f=s.parameters!==void 0?s.parameters[g.input]:g.input,M=s.parameters!==void 0?s.parameters[g.output]:g.output;y.node!==void 0&&(a.push(this.getDependency("node",m)),o.push(this.getDependency("accessor",f)),l.push(this.getDependency("accessor",M)),c.push(g),h.push(y))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l),Promise.all(c),Promise.all(h)]).then(function(d){let u=d[0],p=d[1],g=d[2],y=d[3],m=d[4],f=[];for(let A=0,S=u.length;A<S;A++){let b=u[A],T=p[A],C=g[A],_=y[A],E=m[A];if(b===void 0)continue;b.updateMatrix&&b.updateMatrix();let D=n._createAnimationTracks(b,T,C,_,E);if(D)for(let P=0;P<D.length;P++)f.push(D[P])}let M=new zs(r,void 0,f);return Yn(M,s),M})}createNodeMesh(e){let t=this.json,n=this,s=t.nodes[e];return s.mesh===void 0?null:n.getDependency("mesh",s.mesh).then(function(r){let a=n._getNodeRef(n.meshCache,s.mesh,r);return s.weights!==void 0&&a.traverse(function(o){if(o.isMesh)for(let l=0,c=s.weights.length;l<c;l++)o.morphTargetInfluences[l]=s.weights[l]}),a})}loadNode(e){let t=this.json,n=this,s=t.nodes[e],r=n._loadNodeShallow(e),a=[],o=s.children||[];for(let c=0,h=o.length;c<h;c++)a.push(n.getDependency("node",o[c]));let l=s.skin===void 0?Promise.resolve(null):n.getDependency("skin",s.skin);return Promise.all([r,Promise.all(a),l]).then(function(c){let h=c[0],d=c[1],u=c[2];u!==null&&h.traverse(function(p){p.isSkinnedMesh&&p.bind(u,hv)});for(let p=0,g=d.length;p<g;p++)h.add(d[p]);if(h.userData.pivot!==void 0&&d.length>0){let p=h.userData.pivot,g=d[0];h.pivot=new V().fromArray(p),h.position.x-=p[0],h.position.y-=p[1],h.position.z-=p[2],g.position.set(0,0,0),delete h.userData.pivot}return h})}_loadNodeShallow(e){let t=this.json,n=this.extensions,s=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let r=t.nodes[e],a=r.name?s.createUniqueName(r.name):"",o=[],l=s._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&o.push(l),r.camera!==void 0&&o.push(s.getDependency("camera",r.camera).then(function(c){return s._getNodeRef(s.cameraCache,r.camera,c)})),s._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){o.push(c)}),this.nodeCache[e]=Promise.all(o).then(function(c){let h;if(r.isBone===!0?h=new Ns:c.length>1?h=new Wt:c.length===1?h=c[0]:h=new _t,h!==c[0])for(let d=0,u=c.length;d<u;d++)h.add(c[d]);if(r.name&&(h.userData.name=r.name,h.name=a),Yn(h,r),r.extensions&&is(n,h,r),r.matrix!==void 0){let d=new ke;d.fromArray(r.matrix),h.applyMatrix4(d)}else r.translation!==void 0&&h.position.fromArray(r.translation),r.rotation!==void 0&&h.quaternion.fromArray(r.rotation),r.scale!==void 0&&h.scale.fromArray(r.scale);if(!s.associations.has(h))s.associations.set(h,{});else if(r.mesh!==void 0&&s.meshCache.refs[r.mesh]>1){let d=s.associations.get(h);s.associations.set(h,{...d})}return s.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],s=this,r=new Wt;n.name&&(r.name=s.createUniqueName(n.name)),Yn(r,n),n.extensions&&is(t,r,n);let a=n.nodes||[],o=[];for(let l=0,c=a.length;l<c;l++)o.push(s.getDependency("node",a[l]));return Promise.all(o).then(function(l){for(let h=0,d=l.length;h<d;h++){let u=l[h];u.parent!==null?r.add(_f(u)):r.add(u)}let c=h=>{let d=new Map;for(let[u,p]of s.associations)(u instanceof Zt||u instanceof bt)&&d.set(u,p);return h.traverse(u=>{let p=s.associations.get(u);p!=null&&d.set(u,p)}),d};return s.associations=c(r),r})}_createAnimationTracks(e,t,n,s,r){let a=[],o=e.name?e.name:e.uuid,l=[];function c(p){p.morphTargetInfluences&&l.push(p.name?p.name:p.uuid)}Ui[r.path]===Ui.weights?(c(e),e.isGroup&&e.children.forEach(c)):l.push(o);let h;switch(Ui[r.path]){case Ui.weights:h=li;break;case Ui.rotation:h=Vn;break;case Ui.translation:case Ui.scale:h=hi;break;default:n.itemSize===1?h=li:h=hi;break}let d=s.interpolation!==void 0?sv[s.interpolation]:Xi,u=this._getArrayFromAccessor(n);for(let p=0,g=l.length;p<g;p++){let y=new h(l[p]+"."+Ui[r.path],t.array,u,d);s.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(y),a.push(y)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let n=qh(t.constructor),s=new Float32Array(t.length);for(let r=0,a=t.length;r<a;r++)s[r]=t[r]*n;t=s}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){let s=this instanceof Vn?Wh:vl;return new s(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function uv(i,e,t){let n=e.attributes,s=new dn;if(n.POSITION!==void 0){let o=t.json.accessors[n.POSITION],l=o.min,c=o.max;if(l!==void 0&&c!==void 0){if(s.set(new V(l[0],l[1],l[2]),new V(c[0],c[1],c[2])),o.normalized){let h=qh(Qs[o.componentType]);s.min.multiplyScalar(h),s.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let r=e.targets;if(r!==void 0){let o=new V,l=new V;for(let c=0,h=r.length;c<h;c++){let d=r[c];if(d.POSITION!==void 0){let u=t.json.accessors[d.POSITION],p=u.min,g=u.max;if(p!==void 0&&g!==void 0){if(l.setX(Math.max(Math.abs(p[0]),Math.abs(g[0]))),l.setY(Math.max(Math.abs(p[1]),Math.abs(g[1]))),l.setZ(Math.max(Math.abs(p[2]),Math.abs(g[2]))),u.normalized){let y=qh(Qs[u.componentType]);l.multiplyScalar(y)}o.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}s.expandByVector(o)}i.boundingBox=s;let a=new nn;s.getCenter(a.center),a.radius=s.min.distanceTo(s.max)/2,i.boundingSphere=a}function bf(i,e,t){let n=e.attributes,s=[];function r(a,o){return t.getDependency("accessor",a).then(function(l){i.setAttribute(o,l)})}for(let a in n){let o=Xh[a]||a.toLowerCase();o in i.attributes||s.push(r(n[a],o))}if(e.indices!==void 0&&!i.index){let a=t.getDependency("accessor",e.indices).then(function(o){i.setIndex(o)});s.push(a)}return Ye.workingColorSpace!==kt&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Ye.workingColorSpace}" not supported.`),Yn(i,e),uv(i,e,t),Promise.all(s).then(function(){return e.targets!==void 0?av(i,e.targets,t):i})}var ss=(i,e,t)=>{let n=Math.max(0,Math.min(1,(t-i)/(e-i)));return n*n*(3-2*n)},wf=(i,e)=>Math.hypot(i[0]-e[0],i[1]-e[1],(i[2]||0)-(e[2]||0));function $h(i){let e=[0];for(let t=1;t<i.length;t++)e.push(e[t-1]+wf(i[t],i[t-1]));return e}function dv(i,e){e=Math.max(0,Math.min(i.at(-1),e));let t=0,n=i.length-1;for(;n-t>1;){let s=t+n>>1;i[s]<e?t=s:n=s}return[t,n,(e-i[t])/(i[n]-i[t]||1)]}function Sn(i,e,t){let[n,s,r]=dv(e,t);return Array.from({length:3},(a,o)=>(i[n][o]||0)*(1-r)+(i[s][o]||0)*r)}var Kh=i=>{let e=Math.hypot(...i)||1;return i.map(t=>t/e)},yl=class{constructor(e){this.data=e,this.points=e.pointsMm,this.arc=$h(this.points),this.length=e.lengthMm,this.count=e.boneCount,this.anchorS=e.foldEndMm+20,this.A=Sn(this.points,this.arc,this.anchorS),this.B=Sn(this.points,this.arc,e.mainEndMm),this.middle=this.A.map((l,c)=>(l+this.B[c])/2);let t=this.B[0]-this.A[0],n=this.B[1]-this.A[1];this.chord=Math.hypot(t,n),this.normal=[-n/this.chord,t/this.chord];let s=Math.sqrt(e.radiusMm**2-this.chord**2/4),r=this.middle.slice(0,2).map((l,c)=>l+s*this.normal[c]),a=this.middle.slice(0,2).map((l,c)=>l-s*this.normal[c]);this.sign=Math.hypot(...r)<Math.hypot(...a)?1:-1,this.suffix=[this.B,...this.points.filter((l,c)=>this.arc[c]>e.mainEndMm+1e-4)],this.suffixArc=$h(this.suffix),this.oldArc=this.circle(e.radiusMm).length,this.holeLocal=e.selectedHoleMm-e.mainEndMm;let o=this.suffix.findIndex(l=>l[0]<5.5);this.liftStart=this.suffixArc[Math.max(0,o)],this.sideStart=this.suffixArc[this.suffix.findIndex(l=>l[0]<0)]}circle(e){let t=Math.sqrt(Math.max(0,e*e-this.chord*this.chord/4)),n=this.middle.slice(0,2).map((o,l)=>o+this.sign*t*this.normal[l]),s=Math.atan2(this.A[1]-n[1],this.A[0]-n[0]),r=Math.atan2(this.B[1]-n[1],this.B[0]-n[0]),a=(s-r+Math.PI*2)%(Math.PI*2);return{C:n,angle:s,length:e*a,radius:e}}radiusFor(e){let t=this.chord/2+.01,n=this.data.radiusMm+45;for(let s=0;s<32;s++){let r=(t+n)/2;this.circle(r).length<e?t=r:n=r}return(t+n)/2}restFrame(e){let t=Sn(this.points,this.arc,e),n=Sn(this.points,this.arc,e-.08),s=Sn(this.points,this.arc,e+.08),r=wf(n,s)||1;return[t[0],t[1],(s[0]-n[0])/r,(s[1]-n[1])/r]}frame(e,t){let n=t.point(e),s=t.point(Math.max(0,e-.08)),r=t.point(Math.min(this.length,e+.08)),a=Kh([r[0]-s[0],r[2]-s[2],-r[1]+s[1]]),o=Kh([-a[0]*a[1],1-a[1]*a[1],-a[2]*a[1]]),l=[o[1]*a[2]-o[2]*a[1],o[2]*a[0]-o[0]*a[2],o[0]*a[1]-o[1]*a[0]];return[n[0],n[2],-n[1],...a,...o,...l]}sample(e){let t=ss(0,.18,e),n=.55*t,s=10*ss(.18,.34,e),r=-.45*t-.75*ss(.72,.78,e),a=ss(.36,.72,e),o=-Math.sqrt(this.data.radiusMm**2-100)-3.5,l=Sn(this.suffix,this.suffixArc,this.holeLocal),c=Math.max(.3,this.holeLocal-5),h=Sn(this.suffix,this.suffixArc,c),d=(U,w)=>[Math.cos(w)*U[0]-Math.sin(w)*U[1],Math.sin(w)*U[0]+Math.cos(w)*U[1]],u=d([l[0]+10+s,l[1]-o-s*.13],-.45*t),p=[u[0]-10,u[1]+o],g=U=>{let w=d([U[0]-l[0],U[1]-l[1]],n);return[p[0]+w[0],p[1]+w[1],0]},y=g(h),m=Sn(this.suffix,this.suffixArc,c-.08),f=Sn(this.suffix,this.suffixArc,c+.08),M=Kh(d([f[0]-m[0],f[1]-m[1]],n)),A=[this.B[0]-9,this.B[1]-1],S=[y[0]-M[0]*4,y[1]-M[1]*4],b=[];for(let U=0;U<=80;U++){let w=U/80,O=1-w,W=Sn(this.suffix,this.suffixArc,c*w),$=[O**3*this.B[0]+3*O*O*w*A[0]+3*O*w*w*S[0]+w**3*y[0]-6*Math.sin(Math.PI*w)**2*ss(0,8,s),O**3*this.B[1]+3*O*O*w*A[1]+3*O*w*w*S[1]+w**3*y[1]];b.push([W[0]*(1-t)+$[0]*t,W[1]*(1-t)+$[1]*t,0])}let T=[...b,...this.suffix.filter((U,w)=>this.suffixArc[w]>c).map(g)],C=$h(T),_=C[80],E=this.oldArc-(_-c),D=E*(1-a)+(this.length-this.anchorS+4)*a,P=this.circle(this.radiusFor(D));return{r:e,point:U=>{if(e===0||U<=this.anchorS)return Sn(this.points,this.arc,U);let w=U-this.anchorS;if(w<=P.length){let O=P.angle-w/P.radius;return[P.C[0]+P.radius*Math.cos(O),P.C[1]+P.radius*Math.sin(O),0]}return Sn(T,C,w-P.length)},pin:r,feed:a,angle:n,along:s,sideMm:0,circleCenter:e===0?[0,0]:P.C,phase:e<=0?"fastened":e<.18?"unload-hole":e<.36?"release-hole":e<.72?"withdraw-tail":e<.79?"park-pin":e<.94?"slide-clear":e<1?"depart":"off",slide:ss(.79,.94,e),depart:ss(.94,1,e),freeEndBehindFrame:P.length>=this.length-this.anchorS,expandedRadiusMm:P.radius}}};var ln=1024,fv=`
uniform sampler2D keeperCurve;
uniform float keeperLength;
attribute vec3 keeperMaterial,keeperNormal,keeperResidual;
varying vec3 vKeeperMaterial;
vec3 keeperRow(float row){
 float f=clamp(keeperMaterial.x/keeperLength,0.,1.)*${ln-1}.;
 float i=floor(f);vec3 a=texture2D(keeperCurve,vec2((i+.5)/${ln}.,(row+.5)/4.)).xyz;
 vec3 b=texture2D(keeperCurve,vec2((min(i+1.,${ln-1}.)+.5)/${ln}.,(row+.5)/4.)).xyz;
 return mix(a,b,fract(f));
}
`,Sl=class{constructor(e,t){this.template=t,this.radius=Ni(t.height,t.coreRadius,t.layerThickness),this.group=new Wt,this.group.name="continuous-unfastening-keeper",e.add(this.group),this.parts=[],this.maps=[],this.pending=[0,0],this.pose={phase:"loading"},this.ready=this.load()}async load(){let e=await(await fetch(new URL("../chapter-scroll-v17/keeper-path.json",import.meta.url))).json();this.path=new yl(e);let t=await new xl().loadAsync(new URL("../certification-reader/assets/keeper-display.glb",import.meta.url).href,f=>this.onLoadingProgress?.(Math.min(1,f.loaded/(f.total||16838068))));if(this.model=t.scene,this.model.updateMatrixWorld(!0),this.sourceMeshes=[],this.model.traverse(f=>{f.name.startsWith("Prong_hinge")&&(this.hinge=f),f.isMesh&&this.sourceMeshes.push(f)}),!this.hinge)throw Error("Rigid prong hinge unavailable");this.hingeRest=this.hinge.quaternion.clone();let n=this.sourceMeshes.find(f=>f.isSkinnedMesh);if(!n)throw Error("Original continuous strap unavailable");let s=n.geometry.clone(),r=s.attributes.position,a=s.attributes.normal,o=s.morphAttributes.position[0];this.curveData=new Float32Array(ln*4*4),this.curve=new zn(this.curveData,ln,4,en,zt),this.curve.minFilter=this.curve.magFilter=Mt,this.curve.generateMipmaps=!1,this.uniforms={keeperCurve:{value:this.curve},keeperLength:{value:e.lengthMm}};let l=new Float32Array(r.count*3),c=new Float32Array(r.count*3),h=new V,d=new V;for(let f=0;f<r.count;f++){h.fromBufferAttribute(r,f);let M=new V().fromBufferAttribute(o,f);s.morphTargetsRelative&&M.add(h);let A=(M.x+e.lengthMm*5e-4)*1e3,S=M.z*1e3,b=M.y*1e3;l.set([A,S,b],f*3);let T=this.path.restFrame(A);d.fromBufferAttribute(a,f),c.set([d.x*T[2]-d.z*T[3],d.y,-d.x*T[3]-d.z*T[2]],f*3)}s.morphAttributes={},s.deleteAttribute("skinIndex"),s.deleteAttribute("skinWeight"),s.setAttribute("keeperMaterial",new St(l,3)),s.setAttribute("keeperNormal",new St(c,3)),this.residual=new Float32Array(r.count*3),s.setAttribute("keeperResidual",new St(this.residual,3));let u=s.attributes.uv;for(let f=0;f<u.count;f++)u.setXY(f,u.getX(f)*3,u.getY(f)*3);this.flat=l,this.strap=new ht(s,n.material.clone()),this.strap.name=n.name,this.strap.position.copy(n.position),this.strap.quaternion.copy(n.quaternion),this.strap.scale.copy(n.scale),n.parent.add(this.strap),n.removeFromParent(),this.sourceMeshes=this.sourceMeshes.filter(f=>f!==n),this.sourceMeshes.push(this.strap);let p=(f,M)=>{f.onBeforeCompile=A=>{Object.assign(A.uniforms,this.uniforms),A.vertexShader=fv+A.vertexShader,A.vertexShader=A.vertexShader.replace("#include <begin_vertex>","vKeeperMaterial=keeperMaterial;vec3 transformed=(keeperRow(0.)+normalize(keeperRow(2.))*keeperMaterial.z+normalize(keeperRow(3.))*keeperMaterial.y+mat3(normalize(keeperRow(1.)),normalize(keeperRow(2.)),normalize(keeperRow(3.)))*keeperResidual)*.001;"),M&&(A.vertexShader=A.vertexShader.replace("#include <beginnormal_vertex>","vec3 objectNormal=normalize(mat3(normalize(keeperRow(1.)),normalize(keeperRow(2.)),normalize(keeperRow(3.)))*keeperNormal);")),M&&(A.fragmentShader=`varying vec3 vKeeperMaterial;
`+A.fragmentShader,A.fragmentShader=A.fragmentShader.replace("#include <map_fragment>",`#include <map_fragment>
     float rubbed=smoothstep(7.7,9.1,abs(vKeeperMaterial.z));
     float grain=dot(diffuseColor.rgb,vec3(.3,.59,.11));
     float irregular=.65+.35*sin(vKeeperMaterial.x*.61+sin(vKeeperMaterial.x*.19)*2.);
     diffuseColor.rgb=mix(diffuseColor.rgb*.87,vec3(.25,.135,.058)*(1.+grain),rubbed*irregular*.40);
     float crease=exp(-pow((vKeeperMaterial.x-${e.selectedHoleMm.toFixed(4)})/1.2,2.))*(.7+.3*cos(vKeeperMaterial.z*1.3));
     diffuseColor.rgb*=1.-.18*crease;
    `),A.fragmentShader=A.fragmentShader.replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor=clamp(.65+roughnessFactor*.28,.7,.96);`))},f.customProgramCacheKey=()=>`material-coordinate-keeper-v17-${M}`,f.needsUpdate=!0};p(this.strap.material,!0),this.strap.customDepthMaterial=new Ii({depthPacking:Zr}),p(this.strap.customDepthMaterial,!1),this.strap.material.normalScale.set(.45,.45),this.strap.material.envMapIntensity=.65,this.gap=.065,this.scale=(this.radius+this.gap)/((e.radiusMm-e.thicknessMm/2)*.001),this.fitting=new Wt,this.fitting.rotation.z=Math.PI/2,this.fitting.scale.setScalar(this.scale),this.fitting.add(this.model),this.group.add(this.fitting),this.halfWidth=.014*this.scale;for(let f of this.sourceMeshes){this.parts.push(f),f.frustumCulled=!1,f.castShadow=!0,f.receiveShadow=!0,f.material.transparent=!1,f.material.opacity=1,f!==this.strap&&(f.material.envMapIntensity=3,f.material.roughness=.85);for(let M of["map","normalMap","roughnessMap","metalnessMap"])f.material[M]&&this.maps.push(f.material[M])}this.maps.push(this.curve),this.update(...this.pending);for(let f=0;f<r.count;f++){let M=this.vertex(f,new V),A=new V().fromBufferAttribute(r,f).sub(M).multiplyScalar(1e3),S=this.rows(l[f*3]);this.residual.set([1,2,3].map(b=>A.dot(new V(...S[b]))),f*3)}let g=new V,y=0,m=0;for(let f=0;f<r.count;f++){this.vertex(f,g);let M=g.distanceTo(new V().fromBufferAttribute(r,f));y=Math.max(y,M),m+=M}this.restDeviationMm={maximum:y*1e3,mean:m/r.count*1e3},this.onLoadingProgress?.(1)}update(e,t){if(this.pending=[e,t],!this.path||!this.fitting)return;let n=At.clamp(e/.4,0,1),s=this.path.sample(n);for(let a=0;a<ln;a++){let o=this.path.frame(this.path.length*a/(ln-1),s);for(let l=0;l<4;l++)this.curveData.set(o.slice(l*3,l*3+3),(l*ln+a)*4)}this.curve.needsUpdate=!0,this.hinge.quaternion.copy(this.hingeRest).multiply(new Xt().setFromAxisAngle(new V(0,1,0),s.pin));let r=this.template.width/2+this.halfWidth+.18;this.group.position.set(-r*s.slide-.85*s.depart,t+.025*Math.sin(s.slide*Math.PI)-s.circleCenter[0]*.001*this.scale,this.radius+.12*s.depart+s.circleCenter[1]*.001*this.scale),this.group.rotation.set(0,.1*s.depart,-.12*s.depart),this.group.visible=e<.4,this.group.updateMatrixWorld(!0),this.pose={...s,heads:void 0,point:void 0,visible:this.group.visible,opacity:1,x:this.group.position.x,y:this.group.position.y,z:this.group.position.z,fitScale:this.scale,fitScaleVector:this.fitting.scale.toArray(),bandWidth:.018*this.scale,usesFade:!1,usesStrapDeformation:!0,deformation:"material-coordinate curve; dimensioned continuous cut mesh; native bevel residual",sourceBones:76}}snapshot(){let{circle:e,suffix:t,suffixArc:n,...s}=this.pose;return{...s,restDeviationMm:this.restDeviationMm}}rows(e){let t=Math.max(0,Math.min(ln-1,e/this.path.length*(ln-1))),n=Math.floor(t),s=Math.min(ln-1,n+1),r=t-n,a=this.curveData;return Array.from({length:4},(o,l)=>{let c=Array.from({length:3},(h,d)=>a[(l*ln+n)*4+d]*(1-r)+a[(l*ln+s)*4+d]*r);if(l){let h=Math.hypot(...c);return c.map(d=>d/h)}return c})}vertex(e,t){let n=this.flat[e*3+1],s=this.flat[e*3+2],r=this.rows(this.flat[e*3]),a=this.residual;return t.set(...r[0].map((o,l)=>(o+s*r[2][l]+n*r[3][l]+r[1][l]*a[e*3]+r[2][l]*a[e*3+1]+r[3][l]*a[e*3+2])*.001))}inspectionGeometry(){this.group.updateMatrixWorld(!0);let e=new V;return{paperRadius:this.radius+.006,paperCenterY:this.pending[1],paperCenterZ:this.radius,paperHalfWidth:this.template.width/2,meshes:this.parts.map(t=>{let n=[];for(let s=0;s<t.geometry.attributes.position.count;s++)t===this.strap?this.vertex(s,e):t.getVertexPosition(s,e),e.applyMatrix4(t.matrixWorld),n.push(e.x,e.y,e.z);return{name:t.name,leather:t===this.strap,vertices:n,indices:t.geometry.index?Array.from(t.geometry.index.array):Array.from({length:n.length/3},(s,r)=>r)}})}}dispose(){for(let e of this.parts)e.geometry.dispose(),e.material.dispose(),e.customDepthMaterial?.dispose();for(let e of new Set(this.maps))e.dispose();this.group.removeFromParent()}};var Ml=class extends gl{constructor(...e){super(...e),this.closure.dispose(),this.closure=new Sl(this.scene,this.template),this.integrated=!0;let t=this.environmentReady;this.environmentReady=Promise.all([t,this.closure.ready]).then(()=>{this.maps.push(...this.closure.maps);for(let s of[this.material.normalMap,this.material.roughnessMap])s.wrapS=s.wrapT=Ot,s.repeat.set(1,1),s.needsUpdate=!0;this.material.normalScale.set(.11,.11),this.material.needsUpdate=!0});let n=s=>{s.vertexShader=s.vertexShader.replace("v.z=.009*sin",`float u=q.x/scrollWidth+.5, sheetV=.5-q.y/scrollHeight;
   float diagonal=exp(-pow((sheetV-(.11+.365*u))/.009,2.))*(1.-smoothstep(.42,.55,u));
   float crossfold=exp(-pow((sheetV-(.645+.04*u))/.010,2.));
   v.z=-.008*diagonal-.011*crossfold;
   v.z+=.009*sin`)};for(let s of[this.material,this.sheet.customDepthMaterial]){let r=s.onBeforeCompile;s.onBeforeCompile=a=>{r(a),n(a)},s.customProgramCacheKey=()=>s===this.material?"chapter-five-v14-folds":"chapter-five-v14-fold-shadow",s.needsUpdate=!0}this.setProgress(0)}setProgress(e){if(!this.integrated)return super.setProgress(e);let t=At.clamp(e,0,1),n=At.clamp((t-.4)/(1-.4),0,1);Js.prototype.setProgress.call(this,.18+.82*n),this.progress=t,this.closure.update(t,this.height/2+this.sheet.position.y)}async prepareMotion(e){let t=performance.now();await this.environmentReady;for(let n of new Set([...this.maps,this.sealBump]))this.renderer.initTexture(n);this.setProgress(0),await this.renderer.compileAsync(this.scene,this.camera);for(let n of[0,.05,.1,.17,.23,.3,.339,1,e])this.setProgress(n),this.render(),await new Promise(s=>requestAnimationFrame(s));this.motionPrepared=!0,this.preparationMs=performance.now()-t,this.preparedPrograms=this.renderer.info.programs.length}snapshot(){return{...super.snapshot(),edition:"v17 physical keeper integration",keeperMotion:"material-coordinate unfastening and rigid hinged prong",keeperSize:[.018*this.closure.scale,.06*this.closure.scale],paperMaterial:"unchanged chapter-five v14"}}exportKeeper(){let e=this.progress,t=this.camera,n=this.renderer.getSize(new Ge),s=this.scene.children.map(a=>[a,a.visible]);this.closure.group.position.set(0,0,0),this.closure.group.rotation.set(0,0,0),this.closure.group.visible=!0;for(let[a]of s)a!==this.closure.group&&!a.isLight&&(a.visible=!1);this.camera=new wt(32,1,.01,30),this.camera.position.set(.42,.2,1.8),this.camera.lookAt(0,0,.08),this.renderer.setSize(900,900,!1),this.render();let r=this.renderer.domElement.toDataURL("image/png");this.camera=t,this.renderer.setSize(n.x,n.y,!1);for(let[a,o]of s)a.visible=o;return this.setProgress(e),this.render(),r}interaction(){let e=(t,n,s)=>{let r=new V(t,n,s).project(this.camera);return{x:.5+.5*r.x,y:.5+.5*r.y}};return{top:[e(-this.width/2,this.bounds.top,0),e(this.width/2,this.bounds.top,0)],bottom:[e(-this.width/2,this.bounds.bottom,0),e(this.width/2,this.bounds.bottom,0)],keeper:this.closure.group.visible?e(this.closure.group.position.x,this.closure.group.position.y,this.closure.group.position.z+this.closure.radius):null,paperProgress:this.paperProgress}}inspectionGeometry(){if(this.paperProgress!==0)throw Error("Contact inspection expects the closed paper");let e=this.closure.inspectionGeometry();if(this.progress===0){let t=this.geometry.attributes.position,n=[],s=this.closure.radius,r=this.template.layerThickness/(2*Math.PI),a=-this.height/2;this.sheet.updateMatrixWorld(!0);let o=new V;for(let l=0;l<t.count;l++){let c=t.getX(l),h=t.getY(l),d=c/this.width+.5,u=.5-h/this.height,p=(Math.abs(c)/(this.width/2))**6,g=Math.exp(-(((u-(.11+.365*d))/.009)**2))*(1-At.smoothstep(d,.42,.55)),y=Math.exp(-(((u-(.645+.04*d))/.01)**2)),m=-.008*g-.011*y+.009*Math.sin(h*4+c*2)+.025*p*Math.sin(h*3.2+.4),f=h,M=m,A=-h-a;if(A>0){let S=s*.08,b=(s-S)/r,T=s*b-.5*r*b*b,C=A>=T?b+(A-T)/S:2*A/(s+Math.sqrt(Math.max(0,s*s-2*r*A))),_=Math.max(s-r*C,S)-m;f=-(a+_*Math.sin(C)),M=s-_*Math.cos(C)}o.set(c,f,M).applyMatrix4(this.sheet.matrixWorld),n.push(o.x,o.y,o.z)}e.paperMesh={vertices:n,indices:Array.from(this.geometry.index.array)}}return e}};async function Ef(i,e){let t=new ui,n=["leather-color","leather-orm","leather-normal","bronze-color","bronze-orm","bronze-normal"],s=await Promise.all(n.map(async f=>{let M=await t.loadAsync(new URL(`../chapter-scroll-v19/assets/${f}.webp`,import.meta.url).href);return M.flipY=!1,M.colorSpace=f.endsWith("color")?xt:Pn,M.wrapS=M.wrapT=Ot,M.anisotropy=Math.min(8,e.capabilities.getMaxAnisotropy()),M})),[r,a,o,l,c,h]=s,d=new Set;for(let f of i.parts)for(let M of["map","normalMap","roughnessMap","metalnessMap"])f.material[M]&&d.add(f.material[M]);let u=i.strap.material,p=u.onBeforeCompile,g=i.strap.geometry.attributes.uv,y=i.flat;for(let f=0;f<g.count;f++)g.setXY(f,y[f*3]/i.path.length,.5-y[f*3+2]/18);g.needsUpdate=!0,Object.assign(u,{map:r,normalMap:o,roughnessMap:a,metalnessMap:null,roughness:1,metalness:0,envMapIntensity:.7}),u.normalScale.set(.72,.72),u.onBeforeCompile=f=>{p(f);let M=/float rubbed=smoothstep\(7\.7,9\.1,abs\(vKeeperMaterial\.z\)\);[\s\S]*?diffuseColor\.rgb\*=1\.-\.18\*crease;/;if(!M.test(f.fragmentShader))throw Error("Base material changed: review before using baked finishing");f.vertexShader=`varying vec3 vKeeperSurface;
`+f.vertexShader,f.vertexShader=f.vertexShader.replace("vKeeperMaterial=keeperMaterial;","vKeeperSurface=keeperNormal;vKeeperMaterial=keeperMaterial;"),f.fragmentShader=`varying vec3 vKeeperSurface;
`+f.fragmentShader,f.fragmentShader=f.fragmentShader.replace(M,""),f.fragmentShader=f.fragmentShader.replace("roughnessFactor=clamp(.65+roughnessFactor*.28,.7,.96);","roughnessFactor=clamp(roughnessFactor,.42,.99);"),f.fragmentShader=f.fragmentShader.replace("#include <map_fragment>",`#include <map_fragment>
   float cutSide=smoothstep(.42,.82,1.-abs(normalize(vKeeperSurface).z));
   // Keep incised face motifs off the exposed core. A separate thickness
   // cross-section samples the central, untooled portion of the leather map.
   vec2 coreUv=vec2(vKeeperMaterial.x/${i.path.length.toFixed(5)},.36+vKeeperMaterial.y*.09);
   vec3 core=texture2D(map,coreUv).rgb;
   vec3 coreN=texture2D(normalMap,coreUv).xyz*2.-1.;
   float coreTone=dot(core,vec3(.30,.59,.11));
   float coreFiber=clamp(.57+2.4*coreTone+.48*(coreN.x+coreN.y),.40,1.5);
   diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.145,.067,.024)*coreFiber,cutSide*.93);
  `),f.fragmentShader=f.fragmentShader.replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
    coreN.xy*=.25;
    mat3 coreTangent=getTangentFrame(-vViewPosition,nonPerturbedNormal,coreUv);
    normal=normalize(mix(normal,normalize(coreTangent*normalize(coreN)),cutSide*.96));`),f.fragmentShader=f.fragmentShader.replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor=mix(roughnessFactor,.94,cutSide);`)},u.customProgramCacheKey=()=>"keeper-native-workshop-leather-v19",u.needsUpdate=!0;let m=i.parts.find(f=>f!==i.strap).material.clone();Object.assign(m,{map:l,roughnessMap:c,metalnessMap:c,normalMap:h,roughness:1,metalness:1,envMapIntensity:5.2}),m.normalScale.set(.85,.85),m.needsUpdate=!0;for(let f of i.parts)f!==i.strap&&(f.material=m);i.maps=i.maps.filter(f=>!d.has(f)),i.maps.push(...s);for(let f of d)f.dispose();return{version:"v19 native multi-pass finishing",leather:["scanned grain","hide variation","dark contact polish","grain-coat loss","opened flex creases","worn hand-incised borders","terminal lozenge"],metal:["scanned microstructure","planishing depressions","file dressing","paired incised grooves","brown stable oxide","subdued crevice patina","rubbed crowns"],sourceGeometry:"unchanged v17",offlineBaked:!0,noMold:!0}}var er=class extends Ml{constructor(...e){super(...e);let t=this.environmentReady;this.environmentReady=t.then(async()=>{let n=new Set(this.closure.maps);this.aging=await Ef(this.closure,this.renderer),this.maps=this.maps.filter(s=>!n.has(s)),this.maps.push(...this.closure.maps)})}snapshot(){return{...super.snapshot(),edition:"v19 multi-pass old keeper",aging:this.aging}}};function bl(i,e={}){fe();let t={SIM_RESOLUTION:e.simResolution||64,DYE_RESOLUTION:512,CAPTURE_RESOLUTION:512,DENSITY_DISSIPATION:e.densityDissipation??.7,VELOCITY_DISSIPATION:.65,PRESSURE:.8,PRESSURE_ITERATIONS:12,CURL:e.curl??12,SPLAT_RADIUS:.1,SPLAT_FORCE:6e3,SHADING:!1,COLORFUL:!1,COLOR_UPDATE_SPEED:10,PAUSED:!1,BACK_COLOR:{r:0,g:0,b:0},TRANSPARENT:!0,BLOOM:!1,BLOOM_ITERATIONS:8,BLOOM_RESOLUTION:256,BLOOM_INTENSITY:.8,BLOOM_THRESHOLD:.6,BLOOM_SOFT_KNEE:.7,SUNRAYS:!1,SUNRAYS_RESOLUTION:196,SUNRAYS_WEIGHT:1};function n(){this.id=-1,this.texcoordX=0,this.texcoordY=0,this.prevTexcoordX=0,this.prevTexcoordY=0,this.deltaX=0,this.deltaY=0,this.down=!1,this.moved=!1,this.color=[30,0,300]}let s=[],r=[];s.push(new n);let{gl:a,ext:o}=l(i);d()&&(t.DYE_RESOLUTION=512),o.supportLinearFiltering||(t.DYE_RESOLUTION=512,t.SHADING=!1,t.BLOOM=!1,t.SUNRAYS=!1),e.dyeResolution&&(t.DYE_RESOLUTION=Math.min(t.DYE_RESOLUTION,e.dyeResolution));function l(L){let K={alpha:!0,depth:!1,stencil:!1,antialias:!1,preserveDrawingBuffer:!1},q=L.getContext("webgl2",K),x=!!q;x||(q=L.getContext("webgl",K)||L.getContext("experimental-webgl",K));let I,H;x?(q.getExtension("EXT_color_buffer_float"),H=q.getExtension("OES_texture_float_linear")):(I=q.getExtension("OES_texture_half_float"),H=q.getExtension("OES_texture_half_float_linear")),q.clearColor(0,0,0,1);let N=x?q.HALF_FLOAT:I.HALF_FLOAT_OES,k,oe,ge;return x?(k=c(q,q.RGBA16F,q.RGBA,N),oe=c(q,q.RG16F,q.RG,N),ge=c(q,q.R16F,q.RED,N)):(k=c(q,q.RGBA,q.RGBA,N),oe=c(q,q.RGBA,q.RGBA,N),ge=c(q,q.RGBA,q.RGBA,N)),{gl:q,ext:{formatRGBA:k,formatRG:oe,formatR:ge,halfFloatTexType:N,supportLinearFiltering:H}}}function c(L,K,q,x){if(!h(L,K,q,x))switch(K){case L.R16F:return c(L,L.RG16F,L.RG,x);case L.RG16F:return c(L,L.RGBA16F,L.RGBA,x);default:return null}return{internalFormat:K,format:q}}function h(L,K,q,x){let I=L.createTexture();L.bindTexture(L.TEXTURE_2D,I),L.texParameteri(L.TEXTURE_2D,L.TEXTURE_MIN_FILTER,L.NEAREST),L.texParameteri(L.TEXTURE_2D,L.TEXTURE_MAG_FILTER,L.NEAREST),L.texParameteri(L.TEXTURE_2D,L.TEXTURE_WRAP_S,L.CLAMP_TO_EDGE),L.texParameteri(L.TEXTURE_2D,L.TEXTURE_WRAP_T,L.CLAMP_TO_EDGE),L.texImage2D(L.TEXTURE_2D,0,K,4,4,0,q,x,null);let H=L.createFramebuffer();return L.bindFramebuffer(L.FRAMEBUFFER,H),L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,I,0),L.checkFramebufferStatus(L.FRAMEBUFFER)==L.FRAMEBUFFER_COMPLETE}function d(){return/Mobi|Android/i.test(navigator.userAgent)}class u{constructor(K,q){this.vertexShader=K,this.fragmentShaderSource=q,this.programs=[],this.activeProgram=null,this.uniforms=[]}setKeywords(K){let q=0;for(let I=0;I<K.length;I++)q+=Gl(K[I]);let x=this.programs[q];if(x==null){let I=m(a.FRAGMENT_SHADER,this.fragmentShaderSource,K);x=g(this.vertexShader,I),this.programs[q]=x}x!=this.activeProgram&&(this.uniforms=y(x),this.activeProgram=x)}bind(){a.useProgram(this.activeProgram)}}class p{constructor(K,q){this.uniforms={},this.program=g(K,q),this.uniforms=y(this.program)}bind(){a.useProgram(this.program)}}function g(L,K){let q=a.createProgram();return a.attachShader(q,L),a.attachShader(q,K),a.linkProgram(q),a.getProgramParameter(q,a.LINK_STATUS)||console.trace(a.getProgramInfoLog(q)),q}function y(L){let K=[],q=a.getProgramParameter(L,a.ACTIVE_UNIFORMS);for(let x=0;x<q;x++){let I=a.getActiveUniform(L,x).name;K[I]=a.getUniformLocation(L,I)}return K}function m(L,K,q){K=f(K,q);let x=a.createShader(L);return a.shaderSource(x,K),a.compileShader(x),a.getShaderParameter(x,a.COMPILE_STATUS)||console.trace(a.getShaderInfoLog(x)),x}function f(L,K){if(K==null)return L;let q="";return K.forEach(x=>{q+="#define "+x+`
`}),q+L}let M=m(a.VERTEX_SHADER,`
    precision highp float;

    attribute vec2 aPosition;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform vec2 texelSize;

    void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
    }
`),A=m(a.VERTEX_SHADER,`
    precision highp float;

    attribute vec2 aPosition;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    uniform vec2 texelSize;

    void main () {
        vUv = aPosition * 0.5 + 0.5;
        float offset = 1.33333333;
        vL = vUv - texelSize * offset;
        vR = vUv + texelSize * offset;
        gl_Position = vec4(aPosition, 0.0, 1.0);
    }
`),S=m(a.FRAGMENT_SHADER,`
    precision mediump float;
    precision mediump sampler2D;

    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    uniform sampler2D uTexture;

    void main () {
        vec4 sum = texture2D(uTexture, vUv) * 0.29411764;
        sum += texture2D(uTexture, vL) * 0.35294117;
        sum += texture2D(uTexture, vR) * 0.35294117;
        gl_FragColor = sum;
    }
`),b=m(a.FRAGMENT_SHADER,`
    precision mediump float;
    precision mediump sampler2D;

    varying highp vec2 vUv;
    uniform sampler2D uTexture;

    void main () {
        gl_FragColor = texture2D(uTexture, vUv);
    }
`),T=m(a.FRAGMENT_SHADER,`
    precision mediump float;
    precision mediump sampler2D;

    varying highp vec2 vUv;
    uniform sampler2D uTexture;
    uniform float value;

    void main () {
        gl_FragColor = value * texture2D(uTexture, vUv);
    }
`),C=m(a.FRAGMENT_SHADER,`
    precision mediump float;

    uniform vec4 color;

    void main () {
        gl_FragColor = color;
    }
`),_=m(a.FRAGMENT_SHADER,`
    precision highp float;
    precision highp sampler2D;

    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float aspectRatio;

    #define SCALE 25.0

    void main () {
        vec2 uv = floor(vUv * SCALE * vec2(aspectRatio, 1.0));
        float v = mod(uv.x + uv.y, 2.0);
        v = v * 0.1 + 0.8;
        gl_FragColor = vec4(vec3(v), 1.0);
    }
`),E=`
    precision highp float;
    precision highp sampler2D;

    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uTexture;
    uniform sampler2D uBloom;
    uniform sampler2D uSunrays;
    uniform sampler2D uDithering;
    uniform vec2 ditherScale;
    uniform vec2 texelSize;

    vec3 linearToGamma (vec3 color) {
        color = max(color, vec3(0));
        return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));
    }

    void main () {
        vec3 c = texture2D(uTexture, vUv).rgb;

    #ifdef SHADING
        vec3 lc = texture2D(uTexture, vL).rgb;
        vec3 rc = texture2D(uTexture, vR).rgb;
        vec3 tc = texture2D(uTexture, vT).rgb;
        vec3 bc = texture2D(uTexture, vB).rgb;

        float dx = length(rc) - length(lc);
        float dy = length(tc) - length(bc);

        vec3 n = normalize(vec3(dx, dy, length(texelSize)));
        vec3 l = vec3(0.0, 0.0, 1.0);

        float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
        c *= diffuse;
    #endif

    #ifdef BLOOM
        vec3 bloom = texture2D(uBloom, vUv).rgb;
    #endif

    #ifdef SUNRAYS
        float sunrays = texture2D(uSunrays, vUv).r;
        c *= sunrays;
    #ifdef BLOOM
        bloom *= sunrays;
    #endif
    #endif

    #ifdef BLOOM
        float noise = texture2D(uDithering, vUv * ditherScale).r;
        noise = noise * 2.0 - 1.0;
        bloom += noise / 255.0;
        bloom = linearToGamma(bloom);
        c += bloom;
    #endif

        float a = max(c.r, max(c.g, c.b));
        gl_FragColor = vec4(c, a);
    }
`,D=m(a.FRAGMENT_SHADER,`
    precision mediump float;
    precision mediump sampler2D;

    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform vec3 curve;
    uniform float threshold;

    void main () {
        vec3 c = texture2D(uTexture, vUv).rgb;
        float br = max(c.r, max(c.g, c.b));
        float rq = clamp(br - curve.x, 0.0, curve.y);
        rq = curve.z * rq * rq;
        c *= max(rq, br - threshold) / max(br, 0.0001);
        gl_FragColor = vec4(c, 0.0);
    }
`),P=m(a.FRAGMENT_SHADER,`
    precision mediump float;
    precision mediump sampler2D;

    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uTexture;

    void main () {
        vec4 sum = vec4(0.0);
        sum += texture2D(uTexture, vL);
        sum += texture2D(uTexture, vR);
        sum += texture2D(uTexture, vT);
        sum += texture2D(uTexture, vB);
        sum *= 0.25;
        gl_FragColor = sum;
    }
`),z=m(a.FRAGMENT_SHADER,`
    precision mediump float;
    precision mediump sampler2D;

    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uTexture;
    uniform float intensity;

    void main () {
        vec4 sum = vec4(0.0);
        sum += texture2D(uTexture, vL);
        sum += texture2D(uTexture, vR);
        sum += texture2D(uTexture, vT);
        sum += texture2D(uTexture, vB);
        sum *= 0.25;
        gl_FragColor = sum * intensity;
    }
`),U=m(a.FRAGMENT_SHADER,`
    precision highp float;
    precision highp sampler2D;

    varying vec2 vUv;
    uniform sampler2D uTexture;

    void main () {
        vec4 c = texture2D(uTexture, vUv);
        float br = max(c.r, max(c.g, c.b));
        c.a = 1.0 - min(max(br * 20.0, 0.0), 0.8);
        gl_FragColor = c;
    }
`),w=m(a.FRAGMENT_SHADER,`
    precision highp float;
    precision highp sampler2D;

    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float weight;

    #define ITERATIONS 16

    void main () {
        float Density = 0.3;
        float Decay = 0.95;
        float Exposure = 0.7;

        vec2 coord = vUv;
        vec2 dir = vUv - 0.5;

        dir *= 1.0 / float(ITERATIONS) * Density;
        float illuminationDecay = 1.0;

        float color = texture2D(uTexture, vUv).a;

        for (int i = 0; i < ITERATIONS; i++)
        {
            coord -= dir;
            float col = texture2D(uTexture, coord).a;
            color += col * illuminationDecay * weight;
            illuminationDecay *= Decay;
        }

        gl_FragColor = vec4(color * Exposure, 0.0, 0.0, 1.0);
    }
`),O=m(a.FRAGMENT_SHADER,`
    precision highp float;
    precision highp sampler2D;

    varying vec2 vUv;
    uniform sampler2D uTarget;
    uniform float aspectRatio;
    uniform vec3 color;
    uniform vec2 point;
    uniform float radius;

    void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
    }
`),W=m(a.FRAGMENT_SHADER,`
    precision highp float;
    precision highp sampler2D;

    varying vec2 vUv;
    uniform sampler2D uVelocity;
    uniform sampler2D uSource;
    uniform vec2 texelSize;
    uniform vec2 dyeTexelSize;
    uniform float dt;
    uniform float dissipation;

    vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
        vec2 st = uv / tsize - 0.5;

        vec2 iuv = floor(st);
        vec2 fuv = fract(st);

        vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
        vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
        vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
        vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);

        return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
    }

    void main () {
    #ifdef MANUAL_FILTERING
        vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
        vec4 result = bilerp(uSource, coord, dyeTexelSize);
    #else
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        vec4 result = texture2D(uSource, coord);
    #endif
        float decay = 1.0 + dissipation * dt;
        gl_FragColor = result / decay;
    }`,o.supportLinearFiltering?null:["MANUAL_FILTERING"]),$=m(a.FRAGMENT_SHADER,`
    precision mediump float;
    precision mediump sampler2D;

    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uVelocity;

    void main () {
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;

        vec2 C = texture2D(uVelocity, vUv).xy;
        if (vL.x < 0.0) { L = -C.x; }
        if (vR.x > 1.0) { R = -C.x; }
        if (vT.y > 1.0) { T = -C.y; }
        if (vB.y < 0.0) { B = -C.y; }

        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
    }
`),Q=m(a.FRAGMENT_SHADER,`
    precision mediump float;
    precision mediump sampler2D;

    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uVelocity;

    void main () {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        float vorticity = R - L - T + B;
        gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
    }
`),Y=m(a.FRAGMENT_SHADER,`
    precision highp float;
    precision highp sampler2D;

    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uVelocity;
    uniform sampler2D uCurl;
    uniform float curl;
    uniform float dt;

    void main () {
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;

        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        force.y *= -1.0;

        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity += force * dt;
        velocity = min(max(velocity, -1000.0), 1000.0);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
    }
`),j=m(a.FRAGMENT_SHADER,`
    precision mediump float;
    precision mediump sampler2D;

    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uPressure;
    uniform sampler2D uDivergence;

    void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float C = texture2D(uPressure, vUv).x;
        float divergence = texture2D(uDivergence, vUv).x;
        float pressure = (L + R + B + T - divergence) * 0.25;
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
    }
`),se=m(a.FRAGMENT_SHADER,`
    precision mediump float;
    precision mediump sampler2D;

    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uPressure;
    uniform sampler2D uVelocity;

    void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity.xy -= vec2(R - L, T - B);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
    }
`),ae=(a.bindBuffer(a.ARRAY_BUFFER,a.createBuffer()),a.bufferData(a.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),a.STATIC_DRAW),a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,a.createBuffer()),a.bufferData(a.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),a.STATIC_DRAW),a.vertexAttribPointer(0,2,a.FLOAT,!1,0,0),a.enableVertexAttribArray(0),(L,K=!1)=>{L==null?(a.viewport(0,0,a.drawingBufferWidth,a.drawingBufferHeight),a.bindFramebuffer(a.FRAMEBUFFER,null)):(a.viewport(0,0,L.width,L.height),a.bindFramebuffer(a.FRAMEBUFFER,L.fbo)),K&&(a.clearColor(0,0,0,1),a.clear(a.COLOR_BUFFER_BIT)),a.drawElements(a.TRIANGLES,6,a.UNSIGNED_SHORT,0)});function Me(){let L=a.checkFramebufferStatus(a.FRAMEBUFFER);L!=a.FRAMEBUFFER_COMPLETE&&console.trace("Framebuffer error: "+L)}let Ue,_e,Je,J,te,Se,De=[],ye,Ve,Tt=null,Be=new p(A,S),Qe=new p(M,b),nt=new p(M,T),qe=new p(M,C),ut=new p(M,_),vt=new p(M,D),Ct=new p(M,P),ot=new p(M,z),yt=new p(M,U),B=new p(M,w),Ze=new p(M,O),He=new p(M,W),R=new p(M,$),v=new p(M,Q),G=new p(M,Y),X=new p(M,j),Z=new p(M,se),le=new u(M,E);function ue(){let L=Kn(t.SIM_RESOLUTION),K=Kn(t.DYE_RESOLUTION),q=o.halfFloatTexType,x=o.formatRGBA,I=o.formatRG,H=o.formatR,N=o.supportLinearFiltering?a.LINEAR:a.NEAREST;a.disable(a.BLEND),Ue==null?Ue=Ee(K.width,K.height,x.internalFormat,x.format,q,N):Ue=de(Ue,K.width,K.height,x.internalFormat,x.format,q,N),_e==null?_e=Ee(L.width,L.height,I.internalFormat,I.format,q,N):_e=de(_e,L.width,L.height,I.internalFormat,I.format,q,N),Je=ce(L.width,L.height,H.internalFormat,H.format,q,a.NEAREST),J=ce(L.width,L.height,H.internalFormat,H.format,q,a.NEAREST),te=Ee(L.width,L.height,H.internalFormat,H.format,q,a.NEAREST),ee(),ie()}function ee(){let L=Kn(t.BLOOM_RESOLUTION),K=o.halfFloatTexType,q=o.formatRGBA,x=o.supportLinearFiltering?a.LINEAR:a.NEAREST;Se=ce(L.width,L.height,q.internalFormat,q.format,K,x),De.length=0;for(let I=0;I<t.BLOOM_ITERATIONS;I++){let H=L.width>>I+1,N=L.height>>I+1;if(H<2||N<2)break;let k=ce(H,N,q.internalFormat,q.format,K,x);De.push(k)}}function ie(){let L=Kn(t.SUNRAYS_RESOLUTION),K=o.halfFloatTexType,q=o.formatR,x=o.supportLinearFiltering?a.LINEAR:a.NEAREST;ye=ce(L.width,L.height,q.internalFormat,q.format,K,x),Ve=ce(L.width,L.height,q.internalFormat,q.format,K,x)}function ce(L,K,q,x,I,H){a.activeTexture(a.TEXTURE0);let N=a.createTexture();a.bindTexture(a.TEXTURE_2D,N),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,H),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,H),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE),a.texImage2D(a.TEXTURE_2D,0,q,L,K,0,x,I,null);let k=a.createFramebuffer();a.bindFramebuffer(a.FRAMEBUFFER,k),a.framebufferTexture2D(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0,a.TEXTURE_2D,N,0),a.viewport(0,0,L,K),a.clear(a.COLOR_BUFFER_BIT);let oe=1/L,ge=1/K;return{texture:N,fbo:k,width:L,height:K,texelSizeX:oe,texelSizeY:ge,attach(he){return a.activeTexture(a.TEXTURE0+he),a.bindTexture(a.TEXTURE_2D,N),he}}}function Ee(L,K,q,x,I,H){let N=ce(L,K,q,x,I,H),k=ce(L,K,q,x,I,H);return{width:L,height:K,texelSizeX:N.texelSizeX,texelSizeY:N.texelSizeY,get read(){return N},set read(oe){N=oe},get write(){return k},set write(oe){k=oe},swap(){let oe=N;N=k,k=oe}}}function me(L,K,q,x,I,H,N){let k=ce(K,q,x,I,H,N);return Qe.bind(),a.uniform1i(Qe.uniforms.uTexture,L.attach(0)),ae(k),k}function de(L,K,q,x,I,H,N){return L.width==K&&L.height==q||(L.read=me(L.read,K,q,x,I,H,N),L.write=ce(K,q,x,I,H,N),L.width=K,L.height=q,L.texelSizeX=1/K,L.texelSizeY=1/q),L}function Ie(L){let K=a.createTexture();a.bindTexture(a.TEXTURE_2D,K),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.REPEAT),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.REPEAT),a.texImage2D(a.TEXTURE_2D,0,a.RGB,1,1,0,a.RGB,a.UNSIGNED_BYTE,new Uint8Array([255,255,255]));let q={texture:K,width:1,height:1,attach(I){return a.activeTexture(a.TEXTURE0+I),a.bindTexture(a.TEXTURE_2D,K),I}},x=new Image;return x.onload=()=>{q.width=x.width,q.height=x.height,a.bindTexture(a.TEXTURE_2D,K),a.texImage2D(a.TEXTURE_2D,0,a.RGB,a.RGB,a.UNSIGNED_BYTE,x)},x.src=L,q}function Le(){let L=[];t.SHADING&&L.push("SHADING"),t.BLOOM&&L.push("BLOOM"),t.SUNRAYS&&L.push("SUNRAYS"),le.setKeywords(L)}Le(),ue();let ze=Date.now(),F=0;function fe(){let L=or(i.clientWidth),K=or(i.clientHeight);return i.width!=L||i.height!=K?(i.width=L,i.height=K,!0):!1}function ne(L){t.COLORFUL&&(F+=L*t.COLOR_UPDATE_SPEED,F>=1&&(F=da(F,0,1),s.forEach(K=>{K.color=as()})))}function pe(){r.length>0&&kl(r.pop()),s.forEach(L=>{L.moved&&(L.moved=!1,zl(L))})}function ve(L){a.disable(a.BLEND),v.bind(),a.uniform2f(v.uniforms.texelSize,_e.texelSizeX,_e.texelSizeY),a.uniform1i(v.uniforms.uVelocity,_e.read.attach(0)),ae(J),G.bind(),a.uniform2f(G.uniforms.texelSize,_e.texelSizeX,_e.texelSizeY),a.uniform1i(G.uniforms.uVelocity,_e.read.attach(0)),a.uniform1i(G.uniforms.uCurl,J.attach(1)),a.uniform1f(G.uniforms.curl,t.CURL),a.uniform1f(G.uniforms.dt,L),ae(_e.write),_e.swap(),R.bind(),a.uniform2f(R.uniforms.texelSize,_e.texelSizeX,_e.texelSizeY),a.uniform1i(R.uniforms.uVelocity,_e.read.attach(0)),ae(Je),nt.bind(),a.uniform1i(nt.uniforms.uTexture,te.read.attach(0)),a.uniform1f(nt.uniforms.value,t.PRESSURE),ae(te.write),te.swap(),X.bind(),a.uniform2f(X.uniforms.texelSize,_e.texelSizeX,_e.texelSizeY),a.uniform1i(X.uniforms.uDivergence,Je.attach(0));for(let q=0;q<t.PRESSURE_ITERATIONS;q++)a.uniform1i(X.uniforms.uPressure,te.read.attach(1)),ae(te.write),te.swap();Z.bind(),a.uniform2f(Z.uniforms.texelSize,_e.texelSizeX,_e.texelSizeY),a.uniform1i(Z.uniforms.uPressure,te.read.attach(0)),a.uniform1i(Z.uniforms.uVelocity,_e.read.attach(1)),ae(_e.write),_e.swap(),He.bind(),a.uniform2f(He.uniforms.texelSize,_e.texelSizeX,_e.texelSizeY),o.supportLinearFiltering||a.uniform2f(He.uniforms.dyeTexelSize,_e.texelSizeX,_e.texelSizeY);let K=_e.read.attach(0);a.uniform1i(He.uniforms.uVelocity,K),a.uniform1i(He.uniforms.uSource,K),a.uniform1f(He.uniforms.dt,L),a.uniform1f(He.uniforms.dissipation,t.VELOCITY_DISSIPATION),ae(_e.write),_e.swap(),o.supportLinearFiltering||a.uniform2f(He.uniforms.dyeTexelSize,Ue.texelSizeX,Ue.texelSizeY),a.uniform1i(He.uniforms.uVelocity,_e.read.attach(0)),a.uniform1i(He.uniforms.uSource,Ue.read.attach(1)),a.uniform1f(He.uniforms.dissipation,t.DENSITY_DISSIPATION),ae(Ue.write),Ue.swap()}function re(L){t.BLOOM&&tt(Ue.read,Se),t.SUNRAYS&&(cn(Ue.read,Ue.write,ye),mn(ye,Ve,1)),L==null||!t.TRANSPARENT?(a.blendFunc(a.ONE,a.ONE_MINUS_SRC_ALPHA),a.enable(a.BLEND)):a.disable(a.BLEND),t.TRANSPARENT||Pe(L,os(t.BACK_COLOR)),L==null&&t.TRANSPARENT&&(a.bindFramebuffer(a.FRAMEBUFFER,null),a.viewport(0,0,a.drawingBufferWidth,a.drawingBufferHeight),a.clearColor(0,0,0,0),a.clear(a.COLOR_BUFFER_BIT)),lt(L)}function Pe(L,K){qe.bind(),a.uniform4f(qe.uniforms.color,K.r,K.g,K.b,1),ae(L)}function Ae(L){ut.bind(),a.uniform1f(ut.uniforms.aspectRatio,i.width/i.height),ae(L)}function lt(L){let K=L==null?a.drawingBufferWidth:L.width,q=L==null?a.drawingBufferHeight:L.height;if(le.bind(),t.SHADING&&a.uniform2f(le.uniforms.texelSize,1/K,1/q),a.uniform1i(le.uniforms.uTexture,Ue.read.attach(0)),t.BLOOM){a.uniform1i(le.uniforms.uBloom,Se.attach(1)),a.uniform1i(le.uniforms.uDithering,Tt.attach(2));let x=fa(Tt,K,q);a.uniform2f(le.uniforms.ditherScale,x.x,x.y)}t.SUNRAYS&&a.uniform1i(le.uniforms.uSunrays,ye.attach(3)),ae(L)}function tt(L,K){if(De.length<2)return;let q=K;a.disable(a.BLEND),vt.bind();let x=t.BLOOM_THRESHOLD*t.BLOOM_SOFT_KNEE+1e-4,I=t.BLOOM_THRESHOLD-x,H=x*2,N=.25/x;a.uniform3f(vt.uniforms.curve,I,H,N),a.uniform1f(vt.uniforms.threshold,t.BLOOM_THRESHOLD),a.uniform1i(vt.uniforms.uTexture,L.attach(0)),ae(q),Ct.bind();for(let k=0;k<De.length;k++){let oe=De[k];a.uniform2f(Ct.uniforms.texelSize,q.texelSizeX,q.texelSizeY),a.uniform1i(Ct.uniforms.uTexture,q.attach(0)),ae(oe),q=oe}a.blendFunc(a.ONE,a.ONE),a.enable(a.BLEND);for(let k=De.length-2;k>=0;k--){let oe=De[k];a.uniform2f(Ct.uniforms.texelSize,q.texelSizeX,q.texelSizeY),a.uniform1i(Ct.uniforms.uTexture,q.attach(0)),a.viewport(0,0,oe.width,oe.height),ae(oe),q=oe}a.disable(a.BLEND),ot.bind(),a.uniform2f(ot.uniforms.texelSize,q.texelSizeX,q.texelSizeY),a.uniform1i(ot.uniforms.uTexture,q.attach(0)),a.uniform1f(ot.uniforms.intensity,t.BLOOM_INTENSITY),ae(K)}function cn(L,K,q){a.disable(a.BLEND),yt.bind(),a.uniform1i(yt.uniforms.uTexture,L.attach(0)),ae(K),B.bind(),a.uniform1f(B.uniforms.weight,t.SUNRAYS_WEIGHT),a.uniform1i(B.uniforms.uTexture,K.attach(0)),ae(q)}function mn(L,K,q){Be.bind();for(let x=0;x<q;x++)a.uniform2f(Be.uniforms.texelSize,L.texelSizeX,0),a.uniform1i(Be.uniforms.uTexture,L.attach(0)),ae(K),a.uniform2f(Be.uniforms.texelSize,0,L.texelSizeY),a.uniform1i(Be.uniforms.uTexture,K.attach(0)),ae(L)}function zl(L){let K=L.deltaX*t.SPLAT_FORCE,q=L.deltaY*t.SPLAT_FORCE;rr(L.texcoordX,L.texcoordY,K,q,L.color)}function kl(L){for(let K=0;K<L;K++){let q=as();q.r*=10,q.g*=10,q.b*=10;let x=Math.random(),I=Math.random(),H=1e3*(Math.random()-.5),N=1e3*(Math.random()-.5);rr(x,I,H,N,q)}}function rr(L,K,q,x,I){Ze.bind(),a.uniform1i(Ze.uniforms.uTarget,_e.read.attach(0)),a.uniform1f(Ze.uniforms.aspectRatio,i.width/i.height),a.uniform2f(Ze.uniforms.point,L,K),a.uniform3f(Ze.uniforms.color,q,x,0),a.uniform1f(Ze.uniforms.radius,Bi(t.SPLAT_RADIUS/100)),ae(_e.write),_e.swap(),a.uniform1i(Ze.uniforms.uTarget,Ue.read.attach(0)),a.uniform3f(Ze.uniforms.color,I.r,I.g,I.b),ae(Ue.write),Ue.swap()}function Bi(L){let K=i.width/i.height;return K>1&&(L*=K),L}function du(L,K,q,x){L.id=K,L.down=!0,L.moved=!1,L.texcoordX=q/i.width,L.texcoordY=1-x/i.height,L.prevTexcoordX=L.texcoordX,L.prevTexcoordY=L.texcoordY,L.deltaX=0,L.deltaY=0,L.color=as()}function Vl(L,K,q){L.prevTexcoordX=L.texcoordX,L.prevTexcoordY=L.texcoordY,L.texcoordX=K/i.width,L.texcoordY=1-q/i.height,L.deltaX=$n(L.texcoordX-L.prevTexcoordX),L.deltaY=ar(L.texcoordY-L.prevTexcoordY),L.moved=Math.abs(L.deltaX)>0||Math.abs(L.deltaY)>0}function Hl(L){L.down=!1}function $n(L){let K=i.width/i.height;return K<1&&(L*=K),L}function ar(L){let K=i.width/i.height;return K>1&&(L/=K),L}function as(){let L=ua(Math.random(),1,1);return L.r*=.15,L.g*=.15,L.b*=.15,L}function ua(L,K,q){let x,I,H,N,k,oe,ge,he;switch(N=Math.floor(L*6),k=L*6-N,oe=q*(1-K),ge=q*(1-k*K),he=q*(1-(1-k)*K),N%6){case 0:x=q,I=he,H=oe;break;case 1:x=ge,I=q,H=oe;break;case 2:x=oe,I=q,H=he;break;case 3:x=oe,I=ge,H=q;break;case 4:x=he,I=oe,H=q;break;case 5:x=q,I=oe,H=ge;break}return{r:x,g:I,b:H}}function os(L){return{r:L.r/255,g:L.g/255,b:L.b/255}}function da(L,K,q){let x=q-K;return x==0?K:(L-K)%x+K}function Kn(L){let K=a.drawingBufferWidth/a.drawingBufferHeight;K<1&&(K=1/K);let q=Math.round(L),x=Math.round(L*K);return a.drawingBufferWidth>a.drawingBufferHeight?{width:x,height:q}:{width:q,height:x}}function fa(L,K,q){return{x:K/L.width,y:q/L.height}}function or(L){let K=Math.min(window.devicePixelRatio||1,e.maxPixelRatio||2);return Math.floor(L*K)}function Gl(L){if(L.length==0)return 0;let K=0;for(let q=0;q<L.length;q++)K=(K<<5)-K+L.charCodeAt(q),K|=0;return K}let Wl=e.fieldFactory?.({gl:a,Program:p,baseVertexShader:M,compileShader:m,blit:ae,velocity:()=>_e,dye:()=>Ue});return{fields(L,K,q){Wl?.(L,K,q)},tick(L){fe()&&ue(),ve(Math.min(L,.05)),re(null)},seed(L,K,q,x=.8){Ze.bind(),a.uniform1f(Ze.uniforms.aspectRatio,i.width/i.height),a.uniform2f(Ze.uniforms.point,L,K),a.uniform1f(Ze.uniforms.radius,Bi(x/100)),a.uniform1i(Ze.uniforms.uTarget,Ue.read.attach(0)),a.uniform3f(Ze.uniforms.color,q,q*.96,q*.9),ae(Ue.write),Ue.swap()},stir(L,K,q,x,I=1){Ze.bind(),a.uniform1f(Ze.uniforms.aspectRatio,i.width/i.height),a.uniform2f(Ze.uniforms.point,L,K),a.uniform1f(Ze.uniforms.radius,Bi(I/100)),a.uniform1i(Ze.uniforms.uTarget,_e.read.attach(0)),a.uniform3f(Ze.uniforms.color,q,x,0),ae(_e.write),_e.swap()},resolution(){return{width:_e.width,height:_e.height}},dispose(){a.getExtension("WEBGL_lose_context")?.loseContext()}}}function Tl(i){return({gl:e,Program:t,baseVertexShader:n,compileShader:s,blit:r,velocity:a,dye:o})=>{let l=`precision highp float;precision highp sampler2D;
 varying vec2 vUv;uniform sampler2D uTarget;
 uniform float time,dt,aspect,mode,cells,interactionGain;
 uniform vec4 edges,keeper,regions[8],currents[4],winds[4];uniform vec2 span;
 ${i}
 float potential(vec2 q){
  // Most energy belongs to broad, travelling folds. No full-screen fine octave.
  vec2 drift=vec2(.013*sin(time*.083+.5)+.008*cos(time*.19+1.4),.010*cos(time*.061+1.1)+.006*sin(time*.16));
  float psi=drift.x*q.y-drift.y*q.x+.0028*snoise(q*1.35+vec2(sin(time*.071)*.6,time*.037));
  for(int i=0;i<4;i++){
   vec2 d=q-currents[i].xy*vec2(aspect,1.);
   float r=currents[i].z;vec2 v=winds[i].xy;
   vec2 along=vec2(cos(winds[i].w),sin(winds[i].w)),across=vec2(-along.y,along.x);
   // Long passing banks, not circular Gaussian cells with a vortex pair at
   // every perimeter. Different banks still accelerate and turn independently.
   float window=exp(-pow(dot(d,across)/r,2.)-pow(dot(d,along)/(r*2.5),2.));
   psi+=window*(v.x*d.y-v.y*d.x);
   // A little folding only in active patches, much lower derivative energy
   // than the transport term. Radius, clock and strength are independent.
   psi+=.0008*currents[i].w*window*snoise(q*5.2+vec2(winds[i].z,time*.14+winds[i].z));
  }
  return psi;
 }
 float strip(float y){return exp(-pow((vUv.y-y)/.064,2.))*smoothstep(span.x-.07,span.x+.04,vUv.x)*(1.-smoothstep(span.y-.04,span.y+.07,vUv.x));}
 void main(){
  vec2 q=vec2(vUv.x*aspect,vUv.y);vec3 old=texture2D(uTarget,vUv).rgb;
  if(mode<.5){
   float e=.004;vec2 target=vec2(potential(q+vec2(0,e))-potential(q-vec2(0,e)),-potential(q+vec2(e,0))+potential(q-vec2(e,0)))/(2.*e)*cells;
   // Broad currents have a finite response time; they do not instantly replace
   // motion left by the sheet or keeper. Ordinary flow stays below the guard.
   vec2 v=old.xy+dt*(target*1.45-old.xy*.16);
   float sheet=strip(edges.x)*edges.y+strip(edges.z)*edges.w;
   v+=dt*interactionGain*5.8*vec2(0.,sheet)*cells;
   vec2 d=(vUv-keeper.xy)*vec2(aspect,1.);float wake=exp(-dot(d,d)/.019);
   v+=dt*interactionGain*4.6*wake*keeper.zw*cells;
   float speed=length(v),limit=cells*.27;
   v*=min(1.,limit/max(speed,.0001));
   gl_FragColor=vec4(v,0.,1.);
  }else{
   // Broad, staggered births/decay; no stamping of the velocity noise into dye.
   vec2 drift=vec2(time*.025,7.3-time*.016);
   float n=.5+.5*(.57*snoise(q*3.1+drift)+.29*snoise(q*7.4+drift*1.37)+.14*snoise(q*15.3-drift*.71));
   float veil=smoothstep(.23,.76,n);
   float border=max(smoothstep(.19,.45,abs(vUv.x-.5)),smoothstep(.25,.47,abs(vUv.y-.5))),local=0.;
   for(int i=0;i<8;i++){vec2 d=(vUv-regions[i].xy)*vec2(aspect,1.);local+=regions[i].w*exp(-dot(d,d)/(regions[i].z*regions[i].z));}
   float source=(.02+.10*veil)*border+local*(.12+1.28*veil*veil);
   // Lower replenishment lets advected openings and wakes remain readable.
   vec3 c=clamp(old+dt*(source*vec3(.86,.90,.88)*.24-old*.055),vec3(0.),vec3(.78));
   gl_FragColor=vec4(c,1.);
  }
 }`,c=new t(n,s(e.FRAGMENT_SHADER,l));return(h,d,u)=>{c.bind();let p=c.uniforms;e.uniform1f(p.time,h),e.uniform1f(p.dt,d),e.uniform1f(p.aspect,e.canvas.width/e.canvas.height),e.uniform4fv(p.edges,u.edges),e.uniform4fv(p.keeper,u.keeper),e.uniform4fv(p["regions[0]"],u.regions),e.uniform4fv(p["currents[0]"],u.currents),e.uniform4fv(p["winds[0]"],u.winds),e.uniform2fv(p.span,u.span),e.uniform1f(p.cells,a().height),e.uniform1f(p.interactionGain,u.interactionGain);for(let[g,y]of[[0,a()],[1,o()]])e.uniform1f(p.mode,g),e.uniform1i(p.uTarget,y.read.attach(0)),r(y.write),y.swap()}}}var wl=(i,e,t)=>Math.max(e,Math.min(t,i)),El=i=>({x:(i.x+.3)/1.6,y:(i.y+.15)/1.3}),Al=i=>i&&Number.isFinite(i.x)&&Number.isFinite(i.y),Ln=1/30,Rl=class{constructor(e,{interactionGain:t=1}={}){this.canvas=e,this.enabled=!0,this.time=0,this.pending=0,this.frames=0,this.previous=null,this.interactionEnergy=0,this.randomState=87775857,this.drive=[0,0,0,0],this.interactionGain=t,this.clouds=Array.from({length:8},()=>this.cloud(!0)),this.patches=Array.from({length:4},(n,s)=>this.patch(s,!0))}random(){return this.randomState=Math.imul(this.randomState,1664525)+1013904223>>>0,this.randomState/4294967296}cloud(e=!1){let t=13+this.random()*19;return{x:.08+this.random()*.84,y:.03+this.random()*.94,r:.16+this.random()*.19,amplitude:.38+this.random()*.43,phase:this.random()*6.28,birth:e?-this.random()*t:this.time,life:t}}patch(e,t=!1){let n=17+this.random()*18;return{i:e,x:(e%2?.72:.28)+(this.random()-.5)*.12,y:(e<2?.26:.74)+(this.random()-.5)*.14,r:.23+this.random()*.18,speed:.025+this.random()*.035,angle:this.random()*6.28,phase:this.random()*6.28,rate:.34+this.random()*.32,birth:t?-this.random()*n:this.time,life:n}}fields(){this.clouds=this.clouds.map(s=>this.time-s.birth>=s.life?this.cloud():s),this.patches=this.patches.map(s=>this.time-s.birth>=s.life?this.patch(s.i):s);let e=[],t=[],n=[];for(let s of this.clouds){let r=wl((this.time-s.birth)/s.life,0,1),a=Math.sin(Math.PI*r)**2;e.push(s.x+.045*Math.sin(this.time*.11+s.phase),s.y+.035*Math.cos(this.time*.15+s.phase),s.r*(.85+.3*r),s.amplitude*a)}for(let s of this.patches){let r=wl((this.time-s.birth)/s.life,0,1),a=Math.sin(Math.PI*r)**2,o=.82+.47*Math.sin(this.time*s.rate+s.phase)+.22*Math.sin(this.time*s.rate*1.73+s.phase*2.1),l=s.angle+.5*Math.sin(this.time*.13+s.phase),c=s.speed*a*o;t.push(s.x+.07*Math.sin(this.time*.085+s.phase),s.y+.05*Math.cos(this.time*.12+s.phase),s.r,a*o),n.push(Math.cos(l)*c,Math.sin(l)*c,s.phase,l)}return this.currentWinds=n,{regions:e,currents:t,winds:n}}async prepare(){let e=await fetch(new URL("../chapter-scroll-v17/vendor/noise2D.glsl",import.meta.url));if(!e.ok)throw Error("Atmosphere noise source unavailable");this.fluid=bl(this.canvas,{simResolution:96,dyeResolution:512,maxPixelRatio:1.5,densityDissipation:.22,curl:.38,fieldFactory:Tl(await e.text())});for(let[t,n,s]of[[.18,.32,.55],[.83,.68,.6],[.3,.79,.34],[.65,.2,.3]])this.fluid.seed(t,n,s,3);for(let t=0;t<60;t++)this.time+=Ln,this.fluid.fields(this.time,Ln,{edges:[-2,0,-2,0],keeper:[-2,-2,0,0],span:[0,1],...this.fields(),interactionGain:this.interactionGain}),this.fluid.tick(Ln),t%6===5&&await new Promise(requestAnimationFrame);this.resetMotion()}tick(e,t,n,s,r,a){if(!this.fluid||!this.enabled)return;this.pending+=wl(Number.isFinite(r)?r:e,0,.1);let o=Math.min(3,Math.floor((this.pending+1e-7)/Ln));if(!o)return;if(!Al(a?.top?.[0])||!Al(a?.top?.[1])||!Al(a?.bottom?.[0])){this.resetMotion();return}let l=El(a.top[0]),c=El(a.bottom[0]),h=El(a.top[1]),d=Al(a.keeper)?El(a.keeper):null;d&&(d.x<.02||d.x>.98||d.y<.02||d.y>.98)&&(d=null);let u=o*Ln,p=a.paperProgress,g=this.previous&&Math.abs(t-this.previous.progress)<.12&&Math.abs(s-this.previous.viewHeight)<.001,y=g&&p>.015&&p<.999,m=[y?(l.y-this.previous.top)/u:0,y?(c.y-this.previous.bottom)/u:0,d&&g&&this.previous.keeper?(d.x-this.previous.keeper.x)/u:0,d&&g&&this.previous.keeper?(d.y-this.previous.keeper.y)/u:0];for(let f=0;f<o;f++){this.time+=Ln,this.pending-=Ln;let M=1-Math.exp(-Ln/.065);this.drive=this.drive.map((A,S)=>A+(wl(Number.isFinite(m[S])?m[S]:0,-.32,.32)-A)*M),this.fluid.fields(this.time,Ln,{edges:[l.y,this.drive[0],c.y,this.drive[1]],span:[l.x,h.x],keeper:d?[d.x,d.y,this.drive[2],this.drive[3]]:[-2,-2,0,0],...this.fields(),interactionGain:this.interactionGain}),this.interactionEnergy+=this.drive.reduce((A,S)=>A+Math.abs(S),0)*Ln,this.fluid.tick(Ln),this.frames++}this.previous={top:l.y,bottom:c.y,keeper:d,progress:t,viewHeight:s}}resetMotion(){this.previous=null,this.pending=0,this.drive=[0,0,0,0]}setEnabled(e){this.enabled=!!e,this.canvas.hidden=!e,this.resetMotion()}snapshot(){return{available:!!this.fluid,enabled:this.enabled,frames:this.frames,time:this.time,interactionEnergy:this.interactionEnergy,drive:[...this.drive],model:"advected mist with broad regional currents, staggered gusts and bounded object wakes",simulationHz:30,fixedDirectionalInlet:!1,regionalVelocities:this.currentWinds?.filter((e,t)=>t%4<2),confinement:.38}}dispose(){this.fluid?.dispose()}};var Cl=class extends Rl{constructor(e,{signal:t}={}){super(e),this.controller=new AbortController,this.signal=t?AbortSignal.any([t,this.controller.signal]):this.controller.signal}check(){if(this.signal.aborted)throw new DOMException("Atmosphere preparation cancelled","AbortError")}frame(){return new Promise((e,t)=>{this.check();let n,s=()=>{cancelAnimationFrame(n),t(new DOMException("Atmosphere preparation cancelled","AbortError"))};this.signal.addEventListener("abort",s,{once:!0}),n=requestAnimationFrame(()=>{this.signal.removeEventListener("abort",s),e()})})}async prepare(){let e=await fetch(new URL("../chapter-scroll-v17/vendor/noise2D.glsl",import.meta.url),{signal:this.signal});if(!e.ok)throw Error("Atmosphere noise source unavailable");let t=await e.text();this.check(),this.fluid=bl(this.canvas,{simResolution:96,dyeResolution:512,maxPixelRatio:1.5,densityDissipation:.22,curl:.38,fieldFactory:Tl(t)});for(let[s,r,a]of[[.18,.32,.55],[.83,.68,.6],[.3,.79,.34],[.65,.2,.3]])this.fluid.seed(s,r,a,3);let n=1/30;for(let s=0;s<60;s++)this.check(),this.time+=n,this.fluid.fields(this.time,n,{edges:[-2,0,-2,0],keeper:[-2,-2,0,0],span:[0,1],...this.fields(),interactionGain:this.interactionGain}),this.fluid.tick(n),s%6===5&&await this.frame();this.check(),this.resetMotion()}dispose(){this.controller.abort(),super.dispose()}};var Il=class{constructor(e,t,n){this.from=e,this.to=t,this.duration=Math.max(280,Math.abs(t-e)*5600),this.elapsed=0,this.previous=n}sample(e){this.elapsed+=Math.max(0,Math.min(50,e-this.previous)),this.previous=e;let t=Math.min(1,this.elapsed/this.duration),n=t*t*(3-2*t);return{progress:this.from+(this.to-this.from)*n,done:t===1}}resume(e){this.previous=e}};var Af=Object.freeze({id:"manuscript-memento-v14",width:4.5,height:6.3,coreRadius:.145,layerThickness:.035,fontFamily:"Aboensis",fontUrl:"../chapter-scroll/assets/Aboensis-Regular.otf",skin:"assets/parchment.webp",reverse:"assets/parchment.webp",keeper:"assets/unused-keeper.png",paperNormal:"assets/parchment-normal.jpg",paperRoughness:"assets/parchment-roughness.jpg",environment:"../chapter-scroll-v3/assets/studio.hdr",ornament:"../chapter-scroll-v13/assets/leaf-and-letter.png",ornamentDigest:"e5aa04af52dde8cc3f32d0d9dfac3fe1696ef6d275c0514d7e0c0065f517d9c5",planDigest:"3104ec4b67859f64268c11a327f37a65d1bdfc48c6f75adc24ee702d3f6318fb",ink:"#30251b",rubric:"#58372d"});function ia(i){if(i!==Af.id)throw Error("Unknown scroll series");return Af}function Rf(i){let e={...ia(i)};for(let t of["fontUrl","skin","reverse","keeper","paperNormal","paperRoughness","environment","ornament"])e[t]=new URL(e[t],new URL("../chapter-scroll-v14/",import.meta.url)).href;return e}var Cf=Object.freeze({id:"manuscript-memento-v12",width:4.5,height:6.3,coreRadius:.145,layerThickness:.035,fontFamily:"Aboensis",fontUrl:"../chapter-scroll/assets/Aboensis-Regular.otf",skin:"../chapter-scroll-v6/assets/charter.webp",reverse:"../chapter-scroll-v6/assets/charter.webp",keeper:"../chapter-scroll-v4/assets/keeper.webp",environment:"../chapter-scroll-v3/assets/studio.hdr",ornament:"assets/river-margin.png",ornamentDigest:"94462f7c5a469568ee4f68ac9c3de418ab7645832cbd81006f6b34619acca3d1",ink:"#30251b",rubric:"#58372d"});function sa(i){if(i!==Cf.id)throw Error("Unknown scroll series");return Cf}var tu={};Xl(tu,{DOCUMENT_HEIGHT:()=>Of,DOCUMENT_WIDTH:()=>Ff,createDocument:()=>xv,documentLines:()=>Bf,loadImage:()=>sr,populateTranscript:()=>gv,prepareSeal:()=>tr});var Dn=Object.freeze({id:"second-language-owner",displayName:"Gual Wells"});function ra(i){let e=[[1e3,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];if(i>3999)return String(i);let t="";for(let[n,s]of e)for(;i>=n;)t+=s,i-=n;return t}function If(i){if(typeof i!="string"||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(Z|[+-]\d{2}:\d{2})$/.test(i))return!1;let e=i.slice(23),t=e==="Z"?0:Number(e.slice(1,3)),n=e==="Z"?0:Number(e.slice(4,6));if(t>14||n>59||t===14&&n!==0)return!1;let s=Date.parse(i),r=e==="Z"?0:(e[0]==="+"?1:-1)*(t*60+n);return Number.isFinite(s)&&new Date(s+r*6e4).toISOString().slice(0,23)===i.slice(0,23)}function aa(i){if(!i||!["specimen","issued"].includes(i.status)||!i.chapterId||!Number.isSafeInteger(i.chapterNumber)||i.chapterNumber<1||!i.displayTitle?.trim()||!/^[a-f0-9]{64}$/.test(i.chapterDigest))throw Error("Invalid charter identity");if(i.status==="specimen"){if(i.attestation!==null||!If(i.proof?.sampleTime))throw Error("Proof requires a separate sample timestamp and no attestation")}else{let e=i.attestation;if(i.proof||!e||!e.id||!e.attemptId||!e.assessmentVersion||e.allCorrect!==!0||!If(e.passedAt)||e.recipientId!==Dn.id||typeof e.recipientName!="string"||!e.recipientName.trim()||e.recipientName.length>120)throw Error("Issued charter requires the immutable passing event and recipient snapshot")}return i}function Pl(i){if(aa(i),!/^[a-f0-9]{64}$/.test(i.artifactDigest))throw Error("Prepare the charter before rendering its digest");let e=new Date(i.attestation?.passedAt??i.proof.sampleTime),t=Object.fromEntries(new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Shanghai",year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"}).formatToParts(e).map(n=>[n.type,n.value]));return[i.artifactDigest.slice(0,16).toUpperCase().match(/.{4}/g).join(" "),`${t.day} ${t.month} ${t.year}`,`${t.hour}:${t.minute}:${t.second}.${String(e.getUTCMilliseconds()).padStart(3,"0")}  +08:00`]}var pv="SL-MEMENTO-12";function Zh(i){if(aa(i),sa(i.template),!["oblong","round"].includes(i.sealVariant))throw Error("Unknown impression variant");return i}function oa(i){Zh(i);let e=i.status==="issued"?i.attestation.recipientName:Dn.displayName,t=`Chapter ${ra(i.chapterNumber)}`;return{institution:"The Second Language",chapter:t,title:i.displayTitle,recipient:e,paragraphs:["Upon the map, a river lies in ink.","Beyond the ink, rain gathers, roots hold, and the water finds its course."],colophon:`For ${e}, in remembrance of ${t} and its trial successfully completed.`,sealLegends:i.sealVariant==="round"?["The Second Language","SL","In remembrance"]:["The Second Language","In remembrance"],note:i.status==="issued"?"":"Specimen \u2014 Not issued",presentation:i.status==="issued"?"issued":"dated-art-proof",issued:i.status==="issued"}}function mv(i){let e=oa(i),t=i.attestation,n=sa(i.template);return JSON.stringify(["second-language.memento.v2",i.status,i.chapterId,i.chapterNumber,i.chapterDigest,i.displayTitle,Dn.id,e.recipient,t?.id??null,t?.attemptId??null,t?.assessmentVersion??null,t?.allCorrect??null,new Date(t?.passedAt??i.proof.sampleTime).toISOString(),pv,i.template,n.ornamentDigest,i.sealVariant,e.institution,e.chapter,e.title,e.paragraphs,e.colophon,e.sealLegends,e.note])}async function Pf(i){Zh(i);let e=mv(i),t=new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(e))),n=[...t].map(s=>s.toString(16).padStart(2,"0")).join("");return{...i,artifactDigest:n,canonicalPayload:e,recipient:oa(i).recipient}}function jh(i){return Zh(i),Pl(i)}var Qh=(i,e=0,t=1)=>Math.max(e,Math.min(t,i));function Ll(i,e,t=0){let n=Math.imul(i,374761393)^Math.imul(e,668265263)^t;return n=Math.imul(n^n>>>13,1274126177),((n^n>>>16)>>>0)/4294967295}function Dl(i,e,t=0){let n=Math.floor(i),s=Math.floor(e),r=i-n,a=e-s,o=r*r*(3-2*r),l=a*a*(3-2*a),c=(h,d,u)=>h+(d-h)*u;return c(c(Ll(n,s,t),Ll(n+1,s,t),o),c(Ll(n,s+1,t),Ll(n+1,s+1,t),o),l)}var Jh=(i,e,t,n,s,r)=>Math.exp(-(((i-t)/s)**2+((e-n)/r)**2));function eu(i,e){let{width:t,height:n}=i,s=i.getContext("2d",{willReadFrequently:!0}),r=s.getImageData(0,0,t,n),a=document.createElement("canvas");a.width=t,a.height=n;let o=a.getContext("2d"),l=o.createImageData(t,n),c=t/2-384,h=0,d=0,u=0;for(let p=0;p<n;p++)for(let g=0;g<t;g++){let y=(p*t+g)*4,m=r.data[y+3]/255,f=.96+.12*(Dl(g/100,p/100,e)-.5),M=Dl(g/3.5,p/3.5,e^8127),A=Jh(g-c,p-c,551,436,24,61)*.63+Jh(g-c,p-c,111,180,29,47)*.35+Jh(g-c,p-c,464,722,31,12)*.32,S=Qh(f+.06*(M-.5)-A,.14,1);Dl(g/2,p/2,e^451)>.8&&M>.64&&(S*=.12);let T=.5+.5*Dl(g/49,p/49,e^713),C=Qh(m*S);l.data[y]=Math.round(14+T*10),l.data[y+1]=Math.round(9+T*7),l.data[y+2]=Math.round(6+T*4),l.data[y+3]=Math.round(C*255),m>.4&&(u++,S<.5&&h++,S<.72&&d++)}return o.putImageData(l,0,0),{ink:a,stats:{markedPixels:u,lowContactPixels:h,variableContactPixels:d}}}function Lf(i,e){let t=new Uint8ClampedArray(i.data),n=i.width,s=i.height;for(let r=0;r<s;r++)for(let a=0;a<n;a++){let o=(r*n+a)*4,l=e.data[o+3]/255;if(!l)continue;let c=(Math.min(s-1,r+2)*n+Math.min(n-1,a+2))*4,h=(i.data[o]+i.data[o+1]+i.data[o+2])/3,d=(i.data[c]+i.data[c+1]+i.data[c+2])/3,u=Qh(.98+(h-d)*.004,.77,1.04),p=l*u;for(let g=0;g<3;g++)t[o+g]=Math.round(i.data[o+g]*(1-p*(1-e.data[o+g]/255)))}return new ImageData(t,n,s)}var Fi="SL-KEEPSAKE-1",Df=896,rs=(i=Df,e=Df)=>Object.assign(document.createElement("canvas"),{width:i,height:e}),Nl;async function tr(){let i=new Image;i.src=new URL("../chapter-scroll-v10/assets/ink-shoulder.png",import.meta.url).href,await i.decode(),Nl=rs(256,480);let e=Nl.getContext("2d",{willReadFrequently:!0});e.drawImage(i,i.width*.28,i.height*.07,i.width*.45,i.height*.84,0,0,256,480);let t=e.getImageData(0,0,256,480);for(let n=0;n<t.data.length;n+=4)t.data[n+3]*=1-(t.data[n]+t.data[n+1]+t.data[n+2])/765,t.data[n]=t.data[n+1]=t.data[n+2]=255;e.putImageData(t,0,0)}function Nf(i,e,t,n,s,r){i.font=`${r}px Aboensis`,i.textAlign="center";let a=[...e],o=a.map(c=>i.measureText(c).width),l=-o.reduce((c,h)=>c+h,0)/2;for(let c=0;c<a.length;c++){let h=n+(s?-1:1)*(l+o[c]/2)/t;i.save(),i.translate(448+Math.cos(h)*t,448+Math.sin(h)*t),i.rotate(h+(s?-Math.PI/2:Math.PI/2)),i.fillText(a[c],0,0),i.restore(),l+=o[c]}}function nr(i,e="oblong"){if(!Nl)throw Error("Ink texture not ready");let t=rs(),n=t.getContext("2d");n.fillStyle=n.strokeStyle="white",n.textAlign="center",n.lineCap="round";let s;if(e==="oblong"){n.lineWidth=8.5,n.beginPath(),n.moveTo(100,304),n.bezierCurveTo(340,301,579,305,796,303),n.lineTo(797,576),n.bezierCurveTo(590,578,340,573,99,577),n.closePath(),n.stroke();for(let[d,u,p]of[["The Second Language",410,80],["In remembrance",527,72]]){let g=p,y;do{if(n.font=`${g}px Aboensis`,y=n.measureText(d),y.actualBoundingBoxLeft+y.actualBoundingBoxRight<=620)break;g-=2}while(g>=58);if(g<58)throw Error("Stamp lettering requires another die layout");n.fillText(d,448,u)}s={x:56,y:260,width:784,height:360}}else if(e==="round"){for(let[d,u]of[[330,10],[306,3.5]]){n.lineWidth=u,n.beginPath();for(let p=0;p<=512;p++){let g=p/512*Math.PI*2,y=d+1.4*Math.sin(g*3)+.7*Math.cos(g*11),m=448+Math.cos(g)*y,f=448+Math.sin(g)*y;p?n.lineTo(m,f):n.moveTo(m,f)}n.closePath(),n.stroke()}Nf(n,"The Second Language",249,-Math.PI/2,!1,69),Nf(n,"In remembrance",250,Math.PI/2,!0,60),n.font="192px Aboensis",n.fillText("SL",448,514),s={x:52,y:52,width:792,height:792}}else throw Error("Unknown stamp");n.save(),n.globalCompositeOperation="destination-out",n.lineWidth=1.7;for(let[d,u,p,g]of[[100,337,18,7],[589,305,12,21],[794,540,15,-10]])n.beginPath(),n.moveTo(d,u),n.lineTo(d+p,u+g),n.stroke();n.restore();let r=eu(t,i),a=rs(),o=a.getContext("2d");o.save(),o.filter="blur(2px)",o.globalAlpha=.25,o.drawImage(r.ink,0,0),o.restore(),o.globalCompositeOperation="destination-out",o.drawImage(t,0,0),o.globalCompositeOperation="source-over",o.drawImage(r.ink,0,0);let l=rs(),c=l.getContext("2d");c.save(),c.translate(e==="round"?772:792,e==="round"?606:532),c.rotate(-.3),c.drawImage(Nl,-21,-39,42,78),c.restore(),o.globalAlpha=.74,o.drawImage(eu(l,i^9071).ink,0,0),o.globalAlpha=1;let h=d=>{let u=rs(s.width,s.height);return u.getContext("2d").drawImage(d,s.x,s.y,s.width,s.height,0,0,s.width,s.height),u};return{mask:h(t),ink:h(a),seed:i,variant:e,version:Fi,stats:r.stats}}function ir(i,e,t,n){let s=rs(n.width,n.height),r=s.getContext("2d",{willReadFrequently:!0});r.drawImage(t.ink,0,0,n.width,n.height);let a=i.getContext("2d");a.putImageData(Lf(a.getImageData(n.x,n.y,n.width,n.height),r.getImageData(0,0,n.width,n.height)),n.x,n.y);let o=e.getContext("2d");o.fillStyle="#808080",o.fillRect(0,0,e.width,e.height);let l=rs(t.mask.width,t.mask.height),c=l.getContext("2d");c.drawImage(t.mask,0,0),c.globalCompositeOperation="source-in",c.fillStyle="#303030",c.fillRect(0,0,l.width,l.height),o.save(),o.globalAlpha=.52,o.filter="blur(.7px)",o.drawImage(l,n.x,n.y,n.width,n.height),o.restore()}async function sr(i){let e=new Image;return e.src=i,await e.decode(),e}var Ff=2048,Of=2868,Uf=(i,e,t)=>{let n=[],s="";for(let r of e.split(/\s+/)){let a=s?s+" "+r:r;s&&i.measureText(a).width>t?(n.push(s),s=r):s=a}return s&&n.push(s),n};function Bf(i){let e=oa(i);return[e.chapter,e.title,...e.paragraphs,e.colophon,...e.sealLegends,...jh(i),e.note].filter(Boolean)}function gv(i,e){i.replaceChildren();for(let[t,n]of Bf(e).entries()){let s=document.createElement(t===1?"h3":"p");s.textContent=n,i.append(s)}}function xv(i,e,t,n,s){let r=oa(i),a=jh(i),o=parseInt(i.artifactDigest.slice(0,8),16),l=nr(o,i.sealVariant),c=Ff,h=Of,d=()=>Object.assign(document.createElement("canvas"),{width:c,height:h}),u=d(),p=d(),g=d(),y=d(),m=u.getContext("2d"),f=g.getContext("2d");if(m.drawImage(e,0,0,c,h),p.getContext("2d").drawImage(t,0,0,c,h),!s)throw Error("Chapter ornament missing");m.globalCompositeOperation="source-atop",m.globalAlpha=.82,m.drawImage(s,255,915,300,900),m.globalAlpha=1;let M=Q=>f.font=`${Q}px ${n.fontFamily}`;f.textAlign="center",f.textBaseline="alphabetic",f.fillStyle=n.rubric,M(68),f.fillText(r.chapter,c/2,360),f.fillStyle=n.ink;let A=i.chapterId==="2026-10-02"&&r.title==="The Line on the Map"?["The Line","on the Map"]:null,S=146;if(!A)do{if(M(S),A=Uf(f,r.title,1480),A.length<=2)break;S-=2}while(S>=112);if(M(S),A.length>2||A.some(Q=>f.measureText(Q).width>1480))throw Error("Chapter title needs a separate layout");for(let[Q,Y]of A.entries())f.fillText(Y,c/2,585+Q*170);f.textAlign="left",M(106);let b=1100,T=0,C=0,_=652,E=1134,D=145;for(let Q of r.paragraphs){for(let Y of Uf(f,Q,E))f.fillText(Y,_,b),T=Math.max(T,b+f.measureText(Y).actualBoundingBoxDescent),b+=D,C++;b+=65}if(T>1920)throw Error("Inscription no longer fits the chapter composition");let P=350,z=1370,U=2090,w=r.colophon.indexOf(" and its trial "),O=w<0?[r.colophon]:[r.colophon.slice(0,w),r.colophon.slice(w+1)],W=66;for(;W>=60&&(M(W),!O.every(Q=>f.measureText(Q).width<=z));)W-=2;if(W<60)throw Error("Colophon requires a separate layout");for(let Q of O)f.fillText(Q,P,U),U+=104;let $=i.sealVariant==="round"?{x:360,y:2330,width:240,height:240}:{x:315,y:2375,width:330,height:152};ir(u,y,l,$),M(56),f.fillText(a[1],880,2405),M(49),f.fillText(a[2],880,2485),f.fillText(a[0],880,2565),f.textAlign="center",M(42),r.note&&f.fillText(r.note,c/2,2730),f.globalCompositeOperation="destination-out",f.globalAlpha=.075;for(let Q=0;Q<2300;Q++)f.fillRect((Q*719.27+o%103)%c,(Q*437.71+o%71)%h,.6,.8);return f.globalCompositeOperation="source-over",f.globalAlpha=1,m.globalCompositeOperation="source-atop",m.drawImage(g,0,0),{front:u,back:p,ink:g,relief:y,seal:l,layout:{width:c,height:h,nominalSizeMM:[300,420],titleFontSize:S,titleLines:A.length,bodyFontSize:106,colophonFontSize:W,colophonLines:O,lastInkBottom:T,lineCount:C,sealBox:$,sealVersion:Fi,sealVariant:i.sealVariant,ornamentBox:{x:255,y:915,width:300,height:900},ornamentDigest:n.ornamentDigest,printedFonts:["Aboensis"],issued:r.issued,presentation:r.presentation,recipient:r.recipient,identity:a,artifactDigest:i.artifactDigest,artSeed:o}}}var su={};Xl(su,{createDocument:()=>Sv,documentLines:()=>Vf,loadImage:()=>sr,populateTranscript:()=>yv,prepareSeal:()=>tr});var _v="SL-MEMENTO-14",zf=async i=>[...new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(i)))].map(e=>e.toString(16).padStart(2,"0")).join("");function nu(i){aa(i);let e=ia(i.template),t=i.artPlan;if(i.sealVariant!=="oblong"||!t||t.schema!=="second-language.art-plan.v1"||t.source.chapterId!==i.chapterId||t.source.chapterDigest!==i.chapterDigest||t.source.chapterNumber!==i.chapterNumber||t.copy.chapterEnglishTitle!==i.displayTitle||t.resources.ornament.sha256!==e.ornamentDigest||i.artPlanDigest!==e.planDigest)throw Error("Chapter artwork and record do not match");return i}function la(i){nu(i);let e=i.status==="issued"?i.attestation.recipientName:Dn.displayName,t=`Chapter ${ra(i.chapterNumber)}`,n=i.artPlan.copy;return{institution:"The Second Language",chapter:t,title:n.artTitle,titleLines:n.artTitleLines,chapterTitle:i.displayTitle,recipient:e,stanzas:n.stanzas,paragraphs:n.stanzas.map(s=>s.join(`
`)),colophon:[`For ${e}, in remembrance of ${t}`,"and its trial successfully completed."],sealLegends:["The Second Language","In remembrance"],note:i.status==="issued"?"":"Specimen \u2014 Not issued",issued:i.status==="issued"}}function vv(i){let e=la(i),t=i.attestation,n=ia(i.template);return JSON.stringify(["second-language.memento.v3",i.status,i.chapterId,i.chapterNumber,i.chapterDigest,i.chapterTitle,i.displayTitle,Dn.id,e.recipient,t?.id??null,t?.attemptId??null,t?.assessmentVersion??null,t?.allCorrect??null,new Date(t?.passedAt??i.proof.sampleTime).toISOString(),_v,i.template,i.artPlanDigest,n.ornamentDigest,i.sealVariant,e.institution,e.chapter,e.title,e.chapterTitle,e.stanzas,e.colophon,e.sealLegends,e.note])}async function kf(i,e){let t=await zf(e),n={...i,artPlan:JSON.parse(e),artPlanDigest:t};if(nu(n),n.artPlan.copy.artTitleLines.join(" ")!==n.artPlan.copy.artTitle)throw Error("Artistic title line breaks do not match title");let s=vv(n);return{...n,canonicalPayload:s,artifactDigest:await zf(s),recipient:la(n).recipient}}function iu(i){return nu(i),Pl(i)}function Vf(i){let e=la(i);return[e.chapter,e.title,e.chapterTitle,...e.paragraphs,e.colophon.join(" "),...e.sealLegends,...iu(i),e.note].filter(Boolean)}function yv(i,e){i.replaceChildren();for(let[t,n]of Vf(e).entries()){let s=document.createElement(t===1?"h3":"p");s.textContent=n,s.style.whiteSpace="pre-line",i.append(s)}}function Sv(i,e,t,n,s){let r=la(i),a=i.artPlan,o=a.layout,l=o.width,c=o.height,h=parseInt(i.artifactDigest.slice(0,8),16);if(l!==2048||c!==2868)throw Error("This paper size needs a verified scroll geometry");let d=()=>Object.assign(document.createElement("canvas"),{width:l,height:c}),u=d(),p=d(),g=d(),y=d(),m=u.getContext("2d"),f=g.getContext("2d");for(let[P,z]of[[u,e],[p,t]]){let U=P.getContext("2d");U.save(),a.resources.paper.variant==="mirror-x"&&(U.translate(l,0),U.scale(-1,1)),U.drawImage(z,0,0,l,c),U.restore()}if(!s)throw Error("Chapter miniature missing");let M=o.ornament,A=Math.min(M.width/s.width,M.height/s.height),S=s.width*A,b=s.height*A;m.globalCompositeOperation="source-atop",m.globalAlpha=M.opacity,m.drawImage(s,M.x+(M.width-S)/2,M.y+(M.height-b)/2,S,b),m.globalAlpha=1;let T=iu(i),C={chapter:[r.chapter],artTitle:r.titleLines,chapterTitle:[r.chapterTitle],stanza1:r.stanzas[0],stanza2:r.stanzas[1],colophon:r.colophon,identity:[T[1],T[2],T[0]],status:[r.note]},_=[],E=o.textSafeRect;for(let P of o.blocks){let z=C[P.id];if(!Array.isArray(z)||!["left","center"].includes(P.align)||!Number.isFinite(P.fontSize)||P.fontSize<40)throw Error("Unsupported artwork text block");f.font=`${P.fontSize}px ${n.fontFamily}`,f.textAlign=P.align,f.textBaseline="alphabetic",f.fillStyle=P.color;for(let[U,w]of z.entries()){if(!w)continue;let O=P.y+U*P.lineHeight,W=f.measureText(w),$=P.x-W.actualBoundingBoxLeft,Q=P.x+W.actualBoundingBoxRight,Y=O-W.actualBoundingBoxAscent,j=O+W.actualBoundingBoxDescent;if(Q-$>P.width||$<E.x||Q>E.x+E.width||Y<E.y||j>E.y+E.height)throw Error(`The ${P.id} requires another composition`);if((P.id==="stanza1"||P.id==="stanza2")&&Y<o.reservedOrnamentBottom)throw Error("Verse overlaps miniature");f.fillText(w,P.x,O),_.push({block:P.id,text:w,left:$,right:Q,top:Y,bottom:j})}}for(let P=0;P<_.length;P++)for(let z=P+1;z<_.length;z++){let U=_[P],w=_[z];if(U.left<w.right&&U.right>w.left&&U.top<w.bottom&&U.bottom>w.top)throw Error(`Text blocks overlap: ${U.block}/${w.block}`)}f.globalCompositeOperation="destination-out",f.globalAlpha=.075;for(let P=0;P<2300;P++)f.fillRect((P*719.27+h%103)%l,(P*437.71+h%71)%c,.6,.8);f.globalAlpha=1,f.globalCompositeOperation="source-over";let D=nr(h,"oblong");return ir(u,y,D,o.seal),m.globalCompositeOperation="source-atop",m.drawImage(g,0,0),{front:u,back:p,ink:g,relief:y,seal:D,layout:{width:l,height:c,nominalSizeMM:o.nominalSizeMM,artPlanId:a.id,artPlanDigest:i.artPlanDigest,composition:"horizontal-miniature-and-centered-verse",paperVariant:a.resources.paper.variant,sealVersion:Fi,sealVariant:"oblong",sealBox:o.seal,ornamentBox:M,ornamentDigest:n.ornamentDigest,printedFonts:[n.fontFamily],textBounds:_,issued:r.issued,recipient:r.recipient,identity:T,artifactDigest:i.artifactDigest,artSeed:h}}}var Ul=class{constructor(){this.controller=new AbortController,this.items=new Set,this.images=new WeakSet,this.loadedImages=new Set,this.fonts=new Set,this.disposed=!1}assertAlive(){if(this.disposed)throw new DOMException("The scroll viewer was disposed","AbortError")}own(e){return e&&(this.disposed?(this.release(e),e):(this.items.has(e)||this.items.add(e),e))}release(e){try{e.dispose?.()}catch{}e.isTexture&&this.releaseImage(e.image)}releaseImage(e){e&&(this.loadedImages.delete(e),!this.images.has(e)&&(this.images.add(e),e instanceof HTMLImageElement?e.removeAttribute("src"):e.close?.()))}material(e){for(let t of Array.isArray(e)?e:[e])if(t){this.own(t);for(let n of Object.values(t))n?.isTexture&&this.own(n);for(let n of Object.values(t.uniforms||{}))n?.value?.isTexture&&this.own(n.value)}}scene(e){return e?.traverse(t=>{this.own(t.geometry),this.material(t.material),this.material(t.customDepthMaterial),this.material(t.customDistanceMaterial),this.own(t.skeleton?.boneTexture),this.own(t.shadow)}),e}async bytes(e){this.assertAlive();let t=await fetch(e,{signal:AbortSignal.any([this.controller.signal,AbortSignal.timeout(3e4)])});if(!t.ok)throw Error(`Scroll resource unavailable (${t.status}): ${new URL(e,location.href).pathname}`);let n=await t.arrayBuffer();return this.assertAlive(),n}async json(e){return JSON.parse(new TextDecoder().decode(await this.bytes(e)))}async text(e){return new TextDecoder().decode(await this.bytes(e))}async image(e){let t=await this.bytes(e),n=URL.createObjectURL(new Blob([t])),s=new Image;this.loadedImages.add(s);try{return s.src=n,await s.decode(),this.disposed&&(this.releaseImage(s),this.assertAlive()),s}finally{URL.revokeObjectURL(n)}}async texture(e,t){let n=await this.image(e),s=this.own(new bt(n));return s.needsUpdate=!0,t?.(s),this.assertAlive(),s}async font(e,t){let n=new FontFace(e,await this.bytes(t));return await n.load(),this.assertAlive(),document.fonts.add(n),this.fonts.add(n),n}dispose(){if(!this.disposed){this.disposed=!0,this.controller.abort();for(let e of this.fonts)document.fonts.delete(e);this.fonts.clear();for(let e of this.items)e.isWebGLRenderer||this.release(e);for(let e of this.loadedImages)this.releaseImage(e);for(let e of this.items)e.isWebGLRenderer&&this.release(e);this.items.clear(),this.loadedImages.clear()}}};var hu={};Xl(hu,{DOCUMENT_HEIGHT:()=>cu,DOCUMENT_WIDTH:()=>lu,createDocument:()=>Cv,documentLines:()=>$f,exportRecord:()=>Yf,loadDraftDocument:()=>Av,loadFrozenDocument:()=>Rv,loadImage:()=>sr,populateTranscript:()=>Ev,prepareSeal:()=>tr,translationLines:()=>Kf});var Mv=new URL("../project-beginning/",import.meta.url),Oi=i=>new URL(i,Mv).href,bv=Object.freeze({provenance:"Trial approximation from the actual paper image; not precision measurement or artistic acceptance",diagonal:Object.freeze({offset:.229,slope:.179,width:.009,depth:.008}),lower:Object.freeze({offset:.655,sine:.021,slope:.005,width:.01,depth:.009})}),Hf=Object.freeze({id:"project-commemorative-beginning-v1",width:4.5,height:6.3,coreRadius:.145,layerThickness:.035,nominalSizeMM:Object.freeze([300,420]),fontFamily:"Aboensis",fontUrl:Oi("../chapter-scroll/assets/Aboensis-Regular.otf"),skin:Oi("assets/parchment.webp"),reverse:Oi("assets/parchment.webp"),paperNormal:Oi("../chapter-scroll-v4/assets/skin-normal.jpg"),paperRoughness:Oi("../chapter-scroll-v4/assets/skin-roughness.jpg"),keeper:Oi("../chapter-scroll-v14/assets/unused-keeper.png"),environment:Oi("../chapter-scroll-v3/assets/studio.hdr"),ornament:Oi("assets/daily-miniature.png"),ink:"#30251b",rubric:"#58372d",paperFolds:bv,paperMicrostructure:Object.freeze({repeat:Object.freeze([1.4,2.1]),normalScale:.035,impressionScale:.0045})});function Fl(i){if(i!==Hf.id)throw Error("Unknown project beginning template");return Hf}var Tv="SL-PROJECT-BEGINNING-1",Gf="project-commemorative",ru=/^[0-9a-f]{64}$/,Wf=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,Xf=async i=>[...new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(i)))].map(e=>e.toString(16).padStart(2,"0")).join("");function mi(i){if(i===null||typeof i=="string"||typeof i=="boolean")return JSON.stringify(i);if(typeof i=="number"){if(!Number.isFinite(i))throw Error("Non-finite content value");return JSON.stringify(i)}if(Array.isArray(i))return"["+i.map(mi).join(",")+"]";if(i&&typeof i=="object")return"{"+Object.keys(i).sort().map(e=>JSON.stringify(e)+":"+mi(i[e])).join(",")+"}";throw Error("Unsupported content value")}function ca(i){if(!i||i.schema!=="second-language.project-commemorative.v1"||i.category!==Gf||i.status!=="commemorative"||i.attestation!==null)throw Error("A project keepsake requires its own non-assessment identity");if(i.workId!=="SL-PROJECT-BEGINNING-20261021"||i.recipient!=="Gual Wells"||i.recipient!==Dn.displayName||i.ownerId!==Dn.id)throw Error("Project keepsake identity mismatch");for(let n of["chapterId","chapterNumber","chapterDigest","chapterTitle","foundedAt","certifiedAt","passedAt"])if(Object.hasOwn(i,n))throw Error("A project keepsake is neither a chapter assessment nor a founding-date claim");if(i.projectFoundedAt!==null)throw Error("The project founding instant remains unknown");if(!Wf.test(i.madeAt)||new Date(i.madeAt).toISOString()!==i.madeAt)throw Error("A fixed UTC making record is required");if(i.publishedAt!==null&&(!Wf.test(i.publishedAt)||new Date(i.publishedAt).toISOString()!==i.publishedAt))throw Error("Invalid publication time");if(!i.source||!/^[0-9a-f]{40}$/.test(i.source.mainSHA)||!ru.test(i.source.artDirectionSHA256)||!i.source.userCommission?.basis)throw Error("Missing source or commissioning basis");let e=Fl(i.template),t=i.artPlan;if(i.sealVariant!=="oblong"||!t||t.schema!=="second-language.project-art-plan.v1"||t.category!==Gf||t.workId!==i.workId||t.source.mainSHA!==i.source.mainSHA||t.source.artDirectionSHA256!==i.source.artDirectionSHA256)throw Error("Project art plan and making record do not match");if(t.layout.width!==2048||t.layout.height!==2868||mi(t.layout.nominalSizeMM)!=="[300,420]")throw Error("Unexpected project paper proportions");if(mi(t.layout.paperFolds)!==mi(e.paperFolds)||mi(t.layout.microstructure)!==mi(e.paperMicrostructure))throw Error("The recorded trial material profile and actual renderer template differ");if(t.copy.institution!=="The Second Language"||t.copy.artTitle!=="A Day in Another Tongue"||t.copy.rubric!=="A project remembrance"||t.copy.verse.length!==5||t.copy.colophon.length!==2||t.copy.sealLegends.join("|")!=="The Second Language|In remembrance"||t.copy.status!=="Private commemorative work")throw Error("The fixed commemorative inscription has changed");if(t.copy.translation.verse.length!==5||t.copy.translation.colophon.length!==2)throw Error("The complete translation is required");for(let n of Object.values(t.resources))if(n.sha256!==null&&!ru.test(n.sha256))throw Error("Resource SHA-256 is malformed");return i}function ha(i){ca(i);let e=i.artPlan.copy;return{institution:e.institution,title:e.artTitle,titleLines:[e.artTitle],rubric:e.rubric,recipient:i.recipient,verse:e.verse,paragraphs:[e.verse.join(`
`)],colophon:e.colophon,sealLegends:e.sealLegends,note:e.status,translation:e.translation,labels:e.labels,presentation:"private-commemorative-work",issued:!1}}function wv(i){return ca(i),mi({schema:"second-language.project-content.v1",edition:Tv,category:i.category,workId:i.workId,status:i.status,ownerId:i.ownerId,recipient:i.recipient,madeAt:i.madeAt,projectFoundedAt:null,attestation:i.attestation,source:i.source,template:i.template,sealVariant:i.sealVariant,artPlan:i.artPlan})}async function qf(i,e){let t=typeof e=="string"?JSON.parse(e):e,n={...i,artPlan:t};ca(n);let s=wv(n),r=await Xf(s);return{...n,artPlanDigest:await Xf(mi(t)),canonicalPayload:s,artifactDigest:r,contentDigest:r,proof:{kind:"making-record",madeAt:n.madeAt,projectFoundedAt:null,attestation:null}}}function au(i){if(ca(i),!ru.test(i.contentDigest||""))throw Error("Prepare the content identity before typesetting");let e=Object.fromEntries(new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Shanghai",day:"2-digit",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit",fractionalSecondDigits:3,hourCycle:"h23"}).formatToParts(new Date(i.madeAt)).map(({type:t,value:n})=>[t,n]));return[`${i.artPlan.copy.labels.contentMark.en} ${i.contentDigest.slice(0,16).toUpperCase().match(/.{4}/g).join(" ")}`,`${i.artPlan.copy.labels.made.en} ${e.day} ${e.month} ${e.year}`,`${e.hour}:${e.minute}:${e.second}.${e.fractionalSecond} +08:00`]}function Yf(i){return ca(i),{schema:i.schema,category:i.category,workId:i.workId,status:i.status,recipient:i.recipient,madeAt:i.madeAt,publishedAt:i.publishedAt,projectFoundedAt:null,attestation:null,issued:!1,source:i.source,template:i.template,sha256:i.contentDigest,contentDigest:i.contentDigest,artPlanDigest:i.artPlanDigest,canonicalization:"sorted-key UTF-8 JSON; publication time excluded",canonicalPayload:i.canonicalPayload,copy:i.artPlan.copy,resources:i.artPlan.resources}}var lu=2048,cu=2868;function $f(i){let e=ha(i);return[e.rubric,e.institution,e.title,...e.verse,...e.colophon,...e.sealLegends,...au(i),`${e.labels.contentSHA256.en} ${i.contentDigest}`,...i.publishedAt?[`${e.labels.published.en} ${i.publishedAt}`]:[],e.note]}function Kf(i){let e=ha(i),t=e.translation;return[t.rubric,t.institution,t.artTitle,...t.verse,...t.colophon,...t.sealLegends,`${e.labels.made.zh} ${i.madeAt}`,`${e.labels.contentMark.zh} ${i.contentDigest.slice(0,16).toUpperCase().match(/.{4}/g).join(" ")}`,`${e.labels.contentSHA256.zh} ${i.contentDigest}`,...i.publishedAt?[`${e.labels.published.zh} ${i.publishedAt}`]:[],t.status]}function Ev(i,e){i.replaceChildren();for(let[t,n]of[["en",$f(e)],["zh-CN",Kf(e)]]){let s=document.createElement("section");s.lang=t;for(let[r,a]of n.entries()){let o=document.createElement(r===1?"h3":"p");o.textContent=a,o.style.whiteSpace="pre-line",s.append(o)}i.append(s)}}function Av(i,e,t){return Zf(i,e,t,{path:"assets/draft-surfaces.json",schema:"second-language.draft-surfaces.v1",prefix:"draft",draft:!0})}function Rv(i,e,t){return Zf(i,e,t,{path:"assets/surfaces.json",schema:"second-language.frozen-surfaces.v1",prefix:"final",draft:!1})}async function Zf(i,e,t,n){ha(i),e.assertAlive();let s=new URL(n.path,t),r=await e.json(s),a=lu,o=cu;if(r.schema!==n.schema||n.draft&&(r.stage!=="draft"||r.artisticApproval!==!1)||r.category!==i.category||r.workId!==i.workId||r.contentSHA256!==i.contentDigest||r.artPlanSHA256!==i.artPlanDigest)throw Error("The saved paper does not match this project work");if(r.width!==a||r.height!==o||r.layout?.width!==a||r.layout?.height!==o||r.layout?.contentDigest!==i.contentDigest||r.layout?.artPlanDigest!==i.artPlanDigest||r.seal?.version!==Fi||r.seal?.variant!=="oblong")throw Error("Trial paper geometry or impression metadata mismatch");let l={front:[a,o],back:[a,o],ink:[a,o],relief:[a,o],sealInk:[784,360],sealMask:[784,360]},c={},d=(await Promise.allSettled(Object.entries(l).map(async([u,[p,g]])=>{let y=r.layers?.[u],m=u.replace(/[A-Z]/g,M=>"-"+M.toLowerCase());if(!y||y.src!==`${n.prefix}-${m}.png`||y.width!==p||y.height!==g||!Number.isSafeInteger(y.bytes)||y.bytes<24||!/^[0-9a-f]{64}$/.test(y.sha256))throw Error(`Invalid saved ${u} layer descriptor`);let f;try{if(f=await e.image(new URL(y.src,s)),e.assertAlive(),f.naturalWidth!==p||f.naturalHeight!==g)throw Error(`Trial ${u} has unexpected decoded pixel dimensions`);let M=Object.assign(document.createElement("canvas"),{width:p,height:g});c[u]=M;let A=M.getContext("2d");if(!A)throw Error("A two-dimensional paper surface is unavailable");return A.drawImage(f,0,0),e.assertAlive(),M}finally{f&&e.releaseImage(f)}}))).find(u=>u.status==="rejected");if(d||e.disposed){for(let u of Object.values(c))u.width=1,u.height=1;if(d)throw d.reason;e.assertAlive()}return e.assertAlive(),{front:c.front,back:c.back,ink:c.ink,relief:c.relief,seal:{ink:c.sealInk,mask:c.sealMask,seed:r.seal.seed,variant:r.seal.variant,version:r.seal.version,stats:r.seal.stats},layout:{...r.layout,stage:n.draft?"draft":"frozen",artisticApproval:n.draft?!1:r.artisticApproval??"not-asserted",fixedSurfaces:!0,frozen:!n.draft,frozenManifestURL:s.href}}}var ou=(i,e)=>i.left<e.right&&i.right>e.left&&i.top<e.bottom&&i.bottom>e.top;function Cv(i,e,t,n,s){let r=ha(i),a=i.artPlan.layout,o=lu,l=cu;if(!document.fonts.check(`94px ${n.fontFamily}`))throw Error("The original Aboensis font must load before typesetting");if(!e||!t||!s)throw Error("The independent project paper and daily-life miniature must be present");let c=()=>Object.assign(document.createElement("canvas"),{width:o,height:l}),h=c(),d=c(),u=c(),p=c(),g=h.getContext("2d"),y=u.getContext("2d");g.drawImage(e,0,0,o,l),d.getContext("2d").drawImage(t,0,0,o,l);let m=a.ornament,f=Math.min(m.width/s.width,m.height/s.height),M=s.width*f,A=s.height*f,S={x:m.x+(m.width-M)/2,y:m.y+(m.height-A)/2,width:M,height:A};g.globalCompositeOperation="source-atop",g.globalAlpha=m.opacity,g.drawImage(s,S.x,S.y,M,A),g.globalAlpha=1;let b=au(i),T={rubric:[r.rubric],institution:[r.institution],subtitle:r.titleLines,verseBefore:r.verse.slice(0,3),verseAfter:r.verse.slice(3),colophon:r.colophon,identity:[b[1],b[2],b[0]],status:[r.note]},C=[],_=a.textSafeRect,E={left:m.x,right:m.x+m.width,top:m.y,bottom:m.y+m.height},D={left:a.seal.x,right:a.seal.x+a.seal.width,top:a.seal.y,bottom:a.seal.y+a.seal.height},P=[];for(let w of a.blocks){let O=T[w.id];if(!Array.isArray(O)||!["left","center"].includes(w.align)||!Number.isFinite(w.fontSize)||w.fontSize<40||!Number.isFinite(w.width)||w.width<=0)throw Error("Unsupported project inscription block");let W=w.minFontSize??w.fontSize;if(!Number.isFinite(W)||W<40||W>w.fontSize)throw Error("Invalid type-size range");let $=w.fontSize;for(y.textAlign=w.align,y.textBaseline="alphabetic",y.fillStyle=w.color;y.font=`${$}px ${n.fontFamily}`,!O.every(Q=>{let Y=y.measureText(Q);return Y.actualBoundingBoxLeft+Y.actualBoundingBoxRight<=w.width});)if($-=2,$<W)throw Error(`The ${w.id} needs a revised composition in the actual font`);P.push({...w,actualFontSize:$});for(let[Q,Y]of O.entries()){let j=w.y+Q*w.lineHeight,se=y.measureText(Y),ae={block:w.id,text:Y,left:w.x-se.actualBoundingBoxLeft,right:w.x+se.actualBoundingBoxRight,top:j-se.actualBoundingBoxAscent,bottom:j+se.actualBoundingBoxDescent,fontSize:$,baseline:j,align:w.align};if(![ae.left,ae.right,ae.top,ae.bottom].every(Number.isFinite)||ae.left<_.x||ae.right>_.x+_.width||ae.top<_.y||ae.bottom>_.y+_.height)throw Error(`The ${w.id} leaves the actual paper writing area`);if(ou(ae,E)||ou(ae,D))throw Error(`The ${w.id} intrudes into the miniature or impression`);y.fillText(Y,w.x,j),C.push(ae)}}for(let w=0;w<C.length;w++)for(let O=w+1;O<C.length;O++)if(ou(C[w],C[O]))throw Error(`Project text blocks overlap: ${C[w].block}/${C[O].block}`);let z=parseInt(i.contentDigest.slice(0,8),16);y.globalCompositeOperation="destination-out",y.globalAlpha=.075;for(let w=0;w<2300;w++)y.fillRect((w*719.27+z%103)%o,(w*437.71+z%71)%l,.6,.8);y.globalAlpha=1,y.globalCompositeOperation="source-over";let U=nr(z,"oblong");return ir(h,p,U,a.seal),g.globalCompositeOperation="source-atop",g.drawImage(u,0,0),{front:h,back:d,ink:u,relief:p,seal:U,layout:{width:o,height:l,nominalSizeMM:a.nominalSizeMM,artPlanId:i.artPlan.id,artPlanDigest:i.artPlanDigest,composition:"project-title-and-subtitle; three-verse-lines; daily-miniature; two-verse-lines; private-colophon-and-record",stage:"draft",artisticApproval:!1,paperVariant:i.artPlan.resources.paper.variant,sealVersion:Fi,sealVariant:"oblong",sealBox:a.seal,ornamentBox:m,ornamentPlacement:S,ornamentDigest:i.artPlan.resources.ornament.sha256,printedFonts:[n.fontFamily],textBounds:C,blocks:P,status:i.status,issued:!1,recipient:r.recipient,identity:b,artifactDigest:i.artifactDigest,contentDigest:i.contentDigest,artSeed:z}}}var jf=/float u=q\.x\/scrollWidth\+\.5, sheetV=\.5-q\.y\/scrollHeight;\s*float diagonal=exp\(-pow\(\(sheetV-\(\.11\+\.365\*u\)\)\/\.009,2\.\)\)\*\(1\.-smoothstep\(\.42,\.55,u\)\);\s*float crossfold=exp\(-pow\(\(sheetV-\(\.645\+\.04\*u\)\)\/\.010,2\.\)\);\s*v\.z=-\.008\*diagonal-\.011\*crossfold;\s*v\.z\+=\.009\*sin/,gi=i=>{if(!Number.isFinite(i))throw Error("Invalid trial fold parameter");return i.toFixed(10)};function Iv(i,e){if(!jf.test(i.vertexShader))throw Error("The inherited paper fold shader changed; review the project-only adaptation");let t=e.diagonal,n=e.lower;i.vertexShader=i.vertexShader.replace(jf,`float u=q.x/scrollWidth+.5, sheetV=.5-q.y/scrollHeight;
   float projectDiagonal=exp(-pow((sheetV-(${gi(t.offset)}+${gi(t.slope)}*u))/${gi(t.width)},2.));
   float projectLower=exp(-pow((sheetV-(${gi(n.offset)}+${gi(n.sine)}*sin(3.141592653589793*u)+${gi(n.slope)}*u))/${gi(n.width)},2.));
   v.z=-${gi(t.depth)}*projectDiagonal-${gi(n.depth)}*projectLower;
   v.z+=.009*sin`)}function Pv(i,e,t){let n=t.diagonal,s=t.lower;return-n.depth*Math.exp(-(((e-(n.offset+n.slope*i))/n.width)**2))-s.depth*Math.exp(-(((e-(s.offset+s.sine*Math.sin(Math.PI*i)+s.slope*i))/s.width)**2))}var Ol=class extends er{constructor(...e){super(...e);let t=this.template.paperFolds,n=this.template.paperMicrostructure;for(let r of[this.material,this.sheet.customDepthMaterial]){let a=r.onBeforeCompile;r.onBeforeCompile=o=>{a(o),Iv(o,t)},r.customProgramCacheKey=()=>`project-beginning-fold-trial-v1-${r===this.material?"paper":"shadow"}-${JSON.stringify(t)}`,r.needsUpdate=!0}let s=this.environmentReady;this.environmentReady=s.then(()=>{for(let r of[this.material.normalMap,this.material.roughnessMap]){if(!r)throw Error("The independent paper microstructure did not load");r.wrapS=r.wrapT=_n,r.repeat.set(...n.repeat),r.needsUpdate=!0}this.material.normalScale.set(n.normalScale,n.normalScale),this.material.bumpScale=n.impressionScale,this.material.needsUpdate=!0,this.paperProfilePrepared=!0,this.dirty=!0})}inspectionGeometry(){let e=this.closure.inspectionGeometry();if(this.progress!==0||this.paperProgress!==0)return e;let t=this.geometry.attributes.position,n=[],s=this.closure.radius,r=this.template.layerThickness/(2*Math.PI),a=-this.height/2,o=new V;this.sheet.updateMatrixWorld(!0);for(let l=0;l<t.count;l++){let c=t.getX(l),h=t.getY(l),d=c/this.width+.5,u=.5-h/this.height,p=(Math.abs(c)/(this.width/2))**6,g=Pv(d,u,this.template.paperFolds)+.009*Math.sin(h*4+c*2)+.025*p*Math.sin(h*3.2+.4),y=h,m=g,f=-h-a;if(f>0){let M=s*.08,A=(s-M)/r,S=s*A-.5*r*A*A,b=f>=S?A+(f-S)/M:2*f/(s+Math.sqrt(Math.max(0,s*s-2*r*f))),T=Math.max(s-r*b,M)-g;y=-(a+T*Math.sin(b)),m=s-T*Math.cos(b)}o.set(c,y,m).applyMatrix4(this.sheet.matrixWorld),n.push(o.x,o.y,o.z)}return e.paperMesh={vertices:n,indices:Array.from(this.geometry.index.array)},e}snapshot(){let e=t=>t?{repeat:t.repeat.toArray(),wrapS:t.wrapS,wrapT:t.wrapT,colorSpace:t.colorSpace,source:t.image?.currentSrc||t.image?.src||null}:null;return{...super.snapshot(),edition:"project beginning \u2014 manufacturing trial",paperMaterial:"chapter-one scan microstructure starting profile; independent new albedo; retained v6 matte response",paperFolds:this.template.paperFolds,paperProfilePrepared:this.paperProfilePrepared??!1,paperProfile:{normalScale:this.material.normalScale.toArray(),bumpScale:this.material.bumpScale,normal:e(this.material.normalMap),roughness:e(this.material.roughnessMap),sheen:this.material.sheen,specularIntensity:this.material.specularIntensity,envMapIntensity:this.material.envMapIntensity,actualGPUVerified:!1,artisticApproval:!1}}}};var Lv=Object.freeze([Object.freeze({id:"beginning",category:"project-commemorative",label:"\u9879\u76EE\u7EAA\u5FF5\u5377\u8F74",source:new URL("../project-beginning/",import.meta.url),getTemplate:Fl,document:hu,prepareCharter:qf,hasArtPlan:!0,recordFile:"record.json",ObjectClass:Ol,frozenDocument:!0}),Object.freeze({id:"one",chapterId:"2026-10-02",chapterNumber:1,label:"\u7B2C\u4E00\u7AE0",source:new URL("../chapter-scroll-v12/",import.meta.url),getTemplate:sa,document:tu,prepareCharter:Pf,hasArtPlan:!1}),Object.freeze({id:"five",chapterId:"2026-10-12",chapterNumber:5,label:"\u7B2C\u4E94\u7AE0",source:new URL("../chapter-scroll-v14/",import.meta.url),getTemplate:Rf,document:su,prepareCharter:kf,hasArtPlan:!0})]);function Dv(i,e){let t={...i.getTemplate(e)};for(let n of["fontUrl","skin","reverse","keeper","paperNormal","paperRoughness","environment","ornament"])t[n]&&(t[n]=new URL(t[n],i.source).href);return t.paperNormal||=new URL("../chapter-scroll-v4/assets/skin-normal.jpg",import.meta.url).href,t.paperRoughness||=new URL("../chapter-scroll-v4/assets/skin-roughness.jpg",import.meta.url).href,t}var Bl=i=>Math.max(0,Math.min(1,Number(i)||0)),Nv=()=>new DOMException("The scroll viewer was disposed","AbortError");function uu(i,e,t){let n=e?.getExtension("WEBGL_lose_context");if(!n||e.isContextLost())return!1;let s=r=>{r.preventDefault(),setTimeout(()=>{e.isContextLost()&&n.restoreContext()},0)};return i.addEventListener("webglcontextlost",s,{once:!0}),t(),!0}var Jf=class{constructor(e,t,{onProgress:n=()=>{},onStatus:s=()=>{}}={}){if(!(e instanceof HTMLCanvasElement)||!(t instanceof HTMLCanvasElement))throw TypeError("Two canvas elements are required");this.canvas=e,this.mistCanvas=t,this.onProgress=n,this.onStatus=s,this.resources=new Ul,this.disposers=[],this.ready=!1,this.disposed=!1,this.paused=!1,this.lost=!1,this.progress=0,this.frame=0,this.previousTime=0,this.animation=null,this.drag=null,this.status="idle",this.size=null,this.mistLost=!1,this.mistSurface=new Proxy(t,{get:(r,a)=>{if(a==="clientWidth")return r.clientWidth||Math.max(1,(this.size?.[0]||1)*1.6);if(a==="clientHeight")return r.clientHeight||Math.max(1,(this.size?.[1]||1)*1.3);let o=Reflect.get(r,a,r);return typeof o=="function"?o.bind(r):o},set:(r,a,o)=>Reflect.set(r,a,o,r)}),this.reduced=matchMedia("(prefers-reduced-motion: reduce)"),this.atmosphereWanted=!this.reduced.matches,this.listen(document,"visibilitychange",()=>{document.hidden?this.suspend():this.paused||this.resume()}),this.listen(this.reduced,"change",()=>{this.reduced.matches&&(this.setAtmosphere(!1),this.animation&&this.setProgress(this.animation.to))}),this.listen(e,"webglcontextlost",r=>this.contextLost(r)),this.listen(e,"webglcontextrestored",()=>this.restoreContext()),this.listen(t,"webglcontextlost",r=>{r.preventDefault(),!this.disposed&&(this.mistLost=!0,this.mist?.setEnabled(!1),this.report("\u96FE\u67D3\u6682\u65F6\u4E2D\u65AD\uFF0C\u85CF\u5377\u4ECD\u53EF\u89C2\u8D4F\u3002","mist-unavailable"))}),this.listen(t,"webglcontextrestored",()=>{this.disposed||(this.mistLost=!1,this.ready&&this.prepareMist({restored:!0}).then(()=>this.schedule()).catch(()=>{}))})}listen(e,t,n,s){e.addEventListener(t,n,s),this.disposers.push(()=>e.removeEventListener(t,n,s))}report(e,t=this.status){this.disposed||(this.status=t,this.onStatus(e,{status:t,ready:this.ready}))}signalProgress({velocity:e=0,active:t=!1,direction:n=0}={}){this.disposed||this.onProgress({progress:this.progress,velocity:e,active:t,direction:n,phase:this.object?.closure?.snapshot()?.phase||"closed",paperProgress:this.object?.paperProgress??0})}async prepare(e={}){if(this.disposed)throw Nv();let t=e.chapter??e.chapterId??e.chapterNumber??"five",n=Lv.find(s=>[s.id,s.chapterId,s.chapterNumber,String(s.chapterNumber)].includes(t));if(!n)throw Error("Only actual published works and the existing chapter specimens are available; other works are not substituted.");if(e.chapterId!==void 0&&e.chapterId!==n.chapterId)throw Error("Requested chapter identifiers do not match");if(this.preparation){if(this.profile!==n||this.surfaceSet!==(e.surfaceSet??"frozen"))throw Error("Dispose this viewer before changing works or surface sets");return this.preparation}return this.profile=n,this.preparation=this.prepareChapter(n,e).catch(s=>{throw this.disposed||(this.ready=!1,this.lastError=s.message,this.report("\u7ACB\u4F53\u85CF\u5377\u6682\u4E0D\u53EF\u7528\uFF0C\u4ECD\u53EF\u67E5\u770B\u5DF2\u5907\u597D\u7684\u7EB8\u9762\u4E0E\u91CA\u8BFB\u3002","failed"),this.resources.dispose()),s}),this.preparation}async prepareChapter(e,{initialProgress:t=0,surfaceSet:n="frozen"}={}){if(!["frozen","draft"].includes(n)||n==="draft"&&typeof e.document.loadDraftDocument!="function")throw Error("Unsupported paper surface set");this.surfaceSet=n;let s=this.resources;this.report(`\u6B63\u5728\u51C6\u5907${e.label}\u2026`,"preparing");let[r,a]=await Promise.all([s.json(new URL(e.recordFile||"chapter-sample.json",e.source)),e.hasArtPlan?s.text(new URL("art-plan.json",e.source)):Promise.resolve(void 0)]);if(e.category==="project-commemorative"){if(r.category!=="project-commemorative"||r.status!=="commemorative"||r.attestation!==null||r.chapterId!=null||r.chapterNumber!=null)throw Error("Project keepsake must remain separate from chapter assessment")}else if(r.chapterId!==e.chapterId||r.chapterNumber!==e.chapterNumber||r.status!=="specimen"||r.attestation!==null)throw Error("The fixed chapter specimen does not match its display profile");let o=await e.prepareCharter(r,a);s.assertAlive(),this.record=o;let l=Dv(e,o.template);this.template=l,e.frozenDocument||await s.font(l.fontFamily,l.fontUrl);let c=await Promise.all((e.frozenDocument?[l.keeper]:[l.skin,l.reverse,l.keeper,l.ornament]).map(y=>s.image(y))),[h,d,u,p]=e.frozenDocument?[null,null,c[0],null]:c;try{e.frozenDocument?this.textures=await e.document[n==="draft"?"loadDraftDocument":"loadFrozenDocument"](o,s,e.source):(await e.document.prepareSeal(),s.assertAlive(),this.textures=e.document.createDocument(o,h,d,l,p));let y=e.ObjectClass||er;this.object=new y(this.canvas,this.textures,u,l),this.attachObjectLifetime(this.object,s)}finally{for(let y of c)(y!==u||!this.object)&&s.releaseImage(y)}if(s.assertAlive(),this.object.closure.onLoadingProgress=y=>this.report(y<1?`\u6B63\u5728\u8F7D\u5165\u5B9E\u4F53\u76AE\u6263\u2026 ${Math.round(y*100)}%`:"\u6B63\u5728\u51C6\u5907\u85CF\u5377\u2026","preparing"),!this.size){let y=this.canvas;for(;y&&(!y.clientWidth||!y.clientHeight);)y=y.parentElement;this.size=[y?.clientWidth||1,y?.clientHeight||1]}this.resize(...this.size),this.report("\u6B63\u5728\u51C6\u5907\u7EB8\u5F20\u3001\u76AE\u6263\u4E0E\u52A8\u4F5C\u2026","preparing");let g=Bl(t);return await this.object.prepareMotion(g),s.assertAlive(),await this.prepareMist(),s.assertAlive(),this.progress=g,this.object.setProgress(g),this.object.settle(),this.ready=!0,this.previousTime=performance.now(),this.render(),this.signalProgress(),this.report(this.profile?.category==="project-commemorative"?"\u79C1\u4EBA\u9879\u76EE\u7EAA\u5FF5\u4F5C\u54C1":"\u8BBE\u8BA1\u8BD5\u6837 \xB7 \u5C1A\u672A\u9881\u53D1","ready"),this.schedule(),this}attachObjectLifetime(e,t){let n=()=>{t.scene(e.scene),t.scene(e.closure?.model),t.own(e.geometry),t.own(e.sealBump),t.own(e.environment),t.own(e.closure?.curve);for(let o of[...e.maps,...e.closure?.maps||[]])t.own(o);t.own(e.keeper?.geometry),t.material(e.keeper?.material)},s=e.environment;Object.defineProperty(e,"environment",{configurable:!0,get:()=>s,set:o=>{s=o,t.own(o),t.disposed&&queueMicrotask(()=>{e.renderer.dispose(),uu(this.canvas,e.renderer.getContext(),()=>e.renderer.forceContextLoss())})}});let r=e.render.bind(e);e.render=(...o)=>{if(!t.disposed)return r(...o)};let a=e.environmentReady;e.environmentReady=a.then(()=>{n(),t.assertAlive()}),e.environmentReady.catch(()=>n()),e.closure.ready.then(n,n),n(),t.own(e.renderer)}async prepareMist({restored:e=!1}={}){if(this.disposed||this.reduced.matches||this.mistLost){this.mistCanvas.hidden=!0;return}let t=this.mist;this.mist=null,e&&t?(t.fluid=null,t.dispose()):this.disposeMist(t);let n=new Cl(this.mistSurface,{signal:this.resources.controller.signal});this.mist=n;try{if(await n.prepare(),this.disposed||this.mist!==n){this.disposeMist(n);return}n.setEnabled(this.atmosphereWanted&&!this.paused),this.mistCanvas.hidden=!this.atmosphereWanted||this.paused}catch(s){this.disposeMist(n),this.mist===n&&(this.mist=null),this.disposed||(this.mistCanvas.hidden=!0,this.mistError=s.message)}}disposeMist(e){if(!e)return;if(!e.fluid){e.dispose();return}if(e.releasedFluid===e.fluid)return;e.releasedFluid=e.fluid;let t=this.mistCanvas.getContext("webgl2")||this.mistCanvas.getContext("webgl");uu(this.mistCanvas,t,()=>e.dispose())||e.dispose()}resize(e,t){!(e>0&&t>0)||this.disposed||(this.size=[e,t],!(!this.object||this.lost)&&(this.object.resize(e,t),this.mist?.resetMotion(),this.render()))}render(){this.object&&this.ready&&!this.disposed&&!this.lost&&!this.paused&&!document.hidden&&this.object.render()}schedule(){this.frame||this.disposed||this.paused||this.lost||document.hidden||!this.ready||(this.animation||this.object.needsMotion||this.atmosphereWanted&&!this.reduced.matches&&this.mist?.fluid&&!this.mistLost)&&(this.frame=requestAnimationFrame(e=>this.tick(e)))}tick(e){if(this.frame=0,this.disposed||this.paused||this.lost||document.hidden||!this.ready)return;let t=e-this.previousTime;if(t<7){this.schedule();return}let n=Math.min(.05,(t||40)/1e3);if(this.previousTime=e,this.animation){let s=this.animation,r=this.progress,a=s.sample(e);this.progress=a.progress,this.object.setProgress(this.progress);let o=(this.progress-r)/Math.max(.001,t/1e3),l=Math.sign(s.to-s.from);this.signalProgress({velocity:o,active:!a.done,direction:l}),a.done&&(this.animation=null,this.finishAnimation({completed:!0,progress:this.progress}),this.report(this.profile?.category==="project-commemorative"?"\u79C1\u4EBA\u9879\u76EE\u7EAA\u5FF5\u4F5C\u54C1":"\u8BBE\u8BA1\u8BD5\u6837 \xB7 \u5C1A\u672A\u9881\u53D1","ready"))}this.object.advance(n),(this.animation||this.object.needsMotion||this.object.dirty)&&this.render(),this.atmosphereWanted&&!this.reduced.matches&&!this.mistLost&&this.mist?.tick(n,this.progress,this.object.bounds,this.object.viewHeight,Math.max(.001,t/1e3),this.object.interaction()),this.schedule()}animate(e){if(!this.ready||this.disposed||this.lost)return Promise.resolve({completed:!1,reason:"unavailable"});if(e=Bl(e),this.finishAnimation({completed:!1,reason:"superseded"}),this.reduced.matches||Math.abs(e-this.progress)<1e-6)return this.setProgress(e),Promise.resolve({completed:!0,progress:e});this.animation=new Il(this.progress,e,performance.now());let t=new Promise(n=>{this.animationComplete=n});return this.report(e?"\u85CF\u5377\u5C55\u5F00\u4E2D\u2026":"\u85CF\u5377\u6536\u8D77\u4E2D\u2026","animating"),this.signalProgress({active:!0,direction:Math.sign(e-this.progress)}),this.schedule(),t}finishAnimation(e){let t=this.animationComplete;this.animationComplete=null,t?.(e)}setProgress(e,{immediate:t=!0}={}){if(!t)return this.animate(e);!this.object||this.disposed||this.lost||(this.finishAnimation({completed:!1,reason:"set-progress"}),this.animation=null,this.progress=Bl(e),this.object.setProgress(this.progress),this.object.settle(),this.mist?.resetMotion(),this.signalProgress(),this.render(),this.schedule())}setAtmosphere(e){this.atmosphereWanted=!!e&&!this.reduced.matches,this.mist?.setEnabled(this.atmosphereWanted&&!this.paused&&!this.lost&&!this.mistLost),this.mistCanvas.hidden=!this.atmosphereWanted||this.paused||this.lost||this.mistLost,!this.atmosphereWanted&&!this.animation&&!this.object?.needsMotion&&(cancelAnimationFrame(this.frame),this.frame=0),this.schedule()}suspend(){cancelAnimationFrame(this.frame),this.frame=0,this.drag=null,this.mist?.resetMotion(),this.signalProgress()}pause(){this.disposed||(this.paused=!0,this.suspend(),this.mist?.setEnabled(!1))}resume(){this.disposed||document.hidden||(this.paused=!1,this.previousTime=performance.now(),this.animation?.resume(this.previousTime),this.mist?.setEnabled(this.atmosphereWanted&&!this.mistLost&&!this.lost),this.render(),this.schedule())}bindPointerInput(){this.pointerBound||this.disposed||(this.pointerBound=!0,this.listen(this.canvas,"pointerdown",e=>this.pointerDown(e)),this.listen(this.canvas,"pointermove",e=>this.pointerMove(e)),this.listen(this.canvas,"pointerup",e=>this.pointerUp(e)),this.listen(this.canvas,"pointercancel",e=>this.pointerCancel(e)),this.listen(this.canvas,"lostpointercapture",()=>{this.drag=null}))}pointerDown(e){if(!this.ready||this.paused||this.lost||this.disposed||e.pointerType==="mouse"&&e.button!==0)return;let t=this.animation?.to;this.finishAnimation({completed:!1,reason:"pointer"}),this.animation=null,this.drag={id:e.pointerId,y:e.clientY,p:this.progress,moved:!1,target:t,time:performance.now()},this.canvas.setPointerCapture(e.pointerId)}pointerMove(e){let t=this.drag;if(!t||t.id!==e.pointerId||this.disposed)return;let n=e.clientY-t.y;if(Math.abs(n)>9&&(t.moved=!0),!t.moved)return;let s=performance.now(),r=this.progress;this.progress=Bl(t.p+n/((this.size?.[1]||1)*.64)),this.object.setProgress(this.progress),this.signalProgress({velocity:(this.progress-r)/Math.max(.001,(s-t.time)/1e3),active:!0,direction:Math.sign(this.progress-r)}),t.time=s,this.render(),this.schedule()}pointerUp(e){let t=this.drag;!t||t.id!==e.pointerId||(this.drag=null,this.canvas.hasPointerCapture(e.pointerId)&&this.canvas.releasePointerCapture(e.pointerId),this.animate(t.moved?this.progress>=.5?1:0:t.target!==void 0?t.target?0:1:this.progress>=.5?0:1))}pointerCancel(e){if(this.drag?.id!==e.pointerId)return;let t=this.drag.target;this.drag=null,t!==void 0?this.animate(t):this.signalProgress()}contextLost(e){e.preventDefault(),!this.disposed&&(this.lost=!0,this.ready=!1,this.suspend(),this.mist?.setEnabled(!1),this.report("\u7ACB\u4F53\u663E\u793A\u4E2D\u65AD\uFF0C\u53EF\u67E5\u770B\u9759\u6001\u5377\u9875\u3002","context-lost"))}async restoreContext(){if(!this.disposed&&(this.lost=!1,!!this.object)){this.ready=!1,this.report("\u6B63\u5728\u6062\u590D\u85CF\u5377\u2026","restoring");try{this.size&&this.object.resize(...this.size),await this.object.prepareMotion(this.progress),this.resources.assertAlive(),this.ready=!0,this.mist?.resetMotion(),this.previousTime=performance.now(),this.animation?.resume(this.previousTime),this.mist?.setEnabled(this.atmosphereWanted&&!this.paused&&!this.mistLost),this.render(),this.schedule(),this.report(this.profile?.category==="project-commemorative"?"\u79C1\u4EBA\u9879\u76EE\u7EAA\u5FF5\u4F5C\u54C1":"\u8BBE\u8BA1\u8BD5\u6837 \xB7 \u5C1A\u672A\u9881\u53D1","ready")}catch(e){this.disposed||(this.lastError=e.message,this.report("\u7ACB\u4F53\u663E\u793A\u6682\u4E0D\u53EF\u7528\uFF0C\u53EF\u67E5\u770B\u9759\u6001\u5377\u9875\u3002","failed"))}}}getTranscript(){return this.record?this.profile.document.documentLines(this.record):[]}getClosedScreenPose(){if(!this.object||!this.size)return null;let e=this.object,[t,n]=this.size,s=e.closure?.radius||0,r=[];for(let h of[-e.width/2,e.width/2])for(let d of[e.bounds.bottom,e.bounds.top]){let u=e.camera.position.clone().set(h,d,s).project(e.camera);r.push({x:(u.x*.5+.5)*t,y:(.5-u.y*.5)*n})}let a=r.map(h=>h.x),o=r.map(h=>h.y),l=Math.min(...a),c=Math.min(...o);return{x:(l+Math.max(...a))/2,y:(c+Math.max(...o))/2,width:Math.max(...a)-l,height:Math.max(...o)-c,units:"css-pixels"}}populateTranscript(e){this.record?this.profile.document.populateTranscript(e,this.record):e.replaceChildren()}exportDocument(){return this.textures?.front.toDataURL("image/png")??null}exportRecord(){let e=this.record;return e?this.profile.category==="project-commemorative"?{...this.profile.document.exportRecord(e),sourceRecordUrl:new URL(this.profile.recordFile,this.profile.source).href}:{status:e.status,recipient:e.recipient,chapterId:e.chapterId,chapterNumber:e.chapterNumber,sha256:e.artifactDigest,canonicalPayload:e.canonicalPayload,proof:e.proof,sealVariant:e.sealVariant,artPlanDigest:e.artPlanDigest??null,source:e.artPlan?.source??{chapterId:e.chapterId,chapterNumber:e.chapterNumber,chapterDigest:e.chapterDigest,title:e.chapterTitle},sourceRecordUrl:new URL("chapter-sample.json",this.profile.source).href,template:e.template}:null}snapshot(){return{...this.object?.snapshot(),ready:this.ready,disposed:this.disposed,paused:this.paused,lost:this.lost,environmentAvailable:!!this.object?.scene.environment,contextReleased:!!this.contextReleased,animating:!!this.animation,chapterId:this.record?.chapterId??null,category:this.record?.category||"chapter-specimen",workId:this.record?.workId??null,issued:!1,status:this.status,error:this.lastError||null,layout:this.textures?.layout,mist:this.mist?.snapshot()??{available:!1},atmosphereWanted:this.atmosphereWanted}}dispose(){if(this.disposed)return;this.disposed=!0,cancelAnimationFrame(this.frame),this.frame=0,this.drag=null,this.finishAnimation({completed:!1,reason:"disposed"}),this.animation=null,this.ready=!1;for(let t of this.disposers.splice(0))t();let e=this.mist;this.mist=null,this.disposeMist(e),this.resources.dispose(),this.object&&(this.contextReleased=uu(this.canvas,this.object.renderer.getContext(),()=>this.object.renderer.forceContextLoss()));for(let t of[this.textures?.front,this.textures?.back,this.textures?.ink,this.textures?.relief,this.textures?.seal?.ink,this.textures?.seal?.mask])t&&(t.width=1,t.height=1);this.object?.scene.clear(),this.object=null,this.textures=null}};export{Jf as ScrollViewer};
