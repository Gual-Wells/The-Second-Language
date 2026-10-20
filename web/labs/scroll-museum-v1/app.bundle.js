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
/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */var _f=0,Fh=1,vf=2;var vs=1,gr=2,xr=3,si=0,on=1,Gt=2,ri=0,_r=1,Oh=2,Bh=3,kh=4,yf=5;var ys=100,Mf=101,Sf=102,bf=103,Tf=104,wf=200,Ef=201,Af=202,Rf=203,zh=204,Vh=205,Cf=206,If=207,Pf=208,Lf=209,Df=210,Nf=211,Uf=212,Ff=213,Of=214,Oo=0,Bo=1,ko=2,js=3,zo=4,Vo=5,Go=6,Ho=7,Gh=0,Bf=1,kf=2,bn=0,Hh=1,Wh=2,Xh=3,Ms=4,qh=5,Yh=6,Kh=7,vh="attached",zf="detached",Zh=300,Zi=301,Ss=302,fl=303,pl=304,Pa=306,Cn=1e3,qt=1001,Qs=1002,Dt=1003,ml=1004;var bs=1005;var bt=1006,vr=1007;var Pn=1008;var pn=1009,$h=1010,Jh=1011,yr=1012,gl=1013,Wn=1014,Kt=1015,ln=1016,xl=1017,_l=1018,Mr=1020,jh=35902,Qh=35899,eu=1021,tu=1022,cn=1023,Jn=1026,$i=1027,vl=1028,yl=1029,Ji=1030,Ml=1031;var Sl=1033,La=33776,Da=33777,Na=33778,Ua=33779,bl=35840,Tl=35841,wl=35842,El=35843,Al=36196,Rl=37492,Cl=37496,Il=37488,Pl=37489,Fa=37490,Ll=37491,Dl=37808,Nl=37809,Ul=37810,Fl=37811,Ol=37812,Bl=37813,kl=37814,zl=37815,Vl=37816,Gl=37817,Hl=37818,Wl=37819,Xl=37820,ql=37821,Yl=36492,Kl=36494,Zl=36495,$l=36283,Jl=36284,Oa=36285,jl=36286;var os=2300,ls=2301,No=2302,yh=2303,Mh=2400,Sh=2401,bh=2402,Vf=2500;var nu=0,Ba=1,Sr=2,Gf=3200,ka=3201;var Ql=0,Hf=1,Xn="",gt="srgb",Zt="srgb-linear",Qr="linear",ft="srgb";var Uo=7680;var Wf=519,Xf=512,qf=513,Yf=514,ec=515,Kf=516,Zf=517,tc=518,$f=519,iu=35044,su=35048;var ru="300 es",zn=2e3,er=2001;function Tm(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function wm(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function tr(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Jf(){let s=tr("canvas");return s.style.display="block",s}var Ed={},nr=null;function ea(...s){let e="THREE."+s.shift();nr?nr("log",e,...s):console.log(e,...s)}function jf(s){let e=s[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=s[1];t&&t.isStackTrace?s[0]+=" "+t.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function Fe(...s){s=jf(s);let e="THREE."+s.shift();if(nr)nr("warn",e,...s);else{let t=s[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...s)}}function Ke(...s){s=jf(s);let e="THREE."+s.shift();if(nr)nr("error",e,...s);else{let t=s[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...s)}}function as(...s){let e=s.join(" ");e in Ed||(Ed[e]=!0,Fe(...s))}function Qf(s,e,t){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var ep={[Oo]:Bo,[ko]:Go,[zo]:Ho,[js]:Vo,[Bo]:Oo,[Go]:ko,[Ho]:zo,[Vo]:js},jn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let i=n[e];if(i!==void 0){let r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let i=n.slice(0);for(let r=0,a=i.length;r<a;r++)i[r].call(this,e);e.target=null}}},jt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Ad=1234567,Zr=Math.PI/180,cs=180/Math.PI;function Rn(){let s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(jt[s&255]+jt[s>>8&255]+jt[s>>16&255]+jt[s>>24&255]+"-"+jt[e&255]+jt[e>>8&255]+"-"+jt[e>>16&15|64]+jt[e>>24&255]+"-"+jt[t&63|128]+jt[t>>8&255]+"-"+jt[t>>16&255]+jt[t>>24&255]+jt[n&255]+jt[n>>8&255]+jt[n>>16&255]+jt[n>>24&255]).toLowerCase()}function tt(s,e,t){return Math.max(e,Math.min(t,s))}function au(s,e){return(s%e+e)%e}function Em(s,e,t,n,i){return n+(s-e)*(i-n)/(t-e)}function Am(s,e,t){return s!==e?(t-s)/(e-s):0}function $r(s,e,t){return(1-t)*s+t*e}function Rm(s,e,t,n){return $r(s,e,1-Math.exp(-t*n))}function Cm(s,e=1){return e-Math.abs(au(s,e*2)-e)}function Im(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*(3-2*s))}function Pm(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*s*(s*(s*6-15)+10))}function Lm(s,e){return s+Math.floor(Math.random()*(e-s+1))}function Dm(s,e){return s+Math.random()*(e-s)}function Nm(s){return s*(.5-Math.random())}function Um(s){s!==void 0&&(Ad=s);let e=Ad+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Fm(s){return s*Zr}function Om(s){return s*cs}function Bm(s){return s>0&&Number.isInteger(s)&&2**Math.round(Math.log2(s))===s}function km(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function zm(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function Vm(s,e,t,n,i){let r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+n)/2),h=a((e+n)/2),u=r((e-n)/2),d=a((e-n)/2),f=r((n-e)/2),m=a((n-e)/2);switch(i){case"XYX":s.set(o*h,l*u,l*d,o*c);break;case"YZY":s.set(l*d,o*h,l*u,o*c);break;case"ZXZ":s.set(l*u,l*d,o*h,o*c);break;case"XZX":s.set(o*h,l*m,l*f,o*c);break;case"YXY":s.set(l*f,o*h,l*m,o*c);break;case"ZYZ":s.set(l*m,l*f,o*h,o*c);break;default:Fe("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function kn(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:case Uint8ClampedArray:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function mt(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var Rt={DEG2RAD:Zr,RAD2DEG:cs,generateUUID:Rn,clamp:tt,euclideanModulo:au,mapLinear:Em,inverseLerp:Am,lerp:$r,damp:Rm,pingpong:Cm,smoothstep:Im,smootherstep:Pm,randInt:Lm,randFloat:Dm,randFloatSpread:Nm,seededRandom:Um,degToRad:Fm,radToDeg:Om,isPowerOfTwo:Bm,ceilPowerOfTwo:km,floorPowerOfTwo:zm,setQuaternionFromProperEuler:Vm,normalize:mt,denormalize:kn},fe=class s{static{s.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=tt(this.x,e.x,t.x),this.y=tt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=tt(this.x,e,t),this.y=tt(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(tt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(tt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*i+e.x,this.y=r*i+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},en=class{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,a,o){let l=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3],d=r[a+0],f=r[a+1],m=r[a+2],y=r[a+3];if(u!==y||l!==d||c!==f||h!==m){let g=l*d+c*f+h*m+u*y;g<0&&(d=-d,f=-f,m=-m,y=-y,g=-g);let p=1-o;if(g<.9995){let S=Math.acos(g),E=Math.sin(S);p=Math.sin(p*S)/E,o=Math.sin(o*S)/E,l=l*p+d*o,c=c*p+f*o,h=h*p+m*o,u=u*p+y*o}else{l=l*p+d*o,c=c*p+f*o,h=h*p+m*o,u=u*p+y*o;let S=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=S,c*=S,h*=S,u*=S}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,r,a){let o=n[i],l=n[i+1],c=n[i+2],h=n[i+3],u=r[a],d=r[a+1],f=r[a+2],m=r[a+3];return e[t]=o*m+h*u+l*f-c*d,e[t+1]=l*m+h*d+c*u-o*f,e[t+2]=c*m+h*f+o*d-l*u,e[t+3]=h*m-o*u-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,i=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(i/2),u=o(r/2),d=l(n/2),f=l(i/2),m=l(r/2);switch(a){case"XYZ":this._x=d*h*u+c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u-d*f*m;break;case"YXZ":this._x=d*h*u+c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u+d*f*m;break;case"ZXY":this._x=d*h*u-c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u-d*f*m;break;case"ZYX":this._x=d*h*u-c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u+d*f*m;break;case"YZX":this._x=d*h*u+c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u-d*f*m;break;case"XZY":this._x=d*h*u-c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u+d*f*m;break;default:Fe("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],i=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=n+o+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(a-i)*f}else if(n>o&&n>u){let f=2*Math.sqrt(1+n-o-u);this._w=(h-l)/f,this._x=.25*f,this._y=(i+a)/f,this._z=(r+c)/f}else if(o>u){let f=2*Math.sqrt(1+o-n-u);this._w=(r-c)/f,this._x=(i+a)/f,this._y=.25*f,this._z=(l+h)/f}else{let f=2*Math.sqrt(1+u-n-o);this._w=(a-i)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(tt(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,i=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+i*c-r*l,this._y=i*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-i*o,this._w=a*h-n*o-i*l-r*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,i=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,i=-i,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){let c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+n*t,this._y=this._y*l+i*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+i*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},N=class s{static{s.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Rd.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Rd.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,i=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*i-o*n),h=2*(o*t-r*i),u=2*(r*n-a*t);return this.x=t+l*c+a*u-o*h,this.y=n+l*h+o*c-r*u,this.z=i+l*u+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=tt(this.x,e.x,t.x),this.y=tt(this.y,e.y,t.y),this.z=tt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=tt(this.x,e,t),this.y=tt(this.y,e,t),this.z=tt(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(tt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,i=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=i*l-r*o,this.y=r*a-n*l,this.z=n*o-i*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return qc.copy(this).projectOnVector(e),this.sub(qc)}reflect(e){return this.sub(qc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(tt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},qc=new N,Rd=new en,je=class s{static{s.prototype.isMatrix3=!0}constructor(e,t,n,i,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,a,o,l,c)}set(e,t,n,i,r,a,o,l,c){let h=this.elements;return h[0]=e,h[1]=i,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],m=n[8],y=i[0],g=i[3],p=i[6],S=i[1],E=i[4],M=i[7],b=i[2],T=i[5],C=i[8];return r[0]=a*y+o*S+l*b,r[3]=a*g+o*E+l*T,r[6]=a*p+o*M+l*C,r[1]=c*y+h*S+u*b,r[4]=c*g+h*E+u*T,r[7]=c*p+h*M+u*C,r[2]=d*y+f*S+m*b,r[5]=d*g+f*E+m*T,r[8]=d*p+f*M+m*C,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*r*h+n*o*l+i*r*c-i*a*l}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*a-o*c,d=o*l-h*r,f=c*r-a*l,m=t*u+n*d+i*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let y=1/m;return e[0]=u*y,e[1]=(i*c-h*n)*y,e[2]=(o*n-i*a)*y,e[3]=d*y,e[4]=(h*t-i*l)*y,e[5]=(i*r-o*t)*y,e[6]=f*y,e[7]=(n*l-c*t)*y,e[8]=(a*t-n*r)*y,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,a,o){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-i*c,i*l,-i*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return as("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Yc.makeScale(e,t)),this}rotate(e){return as("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Yc.makeRotation(-e)),this}translate(e,t){return as("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Yc.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Yc=new je,Cd=new je().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Id=new je().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Gm(){let s={enabled:!0,workingColorSpace:Zt,spaces:{},convert:function(i,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ft&&(i.r=Mi(i.r),i.g=Mi(i.g),i.b=Mi(i.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ft&&(i.r=Js(i.r),i.g=Js(i.g),i.b=Js(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Xn?Qr:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,a){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,r){return as("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(i,r)},toWorkingColorSpace:function(i,r){return as("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(i,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[Zt]:{primaries:e,whitePoint:n,transfer:Qr,toXYZ:Cd,fromXYZ:Id,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:gt},outputColorSpaceConfig:{drawingBufferColorSpace:gt}},[gt]:{primaries:e,whitePoint:n,transfer:ft,toXYZ:Cd,fromXYZ:Id,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:gt}}}),s}var it=Gm();function Mi(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Js(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}var Os,Wo=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Os===void 0&&(Os=tr("canvas")),Os.width=e.width,Os.height=e.height;let i=Os.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=Os}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=tr("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let a=0;a<r.length;a++)r[a]=Mi(r[a]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Mi(t[n]/255)*255):t[n]=Mi(t[n]);return{data:t,width:e.width,height:e.height}}else return Fe("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Hm=0,ir=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Hm++}),this.uuid=Rn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?r.push(Kc(i[a].image)):r.push(Kc(i[a]))}else r=Kc(i);n.url=r}return t||(e.images[this.uuid]=n),n}};function Kc(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Wo.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(Fe("Texture: Unable to serialize Texture."),{})}var Wm=0,Zc=new N,Nt=class s extends jn{constructor(e=s.DEFAULT_IMAGE,t=s.DEFAULT_MAPPING,n=qt,i=qt,r=bt,a=Pn,o=cn,l=pn,c=s.DEFAULT_ANISOTROPY,h=Xn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Wm++}),this.uuid=Rn(),this.name="",this.source=new ir(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new fe(0,0),this.repeat=new fe(1,1),this.center=new fe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new je,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Zc).x}get height(){return this.source.getSize(Zc).y}get depth(){return this.source.getSize(Zc).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){Fe(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let i=this[t];if(i===void 0){Fe(`Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Zh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Cn:e.x=e.x-Math.floor(e.x);break;case qt:e.x=e.x<0?0:1;break;case Qs:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Cn:e.y=e.y-Math.floor(e.y);break;case qt:e.y=e.y<0?0:1;break;case Qs:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Nt.DEFAULT_IMAGE=null;Nt.DEFAULT_MAPPING=Zh;Nt.DEFAULT_ANISOTROPY=1;var xt=class s{static{s.prototype.isVector4=!0}constructor(e=0,t=0,n=0,i=1){this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*i+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*i+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*i+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r,l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],m=l[9],y=l[2],g=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-y)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+y)<.1&&Math.abs(m+g)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let E=(c+1)/2,M=(f+1)/2,b=(p+1)/2,T=(h+d)/4,C=(u+y)/4,x=(m+g)/4;return E>M&&E>b?E<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(E),i=T/n,r=C/n):M>b?M<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(M),n=T/i,r=x/i):b<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(b),n=C/r,i=x/r),this.set(n,i,r,t),this}let S=Math.sqrt((g-m)*(g-m)+(u-y)*(u-y)+(d-h)*(d-h));return Math.abs(S)<.001&&(S=1),this.x=(g-m)/S,this.y=(u-y)/S,this.z=(d-h)/S,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=tt(this.x,e.x,t.x),this.y=tt(this.y,e.y,t.y),this.z=tt(this.z,e.z,t.z),this.w=tt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=tt(this.x,e,t),this.y=tt(this.y,e,t),this.z=tt(this.z,e,t),this.w=tt(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(tt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Xo=class extends jn{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:bt,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new xt(0,0,e,t),this.scissorTest=!1,this.viewport=new xt(0,0,e,t),this.textures=[];let i={width:e,height:t,depth:n.depth},r=new Nt(i),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:bt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let i=Object.assign({},e.textures[t].image);this.textures[t].source=new ir(i)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},un=class extends Xo{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},ta=class extends Nt{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Dt,this.minFilter=Dt,this.wrapR=qt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var qo=class extends Nt{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Dt,this.minFilter=Dt,this.wrapR=qt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var Je=class s{static{s.prototype.isMatrix4=!0}constructor(e,t,n,i,r,a,o,l,c,h,u,d,f,m,y,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,a,o,l,c,h,u,d,f,m,y,g)}set(e,t,n,i,r,a,o,l,c,h,u,d,f,m,y,g){let p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=i,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=m,p[11]=y,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new s().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,i=1/Bs.setFromMatrixColumn(e,0).length(),r=1/Bs.setFromMatrixColumn(e,1).length(),a=1/Bs.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,i=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let d=a*h,f=a*u,m=o*h,y=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=f+m*c,t[5]=d-y*c,t[9]=-o*l,t[2]=y-d*c,t[6]=m+f*c,t[10]=a*l}else if(e.order==="YXZ"){let d=l*h,f=l*u,m=c*h,y=c*u;t[0]=d+y*o,t[4]=m*o-f,t[8]=a*c,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=f*o-m,t[6]=y+d*o,t[10]=a*l}else if(e.order==="ZXY"){let d=l*h,f=l*u,m=c*h,y=c*u;t[0]=d-y*o,t[4]=-a*u,t[8]=m+f*o,t[1]=f+m*o,t[5]=a*h,t[9]=y-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let d=a*h,f=a*u,m=o*h,y=o*u;t[0]=l*h,t[4]=m*c-f,t[8]=d*c+y,t[1]=l*u,t[5]=y*c+d,t[9]=f*c-m,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let d=a*l,f=a*c,m=o*l,y=o*c;t[0]=l*h,t[4]=y-d*u,t[8]=m*u+f,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=f*u+m,t[10]=d-y*u}else if(e.order==="XZY"){let d=a*l,f=a*c,m=o*l,y=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+y,t[5]=a*h,t[9]=f*u-m,t[2]=m*u-f,t[6]=o*h,t[10]=y*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Xm,e,qm)}lookAt(e,t,n){let i=this.elements;return vn.subVectors(e,t),vn.lengthSq()===0&&(vn.z=1),vn.normalize(),Ui.crossVectors(n,vn),Ui.lengthSq()===0&&(Math.abs(n.z)===1?vn.x+=1e-4:vn.z+=1e-4,vn.normalize(),Ui.crossVectors(n,vn)),Ui.normalize(),ao.crossVectors(vn,Ui),i[0]=Ui.x,i[4]=ao.x,i[8]=vn.x,i[1]=Ui.y,i[5]=ao.y,i[9]=vn.y,i[2]=Ui.z,i[6]=ao.z,i[10]=vn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],m=n[2],y=n[6],g=n[10],p=n[14],S=n[3],E=n[7],M=n[11],b=n[15],T=i[0],C=i[4],x=i[8],w=i[12],L=i[1],I=i[5],B=i[9],F=i[13],R=i[2],k=i[6],W=i[10],Y=i[14],re=i[3],K=i[7],Q=i[11],se=i[15];return r[0]=a*T+o*L+l*R+c*re,r[4]=a*C+o*I+l*k+c*K,r[8]=a*x+o*B+l*W+c*Q,r[12]=a*w+o*F+l*Y+c*se,r[1]=h*T+u*L+d*R+f*re,r[5]=h*C+u*I+d*k+f*K,r[9]=h*x+u*B+d*W+f*Q,r[13]=h*w+u*F+d*Y+f*se,r[2]=m*T+y*L+g*R+p*re,r[6]=m*C+y*I+g*k+p*K,r[10]=m*x+y*B+g*W+p*Q,r[14]=m*w+y*F+g*Y+p*se,r[3]=S*T+E*L+M*R+b*re,r[7]=S*C+E*I+M*k+b*K,r[11]=S*x+E*B+M*W+b*Q,r[15]=S*w+E*F+M*Y+b*se,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],f=e[14],m=e[3],y=e[7],g=e[11],p=e[15],S=l*f-c*d,E=o*f-c*u,M=o*d-l*u,b=a*f-c*h,T=a*d-l*h,C=a*u-o*h;return t*(y*S-g*E+p*M)-n*(m*S-g*b+p*T)+i*(m*E-y*b+p*C)-r*(m*M-y*T+g*C)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],i=e[8],r=e[1],a=e[5],o=e[9],l=e[2],c=e[6],h=e[10];return t*(a*h-o*c)-n*(r*h-o*l)+i*(r*c-a*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],f=e[11],m=e[12],y=e[13],g=e[14],p=e[15],S=t*o-n*a,E=t*l-i*a,M=t*c-r*a,b=n*l-i*o,T=n*c-r*o,C=i*c-r*l,x=h*y-u*m,w=h*g-d*m,L=h*p-f*m,I=u*g-d*y,B=u*p-f*y,F=d*p-f*g,R=S*F-E*B+M*I+b*L-T*w+C*x;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let k=1/R;return e[0]=(o*F-l*B+c*I)*k,e[1]=(i*B-n*F-r*I)*k,e[2]=(y*C-g*T+p*b)*k,e[3]=(d*T-u*C-f*b)*k,e[4]=(l*L-a*F-c*w)*k,e[5]=(t*F-i*L+r*w)*k,e[6]=(g*M-m*C-p*E)*k,e[7]=(h*C-d*M+f*E)*k,e[8]=(a*B-o*L+c*x)*k,e[9]=(n*L-t*B-r*x)*k,e[10]=(m*T-y*M+p*S)*k,e[11]=(u*M-h*T-f*S)*k,e[12]=(o*w-a*I-l*x)*k,e[13]=(t*I-n*w+i*x)*k,e[14]=(y*E-m*b-g*S)*k,e[15]=(h*b-u*E+d*S)*k,this}scale(e){let t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),i=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,h*o+n,h*l-i*a,0,c*l-i*o,h*l+i*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,a){return this.set(1,n,r,0,e,1,a,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){let i=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,u=o+o,d=r*c,f=r*h,m=r*u,y=a*h,g=a*u,p=o*u,S=l*c,E=l*h,M=l*u,b=n.x,T=n.y,C=n.z;return i[0]=(1-(y+p))*b,i[1]=(f+M)*b,i[2]=(m-E)*b,i[3]=0,i[4]=(f-M)*T,i[5]=(1-(d+p))*T,i[6]=(g+S)*T,i[7]=0,i[8]=(m+E)*C,i[9]=(g-S)*C,i[10]=(1-(d+y))*C,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){let i=this.elements;e.x=i[12],e.y=i[13],e.z=i[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let a=Bs.set(i[0],i[1],i[2]).length(),o=Bs.set(i[4],i[5],i[6]).length(),l=Bs.set(i[8],i[9],i[10]).length();r<0&&(a=-a),Un.copy(this);let c=1/a,h=1/o,u=1/l;return Un.elements[0]*=c,Un.elements[1]*=c,Un.elements[2]*=c,Un.elements[4]*=h,Un.elements[5]*=h,Un.elements[6]*=h,Un.elements[8]*=u,Un.elements[9]*=u,Un.elements[10]*=u,t.setFromRotationMatrix(Un),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,i,r,a,o=zn,l=!1){let c=this.elements,h=2*r/(t-e),u=2*r/(n-i),d=(t+e)/(t-e),f=(n+i)/(n-i),m,y;if(l)m=r/(a-r),y=a*r/(a-r);else if(o===zn)m=-(a+r)/(a-r),y=-2*a*r/(a-r);else if(o===er)m=-a/(a-r),y=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=y,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,i,r,a,o=zn,l=!1){let c=this.elements,h=2/(t-e),u=2/(n-i),d=-(t+e)/(t-e),f=-(n+i)/(n-i),m,y;if(l)m=1/(a-r),y=a/(a-r);else if(o===zn)m=-2/(a-r),y=-(a+r)/(a-r);else if(o===er)m=-1/(a-r),y=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=m,c[14]=y,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Bs=new N,Un=new Je,Xm=new N(0,0,0),qm=new N(1,1,1),Ui=new N,ao=new N,vn=new N,Pd=new Je,Ld=new en,Si=class s{constructor(e=0,t=0,n=0,i=s.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let i=e.elements,r=i[0],a=i[4],o=i[8],l=i[1],c=i[5],h=i[9],u=i[2],d=i[6],f=i[10];switch(t){case"XYZ":this._y=Math.asin(tt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-tt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(tt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-tt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(tt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-tt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Fe("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Pd.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Pd,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Ld.setFromEuler(this),this.setFromQuaternion(Ld,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Si.DEFAULT_ORDER="XYZ";var sr=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Ym=0,Dd=new N,ks=new en,pi=new Je,oo=new N,zr=new N,Km=new N,Zm=new en,Nd=new N(1,0,0),Ud=new N(0,1,0),Fd=new N(0,0,1),Od={type:"added"},$m={type:"removed"},zs={type:"childadded",child:null},$c={type:"childremoved",child:null},Pt=class s extends jn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Ym++}),this.uuid=Rn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=s.DEFAULT_UP.clone();let e=new N,t=new Si,n=new en,i=new N(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Je},normalMatrix:{value:new je}}),this.matrix=new Je,this.matrixWorld=new Je,this.matrixAutoUpdate=s.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=s.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new sr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ks.setFromAxisAngle(e,t),this.quaternion.multiply(ks),this}rotateOnWorldAxis(e,t){return ks.setFromAxisAngle(e,t),this.quaternion.premultiply(ks),this}rotateX(e){return this.rotateOnAxis(Nd,e)}rotateY(e){return this.rotateOnAxis(Ud,e)}rotateZ(e){return this.rotateOnAxis(Fd,e)}translateOnAxis(e,t){return Dd.copy(e).applyQuaternion(this.quaternion),this.position.add(Dd.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Nd,e)}translateY(e){return this.translateOnAxis(Ud,e)}translateZ(e){return this.translateOnAxis(Fd,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(pi.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?oo.copy(e):oo.set(e,t,n);let i=this.parent;this.updateWorldMatrix(!0,!1),zr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?pi.lookAt(zr,oo,this.up):pi.lookAt(oo,zr,this.up),this.quaternion.setFromRotationMatrix(pi),i&&(pi.extractRotation(i.matrixWorld),ks.setFromRotationMatrix(pi),this.quaternion.premultiply(ks.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Ke("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Od),zs.child=e,this.dispatchEvent(zs),zs.child=null):Ke("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent($m),$c.child=e,this.dispatchEvent($c),$c.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),pi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),pi.multiply(e.parent.matrixWorld)),e.applyMatrix4(pi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Od),zs.child=e,this.dispatchEvent(zs),zs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){let a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(zr,e,Km),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(zr,Zm,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,i=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*i,r[13]+=n-r[1]*t-r[5]*n-r[9]*i,r[14]+=i-r[2]*t-r[6]*n-r[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let i={};i.uuid=this.uuid,i.type=this.type,i.name=this.name,i.castShadow=this.castShadow,i.receiveShadow=this.receiveShadow,i.visible=this.visible,i.frustumCulled=this.frustumCulled,i.renderOrder=this.renderOrder,i.static=this.static,i.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(o=>({...o})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));i.material=o}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];i.animations.push(r(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),u=a(e.shapes),d=a(e.skeletons),f=a(e.animations),m=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),m.length>0&&(n.nodes=m)}return n.object=i,n;function a(o){let l=[];for(let c in o){let h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let i=e.children[n];this.add(i.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Pt.DEFAULT_UP=new N(0,1,0);Pt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Pt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var It=class extends Pt{constructor(){super(),this.isGroup=!0,this.type="Group"}},Jm={type:"move"},rr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new It,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new It,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new N,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new N),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new It,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new N,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new N,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let y of e.hand.values()){let g=t.getJointPose(y,n),p=this._getHandJoint(c,y);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,m=.005;c.inputState.pinching&&d>f+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Jm)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new It;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},tp={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Fi={h:0,s:0,l:0},lo={h:0,s:0,l:0};function Jc(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}var He=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=gt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,it.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=it.workingColorSpace){return this.r=e,this.g=t,this.b=n,it.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=it.workingColorSpace){if(e=au(e,1),t=tt(t,0,1),n=tt(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=Jc(a,r,e+1/3),this.g=Jc(a,r,e),this.b=Jc(a,r,e-1/3)}return it.colorSpaceToWorking(this,i),this}setStyle(e,t=gt){function n(r){r!==void 0&&parseFloat(r)<1&&Fe("Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Fe("Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=i[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Fe("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=gt){let n=tp[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Fe("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Mi(e.r),this.g=Mi(e.g),this.b=Mi(e.b),this}copyLinearToSRGB(e){return this.r=Js(e.r),this.g=Js(e.g),this.b=Js(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=gt){return it.workingToColorSpace(Qt.copy(this),e),Math.round(tt(Qt.r*255,0,255))*65536+Math.round(tt(Qt.g*255,0,255))*256+Math.round(tt(Qt.b*255,0,255))}getHexString(e=gt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=it.workingColorSpace){it.workingToColorSpace(Qt.copy(this),t);let n=Qt.r,i=Qt.g,r=Qt.b,a=Math.max(n,i,r),o=Math.min(n,i,r),l,c,h=(o+a)/2;if(o===a)l=0,c=0;else{let u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case n:l=(i-r)/u+(i<r?6:0);break;case i:l=(r-n)/u+2;break;case r:l=(n-i)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=it.workingColorSpace){return it.workingToColorSpace(Qt.copy(this),t),e.r=Qt.r,e.g=Qt.g,e.b=Qt.b,e}getStyle(e=gt){it.workingToColorSpace(Qt.copy(this),e);let t=Qt.r,n=Qt.g,i=Qt.b;return e!==gt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(Fi),this.setHSL(Fi.h+e,Fi.s+t,Fi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Fi),e.getHSL(lo);let n=$r(Fi.h,lo.h,t),i=$r(Fi.s,lo.s,t),r=$r(Fi.l,lo.l,t);return this.setHSL(n,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*i,this.g=r[1]*t+r[4]*n+r[7]*i,this.b=r[2]*t+r[5]*n+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Qt=new He;He.NAMES=tp;var na=class s{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new He(e),this.near=t,this.far=n}clone(){return new s(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},hs=class extends Pt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Si,this.environmentIntensity=1,this.environmentRotation=new Si,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Fn=new N,mi=new N,jc=new N,gi=new N,Vs=new N,Gs=new N,Bd=new N,Qc=new N,eh=new N,th=new N,nh=new xt,ih=new xt,sh=new xt,Vi=class s{constructor(e=new N,t=new N,n=new N){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),Fn.subVectors(e,t),i.cross(Fn);let r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){Fn.subVectors(i,t),mi.subVectors(n,t),jc.subVectors(e,t);let a=Fn.dot(Fn),o=Fn.dot(mi),l=Fn.dot(jc),c=mi.dot(mi),h=mi.dot(jc),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;let d=1/u,f=(c*l-o*h)*d,m=(a*h-o*l)*d;return r.set(1-f-m,m,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,gi)===null?!1:gi.x>=0&&gi.y>=0&&gi.x+gi.y<=1}static getInterpolation(e,t,n,i,r,a,o,l){return this.getBarycoord(e,t,n,i,gi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,gi.x),l.addScaledVector(a,gi.y),l.addScaledVector(o,gi.z),l)}static getInterpolatedAttribute(e,t,n,i,r,a){return nh.setScalar(0),ih.setScalar(0),sh.setScalar(0),nh.fromBufferAttribute(e,t),ih.fromBufferAttribute(e,n),sh.fromBufferAttribute(e,i),a.setScalar(0),a.addScaledVector(nh,r.x),a.addScaledVector(ih,r.y),a.addScaledVector(sh,r.z),a}static isFrontFacing(e,t,n,i){return Fn.subVectors(n,t),mi.subVectors(e,t),Fn.cross(mi).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Fn.subVectors(this.c,this.b),mi.subVectors(this.a,this.b),Fn.cross(mi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return s.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return s.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,r){return s.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return s.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return s.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,i=this.b,r=this.c,a,o;Vs.subVectors(i,n),Gs.subVectors(r,n),Qc.subVectors(e,n);let l=Vs.dot(Qc),c=Gs.dot(Qc);if(l<=0&&c<=0)return t.copy(n);eh.subVectors(e,i);let h=Vs.dot(eh),u=Gs.dot(eh);if(h>=0&&u<=h)return t.copy(i);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(Vs,a);th.subVectors(e,r);let f=Vs.dot(th),m=Gs.dot(th);if(m>=0&&f<=m)return t.copy(r);let y=f*c-l*m;if(y<=0&&c>=0&&m<=0)return o=c/(c-m),t.copy(n).addScaledVector(Gs,o);let g=h*m-f*u;if(g<=0&&u-h>=0&&f-m>=0)return Bd.subVectors(r,i),o=(u-h)/(u-h+(f-m)),t.copy(i).addScaledVector(Bd,o);let p=1/(g+y+d);return a=y*p,o=d*p,t.copy(n).addScaledVector(Vs,a).addScaledVector(Gs,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},$t=class{constructor(e=new N(1/0,1/0,1/0),t=new N(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(On.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(On.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=On.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,On):On.fromBufferAttribute(r,a),On.applyMatrix4(e.matrixWorld),this.expandByPoint(On);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),co.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),co.copy(n.boundingBox)),co.applyMatrix4(e.matrixWorld),this.union(co)}let i=e.children;for(let r=0,a=i.length;r<a;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,On),On.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Vr),ho.subVectors(this.max,Vr),Hs.subVectors(e.a,Vr),Ws.subVectors(e.b,Vr),Xs.subVectors(e.c,Vr),Oi.subVectors(Ws,Hs),Bi.subVectors(Xs,Ws),ts.subVectors(Hs,Xs);let t=[0,-Oi.z,Oi.y,0,-Bi.z,Bi.y,0,-ts.z,ts.y,Oi.z,0,-Oi.x,Bi.z,0,-Bi.x,ts.z,0,-ts.x,-Oi.y,Oi.x,0,-Bi.y,Bi.x,0,-ts.y,ts.x,0];return!rh(t,Hs,Ws,Xs,ho)||(t=[1,0,0,0,1,0,0,0,1],!rh(t,Hs,Ws,Xs,ho))?!1:(uo.crossVectors(Oi,Bi),t=[uo.x,uo.y,uo.z],rh(t,Hs,Ws,Xs,ho))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,On).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(On).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(xi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),xi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),xi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),xi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),xi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),xi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),xi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),xi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(xi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},xi=[new N,new N,new N,new N,new N,new N,new N,new N],On=new N,co=new $t,Hs=new N,Ws=new N,Xs=new N,Oi=new N,Bi=new N,ts=new N,Vr=new N,ho=new N,uo=new N,ns=new N;function rh(s,e,t,n,i){for(let r=0,a=s.length-3;r<=a;r+=3){ns.fromArray(s,r);let o=i.x*Math.abs(ns.x)+i.y*Math.abs(ns.y)+i.z*Math.abs(ns.z),l=e.dot(ns),c=t.dot(ns),h=n.dot(ns);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}var yi=jm();function jm(){let s=new ArrayBuffer(4),e=new Float32Array(s),t=new Uint32Array(s),n=new Uint32Array(512),i=new Uint32Array(512);for(let l=0;l<256;++l){let c=l-127;c<-27?(n[l]=0,n[l|256]=32768,i[l]=24,i[l|256]=24):c<-14?(n[l]=1024>>-c-14,n[l|256]=1024>>-c-14|32768,i[l]=-c-1,i[l|256]=-c-1):c<=15?(n[l]=c+15<<10,n[l|256]=c+15<<10|32768,i[l]=13,i[l|256]=13):c<128?(n[l]=31744,n[l|256]=64512,i[l]=24,i[l|256]=24):(n[l]=31744,n[l|256]=64512,i[l]=13,i[l|256]=13)}let r=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,h=0;for(;(c&8388608)===0;)c<<=1,h-=8388608;c&=-8388609,h+=947912704,r[l]=c|h}for(let l=1024;l<2048;++l)r[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)a[l]=l<<23;a[31]=1199570944,a[32]=2147483648;for(let l=33;l<63;++l)a[l]=2147483648+(l-32<<23);a[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(o[l]=1024);return{floatView:e,uint32View:t,baseTable:n,shiftTable:i,mantissaTable:r,exponentTable:a,offsetTable:o}}function Qm(s){Math.abs(s)>65504&&Fe("DataUtils.toHalfFloat(): Value out of range."),s=tt(s,-65504,65504),yi.floatView[0]=s;let e=yi.uint32View[0],t=e>>23&511;return yi.baseTable[t]+((e&8388607)>>yi.shiftTable[t])}function eg(s){let e=s>>10;return yi.uint32View[0]=yi.mantissaTable[yi.offsetTable[e]+(s&1023)]+yi.exponentTable[e],yi.floatView[0]}var Gi=class{static toHalfFloat(e){return Qm(e)}static fromHalfFloat(e){return eg(e)}},kt=new N,fo=new fe,tg=0,Et=class extends jn{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:tg++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=iu,this.updateRanges=[],this.gpuType=Kt,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)fo.fromBufferAttribute(this,t),fo.applyMatrix3(e),this.setXY(t,fo.x,fo.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)kt.fromBufferAttribute(this,t),kt.applyMatrix3(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)kt.fromBufferAttribute(this,t),kt.applyMatrix4(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)kt.fromBufferAttribute(this,t),kt.applyNormalMatrix(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)kt.fromBufferAttribute(this,t),kt.transformDirection(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=kn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=mt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=kn(t,this.array)),t}setX(e,t){return this.normalized&&(t=mt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=kn(t,this.array)),t}setY(e,t){return this.normalized&&(t=mt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=kn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=mt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=kn(t,this.array)),t}setW(e,t){return this.normalized&&(t=mt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=mt(t,this.array),n=mt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=mt(t,this.array),n=mt(n,this.array),i=mt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=mt(t,this.array),n=mt(n,this.array),i=mt(i,this.array),r=mt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}};var ia=class extends Et{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var sa=class extends Et{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var lt=class extends Et{constructor(e,t,n){super(new Float32Array(e),t,n)}},ng=new $t,Gr=new N,ah=new N,dn=class{constructor(e=new N,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):ng.setFromPoints(e).getCenter(n);let i=0;for(let r=0,a=e.length;r<a;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Gr.subVectors(e,this.center);let t=Gr.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(Gr,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ah.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Gr.copy(e.center).add(ah)),this.expandByPoint(Gr.copy(e.center).sub(ah))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},ig=0,An=new Je,oh=new Pt,qs=new N,yn=new $t,Hr=new $t,Xt=new N,Tt=class s extends jn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:ig++}),this.uuid=Rn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Tm(e)?sa:ia)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new je().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return An.makeRotationFromQuaternion(e),this.applyMatrix4(An),this}rotateX(e){return An.makeRotationX(e),this.applyMatrix4(An),this}rotateY(e){return An.makeRotationY(e),this.applyMatrix4(An),this}rotateZ(e){return An.makeRotationZ(e),this.applyMatrix4(An),this}translate(e,t,n){return An.makeTranslation(e,t,n),this.applyMatrix4(An),this}scale(e,t,n){return An.makeScale(e,t,n),this.applyMatrix4(An),this}lookAt(e){return oh.lookAt(e),oh.updateMatrix(),this.applyMatrix4(oh.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(qs).negate(),this.translate(qs.x,qs.y,qs.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let i=0,r=e.length;i<r;i++){let a=e[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new lt(n,3))}else{let n=Math.min(e.length,t.count);for(let i=0;i<n;i++){let r=e[i];t.setXYZ(i,r.x,r.y,r.z||0)}e.length>t.count&&Fe("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new $t);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ke("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new N(-1/0,-1/0,-1/0),new N(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){let r=t[n];yn.setFromBufferAttribute(r),this.morphTargetsRelative?(Xt.addVectors(this.boundingBox.min,yn.min),this.boundingBox.expandByPoint(Xt),Xt.addVectors(this.boundingBox.max,yn.max),this.boundingBox.expandByPoint(Xt)):(this.boundingBox.expandByPoint(yn.min),this.boundingBox.expandByPoint(yn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ke('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new dn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ke("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new N,1/0);return}if(e){let n=this.boundingSphere.center;if(yn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];Hr.setFromBufferAttribute(o),this.morphTargetsRelative?(Xt.addVectors(yn.min,Hr.min),yn.expandByPoint(Xt),Xt.addVectors(yn.max,Hr.max),yn.expandByPoint(Xt)):(yn.expandByPoint(Hr.min),yn.expandByPoint(Hr.max))}yn.getCenter(n);let i=0;for(let r=0,a=e.count;r<a;r++)Xt.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(Xt));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Xt.fromBufferAttribute(o,c),l&&(qs.fromBufferAttribute(e,c),Xt.add(qs)),i=Math.max(i,n.distanceToSquared(Xt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&Ke('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Ke("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,i=t.normal,r=t.uv,a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new Et(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));let o=[],l=[];for(let x=0;x<n.count;x++)o[x]=new N,l[x]=new N;let c=new N,h=new N,u=new N,d=new fe,f=new fe,m=new fe,y=new N,g=new N;function p(x,w,L){c.fromBufferAttribute(n,x),h.fromBufferAttribute(n,w),u.fromBufferAttribute(n,L),d.fromBufferAttribute(r,x),f.fromBufferAttribute(r,w),m.fromBufferAttribute(r,L),h.sub(c),u.sub(c),f.sub(d),m.sub(d);let I=1/(f.x*m.y-m.x*f.y);isFinite(I)&&(y.copy(h).multiplyScalar(m.y).addScaledVector(u,-f.y).multiplyScalar(I),g.copy(u).multiplyScalar(f.x).addScaledVector(h,-m.x).multiplyScalar(I),o[x].add(y),o[w].add(y),o[L].add(y),l[x].add(g),l[w].add(g),l[L].add(g))}let S=this.groups;S.length===0&&(S=[{start:0,count:e.count}]);for(let x=0,w=S.length;x<w;++x){let L=S[x],I=L.start,B=L.count;for(let F=I,R=I+B;F<R;F+=3)p(e.getX(F+0),e.getX(F+1),e.getX(F+2))}let E=new N,M=new N,b=new N,T=new N;function C(x){b.fromBufferAttribute(i,x),T.copy(b);let w=o[x];E.copy(w),E.sub(b.multiplyScalar(b.dot(w))).normalize(),M.crossVectors(T,w);let I=M.dot(l[x])<0?-1:1;a.setXYZW(x,E.x,E.y,E.z,I)}for(let x=0,w=S.length;x<w;++x){let L=S[x],I=L.start,B=L.count;for(let F=I,R=I+B;F<R;F+=3)C(e.getX(F+0)),C(e.getX(F+1)),C(e.getX(F+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new Et(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let i=new N,r=new N,a=new N,o=new N,l=new N,c=new N,h=new N,u=new N;if(e)for(let d=0,f=e.count;d<f;d+=3){let m=e.getX(d+0),y=e.getX(d+1),g=e.getX(d+2);i.fromBufferAttribute(t,m),r.fromBufferAttribute(t,y),a.fromBufferAttribute(t,g),h.subVectors(a,r),u.subVectors(i,r),h.cross(u),o.fromBufferAttribute(n,m),l.fromBufferAttribute(n,y),c.fromBufferAttribute(n,g),o.add(h),l.add(h),c.add(h),n.setXYZ(m,o.x,o.y,o.z),n.setXYZ(y,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)i.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,r),u.subVectors(i,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Xt.fromBufferAttribute(e,t),Xt.normalize(),e.setXYZ(t,Xt.x,Xt.y,Xt.z)}toNonIndexed(){function e(o,l){let c=o.array,h=o.itemSize,u=o.normalized,d=new c.constructor(l.length*h),f=0,m=0;for(let y=0,g=l.length;y<g;y++){o.isInterleavedBufferAttribute?f=l[y]*o.data.stride+o.offset:f=l[y]*h;for(let p=0;p<h;p++)d[m++]=c[f++]}return new Et(d,h,u)}if(this.index===null)return Fe("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new s,n=this.index.array,i=this.attributes;for(let o in i){let l=i[o],c=e(l,n);t.setAttribute(o,c)}let r=this.morphAttributes;for(let o in r){let l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){let d=c[h],f=e(d,n);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let i={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let f=c[u];h.push(f.toJSON(e.data))}h.length>0&&(i[l]=h,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let i=e.attributes;for(let c in i){let h=i[c];this.setAttribute(c,h.clone(t))}let r=e.morphAttributes;for(let c in r){let h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,h=a.length;c<h;c++){let u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},ar=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=iu,this.updateRanges=[],this.version=0,this.uuid=Rn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,r=this.stride;i<r;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Rn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Rn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}},rn=new N,or=class s{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)rn.fromBufferAttribute(this,t),rn.applyMatrix4(e),this.setXYZ(t,rn.x,rn.y,rn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)rn.fromBufferAttribute(this,t),rn.applyNormalMatrix(e),this.setXYZ(t,rn.x,rn.y,rn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)rn.fromBufferAttribute(this,t),rn.transformDirection(e),this.setXYZ(t,rn.x,rn.y,rn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=kn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=mt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=mt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=mt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=mt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=mt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=kn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=kn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=kn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=kn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=mt(t,this.array),n=mt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=mt(t,this.array),n=mt(n,this.array),i=mt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=mt(t,this.array),n=mt(n,this.array),i=mt(i,this.array),r=mt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=r,this}clone(e){if(e===void 0){ea("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return new Et(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new s(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){ea("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},lh=new N,sg=new N,rg=new je,Bn=class{constructor(e=new N(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let i=lh.subVectors(n,t).cross(sg.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let i=e.delta(lh),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(i,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||rg.getNormalMatrix(e),i=this.coplanarPoint(lh).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},ag=0,an=class extends jn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ag++}),this.uuid=Rn(),this.name="",this.type="Material",this.blending=_r,this.side=si,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=zh,this.blendDst=Vh,this.blendEquation=ys,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new He(0,0,0),this.blendAlpha=0,this.depthFunc=js,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Wf,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Uo,this.stencilZFail=Uo,this.stencilZPass=Uo,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){Fe(`Material: parameter '${t}' has value of undefined.`);continue}let i=this[t];if(i===void 0){Fe(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(t){let r=i(e.textures),a=i(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new He().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new Bn().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new fe().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new fe().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}};var _i=new N,ch=new N,po=new N,mo=new N,Hi=class{constructor(e=new N,t=new N(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,_i)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=_i.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(_i.copy(this.origin).addScaledVector(this.direction,t),_i.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){ch.copy(e).add(t).multiplyScalar(.5),po.copy(t).sub(e).normalize(),mo.copy(this.origin).sub(ch);let r=e.distanceTo(t)*.5,a=-this.direction.dot(po),o=mo.dot(this.direction),l=-mo.dot(po),c=mo.lengthSq(),h=Math.abs(1-a*a),u,d,f,m;if(h>0)if(u=a*l-o,d=a*o-l,m=r*h,u>=0)if(d>=-m)if(d<=m){let y=1/h;u*=y,d*=y,f=u*(u+a*d+2*o)+d*(a*u+d+2*l)+c}else d=r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d<=-m?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=m?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(ch).addScaledVector(po,d),f}intersectSphere(e,t){if(e.radius<0)return null;_i.subVectors(e.center,this.origin);let n=_i.dot(this.direction),i=_i.dot(_i)-n*n,r=e.radius*e.radius;if(i>r)return null;let a=Math.sqrt(r-i),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,a,o,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,i=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,i=(e.min.x-d.x)*c),h>=0?(r=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),n>a||r>i||((r>n||isNaN(n))&&(n=r),(a<i||isNaN(i))&&(i=a),u>=0?(o=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,_i)!==null}intersectTriangle(e,t,n,i,r){let a=this.origin,o=this.direction,l=o.x,c=o.y,h=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,m=t.x-a.x,y=t.y-a.y,g=t.z-a.z,p=n.x-a.x,S=n.y-a.y,E=n.z-a.z,M=Math.abs(l),b=Math.abs(c),T=Math.abs(h),C,x,w,L,I,B,F,R,k,W,Y,re;if(M>=b&&M>=T?(w=l,B=u,k=m,re=p,l>=0?(C=c,x=h,L=d,I=f,F=y,R=g,W=S,Y=E):(C=h,x=c,L=f,I=d,F=g,R=y,W=E,Y=S)):b>=T?(w=c,B=d,k=y,re=S,c>=0?(C=h,x=l,L=f,I=u,F=g,R=m,W=E,Y=p):(C=l,x=h,L=u,I=f,F=m,R=g,W=p,Y=E)):(w=h,B=f,k=g,re=E,h>=0?(C=l,x=c,L=u,I=d,F=m,R=y,W=p,Y=S):(C=c,x=l,L=d,I=u,F=y,R=m,W=S,Y=p)),w===0)return null;let K=C/w,Q=x/w,se=1/w,ue=L-K*B,we=I-Q*B,Ge=F-K*k,Se=R-Q*k,at=W-K*re,J=Y-Q*re,ee=at*Se-J*Ge,ye=ue*J-we*at,ze=Ge*we-Se*ue;if(i){if(ee<0||ye<0||ze<0)return null}else if((ee<0||ye<0||ze<0)&&(ee>0||ye>0||ze>0))return null;let Ae=ee+ye+ze;if(Ae===0)return null;let qe=se*(ee*B+ye*k+ze*re);return(Ae>0?qe<0:qe>0)?null:this.at(qe/Ae,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Vt=class extends an{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new He(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Si,this.combine=Gh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},kd=new Je,is=new Hi,go=new dn,zd=new N,xo=new N,_o=new N,vo=new N,hh=new N,yo=new N,Vd=new N,Mo=new N,pt=class extends Pt{constructor(e=new Tt,t=new Vt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){let o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(i,e);let o=this.morphTargetInfluences;if(r&&o){yo.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=o[l],u=r[l];h!==0&&(hh.fromBufferAttribute(u,e),a?yo.addScaledVector(hh,h):yo.addScaledVector(hh.sub(t),h))}t.add(yo)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),go.copy(n.boundingSphere),go.applyMatrix4(r),is.copy(e.ray).recast(e.near),!(go.containsPoint(is.origin)===!1&&(is.intersectSphere(go,zd)===null||is.origin.distanceToSquared(zd)>(e.far-e.near)**2))&&(kd.copy(r).invert(),is.copy(e.ray).applyMatrix4(kd),!(n.boundingBox!==null&&is.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,is)))}_computeIntersections(e,t,n){let i,r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,y=d.length;m<y;m++){let g=d[m],p=a[g.materialIndex],S=Math.max(g.start,f.start),E=Math.min(o.count,Math.min(g.start+g.count,f.start+f.count));for(let M=S,b=E;M<b;M+=3){let T=o.getX(M),C=o.getX(M+1),x=o.getX(M+2);i=So(this,p,e,n,c,h,u,T,C,x),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=g.materialIndex,t.push(i))}}else{let m=Math.max(0,f.start),y=Math.min(o.count,f.start+f.count);for(let g=m,p=y;g<p;g+=3){let S=o.getX(g),E=o.getX(g+1),M=o.getX(g+2);i=So(this,a,e,n,c,h,u,S,E,M),i&&(i.faceIndex=Math.floor(g/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(a))for(let m=0,y=d.length;m<y;m++){let g=d[m],p=a[g.materialIndex],S=Math.max(g.start,f.start),E=Math.min(l.count,Math.min(g.start+g.count,f.start+f.count));for(let M=S,b=E;M<b;M+=3){let T=M,C=M+1,x=M+2;i=So(this,p,e,n,c,h,u,T,C,x),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=g.materialIndex,t.push(i))}}else{let m=Math.max(0,f.start),y=Math.min(l.count,f.start+f.count);for(let g=m,p=y;g<p;g+=3){let S=g,E=g+1,M=g+2;i=So(this,a,e,n,c,h,u,S,E,M),i&&(i.faceIndex=Math.floor(g/3),t.push(i))}}}};function og(s,e,t,n,i,r,a,o){let l;if(e.side===on?l=n.intersectTriangle(a,r,i,!0,o):l=n.intersectTriangle(i,r,a,e.side===si,o),l===null)return null;Mo.copy(o),Mo.applyMatrix4(s.matrixWorld);let c=t.ray.origin.distanceTo(Mo);return c<t.near||c>t.far?null:{distance:c,point:Mo.clone(),object:s}}function So(s,e,t,n,i,r,a,o,l,c){s.getVertexPosition(o,xo),s.getVertexPosition(l,_o),s.getVertexPosition(c,vo);let h=og(s,e,t,n,xo,_o,vo,Vd);if(h){let u=new N;Vi.getBarycoord(Vd,xo,_o,vo,u),i&&(h.uv=Vi.getInterpolatedAttribute(i,o,l,c,u,new fe)),r&&(h.uv1=Vi.getInterpolatedAttribute(r,o,l,c,u,new fe)),a&&(h.normal=Vi.getInterpolatedAttribute(a,o,l,c,u,new N),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a:o,b:l,c,normal:new N,materialIndex:0};Vi.getNormal(xo,_o,vo,d.normal),h.face=d,h.barycoord=u}return h}var Wr=new xt,Gd=new xt,Hd=new xt,lg=new xt,Wd=new Je,bo=new N,uh=new dn,Xd=new Je,dh=new Hi,ra=class extends pt{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=vh,this.bindMatrix=new Je,this.bindMatrixInverse=new Je,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new $t),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,bo),this.boundingBox.expandByPoint(bo)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new dn),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,bo),this.boundingSphere.expandByPoint(bo)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),uh.copy(this.boundingSphere),uh.applyMatrix4(i),e.ray.intersectsSphere(uh)!==!1&&(Xd.copy(i).invert(),dh.copy(e.ray).applyMatrix4(Xd),!(this.boundingBox!==null&&dh.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,dh)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new xt,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);let r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===vh?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===zf?this.bindMatrixInverse.copy(this.bindMatrix).invert():Fe("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,i=this.geometry;Gd.fromBufferAttribute(i.attributes.skinIndex,e),Hd.fromBufferAttribute(i.attributes.skinWeight,e),t.isVector4?(Wr.copy(t),t.set(0,0,0,0)):(Wr.set(...t,1),t.set(0,0,0)),Wr.applyMatrix4(this.bindMatrix);for(let r=0;r<4;r++){let a=Hd.getComponent(r);if(a!==0){let o=Gd.getComponent(r);Wd.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector(lg.copy(Wr).applyMatrix4(Wd),a)}}return t.isVector4&&(t.w=Wr.w),t.applyMatrix4(this.bindMatrixInverse)}},lr=class extends Pt{constructor(){super(),this.isBone=!0,this.type="Bone"}},Qn=class extends Nt{constructor(e=null,t=1,n=1,i,r,a,o,l,c=Dt,h=Dt,u,d){super(null,a,o,l,c,h,i,r,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},qd=new Je,cg=new Je,aa=class s{constructor(e=[],t=[]){this.uuid=Rn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){Fe("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new Je)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let n=new Je;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let r=0,a=e.length;r<a;r++){let o=e[r]?e[r].matrixWorld:cg;qd.multiplyMatrices(o,t[r]),qd.toArray(n,r*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new s(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new Qn(t,e,e,cn,Kt);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){let r=e.bones[n],a=t[r];a===void 0&&(Fe("Skeleton: No bone found with UUID:",r),a=new lr),this.bones.push(a),this.boneInverses.push(new Je().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let i=0,r=t.length;i<r;i++){let a=t[i];e.bones.push(a.uuid);let o=n[i];e.boneInverses.push(o.toArray())}return e}},bi=class extends Et{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Ys=new Je,Yd=new Je,To=[],Kd=new $t,hg=new Je,Xr=new pt,qr=new dn,oa=class extends pt{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new bi(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,hg)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new $t),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ys),Kd.copy(e.boundingBox).applyMatrix4(Ys),this.boundingBox.union(Kd)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new dn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ys),qr.copy(e.boundingSphere).applyMatrix4(Ys),this.boundingSphere.union(qr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=i[a+o]}raycast(e,t){let n=this.matrixWorld,i=this.count;if(Xr.geometry=this.geometry,Xr.material=this.material,Xr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),qr.copy(this.boundingSphere),qr.applyMatrix4(n),e.ray.intersectsSphere(qr)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,Ys),Yd.multiplyMatrices(n,Ys),Xr.matrixWorld=Yd,Xr.raycast(e,To);for(let a=0,o=To.length;a<o;a++){let l=To[a];l.instanceId=r,l.object=this,t.push(l)}To.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new bi(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new Qn(new Float32Array(i*this.count),i,this.count,vl,Kt));let r=this.morphTexture.source.data.data,a=0;for(let c=0;c<n.length;c++)a+=n[c];let o=this.geometry.morphTargetsRelative?1:1-a,l=i*e;return r[l]=o,r.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},ss=new dn,ug=new fe(.5,.5),wo=new N,cr=class{constructor(e=new Bn,t=new Bn,n=new Bn,i=new Bn,r=new Bn,a=new Bn){this.planes=[e,t,n,i,r,a]}set(e,t,n,i,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(i),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=zn,n=!1){let i=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],u=r[5],d=r[6],f=r[7],m=r[8],y=r[9],g=r[10],p=r[11],S=r[12],E=r[13],M=r[14],b=r[15];if(i[0].setComponents(c-a,f-h,p-m,b-S).normalize(),i[1].setComponents(c+a,f+h,p+m,b+S).normalize(),i[2].setComponents(c+o,f+u,p+y,b+E).normalize(),i[3].setComponents(c-o,f-u,p-y,b-E).normalize(),n)i[4].setComponents(l,d,g,M).normalize(),i[5].setComponents(c-l,f-d,p-g,b-M).normalize();else if(i[4].setComponents(c-l,f-d,p-g,b-M).normalize(),t===zn)i[5].setComponents(c+l,f+d,p+g,b+M).normalize();else if(t===er)i[5].setComponents(l,d,g,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ss.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ss.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ss)}intersectsSprite(e){ss.center.set(0,0,0);let t=ug.distanceTo(e.center);return ss.radius=.7071067811865476+t,ss.applyMatrix4(e.matrixWorld),this.intersectsSphere(ss)}intersectsSphere(e){let t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let i=t[n];if(wo.x=i.normal.x>0?e.max.x:e.min.x,wo.y=i.normal.y>0?e.max.y:e.min.y,wo.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(wo)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var hr=class extends an{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new He(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Yo=new N,Ko=new N,Zd=new Je,Yr=new Hi,Eo=new dn,fh=new N,$d=new N,us=class extends Pt{constructor(e=new Tt,t=new hr){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let i=1,r=t.count;i<r;i++)Yo.fromBufferAttribute(t,i-1),Ko.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=Yo.distanceTo(Ko);e.setAttribute("lineDistance",new lt(n,1))}else Fe("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,i=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Eo.copy(n.boundingSphere),Eo.applyMatrix4(i),Eo.radius+=r,e.ray.intersectsSphere(Eo)===!1)return;Zd.copy(i).invert(),Yr.copy(e.ray).applyMatrix4(Zd);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){let f=Math.max(0,a.start),m=Math.min(h.count,a.start+a.count);for(let y=f,g=m-1;y<g;y+=c){let p=h.getX(y),S=h.getX(y+1),E=Ao(this,e,Yr,l,p,S,y);E&&t.push(E)}if(this.isLineLoop){let y=h.getX(m-1),g=h.getX(f),p=Ao(this,e,Yr,l,y,g,m-1);p&&t.push(p)}}else{let f=Math.max(0,a.start),m=Math.min(d.count,a.start+a.count);for(let y=f,g=m-1;y<g;y+=c){let p=Ao(this,e,Yr,l,y,y+1,y);p&&t.push(p)}if(this.isLineLoop){let y=Ao(this,e,Yr,l,m-1,f,m-1);y&&t.push(y)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){let o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function Ao(s,e,t,n,i,r,a){let o=s.geometry.attributes.position;if(Yo.fromBufferAttribute(o,i),Ko.fromBufferAttribute(o,r),t.distanceSqToSegment(Yo,Ko,fh,$d)>n)return;fh.applyMatrix4(s.matrixWorld);let c=e.ray.origin.distanceTo(fh);if(!(c<e.near||c>e.far))return{distance:c,point:$d.clone().applyMatrix4(s.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:s}}var Jd=new N,jd=new N,la=class extends us{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let i=0,r=t.count;i<r;i+=2)Jd.fromBufferAttribute(t,i),jd.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+Jd.distanceTo(jd);e.setAttribute("lineDistance",new lt(n,1))}else Fe("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},ca=class extends us{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},Wi=class extends an{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new He(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Qd=new Je,Th=new Hi,Ro=new dn,Co=new N,ds=class extends Pt{constructor(e=new Tt,t=new Wi){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,i=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ro.copy(n.boundingSphere),Ro.applyMatrix4(i),Ro.radius+=r,e.ray.intersectsSphere(Ro)===!1)return;Qd.copy(i).invert(),Th.copy(e.ray).applyMatrix4(Qd);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,u=n.attributes.position;if(c!==null){let d=Math.max(0,a.start),f=Math.min(c.count,a.start+a.count);for(let m=d,y=f;m<y;m++){let g=c.getX(m);Co.fromBufferAttribute(u,g),ef(Co,g,l,i,e,t,this)}}else{let d=Math.max(0,a.start),f=Math.min(u.count,a.start+a.count);for(let m=d,y=f;m<y;m++)Co.fromBufferAttribute(u,m),ef(Co,m,l,i,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){let o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function ef(s,e,t,n,i,r,a){let o=Th.distanceSqToPoint(s);if(o<t){let l=new N;Th.closestPointToPoint(s,l),l.applyMatrix4(n);let c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}var ha=class extends Nt{constructor(e=[],t=Zi,n,i,r,a,o,l,c,h){super(e,t,n,i,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},ei=class extends Nt{constructor(e,t,n,i,r,a,o,l,c){super(e,t,n,i,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Xi=class extends Nt{constructor(e,t,n=Wn,i,r,a,o=Dt,l=Dt,c,h=Jn,u=1){if(h!==Jn&&h!==$i)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:e,height:t,depth:u};super(d,i,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new ir(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},Zo=class extends Xi{constructor(e,t=Wn,n=Zi,i,r,a=Dt,o=Dt,l,c=Jn){let h={width:e,height:e,depth:1},u=[h,h,h,h,h,h];super(e,e,t,n,i,r,a,o,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},ua=class extends Nt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},qi=class s extends Tt{constructor(e=1,t=1,n=1,i=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:a};let o=this;i=Math.floor(i),r=Math.floor(r),a=Math.floor(a);let l=[],c=[],h=[],u=[],d=0,f=0;m("z","y","x",-1,-1,n,t,e,a,r,0),m("z","y","x",1,-1,n,t,-e,a,r,1),m("x","z","y",1,1,e,n,t,i,a,2),m("x","z","y",1,-1,e,n,-t,i,a,3),m("x","y","z",1,-1,e,t,n,i,r,4),m("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new lt(c,3)),this.setAttribute("normal",new lt(h,3)),this.setAttribute("uv",new lt(u,2));function m(y,g,p,S,E,M,b,T,C,x,w){let L=M/C,I=b/x,B=M/2,F=b/2,R=T/2,k=C+1,W=x+1,Y=0,re=0,K=new N;for(let Q=0;Q<W;Q++){let se=Q*I-F;for(let ue=0;ue<k;ue++){let we=ue*L-B;K[y]=we*S,K[g]=se*E,K[p]=R,c.push(K.x,K.y,K.z),K[y]=0,K[g]=0,K[p]=T>0?1:-1,h.push(K.x,K.y,K.z),u.push(ue/C),u.push(1-Q/x),Y+=1}}for(let Q=0;Q<x;Q++)for(let se=0;se<C;se++){let ue=d+se+k*Q,we=d+se+k*(Q+1),Ge=d+(se+1)+k*(Q+1),Se=d+(se+1)+k*Q;l.push(ue,we,Se),l.push(we,Ge,Se),re+=6}o.addGroup(f,re,w),f+=re,d+=Y}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};var da=class s extends Tt{constructor(e=1,t=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:i},t=Math.max(3,t);let r=[],a=[],o=[],l=[],c=new N,h=new fe;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=t;u++,d+=3){let f=n+u/t*i;c.x=e*Math.cos(f),c.y=e*Math.sin(f),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[d]/e+1)/2,h.y=(a[d+1]/e+1)/2,l.push(h.x,h.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new lt(a,3)),this.setAttribute("normal",new lt(o,3)),this.setAttribute("uv",new lt(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.radius,e.segments,e.thetaStart,e.thetaLength)}},Yi=class s extends Tt{constructor(e=1,t=1,n=1,i=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};let c=this;i=Math.floor(i),r=Math.floor(r);let h=[],u=[],d=[],f=[],m=0,y=[],g=n/2,p=0;S(),a===!1&&(e>0&&E(!0),t>0&&E(!1)),this.setIndex(h),this.setAttribute("position",new lt(u,3)),this.setAttribute("normal",new lt(d,3)),this.setAttribute("uv",new lt(f,2));function S(){let M=new N,b=new N,T=0,C=(t-e)/n;for(let x=0;x<=r;x++){let w=[],L=x/r,I=L*(t-e)+e;for(let B=0;B<=i;B++){let F=B/i,R=F*l+o,k=Math.sin(R),W=Math.cos(R);b.x=I*k,b.y=-L*n+g,b.z=I*W,u.push(b.x,b.y,b.z),M.set(k,C,W).normalize(),d.push(M.x,M.y,M.z),f.push(F,1-L),w.push(m++)}y.push(w)}for(let x=0;x<i;x++)for(let w=0;w<r;w++){let L=y[w][x],I=y[w+1][x],B=y[w+1][x+1],F=y[w][x+1];(e>0||w!==0)&&(h.push(L,I,F),T+=3),(t>0||w!==r-1)&&(h.push(I,B,F),T+=3)}c.addGroup(p,T,0),p+=T}function E(M){let b=m,T=new fe,C=new N,x=0,w=M===!0?e:t,L=M===!0?1:-1;for(let B=1;B<=i;B++)u.push(0,g*L,0),d.push(0,L,0),f.push(.5,.5),m++;let I=m;for(let B=0;B<=i;B++){let R=B/i*l+o,k=Math.cos(R),W=Math.sin(R);C.x=w*W,C.y=g*L,C.z=w*k,u.push(C.x,C.y,C.z),d.push(0,L,0),T.x=k*.5+.5,T.y=W*.5*L+.5,f.push(T.x,T.y),m++}for(let B=0;B<i;B++){let F=b+B,R=I+B;M===!0?h.push(R,R+1,F):h.push(R+1,R,F),x+=3}c.addGroup(p,x,M===!0?1:2),p+=x}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}};var Mn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Fe("Curve: .getPoint() not implemented.")}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,i=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(i),t.push(r),i=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),i=0,r=n.length,a;t?a=t:a=e*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(i=Math.floor(o+(l-o)/2),c=n[i]-a,c<0)o=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===a)return i/(r-1);let h=n[i],d=n[i+1]-h,f=(a-h)/d;return(i+f)/(r-1)}getTangent(e,t){let i=e-1e-4,r=e+1e-4;i<0&&(i=0),r>1&&(r=1);let a=this.getPoint(i),o=this.getPoint(r),l=t||(a.isVector2?new fe:new N);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new N,i=[],r=[],a=[],o=new N,l=new Je;for(let f=0;f<=e;f++){let m=f/e;i[f]=this.getTangentAt(m,new N)}r[0]=new N,a[0]=new N;let c=Number.MAX_VALUE,h=Math.abs(i[0].x),u=Math.abs(i[0].y),d=Math.abs(i[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],o),a[0].crossVectors(i[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(i[f-1],i[f]),o.length()>Number.EPSILON){o.normalize();let m=Math.acos(tt(i[f-1].dot(i[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(o,m))}a[f].crossVectors(i[f],r[f])}if(t===!0){let f=Math.acos(tt(r[0].dot(r[e]),-1,1));f/=e,i[0].dot(o.crossVectors(r[0],r[e]))>0&&(f=-f);for(let m=1;m<=e;m++)r[m].applyMatrix4(l.makeRotationAxis(i[m],f*m)),a[m].crossVectors(i[m],r[m])}return{tangents:i,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},ur=class extends Mn{constructor(e=0,t=0,n=1,i=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new fe){let n=t,i=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(a?r=0:r=i),this.aClockwise===!0&&!a&&(r===i?r=-i:r=r-i);let o=this.aStartAngle+e*r,l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},$o=class extends ur{constructor(e,t,n,i,r,a){super(e,t,n,n,i,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function ou(){let s=0,e=0,t=0,n=0;function i(r,a,o,l){s=r,e=o,t=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){i(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,u){let d=(a-r)/c-(o-r)/(c+h)+(o-a)/h,f=(o-a)/h-(l-a)/(h+u)+(l-o)/u;d*=h,f*=h,i(a,o,d,f)},calc:function(r){let a=r*r,o=a*r;return s+e*r+t*a+n*o}}}var tf=new N,nf=new N,ph=new ou,mh=new ou,gh=new ou,Jo=class extends Mn{constructor(e=[],t=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=i}getPoint(e,t=new N){let n=t,i=this.points,r=i.length,a=(r-(this.closed?0:1))*e,o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=i[(o-1)%r]:(nf.subVectors(i[0],i[1]).add(i[0]),c=nf);let u=i[o%r],d=i[(o+1)%r];if(this.closed||o+2<r?h=i[(o+2)%r]:(tf.subVectors(i[r-1],i[r-2]).add(i[r-1]),h=tf),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,m=Math.pow(c.distanceToSquared(u),f),y=Math.pow(u.distanceToSquared(d),f),g=Math.pow(d.distanceToSquared(h),f);y<1e-4&&(y=1),m<1e-4&&(m=y),g<1e-4&&(g=y),ph.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,m,y,g),mh.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,m,y,g),gh.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,m,y,g)}else this.curveType==="catmullrom"&&(ph.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),mh.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),gh.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(ph.calc(l),mh.calc(l),gh.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let i=e.points[t];this.points.push(i.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let i=this.points[t];e.points.push(i.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let i=e.points[t];this.points.push(new N().fromArray(i))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function sf(s,e,t,n,i){let r=(n-e)*.5,a=(i-t)*.5,o=s*s,l=s*o;return(2*t-2*n+r+a)*l+(-3*t+3*n-2*r-a)*o+r*s+t}function dg(s,e){let t=1-s;return t*t*e}function fg(s,e){return 2*(1-s)*s*e}function pg(s,e){return s*s*e}function Jr(s,e,t,n){return dg(s,e)+fg(s,t)+pg(s,n)}function mg(s,e){let t=1-s;return t*t*t*e}function gg(s,e){let t=1-s;return 3*t*t*s*e}function xg(s,e){return 3*(1-s)*s*s*e}function _g(s,e){return s*s*s*e}function jr(s,e,t,n,i){return mg(s,e)+gg(s,t)+xg(s,n)+_g(s,i)}var fa=class extends Mn{constructor(e=new fe,t=new fe,n=new fe,i=new fe){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new fe){let n=t,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(jr(e,i.x,r.x,a.x,o.x),jr(e,i.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},jo=class extends Mn{constructor(e=new N,t=new N,n=new N,i=new N){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new N){let n=t,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(jr(e,i.x,r.x,a.x,o.x),jr(e,i.y,r.y,a.y,o.y),jr(e,i.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},pa=class extends Mn{constructor(e=new fe,t=new fe){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new fe){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new fe){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Qo=class extends Mn{constructor(e=new N,t=new N){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new N){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new N){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ma=class extends Mn{constructor(e=new fe,t=new fe,n=new fe){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new fe){let n=t,i=this.v0,r=this.v1,a=this.v2;return n.set(Jr(e,i.x,r.x,a.x),Jr(e,i.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},el=class extends Mn{constructor(e=new N,t=new N,n=new N){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new N){let n=t,i=this.v0,r=this.v1,a=this.v2;return n.set(Jr(e,i.x,r.x,a.x),Jr(e,i.y,r.y,a.y),Jr(e,i.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ga=class extends Mn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new fe){let n=t,i=this.points,r=(i.length-1)*e,a=Math.floor(r),o=r-a,l=i[a===0?a:a-1],c=i[a],h=i[a>i.length-2?i.length-1:a+1],u=i[a>i.length-3?i.length-1:a+2];return n.set(sf(o,l.x,c.x,h.x,u.x),sf(o,l.y,c.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let i=e.points[t];this.points.push(i.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let i=this.points[t];e.points.push(i.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let i=e.points[t];this.points.push(new fe().fromArray(i))}return this}},wh=Object.freeze({__proto__:null,ArcCurve:$o,CatmullRomCurve3:Jo,CubicBezierCurve:fa,CubicBezierCurve3:jo,EllipseCurve:ur,LineCurve:pa,LineCurve3:Qo,QuadraticBezierCurve:ma,QuadraticBezierCurve3:el,SplineCurve:ga}),tl=class extends Mn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new wh[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),i=this.getCurveLengths(),r=0;for(;r<i.length;){if(i[r]>=n){let a=i[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,i=this.curves.length;n<i;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let i=0,r=this.curves;i<r.length;i++){let a=r[i],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let i=e.curves[t];this.curves.push(i.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let i=this.curves[t];e.curves.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let i=e.curves[t];this.curves.push(new wh[i.type]().fromJSON(i))}return this}},xa=class extends tl{constructor(e){super(),this.type="Path",this.currentPoint=new fe,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new pa(this.currentPoint.clone(),new fe(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,i){let r=new ma(this.currentPoint.clone(),new fe(e,t),new fe(n,i));return this.curves.push(r),this.currentPoint.set(n,i),this}bezierCurveTo(e,t,n,i,r,a){let o=new fa(this.currentPoint.clone(),new fe(e,t),new fe(n,i),new fe(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new ga(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,i,r,a){let o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,n,i,r,a),this}absarc(e,t,n,i,r,a){return this.absellipse(e,t,n,n,i,r,a),this}ellipse(e,t,n,i,r,a,o,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,i,r,a,o,l),this}absellipse(e,t,n,i,r,a,o,l){let c=new ur(e,t,n,i,r,a,o,l);if(this.curves.length>0){let u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},fs=class extends xa{constructor(e){super(e),this.uuid=Rn(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,i=this.holes.length;n<i;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let i=e.holes[t];this.holes.push(i.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let i=this.holes[t];e.holes.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let i=e.holes[t];this.holes.push(new xa().fromJSON(i))}return this}};function vg(s,e,t=2){let n=e&&e.length,i=n?e[0]*t:s.length,r=np(s,0,i,t,!0),a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=Tg(s,e,r,t)),s.length>80*t){o=s[0],l=s[1];let h=o,u=l;for(let d=t;d<i;d+=t){let f=s[d],m=s[d+1];f<o&&(o=f),m<l&&(l=m),f>h&&(h=f),m>u&&(u=m)}c=Math.max(h-o,u-l),c=c!==0?32767/c:0}return _a(r,a,t,o,l,c,0),a}function np(s,e,t,n,i){let r;if(i===Ug(s,e,t,n)>0)for(let a=e;a<t;a+=n)r=rf(a/n|0,s[a],s[a+1],r);else for(let a=t-n;a>=e;a-=n)r=rf(a/n|0,s[a],s[a+1],r);return r&&dr(r,r.next)&&(ya(r),r=r.next),r}function ps(s,e){if(!s)return s;e||(e=s);let t=s,n;do if(n=!1,!t.steiner&&(dr(t,t.next)||Lt(t.prev,t,t.next)===0)){if(ya(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function _a(s,e,t,n,i,r,a){if(!s)return;!a&&r&&Cg(s,n,i,r);let o=s;for(;s.prev!==s.next;){let l=s.prev,c=s.next;if(r?Mg(s,n,i,r):yg(s)){e.push(l.i,s.i,c.i),ya(s),s=c.next,o=c.next;continue}if(s=c,s===o){a?a===1?(s=Sg(ps(s),e),_a(s,e,t,n,i,r,2)):a===2&&bg(s,e,t,n,i,r):_a(ps(s),e,t,n,i,r,1);break}}}function yg(s){let e=s.prev,t=s,n=s.next;if(Lt(e,t,n)>=0)return!1;let i=e.x,r=t.x,a=n.x,o=e.y,l=t.y,c=n.y,h=Math.min(i,r,a),u=Math.min(o,l,c),d=Math.max(i,r,a),f=Math.max(o,l,c),m=n.next;for(;m!==e;){if(m.x>=h&&m.x<=d&&m.y>=u&&m.y<=f&&Kr(i,o,r,l,a,c,m.x,m.y)&&Lt(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function Mg(s,e,t,n){let i=s.prev,r=s,a=s.next;if(Lt(i,r,a)>=0)return!1;let o=i.x,l=r.x,c=a.x,h=i.y,u=r.y,d=a.y,f=Math.min(o,l,c),m=Math.min(h,u,d),y=Math.max(o,l,c),g=Math.max(h,u,d),p=Eh(f,m,e,t,n),S=Eh(y,g,e,t,n),E=s.prevZ,M=s.nextZ;for(;E&&E.z>=p&&M&&M.z<=S;){if(E.x>=f&&E.x<=y&&E.y>=m&&E.y<=g&&E!==i&&E!==a&&Kr(o,h,l,u,c,d,E.x,E.y)&&Lt(E.prev,E,E.next)>=0||(E=E.prevZ,M.x>=f&&M.x<=y&&M.y>=m&&M.y<=g&&M!==i&&M!==a&&Kr(o,h,l,u,c,d,M.x,M.y)&&Lt(M.prev,M,M.next)>=0))return!1;M=M.nextZ}for(;E&&E.z>=p;){if(E.x>=f&&E.x<=y&&E.y>=m&&E.y<=g&&E!==i&&E!==a&&Kr(o,h,l,u,c,d,E.x,E.y)&&Lt(E.prev,E,E.next)>=0)return!1;E=E.prevZ}for(;M&&M.z<=S;){if(M.x>=f&&M.x<=y&&M.y>=m&&M.y<=g&&M!==i&&M!==a&&Kr(o,h,l,u,c,d,M.x,M.y)&&Lt(M.prev,M,M.next)>=0)return!1;M=M.nextZ}return!0}function Sg(s,e){let t=s;do{let n=t.prev,i=t.next.next;!dr(n,i)&&sp(n,t,t.next,i)&&va(n,i)&&va(i,n)&&(e.push(n.i,t.i,i.i),ya(t),ya(t.next),t=s=i),t=t.next}while(t!==s);return ps(t)}function bg(s,e,t,n,i,r){let a=s;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Lg(a,o)){let l=rp(a,o);a=ps(a,a.next),l=ps(l,l.next),_a(a,e,t,n,i,r,0),_a(l,e,t,n,i,r,0);return}o=o.next}a=a.next}while(a!==s)}function Tg(s,e,t,n){let i=[];for(let r=0,a=e.length;r<a;r++){let o=e[r]*n,l=r<a-1?e[r+1]*n:s.length,c=np(s,o,l,n,!1);c===c.next&&(c.steiner=!0),i.push(Pg(c))}i.sort(wg);for(let r=0;r<i.length;r++)t=Eg(i[r],t);return t}function wg(s,e){let t=s.x-e.x;if(t===0&&(t=s.y-e.y,t===0)){let n=(s.next.y-s.y)/(s.next.x-s.x),i=(e.next.y-e.y)/(e.next.x-e.x);t=n-i}return t}function Eg(s,e){let t=Ag(s,e);if(!t)return e;let n=rp(t,s);return ps(n,n.next),ps(t,t.next)}function Ag(s,e){let t=e,n=s.x,i=s.y,r=-1/0,a;if(dr(s,t))return t;do{if(dr(s,t.next))return t.next;if(i<=t.y&&i>=t.next.y&&t.next.y!==t.y){let u=t.x+(i-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=n&&u>r&&(r=u,a=t.x<t.next.x?t:t.next,u===n))return a}t=t.next}while(t!==e);if(!a)return null;let o=a,l=a.x,c=a.y,h=1/0;t=a;do{if(n>=t.x&&t.x>=l&&n!==t.x&&ip(i<c?n:r,i,l,c,i<c?r:n,i,t.x,t.y)){let u=Math.abs(i-t.y)/(n-t.x);va(t,s)&&(u<h||u===h&&(t.x>a.x||t.x===a.x&&Rg(a,t)))&&(a=t,h=u)}t=t.next}while(t!==o);return a}function Rg(s,e){return Lt(s.prev,s,e.prev)<0&&Lt(e.next,s,s.next)<0}function Cg(s,e,t,n){let i=s;do i.z===0&&(i.z=Eh(i.x,i.y,e,t,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,Ig(i)}function Ig(s){let e,t=1;do{let n=s,i;s=null;let r=null;for(e=0;n;){e++;let a=n,o=0;for(let c=0;c<t&&(o++,a=a.nextZ,!!a);c++);let l=t;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(i=n,n=n.nextZ,o--):(i=a,a=a.nextZ,l--),r?r.nextZ=i:s=i,i.prevZ=r,r=i;n=a}r.nextZ=null,t*=2}while(e>1);return s}function Eh(s,e,t,n,i){return s=(s-t)*i|0,e=(e-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,s|e<<1}function Pg(s){let e=s,t=s;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==s);return t}function ip(s,e,t,n,i,r,a,o){return(i-a)*(e-o)>=(s-a)*(r-o)&&(s-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(i-a)*(n-o)}function Kr(s,e,t,n,i,r,a,o){return!(s===a&&e===o)&&ip(s,e,t,n,i,r,a,o)}function Lg(s,e){return s.next.i!==e.i&&s.prev.i!==e.i&&!Dg(s,e)&&(va(s,e)&&va(e,s)&&Ng(s,e)&&(Lt(s.prev,s,e.prev)||Lt(s,e.prev,e))||dr(s,e)&&Lt(s.prev,s,s.next)>0&&Lt(e.prev,e,e.next)>0)}function Lt(s,e,t){return(e.y-s.y)*(t.x-e.x)-(e.x-s.x)*(t.y-e.y)}function dr(s,e){return s.x===e.x&&s.y===e.y}function sp(s,e,t,n){let i=Po(Lt(s,e,t)),r=Po(Lt(s,e,n)),a=Po(Lt(t,n,s)),o=Po(Lt(t,n,e));return!!(i!==r&&a!==o||i===0&&Io(s,t,e)||r===0&&Io(s,n,e)||a===0&&Io(t,s,n)||o===0&&Io(t,e,n))}function Io(s,e,t){return e.x<=Math.max(s.x,t.x)&&e.x>=Math.min(s.x,t.x)&&e.y<=Math.max(s.y,t.y)&&e.y>=Math.min(s.y,t.y)}function Po(s){return s>0?1:s<0?-1:0}function Dg(s,e){let t=s;do{if(t.i!==s.i&&t.next.i!==s.i&&t.i!==e.i&&t.next.i!==e.i&&sp(t,t.next,s,e))return!0;t=t.next}while(t!==s);return!1}function va(s,e){return Lt(s.prev,s,s.next)<0?Lt(s,e,s.next)>=0&&Lt(s,s.prev,e)>=0:Lt(s,e,s.prev)<0||Lt(s,s.next,e)<0}function Ng(s,e){let t=s,n=!1,i=(s.x+e.x)/2,r=(s.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&i<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==s);return n}function rp(s,e){let t=Ah(s.i,s.x,s.y),n=Ah(e.i,e.x,e.y),i=s.next,r=e.prev;return s.next=e,e.prev=s,t.next=i,i.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function rf(s,e,t,n){let i=Ah(s,e,t);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function ya(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function Ah(s,e,t){return{i:s,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Ug(s,e,t,n){let i=0;for(let r=e,a=t-n;r<t;r+=n)i+=(s[a]-s[r])*(s[r+1]+s[a+1]),a=r;return i}var Rh=class{static triangulate(e,t,n=2){return vg(e,t,n)}},rs=class s{static area(e){let t=e.length,n=0;for(let i=t-1,r=0;r<t;i=r++)n+=e[i].x*e[r].y-e[r].x*e[i].y;return n*.5}static isClockWise(e){return s.area(e)<0}static triangulateShape(e,t){let n=[],i=[],r=[];af(e),of(n,e);let a=e.length;t.forEach(af);for(let l=0;l<t.length;l++)i.push(a),a+=t[l].length,of(n,t[l]);let o=Rh.triangulate(n,i);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}};function af(s){let e=s.length;e>2&&s[e-1].equals(s[0])&&s.pop()}function of(s,e){for(let t=0;t<e.length;t++)s.push(e[t].x),s.push(e[t].y)}var fr=class s extends Tt{constructor(e=new fs([new fe(.5,.5),new fe(-.5,.5),new fe(-.5,-.5),new fe(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,i=[],r=[];for(let o=0,l=e.length;o<l;o++){let c=e[o];a(c)}this.setAttribute("position",new lt(i,3)),this.setAttribute("uv",new lt(r,2)),this.computeVertexNormals();function a(o){let l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1,d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,m=t.bevelSize!==void 0?t.bevelSize:f-.1,y=t.bevelOffset!==void 0?t.bevelOffset:0,g=t.bevelSegments!==void 0?t.bevelSegments:3,p=t.extrudePath,S=t.UVGenerator!==void 0?t.UVGenerator:Fg,E,M=!1,b,T,C,x;if(p){E=p.getSpacedPoints(h),M=!0,d=!1;let te=p.isCatmullRomCurve3?p.closed:!1;b=p.computeFrenetFrames(h,te),T=new N,C=new N,x=new N}d||(g=0,f=0,m=0,y=0);let w=o.extractPoints(c),L=w.shape,I=w.holes;if(!rs.isClockWise(L)){L=L.reverse();for(let te=0,oe=I.length;te<oe;te++){let he=I[te];rs.isClockWise(he)&&(I[te]=he.reverse())}}function F(te){let he=10000000000000001e-36,de=te[0];for(let ge=1;ge<=te.length;ge++){let Ve=ge%te.length,Ue=te[Ve],We=Ue.x-de.x,$e=Ue.y-de.y,U=We*We+$e*$e,Ye=Math.max(Math.abs(Ue.x),Math.abs(Ue.y),Math.abs(de.x),Math.abs(de.y)),Ze=he*Ye*Ye;if(U<=Ze){te.splice(Ve,1),ge--;continue}de=Ue}}F(L),I.forEach(F);let R=I.length,k=L;for(let te=0;te<R;te++){let oe=I[te];L=L.concat(oe)}function W(te,oe,he){return oe||Ke("ExtrudeGeometry: vec does not exist"),te.clone().addScaledVector(oe,he)}let Y=L.length;function re(te,oe,he){let de,ge,Ve,Ue=te.x-oe.x,We=te.y-oe.y,$e=he.x-te.x,U=he.y-te.y,Ye=Ue*Ue+We*We,Ze=Ue*U-We*$e;if(Math.abs(Ze)>Number.EPSILON){let A=Math.sqrt(Ye),v=Math.sqrt($e*$e+U*U),H=oe.x-We/A,X=oe.y+Ue/A,$=he.x-U/v,ce=he.y+$e/v,me=(($-H)*U-(ce-X)*$e)/(Ue*U-We*$e);de=H+Ue*me-te.x,ge=X+We*me-te.y;let j=de*de+ge*ge;if(j<=2)return new fe(de,ge);Ve=Math.sqrt(j/2)}else{let A=!1;Ue>Number.EPSILON?$e>Number.EPSILON&&(A=!0):Ue<-Number.EPSILON?$e<-Number.EPSILON&&(A=!0):Math.sign(We)===Math.sign(U)&&(A=!0),A?(de=-We,ge=Ue,Ve=Math.sqrt(Ye)):(de=Ue,ge=We,Ve=Math.sqrt(Ye/2))}return new fe(de/Ve,ge/Ve)}let K=[];for(let te=0,oe=k.length,he=oe-1,de=te+1;te<oe;te++,he++,de++)he===oe&&(he=0),de===oe&&(de=0),K[te]=re(k[te],k[he],k[de]);let Q=[],se,ue=K.concat();for(let te=0,oe=R;te<oe;te++){let he=I[te];se=[];for(let de=0,ge=he.length,Ve=ge-1,Ue=de+1;de<ge;de++,Ve++,Ue++)Ve===ge&&(Ve=0),Ue===ge&&(Ue=0),se[de]=re(he[de],he[Ve],he[Ue]);Q.push(se),ue=ue.concat(se)}let we;if(g===0)we=rs.triangulateShape(k,I);else{let te=[],oe=[];for(let he=0;he<g;he++){let de=he/g,ge=f*Math.cos(de*Math.PI/2),Ve=m*Math.sin(de*Math.PI/2)+y;for(let Ue=0,We=k.length;Ue<We;Ue++){let $e=W(k[Ue],K[Ue],Ve);ye($e.x,$e.y,-ge),de===0&&te.push($e)}for(let Ue=0,We=R;Ue<We;Ue++){let $e=I[Ue];se=Q[Ue];let U=[];for(let Ye=0,Ze=$e.length;Ye<Ze;Ye++){let A=W($e[Ye],se[Ye],Ve);ye(A.x,A.y,-ge),de===0&&U.push(A)}de===0&&oe.push(U)}}we=rs.triangulateShape(te,oe)}let Ge=we.length,Se=m+y;for(let te=0;te<Y;te++){let oe=d?W(L[te],ue[te],Se):L[te];M?(C.copy(b.normals[0]).multiplyScalar(oe.x),T.copy(b.binormals[0]).multiplyScalar(oe.y),x.copy(E[0]).add(C).add(T),ye(x.x,x.y,x.z)):ye(oe.x,oe.y,0)}for(let te=1;te<=h;te++)for(let oe=0;oe<Y;oe++){let he=d?W(L[oe],ue[oe],Se):L[oe];M?(C.copy(b.normals[te]).multiplyScalar(he.x),T.copy(b.binormals[te]).multiplyScalar(he.y),x.copy(E[te]).add(C).add(T),ye(x.x,x.y,x.z)):ye(he.x,he.y,u/h*te)}for(let te=g-1;te>=0;te--){let oe=te/g,he=f*Math.cos(oe*Math.PI/2),de=m*Math.sin(oe*Math.PI/2)+y;for(let ge=0,Ve=k.length;ge<Ve;ge++){let Ue=W(k[ge],K[ge],de);ye(Ue.x,Ue.y,u+he)}for(let ge=0,Ve=I.length;ge<Ve;ge++){let Ue=I[ge];se=Q[ge];for(let We=0,$e=Ue.length;We<$e;We++){let U=W(Ue[We],se[We],de);M?ye(U.x,U.y+E[h-1].y,E[h-1].x+he):ye(U.x,U.y,u+he)}}}at(),J();function at(){let te=i.length/3;if(d){let oe=0,he=Y*oe;for(let de=0;de<Ge;de++){let ge=we[de];ze(ge[2]+he,ge[1]+he,ge[0]+he)}oe=h+g*2,he=Y*oe;for(let de=0;de<Ge;de++){let ge=we[de];ze(ge[0]+he,ge[1]+he,ge[2]+he)}}else{for(let oe=0;oe<Ge;oe++){let he=we[oe];ze(he[2],he[1],he[0])}for(let oe=0;oe<Ge;oe++){let he=we[oe];ze(he[0]+Y*h,he[1]+Y*h,he[2]+Y*h)}}n.addGroup(te,i.length/3-te,0)}function J(){let te=i.length/3,oe=0;ee(k,oe),oe+=k.length;for(let he=0,de=I.length;he<de;he++){let ge=I[he];ee(ge,oe),oe+=ge.length}n.addGroup(te,i.length/3-te,1)}function ee(te,oe){let he=te.length;for(;--he>=0;){let de=he,ge=he-1;ge<0&&(ge=te.length-1);for(let Ve=0,Ue=h+g*2;Ve<Ue;Ve++){let We=Y*Ve,$e=Y*(Ve+1),U=oe+de+We,Ye=oe+ge+We,Ze=oe+ge+$e,A=oe+de+$e;Ae(U,Ye,Ze,A)}}}function ye(te,oe,he){l.push(te),l.push(oe),l.push(he)}function ze(te,oe,he){qe(te),qe(oe),qe(he);let de=i.length/3,ge=S.generateTopUV(n,i,de-3,de-2,de-1);ht(ge[0]),ht(ge[1]),ht(ge[2])}function Ae(te,oe,he,de){qe(te),qe(oe),qe(de),qe(oe),qe(he),qe(de);let ge=i.length/3,Ve=S.generateSideWallUV(n,i,ge-6,ge-3,ge-2,ge-1);ht(Ve[0]),ht(Ve[1]),ht(Ve[3]),ht(Ve[1]),ht(Ve[2]),ht(Ve[3])}function qe(te){i.push(l[te*3+0]),i.push(l[te*3+1]),i.push(l[te*3+2])}function ht(te){r.push(te.x),r.push(te.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return Og(t,n,e)}static fromJSON(e,t){let n=[];for(let r=0,a=e.shapes.length;r<a;r++){let o=t[e.shapes[r]];n.push(o)}let i=e.options.extrudePath;return i!==void 0&&(e.options.extrudePath=new wh[i.type]().fromJSON(i)),new s(n,e.options)}},Fg={generateTopUV:function(s,e,t,n,i){let r=e[t*3],a=e[t*3+1],o=e[n*3],l=e[n*3+1],c=e[i*3],h=e[i*3+1];return[new fe(r,a),new fe(o,l),new fe(c,h)]},generateSideWallUV:function(s,e,t,n,i,r){let a=e[t*3],o=e[t*3+1],l=e[t*3+2],c=e[n*3],h=e[n*3+1],u=e[n*3+2],d=e[i*3],f=e[i*3+1],m=e[i*3+2],y=e[r*3],g=e[r*3+1],p=e[r*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new fe(a,1-l),new fe(c,1-u),new fe(d,1-m),new fe(y,1-p)]:[new fe(o,1-l),new fe(h,1-u),new fe(f,1-m),new fe(g,1-p)]}};function Og(s,e,t){if(t.shapes=[],Array.isArray(s))for(let n=0,i=s.length;n<i;n++){let r=s[n];t.shapes.push(r.uuid)}else t.shapes.push(s.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}var Yt=class s extends Tt{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};let r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(i),c=o+1,h=l+1,u=e/o,d=t/l,f=[],m=[],y=[],g=[];for(let p=0;p<h;p++){let S=p*d-a;for(let E=0;E<c;E++){let M=E*u-r;m.push(M,-S,0),y.push(0,0,1),g.push(E/o),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let S=0;S<o;S++){let E=S+c*p,M=S+c*(p+1),b=S+1+c*(p+1),T=S+1+c*p;f.push(E,M,T),f.push(M,b,T)}this.setIndex(f),this.setAttribute("position",new lt(m,3)),this.setAttribute("normal",new lt(y,3)),this.setAttribute("uv",new lt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.width,e.height,e.widthSegments,e.heightSegments)}},Ma=class s extends Tt{constructor(e=.5,t=1,n=32,i=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:i,thetaStart:r,thetaLength:a},n=Math.max(3,n),i=Math.max(1,i);let o=[],l=[],c=[],h=[],u=e,d=(t-e)/i,f=new N,m=new fe;for(let y=0;y<=i;y++){for(let g=0;g<=n;g++){let p=r+g/n*a;f.x=u*Math.cos(p),f.y=u*Math.sin(p),l.push(f.x,f.y,f.z),c.push(0,0,1),m.x=(f.x/t+1)/2,m.y=(f.y/t+1)/2,h.push(m.x,m.y)}u+=d}for(let y=0;y<i;y++){let g=y*(n+1);for(let p=0;p<n;p++){let S=p+g,E=S,M=S+n+1,b=S+n+2,T=S+1;o.push(E,M,T),o.push(M,b,T)}}this.setIndex(o),this.setAttribute("position",new lt(l,3)),this.setAttribute("normal",new lt(c,3)),this.setAttribute("uv",new lt(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}};var Sa=class s extends Tt{constructor(e=1,t=32,n=16,i=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(a+o,Math.PI),c=0,h=[],u=new N,d=new N,f=[],m=[],y=[],g=[];for(let p=0;p<=n;p++){let S=[],E=p/n,M=a+E*o,b=e*Math.cos(M),T=Math.sqrt(e*e-b*b),C=0;p===0&&a===0?C=.5/t:p===n&&l===Math.PI&&(C=-.5/t);for(let x=0;x<=t;x++){let w=x/t,L=i+w*r;u.x=-T*Math.cos(L),u.y=b,u.z=T*Math.sin(L),m.push(u.x,u.y,u.z),d.copy(u).normalize(),y.push(d.x,d.y,d.z),g.push(w+C,1-E),S.push(c++)}h.push(S)}for(let p=0;p<n;p++)for(let S=0;S<t;S++){let E=h[p][S+1],M=h[p][S],b=h[p+1][S],T=h[p+1][S+1];(p!==0||a>0)&&f.push(E,M,T),(p!==n-1||l<Math.PI)&&f.push(M,b,T)}this.setIndex(f),this.setAttribute("position",new lt(m,3)),this.setAttribute("normal",new lt(y,3)),this.setAttribute("uv",new lt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var ba=class s extends Tt{constructor(e=1,t=.4,n=12,i=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:i,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),i=Math.floor(i);let l=[],c=[],h=[],u=[],d=new N,f=new N,m=new N;for(let y=0;y<=n;y++){let g=a+y/n*o;for(let p=0;p<=i;p++){let S=p/i*r;f.x=(e+t*Math.cos(g))*Math.cos(S),f.y=(e+t*Math.cos(g))*Math.sin(S),f.z=t*Math.sin(g),c.push(f.x,f.y,f.z),d.x=e*Math.cos(S),d.y=e*Math.sin(S),m.subVectors(f,d).normalize(),h.push(m.x,m.y,m.z),u.push(p/i),u.push(y/n)}}for(let y=1;y<=n;y++)for(let g=1;g<=i;g++){let p=(i+1)*y+g-1,S=(i+1)*(y-1)+g-1,E=(i+1)*(y-1)+g,M=(i+1)*y+g;l.push(p,S,M),l.push(S,E,M)}this.setIndex(l),this.setAttribute("position",new lt(c,3)),this.setAttribute("normal",new lt(h,3)),this.setAttribute("uv",new lt(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}};var Ta=class extends an{constructor(e){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new He(0),this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.fog=e.fog,this}};function Ts(s){let e={};for(let t in s){e[t]={};for(let n in s[t]){let i=s[t][n];if(lf(i))i.isRenderTargetTexture?(Fe("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone();else if(Array.isArray(i))if(lf(i[0])){let r=[];for(let a=0,o=i.length;a<o;a++)r[a]=i[a].clone();e[t][n]=r}else e[t][n]=i.slice();else e[t][n]=i}}return e}function nn(s){let e={};for(let t=0;t<s.length;t++){let n=Ts(s[t]);for(let i in n)e[i]=n[i]}return e}function lf(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function Bg(s){let e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function lu(s){let e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:it.workingColorSpace}var ap={clone:Ts,merge:nn},kg=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,zg=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Sn=class extends an{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=kg,this.fragmentShader=zg,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ts(e.uniforms),this.uniformsGroups=Bg(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let i in this.uniforms){let a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let i=e.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=t[i.value]||null;break;case"c":this.uniforms[n].value=new He().setHex(i.value);break;case"v2":this.uniforms[n].value=new fe().fromArray(i.value);break;case"v3":this.uniforms[n].value=new N().fromArray(i.value);break;case"v4":this.uniforms[n].value=new xt().fromArray(i.value);break;case"m3":this.uniforms[n].value=new je().fromArray(i.value);break;case"m4":this.uniforms[n].value=new Je().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},nl=class extends Sn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Vn=class extends an{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new He(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new He(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ql,this.normalScale=new fe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Si,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},tn=class extends Vn{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new fe(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return tt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new He(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new He(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new He(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var Ki=class extends an{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Gf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},il=class extends an{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function zi(s,e){return!s||s.constructor===e?s:typeof e.BYTES_PER_ELEMENT=="number"?new e(s):Array.prototype.slice.call(s)}function Fo(s){return s!==void 0&&s.inTangents!==void 0&&s.outTangents!==void 0}function Vg(s){function e(i,r){return s[i]-s[r]}let t=s.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function cf(s,e,t){let n=s.length,i=new s.constructor(n);for(let r=0,a=0;a!==n;++r){let o=t[r]*e;for(let l=0;l!==e;++l)i[a++]=s[o+l]}return i}function Gg(s,e,t,n){let i=1,r=s[0];for(;r!==void 0&&r[n]===void 0;)r=s[i++];if(r===void 0)return;let a=r[n];if(a!==void 0)if(Array.isArray(a))do a=r[n],a!==void 0&&(e.push(r.time),t.push(...a)),r=s[i++];while(r!==void 0);else if(a.toArray!==void 0)do a=r[n],a!==void 0&&(e.push(r.time),a.toArray(t,t.length)),r=s[i++];while(r!==void 0);else do a=r[n],a!==void 0&&(e.push(r.time),t.push(a)),r=s[i++];while(r!==void 0)}var ti=class{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,i=t[n],r=t[n-1];n:{e:{let a;t:{i:if(!(e<i)){for(let o=n+2;;){if(i===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=i,i=t[++n],e<i)break e}a=t.length;break t}if(!(e>=r)){let o=t[1];e<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=r,r=t[--n-1],e>=r)break e}a=n,n=0;break t}break n}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(i=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i;for(let a=0;a!==i;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},sl=class extends ti{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Mh,endingEnd:Mh}}intervalChanged_(e,t,n){let i=this.parameterPositions,r=e-2,a=e+1,o=i[r],l=i[a];if(o===void 0)switch(this.getSettings_().endingStart){case Sh:r=e,o=2*t-n;break;case bh:r=i.length-2,o=t+i[r]-i[r+1];break;default:r=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Sh:a=e,l=2*n-t;break;case bh:a=1,l=n+i[1]-i[0];break;default:a=e-1,l=t}let c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(e,t,n,i){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,m=(n-t)/(i-t),y=m*m,g=y*m,p=-d*g+2*d*y-d*m,S=(1+d)*g+(-1.5-2*d)*y+(-.5+d)*m+1,E=(-1-f)*g+(1.5+f)*y+.5*m,M=f*g-f*y;for(let b=0;b!==o;++b)r[b]=p*a[h+b]+S*a[c+b]+E*a[l+b]+M*a[u+b];return r}},rl=class extends ti{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(n-t)/(i-t),u=1-h;for(let d=0;d!==o;++d)r[d]=a[c+d]*u+a[l+d]*h;return r}},al=class extends ti{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}},ol=class extends ti{interpolate_(e,t,n,i){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this.inTangents,u=this.outTangents;if(!h||!u){let m=(n-t)/(i-t),y=1-m;for(let g=0;g!==o;++g)r[g]=a[c+g]*y+a[l+g]*m;return r}let d=o*2,f=e-1;for(let m=0;m!==o;++m){let y=a[c+m],g=a[l+m],p=f*d+m*2,S=u[p],E=u[p+1],M=e*d+m*2,b=h[M],T=h[M+1],C=Wg(n,t,S,b,i);r[m]=op(C,y,E,T,g)}return r}};function op(s,e,t,n,i){let r=1-s;return r*r*r*e+3*r*r*s*t+3*r*s*s*n+s*s*s*i}function Hg(s,e,t,n,i){let r=1-s;return 3*r*r*(t-e)+6*r*s*(n-t)+3*s*s*(i-n)}function Wg(s,e,t,n,i){let r=(s-e)/(i-e);for(let a=0;a<8;a++){let o=op(r,e,t,n,i)-s;if(Math.abs(o)<1e-10)break;let l=Hg(r,e,t,n,i);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-o/l))}return r}var fn=class{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=zi(t,this.TimeBufferType),this.values=zi(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:zi(e.times,Array),values:zi(e.values,Array)};let i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i),Fo(e.settings)&&(n.settings={inTangents:zi(e.settings.inTangents,Array),outTangents:zi(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new al(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new rl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new sl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new ol(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case os:t=this.InterpolantFactoryMethodDiscrete;break;case ls:t=this.InterpolantFactoryMethodLinear;break;case No:t=this.InterpolantFactoryMethodSmooth;break;case yh:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Fe("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return os;case this.InterpolantFactoryMethodLinear:return ls;case this.InterpolantFactoryMethodSmooth:return No;case this.InterpolantFactoryMethodBezier:return yh}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e;Fo(this.settings)&&(hf(this.settings.inTangents,e),hf(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,i=n.length,r=0,a=i-1;for(;r!==i&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==i){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(Ke("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,i=this.values,r=n.length;r===0&&(Ke("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){Ke("KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){Ke("KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(i!==void 0&&wm(i))for(let o=0,l=i.length;o!==l;++o){let c=i[o];if(isNaN(c)){Ke("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===No,r=e.length-1,a=1;for(let o=1;o<r;++o){let l=!1,c=e[o],h=e[o+1];if(c!==h&&(o!==1||c!==e[0]))if(i)l=!0;else{let u=o*n,d=u-n,f=u+n;for(let m=0;m!==n;++m){let y=t[u+m];if(y!==t[d+m]||y!==t[f+m]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let u=o*n,d=a*n;for(let f=0;f!==n;++f)t[d+f]=t[u+f]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,Fo(this.settings)&&(i.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),i}};function hf(s,e){for(let t=0,n=s.length;t!==n;t+=2)s[t]*=e}fn.prototype.ValueTypeName="";fn.prototype.TimeBufferType=Float32Array;fn.prototype.ValueBufferType=Float32Array;fn.prototype.DefaultInterpolation=ls;var Ti=class extends fn{constructor(e,t,n){super(e,t,n)}};Ti.prototype.ValueTypeName="bool";Ti.prototype.ValueBufferType=Array;Ti.prototype.DefaultInterpolation=os;Ti.prototype.InterpolantFactoryMethodLinear=void 0;Ti.prototype.InterpolantFactoryMethodSmooth=void 0;var wa=class extends fn{constructor(e,t,n,i){super(e,t,n,i)}};wa.prototype.ValueTypeName="color";var wi=class extends fn{constructor(e,t,n,i){super(e,t,n,i)}};wi.prototype.ValueTypeName="number";var ll=class extends ti{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(i-t),c=e*o;for(let h=c+o;c!==h;c+=4)en.slerpFlat(r,0,a,c-o,a,c,l);return r}},ni=class extends fn{constructor(e,t,n,i){super(e,t,n,i)}InterpolantFactoryMethodLinear(e){return new ll(this.times,this.values,this.getValueSize(),e)}};ni.prototype.ValueTypeName="quaternion";ni.prototype.InterpolantFactoryMethodSmooth=void 0;var Ei=class extends fn{constructor(e,t,n){super(e,t,n)}};Ei.prototype.ValueTypeName="string";Ei.prototype.ValueBufferType=Array;Ei.prototype.DefaultInterpolation=os;Ei.prototype.InterpolantFactoryMethodLinear=void 0;Ei.prototype.InterpolantFactoryMethodSmooth=void 0;var Ai=class extends fn{constructor(e,t,n,i){super(e,t,n,i)}};Ai.prototype.ValueTypeName="vector";var pr=class{constructor(e="",t=-1,n=[],i=Vf){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=Rn(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,i=1/(e.fps||1);for(let a=0,o=n.length;a!==o;++a)t.push(qg(n[a]).scale(i));let r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){let t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,a=n.length;r!==a;++r)t.push(fn.toJSON(n[r]));return i}static CreateFromMorphTargetSequence(e,t,n,i){let r=t.length,a=[];for(let o=0;o<r;o++){let l=[],c=[];l.push((o+r-1)%r,o,(o+1)%r),c.push(0,1,0);let h=Vg(l);l=cf(l,1,h),c=cf(c,1,h),!i&&l[0]===0&&(l.push(r),c.push(c[0])),a.push(new wi(".morphTargetInfluences["+t[o].name+"]",l,c).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let i={},r=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){let c=e[o],h=c.name.match(r);if(h&&h.length>1){let u=h[1],d=i[u];d||(i[u]=d=[]),d.push(c)}}let a=[];for(let o in i)a.push(this.CreateFromMorphTargetSequence(o,i[o],t,n));return a}resetDuration(){let e=this.tracks,t=0;for(let n=0,i=e.length;n!==i;++n){let r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};function Xg(s){switch(s.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return wi;case"vector":case"vector2":case"vector3":case"vector4":return Ai;case"color":return wa;case"quaternion":return ni;case"bool":case"boolean":return Ti;case"string":return Ei}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+s)}function qg(s){if(s.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=Xg(s.type);if(s.times===void 0){let n=[],i=[];Gg(s.keys,n,i,"value"),s.times=n,s.values=i}let t;return e.parse!==void 0?t=e.parse(s):t=new e(s.name,s.times,s.values,s.interpolation),Fo(s.settings)&&(t.settings={inTangents:zi(s.settings.inTangents,Float32Array),outTangents:zi(s.settings.outTangents,Float32Array)}),t}var $n={enabled:!1,files:{},add:function(s,e){this.enabled!==!1&&(uf(s)||(this.files[s]=e))},get:function(s){if(this.enabled!==!1&&!uf(s))return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}};function uf(s){try{let e=s.slice(s.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}var cl=class{constructor(e,t,n){let i=this,r=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(h){o++,r===!1&&i.onStart!==void 0&&i.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,i.onProgress!==void 0&&i.onProgress(h,a,o),a===o&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let f=c[u],m=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return m}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},lp=new cl,Gn=class{constructor(e){this.manager=e!==void 0?e:lp,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(i,r){n.load(e,i,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};Gn.DEFAULT_MATERIAL_NAME="__DEFAULT";var vi={},Ch=class extends Error{constructor(e,t){super(e),this.response=t}},ms=class extends Gn{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=$n.get(`file:${e}`);if(r!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0);return}if(vi[e]!==void 0){vi[e].push({onLoad:t,onProgress:n,onError:i});return}vi[e]=[],vi[e].push({onLoad:t,onProgress:n,onError:i});let a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&Fe("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;let h=vi[e],u=c.body.getReader(),d=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),f=d?parseInt(d):0,m=f!==0,y=0,g=new ReadableStream({start(p){S();function S(){u.read().then(({done:E,value:M})=>{if(E)p.close();else{y+=M.byteLength;let b=new ProgressEvent("progress",{lengthComputable:m,loaded:y,total:f});for(let T=0,C=h.length;T<C;T++){let x=h[T];x.onProgress&&x.onProgress(b)}p.enqueue(M),S()}},E=>{p.error(E)})}}});return new Response(g)}else throw new Ch(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return c.json();default:if(o==="")return c.text();{let u=/charset="?([^;"\s]*)"?/i.exec(o),d=u&&u[1]?u[1].toLowerCase():void 0,f=new TextDecoder(d);return c.arrayBuffer().then(m=>f.decode(m))}}}).then(c=>{$n.add(`file:${e}`,c);let h=vi[e];delete vi[e];for(let u=0,d=h.length;u<d;u++){let f=h[u];f.onLoad&&f.onLoad(c)}}).catch(c=>{let h=vi[e];if(h===void 0)throw this.manager.itemError(e),c;delete vi[e];for(let u=0,d=h.length;u<d;u++){let f=h[u];f.onError&&f.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var Ks=new WeakMap,hl=class extends Gn{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,a=$n.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);else{let u=Ks.get(a);u===void 0&&(u=[],Ks.set(a,u)),u.push({onLoad:t,onError:i})}return a}let o=tr("img");function l(){h(),t&&t(this);let u=Ks.get(this)||[];for(let d=0;d<u.length;d++){let f=u[d];f.onLoad&&f.onLoad(this)}Ks.delete(this),r.manager.itemEnd(e)}function c(u){h(),i&&i(u),$n.remove(`image:${e}`);let d=Ks.get(this)||[];for(let f=0;f<d.length;f++){let m=d[f];m.onError&&m.onError(u)}Ks.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),$n.add(`image:${e}`,o),r.manager.itemStart(e),o.src=e,o}};var Ea=class extends Gn{constructor(e){super(e)}load(e,t,n,i){let r=this,a=new Qn,o=new ms(this.manager);return o.setResponseType("arraybuffer"),o.setRequestHeader(this.requestHeader),o.setPath(this.path),o.setWithCredentials(r.withCredentials),o.load(e,function(l){let c;try{c=r.parse(l)}catch(h){i!==void 0?i(h):Ke(h);return}r._applyTexData(a,c),t&&t(a,c)},n,i),a}createDataTexture(e){let t=new Qn;return this._applyTexData(t,this.parse(e)),t}_applyTexData(e,t){t.image!==void 0?e.image=t.image:t.data!==void 0&&(e.image.width=t.width,e.image.height=t.height,e.image.data=t.data),e.wrapS=t.wrapS!==void 0?t.wrapS:qt,e.wrapT=t.wrapT!==void 0?t.wrapT:qt,e.magFilter=t.magFilter!==void 0?t.magFilter:bt,e.minFilter=t.minFilter!==void 0?t.minFilter:bt,e.anisotropy=t.anisotropy!==void 0?t.anisotropy:1,t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.mipmaps!==void 0&&(e.mipmaps=t.mipmaps,e.minFilter=Pn),t.mipmapCount===1&&(e.minFilter=bt),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),e.needsUpdate=!0}},Hn=class extends Gn{constructor(e){super(e)}load(e,t,n,i){let r=new Nt,a=new hl(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},n,i),r}},gs=class extends Pt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new He(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},xs=class extends gs{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Pt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new He(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},xh=new Je,df=new N,ff=new N,mr=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new fe(512,512),this.mapType=pn,this.map=null,this.mapPass=null,this.matrix=new Je,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new cr,this._frameExtents=new fe(1,1),this._viewportCount=1,this._viewports=[new xt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;df.setFromMatrixPosition(e.matrixWorld),t.position.copy(df),ff.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(ff),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,i){xh.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(xh,e.coordinateSystem,e.reversedDepth);let r=this._frameExtents,a=i?i.z/r.x:1,o=i?i.w/r.y:1,l=i?i.x/r.x:0,c=i?i.y/r.y:0;e.coordinateSystem===er||e.reversedDepth?t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(xh)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Lo=new N,Do=new en,Zn=new N,Aa=class extends Pt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Je,this.projectionMatrix=new Je,this.projectionMatrixInverse=new Je,this.coordinateSystem=zn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Lo,Do,Zn),Zn.x===1&&Zn.y===1&&Zn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Lo,Do,Zn.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Lo,Do,Zn),Zn.x===1&&Zn.y===1&&Zn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Lo,Do,Zn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},ki=new N,pf=new fe,mf=new fe,Ct=class extends Aa{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=cs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Zr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return cs*2*Math.atan(Math.tan(Zr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){ki.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(ki.x,ki.y).multiplyScalar(-e/ki.z),ki.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ki.x,ki.y).multiplyScalar(-e/ki.z)}getViewSize(e,t){return this.getViewBounds(e,pf,mf),t.subVectors(mf,pf)}setViewOffset(e,t,n,i,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Zr*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*i/l,t-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Ih=class extends mr{constructor(){super(new Ct(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=cs*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||i!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=i,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){let e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}},Ra=class extends gs{constructor(e,t,n=0,i=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Pt.DEFAULT_UP),this.updateMatrix(),this.target=new Pt,this.distance=n,this.angle=i,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new Ih}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},Ph=class extends mr{constructor(){super(new Ct(90,1,.5,500)),this.isPointLightShadow=!0}},_s=class extends gs{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new Ph}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},ii=class extends Aa{constructor(e=-1,t=1,n=1,i=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,r=n-e,a=n+e,o=i+t,l=i-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Lh=class extends mr{constructor(){super(new ii(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},In=class extends gs{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Pt.DEFAULT_UP),this.updateMatrix(),this.target=new Pt,this.shadow=new Lh}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}};var Ri=class{static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}};var _h=new WeakMap,Ca=class extends Gn{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&Fe("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&Fe("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,a=$n.get(`image-bitmap:${e}`);if(a!==void 0){if(r.manager.itemStart(e),a.then){a.then(c=>{_h.has(a)===!0?(i&&i(_h.get(a)),r.manager.itemError(e),r.manager.itemEnd(e)):(t&&t(c),r.manager.itemEnd(e))});return}setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);return}let o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let l=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign({},r.options,{colorSpaceConversion:"none"}))}).then(function(c){return $n.add(`image-bitmap:${e}`,c),t&&t(c),r.manager.itemEnd(e),c}).catch(function(c){i&&i(c),_h.set(l,c),$n.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});$n.add(`image-bitmap:${e}`,l),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var Zs=-90,$s=1,ul=class extends Pt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let i=new Ct(Zs,$s,e,t);i.layers=this.layers,this.add(i);let r=new Ct(Zs,$s,e,t);r.layers=this.layers,this.add(r);let a=new Ct(Zs,$s,e,t);a.layers=this.layers,this.add(a);let o=new Ct(Zs,$s,e,t);o.layers=this.layers,this.add(o);let l=new Ct(Zs,$s,e,t);l.layers=this.layers,this.add(l);let c=new Ct(Zs,$s,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,i,r,a,o,l]=t;for(let c of t)this.remove(c);if(e===zn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===er)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;let y=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let g=!1;e.isWebGLRenderer===!0?g=e.state.buffers.depth.getReversed():g=e.reversedDepthBuffer,e.setRenderTarget(n,0,i),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,i),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,i),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,i),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,i),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=y,e.setRenderTarget(n,5,i),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=m,n.texture.needsPMREMUpdate=!0}},dl=class extends Ct{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var cu="\\[\\]\\.:\\/",Yg=new RegExp("["+cu+"]","g"),hu="[^"+cu+"]",Kg="[^"+cu.replace("\\.","")+"]",Zg=/((?:WC+[\/:])*)/.source.replace("WC",hu),$g=/(WCOD+)?/.source.replace("WCOD",Kg),Jg=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",hu),jg=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",hu),Qg=new RegExp("^"+Zg+$g+Jg+jg+"$"),e0=["material","materials","bones","map"],Dh=class{constructor(e,t,n){let i=n||St.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},St=class s{constructor(e,t,n){this.path=t,this.parsedPath=n||s.parseTrackName(t),this.node=s.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new s.Composite(e,t,n):new s(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Yg,"")}static parseTrackName(e){let t=Qg.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let r=n.nodeName.substring(i+1);e0.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let l=n(o.children);if(l)return l}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,i=t.propertyName,r=t.propertyIndex;if(e||(e=s.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Fe("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){Ke("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Ke("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Ke("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Ke("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Ke("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){Ke("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){Ke("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let a=e[i];if(a===void 0){let c=t.nodeName;Ke("PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){Ke("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Ke("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};St.Composite=Dh;St.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};St.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};St.prototype.GetterByBindingType=[St.prototype._getValue_direct,St.prototype._getValue_array,St.prototype._getValue_arrayElement,St.prototype._getValue_toArray];St.prototype.SetterByBindingTypeAndVersioning=[[St.prototype._setValue_direct,St.prototype._setValue_direct_setNeedsUpdate,St.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[St.prototype._setValue_array,St.prototype._setValue_array_setNeedsUpdate,St.prototype._setValue_array_setMatrixWorldNeedsUpdate],[St.prototype._setValue_arrayElement,St.prototype._setValue_arrayElement_setNeedsUpdate,St.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[St.prototype._setValue_fromArray,St.prototype._setValue_fromArray_setNeedsUpdate,St.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var RM=new Float32Array(1);var gf=new Je,Ia=class{constructor(e,t,n=0,i=1/0){this.ray=new Hi(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new sr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):Ke("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return gf.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(gf),this}intersectObject(e,t=!0,n=[]){return Nh(e,this,n,t),n.sort(xf),n}intersectObjects(e,t=!0,n=[]){for(let i=0,r=e.length;i<r;i++)Nh(e[i],this,n,t);return n.sort(xf),n}};function xf(s,e){return s.distance-e.distance}function Nh(s,e,t,n){let i=!0;if(s.layers.test(e.layers)&&s.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){let r=s.children;for(let a=0,o=r.length;a<o;a++)Nh(r[a],e,t,!0)}}var Uh=class s{static{s.prototype.isMatrix2=!0}constructor(e,t,n,i){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,i){let r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=i,this}};function uu(s,e,t,n){let i=t0(n);switch(t){case eu:return s*e;case vl:return s*e/i.components*i.byteLength;case yl:return s*e/i.components*i.byteLength;case Ji:return s*e*2/i.components*i.byteLength;case Ml:return s*e*2/i.components*i.byteLength;case tu:return s*e*3/i.components*i.byteLength;case cn:return s*e*4/i.components*i.byteLength;case Sl:return s*e*4/i.components*i.byteLength;case La:case Da:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Na:case Ua:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Tl:case El:return Math.max(s,16)*Math.max(e,8)/4;case bl:case wl:return Math.max(s,8)*Math.max(e,8)/2;case Al:case Rl:case Il:case Pl:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Cl:case Fa:case Ll:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Dl:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Nl:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case Ul:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case Fl:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case Ol:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case Bl:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case kl:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case zl:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case Vl:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case Gl:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case Hl:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case Wl:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case Xl:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case ql:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case Yl:case Kl:case Zl:return Math.ceil(s/4)*Math.ceil(e/4)*16;case $l:case Jl:return Math.ceil(s/4)*Math.ceil(e/4)*8;case Oa:case jl:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function t0(s){switch(s){case pn:case $h:return{byteLength:1,components:1};case yr:case Jh:case ln:return{byteLength:2,components:1};case xl:case _l:return{byteLength:2,components:4};case Wn:case gl:case Kt:return{byteLength:4,components:1};case jh:case Qh:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?Fe("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Ip(){let s=null,e=!1,t=null,n=null;function i(r,a){n=s.requestAnimationFrame(i),t(r,a)}return{start:function(){e!==!0&&t!==null&&s!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function r0(s){let e=new WeakMap;function t(o,l){let c=o.array,h=o.usage,u=c.byteLength,d=s.createBuffer();s.bindBuffer(l,d),s.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=s.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=s.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=s.SHORT;else if(c instanceof Uint32Array)f=s.UNSIGNED_INT;else if(c instanceof Int32Array)f=s.INT;else if(c instanceof Int8Array)f=s.BYTE;else if(c instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,l,c){let h=l.array,u=l.updateRanges;if(s.bindBuffer(c,o),u.length===0)s.bufferSubData(c,0,h);else{u.sort((f,m)=>f.start-m.start);let d=0;for(let f=1;f<u.length;f++){let m=u[d],y=u[f];y.start<=m.start+m.count+1?m.count=Math.max(m.count,y.start+y.count-m.start):(++d,u[d]=y)}u.length=d+1;for(let f=0,m=u.length;f<m;f++){let y=u[f];s.bufferSubData(c,y.start*h.BYTES_PER_ELEMENT,h,y.start,y.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=e.get(o);l&&(s.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:i,remove:r,update:a}}var a0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,o0=`#ifdef USE_ALPHAHASH
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
#endif`,l0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,c0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,h0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,u0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,d0=`#ifdef USE_AOMAP
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
#endif`,f0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,p0=`#ifdef USE_BATCHING
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
#endif`,m0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,g0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,x0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,_0=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,v0=`#ifdef USE_IRIDESCENCE
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
#endif`,y0=`#ifdef USE_BUMPMAP
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
#endif`,M0=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,S0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,b0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,T0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,w0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,E0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,A0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,R0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,C0=`#define PI 3.141592653589793
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
} // validated`,I0=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,P0=`vec3 transformedNormal = objectNormal;
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
#endif`,L0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,D0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,N0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,U0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,F0="gl_FragColor = linearToOutputTexel( gl_FragColor );",O0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,B0=`#ifdef USE_ENVMAP
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
#endif`,k0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,z0=`#ifdef USE_ENVMAP
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
#endif`,V0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,G0=`#ifdef USE_ENVMAP
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
#endif`,H0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,W0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,X0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,q0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Y0=`#ifdef USE_GRADIENTMAP
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
}`,K0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Z0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,$0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,J0=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,j0=`#ifdef USE_ENVMAP
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
#endif`,Q0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,ex=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,tx=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,nx=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,ix=`PhysicalMaterial material;
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
#endif`,sx=`uniform sampler2D dfgLUT;
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
}`,rx=`
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
#endif`,ax=`#if defined( RE_IndirectDiffuse )
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
#endif`,ox=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lx=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,cx=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,hx=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ux=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,dx=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,fx=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,px=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,mx=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,gx=`#if defined( USE_POINTS_UV )
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
#endif`,xx=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,_x=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,vx=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,yx=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Mx=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Sx=`#ifdef USE_MORPHTARGETS
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
#endif`,bx=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Tx=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,wx=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Ex=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ax=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Rx=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Cx=`#ifdef USE_NORMALMAP
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
#endif`,Ix=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Px=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Lx=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Dx=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Nx=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Ux=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Fx=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Ox=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Bx=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,kx=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,zx=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Vx=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Gx=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Hx=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Wx=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Xx=`float getShadowMask() {
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
}`,qx=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Yx=`#ifdef USE_SKINNING
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
#endif`,Kx=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Zx=`#ifdef USE_SKINNING
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
#endif`,$x=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Jx=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,jx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Qx=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,e_=`#ifdef USE_TRANSMISSION
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
#endif`,t_=`#ifdef USE_TRANSMISSION
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
#endif`,n_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,i_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,s_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,r_=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,a_=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,o_=`uniform sampler2D t2D;
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
}`,l_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,c_=`#ifdef ENVMAP_TYPE_CUBE
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
}`,h_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,u_=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,d_=`#include <common>
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
}`,f_=`#if DEPTH_PACKING == 3200
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
}`,p_=`#define DISTANCE
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
}`,m_=`#define DISTANCE
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
}`,g_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,x_=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,__=`uniform float scale;
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
}`,v_=`uniform vec3 diffuse;
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
}`,y_=`#include <common>
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
}`,M_=`uniform vec3 diffuse;
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
}`,S_=`#define LAMBERT
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
}`,b_=`#define LAMBERT
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
}`,T_=`#define MATCAP
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
}`,w_=`#define MATCAP
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
}`,E_=`#define NORMAL
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
}`,A_=`#define NORMAL
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
}`,R_=`#define PHONG
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
}`,C_=`#define PHONG
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
}`,I_=`#define STANDARD
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
}`,P_=`#define STANDARD
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
}`,L_=`#define TOON
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
}`,D_=`#define TOON
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
}`,N_=`uniform float size;
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
}`,U_=`uniform vec3 diffuse;
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
}`,F_=`#include <common>
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
}`,O_=`uniform vec3 color;
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
}`,B_=`uniform float rotation;
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
}`,k_=`uniform vec3 diffuse;
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
}`,nt={alphahash_fragment:a0,alphahash_pars_fragment:o0,alphamap_fragment:l0,alphamap_pars_fragment:c0,alphatest_fragment:h0,alphatest_pars_fragment:u0,aomap_fragment:d0,aomap_pars_fragment:f0,batching_pars_vertex:p0,batching_vertex:m0,begin_vertex:g0,beginnormal_vertex:x0,bsdfs:_0,iridescence_fragment:v0,bumpmap_pars_fragment:y0,clipping_planes_fragment:M0,clipping_planes_pars_fragment:S0,clipping_planes_pars_vertex:b0,clipping_planes_vertex:T0,color_fragment:w0,color_pars_fragment:E0,color_pars_vertex:A0,color_vertex:R0,common:C0,cube_uv_reflection_fragment:I0,defaultnormal_vertex:P0,displacementmap_pars_vertex:L0,displacementmap_vertex:D0,emissivemap_fragment:N0,emissivemap_pars_fragment:U0,colorspace_fragment:F0,colorspace_pars_fragment:O0,envmap_fragment:B0,envmap_common_pars_fragment:k0,envmap_pars_fragment:z0,envmap_pars_vertex:V0,envmap_physical_pars_fragment:j0,envmap_vertex:G0,fog_vertex:H0,fog_pars_vertex:W0,fog_fragment:X0,fog_pars_fragment:q0,gradientmap_pars_fragment:Y0,lightmap_pars_fragment:K0,lights_lambert_fragment:Z0,lights_lambert_pars_fragment:$0,lights_pars_begin:J0,lights_toon_fragment:Q0,lights_toon_pars_fragment:ex,lights_phong_fragment:tx,lights_phong_pars_fragment:nx,lights_physical_fragment:ix,lights_physical_pars_fragment:sx,lights_fragment_begin:rx,lights_fragment_maps:ax,lights_fragment_end:ox,lightprobes_pars_fragment:lx,logdepthbuf_fragment:cx,logdepthbuf_pars_fragment:hx,logdepthbuf_pars_vertex:ux,logdepthbuf_vertex:dx,map_fragment:fx,map_pars_fragment:px,map_particle_fragment:mx,map_particle_pars_fragment:gx,metalnessmap_fragment:xx,metalnessmap_pars_fragment:_x,morphinstance_vertex:vx,morphcolor_vertex:yx,morphnormal_vertex:Mx,morphtarget_pars_vertex:Sx,morphtarget_vertex:bx,normal_fragment_begin:Tx,normal_fragment_maps:wx,normal_pars_fragment:Ex,normal_pars_vertex:Ax,normal_vertex:Rx,normalmap_pars_fragment:Cx,clearcoat_normal_fragment_begin:Ix,clearcoat_normal_fragment_maps:Px,clearcoat_pars_fragment:Lx,iridescence_pars_fragment:Dx,opaque_fragment:Nx,packing:Ux,premultiplied_alpha_fragment:Fx,project_vertex:Ox,dithering_fragment:Bx,dithering_pars_fragment:kx,roughnessmap_fragment:zx,roughnessmap_pars_fragment:Vx,shadowmap_pars_fragment:Gx,shadowmap_pars_vertex:Hx,shadowmap_vertex:Wx,shadowmask_pars_fragment:Xx,skinbase_vertex:qx,skinning_pars_vertex:Yx,skinning_vertex:Kx,skinnormal_vertex:Zx,specularmap_fragment:$x,specularmap_pars_fragment:Jx,tonemapping_fragment:jx,tonemapping_pars_fragment:Qx,transmission_fragment:e_,transmission_pars_fragment:t_,uv_pars_fragment:n_,uv_pars_vertex:i_,uv_vertex:s_,worldpos_vertex:r_,background_vert:a_,background_frag:o_,backgroundCube_vert:l_,backgroundCube_frag:c_,cube_vert:h_,cube_frag:u_,depth_vert:d_,depth_frag:f_,distance_vert:p_,distance_frag:m_,equirect_vert:g_,equirect_frag:x_,linedashed_vert:__,linedashed_frag:v_,meshbasic_vert:y_,meshbasic_frag:M_,meshlambert_vert:S_,meshlambert_frag:b_,meshmatcap_vert:T_,meshmatcap_frag:w_,meshnormal_vert:E_,meshnormal_frag:A_,meshphong_vert:R_,meshphong_frag:C_,meshphysical_vert:I_,meshphysical_frag:P_,meshtoon_vert:L_,meshtoon_frag:D_,points_vert:N_,points_frag:U_,shadow_vert:F_,shadow_frag:O_,sprite_vert:B_,sprite_frag:k_},Ee={common:{diffuse:{value:new He(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new je},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new je}},envmap:{envMap:{value:null},envMapRotation:{value:new je},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new je}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new je}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new je},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new je},normalScale:{value:new fe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new je},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new je}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new je}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new je}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new He(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new N},probesMax:{value:new N},probesResolution:{value:new N}},points:{diffuse:{value:new He(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0},uvTransform:{value:new je}},sprite:{diffuse:{value:new He(16777215)},opacity:{value:1},center:{value:new fe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new je},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0}}},oi={basic:{uniforms:nn([Ee.common,Ee.specularmap,Ee.envmap,Ee.aomap,Ee.lightmap,Ee.fog]),vertexShader:nt.meshbasic_vert,fragmentShader:nt.meshbasic_frag},lambert:{uniforms:nn([Ee.common,Ee.specularmap,Ee.envmap,Ee.aomap,Ee.lightmap,Ee.emissivemap,Ee.bumpmap,Ee.normalmap,Ee.displacementmap,Ee.fog,Ee.lights,{emissive:{value:new He(0)},envMapIntensity:{value:1}}]),vertexShader:nt.meshlambert_vert,fragmentShader:nt.meshlambert_frag},phong:{uniforms:nn([Ee.common,Ee.specularmap,Ee.envmap,Ee.aomap,Ee.lightmap,Ee.emissivemap,Ee.bumpmap,Ee.normalmap,Ee.displacementmap,Ee.fog,Ee.lights,{emissive:{value:new He(0)},specular:{value:new He(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:nt.meshphong_vert,fragmentShader:nt.meshphong_frag},standard:{uniforms:nn([Ee.common,Ee.envmap,Ee.aomap,Ee.lightmap,Ee.emissivemap,Ee.bumpmap,Ee.normalmap,Ee.displacementmap,Ee.roughnessmap,Ee.metalnessmap,Ee.fog,Ee.lights,{emissive:{value:new He(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:nt.meshphysical_vert,fragmentShader:nt.meshphysical_frag},toon:{uniforms:nn([Ee.common,Ee.aomap,Ee.lightmap,Ee.emissivemap,Ee.bumpmap,Ee.normalmap,Ee.displacementmap,Ee.gradientmap,Ee.fog,Ee.lights,{emissive:{value:new He(0)}}]),vertexShader:nt.meshtoon_vert,fragmentShader:nt.meshtoon_frag},matcap:{uniforms:nn([Ee.common,Ee.bumpmap,Ee.normalmap,Ee.displacementmap,Ee.fog,{matcap:{value:null}}]),vertexShader:nt.meshmatcap_vert,fragmentShader:nt.meshmatcap_frag},points:{uniforms:nn([Ee.points,Ee.fog]),vertexShader:nt.points_vert,fragmentShader:nt.points_frag},dashed:{uniforms:nn([Ee.common,Ee.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:nt.linedashed_vert,fragmentShader:nt.linedashed_frag},depth:{uniforms:nn([Ee.common,Ee.displacementmap]),vertexShader:nt.depth_vert,fragmentShader:nt.depth_frag},normal:{uniforms:nn([Ee.common,Ee.bumpmap,Ee.normalmap,Ee.displacementmap,{opacity:{value:1}}]),vertexShader:nt.meshnormal_vert,fragmentShader:nt.meshnormal_frag},sprite:{uniforms:nn([Ee.sprite,Ee.fog]),vertexShader:nt.sprite_vert,fragmentShader:nt.sprite_frag},background:{uniforms:{uvTransform:{value:new je},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:nt.background_vert,fragmentShader:nt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new je}},vertexShader:nt.backgroundCube_vert,fragmentShader:nt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:nt.cube_vert,fragmentShader:nt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:nt.equirect_vert,fragmentShader:nt.equirect_frag},distance:{uniforms:nn([Ee.common,Ee.displacementmap,{referencePosition:{value:new N},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:nt.distance_vert,fragmentShader:nt.distance_frag},shadow:{uniforms:nn([Ee.lights,Ee.fog,{color:{value:new He(0)},opacity:{value:1}}]),vertexShader:nt.shadow_vert,fragmentShader:nt.shadow_frag}};oi.physical={uniforms:nn([oi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new je},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new je},clearcoatNormalScale:{value:new fe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new je},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new je},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new je},sheen:{value:0},sheenColor:{value:new He(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new je},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new je},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new je},transmissionSamplerSize:{value:new fe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new je},attenuationDistance:{value:0},attenuationColor:{value:new He(0)},specularColor:{value:new He(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new je},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new je},anisotropyVector:{value:new fe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new je}}]),vertexShader:nt.meshphysical_vert,fragmentShader:nt.meshphysical_frag};var nc={r:0,b:0,g:0},z_=new Je,Pp=new je;Pp.set(-1,0,0,0,1,0,0,0,1);function V_(s,e,t,n,i,r){let a=new He(0),o=i===!0?0:1,l,c,h=null,u=0,d=null;function f(S){let E=S.isScene===!0?S.background:null;if(E&&E.isTexture){let M=S.backgroundBlurriness>0;E=e.get(E,M)}return E}function m(S){let E=!1,M=f(S);M===null?g(a,o):M&&M.isColor&&(g(M,1),E=!0);let b=s.xr.getEnvironmentBlendMode();b==="additive"?t.buffers.color.setClear(0,0,0,1,r):b==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(s.autoClear||E)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function y(S,E){let M=f(E);M&&(M.isCubeTexture||M.mapping===Pa)?(c===void 0&&(c=new pt(new qi(1,1,1),new Sn({name:"BackgroundCubeMaterial",uniforms:Ts(oi.backgroundCube.uniforms),vertexShader:oi.backgroundCube.vertexShader,fragmentShader:oi.backgroundCube.fragmentShader,side:on,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(b,T,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=M,c.material.uniforms.backgroundBlurriness.value=E.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(z_.makeRotationFromEuler(E.backgroundRotation)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Pp),c.material.toneMapped=it.getTransfer(M.colorSpace)!==ft,(h!==M||u!==M.version||d!==s.toneMapping)&&(c.material.needsUpdate=!0,h=M,u=M.version,d=s.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new pt(new Yt(2,2),new Sn({name:"BackgroundMaterial",uniforms:Ts(oi.background.uniforms),vertexShader:oi.background.vertexShader,fragmentShader:oi.background.fragmentShader,side:si,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,l.material.toneMapped=it.getTransfer(M.colorSpace)!==ft,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(h!==M||u!==M.version||d!==s.toneMapping)&&(l.material.needsUpdate=!0,h=M,u=M.version,d=s.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null))}function g(S,E){S.getRGB(nc,lu(s)),t.buffers.color.setClear(nc.r,nc.g,nc.b,E,r)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(S,E=1){a.set(S),o=E,g(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(S){o=S,g(a,o)},render:m,addToRenderList:y,dispose:p}}function G_(s,e){let t=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=d(null),r=i,a=!1;function o(I,B,F,R,k){let W=!1,Y=u(I,R,F,B);r!==Y&&(r=Y,c(r.object)),W=f(I,R,F,k),W&&m(I,R,F,k),k!==null&&e.update(k,s.ELEMENT_ARRAY_BUFFER),(W||a)&&(a=!1,M(I,B,F,R),k!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(k).buffer))}function l(){return s.createVertexArray()}function c(I){return s.bindVertexArray(I)}function h(I){return s.deleteVertexArray(I)}function u(I,B,F,R){let k=R.wireframe===!0,W=n[B.id];W===void 0&&(W={},n[B.id]=W);let Y=I.isInstancedMesh===!0?I.id:0,re=W[Y];re===void 0&&(re={},W[Y]=re);let K=re[F.id];K===void 0&&(K={},re[F.id]=K);let Q=K[k];return Q===void 0&&(Q=d(l()),K[k]=Q),Q}function d(I){let B=[],F=[],R=[];for(let k=0;k<t;k++)B[k]=0,F[k]=0,R[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:B,enabledAttributes:F,attributeDivisors:R,object:I,attributes:{},index:null}}function f(I,B,F,R){let k=r.attributes,W=B.attributes,Y=0,re=F.getAttributes();for(let K in re)if(re[K].location>=0){let se=k[K],ue=W[K];if(ue===void 0&&(K==="instanceMatrix"&&I.instanceMatrix&&(ue=I.instanceMatrix),K==="instanceColor"&&I.instanceColor&&(ue=I.instanceColor)),se===void 0||se.attribute!==ue||ue&&se.data!==ue.data)return!0;Y++}return r.attributesNum!==Y||r.index!==R}function m(I,B,F,R){let k={},W=B.attributes,Y=0,re=F.getAttributes();for(let K in re)if(re[K].location>=0){let se=W[K];se===void 0&&(K==="instanceMatrix"&&I.instanceMatrix&&(se=I.instanceMatrix),K==="instanceColor"&&I.instanceColor&&(se=I.instanceColor));let ue={};ue.attribute=se,se&&se.data&&(ue.data=se.data),k[K]=ue,Y++}r.attributes=k,r.attributesNum=Y,r.index=R}function y(){let I=r.newAttributes;for(let B=0,F=I.length;B<F;B++)I[B]=0}function g(I){p(I,0)}function p(I,B){let F=r.newAttributes,R=r.enabledAttributes,k=r.attributeDivisors;F[I]=1,R[I]===0&&(s.enableVertexAttribArray(I),R[I]=1),k[I]!==B&&(s.vertexAttribDivisor(I,B),k[I]=B)}function S(){let I=r.newAttributes,B=r.enabledAttributes;for(let F=0,R=B.length;F<R;F++)B[F]!==I[F]&&(s.disableVertexAttribArray(F),B[F]=0)}function E(I,B,F,R,k,W,Y){Y===!0?s.vertexAttribIPointer(I,B,F,k,W):s.vertexAttribPointer(I,B,F,R,k,W)}function M(I,B,F,R){y();let k=R.attributes,W=F.getAttributes(),Y=B.defaultAttributeValues;for(let re in W){let K=W[re];if(K.location>=0){let Q=k[re];if(Q===void 0&&(re==="instanceMatrix"&&I.instanceMatrix&&(Q=I.instanceMatrix),re==="instanceColor"&&I.instanceColor&&(Q=I.instanceColor)),Q!==void 0){let se=Q.normalized,ue=Q.itemSize,we=e.get(Q);if(we===void 0)continue;let Ge=we.buffer,Se=we.type,at=we.bytesPerElement,J=Se===s.INT||Se===s.UNSIGNED_INT||Q.gpuType===gl;if(Q.isInterleavedBufferAttribute){let ee=Q.data,ye=ee.stride,ze=Q.offset;if(ee.isInstancedInterleavedBuffer){for(let Ae=0;Ae<K.locationSize;Ae++)p(K.location+Ae,ee.meshPerAttribute);I.isInstancedMesh!==!0&&R._maxInstanceCount===void 0&&(R._maxInstanceCount=ee.meshPerAttribute*ee.count)}else for(let Ae=0;Ae<K.locationSize;Ae++)g(K.location+Ae);s.bindBuffer(s.ARRAY_BUFFER,Ge);for(let Ae=0;Ae<K.locationSize;Ae++)E(K.location+Ae,ue/K.locationSize,Se,se,ye*at,(ze+ue/K.locationSize*Ae)*at,J)}else{if(Q.isInstancedBufferAttribute){for(let ee=0;ee<K.locationSize;ee++)p(K.location+ee,Q.meshPerAttribute);I.isInstancedMesh!==!0&&R._maxInstanceCount===void 0&&(R._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let ee=0;ee<K.locationSize;ee++)g(K.location+ee);s.bindBuffer(s.ARRAY_BUFFER,Ge);for(let ee=0;ee<K.locationSize;ee++)E(K.location+ee,ue/K.locationSize,Se,se,ue*at,ue/K.locationSize*ee*at,J)}}else if(Y!==void 0){let se=Y[re];if(se!==void 0)switch(se.length){case 2:s.vertexAttrib2fv(K.location,se);break;case 3:s.vertexAttrib3fv(K.location,se);break;case 4:s.vertexAttrib4fv(K.location,se);break;default:s.vertexAttrib1fv(K.location,se)}}}}S()}function b(){w();for(let I in n){let B=n[I];for(let F in B){let R=B[F];for(let k in R){let W=R[k];for(let Y in W)h(W[Y].object),delete W[Y];delete R[k]}}delete n[I]}}function T(I){if(n[I.id]===void 0)return;let B=n[I.id];for(let F in B){let R=B[F];for(let k in R){let W=R[k];for(let Y in W)h(W[Y].object),delete W[Y];delete R[k]}}delete n[I.id]}function C(I){for(let B in n){let F=n[B];for(let R in F){let k=F[R];if(k[I.id]===void 0)continue;let W=k[I.id];for(let Y in W)h(W[Y].object),delete W[Y];delete k[I.id]}}}function x(I){for(let B in n){let F=n[B],R=I.isInstancedMesh===!0?I.id:0,k=F[R];if(k!==void 0){for(let W in k){let Y=k[W];for(let re in Y)h(Y[re].object),delete Y[re];delete k[W]}delete F[R],Object.keys(F).length===0&&delete n[B]}}}function w(){L(),a=!0,r!==i&&(r=i,c(r.object))}function L(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:w,resetDefaultState:L,dispose:b,releaseStatesOfGeometry:T,releaseStatesOfObject:x,releaseStatesOfProgram:C,initAttributes:y,enableAttribute:g,disableUnusedAttributes:S}}function H_(s,e,t){let n;function i(l){n=l}function r(l,c){s.drawArrays(n,l,c),t.update(c,n,1)}function a(l,c,h){h!==0&&(s.drawArraysInstanced(n,l,c,h),t.update(c,n,h))}function o(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let d=0;for(let f=0;f<h;f++)d+=c[f];t.update(d,n,1)}this.setMode=i,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function W_(s,e,t,n){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){let C=e.get("EXT_texture_filter_anisotropic");i=s.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(C){return!(C!==cn&&n.convert(C)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){let x=C===ln&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==pn&&C!==Kt&&!x&&n.convert(C)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE))}function l(C){if(C==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",h=l(c);h!==c&&(Fe("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&d===!1&&Fe("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),m=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=s.getParameter(s.MAX_TEXTURE_SIZE),g=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),p=s.getParameter(s.MAX_VERTEX_ATTRIBS),S=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),E=s.getParameter(s.MAX_VARYING_VECTORS),M=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),b=s.getParameter(s.MAX_SAMPLES),T=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:m,maxTextureSize:y,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:S,maxVaryings:E,maxFragmentUniforms:M,maxSamples:b,samples:T}}function X_(s){let e=this,t=null,n=0,i=!1,r=!1,a=new Bn,o=new je,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let f=u.length!==0||d||n!==0||i;return i=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){let m=u.clippingPlanes,y=u.clipIntersection,g=u.clipShadows,p=s.get(u);if(!i||m===null||m.length===0||r&&!g)r?h(null):c();else{let S=r?0:n,E=S*4,M=p.clippingState||null;l.value=M,M=h(m,d,E,f);for(let b=0;b!==E;++b)M[b]=t[b];p.clippingState=M,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=S}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,f,m){let y=u!==null?u.length:0,g=null;if(y!==0){if(g=l.value,m!==!0||g===null){let p=f+y*4,S=d.matrixWorldInverse;o.getNormalMatrix(S),(g===null||g.length<p)&&(g=new Float32Array(p));for(let E=0,M=f;E!==y;++E,M+=4)a.copy(u[E]).applyMatrix4(S,o),a.normal.toArray(g,M),g[M+3]=a.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=y,e.numIntersection=0,g}}var Tr=4,q_=6,Y_=20,K_=256,za=new ii,cp=new He,du=null,fu=0,pu=0,mu=!1,Z_=new N,ws=new N,ji=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,i=100,r={}){let{size:a=256,position:o=Z_}=r;du=this._renderer.getRenderTarget(),fu=this._renderer.getActiveCubeFace(),pu=this._renderer.getActiveMipmapLevel(),mu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,i,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=dp(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=up(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(du,fu,pu),this._renderer.xr.enabled=mu,e.scissorTest=!1,br(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Zi||e.mapping===Ss?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),du=this._renderer.getRenderTarget(),fu=this._renderer.getActiveCubeFace(),pu=this._renderer.getActiveMipmapLevel(),mu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:bt,minFilter:bt,generateMipmaps:!1,type:ln,format:cn,colorSpace:Zt,depthBuffer:!1},i=hp(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=hp(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=$_(r)),this._blurMaterial=j_(r,e,t),this._ggxMaterial=J_(r,e,t)}return i}_compileMaterial(e){let t=new pt(new Tt,e);this._renderer.compile(t,za)}_sceneToCubeUV(e,t,n,i,r){let l=new Ct(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(cp),u.toneMapping=bn,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(i),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new pt(new qi,new Vt({name:"PMREM.Background",side:on,depthWrite:!1,depthTest:!1})));let y=this._backgroundBox,g=y.material,p=!1,S=e.background;S?S.isColor&&(g.color.copy(S),e.background=null,p=!0):(g.color.copy(cp),p=!0);for(let E=0;E<6;E++){let M=E%3;M===0?(l.up.set(0,c[E],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[E],r.y,r.z)):M===1?(l.up.set(0,0,c[E]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[E],r.z)):(l.up.set(0,c[E],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[E]));let b=this._cubeSize;br(i,M*b,E>2?b:0,b,b),u.setRenderTarget(i),p&&u.render(y,l),u.render(e,l)}u.toneMapping=f,u.autoClear=d,e.background=S}_textureToCubeUV(e,t){let n=this._renderer,i=e.mapping===Zi||e.mapping===Ss;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=dp()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=up());let r=i?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;let o=r.uniforms;o.envMap.value=e;let l=this._cubeSize;br(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,za)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let i=this._lodMeshes.length;for(let r=1;r<i;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){let i=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let l=a.uniforms,c=n/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-h*h),d=c*1.25,f=u*d,{_lodMax:m}=this,y=this._sizeLods[n],g=3*y*(n>m-Tr?n-m+Tr:0),p=4*(this._cubeSize-y);l.envMap.value=e.texture,l.roughness.value=f,l.mipInt.value=m-t,br(r,g,p,3*y,2*y),i.setRenderTarget(r),i.render(o,za),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=m-n,br(e,g,p,3*y,2*y),i.setRenderTarget(e),i.render(o,za)}_blur(e,t,n,i){let r=this._pingPongRenderTarget,a=Math.min(i,Math.PI)/Math.SQRT2;this._blurPass(e,r,t,n,a),this._blurPass(r,e,n,n,a)}_blurPass(e,t,n,i,r){let a=this._renderer,o=this._blurMaterial,l=this._lodMeshes[i];l.material=o;let c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-n;let h=this._sizeLods[i],u=3*h*(i>this._lodMax-Tr?i-this._lodMax+Tr:0),d=4*(this._cubeSize-h);br(t,u,d,3*h,2*h),a.setRenderTarget(t),a.render(l,za)}};function $_(s){let e=[],t=[],n=s,i=s-Tr+1+q_;for(let r=0;r<i;r++){let a=Math.pow(2,n);e.push(a);let o=1/(a-2),l=-o,c=1+o,h=[l,l,c,l,c,c,l,l,c,c,l,c],u=6,d=6,f=3,m=new Float32Array(f*d*u),y=new Float32Array(f*d*u);for(let p=0;p<u;p++){let S=p%3*2/3-1,E=p>2?0:-1,M=[S,E,0,S+2/3,E,0,S+2/3,E+1,0,S,E,0,S+2/3,E+1,0,S,E+1,0];m.set(M,f*d*p);for(let b=0;b<d;b++){let T=h[b*2]*2-1,C=h[b*2+1]*2-1;p===0?ws.set(1,C,T):p===1?ws.set(-T,1,-C):p===2?ws.set(-T,C,1):p===3?ws.set(-1,C,-T):p===4?ws.set(-T,-1,C):ws.set(T,C,-1),ws.toArray(y,(p*d+b)*f)}}let g=new Tt;g.setAttribute("position",new Et(m,f)),g.setAttribute("outputDirection",new Et(y,f)),t.push(new pt(g,null)),n>Tr&&n--}return{lodMeshes:t,sizeLods:e}}function hp(s,e,t){let n=new un(s,e,t);return n.texture.mapping=Pa,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function br(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function J_(s,e,t){return new Sn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:K_,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:rc(),fragmentShader:`

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
		`,blending:ri,depthTest:!1,depthWrite:!1})}function j_(s,e,t){return new Sn({name:"SphericalGaussianBlur",defines:{SAMPLES:Y_,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:rc(),fragmentShader:`

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
		`,blending:ri,depthTest:!1,depthWrite:!1})}function up(){return new Sn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:rc(),fragmentShader:`

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
		`,blending:ri,depthTest:!1,depthWrite:!1})}function dp(){return new Sn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:rc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ri,depthTest:!1,depthWrite:!1})}function rc(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var sc=class extends un{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new ha(i),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new qi(5,5,5),r=new Sn({name:"CubemapFromEquirect",uniforms:Ts(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:on,blending:ri});r.uniforms.tEquirect.value=t;let a=new pt(i,r),o=t.minFilter;return t.minFilter===Pn&&(t.minFilter=bt),new ul(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,i);e.setRenderTarget(r)}};function Q_(s){let e=new WeakMap,t=new WeakMap,n=null;function i(d,f=!1){return d==null?null:f?a(d):r(d)}function r(d){if(d&&d.isTexture){let f=d.mapping;if(f===fl||f===pl)if(e.has(d)){let m=e.get(d).texture;return o(m,d.mapping)}else{let m=d.image;if(m&&m.height>0){let y=new sc(m.height);return y.fromEquirectangularTexture(s,d),e.set(d,y),d.addEventListener("dispose",c),o(y.texture,d.mapping)}else return null}}return d}function a(d){if(d&&d.isTexture){let f=d.mapping,m=f===fl||f===pl,y=f===Zi||f===Ss;if(m||y){let g=t.get(d),p=g!==void 0?g.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==p)return n===null&&(n=new ji(s)),g=m?n.fromEquirectangular(d,g):n.fromCubemap(d,g),g.texture.pmremVersion=d.pmremVersion,t.set(d,g),g.texture;if(g!==void 0)return g.texture;{let S=d.image;return m&&S&&S.height>0||y&&S&&l(S)?(n===null&&(n=new ji(s)),g=m?n.fromEquirectangular(d):n.fromCubemap(d),g.texture.pmremVersion=d.pmremVersion,t.set(d,g),d.addEventListener("dispose",h),g.texture):null}}}return d}function o(d,f){return f===fl?d.mapping=Zi:f===pl&&(d.mapping=Ss),d}function l(d){let f=0,m=6;for(let y=0;y<m;y++)d[y]!==void 0&&f++;return f===m}function c(d){let f=d.target;f.removeEventListener("dispose",c);let m=e.get(f);m!==void 0&&(e.delete(f),m.dispose())}function h(d){let f=d.target;f.removeEventListener("dispose",h);let m=t.get(f);m!==void 0&&(t.delete(f),m.dispose())}function u(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:u}}function ev(s){let e={};function t(n){if(e[n]!==void 0)return e[n];let i=s.getExtension(n);return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let i=t(n);return i===null&&as("WebGLRenderer: "+n+" extension not supported."),i}}}function tv(s,e,t,n){let i={},r=new WeakMap;function a(u){let d=u.target;d.index!==null&&e.remove(d.index);for(let m in d.attributes)e.remove(d.attributes[m]);d.removeEventListener("dispose",a),delete i[d.id];let f=r.get(d);f&&(e.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(u,d){return i[d.id]===!0||(d.addEventListener("dispose",a),i[d.id]=!0,t.memory.geometries++),d}function l(u){let d=u.attributes;for(let f in d)e.update(d[f],s.ARRAY_BUFFER)}function c(u){let d=[],f=u.index,m=u.attributes.position,y=0;if(m===void 0)return;if(f!==null){let S=f.array;y=f.version;for(let E=0,M=S.length;E<M;E+=3){let b=S[E+0],T=S[E+1],C=S[E+2];d.push(b,T,T,C,C,b)}}else{let S=m.array;y=m.version;for(let E=0,M=S.length/3-1;E<M;E+=3){let b=E+0,T=E+1,C=E+2;d.push(b,T,T,C,C,b)}}let g=new(m.count>=65535?sa:ia)(d,1);g.version=y;let p=r.get(u);p&&e.remove(p),r.set(u,g)}function h(u){let d=r.get(u);if(d){let f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function nv(s,e,t){let n;function i(u){n=u}let r,a;function o(u){r=u.type,a=u.bytesPerElement}function l(u,d){s.drawElements(n,d,r,u*a),t.update(d,n,1)}function c(u,d,f){f!==0&&(s.drawElementsInstanced(n,d,r,u*a,f),t.update(d,n,f))}function h(u,d,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,u,0,f);let y=0;for(let g=0;g<f;g++)y+=d[g];t.update(y,n,1)}this.setMode=i,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function iv(s){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case s.TRIANGLES:t.triangles+=o*(r/3);break;case s.LINES:t.lines+=o*(r/2);break;case s.LINE_STRIP:t.lines+=o*(r-1);break;case s.LINE_LOOP:t.lines+=o*r;break;case s.POINTS:t.points+=o*r;break;default:Ke("WebGLInfo: Unknown draw mode:",a);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function sv(s,e,t){let n=new WeakMap,i=new xt;function r(a,o,l){let c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0,d=n.get(o);if(d===void 0||d.count!==u){let w=function(){C.dispose(),n.delete(o),o.removeEventListener("dispose",w)};d!==void 0&&d.texture.dispose();let f=o.morphAttributes.position!==void 0,m=o.morphAttributes.normal!==void 0,y=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],S=o.morphAttributes.color||[],E=0;f===!0&&(E=1),m===!0&&(E=2),y===!0&&(E=3);let M=o.attributes.position.count*E,b=1;M>e.maxTextureSize&&(b=Math.ceil(M/e.maxTextureSize),M=e.maxTextureSize);let T=new Float32Array(M*b*4*u),C=new ta(T,M,b,u);C.type=Kt,C.needsUpdate=!0;let x=E*4;for(let L=0;L<u;L++){let I=g[L],B=p[L],F=S[L],R=M*b*4*L;for(let k=0;k<I.count;k++){let W=k*x;f===!0&&(i.fromBufferAttribute(I,k),T[R+W+0]=i.x,T[R+W+1]=i.y,T[R+W+2]=i.z,T[R+W+3]=0),m===!0&&(i.fromBufferAttribute(B,k),T[R+W+4]=i.x,T[R+W+5]=i.y,T[R+W+6]=i.z,T[R+W+7]=0),y===!0&&(i.fromBufferAttribute(F,k),T[R+W+8]=i.x,T[R+W+9]=i.y,T[R+W+10]=i.z,T[R+W+11]=F.itemSize===4?i.w:1)}}d={count:u,texture:C,size:new fe(M,b)},n.set(o,d),o.addEventListener("dispose",w)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",a.morphTexture,t);else{let f=0;for(let y=0;y<c.length;y++)f+=c[y];let m=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(s,"morphTargetBaseInfluence",m),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(s,"morphTargetsTextureSize",d.size)}return{update:r}}function rv(s,e,t,n,i){let r=new WeakMap;function a(c){let h=i.render.frame,u=c.geometry,d=e.get(c,u);if(r.get(d)!==h&&(e.update(d),r.set(d,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(t.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,s.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){let f=c.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return d}function o(){r=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}var av={[Hh]:"LINEAR_TONE_MAPPING",[Wh]:"REINHARD_TONE_MAPPING",[Xh]:"CINEON_TONE_MAPPING",[Ms]:"ACES_FILMIC_TONE_MAPPING",[Yh]:"AGX_TONE_MAPPING",[Kh]:"NEUTRAL_TONE_MAPPING",[qh]:"CUSTOM_TONE_MAPPING"};function ov(s,e,t,n,i,r){let a=new un(e,t,{type:s,depthBuffer:i,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,l=null,c=new Tt;c.setAttribute("position",new lt([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new lt([0,2,0,0,2,0],2));let h=new nl({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),u=new pt(c,h),d=new ii(-1,1,1,-1,0,1),f=null,m=null,y=!1,g,p=null,S=[],E=!1;this.setSize=function(M,b){a.setSize(M,b),o!==null&&o.setSize(M,b),l!==null&&l.setSize(M,b);for(let T=0;T<S.length;T++){let C=S[T];C.setSize&&C.setSize(M,b)}},this.setEffects=function(M){S=M,E=S.length>0&&S[0].isRenderPass===!0;let b=a.width,T=a.height;S.length>0&&o===null&&(o=new un(b,T,{type:ln,depthBuffer:!1,stencilBuffer:!1}),l=new un(b,T,{type:ln,depthBuffer:!1,stencilBuffer:!1}));for(let C=0;C<S.length;C++){let x=S[C];x.setSize&&x.setSize(b,T)}},this.begin=function(M,b){if(y||M.toneMapping===bn&&S.length===0)return!1;if(p=b,b!==null){let T=b.width,C=b.height;(a.width!==T||a.height!==C)&&this.setSize(T,C)}return E===!1&&M.setRenderTarget(a),g=M.toneMapping,M.toneMapping=bn,!0},this.hasRenderPass=function(){return E},this.end=function(M,b){M.toneMapping=g,y=!0;let T=a,C=o;for(let x=0;x<S.length;x++){let w=S[x];w.enabled!==!1&&(w.render(M,C,T,b),w.needsSwap!==!1&&(T=C,C=C===o?l:o))}if(f!==M.outputColorSpace||m!==M.toneMapping){f=M.outputColorSpace,m=M.toneMapping,h.defines={},it.getTransfer(f)===ft&&(h.defines.SRGB_TRANSFER="");let x=av[m];x&&(h.defines[x]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=T.texture,M.setRenderTarget(p),M.render(u,d),p=null,y=!1},this.isCompositing=function(){return y},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),h.dispose()}}var Lp=new Nt,_u=new Xi(1,1),Dp=new ta,Np=new qo,Up=new ha,fp=[],pp=[],mp=new Float32Array(16),gp=new Float32Array(9),xp=new Float32Array(4);function Ar(s,e,t){let n=s[0];if(n<=0||n>0)return s;let i=e*t,r=fp[i];if(r===void 0&&(r=new Float32Array(i),fp[i]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,s[a].toArray(r,o)}return r}function Ht(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function Wt(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function ac(s,e){let t=pp[e];t===void 0&&(t=new Int32Array(e),pp[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function lv(s,e){let t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function cv(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ht(t,e))return;s.uniform2fv(this.addr,e),Wt(t,e)}}function hv(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Ht(t,e))return;s.uniform3fv(this.addr,e),Wt(t,e)}}function uv(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ht(t,e))return;s.uniform4fv(this.addr,e),Wt(t,e)}}function dv(s,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ht(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),Wt(t,e)}else{if(Ht(t,n))return;xp.set(n),s.uniformMatrix2fv(this.addr,!1,xp),Wt(t,n)}}function fv(s,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ht(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),Wt(t,e)}else{if(Ht(t,n))return;gp.set(n),s.uniformMatrix3fv(this.addr,!1,gp),Wt(t,n)}}function pv(s,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ht(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),Wt(t,e)}else{if(Ht(t,n))return;mp.set(n),s.uniformMatrix4fv(this.addr,!1,mp),Wt(t,n)}}function mv(s,e){let t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function gv(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ht(t,e))return;s.uniform2iv(this.addr,e),Wt(t,e)}}function xv(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ht(t,e))return;s.uniform3iv(this.addr,e),Wt(t,e)}}function _v(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ht(t,e))return;s.uniform4iv(this.addr,e),Wt(t,e)}}function vv(s,e){let t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function yv(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ht(t,e))return;s.uniform2uiv(this.addr,e),Wt(t,e)}}function Mv(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ht(t,e))return;s.uniform3uiv(this.addr,e),Wt(t,e)}}function Sv(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ht(t,e))return;s.uniform4uiv(this.addr,e),Wt(t,e)}}function bv(s,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(_u.compareFunction=t.isReversedDepthBuffer()?tc:ec,r=_u):r=Lp,t.setTexture2D(e||r,i)}function Tv(s,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||Np,i)}function wv(s,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||Up,i)}function Ev(s,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||Dp,i)}function Av(s){switch(s){case 5126:return lv;case 35664:return cv;case 35665:return hv;case 35666:return uv;case 35674:return dv;case 35675:return fv;case 35676:return pv;case 5124:case 35670:return mv;case 35667:case 35671:return gv;case 35668:case 35672:return xv;case 35669:case 35673:return _v;case 5125:return vv;case 36294:return yv;case 36295:return Mv;case 36296:return Sv;case 35678:case 36198:case 36298:case 36306:case 35682:return bv;case 35679:case 36299:case 36307:return Tv;case 35680:case 36300:case 36308:case 36293:return wv;case 36289:case 36303:case 36311:case 36292:return Ev}}function Rv(s,e){s.uniform1fv(this.addr,e)}function Cv(s,e){let t=Ar(e,this.size,2);s.uniform2fv(this.addr,t)}function Iv(s,e){let t=Ar(e,this.size,3);s.uniform3fv(this.addr,t)}function Pv(s,e){let t=Ar(e,this.size,4);s.uniform4fv(this.addr,t)}function Lv(s,e){let t=Ar(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function Dv(s,e){let t=Ar(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function Nv(s,e){let t=Ar(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function Uv(s,e){s.uniform1iv(this.addr,e)}function Fv(s,e){s.uniform2iv(this.addr,e)}function Ov(s,e){s.uniform3iv(this.addr,e)}function Bv(s,e){s.uniform4iv(this.addr,e)}function kv(s,e){s.uniform1uiv(this.addr,e)}function zv(s,e){s.uniform2uiv(this.addr,e)}function Vv(s,e){s.uniform3uiv(this.addr,e)}function Gv(s,e){s.uniform4uiv(this.addr,e)}function Hv(s,e,t){let n=this.cache,i=e.length,r=ac(t,i);Ht(n,r)||(s.uniform1iv(this.addr,r),Wt(n,r));let a;this.type===s.SAMPLER_2D_SHADOW?a=_u:a=Lp;for(let o=0;o!==i;++o)t.setTexture2D(e[o]||a,r[o])}function Wv(s,e,t){let n=this.cache,i=e.length,r=ac(t,i);Ht(n,r)||(s.uniform1iv(this.addr,r),Wt(n,r));for(let a=0;a!==i;++a)t.setTexture3D(e[a]||Np,r[a])}function Xv(s,e,t){let n=this.cache,i=e.length,r=ac(t,i);Ht(n,r)||(s.uniform1iv(this.addr,r),Wt(n,r));for(let a=0;a!==i;++a)t.setTextureCube(e[a]||Up,r[a])}function qv(s,e,t){let n=this.cache,i=e.length,r=ac(t,i);Ht(n,r)||(s.uniform1iv(this.addr,r),Wt(n,r));for(let a=0;a!==i;++a)t.setTexture2DArray(e[a]||Dp,r[a])}function Yv(s){switch(s){case 5126:return Rv;case 35664:return Cv;case 35665:return Iv;case 35666:return Pv;case 35674:return Lv;case 35675:return Dv;case 35676:return Nv;case 5124:case 35670:return Uv;case 35667:case 35671:return Fv;case 35668:case 35672:return Ov;case 35669:case 35673:return Bv;case 5125:return kv;case 36294:return zv;case 36295:return Vv;case 36296:return Gv;case 35678:case 36198:case 36298:case 36306:case 35682:return Hv;case 35679:case 36299:case 36307:return Wv;case 35680:case 36300:case 36308:case 36293:return Xv;case 36289:case 36303:case 36311:case 36292:return qv}}var vu=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Av(t.type)}},yu=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Yv(t.type)}},Mu=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let i=this.seq;for(let r=0,a=i.length;r!==a;++r){let o=i[r];o.setValue(e,t[o.id],n)}}},gu=/(\w+)(\])?(\[|\.)?/g;function _p(s,e){s.seq.push(e),s.map[e.id]=e}function Kv(s,e,t){let n=s.name,i=n.length;for(gu.lastIndex=0;;){let r=gu.exec(n),a=gu.lastIndex,o=r[1],l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===i){_p(t,c===void 0?new vu(o,s,e):new yu(o,s,e));break}else{let u=t.map[o];u===void 0&&(u=new Mu(o),_p(t,u)),t=u}}}var wr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){let o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);Kv(o,l,this)}let i=[],r=[];for(let a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?i.push(a):r.push(a);i.length>0&&(this.seq=i.concat(r))}setValue(e,t,n,i){let r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){let i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,a=t.length;r!==a;++r){let o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,i)}}static seqWithValue(e,t){let n=[];for(let i=0,r=e.length;i!==r;++i){let a=e[i];a.id in t&&n.push(a)}return n}};function vp(s,e,t){let n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}var Zv=37297,$v=0;function Jv(s,e){let t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=i;a<r;a++){let o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}var yp=new je;function jv(s){it._getMatrix(yp,it.workingColorSpace,s);let e=`mat3( ${yp.elements.map(t=>t.toFixed(4))} )`;switch(it.getTransfer(s)){case Qr:return[e,"LinearTransferOETF"];case ft:return[e,"sRGBTransferOETF"];default:return Fe("WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function Mp(s,e,t){let n=s.getShaderParameter(e,s.COMPILE_STATUS),r=(s.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+Jv(s.getShaderSource(e),o)}else return r}function Qv(s,e){let t=jv(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}var ey={[Hh]:"Linear",[Wh]:"Reinhard",[Xh]:"Cineon",[Ms]:"ACESFilmic",[Yh]:"AgX",[Kh]:"Neutral",[qh]:"Custom"};function ty(s,e){let t=ey[e];return t===void 0?(Fe("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var ic=new N;function ny(){it.getLuminanceCoefficients(ic);let s=ic.x.toFixed(4),e=ic.y.toFixed(4),t=ic.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function iy(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ga).join(`
`)}function sy(s){let e=[];for(let t in s){let n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function ry(s,e){let t={},n=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){let r=s.getActiveAttrib(e,i),a=r.name,o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:s.getAttribLocation(e,a),locationSize:o}}return t}function Ga(s){return s!==""}function Sp(s,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function bp(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var ay=/^[ \t]*#include +<([\w\d./]+)>/gm;function Su(s){return s.replace(ay,ly)}var oy=new Map;function ly(s,e){let t=nt[e];if(t===void 0){let n=oy.get(e);if(n!==void 0)t=nt[n],Fe('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return Su(t)}var cy=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Tp(s){return s.replace(cy,hy)}function hy(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function wp(s){let e=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}var uy={[vs]:"SHADOWMAP_TYPE_PCF",[xr]:"SHADOWMAP_TYPE_VSM"};function dy(s){return uy[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var fy={[Zi]:"ENVMAP_TYPE_CUBE",[Ss]:"ENVMAP_TYPE_CUBE",[Pa]:"ENVMAP_TYPE_CUBE_UV"};function py(s){return s.envMap===!1?"ENVMAP_TYPE_CUBE":fy[s.envMapMode]||"ENVMAP_TYPE_CUBE"}var my={[Ss]:"ENVMAP_MODE_REFRACTION"};function gy(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":my[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}var xy={[Gh]:"ENVMAP_BLENDING_MULTIPLY",[Bf]:"ENVMAP_BLENDING_MIX",[kf]:"ENVMAP_BLENDING_ADD"};function _y(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":xy[s.combine]||"ENVMAP_BLENDING_NONE"}function vy(s){let e=s.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function yy(s,e,t,n){let i=s.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,l=dy(t),c=py(t),h=gy(t),u=_y(t),d=vy(t),f=iy(t),m=sy(r),y=i.createProgram(),g,p,S=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(Ga).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(Ga).join(`
`),p.length>0&&(p+=`
`)):(g=[wp(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ga).join(`
`),p=[wp(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==bn?"#define TONE_MAPPING":"",t.toneMapping!==bn?nt.tonemapping_pars_fragment:"",t.toneMapping!==bn?ty("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",nt.colorspace_pars_fragment,Qv("linearToOutputTexel",t.outputColorSpace),ny(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ga).join(`
`)),a=Su(a),a=Sp(a,t),a=bp(a,t),o=Su(o),o=Sp(o,t),o=bp(o,t),a=Tp(a),o=Tp(o),t.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",t.glslVersion===ru?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===ru?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let E=S+g+a,M=S+p+o,b=vp(i,i.VERTEX_SHADER,E),T=vp(i,i.FRAGMENT_SHADER,M);i.attachShader(y,b),i.attachShader(y,T),t.index0AttributeName!==void 0?i.bindAttribLocation(y,0,t.index0AttributeName):t.hasPositionAttribute===!0&&i.bindAttribLocation(y,0,"position"),i.linkProgram(y);function C(I){if(s.debug.checkShaderErrors){let B=i.getProgramInfoLog(y)||"",F=i.getShaderInfoLog(b)||"",R=i.getShaderInfoLog(T)||"",k=B.trim(),W=F.trim(),Y=R.trim(),re=!0,K=!0;if(i.getProgramParameter(y,i.LINK_STATUS)===!1)if(re=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,y,b,T);else{let Q=Mp(i,b,"vertex"),se=Mp(i,T,"fragment");Ke("WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(y,i.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+k+`
`+Q+`
`+se)}else k!==""?Fe("WebGLProgram: Program Info Log:",k):(W===""||Y==="")&&(K=!1);K&&(I.diagnostics={runnable:re,programLog:k,vertexShader:{log:W,prefix:g},fragmentShader:{log:Y,prefix:p}})}i.deleteShader(b),i.deleteShader(T),x=new wr(i,y),w=ry(i,y)}let x;this.getUniforms=function(){return x===void 0&&C(this),x};let w;this.getAttributes=function(){return w===void 0&&C(this),w};let L=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return L===!1&&(L=i.getProgramParameter(y,Zv)),L},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(y),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=$v++,this.cacheKey=e,this.usedTimes=1,this.program=y,this.vertexShader=b,this.fragmentShader=T,this}var My=0,bu=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let i=this._getShaderCacheForMaterial(e);return i.has(t)===!1&&(i.add(t),t.usedTimes++),i.has(n)===!1&&(i.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Tu(e),t.set(e,n)),n}},Tu=class{constructor(e){this.id=My++,this.code=e,this.usedTimes=0}};function Sy(s){return s===Ji||s===Fa||s===Oa}function by(s,e,t,n,i,r){let a=new sr,o=new bu,l=new Set,c=[],h=new Map,u=n.logarithmicDepthBuffer,d=n.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(x){return l.add(x),x===0?"uv":`uv${x}`}function y(x,w,L,I,B,F){let R=I.fog,k=B.geometry,W=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?I.environment:null,Y=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,re=e.get(x.envMap||W,Y),K=re&&re.mapping===Pa?re.image.height:null,Q=f[x.type];x.precision!==null&&(d=n.getMaxPrecision(x.precision),d!==x.precision&&Fe("WebGLProgram.getParameters:",x.precision,"not supported, using",d,"instead."));let se=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,ue=se!==void 0?se.length:0,we=0;k.morphAttributes.position!==void 0&&(we=1),k.morphAttributes.normal!==void 0&&(we=2),k.morphAttributes.color!==void 0&&(we=3);let Ge,Se,at,J;if(Q){let _t=oi[Q];Ge=_t.vertexShader,Se=_t.fragmentShader}else{Ge=x.vertexShader,Se=x.fragmentShader;let _t=o.getVertexShaderStage(x),ut=o.getFragmentShaderStage(x);o.update(x,_t,ut),at=_t.id,J=ut.id}let ee=s.getRenderTarget(),ye=s.state.buffers.depth.getReversed(),ze=B.isInstancedMesh===!0,Ae=B.isBatchedMesh===!0,qe=!!x.map,ht=!!x.matcap,te=!!re,oe=!!x.aoMap,he=!!x.lightMap,de=!!x.bumpMap&&x.wireframe===!1,ge=!!x.normalMap,Ve=!!x.displacementMap,Ue=!!x.emissiveMap,We=!!x.metalnessMap,$e=!!x.roughnessMap,U=x.anisotropy>0,Ye=x.clearcoat>0,Ze=x.dispersion>0,A=x.retroreflectivity>0,v=x.iridescence>0,H=x.sheen>0,X=x.transmission>0,$=U&&!!x.anisotropyMap,ce=Ye&&!!x.clearcoatMap,me=Ye&&!!x.clearcoatNormalMap,j=Ye&&!!x.clearcoatRoughnessMap,ie=v&&!!x.iridescenceMap,pe=v&&!!x.iridescenceThicknessMap,De=H&&!!x.sheenColorMap,be=H&&!!x.sheenRoughnessMap,_e=!!x.specularMap,Be=!!x.specularColorMap,Xe=!!x.specularIntensityMap,Qe=X&&!!x.transmissionMap,z=X&&!!x.thicknessMap,ve=!!x.gradientMap,ne=!!x.alphaMap,Me=x.alphaTest>0,Re=!!x.alphaHash,ae=!!x.extensions,ke=bn;x.toneMapped&&(ee===null||ee.isXRRenderTarget===!0)&&(ke=s.toneMapping);let Ne={shaderID:Q,shaderType:x.type,shaderName:x.name,vertexShader:Ge,fragmentShader:Se,defines:x.defines,customVertexShaderID:at,customFragmentShaderID:J,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:d,batching:Ae,batchingColor:Ae&&B._colorsTexture!==null,instancing:ze,instancingColor:ze&&B.instanceColor!==null,instancingMorph:ze&&B.morphTexture!==null,outputColorSpace:ee===null?s.outputColorSpace:ee.isXRRenderTarget===!0?ee.texture.colorSpace:it.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:qe,matcap:ht,envMap:te,envMapMode:te&&re.mapping,envMapCubeUVHeight:K,aoMap:oe,lightMap:he,bumpMap:de,normalMap:ge,displacementMap:Ve,emissiveMap:Ue,normalMapObjectSpace:ge&&x.normalMapType===Hf,normalMapTangentSpace:ge&&x.normalMapType===Ql,packedNormalMap:ge&&x.normalMapType===Ql&&Sy(x.normalMap.format),metalnessMap:We,roughnessMap:$e,anisotropy:U,anisotropyMap:$,clearcoat:Ye,clearcoatMap:ce,clearcoatNormalMap:me,clearcoatRoughnessMap:j,dispersion:Ze,retroreflection:A,iridescence:v,iridescenceMap:ie,iridescenceThicknessMap:pe,sheen:H,sheenColorMap:De,sheenRoughnessMap:be,specularMap:_e,specularColorMap:Be,specularIntensityMap:Xe,transmission:X,transmissionMap:Qe,thicknessMap:z,gradientMap:ve,opaque:x.transparent===!1&&x.blending===_r&&x.alphaToCoverage===!1,alphaMap:ne,alphaTest:Me,alphaHash:Re,combine:x.combine,mapUv:qe&&m(x.map.channel),aoMapUv:oe&&m(x.aoMap.channel),lightMapUv:he&&m(x.lightMap.channel),bumpMapUv:de&&m(x.bumpMap.channel),normalMapUv:ge&&m(x.normalMap.channel),displacementMapUv:Ve&&m(x.displacementMap.channel),emissiveMapUv:Ue&&m(x.emissiveMap.channel),metalnessMapUv:We&&m(x.metalnessMap.channel),roughnessMapUv:$e&&m(x.roughnessMap.channel),anisotropyMapUv:$&&m(x.anisotropyMap.channel),clearcoatMapUv:ce&&m(x.clearcoatMap.channel),clearcoatNormalMapUv:me&&m(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:j&&m(x.clearcoatRoughnessMap.channel),iridescenceMapUv:ie&&m(x.iridescenceMap.channel),iridescenceThicknessMapUv:pe&&m(x.iridescenceThicknessMap.channel),sheenColorMapUv:De&&m(x.sheenColorMap.channel),sheenRoughnessMapUv:be&&m(x.sheenRoughnessMap.channel),specularMapUv:_e&&m(x.specularMap.channel),specularColorMapUv:Be&&m(x.specularColorMap.channel),specularIntensityMapUv:Xe&&m(x.specularIntensityMap.channel),transmissionMapUv:Qe&&m(x.transmissionMap.channel),thicknessMapUv:z&&m(x.thicknessMap.channel),alphaMapUv:ne&&m(x.alphaMap.channel),vertexTangents:!!k.attributes.tangent&&(ge||U),vertexNormals:!!k.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!k.attributes.uv&&(qe||ne),fog:!!R,useFog:x.fog===!0,fogExp2:!!R&&R.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||k.attributes.normal===void 0&&ge===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:ye,skinning:B.isSkinnedMesh===!0,hasPositionAttribute:k.attributes.position!==void 0,morphTargets:k.morphAttributes.position!==void 0,morphNormals:k.morphAttributes.normal!==void 0,morphColors:k.morphAttributes.color!==void 0,morphTargetsCount:ue,morphTextureStride:we,numSunLights:w.sun.length,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numSunLightShadows:w.sunShadowMap.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numLightProbeGrids:F.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:x.dithering,shadowMapEnabled:s.shadowMap.enabled&&L.length>0,shadowMapType:s.shadowMap.type,toneMapping:ke,decodeVideoTexture:qe&&x.map.isVideoTexture===!0&&it.getTransfer(x.map.colorSpace)===ft,decodeVideoTextureEmissive:Ue&&x.emissiveMap.isVideoTexture===!0&&it.getTransfer(x.emissiveMap.colorSpace)===ft,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===Gt,flipSided:x.side===on,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:ae&&x.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ae&&x.extensions.multiDraw===!0||Ae)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return Ne.vertexUv1s=l.has(1),Ne.vertexUv2s=l.has(2),Ne.vertexUv3s=l.has(3),l.clear(),Ne}function g(x){let w=[];if(x.shaderID?w.push(x.shaderID):(w.push(x.customVertexShaderID),w.push(x.customFragmentShaderID)),x.defines!==void 0)for(let L in x.defines)w.push(L),w.push(x.defines[L]);return x.isRawShaderMaterial===!1&&(p(w,x),S(w,x),w.push(s.outputColorSpace)),w.push(x.customProgramCacheKey),w.join()}function p(x,w){x.push(w.precision),x.push(w.outputColorSpace),x.push(w.envMapMode),x.push(w.envMapCubeUVHeight),x.push(w.mapUv),x.push(w.alphaMapUv),x.push(w.lightMapUv),x.push(w.aoMapUv),x.push(w.bumpMapUv),x.push(w.normalMapUv),x.push(w.displacementMapUv),x.push(w.emissiveMapUv),x.push(w.metalnessMapUv),x.push(w.roughnessMapUv),x.push(w.anisotropyMapUv),x.push(w.clearcoatMapUv),x.push(w.clearcoatNormalMapUv),x.push(w.clearcoatRoughnessMapUv),x.push(w.iridescenceMapUv),x.push(w.iridescenceThicknessMapUv),x.push(w.sheenColorMapUv),x.push(w.sheenRoughnessMapUv),x.push(w.specularMapUv),x.push(w.specularColorMapUv),x.push(w.specularIntensityMapUv),x.push(w.transmissionMapUv),x.push(w.thicknessMapUv),x.push(w.combine),x.push(w.fogExp2),x.push(w.sizeAttenuation),x.push(w.morphTargetsCount),x.push(w.morphAttributeCount),x.push(w.numSunLights),x.push(w.numDirLights),x.push(w.numPointLights),x.push(w.numSpotLights),x.push(w.numSpotLightMaps),x.push(w.numHemiLights),x.push(w.numRectAreaLights),x.push(w.numSunLightShadows),x.push(w.numDirLightShadows),x.push(w.numPointLightShadows),x.push(w.numSpotLightShadows),x.push(w.numSpotLightShadowsWithMaps),x.push(w.numLightProbes),x.push(w.shadowMapType),x.push(w.toneMapping),x.push(w.numClippingPlanes),x.push(w.numClipIntersection),x.push(w.depthPacking)}function S(x,w){a.disableAll(),w.instancing&&a.enable(0),w.instancingColor&&a.enable(1),w.instancingMorph&&a.enable(2),w.matcap&&a.enable(3),w.envMap&&a.enable(4),w.normalMapObjectSpace&&a.enable(5),w.normalMapTangentSpace&&a.enable(6),w.clearcoat&&a.enable(7),w.iridescence&&a.enable(8),w.alphaTest&&a.enable(9),w.vertexColors&&a.enable(10),w.vertexAlphas&&a.enable(11),w.vertexUv1s&&a.enable(12),w.vertexUv2s&&a.enable(13),w.vertexUv3s&&a.enable(14),w.vertexTangents&&a.enable(15),w.anisotropy&&a.enable(16),w.alphaHash&&a.enable(17),w.batching&&a.enable(18),w.dispersion&&a.enable(19),w.retroreflection&&a.enable(24),w.batchingColor&&a.enable(20),w.gradientMap&&a.enable(21),w.packedNormalMap&&a.enable(22),w.vertexNormals&&a.enable(23),x.push(a.mask),a.disableAll(),w.fog&&a.enable(0),w.useFog&&a.enable(1),w.flatShading&&a.enable(2),w.logarithmicDepthBuffer&&a.enable(3),w.reversedDepthBuffer&&a.enable(4),w.skinning&&a.enable(5),w.morphTargets&&a.enable(6),w.morphNormals&&a.enable(7),w.morphColors&&a.enable(8),w.premultipliedAlpha&&a.enable(9),w.shadowMapEnabled&&a.enable(10),w.doubleSided&&a.enable(11),w.flipSided&&a.enable(12),w.useDepthPacking&&a.enable(13),w.dithering&&a.enable(14),w.transmission&&a.enable(15),w.sheen&&a.enable(16),w.opaque&&a.enable(17),w.pointsUvs&&a.enable(18),w.decodeVideoTexture&&a.enable(19),w.decodeVideoTextureEmissive&&a.enable(20),w.alphaToCoverage&&a.enable(21),w.numLightProbeGrids>0&&a.enable(22),w.hasPositionAttribute&&a.enable(23),x.push(a.mask)}function E(x){let w=f[x.type],L;if(w){let I=oi[w];L=ap.clone(I.uniforms)}else L=x.uniforms;return L}function M(x,w){let L=h.get(w);return L!==void 0?++L.usedTimes:(L=new yy(s,w,x,i),c.push(L),h.set(w,L)),L}function b(x){if(--x.usedTimes===0){let w=c.indexOf(x);c[w]=c[c.length-1],c.pop(),h.delete(x.cacheKey),x.destroy()}}function T(x){o.remove(x)}function C(){o.dispose()}return{getParameters:y,getProgramCacheKey:g,getUniforms:E,acquireProgram:M,releaseProgram:b,releaseShaderCache:T,programs:c,dispose:C}}function Ty(){let s=new WeakMap;function e(a){return s.has(a)}function t(a){let o=s.get(a);return o===void 0&&(o={},s.set(a,o)),o}function n(a){s.delete(a)}function i(a,o,l){s.get(a)[o]=l}function r(){s=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:r}}function wy(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.materialVariant!==e.materialVariant?s.materialVariant-e.materialVariant:s.z!==e.z?s.z-e.z:s.id-e.id}function Ep(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function Ap(){let s=[],e=0,t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function a(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function o(d,f,m,y,g,p){let S=s[e];return S===void 0?(S={id:d.id,object:d,geometry:f,material:m,materialVariant:a(d),groupOrder:y,renderOrder:d.renderOrder,z:g,group:p},s[e]=S):(S.id=d.id,S.object=d,S.geometry=f,S.material=m,S.materialVariant=a(d),S.groupOrder=y,S.renderOrder=d.renderOrder,S.z=g,S.group=p),e++,S}function l(d,f,m,y,g,p,S){S.reversedDepth===!0&&(g=-g);let E=o(d,f,m,y,g,p);m.transmission>0?n.push(E):m.transparent===!0?i.push(E):t.push(E)}function c(d,f,m,y,g,p){let S=o(d,f,m,y,g,p);m.transmission>0?n.unshift(S):m.transparent===!0?i.unshift(S):t.unshift(S)}function h(d,f){t.length>1&&t.sort(d||wy),n.length>1&&n.sort(f||Ep),i.length>1&&i.sort(f||Ep)}function u(){for(let d=e,f=s.length;d<f;d++){let m=s[d];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:l,unshift:c,finish:u,sort:h}}function Ey(){let s=new WeakMap;function e(n,i){let r=s.get(n),a;return r===void 0?(a=new Ap,s.set(n,[a])):i>=r.length?(a=new Ap,r.push(a)):a=r[i],a}function t(){s=new WeakMap}return{get:e,dispose:t}}function Ay(){let s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new N,color:new He};break;case"SpotLight":t={position:new N,direction:new N,color:new He,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new N,color:new He,distance:0,decay:0};break;case"HemisphereLight":t={direction:new N,skyColor:new He,groundColor:new He};break;case"RectAreaLight":t={color:new He,position:new N,halfWidth:new N,halfHeight:new N};break}return s[e.id]=t,t}}}function Ry(){let s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new fe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new fe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new fe,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}var Cy=0;function Iy(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function Py(s){let e=new Ay,t=Ry(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new N);let i=new N,r=new Je,a=new Je;function o(c){let h=0,u=0,d=0;for(let B=0;B<9;B++)n.probe[B].set(0,0,0);let f=0,m=0,y=0,g=0,p=0,S=0,E=0,M=0,b=0,T=0,C=0,x=0,w=0,L=0;c.sort(Iy);for(let B=0,F=c.length;B<F;B++){let R=c[B],k=R.color,W=R.intensity,Y=R.distance,re=null;if(R.shadow&&R.shadow.map&&(R.shadow.map.texture.format===Ji?re=R.shadow.map.texture:re=R.shadow.map.depthTexture||R.shadow.map.texture),R.isAmbientLight)h+=k.r*W,u+=k.g*W,d+=k.b*W;else if(R.isLightProbe){for(let K=0;K<9;K++)n.probe[K].addScaledVector(R.sh.coefficients[K],W);L++}else if(R.isSunLight){let K=e.get(R);if(K.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){let Q=R.shadow,se=t.get(R);se.shadowIntensity=Q.intensity,se.shadowBias=Q.bias,se.shadowNormalBias=Q.normalBias,se.shadowRadius=Q.radius,se.shadowMapSize.copy(Q.mapSize).multiply(Q.getFrameExtents()),n.sunShadow[m]=se,n.sunShadowMap[m]=re;let ue=Q.getViewportCount();for(let we=0;we<ue;we++)n.sunShadowMatrix[y+we]=Q.getMatrix(we),n.sunShadowCascade[y+we]=Q._cascadeData[we];y+=ue,m++}n.sun[f]=K,f++}else if(R.isDirectionalLight){let K=e.get(R);if(K.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){let Q=R.shadow,se=t.get(R);se.shadowIntensity=Q.intensity,se.shadowBias=Q.bias,se.shadowNormalBias=Q.normalBias,se.shadowRadius=Q.radius,se.shadowMapSize=Q.mapSize,n.directionalShadow[g]=se,n.directionalShadowMap[g]=re,n.directionalShadowMatrix[g]=R.shadow.matrix,b++}n.directional[g]=K,g++}else if(R.isSpotLight){let K=e.get(R);K.position.setFromMatrixPosition(R.matrixWorld),K.color.copy(k).multiplyScalar(W),K.distance=Y,K.coneCos=Math.cos(R.angle),K.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),K.decay=R.decay,n.spot[S]=K;let Q=R.shadow;if(R.map&&(n.spotLightMap[x]=R.map,x++,Q.updateMatrices(R),R.castShadow&&w++),n.spotLightMatrix[S]=Q.matrix,R.castShadow){let se=t.get(R);se.shadowIntensity=Q.intensity,se.shadowBias=Q.bias,se.shadowNormalBias=Q.normalBias,se.shadowRadius=Q.radius,se.shadowMapSize=Q.mapSize,n.spotShadow[S]=se,n.spotShadowMap[S]=re,C++}S++}else if(R.isRectAreaLight){let K=e.get(R);K.color.copy(k).multiplyScalar(W),K.halfWidth.set(R.width*.5,0,0),K.halfHeight.set(0,R.height*.5,0),n.rectArea[E]=K,E++}else if(R.isPointLight){let K=e.get(R);if(K.color.copy(R.color).multiplyScalar(R.intensity),K.distance=R.distance,K.decay=R.decay,R.castShadow){let Q=R.shadow,se=t.get(R);se.shadowIntensity=Q.intensity,se.shadowBias=Q.bias,se.shadowNormalBias=Q.normalBias,se.shadowRadius=Q.radius,se.shadowMapSize=Q.mapSize,se.shadowCameraNear=Q.camera.near,se.shadowCameraFar=Q.camera.far,n.pointShadow[p]=se,n.pointShadowMap[p]=re,n.pointShadowMatrix[p]=R.shadow.matrix,T++}n.point[p]=K,p++}else if(R.isHemisphereLight){let K=e.get(R);K.skyColor.copy(R.color).multiplyScalar(W),K.groundColor.copy(R.groundColor).multiplyScalar(W),n.hemi[M]=K,M++}}E>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Ee.LTC_FLOAT_1,n.rectAreaLTC2=Ee.LTC_FLOAT_2):(n.rectAreaLTC1=Ee.LTC_HALF_1,n.rectAreaLTC2=Ee.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;let I=n.hash;(I.sunLength!==f||I.directionalLength!==g||I.pointLength!==p||I.spotLength!==S||I.rectAreaLength!==E||I.hemiLength!==M||I.numSunShadows!==m||I.numDirectionalShadows!==b||I.numPointShadows!==T||I.numSpotShadows!==C||I.numSpotMaps!==x||I.numLightProbes!==L)&&(n.sun.length=f,n.directional.length=g,n.spot.length=S,n.rectArea.length=E,n.point.length=p,n.hemi.length=M,n.sunShadow.length=m,n.sunShadowMap.length=m,n.sunShadowMatrix.length=y,n.sunShadowCascade.length=y,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.directionalShadowMatrix.length=b,n.pointShadow.length=T,n.pointShadowMap.length=T,n.pointShadowMatrix.length=T,n.spotShadow.length=C,n.spotShadowMap.length=C,n.spotLightMatrix.length=C+x-w,n.spotLightMap.length=x,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=L,I.sunLength=f,I.directionalLength=g,I.pointLength=p,I.spotLength=S,I.rectAreaLength=E,I.hemiLength=M,I.numSunShadows=m,I.numDirectionalShadows=b,I.numPointShadows=T,I.numSpotShadows=C,I.numSpotMaps=x,I.numLightProbes=L,n.version=Cy++)}function l(c,h){let u=0,d=0,f=0,m=0,y=0,g=0,p=h.matrixWorldInverse;for(let S=0,E=c.length;S<E;S++){let M=c[S];if(M.isSunLight){let b=n.sun[u];b.direction.setFromMatrixPosition(M.matrixWorld),b.direction.transformDirection(p),u++}else if(M.isDirectionalLight){let b=n.directional[d];b.direction.setFromMatrixPosition(M.matrixWorld),i.setFromMatrixPosition(M.target.matrixWorld),b.direction.sub(i),b.direction.transformDirection(p),d++}else if(M.isSpotLight){let b=n.spot[m];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(p),b.direction.setFromMatrixPosition(M.matrixWorld),i.setFromMatrixPosition(M.target.matrixWorld),b.direction.sub(i),b.direction.transformDirection(p),m++}else if(M.isRectAreaLight){let b=n.rectArea[y];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(p),a.identity(),r.copy(M.matrixWorld),r.premultiply(p),a.extractRotation(r),b.halfWidth.set(M.width*.5,0,0),b.halfHeight.set(0,M.height*.5,0),b.halfWidth.applyMatrix4(a),b.halfHeight.applyMatrix4(a),y++}else if(M.isPointLight){let b=n.point[f];b.position.setFromMatrixPosition(M.matrixWorld),b.position.applyMatrix4(p),f++}else if(M.isHemisphereLight){let b=n.hemi[g];b.direction.setFromMatrixPosition(M.matrixWorld),b.direction.transformDirection(p),g++}}}return{setup:o,setupView:l,state:n}}function Rp(s){let e=new Py(s),t=[],n=[],i=[];function r(d){u.camera=d,t.length=0,n.length=0,i.length=0}function a(d){t.push(d)}function o(d){n.push(d)}function l(d){i.push(d)}function c(){e.setup(t)}function h(d){e.setupView(t,d)}let u={lightsArray:t,shadowsArray:n,lightProbeGridArray:i,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:u,setupLights:c,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function Ly(s){let e=new WeakMap;function t(i,r=0){let a=e.get(i),o;return a===void 0?(o=new Rp(s),e.set(i,[o])):r>=a.length?(o=new Rp(s),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}var Dy=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Ny=`uniform sampler2D shadow_pass;
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
}`,Uy=[new N(1,0,0),new N(-1,0,0),new N(0,1,0),new N(0,-1,0),new N(0,0,1),new N(0,0,-1)],Fy=[new N(0,-1,0),new N(0,-1,0),new N(0,0,1),new N(0,0,-1),new N(0,-1,0),new N(0,-1,0)],Cp=new Je,Va=new N,xu=new N;function Oy(s,e,t){let n=new cr,i=new fe,r=new fe,a=new xt,o=new Ki,l=new il,c={},h=t.maxTextureSize,u={[si]:on,[on]:si,[Gt]:Gt},d=new Sn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new fe},radius:{value:4}},vertexShader:Dy,fragmentShader:Ny}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let m=new Tt;m.setAttribute("position",new Et(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let y=new pt(m,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=vs;let p=this.type;this.render=function(T,C,x){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||T.length===0)return;this.type===gr&&(Fe("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=vs);let w=s.getRenderTarget(),L=s.getActiveCubeFace(),I=s.getActiveMipmapLevel(),B=s.state;B.setBlending(ri),B.buffers.depth.getReversed()===!0?B.buffers.color.setClear(0,0,0,0):B.buffers.color.setClear(1,1,1,1),B.buffers.depth.setTest(!0),B.setScissorTest(!1);let F=p!==this.type;F&&C.traverse(function(R){R.material&&(Array.isArray(R.material)?R.material.forEach(k=>k.needsUpdate=!0):R.material.needsUpdate=!0)});for(let R=0,k=T.length;R<k;R++){let W=T[R],Y=W.shadow;if(Y===void 0){Fe("WebGLShadowMap:",W,"has no shadow.");continue}if(Y.autoUpdate===!1&&Y.needsUpdate===!1)continue;i.copy(Y.mapSize);let re=Y.getFrameExtents();i.multiply(re),r.copy(Y.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/re.x),i.x=r.x*re.x,Y.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/re.y),i.y=r.y*re.y,Y.mapSize.y=r.y));let K=s.state.buffers.depth.getReversed();if(Y.camera._reversedDepth=K,Y.map===null||F===!0){if(Y.map!==null&&(Y.map.depthTexture!==null&&(Y.map.depthTexture.dispose(),Y.map.depthTexture=null),Y.map.dispose()),this.type===xr){if(W.isPointLight){Fe("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}Y.map=new un(i.x,i.y,{format:Ji,type:ln,minFilter:bt,magFilter:bt,generateMipmaps:!1}),Y.map.texture.name=W.name+".shadowMap",Y.map.depthTexture=new Xi(i.x,i.y,Kt),Y.map.depthTexture.name=W.name+".shadowMapDepth",Y.map.depthTexture.format=Jn,Y.map.depthTexture.compareFunction=null,Y.map.depthTexture.minFilter=Dt,Y.map.depthTexture.magFilter=Dt}else W.isPointLight?(Y.map=new sc(i.x),Y.map.depthTexture=new Zo(i.x,Wn)):(Y.map=new un(i.x,i.y),Y.map.depthTexture=new Xi(i.x,i.y,Wn)),Y.map.depthTexture.name=W.name+".shadowMap",Y.map.depthTexture.format=Jn,this.type===vs?(Y.map.depthTexture.compareFunction=K?tc:ec,Y.map.depthTexture.minFilter=bt,Y.map.depthTexture.magFilter=bt):(Y.map.depthTexture.compareFunction=null,Y.map.depthTexture.minFilter=Dt,Y.map.depthTexture.magFilter=Dt);Y.camera.updateProjectionMatrix()}Y.map.isWebGLCubeRenderTarget!==!0&&(Y.map.width!==i.x||Y.map.height!==i.y)&&Y.map.setSize(i.x,i.y);let Q=Y.map.isWebGLCubeRenderTarget?6:Y.getViewportCount();W.isPointLight!==!0&&Y.updateMatrices(W,x);for(let se=0;se<Q;se++){let ue=Y.getCamera(se);if(W.isPointLight){let we=Y.camera,Ge=Y.matrix,Se=W.distance||we.far;Se!==we.far&&(we.far=Se,we.updateProjectionMatrix()),Va.setFromMatrixPosition(W.matrixWorld),we.position.copy(Va),xu.copy(we.position),xu.add(Uy[se]),we.up.copy(Fy[se]),we.lookAt(xu),we.updateMatrixWorld(),Ge.makeTranslation(-Va.x,-Va.y,-Va.z),Cp.multiplyMatrices(we.projectionMatrix,we.matrixWorldInverse),Y._frustum.setFromProjectionMatrix(Cp,we.coordinateSystem,we.reversedDepth)}if(Y.map.isWebGLCubeRenderTarget)s.setRenderTarget(Y.map,se),s.clear();else{se===0&&(s.setRenderTarget(Y.map),s.clear());let we=Y.getViewport(se);a.set(r.x*we.x,r.y*we.y,r.x*we.z,r.y*we.w),B.viewport(a)}n=Y.getFrustum(se),M(C,x,ue,W,this.type)}Y.isPointLightShadow!==!0&&this.type===xr&&S(Y,x),Y.needsUpdate=!1}p=this.type,g.needsUpdate=!1,s.setRenderTarget(w,L,I)};function S(T,C){let x=e.update(y);d.defines.VSM_SAMPLES!==T.blurSamples&&(d.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null?T.mapPass=new un(i.x,i.y,{format:Ji,type:ln}):(T.mapPass.width!==T.map.width||T.mapPass.height!==T.map.height)&&T.mapPass.setSize(T.map.width,T.map.height),d.uniforms.shadow_pass.value=T.map.depthTexture,d.uniforms.resolution.value.set(T.map.width,T.map.height),d.uniforms.radius.value=T.radius,s.setRenderTarget(T.mapPass),s.clear(),s.renderBufferDirect(C,null,x,d,y,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value.set(T.map.width,T.map.height),f.uniforms.radius.value=T.radius,s.setRenderTarget(T.map),s.clear(),s.renderBufferDirect(C,null,x,f,y,null)}function E(T,C,x,w){let L=null,I=x.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(I!==void 0)L=I;else if(L=x.isPointLight===!0?l:o,s.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){let B=L.uuid,F=C.uuid,R=c[B];R===void 0&&(R={},c[B]=R);let k=R[F];k===void 0&&(k=L.clone(),R[F]=k,C.addEventListener("dispose",b)),L=k}if(L.visible=C.visible,L.wireframe=C.wireframe,w===xr?L.side=C.shadowSide!==null?C.shadowSide:C.side:L.side=C.shadowSide!==null?C.shadowSide:u[C.side],L.alphaMap=C.alphaMap,L.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,L.map=C.map,L.clipShadows=C.clipShadows,L.clippingPlanes=C.clippingPlanes,L.clipIntersection=C.clipIntersection,L.displacementMap=C.displacementMap,L.displacementScale=C.displacementScale,L.displacementBias=C.displacementBias,L.wireframeLinewidth=C.wireframeLinewidth,L.linewidth=C.linewidth,x.isPointLight===!0&&L.isMeshDistanceMaterial===!0){let B=s.properties.get(L);B.light=x}return L}function M(T,C,x,w,L){if(T.visible===!1)return;if(T.layers.test(C.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&L===xr)&&(!T.frustumCulled||T.intersectsFrustum(n))){T.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,T.matrixWorld);let F=e.update(T),R=T.material;if(Array.isArray(R)){let k=F.groups;for(let W=0,Y=k.length;W<Y;W++){let re=k[W],K=R[re.materialIndex];if(K&&K.visible){let Q=E(T,K,w,L);T.onBeforeShadow(s,T,C,x,F,Q,re),s.renderBufferDirect(x,null,F,Q,T,re),T.onAfterShadow(s,T,C,x,F,Q,re)}}}else if(R.visible){let k=E(T,R,w,L);T.onBeforeShadow(s,T,C,x,F,k,null),s.renderBufferDirect(x,null,F,k,T,null),T.onAfterShadow(s,T,C,x,F,k,null)}}let B=T.children;for(let F=0,R=B.length;F<R;F++)M(B[F],C,x,w,L)}function b(T){T.target.removeEventListener("dispose",b);for(let x in c){let w=c[x],L=T.target.uuid;L in w&&(w[L].dispose(),delete w[L])}}}function By(s,e){function t(){let z=!1,ve=new xt,ne=null,Me=new xt(0,0,0,0);return{setMask:function(Re){ne!==Re&&!z&&(s.colorMask(Re,Re,Re,Re),ne=Re)},setLocked:function(Re){z=Re},setClear:function(Re,ae,ke,Ne,_t){_t===!0&&(Re*=Ne,ae*=Ne,ke*=Ne),ve.set(Re,ae,ke,Ne),Me.equals(ve)===!1&&(s.clearColor(Re,ae,ke,Ne),Me.copy(ve))},reset:function(){z=!1,ne=null,Me.set(-1,0,0,0)}}}function n(){let z=!1,ve=!1,ne=null,Me=null,Re=null;return{setReversed:function(ae){if(ve!==ae){let ke=e.get("EXT_clip_control");ae?ke.clipControlEXT(ke.LOWER_LEFT_EXT,ke.ZERO_TO_ONE_EXT):ke.clipControlEXT(ke.LOWER_LEFT_EXT,ke.NEGATIVE_ONE_TO_ONE_EXT),ve=ae;let Ne=Re;Re=null,this.setClear(Ne)}},getReversed:function(){return ve},setTest:function(ae){ae?ee(s.DEPTH_TEST):ye(s.DEPTH_TEST)},setMask:function(ae){ne!==ae&&!z&&(s.depthMask(ae),ne=ae)},setFunc:function(ae){if(ve&&(ae=ep[ae]),Me!==ae){switch(ae){case Oo:s.depthFunc(s.NEVER);break;case Bo:s.depthFunc(s.ALWAYS);break;case ko:s.depthFunc(s.LESS);break;case js:s.depthFunc(s.LEQUAL);break;case zo:s.depthFunc(s.EQUAL);break;case Vo:s.depthFunc(s.GEQUAL);break;case Go:s.depthFunc(s.GREATER);break;case Ho:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}Me=ae}},setLocked:function(ae){z=ae},setClear:function(ae){Re!==ae&&(Re=ae,ve&&(ae=1-ae),s.clearDepth(ae))},reset:function(){z=!1,ne=null,Me=null,Re=null,ve=!1}}}function i(){let z=!1,ve=null,ne=null,Me=null,Re=null,ae=null,ke=null,Ne=null,_t=null;return{setTest:function(ut){z||(ut?ee(s.STENCIL_TEST):ye(s.STENCIL_TEST))},setMask:function(ut){ve!==ut&&!z&&(s.stencilMask(ut),ve=ut)},setFunc:function(ut,_n,wn){(ne!==ut||Me!==_n||Re!==wn)&&(s.stencilFunc(ut,_n,wn),ne=ut,Me=_n,Re=wn)},setOp:function(ut,_n,wn){(ae!==ut||ke!==_n||Ne!==wn)&&(s.stencilOp(ut,_n,wn),ae=ut,ke=_n,Ne=wn)},setLocked:function(ut){z=ut},setClear:function(ut){_t!==ut&&(s.clearStencil(ut),_t=ut)},reset:function(){z=!1,ve=null,ne=null,Me=null,Re=null,ae=null,ke=null,Ne=null,_t=null}}}let r=new t,a=new n,o=new i,l=new WeakMap,c=new WeakMap,h={},u={},d={},f=new WeakMap,m=[],y=null,g=!1,p=null,S=null,E=null,M=null,b=null,T=null,C=null,x=new He(0,0,0),w=0,L=!1,I=null,B=null,F=null,R=null,k=null,W=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS),Y=!1,re=0,K=s.getParameter(s.VERSION);K.indexOf("WebGL")!==-1?(re=parseFloat(/^WebGL (\d)/.exec(K)[1]),Y=re>=1):K.indexOf("OpenGL ES")!==-1&&(re=parseFloat(/^OpenGL ES (\d)/.exec(K)[1]),Y=re>=2);let Q=null,se={},ue=s.getParameter(s.SCISSOR_BOX),we=s.getParameter(s.VIEWPORT),Ge=new xt().fromArray(ue),Se=new xt().fromArray(we);function at(z,ve,ne,Me){let Re=new Uint8Array(4),ae=s.createTexture();s.bindTexture(z,ae),s.texParameteri(z,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(z,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let ke=0;ke<ne;ke++)z===s.TEXTURE_3D||z===s.TEXTURE_2D_ARRAY?s.texImage3D(ve,0,s.RGBA,1,1,Me,0,s.RGBA,s.UNSIGNED_BYTE,Re):s.texImage2D(ve+ke,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Re);return ae}let J={};J[s.TEXTURE_2D]=at(s.TEXTURE_2D,s.TEXTURE_2D,1),J[s.TEXTURE_CUBE_MAP]=at(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),J[s.TEXTURE_2D_ARRAY]=at(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),J[s.TEXTURE_3D]=at(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ee(s.DEPTH_TEST),a.setFunc(js),de(!1),ge(Fh),ee(s.CULL_FACE),oe(ri);function ee(z){h[z]!==!0&&(s.enable(z),h[z]=!0)}function ye(z){h[z]!==!1&&(s.disable(z),h[z]=!1)}function ze(z,ve){return d[z]!==ve?(s.bindFramebuffer(z,ve),d[z]=ve,z===s.DRAW_FRAMEBUFFER&&(d[s.FRAMEBUFFER]=ve),z===s.FRAMEBUFFER&&(d[s.DRAW_FRAMEBUFFER]=ve),!0):!1}function Ae(z,ve){let ne=m,Me=!1;if(z){ne=f.get(ve),ne===void 0&&(ne=[],f.set(ve,ne));let Re=z.textures;if(ne.length!==Re.length||ne[0]!==s.COLOR_ATTACHMENT0){for(let ae=0,ke=Re.length;ae<ke;ae++)ne[ae]=s.COLOR_ATTACHMENT0+ae;ne.length=Re.length,Me=!0}}else ne[0]!==s.BACK&&(ne[0]=s.BACK,Me=!0);Me&&s.drawBuffers(ne)}function qe(z){return y!==z?(s.useProgram(z),y=z,!0):!1}let ht={[ys]:s.FUNC_ADD,[Mf]:s.FUNC_SUBTRACT,[Sf]:s.FUNC_REVERSE_SUBTRACT};ht[bf]=s.MIN,ht[Tf]=s.MAX;let te={[wf]:s.ZERO,[Ef]:s.ONE,[Af]:s.SRC_COLOR,[zh]:s.SRC_ALPHA,[Df]:s.SRC_ALPHA_SATURATE,[Pf]:s.DST_COLOR,[Cf]:s.DST_ALPHA,[Rf]:s.ONE_MINUS_SRC_COLOR,[Vh]:s.ONE_MINUS_SRC_ALPHA,[Lf]:s.ONE_MINUS_DST_COLOR,[If]:s.ONE_MINUS_DST_ALPHA,[Nf]:s.CONSTANT_COLOR,[Uf]:s.ONE_MINUS_CONSTANT_COLOR,[Ff]:s.CONSTANT_ALPHA,[Of]:s.ONE_MINUS_CONSTANT_ALPHA};function oe(z,ve,ne,Me,Re,ae,ke,Ne,_t,ut){if(z===ri){g===!0&&(ye(s.BLEND),g=!1);return}if(g===!1&&(ee(s.BLEND),g=!0),z!==yf){if(z!==p||ut!==L){if((S!==ys||b!==ys)&&(s.blendEquation(s.FUNC_ADD),S=ys,b=ys),ut)switch(z){case _r:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Oh:s.blendFunc(s.ONE,s.ONE);break;case Bh:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case kh:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:Ke("WebGLState: Invalid blending: ",z);break}else switch(z){case _r:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Oh:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case Bh:Ke("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case kh:Ke("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ke("WebGLState: Invalid blending: ",z);break}E=null,M=null,T=null,C=null,x.set(0,0,0),w=0,p=z,L=ut}return}Re=Re||ve,ae=ae||ne,ke=ke||Me,(ve!==S||Re!==b)&&(s.blendEquationSeparate(ht[ve],ht[Re]),S=ve,b=Re),(ne!==E||Me!==M||ae!==T||ke!==C)&&(s.blendFuncSeparate(te[ne],te[Me],te[ae],te[ke]),E=ne,M=Me,T=ae,C=ke),(Ne.equals(x)===!1||_t!==w)&&(s.blendColor(Ne.r,Ne.g,Ne.b,_t),x.copy(Ne),w=_t),p=z,L=!1}function he(z,ve){z.side===Gt?ye(s.CULL_FACE):ee(s.CULL_FACE);let ne=z.side===on;ve&&(ne=!ne),de(ne),z.blending===_r&&z.transparent===!1?oe(ri):oe(z.blending,z.blendEquation,z.blendSrc,z.blendDst,z.blendEquationAlpha,z.blendSrcAlpha,z.blendDstAlpha,z.blendColor,z.blendAlpha,z.premultipliedAlpha),a.setFunc(z.depthFunc),a.setTest(z.depthTest),a.setMask(z.depthWrite),r.setMask(z.colorWrite);let Me=z.stencilWrite;o.setTest(Me),Me&&(o.setMask(z.stencilWriteMask),o.setFunc(z.stencilFunc,z.stencilRef,z.stencilFuncMask),o.setOp(z.stencilFail,z.stencilZFail,z.stencilZPass)),Ue(z.polygonOffset,z.polygonOffsetFactor,z.polygonOffsetUnits),z.alphaToCoverage===!0?ee(s.SAMPLE_ALPHA_TO_COVERAGE):ye(s.SAMPLE_ALPHA_TO_COVERAGE)}function de(z){I!==z&&(z?s.frontFace(s.CW):s.frontFace(s.CCW),I=z)}function ge(z){z!==_f?(ee(s.CULL_FACE),z!==B&&(z===Fh?s.cullFace(s.BACK):z===vf?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):ye(s.CULL_FACE),B=z}function Ve(z){z!==F&&(Y&&s.lineWidth(z),F=z)}function Ue(z,ve,ne){z?(ee(s.POLYGON_OFFSET_FILL),(R!==ve||k!==ne)&&(R=ve,k=ne,a.getReversed()&&(ve=-ve),s.polygonOffset(ve,ne))):ye(s.POLYGON_OFFSET_FILL)}function We(z){z?ee(s.SCISSOR_TEST):ye(s.SCISSOR_TEST)}function $e(z){z===void 0&&(z=s.TEXTURE0+W-1),Q!==z&&(s.activeTexture(z),Q=z)}function U(z,ve,ne){ne===void 0&&(Q===null?ne=s.TEXTURE0+W-1:ne=Q);let Me=se[ne];Me===void 0&&(Me={type:void 0,texture:void 0},se[ne]=Me),(Me.type!==z||Me.texture!==ve)&&(Q!==ne&&(s.activeTexture(ne),Q=ne),s.bindTexture(z,ve||J[z]),Me.type=z,Me.texture=ve)}function Ye(){let z=se[Q];z!==void 0&&z.type!==void 0&&(s.bindTexture(z.type,null),z.type=void 0,z.texture=void 0)}function Ze(){try{s.compressedTexImage2D(...arguments)}catch(z){Ke("WebGLState:",z)}}function A(){try{s.compressedTexImage3D(...arguments)}catch(z){Ke("WebGLState:",z)}}function v(){try{s.texSubImage2D(...arguments)}catch(z){Ke("WebGLState:",z)}}function H(){try{s.texSubImage3D(...arguments)}catch(z){Ke("WebGLState:",z)}}function X(){try{s.compressedTexSubImage2D(...arguments)}catch(z){Ke("WebGLState:",z)}}function $(){try{s.compressedTexSubImage3D(...arguments)}catch(z){Ke("WebGLState:",z)}}function ce(){try{s.texStorage2D(...arguments)}catch(z){Ke("WebGLState:",z)}}function me(){try{s.texStorage3D(...arguments)}catch(z){Ke("WebGLState:",z)}}function j(){try{s.texImage2D(...arguments)}catch(z){Ke("WebGLState:",z)}}function ie(){try{s.texImage3D(...arguments)}catch(z){Ke("WebGLState:",z)}}function pe(z){return u[z]!==void 0?u[z]:s.getParameter(z)}function De(z,ve){u[z]!==ve&&(s.pixelStorei(z,ve),u[z]=ve)}function be(z){Ge.equals(z)===!1&&(s.scissor(z.x,z.y,z.z,z.w),Ge.copy(z))}function _e(z){Se.equals(z)===!1&&(s.viewport(z.x,z.y,z.z,z.w),Se.copy(z))}function Be(z,ve){let ne=c.get(ve);ne===void 0&&(ne=new WeakMap,c.set(ve,ne));let Me=ne.get(z);Me===void 0&&(Me=s.getUniformBlockIndex(ve,z.name),ne.set(z,Me))}function Xe(z,ve){let Me=c.get(ve).get(z);l.get(ve)!==Me&&(s.uniformBlockBinding(ve,Me,z.__bindingPointIndex),l.set(ve,Me))}function Qe(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),a.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),h={},u={},Q=null,se={},d={},f=new WeakMap,m=[],y=null,g=!1,p=null,S=null,E=null,M=null,b=null,T=null,C=null,x=new He(0,0,0),w=0,L=!1,I=null,B=null,F=null,R=null,k=null,Ge.set(0,0,s.canvas.width,s.canvas.height),Se.set(0,0,s.canvas.width,s.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ee,disable:ye,bindFramebuffer:ze,drawBuffers:Ae,useProgram:qe,setBlending:oe,setMaterial:he,setFlipSided:de,setCullFace:ge,setLineWidth:Ve,setPolygonOffset:Ue,setScissorTest:We,activeTexture:$e,bindTexture:U,unbindTexture:Ye,compressedTexImage2D:Ze,compressedTexImage3D:A,texImage2D:j,texImage3D:ie,pixelStorei:De,getParameter:pe,updateUBOMapping:Be,uniformBlockBinding:Xe,texStorage2D:ce,texStorage3D:me,texSubImage2D:v,texSubImage3D:H,compressedTexSubImage2D:X,compressedTexSubImage3D:$,scissor:be,viewport:_e,reset:Qe}}function ky(s,e,t,n,i,r,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new fe,h=new WeakMap,u=new Set,d,f=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function y(A,v){return m?new OffscreenCanvas(A,v):tr("canvas")}function g(A,v,H){let X=1,$=Ze(A);if(($.width>H||$.height>H)&&(X=H/Math.max($.width,$.height)),X<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){let ce=Math.floor(X*$.width),me=Math.floor(X*$.height);d===void 0&&(d=y(ce,me));let j=v?y(ce,me):d;return j.width=ce,j.height=me,j.getContext("2d").drawImage(A,0,0,ce,me),Fe("WebGLRenderer: Texture has been resized from ("+$.width+"x"+$.height+") to ("+ce+"x"+me+")."),j}else return"data"in A&&Fe("WebGLRenderer: Image in DataTexture is too big ("+$.width+"x"+$.height+")."),A;return A}function p(A){return A.generateMipmaps}function S(A){s.generateMipmap(A)}function E(A){return A.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?s.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function M(A,v,H,X,$,ce=!1){if(A!==null){if(s[A]!==void 0)return s[A];Fe("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let me;X&&(me=e.get("EXT_texture_norm16"),me||Fe("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let j=v;if(v===s.RED&&(H===s.FLOAT&&(j=s.R32F),H===s.HALF_FLOAT&&(j=s.R16F),H===s.UNSIGNED_BYTE&&(j=s.R8),H===s.UNSIGNED_SHORT&&me&&(j=me.R16_EXT),H===s.SHORT&&me&&(j=me.R16_SNORM_EXT)),v===s.RED_INTEGER&&(H===s.UNSIGNED_BYTE&&(j=s.R8UI),H===s.UNSIGNED_SHORT&&(j=s.R16UI),H===s.UNSIGNED_INT&&(j=s.R32UI),H===s.BYTE&&(j=s.R8I),H===s.SHORT&&(j=s.R16I),H===s.INT&&(j=s.R32I)),v===s.RG&&(H===s.FLOAT&&(j=s.RG32F),H===s.HALF_FLOAT&&(j=s.RG16F),H===s.UNSIGNED_BYTE&&(j=s.RG8),H===s.UNSIGNED_SHORT&&me&&(j=me.RG16_EXT),H===s.SHORT&&me&&(j=me.RG16_SNORM_EXT)),v===s.RG_INTEGER&&(H===s.UNSIGNED_BYTE&&(j=s.RG8UI),H===s.UNSIGNED_SHORT&&(j=s.RG16UI),H===s.UNSIGNED_INT&&(j=s.RG32UI),H===s.BYTE&&(j=s.RG8I),H===s.SHORT&&(j=s.RG16I),H===s.INT&&(j=s.RG32I)),v===s.RGB_INTEGER&&(H===s.UNSIGNED_BYTE&&(j=s.RGB8UI),H===s.UNSIGNED_SHORT&&(j=s.RGB16UI),H===s.UNSIGNED_INT&&(j=s.RGB32UI),H===s.BYTE&&(j=s.RGB8I),H===s.SHORT&&(j=s.RGB16I),H===s.INT&&(j=s.RGB32I)),v===s.RGBA_INTEGER&&(H===s.UNSIGNED_BYTE&&(j=s.RGBA8UI),H===s.UNSIGNED_SHORT&&(j=s.RGBA16UI),H===s.UNSIGNED_INT&&(j=s.RGBA32UI),H===s.BYTE&&(j=s.RGBA8I),H===s.SHORT&&(j=s.RGBA16I),H===s.INT&&(j=s.RGBA32I)),v===s.RGB&&(H===s.UNSIGNED_SHORT&&me&&(j=me.RGB16_EXT),H===s.SHORT&&me&&(j=me.RGB16_SNORM_EXT),H===s.UNSIGNED_INT_5_9_9_9_REV&&(j=s.RGB9_E5),H===s.UNSIGNED_INT_10F_11F_11F_REV&&(j=s.R11F_G11F_B10F)),v===s.RGBA){let ie=ce?Qr:it.getTransfer($);H===s.FLOAT&&(j=s.RGBA32F),H===s.HALF_FLOAT&&(j=s.RGBA16F),H===s.UNSIGNED_BYTE&&(j=ie===ft?s.SRGB8_ALPHA8:s.RGBA8),H===s.UNSIGNED_SHORT&&me&&(j=me.RGBA16_EXT),H===s.SHORT&&me&&(j=me.RGBA16_SNORM_EXT),H===s.UNSIGNED_SHORT_4_4_4_4&&(j=s.RGBA4),H===s.UNSIGNED_SHORT_5_5_5_1&&(j=s.RGB5_A1)}return(j===s.R16F||j===s.R32F||j===s.RG16F||j===s.RG32F||j===s.RGBA16F||j===s.RGBA32F)&&e.get("EXT_color_buffer_float"),j}function b(A,v){let H;return A?v===null||v===Wn||v===Mr?H=s.DEPTH24_STENCIL8:v===Kt?H=s.DEPTH32F_STENCIL8:v===yr&&(H=s.DEPTH24_STENCIL8,Fe("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===Wn||v===Mr?H=s.DEPTH_COMPONENT24:v===Kt?H=s.DEPTH_COMPONENT32F:v===yr&&(H=s.DEPTH_COMPONENT16),H}function T(A,v){return p(A)===!0||A.isFramebufferTexture&&A.minFilter!==Dt&&A.minFilter!==bt?Math.log2(Math.max(v.width,v.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?v.mipmaps.length:1}function C(A){let v=A.target;v.removeEventListener("dispose",C),w(v),v.isVideoTexture&&h.delete(v),v.isHTMLTexture&&u.delete(v)}function x(A){let v=A.target;v.removeEventListener("dispose",x),I(v)}function w(A){let v=n.get(A);if(v.__webglInit===void 0)return;let H=A.source,X=f.get(H);if(X){let $=X[v.__cacheKey];$.usedTimes--,$.usedTimes===0&&L(A),Object.keys(X).length===0&&f.delete(H)}n.remove(A)}function L(A){let v=n.get(A);s.deleteTexture(v.__webglTexture);let H=A.source,X=f.get(H);delete X[v.__cacheKey],a.memory.textures--}function I(A){let v=n.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),n.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(v.__webglFramebuffer[X]))for(let $=0;$<v.__webglFramebuffer[X].length;$++)s.deleteFramebuffer(v.__webglFramebuffer[X][$]);else s.deleteFramebuffer(v.__webglFramebuffer[X]);v.__webglDepthbuffer&&s.deleteRenderbuffer(v.__webglDepthbuffer[X])}else{if(Array.isArray(v.__webglFramebuffer))for(let X=0;X<v.__webglFramebuffer.length;X++)s.deleteFramebuffer(v.__webglFramebuffer[X]);else s.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&s.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&s.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let X=0;X<v.__webglColorRenderbuffer.length;X++)v.__webglColorRenderbuffer[X]&&s.deleteRenderbuffer(v.__webglColorRenderbuffer[X]);v.__webglDepthRenderbuffer&&s.deleteRenderbuffer(v.__webglDepthRenderbuffer)}let H=A.textures;for(let X=0,$=H.length;X<$;X++){let ce=n.get(H[X]);ce.__webglTexture&&(s.deleteTexture(ce.__webglTexture),a.memory.textures--),n.remove(H[X])}n.remove(A)}let B=0;function F(){B=0}function R(){return B}function k(A){B=A}function W(){let A=B;return A>=i.maxTextures&&Fe("WebGLTextures: Trying to use "+(A+1)+" texture units while this GPU supports only "+i.maxTextures),B+=1,A}function Y(A){let v=[];return v.push(A.wrapS),v.push(A.wrapT),v.push(A.wrapR||0),v.push(A.magFilter),v.push(A.minFilter),v.push(A.anisotropy),v.push(A.internalFormat),v.push(A.format),v.push(A.type),v.push(A.generateMipmaps),v.push(A.premultiplyAlpha),v.push(A.flipY),v.push(A.unpackAlignment),v.push(A.colorSpace),v.join()}function re(A,v){let H=n.get(A);if(A.isVideoTexture&&U(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&H.__version!==A.version){let X=A.image;if(X===null)Fe("WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)Fe("WebGLRenderer: Texture marked for update but image is incomplete");else{ye(H,A,v);return}}else A.isExternalTexture&&(H.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(s.TEXTURE_2D,H.__webglTexture,s.TEXTURE0+v)}function K(A,v){let H=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&H.__version!==A.version){ye(H,A,v);return}else A.isExternalTexture&&(H.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(s.TEXTURE_2D_ARRAY,H.__webglTexture,s.TEXTURE0+v)}function Q(A,v){let H=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&H.__version!==A.version){ye(H,A,v);return}t.bindTexture(s.TEXTURE_3D,H.__webglTexture,s.TEXTURE0+v)}function se(A,v){let H=n.get(A);if(A.isCubeDepthTexture!==!0&&A.version>0&&H.__version!==A.version){ze(H,A,v);return}t.bindTexture(s.TEXTURE_CUBE_MAP,H.__webglTexture,s.TEXTURE0+v)}let ue={[Cn]:s.REPEAT,[qt]:s.CLAMP_TO_EDGE,[Qs]:s.MIRRORED_REPEAT},we={[Dt]:s.NEAREST,[ml]:s.NEAREST_MIPMAP_NEAREST,[bs]:s.NEAREST_MIPMAP_LINEAR,[bt]:s.LINEAR,[vr]:s.LINEAR_MIPMAP_NEAREST,[Pn]:s.LINEAR_MIPMAP_LINEAR},Ge={[Xf]:s.NEVER,[$f]:s.ALWAYS,[qf]:s.LESS,[ec]:s.LEQUAL,[Yf]:s.EQUAL,[tc]:s.GEQUAL,[Kf]:s.GREATER,[Zf]:s.NOTEQUAL};function Se(A,v){if(v.type===Kt&&e.has("OES_texture_float_linear")===!1&&(v.magFilter===bt||v.magFilter===vr||v.magFilter===bs||v.magFilter===Pn||v.minFilter===bt||v.minFilter===vr||v.minFilter===bs||v.minFilter===Pn)&&Fe("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(A,s.TEXTURE_WRAP_S,ue[v.wrapS]),s.texParameteri(A,s.TEXTURE_WRAP_T,ue[v.wrapT]),(A===s.TEXTURE_3D||A===s.TEXTURE_2D_ARRAY)&&s.texParameteri(A,s.TEXTURE_WRAP_R,ue[v.wrapR]),s.texParameteri(A,s.TEXTURE_MAG_FILTER,we[v.magFilter]),s.texParameteri(A,s.TEXTURE_MIN_FILTER,we[v.minFilter]),v.compareFunction&&(s.texParameteri(A,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(A,s.TEXTURE_COMPARE_FUNC,Ge[v.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===Dt||v.minFilter!==bs&&v.minFilter!==Pn||v.type===Kt&&e.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||n.get(v).__currentAnisotropy){let H=e.get("EXT_texture_filter_anisotropic");s.texParameterf(A,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,i.getMaxAnisotropy())),n.get(v).__currentAnisotropy=v.anisotropy}}}function at(A,v){let H=!1;A.__webglInit===void 0&&(A.__webglInit=!0,v.addEventListener("dispose",C));let X=v.source,$=f.get(X);$===void 0&&($={},f.set(X,$));let ce=Y(v);if(ce!==A.__cacheKey){$[ce]===void 0&&($[ce]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,H=!0),$[ce].usedTimes++;let me=$[A.__cacheKey];me!==void 0&&($[A.__cacheKey].usedTimes--,me.usedTimes===0&&L(v)),A.__cacheKey=ce,A.__webglTexture=$[ce].texture}return H}function J(A,v,H){return Math.floor(Math.floor(A/H)/v)}function ee(A,v,H,X){let ce=A.updateRanges;if(ce.length===0)t.texSubImage2D(s.TEXTURE_2D,0,0,0,v.width,v.height,H,X,v.data);else{ce.sort((De,be)=>De.start-be.start);let me=0;for(let De=1;De<ce.length;De++){let be=ce[me],_e=ce[De],Be=be.start+be.count,Xe=J(_e.start,v.width,4),Qe=J(be.start,v.width,4);_e.start<=Be+1&&Xe===Qe&&J(_e.start+_e.count-1,v.width,4)===Xe?be.count=Math.max(be.count,_e.start+_e.count-be.start):(++me,ce[me]=_e)}ce.length=me+1;let j=t.getParameter(s.UNPACK_ROW_LENGTH),ie=t.getParameter(s.UNPACK_SKIP_PIXELS),pe=t.getParameter(s.UNPACK_SKIP_ROWS);t.pixelStorei(s.UNPACK_ROW_LENGTH,v.width);for(let De=0,be=ce.length;De<be;De++){let _e=ce[De],Be=Math.floor(_e.start/4),Xe=Math.ceil(_e.count/4),Qe=Be%v.width,z=Math.floor(Be/v.width),ve=Xe,ne=1;t.pixelStorei(s.UNPACK_SKIP_PIXELS,Qe),t.pixelStorei(s.UNPACK_SKIP_ROWS,z),t.texSubImage2D(s.TEXTURE_2D,0,Qe,z,ve,ne,H,X,v.data)}A.clearUpdateRanges(),t.pixelStorei(s.UNPACK_ROW_LENGTH,j),t.pixelStorei(s.UNPACK_SKIP_PIXELS,ie),t.pixelStorei(s.UNPACK_SKIP_ROWS,pe)}}function ye(A,v,H){let X=s.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(X=s.TEXTURE_2D_ARRAY),v.isData3DTexture&&(X=s.TEXTURE_3D);let $=at(A,v),ce=v.source;t.bindTexture(X,A.__webglTexture,s.TEXTURE0+H);let me=n.get(ce);if(ce.version!==me.__version||$===!0){if(t.activeTexture(s.TEXTURE0+H),(typeof ImageBitmap<"u"&&v.image instanceof ImageBitmap)===!1){let ne=it.getPrimaries(it.workingColorSpace),Me=v.colorSpace===Xn?null:it.getPrimaries(v.colorSpace),Re=v.colorSpace===Xn||ne===Me?s.NONE:s.BROWSER_DEFAULT_WEBGL;t.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,v.flipY),t.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),t.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Re)}t.pixelStorei(s.UNPACK_ALIGNMENT,v.unpackAlignment);let ie=g(v.image,!1,i.maxTextureSize);ie=Ye(v,ie);let pe=r.convert(v.format,v.colorSpace),De=r.convert(v.type),be=M(v.internalFormat,pe,De,v.normalized,v.colorSpace,v.isVideoTexture);Se(X,v);let _e,Be=v.mipmaps,Xe=v.isVideoTexture!==!0,Qe=me.__version===void 0||$===!0,z=ce.dataReady,ve=T(v,ie);if(v.isDepthTexture)be=b(v.format===$i,v.type),Qe&&(Xe?t.texStorage2D(s.TEXTURE_2D,1,be,ie.width,ie.height):t.texImage2D(s.TEXTURE_2D,0,be,ie.width,ie.height,0,pe,De,null));else if(v.isDataTexture)if(Be.length>0){Xe&&Qe&&t.texStorage2D(s.TEXTURE_2D,ve,be,Be[0].width,Be[0].height);for(let ne=0,Me=Be.length;ne<Me;ne++)_e=Be[ne],Xe?z&&t.texSubImage2D(s.TEXTURE_2D,ne,0,0,_e.width,_e.height,pe,De,_e.data):t.texImage2D(s.TEXTURE_2D,ne,be,_e.width,_e.height,0,pe,De,_e.data);v.generateMipmaps=!1}else Xe?(Qe&&t.texStorage2D(s.TEXTURE_2D,ve,be,ie.width,ie.height),z&&ee(v,ie,pe,De)):t.texImage2D(s.TEXTURE_2D,0,be,ie.width,ie.height,0,pe,De,ie.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){Xe&&Qe&&t.texStorage3D(s.TEXTURE_2D_ARRAY,ve,be,Be[0].width,Be[0].height,ie.depth);for(let ne=0,Me=Be.length;ne<Me;ne++)if(_e=Be[ne],v.format!==cn)if(pe!==null)if(Xe){if(z)if(v.layerUpdates.size>0){let Re=uu(_e.width,_e.height,v.format,v.type);for(let ae of v.layerUpdates){let ke=_e.data.subarray(ae*Re/_e.data.BYTES_PER_ELEMENT,(ae+1)*Re/_e.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,ne,0,0,ae,_e.width,_e.height,1,pe,ke)}}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,ne,0,0,0,_e.width,_e.height,ie.depth,pe,_e.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,ne,be,_e.width,_e.height,ie.depth,0,_e.data,0,0);else Fe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Xe?z&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,ne,0,0,0,_e.width,_e.height,ie.depth,pe,De,_e.data):t.texImage3D(s.TEXTURE_2D_ARRAY,ne,be,_e.width,_e.height,ie.depth,0,pe,De,_e.data);v.layerUpdates.size>0&&v.clearLayerUpdates()}else{Xe&&Qe&&t.texStorage2D(s.TEXTURE_2D,ve,be,Be[0].width,Be[0].height);for(let ne=0,Me=Be.length;ne<Me;ne++)_e=Be[ne],v.format!==cn?pe!==null?Xe?z&&t.compressedTexSubImage2D(s.TEXTURE_2D,ne,0,0,_e.width,_e.height,pe,_e.data):t.compressedTexImage2D(s.TEXTURE_2D,ne,be,_e.width,_e.height,0,_e.data):Fe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Xe?z&&t.texSubImage2D(s.TEXTURE_2D,ne,0,0,_e.width,_e.height,pe,De,_e.data):t.texImage2D(s.TEXTURE_2D,ne,be,_e.width,_e.height,0,pe,De,_e.data)}else if(v.isDataArrayTexture)if(Xe){if(Qe&&t.texStorage3D(s.TEXTURE_2D_ARRAY,ve,be,ie.width,ie.height,ie.depth),z)if(v.layerUpdates.size>0){let ne=uu(ie.width,ie.height,v.format,v.type);for(let Me of v.layerUpdates){let Re=ie.data.subarray(Me*ne/ie.data.BYTES_PER_ELEMENT,(Me+1)*ne/ie.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,Me,ie.width,ie.height,1,pe,De,Re)}v.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,ie.width,ie.height,ie.depth,pe,De,ie.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,be,ie.width,ie.height,ie.depth,0,pe,De,ie.data);else if(v.isData3DTexture)Xe?(Qe&&t.texStorage3D(s.TEXTURE_3D,ve,be,ie.width,ie.height,ie.depth),z&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,ie.width,ie.height,ie.depth,pe,De,ie.data)):t.texImage3D(s.TEXTURE_3D,0,be,ie.width,ie.height,ie.depth,0,pe,De,ie.data);else if(v.isFramebufferTexture){if(Qe)if(Xe)t.texStorage2D(s.TEXTURE_2D,ve,be,ie.width,ie.height);else{let ne=ie.width,Me=ie.height;for(let Re=0;Re<ve;Re++)t.texImage2D(s.TEXTURE_2D,Re,be,ne,Me,0,pe,De,null),ne>>=1,Me>>=1}}else if(v.isHTMLTexture){if("texElementImage2D"in s){let ne=s.canvas;if(ne.hasAttribute("layoutsubtree")||ne.setAttribute("layoutsubtree","true"),ie.parentNode!==ne){ne.appendChild(ie),u.add(v),ne.onpaint=Me=>{let Re=Me.changedElements;for(let ae of u)Re.includes(ae.image)&&(ae.needsUpdate=!0)},ne.requestPaint();return}if(s.texElementImage2D.length===3)s.texElementImage2D(s.TEXTURE_2D,s.RGBA8,ie);else{let Re=s.RGBA,ae=s.RGBA,ke=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,0,Re,ae,ke,ie)}s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(Be.length>0){if(Xe&&Qe){let ne=Ze(Be[0]);t.texStorage2D(s.TEXTURE_2D,ve,be,ne.width,ne.height)}for(let ne=0,Me=Be.length;ne<Me;ne++)_e=Be[ne],Xe?z&&t.texSubImage2D(s.TEXTURE_2D,ne,0,0,pe,De,_e):t.texImage2D(s.TEXTURE_2D,ne,be,pe,De,_e);v.generateMipmaps=!1}else if(Xe){if(Qe){let ne=Ze(ie);t.texStorage2D(s.TEXTURE_2D,ve,be,ne.width,ne.height)}z&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,pe,De,ie)}else t.texImage2D(s.TEXTURE_2D,0,be,pe,De,ie);p(v)&&S(X),me.__version=ce.version,v.onUpdate&&v.onUpdate(v)}A.__version=v.version}function ze(A,v,H){if(v.image.length!==6)return;let X=at(A,v),$=v.source;t.bindTexture(s.TEXTURE_CUBE_MAP,A.__webglTexture,s.TEXTURE0+H);let ce=n.get($);if($.version!==ce.__version||X===!0){t.activeTexture(s.TEXTURE0+H);let me=it.getPrimaries(it.workingColorSpace),j=v.colorSpace===Xn?null:it.getPrimaries(v.colorSpace),ie=v.colorSpace===Xn||me===j?s.NONE:s.BROWSER_DEFAULT_WEBGL;t.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,v.flipY),t.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),t.pixelStorei(s.UNPACK_ALIGNMENT,v.unpackAlignment),t.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,ie);let pe=v.isCompressedTexture||v.image[0].isCompressedTexture,De=v.image[0]&&v.image[0].isDataTexture,be=[];for(let ae=0;ae<6;ae++)!pe&&!De?be[ae]=g(v.image[ae],!0,i.maxCubemapSize):be[ae]=De?v.image[ae].image:v.image[ae],be[ae]=Ye(v,be[ae]);let _e=be[0],Be=r.convert(v.format,v.colorSpace),Xe=r.convert(v.type),Qe=M(v.internalFormat,Be,Xe,v.normalized,v.colorSpace),z=v.isVideoTexture!==!0,ve=ce.__version===void 0||X===!0,ne=$.dataReady,Me=T(v,_e);Se(s.TEXTURE_CUBE_MAP,v);let Re;if(pe){z&&ve&&t.texStorage2D(s.TEXTURE_CUBE_MAP,Me,Qe,_e.width,_e.height);for(let ae=0;ae<6;ae++){Re=be[ae].mipmaps;for(let ke=0;ke<Re.length;ke++){let Ne=Re[ke];v.format!==cn?Be!==null?z?ne&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ae,ke,0,0,Ne.width,Ne.height,Be,Ne.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ae,ke,Qe,Ne.width,Ne.height,0,Ne.data):Fe("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):z?ne&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ae,ke,0,0,Ne.width,Ne.height,Be,Xe,Ne.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ae,ke,Qe,Ne.width,Ne.height,0,Be,Xe,Ne.data)}}}else{if(Re=v.mipmaps,z&&ve){Re.length>0&&Me++;let ae=Ze(be[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,Me,Qe,ae.width,ae.height)}for(let ae=0;ae<6;ae++)if(De){z?ne&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0,0,0,be[ae].width,be[ae].height,Be,Xe,be[ae].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0,Qe,be[ae].width,be[ae].height,0,Be,Xe,be[ae].data);for(let ke=0;ke<Re.length;ke++){let _t=Re[ke].image[ae].image;z?ne&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ae,ke+1,0,0,_t.width,_t.height,Be,Xe,_t.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ae,ke+1,Qe,_t.width,_t.height,0,Be,Xe,_t.data)}}else{z?ne&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0,0,0,Be,Xe,be[ae]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0,Qe,Be,Xe,be[ae]);for(let ke=0;ke<Re.length;ke++){let Ne=Re[ke];z?ne&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ae,ke+1,0,0,Be,Xe,Ne.image[ae]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ae,ke+1,Qe,Be,Xe,Ne.image[ae])}}}p(v)&&S(s.TEXTURE_CUBE_MAP),ce.__version=$.version,v.onUpdate&&v.onUpdate(v)}A.__version=v.version}function Ae(A,v,H,X,$,ce){let me=r.convert(H.format,H.colorSpace),j=r.convert(H.type),ie=M(H.internalFormat,me,j,H.normalized,H.colorSpace),pe=n.get(v),De=n.get(H);if(De.__renderTarget=v,!pe.__hasExternalTextures){let be=Math.max(1,v.width>>ce),_e=Math.max(1,v.height>>ce);$===s.TEXTURE_3D||$===s.TEXTURE_2D_ARRAY?t.texImage3D($,ce,ie,be,_e,v.depth,0,me,j,null):t.texImage2D($,ce,ie,be,_e,0,me,j,null)}t.bindFramebuffer(s.FRAMEBUFFER,A),$e(v)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,X,$,De.__webglTexture,0,We(v)):($===s.TEXTURE_2D||$>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&$<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,X,$,De.__webglTexture,ce),t.bindFramebuffer(s.FRAMEBUFFER,null)}function qe(A,v,H){if(s.bindRenderbuffer(s.RENDERBUFFER,A),v.depthBuffer){let X=v.depthTexture,$=X&&X.isDepthTexture?X.type:null,ce=b(v.stencilBuffer,$),me=v.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;$e(v)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,We(v),ce,v.width,v.height):H?s.renderbufferStorageMultisample(s.RENDERBUFFER,We(v),ce,v.width,v.height):s.renderbufferStorage(s.RENDERBUFFER,ce,v.width,v.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,me,s.RENDERBUFFER,A)}else{let X=v.textures;for(let $=0;$<X.length;$++){let ce=X[$],me=r.convert(ce.format,ce.colorSpace),j=r.convert(ce.type),ie=M(ce.internalFormat,me,j,ce.normalized,ce.colorSpace);$e(v)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,We(v),ie,v.width,v.height):H?s.renderbufferStorageMultisample(s.RENDERBUFFER,We(v),ie,v.width,v.height):s.renderbufferStorage(s.RENDERBUFFER,ie,v.width,v.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function ht(A,v,H){let X=v.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(s.FRAMEBUFFER,A),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let $=n.get(v.depthTexture);if($.__renderTarget=v,(!$.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),X){if($.__webglInit===void 0&&($.__webglInit=!0,v.depthTexture.addEventListener("dispose",C)),$.__webglTexture===void 0){$.__webglTexture=s.createTexture(),t.bindTexture(s.TEXTURE_CUBE_MAP,$.__webglTexture),Se(s.TEXTURE_CUBE_MAP,v.depthTexture);let pe=r.convert(v.depthTexture.format),De=r.convert(v.depthTexture.type),be;v.depthTexture.format===Jn?be=s.DEPTH_COMPONENT24:v.depthTexture.format===$i&&(be=s.DEPTH24_STENCIL8);for(let _e=0;_e<6;_e++)s.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,be,v.width,v.height,0,pe,De,null)}}else re(v.depthTexture,0);let ce=$.__webglTexture,me=We(v),j=X?s.TEXTURE_CUBE_MAP_POSITIVE_X+H:s.TEXTURE_2D,ie=v.depthTexture.format===$i?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(v.depthTexture.format===Jn)$e(v)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,ie,j,ce,0,me):s.framebufferTexture2D(s.FRAMEBUFFER,ie,j,ce,0);else if(v.depthTexture.format===$i)$e(v)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,ie,j,ce,0,me):s.framebufferTexture2D(s.FRAMEBUFFER,ie,j,ce,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function te(A){let v=n.get(A),H=A.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==A.depthTexture){let X=A.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),X){let $=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,X.removeEventListener("dispose",$)};X.addEventListener("dispose",$),v.__depthDisposeCallback=$}v.__boundDepthTexture=X}if(A.depthTexture&&!v.__autoAllocateDepthBuffer)if(H)for(let X=0;X<6;X++)ht(v.__webglFramebuffer[X],A,X);else{let X=A.texture.mipmaps;X&&X.length>0?ht(v.__webglFramebuffer[0],A,0):ht(v.__webglFramebuffer,A,0)}else if(H){v.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(t.bindFramebuffer(s.FRAMEBUFFER,v.__webglFramebuffer[X]),v.__webglDepthbuffer[X]===void 0)v.__webglDepthbuffer[X]=s.createRenderbuffer(),qe(v.__webglDepthbuffer[X],A,!1);else{let $=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ce=v.__webglDepthbuffer[X];s.bindRenderbuffer(s.RENDERBUFFER,ce),s.framebufferRenderbuffer(s.FRAMEBUFFER,$,s.RENDERBUFFER,ce)}}else{let X=A.texture.mipmaps;if(X&&X.length>0?t.bindFramebuffer(s.FRAMEBUFFER,v.__webglFramebuffer[0]):t.bindFramebuffer(s.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=s.createRenderbuffer(),qe(v.__webglDepthbuffer,A,!1);else{let $=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ce=v.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,ce),s.framebufferRenderbuffer(s.FRAMEBUFFER,$,s.RENDERBUFFER,ce)}}t.bindFramebuffer(s.FRAMEBUFFER,null)}function oe(A,v,H){let X=n.get(A);v!==void 0&&Ae(X.__webglFramebuffer,A,A.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),H!==void 0&&te(A)}function he(A){let v=A.texture,H=n.get(A),X=n.get(v);A.addEventListener("dispose",x);let $=A.textures,ce=A.isWebGLCubeRenderTarget===!0,me=$.length>1;if(me||(X.__webglTexture===void 0&&(X.__webglTexture=s.createTexture()),X.__version=v.version,a.memory.textures++),ce){H.__webglFramebuffer=[];for(let j=0;j<6;j++)if(v.mipmaps&&v.mipmaps.length>0){H.__webglFramebuffer[j]=[];for(let ie=0;ie<v.mipmaps.length;ie++)H.__webglFramebuffer[j][ie]=s.createFramebuffer()}else H.__webglFramebuffer[j]=s.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){H.__webglFramebuffer=[];for(let j=0;j<v.mipmaps.length;j++)H.__webglFramebuffer[j]=s.createFramebuffer()}else H.__webglFramebuffer=s.createFramebuffer();if(me)for(let j=0,ie=$.length;j<ie;j++){let pe=n.get($[j]);pe.__webglTexture===void 0&&(pe.__webglTexture=s.createTexture(),a.memory.textures++)}if(A.samples>0&&$e(A)===!1){H.__webglMultisampledFramebuffer=s.createFramebuffer(),H.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let j=0;j<$.length;j++){let ie=$[j];H.__webglColorRenderbuffer[j]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,H.__webglColorRenderbuffer[j]);let pe=r.convert(ie.format,ie.colorSpace),De=r.convert(ie.type),be=M(ie.internalFormat,pe,De,ie.normalized,ie.colorSpace,A.isXRRenderTarget===!0),_e=We(A);s.renderbufferStorageMultisample(s.RENDERBUFFER,_e,be,A.width,A.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+j,s.RENDERBUFFER,H.__webglColorRenderbuffer[j])}s.bindRenderbuffer(s.RENDERBUFFER,null),A.depthBuffer&&(H.__webglDepthRenderbuffer=s.createRenderbuffer(),qe(H.__webglDepthRenderbuffer,A,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(ce){t.bindTexture(s.TEXTURE_CUBE_MAP,X.__webglTexture),Se(s.TEXTURE_CUBE_MAP,v);for(let j=0;j<6;j++)if(v.mipmaps&&v.mipmaps.length>0)for(let ie=0;ie<v.mipmaps.length;ie++)Ae(H.__webglFramebuffer[j][ie],A,v,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+j,ie);else Ae(H.__webglFramebuffer[j],A,v,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+j,0);p(v)&&S(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(me){for(let j=0,ie=$.length;j<ie;j++){let pe=$[j],De=n.get(pe),be=s.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(be=A.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(be,De.__webglTexture),Se(be,pe),Ae(H.__webglFramebuffer,A,pe,s.COLOR_ATTACHMENT0+j,be,0),p(pe)&&S(be)}t.unbindTexture()}else{let j=s.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(j=A.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(j,X.__webglTexture),Se(j,v),v.mipmaps&&v.mipmaps.length>0)for(let ie=0;ie<v.mipmaps.length;ie++)Ae(H.__webglFramebuffer[ie],A,v,s.COLOR_ATTACHMENT0,j,ie);else Ae(H.__webglFramebuffer,A,v,s.COLOR_ATTACHMENT0,j,0);p(v)&&S(j),t.unbindTexture()}A.depthBuffer&&te(A)}function de(A){let v=A.textures;for(let H=0,X=v.length;H<X;H++){let $=v[H];if(p($)){let ce=E(A),me=n.get($).__webglTexture;t.bindTexture(ce,me),S(ce),t.unbindTexture()}}}let ge=[],Ve=[];function Ue(A){if(A.samples>0){if($e(A)===!1){let v=A.textures,H=A.width,X=A.height,$=s.COLOR_BUFFER_BIT,ce=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,me=n.get(A),j=v.length>1;if(j)for(let pe=0;pe<v.length;pe++)t.bindFramebuffer(s.FRAMEBUFFER,me.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+pe,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,me.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+pe,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,me.__webglMultisampledFramebuffer);let ie=A.texture.mipmaps;ie&&ie.length>0?t.bindFramebuffer(s.DRAW_FRAMEBUFFER,me.__webglFramebuffer[0]):t.bindFramebuffer(s.DRAW_FRAMEBUFFER,me.__webglFramebuffer);for(let pe=0;pe<v.length;pe++){if(A.resolveDepthBuffer&&(A.depthBuffer&&($|=s.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&($|=s.STENCIL_BUFFER_BIT)),j){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,me.__webglColorRenderbuffer[pe]);let De=n.get(v[pe]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,De,0)}s.blitFramebuffer(0,0,H,X,0,0,H,X,$,s.NEAREST),l===!0&&(ge.length=0,Ve.length=0,ge.push(s.COLOR_ATTACHMENT0+pe),A.depthBuffer&&A.storeMultisampledDepthBuffer===!1&&(ge.push(ce),Ve.push(ce),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,Ve)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,ge))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),j)for(let pe=0;pe<v.length;pe++){t.bindFramebuffer(s.FRAMEBUFFER,me.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+pe,s.RENDERBUFFER,me.__webglColorRenderbuffer[pe]);let De=n.get(v[pe]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,me.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+pe,s.TEXTURE_2D,De,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,me.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.storeMultisampledDepthBuffer===!1&&l){let v=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[v])}}}function We(A){return Math.min(i.maxSamples,A.samples)}function $e(A){let v=n.get(A);return A.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function U(A){let v=a.render.frame;h.get(A)!==v&&(h.set(A,v),A.update())}function Ye(A,v){let H=A.colorSpace,X=A.format,$=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||H!==Zt&&H!==Xn&&(it.getTransfer(H)===ft?(X!==cn||$!==pn)&&Fe("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ke("WebGLTextures: Unsupported texture color space:",H)),v}function Ze(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=W,this.resetTextureUnits=F,this.getTextureUnits=R,this.setTextureUnits=k,this.setTexture2D=re,this.setTexture2DArray=K,this.setTexture3D=Q,this.setTextureCube=se,this.rebindTextures=oe,this.setupRenderTarget=he,this.updateRenderTargetMipmap=de,this.updateMultisampleRenderTarget=Ue,this.setupDepthRenderbuffer=te,this.setupFrameBufferTexture=Ae,this.useMultisampledRTT=$e,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function zy(s,e){function t(n,i=Xn){let r,a=it.getTransfer(i);if(n===pn)return s.UNSIGNED_BYTE;if(n===xl)return s.UNSIGNED_SHORT_4_4_4_4;if(n===_l)return s.UNSIGNED_SHORT_5_5_5_1;if(n===jh)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===Qh)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===$h)return s.BYTE;if(n===Jh)return s.SHORT;if(n===yr)return s.UNSIGNED_SHORT;if(n===gl)return s.INT;if(n===Wn)return s.UNSIGNED_INT;if(n===Kt)return s.FLOAT;if(n===ln)return s.HALF_FLOAT;if(n===eu)return s.ALPHA;if(n===tu)return s.RGB;if(n===cn)return s.RGBA;if(n===Jn)return s.DEPTH_COMPONENT;if(n===$i)return s.DEPTH_STENCIL;if(n===vl)return s.RED;if(n===yl)return s.RED_INTEGER;if(n===Ji)return s.RG;if(n===Ml)return s.RG_INTEGER;if(n===Sl)return s.RGBA_INTEGER;if(n===La||n===Da||n===Na||n===Ua)if(a===ft)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===La)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Da)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Na)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Ua)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===La)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Da)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Na)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Ua)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===bl||n===Tl||n===wl||n===El)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===bl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Tl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===wl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===El)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Al||n===Rl||n===Cl||n===Il||n===Pl||n===Fa||n===Ll)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Al||n===Rl)return a===ft?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Cl)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Il)return r.COMPRESSED_R11_EAC;if(n===Pl)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Fa)return r.COMPRESSED_RG11_EAC;if(n===Ll)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Dl||n===Nl||n===Ul||n===Fl||n===Ol||n===Bl||n===kl||n===zl||n===Vl||n===Gl||n===Hl||n===Wl||n===Xl||n===ql)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Dl)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Nl)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ul)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Fl)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ol)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Bl)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===kl)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===zl)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Vl)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Gl)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Hl)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Wl)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Xl)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===ql)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Yl||n===Kl||n===Zl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Yl)return a===ft?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Kl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Zl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===$l||n===Jl||n===Oa||n===jl)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===$l)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Jl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Oa)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===jl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Mr?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:t}}var Vy=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Gy=`
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

}`,wu=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new ua(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Sn({vertexShader:Vy,fragmentShader:Gy,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new pt(new Yt(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Eu=class extends jn{constructor(e,t){super();let n=this,i=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,m=null,y=typeof XRWebGLBinding<"u",g=new wu,p={},S=t.getContextAttributes(),E=null,M=null,b=[],T=[],C=new fe,x=null,w=null,L=new Ct;L.viewport=new xt;let I=new Ct;I.viewport=new xt;let B=[L,I],F=new dl,R=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let ee=b[J];return ee===void 0&&(ee=new rr,b[J]=ee),ee.getTargetRaySpace()},this.getControllerGrip=function(J){let ee=b[J];return ee===void 0&&(ee=new rr,b[J]=ee),ee.getGripSpace()},this.getHand=function(J){let ee=b[J];return ee===void 0&&(ee=new rr,b[J]=ee),ee.getHandSpace()};function W(J){let ee=T.indexOf(J.inputSource);if(ee===-1)return;let ye=b[ee];ye!==void 0&&(ye.update(J.inputSource,J.frame,c||a),ye.dispatchEvent({type:J.type,data:J.inputSource}))}function Y(){i.removeEventListener("select",W),i.removeEventListener("selectstart",W),i.removeEventListener("selectend",W),i.removeEventListener("squeeze",W),i.removeEventListener("squeezestart",W),i.removeEventListener("squeezeend",W),i.removeEventListener("end",Y),i.removeEventListener("inputsourceschange",re);for(let J=0;J<b.length;J++){let ee=T[J];ee!==null&&(T[J]=null,b[J].disconnect(ee))}R=null,k=null,g.reset();for(let J in p)delete p[J];if(e.setRenderTarget(E),f=null,d=null,u=null,i=null,M=null,at.stop(),n.isPresenting=!1,e.setPixelRatio(x),e.setSize(C.width,C.height,!1),w!==null){let J=w.camera;J.fov=w.fov,J.zoom=w.zoom,J.updateProjectionMatrix(),w=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){r=J,n.isPresenting===!0&&Fe("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){o=J,n.isPresenting===!0&&Fe("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(J){c=J},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&y&&(u=new XRWebGLBinding(i,t)),u},this.getFrame=function(){return m},this.getSession=function(){return i},this.setSession=async function(J){if(i=J,i!==null){if(E=e.getRenderTarget(),i.addEventListener("select",W),i.addEventListener("selectstart",W),i.addEventListener("selectend",W),i.addEventListener("squeeze",W),i.addEventListener("squeezestart",W),i.addEventListener("squeezeend",W),i.addEventListener("end",Y),i.addEventListener("inputsourceschange",re),S.xrCompatible!==!0&&await t.makeXRCompatible(),x=e.getPixelRatio(),e.getSize(C),y&&"createProjectionLayer"in XRWebGLBinding.prototype){let ye=null,ze=null,Ae=null;S.depth&&(Ae=S.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ye=S.stencil?$i:Jn,ze=S.stencil?Mr:Wn);let qe={colorFormat:t.RGBA8,depthFormat:Ae,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(qe),i.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),M=new un(d.textureWidth,d.textureHeight,{format:cn,type:pn,depthTexture:new Xi(d.textureWidth,d.textureHeight,ze,void 0,void 0,void 0,void 0,void 0,void 0,ye),stencilBuffer:S.stencil,colorSpace:e.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let ye={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,t,ye),i.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),M=new un(f.framebufferWidth,f.framebufferHeight,{format:cn,type:pn,colorSpace:e.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await i.requestReferenceSpace(o),at.setContext(i),at.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function re(J){for(let ee=0;ee<J.removed.length;ee++){let ye=J.removed[ee],ze=T.indexOf(ye);ze>=0&&(T[ze]=null,b[ze].disconnect(ye))}for(let ee=0;ee<J.added.length;ee++){let ye=J.added[ee],ze=T.indexOf(ye);if(ze===-1){for(let qe=0;qe<b.length;qe++)if(qe>=T.length){T.push(ye),ze=qe;break}else if(T[qe]===null){T[qe]=ye,ze=qe;break}if(ze===-1)break}let Ae=b[ze];Ae&&Ae.connect(ye)}}let K=new N,Q=new N;function se(J,ee,ye){K.setFromMatrixPosition(ee.matrixWorld),Q.setFromMatrixPosition(ye.matrixWorld);let ze=K.distanceTo(Q),Ae=ee.projectionMatrix.elements,qe=ye.projectionMatrix.elements,ht=Ae[14]/(Ae[10]-1),te=Ae[14]/(Ae[10]+1),oe=(Ae[9]+1)/Ae[5],he=(Ae[9]-1)/Ae[5],de=(Ae[8]-1)/Ae[0],ge=(qe[8]+1)/qe[0],Ve=ht*de,Ue=ht*ge,We=ze/(-de+ge),$e=We*-de;if(ee.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX($e),J.translateZ(We),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),Ae[10]===-1)J.projectionMatrix.copy(ee.projectionMatrix),J.projectionMatrixInverse.copy(ee.projectionMatrixInverse);else{let U=ht+We,Ye=te+We,Ze=Ve-$e,A=Ue+(ze-$e),v=oe*te/Ye*U,H=he*te/Ye*U;J.projectionMatrix.makePerspective(Ze,A,v,H,U,Ye),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function ue(J,ee){ee===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(ee.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(i===null)return;let ee=J.near,ye=J.far;g.texture!==null&&(g.depthNear>0&&(ee=g.depthNear),g.depthFar>0&&(ye=g.depthFar)),F.near=I.near=L.near=ee,F.far=I.far=L.far=ye,(R!==F.near||k!==F.far)&&(i.updateRenderState({depthNear:F.near,depthFar:F.far}),R=F.near,k=F.far),F.layers.mask=J.layers.mask|6,L.layers.mask=F.layers.mask&-5,I.layers.mask=F.layers.mask&-3;let ze=J.parent,Ae=F.cameras;ue(F,ze);for(let qe=0;qe<Ae.length;qe++)ue(Ae[qe],ze);Ae.length===2?se(F,L,I):F.projectionMatrix.copy(L.projectionMatrix),w===null&&J.isPerspectiveCamera&&(w={camera:J,fov:J.fov,zoom:J.zoom}),we(J,F,ze)};function we(J,ee,ye){ye===null?J.matrix.copy(ee.matrixWorld):(J.matrix.copy(ye.matrixWorld),J.matrix.invert(),J.matrix.multiply(ee.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(ee.projectionMatrix),J.projectionMatrixInverse.copy(ee.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=cs*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(J){l=J,d!==null&&(d.fixedFoveation=J),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=J)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(F)},this.getCameraTexture=function(J){return p[J]};let Ge=null;function Se(J,ee){if(h=ee.getViewerPose(c||a),m=ee,h!==null){let ye=h.views;f!==null&&(e.setRenderTargetFramebuffer(M,f.framebuffer),e.setRenderTarget(M));let ze=!1;ye.length!==F.cameras.length&&(F.cameras.length=0,ze=!0);for(let te=0;te<ye.length;te++){let oe=ye[te],he=null;if(f!==null)he=f.getViewport(oe);else{let ge=u.getViewSubImage(d,oe);he=ge.viewport,te===0&&(e.setRenderTargetTextures(M,ge.colorTexture,ge.depthStencilTexture),e.setRenderTarget(M))}let de=B[te];de===void 0&&(de=new Ct,de.layers.enable(te),de.viewport=new xt,B[te]=de),de.matrix.fromArray(oe.transform.matrix),de.matrix.decompose(de.position,de.quaternion,de.scale),de.projectionMatrix.fromArray(oe.projectionMatrix),de.projectionMatrixInverse.copy(de.projectionMatrix).invert(),de.viewport.set(he.x,he.y,he.width,he.height),te===0&&(F.matrix.copy(de.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),ze===!0&&F.cameras.push(de)}let Ae=i.enabledFeatures;if(Ae&&Ae.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&y){u=n.getBinding();let te=u.getDepthInformation(ye[0]);te&&te.isValid&&te.texture&&g.init(te,i.renderState)}if(Ae&&Ae.includes("camera-access")&&y){e.state.unbindTexture(),u=n.getBinding();for(let te=0;te<ye.length;te++){let oe=ye[te].camera;if(oe){let he=p[oe];he||(he=new ua,p[oe]=he);let de=u.getCameraImage(oe);he.sourceTexture=de}}}}for(let ye=0;ye<b.length;ye++){let ze=T[ye],Ae=b[ye];ze!==null&&Ae!==void 0&&Ae.update(ze,ee,c||a)}Ge&&Ge(J,ee),ee.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ee}),m=null}let at=new Ip;at.setAnimationLoop(Se),this.setAnimationLoop=function(J){Ge=J},this.dispose=function(){}}},Hy=new Je,Fp=new je;Fp.set(-1,0,0,0,1,0,0,0,1);function Wy(s,e){function t(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function n(g,p){p.color.getRGB(g.fogColor.value,lu(s)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function i(g,p,S,E,M){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(g,p):p.isMeshLambertMaterial?(r(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(g,p),u(g,p)):p.isMeshPhongMaterial?(r(g,p),h(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(g,p),d(g,p),p.isMeshPhysicalMaterial&&f(g,p,M)):p.isMeshMatcapMaterial?(r(g,p),m(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),y(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(a(g,p),p.isLineDashedMaterial&&o(g,p)):p.isPointsMaterial?l(g,p,S,E):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,t(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===on&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,t(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===on&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,t(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,t(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);let S=e.get(p),E=S.envMap,M=S.envMapRotation;E&&(g.envMap.value=E,g.envMapRotation.value.setFromMatrix4(Hy.makeRotationFromEuler(M)).transpose(),E.isCubeTexture&&E.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(Fp),g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,g.aoMapTransform))}function a(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform))}function o(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,S,E){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*S,g.scale.value=E*.5,p.map&&(g.map.value=p.map,t(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function u(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function d(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,S){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===on&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.retroreflectivity>0&&(g.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=S.texture,g.transmissionSamplerSize.value.set(S.width,S.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function y(g,p){let S=e.get(p).light;g.referencePosition.value.setFromMatrixPosition(S.matrixWorld),g.nearDistance.value=S.shadow.camera.near,g.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function Xy(s,e,t,n){let i={},r={},a=[],o=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(M,b){let T=b.program;n.uniformBlockBinding(M,T)}function c(M,b){let T=i[M.id];T===void 0&&(g(M),T=h(M),i[M.id]=T,M.addEventListener("dispose",S));let C=b.program;n.updateUBOMapping(M,C);let x=e.render.frame;r[M.id]!==x&&(d(M),r[M.id]=x)}function h(M){let b=u();M.__bindingPointIndex=b;let T=s.createBuffer(),C=M.__size,x=M.usage;return s.bindBuffer(s.UNIFORM_BUFFER,T),s.bufferData(s.UNIFORM_BUFFER,C,x),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,b,T),T}function u(){for(let M=0;M<o;M++)if(a.indexOf(M)===-1)return a.push(M),M;return Ke("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(M){let b=i[M.id],T=M.uniforms,C=M.__cache;s.bindBuffer(s.UNIFORM_BUFFER,b);for(let x=0,w=T.length;x<w;x++){let L=T[x];if(Array.isArray(L))for(let I=0,B=L.length;I<B;I++)f(L[I],x,I,C);else f(L,x,0,C)}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(M,b,T,C){if(y(M,b,T,C)===!0){let x=M.__offset,w=M.value;if(Array.isArray(w)){let L=0;for(let I=0;I<w.length;I++){let B=w[I],F=p(B);m(B,M.__data,L),typeof B!="number"&&typeof B!="boolean"&&!B.isMatrix3&&!ArrayBuffer.isView(B)&&(L+=F.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(w,M.__data,0);s.bufferSubData(s.UNIFORM_BUFFER,x,M.__data)}}function m(M,b,T){typeof M=="number"||typeof M=="boolean"?b[0]=M:M.isMatrix3?(b[0]=M.elements[0],b[1]=M.elements[1],b[2]=M.elements[2],b[3]=0,b[4]=M.elements[3],b[5]=M.elements[4],b[6]=M.elements[5],b[7]=0,b[8]=M.elements[6],b[9]=M.elements[7],b[10]=M.elements[8],b[11]=0):ArrayBuffer.isView(M)?b.set(new M.constructor(M.buffer,M.byteOffset,b.length)):M.toArray(b,T)}function y(M,b,T,C){let x=M.value,w=b+"_"+T;if(C[w]===void 0)return typeof x=="number"||typeof x=="boolean"?C[w]=x:ArrayBuffer.isView(x)?C[w]=x.slice():C[w]=x.clone(),!0;{let L=C[w];if(typeof x=="number"||typeof x=="boolean"){if(L!==x)return C[w]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(L.equals(x)===!1)return L.copy(x),!0}}return!1}function g(M){let b=M.uniforms,T=0,C=16;for(let w=0,L=b.length;w<L;w++){let I=Array.isArray(b[w])?b[w]:[b[w]];for(let B=0,F=I.length;B<F;B++){let R=I[B],k=Array.isArray(R.value)?R.value:[R.value];for(let W=0,Y=k.length;W<Y;W++){let re=k[W],K=p(re),Q=T%C,se=Q%K.boundary,ue=Q+se;T+=se,ue!==0&&C-ue<K.storage&&(T+=C-ue),R.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),R.__offset=T,T+=K.storage}}}let x=T%C;return x>0&&(T+=C-x),M.__size=T,M.__cache={},this}function p(M){let b={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(b.boundary=4,b.storage=4):M.isVector2?(b.boundary=8,b.storage=8):M.isVector3||M.isColor?(b.boundary=16,b.storage=12):M.isVector4?(b.boundary=16,b.storage=16):M.isMatrix3?(b.boundary=48,b.storage=48):M.isMatrix4?(b.boundary=64,b.storage=64):M.isTexture?Fe("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(M)?(b.boundary=16,b.storage=M.byteLength):Fe("WebGLRenderer: Unsupported uniform value type.",M),b}function S(M){let b=M.target;b.removeEventListener("dispose",S);let T=a.indexOf(b.__bindingPointIndex);a.splice(T,1),s.deleteBuffer(i[b.id]),delete i[b.id],delete r[b.id]}function E(){for(let M in i)s.deleteBuffer(i[M]);a=[],i={},r={}}return{bind:l,update:c,dispose:E}}var qy=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),ai=null;function Yy(){return ai===null&&(ai=new Qn(qy,16,16,Ji,ln),ai.name="DFG_LUT",ai.minFilter=bt,ai.magFilter=bt,ai.wrapS=qt,ai.wrapT=qt,ai.generateMipmaps=!1,ai.needsUpdate=!0),ai}var Er=class{constructor(e={}){let{canvas:t=Jf(),context:n=null,depth:i=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=pn}=e;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=a;let y=f,g=new Set([Sl,Ml,yl]),p=new Set([pn,Wn,yr,Mr,xl,_l]),S=new Uint32Array(4),E=new Int32Array(4),M=new N,b=null,T=null,C=[],x=[],w=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=bn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let L=this,I=!1,B=null,F=null,R=null,k=null;this._outputColorSpace=gt;let W=0,Y=0,re=null,K=-1,Q=null,se=new xt,ue=new xt,we=null,Ge=new He(0),Se=0,at=t.width,J=t.height,ee=1,ye=null,ze=null,Ae=new xt(0,0,at,J),qe=new xt(0,0,at,J),ht=!1,te=new cr,oe=!1,he=!1,de=new Je,ge=new N,Ve=new xt,Ue={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},We=!1;function $e(){return re===null?ee:1}let U=n;function Ye(_,P){return t.getContext(_,P)}let Ze,A,v,H,X,$,ce,me,j,ie,pe,De,be,_e,Be,Xe,Qe,z,ve,ne,Me,Re,ae;try{let _={alpha:!0,depth:i,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"186"}`),t.addEventListener("webglcontextlost",_t,!1),t.addEventListener("webglcontextrestored",ut,!1),t.addEventListener("webglcontextcreationerror",_n,!1),U===null){let P="webgl2";if(U=Ye(P,_),U===null)throw Ye(P)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}ke()}catch(_){throw t.removeEventListener("webglcontextlost",_t,!1),t.removeEventListener("webglcontextrestored",ut,!1),t.removeEventListener("webglcontextcreationerror",_n,!1),Ke("WebGLRenderer: "+_.message),_}function ke(){Ze=new ev(U),Ze.init(),Me=new zy(U,Ze),A=new W_(U,Ze,e,Me),v=new By(U,Ze),A.reversedDepthBuffer&&d&&v.buffers.depth.setReversed(!0),F=U.createFramebuffer(),R=U.createFramebuffer(),k=U.createFramebuffer(),H=new iv(U),X=new Ty,$=new ky(U,Ze,v,X,A,Me,H),ce=new Q_(L),me=new r0(U),Re=new G_(U,me),j=new tv(U,me,H,Re),ie=new rv(U,j,me,Re,H),z=new sv(U,A,$),Be=new X_(X),pe=new by(L,ce,Ze,A,Re,Be),De=new Wy(L,X),be=new Ey,_e=new Ly(Ze),Qe=new V_(L,ce,v,ie,m,l),Xe=new Oy(L,ie,A),ae=new Xy(U,H,A,v),ve=new H_(U,Ze,H),ne=new nv(U,Ze,H),H.programs=pe.programs,L.capabilities=A,L.extensions=Ze,L.properties=X,L.renderLists=be,L.shadowMap=Xe,L.state=v,L.info=H}y!==pn&&(w=new ov(y,t.width,t.height,o,i,r));let Ne=new Eu(L,U);this.xr=Ne,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){let _=Ze.get("WEBGL_lose_context");_&&_.loseContext()},this.forceContextRestore=function(){let _=Ze.get("WEBGL_lose_context");_&&_.restoreContext()},this.getPixelRatio=function(){return ee},this.setPixelRatio=function(_){_!==void 0&&(ee=_,this.setSize(at,J,!1))},this.getSize=function(_){return _.set(at,J)},this.setSize=function(_,P,G=!0){if(Ne.isPresenting){Fe("WebGLRenderer: Can't change size while VR device is presenting.");return}at=_,J=P,t.width=Math.floor(_*ee),t.height=Math.floor(P*ee),G===!0&&(t.style.width=_+"px",t.style.height=P+"px"),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,_,P)},this.getDrawingBufferSize=function(_){return _.set(at*ee,J*ee).floor()},this.setDrawingBufferSize=function(_,P,G){at=_,J=P,ee=G,t.width=Math.floor(_*G),t.height=Math.floor(P*G),this.setViewport(0,0,_,P)},this.setEffects=function(_){if(y===pn){Ke("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(_){for(let P=0;P<_.length;P++)if(_[P].isOutputPass===!0){Fe("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}w.setEffects(_||[])},this.getCurrentViewport=function(_){return _.copy(se)},this.getViewport=function(_){return _.copy(Ae)},this.setViewport=function(_,P,G,O){_.isVector4?Ae.set(_.x,_.y,_.z,_.w):Ae.set(_,P,G,O),v.viewport(se.copy(Ae).multiplyScalar(ee).round())},this.getScissor=function(_){return _.copy(qe)},this.setScissor=function(_,P,G,O){_.isVector4?qe.set(_.x,_.y,_.z,_.w):qe.set(_,P,G,O),v.scissor(ue.copy(qe).multiplyScalar(ee).round())},this.getScissorTest=function(){return ht},this.setScissorTest=function(_){v.setScissorTest(ht=_)},this.setOpaqueSort=function(_){ye=_},this.setTransparentSort=function(_){ze=_},this.getClearColor=function(_){return _.copy(Qe.getClearColor())},this.setClearColor=function(){Qe.setClearColor(...arguments)},this.getClearAlpha=function(){return Qe.getClearAlpha()},this.setClearAlpha=function(){Qe.setClearAlpha(...arguments)},this.clear=function(_=!0,P=!0,G=!0){let O=0;if(_){let V=!1;if(re!==null){let le=re.texture.format;V=g.has(le)}if(V){let le=re.texture.type,Te=p.has(le),xe=Qe.getClearColor(),Pe=Qe.getClearAlpha(),Oe=xe.r,et=xe.g,ot=xe.b;Te?(S[0]=Oe,S[1]=et,S[2]=ot,S[3]=Pe,U.clearBufferuiv(U.COLOR,0,S)):(E[0]=Oe,E[1]=et,E[2]=ot,E[3]=Pe,U.clearBufferiv(U.COLOR,0,E))}else O|=U.COLOR_BUFFER_BIT}P&&(O|=U.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),G&&(O|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O!==0&&U.clear(O)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(_){_.setRenderer(this),B=_},this.dispose=function(){t.removeEventListener("webglcontextlost",_t,!1),t.removeEventListener("webglcontextrestored",ut,!1),t.removeEventListener("webglcontextcreationerror",_n,!1),Qe.dispose(),be.dispose(),_e.dispose(),X.dispose(),ce.dispose(),ie.dispose(),Re.dispose(),ae.dispose(),pe.dispose(),Ne.dispose(),Ne.removeEventListener("sessionstart",Gc),Ne.removeEventListener("sessionend",Hc),di.stop()};function _t(_){_.preventDefault(),ea("WebGLRenderer: Context Lost."),I=!0}function ut(){ea("WebGLRenderer: Context Restored."),I=!1;let _=H.autoReset,P=Xe.enabled,G=Xe.autoUpdate,O=Xe.needsUpdate,V=Xe.type;ke(),H.autoReset=_,Xe.enabled=P,Xe.autoUpdate=G,Xe.needsUpdate=O,Xe.type=V}function _n(_){Ke("WebGLRenderer: A WebGL context could not be created. Reason: ",_.statusMessage)}function wn(_){let P=_.target;P.removeEventListener("dispose",wn),zc(P)}function zc(_){Vc(_),X.remove(_)}function Vc(_){let P=X.get(_).programs;P!==void 0&&(P.forEach(function(G){pe.releaseProgram(G)}),_.isShaderMaterial&&pe.releaseShaderCache(_))}this.renderBufferDirect=function(_,P,G,O,V,le){P===null&&(P=Ue);let Te=V.isMesh&&V.matrixWorld.determinantAffine()<0,xe=Xc(_,P,G,O,V);v.setMaterial(O,Te);let Pe=G.index,Oe=1;if(O.wireframe===!0){if(Pe=j.getWireframeAttribute(G),Pe===void 0)return;Oe=2}let et=G.drawRange,ot=G.attributes.position,Le=et.start*Oe,dt=(et.start+et.count)*Oe;le!==null&&(Le=Math.max(Le,le.start*Oe),dt=Math.min(dt,(le.start+le.count)*Oe)),Pe!==null?(Le=Math.max(Le,0),dt=Math.min(dt,Pe.count)):ot!=null&&(Le=Math.max(Le,0),dt=Math.min(dt,ot.count));let Bt=dt-Le;if(Bt<0||Bt===1/0)return;Re.setup(V,O,xe,G,Pe);let At,Mt=ve;if(Pe!==null&&(At=me.get(Pe),Mt=ne,Mt.setIndex(At)),V.isMesh)O.wireframe===!0?(v.setLineWidth(O.wireframeLinewidth*$e()),Mt.setMode(U.LINES)):Mt.setMode(U.TRIANGLES);else if(V.isLine){let Jt=O.linewidth;Jt===void 0&&(Jt=1),v.setLineWidth(Jt*$e()),V.isLineSegments?Mt.setMode(U.LINES):V.isLineLoop?Mt.setMode(U.LINE_LOOP):Mt.setMode(U.LINE_STRIP)}else V.isPoints?Mt.setMode(U.POINTS):V.isSprite&&Mt.setMode(U.TRIANGLES);if(V.isBatchedMesh)if(Ze.get("WEBGL_multi_draw"))Mt.renderMultiDraw(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount);else{let Jt=V._multiDrawStarts,Ie=V._multiDrawCounts,sn=V._multiDrawCount,ct=Pe?me.get(Pe).bytesPerElement:1,En=X.get(O).currentProgram.getUniforms();for(let Kn=0;Kn<sn;Kn++)En.setValue(U,"_gl_DrawID",Kn),Mt.render(Jt[Kn]/ct,Ie[Kn])}else if(V.isInstancedMesh)Mt.renderInstances(Le,Bt,V.count);else if(G.isInstancedBufferGeometry){let Jt=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,Ie=Math.min(G.instanceCount,Jt);Mt.renderInstances(Le,Bt,Ie)}else Mt.render(Le,Bt)};function Or(_,P,G,O){B!==null&&_.isNodeMaterial&&B.setObject(O,_),oe===!0&&Be.setState(_,G,!1),_.transparent===!0&&_.side===Gt&&_.forceSinglePass===!1?(_.side=on,_.needsUpdate=!0,fi(_,P,O),_.side=si,_.needsUpdate=!0,fi(_,P,O),_.side=Gt):fi(_,P,O)}this.compile=function(_,P,G=null){G===null&&(G=_),B!==null&&B.renderStart(_,P,G),T=_e.get(G),T.init(P),x.push(T),G.traverseVisible(function(V){V.isLight&&V.layers.test(P.layers)&&(T.pushLight(V),V.castShadow&&T.pushShadow(V))}),_!==G&&_.traverseVisible(function(V){V.isLight&&V.layers.test(P.layers)&&(T.pushLight(V),V.castShadow&&T.pushShadow(V))}),T.setupLights(),B!==null&&B.updateLights(T.state.lightsArray),he=this.localClippingEnabled,oe=Be.init(this.clippingPlanes,he),oe===!0&&Be.setGlobalState(this.clippingPlanes,P),B!==null&&Xe.render(T.state.shadowsArray,G,P);let O=new Set;return _.traverse(function(V){if(!(V.isMesh||V.isPoints||V.isLine||V.isSprite))return;let le=V.material;if(le)if(Array.isArray(le))for(let Te=0;Te<le.length;Te++){let xe=le[Te];Or(xe,G,P,V),O.add(xe)}else Or(le,G,P,V),O.add(le)}),T=x.pop(),B!==null&&B.renderEnd(),O},this.compileAsync=function(_,P,G=null){let O=this.compile(_,P,G);return new Promise(V=>{function le(){if(O.forEach(function(Te){let Pe=X.get(Te).currentProgram;(Pe===void 0||Pe.isReady())&&O.delete(Te)}),O.size===0){V(_);return}setTimeout(le,10)}Ze.get("KHR_parallel_shader_compile")!==null?le():setTimeout(le,10)})};let es=null;function Td(_){es&&es(_)}function Gc(){di.stop()}function Hc(){di.start()}let di=new Ip;di.setAnimationLoop(Td),typeof self<"u"&&di.setContext(self),this.setAnimationLoop=function(_){es=_,Ne.setAnimationLoop(_),_===null?di.stop():di.start()},Ne.addEventListener("sessionstart",Gc),Ne.addEventListener("sessionend",Hc),this.render=function(_,P){if(P!==void 0&&P.isCamera!==!0){Ke("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;B!==null&&B.renderStart(_,P);let G=Ne.enabled===!0&&Ne.isPresenting===!0,O=w!==null&&(re===null||G)&&w.begin(L,re);if(_.matrixWorldAutoUpdate===!0&&_.updateMatrixWorld(),P.parent===null&&P.matrixWorldAutoUpdate===!0&&P.updateMatrixWorld(),Ne.enabled===!0&&Ne.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(Ne.cameraAutoUpdate===!0&&Ne.updateCamera(P),P=Ne.getCamera()),_.isScene===!0&&_.onBeforeRender(L,_,P,re),T=_e.get(_,x.length),T.init(P),T.state.textureUnits=$.getTextureUnits(),x.push(T),de.multiplyMatrices(P.projectionMatrix,P.matrixWorldInverse),te.setFromProjectionMatrix(de,zn,P.reversedDepth),he=this.localClippingEnabled,oe=Be.init(this.clippingPlanes,he),b=be.get(_,C.length),b.init(),C.push(b),Ne.enabled===!0&&Ne.isPresenting===!0){let Te=L.xr.getDepthSensingMesh();Te!==null&&Br(Te,P,-1/0,L.sortObjects)}Br(_,P,0,L.sortObjects),b.finish(),B!==null&&B.updateLights(T.state.lightsArray),L.sortObjects===!0&&b.sort(ye,ze),We=Ne.enabled===!1||Ne.isPresenting===!1||Ne.hasDepthSensing()===!1,We&&Qe.addToRenderList(b,_),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),oe===!0&&Be.beginShadows();let V=T.state.shadowsArray;if(Xe.render(V,_,P),oe===!0&&Be.endShadows(),(O&&w.hasRenderPass())===!1){let Te=b.opaque,xe=b.transmissive;if(T.setupLights(),P.isArrayCamera){let Pe=P.cameras;if(xe.length>0)for(let Oe=0,et=Pe.length;Oe<et;Oe++){let ot=Pe[Oe];io(Te,xe,_,ot)}We&&Qe.render(_);for(let Oe=0,et=Pe.length;Oe<et;Oe++){let ot=Pe[Oe];Ds(b,_,ot,ot.viewport)}}else xe.length>0&&io(Te,xe,_,P),We&&Qe.render(_),Ds(b,_,P)}re!==null&&Y===0&&($.updateMultisampleRenderTarget(re),$.updateRenderTargetMipmap(re)),O&&w.end(L),_.isScene===!0&&_.onAfterRender(L,_,P),Re.resetDefaultState(),K=-1,Q=null,x.pop(),x.length>0?(T=x[x.length-1],$.setTextureUnits(T.state.textureUnits),oe===!0&&Be.setGlobalState(L.clippingPlanes,T.state.camera)):T=null,C.pop(),C.length>0?b=C[C.length-1]:b=null,B!==null&&B.renderEnd()};function Br(_,P,G,O){if(_.visible===!1)return;if(_.layers.test(P.layers)){if(_.isGroup)G=_.renderOrder;else if(_.isLOD)_.autoUpdate===!0&&_.update(P);else if(_.isLightProbeGrid)T.pushLightProbeGrid(_);else if(_.isLight)T.pushLight(_),_.castShadow&&T.pushShadow(_);else if(_.isSprite){if(!_.frustumCulled||_.intersectsFrustum(te)){O&&Ve.setFromMatrixPosition(_.matrixWorld).applyMatrix4(de);let Te=ie.update(_),xe=_.material;xe.visible&&b.push(_,Te,xe,G,Ve.z,null,P)}}else if((_.isMesh||_.isLine||_.isPoints)&&(!_.frustumCulled||_.intersectsFrustum(te))){let Te=ie.update(_),xe=_.material;if(O&&(_.boundingSphere!==void 0?(_.boundingSphere===null&&_.computeBoundingSphere(),Ve.copy(_.boundingSphere.center)):(Te.boundingSphere===null&&Te.computeBoundingSphere(),Ve.copy(Te.boundingSphere.center)),Ve.applyMatrix4(_.matrixWorld).applyMatrix4(de)),Array.isArray(xe)){let Pe=Te.groups;for(let Oe=0,et=Pe.length;Oe<et;Oe++){let ot=Pe[Oe],Le=xe[ot.materialIndex];Le&&Le.visible&&b.push(_,Te,Le,G,Ve.z,ot,P)}}else xe.visible&&b.push(_,Te,xe,G,Ve.z,null,P)}}let le=_.children;for(let Te=0,xe=le.length;Te<xe;Te++)Br(le[Te],P,G,O)}function Ds(_,P,G,O){let{opaque:V,transmissive:le,transparent:Te}=_;T.setupLightsView(G),oe===!0&&Be.setGlobalState(L.clippingPlanes,G),O&&v.viewport(se.copy(O)),V.length>0&&Ns(V,P,G),le.length>0&&Ns(le,P,G),Te.length>0&&Ns(Te,P,G),v.buffers.depth.setTest(!0),v.buffers.depth.setMask(!0),v.buffers.color.setMask(!0),v.setPolygonOffset(!1)}function io(_,P,G,O){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[O.id]===void 0){let Le=Ze.has("EXT_color_buffer_half_float")||Ze.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[O.id]=new un(1,1,{generateMipmaps:!0,type:Le?ln:pn,minFilter:Pn,samples:Math.max(4,A.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:it.workingColorSpace})}let le=T.state.transmissionRenderTarget[O.id],Te=O.viewport||se;le.setSize(Te.z*L.transmissionResolutionScale,Te.w*L.transmissionResolutionScale);let xe=L.getRenderTarget(),Pe=L.getActiveCubeFace(),Oe=L.getActiveMipmapLevel();L.setRenderTarget(le),L.getClearColor(Ge),Se=L.getClearAlpha(),Se<1&&L.setClearColor(16777215,.5),L.clear(),We&&Qe.render(G);let et=L.toneMapping;L.toneMapping=bn;let ot=O.viewport;if(O.viewport!==void 0&&(O.viewport=void 0),T.setupLightsView(O),oe===!0&&Be.setGlobalState(L.clippingPlanes,O),Ns(_,G,O),$.updateMultisampleRenderTarget(le),$.updateRenderTargetMipmap(le),Ze.has("WEBGL_multisampled_render_to_texture")===!1){let Le=!1;for(let dt=0,Bt=P.length;dt<Bt;dt++){let At=P[dt],{object:Mt,geometry:Jt,material:Ie,group:sn}=At;if(Ie.side===Gt&&Mt.layers.test(O.layers)){let ct=Ie.side;Ie.side=on,Ie.needsUpdate=!0,so(Mt,G,O,Jt,Ie,sn),Ie.side=ct,Ie.needsUpdate=!0,Le=!0}}Le===!0&&($.updateMultisampleRenderTarget(le),$.updateRenderTargetMipmap(le))}L.setRenderTarget(xe,Pe,Oe),L.setClearColor(Ge,Se),ot!==void 0&&(O.viewport=ot),L.toneMapping=et}function Ns(_,P,G){let O=P.isScene===!0?P.overrideMaterial:null;for(let V=0,le=_.length;V<le;V++){let Te=_[V],{object:xe,geometry:Pe,group:Oe}=Te,et=Te.material;et.allowOverride===!0&&O!==null&&(et=O),xe.layers.test(G.layers)&&so(xe,P,G,Pe,et,Oe)}}function so(_,P,G,O,V,le){B!==null&&V.isNodeMaterial&&B.setObject(_,V),_.onBeforeRender(L,P,G,O,V,le),_.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,_.matrixWorld),_.normalMatrix.getNormalMatrix(_.modelViewMatrix),V.onBeforeRender(L,P,G,O,_,le),V.transparent===!0&&V.side===Gt&&V.forceSinglePass===!1?(V.side=on,V.needsUpdate=!0,L.renderBufferDirect(G,P,O,V,_,le),V.side=si,V.needsUpdate=!0,L.renderBufferDirect(G,P,O,V,_,le),V.side=Gt):L.renderBufferDirect(G,P,O,V,_,le),_.onAfterRender(L,P,G,O,V,le)}function fi(_,P,G){P.isScene!==!0&&(P=Ue);let O=X.get(_),V=T.state.lights,le=T.state.shadowsArray,Te=V.state.version,xe=pe.getParameters(_,V.state,le,P,G,T.state.lightProbeGridArray),Pe=pe.getProgramCacheKey(xe),Oe=O.programs;O.environment=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?P.environment:null,O.fog=P.fog;let et=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap;O.envMap=ce.get(_.envMap||O.environment,et),O.envMapRotation=O.environment!==null&&_.envMap===null?P.environmentRotation:_.envMapRotation,Oe===void 0&&(_.addEventListener("dispose",wn),Oe=new Map,O.programs=Oe);let ot=Oe.get(Pe);if(ot!==void 0){if(O.currentProgram===ot&&O.lightsStateVersion===Te)return kr(_,xe),ot}else xe.uniforms=pe.getUniforms(_),B!==null&&_.isNodeMaterial&&B.build(_,G,xe),_.onBeforeCompile(xe,L),ot=pe.acquireProgram(xe,Pe),Oe.set(Pe,ot),O.uniforms=xe.uniforms;let Le=O.uniforms;return(!_.isShaderMaterial&&!_.isRawShaderMaterial||_.clipping===!0)&&(Le.clippingPlanes=Be.uniform),kr(_,xe),O.needsLights=Z(_),O.lightsStateVersion=Te,O.needsLights&&(Le.ambientLightColor.value=V.state.ambient,Le.lightProbe.value=V.state.probe,Le.sunLights.value=V.state.sun,Le.sunLightShadows.value=V.state.sunShadow,Le.directionalLights.value=V.state.directional,Le.directionalLightShadows.value=V.state.directionalShadow,Le.spotLights.value=V.state.spot,Le.spotLightShadows.value=V.state.spotShadow,Le.rectAreaLights.value=V.state.rectArea,Le.ltc_1.value=V.state.rectAreaLTC1,Le.ltc_2.value=V.state.rectAreaLTC2,Le.pointLights.value=V.state.point,Le.pointLightShadows.value=V.state.pointShadow,Le.hemisphereLights.value=V.state.hemi,Le.sunShadowMatrix.value=V.state.sunShadowMatrix,Le.sunShadowCascade.value=V.state.sunShadowCascade,Le.directionalShadowMatrix.value=V.state.directionalShadowMatrix,Le.spotLightMatrix.value=V.state.spotLightMatrix,Le.spotLightMap.value=V.state.spotLightMap,Le.pointShadowMatrix.value=V.state.pointShadowMatrix),O.lightProbeGrid=T.state.lightProbeGridArray.length>0,O.currentProgram=ot,O.uniformsList=null,ot}function ro(_){if(_.uniformsList===null){let P=_.currentProgram.getUniforms();_.uniformsList=wr.seqWithValue(P.seq,_.uniforms)}return _.uniformsList}function kr(_,P){let G=X.get(_);G.outputColorSpace=P.outputColorSpace,G.batching=P.batching,G.batchingColor=P.batchingColor,G.instancing=P.instancing,G.instancingColor=P.instancingColor,G.instancingMorph=P.instancingMorph,G.skinning=P.skinning,G.morphTargets=P.morphTargets,G.morphNormals=P.morphNormals,G.morphColors=P.morphColors,G.morphTargetsCount=P.morphTargetsCount,G.numClippingPlanes=P.numClippingPlanes,G.numIntersection=P.numClipIntersection,G.vertexAlphas=P.vertexAlphas,G.vertexTangents=P.vertexTangents,G.toneMapping=P.toneMapping}function Wc(_,P){if(_.length===0)return null;if(_.length===1)return _[0].texture!==null?_[0]:null;M.setFromMatrixPosition(P.matrixWorld);for(let G=0,O=_.length;G<O;G++){let V=_[G];if(V.texture!==null&&V.boundingBox.containsPoint(M))return V}return null}function Xc(_,P,G,O,V){P.isScene!==!0&&(P=Ue),$.resetTextureUnits();let le=P.fog,Te=O.isMeshStandardMaterial||O.isMeshLambertMaterial||O.isMeshPhongMaterial?P.environment:null,xe=re===null?L.outputColorSpace:re.isXRRenderTarget===!0?re.texture.colorSpace:it.workingColorSpace,Pe=O.isMeshStandardMaterial||O.isMeshLambertMaterial&&!O.envMap||O.isMeshPhongMaterial&&!O.envMap,Oe=ce.get(O.envMap||Te,Pe),et=O.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,ot=!!G.attributes.tangent&&(!!O.normalMap||O.anisotropy>0),Le=!!G.morphAttributes.position,dt=!!G.morphAttributes.normal,Bt=!!G.morphAttributes.color,At=bn;O.toneMapped&&(re===null||re.isXRRenderTarget===!0)&&(At=L.toneMapping);let Mt=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,Jt=Mt!==void 0?Mt.length:0,Ie=X.get(O),sn=T.state.lights;if(oe===!0&&(he===!0||_!==Q)){let wt=_===Q&&O.id===K;Be.setState(O,_,wt)}let ct=!1;O.version===Ie.__version?(Ie.needsLights&&Ie.lightsStateVersion!==sn.state.version||Ie.outputColorSpace!==xe||V.isBatchedMesh&&Ie.batching===!1||!V.isBatchedMesh&&Ie.batching===!0||V.isBatchedMesh&&Ie.batchingColor===!0&&V._colorsTexture===null||V.isBatchedMesh&&Ie.batchingColor===!1&&V._colorsTexture!==null||V.isInstancedMesh&&Ie.instancing===!1||!V.isInstancedMesh&&Ie.instancing===!0||V.isSkinnedMesh&&Ie.skinning===!1||!V.isSkinnedMesh&&Ie.skinning===!0||V.isInstancedMesh&&Ie.instancingColor===!0&&V.instanceColor===null||V.isInstancedMesh&&Ie.instancingColor===!1&&V.instanceColor!==null||V.isInstancedMesh&&Ie.instancingMorph===!0&&V.morphTexture===null||V.isInstancedMesh&&Ie.instancingMorph===!1&&V.morphTexture!==null||Ie.envMap!==Oe||O.fog===!0&&Ie.fog!==le||Ie.numClippingPlanes!==void 0&&(Ie.numClippingPlanes!==Be.numPlanes||Ie.numIntersection!==Be.numIntersection)||Ie.vertexAlphas!==et||Ie.vertexTangents!==ot||Ie.morphTargets!==Le||Ie.morphNormals!==dt||Ie.morphColors!==Bt||Ie.toneMapping!==At||Ie.morphTargetsCount!==Jt||!!Ie.lightProbeGrid!=T.state.lightProbeGridArray.length>0)&&(ct=!0):(ct=!0,Ie.__version=O.version);let En=Ie.currentProgram;ct===!0&&(En=fi(O,P,V),B&&O.isNodeMaterial&&B.onUpdateProgram(O,En,Ie));let Kn=!1,Li=!1,Us=!1,vt=En.getUniforms(),Ft=Ie.uniforms;if(v.useProgram(En.program)&&(Kn=!0,Li=!0,Us=!0),O.id!==K&&(K=O.id,Li=!0),Ie.needsLights){let wt=Wc(T.state.lightProbeGridArray,V);Ie.lightProbeGrid!==wt&&(Ie.lightProbeGrid=wt,Li=!0)}if(Kn||Q!==_){v.buffers.depth.getReversed()&&_.reversedDepth!==!0&&(_._reversedDepth=!0,_.updateProjectionMatrix()),vt.setValue(U,"projectionMatrix",_.projectionMatrix),vt.setValue(U,"viewMatrix",_.matrixWorldInverse);let Ni=vt.map.cameraPosition;Ni!==void 0&&Ni.setValue(U,ge.setFromMatrixPosition(_.matrixWorld)),A.logarithmicDepthBuffer&&vt.setValue(U,"logDepthBufFC",2/(Math.log(_.far+1)/Math.LN2)),(O.isMeshPhongMaterial||O.isMeshToonMaterial||O.isMeshLambertMaterial||O.isMeshBasicMaterial||O.isMeshStandardMaterial||O.isShaderMaterial)&&vt.setValue(U,"isOrthographic",_.isOrthographicCamera===!0),Q!==_&&(Q=_,Li=!0,Us=!0)}if(Ie.needsLights&&(sn.state.sunShadowMap.length>0&&vt.setValue(U,"sunShadowMap",sn.state.sunShadowMap,$),sn.state.directionalShadowMap.length>0&&vt.setValue(U,"directionalShadowMap",sn.state.directionalShadowMap,$),sn.state.spotShadowMap.length>0&&vt.setValue(U,"spotShadowMap",sn.state.spotShadowMap,$),sn.state.pointShadowMap.length>0&&vt.setValue(U,"pointShadowMap",sn.state.pointShadowMap,$)),V.isSkinnedMesh){vt.setOptional(U,V,"bindMatrix"),vt.setOptional(U,V,"bindMatrixInverse");let wt=V.skeleton;wt&&(wt.boneTexture===null&&wt.computeBoneTexture(),vt.setValue(U,"boneTexture",wt.boneTexture,$))}V.isBatchedMesh&&(vt.setOptional(U,V,"batchingTexture"),vt.setValue(U,"batchingTexture",V._matricesTexture,$),vt.setOptional(U,V,"batchingIdTexture"),vt.setValue(U,"batchingIdTexture",V._indirectTexture,$),vt.setOptional(U,V,"batchingColorTexture"),V._colorsTexture!==null&&vt.setValue(U,"batchingColorTexture",V._colorsTexture,$));let Di=G.morphAttributes;if((Di.position!==void 0||Di.normal!==void 0||Di.color!==void 0)&&z.update(V,G,En),(Li||Ie.receiveShadow!==V.receiveShadow)&&(Ie.receiveShadow=V.receiveShadow,vt.setValue(U,"receiveShadow",V.receiveShadow)),(O.isMeshStandardMaterial||O.isMeshLambertMaterial||O.isMeshPhongMaterial)&&O.envMap===null&&P.environment!==null&&(Ft.envMapIntensity.value=P.environmentIntensity),Ft.dfgLUT!==void 0&&(Ft.dfgLUT.value=Yy()),Li){if(vt.setValue(U,"toneMappingExposure",L.toneMappingExposure),Ie.needsLights&&D(Ft,Us),le&&O.fog===!0&&De.refreshFogUniforms(Ft,le),De.refreshMaterialUniforms(Ft,O,ee,J,T.state.transmissionRenderTarget[_.id]),Ie.needsLights&&Ie.lightProbeGrid){let wt=Ie.lightProbeGrid;Ft.probesSH.value=wt.texture,Ft.probesMin.value.copy(wt.boundingBox.min),Ft.probesMax.value.copy(wt.boundingBox.max),Ft.probesResolution.value.copy(wt.resolution)}wr.upload(U,ro(Ie),Ft,$)}if(O.isShaderMaterial&&O.uniformsNeedUpdate===!0&&(wr.upload(U,ro(Ie),Ft,$),O.uniformsNeedUpdate=!1),O.isSpriteMaterial&&vt.setValue(U,"center",V.center),vt.setValue(U,"modelViewMatrix",V.modelViewMatrix),vt.setValue(U,"normalMatrix",V.normalMatrix),vt.setValue(U,"modelMatrix",V.matrixWorld),O.uniformsGroups!==void 0){let wt=O.uniformsGroups;for(let Ni=0,Fs=wt.length;Ni<Fs;Ni++){let wd=wt[Ni];ae.update(wd,En),ae.bind(wd,En)}}return En}function D(_,P){_.ambientLightColor.needsUpdate=P,_.lightProbe.needsUpdate=P,_.sunLights.needsUpdate=P,_.sunLightShadows.needsUpdate=P,_.directionalLights.needsUpdate=P,_.directionalLightShadows.needsUpdate=P,_.pointLights.needsUpdate=P,_.pointLightShadows.needsUpdate=P,_.spotLights.needsUpdate=P,_.spotLightShadows.needsUpdate=P,_.rectAreaLights.needsUpdate=P,_.hemisphereLights.needsUpdate=P}function Z(_){return _.isMeshLambertMaterial||_.isMeshToonMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isShadowMaterial||_.isShaderMaterial&&_.lights===!0}this.getActiveCubeFace=function(){return W},this.getActiveMipmapLevel=function(){return Y},this.getRenderTarget=function(){return re},this.setRenderTargetTextures=function(_,P,G){let O=X.get(_);O.__autoAllocateDepthBuffer=_.resolveDepthBuffer===!1,O.__autoAllocateDepthBuffer===!1&&(O.__useRenderToTexture=!1),X.get(_.texture).__webglTexture=P,X.get(_.depthTexture).__webglTexture=O.__autoAllocateDepthBuffer?void 0:G,O.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(_,P){let G=X.get(_);G.__webglFramebuffer=P,G.__useDefaultFramebuffer=P===void 0},this.setRenderTarget=function(_,P=0,G=0){re=_,W=P,Y=G;let O=null,V=!1,le=!1;if(_){let xe=X.get(_);if(xe.__useDefaultFramebuffer!==void 0){v.bindFramebuffer(U.FRAMEBUFFER,xe.__webglFramebuffer),se.copy(_.viewport),ue.copy(_.scissor),we=_.scissorTest,v.viewport(se),v.scissor(ue),v.setScissorTest(we),K=-1;return}else if(xe.__webglFramebuffer===void 0)$.setupRenderTarget(_);else if(xe.__hasExternalTextures)$.rebindTextures(_,X.get(_.texture).__webglTexture,X.get(_.depthTexture).__webglTexture);else if(_.depthBuffer){let et=_.depthTexture;if(xe.__boundDepthTexture!==et){if(et!==null&&X.has(et)&&(_.width!==et.image.width||_.height!==et.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");$.setupDepthRenderbuffer(_)}}let Pe=_.texture;(Pe.isData3DTexture||Pe.isDataArrayTexture||Pe.isCompressedArrayTexture)&&(le=!0);let Oe=X.get(_).__webglFramebuffer;_.isWebGLCubeRenderTarget?(Array.isArray(Oe[P])?O=Oe[P][G]:O=Oe[P],V=!0):_.samples>0&&$.useMultisampledRTT(_)===!1?O=X.get(_).__webglMultisampledFramebuffer:Array.isArray(Oe)?O=Oe[G]:O=Oe,se.copy(_.viewport),ue.copy(_.scissor),we=_.scissorTest}else se.copy(Ae).multiplyScalar(ee).floor(),ue.copy(qe).multiplyScalar(ee).floor(),we=ht;if(G!==0&&(O=F),v.bindFramebuffer(U.FRAMEBUFFER,O)&&v.drawBuffers(_,O),v.viewport(se),v.scissor(ue),v.setScissorTest(we),V){let xe=X.get(_.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+P,xe.__webglTexture,G)}else if(le){let xe=P;for(let Pe=0;Pe<_.textures.length;Pe++){let Oe=X.get(_.textures[Pe]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+Pe,Oe.__webglTexture,G,xe)}}else if(_!==null&&G!==0){let xe=X.get(_.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,xe.__webglTexture,G)}K=-1};function q(_){let P=X.get(_);return(P.__readFormat!==_.format||P.__readType!==_.type)&&(P.__readFormat=_.format,P.__readType=_.type,P.__formatReadable=A.textureFormatReadable(_.format),P.__typeReadable=A.textureTypeReadable(_.type)),P}this.readRenderTargetPixels=function(_,P,G,O,V,le,Te,xe=0){if(!(_&&_.isWebGLRenderTarget)){Ke("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Pe=X.get(_).__webglFramebuffer;if(_.isWebGLCubeRenderTarget&&Te!==void 0&&(Pe=Pe[Te]),Pe){v.bindFramebuffer(U.FRAMEBUFFER,Pe);try{let Oe=_.textures[xe],et=Oe.format,ot=Oe.type;_.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+xe);let Le=q(Oe);if(Le.__formatReadable===!1){Ke("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Le.__typeReadable===!1){Ke("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}P>=0&&P<=_.width-O&&G>=0&&G<=_.height-V&&U.readPixels(P,G,O,V,Me.convert(et),Me.convert(ot),le)}finally{let Oe=re!==null?X.get(re).__webglFramebuffer:null;v.bindFramebuffer(U.FRAMEBUFFER,Oe)}}},this.readRenderTargetPixelsAsync=async function(_,P,G,O,V,le,Te,xe=0){if(!(_&&_.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Pe=X.get(_).__webglFramebuffer;if(_.isWebGLCubeRenderTarget&&Te!==void 0&&(Pe=Pe[Te]),Pe)if(P>=0&&P<=_.width-O&&G>=0&&G<=_.height-V){v.bindFramebuffer(U.FRAMEBUFFER,Pe);let Oe=_.textures[xe],et=Oe.format,ot=Oe.type;_.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+xe);let Le=q(Oe);if(Le.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Le.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let dt=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,dt),U.bufferData(U.PIXEL_PACK_BUFFER,le.byteLength,U.STREAM_READ),U.readPixels(P,G,O,V,Me.convert(et),Me.convert(ot),0),U.bindBuffer(U.PIXEL_PACK_BUFFER,null);let Bt=re!==null?X.get(re).__webglFramebuffer:null;v.bindFramebuffer(U.FRAMEBUFFER,Bt);let At=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await Qf(U,At,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,dt),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,le),U.bindBuffer(U.PIXEL_PACK_BUFFER,null),U.deleteBuffer(dt),U.deleteSync(At),le}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(_,P=null,G=0){let O=Math.pow(2,-G),V=Math.floor(_.image.width*O),le=Math.floor(_.image.height*O),Te=P!==null?P.x:0,xe=P!==null?P.y:0;$.setTexture2D(_,0),U.copyTexSubImage2D(U.TEXTURE_2D,G,0,0,Te,xe,V,le),v.unbindTexture()},this.copyTextureToTexture=function(_,P,G=null,O=null,V=0,le=0){let Te,xe,Pe,Oe,et,ot,Le,dt,Bt,At=_.isCompressedTexture?_.mipmaps[le]:_.image;if(G!==null)Te=G.max.x-G.min.x,xe=G.max.y-G.min.y,Pe=G.isBox3?G.max.z-G.min.z:1,Oe=G.min.x,et=G.min.y,ot=G.isBox3?G.min.z:0;else{let Ft=Math.pow(2,-V);Te=Math.floor(At.width*Ft),xe=Math.floor(At.height*Ft),_.isDataArrayTexture?Pe=At.depth:_.isData3DTexture?Pe=Math.floor(At.depth*Ft):Pe=1,Oe=0,et=0,ot=0}O!==null?(Le=O.x,dt=O.y,Bt=O.z):(Le=0,dt=0,Bt=0);let Mt=Me.convert(P.format),Jt=Me.convert(P.type),Ie;P.isData3DTexture?($.setTexture3D(P,0),Ie=U.TEXTURE_3D):P.isDataArrayTexture||P.isCompressedArrayTexture?($.setTexture2DArray(P,0),Ie=U.TEXTURE_2D_ARRAY):($.setTexture2D(P,0),Ie=U.TEXTURE_2D),v.activeTexture(U.TEXTURE0),v.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,P.flipY),v.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,P.premultiplyAlpha),v.pixelStorei(U.UNPACK_ALIGNMENT,P.unpackAlignment);let sn=v.getParameter(U.UNPACK_ROW_LENGTH),ct=v.getParameter(U.UNPACK_IMAGE_HEIGHT),En=v.getParameter(U.UNPACK_SKIP_PIXELS),Kn=v.getParameter(U.UNPACK_SKIP_ROWS),Li=v.getParameter(U.UNPACK_SKIP_IMAGES);v.pixelStorei(U.UNPACK_ROW_LENGTH,At.width),v.pixelStorei(U.UNPACK_IMAGE_HEIGHT,At.height),v.pixelStorei(U.UNPACK_SKIP_PIXELS,Oe),v.pixelStorei(U.UNPACK_SKIP_ROWS,et),v.pixelStorei(U.UNPACK_SKIP_IMAGES,ot);let Us=_.isDataArrayTexture||_.isData3DTexture,vt=P.isDataArrayTexture||P.isData3DTexture;if(_.isDepthTexture){let Ft=X.get(_),Di=X.get(P),wt=X.get(Ft.__renderTarget),Ni=X.get(Di.__renderTarget);v.bindFramebuffer(U.READ_FRAMEBUFFER,wt.__webglFramebuffer),v.bindFramebuffer(U.DRAW_FRAMEBUFFER,Ni.__webglFramebuffer);for(let Fs=0;Fs<Pe;Fs++)Us&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,X.get(_).__webglTexture,V,ot+Fs),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,X.get(P).__webglTexture,le,Bt+Fs)),U.blitFramebuffer(Oe,et,Te,xe,Le,dt,Te,xe,U.DEPTH_BUFFER_BIT,U.NEAREST);v.bindFramebuffer(U.READ_FRAMEBUFFER,null),v.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(V!==0||_.isRenderTargetTexture||X.has(_)){let Ft=X.get(_),Di=X.get(P);v.bindFramebuffer(U.READ_FRAMEBUFFER,R),v.bindFramebuffer(U.DRAW_FRAMEBUFFER,k);for(let wt=0;wt<Pe;wt++)Us?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Ft.__webglTexture,V,ot+wt):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Ft.__webglTexture,V),vt?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Di.__webglTexture,le,Bt+wt):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Di.__webglTexture,le),V!==0?U.blitFramebuffer(Oe,et,Te,xe,Le,dt,Te,xe,U.COLOR_BUFFER_BIT,U.NEAREST):vt?U.copyTexSubImage3D(Ie,le,Le,dt,Bt+wt,Oe,et,Te,xe):U.copyTexSubImage2D(Ie,le,Le,dt,Oe,et,Te,xe);v.bindFramebuffer(U.READ_FRAMEBUFFER,null),v.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else vt?_.isDataTexture||_.isData3DTexture?U.texSubImage3D(Ie,le,Le,dt,Bt,Te,xe,Pe,Mt,Jt,At.data):P.isCompressedArrayTexture?U.compressedTexSubImage3D(Ie,le,Le,dt,Bt,Te,xe,Pe,Mt,At.data):U.texSubImage3D(Ie,le,Le,dt,Bt,Te,xe,Pe,Mt,Jt,At):_.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,le,Le,dt,Te,xe,Mt,Jt,At.data):_.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,le,Le,dt,At.width,At.height,Mt,At.data):U.texSubImage2D(U.TEXTURE_2D,le,Le,dt,Te,xe,Mt,Jt,At);v.pixelStorei(U.UNPACK_ROW_LENGTH,sn),v.pixelStorei(U.UNPACK_IMAGE_HEIGHT,ct),v.pixelStorei(U.UNPACK_SKIP_PIXELS,En),v.pixelStorei(U.UNPACK_SKIP_ROWS,Kn),v.pixelStorei(U.UNPACK_SKIP_IMAGES,Li),le===0&&P.generateMipmaps&&U.generateMipmap(Ie),v.unbindTexture()},this.initRenderTarget=function(_){X.get(_).__webglFramebuffer===void 0&&$.setupRenderTarget(_)},this.initTexture=function(_){_.isCubeTexture?$.setTextureCube(_,0):_.isData3DTexture?$.setTexture3D(_,0):_.isDataArrayTexture||_.isCompressedArrayTexture?$.setTexture2DArray(_,0):$.setTexture2D(_,0),v.unbindTexture()},this.resetState=function(){W=0,Y=0,re=null,v.reset(),Re.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return zn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=it._getDrawingBufferColorSpace(e),t.unpackColorSpace=it._getUnpackColorSpace()}};function Bp(s,e=!1){let t=s[0].index!==null,n=new Set(Object.keys(s[0].attributes)),i=new Set(Object.keys(s[0].morphAttributes)),r={},a={},o=s[0].morphTargetsRelative,l=new Tt,c=0;for(let h=0;h<s.length;++h){let u=s[h],d=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let f in u.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(u.attributes[f]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let f in u.morphAttributes){if(!i.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[f]===void 0&&(a[f]=[]),a[f].push(u.morphAttributes[f])}if(e){let f;if(t)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,f,h),c+=f}}if(t){let h=0,u=[];for(let d=0;d<s.length;++d){let f=s[d].index;for(let m=0;m<f.count;++m)u.push(f.getX(m)+h);h+=s[d].attributes.position.count}l.setIndex(u)}for(let h in r){let u=Op(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(let h in a){let u=a[h][0].length;if(u!==0){l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let d=0;d<u;++d){let f=[];for(let y=0;y<a[h].length;++y)f.push(a[h][y][d]);let m=Op(f);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(m)}}}return l}function Op(s){let e,t,n,i=-1,r=0;for(let c=0;c<s.length;++c){let h=s[c];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(i===-1&&(i=h.gpuType),i!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*t}let a=new e(r),o=new Et(a,t,n),l=0;for(let c=0;c<s.length;++c){let h=s[c];if(h.isInterleavedBufferAttribute){let u=l/t;for(let d=0,f=h.count;d<f;d++)for(let m=0;m<t;m++){let y=h.getComponent(d,m);o.setComponent(d+u,m,y)}}else a.set(h.array,l);l+=h.count*t}return i!==void 0&&(o.gpuType=i),o}function Au(s,e){if(e===nu)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),s;if(e===Sr||e===Ba){let t=s.getIndex();if(t===null){let r=[],a=s.getAttribute("position");if(a!==void 0){for(let o=0;o<a.count;o++)r.push(o);s.setIndex(r),t=s.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),s}let n=t.count-2,i=[];if(e===Sr)for(let r=1;r<=n;r++)i.push(t.getX(0)),i.push(t.getX(r)),i.push(t.getX(r+1));else for(let r=0;r<n;r++)r%2===0?(i.push(t.getX(r)),i.push(t.getX(r+1)),i.push(t.getX(r+2))):(i.push(t.getX(r+2)),i.push(t.getX(r+1)),i.push(t.getX(r)));return i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles."),s.setIndex(i),s.clearGroups(),s}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),s}function kp(s){let e=new Map,t=new Map,n=s.clone();return zp(s,n,function(i,r){e.set(r,i),t.set(i,r)}),n.traverse(function(i){if(!i.isSkinnedMesh)return;let r=i,a=e.get(i),o=a.skeleton.bones;r.skeleton=a.skeleton.clone(),r.bindMatrix.copy(a.bindMatrix),r.skeleton.bones=o.map(function(l){return t.get(l)}),r.bind(r.skeleton,r.bindMatrix)}),n}function zp(s,e,t){t(s,e);for(let n=0;n<s.children.length;n++)zp(s.children[n],e.children[n],t)}var Cr=class extends Gn{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Nu(t)}),this.register(function(t){return new Uu(t)}),this.register(function(t){return new Wu(t)}),this.register(function(t){return new Xu(t)}),this.register(function(t){return new qu(t)}),this.register(function(t){return new Ou(t)}),this.register(function(t){return new Bu(t)}),this.register(function(t){return new ku(t)}),this.register(function(t){return new zu(t)}),this.register(function(t){return new Du(t)}),this.register(function(t){return new Vu(t)}),this.register(function(t){return new Fu(t)}),this.register(function(t){return new Hu(t)}),this.register(function(t){return new Gu(t)}),this.register(function(t){return new Pu(t)}),this.register(function(t){return new oc(t,st.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new oc(t,st.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new Yu(t)})}load(e,t,n,i){let r=this,a;if(this.resourcePath!=="")a=this.resourcePath;else if(this.path!==""){let c=Ri.extractUrlBase(e);a=Ri.resolveURL(c,this.path)}else a=Ri.extractUrlBase(e);this.manager.itemStart(e);let o=function(c){i?i(c):console.error(c),r.manager.itemError(e),r.manager.itemEnd(e)},l=new ms(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{r.parse(c,a,function(h){t(h),r.manager.itemEnd(e)},o)}catch(h){o(h)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,i){let r,a={},o={},l=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===Xp){try{a[st.KHR_BINARY_GLTF]=new Ku(e)}catch(u){i&&i(u);return}r=JSON.parse(a[st.KHR_BINARY_GLTF].content)}else r=JSON.parse(l.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let c=new td(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){let u=this.pluginCallbacks[h](c);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[u.name]=u,a[u.name]=!0}if(r.extensionsUsed)for(let h=0;h<r.extensionsUsed.length;++h){let u=r.extensionsUsed[h],d=r.extensionsRequired||[];switch(u){case st.KHR_MATERIALS_UNLIT:a[u]=new Lu;break;case st.KHR_DRACO_MESH_COMPRESSION:a[u]=new Zu(r,this.dracoLoader);break;case st.KHR_TEXTURE_TRANSFORM:a[u]=new $u;break;case st.KHR_MESH_QUANTIZATION:a[u]=new Ju;break;default:d.indexOf(u)>=0&&o[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}c.setExtensions(a),c.setPlugins(o),c.parse(n,i)}parseAsync(e,t){let n=this;return new Promise(function(i,r){n.parse(e,t,i,r)})}};function Ky(){let s={};return{get:function(e){return s[e]},add:function(e,t){s[e]=t},remove:function(e){delete s[e]},removeAll:function(){s={}}}}function Ot(s,e,t){let n=s.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}var st={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},Pu=class{constructor(e){this.parser=e,this.name=st.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,i=t.length;n<i;n++){let r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n="light:"+e,i=t.cache.get(n);if(i)return i;let r=t.json,l=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e],c,h=new He(16777215);l.color!==void 0&&h.setRGB(l.color[0],l.color[1],l.color[2],Zt);let u=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new In(h),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new _s(h),c.distance=u;break;case"spot":c=new Ra(h),c.distance=u,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),li(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),i=Promise.resolve(c),t.cache.add(n,i),i}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,r=n.json.nodes[e],o=(r.extensions&&r.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(l){return n._getNodeRef(t.cache,o,l)})}},Lu=class{constructor(){this.name=st.KHR_MATERIALS_UNLIT}getMaterialType(){return Vt}extendParams(e,t,n){let i=[];e.color=new He(1,1,1),e.opacity=1;let r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){let a=r.baseColorFactor;e.color.setRGB(a[0],a[1],a[2],Zt),e.opacity=a[3]}r.baseColorTexture!==void 0&&i.push(n.assignTexture(e,"map",r.baseColorTexture,gt))}return Promise.all(i)}},Du=class{constructor(e){this.parser=e,this.name=st.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let n=Ot(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}},Nu=class{constructor(e){this.parser=e,this.name=st.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return Ot(this.parser,e,this.name)!==null?tn:null}extendMaterialParams(e,t){let n=Ot(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(i.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){let r=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new fe(r,r)}return Promise.all(i)}},Uu=class{constructor(e){this.parser=e,this.name=st.KHR_MATERIALS_DISPERSION}getMaterialType(e){return Ot(this.parser,e,this.name)!==null?tn:null}extendMaterialParams(e,t){let n=Ot(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}},Fu=class{constructor(e){this.parser=e,this.name=st.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return Ot(this.parser,e,this.name)!==null?tn:null}extendMaterialParams(e,t){let n=Ot(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(i)}},Ou=class{constructor(e){this.parser=e,this.name=st.KHR_MATERIALS_SHEEN}getMaterialType(e){return Ot(this.parser,e,this.name)!==null?tn:null}extendMaterialParams(e,t){let n=Ot(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];if(t.sheenColor=new He(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){let r=n.sheenColorFactor;t.sheenColor.setRGB(r[0],r[1],r[2],Zt)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,gt)),n.sheenRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(i)}},Bu=class{constructor(e){this.parser=e,this.name=st.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return Ot(this.parser,e,this.name)!==null?tn:null}extendMaterialParams(e,t){let n=Ot(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&i.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(i)}},ku=class{constructor(e){this.parser=e,this.name=st.KHR_MATERIALS_VOLUME}getMaterialType(e){return Ot(this.parser,e,this.name)!==null?tn:null}extendMaterialParams(e,t){let n=Ot(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;let r=n.attenuationColor||[1,1,1];return t.attenuationColor=new He().setRGB(r[0],r[1],r[2],Zt),Promise.all(i)}},zu=class{constructor(e){this.parser=e,this.name=st.KHR_MATERIALS_IOR}getMaterialType(e){return Ot(this.parser,e,this.name)!==null?tn:null}extendMaterialParams(e,t){let n=Ot(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}},Vu=class{constructor(e){this.parser=e,this.name=st.KHR_MATERIALS_SPECULAR}getMaterialType(e){return Ot(this.parser,e,this.name)!==null?tn:null}extendMaterialParams(e,t){let n=Ot(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));let r=n.specularColorFactor||[1,1,1];return t.specularColor=new He().setRGB(r[0],r[1],r[2],Zt),n.specularColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,gt)),Promise.all(i)}},Gu=class{constructor(e){this.parser=e,this.name=st.EXT_MATERIALS_BUMP}getMaterialType(e){return Ot(this.parser,e,this.name)!==null?tn:null}extendMaterialParams(e,t){let n=Ot(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&i.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(i)}},Hu=class{constructor(e){this.parser=e,this.name=st.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return Ot(this.parser,e,this.name)!==null?tn:null}extendMaterialParams(e,t){let n=Ot(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&i.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(i)}},Wu=class{constructor(e){this.parser=e,this.name=st.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,i=n.textures[e];if(!i.extensions||!i.extensions[this.name])return null;let r=i.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,a)}},Xu=class{constructor(e){this.parser=e,this.name=st.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,n=this.parser,i=n.json,r=i.textures[e];if(!r.extensions||!r.extensions[t])return null;let a=r.extensions[t],o=i.images[a.source],l=n.textureLoader;if(o.uri){let c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}},qu=class{constructor(e){this.parser=e,this.name=st.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,n=this.parser,i=n.json,r=i.textures[e];if(!r.extensions||!r.extensions[t])return null;let a=r.extensions[t],o=i.images[a.source],l=n.textureLoader;if(o.uri){let c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}},oc=class{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let i=n.extensions[this.name],r=this.parser.getDependency("buffer",i.buffer),a=this.parser.options.meshoptDecoder;if(!a||!a.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(o){let l=i.byteOffset||0,c=i.byteLength||0,h=i.count,u=i.byteStride,d=new Uint8Array(o,l,c);return a.decodeGltfBufferAsync?a.decodeGltfBufferAsync(h,u,d,i.mode,i.filter).then(function(f){return f.buffer}):a.ready.then(function(){let f=new ArrayBuffer(h*u);return a.decodeGltfBuffer(new Uint8Array(f),h,u,d,i.mode,i.filter),f})})}else return null}},Yu=class{constructor(e){this.name=st.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let i=t.meshes[n.mesh];for(let c of i.primitives)if(c.mode!==Ln.TRIANGLES&&c.mode!==Ln.TRIANGLE_STRIP&&c.mode!==Ln.TRIANGLE_FAN&&c.mode!==void 0)return null;let a=n.extensions[this.name].attributes,o=[],l={};for(let c in a)o.push(this.parser.getDependency("accessor",a[c]).then(h=>(l[c]=h,l[c])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(c=>{let h=c.pop(),u=h.isGroup?h.children:[h],d=c[0].count,f=[];for(let m of u){let y=new Je,g=new N,p=new en,S=new N(1,1,1),E=new oa(m.geometry,m.material,d);for(let b=0;b<d;b++)l.TRANSLATION&&g.fromBufferAttribute(l.TRANSLATION,b),l.ROTATION&&p.fromBufferAttribute(l.ROTATION,b),l.SCALE&&S.fromBufferAttribute(l.SCALE,b),E.setMatrixAt(b,y.compose(g,p,S));let M=null;for(let b in l)if(b==="_COLOR_0"){let T=l[b];E.instanceColor=new bi(T.array,T.itemSize,T.normalized)}else if(b!=="TRANSLATION"&&b!=="ROTATION"&&b!=="SCALE"){if(M===null){let C=E.geometry;M=new Tt,M.name=C.name;for(let x in C.attributes)M.setAttribute(x,C.attributes[x]);for(let x in C.morphAttributes)M.morphAttributes[x]=C.morphAttributes[x];C.index!==null&&M.setIndex(C.index),M.morphTargetsRelative=C.morphTargetsRelative;for(let x of C.groups)M.addGroup(x.start,x.count,x.materialIndex);C.boundingBox!==null&&(M.boundingBox=C.boundingBox.clone()),C.boundingSphere!==null&&(M.boundingSphere=C.boundingSphere.clone()),M.drawRange.start=C.drawRange.start,M.drawRange.count=C.drawRange.count,M.userData=Object.assign({},C.userData),E.geometry=M}let T=l[b];M.setAttribute(b,new bi(T.array,T.itemSize,T.normalized))}Pt.prototype.copy.call(E,m),this.parser.assignFinalMaterial(E),f.push(E)}return h.isGroup?(h.clear(),h.add(...f),h):f[0]}))}},Xp="glTF",Ha=12,Vp={JSON:1313821514,BIN:5130562},Ku=class{constructor(e){this.name=st.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,Ha),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Xp)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let i=this.header.length-Ha,r=new DataView(e,Ha),a=0;for(;a<i;){let o=r.getUint32(a,!0);a+=4;let l=r.getUint32(a,!0);if(a+=4,l===Vp.JSON){let c=new Uint8Array(e,Ha+a,o);this.content=n.decode(c)}else if(l===Vp.BIN){let c=Ha+a;this.body=e.slice(c,c+o)}a+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},Zu=class{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=st.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,i=this.dracoLoader,r=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},l={},c={};for(let h in a){let u=Qu[h]||h.toLowerCase();o[u]=a[h]}for(let h in e.attributes){let u=Qu[h]||h.toLowerCase();if(a[h]!==void 0){let d=n.accessors[e.attributes[h]],f=Rr[d.componentType];c[u]=f.name,l[u]=d.normalized===!0}}return t.getDependency("bufferView",r).then(function(h){return new Promise(function(u,d){i.decodeDracoFile(h,function(f){for(let m in f.attributes){let y=f.attributes[m],g=l[m];g!==void 0&&(y.normalized=g)}u(f)},o,c,Zt,d)})})}},$u=class{constructor(){this.name=st.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){if((t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0)return e;if(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),t.rotation!==void 0){let n=Math.cos(e.rotation),i=Math.sin(e.rotation);e.matrix.set(e.repeat.x*n,e.repeat.y*i,e.offset.x,-e.repeat.x*i,e.repeat.y*n,e.offset.y,0,0,1),e.matrixAutoUpdate=!1}return e.needsUpdate=!0,e}},Ju=class{constructor(){this.name=st.KHR_MESH_QUANTIZATION}},lc=class extends ti{constructor(e,t,n,i){super(e,t,n,i)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i*3+i;for(let a=0;a!==i;a++)t[a]=n[r+a];return t}interpolate_(e,t,n,i){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=o*2,c=o*3,h=i-t,u=(n-t)/h,d=u*u,f=d*u,m=e*c,y=m-c,g=-2*f+3*d,p=f-d,S=1-g,E=p-d+u;for(let M=0;M!==o;M++){let b=a[y+M+o],T=a[y+M+l]*h,C=a[m+M+o],x=a[m+M]*h;r[M]=S*b+E*T+g*C+p*x}return r}},Zy=new en,ju=class extends lc{interpolate_(e,t,n,i){let r=super.interpolate_(e,t,n,i);return Zy.fromArray(r).normalize().toArray(r),r}},Ln={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},Rr={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Gp={9728:Dt,9729:bt,9984:ml,9985:vr,9986:bs,9987:Pn},Hp={33071:qt,33648:Qs,10497:Cn},Ru={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Qu={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Qi={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},$y={CUBICSPLINE:void 0,LINEAR:ls,STEP:os},Cu={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function Jy(s){return s.DefaultMaterial===void 0&&(s.DefaultMaterial=new Vn({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:si})),s.DefaultMaterial}function Es(s,e,t){for(let n in t.extensions)s[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function li(s,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(s.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function jy(s,e,t){let n=!1,i=!1,r=!1;for(let c=0,h=e.length;c<h;c++){let u=e[c];if(u.POSITION!==void 0&&(n=!0),u.NORMAL!==void 0&&(i=!0),u.COLOR_0!==void 0&&(r=!0),n&&i&&r)break}if(!n&&!i&&!r)return Promise.resolve(s);let a=[],o=[],l=[];for(let c=0,h=e.length;c<h;c++){let u=e[c];if(n){let d=u.POSITION!==void 0?t.getDependency("accessor",u.POSITION):s.attributes.position;a.push(d)}if(i){let d=u.NORMAL!==void 0?t.getDependency("accessor",u.NORMAL):s.attributes.normal;o.push(d)}if(r){let d=u.COLOR_0!==void 0?t.getDependency("accessor",u.COLOR_0):s.attributes.color;l.push(d)}}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l)]).then(function(c){let h=c[0],u=c[1],d=c[2];return n&&(s.morphAttributes.position=h),i&&(s.morphAttributes.normal=u),r&&(s.morphAttributes.color=d),s.morphTargetsRelative=!0,s})}function Qy(s,e){if(s.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)s.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){let t=e.extras.targetNames;if(s.morphTargetInfluences.length===t.length){s.morphTargetDictionary={};for(let n=0,i=t.length;n<i;n++)s.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function eM(s){let e,t=s.extensions&&s.extensions[st.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Iu(t.attributes):e=s.indices+":"+Iu(s.attributes)+":"+s.mode,s.targets!==void 0)for(let n=0,i=s.targets.length;n<i;n++)e+=":"+Iu(s.targets[n]);return e}function Iu(s){let e="",t=Object.keys(s).sort();for(let n=0,i=t.length;n<i;n++)e+=t[n]+":"+s[t[n]]+";";return e}function ed(s){switch(s){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function tM(s){return s.search(/\.jpe?g($|\?)/i)>0||s.search(/^data\:image\/jpeg/)===0?"image/jpeg":s.search(/\.webp($|\?)/i)>0||s.search(/^data\:image\/webp/)===0?"image/webp":s.search(/\.ktx2($|\?)/i)>0||s.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}var nM=new Je,td=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new Ky,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,r=!1,a=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){let o=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(o)===!0;let l=o.match(/Version\/(\d+)/);i=n&&l?parseInt(l[1],10):-1,r=o.indexOf("Firefox")>-1,a=r?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&i<17||r&&a<98?this.textureLoader=new Hn(this.options.manager):this.textureLoader=new Ca(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new ms(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,i=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(a){return a._markDefs&&a._markDefs()}),Promise.all(this._invokeAll(function(a){return a.beforeRoot&&a.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(a){let o={scene:a[0][i.scene||0],scenes:a[0],animations:a[1],cameras:a[2],asset:i.asset,parser:n,userData:{}};return Es(r,o,i),li(o,i),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(o)})).then(function(){for(let l of o.scenes)l.updateMatrixWorld();e(o)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let i=0,r=t.length;i<r;i++){let a=t[i].joints;for(let o=0,l=a.length;o<l;o++)e[a[o]].isBone=!0}for(let i=0,r=e.length;i<r;i++){let a=e[i];a.mesh!==void 0&&(this._addNodeRef(this.meshCache,a.mesh),a.skin!==void 0&&(n[a.mesh].isSkinnedMesh=!0)),a.camera!==void 0&&this._addNodeRef(this.cameraCache,a.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let i=n.clone(),r=(a,o)=>{let l=this.associations.get(a);l!=null&&this.associations.set(o,l);for(let[c,h]of a.children.entries())r(h,o.children[c])};return r(n,i),i.name+="_instance_"+e.uses[t]++,i}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let i=e(t[n]);if(i)return i}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let i=0;i<t.length;i++){let r=e(t[i]);r&&n.push(r)}return n}getDependency(e,t){let n=e+":"+t,i=this.cache.get(n);if(!i){switch(e){case"scene":i=this.loadScene(t);break;case"node":i=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":i=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":i=this.loadAccessor(t);break;case"bufferView":i=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":i=this.loadBuffer(t);break;case"material":i=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":i=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":i=this.loadSkin(t);break;case"animation":i=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":i=this.loadCamera(t);break;default:if(i=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!i)throw new Error("Unknown type: "+e);break}this.cache.add(n,i)}return i}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(i.map(function(r,a){return n.getDependency(e,a)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[st.KHR_BINARY_GLTF].body);let i=this.options;return new Promise(function(r,a){n.load(Ri.resolveURL(t.uri,i.path),r,void 0,function(){a(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){let i=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+i)})}loadAccessor(e){let t=this,n=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){let a=Ru[i.type],o=Rr[i.componentType],l=i.normalized===!0,c=new o(i.count*a);return Promise.resolve(new Et(c,a,l))}let r=[];return i.bufferView!==void 0?r.push(this.getDependency("bufferView",i.bufferView)):r.push(null),i.sparse!==void 0&&(r.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(r).then(function(a){let o=a[0],l=Ru[i.type],c=Rr[i.componentType],h=c.BYTES_PER_ELEMENT,u=h*l,d=i.byteOffset||0,f=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,m=i.normalized===!0,y,g;if(f&&f!==u){let p=Math.floor(d/f),S="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+p+":"+i.count,E=t.cache.get(S);E||(y=new c(o,p*f,i.count*f/h),E=new ar(y,f/h),t.cache.add(S,E)),g=new or(E,l,d%f/h,m)}else o===null?y=new c(i.count*l):y=new c(o,d,i.count*l),g=new Et(y,l,m);if(i.sparse!==void 0){let p=Ru.SCALAR,S=Rr[i.sparse.indices.componentType],E=i.sparse.indices.byteOffset||0,M=i.sparse.values.byteOffset||0,b=new S(a[1],E,i.sparse.count*p),T=new c(a[2],M,i.sparse.count*l);o!==null&&(g=new Et(g.array.slice(),g.itemSize,g.normalized)),g.normalized=!1;for(let C=0,x=b.length;C<x;C++){let w=b[C];if(g.setX(w,T[C*l]),l>=2&&g.setY(w,T[C*l+1]),l>=3&&g.setZ(w,T[C*l+2]),l>=4&&g.setW(w,T[C*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}g.normalized=m}return g})}loadTexture(e){let t=this.json,n=this.options,r=t.textures[e].source,a=t.images[r],o=this.textureLoader;if(a.uri){let l=n.manager.getHandler(a.uri);l!==null&&(o=l)}return this.loadTextureImage(e,r,o)}loadTextureImage(e,t,n){let i=this,r=this.json,a=r.textures[e],o=r.images[t],l=(o.uri||o.bufferView)+":"+a.sampler;if(this.textureCache[l])return this.textureCache[l];let c=this.loadImageSource(t,n).then(function(h){h.flipY=!1,h.name=a.name||o.name||"",h.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(h.name=o.uri);let d=(r.samplers||{})[a.sampler]||{};return h.magFilter=Gp[d.magFilter]||bt,h.minFilter=Gp[d.minFilter]||Pn,h.wrapS=Hp[d.wrapS]||Cn,h.wrapT=Hp[d.wrapT]||Cn,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==Dt&&h.minFilter!==bt,i.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){let n=this,i=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(u=>u.clone());let a=i.images[e],o=self.URL||self.webkitURL,l=a.uri||"",c=!1;if(a.bufferView!==void 0)l=n.getDependency("bufferView",a.bufferView).then(function(u){c=!0;let d=new Blob([u],{type:a.mimeType});return l=o.createObjectURL(d),l});else if(a.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");let h=Promise.resolve(l).then(function(u){return new Promise(function(d,f){let m=d;t.isImageBitmapLoader===!0&&(m=function(y){let g=new Nt(y);g.needsUpdate=!0,d(g)}),t.load(Ri.resolveURL(u,r.path),m,void 0,f)})}).then(function(u){return c===!0&&o.revokeObjectURL(l),li(u,a),u.userData.mimeType=a.mimeType||tM(a.uri),u}).catch(function(u){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),u});return this.sourceCache[e]=h,h}assignTexture(e,t,n,i){let r=this;return this.getDependency("texture",n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),r.extensions[st.KHR_TEXTURE_TRANSFORM]){let o=n.extensions!==void 0?n.extensions[st.KHR_TEXTURE_TRANSFORM]:void 0;if(o){let l=r.associations.get(a);a=r.extensions[st.KHR_TEXTURE_TRANSFORM].extendTexture(a,o),r.associations.set(a,l)}}return i!==void 0&&(a.colorSpace=i),e[t]=a,a})}assignFinalMaterial(e){let t=e.geometry,n=e.material,i=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){let o="PointsMaterial:"+n.uuid,l=this.cache.get(o);l||(l=new Wi,an.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(o,l)),n=l}else if(e.isLine){let o="LineBasicMaterial:"+n.uuid,l=this.cache.get(o);l||(l=new hr,an.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(o,l)),n=l}if(i||r||a){let o="ClonedMaterial:"+n.uuid+":";i&&(o+="derivative-tangents:"),r&&(o+="vertex-colors:"),a&&(o+="flat-shading:");let l=this.cache.get(o);l||(l=n.clone(),r&&(l.vertexColors=!0),a&&(l.flatShading=!0),i&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(o,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return Vn}loadMaterial(e){let t=this,n=this.json,i=this.extensions,r=n.materials[e],a,o={},l=r.extensions||{},c=[];if(l[st.KHR_MATERIALS_UNLIT]){let u=i[st.KHR_MATERIALS_UNLIT];a=u.getMaterialType(),c.push(u.extendParams(o,r,t))}else{let u=r.pbrMetallicRoughness||{};if(o.color=new He(1,1,1),o.opacity=1,Array.isArray(u.baseColorFactor)){let d=u.baseColorFactor;o.color.setRGB(d[0],d[1],d[2],Zt),o.opacity=d[3]}u.baseColorTexture!==void 0&&c.push(t.assignTexture(o,"map",u.baseColorTexture,gt)),o.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,o.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(o,"metalnessMap",u.metallicRoughnessTexture)),c.push(t.assignTexture(o,"roughnessMap",u.metallicRoughnessTexture))),a=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,o)})))}r.doubleSided===!0&&(o.side=Gt);let h=r.alphaMode||Cu.OPAQUE;if(h===Cu.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,h===Cu.MASK&&(o.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&a!==Vt&&(c.push(t.assignTexture(o,"normalMap",r.normalTexture)),o.normalScale=new fe(1,1),r.normalTexture.scale!==void 0)){let u=r.normalTexture.scale;o.normalScale.set(u,u)}if(r.occlusionTexture!==void 0&&a!==Vt&&(c.push(t.assignTexture(o,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&a!==Vt){let u=r.emissiveFactor;o.emissive=new He().setRGB(u[0],u[1],u[2],Zt)}return r.emissiveTexture!==void 0&&a!==Vt&&c.push(t.assignTexture(o,"emissiveMap",r.emissiveTexture,gt)),Promise.all(c).then(function(){let u=new a(o);return r.name&&(u.name=r.name),li(u,r),t.associations.set(u,{materials:e}),r.extensions&&Es(i,u,r),u})}createUniqueName(e){let t=St.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,i=this.primitiveCache;function r(o){return n[st.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,t).then(function(l){return Wp(l,o,t)})}let a=[];for(let o=0,l=e.length;o<l;o++){let c=e[o],h=eM(c),u=i[h];if(u)a.push(u.promise);else{let d;c.extensions&&c.extensions[st.KHR_DRACO_MESH_COMPRESSION]?d=r(c):d=Wp(new Tt,c,t),c.mode===Ln.TRIANGLE_STRIP?d=d.then(f=>Au(f,Ba)):c.mode===Ln.TRIANGLE_FAN&&(d=d.then(f=>Au(f,Sr))),i[h]={primitive:c,promise:d},a.push(d)}}return Promise.all(a)}loadMesh(e){let t=this,n=this.json,i=this.extensions,r=n.meshes[e],a=r.primitives,o=[];for(let l=0,c=a.length;l<c;l++){let h=a[l].material===void 0?Jy(this.cache):this.getDependency("material",a[l].material);o.push(h)}return o.push(t.loadGeometries(a)),Promise.all(o).then(async function(l){let c=l.slice(0,l.length-1),h=l[l.length-1],u=[];for(let f=0,m=h.length;f<m;f++){let y=h[f],g=a[f],p,S=c[f];if(g.mode===Ln.TRIANGLES||g.mode===Ln.TRIANGLE_STRIP||g.mode===Ln.TRIANGLE_FAN||g.mode===void 0){let E=r.isSkinnedMesh===!0,M=y.hasAttribute("skinIndex")&&y.hasAttribute("skinWeight");E&&M===!1&&console.warn("THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled."),p=E&&M?new ra(y,S):new pt(y,S),p.isSkinnedMesh===!0&&p.normalizeSkinWeights()}else if(g.mode===Ln.LINES)p=new la(y,S);else if(g.mode===Ln.LINE_STRIP)p=new us(y,S);else if(g.mode===Ln.LINE_LOOP)p=new ca(y,S);else if(g.mode===Ln.POINTS)p=new ds(y,S);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+g.mode);Object.keys(p.geometry.morphAttributes).length>0&&Qy(p,r),p.name=t.createUniqueName(r.name||"mesh_"+e),li(p,r),g.extensions&&Es(i,p,g),t.assignFinalMaterial(p),u.push(p)}for(let f=0,m=u.length;f<m;f++)t.associations.set(u[f],{meshes:e,primitives:f});if(u.length===1)return r.extensions&&Es(i,u[0],r),u[0];let d=new It;r.extensions&&Es(i,d,r),t.associations.set(d,{meshes:e});for(let f=0,m=u.length;f<m;f++)d.add(u[f]);return d})}loadCamera(e){let t,n=this.json.cameras[e],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new Ct(Rt.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(t=new ii(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),li(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let i=0,r=t.joints.length;i<r;i++)n.push(this._loadNodeShallow(t.joints[i]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){let r=i.pop(),a=i,o=[],l=[];for(let c=0,h=a.length;c<h;c++){let u=a[c];if(u){o.push(u);let d=new Je;r!==null&&d.fromArray(r.array,c*16),l.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new aa(o,l)})}loadAnimation(e){let t=this.json,n=this,i=t.animations[e],r=i.name?i.name:"animation_"+e,a=[],o=[],l=[],c=[],h=[];for(let u=0,d=i.channels.length;u<d;u++){let f=i.channels[u],m=i.samplers[f.sampler],y=f.target,g=y.node,p=i.parameters!==void 0?i.parameters[m.input]:m.input,S=i.parameters!==void 0?i.parameters[m.output]:m.output;y.node!==void 0&&(a.push(this.getDependency("node",g)),o.push(this.getDependency("accessor",p)),l.push(this.getDependency("accessor",S)),c.push(m),h.push(y))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l),Promise.all(c),Promise.all(h)]).then(function(u){let d=u[0],f=u[1],m=u[2],y=u[3],g=u[4],p=[];for(let E=0,M=d.length;E<M;E++){let b=d[E],T=f[E],C=m[E],x=y[E],w=g[E];if(b===void 0)continue;b.updateMatrix&&b.updateMatrix();let L=n._createAnimationTracks(b,T,C,x,w);if(L)for(let I=0;I<L.length;I++)p.push(L[I])}let S=new pr(r,void 0,p);return li(S,i),S})}createNodeMesh(e){let t=this.json,n=this,i=t.nodes[e];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(r){let a=n._getNodeRef(n.meshCache,i.mesh,r);return i.weights!==void 0&&a.traverse(function(o){if(o.isMesh)for(let l=0,c=i.weights.length;l<c;l++)o.morphTargetInfluences[l]=i.weights[l]}),a})}loadNode(e){let t=this.json,n=this,i=t.nodes[e],r=n._loadNodeShallow(e),a=[],o=i.children||[];for(let c=0,h=o.length;c<h;c++)a.push(n.getDependency("node",o[c]));let l=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([r,Promise.all(a),l]).then(function(c){let h=c[0],u=c[1],d=c[2];d!==null&&h.traverse(function(f){f.isSkinnedMesh&&f.bind(d,nM)});for(let f=0,m=u.length;f<m;f++)h.add(u[f]);if(h.userData.pivot!==void 0&&u.length>0){let f=h.userData.pivot,m=u[0];h.pivot=new N().fromArray(f),h.position.x-=f[0],h.position.y-=f[1],h.position.z-=f[2],m.position.set(0,0,0),delete h.userData.pivot}return h})}_loadNodeShallow(e){let t=this.json,n=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let r=t.nodes[e],a=r.name?i.createUniqueName(r.name):"",o=[],l=i._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&o.push(l),r.camera!==void 0&&o.push(i.getDependency("camera",r.camera).then(function(c){return i._getNodeRef(i.cameraCache,r.camera,c)})),i._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){o.push(c)}),this.nodeCache[e]=Promise.all(o).then(function(c){let h;if(r.isBone===!0?h=new lr:c.length>1?h=new It:c.length===1?h=c[0]:h=new Pt,h!==c[0])for(let u=0,d=c.length;u<d;u++)h.add(c[u]);if(r.name&&(h.userData.name=r.name,h.name=a),li(h,r),r.extensions&&Es(n,h,r),r.matrix!==void 0){let u=new Je;u.fromArray(r.matrix),h.applyMatrix4(u)}else r.translation!==void 0&&h.position.fromArray(r.translation),r.rotation!==void 0&&h.quaternion.fromArray(r.rotation),r.scale!==void 0&&h.scale.fromArray(r.scale);if(!i.associations.has(h))i.associations.set(h,{});else if(r.mesh!==void 0&&i.meshCache.refs[r.mesh]>1){let u=i.associations.get(h);i.associations.set(h,{...u})}return i.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],i=this,r=new It;n.name&&(r.name=i.createUniqueName(n.name)),li(r,n),n.extensions&&Es(t,r,n);let a=n.nodes||[],o=[];for(let l=0,c=a.length;l<c;l++)o.push(i.getDependency("node",a[l]));return Promise.all(o).then(function(l){for(let h=0,u=l.length;h<u;h++){let d=l[h];d.parent!==null?r.add(kp(d)):r.add(d)}let c=h=>{let u=new Map;for(let[d,f]of i.associations)(d instanceof an||d instanceof Nt)&&u.set(d,f);return h.traverse(d=>{let f=i.associations.get(d);f!=null&&u.set(d,f)}),u};return i.associations=c(r),r})}_createAnimationTracks(e,t,n,i,r){let a=[],o=e.name?e.name:e.uuid,l=[];function c(f){f.morphTargetInfluences&&l.push(f.name?f.name:f.uuid)}Qi[r.path]===Qi.weights?(c(e),e.isGroup&&e.children.forEach(c)):l.push(o);let h;switch(Qi[r.path]){case Qi.weights:h=wi;break;case Qi.rotation:h=ni;break;case Qi.translation:case Qi.scale:h=Ai;break;default:n.itemSize===1?h=wi:h=Ai;break}let u=i.interpolation!==void 0?$y[i.interpolation]:ls,d=this._getArrayFromAccessor(n);for(let f=0,m=l.length;f<m;f++){let y=new h(l[f]+"."+Qi[r.path],t.array,d,u);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(y),a.push(y)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let n=ed(t.constructor),i=new Float32Array(t.length);for(let r=0,a=t.length;r<a;r++)i[r]=t[r]*n;t=i}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){let i=this instanceof ni?ju:lc;return new i(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function iM(s,e,t){let n=e.attributes,i=new $t;if(n.POSITION!==void 0){let o=t.json.accessors[n.POSITION],l=o.min,c=o.max;if(l!==void 0&&c!==void 0){if(i.set(new N(l[0],l[1],l[2]),new N(c[0],c[1],c[2])),o.normalized){let h=ed(Rr[o.componentType]);i.min.multiplyScalar(h),i.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let r=e.targets;if(r!==void 0){let o=new N,l=new N;for(let c=0,h=r.length;c<h;c++){let u=r[c];if(u.POSITION!==void 0){let d=t.json.accessors[u.POSITION],f=d.min,m=d.max;if(f!==void 0&&m!==void 0){if(l.setX(Math.max(Math.abs(f[0]),Math.abs(m[0]))),l.setY(Math.max(Math.abs(f[1]),Math.abs(m[1]))),l.setZ(Math.max(Math.abs(f[2]),Math.abs(m[2]))),d.normalized){let y=ed(Rr[d.componentType]);l.multiplyScalar(y)}o.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(o)}s.boundingBox=i;let a=new dn;i.getCenter(a.center),a.radius=i.min.distanceTo(i.max)/2,s.boundingSphere=a}function Wp(s,e,t){let n=e.attributes,i=[];function r(a,o){return t.getDependency("accessor",a).then(function(l){s.setAttribute(o,l)})}for(let a in n){let o=Qu[a]||a.toLowerCase();o in s.attributes||i.push(r(n[a],o))}if(e.indices!==void 0&&!s.index){let a=t.getDependency("accessor",e.indices).then(function(o){s.setIndex(o)});i.push(a)}return it.workingColorSpace!==Zt&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${it.workingColorSpace}" not supported.`),li(s,e),iM(s,e,t),Promise.all(i).then(function(){return e.targets!==void 0?jy(s,e.targets,t):s})}var Ir=class extends Ea{constructor(e){super(e),this.type=ln}parse(e){let a=function(x,w){switch(x){case 1:throw new Error("THREE.HDRLoader: Read Error: "+(w||""));case 2:throw new Error("THREE.HDRLoader: Write Error: "+(w||""));case 3:throw new Error("THREE.HDRLoader: Bad File Format: "+(w||""));default:case 4:throw new Error("THREE.HDRLoader: Memory Error: "+(w||""))}},u=function(x,w,L){w=w||1024;let B=x.pos,F=-1,R=0,k="",W=String.fromCharCode.apply(null,new Uint16Array(x.subarray(B,B+128)));for(;0>(F=W.indexOf(`
`))&&R<w&&B<x.byteLength;)k+=W,R+=W.length,B+=128,W=String.fromCharCode.apply(null,new Uint16Array(x.subarray(B,B+128)));return-1<F?(L!==!1&&(x.pos+=R+F+1),k+W.slice(0,F)):!1},d=function(x){let w=/^#\?(\S+)/,L=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,I=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,B=/^\s*FORMAT=(\S+)\s*$/,F=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,R={valid:0,string:"",comments:"",programtype:"RGBE",format:"",gamma:1,exposure:1,width:0,height:0},k,W;for((x.pos>=x.byteLength||!(k=u(x)))&&a(1,"no header found"),(W=k.match(w))||a(3,"bad initial token"),R.valid|=1,R.programtype=W[1],R.string+=k+`
`;k=u(x),k!==!1;){if(R.string+=k+`
`,k.charAt(0)==="#"){R.comments+=k+`
`;continue}if((W=k.match(L))&&(R.gamma=parseFloat(W[1])),(W=k.match(I))&&(R.exposure=parseFloat(W[1])),(W=k.match(B))&&(R.valid|=2,R.format=W[1]),(W=k.match(F))&&(R.valid|=4,R.height=parseInt(W[1],10),R.width=parseInt(W[2],10)),R.valid&2&&R.valid&4)break}return R.valid&2||a(3,"missing format specifier"),R.valid&4||a(3,"missing image size specifier"),R},f=function(x,w,L){let I=w;if(I<8||I>32767||x[0]!==2||x[1]!==2||x[2]&128)return new Uint8Array(x);I!==(x[2]<<8|x[3])&&a(3,"wrong scanline width");let B=new Uint8Array(4*w*L);B.length||a(4,"unable to allocate buffer space");let F=0,R=0,k=4*I,W=new Uint8Array(4),Y=new Uint8Array(k),re=L;for(;re>0&&R<x.byteLength;){R+4>x.byteLength&&a(1),W[0]=x[R++],W[1]=x[R++],W[2]=x[R++],W[3]=x[R++],(W[0]!=2||W[1]!=2||(W[2]<<8|W[3])!=I)&&a(3,"bad rgbe scanline format");let K=0,Q;for(;K<k&&R<x.byteLength;){Q=x[R++];let ue=Q>128;if(ue&&(Q-=128),(Q===0||K+Q>k)&&a(3,"bad scanline data"),ue){let we=x[R++];for(let Ge=0;Ge<Q;Ge++)Y[K++]=we}else Y.set(x.subarray(R,R+Q),K),K+=Q,R+=Q}let se=I;for(let ue=0;ue<se;ue++){let we=0;B[F]=Y[ue+we],we+=I,B[F+1]=Y[ue+we],we+=I,B[F+2]=Y[ue+we],we+=I,B[F+3]=Y[ue+we],F+=4}re--}return B},m=function(x,w,L,I){let B=x[w+3],F=Math.pow(2,B-128)/255;L[I+0]=x[w+0]*F,L[I+1]=x[w+1]*F,L[I+2]=x[w+2]*F,L[I+3]=1},y=function(x,w,L,I){let B=x[w+3],F=Math.pow(2,B-128)/255;L[I+0]=Gi.toHalfFloat(Math.min(x[w+0]*F,65504)),L[I+1]=Gi.toHalfFloat(Math.min(x[w+1]*F,65504)),L[I+2]=Gi.toHalfFloat(Math.min(x[w+2]*F,65504)),L[I+3]=Gi.toHalfFloat(1)},g=new Uint8Array(e);g.pos=0;let p=d(g),S=p.width,E=p.height,M=f(g.subarray(g.pos),S,E),b,T,C;switch(this.type){case Kt:C=M.length/4;let x=new Float32Array(C*4);for(let L=0;L<C;L++)m(M,L*4,x,L*4);b=x,T=Kt;break;case ln:C=M.length/4;let w=new Uint16Array(C*4);for(let L=0;L<C;L++)y(M,L*4,w,L*4);b=w,T=ln;break;default:throw new Error("THREE.HDRLoader: Unsupported type: "+this.type)}return{width:S,height:E,data:b,header:p.string,gamma:p.gamma,exposure:p.exposure,type:T,colorSpace:Zt,minFilter:bt,magFilter:bt,generateMipmaps:!1,flipY:!0}}setDataType(e){return this.type=e,this}};var sM=Math.PI*2,qp=.08;function rM(s,e,t){if(t<=0)return s/e;let n=e*qp,i=(e-n)/t,r=e*i-t*i*i/2;return s>=r?i+(s-r)/n:2*s/(e+Math.sqrt(e*e-2*t*s))}function ci(s,e,t){return Math.sqrt(e*e+Math.max(0,s)*t/Math.PI)}function cc(s,e,t,n,i,r){let a=-e-n;if(a<=0)return[s,e,t];let o=r/sM,l=rM(a,i,o),c=Math.max(i-o*l,i*qp)-t;return[s,-(n+c*Math.sin(l)),i-c*Math.cos(l)]}var Yp=Object.freeze({id:"manuscript-memento-v14",width:4.5,height:6.3,coreRadius:.145,layerThickness:.035,fontFamily:"Aboensis",fontUrl:"../chapter-scroll/assets/Aboensis-Regular.otf",skin:"assets/parchment.webp",reverse:"assets/parchment.webp",keeper:"assets/unused-keeper.png",paperNormal:"assets/parchment-normal.jpg",paperRoughness:"assets/parchment-roughness.jpg",environment:"../chapter-scroll-v3/assets/studio.hdr",ornament:"../chapter-scroll-v13/assets/leaf-and-letter.png",ornamentDigest:"e5aa04af52dde8cc3f32d0d9dfac3fe1696ef6d275c0514d7e0c0065f517d9c5",planDigest:"3104ec4b67859f64268c11a327f37a65d1bdfc48c6f75adc24ee702d3f6318fb",ink:"#30251b",rubric:"#58372d"});function As(s){if(s!==Yp.id)throw Error("Unknown scroll series");return Yp}var Kp=6,Rs=3.52,hc=Rt.clamp,nd=s=>(s=hc(s,0,1),s*s*(3-2*s)),Zp=s=>new URL(`./assets/${s}`,import.meta.url).href,qn=(s,e,t)=>new N(s,e,t),aM=new He("#81704a");function oM(s,e,t,n=.018){let i=Math.min(n,s*.2,e*.2,t*.2),r=new fs;r.moveTo(-s/2+i,-e/2),r.lineTo(s/2-i,-e/2),r.quadraticCurveTo(s/2,-e/2,s/2,-e/2+i),r.lineTo(s/2,e/2-i),r.quadraticCurveTo(s/2,e/2,s/2-i,e/2),r.lineTo(-s/2+i,e/2),r.quadraticCurveTo(-s/2,e/2,-s/2,e/2-i),r.lineTo(-s/2,-e/2+i),r.quadraticCurveTo(-s/2,-e/2,-s/2+i,-e/2);let a=new fr(r,{depth:t-2*i,bevelEnabled:!0,bevelThickness:i,bevelSize:i*.42,bevelSegments:2,curveSegments:2,steps:1});return a.translate(0,0,-t/2+i),a}function lM(s,e,t,n,i){let r=new fs,a=10;for(let l=0;l<=a;l++){let c=t+(n-t)*l/a,h=Math.cos(c)*e,u=Math.sin(c)*e;l?r.lineTo(h,u):r.moveTo(h,u)}for(let l=a;l>=0;l--){let c=t+(n-t)*l/a;r.lineTo(Math.cos(c)*s,Math.sin(c)*s)}r.closePath();let o=new fr(r,{depth:i,bevelEnabled:!0,bevelThickness:.006,bevelSize:.005,bevelSegments:1,steps:1});return o.translate(0,0,-i/2),o}function cM(s,e,t){let n=document.createElement("canvas");n.width=s,n.height=e,t(n.getContext("2d"),s,e);let i=new ei(n);return i.colorSpace=gt,i}function hM(s,e=""){return cM(1024,160,(t,n,i)=>{t.clearRect(0,0,n,i),t.fillStyle="#cfbc91",t.textAlign="center",t.textBaseline="middle",t.font='500 51px Georgia, "Times New Roman", serif',t.fillText(s,n/2,e?58:80,n-42),e&&(t.fillStyle="#aa9776",t.font="26px Georgia, serif",t.fillText(e,n/2,118,n-40))})}var uc=class{constructor(e,{onSelect:t=()=>{},onStatus:n=()=>{}}={}){this.canvas=e,this.onSelect=t,this.onStatus=n,this.items=[],this.proxies=new Map,this.bays=new Map,this.maps=[],this.materials=[],this.geometries=[],this.hitTargets=[],this.width=1,this.height=1,this.time=0,this.cabinet=0,this.selected=null,this.stage="browse",this.stageProgress=0,this.disposed=!1,this.dirty=!0,this.renderer=new Er({canvas:e,antialias:!0,alpha:!1,powerPreference:"low-power",preserveDrawingBuffer:!0}),this.renderer.setPixelRatio(1),this.renderer.outputColorSpace=gt,this.renderer.toneMapping=Ms,this.renderer.toneMappingExposure=1.22,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=gr,this.renderer.shadowMap.autoUpdate=!1,this.scene=new hs,this.scene.background=new He("#171814"),this.scene.fog=new na("#25231b",16,36),this.camera=new Ct(34,1,.08,65),this.camera.position.set(0,2.35,9),this.cameraTarget=qn(0,1.88,0),this.camera.lookAt(this.cameraTarget),this.cameraGoal=this.camera.position.clone(),this.targetGoal=this.cameraTarget.clone(),this.raycaster=new Ia,this.pointer=new fe,this.onDown=i=>{this.stage==="browse"&&(this.drag={id:i.pointerId,x:i.clientX,y:i.clientY})},this.onUp=i=>{let r=this.drag;if(this.drag=null,!r||r.id!==i.pointerId||this.stage!=="browse")return;let a=i.clientX-r.x,o=i.clientY-r.y;if(Math.abs(a)>52&&Math.abs(a)>Math.abs(o)*1.3){this.navigateCabinet(a<0?1:-1);return}if(Math.hypot(a,o)>12)return;let l=e.getBoundingClientRect();this.pointer.set((i.clientX-l.left)/l.width*2-1,1-(i.clientY-l.top)/l.height*2),this.raycaster.setFromCamera(this.pointer,this.camera);let c=this.raycaster.intersectObjects(this.hitTargets,!1)[0];if(c){let h=c.object.userData.itemId;this.focus(h),this.onSelect(h)}},this.onCancel=()=>{this.drag=null},e.addEventListener("pointerdown",this.onDown),e.addEventListener("pointerup",this.onUp),e.addEventListener("pointercancel",this.onCancel)}mesh(e,t,n=this.scene){let i=new pt(e,t);return i.castShadow=!0,i.receiveShadow=!0,n.add(i),this.geometries.push(e),i}mat(e){let t=new Vn(e);return this.materials.push(t),t}block(e,t,n,i,r,a,o,l,c=.012){let h=this.mesh(oM(t,n,i,c),l,e);return h.position.set(r,a,o),h}batchStatic(e){e.updateMatrixWorld(!0);let t=e.matrixWorld.clone().invert(),n=new Map,i=new Set;e.traverse(r=>{if(!r.isMesh||!r.material||Array.isArray(r.material)||r.material.transparent||r.material.visible===!1)return;for(let c=r;c&&c!==e;c=c.parent)if(c.userData.dynamic)return;let a=r.geometry.index?r.geometry.toNonIndexed():r.geometry.clone();a.applyMatrix4(t.clone().multiply(r.matrixWorld));let o=r.material,l=n.get(o);l||(l={geometry:[],objects:[]},n.set(o,l)),l.geometry.push(a),l.objects.push(r)});for(let[r,a]of n){if(a.objects.length<2){for(let l of a.geometry)l.dispose();continue}let o=Bp(a.geometry,!1);for(let l of a.geometry)l.dispose();if(o){for(let l of a.objects)l.removeFromParent(),i.add(l.geometry),l.geometry.dispose();this.mesh(o,r,e).name="static-joinery-batch"}}this.geometries=this.geometries.filter(r=>!i.has(r))}async prepare(e){if(this.ready)throw Error("MuseumScene already prepared");this.items=e.filter(u=>u&&u.id&&Number.isInteger(u.chapterNumber)&&u.chapterNumber>0).map(u=>({...u})),this.onStatus("Preparing the cabinet and its materials\u2026");let t=new Hn,n=async(u,d=!1)=>{let f=await t.loadAsync(Zp(u));return f.wrapS=f.wrapT=Cn,f.anisotropy=Math.min(6,this.renderer.capabilities.getMaxAnisotropy()),d&&(f.colorSpace=gt),this.maps.push(f),f},[i,r,a,o,l,c]=await Promise.all([n("scene-wood-color.jpg",!0),n("scene-wood-normal.jpg"),n("scene-wood-roughness.jpg"),n("scene-stone-color.jpg",!0),n("scene-stone-normal.jpg"),n("scene-stone-roughness.jpg")]);this.wood=this.mat({map:i,normalMap:r,normalScale:new fe(.12,.12),roughnessMap:a,roughness:.86,color:"#968d76"}),this.woodDark=this.wood.clone(),this.woodDark.color.set("#5b5748"),this.materials.push(this.woodDark),this.woodEdge=this.wood.clone(),this.woodEdge.color.set("#b5aa8c"),this.woodEdge.roughness=.67,this.materials.push(this.woodEdge),this.stone=this.mat({map:o,normalMap:l,normalScale:new fe(.18,.18),roughnessMap:c,roughness:.98,color:"#8f907e"}),this.cutStone=this.stone.clone(),this.cutStone.color.set("#a5a38c"),this.materials.push(this.cutStone),this.dark=this.mat({color:"#1c1913",roughness:1}),this.bronze=this.mat({color:aM,roughness:.67,metalness:.78}),this.leather=this.mat({map:i,normalMap:r,normalScale:new fe(.13,.13),color:"#442a19",roughness:.94}),this.paperTexture=await t.loadAsync(new URL("../chapter-scroll-v14/assets/parchment.webp",import.meta.url).href),this.paperTexture.colorSpace=gt,this.paperTexture.offset.set(.13,.13),this.paperTexture.repeat.set(.74,.74),this.maps.push(this.paperTexture),this.addLighting(),this.buildArchitecture(),this.batchStatic(this.scene);let h=this.items.map(u=>Math.floor((u.chapterNumber-1)/Kp));return this.maxCabinet=Math.max(0,...h),this.buildVisibleCabinets(),await Promise.all([this.loadTable(),this.loadEnvironment()]),this.addDust(),this.ready=!0,this.resize(this.width,this.height),this.applyCamera(!0),this.scene.updateMatrixWorld(!0),await this.renderer.compileAsync(this.scene,this.camera),this.renderer.shadowMap.needsUpdate=!0,this.render(),this.onStatus("Specimen collection \xB7 no formal scrolls issued"),this}addLighting(){this.scene.add(new xs("#d8dfd6","#24170d",1.5));let e=new In("#fff4e5",3);e.position.set(-4.8,7,5.5),e.castShadow=!0,e.shadow.mapSize.set(2048,2048),Object.assign(e.shadow.camera,{left:-6,right:6,top:7,bottom:-2,near:.1,far:23}),e.shadow.normalBias=.018,e.shadow.bias=-15e-5,this.scene.add(e),this.key=e;let t=new _s("#e8b66a",18,9,2);t.position.set(2.4,3.1,2.3),this.scene.add(t);let n=new In("#94a9b1",.85);n.position.set(3.5,4,-3),this.scene.add(n)}buildArchitecture(){let e=this.stone.clone();this.materials.push(e);for(let u of["map","normalMap","roughnessMap"])e[u]=e[u].clone(),e[u].repeat.set(16,13),e[u].needsUpdate=!0,this.maps.push(e[u]);e.color.set("#808578");let t=this.mesh(new Yt(28,22),e);t.rotation.x=-Math.PI/2,t.position.set(0,-.03,0);for(let u=0;u<5;u++)for(let d=-7;d<=7;d++){let f=d*1.18+u%2*.59,m=.5+u*.92,y=this.block(this.scene,1.16,.9,.19,f,m,-.83,this.stone,.008);y.rotation.z=Math.sin(d*17+u*3)*.0018}for(let u of[-5.2,-1.94,1.94,5.2]){let d=this.block(this.scene,.22,3.45,.45,u,1.72,-.16,this.cutStone,.016);this.block(this.scene,.34,.15,.56,u,.1,-.11,this.cutStone,.015),this.block(this.scene,.35,.15,.55,u,3.43,-.12,this.cutStone,.012);for(let f=0;f<11;f++){let m=f*Math.PI/11+.008,y=(f+1)*Math.PI/11-.008;this.mesh(lM(1.43,1.62,m,y,.32),this.cutStone).position.set(u+1.63,3.45,-.16)}}let n=new It;n.position.set(-3.25,2.6,-.52),this.scene.add(n);let i=this.mat({color:"#8faaa8",emissive:"#667b77",emissiveIntensity:.7,roughness:.91}),r=this.mesh(new Yt(.85,1.85),i,n);r.position.z=-.16;for(let u of[-.46,.46])this.block(n,.14,2.03,.26,u,0,0,this.cutStone);for(let u of[-1,1])this.block(n,1.02,.13,.3,0,u,.01,this.cutStone);for(let u of[-.28,0,.28])this.block(n,.018,1.85,.025,u,0,.01,this.bronze,.003);for(let u of[-.6,0,.6])this.block(n,.85,.018,.025,0,u,.01,this.bronze,.003);let a=new It;a.position.set(2.13,2.8,.08),this.scene.add(a),this.block(a,.13,.36,.045,0,0,0,this.bronze,.01),this.block(a,.04,.04,.35,0,-.04,.17,this.bronze,.009),this.mesh(new Yi(.09,.055,.09,12),this.bronze,a).position.set(0,-.015,.31);let l=this.mat({color:"#c3af7b",roughness:.95});this.mesh(new Yi(.031,.039,.18,12),l,a).position.set(0,.11,.31);let h=this.mesh(new Sa(.027,10,6),new Vt({color:"#e8ba75"}),a);h.scale.y=1.8,h.position.set(0,.22,.31)}cabinetLabel(e,t,n,i,r){let a=new Vt({map:hM(e),transparent:!0,depthWrite:!1,toneMapped:!1});a.userData.bayOwned=!0,this.maps.push(a.map),this.materials.push(a);let o=this.mesh(new Yt(1.15,.18),a,r);return o.position.set(t,n,i),o.castShadow=!1,o}buildVisibleCabinets(){let e=new Set([this.cabinet-1,this.cabinet,this.cabinet+1].filter(t=>t>=0&&t<=Math.max(this.maxCabinet,1)));for(let[t,n]of this.bays)if(!e.has(t)){this.scene.remove(n),this.bays.delete(t);for(let[o,l]of this.proxies)l.userData.cabinet===t&&(this.proxies.delete(o),this.hitTargets=this.hitTargets.filter(c=>c.userData.itemId!==o));let i=new Set,r=new Set,a=new Set;n.traverse(o=>{o.geometry&&i.add(o.geometry);for(let l of o.material?Array.isArray(o.material)?o.material:[o.material]:[])l.userData.bayOwned&&(r.add(l),l.map&&l.map!==this.paperTexture&&a.add(l.map))});for(let o of i)o.dispose();for(let o of r)o.dispose();for(let o of a)o.dispose();this.geometries=this.geometries.filter(o=>!i.has(o)),this.materials=this.materials.filter(o=>!r.has(o)),this.maps=this.maps.filter(o=>!a.has(o))}for(let t of e)this.bays.has(t)||this.buildCabinet(t)}buildCabinet(e){let t=new It;t.position.x=e*Rs,t.name=`chapter-cabinet-${e+1}`,this.bays.set(e,t),this.scene.add(t),this.block(t,2.94,2.78,.13,0,1.91,-.39,this.woodDark);for(let i=0;i<6;i++)this.block(t,.47,2.7,.025,-1.18+i*.47,1.94,-.305,i%2?this.woodDark:this.wood,.004);for(let i of[-1.49,1.49]){this.block(t,.17,2.93,.56,i,1.96,-.06,this.wood),this.block(t,.055,2.83,.07,i,1.98,.25,this.woodEdge,.01),this.block(t,.23,.15,.64,i,.48,-.01,this.woodEdge);for(let r=0;r<3;r++)this.block(t,.036,2.5,.018,i+(r-1)*.045,1.99,.291,this.woodDark,.004)}this.block(t,3.16,.16,.66,0,3.43,-.03,this.woodEdge),this.block(t,3.3,.09,.72,0,3.55,-.04,this.wood,.01),this.block(t,3.12,.08,.63,0,3.29,-.01,this.woodDark,.012),this.block(t,3.13,.24,.65,0,.36,-.01,this.wood),this.block(t,3.23,.09,.71,0,.21,.01,this.woodEdge);for(let i of[-1.3,1.3])this.block(t,.22,.22,.49,i,.1,.01,this.woodDark);this.block(t,.1,2.69,.48,0,1.94,-.05,this.wood);for(let i of[.63,1.49,2.35,3.21])this.block(t,2.9,.095,.62,0,i,-.02,this.wood),this.block(t,2.98,.038,.055,0,i-.014,.302,this.woodEdge,.006),this.block(t,2.95,.016,.025,0,i+.025,.338,this.woodDark,.004);for(let i of[-1.1,-.55,0,.55,1.1]){this.block(t,.44,.14,.024,i,.36,.33,this.woodDark,.007);for(let r of[-.1,.1])this.block(t,.018,.115,.026,i+r,.36,.35,this.woodEdge,.004)}this.block(t,1.51,.13,.028,0,3.43,.313,this.dark,.006),this.cabinetLabel(`CHAPTERS ${String(e*6+1).padStart(2,"0")} \u2014 ${String(e*6+6).padStart(2,"0")}`,0,3.43,.334,t);let n=this.items.filter(i=>Math.floor((i.chapterNumber-1)/6)===e);for(let i=0;i<3;i++)for(let r=0;r<2;r++){let a=e*6+i*2+r+1,o=r?.76:-.76,l=2.57-i*.86,c=n.find(f=>f.chapterNumber===a);if(!c)for(let f of[-.45,.45])this.block(t,.075,.045,.35,o+f,l-.15,.04,this.woodDark,.009);if(!c)continue;let h=this.closedScroll(c);h.position.set(o,l-(.125-h.userData.rollRadius),.03),h.userData.home=h.position.clone(),h.userData.cabinet=e,h.userData.item=c,t.add(h),this.proxies.set(c.id,h),this.block(t,1.24,.135,.023,o,l-.24,.337,this.dark,.009),this.cabinetLabel(`CHAPTER ${String(a).padStart(2,"0")} \xB7 SPECIMEN`,o,l-.24,.355,t).scale.set(.91,.74,1);let u=new Vt({visible:!1});u.userData.bayOwned=!0,this.materials.push(u);let d=this.mesh(new qi(1.36,.62,.55),u,t);d.position.set(o,l,.09),d.userData.itemId=c.id,this.hitTargets.push(d)}this.batchStatic(t)}closedScroll(e){let t=new It;t.name=`specimen-proxy-${e.id}`,t.userData.dynamic=!0;let n=this.mat({map:this.paperTexture,color:"#e3d7bf",roughness:.97,metalness:0});n.userData.bayOwned=!0;let i=1.15,r=As("manuscript-memento-v14"),a=ci(r.height,r.coreRadius,r.layerThickness)*i/r.width,o=a/.125;t.userData.rollRadius=a;let l=this.mesh(new Yi(a,a*.99,i,48,1,!0),n,t);l.rotation.z=Math.PI/2;let c=this.mat({color:"#b8a078",roughness:1});c.userData.bayOwned=!0;for(let m of[-1,1]){let y=this.mesh(new Ma(a*.216,a*.98,56),n,t);y.rotation.y=m*Math.PI/2,y.position.x=m*i/2;for(let p=0;p<8;p++){let S=this.mesh(new ba(a*(.24+p*.1),a*.0136,4,48),c,t);S.rotation.y=Math.PI/2,S.position.x=m*(i/2+.001+p*12e-5)}let g=this.mesh(new da(a*.208,32),this.dark,t);g.rotation.y=m*Math.PI/2,g.position.x=m*(i/2-.004)}let h=this.mesh(new Yi(a+.009*o,a+.009*o,.22978254735617945*i/r.width,48,1,!0),this.leather,t);h.rotation.z=Math.PI/2;let u=new It;u.position.set(0,.018*o,a+.015*o),t.add(u);for(let m of[-.04,.04])this.block(u,.011,.11*o,.016,m,0,0,this.bronze,.004);for(let m of[-.049,.049])this.block(u,.073,.011,.016,0,m*o,0,this.bronze,.004);this.block(u,.008,.075*o,.012,0,-.009*o,.012,this.bronze,.003);let d=this.block(t,.055,.14*o,.011,0,-.06*o,a+.029*o,this.leather,.005);d.rotation.x=-.04,this.batchStatic(t),t.userData.bodyMeshes=t.children.filter(m=>m.isMesh);let f=new It;f.name="removable-manuscript-support",t.add(f),t.userData.carrier=f,this.block(f,1.29,.035,.39,0,-a-.028,0,this.wood,.009);for(let m of[-.49,.49])this.block(f,.08,.012,.3,m,-a-.0065,0,this.leather,.002);for(let m of[-.19,.19])this.block(f,1.29,.045,.02,0,-a-.012,m,this.woodEdge,.006);return this.batchStatic(f),t.userData.rollBounds=new $t(qn(-i/2-.02,-a-.015,-a-.015),qn(i/2+.02,a+.015,a+.045)),t}async loadTable(){try{let t=(await new Cr().loadAsync(Zp("scene-table/WoodenTable_01_1k.gltf"))).scene;t.updateMatrixWorld(!0);let n=new $t().setFromObject(t),i=n.getSize(new N),r=n.getCenter(new N),a=new It;t.position.sub(r),a.add(t),a.scale.setScalar(2.5/i.x),a.position.set(0,.3,2.35),a.rotation.y=.025,t.traverse(l=>{if(l.isMesh){l.castShadow=!0,l.receiveShadow=!0;for(let c of Array.isArray(l.material)?l.material:[l.material]){c.roughness=Math.max(.8,c.roughness||0),this.materials.push(c);for(let h of["map","normalMap","roughnessMap","metalnessMap","aoMap"])c[h]&&this.maps.push(c[h])}this.geometries.push(l.geometry)}}),this.scene.add(a),a.updateMatrixWorld(!0);let o=new $t().setFromObject(a);a.position.y-=o.min.y,this.table=a,this.tableTop=o.max.y-o.min.y}catch(e){this.tableError=String(e),this.onStatus("The scanned table is unavailable; cabinet view remains available.")}}async loadEnvironment(){try{let e=await new Ir().loadAsync(new URL("../chapter-scroll-v3/assets/studio.hdr",import.meta.url).href),t=new ji(this.renderer);this.environment=t.fromEquirectangular(e),this.scene.environment=this.environment.texture,this.scene.environmentIntensity=.2,e.dispose(),t.dispose()}catch(e){this.environmentError=String(e)}}addDust(){let t=new Float32Array(270);for(let r=0;r<90;r++)t.set([Math.sin(r*32.17)*5,1+(Math.sin(r*9.72)+1)*1.9,Math.cos(r*9.1)*3],r*3);let n=new Tt;n.setAttribute("position",new Et(t,3)),this.geometries.push(n);let i=new Wi({color:"#c1ad7b",size:.013,transparent:!0,opacity:.17,depthWrite:!1,sizeAttenuation:!0});this.materials.push(i),this.dust=new ds(n,i),this.scene.add(this.dust)}resize(e,t){if(!e||!t)return;this.width=e,this.height=t;let n=Math.min(window.devicePixelRatio||1,2),i=25e5,r=Math.min(n,Math.sqrt(i/(e*t)));this.renderer.setSize(Math.max(1,Math.floor(e*r)),Math.max(1,Math.floor(t*r)),!1),this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.applyCamera(!0),this.dirty=!0}browseCamera(){let e=this.width/this.height,t=Math.max(5.65,3.52/(2*Math.tan(Rt.degToRad(17))*e));return{position:qn(this.cabinet*Rs+.7,2.62,t),target:qn(this.cabinet*Rs,1.84,0)}}applyCamera(e=!1){let t=this.browseCamera(),n=this.stage==="browse"?0:nd(this.stageProgress),i=this.proxies.get(this.selected),r=i?i.userData.home.clone().add(qn(i.userData.cabinet*Rs,0,0)):qn(this.cabinet*Rs,1.8,0),a=qn(this.cabinet*Rs,(this.tableTop||.8)+(i?.userData.rollRadius||.125)+.047,2.16),o=1.22/(.885*2*Math.tan(Rt.degToRad(17))*Math.max(.35,this.width/this.height)),l=a.clone().add(qn(.02,.12,Math.max(2.6,o))),c=a.clone();if(this.cameraGoal.copy(t.position).lerp(l,n),this.targetGoal.copy(t.target).lerp(c,n),i){let h=r.clone();h.z=.69;let u=nd(n/.35),d=nd((n-.35)/.65),f=n<.35?r.clone().lerp(h,u):h.clone().lerp(a,d);n>.35&&(f.y+=Math.sin(d*Math.PI)*.055),i.position.copy(f).sub(qn(i.userData.cabinet*Rs,0,0)),i.rotation.set(0,n*.035,0)}e&&(this.camera.position.copy(this.cameraGoal),this.cameraTarget.copy(this.targetGoal),this.camera.lookAt(this.cameraTarget)),this.renderer.shadowMap.needsUpdate=!0,this.dirty=!0}focus(e){let t=this.items.find(n=>n.id===e);return t?(this.cabinet=Math.floor((t.chapterNumber-1)/Kp),this.buildVisibleCabinets(),this.setSelected(e),this.applyCamera(!1),!0):!1}setSelected(e){if(this.selected&&this.proxies.has(this.selected)){let t=this.proxies.get(this.selected);t.position.copy(t.userData.home),t.rotation.set(0,0,0),t.visible=!0;for(let n of t.userData.bodyMeshes||[])n.visible=!0}this.selected=this.proxies.has(e)?e:null,this.dirty=!0}setStage(e,t=0){if(!["browse","retrieve","inspect","return"].includes(e))throw Error("Unknown museum stage");this.stage=e,this.stageProgress=e==="browse"?0:e==="inspect"?1:e==="return"?1-hc(t,0,1):hc(t,0,1),this.applyCamera(!0)}setProxyVisible(e){let t=this.proxies.get(this.selected);if(t){for(let n of t.userData.bodyMeshes||[])n.visible=!!e;this.dirty=!0}}getTransferPose(){let e=this.proxies.get(this.selected);if(!e)return null;this.scene.updateMatrixWorld(!0),this.camera.updateMatrixWorld(!0);let t=e.userData.rollBounds,n=[];for(let h of[t.min.x,t.max.x])for(let u of[t.min.y,t.max.y])for(let d of[t.min.z,t.max.z])n.push(qn(h,u,d).applyMatrix4(e.matrixWorld).project(this.camera));let i=n.map(h=>(h.x*.5+.5)*this.width),r=n.map(h=>(.5-h.y*.5)*this.height),a=Math.min(...i),o=Math.max(...i),l=Math.min(...r),c=Math.max(...r);return{units:"css-pixels",x:(a+o)/2,y:(l+c)/2,width:o-a,height:c-l,left:a,top:l,canvasWidth:this.width,canvasHeight:this.height,axis:"horizontal",id:this.selected}}transferPose(){return this.getTransferPose()}navigateCabinet(e){if(this.stage!=="browse")return!1;let t=hc(this.cabinet+Math.sign(e),0,this.maxCabinet);if(t===this.cabinet)return!1;this.cabinet=t,this.setSelected(null),this.buildVisibleCabinets(),this.applyCamera(!1);let n=`\u7B2C ${t+1} \u67DC \xB7 \u7B2C ${t*6+1}\u2014${t*6+6} \u7AE0`;return this.onStatus(n),{moved:!0,cabinet:t+1,label:n}}update(e){if(!this.ready||this.disposed)return!1;this.time+=Math.min(.05,e||0);let t=1-Math.exp(-Math.min(.1,e||0)*7);return this.camera.position.distanceToSquared(this.cameraGoal)+this.cameraTarget.distanceToSquared(this.targetGoal)>1e-6&&(this.camera.position.lerp(this.cameraGoal,t),this.cameraTarget.lerp(this.targetGoal,t),this.camera.lookAt(this.cameraTarget),this.dirty=!0),this.dust&&(this.dust.rotation.y=Math.sin(this.time*.021)*.014,this.dust.position.y=Math.sin(this.time*.11)*.025,this.dirty=!0),this.dirty}render(){this.disposed||(this.renderer.render(this.scene,this.camera),this.dirty=!1)}snapshot(){return{ready:!!this.ready,stage:this.stage,stageProgress:this.stageProgress,selected:this.selected,cabinet:this.cabinet+1,range:[this.cabinet*6+1,this.cabinet*6+6],specimens:this.items.map(e=>({id:e.id,chapterNumber:e.chapterNumber,issued:!1})),visibleCabinets:this.bays.size,proxyCount:this.proxies.size,transfer:this.getTransferPose(),table:"Poly Haven WoodenTable_01, CC0",tableError:this.tableError||null,environmentAvailable:!!this.scene.environment,environmentError:this.environmentError||null,resources:"scene-sources.json",drawBuffer:{width:this.canvas.width,height:this.canvas.height},render:this.renderer.info.render,notes:"Cabinet furniture and distant closed proxies are new study geometry. Full v20 paper/keeper animation belongs to the separate object viewer."}}dispose(){if(!this.disposed){this.disposed=!0;for(let[e,t]of[["pointerdown",this.onDown],["pointerup",this.onUp],["pointercancel",this.onCancel]])this.canvas.removeEventListener(e,t);for(let e of new Set(this.geometries))e.dispose();for(let e of new Set(this.materials))e.dispose();for(let e of new Set(this.maps))e.dispose();this.environment?.dispose(),this.renderer.dispose()}}};var id=s=>(s=Rt.clamp(s,0,1),s*s*(3-2*s)),dc=class{constructor(e,t,n,i){this.template=i,this.width=i.width,this.height=i.height,this.progress=0,this.renderCount=0,this.paperProgress=0,this.renderer=new Er({canvas:e,antialias:!0,alpha:!0,preserveDrawingBuffer:!0,powerPreference:"low-power"});let r=this.renderer;r.setPixelRatio(Math.min(devicePixelRatio,2)),r.setClearColor(0,0),r.outputColorSpace=gt,r.toneMapping=Ms,r.toneMappingExposure=1.08,r.shadowMap.enabled=!0,r.shadowMap.type=vs,this.scene=new hs,this.camera=new ii(-4,4,4,-4,.1,30),this.camera.position.set(0,0,12),this.camera.lookAt(0,0,0),this.scene.add(new xs(15851452,4935767,1.1));let a=new In(16769978,2.8);a.position.set(-3,4,6),a.castShadow=!0,a.shadow.mapSize.set(1024,1024),Object.assign(a.shadow.camera,{left:-4,right:4,top:5,bottom:-5,near:.1,far:20}),a.shadow.normalBias=.015,this.scene.add(a);let o=new In(12175825,.9);o.position.set(4,0,4),this.scene.add(o);let l=new In(16043907,.7);l.position.set(-3,-2,-1),this.scene.add(l),this.maps=[new ei(t.front),new ei(t.back),new Nt(n)];for(let d of this.maps)d.needsUpdate=!0,d.colorSpace=gt,d.anisotropy=Math.min(8,r.capabilities.getMaxAnisotropy());let[c,h,u]=this.maps;this.geometry=new Yt(this.width,this.height,40,300),this.geometry.attributes.position.setUsage(su),this.base=new Float32Array(this.geometry.attributes.position.array),this.material=new tn({map:c,roughness:.84,metalness:0,side:Gt,alphaTest:.55,bumpMap:h,bumpScale:.009,sheen:.16,sheenRoughness:.9,sheenColor:15782049}),this.material.onBeforeCompile=d=>{d.uniforms.backPaper={value:h},d.fragmentShader=`uniform sampler2D backPaper;
`+d.fragmentShader,d.fragmentShader=d.fragmentShader.replace("#include <map_fragment>",`#ifdef USE_MAP
    vec4 sheetColor=gl_FrontFacing?texture2D(map,vMapUv):texture2D(backPaper,vMapUv);
    diffuseColor*=sheetColor;
    #endif`)},this.material.customProgramCacheKey=()=>"vellum-front-reverse-v3",this.sheet=new pt(this.geometry,this.material),this.sheet.castShadow=!0,this.sheet.receiveShadow=!0,this.scene.add(this.sheet),this.keeper=new pt(new Yt(.53,.99),new Vt({map:u,transparent:!0,depthWrite:!1,toneMapped:!1})),this.keeper.renderOrder=5,this.scene.add(this.keeper),this.environmentReady=new Ir().loadAsync(i.environment).then(d=>{let f=new ji(r);this.environment=f.fromEquirectangular(d),this.scene.environment=this.environment.texture,this.scene.environmentIntensity=.22,d.dispose(),f.dispose()}).catch(()=>{})}setProgress(e){this.progress=Rt.clamp(e,0,1);let t=id(this.progress/.18),n=Rt.clamp((this.progress-.18)/.82,0,1);this.paperProgress=n,this.keeper.position.set(-t*3.05,-.01+.1*Math.sin(t*Math.PI),.62),this.keeper.rotation.z=t*.2,this.keeper.material.opacity=1-id((t-.72)/.28),this.keeper.visible=t<.999;let i=-this.height/2+n*this.height,r=Math.max(0,this.height/2-i),a=ci(r,this.template.coreRadius,this.template.layerThickness),o=this.geometry.attributes.position,l=1/0,c=-1/0;for(let h=0;h<o.count;h++){let u=this.base[h*3],d=this.base[h*3+1],f=Math.pow(Math.abs(u)/(this.width/2),6),m=.009*Math.sin(d*4+u*2)+.038*f*Math.sin(d*3.2+.4),[y,g,p]=cc(u,d,m,i,a,this.template.layerThickness),S=n>.94?.055*id((n-.94)/.06)*Math.exp(-Math.pow((d+this.height/2)/.17,2)):0;o.setXYZ(h,y,g,p+S),l=Math.min(l,g),c=Math.max(c,g)}o.needsUpdate=!0,this.geometry.computeVertexNormals(),this.geometry.computeBoundingSphere(),this.sheet.position.y=-(l+c)/2,this.bounds={bottom:l+this.sheet.position.y,top:c+this.sheet.position.y}}resize(e,t){if(!e||!t)return;this.renderer.setSize(e,t,!1);let n=e/t,i=Math.max(this.height+.7,(this.width+.45)/n);this.viewHeight=i,Object.assign(this.camera,{left:-i*n/2,right:i*n/2,top:i/2,bottom:-i/2}),this.camera.updateProjectionMatrix()}render(){this.renderer.render(this.scene,this.camera),this.renderCount++}snapshot(){return{progress:this.progress,paperProgress:this.paperProgress,renderCount:this.renderCount,vertices:this.geometry.attributes.position.count,camera:this.camera.position.toArray(),keeperVisible:this.keeper.visible,viewHeight:this.viewHeight}}exportObject(){return this.render(),this.renderer.domElement.toDataURL("image/png")}dispose(){this.geometry.dispose(),this.material.dispose(),this.keeper.geometry.dispose(),this.keeper.material.dispose();for(let e of this.maps)e.dispose();this.environment?.dispose(),this.renderer.dispose()}};var $p=`
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
`,Pr=class extends dc{constructor(e,t,n,i){super(e,t,n,i),this.renderer.setPixelRatio(1),this.renderer.toneMapping=bn,this.renderer.toneMappingExposure=1;for(let h of this.scene.children.filter(u=>u.isLight))h.color.set(16777215),h.isHemisphereLight?(h.groundColor.set(12959665),h.intensity=.9):h.castShadow?h.intensity=2.4:h.intensity=h.position.z>0?.35:.12;this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=gr,this.geometry.dispose(),this.geometry=new Yt(this.width,this.height,52,280),this.sheet.geometry=this.geometry,this.sheet.frustumCulled=!1,this.sheet.castShadow=!0,this.sheet.receiveShadow=!1,this.keeper.geometry.dispose(),this.keeper.geometry=new Yt(.41,.77),this.uniforms={scrollBoundary:{value:0},scrollRadius:{value:.2},scrollThickness:{value:i.layerThickness},scrollHeight:{value:this.height},scrollWidth:{value:this.width},scrollOpen:{value:0}},this.material.bumpMap=null,this.material.sheen=0,this.material.specularIntensity=0,this.material.roughness=.97,this.material.envMapIntensity=.07;let r=this.material.onBeforeCompile;this.material.onBeforeCompile=h=>{r(h),Object.assign(h.uniforms,this.uniforms),h.vertexShader=$p+h.vertexShader,h.vertexShader=h.vertexShader.replace("#include <beginnormal_vertex>","vec3 objectNormal=normalize(cross(parchment(position+vec3(.001,0.,0.))-parchment(position-vec3(.001,0.,0.)),parchment(position+vec3(0.,.001,0.))-parchment(position-vec3(0.,.001,0.))));"),h.vertexShader=h.vertexShader.replace("#include <begin_vertex>","vec3 transformed=parchment(position);"),h.fragmentShader=h.fragmentShader.replace("#include <roughnessmap_fragment>",`float roughnessFactor=roughness;
    #ifdef USE_ROUGHNESSMAP
      roughnessFactor=.88+.10*texture2D(roughnessMap,vRoughnessMapUv).g;
    #endif`),h.fragmentShader=h.fragmentShader.replace("#include <opaque_fragment>",`outgoingLight=mix(outgoingLight,diffuseColor.rgb,.45*smoothstep(.65,.98,abs(normal.z)));
    #include <opaque_fragment>`)},this.material.customProgramCacheKey=()=>"charter-continuous-matte-v6",this.material.needsUpdate=!0;let a=new Ki({map:this.maps[0],alphaTest:.55,side:Gt,depthPacking:ka});a.onBeforeCompile=h=>{Object.assign(h.uniforms,this.uniforms),h.vertexShader=$p+h.vertexShader,h.vertexShader=h.vertexShader.replace("#include <begin_vertex>","vec3 transformed=parchment(position);")},a.customProgramCacheKey=()=>"charter-continuous-shadow-v6",this.sheet.customDepthMaterial=a;let o=new pt(new Yt(20,20),new Ta({opacity:.2}));o.position.z=-.1,o.receiveShadow=!0,this.scene.add(o),this.renderer.shadowMap.autoUpdate=!1;let l=new Hn,c=this.environmentReady;this.environmentReady=Promise.all([c,l.loadAsync(i.paperNormal||"../chapter-scroll-v4/assets/skin-normal.jpg"),l.loadAsync(i.paperRoughness||"../chapter-scroll-v4/assets/skin-roughness.jpg")]).then(([,h,u])=>{for(let d of[h,u])d.wrapS=d.wrapT=Cn,d.repeat.set(1.4,2.1),this.maps.push(d);this.material.normalMap=h,this.material.normalScale.set(.035,.035),this.material.roughnessMap=u,this.material.needsUpdate=!0}),this.dirty=!0}setProgress(e){this.progress=Rt.clamp(e,0,1);let t=Rt.smoothstep(this.progress,0,.18),n=Rt.clamp((this.progress-.18)/.82,0,1);this.paperProgress=n,this.keeper.position.set(-t*3.05,-.01+.1*Math.sin(t*Math.PI),.62),this.keeper.rotation.z=t*.2,this.keeper.material.opacity=1-Rt.smoothstep(t,.72,1),this.keeper.visible=t<.999;let i=-this.height/2+n*this.height,r=ci(this.height*(1-n),this.template.coreRadius,this.template.layerThickness);this.uniforms.scrollBoundary.value=i,this.uniforms.scrollRadius.value=r,this.uniforms.scrollOpen.value=n;let a=1/0,o=-1/0;for(let l=0;l<=280;l++){let c=-this.height/2+l*this.height/280,[,h]=cc(0,c,0,i,r,this.template.layerThickness);a=Math.min(a,h),o=Math.max(o,h)}this.sheet.position.y=-(a+o)/2,this.bounds={bottom:a+this.sheet.position.y,top:o+this.sheet.position.y},this.renderer.shadowMap.needsUpdate=!0,this.dirty=!0}advance(){}settle(){this.dirty=!0}get needsMotion(){return!1}resize(e,t){if(!e||!t)return;let n=window.devicePixelRatio||1,i=35e5,r=Math.min(1,Math.sqrt(i/(e*t*n*n)));this.renderer.setSize(Math.floor(e*n*r),Math.floor(t*n*r),!1);let a=e/t,o=Math.max(this.height+.66,(this.width+.45)/a);this.viewHeight=o,Object.assign(this.camera,{left:-o*a/2,right:o*a/2,top:o/2,bottom:-o/2}),this.camera.updateProjectionMatrix(),this.dirty=!0}render(){super.render(),this.dirty=!1}snapshot(){return{...super.snapshot(),drawBuffer:{width:this.renderer.domElement.width,height:this.renderer.domElement.height},deformation:"Continuous GPU winding and shared rest displacement",keeperMotion:"v4 rigid take-off",keeperSize:[.41,.77],specularIntensity:this.material.specularIntensity,toneMapping:"none; preserve source colors",restCurl:!0}}};var fc=(s,e,t)=>{let n=Math.max(0,Math.min(1,(t-s)/(e-s)));return n*n*(3-2*n)},mn=Object.freeze({releaseEnd:.24,width:.41,height:.77,bandWidth:.216,closedGap:.058,looseGap:.13});function Wa(s,e){let t=Math.max(0,Math.min(1,s/mn.releaseEnd)),n=fc(0,.27,t),i=fc(.27,.82,t),r=fc(.82,1,t),a=ci(e.height,e.coreRadius,e.layerThickness);return{x:-(e.width/2+mn.width/2+.11)*i-.7*r,y:-.025*r,z:.045*n+.85*r,rotationZ:-.11*r,rotationY:.16*r,loosen:n,opacity:1-fc(.89,1,t),visible:s<mn.releaseEnd,phase:t<.27?"loosen":t<.82?"unthread":t<1?"depart":"off",radius:a,paperProgress:Math.max(0,Math.min(1,(s-mn.releaseEnd)/(1-mn.releaseEnd)))}}var uM=`
float iy=1.0-vMapUv.y;
float left=mix(.305,.262,smoothstep(.28,.34,iy))+.043*smoothstep(.76,.9,iy);
float right=mix(.704,.758,smoothstep(.28,.35,iy))-.046*smoothstep(.76,.91,iy);
if(vMapUv.x<left||vMapUv.x>right)discard;
`;function Jp(s,e){let t=new Vt({map:s,transparent:!0,alphaTest:.08,depthWrite:!0,depthTest:!0,toneMapped:!1,side:Gt});return t.onBeforeCompile=n=>{n.fragmentShader=n.fragmentShader.replace("#include <alphatest_fragment>",`#include <alphatest_fragment>
${uM}
${e?"if(iy<.30||iy>.76)discard;":"if(iy>=.30&&iy<=.76)discard;"}`)},t.customProgramCacheKey=()=>`keeper-layer-v8-${e}`,t}function jp(s,e,t,n){let i=s.clone();for(let r=0;r<s.count;r++){let a=s.getX(r),o=s.getY(r),l=Math.max(0,Math.abs(o)-.16),c=n?o:o+Math.sign(o)*l*.31*t,h=e+mn.closedGap+(mn.looseGap-mn.closedGap)*t,u=n?h+.029:Math.sqrt(Math.max(.002,h*h-c*c))+.016;i.setXYZ(r,a,c,e+u)}return i}function Qp(s,e){let t=new Yt(mn.width,mn.height,12,84),n=t.attributes.position.clone();return t.setAttribute("position",jp(n,s,0,e)),t.morphAttributes.position=[jp(n,s,1,e)],t.computeVertexNormals(),t}function dM(s){let e=[],t=[],n=[],i=[];for(let o=0;o<=112;o++)for(let l=0;l<4;l++){let c=o/112*Math.PI*2,h=(l%2?.5:-.5)*mn.bandWidth,u=l>=2?.009:0;for(let[d,f]of[[e,mn.closedGap],[t,mn.looseGap]]){let m=s+f-u;d.push(h,Math.sin(c)*m,s+Math.cos(c)*m)}n.push(.38+.22*(l%2),.795+.06*(.5+.5*Math.cos(c*4)))}for(let o=0;o<112;o++)for(let[l,c]of[[0,1],[1,3],[3,2],[2,0]]){let h=o*4;i.push(h+l,h+c,h+c+4,h+l,h+c+4,h+l+4)}let a=new Tt;return a.setAttribute("position",new lt(e,3)),a.setAttribute("uv",new lt(n,2)),a.setIndex(i),a.morphAttributes.position=[new lt(t,3)],a.computeVertexNormals(),a}var pc=class{constructor(e,t,n){this.template=n,this.group=new It,e.add(this.group);let{radius:i}=Wa(0,n);this.band=new pt(dM(i),new Vn({map:t,roughness:.96,metalness:0,side:Gt})),this.front=new pt(Qp(i,!1),Jp(t,!1)),this.plate=new pt(Qp(i,!0),Jp(t,!0)),this.parts=[this.band,this.front,this.plate],this.group.add(...this.parts);for(let r of this.parts)r.frustumCulled=!1,r.renderOrder=0}update(e,t){let n=this.pose=Wa(e,this.template);this.group.visible=n.visible,this.group.position.set(n.x,t+n.y,n.z),this.group.rotation.set(0,n.rotationY,n.rotationZ);for(let i of this.parts)i.morphTargetInfluences[0]=n.loosen,i.material.opacity=n.opacity,i.material.transparent=n.opacity<1||i!==this.band}snapshot(){return{...this.pose,model:"layered hoop + rigid buckle + authored tight/loose morph",depthTest:!0,depthWrite:!0}}dispose(){for(let e of this.parts)e.geometry.dispose(),e.material.dispose();this.group.removeFromParent()}};var mc=class extends Pr{constructor(e,t,n,i){super(e,t,n,i),this.scene.remove(this.keeper),this.keeper.visible=!1,this.closure=new pc(this.scene,this.maps[2],i),this.camera=new Ct(35,1,.1,40),this.camera.position.set(0,0,12),this.camera.lookAt(0,0,0),this.sealBump=new ei(t.relief),this.sealBump.needsUpdate=!0,this.material.bumpMap=this.sealBump,this.material.bumpScale=.0025;let r=this.material.onBeforeCompile;this.material.onBeforeCompile=a=>{r(a),a.fragmentShader=a.fragmentShader.replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
    #if defined(USE_BUMPMAP) && defined(USE_NORMALMAP_TANGENTSPACE)
     normal=perturbNormalArb(-vViewPosition,normal,dHdxy_fwd(),faceDirection);
    #endif`)},this.material.customProgramCacheKey=()=>"charter-v8-composed-impression",this.material.needsUpdate=!0}setProgress(e){let t=Rt.clamp(e,0,1),n=Wa(t,this.template);super.setProgress(.18+.82*n.paperProgress),this.progress=t,this.closure&&this.closure.update(t,this.height/2+this.sheet.position.y)}resize(e,t){if(!e||!t)return;let n=window.devicePixelRatio||1,i=Math.min(1,Math.sqrt(35e5/(e*t*n*n)));this.renderer.setSize(Math.floor(e*n*i),Math.floor(t*n*i),!1);let r=e/t,a=Math.max(this.height+.76,(this.width+.6)/r);this.viewHeight=a,this.camera.aspect=r,this.camera.fov=Rt.radToDeg(2*Math.atan(a/(2*this.camera.position.z))),this.camera.updateProjectionMatrix(),this.dirty=!0}snapshot(){return{...super.snapshot(),cameraType:"PerspectiveCamera",keeperVisible:this.closure?.group.visible??!1,keeperMotion:"loosen, unthread, then approach; exact reverse on closing",keeperPose:this.closure?.snapshot(),sealRelief:!0}}dispose(){this.closure.dispose(),this.sealBump.dispose(),super.dispose()}};var gc=class extends mc{constructor(...e){super(...e),this.material.bumpScale=.0045}setSurfaces(e){this.maps[0].image=e.front,this.maps[0].needsUpdate=!0,this.maps[1].image=e.back,this.maps[1].needsUpdate=!0,this.sealBump.image=e.relief,this.sealBump.needsUpdate=!0,this.dirty=!0}};var xc=class extends gc{constructor(...e){super(...e),this.motionPrepared=!1;let t=this.closure.update.bind(this.closure);this.closure.update=(...n)=>{t(...n);for(let i of this.closure.parts)i.material.transparent=!0},this.closure.update(0,0)}async prepareMotion(e){let t=performance.now();await this.environmentReady;for(let n of new Set([...this.maps,this.sealBump]))this.renderer.initTexture(n);await this.renderer.compileAsync(this.scene,this.camera);for(let n of[0,.11,.225,1,e])this.setProgress(n),this.render(),await new Promise(i=>requestAnimationFrame(i));this.motionPrepared=!0,this.preparationMs=performance.now()-t,this.preparedPrograms=this.renderer.info.programs.length}snapshot(){return{...super.snapshot(),runtime:{motionPrepared:this.motionPrepared,preparationMs:this.preparationMs,preparedPrograms:this.preparedPrograms,programs:this.renderer.info.programs.length}}}};var Cs=(s,e,t)=>{let n=Math.max(0,Math.min(1,(t-s)/(e-s)));return n*n*(3-2*n)},em=(s,e)=>Math.hypot(s[0]-e[0],s[1]-e[1],(s[2]||0)-(e[2]||0));function sd(s){let e=[0];for(let t=1;t<s.length;t++)e.push(e[t-1]+em(s[t],s[t-1]));return e}function fM(s,e){e=Math.max(0,Math.min(s.at(-1),e));let t=0,n=s.length-1;for(;n-t>1;){let i=t+n>>1;s[i]<e?t=i:n=i}return[t,n,(e-s[t])/(s[n]-s[t]||1)]}function Dn(s,e,t){let[n,i,r]=fM(e,t);return Array.from({length:3},(a,o)=>(s[n][o]||0)*(1-r)+(s[i][o]||0)*r)}var rd=s=>{let e=Math.hypot(...s)||1;return s.map(t=>t/e)},_c=class{constructor(e){this.data=e,this.points=e.pointsMm,this.arc=sd(this.points),this.length=e.lengthMm,this.count=e.boneCount,this.anchorS=e.foldEndMm+20,this.A=Dn(this.points,this.arc,this.anchorS),this.B=Dn(this.points,this.arc,e.mainEndMm),this.middle=this.A.map((l,c)=>(l+this.B[c])/2);let t=this.B[0]-this.A[0],n=this.B[1]-this.A[1];this.chord=Math.hypot(t,n),this.normal=[-n/this.chord,t/this.chord];let i=Math.sqrt(e.radiusMm**2-this.chord**2/4),r=this.middle.slice(0,2).map((l,c)=>l+i*this.normal[c]),a=this.middle.slice(0,2).map((l,c)=>l-i*this.normal[c]);this.sign=Math.hypot(...r)<Math.hypot(...a)?1:-1,this.suffix=[this.B,...this.points.filter((l,c)=>this.arc[c]>e.mainEndMm+1e-4)],this.suffixArc=sd(this.suffix),this.oldArc=this.circle(e.radiusMm).length,this.holeLocal=e.selectedHoleMm-e.mainEndMm;let o=this.suffix.findIndex(l=>l[0]<5.5);this.liftStart=this.suffixArc[Math.max(0,o)],this.sideStart=this.suffixArc[this.suffix.findIndex(l=>l[0]<0)]}circle(e){let t=Math.sqrt(Math.max(0,e*e-this.chord*this.chord/4)),n=this.middle.slice(0,2).map((o,l)=>o+this.sign*t*this.normal[l]),i=Math.atan2(this.A[1]-n[1],this.A[0]-n[0]),r=Math.atan2(this.B[1]-n[1],this.B[0]-n[0]),a=(i-r+Math.PI*2)%(Math.PI*2);return{C:n,angle:i,length:e*a,radius:e}}radiusFor(e){let t=this.chord/2+.01,n=this.data.radiusMm+45;for(let i=0;i<32;i++){let r=(t+n)/2;this.circle(r).length<e?t=r:n=r}return(t+n)/2}restFrame(e){let t=Dn(this.points,this.arc,e),n=Dn(this.points,this.arc,e-.08),i=Dn(this.points,this.arc,e+.08),r=em(n,i)||1;return[t[0],t[1],(i[0]-n[0])/r,(i[1]-n[1])/r]}frame(e,t){let n=t.point(e),i=t.point(Math.max(0,e-.08)),r=t.point(Math.min(this.length,e+.08)),a=rd([r[0]-i[0],r[2]-i[2],-r[1]+i[1]]),o=rd([-a[0]*a[1],1-a[1]*a[1],-a[2]*a[1]]),l=[o[1]*a[2]-o[2]*a[1],o[2]*a[0]-o[0]*a[2],o[0]*a[1]-o[1]*a[0]];return[n[0],n[2],-n[1],...a,...o,...l]}sample(e){let t=Cs(0,.18,e),n=.55*t,i=10*Cs(.18,.34,e),r=-.45*t-.75*Cs(.72,.78,e),a=Cs(.36,.72,e),o=-Math.sqrt(this.data.radiusMm**2-100)-3.5,l=Dn(this.suffix,this.suffixArc,this.holeLocal),c=Math.max(.3,this.holeLocal-5),h=Dn(this.suffix,this.suffixArc,c),u=(F,R)=>[Math.cos(R)*F[0]-Math.sin(R)*F[1],Math.sin(R)*F[0]+Math.cos(R)*F[1]],d=u([l[0]+10+i,l[1]-o-i*.13],-.45*t),f=[d[0]-10,d[1]+o],m=F=>{let R=u([F[0]-l[0],F[1]-l[1]],n);return[f[0]+R[0],f[1]+R[1],0]},y=m(h),g=Dn(this.suffix,this.suffixArc,c-.08),p=Dn(this.suffix,this.suffixArc,c+.08),S=rd(u([p[0]-g[0],p[1]-g[1]],n)),E=[this.B[0]-9,this.B[1]-1],M=[y[0]-S[0]*4,y[1]-S[1]*4],b=[];for(let F=0;F<=80;F++){let R=F/80,k=1-R,W=Dn(this.suffix,this.suffixArc,c*R),Y=[k**3*this.B[0]+3*k*k*R*E[0]+3*k*R*R*M[0]+R**3*y[0]-6*Math.sin(Math.PI*R)**2*Cs(0,8,i),k**3*this.B[1]+3*k*k*R*E[1]+3*k*R*R*M[1]+R**3*y[1]];b.push([W[0]*(1-t)+Y[0]*t,W[1]*(1-t)+Y[1]*t,0])}let T=[...b,...this.suffix.filter((F,R)=>this.suffixArc[R]>c).map(m)],C=sd(T),x=C[80],w=this.oldArc-(x-c),L=w*(1-a)+(this.length-this.anchorS+4)*a,I=this.circle(this.radiusFor(L));return{r:e,point:F=>{if(e===0||F<=this.anchorS)return Dn(this.points,this.arc,F);let R=F-this.anchorS;if(R<=I.length){let k=I.angle-R/I.radius;return[I.C[0]+I.radius*Math.cos(k),I.C[1]+I.radius*Math.sin(k),0]}return Dn(T,C,R-I.length)},pin:r,feed:a,angle:n,along:i,sideMm:0,circleCenter:e===0?[0,0]:I.C,phase:e<=0?"fastened":e<.18?"unload-hole":e<.36?"release-hole":e<.72?"withdraw-tail":e<.79?"park-pin":e<.94?"slide-clear":e<1?"depart":"off",slide:Cs(.79,.94,e),depart:Cs(.94,1,e),freeEndBehindFrame:I.length>=this.length-this.anchorS,expandedRadiusMm:I.radius}}};var gn=1024,pM=`
uniform sampler2D keeperCurve;
uniform float keeperLength;
attribute vec3 keeperMaterial,keeperNormal,keeperResidual;
varying vec3 vKeeperMaterial;
vec3 keeperRow(float row){
 float f=clamp(keeperMaterial.x/keeperLength,0.,1.)*${gn-1}.;
 float i=floor(f);vec3 a=texture2D(keeperCurve,vec2((i+.5)/${gn}.,(row+.5)/4.)).xyz;
 vec3 b=texture2D(keeperCurve,vec2((min(i+1.,${gn-1}.)+.5)/${gn}.,(row+.5)/4.)).xyz;
 return mix(a,b,fract(f));
}
`,vc=class{constructor(e,t){this.template=t,this.radius=ci(t.height,t.coreRadius,t.layerThickness),this.group=new It,this.group.name="continuous-unfastening-keeper",e.add(this.group),this.parts=[],this.maps=[],this.pending=[0,0],this.pose={phase:"loading"},this.ready=this.load()}async load(){let e=await(await fetch(new URL("../chapter-scroll-v17/keeper-path.json",import.meta.url))).json();this.path=new _c(e);let t=await new Cr().loadAsync(new URL("../scroll-museum-v1/assets/keeper-display.glb",import.meta.url).href,p=>this.onLoadingProgress?.(Math.min(1,p.loaded/(p.total||16838068))));if(this.model=t.scene,this.model.updateMatrixWorld(!0),this.sourceMeshes=[],this.model.traverse(p=>{p.name.startsWith("Prong_hinge")&&(this.hinge=p),p.isMesh&&this.sourceMeshes.push(p)}),!this.hinge)throw Error("Rigid prong hinge unavailable");this.hingeRest=this.hinge.quaternion.clone();let n=this.sourceMeshes.find(p=>p.isSkinnedMesh);if(!n)throw Error("Original continuous strap unavailable");let i=n.geometry.clone(),r=i.attributes.position,a=i.attributes.normal,o=i.morphAttributes.position[0];this.curveData=new Float32Array(gn*4*4),this.curve=new Qn(this.curveData,gn,4,cn,Kt),this.curve.minFilter=this.curve.magFilter=Dt,this.curve.generateMipmaps=!1,this.uniforms={keeperCurve:{value:this.curve},keeperLength:{value:e.lengthMm}};let l=new Float32Array(r.count*3),c=new Float32Array(r.count*3),h=new N,u=new N;for(let p=0;p<r.count;p++){h.fromBufferAttribute(r,p);let S=new N().fromBufferAttribute(o,p);i.morphTargetsRelative&&S.add(h);let E=(S.x+e.lengthMm*5e-4)*1e3,M=S.z*1e3,b=S.y*1e3;l.set([E,M,b],p*3);let T=this.path.restFrame(E);u.fromBufferAttribute(a,p),c.set([u.x*T[2]-u.z*T[3],u.y,-u.x*T[3]-u.z*T[2]],p*3)}i.morphAttributes={},i.deleteAttribute("skinIndex"),i.deleteAttribute("skinWeight"),i.setAttribute("keeperMaterial",new Et(l,3)),i.setAttribute("keeperNormal",new Et(c,3)),this.residual=new Float32Array(r.count*3),i.setAttribute("keeperResidual",new Et(this.residual,3));let d=i.attributes.uv;for(let p=0;p<d.count;p++)d.setXY(p,d.getX(p)*3,d.getY(p)*3);this.flat=l,this.strap=new pt(i,n.material.clone()),this.strap.name=n.name,this.strap.position.copy(n.position),this.strap.quaternion.copy(n.quaternion),this.strap.scale.copy(n.scale),n.parent.add(this.strap),n.removeFromParent(),this.sourceMeshes=this.sourceMeshes.filter(p=>p!==n),this.sourceMeshes.push(this.strap);let f=(p,S)=>{p.onBeforeCompile=E=>{Object.assign(E.uniforms,this.uniforms),E.vertexShader=pM+E.vertexShader,E.vertexShader=E.vertexShader.replace("#include <begin_vertex>","vKeeperMaterial=keeperMaterial;vec3 transformed=(keeperRow(0.)+normalize(keeperRow(2.))*keeperMaterial.z+normalize(keeperRow(3.))*keeperMaterial.y+mat3(normalize(keeperRow(1.)),normalize(keeperRow(2.)),normalize(keeperRow(3.)))*keeperResidual)*.001;"),S&&(E.vertexShader=E.vertexShader.replace("#include <beginnormal_vertex>","vec3 objectNormal=normalize(mat3(normalize(keeperRow(1.)),normalize(keeperRow(2.)),normalize(keeperRow(3.)))*keeperNormal);")),S&&(E.fragmentShader=`varying vec3 vKeeperMaterial;
`+E.fragmentShader,E.fragmentShader=E.fragmentShader.replace("#include <map_fragment>",`#include <map_fragment>
     float rubbed=smoothstep(7.7,9.1,abs(vKeeperMaterial.z));
     float grain=dot(diffuseColor.rgb,vec3(.3,.59,.11));
     float irregular=.65+.35*sin(vKeeperMaterial.x*.61+sin(vKeeperMaterial.x*.19)*2.);
     diffuseColor.rgb=mix(diffuseColor.rgb*.87,vec3(.25,.135,.058)*(1.+grain),rubbed*irregular*.40);
     float crease=exp(-pow((vKeeperMaterial.x-${e.selectedHoleMm.toFixed(4)})/1.2,2.))*(.7+.3*cos(vKeeperMaterial.z*1.3));
     diffuseColor.rgb*=1.-.18*crease;
    `),E.fragmentShader=E.fragmentShader.replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor=clamp(.65+roughnessFactor*.28,.7,.96);`))},p.customProgramCacheKey=()=>`material-coordinate-keeper-v17-${S}`,p.needsUpdate=!0};f(this.strap.material,!0),this.strap.customDepthMaterial=new Ki({depthPacking:ka}),f(this.strap.customDepthMaterial,!1),this.strap.material.normalScale.set(.45,.45),this.strap.material.envMapIntensity=.65,this.gap=.065,this.scale=(this.radius+this.gap)/((e.radiusMm-e.thicknessMm/2)*.001),this.fitting=new It,this.fitting.rotation.z=Math.PI/2,this.fitting.scale.setScalar(this.scale),this.fitting.add(this.model),this.group.add(this.fitting),this.halfWidth=.014*this.scale;for(let p of this.sourceMeshes){this.parts.push(p),p.frustumCulled=!1,p.castShadow=!0,p.receiveShadow=!0,p.material.transparent=!1,p.material.opacity=1,p!==this.strap&&(p.material.envMapIntensity=3,p.material.roughness=.85);for(let S of["map","normalMap","roughnessMap","metalnessMap"])p.material[S]&&this.maps.push(p.material[S])}this.maps.push(this.curve),this.update(...this.pending);for(let p=0;p<r.count;p++){let S=this.vertex(p,new N),E=new N().fromBufferAttribute(r,p).sub(S).multiplyScalar(1e3),M=this.rows(l[p*3]);this.residual.set([1,2,3].map(b=>E.dot(new N(...M[b]))),p*3)}let m=new N,y=0,g=0;for(let p=0;p<r.count;p++){this.vertex(p,m);let S=m.distanceTo(new N().fromBufferAttribute(r,p));y=Math.max(y,S),g+=S}this.restDeviationMm={maximum:y*1e3,mean:g/r.count*1e3},this.onLoadingProgress?.(1)}update(e,t){if(this.pending=[e,t],!this.path||!this.fitting)return;let n=Rt.clamp(e/.4,0,1),i=this.path.sample(n);for(let a=0;a<gn;a++){let o=this.path.frame(this.path.length*a/(gn-1),i);for(let l=0;l<4;l++)this.curveData.set(o.slice(l*3,l*3+3),(l*gn+a)*4)}this.curve.needsUpdate=!0,this.hinge.quaternion.copy(this.hingeRest).multiply(new en().setFromAxisAngle(new N(0,1,0),i.pin));let r=this.template.width/2+this.halfWidth+.18;this.group.position.set(-r*i.slide-.85*i.depart,t+.025*Math.sin(i.slide*Math.PI)-i.circleCenter[0]*.001*this.scale,this.radius+.12*i.depart+i.circleCenter[1]*.001*this.scale),this.group.rotation.set(0,.1*i.depart,-.12*i.depart),this.group.visible=e<.4,this.group.updateMatrixWorld(!0),this.pose={...i,heads:void 0,point:void 0,visible:this.group.visible,opacity:1,x:this.group.position.x,y:this.group.position.y,z:this.group.position.z,fitScale:this.scale,fitScaleVector:this.fitting.scale.toArray(),bandWidth:.018*this.scale,usesFade:!1,usesStrapDeformation:!0,deformation:"material-coordinate curve; dimensioned continuous cut mesh; native bevel residual",sourceBones:76}}snapshot(){let{circle:e,suffix:t,suffixArc:n,...i}=this.pose;return{...i,restDeviationMm:this.restDeviationMm}}rows(e){let t=Math.max(0,Math.min(gn-1,e/this.path.length*(gn-1))),n=Math.floor(t),i=Math.min(gn-1,n+1),r=t-n,a=this.curveData;return Array.from({length:4},(o,l)=>{let c=Array.from({length:3},(h,u)=>a[(l*gn+n)*4+u]*(1-r)+a[(l*gn+i)*4+u]*r);if(l){let h=Math.hypot(...c);return c.map(u=>u/h)}return c})}vertex(e,t){let n=this.flat[e*3+1],i=this.flat[e*3+2],r=this.rows(this.flat[e*3]),a=this.residual;return t.set(...r[0].map((o,l)=>(o+i*r[2][l]+n*r[3][l]+r[1][l]*a[e*3]+r[2][l]*a[e*3+1]+r[3][l]*a[e*3+2])*.001))}inspectionGeometry(){this.group.updateMatrixWorld(!0);let e=new N;return{paperRadius:this.radius+.006,paperCenterY:this.pending[1],paperCenterZ:this.radius,paperHalfWidth:this.template.width/2,meshes:this.parts.map(t=>{let n=[];for(let i=0;i<t.geometry.attributes.position.count;i++)t===this.strap?this.vertex(i,e):t.getVertexPosition(i,e),e.applyMatrix4(t.matrixWorld),n.push(e.x,e.y,e.z);return{name:t.name,leather:t===this.strap,vertices:n,indices:t.geometry.index?Array.from(t.geometry.index.array):Array.from({length:n.length/3},(i,r)=>r)}})}}dispose(){for(let e of this.parts)e.geometry.dispose(),e.material.dispose(),e.customDepthMaterial?.dispose();for(let e of new Set(this.maps))e.dispose();this.group.removeFromParent()}};var yc=class extends xc{constructor(...e){super(...e),this.closure.dispose(),this.closure=new vc(this.scene,this.template),this.integrated=!0;let t=this.environmentReady;this.environmentReady=Promise.all([t,this.closure.ready]).then(()=>{this.maps.push(...this.closure.maps);for(let i of[this.material.normalMap,this.material.roughnessMap])i.wrapS=i.wrapT=qt,i.repeat.set(1,1),i.needsUpdate=!0;this.material.normalScale.set(.11,.11),this.material.needsUpdate=!0});let n=i=>{i.vertexShader=i.vertexShader.replace("v.z=.009*sin",`float u=q.x/scrollWidth+.5, sheetV=.5-q.y/scrollHeight;
   float diagonal=exp(-pow((sheetV-(.11+.365*u))/.009,2.))*(1.-smoothstep(.42,.55,u));
   float crossfold=exp(-pow((sheetV-(.645+.04*u))/.010,2.));
   v.z=-.008*diagonal-.011*crossfold;
   v.z+=.009*sin`)};for(let i of[this.material,this.sheet.customDepthMaterial]){let r=i.onBeforeCompile;i.onBeforeCompile=a=>{r(a),n(a)},i.customProgramCacheKey=()=>i===this.material?"chapter-five-v14-folds":"chapter-five-v14-fold-shadow",i.needsUpdate=!0}this.setProgress(0)}setProgress(e){if(!this.integrated)return super.setProgress(e);let t=Rt.clamp(e,0,1),n=Rt.clamp((t-.4)/(1-.4),0,1);Pr.prototype.setProgress.call(this,.18+.82*n),this.progress=t,this.closure.update(t,this.height/2+this.sheet.position.y)}async prepareMotion(e){let t=performance.now();await this.environmentReady;for(let n of new Set([...this.maps,this.sealBump]))this.renderer.initTexture(n);this.setProgress(0),await this.renderer.compileAsync(this.scene,this.camera);for(let n of[0,.05,.1,.17,.23,.3,.339,1,e])this.setProgress(n),this.render(),await new Promise(i=>requestAnimationFrame(i));this.motionPrepared=!0,this.preparationMs=performance.now()-t,this.preparedPrograms=this.renderer.info.programs.length}snapshot(){return{...super.snapshot(),edition:"v17 physical keeper integration",keeperMotion:"material-coordinate unfastening and rigid hinged prong",keeperSize:[.018*this.closure.scale,.06*this.closure.scale],paperMaterial:"unchanged chapter-five v14"}}exportKeeper(){let e=this.progress,t=this.camera,n=this.renderer.getSize(new fe),i=this.scene.children.map(a=>[a,a.visible]);this.closure.group.position.set(0,0,0),this.closure.group.rotation.set(0,0,0),this.closure.group.visible=!0;for(let[a]of i)a!==this.closure.group&&!a.isLight&&(a.visible=!1);this.camera=new Ct(32,1,.01,30),this.camera.position.set(.42,.2,1.8),this.camera.lookAt(0,0,.08),this.renderer.setSize(900,900,!1),this.render();let r=this.renderer.domElement.toDataURL("image/png");this.camera=t,this.renderer.setSize(n.x,n.y,!1);for(let[a,o]of i)a.visible=o;return this.setProgress(e),this.render(),r}interaction(){let e=(t,n,i)=>{let r=new N(t,n,i).project(this.camera);return{x:.5+.5*r.x,y:.5+.5*r.y}};return{top:[e(-this.width/2,this.bounds.top,0),e(this.width/2,this.bounds.top,0)],bottom:[e(-this.width/2,this.bounds.bottom,0),e(this.width/2,this.bounds.bottom,0)],keeper:this.closure.group.visible?e(this.closure.group.position.x,this.closure.group.position.y,this.closure.group.position.z+this.closure.radius):null,paperProgress:this.paperProgress}}inspectionGeometry(){if(this.paperProgress!==0)throw Error("Contact inspection expects the closed paper");let e=this.closure.inspectionGeometry();if(this.progress===0){let t=this.geometry.attributes.position,n=[],i=this.closure.radius,r=this.template.layerThickness/(2*Math.PI),a=-this.height/2;this.sheet.updateMatrixWorld(!0);let o=new N;for(let l=0;l<t.count;l++){let c=t.getX(l),h=t.getY(l),u=c/this.width+.5,d=.5-h/this.height,f=(Math.abs(c)/(this.width/2))**6,m=Math.exp(-(((d-(.11+.365*u))/.009)**2))*(1-Rt.smoothstep(u,.42,.55)),y=Math.exp(-(((d-(.645+.04*u))/.01)**2)),g=-.008*m-.011*y+.009*Math.sin(h*4+c*2)+.025*f*Math.sin(h*3.2+.4),p=h,S=g,E=-h-a;if(E>0){let M=i*.08,b=(i-M)/r,T=i*b-.5*r*b*b,C=E>=T?b+(E-T)/M:2*E/(i+Math.sqrt(Math.max(0,i*i-2*r*E))),x=Math.max(i-r*C,M)-g;p=-(a+x*Math.sin(C)),S=i-x*Math.cos(C)}o.set(c,p,S).applyMatrix4(this.sheet.matrixWorld),n.push(o.x,o.y,o.z)}e.paperMesh={vertices:n,indices:Array.from(this.geometry.index.array)}}return e}};async function tm(s,e){let t=new Hn,n=["leather-color","leather-orm","leather-normal","bronze-color","bronze-orm","bronze-normal"],i=await Promise.all(n.map(async p=>{let S=await t.loadAsync(new URL(`../chapter-scroll-v19/assets/${p}.webp`,import.meta.url).href);return S.flipY=!1,S.colorSpace=p.endsWith("color")?gt:Xn,S.wrapS=S.wrapT=qt,S.anisotropy=Math.min(8,e.capabilities.getMaxAnisotropy()),S})),[r,a,o,l,c,h]=i,u=new Set;for(let p of s.parts)for(let S of["map","normalMap","roughnessMap","metalnessMap"])p.material[S]&&u.add(p.material[S]);let d=s.strap.material,f=d.onBeforeCompile,m=s.strap.geometry.attributes.uv,y=s.flat;for(let p=0;p<m.count;p++)m.setXY(p,y[p*3]/s.path.length,.5-y[p*3+2]/18);m.needsUpdate=!0,Object.assign(d,{map:r,normalMap:o,roughnessMap:a,metalnessMap:null,roughness:1,metalness:0,envMapIntensity:.7}),d.normalScale.set(.72,.72),d.onBeforeCompile=p=>{f(p);let S=/float rubbed=smoothstep\(7\.7,9\.1,abs\(vKeeperMaterial\.z\)\);[\s\S]*?diffuseColor\.rgb\*=1\.-\.18\*crease;/;if(!S.test(p.fragmentShader))throw Error("Base material changed: review before using baked finishing");p.vertexShader=`varying vec3 vKeeperSurface;
`+p.vertexShader,p.vertexShader=p.vertexShader.replace("vKeeperMaterial=keeperMaterial;","vKeeperSurface=keeperNormal;vKeeperMaterial=keeperMaterial;"),p.fragmentShader=`varying vec3 vKeeperSurface;
`+p.fragmentShader,p.fragmentShader=p.fragmentShader.replace(S,""),p.fragmentShader=p.fragmentShader.replace("roughnessFactor=clamp(.65+roughnessFactor*.28,.7,.96);","roughnessFactor=clamp(roughnessFactor,.42,.99);"),p.fragmentShader=p.fragmentShader.replace("#include <map_fragment>",`#include <map_fragment>
   float cutSide=smoothstep(.42,.82,1.-abs(normalize(vKeeperSurface).z));
   // Keep incised face motifs off the exposed core. A separate thickness
   // cross-section samples the central, untooled portion of the leather map.
   vec2 coreUv=vec2(vKeeperMaterial.x/${s.path.length.toFixed(5)},.36+vKeeperMaterial.y*.09);
   vec3 core=texture2D(map,coreUv).rgb;
   vec3 coreN=texture2D(normalMap,coreUv).xyz*2.-1.;
   float coreTone=dot(core,vec3(.30,.59,.11));
   float coreFiber=clamp(.57+2.4*coreTone+.48*(coreN.x+coreN.y),.40,1.5);
   diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.145,.067,.024)*coreFiber,cutSide*.93);
  `),p.fragmentShader=p.fragmentShader.replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
    coreN.xy*=.25;
    mat3 coreTangent=getTangentFrame(-vViewPosition,nonPerturbedNormal,coreUv);
    normal=normalize(mix(normal,normalize(coreTangent*normalize(coreN)),cutSide*.96));`),p.fragmentShader=p.fragmentShader.replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor=mix(roughnessFactor,.94,cutSide);`)},d.customProgramCacheKey=()=>"keeper-native-workshop-leather-v19",d.needsUpdate=!0;let g=s.parts.find(p=>p!==s.strap).material.clone();Object.assign(g,{map:l,roughnessMap:c,metalnessMap:c,normalMap:h,roughness:1,metalness:1,envMapIntensity:5.2}),g.normalScale.set(.85,.85),g.needsUpdate=!0;for(let p of s.parts)p!==s.strap&&(p.material=g);s.maps=s.maps.filter(p=>!u.has(p)),s.maps.push(...i);for(let p of u)p.dispose();return{version:"v19 native multi-pass finishing",leather:["scanned grain","hide variation","dark contact polish","grain-coat loss","opened flex creases","worn hand-incised borders","terminal lozenge"],metal:["scanned microstructure","planishing depressions","file dressing","paired incised grooves","brown stable oxide","subdued crevice patina","rubbed crowns"],sourceGeometry:"unchanged v17",offlineBaked:!0,noMold:!0}}var Mc=class extends yc{constructor(...e){super(...e);let t=this.environmentReady;this.environmentReady=t.then(async()=>{let n=new Set(this.closure.maps);this.aging=await tm(this.closure,this.renderer),this.maps=this.maps.filter(i=>!n.has(i)),this.maps.push(...this.closure.maps)})}snapshot(){return{...super.snapshot(),edition:"v19 multi-pass old keeper",aging:this.aging}}};function Sc(s,e={}){ve();let t={SIM_RESOLUTION:e.simResolution||64,DYE_RESOLUTION:512,CAPTURE_RESOLUTION:512,DENSITY_DISSIPATION:e.densityDissipation??.7,VELOCITY_DISSIPATION:.65,PRESSURE:.8,PRESSURE_ITERATIONS:12,CURL:e.curl??12,SPLAT_RADIUS:.1,SPLAT_FORCE:6e3,SHADING:!1,COLORFUL:!1,COLOR_UPDATE_SPEED:10,PAUSED:!1,BACK_COLOR:{r:0,g:0,b:0},TRANSPARENT:!0,BLOOM:!1,BLOOM_ITERATIONS:8,BLOOM_RESOLUTION:256,BLOOM_INTENSITY:.8,BLOOM_THRESHOLD:.6,BLOOM_SOFT_KNEE:.7,SUNRAYS:!1,SUNRAYS_RESOLUTION:196,SUNRAYS_WEIGHT:1};function n(){this.id=-1,this.texcoordX=0,this.texcoordY=0,this.prevTexcoordX=0,this.prevTexcoordY=0,this.deltaX=0,this.deltaY=0,this.down=!1,this.moved=!1,this.color=[30,0,300]}let i=[],r=[];i.push(new n);let{gl:a,ext:o}=l(s);u()&&(t.DYE_RESOLUTION=512),o.supportLinearFiltering||(t.DYE_RESOLUTION=512,t.SHADING=!1,t.BLOOM=!1,t.SUNRAYS=!1),e.dyeResolution&&(t.DYE_RESOLUTION=Math.min(t.DYE_RESOLUTION,e.dyeResolution));function l(D){let Z={alpha:!0,depth:!1,stencil:!1,antialias:!1,preserveDrawingBuffer:!1},q=D.getContext("webgl2",Z),_=!!q;_||(q=D.getContext("webgl",Z)||D.getContext("experimental-webgl",Z));let P,G;_?(q.getExtension("EXT_color_buffer_float"),G=q.getExtension("OES_texture_float_linear")):(P=q.getExtension("OES_texture_half_float"),G=q.getExtension("OES_texture_half_float_linear")),q.clearColor(0,0,0,1);let O=_?q.HALF_FLOAT:P.HALF_FLOAT_OES,V,le,Te;return _?(V=c(q,q.RGBA16F,q.RGBA,O),le=c(q,q.RG16F,q.RG,O),Te=c(q,q.R16F,q.RED,O)):(V=c(q,q.RGBA,q.RGBA,O),le=c(q,q.RGBA,q.RGBA,O),Te=c(q,q.RGBA,q.RGBA,O)),{gl:q,ext:{formatRGBA:V,formatRG:le,formatR:Te,halfFloatTexType:O,supportLinearFiltering:G}}}function c(D,Z,q,_){if(!h(D,Z,q,_))switch(Z){case D.R16F:return c(D,D.RG16F,D.RG,_);case D.RG16F:return c(D,D.RGBA16F,D.RGBA,_);default:return null}return{internalFormat:Z,format:q}}function h(D,Z,q,_){let P=D.createTexture();D.bindTexture(D.TEXTURE_2D,P),D.texParameteri(D.TEXTURE_2D,D.TEXTURE_MIN_FILTER,D.NEAREST),D.texParameteri(D.TEXTURE_2D,D.TEXTURE_MAG_FILTER,D.NEAREST),D.texParameteri(D.TEXTURE_2D,D.TEXTURE_WRAP_S,D.CLAMP_TO_EDGE),D.texParameteri(D.TEXTURE_2D,D.TEXTURE_WRAP_T,D.CLAMP_TO_EDGE),D.texImage2D(D.TEXTURE_2D,0,Z,4,4,0,q,_,null);let G=D.createFramebuffer();return D.bindFramebuffer(D.FRAMEBUFFER,G),D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,P,0),D.checkFramebufferStatus(D.FRAMEBUFFER)==D.FRAMEBUFFER_COMPLETE}function u(){return/Mobi|Android/i.test(navigator.userAgent)}class d{constructor(Z,q){this.vertexShader=Z,this.fragmentShaderSource=q,this.programs=[],this.activeProgram=null,this.uniforms=[]}setKeywords(Z){let q=0;for(let P=0;P<Z.length;P++)q+=Wc(Z[P]);let _=this.programs[q];if(_==null){let P=g(a.FRAGMENT_SHADER,this.fragmentShaderSource,Z);_=m(this.vertexShader,P),this.programs[q]=_}_!=this.activeProgram&&(this.uniforms=y(_),this.activeProgram=_)}bind(){a.useProgram(this.activeProgram)}}class f{constructor(Z,q){this.uniforms={},this.program=m(Z,q),this.uniforms=y(this.program)}bind(){a.useProgram(this.program)}}function m(D,Z){let q=a.createProgram();return a.attachShader(q,D),a.attachShader(q,Z),a.linkProgram(q),a.getProgramParameter(q,a.LINK_STATUS)||console.trace(a.getProgramInfoLog(q)),q}function y(D){let Z=[],q=a.getProgramParameter(D,a.ACTIVE_UNIFORMS);for(let _=0;_<q;_++){let P=a.getActiveUniform(D,_).name;Z[P]=a.getUniformLocation(D,P)}return Z}function g(D,Z,q){Z=p(Z,q);let _=a.createShader(D);return a.shaderSource(_,Z),a.compileShader(_),a.getShaderParameter(_,a.COMPILE_STATUS)||console.trace(a.getShaderInfoLog(_)),_}function p(D,Z){if(Z==null)return D;let q="";return Z.forEach(_=>{q+="#define "+_+`
`}),q+D}let S=g(a.VERTEX_SHADER,`
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
`),E=g(a.VERTEX_SHADER,`
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
`),M=g(a.FRAGMENT_SHADER,`
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
`),b=g(a.FRAGMENT_SHADER,`
    precision mediump float;
    precision mediump sampler2D;

    varying highp vec2 vUv;
    uniform sampler2D uTexture;

    void main () {
        gl_FragColor = texture2D(uTexture, vUv);
    }
`),T=g(a.FRAGMENT_SHADER,`
    precision mediump float;
    precision mediump sampler2D;

    varying highp vec2 vUv;
    uniform sampler2D uTexture;
    uniform float value;

    void main () {
        gl_FragColor = value * texture2D(uTexture, vUv);
    }
`),C=g(a.FRAGMENT_SHADER,`
    precision mediump float;

    uniform vec4 color;

    void main () {
        gl_FragColor = color;
    }
`),x=g(a.FRAGMENT_SHADER,`
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
`),w=`
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
`,L=g(a.FRAGMENT_SHADER,`
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
`),I=g(a.FRAGMENT_SHADER,`
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
`),B=g(a.FRAGMENT_SHADER,`
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
`),F=g(a.FRAGMENT_SHADER,`
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
`),R=g(a.FRAGMENT_SHADER,`
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
`),k=g(a.FRAGMENT_SHADER,`
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
`),W=g(a.FRAGMENT_SHADER,`
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
    }`,o.supportLinearFiltering?null:["MANUAL_FILTERING"]),Y=g(a.FRAGMENT_SHADER,`
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
`),re=g(a.FRAGMENT_SHADER,`
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
`),K=g(a.FRAGMENT_SHADER,`
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
`),Q=g(a.FRAGMENT_SHADER,`
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
`),se=g(a.FRAGMENT_SHADER,`
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
`),ue=(a.bindBuffer(a.ARRAY_BUFFER,a.createBuffer()),a.bufferData(a.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),a.STATIC_DRAW),a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,a.createBuffer()),a.bufferData(a.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),a.STATIC_DRAW),a.vertexAttribPointer(0,2,a.FLOAT,!1,0,0),a.enableVertexAttribArray(0),(D,Z=!1)=>{D==null?(a.viewport(0,0,a.drawingBufferWidth,a.drawingBufferHeight),a.bindFramebuffer(a.FRAMEBUFFER,null)):(a.viewport(0,0,D.width,D.height),a.bindFramebuffer(a.FRAMEBUFFER,D.fbo)),Z&&(a.clearColor(0,0,0,1),a.clear(a.COLOR_BUFFER_BIT)),a.drawElements(a.TRIANGLES,6,a.UNSIGNED_SHORT,0)});function we(){let D=a.checkFramebufferStatus(a.FRAMEBUFFER);D!=a.FRAMEBUFFER_COMPLETE&&console.trace("Framebuffer error: "+D)}let Ge,Se,at,J,ee,ye,ze=[],Ae,qe,ht=null,te=new f(E,M),oe=new f(S,b),he=new f(S,T),de=new f(S,C),ge=new f(S,x),Ve=new f(S,L),Ue=new f(S,I),We=new f(S,B),$e=new f(S,F),U=new f(S,R),Ye=new f(S,k),Ze=new f(S,W),A=new f(S,Y),v=new f(S,re),H=new f(S,K),X=new f(S,Q),$=new f(S,se),ce=new d(S,w);function me(){let D=fi(t.SIM_RESOLUTION),Z=fi(t.DYE_RESOLUTION),q=o.halfFloatTexType,_=o.formatRGBA,P=o.formatRG,G=o.formatR,O=o.supportLinearFiltering?a.LINEAR:a.NEAREST;a.disable(a.BLEND),Ge==null?Ge=De(Z.width,Z.height,_.internalFormat,_.format,q,O):Ge=_e(Ge,Z.width,Z.height,_.internalFormat,_.format,q,O),Se==null?Se=De(D.width,D.height,P.internalFormat,P.format,q,O):Se=_e(Se,D.width,D.height,P.internalFormat,P.format,q,O),at=pe(D.width,D.height,G.internalFormat,G.format,q,a.NEAREST),J=pe(D.width,D.height,G.internalFormat,G.format,q,a.NEAREST),ee=De(D.width,D.height,G.internalFormat,G.format,q,a.NEAREST),j(),ie()}function j(){let D=fi(t.BLOOM_RESOLUTION),Z=o.halfFloatTexType,q=o.formatRGBA,_=o.supportLinearFiltering?a.LINEAR:a.NEAREST;ye=pe(D.width,D.height,q.internalFormat,q.format,Z,_),ze.length=0;for(let P=0;P<t.BLOOM_ITERATIONS;P++){let G=D.width>>P+1,O=D.height>>P+1;if(G<2||O<2)break;let V=pe(G,O,q.internalFormat,q.format,Z,_);ze.push(V)}}function ie(){let D=fi(t.SUNRAYS_RESOLUTION),Z=o.halfFloatTexType,q=o.formatR,_=o.supportLinearFiltering?a.LINEAR:a.NEAREST;Ae=pe(D.width,D.height,q.internalFormat,q.format,Z,_),qe=pe(D.width,D.height,q.internalFormat,q.format,Z,_)}function pe(D,Z,q,_,P,G){a.activeTexture(a.TEXTURE0);let O=a.createTexture();a.bindTexture(a.TEXTURE_2D,O),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,G),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,G),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE),a.texImage2D(a.TEXTURE_2D,0,q,D,Z,0,_,P,null);let V=a.createFramebuffer();a.bindFramebuffer(a.FRAMEBUFFER,V),a.framebufferTexture2D(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0,a.TEXTURE_2D,O,0),a.viewport(0,0,D,Z),a.clear(a.COLOR_BUFFER_BIT);let le=1/D,Te=1/Z;return{texture:O,fbo:V,width:D,height:Z,texelSizeX:le,texelSizeY:Te,attach(xe){return a.activeTexture(a.TEXTURE0+xe),a.bindTexture(a.TEXTURE_2D,O),xe}}}function De(D,Z,q,_,P,G){let O=pe(D,Z,q,_,P,G),V=pe(D,Z,q,_,P,G);return{width:D,height:Z,texelSizeX:O.texelSizeX,texelSizeY:O.texelSizeY,get read(){return O},set read(le){O=le},get write(){return V},set write(le){V=le},swap(){let le=O;O=V,V=le}}}function be(D,Z,q,_,P,G,O){let V=pe(Z,q,_,P,G,O);return oe.bind(),a.uniform1i(oe.uniforms.uTexture,D.attach(0)),ue(V),V}function _e(D,Z,q,_,P,G,O){return D.width==Z&&D.height==q||(D.read=be(D.read,Z,q,_,P,G,O),D.write=pe(Z,q,_,P,G,O),D.width=Z,D.height=q,D.texelSizeX=1/Z,D.texelSizeY=1/q),D}function Be(D){let Z=a.createTexture();a.bindTexture(a.TEXTURE_2D,Z),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.REPEAT),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.REPEAT),a.texImage2D(a.TEXTURE_2D,0,a.RGB,1,1,0,a.RGB,a.UNSIGNED_BYTE,new Uint8Array([255,255,255]));let q={texture:Z,width:1,height:1,attach(P){return a.activeTexture(a.TEXTURE0+P),a.bindTexture(a.TEXTURE_2D,Z),P}},_=new Image;return _.onload=()=>{q.width=_.width,q.height=_.height,a.bindTexture(a.TEXTURE_2D,Z),a.texImage2D(a.TEXTURE_2D,0,a.RGB,a.RGB,a.UNSIGNED_BYTE,_)},_.src=D,q}function Xe(){let D=[];t.SHADING&&D.push("SHADING"),t.BLOOM&&D.push("BLOOM"),t.SUNRAYS&&D.push("SUNRAYS"),ce.setKeywords(D)}Xe(),me();let Qe=Date.now(),z=0;function ve(){let D=kr(s.clientWidth),Z=kr(s.clientHeight);return s.width!=D||s.height!=Z?(s.width=D,s.height=Z,!0):!1}function ne(D){t.COLORFUL&&(z+=D*t.COLOR_UPDATE_SPEED,z>=1&&(z=so(z,0,1),i.forEach(Z=>{Z.color=Ds()})))}function Me(){r.length>0&&Vc(r.pop()),i.forEach(D=>{D.moved&&(D.moved=!1,zc(D))})}function Re(D){a.disable(a.BLEND),v.bind(),a.uniform2f(v.uniforms.texelSize,Se.texelSizeX,Se.texelSizeY),a.uniform1i(v.uniforms.uVelocity,Se.read.attach(0)),ue(J),H.bind(),a.uniform2f(H.uniforms.texelSize,Se.texelSizeX,Se.texelSizeY),a.uniform1i(H.uniforms.uVelocity,Se.read.attach(0)),a.uniform1i(H.uniforms.uCurl,J.attach(1)),a.uniform1f(H.uniforms.curl,t.CURL),a.uniform1f(H.uniforms.dt,D),ue(Se.write),Se.swap(),A.bind(),a.uniform2f(A.uniforms.texelSize,Se.texelSizeX,Se.texelSizeY),a.uniform1i(A.uniforms.uVelocity,Se.read.attach(0)),ue(at),he.bind(),a.uniform1i(he.uniforms.uTexture,ee.read.attach(0)),a.uniform1f(he.uniforms.value,t.PRESSURE),ue(ee.write),ee.swap(),X.bind(),a.uniform2f(X.uniforms.texelSize,Se.texelSizeX,Se.texelSizeY),a.uniform1i(X.uniforms.uDivergence,at.attach(0));for(let q=0;q<t.PRESSURE_ITERATIONS;q++)a.uniform1i(X.uniforms.uPressure,ee.read.attach(1)),ue(ee.write),ee.swap();$.bind(),a.uniform2f($.uniforms.texelSize,Se.texelSizeX,Se.texelSizeY),a.uniform1i($.uniforms.uPressure,ee.read.attach(0)),a.uniform1i($.uniforms.uVelocity,Se.read.attach(1)),ue(Se.write),Se.swap(),Ze.bind(),a.uniform2f(Ze.uniforms.texelSize,Se.texelSizeX,Se.texelSizeY),o.supportLinearFiltering||a.uniform2f(Ze.uniforms.dyeTexelSize,Se.texelSizeX,Se.texelSizeY);let Z=Se.read.attach(0);a.uniform1i(Ze.uniforms.uVelocity,Z),a.uniform1i(Ze.uniforms.uSource,Z),a.uniform1f(Ze.uniforms.dt,D),a.uniform1f(Ze.uniforms.dissipation,t.VELOCITY_DISSIPATION),ue(Se.write),Se.swap(),o.supportLinearFiltering||a.uniform2f(Ze.uniforms.dyeTexelSize,Ge.texelSizeX,Ge.texelSizeY),a.uniform1i(Ze.uniforms.uVelocity,Se.read.attach(0)),a.uniform1i(Ze.uniforms.uSource,Ge.read.attach(1)),a.uniform1f(Ze.uniforms.dissipation,t.DENSITY_DISSIPATION),ue(Ge.write),Ge.swap()}function ae(D){t.BLOOM&&ut(Ge.read,ye),t.SUNRAYS&&(_n(Ge.read,Ge.write,Ae),wn(Ae,qe,1)),D==null||!t.TRANSPARENT?(a.blendFunc(a.ONE,a.ONE_MINUS_SRC_ALPHA),a.enable(a.BLEND)):a.disable(a.BLEND),t.TRANSPARENT||ke(D,Ns(t.BACK_COLOR)),D==null&&t.TRANSPARENT&&(a.bindFramebuffer(a.FRAMEBUFFER,null),a.viewport(0,0,a.drawingBufferWidth,a.drawingBufferHeight),a.clearColor(0,0,0,0),a.clear(a.COLOR_BUFFER_BIT)),_t(D)}function ke(D,Z){de.bind(),a.uniform4f(de.uniforms.color,Z.r,Z.g,Z.b,1),ue(D)}function Ne(D){ge.bind(),a.uniform1f(ge.uniforms.aspectRatio,s.width/s.height),ue(D)}function _t(D){let Z=D==null?a.drawingBufferWidth:D.width,q=D==null?a.drawingBufferHeight:D.height;if(ce.bind(),t.SHADING&&a.uniform2f(ce.uniforms.texelSize,1/Z,1/q),a.uniform1i(ce.uniforms.uTexture,Ge.read.attach(0)),t.BLOOM){a.uniform1i(ce.uniforms.uBloom,ye.attach(1)),a.uniform1i(ce.uniforms.uDithering,ht.attach(2));let _=ro(ht,Z,q);a.uniform2f(ce.uniforms.ditherScale,_.x,_.y)}t.SUNRAYS&&a.uniform1i(ce.uniforms.uSunrays,Ae.attach(3)),ue(D)}function ut(D,Z){if(ze.length<2)return;let q=Z;a.disable(a.BLEND),Ve.bind();let _=t.BLOOM_THRESHOLD*t.BLOOM_SOFT_KNEE+1e-4,P=t.BLOOM_THRESHOLD-_,G=_*2,O=.25/_;a.uniform3f(Ve.uniforms.curve,P,G,O),a.uniform1f(Ve.uniforms.threshold,t.BLOOM_THRESHOLD),a.uniform1i(Ve.uniforms.uTexture,D.attach(0)),ue(q),Ue.bind();for(let V=0;V<ze.length;V++){let le=ze[V];a.uniform2f(Ue.uniforms.texelSize,q.texelSizeX,q.texelSizeY),a.uniform1i(Ue.uniforms.uTexture,q.attach(0)),ue(le),q=le}a.blendFunc(a.ONE,a.ONE),a.enable(a.BLEND);for(let V=ze.length-2;V>=0;V--){let le=ze[V];a.uniform2f(Ue.uniforms.texelSize,q.texelSizeX,q.texelSizeY),a.uniform1i(Ue.uniforms.uTexture,q.attach(0)),a.viewport(0,0,le.width,le.height),ue(le),q=le}a.disable(a.BLEND),We.bind(),a.uniform2f(We.uniforms.texelSize,q.texelSizeX,q.texelSizeY),a.uniform1i(We.uniforms.uTexture,q.attach(0)),a.uniform1f(We.uniforms.intensity,t.BLOOM_INTENSITY),ue(Z)}function _n(D,Z,q){a.disable(a.BLEND),$e.bind(),a.uniform1i($e.uniforms.uTexture,D.attach(0)),ue(Z),U.bind(),a.uniform1f(U.uniforms.weight,t.SUNRAYS_WEIGHT),a.uniform1i(U.uniforms.uTexture,Z.attach(0)),ue(q)}function wn(D,Z,q){te.bind();for(let _=0;_<q;_++)a.uniform2f(te.uniforms.texelSize,D.texelSizeX,0),a.uniform1i(te.uniforms.uTexture,D.attach(0)),ue(Z),a.uniform2f(te.uniforms.texelSize,0,D.texelSizeY),a.uniform1i(te.uniforms.uTexture,Z.attach(0)),ue(D)}function zc(D){let Z=D.deltaX*t.SPLAT_FORCE,q=D.deltaY*t.SPLAT_FORCE;Or(D.texcoordX,D.texcoordY,Z,q,D.color)}function Vc(D){for(let Z=0;Z<D;Z++){let q=Ds();q.r*=10,q.g*=10,q.b*=10;let _=Math.random(),P=Math.random(),G=1e3*(Math.random()-.5),O=1e3*(Math.random()-.5);Or(_,P,G,O,q)}}function Or(D,Z,q,_,P){Ye.bind(),a.uniform1i(Ye.uniforms.uTarget,Se.read.attach(0)),a.uniform1f(Ye.uniforms.aspectRatio,s.width/s.height),a.uniform2f(Ye.uniforms.point,D,Z),a.uniform3f(Ye.uniforms.color,q,_,0),a.uniform1f(Ye.uniforms.radius,es(t.SPLAT_RADIUS/100)),ue(Se.write),Se.swap(),a.uniform1i(Ye.uniforms.uTarget,Ge.read.attach(0)),a.uniform3f(Ye.uniforms.color,P.r,P.g,P.b),ue(Ge.write),Ge.swap()}function es(D){let Z=s.width/s.height;return Z>1&&(D*=Z),D}function Td(D,Z,q,_){D.id=Z,D.down=!0,D.moved=!1,D.texcoordX=q/s.width,D.texcoordY=1-_/s.height,D.prevTexcoordX=D.texcoordX,D.prevTexcoordY=D.texcoordY,D.deltaX=0,D.deltaY=0,D.color=Ds()}function Gc(D,Z,q){D.prevTexcoordX=D.texcoordX,D.prevTexcoordY=D.texcoordY,D.texcoordX=Z/s.width,D.texcoordY=1-q/s.height,D.deltaX=di(D.texcoordX-D.prevTexcoordX),D.deltaY=Br(D.texcoordY-D.prevTexcoordY),D.moved=Math.abs(D.deltaX)>0||Math.abs(D.deltaY)>0}function Hc(D){D.down=!1}function di(D){let Z=s.width/s.height;return Z<1&&(D*=Z),D}function Br(D){let Z=s.width/s.height;return Z>1&&(D/=Z),D}function Ds(){let D=io(Math.random(),1,1);return D.r*=.15,D.g*=.15,D.b*=.15,D}function io(D,Z,q){let _,P,G,O,V,le,Te,xe;switch(O=Math.floor(D*6),V=D*6-O,le=q*(1-Z),Te=q*(1-V*Z),xe=q*(1-(1-V)*Z),O%6){case 0:_=q,P=xe,G=le;break;case 1:_=Te,P=q,G=le;break;case 2:_=le,P=q,G=xe;break;case 3:_=le,P=Te,G=q;break;case 4:_=xe,P=le,G=q;break;case 5:_=q,P=le,G=Te;break}return{r:_,g:P,b:G}}function Ns(D){return{r:D.r/255,g:D.g/255,b:D.b/255}}function so(D,Z,q){let _=q-Z;return _==0?Z:(D-Z)%_+Z}function fi(D){let Z=a.drawingBufferWidth/a.drawingBufferHeight;Z<1&&(Z=1/Z);let q=Math.round(D),_=Math.round(D*Z);return a.drawingBufferWidth>a.drawingBufferHeight?{width:_,height:q}:{width:q,height:_}}function ro(D,Z,q){return{x:Z/D.width,y:q/D.height}}function kr(D){let Z=Math.min(window.devicePixelRatio||1,e.maxPixelRatio||2);return Math.floor(D*Z)}function Wc(D){if(D.length==0)return 0;let Z=0;for(let q=0;q<D.length;q++)Z=(Z<<5)-Z+D.charCodeAt(q),Z|=0;return Z}let Xc=e.fieldFactory?.({gl:a,Program:f,baseVertexShader:S,compileShader:g,blit:ue,velocity:()=>Se,dye:()=>Ge});return{fields(D,Z,q){Xc?.(D,Z,q)},tick(D){ve()&&me(),Re(Math.min(D,.05)),ae(null)},seed(D,Z,q,_=.8){Ye.bind(),a.uniform1f(Ye.uniforms.aspectRatio,s.width/s.height),a.uniform2f(Ye.uniforms.point,D,Z),a.uniform1f(Ye.uniforms.radius,es(_/100)),a.uniform1i(Ye.uniforms.uTarget,Ge.read.attach(0)),a.uniform3f(Ye.uniforms.color,q,q*.96,q*.9),ue(Ge.write),Ge.swap()},stir(D,Z,q,_,P=1){Ye.bind(),a.uniform1f(Ye.uniforms.aspectRatio,s.width/s.height),a.uniform2f(Ye.uniforms.point,D,Z),a.uniform1f(Ye.uniforms.radius,es(P/100)),a.uniform1i(Ye.uniforms.uTarget,Se.read.attach(0)),a.uniform3f(Ye.uniforms.color,q,_,0),ue(Se.write),Se.swap()},resolution(){return{width:Se.width,height:Se.height}},dispose(){a.getExtension("WEBGL_lose_context")?.loseContext()}}}function bc(s){return({gl:e,Program:t,baseVertexShader:n,compileShader:i,blit:r,velocity:a,dye:o})=>{let l=`precision highp float;precision highp sampler2D;
 varying vec2 vUv;uniform sampler2D uTarget;
 uniform float time,dt,aspect,mode,cells,interactionGain;
 uniform vec4 edges,keeper,regions[8],currents[4],winds[4];uniform vec2 span;
 ${s}
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
 }`,c=new t(n,i(e.FRAGMENT_SHADER,l));return(h,u,d)=>{c.bind();let f=c.uniforms;e.uniform1f(f.time,h),e.uniform1f(f.dt,u),e.uniform1f(f.aspect,e.canvas.width/e.canvas.height),e.uniform4fv(f.edges,d.edges),e.uniform4fv(f.keeper,d.keeper),e.uniform4fv(f["regions[0]"],d.regions),e.uniform4fv(f["currents[0]"],d.currents),e.uniform4fv(f["winds[0]"],d.winds),e.uniform2fv(f.span,d.span),e.uniform1f(f.cells,a().height),e.uniform1f(f.interactionGain,d.interactionGain);for(let[m,y]of[[0,a()],[1,o()]])e.uniform1f(f.mode,m),e.uniform1i(f.uTarget,y.read.attach(0)),r(y.write),y.swap()}}}var Tc=(s,e,t)=>Math.max(e,Math.min(t,s)),wc=s=>({x:(s.x+.3)/1.6,y:(s.y+.15)/1.3}),Ec=s=>s&&Number.isFinite(s.x)&&Number.isFinite(s.y),Yn=1/30,Ac=class{constructor(e,{interactionGain:t=1}={}){this.canvas=e,this.enabled=!0,this.time=0,this.pending=0,this.frames=0,this.previous=null,this.interactionEnergy=0,this.randomState=87775857,this.drive=[0,0,0,0],this.interactionGain=t,this.clouds=Array.from({length:8},()=>this.cloud(!0)),this.patches=Array.from({length:4},(n,i)=>this.patch(i,!0))}random(){return this.randomState=Math.imul(this.randomState,1664525)+1013904223>>>0,this.randomState/4294967296}cloud(e=!1){let t=13+this.random()*19;return{x:.08+this.random()*.84,y:.03+this.random()*.94,r:.16+this.random()*.19,amplitude:.38+this.random()*.43,phase:this.random()*6.28,birth:e?-this.random()*t:this.time,life:t}}patch(e,t=!1){let n=17+this.random()*18;return{i:e,x:(e%2?.72:.28)+(this.random()-.5)*.12,y:(e<2?.26:.74)+(this.random()-.5)*.14,r:.23+this.random()*.18,speed:.025+this.random()*.035,angle:this.random()*6.28,phase:this.random()*6.28,rate:.34+this.random()*.32,birth:t?-this.random()*n:this.time,life:n}}fields(){this.clouds=this.clouds.map(i=>this.time-i.birth>=i.life?this.cloud():i),this.patches=this.patches.map(i=>this.time-i.birth>=i.life?this.patch(i.i):i);let e=[],t=[],n=[];for(let i of this.clouds){let r=Tc((this.time-i.birth)/i.life,0,1),a=Math.sin(Math.PI*r)**2;e.push(i.x+.045*Math.sin(this.time*.11+i.phase),i.y+.035*Math.cos(this.time*.15+i.phase),i.r*(.85+.3*r),i.amplitude*a)}for(let i of this.patches){let r=Tc((this.time-i.birth)/i.life,0,1),a=Math.sin(Math.PI*r)**2,o=.82+.47*Math.sin(this.time*i.rate+i.phase)+.22*Math.sin(this.time*i.rate*1.73+i.phase*2.1),l=i.angle+.5*Math.sin(this.time*.13+i.phase),c=i.speed*a*o;t.push(i.x+.07*Math.sin(this.time*.085+i.phase),i.y+.05*Math.cos(this.time*.12+i.phase),i.r,a*o),n.push(Math.cos(l)*c,Math.sin(l)*c,i.phase,l)}return this.currentWinds=n,{regions:e,currents:t,winds:n}}async prepare(){let e=await fetch(new URL("../chapter-scroll-v17/vendor/noise2D.glsl",import.meta.url));if(!e.ok)throw Error("Atmosphere noise source unavailable");this.fluid=Sc(this.canvas,{simResolution:96,dyeResolution:512,maxPixelRatio:1.5,densityDissipation:.22,curl:.38,fieldFactory:bc(await e.text())});for(let[t,n,i]of[[.18,.32,.55],[.83,.68,.6],[.3,.79,.34],[.65,.2,.3]])this.fluid.seed(t,n,i,3);for(let t=0;t<60;t++)this.time+=Yn,this.fluid.fields(this.time,Yn,{edges:[-2,0,-2,0],keeper:[-2,-2,0,0],span:[0,1],...this.fields(),interactionGain:this.interactionGain}),this.fluid.tick(Yn),t%6===5&&await new Promise(requestAnimationFrame);this.resetMotion()}tick(e,t,n,i,r,a){if(!this.fluid||!this.enabled)return;this.pending+=Tc(Number.isFinite(r)?r:e,0,.1);let o=Math.min(3,Math.floor((this.pending+1e-7)/Yn));if(!o)return;if(!Ec(a?.top?.[0])||!Ec(a?.top?.[1])||!Ec(a?.bottom?.[0])){this.resetMotion();return}let l=wc(a.top[0]),c=wc(a.bottom[0]),h=wc(a.top[1]),u=Ec(a.keeper)?wc(a.keeper):null;u&&(u.x<.02||u.x>.98||u.y<.02||u.y>.98)&&(u=null);let d=o*Yn,f=a.paperProgress,m=this.previous&&Math.abs(t-this.previous.progress)<.12&&Math.abs(i-this.previous.viewHeight)<.001,y=m&&f>.015&&f<.999,g=[y?(l.y-this.previous.top)/d:0,y?(c.y-this.previous.bottom)/d:0,u&&m&&this.previous.keeper?(u.x-this.previous.keeper.x)/d:0,u&&m&&this.previous.keeper?(u.y-this.previous.keeper.y)/d:0];for(let p=0;p<o;p++){this.time+=Yn,this.pending-=Yn;let S=1-Math.exp(-Yn/.065);this.drive=this.drive.map((E,M)=>E+(Tc(Number.isFinite(g[M])?g[M]:0,-.32,.32)-E)*S),this.fluid.fields(this.time,Yn,{edges:[l.y,this.drive[0],c.y,this.drive[1]],span:[l.x,h.x],keeper:u?[u.x,u.y,this.drive[2],this.drive[3]]:[-2,-2,0,0],...this.fields(),interactionGain:this.interactionGain}),this.interactionEnergy+=this.drive.reduce((E,M)=>E+Math.abs(M),0)*Yn,this.fluid.tick(Yn),this.frames++}this.previous={top:l.y,bottom:c.y,keeper:u,progress:t,viewHeight:i}}resetMotion(){this.previous=null,this.pending=0,this.drive=[0,0,0,0]}setEnabled(e){this.enabled=!!e,this.canvas.hidden=!e,this.resetMotion()}snapshot(){return{available:!!this.fluid,enabled:this.enabled,frames:this.frames,time:this.time,interactionEnergy:this.interactionEnergy,drive:[...this.drive],model:"advected mist with broad regional currents, staggered gusts and bounded object wakes",simulationHz:30,fixedDirectionalInlet:!1,regionalVelocities:this.currentWinds?.filter((e,t)=>t%4<2),confinement:.38}}dispose(){this.fluid?.dispose()}};var Rc=class extends Ac{constructor(e,{signal:t}={}){super(e),this.controller=new AbortController,this.signal=t?AbortSignal.any([t,this.controller.signal]):this.controller.signal}check(){if(this.signal.aborted)throw new DOMException("Atmosphere preparation cancelled","AbortError")}frame(){return new Promise((e,t)=>{this.check();let n,i=()=>{cancelAnimationFrame(n),t(new DOMException("Atmosphere preparation cancelled","AbortError"))};this.signal.addEventListener("abort",i,{once:!0}),n=requestAnimationFrame(()=>{this.signal.removeEventListener("abort",i),e()})})}async prepare(){let e=await fetch(new URL("../chapter-scroll-v17/vendor/noise2D.glsl",import.meta.url),{signal:this.signal});if(!e.ok)throw Error("Atmosphere noise source unavailable");let t=await e.text();this.check(),this.fluid=Sc(this.canvas,{simResolution:96,dyeResolution:512,maxPixelRatio:1.5,densityDissipation:.22,curl:.38,fieldFactory:bc(t)});for(let[i,r,a]of[[.18,.32,.55],[.83,.68,.6],[.3,.79,.34],[.65,.2,.3]])this.fluid.seed(i,r,a,3);let n=1/30;for(let i=0;i<60;i++)this.check(),this.time+=n,this.fluid.fields(this.time,n,{edges:[-2,0,-2,0],keeper:[-2,-2,0,0],span:[0,1],...this.fields(),interactionGain:this.interactionGain}),this.fluid.tick(n),i%6===5&&await this.frame();this.check(),this.resetMotion()}dispose(){this.controller.abort(),super.dispose()}};var Cc=class{constructor(e,t,n){this.from=e,this.to=t,this.duration=Math.max(280,Math.abs(t-e)*5600),this.elapsed=0,this.previous=n}sample(e){this.elapsed+=Math.max(0,Math.min(50,e-this.previous)),this.previous=e;let t=Math.min(1,this.elapsed/this.duration),n=t*t*(3-2*t);return{progress:this.from+(this.to-this.from)*n,done:t===1}}resume(e){this.previous=e}};function nm(s){let e={...As(s)};for(let t of["fontUrl","skin","reverse","keeper","paperNormal","paperRoughness","environment","ornament"])e[t]=new URL(e[t],new URL("../chapter-scroll-v14/",import.meta.url)).href;return e}var qa=Object.freeze({id:"second-language-owner",displayName:"Gual Wells"});function ad(s){let e=[[1e3,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];if(s>3999)return String(s);let t="";for(let[n,i]of e)for(;s>=n;)t+=i,s-=n;return t}function im(s){if(typeof s!="string"||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(Z|[+-]\d{2}:\d{2})$/.test(s))return!1;let e=s.slice(23),t=e==="Z"?0:Number(e.slice(1,3)),n=e==="Z"?0:Number(e.slice(4,6));if(t>14||n>59||t===14&&n!==0)return!1;let i=Date.parse(s),r=e==="Z"?0:(e[0]==="+"?1:-1)*(t*60+n);return Number.isFinite(i)&&new Date(i+r*6e4).toISOString().slice(0,23)===s.slice(0,23)}function od(s){if(!s||!["specimen","issued"].includes(s.status)||!s.chapterId||!Number.isSafeInteger(s.chapterNumber)||s.chapterNumber<1||!s.displayTitle?.trim()||!/^[a-f0-9]{64}$/.test(s.chapterDigest))throw Error("Invalid charter identity");if(s.status==="specimen"){if(s.attestation!==null||!im(s.proof?.sampleTime))throw Error("Proof requires a separate sample timestamp and no attestation")}else{let e=s.attestation;if(s.proof||!e||!e.id||!e.attemptId||!e.assessmentVersion||e.allCorrect!==!0||!im(e.passedAt)||e.recipientId!==qa.id||typeof e.recipientName!="string"||!e.recipientName.trim()||e.recipientName.length>120)throw Error("Issued charter requires the immutable passing event and recipient snapshot")}return s}function sm(s){if(od(s),!/^[a-f0-9]{64}$/.test(s.artifactDigest))throw Error("Prepare the charter before rendering its digest");let e=new Date(s.attestation?.passedAt??s.proof.sampleTime),t=Object.fromEntries(new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Shanghai",year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"}).formatToParts(e).map(n=>[n.type,n.value]));return[s.artifactDigest.slice(0,16).toUpperCase().match(/.{4}/g).join(" "),`${t.day} ${t.month} ${t.year}`,`${t.hour}:${t.minute}:${t.second}.${String(e.getUTCMilliseconds()).padStart(3,"0")}  +08:00`]}var mM="SL-MEMENTO-14",rm=async s=>[...new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s)))].map(e=>e.toString(16).padStart(2,"0")).join("");function ld(s){od(s);let e=As(s.template),t=s.artPlan;if(s.sealVariant!=="oblong"||!t||t.schema!=="second-language.art-plan.v1"||t.source.chapterId!==s.chapterId||t.source.chapterDigest!==s.chapterDigest||t.source.chapterNumber!==s.chapterNumber||t.copy.chapterEnglishTitle!==s.displayTitle||t.resources.ornament.sha256!==e.ornamentDigest||s.artPlanDigest!==e.planDigest)throw Error("Chapter artwork and record do not match");return s}function Ya(s){ld(s);let e=s.status==="issued"?s.attestation.recipientName:qa.displayName,t=`Chapter ${ad(s.chapterNumber)}`,n=s.artPlan.copy;return{institution:"The Second Language",chapter:t,title:n.artTitle,titleLines:n.artTitleLines,chapterTitle:s.displayTitle,recipient:e,stanzas:n.stanzas,paragraphs:n.stanzas.map(i=>i.join(`
`)),colophon:[`For ${e}, in remembrance of ${t}`,"and its trial successfully completed."],sealLegends:["The Second Language","In remembrance"],note:s.status==="issued"?"":"Specimen \u2014 Not issued",issued:s.status==="issued"}}function gM(s){let e=Ya(s),t=s.attestation,n=As(s.template);return JSON.stringify(["second-language.memento.v3",s.status,s.chapterId,s.chapterNumber,s.chapterDigest,s.chapterTitle,s.displayTitle,qa.id,e.recipient,t?.id??null,t?.attemptId??null,t?.assessmentVersion??null,t?.allCorrect??null,new Date(t?.passedAt??s.proof.sampleTime).toISOString(),mM,s.template,s.artPlanDigest,n.ornamentDigest,s.sealVariant,e.institution,e.chapter,e.title,e.chapterTitle,e.stanzas,e.colophon,e.sealLegends,e.note])}async function am(s,e){let t=await rm(e),n={...s,artPlan:JSON.parse(e),artPlanDigest:t};if(ld(n),n.artPlan.copy.artTitleLines.join(" ")!==n.artPlan.copy.artTitle)throw Error("Artistic title line breaks do not match title");let i=gM(n);return{...n,canonicalPayload:i,artifactDigest:await rm(i),recipient:Ya(n).recipient}}function cd(s){return ld(s),sm(s)}var ud=(s,e=0,t=1)=>Math.max(e,Math.min(t,s));function Ic(s,e,t=0){let n=Math.imul(s,374761393)^Math.imul(e,668265263)^t;return n=Math.imul(n^n>>>13,1274126177),((n^n>>>16)>>>0)/4294967295}function Pc(s,e,t=0){let n=Math.floor(s),i=Math.floor(e),r=s-n,a=e-i,o=r*r*(3-2*r),l=a*a*(3-2*a),c=(h,u,d)=>h+(u-h)*d;return c(c(Ic(n,i,t),Ic(n+1,i,t),o),c(Ic(n,i+1,t),Ic(n+1,i+1,t),o),l)}var hd=(s,e,t,n,i,r)=>Math.exp(-(((s-t)/i)**2+((e-n)/r)**2));function dd(s,e){let{width:t,height:n}=s,i=s.getContext("2d",{willReadFrequently:!0}),r=i.getImageData(0,0,t,n),a=document.createElement("canvas");a.width=t,a.height=n;let o=a.getContext("2d"),l=o.createImageData(t,n),c=t/2-384,h=0,u=0,d=0;for(let f=0;f<n;f++)for(let m=0;m<t;m++){let y=(f*t+m)*4,g=r.data[y+3]/255,p=.96+.12*(Pc(m/100,f/100,e)-.5),S=Pc(m/3.5,f/3.5,e^8127),E=hd(m-c,f-c,551,436,24,61)*.63+hd(m-c,f-c,111,180,29,47)*.35+hd(m-c,f-c,464,722,31,12)*.32,M=ud(p+.06*(S-.5)-E,.14,1);Pc(m/2,f/2,e^451)>.8&&S>.64&&(M*=.12);let T=.5+.5*Pc(m/49,f/49,e^713),C=ud(g*M);l.data[y]=Math.round(14+T*10),l.data[y+1]=Math.round(9+T*7),l.data[y+2]=Math.round(6+T*4),l.data[y+3]=Math.round(C*255),g>.4&&(d++,M<.5&&h++,M<.72&&u++)}return o.putImageData(l,0,0),{ink:a,stats:{markedPixels:d,lowContactPixels:h,variableContactPixels:u}}}function om(s,e){let t=new Uint8ClampedArray(s.data),n=s.width,i=s.height;for(let r=0;r<i;r++)for(let a=0;a<n;a++){let o=(r*n+a)*4,l=e.data[o+3]/255;if(!l)continue;let c=(Math.min(i-1,r+2)*n+Math.min(n-1,a+2))*4,h=(s.data[o]+s.data[o+1]+s.data[o+2])/3,u=(s.data[c]+s.data[c+1]+s.data[c+2])/3,d=ud(.98+(h-u)*.004,.77,1.04),f=l*d;for(let m=0;m<3;m++)t[o+m]=Math.round(s.data[o+m]*(1-f*(1-e.data[o+m]/255)))}return new ImageData(t,n,i)}var fd="SL-KEEPSAKE-1",lm=896,Is=(s=lm,e=lm)=>Object.assign(document.createElement("canvas"),{width:s,height:e}),Lc;async function pd(){let s=new Image;s.src="../chapter-scroll-v10/assets/ink-shoulder.png",await s.decode(),Lc=Is(256,480);let e=Lc.getContext("2d",{willReadFrequently:!0});e.drawImage(s,s.width*.28,s.height*.07,s.width*.45,s.height*.84,0,0,256,480);let t=e.getImageData(0,0,256,480);for(let n=0;n<t.data.length;n+=4)t.data[n+3]*=1-(t.data[n]+t.data[n+1]+t.data[n+2])/765,t.data[n]=t.data[n+1]=t.data[n+2]=255;e.putImageData(t,0,0)}function cm(s,e,t,n,i,r){s.font=`${r}px Aboensis`,s.textAlign="center";let a=[...e],o=a.map(c=>s.measureText(c).width),l=-o.reduce((c,h)=>c+h,0)/2;for(let c=0;c<a.length;c++){let h=n+(i?-1:1)*(l+o[c]/2)/t;s.save(),s.translate(448+Math.cos(h)*t,448+Math.sin(h)*t),s.rotate(h+(i?-Math.PI/2:Math.PI/2)),s.fillText(a[c],0,0),s.restore(),l+=o[c]}}function hm(s,e="oblong"){if(!Lc)throw Error("Ink texture not ready");let t=Is(),n=t.getContext("2d");n.fillStyle=n.strokeStyle="white",n.textAlign="center",n.lineCap="round";let i;if(e==="oblong"){n.lineWidth=8.5,n.beginPath(),n.moveTo(100,304),n.bezierCurveTo(340,301,579,305,796,303),n.lineTo(797,576),n.bezierCurveTo(590,578,340,573,99,577),n.closePath(),n.stroke();for(let[u,d,f]of[["The Second Language",410,80],["In remembrance",527,72]]){let m=f,y;do{if(n.font=`${m}px Aboensis`,y=n.measureText(u),y.actualBoundingBoxLeft+y.actualBoundingBoxRight<=620)break;m-=2}while(m>=58);if(m<58)throw Error("Stamp lettering requires another die layout");n.fillText(u,448,d)}i={x:56,y:260,width:784,height:360}}else if(e==="round"){for(let[u,d]of[[330,10],[306,3.5]]){n.lineWidth=d,n.beginPath();for(let f=0;f<=512;f++){let m=f/512*Math.PI*2,y=u+1.4*Math.sin(m*3)+.7*Math.cos(m*11),g=448+Math.cos(m)*y,p=448+Math.sin(m)*y;f?n.lineTo(g,p):n.moveTo(g,p)}n.closePath(),n.stroke()}cm(n,"The Second Language",249,-Math.PI/2,!1,69),cm(n,"In remembrance",250,Math.PI/2,!0,60),n.font="192px Aboensis",n.fillText("SL",448,514),i={x:52,y:52,width:792,height:792}}else throw Error("Unknown stamp");n.save(),n.globalCompositeOperation="destination-out",n.lineWidth=1.7;for(let[u,d,f,m]of[[100,337,18,7],[589,305,12,21],[794,540,15,-10]])n.beginPath(),n.moveTo(u,d),n.lineTo(u+f,d+m),n.stroke();n.restore();let r=dd(t,s),a=Is(),o=a.getContext("2d");o.save(),o.filter="blur(2px)",o.globalAlpha=.25,o.drawImage(r.ink,0,0),o.restore(),o.globalCompositeOperation="destination-out",o.drawImage(t,0,0),o.globalCompositeOperation="source-over",o.drawImage(r.ink,0,0);let l=Is(),c=l.getContext("2d");c.save(),c.translate(e==="round"?772:792,e==="round"?606:532),c.rotate(-.3),c.drawImage(Lc,-21,-39,42,78),c.restore(),o.globalAlpha=.74,o.drawImage(dd(l,s^9071).ink,0,0),o.globalAlpha=1;let h=u=>{let d=Is(i.width,i.height);return d.getContext("2d").drawImage(u,i.x,i.y,i.width,i.height,0,0,i.width,i.height),d};return{mask:h(t),ink:h(a),seed:s,variant:e,version:fd,stats:r.stats}}function um(s,e,t,n){let i=Is(n.width,n.height),r=i.getContext("2d",{willReadFrequently:!0});r.drawImage(t.ink,0,0,n.width,n.height);let a=s.getContext("2d");a.putImageData(om(a.getImageData(n.x,n.y,n.width,n.height),r.getImageData(0,0,n.width,n.height)),n.x,n.y);let o=e.getContext("2d");o.fillStyle="#808080",o.fillRect(0,0,e.width,e.height);let l=Is(t.mask.width,t.mask.height),c=l.getContext("2d");c.drawImage(t.mask,0,0),c.globalCompositeOperation="source-in",c.fillStyle="#303030",c.fillRect(0,0,l.width,l.height),o.save(),o.globalAlpha=.52,o.filter="blur(.7px)",o.drawImage(l,n.x,n.y,n.width,n.height),o.restore()}function md(s){let e=Ya(s);return[e.chapter,e.title,e.chapterTitle,...e.paragraphs,e.colophon.join(" "),...e.sealLegends,...cd(s),e.note].filter(Boolean)}function dm(s,e){s.replaceChildren();for(let[t,n]of md(e).entries()){let i=document.createElement(t===1?"h3":"p");i.textContent=n,i.style.whiteSpace="pre-line",s.append(i)}}function fm(s,e,t,n,i){let r=Ya(s),a=s.artPlan,o=a.layout,l=o.width,c=o.height,h=parseInt(s.artifactDigest.slice(0,8),16);if(l!==2048||c!==2868)throw Error("This paper size needs a verified scroll geometry");let u=()=>Object.assign(document.createElement("canvas"),{width:l,height:c}),d=u(),f=u(),m=u(),y=u(),g=d.getContext("2d"),p=m.getContext("2d");for(let[I,B]of[[d,e],[f,t]]){let F=I.getContext("2d");F.save(),a.resources.paper.variant==="mirror-x"&&(F.translate(l,0),F.scale(-1,1)),F.drawImage(B,0,0,l,c),F.restore()}if(!i)throw Error("Chapter miniature missing");let S=o.ornament,E=Math.min(S.width/i.width,S.height/i.height),M=i.width*E,b=i.height*E;g.globalCompositeOperation="source-atop",g.globalAlpha=S.opacity,g.drawImage(i,S.x+(S.width-M)/2,S.y+(S.height-b)/2,M,b),g.globalAlpha=1;let T=cd(s),C={chapter:[r.chapter],artTitle:r.titleLines,chapterTitle:[r.chapterTitle],stanza1:r.stanzas[0],stanza2:r.stanzas[1],colophon:r.colophon,identity:[T[1],T[2],T[0]],status:[r.note]},x=[],w=o.textSafeRect;for(let I of o.blocks){let B=C[I.id];if(!Array.isArray(B)||!["left","center"].includes(I.align)||!Number.isFinite(I.fontSize)||I.fontSize<40)throw Error("Unsupported artwork text block");p.font=`${I.fontSize}px ${n.fontFamily}`,p.textAlign=I.align,p.textBaseline="alphabetic",p.fillStyle=I.color;for(let[F,R]of B.entries()){if(!R)continue;let k=I.y+F*I.lineHeight,W=p.measureText(R),Y=I.x-W.actualBoundingBoxLeft,re=I.x+W.actualBoundingBoxRight,K=k-W.actualBoundingBoxAscent,Q=k+W.actualBoundingBoxDescent;if(re-Y>I.width||Y<w.x||re>w.x+w.width||K<w.y||Q>w.y+w.height)throw Error(`The ${I.id} requires another composition`);if((I.id==="stanza1"||I.id==="stanza2")&&K<o.reservedOrnamentBottom)throw Error("Verse overlaps miniature");p.fillText(R,I.x,k),x.push({block:I.id,text:R,left:Y,right:re,top:K,bottom:Q})}}for(let I=0;I<x.length;I++)for(let B=I+1;B<x.length;B++){let F=x[I],R=x[B];if(F.left<R.right&&F.right>R.left&&F.top<R.bottom&&F.bottom>R.top)throw Error(`Text blocks overlap: ${F.block}/${R.block}`)}p.globalCompositeOperation="destination-out",p.globalAlpha=.075;for(let I=0;I<2300;I++)p.fillRect((I*719.27+h%103)%l,(I*437.71+h%71)%c,.6,.8);p.globalAlpha=1,p.globalCompositeOperation="source-over";let L=hm(h,"oblong");return um(d,y,L,o.seal),g.globalCompositeOperation="source-atop",g.drawImage(m,0,0),{front:d,back:f,ink:m,relief:y,seal:L,layout:{width:l,height:c,nominalSizeMM:o.nominalSizeMM,artPlanId:a.id,artPlanDigest:s.artPlanDigest,composition:"horizontal-miniature-and-centered-verse",paperVariant:a.resources.paper.variant,sealVersion:fd,sealVariant:"oblong",sealBox:o.seal,ornamentBox:S,ornamentDigest:n.ornamentDigest,printedFonts:[n.fontFamily],textBounds:x,issued:r.issued,recipient:r.recipient,identity:T,artifactDigest:s.artifactDigest,artSeed:h}}}var Dc=class{constructor(){this.controller=new AbortController,this.items=new Set,this.images=new WeakSet,this.loadedImages=new Set,this.fonts=new Set,this.disposed=!1}assertAlive(){if(this.disposed)throw new DOMException("The scroll viewer was disposed","AbortError")}own(e){return e&&(this.disposed?(this.release(e),e):(this.items.has(e)||this.items.add(e),e))}release(e){try{e.dispose?.()}catch{}e.isTexture&&this.releaseImage(e.image)}releaseImage(e){e&&(this.loadedImages.delete(e),!this.images.has(e)&&(this.images.add(e),e instanceof HTMLImageElement?e.removeAttribute("src"):e.close?.()))}material(e){for(let t of Array.isArray(e)?e:[e])if(t){this.own(t);for(let n of Object.values(t))n?.isTexture&&this.own(n);for(let n of Object.values(t.uniforms||{}))n?.value?.isTexture&&this.own(n.value)}}scene(e){return e?.traverse(t=>{this.own(t.geometry),this.material(t.material),this.material(t.customDepthMaterial),this.material(t.customDistanceMaterial),this.own(t.skeleton?.boneTexture),this.own(t.shadow)}),e}async bytes(e){this.assertAlive();let t=await fetch(e,{signal:AbortSignal.any([this.controller.signal,AbortSignal.timeout(3e4)])});if(!t.ok)throw Error(`Scroll resource unavailable (${t.status}): ${new URL(e,location.href).pathname}`);let n=await t.arrayBuffer();return this.assertAlive(),n}async json(e){return JSON.parse(new TextDecoder().decode(await this.bytes(e)))}async text(e){return new TextDecoder().decode(await this.bytes(e))}async image(e){let t=await this.bytes(e),n=URL.createObjectURL(new Blob([t])),i=new Image;this.loadedImages.add(i);try{return i.src=n,await i.decode(),this.disposed&&(this.releaseImage(i),this.assertAlive()),i}finally{URL.revokeObjectURL(n)}}async texture(e,t){let n=await this.image(e),i=this.own(new Nt(n));return i.needsUpdate=!0,t?.(i),this.assertAlive(),i}async font(e,t){let n=new FontFace(e,await this.bytes(t));return await n.load(),this.assertAlive(),document.fonts.add(n),this.fonts.add(n),n}dispose(){if(!this.disposed){this.disposed=!0,this.controller.abort();for(let e of this.fonts)document.fonts.delete(e);this.fonts.clear();for(let e of this.items)e.isWebGLRenderer||this.release(e);for(let e of this.loadedImages)this.releaseImage(e);for(let e of this.items)e.isWebGLRenderer&&this.release(e);this.items.clear(),this.loadedImages.clear()}}};var pm=new URL("../chapter-scroll-v14/",import.meta.url),Nc=s=>Math.max(0,Math.min(1,Number(s)||0)),xM=()=>new DOMException("The scroll viewer was disposed","AbortError");function gd(s,e,t){let n=e?.getExtension("WEBGL_lose_context");if(!n||e.isContextLost())return!1;let i=r=>{r.preventDefault(),setTimeout(()=>{e.isContextLost()&&n.restoreContext()},0)};return s.addEventListener("webglcontextlost",i,{once:!0}),t(),!0}var Uc=class{constructor(e,t,{onProgress:n=()=>{},onStatus:i=()=>{}}={}){if(!(e instanceof HTMLCanvasElement)||!(t instanceof HTMLCanvasElement))throw TypeError("Two canvas elements are required");this.canvas=e,this.mistCanvas=t,this.onProgress=n,this.onStatus=i,this.resources=new Dc,this.disposers=[],this.ready=!1,this.disposed=!1,this.paused=!1,this.lost=!1,this.progress=0,this.frame=0,this.previousTime=0,this.animation=null,this.drag=null,this.status="idle",this.size=null,this.mistLost=!1,this.mistSurface=new Proxy(t,{get:(r,a)=>{if(a==="clientWidth")return r.clientWidth||Math.max(1,(this.size?.[0]||1)*1.6);if(a==="clientHeight")return r.clientHeight||Math.max(1,(this.size?.[1]||1)*1.3);let o=Reflect.get(r,a,r);return typeof o=="function"?o.bind(r):o},set:(r,a,o)=>Reflect.set(r,a,o,r)}),this.reduced=matchMedia("(prefers-reduced-motion: reduce)"),this.atmosphereWanted=!this.reduced.matches,this.listen(document,"visibilitychange",()=>{document.hidden?this.suspend():this.paused||this.resume()}),this.listen(this.reduced,"change",()=>{this.reduced.matches&&(this.setAtmosphere(!1),this.animation&&this.setProgress(this.animation.to))}),this.listen(e,"webglcontextlost",r=>this.contextLost(r)),this.listen(e,"webglcontextrestored",()=>this.restoreContext()),this.listen(t,"webglcontextlost",r=>{r.preventDefault(),!this.disposed&&(this.mistLost=!0,this.mist?.setEnabled(!1),this.report("\u96FE\u67D3\u6682\u65F6\u4E2D\u65AD\uFF0C\u85CF\u5377\u4ECD\u53EF\u89C2\u8D4F\u3002","mist-unavailable"))}),this.listen(t,"webglcontextrestored",()=>{this.disposed||(this.mistLost=!1,this.ready&&this.prepareMist({restored:!0}).then(()=>this.schedule()).catch(()=>{}))})}listen(e,t,n,i){e.addEventListener(t,n,i),this.disposers.push(()=>e.removeEventListener(t,n,i))}report(e,t=this.status){this.disposed||(this.status=t,this.onStatus(e,{status:t,ready:this.ready}))}signalProgress({velocity:e=0,active:t=!1,direction:n=0}={}){this.disposed||this.onProgress({progress:this.progress,velocity:e,active:t,direction:n,phase:this.object?.closure?.snapshot()?.phase||"closed",paperProgress:this.object?.paperProgress??0})}async prepare(e={}){if(this.disposed)throw xM();let t=e.chapter||e.chapterId||"five";if(!["five","2026-10-12",5].includes(t))throw Error("This viewer contains the fifth-chapter specimen only; other chapters are not substituted.");return this.preparation?this.preparation:(this.preparation=this.prepareFifth(e).catch(n=>{throw this.disposed||(this.ready=!1,this.lastError=n.message,this.report("\u7ACB\u4F53\u85CF\u5377\u6682\u4E0D\u53EF\u7528\uFF0C\u4ECD\u53EF\u67E5\u770B\u5DF2\u5907\u597D\u7684\u7EB8\u9762\u4E0E\u91CA\u8BFB\u3002","failed"),this.resources.dispose()),n}),this.preparation)}async prepareFifth({initialProgress:e=0}={}){let t=this.resources;this.report("\u6B63\u5728\u53D6\u51FA\u7B2C\u4E94\u7AE0\u6837\u54C1\u2026","preparing");let[n,i]=await Promise.all([t.json(new URL("chapter-sample.json",pm)),t.text(new URL("art-plan.json",pm))]),r=await am(n,i);t.assertAlive(),this.record=r;let a=nm(r.template);this.template=a,await t.font(a.fontFamily,a.fontUrl);let[o,l,c,h]=await Promise.all([a.skin,a.reverse,a.keeper,a.ornament].map(f=>t.image(f))),u=[o,l,c,h];try{await pd(),t.assertAlive(),this.textures=fm(r,o,l,a,h),this.object=new Mc(this.canvas,this.textures,c,a),this.attachObjectLifetime(this.object,t)}finally{for(let f of u)(f!==c||!this.object)&&t.releaseImage(f)}if(t.assertAlive(),this.object.closure.onLoadingProgress=f=>this.report(f<1?`\u6B63\u5728\u8F7D\u5165\u5B9E\u4F53\u76AE\u6263\u2026 ${Math.round(f*100)}%`:"\u6B63\u5728\u51C6\u5907\u85CF\u5377\u2026","preparing"),!this.size){let f=this.canvas;for(;f&&(!f.clientWidth||!f.clientHeight);)f=f.parentElement;this.size=[f?.clientWidth||1,f?.clientHeight||1]}this.resize(...this.size),this.report("\u6B63\u5728\u51C6\u5907\u7EB8\u5F20\u3001\u76AE\u6263\u4E0E\u52A8\u4F5C\u2026","preparing");let d=Nc(e);return await this.object.prepareMotion(d),t.assertAlive(),await this.prepareMist(),t.assertAlive(),this.progress=d,this.object.setProgress(d),this.object.settle(),this.ready=!0,this.previousTime=performance.now(),this.render(),this.signalProgress(),this.report("\u8BBE\u8BA1\u8BD5\u6837 \xB7 \u5C1A\u672A\u9881\u53D1","ready"),this.schedule(),this}attachObjectLifetime(e,t){let n=()=>{t.scene(e.scene),t.scene(e.closure?.model),t.own(e.geometry),t.own(e.sealBump),t.own(e.environment),t.own(e.closure?.curve);for(let o of[...e.maps,...e.closure?.maps||[]])t.own(o);t.own(e.keeper?.geometry),t.material(e.keeper?.material)},i=e.environment;Object.defineProperty(e,"environment",{configurable:!0,get:()=>i,set:o=>{i=o,t.own(o),t.disposed&&queueMicrotask(()=>{e.renderer.dispose(),gd(this.canvas,e.renderer.getContext(),()=>e.renderer.forceContextLoss())})}});let r=e.render.bind(e);e.render=(...o)=>{if(!t.disposed)return r(...o)};let a=e.environmentReady;e.environmentReady=a.then(()=>{n(),t.assertAlive()}),e.environmentReady.catch(()=>n()),e.closure.ready.then(n,n),n(),t.own(e.renderer)}async prepareMist({restored:e=!1}={}){if(this.disposed||this.reduced.matches||this.mistLost){this.mistCanvas.hidden=!0;return}let t=this.mist;this.mist=null,e&&t?(t.fluid=null,t.dispose()):this.disposeMist(t);let n=new Rc(this.mistSurface,{signal:this.resources.controller.signal});this.mist=n;try{if(await n.prepare(),this.disposed||this.mist!==n){this.disposeMist(n);return}n.setEnabled(this.atmosphereWanted&&!this.paused),this.mistCanvas.hidden=!this.atmosphereWanted||this.paused}catch(i){this.disposeMist(n),this.mist===n&&(this.mist=null),this.disposed||(this.mistCanvas.hidden=!0,this.mistError=i.message)}}disposeMist(e){if(!e)return;if(!e.fluid){e.dispose();return}if(e.releasedFluid===e.fluid)return;e.releasedFluid=e.fluid;let t=this.mistCanvas.getContext("webgl2")||this.mistCanvas.getContext("webgl");gd(this.mistCanvas,t,()=>e.dispose())||e.dispose()}resize(e,t){!(e>0&&t>0)||this.disposed||(this.size=[e,t],!(!this.object||this.lost)&&(this.object.resize(e,t),this.mist?.resetMotion(),this.render()))}render(){this.object&&this.ready&&!this.disposed&&!this.lost&&!this.paused&&!document.hidden&&this.object.render()}schedule(){this.frame||this.disposed||this.paused||this.lost||document.hidden||!this.ready||(this.animation||this.object.needsMotion||this.atmosphereWanted&&!this.reduced.matches&&this.mist?.fluid&&!this.mistLost)&&(this.frame=requestAnimationFrame(e=>this.tick(e)))}tick(e){if(this.frame=0,this.disposed||this.paused||this.lost||document.hidden||!this.ready)return;let t=e-this.previousTime;if(t<7){this.schedule();return}let n=Math.min(.05,(t||40)/1e3);if(this.previousTime=e,this.animation){let i=this.animation,r=this.progress,a=i.sample(e);this.progress=a.progress,this.object.setProgress(this.progress);let o=(this.progress-r)/Math.max(.001,t/1e3),l=Math.sign(i.to-i.from);this.signalProgress({velocity:o,active:!a.done,direction:l}),a.done&&(this.animation=null,this.finishAnimation({completed:!0,progress:this.progress}),this.report("\u8BBE\u8BA1\u8BD5\u6837 \xB7 \u5C1A\u672A\u9881\u53D1","ready"))}this.object.advance(n),(this.animation||this.object.needsMotion||this.object.dirty)&&this.render(),this.atmosphereWanted&&!this.reduced.matches&&!this.mistLost&&this.mist?.tick(n,this.progress,this.object.bounds,this.object.viewHeight,Math.max(.001,t/1e3),this.object.interaction()),this.schedule()}animate(e){if(!this.ready||this.disposed||this.lost)return Promise.resolve({completed:!1,reason:"unavailable"});if(e=Nc(e),this.finishAnimation({completed:!1,reason:"superseded"}),this.reduced.matches||Math.abs(e-this.progress)<1e-6)return this.setProgress(e),Promise.resolve({completed:!0,progress:e});this.animation=new Cc(this.progress,e,performance.now());let t=new Promise(n=>{this.animationComplete=n});return this.report(e?"\u85CF\u5377\u5C55\u5F00\u4E2D\u2026":"\u85CF\u5377\u6536\u8D77\u4E2D\u2026","animating"),this.signalProgress({active:!0,direction:Math.sign(e-this.progress)}),this.schedule(),t}finishAnimation(e){let t=this.animationComplete;this.animationComplete=null,t?.(e)}setProgress(e,{immediate:t=!0}={}){if(!t)return this.animate(e);!this.object||this.disposed||this.lost||(this.finishAnimation({completed:!1,reason:"set-progress"}),this.animation=null,this.progress=Nc(e),this.object.setProgress(this.progress),this.object.settle(),this.mist?.resetMotion(),this.signalProgress(),this.render(),this.schedule())}setAtmosphere(e){this.atmosphereWanted=!!e&&!this.reduced.matches,this.mist?.setEnabled(this.atmosphereWanted&&!this.paused&&!this.lost&&!this.mistLost),this.mistCanvas.hidden=!this.atmosphereWanted||this.paused||this.lost||this.mistLost,!this.atmosphereWanted&&!this.animation&&!this.object?.needsMotion&&(cancelAnimationFrame(this.frame),this.frame=0),this.schedule()}suspend(){cancelAnimationFrame(this.frame),this.frame=0,this.drag=null,this.mist?.resetMotion(),this.signalProgress()}pause(){this.disposed||(this.paused=!0,this.suspend(),this.mist?.setEnabled(!1))}resume(){this.disposed||document.hidden||(this.paused=!1,this.previousTime=performance.now(),this.animation?.resume(this.previousTime),this.mist?.setEnabled(this.atmosphereWanted&&!this.mistLost&&!this.lost),this.render(),this.schedule())}bindPointerInput(){this.pointerBound||this.disposed||(this.pointerBound=!0,this.listen(this.canvas,"pointerdown",e=>this.pointerDown(e)),this.listen(this.canvas,"pointermove",e=>this.pointerMove(e)),this.listen(this.canvas,"pointerup",e=>this.pointerUp(e)),this.listen(this.canvas,"pointercancel",e=>this.pointerCancel(e)),this.listen(this.canvas,"lostpointercapture",()=>{this.drag=null}))}pointerDown(e){if(!this.ready||this.paused||this.lost||this.disposed||e.pointerType==="mouse"&&e.button!==0)return;let t=this.animation?.to;this.finishAnimation({completed:!1,reason:"pointer"}),this.animation=null,this.drag={id:e.pointerId,y:e.clientY,p:this.progress,moved:!1,target:t,time:performance.now()},this.canvas.setPointerCapture(e.pointerId)}pointerMove(e){let t=this.drag;if(!t||t.id!==e.pointerId||this.disposed)return;let n=e.clientY-t.y;if(Math.abs(n)>9&&(t.moved=!0),!t.moved)return;let i=performance.now(),r=this.progress;this.progress=Nc(t.p+n/((this.size?.[1]||1)*.64)),this.object.setProgress(this.progress),this.signalProgress({velocity:(this.progress-r)/Math.max(.001,(i-t.time)/1e3),active:!0,direction:Math.sign(this.progress-r)}),t.time=i,this.render(),this.schedule()}pointerUp(e){let t=this.drag;!t||t.id!==e.pointerId||(this.drag=null,this.canvas.hasPointerCapture(e.pointerId)&&this.canvas.releasePointerCapture(e.pointerId),this.animate(t.moved?this.progress>=.5?1:0:t.target!==void 0?t.target?0:1:this.progress>=.5?0:1))}pointerCancel(e){if(this.drag?.id!==e.pointerId)return;let t=this.drag.target;this.drag=null,t!==void 0?this.animate(t):this.signalProgress()}contextLost(e){e.preventDefault(),!this.disposed&&(this.lost=!0,this.ready=!1,this.suspend(),this.mist?.setEnabled(!1),this.report("\u7ACB\u4F53\u663E\u793A\u4E2D\u65AD\uFF0C\u53EF\u67E5\u770B\u9759\u6001\u5377\u9875\u3002","context-lost"))}async restoreContext(){if(!this.disposed&&(this.lost=!1,!!this.object)){this.ready=!1,this.report("\u6B63\u5728\u6062\u590D\u85CF\u5377\u2026","restoring");try{this.size&&this.object.resize(...this.size),await this.object.prepareMotion(this.progress),this.resources.assertAlive(),this.ready=!0,this.mist?.resetMotion(),this.previousTime=performance.now(),this.animation?.resume(this.previousTime),this.mist?.setEnabled(this.atmosphereWanted&&!this.paused&&!this.mistLost),this.render(),this.schedule(),this.report("\u8BBE\u8BA1\u8BD5\u6837 \xB7 \u5C1A\u672A\u9881\u53D1","ready")}catch(e){this.disposed||(this.lastError=e.message,this.report("\u7ACB\u4F53\u663E\u793A\u6682\u4E0D\u53EF\u7528\uFF0C\u53EF\u67E5\u770B\u9759\u6001\u5377\u9875\u3002","failed"))}}}getTranscript(){return this.record?md(this.record):[]}getClosedScreenPose(){if(!this.object||!this.size)return null;let e=this.object,[t,n]=this.size,i=e.closure?.radius||0,r=[];for(let h of[-e.width/2,e.width/2])for(let u of[e.bounds.bottom,e.bounds.top]){let d=e.camera.position.clone().set(h,u,i).project(e.camera);r.push({x:(d.x*.5+.5)*t,y:(.5-d.y*.5)*n})}let a=r.map(h=>h.x),o=r.map(h=>h.y),l=Math.min(...a),c=Math.min(...o);return{x:(l+Math.max(...a))/2,y:(c+Math.max(...o))/2,width:Math.max(...a)-l,height:Math.max(...o)-c,units:"css-pixels"}}populateTranscript(e){this.record?dm(e,this.record):e.replaceChildren()}exportDocument(){return this.textures?.front.toDataURL("image/png")??null}exportRecord(){let e=this.record;return e?{status:e.status,recipient:e.recipient,chapterId:e.chapterId,chapterNumber:e.chapterNumber,sha256:e.artifactDigest,canonicalPayload:e.canonicalPayload,proof:e.proof,sealVariant:e.sealVariant,artPlanDigest:e.artPlanDigest,source:e.artPlan.source}:null}snapshot(){return{...this.object?.snapshot(),ready:this.ready,disposed:this.disposed,paused:this.paused,lost:this.lost,environmentAvailable:!!this.object?.scene.environment,contextReleased:!!this.contextReleased,animating:!!this.animation,chapterId:this.record?.chapterId,issued:!1,status:this.status,error:this.lastError||null,layout:this.textures?.layout,mist:this.mist?.snapshot()??{available:!1},atmosphereWanted:this.atmosphereWanted}}dispose(){if(this.disposed)return;this.disposed=!0,cancelAnimationFrame(this.frame),this.frame=0,this.drag=null,this.finishAnimation({completed:!1,reason:"disposed"}),this.animation=null,this.ready=!1;for(let t of this.disposers.splice(0))t();let e=this.mist;this.mist=null,this.disposeMist(e),this.resources.dispose(),this.object&&(this.contextReleased=gd(this.canvas,this.object.renderer.getContext(),()=>this.object.renderer.forceContextLoss()));for(let t of[this.textures?.front,this.textures?.back,this.textures?.ink,this.textures?.relief,this.textures?.seal?.ink,this.textures?.seal?.mask])t&&(t.width=1,t.height=1);this.object?.scene.clear(),this.object=null,this.textures=null}};var _M=s=>new URL(`./assets/${s}`,import.meta.url).href,xd=Object.freeze({museum:"audio-music/ancient-mysteries.mp3",inspect:"audio-music/a-new-town.mp3",leather1:"audio-foley/beltHandle1.wav",leather2:"audio-foley/beltHandle2.wav",tail1:"audio-foley/handleSmallLeather.wav",tail2:"audio-foley/handleSmallLeather2.wav",cloth:"audio-foley/clothBelt.wav",pin:"audio-foley/metalClick.wav",latch:"audio-foley/metalLatch.wav",open:"audio-foley/bookOpen.wav",close:"audio-foley/bookClose.wav",paper1:"audio-foley/bookFlip1.wav",paper2:"audio-foley/bookFlip2.wav",paper3:"audio-foley/bookFlip3.wav",place1:"audio-foley/bookPlace1.wav",place2:"audio-foley/bookPlace2.wav",leatherDrop:"audio-foley/dropLeather.wav"}),mm=new Set(["museum","inspect"]),vM=Object.freeze({tail1:2.2,tail2:3,open:1.7,paper2:1.8,place1:.35,place2:.35,close:.45,latch:.55,leatherDrop:.4}),$a,Fc=0,_d=(s,e,t)=>Math.min(t,Math.max(e,s)),vd=()=>performance.now()/1e3,Ka=()=>typeof document<"u"&&document.hidden;function yM(){if(!$a||$a.state==="closed"){let s=globalThis.AudioContext||globalThis.webkitAudioContext;if(!s)throw Error("\u6B64\u6D4F\u89C8\u5668\u6682\u4E0D\u652F\u6301\u85CF\u9986\u58F0\u97F3");$a=new s({latencyHint:"interactive"})}return $a}function Za(s,e,t,n){let i=n.currentTime;typeof s.cancelAndHoldAtTime=="function"?s.cancelAndHoldAtTime(i):(s.cancelScheduledValues(i),s.setValueAtTime(s.value,i)),s.linearRampToValueAtTime(e,i+t)}var Oc=class{constructor(){this.enabled=!0,this.musicEnabled=!1,this.foleyEnabled=!1,this.scene="museum",this.paused=!1,this.disposed=!1,this.unlocked=!1,this.context=null,this.buffers=new Map,this.loads=new Map,this.bytes=new Map,this.failures=new Map,this.positions=new Map,this.musicVoices=new Set,this.foleyVoices=new Set,this.currentMusic=null,this.musicTicket=0,this.lastMotion=null,this.lastCue=new Map,this.paperTravel=0,this.paperVariant=0,this.eventsPlayed=0,this.lastEvent=null,this.prepared=!1,this._visibility=()=>{Ka()&&this.pause()},this._pagehide=()=>this.pause(),globalThis.document?.addEventListener("visibilitychange",this._visibility),globalThis.addEventListener?.("pagehide",this._pagehide)}async prepare(){return this.disposed?!1:(this.preparePromise||(this.preparePromise=Promise.allSettled(Object.keys(xd).map(e=>this._fetch(e))).then(()=>(this.prepared=!0,!this.disposed))),this.preparePromise)}_nodes(){if(this.context)return;this.context=yM(),Fc++;let e=this.context;this.master=e.createGain(),this.master.gain.value=this.enabled&&!this.paused?.7:0,this.musicBus=e.createGain(),this.foleyBus=e.createGain(),this.musicBus.gain.value=1,this.foleyBus.gain.value=1;let t=e.createDynamicsCompressor();t.threshold.value=-10,t.knee.value=12,t.ratio.value=3,t.attack.value=.005,t.release.value=.16,this.musicBus.connect(this.master),this.foleyBus.connect(this.master),this.master.connect(t),t.connect(e.destination),this.limiter=t,this._statechange=()=>{e.state!=="running"&&this._stopFoley()},e.addEventListener("statechange",this._statechange)}async unlock(){if(this.disposed||Ka()||!this.musicEnabled&&!this.foleyEnabled||(this._nodes(),await this.context.resume(),this.disposed))return!1;if(this.context.state!=="running")throw Error("\u58F0\u97F3\u88AB\u7CFB\u7EDF\u6682\u505C\uFF0C\u8BF7\u8F7B\u89E6\u58F0\u97F3\u6309\u94AE\u91CD\u8BD5");return this.unlocked=!0,this.prepare().catch(()=>{}),this.foleyEnabled&&await Promise.allSettled(Object.keys(xd).filter(t=>!mm.has(t)).map(t=>this._buffer(t))),this.disposed||this.paused||Ka()?!1:(Za(this.master.gain,this.enabled?.7:0,.06,this.context),this._syncMusic(),!0)}setEnabled(e){this.enabled=!!e,this.enabled||(this._stopMusic(),this._stopFoley()),this.context&&Za(this.master.gain,this._canPlay()?.7:0,.08,this.context),this.enabled&&this._syncMusic()}setMusicEnabled(e){this.musicEnabled=!!e,this.musicEnabled?this._syncMusic():this._stopMusic()}setFoleyEnabled(e){this.foleyEnabled=!!e,this.foleyEnabled||this._stopFoley(),this.paperTravel=0}setScene(e){mm.has(e)&&(this.scene!==e&&(this.scene=e,this.lastMotion=null,this.paperTravel=0,this._stopFoley()),this._syncMusic())}_canPlay(){return!this.disposed&&!this.paused&&this.enabled&&this.unlocked&&!Ka()&&this.context?.state==="running"}async _fetch(e){if(this.bytes.has(e))return this.bytes.get(e);let t=this.loads.get(`fetch:${e}`);if(t)return t;let n=fetch(_M(xd[e]),{credentials:"same-origin"}).then(i=>{if(!i.ok)throw Error(`\u58F0\u97F3\u8D44\u6E90\u672A\u53D6\u5F97\uFF1A${e} (${i.status})`);return i.arrayBuffer()}).then(i=>(this.disposed||(this.bytes.set(e,i),this.failures.delete(e)),i)).catch(i=>{throw this.failures.set(e,i.message),i});this.loads.set(`fetch:${e}`,n);try{return await n}finally{this.loads.delete(`fetch:${e}`)}}async _buffer(e){if(this.buffers.has(e))return this.buffers.get(e);let t=this.loads.get(`decode:${e}`);if(t)return t;let n=this._fetch(e).then(i=>this.context.decodeAudioData(i.slice(0))).then(i=>(this.disposed||(this.buffers.set(e,i),this.failures.delete(e)),i)).catch(i=>{throw this.failures.set(e,i.message),i});this.loads.set(`decode:${e}`,n);try{return await n}finally{this.loads.delete(`decode:${e}`)}}_remember(e){if(!e||!this.context)return;let t=e.source.buffer.duration;this.positions.set(e.key,(e.offset+this.context.currentTime-e.startedAt)%t)}_stopVoice(e,t=.1){if(!(!e||e.stopping))if(e.stopping=!0,this.context?.state==="running"&&t>0){Za(e.gain.gain,0,t,this.context);try{e.source.stop(this.context.currentTime+t+.015)}catch{}}else try{e.source.stop()}catch{}}_stopMusic(){this.musicTicket++,this._remember(this.currentMusic),this.currentMusic=null;for(let e of this.musicVoices)this._stopVoice(e)}_syncMusic(){if(!this._canPlay()||!this.musicEnabled)return;let e=this.scene;if(this.currentMusic?.key===e&&!this.currentMusic.stopping)return;let t=++this.musicTicket;this._buffer(e).then(n=>{if(t!==this.musicTicket||!this._canPlay()||!this.musicEnabled||this.scene!==e)return;let i=this.context;this._remember(this.currentMusic);for(let c of this.musicVoices)this._stopVoice(c,1.1);let r=i.createBufferSource(),a=i.createGain();r.buffer=n,r.loop=!0,a.gain.value=0,r.connect(a),a.connect(this.musicBus);let o=(this.positions.get(e)||0)%n.duration,l={key:e,source:r,gain:a,offset:o,startedAt:i.currentTime,stopping:!1};this.currentMusic=l,this.musicVoices.add(l),r.onended=()=>{r.disconnect(),a.disconnect(),this.musicVoices.delete(l)},r.start(0,o),a.gain.linearRampToValueAtTime(e==="museum"?.105:.19,i.currentTime+1.8)}).catch(()=>{})}_stopFoley(){for(let e of this.foleyVoices)this._stopVoice(e,.025);this.lastMotion=null,this.paperTravel=0}_play(e,{gain:t=.35,group:n=e,cooldown:i=.18,rate:r=1}={}){if(!this._canPlay()||!this.foleyEnabled)return;let a=vd();if(a-(this.lastCue.get(n)??-1/0)<i)return;this.lastCue.set(n,a);let o=this.scene;this._buffer(e).then(l=>{if(!this._canPlay()||!this.foleyEnabled||this.scene!==o||vd()-a>.35)return;this.foleyVoices.size>=4&&this._stopVoice(this.foleyVoices.values().next().value,.025);let c=this.context,h=c.createBufferSource(),u=c.createGain();h.buffer=l,h.playbackRate.value=_d(r,.95,1.05),u.gain.value=0,u.gain.setValueAtTime(0,c.currentTime),u.gain.linearRampToValueAtTime(t*(vM[e]||1),c.currentTime+.008),h.connect(u),u.connect(this.foleyBus);let d={key:e,source:h,gain:u,stopping:!1};this.foleyVoices.add(d),h.onended=()=>{h.disconnect(),u.disconnect(),this.foleyVoices.delete(d)},h.start(),this.eventsPlayed++,this.lastEvent=n}).catch(()=>{})}cue(e){e==="pickup"?this._play("tail1",{gain:.48,group:"pickup",cooldown:.6}):e==="placed"?this._play("place2",{gain:.38,group:"placed",cooldown:.6}):e==="newarrival"&&this._play("place1",{gain:.34,group:"arrival",cooldown:2})}motion({progress:e=0,velocity:t=0,active:n=!1,direction:i=0}={}){let r=_d(Number(e)||0,0,1),a=vd(),o=this.lastMotion;if(this.lastMotion={p:r,time:a},!this._canPlay()||!this.foleyEnabled||this.scene!=="inspect")return;if(!o||!n){this.paperTravel=0;return}let l=r-o.p;if(Math.abs(l)<1e-5)return;if(Math.abs(l)>.18&&a-o.time<.12){this.paperTravel=0;return}let c=Math.sign(l)||Math.sign(i),h=Math.abs(Number(t))||Math.abs(l)/Math.max(.016,a-o.time),u=f=>c>0?o.p<f&&r>=f:o.p>f&&r<=f,d=c>0?[[.025,"leather1","unload",.35],[.075,"pin","pin-contact",.27],[.16,"tail2","tail-slide",.38],[.32,"cloth","keeper-clear",.27],[.415,"open","paper-start",.27],[.985,"place1","paper-settle",.16]]:[[.97,"paper3","paper-start",.23],[.405,"close","paper-settle",.27],[.31,"cloth","keeper-clear",.27],[.16,"tail1","tail-slide",.38],[.065,"latch","pin-contact",.26],[.008,"leather2","unload",.3]];for(let[f,m,y,g]of d)u(f)&&this._play(m,{group:y,gain:g,cooldown:.65});if(r>.45&&r<.96&&h>.015){if(this.paperTravel+=Math.abs(l),this.paperTravel>.115){this.paperTravel=0;let f=`paper${1+this.paperVariant++%3}`;this._play(f,{gain:_d(.075+h*.16,.09,.24),group:"paper-travel",cooldown:.28})}}else this.paperTravel=0}pause(){this.disposed||(this.paused=!0,this._stopMusic(),this._stopFoley(),this.context&&Za(this.master.gain,0,.04,this.context))}resume(){this.disposed||Ka()||(this.paused=!1,this.lastMotion=null,!(!this.context||!this.unlocked)&&this.context.resume().then(()=>{this._canPlay()&&(Za(this.master.gain,.7,.1,this.context),this._syncMusic())}).catch(()=>{}))}snapshot(){return{enabled:this.enabled,musicEnabled:this.musicEnabled,foleyEnabled:this.foleyEnabled,scene:this.scene,paused:this.paused,unlocked:this.unlocked,prepared:this.prepared,contextState:this.context?.state||"not-created",decoded:[...this.buffers.keys()],downloaded:this.bytes.size,musicTrack:this.currentMusic?.key||null,musicVoices:this.musicVoices.size,foleyVoices:this.foleyVoices.size,eventsPlayed:this.eventsPlayed,lastEvent:this.lastEvent,failures:Object.fromEntries(this.failures),disposed:this.disposed,listeningReview:"not-auditioned",issued:!1}}dispose(){if(!this.disposed){if(this.pause(),this.disposed=!0,globalThis.document?.removeEventListener("visibilitychange",this._visibility),globalThis.removeEventListener?.("pagehide",this._pagehide),this.context){this.context.removeEventListener("statechange",this._statechange);for(let e of[...this.musicVoices,...this.foleyVoices]){try{e.source.stop()}catch{}e.source.disconnect(),e.gain.disconnect()}this.musicVoices.clear(),this.foleyVoices.clear(),this.master.disconnect(),this.musicBus.disconnect(),this.foleyBus.disconnect(),this.limiter.disconnect(),Fc=Math.max(0,Fc-1),Fc||(this.context.close().catch(()=>{}),$a=null)}this.bytes.clear(),this.buffers.clear(),this.loads.clear()}}};var Ce=s=>document.getElementById(s),Nr=Ce("museumStage"),MM=matchMedia("(prefers-reduced-motion: reduce)"),Lr=Object.freeze({id:"specimen-chapter-five",chapterId:"2026-10-12",chapterNumber:5,title:"\u6CB3\u8C37\u91CC\u672A\u8BF4\u5B8C\u7684\u8BDD",artTitle:"Of Leaf and Letter",paperTint:12034168,issued:!1}),yt,rt,Ja,hi=!1,eo=!1,Ut="browse",xn=null,Ur=0,yd=0,xm=null,Tn=!1,ui=!1,Nn=0,Fr=!1,SM=0,kc=!1,Ii=!1,ja=!1,Dr={x:0,y:0,scale:1},zt=new Oc,_m=(()=>{try{return JSON.parse(localStorage.getItem("tsl-museum-sound-v1")||"{}")}catch{return{}}})(),Ps=_m.music===!0,Ls=_m.foley===!0,hn=s=>{Ce("museumStatus").textContent=s},bM=s=>s*s*(3-2*s);function TM(){try{localStorage.setItem("tsl-museum-sound-v1",JSON.stringify({music:Ps,foley:Ls}))}catch{}}function Md(){zt.setMusicEnabled(Ps),zt.setFoleyEnabled(Ls),Ce("musicButton").textContent=Ps?"\u97F3\u4E50\u5F00":"\u97F3\u4E50\u5173",Ce("musicButton").setAttribute("aria-pressed",String(Ps)),Ce("foleyButton").textContent=Ls?"\u62DF\u97F3\u5F00":"\u62DF\u97F3\u5173",Ce("foleyButton").setAttribute("aria-pressed",String(Ls))}function Pi(){let s=Ut==="browse",e=Ut==="inspect";Ce("takeButton").hidden=!s,Ce("takeButton").disabled=!hi||Ii||ja,Ce("takeButton").textContent=Ii?"\u6062\u590D\u7ACB\u4F53\u663E\u793A\u2026":ja?"\u6B63\u5728\u53D6\u9605\u2026":hi?"\u53D6\u9605\u85CF\u5377":"\u51C6\u5907\u85CF\u5377\u2026";for(let t of["toggleScroll","detailButton","returnButton"])Ce(t).hidden=!e,Ce(t).disabled=!hi||Tn;if(Ce("toggleScroll").textContent=Nn>=.5?"\u6536\u5377":"\u542F\u5377",Ce("toggleScroll").disabled||=Ii,Ce("browseControls").hidden=!s,Ce("selectionCard").hidden=!s,Ce("museumWordmark").hidden=!s,Ce("catalogueButton").disabled=!s,Nr.dataset.phase=Ut,yt){let t=yt.snapshot();Ce("cabinetLabel").textContent=`\u7B2C ${t.cabinet} \u67DC \xB7 \u7B2C ${t.range[0]}\u2014${t.range[1]} \u7AE0`,Ce("previousCabinet").disabled=t.cabinet<=1,Ce("nextCabinet").disabled=t.cabinet>=yt.maxCabinet+1}}function gm(s){let e=rt?.getClosedScreenPose();if(!s||!e?.width)return;let t=s.width/e.width,n=Nr.clientWidth/2,i=Nr.clientHeight/2;Dr={x:s.x-(n+(e.x-n)*t),y:s.y-(i+(e.y-i)*t),scale:t},vm(0)}function vm(s){let e=Math.max(0,1-s/.12);Ce("viewerLayer").style.transform=`translate(${Dr.x*e}px,${Dr.y*e}px) scale(${1+(Dr.scale-1)*e})`}function to(){!Ur&&!document.hidden&&!ui&&(Ur=requestAnimationFrame(wM))}function wM(s){if(Ur=0,document.hidden||ui)return;let e=Math.min(.05,Math.max(0,(s-(yd||s))/1e3));if(yd=s,xn){xn.elapsed+=e*1e3;let t=Math.min(1,xn.elapsed/xn.duration),n=bM(t);if(yt?.setStage(xn.kind,n),xn.kind==="retrieve"){gm(yt?.getTransferPose?.());let i=Math.max(0,Math.min(1,(n-.78)/.22));Ce("viewerLayer").style.opacity=String(i),yt?.setProxyVisible?.(i<.8)}else{gm(yt?.getTransferPose?.());let i=1-Math.min(1,n/.22);Ce("viewerLayer").style.opacity=String(i),yt?.setProxyVisible?.(i<.8)}if(t===1){let i=xn.kind;xn=null,i==="retrieve"?(Ut="inspect",yt?.setStage("inspect",1),yt?.setProxyVisible?.(!1),Ce("viewerLayer").style.opacity="1",zt.setScene("inspect"),hn("\u7B2C\u4E94\u7AE0\u5236\u4F5C\u8BD5\u6837 \xB7 \u8F7B\u89E6\u542F\u5377\uFF0C\u6216\u6CBF\u7EB5\u5411\u62D6\u52A8")):(Ut="browse",Ce("viewerLayer").hidden=!0,Ce("viewerLayer").style.opacity="0",rt?.pause(),yt?.setSelected(null),yt?.setStage("browse",0),yt?.setProxyVisible?.(!0),zt.setScene("museum"),zt.cue("placed"),hn("\u85CF\u5377\u5DF2\u5F52\u539F\u4F4D \xB7 \u8BBE\u8BA1\u8BD5\u6837\uFF0C\u5C1A\u672A\u9881\u53D1")),Pi()}}eo&&(Ut!=="inspect"||xn)&&(yt.update(e),yt.render()),Tn&&!Fr&&Nn<.001&&(Tn=!1,Bc()),to()}function Qa(){let{width:s,height:e}=Nr.getBoundingClientRect();yt?.resize(s,e),rt?.resize(s,e)}async function ym(){if(Ja)return Ja;rt=new Uc(Ce("scrollCanvas"),Ce("mistCanvas"),{onStatus:(e,t={})=>{if(!hi)Ce("takeButton").textContent=e?.includes("%")?e:"\u51C6\u5907\u85CF\u5377\u2026",hn("\u9986\u666F\u5DF2\u6253\u5F00\uFF0C\u6B63\u5728\u51C6\u5907\u5B8C\u6574\u85CF\u5377\u3002");else if(["context-lost","failed","restoring"].includes(t.status)){if(Ii=!0,Fr=!1,Ut==="inspect"){let n=rt.exportDocument();n&&(Ce("staticDocument").src=n),Ce("staticDocument").hidden=!1,hn(e)}Tn&&(Tn=!1,Nn=0,Bc({immediate:!0})),Pi()}else t.status==="ready"&&(Ii=!1,Ce("staticDocument").hidden=!0,Ut==="browse"&&rt.setProgress(0),Pi())},onProgress:e=>{Nn=e.progress,Fr=!!e.active,SM=e.velocity||0,Ut==="inspect"&&zt.motion({...e}),Ut==="inspect"&&!Ii&&vm(Nn),Ut==="inspect"&&(Ce("toggleScroll").textContent=Nn>=.5?"\u6536\u5377":"\u542F\u5377")}});let s=Nr.getBoundingClientRect();return rt.resize(s.width,s.height),rt.pause(),Ja=rt.prepare({chapter:"five"}).then(()=>{ui||(hi=!0,Qa(),rt.pause(),Pi(),hn("\u7B2C\u4E94\u7AE0\u5236\u4F5C\u8BD5\u6837\u5DF2\u5907\u59A5 \xB7 \u70B9\u9009\u85CF\u5377\u6216\u53D6\u9605"))}).catch(e=>{console.error("Scroll preparation",e),Ja=null,hi=!1,rt?.dispose(),rt=null,Ce("takeButton").textContent="\u91CD\u8BD5\u51C6\u5907",Ce("takeButton").disabled=!1,hn("\u5B8C\u6574\u85CF\u5377\u6682\u672A\u5907\u59A5\uFF0C\u53EF\u91CD\u8BD5\u6216\u67E5\u770B\u539F\u6837\u54C1\u3002")}),Ja}function Mm(s){Ut=s==="retrieve"?"retrieve":"return",xn={kind:s,elapsed:0,duration:MM.matches?1:1900},Pi(),to()}async function Sm(){if(!(Ut!=="browse"||ja||ui||Ii)){ja=!0,Pi();try{if((Ps||Ls)&&zt.unlock().then(()=>{ui||(Md(),zt.resume())}).catch(()=>{}),!hi&&(await ym(),!hi||ui||Ut!=="browse"))return;Tn=!1,Nn=0,Dr={x:0,y:0,scale:1},rt.setProgress(0,{immediate:!0}),rt.resume(),Ce("viewerLayer").hidden=!1,Ce("viewerLayer").style.opacity="0",yt?.setSelected(Lr.id),yt?.focus(Lr.id),zt.cue("pickup"),hn("\u53D6\u51FA\u85CF\u5377\u2026"),Mm("retrieve")}finally{ja=!1,Pi()}}}function Bc({immediate:s=!1}={}){zt.motion({progress:0,velocity:0,active:!1,direction:-1}),zt.setScene("museum"),hn("\u5F52\u85CF\u4E2D\u2026"),Mm("return"),s&&(xn.duration=1)}function Sd(){if(!(Ut!=="inspect"||Tn)){if(xm=null,Ii){Nn=0,Fr=!1,Ce("staticDocument").hidden=!0,Bc({immediate:!0});return}Nn>.001||Fr?(Tn=!0,rt.animate(0),Pi(),hn("\u5148\u6536\u5377\u3001\u590D\u6263\uFF0C\u518D\u5F52\u56DE\u85CF\u4F4D\u2026")):Bc()}}function EM(){Ut==="inspect"&&!Tn&&(zt.unlock().catch(()=>{}),rt.animate(rt.animation?rt.animation.to?0:1:Nn>=.5?0:1))}function bd(s){Ce(s).showModal()}for(let s of["catalogueDialog","detailDialog","aboutDialog"])Ce(s).addEventListener("click",e=>{e.target===Ce(s)&&Ce(s).close()});Ce("catalogueButton").addEventListener("click",()=>bd("catalogueDialog"));Ce("aboutButton").addEventListener("click",()=>bd("aboutDialog"));Ce("chapterFive").addEventListener("click",()=>{Ce("catalogueDialog").close(),yt?.focus(Lr.id),hn("\u5DF2\u5B9A\u4F4D\u7B2C\u4E94\u7AE0\u85CF\u4F4D \xB7 \u53EF\u53D6\u9605")});Ce("takeButton").addEventListener("click",Sm);Ce("toggleScroll").addEventListener("click",EM);Ce("returnButton").addEventListener("click",Sd);for(let[s,e]of[["musicButton","music"],["foleyButton","foley"]])Ce(s).addEventListener("click",async()=>{e==="music"?Ps=!Ps:Ls=!Ls,TM(),Md(),await zt.unlock().catch(()=>{hn("\u58F0\u97F3\u88AB\u7CFB\u7EDF\u6682\u505C\uFF0C\u8F7B\u89E6\u58F0\u97F3\u6309\u94AE\u91CD\u8BD5\u3002")}),zt.resume()});Ce("detailButton").addEventListener("click",()=>{if(!hi)return;let s=rt.exportDocument();s&&(Ce("documentImage").src=s);let e=Ce("transcript");if(e.replaceChildren(),rt.populateTranscript)rt.populateTranscript(e);else{let i=rt.getTranscript?.();typeof i=="string"&&(e.textContent=i)}let t=rt.record?.artPlan?.copy?.translation;if(t){let i=document.createElement("section");i.lang="zh-CN",i.className="museum-translation";let r=["\u4E2D\u6587\u5BF9\u7167",`\u7B2C\u4E94\u7AE0 \xB7 ${t.artTitle}`,t.chapterEnglishTitle,...t.stanzas.map(a=>a.join(`
`)),"\u8C28\u4E3A Gual Wells \u7559\u5B58\uFF0C\u4EE5\u7EAA\u5FF5\u7B2C\u4E94\u7AE0\u53CA\u5176\u5706\u6EE1\u5B8C\u6210\u7684\u8BD5\u70BC\u3002","The Second Language\uFF1A\u7B2C\u4E8C\u8BED\u8A00\uFF1BIn remembrance\uFF1A\u7559\u4F5C\u7EAA\u5FF5\u3002","\u7EB8\u9762\u8EAB\u4EFD\u884C\u4F9D\u6B21\u8BB0\u5F55\u6837\u54C1\u65E5\u671F\u3001\u65F6\u95F4\uFF08+08:00\uFF09\u4E0E\u5185\u5BB9\u77ED\u7801\uFF0C\u5B8C\u6574\u6458\u8981\u89C1\u85CF\u5377\u8BB0\u5F55\u3002","Specimen \u2014 Not issued\uFF1A\u5236\u4F5C\u8BD5\u6837\uFF0C\u5C1A\u672A\u9881\u53D1\u3002\u4EE5\u4E0A\u7EAA\u5FF5\u6587\u8F9E\u4E3A\u6837\u54C1\uFF0C\u4E0D\u8868\u793A\u5DF2\u7ECF\u901A\u8FC7\u6D4B\u8BD5\u3002"];for(let[a,o]of r.entries()){let l=document.createElement(a===0?"h3":"p");l.textContent=o,l.style.whiteSpace="pre-line",i.append(l)}e.append(i)}let n=rt.exportRecord();Ce("recordText").textContent=`\u5236\u4F5C\u8BD5\u6837 \xB7 \u5C1A\u672A\u9881\u53D1
\u5F52\u5C5E\uFF1A${n.recipient||"Gual Wells"}
\u6837\u54C1\u65F6\u95F4\uFF1A${n.proof?.sampleTime||"\u672A\u8BBE\u7F6E"}
\u5185\u5BB9 SHA-256\uFF1A${n.sha256||n.artifactDigest||"\u89C1\u539F\u4EF6\u8BB0\u5F55"}`,bd("detailDialog")});Ce("zoomButton").addEventListener("click",()=>{let s=Ce("documentField").dataset.zoom!=="true";Ce("documentField").dataset.zoom=String(s),Ce("zoomButton").textContent=s?"\u5168\u9875":"\u653E\u5927",Ce("zoomButton").setAttribute("aria-pressed",String(s))});for(let[s,e]of[["previousCabinet",-1],["nextCabinet",1]])Ce(s).addEventListener("click",()=>{if(Ut!=="browse")return;let t=yt?.navigateCabinet?.(e);t?.label&&(Ce("cabinetLabel").textContent=t.label)});var no=Ce("scrollCanvas");no.addEventListener("pointerdown",s=>{Ut==="inspect"&&!Tn&&rt.pointerDown(s)});no.addEventListener("pointermove",s=>{Ut==="inspect"&&!Tn&&rt.pointerMove(s)});no.addEventListener("pointerup",s=>{Ut==="inspect"&&!Tn&&rt.pointerUp(s)});no.addEventListener("pointercancel",s=>{rt?.pointerCancel(s),zt.motion({progress:Nn,velocity:0,active:!1,direction:0})});no.addEventListener("lostpointercapture",s=>rt?.pointerCancel(s));document.addEventListener("visibilitychange",()=>{document.hidden?(cancelAnimationFrame(Ur),Ur=0,xm=null,rt?.pause(),zt.pause()):(yd=performance.now(),Ut!=="browse"&&rt?.resume(),zt.resume(),to())});document.addEventListener("keydown",s=>{s.key==="Escape"&&Ut==="inspect"&&!document.querySelector("dialog[open]")&&Sd()});var bm=new ResizeObserver(Qa);bm.observe(Nr);Ce("museumCanvas").addEventListener("webglcontextlost",s=>{s.preventDefault(),eo=!1,kc=!0,Ce("museumFallback").hidden=!1,hn("\u9986\u666F\u663E\u793A\u4E2D\u65AD\uFF0C\u5B8C\u6574\u85CF\u5377\u4ECD\u53EF\u53D6\u9605\u3002")});Ce("museumCanvas").addEventListener("webglcontextrestored",()=>{if(!ui)try{Qa(),eo=!0,kc=!1,yt.render(),Ce("museumFallback").hidden=!0,to()}catch{hn("\u9986\u666F\u6682\u672A\u6062\u590D\uFF0C\u4ECD\u53EF\u67E5\u770B\u85CF\u5377\u4E0E\u91CA\u8BFB\u3002")}});async function AM(){Md(),zt.prepare().catch(s=>console.warn("Audio preparation",s)),yt=new uc(Ce("museumCanvas"),{onSelect:s=>{s===Lr.id&&(yt.focus(s),hn("\u7B2C\u4E94\u7AE0 \xB7 \u6CB3\u8C37\u91CC\u672A\u8BF4\u5B8C\u7684\u8BDD"))},onStatus:s=>{Ce("loadingText").textContent=s}}),Qa();try{await yt.prepare([Lr]),eo=!0,Qa(),yt.focus(Lr.id),yt.render()}catch(s){console.error("Museum preparation",s),kc=!0,Ce("museumFallback").hidden=!1}Ce("museumLoading").hidden=!0,Pi(),to(),setTimeout(()=>{ui||ym()},600)}window.scrollMuseum=Object.freeze({take:Sm,putBack:Sd,open:()=>rt?.animate(1),close:()=>rt?.animate(0),setProgress:s=>rt?.setProgress(s,{immediate:!0}),snapshot:()=>({ready:eo,prepared:hi,phase:Ut,progress:Nn,viewerActive:Fr,viewerUnavailable:Ii,alignment:Dr,transfer:xn?{kind:xn.kind,elapsed:xn.elapsed}:null,returnRequested:Tn,sceneFailed:kc,scene:yt?.snapshot(),viewer:rt?.snapshot(),audio:zt.snapshot(),issued:!1}),exportRecord:()=>rt?.exportRecord(),exportDocument:()=>rt?.exportDocument(),dispose:()=>{ui||(ui=!0,cancelAnimationFrame(Ur),bm.disconnect(),rt?.dispose(),yt?.dispose(),zt.dispose())}});AM().catch(s=>{console.error(s),Ce("museumLoading").hidden=!0,Ce("museumFallback").hidden=!1,hn("\u85CF\u9986\u6682\u672A\u51C6\u5907\u597D\uFF0C\u53EF\u67E5\u770B\u72EC\u7ACB\u5377\u8F74\u3002")});
