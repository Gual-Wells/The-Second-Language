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
 */var $c=0,xl=1,Jc=2;var Ri=1,Ma=2,xs=3,di=0,Xt=1,Tt=2,An=0,vs=1,vl=2,yl=3,Sl=4,Kc=5;var Ci=100,jc=101,Qc=102,eh=103,th=104,nh=200,ih=201,sh=202,rh=203,Ml=204,bl=205,ah=206,oh=207,lh=208,ch=209,hh=210,uh=211,dh=212,fh=213,ph=214,qr=0,Yr=1,Zr=2,ss=3,$r=4,Jr=5,Kr=6,jr=7,Tl=0,mh=1,gh=2,an=0,El=1,wl=2,Al=3,sr=4,Rl=5,Cl=6,Il=7;var Pl=300,fi=301,Ii=302,ba=303,Ta=304,rr=306,rs=1e3,$t=1001,Qr=1002,Ct=1003,_h=1004;var ar=1005;var ft=1006,Ea=1007;var Xn=1008;var Kt=1009,Ll=1010,Dl=1011,ys=1012,wa=1013,yn=1014,jt=1015,qt=1016,Aa=1017,Ra=1018,Ss=1020,Ul=35902,Nl=35899,Fl=1021,Ol=1022,dn=1023,Tn=1026,pi=1027,Bl=1028,Ca=1029,mi=1030,Ia=1031;var Pa=1033,or=33776,lr=33777,cr=33778,hr=33779,La=35840,Da=35841,Ua=35842,Na=35843,Fa=36196,Oa=37492,Ba=37496,za=37488,ka=37489,ur=37490,Va=37491,Ga=37808,Ha=37809,Wa=37810,Xa=37811,qa=37812,Ya=37813,Za=37814,$a=37815,Ja=37816,Ka=37817,ja=37818,Qa=37819,eo=37820,to=37821,no=36492,io=36494,so=36495,ro=36283,ao=36284,dr=36285,oo=36286;var Gs=2300,ea=2301,Wr=2302,hl=2303,ul=2400,dl=2401,fl=2402;var xh=3200,zl=3201;var lo=0,vh=1,qn="",Rt="srgb",Ei="srgb-linear",Hs="linear",it="srgb";var Xr=7680;var yh=519,Sh=512,Mh=513,bh=514,co=515,Th=516,Eh=517,ho=518,wh=519,Ah=35044,kl=35048;var Vl="300 es",_n=2e3,as=2001;function Lu(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Du(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function os(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Rh(){let i=os("canvas");return i.style.display="block",i}var wc={},ls=null;function Gl(...i){let e="THREE."+i.shift();ls?ls("log",e,...i):console.log(e,...i)}function Ch(i){let e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function De(...i){i=Ch(i);let e="THREE."+i.shift();if(ls)ls("warn",e,...i);else{let t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function Fe(...i){i=Ch(i);let e="THREE."+i.shift();if(ls)ls("error",e,...i);else{let t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function Ti(...i){let e=i.join(" ");e in wc||(wc[e]=!0,De(...i))}function Ih(i,e,t){return new Promise(function(n,s){function a(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(a,t);break;default:n()}}setTimeout(a,t)})}var Ph={[qr]:Yr,[Zr]:Kr,[$r]:jr,[ss]:Jr,[Yr]:qr,[Kr]:Zr,[jr]:$r,[Jr]:ss},En=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let a=s.indexOf(t);a!==-1&&s.splice(a,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let a=0,r=s.length;a<r;a++)s[a].call(this,e);e.target=null}}},Nt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Ac=1234567,ks=Math.PI/180,cs=180/Math.PI;function Ms(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Nt[i&255]+Nt[i>>8&255]+Nt[i>>16&255]+Nt[i>>24&255]+"-"+Nt[e&255]+Nt[e>>8&255]+"-"+Nt[e>>16&15|64]+Nt[e>>24&255]+"-"+Nt[t&63|128]+Nt[t>>8&255]+"-"+Nt[t>>16&255]+Nt[t>>24&255]+Nt[n&255]+Nt[n>>8&255]+Nt[n>>16&255]+Nt[n>>24&255]).toLowerCase()}function qe(i,e,t){return Math.max(e,Math.min(t,i))}function Hl(i,e){return(i%e+e)%e}function Uu(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Nu(i,e,t){return i!==e?(t-i)/(e-i):0}function Vs(i,e,t){return(1-t)*i+t*e}function Fu(i,e,t,n){return Vs(i,e,1-Math.exp(-t*n))}function Ou(i,e=1){return e-Math.abs(Hl(i,e*2)-e)}function Bu(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function zu(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function ku(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Vu(i,e){return i+Math.random()*(e-i)}function Gu(i){return i*(.5-Math.random())}function Hu(i){i!==void 0&&(Ac=i);let e=Ac+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Wu(i){return i*ks}function Xu(i){return i*cs}function qu(i){return i>0&&Number.isInteger(i)&&2**Math.round(Math.log2(i))===i}function Yu(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Zu(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function $u(i,e,t,n,s){let a=Math.cos,r=Math.sin,o=a(t/2),c=r(t/2),l=a((e+n)/2),h=r((e+n)/2),f=a((e-n)/2),u=r((e-n)/2),d=a((n-e)/2),v=r((n-e)/2);switch(s){case"XYX":i.set(o*h,c*f,c*u,o*l);break;case"YZY":i.set(c*u,o*h,c*f,o*l);break;case"ZXZ":i.set(c*f,c*u,o*h,o*l);break;case"XZX":i.set(o*h,c*v,c*d,o*l);break;case"YXY":i.set(c*d,o*h,c*v,o*l);break;case"ZYZ":i.set(c*v,c*d,o*h,o*l);break;default:De("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function ts(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:case Uint8ClampedArray:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Wt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var Pt={DEG2RAD:ks,RAD2DEG:cs,generateUUID:Ms,clamp:qe,euclideanModulo:Hl,mapLinear:Uu,inverseLerp:Nu,lerp:Vs,damp:Fu,pingpong:Ou,smoothstep:Bu,smootherstep:zu,randInt:ku,randFloat:Vu,randFloatSpread:Gu,seededRandom:Hu,degToRad:Wu,radToDeg:Xu,isPowerOfTwo:qu,ceilPowerOfTwo:Yu,floorPowerOfTwo:Zu,setQuaternionFromProperEuler:$u,normalize:Wt,denormalize:ts},Je=class i{static{i.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=qe(this.x,e.x,t.x),this.y=qe(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=qe(this.x,e,t),this.y=qe(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(qe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),a=this.x-e.x,r=this.y-e.y;return this.x=a*n-r*s+e.x,this.y=a*s+r*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},wn=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,a,r,o){let c=n[s+0],l=n[s+1],h=n[s+2],f=n[s+3],u=a[r+0],d=a[r+1],v=a[r+2],S=a[r+3];if(f!==S||c!==u||l!==d||h!==v){let m=c*u+l*d+h*v+f*S;m<0&&(u=-u,d=-d,v=-v,S=-S,m=-m);let p=1-o;if(m<.9995){let T=Math.acos(m),U=Math.sin(T);p=Math.sin(p*T)/U,o=Math.sin(o*T)/U,c=c*p+u*o,l=l*p+d*o,h=h*p+v*o,f=f*p+S*o}else{c=c*p+u*o,l=l*p+d*o,h=h*p+v*o,f=f*p+S*o;let T=1/Math.sqrt(c*c+l*l+h*h+f*f);c*=T,l*=T,h*=T,f*=T}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=f}static multiplyQuaternionsFlat(e,t,n,s,a,r){let o=n[s],c=n[s+1],l=n[s+2],h=n[s+3],f=a[r],u=a[r+1],d=a[r+2],v=a[r+3];return e[t]=o*v+h*f+c*d-l*u,e[t+1]=c*v+h*u+l*f-o*d,e[t+2]=l*v+h*d+o*u-c*f,e[t+3]=h*v-o*f-c*u-l*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,a=e._z,r=e._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(s/2),f=o(a/2),u=c(n/2),d=c(s/2),v=c(a/2);switch(r){case"XYZ":this._x=u*h*f+l*d*v,this._y=l*d*f-u*h*v,this._z=l*h*v+u*d*f,this._w=l*h*f-u*d*v;break;case"YXZ":this._x=u*h*f+l*d*v,this._y=l*d*f-u*h*v,this._z=l*h*v-u*d*f,this._w=l*h*f+u*d*v;break;case"ZXY":this._x=u*h*f-l*d*v,this._y=l*d*f+u*h*v,this._z=l*h*v+u*d*f,this._w=l*h*f-u*d*v;break;case"ZYX":this._x=u*h*f-l*d*v,this._y=l*d*f+u*h*v,this._z=l*h*v-u*d*f,this._w=l*h*f+u*d*v;break;case"YZX":this._x=u*h*f+l*d*v,this._y=l*d*f+u*h*v,this._z=l*h*v-u*d*f,this._w=l*h*f-u*d*v;break;case"XZY":this._x=u*h*f-l*d*v,this._y=l*d*f-u*h*v,this._z=l*h*v+u*d*f,this._w=l*h*f+u*d*v;break;default:De("Quaternion: .setFromEuler() encountered an unknown order: "+r)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],a=t[8],r=t[1],o=t[5],c=t[9],l=t[2],h=t[6],f=t[10],u=n+o+f;if(u>0){let d=.5/Math.sqrt(u+1);this._w=.25/d,this._x=(h-c)*d,this._y=(a-l)*d,this._z=(r-s)*d}else if(n>o&&n>f){let d=2*Math.sqrt(1+n-o-f);this._w=(h-c)/d,this._x=.25*d,this._y=(s+r)/d,this._z=(a+l)/d}else if(o>f){let d=2*Math.sqrt(1+o-n-f);this._w=(a-l)/d,this._x=(s+r)/d,this._y=.25*d,this._z=(c+h)/d}else{let d=2*Math.sqrt(1+f-n-o);this._w=(r-s)/d,this._x=(a+l)/d,this._y=(c+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(qe(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,a=e._z,r=e._w,o=t._x,c=t._y,l=t._z,h=t._w;return this._x=n*h+r*o+s*l-a*c,this._y=s*h+r*c+a*o-n*l,this._z=a*h+r*l+n*c-s*o,this._w=r*h-n*o-s*c-a*l,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,a=e._z,r=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,a=-a,r=-r,o=-o);let c=1-t;if(o<.9995){let l=Math.acos(o),h=Math.sin(l);c=Math.sin(c*l)/h,t=Math.sin(t*l)/h,this._x=this._x*c+n*t,this._y=this._y*c+s*t,this._z=this._z*c+a*t,this._w=this._w*c+r*t,this._onChangeCallback()}else this._x=this._x*c+n*t,this._y=this._y*c+s*t,this._z=this._z*c+a*t,this._w=this._w*c+r*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),a=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),a*Math.sin(t),a*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},q=class i{static{i.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Rc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Rc.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,a=e.elements;return this.x=a[0]*t+a[3]*n+a[6]*s,this.y=a[1]*t+a[4]*n+a[7]*s,this.z=a[2]*t+a[5]*n+a[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,a=e.elements,r=1/(a[3]*t+a[7]*n+a[11]*s+a[15]);return this.x=(a[0]*t+a[4]*n+a[8]*s+a[12])*r,this.y=(a[1]*t+a[5]*n+a[9]*s+a[13])*r,this.z=(a[2]*t+a[6]*n+a[10]*s+a[14])*r,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,a=e.x,r=e.y,o=e.z,c=e.w,l=2*(r*s-o*n),h=2*(o*t-a*s),f=2*(a*n-r*t);return this.x=t+c*l+r*f-o*h,this.y=n+c*h+o*l-a*f,this.z=s+c*f+a*h-r*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s,this.y=a[1]*t+a[5]*n+a[9]*s,this.z=a[2]*t+a[6]*n+a[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=qe(this.x,e.x,t.x),this.y=qe(this.y,e.y,t.y),this.z=qe(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=qe(this.x,e,t),this.y=qe(this.y,e,t),this.z=qe(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,a=e.z,r=t.x,o=t.y,c=t.z;return this.x=s*c-a*o,this.y=a*r-n*c,this.z=n*o-s*r,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Ho.copy(this).projectOnVector(e),this.sub(Ho)}reflect(e){return this.sub(Ho.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(qe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Ho=new q,Rc=new wn,Oe=class i{static{i.prototype.isMatrix3=!0}constructor(e,t,n,s,a,r,o,c,l){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,a,r,o,c,l)}set(e,t,n,s,a,r,o,c,l){let h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=a,h[5]=c,h[6]=n,h[7]=r,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,a=this.elements,r=n[0],o=n[3],c=n[6],l=n[1],h=n[4],f=n[7],u=n[2],d=n[5],v=n[8],S=s[0],m=s[3],p=s[6],T=s[1],U=s[4],y=s[7],w=s[2],b=s[5],P=s[8];return a[0]=r*S+o*T+c*w,a[3]=r*m+o*U+c*b,a[6]=r*p+o*y+c*P,a[1]=l*S+h*T+f*w,a[4]=l*m+h*U+f*b,a[7]=l*p+h*y+f*P,a[2]=u*S+d*T+v*w,a[5]=u*m+d*U+v*b,a[8]=u*p+d*y+v*P,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],a=e[3],r=e[4],o=e[5],c=e[6],l=e[7],h=e[8];return t*r*h-t*o*l-n*a*h+n*o*c+s*a*l-s*r*c}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],a=e[3],r=e[4],o=e[5],c=e[6],l=e[7],h=e[8],f=h*r-o*l,u=o*c-h*a,d=l*a-r*c,v=t*f+n*u+s*d;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);let S=1/v;return e[0]=f*S,e[1]=(s*l-h*n)*S,e[2]=(o*n-s*r)*S,e[3]=u*S,e[4]=(h*t-s*c)*S,e[5]=(s*a-o*t)*S,e[6]=d*S,e[7]=(n*c-l*t)*S,e[8]=(r*t-n*a)*S,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,a,r,o){let c=Math.cos(a),l=Math.sin(a);return this.set(n*c,n*l,-n*(c*r+l*o)+r+e,-s*l,s*c,-s*(-l*r+c*o)+o+t,0,0,1),this}scale(e,t){return Ti("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Wo.makeScale(e,t)),this}rotate(e){return Ti("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Wo.makeRotation(-e)),this}translate(e,t){return Ti("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Wo.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Wo=new Oe,Cc=new Oe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ic=new Oe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Ju(){let i={enabled:!0,workingColorSpace:Ei,spaces:{},convert:function(s,a,r){return this.enabled===!1||a===r||!a||!r||(this.spaces[a].transfer===it&&(s.r=Gn(s.r),s.g=Gn(s.g),s.b=Gn(s.b)),this.spaces[a].primaries!==this.spaces[r].primaries&&(s.applyMatrix3(this.spaces[a].toXYZ),s.applyMatrix3(this.spaces[r].fromXYZ)),this.spaces[r].transfer===it&&(s.r=ns(s.r),s.g=ns(s.g),s.b=ns(s.b))),s},workingToColorSpace:function(s,a){return this.convert(s,this.workingColorSpace,a)},colorSpaceToWorking:function(s,a){return this.convert(s,a,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===qn?Hs:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,a=this.workingColorSpace){return s.fromArray(this.spaces[a].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,a,r){return s.copy(this.spaces[a].toXYZ).multiply(this.spaces[r].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,a){return Ti("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,a)},toWorkingColorSpace:function(s,a){return Ti("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,a)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Ei]:{primaries:e,whitePoint:n,transfer:Hs,toXYZ:Cc,fromXYZ:Ic,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Rt},outputColorSpaceConfig:{drawingBufferColorSpace:Rt}},[Rt]:{primaries:e,whitePoint:n,transfer:it,toXYZ:Cc,fromXYZ:Ic,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Rt}}}),i}var $e=Ju();function Gn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ns(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Vi,ta=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Vi===void 0&&(Vi=os("canvas")),Vi.width=e.width,Vi.height=e.height;let s=Vi.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=Vi}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=os("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),a=s.data;for(let r=0;r<a.length;r++)a[r]=Gn(a[r]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Gn(t[n]/255)*255):t[n]=Gn(t[n]);return{data:t,width:e.width,height:e.height}}else return De("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Ku=0,hs=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Ku++}),this.uuid=Ms(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let r=0,o=s.length;r<o;r++)s[r].isDataTexture?a.push(Xo(s[r].image)):a.push(Xo(s[r]))}else a=Xo(s);n.url=a}return t||(e.images[this.uuid]=n),n}};function Xo(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?ta.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(De("Texture: Unable to serialize Texture."),{})}var ju=0,qo=new q,It=class i extends En{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=$t,s=$t,a=ft,r=Xn,o=dn,c=Kt,l=i.DEFAULT_ANISOTROPY,h=qn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:ju++}),this.uuid=Ms(),this.name="",this.source=new hs(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=a,this.minFilter=r,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Je(0,0),this.repeat=new Je(1,1),this.center=new Je(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Oe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(qo).x}get height(){return this.source.getSize(qo).y}get depth(){return this.source.getSize(qo).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){De(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){De(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Pl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case rs:e.x=e.x-Math.floor(e.x);break;case $t:e.x=e.x<0?0:1;break;case Qr:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case rs:e.y=e.y-Math.floor(e.y);break;case $t:e.y=e.y<0?0:1;break;case Qr:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};It.DEFAULT_IMAGE=null;It.DEFAULT_MAPPING=Pl;It.DEFAULT_ANISOTROPY=1;var pt=class i{static{i.prototype.isVector4=!0}constructor(e=0,t=0,n=0,s=1){this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,a=this.w,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s+r[12]*a,this.y=r[1]*t+r[5]*n+r[9]*s+r[13]*a,this.z=r[2]*t+r[6]*n+r[10]*s+r[14]*a,this.w=r[3]*t+r[7]*n+r[11]*s+r[15]*a,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,a,c=e.elements,l=c[0],h=c[4],f=c[8],u=c[1],d=c[5],v=c[9],S=c[2],m=c[6],p=c[10];if(Math.abs(h-u)<.01&&Math.abs(f-S)<.01&&Math.abs(v-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(f+S)<.1&&Math.abs(v+m)<.1&&Math.abs(l+d+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let U=(l+1)/2,y=(d+1)/2,w=(p+1)/2,b=(h+u)/4,P=(f+S)/4,x=(v+m)/4;return U>y&&U>w?U<.01?(n=0,s=.707106781,a=.707106781):(n=Math.sqrt(U),s=b/n,a=P/n):y>w?y<.01?(n=.707106781,s=0,a=.707106781):(s=Math.sqrt(y),n=b/s,a=x/s):w<.01?(n=.707106781,s=.707106781,a=0):(a=Math.sqrt(w),n=P/a,s=x/a),this.set(n,s,a,t),this}let T=Math.sqrt((m-v)*(m-v)+(f-S)*(f-S)+(u-h)*(u-h));return Math.abs(T)<.001&&(T=1),this.x=(m-v)/T,this.y=(f-S)/T,this.z=(u-h)/T,this.w=Math.acos((l+d+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=qe(this.x,e.x,t.x),this.y=qe(this.y,e.y,t.y),this.z=qe(this.z,e.z,t.z),this.w=qe(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=qe(this.x,e,t),this.y=qe(this.y,e,t),this.z=qe(this.z,e,t),this.w=qe(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},na=class extends En{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ft,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new pt(0,0,e,t),this.scissorTest=!1,this.viewport=new pt(0,0,e,t),this.textures=[];let s={width:e,height:t,depth:n.depth},a=new It(s),r=n.count;for(let o=0;o<r;o++)this.textures[o]=a.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:ft,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,a=this.textures.length;s<a;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new hs(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Jt=class extends na{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Ws=class extends It{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Ct,this.minFilter=Ct,this.wrapR=$t,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var ia=class extends It{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Ct,this.minFilter=Ct,this.wrapR=$t,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var xt=class i{static{i.prototype.isMatrix4=!0}constructor(e,t,n,s,a,r,o,c,l,h,f,u,d,v,S,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,a,r,o,c,l,h,f,u,d,v,S,m)}set(e,t,n,s,a,r,o,c,l,h,f,u,d,v,S,m){let p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=a,p[5]=r,p[9]=o,p[13]=c,p[2]=l,p[6]=h,p[10]=f,p[14]=u,p[3]=d,p[7]=v,p[11]=S,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,s=1/Gi.setFromMatrixColumn(e,0).length(),a=1/Gi.setFromMatrixColumn(e,1).length(),r=1/Gi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*a,t[5]=n[5]*a,t[6]=n[6]*a,t[7]=0,t[8]=n[8]*r,t[9]=n[9]*r,t[10]=n[10]*r,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,a=e.z,r=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(a),f=Math.sin(a);if(e.order==="XYZ"){let u=r*h,d=r*f,v=o*h,S=o*f;t[0]=c*h,t[4]=-c*f,t[8]=l,t[1]=d+v*l,t[5]=u-S*l,t[9]=-o*c,t[2]=S-u*l,t[6]=v+d*l,t[10]=r*c}else if(e.order==="YXZ"){let u=c*h,d=c*f,v=l*h,S=l*f;t[0]=u+S*o,t[4]=v*o-d,t[8]=r*l,t[1]=r*f,t[5]=r*h,t[9]=-o,t[2]=d*o-v,t[6]=S+u*o,t[10]=r*c}else if(e.order==="ZXY"){let u=c*h,d=c*f,v=l*h,S=l*f;t[0]=u-S*o,t[4]=-r*f,t[8]=v+d*o,t[1]=d+v*o,t[5]=r*h,t[9]=S-u*o,t[2]=-r*l,t[6]=o,t[10]=r*c}else if(e.order==="ZYX"){let u=r*h,d=r*f,v=o*h,S=o*f;t[0]=c*h,t[4]=v*l-d,t[8]=u*l+S,t[1]=c*f,t[5]=S*l+u,t[9]=d*l-v,t[2]=-l,t[6]=o*c,t[10]=r*c}else if(e.order==="YZX"){let u=r*c,d=r*l,v=o*c,S=o*l;t[0]=c*h,t[4]=S-u*f,t[8]=v*f+d,t[1]=f,t[5]=r*h,t[9]=-o*h,t[2]=-l*h,t[6]=d*f+v,t[10]=u-S*f}else if(e.order==="XZY"){let u=r*c,d=r*l,v=o*c,S=o*l;t[0]=c*h,t[4]=-f,t[8]=l*h,t[1]=u*f+S,t[5]=r*h,t[9]=d*f-v,t[2]=v*f-d,t[6]=o*h,t[10]=S*f+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Qu,e,ed)}lookAt(e,t,n){let s=this.elements;return tn.subVectors(e,t),tn.lengthSq()===0&&(tn.z=1),tn.normalize(),Kn.crossVectors(n,tn),Kn.lengthSq()===0&&(Math.abs(n.z)===1?tn.x+=1e-4:tn.z+=1e-4,tn.normalize(),Kn.crossVectors(n,tn)),Kn.normalize(),Er.crossVectors(tn,Kn),s[0]=Kn.x,s[4]=Er.x,s[8]=tn.x,s[1]=Kn.y,s[5]=Er.y,s[9]=tn.y,s[2]=Kn.z,s[6]=Er.z,s[10]=tn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,a=this.elements,r=n[0],o=n[4],c=n[8],l=n[12],h=n[1],f=n[5],u=n[9],d=n[13],v=n[2],S=n[6],m=n[10],p=n[14],T=n[3],U=n[7],y=n[11],w=n[15],b=s[0],P=s[4],x=s[8],M=s[12],L=s[1],I=s[5],z=s[9],k=s[13],C=s[2],G=s[6],X=s[10],$=s[14],ie=s[3],Z=s[7],Q=s[11],se=s[15];return a[0]=r*b+o*L+c*C+l*ie,a[4]=r*P+o*I+c*G+l*Z,a[8]=r*x+o*z+c*X+l*Q,a[12]=r*M+o*k+c*$+l*se,a[1]=h*b+f*L+u*C+d*ie,a[5]=h*P+f*I+u*G+d*Z,a[9]=h*x+f*z+u*X+d*Q,a[13]=h*M+f*k+u*$+d*se,a[2]=v*b+S*L+m*C+p*ie,a[6]=v*P+S*I+m*G+p*Z,a[10]=v*x+S*z+m*X+p*Q,a[14]=v*M+S*k+m*$+p*se,a[3]=T*b+U*L+y*C+w*ie,a[7]=T*P+U*I+y*G+w*Z,a[11]=T*x+U*z+y*X+w*Q,a[15]=T*M+U*k+y*$+w*se,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],a=e[12],r=e[1],o=e[5],c=e[9],l=e[13],h=e[2],f=e[6],u=e[10],d=e[14],v=e[3],S=e[7],m=e[11],p=e[15],T=c*d-l*u,U=o*d-l*f,y=o*u-c*f,w=r*d-l*h,b=r*u-c*h,P=r*f-o*h;return t*(S*T-m*U+p*y)-n*(v*T-m*w+p*b)+s*(v*U-S*w+p*P)-a*(v*y-S*b+m*P)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],s=e[8],a=e[1],r=e[5],o=e[9],c=e[2],l=e[6],h=e[10];return t*(r*h-o*l)-n*(a*h-o*c)+s*(a*l-r*c)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],a=e[3],r=e[4],o=e[5],c=e[6],l=e[7],h=e[8],f=e[9],u=e[10],d=e[11],v=e[12],S=e[13],m=e[14],p=e[15],T=t*o-n*r,U=t*c-s*r,y=t*l-a*r,w=n*c-s*o,b=n*l-a*o,P=s*l-a*c,x=h*S-f*v,M=h*m-u*v,L=h*p-d*v,I=f*m-u*S,z=f*p-d*S,k=u*p-d*m,C=T*k-U*z+y*I+w*L-b*M+P*x;if(C===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let G=1/C;return e[0]=(o*k-c*z+l*I)*G,e[1]=(s*z-n*k-a*I)*G,e[2]=(S*P-m*b+p*w)*G,e[3]=(u*b-f*P-d*w)*G,e[4]=(c*L-r*k-l*M)*G,e[5]=(t*k-s*L+a*M)*G,e[6]=(m*y-v*P-p*U)*G,e[7]=(h*P-u*y+d*U)*G,e[8]=(r*z-o*L+l*x)*G,e[9]=(n*L-t*z-a*x)*G,e[10]=(v*b-S*y+p*T)*G,e[11]=(f*y-h*b-d*T)*G,e[12]=(o*M-r*I-c*x)*G,e[13]=(t*I-n*M+s*x)*G,e[14]=(S*U-v*w-m*T)*G,e[15]=(h*w-f*U+u*T)*G,this}scale(e){let t=this.elements,n=e.x,s=e.y,a=e.z;return t[0]*=n,t[4]*=s,t[8]*=a,t[1]*=n,t[5]*=s,t[9]*=a,t[2]*=n,t[6]*=s,t[10]*=a,t[3]*=n,t[7]*=s,t[11]*=a,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),a=1-n,r=e.x,o=e.y,c=e.z,l=a*r,h=a*o;return this.set(l*r+n,l*o-s*c,l*c+s*o,0,l*o+s*c,h*o+n,h*c-s*r,0,l*c-s*o,h*c+s*r,a*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,a,r){return this.set(1,n,a,0,e,1,r,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,a=t._x,r=t._y,o=t._z,c=t._w,l=a+a,h=r+r,f=o+o,u=a*l,d=a*h,v=a*f,S=r*h,m=r*f,p=o*f,T=c*l,U=c*h,y=c*f,w=n.x,b=n.y,P=n.z;return s[0]=(1-(S+p))*w,s[1]=(d+y)*w,s[2]=(v-U)*w,s[3]=0,s[4]=(d-y)*b,s[5]=(1-(u+p))*b,s[6]=(m+T)*b,s[7]=0,s[8]=(v+U)*P,s[9]=(m-T)*P,s[10]=(1-(u+S))*P,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];let a=this.determinantAffine();if(a===0)return n.set(1,1,1),t.identity(),this;let r=Gi.set(s[0],s[1],s[2]).length(),o=Gi.set(s[4],s[5],s[6]).length(),c=Gi.set(s[8],s[9],s[10]).length();a<0&&(r=-r),fn.copy(this);let l=1/r,h=1/o,f=1/c;return fn.elements[0]*=l,fn.elements[1]*=l,fn.elements[2]*=l,fn.elements[4]*=h,fn.elements[5]*=h,fn.elements[6]*=h,fn.elements[8]*=f,fn.elements[9]*=f,fn.elements[10]*=f,t.setFromRotationMatrix(fn),n.x=r,n.y=o,n.z=c,this}makePerspective(e,t,n,s,a,r,o=_n,c=!1){let l=this.elements,h=2*a/(t-e),f=2*a/(n-s),u=(t+e)/(t-e),d=(n+s)/(n-s),v,S;if(c)v=a/(r-a),S=r*a/(r-a);else if(o===_n)v=-(r+a)/(r-a),S=-2*r*a/(r-a);else if(o===as)v=-r/(r-a),S=-r*a/(r-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=f,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=v,l[14]=S,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,a,r,o=_n,c=!1){let l=this.elements,h=2/(t-e),f=2/(n-s),u=-(t+e)/(t-e),d=-(n+s)/(n-s),v,S;if(c)v=1/(r-a),S=r/(r-a);else if(o===_n)v=-2/(r-a),S=-(r+a)/(r-a);else if(o===as)v=-1/(r-a),S=-a/(r-a);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=0,l[12]=u,l[1]=0,l[5]=f,l[9]=0,l[13]=d,l[2]=0,l[6]=0,l[10]=v,l[14]=S,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Gi=new q,fn=new xt,Qu=new q(0,0,0),ed=new q(1,1,1),Kn=new q,Er=new q,tn=new q,Pc=new xt,Lc=new wn,Hn=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,a=s[0],r=s[4],o=s[8],c=s[1],l=s[5],h=s[9],f=s[2],u=s[6],d=s[10];switch(t){case"XYZ":this._y=Math.asin(qe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-r,a)):(this._x=Math.atan2(u,l),this._z=0);break;case"YXZ":this._x=Math.asin(-qe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-f,a),this._z=0);break;case"ZXY":this._x=Math.asin(qe(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-r,l)):(this._y=0,this._z=Math.atan2(c,a));break;case"ZYX":this._y=Math.asin(-qe(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(u,d),this._z=Math.atan2(c,a)):(this._x=0,this._z=Math.atan2(-r,l));break;case"YZX":this._z=Math.asin(qe(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-f,a)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-qe(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(u,l),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-h,d),this._y=0);break;default:De("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Pc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Pc,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Lc.setFromEuler(this),this.setFromQuaternion(Lc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Hn.DEFAULT_ORDER="XYZ";var Xs=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},td=0,Dc=new q,Hi=new wn,Nn=new xt,wr=new q,Fs=new q,nd=new q,id=new wn,Uc=new q(1,0,0),Nc=new q(0,1,0),Fc=new q(0,0,1),Oc={type:"added"},sd={type:"removed"},Wi={type:"childadded",child:null},Yo={type:"childremoved",child:null},zt=class i extends En{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:td++}),this.uuid=Ms(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new q,t=new Hn,n=new wn,s=new q(1,1,1);function a(){n.setFromEuler(t,!1)}function r(){t.setFromQuaternion(n,void 0,!1)}t._onChange(a),n._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new xt},normalMatrix:{value:new Oe}}),this.matrix=new xt,this.matrixWorld=new xt,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Xs,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Hi.setFromAxisAngle(e,t),this.quaternion.multiply(Hi),this}rotateOnWorldAxis(e,t){return Hi.setFromAxisAngle(e,t),this.quaternion.premultiply(Hi),this}rotateX(e){return this.rotateOnAxis(Uc,e)}rotateY(e){return this.rotateOnAxis(Nc,e)}rotateZ(e){return this.rotateOnAxis(Fc,e)}translateOnAxis(e,t){return Dc.copy(e).applyQuaternion(this.quaternion),this.position.add(Dc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Uc,e)}translateY(e){return this.translateOnAxis(Nc,e)}translateZ(e){return this.translateOnAxis(Fc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Nn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?wr.copy(e):wr.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Fs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Nn.lookAt(Fs,wr,this.up):Nn.lookAt(wr,Fs,this.up),this.quaternion.setFromRotationMatrix(Nn),s&&(Nn.extractRotation(s.matrixWorld),Hi.setFromRotationMatrix(Nn),this.quaternion.premultiply(Hi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Fe("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Oc),Wi.child=e,this.dispatchEvent(Wi),Wi.child=null):Fe("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(sd),Yo.child=e,this.dispatchEvent(Yo),Yo.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Nn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Nn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Nn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Oc),Wi.child=e,this.dispatchEvent(Wi),Wi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Fs,e,nd),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Fs,id,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,s=e.z,a=this.matrix.elements;a[12]+=t-a[0]*t-a[4]*n-a[8]*s,a[13]+=n-a[1]*t-a[5]*n-a[9]*s,a[14]+=s-a[2]*t-a[6]*n-a[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let a=this.children;for(let r=0,o=a.length;r<o;r++)a[r].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function a(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){let f=c[l];a(e.shapes,f)}else a(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(a(e.materials,this.material[c]));s.material=o}else s.material=a(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let c=this.animations[o];s.animations.push(a(e.animations,c))}}if(t){let o=r(e.geometries),c=r(e.materials),l=r(e.textures),h=r(e.images),f=r(e.shapes),u=r(e.skeletons),d=r(e.animations),v=r(e.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),f.length>0&&(n.shapes=f),u.length>0&&(n.skeletons=u),d.length>0&&(n.animations=d),v.length>0&&(n.nodes=v)}return n.object=s,n;function r(o){let c=[];for(let l in o){let h=o[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};zt.DEFAULT_UP=new q(0,1,0);zt.DEFAULT_MATRIX_AUTO_UPDATE=!0;zt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var xn=class extends zt{constructor(){super(),this.isGroup=!0,this.type="Group"}},rd={type:"move"},us=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new xn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new xn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new q,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new q),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new xn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new q,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new q,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,a=null,r=null,o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){r=!0;for(let S of e.hand.values()){let m=t.getJointPose(S,n),p=this._getHandJoint(l,S);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}let h=l.joints["index-finger-tip"],f=l.joints["thumb-tip"],u=h.position.distanceTo(f.position),d=.02,v=.005;l.inputState.pinching&&u>d+v?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&u<=d-v&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(a=t.getPose(e.gripSpace,n),a!==null&&(c.matrix.fromArray(a.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,a.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(a.linearVelocity)):c.hasLinearVelocity=!1,a.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(a.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&a!==null&&(s=a),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(rd)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=a!==null),l!==null&&(l.visible=r!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new xn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Lh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},jn={h:0,s:0,l:0},Ar={h:0,s:0,l:0};function Zo(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var Ge=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Rt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,$e.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=$e.workingColorSpace){return this.r=e,this.g=t,this.b=n,$e.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=$e.workingColorSpace){if(e=Hl(e,1),t=qe(t,0,1),n=qe(n,0,1),t===0)this.r=this.g=this.b=n;else{let a=n<=.5?n*(1+t):n+t-n*t,r=2*n-a;this.r=Zo(r,a,e+1/3),this.g=Zo(r,a,e),this.b=Zo(r,a,e-1/3)}return $e.colorSpaceToWorking(this,s),this}setStyle(e,t=Rt){function n(a){a!==void 0&&parseFloat(a)<1&&De("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let a,r=s[1],o=s[2];switch(r){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,t);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,t);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,t);break;default:De("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let a=s[1],r=a.length;if(r===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,t);if(r===6)return this.setHex(parseInt(a,16),t);De("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Rt){let n=Lh[e.toLowerCase()];return n!==void 0?this.setHex(n,t):De("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Gn(e.r),this.g=Gn(e.g),this.b=Gn(e.b),this}copyLinearToSRGB(e){return this.r=ns(e.r),this.g=ns(e.g),this.b=ns(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Rt){return $e.workingToColorSpace(Ft.copy(this),e),Math.round(qe(Ft.r*255,0,255))*65536+Math.round(qe(Ft.g*255,0,255))*256+Math.round(qe(Ft.b*255,0,255))}getHexString(e=Rt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=$e.workingColorSpace){$e.workingToColorSpace(Ft.copy(this),t);let n=Ft.r,s=Ft.g,a=Ft.b,r=Math.max(n,s,a),o=Math.min(n,s,a),c,l,h=(o+r)/2;if(o===r)c=0,l=0;else{let f=r-o;switch(l=h<=.5?f/(r+o):f/(2-r-o),r){case n:c=(s-a)/f+(s<a?6:0);break;case s:c=(a-n)/f+2;break;case a:c=(n-s)/f+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=$e.workingColorSpace){return $e.workingToColorSpace(Ft.copy(this),t),e.r=Ft.r,e.g=Ft.g,e.b=Ft.b,e}getStyle(e=Rt){$e.workingToColorSpace(Ft.copy(this),e);let t=Ft.r,n=Ft.g,s=Ft.b;return e!==Rt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(jn),this.setHSL(jn.h+e,jn.s+t,jn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(jn),e.getHSL(Ar);let n=Vs(jn.h,Ar.h,t),s=Vs(jn.s,Ar.s,t),a=Vs(jn.l,Ar.l,t);return this.setHSL(n,s,a),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,a=e.elements;return this.r=a[0]*t+a[3]*n+a[6]*s,this.g=a[1]*t+a[4]*n+a[7]*s,this.b=a[2]*t+a[5]*n+a[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Ft=new Ge;Ge.NAMES=Lh;var qs=class extends zt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Hn,this.environmentIntensity=1,this.environmentRotation=new Hn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},pn=new q,Fn=new q,$o=new q,On=new q,Xi=new q,qi=new q,Bc=new q,Jo=new q,Ko=new q,jo=new q,Qo=new pt,el=new pt,tl=new pt,ni=class i{constructor(e=new q,t=new q,n=new q){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),pn.subVectors(e,t),s.cross(pn);let a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(e,t,n,s,a){pn.subVectors(s,t),Fn.subVectors(n,t),$o.subVectors(e,t);let r=pn.dot(pn),o=pn.dot(Fn),c=pn.dot($o),l=Fn.dot(Fn),h=Fn.dot($o),f=r*l-o*o;if(f===0)return a.set(0,0,0),null;let u=1/f,d=(l*c-o*h)*u,v=(r*h-o*c)*u;return a.set(1-d-v,v,d)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,On)===null?!1:On.x>=0&&On.y>=0&&On.x+On.y<=1}static getInterpolation(e,t,n,s,a,r,o,c){return this.getBarycoord(e,t,n,s,On)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(a,On.x),c.addScaledVector(r,On.y),c.addScaledVector(o,On.z),c)}static getInterpolatedAttribute(e,t,n,s,a,r){return Qo.setScalar(0),el.setScalar(0),tl.setScalar(0),Qo.fromBufferAttribute(e,t),el.fromBufferAttribute(e,n),tl.fromBufferAttribute(e,s),r.setScalar(0),r.addScaledVector(Qo,a.x),r.addScaledVector(el,a.y),r.addScaledVector(tl,a.z),r}static isFrontFacing(e,t,n,s){return pn.subVectors(n,t),Fn.subVectors(e,t),pn.cross(Fn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return pn.subVectors(this.c,this.b),Fn.subVectors(this.a,this.b),pn.cross(Fn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,a){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,a)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,a=this.c,r,o;Xi.subVectors(s,n),qi.subVectors(a,n),Jo.subVectors(e,n);let c=Xi.dot(Jo),l=qi.dot(Jo);if(c<=0&&l<=0)return t.copy(n);Ko.subVectors(e,s);let h=Xi.dot(Ko),f=qi.dot(Ko);if(h>=0&&f<=h)return t.copy(s);let u=c*f-h*l;if(u<=0&&c>=0&&h<=0)return r=c/(c-h),t.copy(n).addScaledVector(Xi,r);jo.subVectors(e,a);let d=Xi.dot(jo),v=qi.dot(jo);if(v>=0&&d<=v)return t.copy(a);let S=d*l-c*v;if(S<=0&&l>=0&&v<=0)return o=l/(l-v),t.copy(n).addScaledVector(qi,o);let m=h*v-d*f;if(m<=0&&f-h>=0&&d-v>=0)return Bc.subVectors(a,s),o=(f-h)/(f-h+(d-v)),t.copy(s).addScaledVector(Bc,o);let p=1/(m+S+u);return r=S*p,o=u*p,t.copy(n).addScaledVector(Xi,r).addScaledVector(qi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},ii=class{constructor(e=new q(1/0,1/0,1/0),t=new q(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(mn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(mn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=mn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let a=n.getAttribute("position");if(t===!0&&a!==void 0&&e.isInstancedMesh!==!0)for(let r=0,o=a.count;r<o;r++)e.isMesh===!0?e.getVertexPosition(r,mn):mn.fromBufferAttribute(a,r),mn.applyMatrix4(e.matrixWorld),this.expandByPoint(mn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Rr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Rr.copy(n.boundingBox)),Rr.applyMatrix4(e.matrixWorld),this.union(Rr)}let s=e.children;for(let a=0,r=s.length;a<r;a++)this.expandByObject(s[a],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,mn),mn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Os),Cr.subVectors(this.max,Os),Yi.subVectors(e.a,Os),Zi.subVectors(e.b,Os),$i.subVectors(e.c,Os),Qn.subVectors(Zi,Yi),ei.subVectors($i,Zi),yi.subVectors(Yi,$i);let t=[0,-Qn.z,Qn.y,0,-ei.z,ei.y,0,-yi.z,yi.y,Qn.z,0,-Qn.x,ei.z,0,-ei.x,yi.z,0,-yi.x,-Qn.y,Qn.x,0,-ei.y,ei.x,0,-yi.y,yi.x,0];return!nl(t,Yi,Zi,$i,Cr)||(t=[1,0,0,0,1,0,0,0,1],!nl(t,Yi,Zi,$i,Cr))?!1:(Ir.crossVectors(Qn,ei),t=[Ir.x,Ir.y,Ir.z],nl(t,Yi,Zi,$i,Cr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,mn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(mn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Bn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Bn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Bn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Bn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Bn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Bn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Bn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Bn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Bn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Bn=[new q,new q,new q,new q,new q,new q,new q,new q],mn=new q,Rr=new ii,Yi=new q,Zi=new q,$i=new q,Qn=new q,ei=new q,yi=new q,Os=new q,Cr=new q,Ir=new q,Si=new q;function nl(i,e,t,n,s){for(let a=0,r=i.length-3;a<=r;a+=3){Si.fromArray(i,a);let o=s.x*Math.abs(Si.x)+s.y*Math.abs(Si.y)+s.z*Math.abs(Si.z),c=e.dot(Si),l=t.dot(Si),h=n.dot(Si);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}var Vn=ad();function ad(){let i=new ArrayBuffer(4),e=new Float32Array(i),t=new Uint32Array(i),n=new Uint32Array(512),s=new Uint32Array(512);for(let c=0;c<256;++c){let l=c-127;l<-27?(n[c]=0,n[c|256]=32768,s[c]=24,s[c|256]=24):l<-14?(n[c]=1024>>-l-14,n[c|256]=1024>>-l-14|32768,s[c]=-l-1,s[c|256]=-l-1):l<=15?(n[c]=l+15<<10,n[c|256]=l+15<<10|32768,s[c]=13,s[c|256]=13):l<128?(n[c]=31744,n[c|256]=64512,s[c]=24,s[c|256]=24):(n[c]=31744,n[c|256]=64512,s[c]=13,s[c|256]=13)}let a=new Uint32Array(2048),r=new Uint32Array(64),o=new Uint32Array(64);for(let c=1;c<1024;++c){let l=c<<13,h=0;for(;(l&8388608)===0;)l<<=1,h-=8388608;l&=-8388609,h+=947912704,a[c]=l|h}for(let c=1024;c<2048;++c)a[c]=939524096+(c-1024<<13);for(let c=1;c<31;++c)r[c]=c<<23;r[31]=1199570944,r[32]=2147483648;for(let c=33;c<63;++c)r[c]=2147483648+(c-32<<23);r[63]=3347054592;for(let c=1;c<64;++c)c!==32&&(o[c]=1024);return{floatView:e,uint32View:t,baseTable:n,shiftTable:s,mantissaTable:a,exponentTable:r,offsetTable:o}}function od(i){Math.abs(i)>65504&&De("DataUtils.toHalfFloat(): Value out of range."),i=qe(i,-65504,65504),Vn.floatView[0]=i;let e=Vn.uint32View[0],t=e>>23&511;return Vn.baseTable[t]+((e&8388607)>>Vn.shiftTable[t])}function ld(i){let e=i>>10;return Vn.uint32View[0]=Vn.mantissaTable[Vn.offsetTable[e]+(i&1023)]+Vn.exponentTable[e],Vn.floatView[0]}var si=class{static toHalfFloat(e){return od(e)}static fromHalfFloat(e){return ld(e)}},bt=new q,Pr=new Je,cd=0,hn=class extends En{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:cd++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Ah,this.updateRanges=[],this.gpuType=jt,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Pr.fromBufferAttribute(this,t),Pr.applyMatrix3(e),this.setXY(t,Pr.x,Pr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)bt.fromBufferAttribute(this,t),bt.applyMatrix3(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)bt.fromBufferAttribute(this,t),bt.applyMatrix4(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)bt.fromBufferAttribute(this,t),bt.applyNormalMatrix(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)bt.fromBufferAttribute(this,t),bt.transformDirection(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=ts(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Wt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=ts(t,this.array)),t}setX(e,t){return this.normalized&&(t=Wt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=ts(t,this.array)),t}setY(e,t){return this.normalized&&(t=Wt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=ts(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Wt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=ts(t,this.array)),t}setW(e,t){return this.normalized&&(t=Wt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Wt(t,this.array),n=Wt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=Wt(t,this.array),n=Wt(n,this.array),s=Wt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,a){return e*=this.itemSize,this.normalized&&(t=Wt(t,this.array),n=Wt(n,this.array),s=Wt(s,this.array),a=Wt(a,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=a,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}};var Ys=class extends hn{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Zs=class extends hn{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var Bt=class extends hn{constructor(e,t,n){super(new Float32Array(e),t,n)}},hd=new ii,Bs=new q,il=new q,ds=class{constructor(e=new q,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):hd.setFromPoints(e).getCenter(n);let s=0;for(let a=0,r=e.length;a<r;a++)s=Math.max(s,n.distanceToSquared(e[a]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Bs.subVectors(e,this.center);let t=Bs.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Bs,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(il.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Bs.copy(e.center).add(il)),this.expandByPoint(Bs.copy(e.center).sub(il))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},ud=0,cn=new xt,sl=new zt,Ji=new q,nn=new ii,zs=new ii,At=new q,un=class i extends En{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:ud++}),this.uuid=Ms(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Lu(e)?Zs:Ys)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let a=new Oe().getNormalMatrix(e);n.applyNormalMatrix(a),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return cn.makeRotationFromQuaternion(e),this.applyMatrix4(cn),this}rotateX(e){return cn.makeRotationX(e),this.applyMatrix4(cn),this}rotateY(e){return cn.makeRotationY(e),this.applyMatrix4(cn),this}rotateZ(e){return cn.makeRotationZ(e),this.applyMatrix4(cn),this}translate(e,t,n){return cn.makeTranslation(e,t,n),this.applyMatrix4(cn),this}scale(e,t,n){return cn.makeScale(e,t,n),this.applyMatrix4(cn),this}lookAt(e){return sl.lookAt(e),sl.updateMatrix(),this.applyMatrix4(sl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ji).negate(),this.translate(Ji.x,Ji.y,Ji.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,a=e.length;s<a;s++){let r=e[s];n.push(r.x,r.y,r.z||0)}this.setAttribute("position",new Bt(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let a=e[s];t.setXYZ(s,a.x,a.y,a.z||0)}e.length>t.count&&De("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ii);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Fe("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new q(-1/0,-1/0,-1/0),new q(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let a=t[n];nn.setFromBufferAttribute(a),this.morphTargetsRelative?(At.addVectors(this.boundingBox.min,nn.min),this.boundingBox.expandByPoint(At),At.addVectors(this.boundingBox.max,nn.max),this.boundingBox.expandByPoint(At)):(this.boundingBox.expandByPoint(nn.min),this.boundingBox.expandByPoint(nn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Fe('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ds);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Fe("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new q,1/0);return}if(e){let n=this.boundingSphere.center;if(nn.setFromBufferAttribute(e),t)for(let a=0,r=t.length;a<r;a++){let o=t[a];zs.setFromBufferAttribute(o),this.morphTargetsRelative?(At.addVectors(nn.min,zs.min),nn.expandByPoint(At),At.addVectors(nn.max,zs.max),nn.expandByPoint(At)):(nn.expandByPoint(zs.min),nn.expandByPoint(zs.max))}nn.getCenter(n);let s=0;for(let a=0,r=e.count;a<r;a++)At.fromBufferAttribute(e,a),s=Math.max(s,n.distanceToSquared(At));if(t)for(let a=0,r=t.length;a<r;a++){let o=t[a],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)At.fromBufferAttribute(o,l),c&&(Ji.fromBufferAttribute(e,l),At.add(Ji)),s=Math.max(s,n.distanceToSquared(At))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Fe('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Fe("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,a=t.uv,r=this.getAttribute("tangent");(r===void 0||r.count!==n.count)&&(r=new hn(new Float32Array(4*n.count),4),this.setAttribute("tangent",r));let o=[],c=[];for(let x=0;x<n.count;x++)o[x]=new q,c[x]=new q;let l=new q,h=new q,f=new q,u=new Je,d=new Je,v=new Je,S=new q,m=new q;function p(x,M,L){l.fromBufferAttribute(n,x),h.fromBufferAttribute(n,M),f.fromBufferAttribute(n,L),u.fromBufferAttribute(a,x),d.fromBufferAttribute(a,M),v.fromBufferAttribute(a,L),h.sub(l),f.sub(l),d.sub(u),v.sub(u);let I=1/(d.x*v.y-v.x*d.y);isFinite(I)&&(S.copy(h).multiplyScalar(v.y).addScaledVector(f,-d.y).multiplyScalar(I),m.copy(f).multiplyScalar(d.x).addScaledVector(h,-v.x).multiplyScalar(I),o[x].add(S),o[M].add(S),o[L].add(S),c[x].add(m),c[M].add(m),c[L].add(m))}let T=this.groups;T.length===0&&(T=[{start:0,count:e.count}]);for(let x=0,M=T.length;x<M;++x){let L=T[x],I=L.start,z=L.count;for(let k=I,C=I+z;k<C;k+=3)p(e.getX(k+0),e.getX(k+1),e.getX(k+2))}let U=new q,y=new q,w=new q,b=new q;function P(x){w.fromBufferAttribute(s,x),b.copy(w);let M=o[x];U.copy(M),U.sub(w.multiplyScalar(w.dot(M))).normalize(),y.crossVectors(b,M);let I=y.dot(c[x])<0?-1:1;r.setXYZW(x,U.x,U.y,U.z,I)}for(let x=0,M=T.length;x<M;++x){let L=T[x],I=L.start,z=L.count;for(let k=I,C=I+z;k<C;k+=3)P(e.getX(k+0)),P(e.getX(k+1)),P(e.getX(k+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new hn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let u=0,d=n.count;u<d;u++)n.setXYZ(u,0,0,0);let s=new q,a=new q,r=new q,o=new q,c=new q,l=new q,h=new q,f=new q;if(e)for(let u=0,d=e.count;u<d;u+=3){let v=e.getX(u+0),S=e.getX(u+1),m=e.getX(u+2);s.fromBufferAttribute(t,v),a.fromBufferAttribute(t,S),r.fromBufferAttribute(t,m),h.subVectors(r,a),f.subVectors(s,a),h.cross(f),o.fromBufferAttribute(n,v),c.fromBufferAttribute(n,S),l.fromBufferAttribute(n,m),o.add(h),c.add(h),l.add(h),n.setXYZ(v,o.x,o.y,o.z),n.setXYZ(S,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let u=0,d=t.count;u<d;u+=3)s.fromBufferAttribute(t,u+0),a.fromBufferAttribute(t,u+1),r.fromBufferAttribute(t,u+2),h.subVectors(r,a),f.subVectors(s,a),h.cross(f),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)At.fromBufferAttribute(e,t),At.normalize(),e.setXYZ(t,At.x,At.y,At.z)}toNonIndexed(){function e(o,c){let l=o.array,h=o.itemSize,f=o.normalized,u=new l.constructor(c.length*h),d=0,v=0;for(let S=0,m=c.length;S<m;S++){o.isInterleavedBufferAttribute?d=c[S]*o.data.stride+o.offset:d=c[S]*h;for(let p=0;p<h;p++)u[v++]=l[d++]}return new hn(u,h,f)}if(this.index===null)return De("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let o in s){let c=s[o],l=e(c,n);t.setAttribute(o,l)}let a=this.morphAttributes;for(let o in a){let c=[],l=a[o];for(let h=0,f=l.length;h<f;h++){let u=l[h],d=e(u,n);c.push(d)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;let r=this.groups;for(let o=0,c=r.length;o<c;o++){let l=r[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let c in n){let l=n[c];e.data.attributes[c]=l.toJSON(e.data)}let s={},a=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],h=[];for(let f=0,u=l.length;f<u;f++){let d=l[f];h.push(d.toJSON(e.data))}h.length>0&&(s[c]=h,a=!0)}a&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let r=this.groups;r.length>0&&(e.data.groups=JSON.parse(JSON.stringify(r)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let l in s){let h=s[l];this.setAttribute(l,h.clone(t))}let a=e.morphAttributes;for(let l in a){let h=[],f=a[l];for(let u=0,d=f.length;u<d;u++)h.push(f[u].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;let r=e.groups;for(let l=0,h=r.length;l<h;l++){let f=r[l];this.addGroup(f.start,f.count,f.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}};var rl=new q,dd=new q,fd=new Oe,gn=class{constructor(e=new q(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=rl.subVectors(n,t).cross(dd.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let s=e.delta(rl),a=this.normal.dot(s);if(a===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/a;return n===!0&&(r<0||r>1)?null:t.copy(e.start).addScaledVector(s,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||fd.getNormalMatrix(e),s=this.coplanarPoint(rl).applyMatrix4(e),a=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(a),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},pd=0,Wn=class extends En{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:pd++}),this.uuid=Ms(),this.name="",this.type="Material",this.blending=vs,this.side=di,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ml,this.blendDst=bl,this.blendEquation=Ci,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ge(0,0,0),this.blendAlpha=0,this.depthFunc=ss,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=yh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Xr,this.stencilZFail=Xr,this.stencilZPass=Xr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){De(`Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){De(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(a=>a.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(a){let r=[];for(let o in a){let c=a[o];delete c.metadata,r.push(c)}return r}if(t){let a=s(e.textures),r=s(e.images);a.length>0&&(n.textures=a),r.length>0&&(n.images=r)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Ge().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new gn().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new Je().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Je().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let a=0;a!==s;++a)n[a]=t[a].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}};var zn=new q,al=new q,Lr=new q,Dr=new q,sa=class{constructor(e=new q,t=new q(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,zn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=zn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(zn.copy(this.origin).addScaledVector(this.direction,t),zn.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){al.copy(e).add(t).multiplyScalar(.5),Lr.copy(t).sub(e).normalize(),Dr.copy(this.origin).sub(al);let a=e.distanceTo(t)*.5,r=-this.direction.dot(Lr),o=Dr.dot(this.direction),c=-Dr.dot(Lr),l=Dr.lengthSq(),h=Math.abs(1-r*r),f,u,d,v;if(h>0)if(f=r*c-o,u=r*o-c,v=a*h,f>=0)if(u>=-v)if(u<=v){let S=1/h;f*=S,u*=S,d=f*(f+r*u+2*o)+u*(r*f+u+2*c)+l}else u=a,f=Math.max(0,-(r*u+o)),d=-f*f+u*(u+2*c)+l;else u=-a,f=Math.max(0,-(r*u+o)),d=-f*f+u*(u+2*c)+l;else u<=-v?(f=Math.max(0,-(-r*a+o)),u=f>0?-a:Math.min(Math.max(-a,-c),a),d=-f*f+u*(u+2*c)+l):u<=v?(f=0,u=Math.min(Math.max(-a,-c),a),d=u*(u+2*c)+l):(f=Math.max(0,-(r*a+o)),u=f>0?a:Math.min(Math.max(-a,-c),a),d=-f*f+u*(u+2*c)+l);else u=r>0?-a:a,f=Math.max(0,-(r*u+o)),d=-f*f+u*(u+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(al).addScaledVector(Lr,u),d}intersectSphere(e,t){if(e.radius<0)return null;zn.subVectors(e.center,this.origin);let n=zn.dot(this.direction),s=zn.dot(zn)-n*n,a=e.radius*e.radius;if(s>a)return null;let r=Math.sqrt(a-s),o=n-r,c=n+r;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,a,r,o,c,l=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,u=this.origin;return l>=0?(n=(e.min.x-u.x)*l,s=(e.max.x-u.x)*l):(n=(e.max.x-u.x)*l,s=(e.min.x-u.x)*l),h>=0?(a=(e.min.y-u.y)*h,r=(e.max.y-u.y)*h):(a=(e.max.y-u.y)*h,r=(e.min.y-u.y)*h),n>r||a>s||((a>n||isNaN(n))&&(n=a),(r<s||isNaN(s))&&(s=r),f>=0?(o=(e.min.z-u.z)*f,c=(e.max.z-u.z)*f):(o=(e.max.z-u.z)*f,c=(e.min.z-u.z)*f),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,zn)!==null}intersectTriangle(e,t,n,s,a){let r=this.origin,o=this.direction,c=o.x,l=o.y,h=o.z,f=e.x-r.x,u=e.y-r.y,d=e.z-r.z,v=t.x-r.x,S=t.y-r.y,m=t.z-r.z,p=n.x-r.x,T=n.y-r.y,U=n.z-r.z,y=Math.abs(c),w=Math.abs(l),b=Math.abs(h),P,x,M,L,I,z,k,C,G,X,$,ie;if(y>=w&&y>=b?(M=c,z=f,G=v,ie=p,c>=0?(P=l,x=h,L=u,I=d,k=S,C=m,X=T,$=U):(P=h,x=l,L=d,I=u,k=m,C=S,X=U,$=T)):w>=b?(M=l,z=u,G=S,ie=T,l>=0?(P=h,x=c,L=d,I=f,k=m,C=v,X=U,$=p):(P=c,x=h,L=f,I=d,k=v,C=m,X=p,$=U)):(M=h,z=d,G=m,ie=U,h>=0?(P=c,x=l,L=f,I=u,k=v,C=S,X=p,$=T):(P=l,x=c,L=u,I=f,k=S,C=v,X=T,$=p)),M===0)return null;let Z=P/M,Q=x/M,se=1/M,le=L-Z*z,Me=I-Q*z,Ue=k-Z*G,xe=C-Q*G,Ke=X-Z*ie,K=$-Q*ie,ee=Ke*xe-K*Ue,Se=le*K-Me*Ke,Le=Ue*Me-xe*le;if(s){if(ee<0||Se<0||Le<0)return null}else if((ee<0||Se<0||Le<0)&&(ee>0||Se>0||Le>0))return null;let ye=ee+Se+Le;if(ye===0)return null;let ke=se*(ee*z+Se*G+Le*ie);return(ye>0?ke<0:ke>0)?null:this.at(ke/ye,a)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},vn=class extends Wn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ge(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Hn,this.combine=Tl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},zc=new xt,Mi=new sa,Ur=new ds,kc=new q,Nr=new q,Fr=new q,Or=new q,ol=new q,Br=new q,Vc=new q,zr=new q,mt=class extends zt{constructor(e=new un,t=new vn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){let o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,a=n.morphAttributes.position,r=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let o=this.morphTargetInfluences;if(a&&o){Br.set(0,0,0);for(let c=0,l=a.length;c<l;c++){let h=o[c],f=a[c];h!==0&&(ol.fromBufferAttribute(f,e),r?Br.addScaledVector(ol,h):Br.addScaledVector(ol.sub(t),h))}t.add(Br)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ur.copy(n.boundingSphere),Ur.applyMatrix4(a),Mi.copy(e.ray).recast(e.near),!(Ur.containsPoint(Mi.origin)===!1&&(Mi.intersectSphere(Ur,kc)===null||Mi.origin.distanceToSquared(kc)>(e.far-e.near)**2))&&(zc.copy(a).invert(),Mi.copy(e.ray).applyMatrix4(zc),!(n.boundingBox!==null&&Mi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Mi)))}_computeIntersections(e,t,n){let s,a=this.geometry,r=this.material,o=a.index,c=a.attributes.position,l=a.attributes.uv,h=a.attributes.uv1,f=a.attributes.normal,u=a.groups,d=a.drawRange;if(o!==null)if(Array.isArray(r))for(let v=0,S=u.length;v<S;v++){let m=u[v],p=r[m.materialIndex],T=Math.max(m.start,d.start),U=Math.min(o.count,Math.min(m.start+m.count,d.start+d.count));for(let y=T,w=U;y<w;y+=3){let b=o.getX(y),P=o.getX(y+1),x=o.getX(y+2);s=kr(this,p,e,n,l,h,f,b,P,x),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let v=Math.max(0,d.start),S=Math.min(o.count,d.start+d.count);for(let m=v,p=S;m<p;m+=3){let T=o.getX(m),U=o.getX(m+1),y=o.getX(m+2);s=kr(this,r,e,n,l,h,f,T,U,y),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(r))for(let v=0,S=u.length;v<S;v++){let m=u[v],p=r[m.materialIndex],T=Math.max(m.start,d.start),U=Math.min(c.count,Math.min(m.start+m.count,d.start+d.count));for(let y=T,w=U;y<w;y+=3){let b=y,P=y+1,x=y+2;s=kr(this,p,e,n,l,h,f,b,P,x),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let v=Math.max(0,d.start),S=Math.min(c.count,d.start+d.count);for(let m=v,p=S;m<p;m+=3){let T=m,U=m+1,y=m+2;s=kr(this,r,e,n,l,h,f,T,U,y),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}};function md(i,e,t,n,s,a,r,o){let c;if(e.side===Xt?c=n.intersectTriangle(r,a,s,!0,o):c=n.intersectTriangle(s,a,r,e.side===di,o),c===null)return null;zr.copy(o),zr.applyMatrix4(i.matrixWorld);let l=t.ray.origin.distanceTo(zr);return l<t.near||l>t.far?null:{distance:l,point:zr.clone(),object:i}}function kr(i,e,t,n,s,a,r,o,c,l){i.getVertexPosition(o,Nr),i.getVertexPosition(c,Fr),i.getVertexPosition(l,Or);let h=md(i,e,t,n,Nr,Fr,Or,Vc);if(h){let f=new q;ni.getBarycoord(Vc,Nr,Fr,Or,f),s&&(h.uv=ni.getInterpolatedAttribute(s,o,c,l,f,new Je)),a&&(h.uv1=ni.getInterpolatedAttribute(a,o,c,l,f,new Je)),r&&(h.normal=ni.getInterpolatedAttribute(r,o,c,l,f,new q),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let u={a:o,b:c,c:l,normal:new q,materialIndex:0};ni.getNormal(Nr,Fr,Or,u.normal),h.face=u,h.barycoord=f}return h}var fs=class extends It{constructor(e=null,t=1,n=1,s,a,r,o,c,l=Ct,h=Ct,f,u){super(null,r,o,c,l,h,s,a,f,u),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var bi=new ds,gd=new Je(.5,.5),Vr=new q,ps=class{constructor(e=new gn,t=new gn,n=new gn,s=new gn,a=new gn,r=new gn){this.planes=[e,t,n,s,a,r]}set(e,t,n,s,a,r){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(a),o[5].copy(r),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=_n,n=!1){let s=this.planes,a=e.elements,r=a[0],o=a[1],c=a[2],l=a[3],h=a[4],f=a[5],u=a[6],d=a[7],v=a[8],S=a[9],m=a[10],p=a[11],T=a[12],U=a[13],y=a[14],w=a[15];if(s[0].setComponents(l-r,d-h,p-v,w-T).normalize(),s[1].setComponents(l+r,d+h,p+v,w+T).normalize(),s[2].setComponents(l+o,d+f,p+S,w+U).normalize(),s[3].setComponents(l-o,d-f,p-S,w-U).normalize(),n)s[4].setComponents(c,u,m,y).normalize(),s[5].setComponents(l-c,d-u,p-m,w-y).normalize();else if(s[4].setComponents(l-c,d-u,p-m,w-y).normalize(),t===_n)s[5].setComponents(l+c,d+u,p+m,w+y).normalize();else if(t===as)s[5].setComponents(c,u,m,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),bi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),bi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(bi)}intersectsSprite(e){bi.center.set(0,0,0);let t=gd.distanceTo(e.center);return bi.radius=.7071067811865476+t,bi.applyMatrix4(e.matrixWorld),this.intersectsSphere(bi)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let a=0;a<6;a++)if(t[a].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(Vr.x=s.normal.x>0?e.max.x:e.min.x,Vr.y=s.normal.y>0?e.max.y:e.min.y,Vr.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Vr)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var $s=class extends It{constructor(e=[],t=fi,n,s,a,r,o,c,l,h){super(e,t,n,s,a,r,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},ri=class extends It{constructor(e,t,n,s,a,r,o,c,l){super(e,t,n,s,a,r,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}};var ai=class extends It{constructor(e,t,n=yn,s,a,r,o=Ct,c=Ct,l,h=Tn,f=1){if(h!==Tn&&h!==pi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let u={width:e,height:t,depth:f};super(u,s,a,r,o,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new hs(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},ra=class extends ai{constructor(e,t=yn,n=fi,s,a,r=Ct,o=Ct,c,l=Tn){let h={width:e,height:e,depth:1},f=[h,h,h,h,h,h];super(e,e,t,n,s,a,r,o,c,l),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Js=class extends It{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},ms=class i extends un{constructor(e=1,t=1,n=1,s=1,a=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:a,depthSegments:r};let o=this;s=Math.floor(s),a=Math.floor(a),r=Math.floor(r);let c=[],l=[],h=[],f=[],u=0,d=0;v("z","y","x",-1,-1,n,t,e,r,a,0),v("z","y","x",1,-1,n,t,-e,r,a,1),v("x","z","y",1,1,e,n,t,s,r,2),v("x","z","y",1,-1,e,n,-t,s,r,3),v("x","y","z",1,-1,e,t,n,s,a,4),v("x","y","z",-1,-1,e,t,-n,s,a,5),this.setIndex(c),this.setAttribute("position",new Bt(l,3)),this.setAttribute("normal",new Bt(h,3)),this.setAttribute("uv",new Bt(f,2));function v(S,m,p,T,U,y,w,b,P,x,M){let L=y/P,I=w/x,z=y/2,k=w/2,C=b/2,G=P+1,X=x+1,$=0,ie=0,Z=new q;for(let Q=0;Q<X;Q++){let se=Q*I-k;for(let le=0;le<G;le++){let Me=le*L-z;Z[S]=Me*T,Z[m]=se*U,Z[p]=C,l.push(Z.x,Z.y,Z.z),Z[S]=0,Z[m]=0,Z[p]=b>0?1:-1,h.push(Z.x,Z.y,Z.z),f.push(le/P),f.push(1-Q/x),$+=1}}for(let Q=0;Q<x;Q++)for(let se=0;se<P;se++){let le=u+se+G*Q,Me=u+se+G*(Q+1),Ue=u+(se+1)+G*(Q+1),xe=u+(se+1)+G*Q;c.push(le,Me,xe),c.push(Me,Ue,xe),ie+=6}o.addGroup(d,ie,M),d+=ie,u+=$}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};var kt=class i extends un{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let a=e/2,r=t/2,o=Math.floor(n),c=Math.floor(s),l=o+1,h=c+1,f=e/o,u=t/c,d=[],v=[],S=[],m=[];for(let p=0;p<h;p++){let T=p*u-r;for(let U=0;U<l;U++){let y=U*f-a;v.push(y,-T,0),S.push(0,0,1),m.push(U/o),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let T=0;T<o;T++){let U=T+l*p,y=T+l*(p+1),w=T+1+l*(p+1),b=T+1+l*p;d.push(U,y,b),d.push(y,w,b)}this.setIndex(d),this.setAttribute("position",new Bt(v,3)),this.setAttribute("normal",new Bt(S,3)),this.setAttribute("uv",new Bt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}};var Ks=class extends Wn{constructor(e){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new Ge(0),this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.fog=e.fog,this}};function Pi(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];if(Gc(s))s.isRenderTargetTexture?(De("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone();else if(Array.isArray(s))if(Gc(s[0])){let a=[];for(let r=0,o=s.length;r<o;r++)a[r]=s[r].clone();e[t][n]=a}else e[t][n]=s.slice();else e[t][n]=s}}return e}function Vt(i){let e={};for(let t=0;t<i.length;t++){let n=Pi(i[t]);for(let s in n)e[s]=n[s]}return e}function Gc(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function _d(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Wl(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:$e.workingColorSpace}var Dh={clone:Pi,merge:Vt},xd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,vd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,sn=class extends Wn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=xd,this.fragmentShader=vd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Pi(e.uniforms),this.uniformsGroups=_d(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let r=this.uniforms[s].value;r&&r.isTexture?t.uniforms[s]={type:"t",value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?t.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?t.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?t.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?t.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?t.uniforms[s]={type:"m4",value:r.toArray()}:t.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let s=e.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=t[s.value]||null;break;case"c":this.uniforms[n].value=new Ge().setHex(s.value);break;case"v2":this.uniforms[n].value=new Je().fromArray(s.value);break;case"v3":this.uniforms[n].value=new q().fromArray(s.value);break;case"v4":this.uniforms[n].value=new pt().fromArray(s.value);break;case"m3":this.uniforms[n].value=new Oe().fromArray(s.value);break;case"m4":this.uniforms[n].value=new xt().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},aa=class extends sn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},gs=class extends Wn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ge(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ge(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=lo,this.normalScale=new Je(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Hn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},js=class extends gs{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Je(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return qe(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ge(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ge(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ge(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var _s=class extends Wn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=xh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},oa=class extends Wn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Ki(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function ll(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}var oi=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],a=t[n-1];n:{e:{let r;t:{i:if(!(e<s)){for(let o=n+2;;){if(s===void 0){if(e<a)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(a=s,s=t[++n],e<s)break e}r=t.length;break t}if(!(e>=a)){let o=t[1];e<o&&(n=2,a=o);for(let c=n-2;;){if(a===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=a,a=t[--n-1],e>=a)break e}r=n,n=0;break t}break n}for(;n<r;){let o=n+r>>>1;e<t[o]?r=o:n=o+1}if(s=t[n],a=t[n-1],a===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,a,s)}return this.interpolate_(n,a,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,a=e*s;for(let r=0;r!==s;++r)t[r]=n[a+r];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},la=class extends oi{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:ul,endingEnd:ul}}intervalChanged_(e,t,n){let s=this.parameterPositions,a=e-2,r=e+1,o=s[a],c=s[r];if(o===void 0)switch(this.getSettings_().endingStart){case dl:a=e,o=2*t-n;break;case fl:a=s.length-2,o=t+s[a]-s[a+1];break;default:a=e,o=n}if(c===void 0)switch(this.getSettings_().endingEnd){case dl:r=e,c=2*n-t;break;case fl:r=1,c=n+s[1]-s[0];break;default:r=e-1,c=t}let l=(n-t)*.5,h=this.valueSize;this._weightPrev=l/(t-o),this._weightNext=l/(c-n),this._offsetPrev=a*h,this._offsetNext=r*h}interpolate_(e,t,n,s){let a=this.resultBuffer,r=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,h=this._offsetPrev,f=this._offsetNext,u=this._weightPrev,d=this._weightNext,v=(n-t)/(s-t),S=v*v,m=S*v,p=-u*m+2*u*S-u*v,T=(1+u)*m+(-1.5-2*u)*S+(-.5+u)*v+1,U=(-1-d)*m+(1.5+d)*S+.5*v,y=d*m-d*S;for(let w=0;w!==o;++w)a[w]=p*r[h+w]+T*r[l+w]+U*r[c+w]+y*r[f+w];return a}},ca=class extends oi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let a=this.resultBuffer,r=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,h=(n-t)/(s-t),f=1-h;for(let u=0;u!==o;++u)a[u]=r[l+u]*f+r[c+u]*h;return a}},ha=class extends oi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},ua=class extends oi{interpolate_(e,t,n,s){let a=this.resultBuffer,r=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,h=this.inTangents,f=this.outTangents;if(!h||!f){let v=(n-t)/(s-t),S=1-v;for(let m=0;m!==o;++m)a[m]=r[l+m]*S+r[c+m]*v;return a}let u=o*2,d=e-1;for(let v=0;v!==o;++v){let S=r[l+v],m=r[c+v],p=d*u+v*2,T=f[p],U=f[p+1],y=e*u+v*2,w=h[y],b=h[y+1],P=Sd(n,t,T,w,s);a[v]=Uh(P,S,U,b,m)}return a}};function Uh(i,e,t,n,s){let a=1-i;return a*a*a*e+3*a*a*i*t+3*a*i*i*n+i*i*i*s}function yd(i,e,t,n,s){let a=1-i;return 3*a*a*(t-e)+6*a*i*(n-t)+3*i*i*(s-n)}function Sd(i,e,t,n,s){let a=(i-e)/(s-e);for(let r=0;r<8;r++){let o=Uh(a,e,t,n,s)-i;if(Math.abs(o)<1e-10)break;let c=yd(a,e,t,n,s);if(Math.abs(c)<1e-10)break;a=Math.max(0,Math.min(1,a-o/c))}return a}var rn=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Ki(t,this.TimeBufferType),this.values=Ki(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Ki(e.times,Array),values:Ki(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s),ll(e.settings)&&(n.settings={inTangents:Ki(e.settings.inTangents,Array),outTangents:Ki(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new ha(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new ca(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new la(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new ua(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Gs:t=this.InterpolantFactoryMethodDiscrete;break;case ea:t=this.InterpolantFactoryMethodLinear;break;case Wr:t=this.InterpolantFactoryMethodSmooth;break;case hl:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return De("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Gs;case this.InterpolantFactoryMethodLinear:return ea;case this.InterpolantFactoryMethodSmooth:return Wr;case this.InterpolantFactoryMethodBezier:return hl}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e;ll(this.settings)&&(Hc(this.settings.inTangents,e),Hc(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,s=n.length,a=0,r=s-1;for(;a!==s&&n[a]<e;)++a;for(;r!==-1&&n[r]>t;)--r;if(++r,a!==0||r!==s){a>=r&&(r=Math.max(r,1),a=r-1);let o=this.getValueSize();this.times=n.slice(a,r),this.values=this.values.slice(a*o,r*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(Fe("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,a=n.length;a===0&&(Fe("KeyframeTrack: Track is empty.",this),e=!1);let r=null;for(let o=0;o!==a;o++){let c=n[o];if(typeof c=="number"&&isNaN(c)){Fe("KeyframeTrack: Time is not a valid number.",this,o,c),e=!1;break}if(r!==null&&r>c){Fe("KeyframeTrack: Out of order keys.",this,o,c,r),e=!1;break}r=c}if(s!==void 0&&Du(s))for(let o=0,c=s.length;o!==c;++o){let l=s[o];if(isNaN(l)){Fe("KeyframeTrack: Value is not a valid number.",this,o,l),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Wr,a=e.length-1,r=1;for(let o=1;o<a;++o){let c=!1,l=e[o],h=e[o+1];if(l!==h&&(o!==1||l!==e[0]))if(s)c=!0;else{let f=o*n,u=f-n,d=f+n;for(let v=0;v!==n;++v){let S=t[f+v];if(S!==t[u+v]||S!==t[d+v]){c=!0;break}}}if(c){if(o!==r){e[r]=e[o];let f=o*n,u=r*n;for(let d=0;d!==n;++d)t[u+d]=t[f+d]}++r}}if(a>0){e[r]=e[a];for(let o=a*n,c=r*n,l=0;l!==n;++l)t[c+l]=t[o+l];++r}return r!==e.length?(this.times=e.slice(0,r),this.values=t.slice(0,r*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,ll(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function Hc(i,e){for(let t=0,n=i.length;t!==n;t+=2)i[t]*=e}rn.prototype.ValueTypeName="";rn.prototype.TimeBufferType=Float32Array;rn.prototype.ValueBufferType=Float32Array;rn.prototype.DefaultInterpolation=ea;var li=class extends rn{constructor(e,t,n){super(e,t,n)}};li.prototype.ValueTypeName="bool";li.prototype.ValueBufferType=Array;li.prototype.DefaultInterpolation=Gs;li.prototype.InterpolantFactoryMethodLinear=void 0;li.prototype.InterpolantFactoryMethodSmooth=void 0;var da=class extends rn{constructor(e,t,n,s){super(e,t,n,s)}};da.prototype.ValueTypeName="color";var fa=class extends rn{constructor(e,t,n,s){super(e,t,n,s)}};fa.prototype.ValueTypeName="number";var pa=class extends oi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let a=this.resultBuffer,r=this.sampleValues,o=this.valueSize,c=(n-t)/(s-t),l=e*o;for(let h=l+o;l!==h;l+=4)wn.slerpFlat(a,0,r,l-o,r,l,c);return a}},Qs=class extends rn{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new pa(this.times,this.values,this.getValueSize(),e)}};Qs.prototype.ValueTypeName="quaternion";Qs.prototype.InterpolantFactoryMethodSmooth=void 0;var ci=class extends rn{constructor(e,t,n){super(e,t,n)}};ci.prototype.ValueTypeName="string";ci.prototype.ValueBufferType=Array;ci.prototype.DefaultInterpolation=Gs;ci.prototype.InterpolantFactoryMethodLinear=void 0;ci.prototype.InterpolantFactoryMethodSmooth=void 0;var ma=class extends rn{constructor(e,t,n,s){super(e,t,n,s)}};ma.prototype.ValueTypeName="vector";var is={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(Wc(i)||(this.files[i]=e))},get:function(i){if(this.enabled!==!1&&!Wc(i))return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};function Wc(i){try{let e=i.slice(i.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}var ga=class{constructor(e,t,n){let s=this,a=!1,r=0,o=0,c,l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(h){o++,a===!1&&s.onStart!==void 0&&s.onStart(h,r,o),a=!0},this.itemEnd=function(h){r++,s.onProgress!==void 0&&s.onProgress(h,r,o),r===o&&(a=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,f){return l.push(h,f),this},this.removeHandler=function(h){let f=l.indexOf(h);return f!==-1&&l.splice(f,2),this},this.getHandler=function(h){for(let f=0,u=l.length;f<u;f+=2){let d=l[f],v=l[f+1];if(d.global&&(d.lastIndex=0),d.test(h))return v}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Nh=new ga,hi=class{constructor(e){this.manager=e!==void 0?e:Nh,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,a){n.load(e,s,t,a)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};hi.DEFAULT_MATERIAL_NAME="__DEFAULT";var kn={},pl=class extends Error{constructor(e,t){super(e),this.response=t}},_a=class extends hi{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let a=is.get(`file:${e}`);if(a!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(a),this.manager.itemEnd(e)},0);return}if(kn[e]!==void 0){kn[e].push({onLoad:t,onProgress:n,onError:s});return}kn[e]=[],kn[e].push({onLoad:t,onProgress:n,onError:s});let r=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,c=this.responseType;fetch(r).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&De("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;let h=kn[e],f=l.body.getReader(),u=l.headers.get("X-File-Size")||l.headers.get("Content-Length"),d=u?parseInt(u):0,v=d!==0,S=0,m=new ReadableStream({start(p){T();function T(){f.read().then(({done:U,value:y})=>{if(U)p.close();else{S+=y.byteLength;let w=new ProgressEvent("progress",{lengthComputable:v,loaded:S,total:d});for(let b=0,P=h.length;b<P;b++){let x=h[b];x.onProgress&&x.onProgress(w)}p.enqueue(y),T()}},U=>{p.error(U)})}}});return new Response(m)}else throw new pl(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(c){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return l.json();default:if(o==="")return l.text();{let f=/charset="?([^;"\s]*)"?/i.exec(o),u=f&&f[1]?f[1].toLowerCase():void 0,d=new TextDecoder(u);return l.arrayBuffer().then(v=>d.decode(v))}}}).then(l=>{is.add(`file:${e}`,l);let h=kn[e];delete kn[e];for(let f=0,u=h.length;f<u;f++){let d=h[f];d.onLoad&&d.onLoad(l)}}).catch(l=>{let h=kn[e];if(h===void 0)throw this.manager.itemError(e),l;delete kn[e];for(let f=0,u=h.length;f<u;f++){let d=h[f];d.onError&&d.onError(l)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var ji=new WeakMap,xa=class extends hi{constructor(e){super(e)}load(e,t,n,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let a=this,r=is.get(`image:${e}`);if(r!==void 0){if(r.complete===!0)a.manager.itemStart(e),setTimeout(function(){t&&t(r),a.manager.itemEnd(e)},0);else{let f=ji.get(r);f===void 0&&(f=[],ji.set(r,f)),f.push({onLoad:t,onError:s})}return r}let o=os("img");function c(){h(),t&&t(this);let f=ji.get(this)||[];for(let u=0;u<f.length;u++){let d=f[u];d.onLoad&&d.onLoad(this)}ji.delete(this),a.manager.itemEnd(e)}function l(f){h(),s&&s(f),is.remove(`image:${e}`);let u=ji.get(this)||[];for(let d=0;d<u.length;d++){let v=u[d];v.onError&&v.onError(f)}ji.delete(this),a.manager.itemError(e),a.manager.itemEnd(e)}function h(){o.removeEventListener("load",c,!1),o.removeEventListener("error",l,!1)}return o.addEventListener("load",c,!1),o.addEventListener("error",l,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),is.add(`image:${e}`,o),a.manager.itemStart(e),o.src=e,o}};var er=class extends hi{constructor(e){super(e)}load(e,t,n,s){let a=this,r=new fs,o=new _a(this.manager);return o.setResponseType("arraybuffer"),o.setRequestHeader(this.requestHeader),o.setPath(this.path),o.setWithCredentials(a.withCredentials),o.load(e,function(c){let l;try{l=a.parse(c)}catch(h){s!==void 0?s(h):Fe(h);return}a._applyTexData(r,l),t&&t(r,l)},n,s),r}createDataTexture(e){let t=new fs;return this._applyTexData(t,this.parse(e)),t}_applyTexData(e,t){t.image!==void 0?e.image=t.image:t.data!==void 0&&(e.image.width=t.width,e.image.height=t.height,e.image.data=t.data),e.wrapS=t.wrapS!==void 0?t.wrapS:$t,e.wrapT=t.wrapT!==void 0?t.wrapT:$t,e.magFilter=t.magFilter!==void 0?t.magFilter:ft,e.minFilter=t.minFilter!==void 0?t.minFilter:ft,e.anisotropy=t.anisotropy!==void 0?t.anisotropy:1,t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.mipmaps!==void 0&&(e.mipmaps=t.mipmaps,e.minFilter=Xn),t.mipmapCount===1&&(e.minFilter=ft),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),e.needsUpdate=!0}},wi=class extends hi{constructor(e){super(e)}load(e,t,n,s){let a=new It,r=new xa(this.manager);return r.setCrossOrigin(this.crossOrigin),r.setPath(this.path),r.load(e,function(o){a.image=o,a.needsUpdate=!0,t!==void 0&&t(a)},n,s),a}},tr=class extends zt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ge(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},nr=class extends tr{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(zt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ge(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},cl=new xt,Xc=new q,qc=new q,va=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Je(512,512),this.mapType=Kt,this.map=null,this.mapPass=null,this.matrix=new xt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ps,this._frameExtents=new Je(1,1),this._viewportCount=1,this._viewports=[new pt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Xc.setFromMatrixPosition(e.matrixWorld),t.position.copy(Xc),qc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(qc),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,s){cl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(cl,e.coordinateSystem,e.reversedDepth);let a=this._frameExtents,r=s?s.z/a.x:1,o=s?s.w/a.y:1,c=s?s.x/a.x:0,l=s?s.y/a.y:0;e.coordinateSystem===as||e.reversedDepth?t.set(.5*r,0,0,.5*r+c,0,.5*o,0,.5*o+l,0,0,1,0,0,0,0,1):t.set(.5*r,0,0,.5*r+c,0,.5*o,0,.5*o+l,0,0,.5,.5,0,0,0,1),t.multiply(cl)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Gr=new q,Hr=new wn,bn=new q,ir=class extends zt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new xt,this.projectionMatrix=new xt,this.projectionMatrixInverse=new xt,this.coordinateSystem=_n,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Gr,Hr,bn),bn.x===1&&bn.y===1&&bn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Gr,Hr,bn.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Gr,Hr,bn),bn.x===1&&bn.y===1&&bn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Gr,Hr,bn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},ti=new q,Yc=new Je,Zc=new Je,Ot=class extends ir{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=cs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(ks*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return cs*2*Math.atan(Math.tan(ks*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){ti.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(ti.x,ti.y).multiplyScalar(-e/ti.z),ti.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ti.x,ti.y).multiplyScalar(-e/ti.z)}getViewSize(e,t){return this.getViewBounds(e,Yc,Zc),t.subVectors(Zc,Yc)}setViewOffset(e,t,n,s,a,r){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(ks*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,a=-.5*s,r=this.view;if(this.view!==null&&this.view.enabled){let c=r.fullWidth,l=r.fullHeight;a+=r.offsetX*s/c,t-=r.offsetY*n/l,s*=r.width/c,n*=r.height/l}let o=this.filmOffset;o!==0&&(a+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}};var ui=class extends ir{constructor(e=-1,t=1,n=1,s=-1,a=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=a,this.far=r,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,a,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,a=n-e,r=n+e,o=s+t,c=s-t;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=l*this.view.offsetX,r=a+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(a,r,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},ml=class extends va{constructor(){super(new ui(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ai=class extends tr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(zt.DEFAULT_UP),this.updateMatrix(),this.target=new zt,this.shadow=new ml}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}};var Qi=-90,es=1,ya=class extends zt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Ot(Qi,es,e,t);s.layers=this.layers,this.add(s);let a=new Ot(Qi,es,e,t);a.layers=this.layers,this.add(a);let r=new Ot(Qi,es,e,t);r.layers=this.layers,this.add(r);let o=new Ot(Qi,es,e,t);o.layers=this.layers,this.add(o);let c=new Ot(Qi,es,e,t);c.layers=this.layers,this.add(c);let l=new Ot(Qi,es,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,a,r,o,c]=t;for(let l of t)this.remove(l);if(e===_n)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===as)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[a,r,o,c,l,h]=this.children,f=e.getRenderTarget(),u=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),v=e.xr.enabled;e.xr.enabled=!1;let S=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,1,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,2,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(n,4,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),n.texture.generateMipmaps=S,e.setRenderTarget(n,5,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(f,u,d),e.xr.enabled=v,n.texture.needsPMREMUpdate=!0}},Sa=class extends Ot{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var Xl="\\[\\]\\.:\\/",Md=new RegExp("["+Xl+"]","g"),ql="[^"+Xl+"]",bd="[^"+Xl.replace("\\.","")+"]",Td=/((?:WC+[\/:])*)/.source.replace("WC",ql),Ed=/(WCOD+)?/.source.replace("WCOD",bd),wd=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",ql),Ad=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",ql),Rd=new RegExp("^"+Td+Ed+wd+Ad+"$"),Cd=["material","materials","bones","map"],gl=class{constructor(e,t,n){let s=n||dt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,a=n.length;s!==a;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},dt=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Md,"")}static parseTrackName(e){let t=Rd.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let a=n.nodeName.substring(s+1);Cd.indexOf(a)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=a)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(a){for(let r=0;r<a.length;r++){let o=a[r];if(o.name===t||o.uuid===t)return o;let c=n(o.children);if(c)return c}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,a=n.length;s!==a;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,a=n.length;s!==a;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,a=n.length;s!==a;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,a=n.length;s!==a;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,a=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){De("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=t.objectIndex;switch(n){case"materials":if(!e.material){Fe("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Fe("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Fe("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===l){l=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Fe("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Fe("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){Fe("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(l!==void 0){if(e[l]===void 0){Fe("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}let r=e[s];if(r===void 0){let l=t.nodeName;Fe("PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){Fe("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Fe("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[a]!==void 0&&(a=e.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=r,this.propertyIndex=a}else r.fromArray!==void 0&&r.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=r):Array.isArray(r)?(c=this.BindingType.EntireArray,this.resolvedProperty=r):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};dt.Composite=gl;dt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};dt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};dt.prototype.GetterByBindingType=[dt.prototype._getValue_direct,dt.prototype._getValue_array,dt.prototype._getValue_arrayElement,dt.prototype._getValue_toArray];dt.prototype.SetterByBindingTypeAndVersioning=[[dt.prototype._setValue_direct,dt.prototype._setValue_direct_setNeedsUpdate,dt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[dt.prototype._setValue_array,dt.prototype._setValue_array_setNeedsUpdate,dt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[dt.prototype._setValue_arrayElement,dt.prototype._setValue_arrayElement_setNeedsUpdate,dt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[dt.prototype._setValue_fromArray,dt.prototype._setValue_fromArray_setNeedsUpdate,dt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var L0=new Float32Array(1);var _l=class i{static{i.prototype.isMatrix2=!0}constructor(e,t,n,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,s){let a=this.elements;return a[0]=e,a[2]=t,a[1]=n,a[3]=s,this}};function Yl(i,e,t,n){let s=Id(n);switch(t){case Fl:return i*e;case Bl:return i*e/s.components*s.byteLength;case Ca:return i*e/s.components*s.byteLength;case mi:return i*e*2/s.components*s.byteLength;case Ia:return i*e*2/s.components*s.byteLength;case Ol:return i*e*3/s.components*s.byteLength;case dn:return i*e*4/s.components*s.byteLength;case Pa:return i*e*4/s.components*s.byteLength;case or:case lr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case cr:case hr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Da:case Na:return Math.max(i,16)*Math.max(e,8)/4;case La:case Ua:return Math.max(i,8)*Math.max(e,8)/2;case Fa:case Oa:case za:case ka:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Ba:case ur:case Va:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ga:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ha:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Wa:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Xa:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case qa:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Ya:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Za:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case $a:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Ja:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Ka:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case ja:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Qa:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case eo:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case to:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case no:case io:case so:return Math.ceil(i/4)*Math.ceil(e/4)*16;case ro:case ao:return Math.ceil(i/4)*Math.ceil(e/4)*8;case dr:case oo:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Id(i){switch(i){case Kt:case Ll:return{byteLength:1,components:1};case ys:case Dl:case qt:return{byteLength:2,components:1};case Aa:case Ra:return{byteLength:2,components:4};case yn:case wa:case jt:return{byteLength:4,components:1};case Ul:case Nl:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?De("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function iu(){let i=null,e=!1,t=null,n=null;function s(a,r){n=i.requestAnimationFrame(s),t(a,r)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(a){t=a},setContext:function(a){i=a}}}function Ld(i){let e=new WeakMap;function t(o,c){let l=o.array,h=o.usage,f=l.byteLength,u=i.createBuffer();i.bindBuffer(c,u),i.bufferData(c,l,h),o.onUploadCallback();let d;if(l instanceof Float32Array)d=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)d=i.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)d=i.SHORT;else if(l instanceof Uint32Array)d=i.UNSIGNED_INT;else if(l instanceof Int32Array)d=i.INT;else if(l instanceof Int8Array)d=i.BYTE;else if(l instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:u,type:d,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:f}}function n(o,c,l){let h=c.array,f=c.updateRanges;if(i.bindBuffer(l,o),f.length===0)i.bufferSubData(l,0,h);else{f.sort((d,v)=>d.start-v.start);let u=0;for(let d=1;d<f.length;d++){let v=f[u],S=f[d];S.start<=v.start+v.count+1?v.count=Math.max(v.count,S.start+S.count-v.start):(++u,f[u]=S)}f.length=u+1;for(let d=0,v=f.length;d<v;d++){let S=f[d];i.bufferSubData(l,S.start*h.BYTES_PER_ELEMENT,h,S.start,S.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);let c=e.get(o);c&&(i.deleteBuffer(c.buffer),e.delete(o))}function r(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:s,remove:a,update:r}}var Dd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Ud=`#ifdef USE_ALPHAHASH
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
#endif`,Nd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Fd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Od=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Bd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,zd=`#ifdef USE_AOMAP
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
#endif`,kd=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Vd=`#ifdef USE_BATCHING
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
#endif`,Gd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Hd=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Wd=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Xd=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,qd=`#ifdef USE_IRIDESCENCE
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
#endif`,Yd=`#ifdef USE_BUMPMAP
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
#endif`,Zd=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,$d=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Jd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Kd=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,jd=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Qd=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,ef=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,tf=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,nf=`#define PI 3.141592653589793
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
} // validated`,sf=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,rf=`vec3 transformedNormal = objectNormal;
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
#endif`,af=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,of=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,lf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,cf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,hf="gl_FragColor = linearToOutputTexel( gl_FragColor );",uf=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,df=`#ifdef USE_ENVMAP
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
#endif`,ff=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,pf=`#ifdef USE_ENVMAP
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
#endif`,mf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,gf=`#ifdef USE_ENVMAP
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
#endif`,_f=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,xf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,vf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,yf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Sf=`#ifdef USE_GRADIENTMAP
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
}`,Mf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,bf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Tf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Ef=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,wf=`#ifdef USE_ENVMAP
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
#endif`,Af=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Rf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Cf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,If=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Pf=`PhysicalMaterial material;
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
#endif`,Lf=`uniform sampler2D dfgLUT;
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
}`,Df=`
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
#endif`,Uf=`#if defined( RE_IndirectDiffuse )
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
#endif`,Nf=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Ff=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,Of=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Bf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,zf=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,kf=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Vf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Gf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Hf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Wf=`#if defined( USE_POINTS_UV )
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
#endif`,Xf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,qf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Yf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Zf=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,$f=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Jf=`#ifdef USE_MORPHTARGETS
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
#endif`,Kf=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,jf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Qf=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,ep=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,tp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,np=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,ip=`#ifdef USE_NORMALMAP
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
#endif`,sp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,rp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,ap=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,op=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,lp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,cp=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,hp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,up=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,fp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,pp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,mp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,gp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,_p=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,xp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,vp=`float getShadowMask() {
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
}`,yp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Sp=`#ifdef USE_SKINNING
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
#endif`,Mp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,bp=`#ifdef USE_SKINNING
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
#endif`,Tp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Ep=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,wp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Ap=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Rp=`#ifdef USE_TRANSMISSION
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
#endif`,Cp=`#ifdef USE_TRANSMISSION
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
#endif`,Ip=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Pp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Lp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Dp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Up=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Np=`uniform sampler2D t2D;
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
}`,Fp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Op=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Bp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,zp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,kp=`#include <common>
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
}`,Vp=`#if DEPTH_PACKING == 3200
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
}`,Gp=`#define DISTANCE
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
}`,Hp=`#define DISTANCE
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
}`,Wp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Xp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,qp=`uniform float scale;
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
}`,Yp=`uniform vec3 diffuse;
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
}`,Zp=`#include <common>
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
}`,$p=`uniform vec3 diffuse;
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
}`,Jp=`#define LAMBERT
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
}`,Kp=`#define LAMBERT
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
}`,jp=`#define MATCAP
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
}`,Qp=`#define MATCAP
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
}`,em=`#define NORMAL
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
}`,tm=`#define NORMAL
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
}`,nm=`#define PHONG
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
}`,im=`#define PHONG
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
}`,sm=`#define STANDARD
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
}`,rm=`#define STANDARD
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
}`,am=`#define TOON
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
}`,om=`#define TOON
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
}`,lm=`uniform float size;
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
}`,cm=`uniform vec3 diffuse;
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
}`,hm=`#include <common>
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
}`,um=`uniform vec3 color;
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
}`,dm=`uniform float rotation;
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
}`,fm=`uniform vec3 diffuse;
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
}`,We={alphahash_fragment:Dd,alphahash_pars_fragment:Ud,alphamap_fragment:Nd,alphamap_pars_fragment:Fd,alphatest_fragment:Od,alphatest_pars_fragment:Bd,aomap_fragment:zd,aomap_pars_fragment:kd,batching_pars_vertex:Vd,batching_vertex:Gd,begin_vertex:Hd,beginnormal_vertex:Wd,bsdfs:Xd,iridescence_fragment:qd,bumpmap_pars_fragment:Yd,clipping_planes_fragment:Zd,clipping_planes_pars_fragment:$d,clipping_planes_pars_vertex:Jd,clipping_planes_vertex:Kd,color_fragment:jd,color_pars_fragment:Qd,color_pars_vertex:ef,color_vertex:tf,common:nf,cube_uv_reflection_fragment:sf,defaultnormal_vertex:rf,displacementmap_pars_vertex:af,displacementmap_vertex:of,emissivemap_fragment:lf,emissivemap_pars_fragment:cf,colorspace_fragment:hf,colorspace_pars_fragment:uf,envmap_fragment:df,envmap_common_pars_fragment:ff,envmap_pars_fragment:pf,envmap_pars_vertex:mf,envmap_physical_pars_fragment:wf,envmap_vertex:gf,fog_vertex:_f,fog_pars_vertex:xf,fog_fragment:vf,fog_pars_fragment:yf,gradientmap_pars_fragment:Sf,lightmap_pars_fragment:Mf,lights_lambert_fragment:bf,lights_lambert_pars_fragment:Tf,lights_pars_begin:Ef,lights_toon_fragment:Af,lights_toon_pars_fragment:Rf,lights_phong_fragment:Cf,lights_phong_pars_fragment:If,lights_physical_fragment:Pf,lights_physical_pars_fragment:Lf,lights_fragment_begin:Df,lights_fragment_maps:Uf,lights_fragment_end:Nf,lightprobes_pars_fragment:Ff,logdepthbuf_fragment:Of,logdepthbuf_pars_fragment:Bf,logdepthbuf_pars_vertex:zf,logdepthbuf_vertex:kf,map_fragment:Vf,map_pars_fragment:Gf,map_particle_fragment:Hf,map_particle_pars_fragment:Wf,metalnessmap_fragment:Xf,metalnessmap_pars_fragment:qf,morphinstance_vertex:Yf,morphcolor_vertex:Zf,morphnormal_vertex:$f,morphtarget_pars_vertex:Jf,morphtarget_vertex:Kf,normal_fragment_begin:jf,normal_fragment_maps:Qf,normal_pars_fragment:ep,normal_pars_vertex:tp,normal_vertex:np,normalmap_pars_fragment:ip,clearcoat_normal_fragment_begin:sp,clearcoat_normal_fragment_maps:rp,clearcoat_pars_fragment:ap,iridescence_pars_fragment:op,opaque_fragment:lp,packing:cp,premultiplied_alpha_fragment:hp,project_vertex:up,dithering_fragment:dp,dithering_pars_fragment:fp,roughnessmap_fragment:pp,roughnessmap_pars_fragment:mp,shadowmap_pars_fragment:gp,shadowmap_pars_vertex:_p,shadowmap_vertex:xp,shadowmask_pars_fragment:vp,skinbase_vertex:yp,skinning_pars_vertex:Sp,skinning_vertex:Mp,skinnormal_vertex:bp,specularmap_fragment:Tp,specularmap_pars_fragment:Ep,tonemapping_fragment:wp,tonemapping_pars_fragment:Ap,transmission_fragment:Rp,transmission_pars_fragment:Cp,uv_pars_fragment:Ip,uv_pars_vertex:Pp,uv_vertex:Lp,worldpos_vertex:Dp,background_vert:Up,background_frag:Np,backgroundCube_vert:Fp,backgroundCube_frag:Op,cube_vert:Bp,cube_frag:zp,depth_vert:kp,depth_frag:Vp,distance_vert:Gp,distance_frag:Hp,equirect_vert:Wp,equirect_frag:Xp,linedashed_vert:qp,linedashed_frag:Yp,meshbasic_vert:Zp,meshbasic_frag:$p,meshlambert_vert:Jp,meshlambert_frag:Kp,meshmatcap_vert:jp,meshmatcap_frag:Qp,meshnormal_vert:em,meshnormal_frag:tm,meshphong_vert:nm,meshphong_frag:im,meshphysical_vert:sm,meshphysical_frag:rm,meshtoon_vert:am,meshtoon_frag:om,points_vert:lm,points_frag:cm,shadow_vert:hm,shadow_frag:um,sprite_vert:dm,sprite_frag:fm},_e={common:{diffuse:{value:new Ge(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Oe},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Oe}},envmap:{envMap:{value:null},envMapRotation:{value:new Oe},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Oe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Oe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Oe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Oe},normalScale:{value:new Je(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Oe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Oe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Oe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Oe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ge(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new q},probesMax:{value:new q},probesResolution:{value:new q}},points:{diffuse:{value:new Ge(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0},uvTransform:{value:new Oe}},sprite:{diffuse:{value:new Ge(16777215)},opacity:{value:1},center:{value:new Je(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Oe},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0}}},Cn={basic:{uniforms:Vt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.fog]),vertexShader:We.meshbasic_vert,fragmentShader:We.meshbasic_frag},lambert:{uniforms:Vt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,_e.lights,{emissive:{value:new Ge(0)},envMapIntensity:{value:1}}]),vertexShader:We.meshlambert_vert,fragmentShader:We.meshlambert_frag},phong:{uniforms:Vt([_e.common,_e.specularmap,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,_e.lights,{emissive:{value:new Ge(0)},specular:{value:new Ge(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:We.meshphong_vert,fragmentShader:We.meshphong_frag},standard:{uniforms:Vt([_e.common,_e.envmap,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.roughnessmap,_e.metalnessmap,_e.fog,_e.lights,{emissive:{value:new Ge(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:We.meshphysical_vert,fragmentShader:We.meshphysical_frag},toon:{uniforms:Vt([_e.common,_e.aomap,_e.lightmap,_e.emissivemap,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.gradientmap,_e.fog,_e.lights,{emissive:{value:new Ge(0)}}]),vertexShader:We.meshtoon_vert,fragmentShader:We.meshtoon_frag},matcap:{uniforms:Vt([_e.common,_e.bumpmap,_e.normalmap,_e.displacementmap,_e.fog,{matcap:{value:null}}]),vertexShader:We.meshmatcap_vert,fragmentShader:We.meshmatcap_frag},points:{uniforms:Vt([_e.points,_e.fog]),vertexShader:We.points_vert,fragmentShader:We.points_frag},dashed:{uniforms:Vt([_e.common,_e.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:We.linedashed_vert,fragmentShader:We.linedashed_frag},depth:{uniforms:Vt([_e.common,_e.displacementmap]),vertexShader:We.depth_vert,fragmentShader:We.depth_frag},normal:{uniforms:Vt([_e.common,_e.bumpmap,_e.normalmap,_e.displacementmap,{opacity:{value:1}}]),vertexShader:We.meshnormal_vert,fragmentShader:We.meshnormal_frag},sprite:{uniforms:Vt([_e.sprite,_e.fog]),vertexShader:We.sprite_vert,fragmentShader:We.sprite_frag},background:{uniforms:{uvTransform:{value:new Oe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:We.background_vert,fragmentShader:We.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Oe}},vertexShader:We.backgroundCube_vert,fragmentShader:We.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:We.cube_vert,fragmentShader:We.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:We.equirect_vert,fragmentShader:We.equirect_frag},distance:{uniforms:Vt([_e.common,_e.displacementmap,{referencePosition:{value:new q},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:We.distance_vert,fragmentShader:We.distance_frag},shadow:{uniforms:Vt([_e.lights,_e.fog,{color:{value:new Ge(0)},opacity:{value:1}}]),vertexShader:We.shadow_vert,fragmentShader:We.shadow_frag}};Cn.physical={uniforms:Vt([Cn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Oe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Oe},clearcoatNormalScale:{value:new Je(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Oe},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Oe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Oe},sheen:{value:0},sheenColor:{value:new Ge(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Oe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Oe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Oe},transmissionSamplerSize:{value:new Je},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Oe},attenuationDistance:{value:0},attenuationColor:{value:new Ge(0)},specularColor:{value:new Ge(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Oe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Oe},anisotropyVector:{value:new Je},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Oe}}]),vertexShader:We.meshphysical_vert,fragmentShader:We.meshphysical_frag};var uo={r:0,b:0,g:0},pm=new xt,su=new Oe;su.set(-1,0,0,0,1,0,0,0,1);function mm(i,e,t,n,s,a){let r=new Ge(0),o=s===!0?0:1,c,l,h=null,f=0,u=null;function d(T){let U=T.isScene===!0?T.background:null;if(U&&U.isTexture){let y=T.backgroundBlurriness>0;U=e.get(U,y)}return U}function v(T){let U=!1,y=d(T);y===null?m(r,o):y&&y.isColor&&(m(y,1),U=!0);let w=i.xr.getEnvironmentBlendMode();w==="additive"?t.buffers.color.setClear(0,0,0,1,a):w==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,a),(i.autoClear||U)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function S(T,U){let y=d(U);y&&(y.isCubeTexture||y.mapping===rr)?(l===void 0&&(l=new mt(new ms(1,1,1),new sn({name:"BackgroundCubeMaterial",uniforms:Pi(Cn.backgroundCube.uniforms),vertexShader:Cn.backgroundCube.vertexShader,fragmentShader:Cn.backgroundCube.fragmentShader,side:Xt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(w,b,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(l)),l.material.uniforms.envMap.value=y,l.material.uniforms.backgroundBlurriness.value=U.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=U.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(pm.makeRotationFromEuler(U.backgroundRotation)).transpose(),y.isCubeTexture&&y.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(su),l.material.toneMapped=$e.getTransfer(y.colorSpace)!==it,(h!==y||f!==y.version||u!==i.toneMapping)&&(l.material.needsUpdate=!0,h=y,f=y.version,u=i.toneMapping),l.layers.enableAll(),T.unshift(l,l.geometry,l.material,0,0,null)):y&&y.isTexture&&(c===void 0&&(c=new mt(new kt(2,2),new sn({name:"BackgroundMaterial",uniforms:Pi(Cn.background.uniforms),vertexShader:Cn.background.vertexShader,fragmentShader:Cn.background.fragmentShader,side:di,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(c)),c.material.uniforms.t2D.value=y,c.material.uniforms.backgroundIntensity.value=U.backgroundIntensity,c.material.toneMapped=$e.getTransfer(y.colorSpace)!==it,y.matrixAutoUpdate===!0&&y.updateMatrix(),c.material.uniforms.uvTransform.value.copy(y.matrix),(h!==y||f!==y.version||u!==i.toneMapping)&&(c.material.needsUpdate=!0,h=y,f=y.version,u=i.toneMapping),c.layers.enableAll(),T.unshift(c,c.geometry,c.material,0,0,null))}function m(T,U){T.getRGB(uo,Wl(i)),t.buffers.color.setClear(uo.r,uo.g,uo.b,U,a)}function p(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return r},setClearColor:function(T,U=1){r.set(T),o=U,m(r,o)},getClearAlpha:function(){return o},setClearAlpha:function(T){o=T,m(r,o)},render:v,addToRenderList:S,dispose:p}}function gm(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null),a=s,r=!1;function o(I,z,k,C,G){let X=!1,$=f(I,C,k,z);a!==$&&(a=$,l(a.object)),X=d(I,C,k,G),X&&v(I,C,k,G),G!==null&&e.update(G,i.ELEMENT_ARRAY_BUFFER),(X||r)&&(r=!1,y(I,z,k,C),G!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(G).buffer))}function c(){return i.createVertexArray()}function l(I){return i.bindVertexArray(I)}function h(I){return i.deleteVertexArray(I)}function f(I,z,k,C){let G=C.wireframe===!0,X=n[z.id];X===void 0&&(X={},n[z.id]=X);let $=I.isInstancedMesh===!0?I.id:0,ie=X[$];ie===void 0&&(ie={},X[$]=ie);let Z=ie[k.id];Z===void 0&&(Z={},ie[k.id]=Z);let Q=Z[G];return Q===void 0&&(Q=u(c()),Z[G]=Q),Q}function u(I){let z=[],k=[],C=[];for(let G=0;G<t;G++)z[G]=0,k[G]=0,C[G]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:z,enabledAttributes:k,attributeDivisors:C,object:I,attributes:{},index:null}}function d(I,z,k,C){let G=a.attributes,X=z.attributes,$=0,ie=k.getAttributes();for(let Z in ie)if(ie[Z].location>=0){let se=G[Z],le=X[Z];if(le===void 0&&(Z==="instanceMatrix"&&I.instanceMatrix&&(le=I.instanceMatrix),Z==="instanceColor"&&I.instanceColor&&(le=I.instanceColor)),se===void 0||se.attribute!==le||le&&se.data!==le.data)return!0;$++}return a.attributesNum!==$||a.index!==C}function v(I,z,k,C){let G={},X=z.attributes,$=0,ie=k.getAttributes();for(let Z in ie)if(ie[Z].location>=0){let se=X[Z];se===void 0&&(Z==="instanceMatrix"&&I.instanceMatrix&&(se=I.instanceMatrix),Z==="instanceColor"&&I.instanceColor&&(se=I.instanceColor));let le={};le.attribute=se,se&&se.data&&(le.data=se.data),G[Z]=le,$++}a.attributes=G,a.attributesNum=$,a.index=C}function S(){let I=a.newAttributes;for(let z=0,k=I.length;z<k;z++)I[z]=0}function m(I){p(I,0)}function p(I,z){let k=a.newAttributes,C=a.enabledAttributes,G=a.attributeDivisors;k[I]=1,C[I]===0&&(i.enableVertexAttribArray(I),C[I]=1),G[I]!==z&&(i.vertexAttribDivisor(I,z),G[I]=z)}function T(){let I=a.newAttributes,z=a.enabledAttributes;for(let k=0,C=z.length;k<C;k++)z[k]!==I[k]&&(i.disableVertexAttribArray(k),z[k]=0)}function U(I,z,k,C,G,X,$){$===!0?i.vertexAttribIPointer(I,z,k,G,X):i.vertexAttribPointer(I,z,k,C,G,X)}function y(I,z,k,C){S();let G=C.attributes,X=k.getAttributes(),$=z.defaultAttributeValues;for(let ie in X){let Z=X[ie];if(Z.location>=0){let Q=G[ie];if(Q===void 0&&(ie==="instanceMatrix"&&I.instanceMatrix&&(Q=I.instanceMatrix),ie==="instanceColor"&&I.instanceColor&&(Q=I.instanceColor)),Q!==void 0){let se=Q.normalized,le=Q.itemSize,Me=e.get(Q);if(Me===void 0)continue;let Ue=Me.buffer,xe=Me.type,Ke=Me.bytesPerElement,K=xe===i.INT||xe===i.UNSIGNED_INT||Q.gpuType===wa;if(Q.isInterleavedBufferAttribute){let ee=Q.data,Se=ee.stride,Le=Q.offset;if(ee.isInstancedInterleavedBuffer){for(let ye=0;ye<Z.locationSize;ye++)p(Z.location+ye,ee.meshPerAttribute);I.isInstancedMesh!==!0&&C._maxInstanceCount===void 0&&(C._maxInstanceCount=ee.meshPerAttribute*ee.count)}else for(let ye=0;ye<Z.locationSize;ye++)m(Z.location+ye);i.bindBuffer(i.ARRAY_BUFFER,Ue);for(let ye=0;ye<Z.locationSize;ye++)U(Z.location+ye,le/Z.locationSize,xe,se,Se*Ke,(Le+le/Z.locationSize*ye)*Ke,K)}else{if(Q.isInstancedBufferAttribute){for(let ee=0;ee<Z.locationSize;ee++)p(Z.location+ee,Q.meshPerAttribute);I.isInstancedMesh!==!0&&C._maxInstanceCount===void 0&&(C._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let ee=0;ee<Z.locationSize;ee++)m(Z.location+ee);i.bindBuffer(i.ARRAY_BUFFER,Ue);for(let ee=0;ee<Z.locationSize;ee++)U(Z.location+ee,le/Z.locationSize,xe,se,le*Ke,le/Z.locationSize*ee*Ke,K)}}else if($!==void 0){let se=$[ie];if(se!==void 0)switch(se.length){case 2:i.vertexAttrib2fv(Z.location,se);break;case 3:i.vertexAttrib3fv(Z.location,se);break;case 4:i.vertexAttrib4fv(Z.location,se);break;default:i.vertexAttrib1fv(Z.location,se)}}}}T()}function w(){M();for(let I in n){let z=n[I];for(let k in z){let C=z[k];for(let G in C){let X=C[G];for(let $ in X)h(X[$].object),delete X[$];delete C[G]}}delete n[I]}}function b(I){if(n[I.id]===void 0)return;let z=n[I.id];for(let k in z){let C=z[k];for(let G in C){let X=C[G];for(let $ in X)h(X[$].object),delete X[$];delete C[G]}}delete n[I.id]}function P(I){for(let z in n){let k=n[z];for(let C in k){let G=k[C];if(G[I.id]===void 0)continue;let X=G[I.id];for(let $ in X)h(X[$].object),delete X[$];delete G[I.id]}}}function x(I){for(let z in n){let k=n[z],C=I.isInstancedMesh===!0?I.id:0,G=k[C];if(G!==void 0){for(let X in G){let $=G[X];for(let ie in $)h($[ie].object),delete $[ie];delete G[X]}delete k[C],Object.keys(k).length===0&&delete n[z]}}}function M(){L(),r=!0,a!==s&&(a=s,l(a.object))}function L(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:M,resetDefaultState:L,dispose:w,releaseStatesOfGeometry:b,releaseStatesOfObject:x,releaseStatesOfProgram:P,initAttributes:S,enableAttribute:m,disableUnusedAttributes:T}}function _m(i,e,t){let n;function s(c){n=c}function a(c,l){i.drawArrays(n,c,l),t.update(l,n,1)}function r(c,l,h){h!==0&&(i.drawArraysInstanced(n,c,l,h),t.update(l,n,h))}function o(c,l,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,l,0,h);let u=0;for(let d=0;d<h;d++)u+=l[d];t.update(u,n,1)}this.setMode=s,this.render=a,this.renderInstances=r,this.renderMultiDraw=o}function xm(i,e,t,n){let s;function a(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let P=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function r(P){return!(P!==dn&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(P){let x=P===qt&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(P!==Kt&&P!==jt&&!x&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function c(P){if(P==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp",h=c(l);h!==l&&(De("WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);let f=t.logarithmicDepthBuffer===!0,u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&u===!1&&De("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),S=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),T=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),U=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),w=i.getParameter(i.MAX_SAMPLES),b=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:r,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:f,reversedDepthBuffer:u,maxTextures:d,maxVertexTextures:v,maxTextureSize:S,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:T,maxVaryings:U,maxFragmentUniforms:y,maxSamples:w,samples:b}}function vm(i){let e=this,t=null,n=0,s=!1,a=!1,r=new gn,o=new Oe,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(f,u){let d=f.length!==0||u||n!==0||s;return s=u,n=f.length,d},this.beginShadows=function(){a=!0,h(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(f,u){t=h(f,u,0)},this.setState=function(f,u,d){let v=f.clippingPlanes,S=f.clipIntersection,m=f.clipShadows,p=i.get(f);if(!s||v===null||v.length===0||a&&!m)a?h(null):l();else{let T=a?0:n,U=T*4,y=p.clippingState||null;c.value=y,y=h(v,u,U,d);for(let w=0;w!==U;++w)y[w]=t[w];p.clippingState=y,this.numIntersection=S?this.numPlanes:0,this.numPlanes+=T}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(f,u,d,v){let S=f!==null?f.length:0,m=null;if(S!==0){if(m=c.value,v!==!0||m===null){let p=d+S*4,T=u.matrixWorldInverse;o.getNormalMatrix(T),(m===null||m.length<p)&&(m=new Float32Array(p));for(let U=0,y=d;U!==S;++U,y+=4)r.copy(f[U]).applyMatrix4(T,o),r.normal.toArray(m,y),m[y+3]=r.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=S,e.numIntersection=0,m}}var Ts=4,ym=6,Sm=20,Mm=256,fr=new ui,Fh=new Ge,Zl=null,$l=0,Jl=0,Kl=!1,bm=new q,Li=new q,ws=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,a={}){let{size:r=256,position:o=bm}=a;Zl=this._renderer.getRenderTarget(),$l=this._renderer.getActiveCubeFace(),Jl=this._renderer.getActiveMipmapLevel(),Kl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(r);let c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,s,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=zh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Bh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Zl,$l,Jl),this._renderer.xr.enabled=Kl,e.scissorTest=!1,bs(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===fi||e.mapping===Ii?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Zl=this._renderer.getRenderTarget(),$l=this._renderer.getActiveCubeFace(),Jl=this._renderer.getActiveMipmapLevel(),Kl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:ft,minFilter:ft,generateMipmaps:!1,type:qt,format:dn,colorSpace:Ei,depthBuffer:!1},s=Oh(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Oh(e,t,n);let{_lodMax:a}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=Tm(a)),this._blurMaterial=wm(a,e,t),this._ggxMaterial=Em(a,e,t)}return s}_compileMaterial(e){let t=new mt(new un,e);this._renderer.compile(t,fr)}_sceneToCubeUV(e,t,n,s,a){let c=new Ot(90,1,t,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],f=this._renderer,u=f.autoClear,d=f.toneMapping;f.getClearColor(Fh),f.toneMapping=an,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(s),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new mt(new ms,new vn({name:"PMREM.Background",side:Xt,depthWrite:!1,depthTest:!1})));let S=this._backgroundBox,m=S.material,p=!1,T=e.background;T?T.isColor&&(m.color.copy(T),e.background=null,p=!0):(m.color.copy(Fh),p=!0);for(let U=0;U<6;U++){let y=U%3;y===0?(c.up.set(0,l[U],0),c.position.set(a.x,a.y,a.z),c.lookAt(a.x+h[U],a.y,a.z)):y===1?(c.up.set(0,0,l[U]),c.position.set(a.x,a.y,a.z),c.lookAt(a.x,a.y+h[U],a.z)):(c.up.set(0,l[U],0),c.position.set(a.x,a.y,a.z),c.lookAt(a.x,a.y,a.z+h[U]));let w=this._cubeSize;bs(s,y*w,U>2?w:0,w,w),f.setRenderTarget(s),p&&f.render(S,c),f.render(e,c)}f.toneMapping=d,f.autoClear=u,e.background=T}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===fi||e.mapping===Ii;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=zh()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Bh());let a=s?this._cubemapMaterial:this._equirectMaterial,r=this._lodMeshes[0];r.material=a;let o=a.uniforms;o.envMap.value=e;let c=this._cubeSize;bs(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(r,fr)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodMeshes.length;for(let a=1;a<s;a++)this._applyGGXFilter(e,a-1,a);t.autoClear=n}_applyGGXFilter(e,t,n){let s=this._renderer,a=this._pingPongRenderTarget,r=this._ggxMaterial,o=this._lodMeshes[n];o.material=r;let c=r.uniforms,l=n/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),f=Math.sqrt(l*l-h*h),u=l*1.25,d=f*u,{_lodMax:v}=this,S=this._sizeLods[n],m=3*S*(n>v-Ts?n-v+Ts:0),p=4*(this._cubeSize-S);c.envMap.value=e.texture,c.roughness.value=d,c.mipInt.value=v-t,bs(a,m,p,3*S,2*S),s.setRenderTarget(a),s.render(o,fr),c.envMap.value=a.texture,c.roughness.value=0,c.mipInt.value=v-n,bs(e,m,p,3*S,2*S),s.setRenderTarget(e),s.render(o,fr)}_blur(e,t,n,s){let a=this._pingPongRenderTarget,r=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(e,a,t,n,r),this._blurPass(a,e,n,n,r)}_blurPass(e,t,n,s,a){let r=this._renderer,o=this._blurMaterial,c=this._lodMeshes[s];c.material=o;let l=o.uniforms;l.envMap.value=e.texture,l.sigma.value=a,l.mipInt.value=this._lodMax-n;let h=this._sizeLods[s],f=3*h*(s>this._lodMax-Ts?s-this._lodMax+Ts:0),u=4*(this._cubeSize-h);bs(t,f,u,3*h,2*h),r.setRenderTarget(t),r.render(c,fr)}};function Tm(i){let e=[],t=[],n=i,s=i-Ts+1+ym;for(let a=0;a<s;a++){let r=Math.pow(2,n);e.push(r);let o=1/(r-2),c=-o,l=1+o,h=[c,c,l,c,l,l,c,c,l,l,c,l],f=6,u=6,d=3,v=new Float32Array(d*u*f),S=new Float32Array(d*u*f);for(let p=0;p<f;p++){let T=p%3*2/3-1,U=p>2?0:-1,y=[T,U,0,T+2/3,U,0,T+2/3,U+1,0,T,U,0,T+2/3,U+1,0,T,U+1,0];v.set(y,d*u*p);for(let w=0;w<u;w++){let b=h[w*2]*2-1,P=h[w*2+1]*2-1;p===0?Li.set(1,P,b):p===1?Li.set(-b,1,-P):p===2?Li.set(-b,P,1):p===3?Li.set(-1,P,-b):p===4?Li.set(-b,-1,P):Li.set(b,P,-1),Li.toArray(S,(p*u+w)*d)}}let m=new un;m.setAttribute("position",new hn(v,d)),m.setAttribute("outputDirection",new hn(S,d)),t.push(new mt(m,null)),n>Ts&&n--}return{lodMeshes:t,sizeLods:e}}function Oh(i,e,t){let n=new Jt(i,e,t);return n.texture.mapping=rr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function bs(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function Em(i,e,t){return new sn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Mm,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:go(),fragmentShader:`

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
		`,blending:An,depthTest:!1,depthWrite:!1})}function wm(i,e,t){return new sn({name:"SphericalGaussianBlur",defines:{SAMPLES:Sm,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:go(),fragmentShader:`

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
		`,blending:An,depthTest:!1,depthWrite:!1})}function Bh(){return new sn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:go(),fragmentShader:`

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
		`,blending:An,depthTest:!1,depthWrite:!1})}function zh(){return new sn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:go(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:An,depthTest:!1,depthWrite:!1})}function go(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var po=class extends Jt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new $s(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new ms(5,5,5),a=new sn({name:"CubemapFromEquirect",uniforms:Pi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Xt,blending:An});a.uniforms.tEquirect.value=t;let r=new mt(s,a),o=t.minFilter;return t.minFilter===Xn&&(t.minFilter=ft),new ya(1,10,this).update(e,r),t.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let a=e.getRenderTarget();for(let r=0;r<6;r++)e.setRenderTarget(this,r),e.clear(t,n,s);e.setRenderTarget(a)}};function Am(i){let e=new WeakMap,t=new WeakMap,n=null;function s(u,d=!1){return u==null?null:d?r(u):a(u)}function a(u){if(u&&u.isTexture){let d=u.mapping;if(d===ba||d===Ta)if(e.has(u)){let v=e.get(u).texture;return o(v,u.mapping)}else{let v=u.image;if(v&&v.height>0){let S=new po(v.height);return S.fromEquirectangularTexture(i,u),e.set(u,S),u.addEventListener("dispose",l),o(S.texture,u.mapping)}else return null}}return u}function r(u){if(u&&u.isTexture){let d=u.mapping,v=d===ba||d===Ta,S=d===fi||d===Ii;if(v||S){let m=t.get(u),p=m!==void 0?m.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==p)return n===null&&(n=new ws(i)),m=v?n.fromEquirectangular(u,m):n.fromCubemap(u,m),m.texture.pmremVersion=u.pmremVersion,t.set(u,m),m.texture;if(m!==void 0)return m.texture;{let T=u.image;return v&&T&&T.height>0||S&&T&&c(T)?(n===null&&(n=new ws(i)),m=v?n.fromEquirectangular(u):n.fromCubemap(u),m.texture.pmremVersion=u.pmremVersion,t.set(u,m),u.addEventListener("dispose",h),m.texture):null}}}return u}function o(u,d){return d===ba?u.mapping=fi:d===Ta&&(u.mapping=Ii),u}function c(u){let d=0,v=6;for(let S=0;S<v;S++)u[S]!==void 0&&d++;return d===v}function l(u){let d=u.target;d.removeEventListener("dispose",l);let v=e.get(d);v!==void 0&&(e.delete(d),v.dispose())}function h(u){let d=u.target;d.removeEventListener("dispose",h);let v=t.get(d);v!==void 0&&(t.delete(d),v.dispose())}function f(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:f}}function Rm(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&Ti("WebGLRenderer: "+n+" extension not supported."),s}}}function Cm(i,e,t,n){let s={},a=new WeakMap;function r(f){let u=f.target;u.index!==null&&e.remove(u.index);for(let v in u.attributes)e.remove(u.attributes[v]);u.removeEventListener("dispose",r),delete s[u.id];let d=a.get(u);d&&(e.remove(d),a.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function o(f,u){return s[u.id]===!0||(u.addEventListener("dispose",r),s[u.id]=!0,t.memory.geometries++),u}function c(f){let u=f.attributes;for(let d in u)e.update(u[d],i.ARRAY_BUFFER)}function l(f){let u=[],d=f.index,v=f.attributes.position,S=0;if(v===void 0)return;if(d!==null){let T=d.array;S=d.version;for(let U=0,y=T.length;U<y;U+=3){let w=T[U+0],b=T[U+1],P=T[U+2];u.push(w,b,b,P,P,w)}}else{let T=v.array;S=v.version;for(let U=0,y=T.length/3-1;U<y;U+=3){let w=U+0,b=U+1,P=U+2;u.push(w,b,b,P,P,w)}}let m=new(v.count>=65535?Zs:Ys)(u,1);m.version=S;let p=a.get(f);p&&e.remove(p),a.set(f,m)}function h(f){let u=a.get(f);if(u){let d=f.index;d!==null&&u.version<d.version&&l(f)}else l(f);return a.get(f)}return{get:o,update:c,getWireframeAttribute:h}}function Im(i,e,t){let n;function s(f){n=f}let a,r;function o(f){a=f.type,r=f.bytesPerElement}function c(f,u){i.drawElements(n,u,a,f*r),t.update(u,n,1)}function l(f,u,d){d!==0&&(i.drawElementsInstanced(n,u,a,f*r,d),t.update(u,n,d))}function h(f,u,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,a,f,0,d);let S=0;for(let m=0;m<d;m++)S+=u[m];t.update(S,n,1)}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h}function Pm(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(a,r,o){switch(t.calls++,r){case i.TRIANGLES:t.triangles+=o*(a/3);break;case i.LINES:t.lines+=o*(a/2);break;case i.LINE_STRIP:t.lines+=o*(a-1);break;case i.LINE_LOOP:t.lines+=o*a;break;case i.POINTS:t.points+=o*a;break;default:Fe("WebGLInfo: Unknown draw mode:",r);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function Lm(i,e,t){let n=new WeakMap,s=new pt;function a(r,o,c){let l=r.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=h!==void 0?h.length:0,u=n.get(o);if(u===void 0||u.count!==f){let M=function(){P.dispose(),n.delete(o),o.removeEventListener("dispose",M)};u!==void 0&&u.texture.dispose();let d=o.morphAttributes.position!==void 0,v=o.morphAttributes.normal!==void 0,S=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],T=o.morphAttributes.color||[],U=0;d===!0&&(U=1),v===!0&&(U=2),S===!0&&(U=3);let y=o.attributes.position.count*U,w=1;y>e.maxTextureSize&&(w=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);let b=new Float32Array(y*w*4*f),P=new Ws(b,y,w,f);P.type=jt,P.needsUpdate=!0;let x=U*4;for(let L=0;L<f;L++){let I=m[L],z=p[L],k=T[L],C=y*w*4*L;for(let G=0;G<I.count;G++){let X=G*x;d===!0&&(s.fromBufferAttribute(I,G),b[C+X+0]=s.x,b[C+X+1]=s.y,b[C+X+2]=s.z,b[C+X+3]=0),v===!0&&(s.fromBufferAttribute(z,G),b[C+X+4]=s.x,b[C+X+5]=s.y,b[C+X+6]=s.z,b[C+X+7]=0),S===!0&&(s.fromBufferAttribute(k,G),b[C+X+8]=s.x,b[C+X+9]=s.y,b[C+X+10]=s.z,b[C+X+11]=k.itemSize===4?s.w:1)}}u={count:f,texture:P,size:new Je(y,w)},n.set(o,u),o.addEventListener("dispose",M)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",r.morphTexture,t);else{let d=0;for(let S=0;S<l.length;S++)d+=l[S];let v=o.morphTargetsRelative?1:1-d;c.getUniforms().setValue(i,"morphTargetBaseInfluence",v),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",u.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:a}}function Dm(i,e,t,n,s){let a=new WeakMap;function r(l){let h=s.render.frame,f=l.geometry,u=e.get(l,f);if(a.get(u)!==h&&(e.update(u),a.set(u,h)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),a.get(l)!==h&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),a.set(l,h))),l.isSkinnedMesh){let d=l.skeleton;a.get(d)!==h&&(d.update(),a.set(d,h))}return u}function o(){a=new WeakMap}function c(l){let h=l.target;h.removeEventListener("dispose",c),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:r,dispose:o}}var Um={[El]:"LINEAR_TONE_MAPPING",[wl]:"REINHARD_TONE_MAPPING",[Al]:"CINEON_TONE_MAPPING",[sr]:"ACES_FILMIC_TONE_MAPPING",[Cl]:"AGX_TONE_MAPPING",[Il]:"NEUTRAL_TONE_MAPPING",[Rl]:"CUSTOM_TONE_MAPPING"};function Nm(i,e,t,n,s,a){let r=new Jt(e,t,{type:i,depthBuffer:s,stencilBuffer:a,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,c=null,l=new un;l.setAttribute("position",new Bt([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new Bt([0,2,0,0,2,0],2));let h=new aa({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),f=new mt(l,h),u=new ui(-1,1,1,-1,0,1),d=null,v=null,S=!1,m,p=null,T=[],U=!1;this.setSize=function(y,w){r.setSize(y,w),o!==null&&o.setSize(y,w),c!==null&&c.setSize(y,w);for(let b=0;b<T.length;b++){let P=T[b];P.setSize&&P.setSize(y,w)}},this.setEffects=function(y){T=y,U=T.length>0&&T[0].isRenderPass===!0;let w=r.width,b=r.height;T.length>0&&o===null&&(o=new Jt(w,b,{type:qt,depthBuffer:!1,stencilBuffer:!1}),c=new Jt(w,b,{type:qt,depthBuffer:!1,stencilBuffer:!1}));for(let P=0;P<T.length;P++){let x=T[P];x.setSize&&x.setSize(w,b)}},this.begin=function(y,w){if(S||y.toneMapping===an&&T.length===0)return!1;if(p=w,w!==null){let b=w.width,P=w.height;(r.width!==b||r.height!==P)&&this.setSize(b,P)}return U===!1&&y.setRenderTarget(r),m=y.toneMapping,y.toneMapping=an,!0},this.hasRenderPass=function(){return U},this.end=function(y,w){y.toneMapping=m,S=!0;let b=r,P=o;for(let x=0;x<T.length;x++){let M=T[x];M.enabled!==!1&&(M.render(y,P,b,w),M.needsSwap!==!1&&(b=P,P=P===o?c:o))}if(d!==y.outputColorSpace||v!==y.toneMapping){d=y.outputColorSpace,v=y.toneMapping,h.defines={},$e.getTransfer(d)===it&&(h.defines.SRGB_TRANSFER="");let x=Um[v];x&&(h.defines[x]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=b.texture,y.setRenderTarget(p),y.render(f,u),p=null,S=!1},this.isCompositing=function(){return S},this.dispose=function(){r.dispose(),o!==null&&o.dispose(),c!==null&&c.dispose(),l.dispose(),h.dispose()}}var ru=new It,ec=new ai(1,1),au=new Ws,ou=new ia,lu=new $s,kh=[],Vh=[],Gh=new Float32Array(16),Hh=new Float32Array(9),Wh=new Float32Array(4);function As(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,a=kh[s];if(a===void 0&&(a=new Float32Array(s),kh[s]=a),e!==0){n.toArray(a,0);for(let r=1,o=0;r!==e;++r)o+=t,i[r].toArray(a,o)}return a}function Et(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function wt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function _o(i,e){let t=Vh[e];t===void 0&&(t=new Int32Array(e),Vh[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Fm(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Om(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Et(t,e))return;i.uniform2fv(this.addr,e),wt(t,e)}}function Bm(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Et(t,e))return;i.uniform3fv(this.addr,e),wt(t,e)}}function zm(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Et(t,e))return;i.uniform4fv(this.addr,e),wt(t,e)}}function km(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Et(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),wt(t,e)}else{if(Et(t,n))return;Wh.set(n),i.uniformMatrix2fv(this.addr,!1,Wh),wt(t,n)}}function Vm(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Et(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),wt(t,e)}else{if(Et(t,n))return;Hh.set(n),i.uniformMatrix3fv(this.addr,!1,Hh),wt(t,n)}}function Gm(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Et(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),wt(t,e)}else{if(Et(t,n))return;Gh.set(n),i.uniformMatrix4fv(this.addr,!1,Gh),wt(t,n)}}function Hm(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Wm(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Et(t,e))return;i.uniform2iv(this.addr,e),wt(t,e)}}function Xm(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Et(t,e))return;i.uniform3iv(this.addr,e),wt(t,e)}}function qm(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Et(t,e))return;i.uniform4iv(this.addr,e),wt(t,e)}}function Ym(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Zm(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Et(t,e))return;i.uniform2uiv(this.addr,e),wt(t,e)}}function $m(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Et(t,e))return;i.uniform3uiv(this.addr,e),wt(t,e)}}function Jm(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Et(t,e))return;i.uniform4uiv(this.addr,e),wt(t,e)}}function Km(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let a;this.type===i.SAMPLER_2D_SHADOW?(ec.compareFunction=t.isReversedDepthBuffer()?ho:co,a=ec):a=ru,t.setTexture2D(e||a,s)}function jm(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||ou,s)}function Qm(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||lu,s)}function eg(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||au,s)}function tg(i){switch(i){case 5126:return Fm;case 35664:return Om;case 35665:return Bm;case 35666:return zm;case 35674:return km;case 35675:return Vm;case 35676:return Gm;case 5124:case 35670:return Hm;case 35667:case 35671:return Wm;case 35668:case 35672:return Xm;case 35669:case 35673:return qm;case 5125:return Ym;case 36294:return Zm;case 36295:return $m;case 36296:return Jm;case 35678:case 36198:case 36298:case 36306:case 35682:return Km;case 35679:case 36299:case 36307:return jm;case 35680:case 36300:case 36308:case 36293:return Qm;case 36289:case 36303:case 36311:case 36292:return eg}}function ng(i,e){i.uniform1fv(this.addr,e)}function ig(i,e){let t=As(e,this.size,2);i.uniform2fv(this.addr,t)}function sg(i,e){let t=As(e,this.size,3);i.uniform3fv(this.addr,t)}function rg(i,e){let t=As(e,this.size,4);i.uniform4fv(this.addr,t)}function ag(i,e){let t=As(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function og(i,e){let t=As(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function lg(i,e){let t=As(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function cg(i,e){i.uniform1iv(this.addr,e)}function hg(i,e){i.uniform2iv(this.addr,e)}function ug(i,e){i.uniform3iv(this.addr,e)}function dg(i,e){i.uniform4iv(this.addr,e)}function fg(i,e){i.uniform1uiv(this.addr,e)}function pg(i,e){i.uniform2uiv(this.addr,e)}function mg(i,e){i.uniform3uiv(this.addr,e)}function gg(i,e){i.uniform4uiv(this.addr,e)}function _g(i,e,t){let n=this.cache,s=e.length,a=_o(t,s);Et(n,a)||(i.uniform1iv(this.addr,a),wt(n,a));let r;this.type===i.SAMPLER_2D_SHADOW?r=ec:r=ru;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||r,a[o])}function xg(i,e,t){let n=this.cache,s=e.length,a=_o(t,s);Et(n,a)||(i.uniform1iv(this.addr,a),wt(n,a));for(let r=0;r!==s;++r)t.setTexture3D(e[r]||ou,a[r])}function vg(i,e,t){let n=this.cache,s=e.length,a=_o(t,s);Et(n,a)||(i.uniform1iv(this.addr,a),wt(n,a));for(let r=0;r!==s;++r)t.setTextureCube(e[r]||lu,a[r])}function yg(i,e,t){let n=this.cache,s=e.length,a=_o(t,s);Et(n,a)||(i.uniform1iv(this.addr,a),wt(n,a));for(let r=0;r!==s;++r)t.setTexture2DArray(e[r]||au,a[r])}function Sg(i){switch(i){case 5126:return ng;case 35664:return ig;case 35665:return sg;case 35666:return rg;case 35674:return ag;case 35675:return og;case 35676:return lg;case 5124:case 35670:return cg;case 35667:case 35671:return hg;case 35668:case 35672:return ug;case 35669:case 35673:return dg;case 5125:return fg;case 36294:return pg;case 36295:return mg;case 36296:return gg;case 35678:case 36198:case 36298:case 36306:case 35682:return _g;case 35679:case 36299:case 36307:return xg;case 35680:case 36300:case 36308:case 36293:return vg;case 36289:case 36303:case 36311:case 36292:return yg}}var tc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=tg(t.type)}},nc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Sg(t.type)}},ic=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let a=0,r=s.length;a!==r;++a){let o=s[a];o.setValue(e,t[o.id],n)}}},jl=/(\w+)(\])?(\[|\.)?/g;function Xh(i,e){i.seq.push(e),i.map[e.id]=e}function Mg(i,e,t){let n=i.name,s=n.length;for(jl.lastIndex=0;;){let a=jl.exec(n),r=jl.lastIndex,o=a[1],c=a[2]==="]",l=a[3];if(c&&(o=o|0),l===void 0||l==="["&&r+2===s){Xh(t,l===void 0?new tc(o,i,e):new nc(o,i,e));break}else{let f=t.map[o];f===void 0&&(f=new ic(o),Xh(t,f)),t=f}}}var Es=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let o=e.getActiveUniform(t,r),c=e.getUniformLocation(t,o.name);Mg(o,c,this)}let s=[],a=[];for(let r of this.seq)r.type===e.SAMPLER_2D_SHADOW||r.type===e.SAMPLER_CUBE_SHADOW||r.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(r):a.push(r);s.length>0&&(this.seq=s.concat(a))}setValue(e,t,n,s){let a=this.map[t];a!==void 0&&a.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let a=0,r=t.length;a!==r;++a){let o=t[a],c=n[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,a=e.length;s!==a;++s){let r=e[s];r.id in t&&n.push(r)}return n}};function qh(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var bg=37297,Tg=0;function Eg(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),a=Math.min(e+6,t.length);for(let r=s;r<a;r++){let o=r+1;n.push(`${o===e?">":" "} ${o}: ${t[r]}`)}return n.join(`
`)}var Yh=new Oe;function wg(i){$e._getMatrix(Yh,$e.workingColorSpace,i);let e=`mat3( ${Yh.elements.map(t=>t.toFixed(4))} )`;switch($e.getTransfer(i)){case Hs:return[e,"LinearTransferOETF"];case it:return[e,"sRGBTransferOETF"];default:return De("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Zh(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),a=(i.getShaderInfoLog(e)||"").trim();if(n&&a==="")return"";let r=/ERROR: 0:(\d+)/.exec(a);if(r){let o=parseInt(r[1]);return t.toUpperCase()+`

`+a+`

`+Eg(i.getShaderSource(e),o)}else return a}function Ag(i,e){let t=wg(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}var Rg={[El]:"Linear",[wl]:"Reinhard",[Al]:"Cineon",[sr]:"ACESFilmic",[Cl]:"AgX",[Il]:"Neutral",[Rl]:"Custom"};function Cg(i,e){let t=Rg[e];return t===void 0?(De("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var fo=new q;function Ig(){$e.getLuminanceCoefficients(fo);let i=fo.x.toFixed(4),e=fo.y.toFixed(4),t=fo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Pg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(mr).join(`
`)}function Lg(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Dg(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let a=i.getActiveAttrib(e,s),r=a.name,o=1;a.type===i.FLOAT_MAT2&&(o=2),a.type===i.FLOAT_MAT3&&(o=3),a.type===i.FLOAT_MAT4&&(o=4),t[r]={type:a.type,location:i.getAttribLocation(e,r),locationSize:o}}return t}function mr(i){return i!==""}function $h(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Jh(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var Ug=/^[ \t]*#include +<([\w\d./]+)>/gm;function sc(i){return i.replace(Ug,Fg)}var Ng=new Map;function Fg(i,e){let t=We[e];if(t===void 0){let n=Ng.get(e);if(n!==void 0)t=We[n],De('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return sc(t)}var Og=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Kh(i){return i.replace(Og,Bg)}function Bg(i,e,t,n){let s="";for(let a=parseInt(e);a<parseInt(t);a++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function jh(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}var zg={[Ri]:"SHADOWMAP_TYPE_PCF",[xs]:"SHADOWMAP_TYPE_VSM"};function kg(i){return zg[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var Vg={[fi]:"ENVMAP_TYPE_CUBE",[Ii]:"ENVMAP_TYPE_CUBE",[rr]:"ENVMAP_TYPE_CUBE_UV"};function Gg(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":Vg[i.envMapMode]||"ENVMAP_TYPE_CUBE"}var Hg={[Ii]:"ENVMAP_MODE_REFRACTION"};function Wg(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":Hg[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var Xg={[Tl]:"ENVMAP_BLENDING_MULTIPLY",[mh]:"ENVMAP_BLENDING_MIX",[gh]:"ENVMAP_BLENDING_ADD"};function qg(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":Xg[i.combine]||"ENVMAP_BLENDING_NONE"}function Yg(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function Zg(i,e,t,n){let s=i.getContext(),a=t.defines,r=t.vertexShader,o=t.fragmentShader,c=kg(t),l=Gg(t),h=Wg(t),f=qg(t),u=Yg(t),d=Pg(t),v=Lg(a),S=s.createProgram(),m,p,T=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v].filter(mr).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v].filter(mr).join(`
`),p.length>0&&(p+=`
`)):(m=[jh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(mr).join(`
`),p=[jh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+f:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==an?"#define TONE_MAPPING":"",t.toneMapping!==an?We.tonemapping_pars_fragment:"",t.toneMapping!==an?Cg("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",We.colorspace_pars_fragment,Ag("linearToOutputTexel",t.outputColorSpace),Ig(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(mr).join(`
`)),r=sc(r),r=$h(r,t),r=Jh(r,t),o=sc(o),o=$h(o,t),o=Jh(o,t),r=Kh(r),o=Kh(o),t.isRawShaderMaterial!==!0&&(T=`#version 300 es
`,m=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===Vl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Vl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let U=T+m+r,y=T+p+o,w=qh(s,s.VERTEX_SHADER,U),b=qh(s,s.FRAGMENT_SHADER,y);s.attachShader(S,w),s.attachShader(S,b),t.index0AttributeName!==void 0?s.bindAttribLocation(S,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(S,0,"position"),s.linkProgram(S);function P(I){if(i.debug.checkShaderErrors){let z=s.getProgramInfoLog(S)||"",k=s.getShaderInfoLog(w)||"",C=s.getShaderInfoLog(b)||"",G=z.trim(),X=k.trim(),$=C.trim(),ie=!0,Z=!0;if(s.getProgramParameter(S,s.LINK_STATUS)===!1)if(ie=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,S,w,b);else{let Q=Zh(s,w,"vertex"),se=Zh(s,b,"fragment");Fe("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(S,s.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+G+`
`+Q+`
`+se)}else G!==""?De("WebGLProgram: Program Info Log:",G):(X===""||$==="")&&(Z=!1);Z&&(I.diagnostics={runnable:ie,programLog:G,vertexShader:{log:X,prefix:m},fragmentShader:{log:$,prefix:p}})}s.deleteShader(w),s.deleteShader(b),x=new Es(s,S),M=Dg(s,S)}let x;this.getUniforms=function(){return x===void 0&&P(this),x};let M;this.getAttributes=function(){return M===void 0&&P(this),M};let L=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return L===!1&&(L=s.getProgramParameter(S,bg)),L},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(S),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Tg++,this.cacheKey=e,this.usedTimes=1,this.program=S,this.vertexShader=w,this.fragmentShader=b,this}var $g=0,rc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new ac(e),t.set(e,n)),n}},ac=class{constructor(e){this.id=$g++,this.code=e,this.usedTimes=0}};function Jg(i){return i===mi||i===ur||i===dr}function Kg(i,e,t,n,s,a){let r=new Xs,o=new rc,c=new Set,l=[],h=new Map,f=n.logarithmicDepthBuffer,u=n.precision,d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(x){return c.add(x),x===0?"uv":`uv${x}`}function S(x,M,L,I,z,k){let C=I.fog,G=z.geometry,X=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?I.environment:null,$=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,ie=e.get(x.envMap||X,$),Z=ie&&ie.mapping===rr?ie.image.height:null,Q=d[x.type];x.precision!==null&&(u=n.getMaxPrecision(x.precision),u!==x.precision&&De("WebGLProgram.getParameters:",x.precision,"not supported, using",u,"instead."));let se=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,le=se!==void 0?se.length:0,Me=0;G.morphAttributes.position!==void 0&&(Me=1),G.morphAttributes.normal!==void 0&&(Me=2),G.morphAttributes.color!==void 0&&(Me=3);let Ue,xe,Ke,K;if(Q){let rt=Cn[Q];Ue=rt.vertexShader,xe=rt.fragmentShader}else{Ue=x.vertexShader,xe=x.fragmentShader;let rt=o.getVertexShaderStage(x),et=o.getFragmentShaderStage(x);o.update(x,rt,et),Ke=rt.id,K=et.id}let ee=i.getRenderTarget(),Se=i.state.buffers.depth.getReversed(),Le=z.isInstancedMesh===!0,ye=z.isBatchedMesh===!0,ke=!!x.map,vt=!!x.matcap,Be=!!ie,je=!!x.aoMap,tt=!!x.lightMap,Xe=!!x.bumpMap&&x.wireframe===!1,ot=!!x.normalMap,gt=!!x.displacementMap,St=!!x.emissiveMap,st=!!x.metalnessMap,_t=!!x.roughnessMap,F=x.anisotropy>0,Ye=x.clearcoat>0,Ve=x.dispersion>0,E=x.retroreflectivity>0,_=x.iridescence>0,V=x.sheen>0,H=x.transmission>0,J=F&&!!x.anisotropyMap,oe=Ye&&!!x.clearcoatMap,ue=Ye&&!!x.clearcoatNormalMap,j=Ye&&!!x.clearcoatRoughnessMap,ne=_&&!!x.iridescenceMap,ce=_&&!!x.iridescenceThicknessMap,we=V&&!!x.sheenColorMap,me=V&&!!x.sheenRoughnessMap,de=!!x.specularMap,Ce=!!x.specularColorMap,Pe=!!x.specularIntensityMap,ze=H&&!!x.transmissionMap,N=H&&!!x.thicknessMap,fe=!!x.gradientMap,te=!!x.alphaMap,pe=x.alphaTest>0,ve=!!x.alphaHash,re=!!x.extensions,Ie=an;x.toneMapped&&(ee===null||ee.isXRRenderTarget===!0)&&(Ie=i.toneMapping);let Ae={shaderID:Q,shaderType:x.type,shaderName:x.name,vertexShader:Ue,fragmentShader:xe,defines:x.defines,customVertexShaderID:Ke,customFragmentShaderID:K,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:u,batching:ye,batchingColor:ye&&z._colorsTexture!==null,instancing:Le,instancingColor:Le&&z.instanceColor!==null,instancingMorph:Le&&z.morphTexture!==null,outputColorSpace:ee===null?i.outputColorSpace:ee.isXRRenderTarget===!0?ee.texture.colorSpace:$e.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:ke,matcap:vt,envMap:Be,envMapMode:Be&&ie.mapping,envMapCubeUVHeight:Z,aoMap:je,lightMap:tt,bumpMap:Xe,normalMap:ot,displacementMap:gt,emissiveMap:St,normalMapObjectSpace:ot&&x.normalMapType===vh,normalMapTangentSpace:ot&&x.normalMapType===lo,packedNormalMap:ot&&x.normalMapType===lo&&Jg(x.normalMap.format),metalnessMap:st,roughnessMap:_t,anisotropy:F,anisotropyMap:J,clearcoat:Ye,clearcoatMap:oe,clearcoatNormalMap:ue,clearcoatRoughnessMap:j,dispersion:Ve,retroreflection:E,iridescence:_,iridescenceMap:ne,iridescenceThicknessMap:ce,sheen:V,sheenColorMap:we,sheenRoughnessMap:me,specularMap:de,specularColorMap:Ce,specularIntensityMap:Pe,transmission:H,transmissionMap:ze,thicknessMap:N,gradientMap:fe,opaque:x.transparent===!1&&x.blending===vs&&x.alphaToCoverage===!1,alphaMap:te,alphaTest:pe,alphaHash:ve,combine:x.combine,mapUv:ke&&v(x.map.channel),aoMapUv:je&&v(x.aoMap.channel),lightMapUv:tt&&v(x.lightMap.channel),bumpMapUv:Xe&&v(x.bumpMap.channel),normalMapUv:ot&&v(x.normalMap.channel),displacementMapUv:gt&&v(x.displacementMap.channel),emissiveMapUv:St&&v(x.emissiveMap.channel),metalnessMapUv:st&&v(x.metalnessMap.channel),roughnessMapUv:_t&&v(x.roughnessMap.channel),anisotropyMapUv:J&&v(x.anisotropyMap.channel),clearcoatMapUv:oe&&v(x.clearcoatMap.channel),clearcoatNormalMapUv:ue&&v(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:j&&v(x.clearcoatRoughnessMap.channel),iridescenceMapUv:ne&&v(x.iridescenceMap.channel),iridescenceThicknessMapUv:ce&&v(x.iridescenceThicknessMap.channel),sheenColorMapUv:we&&v(x.sheenColorMap.channel),sheenRoughnessMapUv:me&&v(x.sheenRoughnessMap.channel),specularMapUv:de&&v(x.specularMap.channel),specularColorMapUv:Ce&&v(x.specularColorMap.channel),specularIntensityMapUv:Pe&&v(x.specularIntensityMap.channel),transmissionMapUv:ze&&v(x.transmissionMap.channel),thicknessMapUv:N&&v(x.thicknessMap.channel),alphaMapUv:te&&v(x.alphaMap.channel),vertexTangents:!!G.attributes.tangent&&(ot||F),vertexNormals:!!G.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!G.attributes.uv&&(ke||te),fog:!!C,useFog:x.fog===!0,fogExp2:!!C&&C.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||G.attributes.normal===void 0&&ot===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:Se,skinning:z.isSkinnedMesh===!0,hasPositionAttribute:G.attributes.position!==void 0,morphTargets:G.morphAttributes.position!==void 0,morphNormals:G.morphAttributes.normal!==void 0,morphColors:G.morphAttributes.color!==void 0,morphTargetsCount:le,morphTextureStride:Me,numSunLights:M.sun.length,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numSunLightShadows:M.sunShadowMap.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numLightProbeGrids:k.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:x.dithering,shadowMapEnabled:i.shadowMap.enabled&&L.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ie,decodeVideoTexture:ke&&x.map.isVideoTexture===!0&&$e.getTransfer(x.map.colorSpace)===it,decodeVideoTextureEmissive:St&&x.emissiveMap.isVideoTexture===!0&&$e.getTransfer(x.emissiveMap.colorSpace)===it,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===Tt,flipSided:x.side===Xt,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:re&&x.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(re&&x.extensions.multiDraw===!0||ye)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return Ae.vertexUv1s=c.has(1),Ae.vertexUv2s=c.has(2),Ae.vertexUv3s=c.has(3),c.clear(),Ae}function m(x){let M=[];if(x.shaderID?M.push(x.shaderID):(M.push(x.customVertexShaderID),M.push(x.customFragmentShaderID)),x.defines!==void 0)for(let L in x.defines)M.push(L),M.push(x.defines[L]);return x.isRawShaderMaterial===!1&&(p(M,x),T(M,x),M.push(i.outputColorSpace)),M.push(x.customProgramCacheKey),M.join()}function p(x,M){x.push(M.precision),x.push(M.outputColorSpace),x.push(M.envMapMode),x.push(M.envMapCubeUVHeight),x.push(M.mapUv),x.push(M.alphaMapUv),x.push(M.lightMapUv),x.push(M.aoMapUv),x.push(M.bumpMapUv),x.push(M.normalMapUv),x.push(M.displacementMapUv),x.push(M.emissiveMapUv),x.push(M.metalnessMapUv),x.push(M.roughnessMapUv),x.push(M.anisotropyMapUv),x.push(M.clearcoatMapUv),x.push(M.clearcoatNormalMapUv),x.push(M.clearcoatRoughnessMapUv),x.push(M.iridescenceMapUv),x.push(M.iridescenceThicknessMapUv),x.push(M.sheenColorMapUv),x.push(M.sheenRoughnessMapUv),x.push(M.specularMapUv),x.push(M.specularColorMapUv),x.push(M.specularIntensityMapUv),x.push(M.transmissionMapUv),x.push(M.thicknessMapUv),x.push(M.combine),x.push(M.fogExp2),x.push(M.sizeAttenuation),x.push(M.morphTargetsCount),x.push(M.morphAttributeCount),x.push(M.numSunLights),x.push(M.numDirLights),x.push(M.numPointLights),x.push(M.numSpotLights),x.push(M.numSpotLightMaps),x.push(M.numHemiLights),x.push(M.numRectAreaLights),x.push(M.numSunLightShadows),x.push(M.numDirLightShadows),x.push(M.numPointLightShadows),x.push(M.numSpotLightShadows),x.push(M.numSpotLightShadowsWithMaps),x.push(M.numLightProbes),x.push(M.shadowMapType),x.push(M.toneMapping),x.push(M.numClippingPlanes),x.push(M.numClipIntersection),x.push(M.depthPacking)}function T(x,M){r.disableAll(),M.instancing&&r.enable(0),M.instancingColor&&r.enable(1),M.instancingMorph&&r.enable(2),M.matcap&&r.enable(3),M.envMap&&r.enable(4),M.normalMapObjectSpace&&r.enable(5),M.normalMapTangentSpace&&r.enable(6),M.clearcoat&&r.enable(7),M.iridescence&&r.enable(8),M.alphaTest&&r.enable(9),M.vertexColors&&r.enable(10),M.vertexAlphas&&r.enable(11),M.vertexUv1s&&r.enable(12),M.vertexUv2s&&r.enable(13),M.vertexUv3s&&r.enable(14),M.vertexTangents&&r.enable(15),M.anisotropy&&r.enable(16),M.alphaHash&&r.enable(17),M.batching&&r.enable(18),M.dispersion&&r.enable(19),M.retroreflection&&r.enable(24),M.batchingColor&&r.enable(20),M.gradientMap&&r.enable(21),M.packedNormalMap&&r.enable(22),M.vertexNormals&&r.enable(23),x.push(r.mask),r.disableAll(),M.fog&&r.enable(0),M.useFog&&r.enable(1),M.flatShading&&r.enable(2),M.logarithmicDepthBuffer&&r.enable(3),M.reversedDepthBuffer&&r.enable(4),M.skinning&&r.enable(5),M.morphTargets&&r.enable(6),M.morphNormals&&r.enable(7),M.morphColors&&r.enable(8),M.premultipliedAlpha&&r.enable(9),M.shadowMapEnabled&&r.enable(10),M.doubleSided&&r.enable(11),M.flipSided&&r.enable(12),M.useDepthPacking&&r.enable(13),M.dithering&&r.enable(14),M.transmission&&r.enable(15),M.sheen&&r.enable(16),M.opaque&&r.enable(17),M.pointsUvs&&r.enable(18),M.decodeVideoTexture&&r.enable(19),M.decodeVideoTextureEmissive&&r.enable(20),M.alphaToCoverage&&r.enable(21),M.numLightProbeGrids>0&&r.enable(22),M.hasPositionAttribute&&r.enable(23),x.push(r.mask)}function U(x){let M=d[x.type],L;if(M){let I=Cn[M];L=Dh.clone(I.uniforms)}else L=x.uniforms;return L}function y(x,M){let L=h.get(M);return L!==void 0?++L.usedTimes:(L=new Zg(i,M,x,s),l.push(L),h.set(M,L)),L}function w(x){if(--x.usedTimes===0){let M=l.indexOf(x);l[M]=l[l.length-1],l.pop(),h.delete(x.cacheKey),x.destroy()}}function b(x){o.remove(x)}function P(){o.dispose()}return{getParameters:S,getProgramCacheKey:m,getUniforms:U,acquireProgram:y,releaseProgram:w,releaseShaderCache:b,programs:l,dispose:P}}function jg(){let i=new WeakMap;function e(r){return i.has(r)}function t(r){let o=i.get(r);return o===void 0&&(o={},i.set(r,o)),o}function n(r){i.delete(r)}function s(r,o,c){i.get(r)[o]=c}function a(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:a}}function Qg(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function Qh(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function eu(){let i=[],e=0,t=[],n=[],s=[];function a(){e=0,t.length=0,n.length=0,s.length=0}function r(u){let d=0;return u.isInstancedMesh&&(d+=2),u.isSkinnedMesh&&(d+=1),d}function o(u,d,v,S,m,p){let T=i[e];return T===void 0?(T={id:u.id,object:u,geometry:d,material:v,materialVariant:r(u),groupOrder:S,renderOrder:u.renderOrder,z:m,group:p},i[e]=T):(T.id=u.id,T.object=u,T.geometry=d,T.material=v,T.materialVariant=r(u),T.groupOrder=S,T.renderOrder=u.renderOrder,T.z=m,T.group=p),e++,T}function c(u,d,v,S,m,p,T){T.reversedDepth===!0&&(m=-m);let U=o(u,d,v,S,m,p);v.transmission>0?n.push(U):v.transparent===!0?s.push(U):t.push(U)}function l(u,d,v,S,m,p){let T=o(u,d,v,S,m,p);v.transmission>0?n.unshift(T):v.transparent===!0?s.unshift(T):t.unshift(T)}function h(u,d){t.length>1&&t.sort(u||Qg),n.length>1&&n.sort(d||Qh),s.length>1&&s.sort(d||Qh)}function f(){for(let u=e,d=i.length;u<d;u++){let v=i[u];if(v.id===null)break;v.id=null,v.object=null,v.geometry=null,v.material=null,v.group=null}}return{opaque:t,transmissive:n,transparent:s,init:a,push:c,unshift:l,finish:f,sort:h}}function e0(){let i=new WeakMap;function e(n,s){let a=i.get(n),r;return a===void 0?(r=new eu,i.set(n,[r])):s>=a.length?(r=new eu,a.push(r)):r=a[s],r}function t(){i=new WeakMap}return{get:e,dispose:t}}function t0(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new q,color:new Ge};break;case"SpotLight":t={position:new q,direction:new q,color:new Ge,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new q,color:new Ge,distance:0,decay:0};break;case"HemisphereLight":t={direction:new q,skyColor:new Ge,groundColor:new Ge};break;case"RectAreaLight":t={color:new Ge,position:new q,halfWidth:new q,halfHeight:new q};break}return i[e.id]=t,t}}}function n0(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Je};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Je};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Je,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var i0=0;function s0(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function r0(i){let e=new t0,t=n0(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new q);let s=new q,a=new xt,r=new xt;function o(l){let h=0,f=0,u=0;for(let z=0;z<9;z++)n.probe[z].set(0,0,0);let d=0,v=0,S=0,m=0,p=0,T=0,U=0,y=0,w=0,b=0,P=0,x=0,M=0,L=0;l.sort(s0);for(let z=0,k=l.length;z<k;z++){let C=l[z],G=C.color,X=C.intensity,$=C.distance,ie=null;if(C.shadow&&C.shadow.map&&(C.shadow.map.texture.format===mi?ie=C.shadow.map.texture:ie=C.shadow.map.depthTexture||C.shadow.map.texture),C.isAmbientLight)h+=G.r*X,f+=G.g*X,u+=G.b*X;else if(C.isLightProbe){for(let Z=0;Z<9;Z++)n.probe[Z].addScaledVector(C.sh.coefficients[Z],X);L++}else if(C.isSunLight){let Z=e.get(C);if(Z.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){let Q=C.shadow,se=t.get(C);se.shadowIntensity=Q.intensity,se.shadowBias=Q.bias,se.shadowNormalBias=Q.normalBias,se.shadowRadius=Q.radius,se.shadowMapSize.copy(Q.mapSize).multiply(Q.getFrameExtents()),n.sunShadow[v]=se,n.sunShadowMap[v]=ie;let le=Q.getViewportCount();for(let Me=0;Me<le;Me++)n.sunShadowMatrix[S+Me]=Q.getMatrix(Me),n.sunShadowCascade[S+Me]=Q._cascadeData[Me];S+=le,v++}n.sun[d]=Z,d++}else if(C.isDirectionalLight){let Z=e.get(C);if(Z.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){let Q=C.shadow,se=t.get(C);se.shadowIntensity=Q.intensity,se.shadowBias=Q.bias,se.shadowNormalBias=Q.normalBias,se.shadowRadius=Q.radius,se.shadowMapSize=Q.mapSize,n.directionalShadow[m]=se,n.directionalShadowMap[m]=ie,n.directionalShadowMatrix[m]=C.shadow.matrix,w++}n.directional[m]=Z,m++}else if(C.isSpotLight){let Z=e.get(C);Z.position.setFromMatrixPosition(C.matrixWorld),Z.color.copy(G).multiplyScalar(X),Z.distance=$,Z.coneCos=Math.cos(C.angle),Z.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),Z.decay=C.decay,n.spot[T]=Z;let Q=C.shadow;if(C.map&&(n.spotLightMap[x]=C.map,x++,Q.updateMatrices(C),C.castShadow&&M++),n.spotLightMatrix[T]=Q.matrix,C.castShadow){let se=t.get(C);se.shadowIntensity=Q.intensity,se.shadowBias=Q.bias,se.shadowNormalBias=Q.normalBias,se.shadowRadius=Q.radius,se.shadowMapSize=Q.mapSize,n.spotShadow[T]=se,n.spotShadowMap[T]=ie,P++}T++}else if(C.isRectAreaLight){let Z=e.get(C);Z.color.copy(G).multiplyScalar(X),Z.halfWidth.set(C.width*.5,0,0),Z.halfHeight.set(0,C.height*.5,0),n.rectArea[U]=Z,U++}else if(C.isPointLight){let Z=e.get(C);if(Z.color.copy(C.color).multiplyScalar(C.intensity),Z.distance=C.distance,Z.decay=C.decay,C.castShadow){let Q=C.shadow,se=t.get(C);se.shadowIntensity=Q.intensity,se.shadowBias=Q.bias,se.shadowNormalBias=Q.normalBias,se.shadowRadius=Q.radius,se.shadowMapSize=Q.mapSize,se.shadowCameraNear=Q.camera.near,se.shadowCameraFar=Q.camera.far,n.pointShadow[p]=se,n.pointShadowMap[p]=ie,n.pointShadowMatrix[p]=C.shadow.matrix,b++}n.point[p]=Z,p++}else if(C.isHemisphereLight){let Z=e.get(C);Z.skyColor.copy(C.color).multiplyScalar(X),Z.groundColor.copy(C.groundColor).multiplyScalar(X),n.hemi[y]=Z,y++}}U>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=_e.LTC_FLOAT_1,n.rectAreaLTC2=_e.LTC_FLOAT_2):(n.rectAreaLTC1=_e.LTC_HALF_1,n.rectAreaLTC2=_e.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=f,n.ambient[2]=u;let I=n.hash;(I.sunLength!==d||I.directionalLength!==m||I.pointLength!==p||I.spotLength!==T||I.rectAreaLength!==U||I.hemiLength!==y||I.numSunShadows!==v||I.numDirectionalShadows!==w||I.numPointShadows!==b||I.numSpotShadows!==P||I.numSpotMaps!==x||I.numLightProbes!==L)&&(n.sun.length=d,n.directional.length=m,n.spot.length=T,n.rectArea.length=U,n.point.length=p,n.hemi.length=y,n.sunShadow.length=v,n.sunShadowMap.length=v,n.sunShadowMatrix.length=S,n.sunShadowCascade.length=S,n.directionalShadow.length=w,n.directionalShadowMap.length=w,n.directionalShadowMatrix.length=w,n.pointShadow.length=b,n.pointShadowMap.length=b,n.pointShadowMatrix.length=b,n.spotShadow.length=P,n.spotShadowMap.length=P,n.spotLightMatrix.length=P+x-M,n.spotLightMap.length=x,n.numSpotLightShadowsWithMaps=M,n.numLightProbes=L,I.sunLength=d,I.directionalLength=m,I.pointLength=p,I.spotLength=T,I.rectAreaLength=U,I.hemiLength=y,I.numSunShadows=v,I.numDirectionalShadows=w,I.numPointShadows=b,I.numSpotShadows=P,I.numSpotMaps=x,I.numLightProbes=L,n.version=i0++)}function c(l,h){let f=0,u=0,d=0,v=0,S=0,m=0,p=h.matrixWorldInverse;for(let T=0,U=l.length;T<U;T++){let y=l[T];if(y.isSunLight){let w=n.sun[f];w.direction.setFromMatrixPosition(y.matrixWorld),w.direction.transformDirection(p),f++}else if(y.isDirectionalLight){let w=n.directional[u];w.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(p),u++}else if(y.isSpotLight){let w=n.spot[v];w.position.setFromMatrixPosition(y.matrixWorld),w.position.applyMatrix4(p),w.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(p),v++}else if(y.isRectAreaLight){let w=n.rectArea[S];w.position.setFromMatrixPosition(y.matrixWorld),w.position.applyMatrix4(p),r.identity(),a.copy(y.matrixWorld),a.premultiply(p),r.extractRotation(a),w.halfWidth.set(y.width*.5,0,0),w.halfHeight.set(0,y.height*.5,0),w.halfWidth.applyMatrix4(r),w.halfHeight.applyMatrix4(r),S++}else if(y.isPointLight){let w=n.point[d];w.position.setFromMatrixPosition(y.matrixWorld),w.position.applyMatrix4(p),d++}else if(y.isHemisphereLight){let w=n.hemi[m];w.direction.setFromMatrixPosition(y.matrixWorld),w.direction.transformDirection(p),m++}}}return{setup:o,setupView:c,state:n}}function tu(i){let e=new r0(i),t=[],n=[],s=[];function a(u){f.camera=u,t.length=0,n.length=0,s.length=0}function r(u){t.push(u)}function o(u){n.push(u)}function c(u){s.push(u)}function l(){e.setup(t)}function h(u){e.setupView(t,u)}let f={lightsArray:t,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:f,setupLights:l,setupLightsView:h,pushLight:r,pushShadow:o,pushLightProbeGrid:c}}function a0(i){let e=new WeakMap;function t(s,a=0){let r=e.get(s),o;return r===void 0?(o=new tu(i),e.set(s,[o])):a>=r.length?(o=new tu(i),r.push(o)):o=r[a],o}function n(){e=new WeakMap}return{get:t,dispose:n}}var o0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,l0=`uniform sampler2D shadow_pass;
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
}`,c0=[new q(1,0,0),new q(-1,0,0),new q(0,1,0),new q(0,-1,0),new q(0,0,1),new q(0,0,-1)],h0=[new q(0,-1,0),new q(0,-1,0),new q(0,0,1),new q(0,0,-1),new q(0,-1,0),new q(0,-1,0)],nu=new xt,pr=new q,Ql=new q;function u0(i,e,t){let n=new ps,s=new Je,a=new Je,r=new pt,o=new _s,c=new oa,l={},h=t.maxTextureSize,f={[di]:Xt,[Xt]:di,[Tt]:Tt},u=new sn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Je},radius:{value:4}},vertexShader:o0,fragmentShader:l0}),d=u.clone();d.defines.HORIZONTAL_PASS=1;let v=new un;v.setAttribute("position",new hn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let S=new mt(v,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ri;let p=this.type;this.render=function(b,P,x){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||b.length===0)return;this.type===Ma&&(De("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Ri);let M=i.getRenderTarget(),L=i.getActiveCubeFace(),I=i.getActiveMipmapLevel(),z=i.state;z.setBlending(An),z.buffers.depth.getReversed()===!0?z.buffers.color.setClear(0,0,0,0):z.buffers.color.setClear(1,1,1,1),z.buffers.depth.setTest(!0),z.setScissorTest(!1);let k=p!==this.type;k&&P.traverse(function(C){C.material&&(Array.isArray(C.material)?C.material.forEach(G=>G.needsUpdate=!0):C.material.needsUpdate=!0)});for(let C=0,G=b.length;C<G;C++){let X=b[C],$=X.shadow;if($===void 0){De("WebGLShadowMap:",X,"has no shadow.");continue}if($.autoUpdate===!1&&$.needsUpdate===!1)continue;s.copy($.mapSize);let ie=$.getFrameExtents();s.multiply(ie),a.copy($.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(a.x=Math.floor(h/ie.x),s.x=a.x*ie.x,$.mapSize.x=a.x),s.y>h&&(a.y=Math.floor(h/ie.y),s.y=a.y*ie.y,$.mapSize.y=a.y));let Z=i.state.buffers.depth.getReversed();if($.camera._reversedDepth=Z,$.map===null||k===!0){if($.map!==null&&($.map.depthTexture!==null&&($.map.depthTexture.dispose(),$.map.depthTexture=null),$.map.dispose()),this.type===xs){if(X.isPointLight){De("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}$.map=new Jt(s.x,s.y,{format:mi,type:qt,minFilter:ft,magFilter:ft,generateMipmaps:!1}),$.map.texture.name=X.name+".shadowMap",$.map.depthTexture=new ai(s.x,s.y,jt),$.map.depthTexture.name=X.name+".shadowMapDepth",$.map.depthTexture.format=Tn,$.map.depthTexture.compareFunction=null,$.map.depthTexture.minFilter=Ct,$.map.depthTexture.magFilter=Ct}else X.isPointLight?($.map=new po(s.x),$.map.depthTexture=new ra(s.x,yn)):($.map=new Jt(s.x,s.y),$.map.depthTexture=new ai(s.x,s.y,yn)),$.map.depthTexture.name=X.name+".shadowMap",$.map.depthTexture.format=Tn,this.type===Ri?($.map.depthTexture.compareFunction=Z?ho:co,$.map.depthTexture.minFilter=ft,$.map.depthTexture.magFilter=ft):($.map.depthTexture.compareFunction=null,$.map.depthTexture.minFilter=Ct,$.map.depthTexture.magFilter=Ct);$.camera.updateProjectionMatrix()}$.map.isWebGLCubeRenderTarget!==!0&&($.map.width!==s.x||$.map.height!==s.y)&&$.map.setSize(s.x,s.y);let Q=$.map.isWebGLCubeRenderTarget?6:$.getViewportCount();X.isPointLight!==!0&&$.updateMatrices(X,x);for(let se=0;se<Q;se++){let le=$.getCamera(se);if(X.isPointLight){let Me=$.camera,Ue=$.matrix,xe=X.distance||Me.far;xe!==Me.far&&(Me.far=xe,Me.updateProjectionMatrix()),pr.setFromMatrixPosition(X.matrixWorld),Me.position.copy(pr),Ql.copy(Me.position),Ql.add(c0[se]),Me.up.copy(h0[se]),Me.lookAt(Ql),Me.updateMatrixWorld(),Ue.makeTranslation(-pr.x,-pr.y,-pr.z),nu.multiplyMatrices(Me.projectionMatrix,Me.matrixWorldInverse),$._frustum.setFromProjectionMatrix(nu,Me.coordinateSystem,Me.reversedDepth)}if($.map.isWebGLCubeRenderTarget)i.setRenderTarget($.map,se),i.clear();else{se===0&&(i.setRenderTarget($.map),i.clear());let Me=$.getViewport(se);r.set(a.x*Me.x,a.y*Me.y,a.x*Me.z,a.y*Me.w),z.viewport(r)}n=$.getFrustum(se),y(P,x,le,X,this.type)}$.isPointLightShadow!==!0&&this.type===xs&&T($,x),$.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(M,L,I)};function T(b,P){let x=e.update(S);u.defines.VSM_SAMPLES!==b.blurSamples&&(u.defines.VSM_SAMPLES=b.blurSamples,d.defines.VSM_SAMPLES=b.blurSamples,u.needsUpdate=!0,d.needsUpdate=!0),b.mapPass===null?b.mapPass=new Jt(s.x,s.y,{format:mi,type:qt}):(b.mapPass.width!==b.map.width||b.mapPass.height!==b.map.height)&&b.mapPass.setSize(b.map.width,b.map.height),u.uniforms.shadow_pass.value=b.map.depthTexture,u.uniforms.resolution.value.set(b.map.width,b.map.height),u.uniforms.radius.value=b.radius,i.setRenderTarget(b.mapPass),i.clear(),i.renderBufferDirect(P,null,x,u,S,null),d.uniforms.shadow_pass.value=b.mapPass.texture,d.uniforms.resolution.value.set(b.map.width,b.map.height),d.uniforms.radius.value=b.radius,i.setRenderTarget(b.map),i.clear(),i.renderBufferDirect(P,null,x,d,S,null)}function U(b,P,x,M){let L=null,I=x.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(I!==void 0)L=I;else if(L=x.isPointLight===!0?c:o,i.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0||P.alphaToCoverage===!0){let z=L.uuid,k=P.uuid,C=l[z];C===void 0&&(C={},l[z]=C);let G=C[k];G===void 0&&(G=L.clone(),C[k]=G,P.addEventListener("dispose",w)),L=G}if(L.visible=P.visible,L.wireframe=P.wireframe,M===xs?L.side=P.shadowSide!==null?P.shadowSide:P.side:L.side=P.shadowSide!==null?P.shadowSide:f[P.side],L.alphaMap=P.alphaMap,L.alphaTest=P.alphaToCoverage===!0?.5:P.alphaTest,L.map=P.map,L.clipShadows=P.clipShadows,L.clippingPlanes=P.clippingPlanes,L.clipIntersection=P.clipIntersection,L.displacementMap=P.displacementMap,L.displacementScale=P.displacementScale,L.displacementBias=P.displacementBias,L.wireframeLinewidth=P.wireframeLinewidth,L.linewidth=P.linewidth,x.isPointLight===!0&&L.isMeshDistanceMaterial===!0){let z=i.properties.get(L);z.light=x}return L}function y(b,P,x,M,L){if(b.visible===!1)return;if(b.layers.test(P.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&L===xs)&&(!b.frustumCulled||b.intersectsFrustum(n))){b.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,b.matrixWorld);let k=e.update(b),C=b.material;if(Array.isArray(C)){let G=k.groups;for(let X=0,$=G.length;X<$;X++){let ie=G[X],Z=C[ie.materialIndex];if(Z&&Z.visible){let Q=U(b,Z,M,L);b.onBeforeShadow(i,b,P,x,k,Q,ie),i.renderBufferDirect(x,null,k,Q,b,ie),b.onAfterShadow(i,b,P,x,k,Q,ie)}}}else if(C.visible){let G=U(b,C,M,L);b.onBeforeShadow(i,b,P,x,k,G,null),i.renderBufferDirect(x,null,k,G,b,null),b.onAfterShadow(i,b,P,x,k,G,null)}}let z=b.children;for(let k=0,C=z.length;k<C;k++)y(z[k],P,x,M,L)}function w(b){b.target.removeEventListener("dispose",w);for(let x in l){let M=l[x],L=b.target.uuid;L in M&&(M[L].dispose(),delete M[L])}}}function d0(i,e){function t(){let N=!1,fe=new pt,te=null,pe=new pt(0,0,0,0);return{setMask:function(ve){te!==ve&&!N&&(i.colorMask(ve,ve,ve,ve),te=ve)},setLocked:function(ve){N=ve},setClear:function(ve,re,Ie,Ae,rt){rt===!0&&(ve*=Ae,re*=Ae,Ie*=Ae),fe.set(ve,re,Ie,Ae),pe.equals(fe)===!1&&(i.clearColor(ve,re,Ie,Ae),pe.copy(fe))},reset:function(){N=!1,te=null,pe.set(-1,0,0,0)}}}function n(){let N=!1,fe=!1,te=null,pe=null,ve=null;return{setReversed:function(re){if(fe!==re){let Ie=e.get("EXT_clip_control");re?Ie.clipControlEXT(Ie.LOWER_LEFT_EXT,Ie.ZERO_TO_ONE_EXT):Ie.clipControlEXT(Ie.LOWER_LEFT_EXT,Ie.NEGATIVE_ONE_TO_ONE_EXT),fe=re;let Ae=ve;ve=null,this.setClear(Ae)}},getReversed:function(){return fe},setTest:function(re){re?ee(i.DEPTH_TEST):Se(i.DEPTH_TEST)},setMask:function(re){te!==re&&!N&&(i.depthMask(re),te=re)},setFunc:function(re){if(fe&&(re=Ph[re]),pe!==re){switch(re){case qr:i.depthFunc(i.NEVER);break;case Yr:i.depthFunc(i.ALWAYS);break;case Zr:i.depthFunc(i.LESS);break;case ss:i.depthFunc(i.LEQUAL);break;case $r:i.depthFunc(i.EQUAL);break;case Jr:i.depthFunc(i.GEQUAL);break;case Kr:i.depthFunc(i.GREATER);break;case jr:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}pe=re}},setLocked:function(re){N=re},setClear:function(re){ve!==re&&(ve=re,fe&&(re=1-re),i.clearDepth(re))},reset:function(){N=!1,te=null,pe=null,ve=null,fe=!1}}}function s(){let N=!1,fe=null,te=null,pe=null,ve=null,re=null,Ie=null,Ae=null,rt=null;return{setTest:function(et){N||(et?ee(i.STENCIL_TEST):Se(i.STENCIL_TEST))},setMask:function(et){fe!==et&&!N&&(i.stencilMask(et),fe=et)},setFunc:function(et,en,on){(te!==et||pe!==en||ve!==on)&&(i.stencilFunc(et,en,on),te=et,pe=en,ve=on)},setOp:function(et,en,on){(re!==et||Ie!==en||Ae!==on)&&(i.stencilOp(et,en,on),re=et,Ie=en,Ae=on)},setLocked:function(et){N=et},setClear:function(et){rt!==et&&(i.clearStencil(et),rt=et)},reset:function(){N=!1,fe=null,te=null,pe=null,ve=null,re=null,Ie=null,Ae=null,rt=null}}}let a=new t,r=new n,o=new s,c=new WeakMap,l=new WeakMap,h={},f={},u={},d=new WeakMap,v=[],S=null,m=!1,p=null,T=null,U=null,y=null,w=null,b=null,P=null,x=new Ge(0,0,0),M=0,L=!1,I=null,z=null,k=null,C=null,G=null,X=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),$=!1,ie=0,Z=i.getParameter(i.VERSION);Z.indexOf("WebGL")!==-1?(ie=parseFloat(/^WebGL (\d)/.exec(Z)[1]),$=ie>=1):Z.indexOf("OpenGL ES")!==-1&&(ie=parseFloat(/^OpenGL ES (\d)/.exec(Z)[1]),$=ie>=2);let Q=null,se={},le=i.getParameter(i.SCISSOR_BOX),Me=i.getParameter(i.VIEWPORT),Ue=new pt().fromArray(le),xe=new pt().fromArray(Me);function Ke(N,fe,te,pe){let ve=new Uint8Array(4),re=i.createTexture();i.bindTexture(N,re),i.texParameteri(N,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(N,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ie=0;Ie<te;Ie++)N===i.TEXTURE_3D||N===i.TEXTURE_2D_ARRAY?i.texImage3D(fe,0,i.RGBA,1,1,pe,0,i.RGBA,i.UNSIGNED_BYTE,ve):i.texImage2D(fe+Ie,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ve);return re}let K={};K[i.TEXTURE_2D]=Ke(i.TEXTURE_2D,i.TEXTURE_2D,1),K[i.TEXTURE_CUBE_MAP]=Ke(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),K[i.TEXTURE_2D_ARRAY]=Ke(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),K[i.TEXTURE_3D]=Ke(i.TEXTURE_3D,i.TEXTURE_3D,1,1),a.setClear(0,0,0,1),r.setClear(1),o.setClear(0),ee(i.DEPTH_TEST),r.setFunc(ss),Xe(!1),ot(xl),ee(i.CULL_FACE),je(An);function ee(N){h[N]!==!0&&(i.enable(N),h[N]=!0)}function Se(N){h[N]!==!1&&(i.disable(N),h[N]=!1)}function Le(N,fe){return u[N]!==fe?(i.bindFramebuffer(N,fe),u[N]=fe,N===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=fe),N===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=fe),!0):!1}function ye(N,fe){let te=v,pe=!1;if(N){te=d.get(fe),te===void 0&&(te=[],d.set(fe,te));let ve=N.textures;if(te.length!==ve.length||te[0]!==i.COLOR_ATTACHMENT0){for(let re=0,Ie=ve.length;re<Ie;re++)te[re]=i.COLOR_ATTACHMENT0+re;te.length=ve.length,pe=!0}}else te[0]!==i.BACK&&(te[0]=i.BACK,pe=!0);pe&&i.drawBuffers(te)}function ke(N){return S!==N?(i.useProgram(N),S=N,!0):!1}let vt={[Ci]:i.FUNC_ADD,[jc]:i.FUNC_SUBTRACT,[Qc]:i.FUNC_REVERSE_SUBTRACT};vt[eh]=i.MIN,vt[th]=i.MAX;let Be={[nh]:i.ZERO,[ih]:i.ONE,[sh]:i.SRC_COLOR,[Ml]:i.SRC_ALPHA,[hh]:i.SRC_ALPHA_SATURATE,[lh]:i.DST_COLOR,[ah]:i.DST_ALPHA,[rh]:i.ONE_MINUS_SRC_COLOR,[bl]:i.ONE_MINUS_SRC_ALPHA,[ch]:i.ONE_MINUS_DST_COLOR,[oh]:i.ONE_MINUS_DST_ALPHA,[uh]:i.CONSTANT_COLOR,[dh]:i.ONE_MINUS_CONSTANT_COLOR,[fh]:i.CONSTANT_ALPHA,[ph]:i.ONE_MINUS_CONSTANT_ALPHA};function je(N,fe,te,pe,ve,re,Ie,Ae,rt,et){if(N===An){m===!0&&(Se(i.BLEND),m=!1);return}if(m===!1&&(ee(i.BLEND),m=!0),N!==Kc){if(N!==p||et!==L){if((T!==Ci||w!==Ci)&&(i.blendEquation(i.FUNC_ADD),T=Ci,w=Ci),et)switch(N){case vs:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case vl:i.blendFunc(i.ONE,i.ONE);break;case yl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Sl:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Fe("WebGLState: Invalid blending: ",N);break}else switch(N){case vs:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case vl:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case yl:Fe("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Sl:Fe("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Fe("WebGLState: Invalid blending: ",N);break}U=null,y=null,b=null,P=null,x.set(0,0,0),M=0,p=N,L=et}return}ve=ve||fe,re=re||te,Ie=Ie||pe,(fe!==T||ve!==w)&&(i.blendEquationSeparate(vt[fe],vt[ve]),T=fe,w=ve),(te!==U||pe!==y||re!==b||Ie!==P)&&(i.blendFuncSeparate(Be[te],Be[pe],Be[re],Be[Ie]),U=te,y=pe,b=re,P=Ie),(Ae.equals(x)===!1||rt!==M)&&(i.blendColor(Ae.r,Ae.g,Ae.b,rt),x.copy(Ae),M=rt),p=N,L=!1}function tt(N,fe){N.side===Tt?Se(i.CULL_FACE):ee(i.CULL_FACE);let te=N.side===Xt;fe&&(te=!te),Xe(te),N.blending===vs&&N.transparent===!1?je(An):je(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),r.setFunc(N.depthFunc),r.setTest(N.depthTest),r.setMask(N.depthWrite),a.setMask(N.colorWrite);let pe=N.stencilWrite;o.setTest(pe),pe&&(o.setMask(N.stencilWriteMask),o.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),o.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),St(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?ee(i.SAMPLE_ALPHA_TO_COVERAGE):Se(i.SAMPLE_ALPHA_TO_COVERAGE)}function Xe(N){I!==N&&(N?i.frontFace(i.CW):i.frontFace(i.CCW),I=N)}function ot(N){N!==$c?(ee(i.CULL_FACE),N!==z&&(N===xl?i.cullFace(i.BACK):N===Jc?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Se(i.CULL_FACE),z=N}function gt(N){N!==k&&($&&i.lineWidth(N),k=N)}function St(N,fe,te){N?(ee(i.POLYGON_OFFSET_FILL),(C!==fe||G!==te)&&(C=fe,G=te,r.getReversed()&&(fe=-fe),i.polygonOffset(fe,te))):Se(i.POLYGON_OFFSET_FILL)}function st(N){N?ee(i.SCISSOR_TEST):Se(i.SCISSOR_TEST)}function _t(N){N===void 0&&(N=i.TEXTURE0+X-1),Q!==N&&(i.activeTexture(N),Q=N)}function F(N,fe,te){te===void 0&&(Q===null?te=i.TEXTURE0+X-1:te=Q);let pe=se[te];pe===void 0&&(pe={type:void 0,texture:void 0},se[te]=pe),(pe.type!==N||pe.texture!==fe)&&(Q!==te&&(i.activeTexture(te),Q=te),i.bindTexture(N,fe||K[N]),pe.type=N,pe.texture=fe)}function Ye(){let N=se[Q];N!==void 0&&N.type!==void 0&&(i.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function Ve(){try{i.compressedTexImage2D(...arguments)}catch(N){Fe("WebGLState:",N)}}function E(){try{i.compressedTexImage3D(...arguments)}catch(N){Fe("WebGLState:",N)}}function _(){try{i.texSubImage2D(...arguments)}catch(N){Fe("WebGLState:",N)}}function V(){try{i.texSubImage3D(...arguments)}catch(N){Fe("WebGLState:",N)}}function H(){try{i.compressedTexSubImage2D(...arguments)}catch(N){Fe("WebGLState:",N)}}function J(){try{i.compressedTexSubImage3D(...arguments)}catch(N){Fe("WebGLState:",N)}}function oe(){try{i.texStorage2D(...arguments)}catch(N){Fe("WebGLState:",N)}}function ue(){try{i.texStorage3D(...arguments)}catch(N){Fe("WebGLState:",N)}}function j(){try{i.texImage2D(...arguments)}catch(N){Fe("WebGLState:",N)}}function ne(){try{i.texImage3D(...arguments)}catch(N){Fe("WebGLState:",N)}}function ce(N){return f[N]!==void 0?f[N]:i.getParameter(N)}function we(N,fe){f[N]!==fe&&(i.pixelStorei(N,fe),f[N]=fe)}function me(N){Ue.equals(N)===!1&&(i.scissor(N.x,N.y,N.z,N.w),Ue.copy(N))}function de(N){xe.equals(N)===!1&&(i.viewport(N.x,N.y,N.z,N.w),xe.copy(N))}function Ce(N,fe){let te=l.get(fe);te===void 0&&(te=new WeakMap,l.set(fe,te));let pe=te.get(N);pe===void 0&&(pe=i.getUniformBlockIndex(fe,N.name),te.set(N,pe))}function Pe(N,fe){let pe=l.get(fe).get(N);c.get(fe)!==pe&&(i.uniformBlockBinding(fe,pe,N.__bindingPointIndex),c.set(fe,pe))}function ze(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),r.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},f={},Q=null,se={},u={},d=new WeakMap,v=[],S=null,m=!1,p=null,T=null,U=null,y=null,w=null,b=null,P=null,x=new Ge(0,0,0),M=0,L=!1,I=null,z=null,k=null,C=null,G=null,Ue.set(0,0,i.canvas.width,i.canvas.height),xe.set(0,0,i.canvas.width,i.canvas.height),a.reset(),r.reset(),o.reset()}return{buffers:{color:a,depth:r,stencil:o},enable:ee,disable:Se,bindFramebuffer:Le,drawBuffers:ye,useProgram:ke,setBlending:je,setMaterial:tt,setFlipSided:Xe,setCullFace:ot,setLineWidth:gt,setPolygonOffset:St,setScissorTest:st,activeTexture:_t,bindTexture:F,unbindTexture:Ye,compressedTexImage2D:Ve,compressedTexImage3D:E,texImage2D:j,texImage3D:ne,pixelStorei:we,getParameter:ce,updateUBOMapping:Ce,uniformBlockBinding:Pe,texStorage2D:oe,texStorage3D:ue,texSubImage2D:_,texSubImage3D:V,compressedTexSubImage2D:H,compressedTexSubImage3D:J,scissor:me,viewport:de,reset:ze}}function f0(i,e,t,n,s,a,r){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Je,h=new WeakMap,f=new Set,u,d=new WeakMap,v=!1;try{v=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function S(E,_){return v?new OffscreenCanvas(E,_):os("canvas")}function m(E,_,V){let H=1,J=Ve(E);if((J.width>V||J.height>V)&&(H=V/Math.max(J.width,J.height)),H<1)if(typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&E instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&E instanceof ImageBitmap||typeof VideoFrame<"u"&&E instanceof VideoFrame){let oe=Math.floor(H*J.width),ue=Math.floor(H*J.height);u===void 0&&(u=S(oe,ue));let j=_?S(oe,ue):u;return j.width=oe,j.height=ue,j.getContext("2d").drawImage(E,0,0,oe,ue),De("WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+oe+"x"+ue+")."),j}else return"data"in E&&De("WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),E;return E}function p(E){return E.generateMipmaps}function T(E){i.generateMipmap(E)}function U(E){return E.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:E.isWebGL3DRenderTarget?i.TEXTURE_3D:E.isWebGLArrayRenderTarget||E.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function y(E,_,V,H,J,oe=!1){if(E!==null){if(i[E]!==void 0)return i[E];De("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+E+"'")}let ue;H&&(ue=e.get("EXT_texture_norm16"),ue||De("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let j=_;if(_===i.RED&&(V===i.FLOAT&&(j=i.R32F),V===i.HALF_FLOAT&&(j=i.R16F),V===i.UNSIGNED_BYTE&&(j=i.R8),V===i.UNSIGNED_SHORT&&ue&&(j=ue.R16_EXT),V===i.SHORT&&ue&&(j=ue.R16_SNORM_EXT)),_===i.RED_INTEGER&&(V===i.UNSIGNED_BYTE&&(j=i.R8UI),V===i.UNSIGNED_SHORT&&(j=i.R16UI),V===i.UNSIGNED_INT&&(j=i.R32UI),V===i.BYTE&&(j=i.R8I),V===i.SHORT&&(j=i.R16I),V===i.INT&&(j=i.R32I)),_===i.RG&&(V===i.FLOAT&&(j=i.RG32F),V===i.HALF_FLOAT&&(j=i.RG16F),V===i.UNSIGNED_BYTE&&(j=i.RG8),V===i.UNSIGNED_SHORT&&ue&&(j=ue.RG16_EXT),V===i.SHORT&&ue&&(j=ue.RG16_SNORM_EXT)),_===i.RG_INTEGER&&(V===i.UNSIGNED_BYTE&&(j=i.RG8UI),V===i.UNSIGNED_SHORT&&(j=i.RG16UI),V===i.UNSIGNED_INT&&(j=i.RG32UI),V===i.BYTE&&(j=i.RG8I),V===i.SHORT&&(j=i.RG16I),V===i.INT&&(j=i.RG32I)),_===i.RGB_INTEGER&&(V===i.UNSIGNED_BYTE&&(j=i.RGB8UI),V===i.UNSIGNED_SHORT&&(j=i.RGB16UI),V===i.UNSIGNED_INT&&(j=i.RGB32UI),V===i.BYTE&&(j=i.RGB8I),V===i.SHORT&&(j=i.RGB16I),V===i.INT&&(j=i.RGB32I)),_===i.RGBA_INTEGER&&(V===i.UNSIGNED_BYTE&&(j=i.RGBA8UI),V===i.UNSIGNED_SHORT&&(j=i.RGBA16UI),V===i.UNSIGNED_INT&&(j=i.RGBA32UI),V===i.BYTE&&(j=i.RGBA8I),V===i.SHORT&&(j=i.RGBA16I),V===i.INT&&(j=i.RGBA32I)),_===i.RGB&&(V===i.UNSIGNED_SHORT&&ue&&(j=ue.RGB16_EXT),V===i.SHORT&&ue&&(j=ue.RGB16_SNORM_EXT),V===i.UNSIGNED_INT_5_9_9_9_REV&&(j=i.RGB9_E5),V===i.UNSIGNED_INT_10F_11F_11F_REV&&(j=i.R11F_G11F_B10F)),_===i.RGBA){let ne=oe?Hs:$e.getTransfer(J);V===i.FLOAT&&(j=i.RGBA32F),V===i.HALF_FLOAT&&(j=i.RGBA16F),V===i.UNSIGNED_BYTE&&(j=ne===it?i.SRGB8_ALPHA8:i.RGBA8),V===i.UNSIGNED_SHORT&&ue&&(j=ue.RGBA16_EXT),V===i.SHORT&&ue&&(j=ue.RGBA16_SNORM_EXT),V===i.UNSIGNED_SHORT_4_4_4_4&&(j=i.RGBA4),V===i.UNSIGNED_SHORT_5_5_5_1&&(j=i.RGB5_A1)}return(j===i.R16F||j===i.R32F||j===i.RG16F||j===i.RG32F||j===i.RGBA16F||j===i.RGBA32F)&&e.get("EXT_color_buffer_float"),j}function w(E,_){let V;return E?_===null||_===yn||_===Ss?V=i.DEPTH24_STENCIL8:_===jt?V=i.DEPTH32F_STENCIL8:_===ys&&(V=i.DEPTH24_STENCIL8,De("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===yn||_===Ss?V=i.DEPTH_COMPONENT24:_===jt?V=i.DEPTH_COMPONENT32F:_===ys&&(V=i.DEPTH_COMPONENT16),V}function b(E,_){return p(E)===!0||E.isFramebufferTexture&&E.minFilter!==Ct&&E.minFilter!==ft?Math.log2(Math.max(_.width,_.height))+1:E.mipmaps!==void 0&&E.mipmaps.length>0?E.mipmaps.length:E.isCompressedTexture&&Array.isArray(E.image)?_.mipmaps.length:1}function P(E){let _=E.target;_.removeEventListener("dispose",P),M(_),_.isVideoTexture&&h.delete(_),_.isHTMLTexture&&f.delete(_)}function x(E){let _=E.target;_.removeEventListener("dispose",x),I(_)}function M(E){let _=n.get(E);if(_.__webglInit===void 0)return;let V=E.source,H=d.get(V);if(H){let J=H[_.__cacheKey];J.usedTimes--,J.usedTimes===0&&L(E),Object.keys(H).length===0&&d.delete(V)}n.remove(E)}function L(E){let _=n.get(E);i.deleteTexture(_.__webglTexture);let V=E.source,H=d.get(V);delete H[_.__cacheKey],r.memory.textures--}function I(E){let _=n.get(E);if(E.depthTexture&&(E.depthTexture.dispose(),n.remove(E.depthTexture)),E.isWebGLCubeRenderTarget)for(let H=0;H<6;H++){if(Array.isArray(_.__webglFramebuffer[H]))for(let J=0;J<_.__webglFramebuffer[H].length;J++)i.deleteFramebuffer(_.__webglFramebuffer[H][J]);else i.deleteFramebuffer(_.__webglFramebuffer[H]);_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer[H])}else{if(Array.isArray(_.__webglFramebuffer))for(let H=0;H<_.__webglFramebuffer.length;H++)i.deleteFramebuffer(_.__webglFramebuffer[H]);else i.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&i.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let H=0;H<_.__webglColorRenderbuffer.length;H++)_.__webglColorRenderbuffer[H]&&i.deleteRenderbuffer(_.__webglColorRenderbuffer[H]);_.__webglDepthRenderbuffer&&i.deleteRenderbuffer(_.__webglDepthRenderbuffer)}let V=E.textures;for(let H=0,J=V.length;H<J;H++){let oe=n.get(V[H]);oe.__webglTexture&&(i.deleteTexture(oe.__webglTexture),r.memory.textures--),n.remove(V[H])}n.remove(E)}let z=0;function k(){z=0}function C(){return z}function G(E){z=E}function X(){let E=z;return E>=s.maxTextures&&De("WebGLTextures: Trying to use "+(E+1)+" texture units while this GPU supports only "+s.maxTextures),z+=1,E}function $(E){let _=[];return _.push(E.wrapS),_.push(E.wrapT),_.push(E.wrapR||0),_.push(E.magFilter),_.push(E.minFilter),_.push(E.anisotropy),_.push(E.internalFormat),_.push(E.format),_.push(E.type),_.push(E.generateMipmaps),_.push(E.premultiplyAlpha),_.push(E.flipY),_.push(E.unpackAlignment),_.push(E.colorSpace),_.join()}function ie(E,_){let V=n.get(E);if(E.isVideoTexture&&F(E),E.isRenderTargetTexture===!1&&E.isExternalTexture!==!0&&E.version>0&&V.__version!==E.version){let H=E.image;if(H===null)De("WebGLRenderer: Texture marked for update but no image data found.");else if(H.complete===!1)De("WebGLRenderer: Texture marked for update but image is incomplete");else{Se(V,E,_);return}}else E.isExternalTexture&&(V.__webglTexture=E.sourceTexture?E.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,V.__webglTexture,i.TEXTURE0+_)}function Z(E,_){let V=n.get(E);if(E.isRenderTargetTexture===!1&&E.version>0&&V.__version!==E.version){Se(V,E,_);return}else E.isExternalTexture&&(V.__webglTexture=E.sourceTexture?E.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,V.__webglTexture,i.TEXTURE0+_)}function Q(E,_){let V=n.get(E);if(E.isRenderTargetTexture===!1&&E.version>0&&V.__version!==E.version){Se(V,E,_);return}t.bindTexture(i.TEXTURE_3D,V.__webglTexture,i.TEXTURE0+_)}function se(E,_){let V=n.get(E);if(E.isCubeDepthTexture!==!0&&E.version>0&&V.__version!==E.version){Le(V,E,_);return}t.bindTexture(i.TEXTURE_CUBE_MAP,V.__webglTexture,i.TEXTURE0+_)}let le={[rs]:i.REPEAT,[$t]:i.CLAMP_TO_EDGE,[Qr]:i.MIRRORED_REPEAT},Me={[Ct]:i.NEAREST,[_h]:i.NEAREST_MIPMAP_NEAREST,[ar]:i.NEAREST_MIPMAP_LINEAR,[ft]:i.LINEAR,[Ea]:i.LINEAR_MIPMAP_NEAREST,[Xn]:i.LINEAR_MIPMAP_LINEAR},Ue={[Sh]:i.NEVER,[wh]:i.ALWAYS,[Mh]:i.LESS,[co]:i.LEQUAL,[bh]:i.EQUAL,[ho]:i.GEQUAL,[Th]:i.GREATER,[Eh]:i.NOTEQUAL};function xe(E,_){if(_.type===jt&&e.has("OES_texture_float_linear")===!1&&(_.magFilter===ft||_.magFilter===Ea||_.magFilter===ar||_.magFilter===Xn||_.minFilter===ft||_.minFilter===Ea||_.minFilter===ar||_.minFilter===Xn)&&De("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(E,i.TEXTURE_WRAP_S,le[_.wrapS]),i.texParameteri(E,i.TEXTURE_WRAP_T,le[_.wrapT]),(E===i.TEXTURE_3D||E===i.TEXTURE_2D_ARRAY)&&i.texParameteri(E,i.TEXTURE_WRAP_R,le[_.wrapR]),i.texParameteri(E,i.TEXTURE_MAG_FILTER,Me[_.magFilter]),i.texParameteri(E,i.TEXTURE_MIN_FILTER,Me[_.minFilter]),_.compareFunction&&(i.texParameteri(E,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(E,i.TEXTURE_COMPARE_FUNC,Ue[_.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===Ct||_.minFilter!==ar&&_.minFilter!==Xn||_.type===jt&&e.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){let V=e.get("EXT_texture_filter_anisotropic");i.texParameterf(E,V.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function Ke(E,_){let V=!1;E.__webglInit===void 0&&(E.__webglInit=!0,_.addEventListener("dispose",P));let H=_.source,J=d.get(H);J===void 0&&(J={},d.set(H,J));let oe=$(_);if(oe!==E.__cacheKey){J[oe]===void 0&&(J[oe]={texture:i.createTexture(),usedTimes:0},r.memory.textures++,V=!0),J[oe].usedTimes++;let ue=J[E.__cacheKey];ue!==void 0&&(J[E.__cacheKey].usedTimes--,ue.usedTimes===0&&L(_)),E.__cacheKey=oe,E.__webglTexture=J[oe].texture}return V}function K(E,_,V){return Math.floor(Math.floor(E/V)/_)}function ee(E,_,V,H){let oe=E.updateRanges;if(oe.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,_.width,_.height,V,H,_.data);else{oe.sort((we,me)=>we.start-me.start);let ue=0;for(let we=1;we<oe.length;we++){let me=oe[ue],de=oe[we],Ce=me.start+me.count,Pe=K(de.start,_.width,4),ze=K(me.start,_.width,4);de.start<=Ce+1&&Pe===ze&&K(de.start+de.count-1,_.width,4)===Pe?me.count=Math.max(me.count,de.start+de.count-me.start):(++ue,oe[ue]=de)}oe.length=ue+1;let j=t.getParameter(i.UNPACK_ROW_LENGTH),ne=t.getParameter(i.UNPACK_SKIP_PIXELS),ce=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,_.width);for(let we=0,me=oe.length;we<me;we++){let de=oe[we],Ce=Math.floor(de.start/4),Pe=Math.ceil(de.count/4),ze=Ce%_.width,N=Math.floor(Ce/_.width),fe=Pe,te=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,ze),t.pixelStorei(i.UNPACK_SKIP_ROWS,N),t.texSubImage2D(i.TEXTURE_2D,0,ze,N,fe,te,V,H,_.data)}E.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,j),t.pixelStorei(i.UNPACK_SKIP_PIXELS,ne),t.pixelStorei(i.UNPACK_SKIP_ROWS,ce)}}function Se(E,_,V){let H=i.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(H=i.TEXTURE_2D_ARRAY),_.isData3DTexture&&(H=i.TEXTURE_3D);let J=Ke(E,_),oe=_.source;t.bindTexture(H,E.__webglTexture,i.TEXTURE0+V);let ue=n.get(oe);if(oe.version!==ue.__version||J===!0){if(t.activeTexture(i.TEXTURE0+V),(typeof ImageBitmap<"u"&&_.image instanceof ImageBitmap)===!1){let te=$e.getPrimaries($e.workingColorSpace),pe=_.colorSpace===qn?null:$e.getPrimaries(_.colorSpace),ve=_.colorSpace===qn||te===pe?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ve)}t.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment);let ne=m(_.image,!1,s.maxTextureSize);ne=Ye(_,ne);let ce=a.convert(_.format,_.colorSpace),we=a.convert(_.type),me=y(_.internalFormat,ce,we,_.normalized,_.colorSpace,_.isVideoTexture);xe(H,_);let de,Ce=_.mipmaps,Pe=_.isVideoTexture!==!0,ze=ue.__version===void 0||J===!0,N=oe.dataReady,fe=b(_,ne);if(_.isDepthTexture)me=w(_.format===pi,_.type),ze&&(Pe?t.texStorage2D(i.TEXTURE_2D,1,me,ne.width,ne.height):t.texImage2D(i.TEXTURE_2D,0,me,ne.width,ne.height,0,ce,we,null));else if(_.isDataTexture)if(Ce.length>0){Pe&&ze&&t.texStorage2D(i.TEXTURE_2D,fe,me,Ce[0].width,Ce[0].height);for(let te=0,pe=Ce.length;te<pe;te++)de=Ce[te],Pe?N&&t.texSubImage2D(i.TEXTURE_2D,te,0,0,de.width,de.height,ce,we,de.data):t.texImage2D(i.TEXTURE_2D,te,me,de.width,de.height,0,ce,we,de.data);_.generateMipmaps=!1}else Pe?(ze&&t.texStorage2D(i.TEXTURE_2D,fe,me,ne.width,ne.height),N&&ee(_,ne,ce,we)):t.texImage2D(i.TEXTURE_2D,0,me,ne.width,ne.height,0,ce,we,ne.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){Pe&&ze&&t.texStorage3D(i.TEXTURE_2D_ARRAY,fe,me,Ce[0].width,Ce[0].height,ne.depth);for(let te=0,pe=Ce.length;te<pe;te++)if(de=Ce[te],_.format!==dn)if(ce!==null)if(Pe){if(N)if(_.layerUpdates.size>0){let ve=Yl(de.width,de.height,_.format,_.type);for(let re of _.layerUpdates){let Ie=de.data.subarray(re*ve/de.data.BYTES_PER_ELEMENT,(re+1)*ve/de.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,te,0,0,re,de.width,de.height,1,ce,Ie)}}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,te,0,0,0,de.width,de.height,ne.depth,ce,de.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,te,me,de.width,de.height,ne.depth,0,de.data,0,0);else De("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Pe?N&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,te,0,0,0,de.width,de.height,ne.depth,ce,we,de.data):t.texImage3D(i.TEXTURE_2D_ARRAY,te,me,de.width,de.height,ne.depth,0,ce,we,de.data);_.layerUpdates.size>0&&_.clearLayerUpdates()}else{Pe&&ze&&t.texStorage2D(i.TEXTURE_2D,fe,me,Ce[0].width,Ce[0].height);for(let te=0,pe=Ce.length;te<pe;te++)de=Ce[te],_.format!==dn?ce!==null?Pe?N&&t.compressedTexSubImage2D(i.TEXTURE_2D,te,0,0,de.width,de.height,ce,de.data):t.compressedTexImage2D(i.TEXTURE_2D,te,me,de.width,de.height,0,de.data):De("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Pe?N&&t.texSubImage2D(i.TEXTURE_2D,te,0,0,de.width,de.height,ce,we,de.data):t.texImage2D(i.TEXTURE_2D,te,me,de.width,de.height,0,ce,we,de.data)}else if(_.isDataArrayTexture)if(Pe){if(ze&&t.texStorage3D(i.TEXTURE_2D_ARRAY,fe,me,ne.width,ne.height,ne.depth),N)if(_.layerUpdates.size>0){let te=Yl(ne.width,ne.height,_.format,_.type);for(let pe of _.layerUpdates){let ve=ne.data.subarray(pe*te/ne.data.BYTES_PER_ELEMENT,(pe+1)*te/ne.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,pe,ne.width,ne.height,1,ce,we,ve)}_.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ne.width,ne.height,ne.depth,ce,we,ne.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,me,ne.width,ne.height,ne.depth,0,ce,we,ne.data);else if(_.isData3DTexture)Pe?(ze&&t.texStorage3D(i.TEXTURE_3D,fe,me,ne.width,ne.height,ne.depth),N&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ne.width,ne.height,ne.depth,ce,we,ne.data)):t.texImage3D(i.TEXTURE_3D,0,me,ne.width,ne.height,ne.depth,0,ce,we,ne.data);else if(_.isFramebufferTexture){if(ze)if(Pe)t.texStorage2D(i.TEXTURE_2D,fe,me,ne.width,ne.height);else{let te=ne.width,pe=ne.height;for(let ve=0;ve<fe;ve++)t.texImage2D(i.TEXTURE_2D,ve,me,te,pe,0,ce,we,null),te>>=1,pe>>=1}}else if(_.isHTMLTexture){if("texElementImage2D"in i){let te=i.canvas;if(te.hasAttribute("layoutsubtree")||te.setAttribute("layoutsubtree","true"),ne.parentNode!==te){te.appendChild(ne),f.add(_),te.onpaint=pe=>{let ve=pe.changedElements;for(let re of f)ve.includes(re.image)&&(re.needsUpdate=!0)},te.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,ne);else{let ve=i.RGBA,re=i.RGBA,Ie=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,ve,re,Ie,ne)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(Ce.length>0){if(Pe&&ze){let te=Ve(Ce[0]);t.texStorage2D(i.TEXTURE_2D,fe,me,te.width,te.height)}for(let te=0,pe=Ce.length;te<pe;te++)de=Ce[te],Pe?N&&t.texSubImage2D(i.TEXTURE_2D,te,0,0,ce,we,de):t.texImage2D(i.TEXTURE_2D,te,me,ce,we,de);_.generateMipmaps=!1}else if(Pe){if(ze){let te=Ve(ne);t.texStorage2D(i.TEXTURE_2D,fe,me,te.width,te.height)}N&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ce,we,ne)}else t.texImage2D(i.TEXTURE_2D,0,me,ce,we,ne);p(_)&&T(H),ue.__version=oe.version,_.onUpdate&&_.onUpdate(_)}E.__version=_.version}function Le(E,_,V){if(_.image.length!==6)return;let H=Ke(E,_),J=_.source;t.bindTexture(i.TEXTURE_CUBE_MAP,E.__webglTexture,i.TEXTURE0+V);let oe=n.get(J);if(J.version!==oe.__version||H===!0){t.activeTexture(i.TEXTURE0+V);let ue=$e.getPrimaries($e.workingColorSpace),j=_.colorSpace===qn?null:$e.getPrimaries(_.colorSpace),ne=_.colorSpace===qn||ue===j?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ne);let ce=_.isCompressedTexture||_.image[0].isCompressedTexture,we=_.image[0]&&_.image[0].isDataTexture,me=[];for(let re=0;re<6;re++)!ce&&!we?me[re]=m(_.image[re],!0,s.maxCubemapSize):me[re]=we?_.image[re].image:_.image[re],me[re]=Ye(_,me[re]);let de=me[0],Ce=a.convert(_.format,_.colorSpace),Pe=a.convert(_.type),ze=y(_.internalFormat,Ce,Pe,_.normalized,_.colorSpace),N=_.isVideoTexture!==!0,fe=oe.__version===void 0||H===!0,te=J.dataReady,pe=b(_,de);xe(i.TEXTURE_CUBE_MAP,_);let ve;if(ce){N&&fe&&t.texStorage2D(i.TEXTURE_CUBE_MAP,pe,ze,de.width,de.height);for(let re=0;re<6;re++){ve=me[re].mipmaps;for(let Ie=0;Ie<ve.length;Ie++){let Ae=ve[Ie];_.format!==dn?Ce!==null?N?te&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Ie,0,0,Ae.width,Ae.height,Ce,Ae.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Ie,ze,Ae.width,Ae.height,0,Ae.data):De("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):N?te&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Ie,0,0,Ae.width,Ae.height,Ce,Pe,Ae.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Ie,ze,Ae.width,Ae.height,0,Ce,Pe,Ae.data)}}}else{if(ve=_.mipmaps,N&&fe){ve.length>0&&pe++;let re=Ve(me[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,pe,ze,re.width,re.height)}for(let re=0;re<6;re++)if(we){N?te&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,me[re].width,me[re].height,Ce,Pe,me[re].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,ze,me[re].width,me[re].height,0,Ce,Pe,me[re].data);for(let Ie=0;Ie<ve.length;Ie++){let rt=ve[Ie].image[re].image;N?te&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Ie+1,0,0,rt.width,rt.height,Ce,Pe,rt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Ie+1,ze,rt.width,rt.height,0,Ce,Pe,rt.data)}}else{N?te&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,Ce,Pe,me[re]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,ze,Ce,Pe,me[re]);for(let Ie=0;Ie<ve.length;Ie++){let Ae=ve[Ie];N?te&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Ie+1,0,0,Ce,Pe,Ae.image[re]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Ie+1,ze,Ce,Pe,Ae.image[re])}}}p(_)&&T(i.TEXTURE_CUBE_MAP),oe.__version=J.version,_.onUpdate&&_.onUpdate(_)}E.__version=_.version}function ye(E,_,V,H,J,oe){let ue=a.convert(V.format,V.colorSpace),j=a.convert(V.type),ne=y(V.internalFormat,ue,j,V.normalized,V.colorSpace),ce=n.get(_),we=n.get(V);if(we.__renderTarget=_,!ce.__hasExternalTextures){let me=Math.max(1,_.width>>oe),de=Math.max(1,_.height>>oe);J===i.TEXTURE_3D||J===i.TEXTURE_2D_ARRAY?t.texImage3D(J,oe,ne,me,de,_.depth,0,ue,j,null):t.texImage2D(J,oe,ne,me,de,0,ue,j,null)}t.bindFramebuffer(i.FRAMEBUFFER,E),_t(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,H,J,we.__webglTexture,0,st(_)):(J===i.TEXTURE_2D||J>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,H,J,we.__webglTexture,oe),t.bindFramebuffer(i.FRAMEBUFFER,null)}function ke(E,_,V){if(i.bindRenderbuffer(i.RENDERBUFFER,E),_.depthBuffer){let H=_.depthTexture,J=H&&H.isDepthTexture?H.type:null,oe=w(_.stencilBuffer,J),ue=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;_t(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,st(_),oe,_.width,_.height):V?i.renderbufferStorageMultisample(i.RENDERBUFFER,st(_),oe,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,oe,_.width,_.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,ue,i.RENDERBUFFER,E)}else{let H=_.textures;for(let J=0;J<H.length;J++){let oe=H[J],ue=a.convert(oe.format,oe.colorSpace),j=a.convert(oe.type),ne=y(oe.internalFormat,ue,j,oe.normalized,oe.colorSpace);_t(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,st(_),ne,_.width,_.height):V?i.renderbufferStorageMultisample(i.RENDERBUFFER,st(_),ne,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,ne,_.width,_.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function vt(E,_,V){let H=_.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,E),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let J=n.get(_.depthTexture);if(J.__renderTarget=_,(!J.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),H){if(J.__webglInit===void 0&&(J.__webglInit=!0,_.depthTexture.addEventListener("dispose",P)),J.__webglTexture===void 0){J.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,J.__webglTexture),xe(i.TEXTURE_CUBE_MAP,_.depthTexture);let ce=a.convert(_.depthTexture.format),we=a.convert(_.depthTexture.type),me;_.depthTexture.format===Tn?me=i.DEPTH_COMPONENT24:_.depthTexture.format===pi&&(me=i.DEPTH24_STENCIL8);for(let de=0;de<6;de++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+de,0,me,_.width,_.height,0,ce,we,null)}}else ie(_.depthTexture,0);let oe=J.__webglTexture,ue=st(_),j=H?i.TEXTURE_CUBE_MAP_POSITIVE_X+V:i.TEXTURE_2D,ne=_.depthTexture.format===pi?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(_.depthTexture.format===Tn)_t(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ne,j,oe,0,ue):i.framebufferTexture2D(i.FRAMEBUFFER,ne,j,oe,0);else if(_.depthTexture.format===pi)_t(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ne,j,oe,0,ue):i.framebufferTexture2D(i.FRAMEBUFFER,ne,j,oe,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Be(E){let _=n.get(E),V=E.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==E.depthTexture){let H=E.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),H){let J=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,H.removeEventListener("dispose",J)};H.addEventListener("dispose",J),_.__depthDisposeCallback=J}_.__boundDepthTexture=H}if(E.depthTexture&&!_.__autoAllocateDepthBuffer)if(V)for(let H=0;H<6;H++)vt(_.__webglFramebuffer[H],E,H);else{let H=E.texture.mipmaps;H&&H.length>0?vt(_.__webglFramebuffer[0],E,0):vt(_.__webglFramebuffer,E,0)}else if(V){_.__webglDepthbuffer=[];for(let H=0;H<6;H++)if(t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[H]),_.__webglDepthbuffer[H]===void 0)_.__webglDepthbuffer[H]=i.createRenderbuffer(),ke(_.__webglDepthbuffer[H],E,!1);else{let J=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,oe=_.__webglDepthbuffer[H];i.bindRenderbuffer(i.RENDERBUFFER,oe),i.framebufferRenderbuffer(i.FRAMEBUFFER,J,i.RENDERBUFFER,oe)}}else{let H=E.texture.mipmaps;if(H&&H.length>0?t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=i.createRenderbuffer(),ke(_.__webglDepthbuffer,E,!1);else{let J=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,oe=_.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,oe),i.framebufferRenderbuffer(i.FRAMEBUFFER,J,i.RENDERBUFFER,oe)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function je(E,_,V){let H=n.get(E);_!==void 0&&ye(H.__webglFramebuffer,E,E.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),V!==void 0&&Be(E)}function tt(E){let _=E.texture,V=n.get(E),H=n.get(_);E.addEventListener("dispose",x);let J=E.textures,oe=E.isWebGLCubeRenderTarget===!0,ue=J.length>1;if(ue||(H.__webglTexture===void 0&&(H.__webglTexture=i.createTexture()),H.__version=_.version,r.memory.textures++),oe){V.__webglFramebuffer=[];for(let j=0;j<6;j++)if(_.mipmaps&&_.mipmaps.length>0){V.__webglFramebuffer[j]=[];for(let ne=0;ne<_.mipmaps.length;ne++)V.__webglFramebuffer[j][ne]=i.createFramebuffer()}else V.__webglFramebuffer[j]=i.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){V.__webglFramebuffer=[];for(let j=0;j<_.mipmaps.length;j++)V.__webglFramebuffer[j]=i.createFramebuffer()}else V.__webglFramebuffer=i.createFramebuffer();if(ue)for(let j=0,ne=J.length;j<ne;j++){let ce=n.get(J[j]);ce.__webglTexture===void 0&&(ce.__webglTexture=i.createTexture(),r.memory.textures++)}if(E.samples>0&&_t(E)===!1){V.__webglMultisampledFramebuffer=i.createFramebuffer(),V.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,V.__webglMultisampledFramebuffer);for(let j=0;j<J.length;j++){let ne=J[j];V.__webglColorRenderbuffer[j]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,V.__webglColorRenderbuffer[j]);let ce=a.convert(ne.format,ne.colorSpace),we=a.convert(ne.type),me=y(ne.internalFormat,ce,we,ne.normalized,ne.colorSpace,E.isXRRenderTarget===!0),de=st(E);i.renderbufferStorageMultisample(i.RENDERBUFFER,de,me,E.width,E.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+j,i.RENDERBUFFER,V.__webglColorRenderbuffer[j])}i.bindRenderbuffer(i.RENDERBUFFER,null),E.depthBuffer&&(V.__webglDepthRenderbuffer=i.createRenderbuffer(),ke(V.__webglDepthRenderbuffer,E,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(oe){t.bindTexture(i.TEXTURE_CUBE_MAP,H.__webglTexture),xe(i.TEXTURE_CUBE_MAP,_);for(let j=0;j<6;j++)if(_.mipmaps&&_.mipmaps.length>0)for(let ne=0;ne<_.mipmaps.length;ne++)ye(V.__webglFramebuffer[j][ne],E,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+j,ne);else ye(V.__webglFramebuffer[j],E,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0);p(_)&&T(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ue){for(let j=0,ne=J.length;j<ne;j++){let ce=J[j],we=n.get(ce),me=i.TEXTURE_2D;(E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(me=E.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(me,we.__webglTexture),xe(me,ce),ye(V.__webglFramebuffer,E,ce,i.COLOR_ATTACHMENT0+j,me,0),p(ce)&&T(me)}t.unbindTexture()}else{let j=i.TEXTURE_2D;if((E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(j=E.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(j,H.__webglTexture),xe(j,_),_.mipmaps&&_.mipmaps.length>0)for(let ne=0;ne<_.mipmaps.length;ne++)ye(V.__webglFramebuffer[ne],E,_,i.COLOR_ATTACHMENT0,j,ne);else ye(V.__webglFramebuffer,E,_,i.COLOR_ATTACHMENT0,j,0);p(_)&&T(j),t.unbindTexture()}E.depthBuffer&&Be(E)}function Xe(E){let _=E.textures;for(let V=0,H=_.length;V<H;V++){let J=_[V];if(p(J)){let oe=U(E),ue=n.get(J).__webglTexture;t.bindTexture(oe,ue),T(oe),t.unbindTexture()}}}let ot=[],gt=[];function St(E){if(E.samples>0){if(_t(E)===!1){let _=E.textures,V=E.width,H=E.height,J=i.COLOR_BUFFER_BIT,oe=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ue=n.get(E),j=_.length>1;if(j)for(let ce=0;ce<_.length;ce++)t.bindFramebuffer(i.FRAMEBUFFER,ue.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ce,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,ue.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ce,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,ue.__webglMultisampledFramebuffer);let ne=E.texture.mipmaps;ne&&ne.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ue.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ue.__webglFramebuffer);for(let ce=0;ce<_.length;ce++){if(E.resolveDepthBuffer&&(E.depthBuffer&&(J|=i.DEPTH_BUFFER_BIT),E.stencilBuffer&&E.resolveStencilBuffer&&(J|=i.STENCIL_BUFFER_BIT)),j){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,ue.__webglColorRenderbuffer[ce]);let we=n.get(_[ce]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,we,0)}i.blitFramebuffer(0,0,V,H,0,0,V,H,J,i.NEAREST),c===!0&&(ot.length=0,gt.length=0,ot.push(i.COLOR_ATTACHMENT0+ce),E.depthBuffer&&E.storeMultisampledDepthBuffer===!1&&(ot.push(oe),gt.push(oe),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,gt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ot))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),j)for(let ce=0;ce<_.length;ce++){t.bindFramebuffer(i.FRAMEBUFFER,ue.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ce,i.RENDERBUFFER,ue.__webglColorRenderbuffer[ce]);let we=n.get(_[ce]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,ue.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ce,i.TEXTURE_2D,we,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ue.__webglMultisampledFramebuffer)}else if(E.depthBuffer&&E.storeMultisampledDepthBuffer===!1&&c){let _=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[_])}}}function st(E){return Math.min(s.maxSamples,E.samples)}function _t(E){let _=n.get(E);return E.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function F(E){let _=r.render.frame;h.get(E)!==_&&(h.set(E,_),E.update())}function Ye(E,_){let V=E.colorSpace,H=E.format,J=E.type;return E.isCompressedTexture===!0||E.isVideoTexture===!0||V!==Ei&&V!==qn&&($e.getTransfer(V)===it?(H!==dn||J!==Kt)&&De("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Fe("WebGLTextures: Unsupported texture color space:",V)),_}function Ve(E){return typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement?(l.width=E.naturalWidth||E.width,l.height=E.naturalHeight||E.height):typeof VideoFrame<"u"&&E instanceof VideoFrame?(l.width=E.displayWidth,l.height=E.displayHeight):(l.width=E.width,l.height=E.height),l}this.allocateTextureUnit=X,this.resetTextureUnits=k,this.getTextureUnits=C,this.setTextureUnits=G,this.setTexture2D=ie,this.setTexture2DArray=Z,this.setTexture3D=Q,this.setTextureCube=se,this.rebindTextures=je,this.setupRenderTarget=tt,this.updateRenderTargetMipmap=Xe,this.updateMultisampleRenderTarget=St,this.setupDepthRenderbuffer=Be,this.setupFrameBufferTexture=ye,this.useMultisampledRTT=_t,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function p0(i,e){function t(n,s=qn){let a,r=$e.getTransfer(s);if(n===Kt)return i.UNSIGNED_BYTE;if(n===Aa)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Ra)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Ul)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Nl)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Ll)return i.BYTE;if(n===Dl)return i.SHORT;if(n===ys)return i.UNSIGNED_SHORT;if(n===wa)return i.INT;if(n===yn)return i.UNSIGNED_INT;if(n===jt)return i.FLOAT;if(n===qt)return i.HALF_FLOAT;if(n===Fl)return i.ALPHA;if(n===Ol)return i.RGB;if(n===dn)return i.RGBA;if(n===Tn)return i.DEPTH_COMPONENT;if(n===pi)return i.DEPTH_STENCIL;if(n===Bl)return i.RED;if(n===Ca)return i.RED_INTEGER;if(n===mi)return i.RG;if(n===Ia)return i.RG_INTEGER;if(n===Pa)return i.RGBA_INTEGER;if(n===or||n===lr||n===cr||n===hr)if(r===it)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(n===or)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===lr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===cr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===hr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(n===or)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===lr)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===cr)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===hr)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===La||n===Da||n===Ua||n===Na)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(n===La)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Da)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Ua)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Na)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Fa||n===Oa||n===Ba||n===za||n===ka||n===ur||n===Va)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(n===Fa||n===Oa)return r===it?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(n===Ba)return r===it?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC;if(n===za)return a.COMPRESSED_R11_EAC;if(n===ka)return a.COMPRESSED_SIGNED_R11_EAC;if(n===ur)return a.COMPRESSED_RG11_EAC;if(n===Va)return a.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Ga||n===Ha||n===Wa||n===Xa||n===qa||n===Ya||n===Za||n===$a||n===Ja||n===Ka||n===ja||n===Qa||n===eo||n===to)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(n===Ga)return r===it?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ha)return r===it?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Wa)return r===it?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Xa)return r===it?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===qa)return r===it?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ya)return r===it?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Za)return r===it?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===$a)return r===it?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ja)return r===it?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ka)return r===it?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===ja)return r===it?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Qa)return r===it?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===eo)return r===it?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===to)return r===it?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===no||n===io||n===so)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(n===no)return r===it?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===io)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===so)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===ro||n===ao||n===dr||n===oo)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(n===ro)return a.COMPRESSED_RED_RGTC1_EXT;if(n===ao)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===dr)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===oo)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Ss?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var m0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,g0=`
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

}`,oc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Js(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new sn({vertexShader:m0,fragmentShader:g0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new mt(new kt(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},lc=class extends En{constructor(e,t){super();let n=this,s=null,a=1,r=null,o="local-floor",c=1,l=null,h=null,f=null,u=null,d=null,v=null,S=typeof XRWebGLBinding<"u",m=new oc,p={},T=t.getContextAttributes(),U=null,y=null,w=[],b=[],P=new Je,x=null,M=null,L=new Ot;L.viewport=new pt;let I=new Ot;I.viewport=new pt;let z=[L,I],k=new Sa,C=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let ee=w[K];return ee===void 0&&(ee=new us,w[K]=ee),ee.getTargetRaySpace()},this.getControllerGrip=function(K){let ee=w[K];return ee===void 0&&(ee=new us,w[K]=ee),ee.getGripSpace()},this.getHand=function(K){let ee=w[K];return ee===void 0&&(ee=new us,w[K]=ee),ee.getHandSpace()};function X(K){let ee=b.indexOf(K.inputSource);if(ee===-1)return;let Se=w[ee];Se!==void 0&&(Se.update(K.inputSource,K.frame,l||r),Se.dispatchEvent({type:K.type,data:K.inputSource}))}function $(){s.removeEventListener("select",X),s.removeEventListener("selectstart",X),s.removeEventListener("selectend",X),s.removeEventListener("squeeze",X),s.removeEventListener("squeezestart",X),s.removeEventListener("squeezeend",X),s.removeEventListener("end",$),s.removeEventListener("inputsourceschange",ie);for(let K=0;K<w.length;K++){let ee=b[K];ee!==null&&(b[K]=null,w[K].disconnect(ee))}C=null,G=null,m.reset();for(let K in p)delete p[K];if(e.setRenderTarget(U),d=null,u=null,f=null,s=null,y=null,Ke.stop(),n.isPresenting=!1,e.setPixelRatio(x),e.setSize(P.width,P.height,!1),M!==null){let K=M.camera;K.fov=M.fov,K.zoom=M.zoom,K.updateProjectionMatrix(),M=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){a=K,n.isPresenting===!0&&De("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){o=K,n.isPresenting===!0&&De("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||r},this.setReferenceSpace=function(K){l=K},this.getBaseLayer=function(){return u!==null?u:d},this.getBinding=function(){return f===null&&S&&(f=new XRWebGLBinding(s,t)),f},this.getFrame=function(){return v},this.getSession=function(){return s},this.setSession=async function(K){if(s=K,s!==null){if(U=e.getRenderTarget(),s.addEventListener("select",X),s.addEventListener("selectstart",X),s.addEventListener("selectend",X),s.addEventListener("squeeze",X),s.addEventListener("squeezestart",X),s.addEventListener("squeezeend",X),s.addEventListener("end",$),s.addEventListener("inputsourceschange",ie),T.xrCompatible!==!0&&await t.makeXRCompatible(),x=e.getPixelRatio(),e.getSize(P),S&&"createProjectionLayer"in XRWebGLBinding.prototype){let Se=null,Le=null,ye=null;T.depth&&(ye=T.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Se=T.stencil?pi:Tn,Le=T.stencil?Ss:yn);let ke={colorFormat:t.RGBA8,depthFormat:ye,scaleFactor:a};f=this.getBinding(),u=f.createProjectionLayer(ke),s.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),y=new Jt(u.textureWidth,u.textureHeight,{format:dn,type:Kt,depthTexture:new ai(u.textureWidth,u.textureHeight,Le,void 0,void 0,void 0,void 0,void 0,void 0,Se),stencilBuffer:T.stencil,colorSpace:e.outputColorSpace,samples:T.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{let Se={antialias:T.antialias,alpha:!0,depth:T.depth,stencil:T.stencil,framebufferScaleFactor:a};d=new XRWebGLLayer(s,t,Se),s.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),y=new Jt(d.framebufferWidth,d.framebufferHeight,{format:dn,type:Kt,colorSpace:e.outputColorSpace,stencilBuffer:T.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(c),l=null,r=await s.requestReferenceSpace(o),Ke.setContext(s),Ke.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function ie(K){for(let ee=0;ee<K.removed.length;ee++){let Se=K.removed[ee],Le=b.indexOf(Se);Le>=0&&(b[Le]=null,w[Le].disconnect(Se))}for(let ee=0;ee<K.added.length;ee++){let Se=K.added[ee],Le=b.indexOf(Se);if(Le===-1){for(let ke=0;ke<w.length;ke++)if(ke>=b.length){b.push(Se),Le=ke;break}else if(b[ke]===null){b[ke]=Se,Le=ke;break}if(Le===-1)break}let ye=w[Le];ye&&ye.connect(Se)}}let Z=new q,Q=new q;function se(K,ee,Se){Z.setFromMatrixPosition(ee.matrixWorld),Q.setFromMatrixPosition(Se.matrixWorld);let Le=Z.distanceTo(Q),ye=ee.projectionMatrix.elements,ke=Se.projectionMatrix.elements,vt=ye[14]/(ye[10]-1),Be=ye[14]/(ye[10]+1),je=(ye[9]+1)/ye[5],tt=(ye[9]-1)/ye[5],Xe=(ye[8]-1)/ye[0],ot=(ke[8]+1)/ke[0],gt=vt*Xe,St=vt*ot,st=Le/(-Xe+ot),_t=st*-Xe;if(ee.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(_t),K.translateZ(st),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert(),ye[10]===-1)K.projectionMatrix.copy(ee.projectionMatrix),K.projectionMatrixInverse.copy(ee.projectionMatrixInverse);else{let F=vt+st,Ye=Be+st,Ve=gt-_t,E=St+(Le-_t),_=je*Be/Ye*F,V=tt*Be/Ye*F;K.projectionMatrix.makePerspective(Ve,E,_,V,F,Ye),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}}function le(K,ee){ee===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(ee.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(s===null)return;let ee=K.near,Se=K.far;m.texture!==null&&(m.depthNear>0&&(ee=m.depthNear),m.depthFar>0&&(Se=m.depthFar)),k.near=I.near=L.near=ee,k.far=I.far=L.far=Se,(C!==k.near||G!==k.far)&&(s.updateRenderState({depthNear:k.near,depthFar:k.far}),C=k.near,G=k.far),k.layers.mask=K.layers.mask|6,L.layers.mask=k.layers.mask&-5,I.layers.mask=k.layers.mask&-3;let Le=K.parent,ye=k.cameras;le(k,Le);for(let ke=0;ke<ye.length;ke++)le(ye[ke],Le);ye.length===2?se(k,L,I):k.projectionMatrix.copy(L.projectionMatrix),M===null&&K.isPerspectiveCamera&&(M={camera:K,fov:K.fov,zoom:K.zoom}),Me(K,k,Le)};function Me(K,ee,Se){Se===null?K.matrix.copy(ee.matrixWorld):(K.matrix.copy(Se.matrixWorld),K.matrix.invert(),K.matrix.multiply(ee.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(ee.projectionMatrix),K.projectionMatrixInverse.copy(ee.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=cs*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return k},this.getFoveation=function(){if(!(u===null&&d===null))return c},this.setFoveation=function(K){c=K,u!==null&&(u.fixedFoveation=K),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=K)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(k)},this.getCameraTexture=function(K){return p[K]};let Ue=null;function xe(K,ee){if(h=ee.getViewerPose(l||r),v=ee,h!==null){let Se=h.views;d!==null&&(e.setRenderTargetFramebuffer(y,d.framebuffer),e.setRenderTarget(y));let Le=!1;Se.length!==k.cameras.length&&(k.cameras.length=0,Le=!0);for(let Be=0;Be<Se.length;Be++){let je=Se[Be],tt=null;if(d!==null)tt=d.getViewport(je);else{let ot=f.getViewSubImage(u,je);tt=ot.viewport,Be===0&&(e.setRenderTargetTextures(y,ot.colorTexture,ot.depthStencilTexture),e.setRenderTarget(y))}let Xe=z[Be];Xe===void 0&&(Xe=new Ot,Xe.layers.enable(Be),Xe.viewport=new pt,z[Be]=Xe),Xe.matrix.fromArray(je.transform.matrix),Xe.matrix.decompose(Xe.position,Xe.quaternion,Xe.scale),Xe.projectionMatrix.fromArray(je.projectionMatrix),Xe.projectionMatrixInverse.copy(Xe.projectionMatrix).invert(),Xe.viewport.set(tt.x,tt.y,tt.width,tt.height),Be===0&&(k.matrix.copy(Xe.matrix),k.matrix.decompose(k.position,k.quaternion,k.scale)),Le===!0&&k.cameras.push(Xe)}let ye=s.enabledFeatures;if(ye&&ye.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&S){f=n.getBinding();let Be=f.getDepthInformation(Se[0]);Be&&Be.isValid&&Be.texture&&m.init(Be,s.renderState)}if(ye&&ye.includes("camera-access")&&S){e.state.unbindTexture(),f=n.getBinding();for(let Be=0;Be<Se.length;Be++){let je=Se[Be].camera;if(je){let tt=p[je];tt||(tt=new Js,p[je]=tt);let Xe=f.getCameraImage(je);tt.sourceTexture=Xe}}}}for(let Se=0;Se<w.length;Se++){let Le=b[Se],ye=w[Se];Le!==null&&ye!==void 0&&ye.update(Le,ee,l||r)}Ue&&Ue(K,ee),ee.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ee}),v=null}let Ke=new iu;Ke.setAnimationLoop(xe),this.setAnimationLoop=function(K){Ue=K},this.dispose=function(){}}},_0=new xt,cu=new Oe;cu.set(-1,0,0,0,1,0,0,0,1);function x0(i,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Wl(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,T,U,y){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?a(m,p):p.isMeshLambertMaterial?(a(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(a(m,p),f(m,p)):p.isMeshPhongMaterial?(a(m,p),h(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(a(m,p),u(m,p),p.isMeshPhysicalMaterial&&d(m,p,y)):p.isMeshMatcapMaterial?(a(m,p),v(m,p)):p.isMeshDepthMaterial?a(m,p):p.isMeshDistanceMaterial?(a(m,p),S(m,p)):p.isMeshNormalMaterial?a(m,p):p.isLineBasicMaterial?(r(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?c(m,p,T,U):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function a(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Xt&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Xt&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);let T=e.get(p),U=T.envMap,y=T.envMapRotation;U&&(m.envMap.value=U,m.envMapRotation.value.setFromMatrix4(_0.makeRotationFromEuler(y)).transpose(),U.isCubeTexture&&U.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(cu),m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function r(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,T,U){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*T,m.scale.value=U*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function f(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function u(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function d(m,p,T){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Xt&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.retroreflectivity>0&&(m.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=T.texture,m.transmissionSamplerSize.value.set(T.width,T.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function v(m,p){p.matcap&&(m.matcap.value=p.matcap)}function S(m,p){let T=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(T.matrixWorld),m.nearDistance.value=T.shadow.camera.near,m.farDistance.value=T.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function v0(i,e,t,n){let s={},a={},r=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(y,w){let b=w.program;n.uniformBlockBinding(y,b)}function l(y,w){let b=s[y.id];b===void 0&&(m(y),b=h(y),s[y.id]=b,y.addEventListener("dispose",T));let P=w.program;n.updateUBOMapping(y,P);let x=e.render.frame;a[y.id]!==x&&(u(y),a[y.id]=x)}function h(y){let w=f();y.__bindingPointIndex=w;let b=i.createBuffer(),P=y.__size,x=y.usage;return i.bindBuffer(i.UNIFORM_BUFFER,b),i.bufferData(i.UNIFORM_BUFFER,P,x),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,w,b),b}function f(){for(let y=0;y<o;y++)if(r.indexOf(y)===-1)return r.push(y),y;return Fe("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(y){let w=s[y.id],b=y.uniforms,P=y.__cache;i.bindBuffer(i.UNIFORM_BUFFER,w);for(let x=0,M=b.length;x<M;x++){let L=b[x];if(Array.isArray(L))for(let I=0,z=L.length;I<z;I++)d(L[I],x,I,P);else d(L,x,0,P)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(y,w,b,P){if(S(y,w,b,P)===!0){let x=y.__offset,M=y.value;if(Array.isArray(M)){let L=0;for(let I=0;I<M.length;I++){let z=M[I],k=p(z);v(z,y.__data,L),typeof z!="number"&&typeof z!="boolean"&&!z.isMatrix3&&!ArrayBuffer.isView(z)&&(L+=k.storage/Float32Array.BYTES_PER_ELEMENT)}}else v(M,y.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,x,y.__data)}}function v(y,w,b){typeof y=="number"||typeof y=="boolean"?w[0]=y:y.isMatrix3?(w[0]=y.elements[0],w[1]=y.elements[1],w[2]=y.elements[2],w[3]=0,w[4]=y.elements[3],w[5]=y.elements[4],w[6]=y.elements[5],w[7]=0,w[8]=y.elements[6],w[9]=y.elements[7],w[10]=y.elements[8],w[11]=0):ArrayBuffer.isView(y)?w.set(new y.constructor(y.buffer,y.byteOffset,w.length)):y.toArray(w,b)}function S(y,w,b,P){let x=y.value,M=w+"_"+b;if(P[M]===void 0)return typeof x=="number"||typeof x=="boolean"?P[M]=x:ArrayBuffer.isView(x)?P[M]=x.slice():P[M]=x.clone(),!0;{let L=P[M];if(typeof x=="number"||typeof x=="boolean"){if(L!==x)return P[M]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(L.equals(x)===!1)return L.copy(x),!0}}return!1}function m(y){let w=y.uniforms,b=0,P=16;for(let M=0,L=w.length;M<L;M++){let I=Array.isArray(w[M])?w[M]:[w[M]];for(let z=0,k=I.length;z<k;z++){let C=I[z],G=Array.isArray(C.value)?C.value:[C.value];for(let X=0,$=G.length;X<$;X++){let ie=G[X],Z=p(ie),Q=b%P,se=Q%Z.boundary,le=Q+se;b+=se,le!==0&&P-le<Z.storage&&(b+=P-le),C.__data=new Float32Array(Z.storage/Float32Array.BYTES_PER_ELEMENT),C.__offset=b,b+=Z.storage}}}let x=b%P;return x>0&&(b+=P-x),y.__size=b,y.__cache={},this}function p(y){let w={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(w.boundary=4,w.storage=4):y.isVector2?(w.boundary=8,w.storage=8):y.isVector3||y.isColor?(w.boundary=16,w.storage=12):y.isVector4?(w.boundary=16,w.storage=16):y.isMatrix3?(w.boundary=48,w.storage=48):y.isMatrix4?(w.boundary=64,w.storage=64):y.isTexture?De("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(y)?(w.boundary=16,w.storage=y.byteLength):De("WebGLRenderer: Unsupported uniform value type.",y),w}function T(y){let w=y.target;w.removeEventListener("dispose",T);let b=r.indexOf(w.__bindingPointIndex);r.splice(b,1),i.deleteBuffer(s[w.id]),delete s[w.id],delete a[w.id]}function U(){for(let y in s)i.deleteBuffer(s[y]);r=[],s={},a={}}return{bind:c,update:l,dispose:U}}var y0=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Rn=null;function S0(){return Rn===null&&(Rn=new fs(y0,16,16,mi,qt),Rn.name="DFG_LUT",Rn.minFilter=ft,Rn.magFilter=ft,Rn.wrapS=$t,Rn.wrapT=$t,Rn.generateMipmaps=!1,Rn.needsUpdate=!0),Rn}var mo=class{constructor(e={}){let{canvas:t=Rh(),context:n=null,depth:s=!0,stencil:a=!1,alpha:r=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:u=!1,outputBufferType:d=Kt}=e;this.isWebGLRenderer=!0;let v;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");v=n.getContextAttributes().alpha}else v=r;let S=d,m=new Set([Pa,Ia,Ca]),p=new Set([Kt,yn,ys,Ss,Aa,Ra]),T=new Uint32Array(4),U=new Int32Array(4),y=new q,w=null,b=null,P=[],x=[],M=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=an,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let L=this,I=!1,z=null,k=null,C=null,G=null;this._outputColorSpace=Rt;let X=0,$=0,ie=null,Z=-1,Q=null,se=new pt,le=new pt,Me=null,Ue=new Ge(0),xe=0,Ke=t.width,K=t.height,ee=1,Se=null,Le=null,ye=new pt(0,0,Ke,K),ke=new pt(0,0,Ke,K),vt=!1,Be=new ps,je=!1,tt=!1,Xe=new xt,ot=new q,gt=new pt,St={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},st=!1;function _t(){return ie===null?ee:1}let F=n;function Ye(g,A){return t.getContext(g,A)}let Ve,E,_,V,H,J,oe,ue,j,ne,ce,we,me,de,Ce,Pe,ze,N,fe,te,pe,ve,re;try{let g={alpha:!0,depth:s,stencil:a,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"186"}`),t.addEventListener("webglcontextlost",rt,!1),t.addEventListener("webglcontextrestored",et,!1),t.addEventListener("webglcontextcreationerror",en,!1),F===null){let A="webgl2";if(F=Ye(A,g),F===null)throw Ye(A)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Ie()}catch(g){throw t.removeEventListener("webglcontextlost",rt,!1),t.removeEventListener("webglcontextrestored",et,!1),t.removeEventListener("webglcontextcreationerror",en,!1),Fe("WebGLRenderer: "+g.message),g}function Ie(){Ve=new Rm(F),Ve.init(),pe=new p0(F,Ve),E=new xm(F,Ve,e,pe),_=new d0(F,Ve),E.reversedDepthBuffer&&u&&_.buffers.depth.setReversed(!0),k=F.createFramebuffer(),C=F.createFramebuffer(),G=F.createFramebuffer(),V=new Pm(F),H=new jg,J=new f0(F,Ve,_,H,E,pe,V),oe=new Am(L),ue=new Ld(F),ve=new gm(F,ue),j=new Cm(F,ue,V,ve),ne=new Dm(F,j,ue,ve,V),N=new Lm(F,E,J),Ce=new vm(H),ce=new Kg(L,oe,Ve,E,ve,Ce),we=new x0(L,H),me=new e0,de=new a0(Ve),ze=new mm(L,oe,_,ne,v,c),Pe=new u0(L,ne,E),re=new v0(F,V,E,_),fe=new _m(F,Ve,V),te=new Im(F,Ve,V),V.programs=ce.programs,L.capabilities=E,L.extensions=Ve,L.properties=H,L.renderLists=me,L.shadowMap=Pe,L.state=_,L.info=V}S!==Kt&&(M=new Nm(S,t.width,t.height,o,s,a));let Ae=new lc(L,F);this.xr=Ae,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){let g=Ve.get("WEBGL_lose_context");g&&g.loseContext()},this.forceContextRestore=function(){let g=Ve.get("WEBGL_lose_context");g&&g.restoreContext()},this.getPixelRatio=function(){return ee},this.setPixelRatio=function(g){g!==void 0&&(ee=g,this.setSize(Ke,K,!1))},this.getSize=function(g){return g.set(Ke,K)},this.setSize=function(g,A,B=!0){if(Ae.isPresenting){De("WebGLRenderer: Can't change size while VR device is presenting.");return}Ke=g,K=A,t.width=Math.floor(g*ee),t.height=Math.floor(A*ee),B===!0&&(t.style.width=g+"px",t.style.height=A+"px"),M!==null&&M.setSize(t.width,t.height),this.setViewport(0,0,g,A)},this.getDrawingBufferSize=function(g){return g.set(Ke*ee,K*ee).floor()},this.setDrawingBufferSize=function(g,A,B){Ke=g,K=A,ee=B,t.width=Math.floor(g*B),t.height=Math.floor(A*B),this.setViewport(0,0,g,A)},this.setEffects=function(g){if(S===Kt){Fe("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(g){for(let A=0;A<g.length;A++)if(g[A].isOutputPass===!0){De("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}M.setEffects(g||[])},this.getCurrentViewport=function(g){return g.copy(se)},this.getViewport=function(g){return g.copy(ye)},this.setViewport=function(g,A,B,D){g.isVector4?ye.set(g.x,g.y,g.z,g.w):ye.set(g,A,B,D),_.viewport(se.copy(ye).multiplyScalar(ee).round())},this.getScissor=function(g){return g.copy(ke)},this.setScissor=function(g,A,B,D){g.isVector4?ke.set(g.x,g.y,g.z,g.w):ke.set(g,A,B,D),_.scissor(le.copy(ke).multiplyScalar(ee).round())},this.getScissorTest=function(){return vt},this.setScissorTest=function(g){_.setScissorTest(vt=g)},this.setOpaqueSort=function(g){Se=g},this.setTransparentSort=function(g){Le=g},this.getClearColor=function(g){return g.copy(ze.getClearColor())},this.setClearColor=function(){ze.setClearColor(...arguments)},this.getClearAlpha=function(){return ze.getClearAlpha()},this.setClearAlpha=function(){ze.setClearAlpha(...arguments)},this.clear=function(g=!0,A=!0,B=!0){let D=0;if(g){let O=!1;if(ie!==null){let ae=ie.texture.format;O=m.has(ae)}if(O){let ae=ie.texture.type,ge=p.has(ae),he=ze.getClearColor(),Te=ze.getClearAlpha(),Re=he.r,He=he.g,Ze=he.b;ge?(T[0]=Re,T[1]=He,T[2]=Ze,T[3]=Te,F.clearBufferuiv(F.COLOR,0,T)):(U[0]=Re,U[1]=He,U[2]=Ze,U[3]=Te,F.clearBufferiv(F.COLOR,0,U))}else D|=F.COLOR_BUFFER_BIT}A&&(D|=F.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),B&&(D|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),D!==0&&F.clear(D)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(g){g.setRenderer(this),z=g},this.dispose=function(){t.removeEventListener("webglcontextlost",rt,!1),t.removeEventListener("webglcontextrestored",et,!1),t.removeEventListener("webglcontextcreationerror",en,!1),ze.dispose(),me.dispose(),de.dispose(),H.dispose(),oe.dispose(),ne.dispose(),ve.dispose(),re.dispose(),ce.dispose(),Ae.dispose(),Ae.removeEventListener("sessionstart",zo),Ae.removeEventListener("sessionend",ko),Dn.stop()};function rt(g){g.preventDefault(),Gl("WebGLRenderer: Context Lost."),I=!0}function et(){Gl("WebGLRenderer: Context Restored."),I=!1;let g=V.autoReset,A=Pe.enabled,B=Pe.autoUpdate,D=Pe.needsUpdate,O=Pe.type;Ie(),V.autoReset=g,Pe.enabled=A,Pe.autoUpdate=B,Pe.needsUpdate=D,Pe.type=O}function en(g){Fe("WebGLRenderer: A WebGL context could not be created. Reason: ",g.statusMessage)}function on(g){let A=g.target;A.removeEventListener("dispose",on),Oo(A)}function Oo(g){Bo(g),H.remove(g)}function Bo(g){let A=H.get(g).programs;A!==void 0&&(A.forEach(function(B){ce.releaseProgram(B)}),g.isShaderMaterial&&ce.releaseShaderCache(g))}this.renderBufferDirect=function(g,A,B,D,O,ae){A===null&&(A=St);let ge=O.isMesh&&O.matrixWorld.determinantAffine()<0,he=Go(g,A,B,D,O);_.setMaterial(D,ge);let Te=B.index,Re=1;if(D.wireframe===!0){if(Te=j.getWireframeAttribute(B),Te===void 0)return;Re=2}let He=B.drawRange,Ze=B.attributes.position,Ee=He.start*Re,nt=(He.start+He.count)*Re;ae!==null&&(Ee=Math.max(Ee,ae.start*Re),nt=Math.min(nt,(ae.start+ae.count)*Re)),Te!==null?(Ee=Math.max(Ee,0),nt=Math.min(nt,Te.count)):Ze!=null&&(Ee=Math.max(Ee,0),nt=Math.min(nt,Ze.count));let Mt=nt-Ee;if(Mt<0||Mt===1/0)return;ve.setup(O,D,he,B,Te);let ut,lt=fe;if(Te!==null&&(ut=ue.get(Te),lt=te,lt.setIndex(ut)),O.isMesh)D.wireframe===!0?(_.setLineWidth(D.wireframeLinewidth*_t()),lt.setMode(F.LINES)):lt.setMode(F.TRIANGLES);else if(O.isLine){let Ut=D.linewidth;Ut===void 0&&(Ut=1),_.setLineWidth(Ut*_t()),O.isLineSegments?lt.setMode(F.LINES):O.isLineLoop?lt.setMode(F.LINE_LOOP):lt.setMode(F.LINE_STRIP)}else O.isPoints?lt.setMode(F.POINTS):O.isSprite&&lt.setMode(F.TRIANGLES);if(O.isBatchedMesh)if(Ve.get("WEBGL_multi_draw"))lt.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{let Ut=O._multiDrawStarts,be=O._multiDrawCounts,Ht=O._multiDrawCount,Qe=Te?ue.get(Te).bytesPerElement:1,ln=H.get(D).currentProgram.getUniforms();for(let Mn=0;Mn<Ht;Mn++)ln.setValue(F,"_gl_DrawID",Mn),lt.render(Ut[Mn]/Qe,be[Mn])}else if(O.isInstancedMesh)lt.renderInstances(Ee,Mt,O.count);else if(B.isInstancedBufferGeometry){let Ut=B._maxInstanceCount!==void 0?B._maxInstanceCount:1/0,be=Math.min(B.instanceCount,Ut);lt.renderInstances(Ee,Mt,be)}else lt.render(Ee,Mt)};function Ds(g,A,B,D){z!==null&&g.isNodeMaterial&&z.setObject(D,g),je===!0&&Ce.setState(g,B,!1),g.transparent===!0&&g.side===Tt&&g.forceSinglePass===!1?(g.side=Xt,g.needsUpdate=!0,Un(g,A,D),g.side=di,g.needsUpdate=!0,Un(g,A,D),g.side=Tt):Un(g,A,D)}this.compile=function(g,A,B=null){B===null&&(B=g),z!==null&&z.renderStart(g,A,B),b=de.get(B),b.init(A),x.push(b),B.traverseVisible(function(O){O.isLight&&O.layers.test(A.layers)&&(b.pushLight(O),O.castShadow&&b.pushShadow(O))}),g!==B&&g.traverseVisible(function(O){O.isLight&&O.layers.test(A.layers)&&(b.pushLight(O),O.castShadow&&b.pushShadow(O))}),b.setupLights(),z!==null&&z.updateLights(b.state.lightsArray),tt=this.localClippingEnabled,je=Ce.init(this.clippingPlanes,tt),je===!0&&Ce.setGlobalState(this.clippingPlanes,A),z!==null&&Pe.render(b.state.shadowsArray,B,A);let D=new Set;return g.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;let ae=O.material;if(ae)if(Array.isArray(ae))for(let ge=0;ge<ae.length;ge++){let he=ae[ge];Ds(he,B,A,O),D.add(he)}else Ds(ae,B,A,O),D.add(ae)}),b=x.pop(),z!==null&&z.renderEnd(),D},this.compileAsync=function(g,A,B=null){let D=this.compile(g,A,B);return new Promise(O=>{function ae(){if(D.forEach(function(ge){let Te=H.get(ge).currentProgram;(Te===void 0||Te.isReady())&&D.delete(ge)}),D.size===0){O(g);return}setTimeout(ae,10)}Ve.get("KHR_parallel_shader_compile")!==null?ae():setTimeout(ae,10)})};let vi=null;function Tc(g){vi&&vi(g)}function zo(){Dn.stop()}function ko(){Dn.start()}let Dn=new iu;Dn.setAnimationLoop(Tc),typeof self<"u"&&Dn.setContext(self),this.setAnimationLoop=function(g){vi=g,Ae.setAnimationLoop(g),g===null?Dn.stop():Dn.start()},Ae.addEventListener("sessionstart",zo),Ae.addEventListener("sessionend",ko),this.render=function(g,A){if(A!==void 0&&A.isCamera!==!0){Fe("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;z!==null&&z.renderStart(g,A);let B=Ae.enabled===!0&&Ae.isPresenting===!0,D=M!==null&&(ie===null||B)&&M.begin(L,ie);if(g.matrixWorldAutoUpdate===!0&&g.updateMatrixWorld(),A.parent===null&&A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),Ae.enabled===!0&&Ae.isPresenting===!0&&(M===null||M.isCompositing()===!1)&&(Ae.cameraAutoUpdate===!0&&Ae.updateCamera(A),A=Ae.getCamera()),g.isScene===!0&&g.onBeforeRender(L,g,A,ie),b=de.get(g,x.length),b.init(A),b.state.textureUnits=J.getTextureUnits(),x.push(b),Xe.multiplyMatrices(A.projectionMatrix,A.matrixWorldInverse),Be.setFromProjectionMatrix(Xe,_n,A.reversedDepth),tt=this.localClippingEnabled,je=Ce.init(this.clippingPlanes,tt),w=me.get(g,P.length),w.init(),P.push(w),Ae.enabled===!0&&Ae.isPresenting===!0){let ge=L.xr.getDepthSensingMesh();ge!==null&&Us(ge,A,-1/0,L.sortObjects)}Us(g,A,0,L.sortObjects),w.finish(),z!==null&&z.updateLights(b.state.lightsArray),L.sortObjects===!0&&w.sort(Se,Le),st=Ae.enabled===!1||Ae.isPresenting===!1||Ae.hasDepthSensing()===!1,st&&ze.addToRenderList(w,g),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),je===!0&&Ce.beginShadows();let O=b.state.shadowsArray;if(Pe.render(O,g,A),je===!0&&Ce.endShadows(),(D&&M.hasRenderPass())===!1){let ge=w.opaque,he=w.transmissive;if(b.setupLights(),A.isArrayCamera){let Te=A.cameras;if(he.length>0)for(let Re=0,He=Te.length;Re<He;Re++){let Ze=Te[Re];Mr(ge,he,g,Ze)}st&&ze.render(g);for(let Re=0,He=Te.length;Re<He;Re++){let Ze=Te[Re];Oi(w,g,Ze,Ze.viewport)}}else he.length>0&&Mr(ge,he,g,A),st&&ze.render(g),Oi(w,g,A)}ie!==null&&$===0&&(J.updateMultisampleRenderTarget(ie),J.updateRenderTargetMipmap(ie)),D&&M.end(L),g.isScene===!0&&g.onAfterRender(L,g,A),ve.resetDefaultState(),Z=-1,Q=null,x.pop(),x.length>0?(b=x[x.length-1],J.setTextureUnits(b.state.textureUnits),je===!0&&Ce.setGlobalState(L.clippingPlanes,b.state.camera)):b=null,P.pop(),P.length>0?w=P[P.length-1]:w=null,z!==null&&z.renderEnd()};function Us(g,A,B,D){if(g.visible===!1)return;if(g.layers.test(A.layers)){if(g.isGroup)B=g.renderOrder;else if(g.isLOD)g.autoUpdate===!0&&g.update(A);else if(g.isLightProbeGrid)b.pushLightProbeGrid(g);else if(g.isLight)b.pushLight(g),g.castShadow&&b.pushShadow(g);else if(g.isSprite){if(!g.frustumCulled||g.intersectsFrustum(Be)){D&&gt.setFromMatrixPosition(g.matrixWorld).applyMatrix4(Xe);let ge=ne.update(g),he=g.material;he.visible&&w.push(g,ge,he,B,gt.z,null,A)}}else if((g.isMesh||g.isLine||g.isPoints)&&(!g.frustumCulled||g.intersectsFrustum(Be))){let ge=ne.update(g),he=g.material;if(D&&(g.boundingSphere!==void 0?(g.boundingSphere===null&&g.computeBoundingSphere(),gt.copy(g.boundingSphere.center)):(ge.boundingSphere===null&&ge.computeBoundingSphere(),gt.copy(ge.boundingSphere.center)),gt.applyMatrix4(g.matrixWorld).applyMatrix4(Xe)),Array.isArray(he)){let Te=ge.groups;for(let Re=0,He=Te.length;Re<He;Re++){let Ze=Te[Re],Ee=he[Ze.materialIndex];Ee&&Ee.visible&&w.push(g,ge,Ee,B,gt.z,Ze,A)}}else he.visible&&w.push(g,ge,he,B,gt.z,null,A)}}let ae=g.children;for(let ge=0,he=ae.length;ge<he;ge++)Us(ae[ge],A,B,D)}function Oi(g,A,B,D){let{opaque:O,transmissive:ae,transparent:ge}=g;b.setupLightsView(B),je===!0&&Ce.setGlobalState(L.clippingPlanes,B),D&&_.viewport(se.copy(D)),O.length>0&&Bi(O,A,B),ae.length>0&&Bi(ae,A,B),ge.length>0&&Bi(ge,A,B),_.buffers.depth.setTest(!0),_.buffers.depth.setMask(!0),_.buffers.color.setMask(!0),_.setPolygonOffset(!1)}function Mr(g,A,B,D){if((B.isScene===!0?B.overrideMaterial:null)!==null)return;if(b.state.transmissionRenderTarget[D.id]===void 0){let Ee=Ve.has("EXT_color_buffer_half_float")||Ve.has("EXT_color_buffer_float");b.state.transmissionRenderTarget[D.id]=new Jt(1,1,{generateMipmaps:!0,type:Ee?qt:Kt,minFilter:Xn,samples:Math.max(4,E.samples),stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:$e.workingColorSpace})}let ae=b.state.transmissionRenderTarget[D.id],ge=D.viewport||se;ae.setSize(ge.z*L.transmissionResolutionScale,ge.w*L.transmissionResolutionScale);let he=L.getRenderTarget(),Te=L.getActiveCubeFace(),Re=L.getActiveMipmapLevel();L.setRenderTarget(ae),L.getClearColor(Ue),xe=L.getClearAlpha(),xe<1&&L.setClearColor(16777215,.5),L.clear(),st&&ze.render(B);let He=L.toneMapping;L.toneMapping=an;let Ze=D.viewport;if(D.viewport!==void 0&&(D.viewport=void 0),b.setupLightsView(D),je===!0&&Ce.setGlobalState(L.clippingPlanes,D),Bi(g,B,D),J.updateMultisampleRenderTarget(ae),J.updateRenderTargetMipmap(ae),Ve.has("WEBGL_multisampled_render_to_texture")===!1){let Ee=!1;for(let nt=0,Mt=A.length;nt<Mt;nt++){let ut=A[nt],{object:lt,geometry:Ut,material:be,group:Ht}=ut;if(be.side===Tt&&lt.layers.test(D.layers)){let Qe=be.side;be.side=Xt,be.needsUpdate=!0,br(lt,B,D,Ut,be,Ht),be.side=Qe,be.needsUpdate=!0,Ee=!0}}Ee===!0&&(J.updateMultisampleRenderTarget(ae),J.updateRenderTargetMipmap(ae))}L.setRenderTarget(he,Te,Re),L.setClearColor(Ue,xe),Ze!==void 0&&(D.viewport=Ze),L.toneMapping=He}function Bi(g,A,B){let D=A.isScene===!0?A.overrideMaterial:null;for(let O=0,ae=g.length;O<ae;O++){let ge=g[O],{object:he,geometry:Te,group:Re}=ge,He=ge.material;He.allowOverride===!0&&D!==null&&(He=D),he.layers.test(B.layers)&&br(he,A,B,Te,He,Re)}}function br(g,A,B,D,O,ae){z!==null&&O.isNodeMaterial&&z.setObject(g,O),g.onBeforeRender(L,A,B,D,O,ae),g.modelViewMatrix.multiplyMatrices(B.matrixWorldInverse,g.matrixWorld),g.normalMatrix.getNormalMatrix(g.modelViewMatrix),O.onBeforeRender(L,A,B,D,g,ae),O.transparent===!0&&O.side===Tt&&O.forceSinglePass===!1?(O.side=Xt,O.needsUpdate=!0,L.renderBufferDirect(B,A,D,O,g,ae),O.side=di,O.needsUpdate=!0,L.renderBufferDirect(B,A,D,O,g,ae),O.side=Tt):L.renderBufferDirect(B,A,D,O,g,ae),g.onAfterRender(L,A,B,D,O,ae)}function Un(g,A,B){A.isScene!==!0&&(A=St);let D=H.get(g),O=b.state.lights,ae=b.state.shadowsArray,ge=O.state.version,he=ce.getParameters(g,O.state,ae,A,B,b.state.lightProbeGridArray),Te=ce.getProgramCacheKey(he),Re=D.programs;D.environment=g.isMeshStandardMaterial||g.isMeshLambertMaterial||g.isMeshPhongMaterial?A.environment:null,D.fog=A.fog;let He=g.isMeshStandardMaterial||g.isMeshLambertMaterial&&!g.envMap||g.isMeshPhongMaterial&&!g.envMap;D.envMap=oe.get(g.envMap||D.environment,He),D.envMapRotation=D.environment!==null&&g.envMap===null?A.environmentRotation:g.envMapRotation,Re===void 0&&(g.addEventListener("dispose",on),Re=new Map,D.programs=Re);let Ze=Re.get(Te);if(Ze!==void 0){if(D.currentProgram===Ze&&D.lightsStateVersion===ge)return Ns(g,he),Ze}else he.uniforms=ce.getUniforms(g),z!==null&&g.isNodeMaterial&&z.build(g,B,he),g.onBeforeCompile(he,L),Ze=ce.acquireProgram(he,Te),Re.set(Te,Ze),D.uniforms=he.uniforms;let Ee=D.uniforms;return(!g.isShaderMaterial&&!g.isRawShaderMaterial||g.clipping===!0)&&(Ee.clippingPlanes=Ce.uniform),Ns(g,he),D.needsLights=Y(g),D.lightsStateVersion=ge,D.needsLights&&(Ee.ambientLightColor.value=O.state.ambient,Ee.lightProbe.value=O.state.probe,Ee.sunLights.value=O.state.sun,Ee.sunLightShadows.value=O.state.sunShadow,Ee.directionalLights.value=O.state.directional,Ee.directionalLightShadows.value=O.state.directionalShadow,Ee.spotLights.value=O.state.spot,Ee.spotLightShadows.value=O.state.spotShadow,Ee.rectAreaLights.value=O.state.rectArea,Ee.ltc_1.value=O.state.rectAreaLTC1,Ee.ltc_2.value=O.state.rectAreaLTC2,Ee.pointLights.value=O.state.point,Ee.pointLightShadows.value=O.state.pointShadow,Ee.hemisphereLights.value=O.state.hemi,Ee.sunShadowMatrix.value=O.state.sunShadowMatrix,Ee.sunShadowCascade.value=O.state.sunShadowCascade,Ee.directionalShadowMatrix.value=O.state.directionalShadowMatrix,Ee.spotLightMatrix.value=O.state.spotLightMatrix,Ee.spotLightMap.value=O.state.spotLightMap,Ee.pointShadowMatrix.value=O.state.pointShadowMatrix),D.lightProbeGrid=b.state.lightProbeGridArray.length>0,D.currentProgram=Ze,D.uniformsList=null,Ze}function Tr(g){if(g.uniformsList===null){let A=g.currentProgram.getUniforms();g.uniformsList=Es.seqWithValue(A.seq,g.uniforms)}return g.uniformsList}function Ns(g,A){let B=H.get(g);B.outputColorSpace=A.outputColorSpace,B.batching=A.batching,B.batchingColor=A.batchingColor,B.instancing=A.instancing,B.instancingColor=A.instancingColor,B.instancingMorph=A.instancingMorph,B.skinning=A.skinning,B.morphTargets=A.morphTargets,B.morphNormals=A.morphNormals,B.morphColors=A.morphColors,B.morphTargetsCount=A.morphTargetsCount,B.numClippingPlanes=A.numClippingPlanes,B.numIntersection=A.numClipIntersection,B.vertexAlphas=A.vertexAlphas,B.vertexTangents=A.vertexTangents,B.toneMapping=A.toneMapping}function Vo(g,A){if(g.length===0)return null;if(g.length===1)return g[0].texture!==null?g[0]:null;y.setFromMatrixPosition(A.matrixWorld);for(let B=0,D=g.length;B<D;B++){let O=g[B];if(O.texture!==null&&O.boundingBox.containsPoint(y))return O}return null}function Go(g,A,B,D,O){A.isScene!==!0&&(A=St),J.resetTextureUnits();let ae=A.fog,ge=D.isMeshStandardMaterial||D.isMeshLambertMaterial||D.isMeshPhongMaterial?A.environment:null,he=ie===null?L.outputColorSpace:ie.isXRRenderTarget===!0?ie.texture.colorSpace:$e.workingColorSpace,Te=D.isMeshStandardMaterial||D.isMeshLambertMaterial&&!D.envMap||D.isMeshPhongMaterial&&!D.envMap,Re=oe.get(D.envMap||ge,Te),He=D.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,Ze=!!B.attributes.tangent&&(!!D.normalMap||D.anisotropy>0),Ee=!!B.morphAttributes.position,nt=!!B.morphAttributes.normal,Mt=!!B.morphAttributes.color,ut=an;D.toneMapped&&(ie===null||ie.isXRRenderTarget===!0)&&(ut=L.toneMapping);let lt=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,Ut=lt!==void 0?lt.length:0,be=H.get(D),Ht=b.state.lights;if(je===!0&&(tt===!0||g!==Q)){let ct=g===Q&&D.id===Z;Ce.setState(D,g,ct)}let Qe=!1;D.version===be.__version?(be.needsLights&&be.lightsStateVersion!==Ht.state.version||be.outputColorSpace!==he||O.isBatchedMesh&&be.batching===!1||!O.isBatchedMesh&&be.batching===!0||O.isBatchedMesh&&be.batchingColor===!0&&O._colorsTexture===null||O.isBatchedMesh&&be.batchingColor===!1&&O._colorsTexture!==null||O.isInstancedMesh&&be.instancing===!1||!O.isInstancedMesh&&be.instancing===!0||O.isSkinnedMesh&&be.skinning===!1||!O.isSkinnedMesh&&be.skinning===!0||O.isInstancedMesh&&be.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&be.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&be.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&be.instancingMorph===!1&&O.morphTexture!==null||be.envMap!==Re||D.fog===!0&&be.fog!==ae||be.numClippingPlanes!==void 0&&(be.numClippingPlanes!==Ce.numPlanes||be.numIntersection!==Ce.numIntersection)||be.vertexAlphas!==He||be.vertexTangents!==Ze||be.morphTargets!==Ee||be.morphNormals!==nt||be.morphColors!==Mt||be.toneMapping!==ut||be.morphTargetsCount!==Ut||!!be.lightProbeGrid!=b.state.lightProbeGridArray.length>0)&&(Qe=!0):(Qe=!0,be.__version=D.version);let ln=be.currentProgram;Qe===!0&&(ln=Un(D,A,O),z&&D.isNodeMaterial&&z.onUpdateProgram(D,ln,be));let Mn=!1,Zn=!1,zi=!1,at=ln.getUniforms(),yt=be.uniforms;if(_.useProgram(ln.program)&&(Mn=!0,Zn=!0,zi=!0),D.id!==Z&&(Z=D.id,Zn=!0),be.needsLights){let ct=Vo(b.state.lightProbeGridArray,O);be.lightProbeGrid!==ct&&(be.lightProbeGrid=ct,Zn=!0)}if(Mn||Q!==g){_.buffers.depth.getReversed()&&g.reversedDepth!==!0&&(g._reversedDepth=!0,g.updateProjectionMatrix()),at.setValue(F,"projectionMatrix",g.projectionMatrix),at.setValue(F,"viewMatrix",g.matrixWorldInverse);let Jn=at.map.cameraPosition;Jn!==void 0&&Jn.setValue(F,ot.setFromMatrixPosition(g.matrixWorld)),E.logarithmicDepthBuffer&&at.setValue(F,"logDepthBufFC",2/(Math.log(g.far+1)/Math.LN2)),(D.isMeshPhongMaterial||D.isMeshToonMaterial||D.isMeshLambertMaterial||D.isMeshBasicMaterial||D.isMeshStandardMaterial||D.isShaderMaterial)&&at.setValue(F,"isOrthographic",g.isOrthographicCamera===!0),Q!==g&&(Q=g,Zn=!0,zi=!0)}if(be.needsLights&&(Ht.state.sunShadowMap.length>0&&at.setValue(F,"sunShadowMap",Ht.state.sunShadowMap,J),Ht.state.directionalShadowMap.length>0&&at.setValue(F,"directionalShadowMap",Ht.state.directionalShadowMap,J),Ht.state.spotShadowMap.length>0&&at.setValue(F,"spotShadowMap",Ht.state.spotShadowMap,J),Ht.state.pointShadowMap.length>0&&at.setValue(F,"pointShadowMap",Ht.state.pointShadowMap,J)),O.isSkinnedMesh){at.setOptional(F,O,"bindMatrix"),at.setOptional(F,O,"bindMatrixInverse");let ct=O.skeleton;ct&&(ct.boneTexture===null&&ct.computeBoneTexture(),at.setValue(F,"boneTexture",ct.boneTexture,J))}O.isBatchedMesh&&(at.setOptional(F,O,"batchingTexture"),at.setValue(F,"batchingTexture",O._matricesTexture,J),at.setOptional(F,O,"batchingIdTexture"),at.setValue(F,"batchingIdTexture",O._indirectTexture,J),at.setOptional(F,O,"batchingColorTexture"),O._colorsTexture!==null&&at.setValue(F,"batchingColorTexture",O._colorsTexture,J));let $n=B.morphAttributes;if(($n.position!==void 0||$n.normal!==void 0||$n.color!==void 0)&&N.update(O,B,ln),(Zn||be.receiveShadow!==O.receiveShadow)&&(be.receiveShadow=O.receiveShadow,at.setValue(F,"receiveShadow",O.receiveShadow)),(D.isMeshStandardMaterial||D.isMeshLambertMaterial||D.isMeshPhongMaterial)&&D.envMap===null&&A.environment!==null&&(yt.envMapIntensity.value=A.environmentIntensity),yt.dfgLUT!==void 0&&(yt.dfgLUT.value=S0()),Zn){if(at.setValue(F,"toneMappingExposure",L.toneMappingExposure),be.needsLights&&R(yt,zi),ae&&D.fog===!0&&we.refreshFogUniforms(yt,ae),we.refreshMaterialUniforms(yt,D,ee,K,b.state.transmissionRenderTarget[g.id]),be.needsLights&&be.lightProbeGrid){let ct=be.lightProbeGrid;yt.probesSH.value=ct.texture,yt.probesMin.value.copy(ct.boundingBox.min),yt.probesMax.value.copy(ct.boundingBox.max),yt.probesResolution.value.copy(ct.resolution)}Es.upload(F,Tr(be),yt,J)}if(D.isShaderMaterial&&D.uniformsNeedUpdate===!0&&(Es.upload(F,Tr(be),yt,J),D.uniformsNeedUpdate=!1),D.isSpriteMaterial&&at.setValue(F,"center",O.center),at.setValue(F,"modelViewMatrix",O.modelViewMatrix),at.setValue(F,"normalMatrix",O.normalMatrix),at.setValue(F,"modelMatrix",O.matrixWorld),D.uniformsGroups!==void 0){let ct=D.uniformsGroups;for(let Jn=0,ki=ct.length;Jn<ki;Jn++){let Ec=ct[Jn];re.update(Ec,ln),re.bind(Ec,ln)}}return ln}function R(g,A){g.ambientLightColor.needsUpdate=A,g.lightProbe.needsUpdate=A,g.sunLights.needsUpdate=A,g.sunLightShadows.needsUpdate=A,g.directionalLights.needsUpdate=A,g.directionalLightShadows.needsUpdate=A,g.pointLights.needsUpdate=A,g.pointLightShadows.needsUpdate=A,g.spotLights.needsUpdate=A,g.spotLightShadows.needsUpdate=A,g.rectAreaLights.needsUpdate=A,g.hemisphereLights.needsUpdate=A}function Y(g){return g.isMeshLambertMaterial||g.isMeshToonMaterial||g.isMeshPhongMaterial||g.isMeshStandardMaterial||g.isShadowMaterial||g.isShaderMaterial&&g.lights===!0}this.getActiveCubeFace=function(){return X},this.getActiveMipmapLevel=function(){return $},this.getRenderTarget=function(){return ie},this.setRenderTargetTextures=function(g,A,B){let D=H.get(g);D.__autoAllocateDepthBuffer=g.resolveDepthBuffer===!1,D.__autoAllocateDepthBuffer===!1&&(D.__useRenderToTexture=!1),H.get(g.texture).__webglTexture=A,H.get(g.depthTexture).__webglTexture=D.__autoAllocateDepthBuffer?void 0:B,D.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(g,A){let B=H.get(g);B.__webglFramebuffer=A,B.__useDefaultFramebuffer=A===void 0},this.setRenderTarget=function(g,A=0,B=0){ie=g,X=A,$=B;let D=null,O=!1,ae=!1;if(g){let he=H.get(g);if(he.__useDefaultFramebuffer!==void 0){_.bindFramebuffer(F.FRAMEBUFFER,he.__webglFramebuffer),se.copy(g.viewport),le.copy(g.scissor),Me=g.scissorTest,_.viewport(se),_.scissor(le),_.setScissorTest(Me),Z=-1;return}else if(he.__webglFramebuffer===void 0)J.setupRenderTarget(g);else if(he.__hasExternalTextures)J.rebindTextures(g,H.get(g.texture).__webglTexture,H.get(g.depthTexture).__webglTexture);else if(g.depthBuffer){let He=g.depthTexture;if(he.__boundDepthTexture!==He){if(He!==null&&H.has(He)&&(g.width!==He.image.width||g.height!==He.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");J.setupDepthRenderbuffer(g)}}let Te=g.texture;(Te.isData3DTexture||Te.isDataArrayTexture||Te.isCompressedArrayTexture)&&(ae=!0);let Re=H.get(g).__webglFramebuffer;g.isWebGLCubeRenderTarget?(Array.isArray(Re[A])?D=Re[A][B]:D=Re[A],O=!0):g.samples>0&&J.useMultisampledRTT(g)===!1?D=H.get(g).__webglMultisampledFramebuffer:Array.isArray(Re)?D=Re[B]:D=Re,se.copy(g.viewport),le.copy(g.scissor),Me=g.scissorTest}else se.copy(ye).multiplyScalar(ee).floor(),le.copy(ke).multiplyScalar(ee).floor(),Me=vt;if(B!==0&&(D=k),_.bindFramebuffer(F.FRAMEBUFFER,D)&&_.drawBuffers(g,D),_.viewport(se),_.scissor(le),_.setScissorTest(Me),O){let he=H.get(g.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+A,he.__webglTexture,B)}else if(ae){let he=A;for(let Te=0;Te<g.textures.length;Te++){let Re=H.get(g.textures[Te]);F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0+Te,Re.__webglTexture,B,he)}}else if(g!==null&&B!==0){let he=H.get(g.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,he.__webglTexture,B)}Z=-1};function W(g){let A=H.get(g);return(A.__readFormat!==g.format||A.__readType!==g.type)&&(A.__readFormat=g.format,A.__readType=g.type,A.__formatReadable=E.textureFormatReadable(g.format),A.__typeReadable=E.textureTypeReadable(g.type)),A}this.readRenderTargetPixels=function(g,A,B,D,O,ae,ge,he=0){if(!(g&&g.isWebGLRenderTarget)){Fe("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Te=H.get(g).__webglFramebuffer;if(g.isWebGLCubeRenderTarget&&ge!==void 0&&(Te=Te[ge]),Te){_.bindFramebuffer(F.FRAMEBUFFER,Te);try{let Re=g.textures[he],He=Re.format,Ze=Re.type;g.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+he);let Ee=W(Re);if(Ee.__formatReadable===!1){Fe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Ee.__typeReadable===!1){Fe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}A>=0&&A<=g.width-D&&B>=0&&B<=g.height-O&&F.readPixels(A,B,D,O,pe.convert(He),pe.convert(Ze),ae)}finally{let Re=ie!==null?H.get(ie).__webglFramebuffer:null;_.bindFramebuffer(F.FRAMEBUFFER,Re)}}},this.readRenderTargetPixelsAsync=async function(g,A,B,D,O,ae,ge,he=0){if(!(g&&g.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Te=H.get(g).__webglFramebuffer;if(g.isWebGLCubeRenderTarget&&ge!==void 0&&(Te=Te[ge]),Te)if(A>=0&&A<=g.width-D&&B>=0&&B<=g.height-O){_.bindFramebuffer(F.FRAMEBUFFER,Te);let Re=g.textures[he],He=Re.format,Ze=Re.type;g.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+he);let Ee=W(Re);if(Ee.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Ee.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let nt=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,nt),F.bufferData(F.PIXEL_PACK_BUFFER,ae.byteLength,F.STREAM_READ),F.readPixels(A,B,D,O,pe.convert(He),pe.convert(Ze),0),F.bindBuffer(F.PIXEL_PACK_BUFFER,null);let Mt=ie!==null?H.get(ie).__webglFramebuffer:null;_.bindFramebuffer(F.FRAMEBUFFER,Mt);let ut=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await Ih(F,ut,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,nt),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,ae),F.bindBuffer(F.PIXEL_PACK_BUFFER,null),F.deleteBuffer(nt),F.deleteSync(ut),ae}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(g,A=null,B=0){let D=Math.pow(2,-B),O=Math.floor(g.image.width*D),ae=Math.floor(g.image.height*D),ge=A!==null?A.x:0,he=A!==null?A.y:0;J.setTexture2D(g,0),F.copyTexSubImage2D(F.TEXTURE_2D,B,0,0,ge,he,O,ae),_.unbindTexture()},this.copyTextureToTexture=function(g,A,B=null,D=null,O=0,ae=0){let ge,he,Te,Re,He,Ze,Ee,nt,Mt,ut=g.isCompressedTexture?g.mipmaps[ae]:g.image;if(B!==null)ge=B.max.x-B.min.x,he=B.max.y-B.min.y,Te=B.isBox3?B.max.z-B.min.z:1,Re=B.min.x,He=B.min.y,Ze=B.isBox3?B.min.z:0;else{let yt=Math.pow(2,-O);ge=Math.floor(ut.width*yt),he=Math.floor(ut.height*yt),g.isDataArrayTexture?Te=ut.depth:g.isData3DTexture?Te=Math.floor(ut.depth*yt):Te=1,Re=0,He=0,Ze=0}D!==null?(Ee=D.x,nt=D.y,Mt=D.z):(Ee=0,nt=0,Mt=0);let lt=pe.convert(A.format),Ut=pe.convert(A.type),be;A.isData3DTexture?(J.setTexture3D(A,0),be=F.TEXTURE_3D):A.isDataArrayTexture||A.isCompressedArrayTexture?(J.setTexture2DArray(A,0),be=F.TEXTURE_2D_ARRAY):(J.setTexture2D(A,0),be=F.TEXTURE_2D),_.activeTexture(F.TEXTURE0),_.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,A.flipY),_.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),_.pixelStorei(F.UNPACK_ALIGNMENT,A.unpackAlignment);let Ht=_.getParameter(F.UNPACK_ROW_LENGTH),Qe=_.getParameter(F.UNPACK_IMAGE_HEIGHT),ln=_.getParameter(F.UNPACK_SKIP_PIXELS),Mn=_.getParameter(F.UNPACK_SKIP_ROWS),Zn=_.getParameter(F.UNPACK_SKIP_IMAGES);_.pixelStorei(F.UNPACK_ROW_LENGTH,ut.width),_.pixelStorei(F.UNPACK_IMAGE_HEIGHT,ut.height),_.pixelStorei(F.UNPACK_SKIP_PIXELS,Re),_.pixelStorei(F.UNPACK_SKIP_ROWS,He),_.pixelStorei(F.UNPACK_SKIP_IMAGES,Ze);let zi=g.isDataArrayTexture||g.isData3DTexture,at=A.isDataArrayTexture||A.isData3DTexture;if(g.isDepthTexture){let yt=H.get(g),$n=H.get(A),ct=H.get(yt.__renderTarget),Jn=H.get($n.__renderTarget);_.bindFramebuffer(F.READ_FRAMEBUFFER,ct.__webglFramebuffer),_.bindFramebuffer(F.DRAW_FRAMEBUFFER,Jn.__webglFramebuffer);for(let ki=0;ki<Te;ki++)zi&&(F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,H.get(g).__webglTexture,O,Ze+ki),F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,H.get(A).__webglTexture,ae,Mt+ki)),F.blitFramebuffer(Re,He,ge,he,Ee,nt,ge,he,F.DEPTH_BUFFER_BIT,F.NEAREST);_.bindFramebuffer(F.READ_FRAMEBUFFER,null),_.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else if(O!==0||g.isRenderTargetTexture||H.has(g)){let yt=H.get(g),$n=H.get(A);_.bindFramebuffer(F.READ_FRAMEBUFFER,C),_.bindFramebuffer(F.DRAW_FRAMEBUFFER,G);for(let ct=0;ct<Te;ct++)zi?F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,yt.__webglTexture,O,Ze+ct):F.framebufferTexture2D(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,yt.__webglTexture,O),at?F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,$n.__webglTexture,ae,Mt+ct):F.framebufferTexture2D(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,$n.__webglTexture,ae),O!==0?F.blitFramebuffer(Re,He,ge,he,Ee,nt,ge,he,F.COLOR_BUFFER_BIT,F.NEAREST):at?F.copyTexSubImage3D(be,ae,Ee,nt,Mt+ct,Re,He,ge,he):F.copyTexSubImage2D(be,ae,Ee,nt,Re,He,ge,he);_.bindFramebuffer(F.READ_FRAMEBUFFER,null),_.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else at?g.isDataTexture||g.isData3DTexture?F.texSubImage3D(be,ae,Ee,nt,Mt,ge,he,Te,lt,Ut,ut.data):A.isCompressedArrayTexture?F.compressedTexSubImage3D(be,ae,Ee,nt,Mt,ge,he,Te,lt,ut.data):F.texSubImage3D(be,ae,Ee,nt,Mt,ge,he,Te,lt,Ut,ut):g.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,ae,Ee,nt,ge,he,lt,Ut,ut.data):g.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,ae,Ee,nt,ut.width,ut.height,lt,ut.data):F.texSubImage2D(F.TEXTURE_2D,ae,Ee,nt,ge,he,lt,Ut,ut);_.pixelStorei(F.UNPACK_ROW_LENGTH,Ht),_.pixelStorei(F.UNPACK_IMAGE_HEIGHT,Qe),_.pixelStorei(F.UNPACK_SKIP_PIXELS,ln),_.pixelStorei(F.UNPACK_SKIP_ROWS,Mn),_.pixelStorei(F.UNPACK_SKIP_IMAGES,Zn),ae===0&&A.generateMipmaps&&F.generateMipmap(be),_.unbindTexture()},this.initRenderTarget=function(g){H.get(g).__webglFramebuffer===void 0&&J.setupRenderTarget(g)},this.initTexture=function(g){g.isCubeTexture?J.setTextureCube(g,0):g.isData3DTexture?J.setTexture3D(g,0):g.isDataArrayTexture||g.isCompressedArrayTexture?J.setTexture2DArray(g,0):J.setTexture2D(g,0),_.unbindTexture()},this.resetState=function(){X=0,$=0,ie=null,_.reset(),ve.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return _n}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=$e._getDrawingBufferColorSpace(e),t.unpackColorSpace=$e._getUnpackColorSpace()}};var M0=Math.PI*2,hu=.08;function b0(i,e,t){if(t<=0)return i/e;let n=e*hu,s=(e-n)/t,a=e*s-t*s*s/2;return i>=a?s+(i-a)/n:2*i/(e+Math.sqrt(e*e-2*t*i))}function Cs(i,e,t){return Math.sqrt(e*e+Math.max(0,i)*t/Math.PI)}function xo(i,e,t,n,s,a){let r=-e-n;if(r<=0)return[i,e,t];let o=a/M0,c=b0(r,s,o),l=Math.max(s-o*c,s*hu)-t;return[i,-(n+l*Math.sin(c)),s-l*Math.cos(c)]}var vo=class extends er{constructor(e){super(e),this.type=qt}parse(e){let r=function(x,M){switch(x){case 1:throw new Error("THREE.HDRLoader: Read Error: "+(M||""));case 2:throw new Error("THREE.HDRLoader: Write Error: "+(M||""));case 3:throw new Error("THREE.HDRLoader: Bad File Format: "+(M||""));default:case 4:throw new Error("THREE.HDRLoader: Memory Error: "+(M||""))}},f=function(x,M,L){M=M||1024;let z=x.pos,k=-1,C=0,G="",X=String.fromCharCode.apply(null,new Uint16Array(x.subarray(z,z+128)));for(;0>(k=X.indexOf(`
`))&&C<M&&z<x.byteLength;)G+=X,C+=X.length,z+=128,X=String.fromCharCode.apply(null,new Uint16Array(x.subarray(z,z+128)));return-1<k?(L!==!1&&(x.pos+=C+k+1),G+X.slice(0,k)):!1},u=function(x){let M=/^#\?(\S+)/,L=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,I=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,z=/^\s*FORMAT=(\S+)\s*$/,k=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,C={valid:0,string:"",comments:"",programtype:"RGBE",format:"",gamma:1,exposure:1,width:0,height:0},G,X;for((x.pos>=x.byteLength||!(G=f(x)))&&r(1,"no header found"),(X=G.match(M))||r(3,"bad initial token"),C.valid|=1,C.programtype=X[1],C.string+=G+`
`;G=f(x),G!==!1;){if(C.string+=G+`
`,G.charAt(0)==="#"){C.comments+=G+`
`;continue}if((X=G.match(L))&&(C.gamma=parseFloat(X[1])),(X=G.match(I))&&(C.exposure=parseFloat(X[1])),(X=G.match(z))&&(C.valid|=2,C.format=X[1]),(X=G.match(k))&&(C.valid|=4,C.height=parseInt(X[1],10),C.width=parseInt(X[2],10)),C.valid&2&&C.valid&4)break}return C.valid&2||r(3,"missing format specifier"),C.valid&4||r(3,"missing image size specifier"),C},d=function(x,M,L){let I=M;if(I<8||I>32767||x[0]!==2||x[1]!==2||x[2]&128)return new Uint8Array(x);I!==(x[2]<<8|x[3])&&r(3,"wrong scanline width");let z=new Uint8Array(4*M*L);z.length||r(4,"unable to allocate buffer space");let k=0,C=0,G=4*I,X=new Uint8Array(4),$=new Uint8Array(G),ie=L;for(;ie>0&&C<x.byteLength;){C+4>x.byteLength&&r(1),X[0]=x[C++],X[1]=x[C++],X[2]=x[C++],X[3]=x[C++],(X[0]!=2||X[1]!=2||(X[2]<<8|X[3])!=I)&&r(3,"bad rgbe scanline format");let Z=0,Q;for(;Z<G&&C<x.byteLength;){Q=x[C++];let le=Q>128;if(le&&(Q-=128),(Q===0||Z+Q>G)&&r(3,"bad scanline data"),le){let Me=x[C++];for(let Ue=0;Ue<Q;Ue++)$[Z++]=Me}else $.set(x.subarray(C,C+Q),Z),Z+=Q,C+=Q}let se=I;for(let le=0;le<se;le++){let Me=0;z[k]=$[le+Me],Me+=I,z[k+1]=$[le+Me],Me+=I,z[k+2]=$[le+Me],Me+=I,z[k+3]=$[le+Me],k+=4}ie--}return z},v=function(x,M,L,I){let z=x[M+3],k=Math.pow(2,z-128)/255;L[I+0]=x[M+0]*k,L[I+1]=x[M+1]*k,L[I+2]=x[M+2]*k,L[I+3]=1},S=function(x,M,L,I){let z=x[M+3],k=Math.pow(2,z-128)/255;L[I+0]=si.toHalfFloat(Math.min(x[M+0]*k,65504)),L[I+1]=si.toHalfFloat(Math.min(x[M+1]*k,65504)),L[I+2]=si.toHalfFloat(Math.min(x[M+2]*k,65504)),L[I+3]=si.toHalfFloat(1)},m=new Uint8Array(e);m.pos=0;let p=u(m),T=p.width,U=p.height,y=d(m.subarray(m.pos),T,U),w,b,P;switch(this.type){case jt:P=y.length/4;let x=new Float32Array(P*4);for(let L=0;L<P;L++)v(y,L*4,x,L*4);w=x,b=jt;break;case qt:P=y.length/4;let M=new Uint16Array(P*4);for(let L=0;L<P;L++)S(y,L*4,M,L*4);w=M,b=qt;break;default:throw new Error("THREE.HDRLoader: Unsupported type: "+this.type)}return{width:T,height:U,data:w,header:p.string,gamma:p.gamma,exposure:p.exposure,type:b,colorSpace:Ei,minFilter:ft,magFilter:ft,generateMipmaps:!1,flipY:!0}}setDataType(e){return this.type=e,this}};var cc=i=>(i=Pt.clamp(i,0,1),i*i*(3-2*i)),yo=class{constructor(e,t,n,s){this.template=s,this.width=s.width,this.height=s.height,this.progress=0,this.renderCount=0,this.paperProgress=0,this.renderer=new mo({canvas:e,antialias:!0,alpha:!0,preserveDrawingBuffer:!0,powerPreference:"low-power"});let a=this.renderer;a.setPixelRatio(Math.min(devicePixelRatio,2)),a.setClearColor(0,0),a.outputColorSpace=Rt,a.toneMapping=sr,a.toneMappingExposure=1.08,a.shadowMap.enabled=!0,a.shadowMap.type=Ri,this.scene=new qs,this.camera=new ui(-4,4,4,-4,.1,30),this.camera.position.set(0,0,12),this.camera.lookAt(0,0,0),this.scene.add(new nr(15851452,4935767,1.1));let r=new Ai(16769978,2.8);r.position.set(-3,4,6),r.castShadow=!0,r.shadow.mapSize.set(1024,1024),Object.assign(r.shadow.camera,{left:-4,right:4,top:5,bottom:-5,near:.1,far:20}),r.shadow.normalBias=.015,this.scene.add(r);let o=new Ai(12175825,.9);o.position.set(4,0,4),this.scene.add(o);let c=new Ai(16043907,.7);c.position.set(-3,-2,-1),this.scene.add(c),this.maps=[new ri(t.front),new ri(t.back),new It(n)];for(let u of this.maps)u.needsUpdate=!0,u.colorSpace=Rt,u.anisotropy=Math.min(8,a.capabilities.getMaxAnisotropy());let[l,h,f]=this.maps;this.geometry=new kt(this.width,this.height,40,300),this.geometry.attributes.position.setUsage(kl),this.base=new Float32Array(this.geometry.attributes.position.array),this.material=new js({map:l,roughness:.84,metalness:0,side:Tt,alphaTest:.55,bumpMap:h,bumpScale:.009,sheen:.16,sheenRoughness:.9,sheenColor:15782049}),this.material.onBeforeCompile=u=>{u.uniforms.backPaper={value:h},u.fragmentShader=`uniform sampler2D backPaper;
`+u.fragmentShader,u.fragmentShader=u.fragmentShader.replace("#include <map_fragment>",`#ifdef USE_MAP
    vec4 sheetColor=gl_FrontFacing?texture2D(map,vMapUv):texture2D(backPaper,vMapUv);
    diffuseColor*=sheetColor;
    #endif`)},this.material.customProgramCacheKey=()=>"vellum-front-reverse-v3",this.sheet=new mt(this.geometry,this.material),this.sheet.castShadow=!0,this.sheet.receiveShadow=!0,this.scene.add(this.sheet),this.keeper=new mt(new kt(.53,.99),new vn({map:f,transparent:!0,depthWrite:!1,toneMapped:!1})),this.keeper.renderOrder=5,this.scene.add(this.keeper),this.environmentReady=new vo().loadAsync(s.environment).then(u=>{let d=new ws(a);this.environment=d.fromEquirectangular(u),this.scene.environment=this.environment.texture,this.scene.environmentIntensity=.22,u.dispose(),d.dispose()}).catch(()=>{})}setProgress(e){this.progress=Pt.clamp(e,0,1);let t=cc(this.progress/.18),n=Pt.clamp((this.progress-.18)/.82,0,1);this.paperProgress=n,this.keeper.position.set(-t*3.05,-.01+.1*Math.sin(t*Math.PI),.62),this.keeper.rotation.z=t*.2,this.keeper.material.opacity=1-cc((t-.72)/.28),this.keeper.visible=t<.999;let s=-this.height/2+n*this.height,a=Math.max(0,this.height/2-s),r=Cs(a,this.template.coreRadius,this.template.layerThickness),o=this.geometry.attributes.position,c=1/0,l=-1/0;for(let h=0;h<o.count;h++){let f=this.base[h*3],u=this.base[h*3+1],d=Math.pow(Math.abs(f)/(this.width/2),6),v=.009*Math.sin(u*4+f*2)+.038*d*Math.sin(u*3.2+.4),[S,m,p]=xo(f,u,v,s,r,this.template.layerThickness),T=n>.94?.055*cc((n-.94)/.06)*Math.exp(-Math.pow((u+this.height/2)/.17,2)):0;o.setXYZ(h,S,m,p+T),c=Math.min(c,m),l=Math.max(l,m)}o.needsUpdate=!0,this.geometry.computeVertexNormals(),this.geometry.computeBoundingSphere(),this.sheet.position.y=-(c+l)/2,this.bounds={bottom:c+this.sheet.position.y,top:l+this.sheet.position.y}}resize(e,t){if(!e||!t)return;this.renderer.setSize(e,t,!1);let n=e/t,s=Math.max(this.height+.7,(this.width+.45)/n);this.viewHeight=s,Object.assign(this.camera,{left:-s*n/2,right:s*n/2,top:s/2,bottom:-s/2}),this.camera.updateProjectionMatrix()}render(){this.renderer.render(this.scene,this.camera),this.renderCount++}snapshot(){return{progress:this.progress,paperProgress:this.paperProgress,renderCount:this.renderCount,vertices:this.geometry.attributes.position.count,camera:this.camera.position.toArray(),keeperVisible:this.keeper.visible,viewHeight:this.viewHeight}}exportObject(){return this.render(),this.renderer.domElement.toDataURL("image/png")}dispose(){this.geometry.dispose(),this.material.dispose(),this.keeper.geometry.dispose(),this.keeper.material.dispose();for(let e of this.maps)e.dispose();this.environment?.dispose(),this.renderer.dispose()}};var uu=`
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
`,Is=class extends yo{constructor(e,t,n,s){super(e,t,n,s),this.renderer.setPixelRatio(1),this.renderer.toneMapping=an,this.renderer.toneMappingExposure=1;for(let h of this.scene.children.filter(f=>f.isLight))h.color.set(16777215),h.isHemisphereLight?(h.groundColor.set(12959665),h.intensity=.9):h.castShadow?h.intensity=2.4:h.intensity=h.position.z>0?.35:.12;this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Ma,this.geometry.dispose(),this.geometry=new kt(this.width,this.height,52,280),this.sheet.geometry=this.geometry,this.sheet.frustumCulled=!1,this.sheet.castShadow=!0,this.sheet.receiveShadow=!1,this.keeper.geometry.dispose(),this.keeper.geometry=new kt(.41,.77),this.uniforms={scrollBoundary:{value:0},scrollRadius:{value:.2},scrollThickness:{value:s.layerThickness},scrollHeight:{value:this.height},scrollWidth:{value:this.width},scrollOpen:{value:0}},this.material.bumpMap=null,this.material.sheen=0,this.material.specularIntensity=0,this.material.roughness=.97,this.material.envMapIntensity=.07;let a=this.material.onBeforeCompile;this.material.onBeforeCompile=h=>{a(h),Object.assign(h.uniforms,this.uniforms),h.vertexShader=uu+h.vertexShader,h.vertexShader=h.vertexShader.replace("#include <beginnormal_vertex>","vec3 objectNormal=normalize(cross(parchment(position+vec3(.001,0.,0.))-parchment(position-vec3(.001,0.,0.)),parchment(position+vec3(0.,.001,0.))-parchment(position-vec3(0.,.001,0.))));"),h.vertexShader=h.vertexShader.replace("#include <begin_vertex>","vec3 transformed=parchment(position);"),h.fragmentShader=h.fragmentShader.replace("#include <roughnessmap_fragment>",`float roughnessFactor=roughness;
    #ifdef USE_ROUGHNESSMAP
      roughnessFactor=.88+.10*texture2D(roughnessMap,vRoughnessMapUv).g;
    #endif`),h.fragmentShader=h.fragmentShader.replace("#include <opaque_fragment>",`outgoingLight=mix(outgoingLight,diffuseColor.rgb,.45*smoothstep(.65,.98,abs(normal.z)));
    #include <opaque_fragment>`)},this.material.customProgramCacheKey=()=>"charter-continuous-matte-v6",this.material.needsUpdate=!0;let r=new _s({map:this.maps[0],alphaTest:.55,side:Tt,depthPacking:zl});r.onBeforeCompile=h=>{Object.assign(h.uniforms,this.uniforms),h.vertexShader=uu+h.vertexShader,h.vertexShader=h.vertexShader.replace("#include <begin_vertex>","vec3 transformed=parchment(position);")},r.customProgramCacheKey=()=>"charter-continuous-shadow-v6",this.sheet.customDepthMaterial=r;let o=new mt(new kt(20,20),new Ks({opacity:.2}));o.position.z=-.1,o.receiveShadow=!0,this.scene.add(o),this.renderer.shadowMap.autoUpdate=!1;let c=new wi,l=this.environmentReady;this.environmentReady=Promise.all([l,c.loadAsync(s.paperNormal||"../chapter-scroll-v4/assets/skin-normal.jpg"),c.loadAsync(s.paperRoughness||"../chapter-scroll-v4/assets/skin-roughness.jpg")]).then(([,h,f])=>{for(let u of[h,f])u.wrapS=u.wrapT=rs,u.repeat.set(1.4,2.1),this.maps.push(u);this.material.normalMap=h,this.material.normalScale.set(.035,.035),this.material.roughnessMap=f,this.material.needsUpdate=!0}),this.dirty=!0}setProgress(e){this.progress=Pt.clamp(e,0,1);let t=Pt.smoothstep(this.progress,0,.18),n=Pt.clamp((this.progress-.18)/.82,0,1);this.paperProgress=n,this.keeper.position.set(-t*3.05,-.01+.1*Math.sin(t*Math.PI),.62),this.keeper.rotation.z=t*.2,this.keeper.material.opacity=1-Pt.smoothstep(t,.72,1),this.keeper.visible=t<.999;let s=-this.height/2+n*this.height,a=Cs(this.height*(1-n),this.template.coreRadius,this.template.layerThickness);this.uniforms.scrollBoundary.value=s,this.uniforms.scrollRadius.value=a,this.uniforms.scrollOpen.value=n;let r=1/0,o=-1/0;for(let c=0;c<=280;c++){let l=-this.height/2+c*this.height/280,[,h]=xo(0,l,0,s,a,this.template.layerThickness);r=Math.min(r,h),o=Math.max(o,h)}this.sheet.position.y=-(r+o)/2,this.bounds={bottom:r+this.sheet.position.y,top:o+this.sheet.position.y},this.renderer.shadowMap.needsUpdate=!0,this.dirty=!0}advance(){}settle(){this.dirty=!0}get needsMotion(){return!1}resize(e,t){if(!e||!t)return;let n=window.devicePixelRatio||1,s=35e5,a=Math.min(1,Math.sqrt(s/(e*t*n*n)));this.renderer.setSize(Math.floor(e*n*a),Math.floor(t*n*a),!1);let r=e/t,o=Math.max(this.height+.66,(this.width+.45)/r);this.viewHeight=o,Object.assign(this.camera,{left:-o*r/2,right:o*r/2,top:o/2,bottom:-o/2}),this.camera.updateProjectionMatrix(),this.dirty=!0}render(){super.render(),this.dirty=!1}snapshot(){return{...super.snapshot(),drawBuffer:{width:this.renderer.domElement.width,height:this.renderer.domElement.height},deformation:"Continuous GPU winding and shared rest displacement",keeperMotion:"v4 rigid take-off",keeperSize:[.41,.77],specularIntensity:this.material.specularIntensity,toneMapping:"none; preserve source colors",restCurl:!0}}};var So=(i,e,t)=>{let n=Math.max(0,Math.min(1,(t-i)/(e-i)));return n*n*(3-2*n)},Qt=Object.freeze({releaseEnd:.24,width:.41,height:.77,bandWidth:.216,closedGap:.058,looseGap:.13});function gr(i,e){let t=Math.max(0,Math.min(1,i/Qt.releaseEnd)),n=So(0,.27,t),s=So(.27,.82,t),a=So(.82,1,t),r=Cs(e.height,e.coreRadius,e.layerThickness);return{x:-(e.width/2+Qt.width/2+.11)*s-.7*a,y:-.025*a,z:.045*n+.85*a,rotationZ:-.11*a,rotationY:.16*a,loosen:n,opacity:1-So(.89,1,t),visible:i<Qt.releaseEnd,phase:t<.27?"loosen":t<.82?"unthread":t<1?"depart":"off",radius:r,paperProgress:Math.max(0,Math.min(1,(i-Qt.releaseEnd)/(1-Qt.releaseEnd)))}}var T0=`
float iy=1.0-vMapUv.y;
float left=mix(.305,.262,smoothstep(.28,.34,iy))+.043*smoothstep(.76,.9,iy);
float right=mix(.704,.758,smoothstep(.28,.35,iy))-.046*smoothstep(.76,.91,iy);
if(vMapUv.x<left||vMapUv.x>right)discard;
`;function du(i,e){let t=new vn({map:i,transparent:!0,alphaTest:.08,depthWrite:!0,depthTest:!0,toneMapped:!1,side:Tt});return t.onBeforeCompile=n=>{n.fragmentShader=n.fragmentShader.replace("#include <alphatest_fragment>",`#include <alphatest_fragment>
${T0}
${e?"if(iy<.30||iy>.76)discard;":"if(iy>=.30&&iy<=.76)discard;"}`)},t.customProgramCacheKey=()=>`keeper-layer-v8-${e}`,t}function fu(i,e,t,n){let s=i.clone();for(let a=0;a<i.count;a++){let r=i.getX(a),o=i.getY(a),c=Math.max(0,Math.abs(o)-.16),l=n?o:o+Math.sign(o)*c*.31*t,h=e+Qt.closedGap+(Qt.looseGap-Qt.closedGap)*t,f=n?h+.029:Math.sqrt(Math.max(.002,h*h-l*l))+.016;s.setXYZ(a,r,l,e+f)}return s}function pu(i,e){let t=new kt(Qt.width,Qt.height,12,84),n=t.attributes.position.clone();return t.setAttribute("position",fu(n,i,0,e)),t.morphAttributes.position=[fu(n,i,1,e)],t.computeVertexNormals(),t}function E0(i){let e=[],t=[],n=[],s=[];for(let o=0;o<=112;o++)for(let c=0;c<4;c++){let l=o/112*Math.PI*2,h=(c%2?.5:-.5)*Qt.bandWidth,f=c>=2?.009:0;for(let[u,d]of[[e,Qt.closedGap],[t,Qt.looseGap]]){let v=i+d-f;u.push(h,Math.sin(l)*v,i+Math.cos(l)*v)}n.push(.38+.22*(c%2),.795+.06*(.5+.5*Math.cos(l*4)))}for(let o=0;o<112;o++)for(let[c,l]of[[0,1],[1,3],[3,2],[2,0]]){let h=o*4;s.push(h+c,h+l,h+l+4,h+c,h+l+4,h+c+4)}let r=new un;return r.setAttribute("position",new Bt(e,3)),r.setAttribute("uv",new Bt(n,2)),r.setIndex(s),r.morphAttributes.position=[new Bt(t,3)],r.computeVertexNormals(),r}var Mo=class{constructor(e,t,n){this.template=n,this.group=new xn,e.add(this.group);let{radius:s}=gr(0,n);this.band=new mt(E0(s),new gs({map:t,roughness:.96,metalness:0,side:Tt})),this.front=new mt(pu(s,!1),du(t,!1)),this.plate=new mt(pu(s,!0),du(t,!0)),this.parts=[this.band,this.front,this.plate],this.group.add(...this.parts);for(let a of this.parts)a.frustumCulled=!1,a.renderOrder=0}update(e,t){let n=this.pose=gr(e,this.template);this.group.visible=n.visible,this.group.position.set(n.x,t+n.y,n.z),this.group.rotation.set(0,n.rotationY,n.rotationZ);for(let s of this.parts)s.morphTargetInfluences[0]=n.loosen,s.material.opacity=n.opacity,s.material.transparent=n.opacity<1||s!==this.band}snapshot(){return{...this.pose,model:"layered hoop + rigid buckle + authored tight/loose morph",depthTest:!0,depthWrite:!0}}dispose(){for(let e of this.parts)e.geometry.dispose(),e.material.dispose();this.group.removeFromParent()}};var bo=class extends Is{constructor(e,t,n,s){super(e,t,n,s),this.scene.remove(this.keeper),this.keeper.visible=!1,this.closure=new Mo(this.scene,this.maps[2],s),this.camera=new Ot(35,1,.1,40),this.camera.position.set(0,0,12),this.camera.lookAt(0,0,0),this.sealBump=new ri(t.relief),this.sealBump.needsUpdate=!0,this.material.bumpMap=this.sealBump,this.material.bumpScale=.0025;let a=this.material.onBeforeCompile;this.material.onBeforeCompile=r=>{a(r),r.fragmentShader=r.fragmentShader.replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
    #if defined(USE_BUMPMAP) && defined(USE_NORMALMAP_TANGENTSPACE)
     normal=perturbNormalArb(-vViewPosition,normal,dHdxy_fwd(),faceDirection);
    #endif`)},this.material.customProgramCacheKey=()=>"charter-v8-composed-impression",this.material.needsUpdate=!0}setProgress(e){let t=Pt.clamp(e,0,1),n=gr(t,this.template);super.setProgress(.18+.82*n.paperProgress),this.progress=t,this.closure&&this.closure.update(t,this.height/2+this.sheet.position.y)}resize(e,t){if(!e||!t)return;let n=window.devicePixelRatio||1,s=Math.min(1,Math.sqrt(35e5/(e*t*n*n)));this.renderer.setSize(Math.floor(e*n*s),Math.floor(t*n*s),!1);let a=e/t,r=Math.max(this.height+.76,(this.width+.6)/a);this.viewHeight=r,this.camera.aspect=a,this.camera.fov=Pt.radToDeg(2*Math.atan(r/(2*this.camera.position.z))),this.camera.updateProjectionMatrix(),this.dirty=!0}snapshot(){return{...super.snapshot(),cameraType:"PerspectiveCamera",keeperVisible:this.closure?.group.visible??!1,keeperMotion:"loosen, unthread, then approach; exact reverse on closing",keeperPose:this.closure?.snapshot(),sealRelief:!0}}dispose(){this.closure.dispose(),this.sealBump.dispose(),super.dispose()}};var To=class extends bo{constructor(...e){super(...e),this.material.bumpScale=.0045}setSurfaces(e){this.maps[0].image=e.front,this.maps[0].needsUpdate=!0,this.maps[1].image=e.back,this.maps[1].needsUpdate=!0,this.sealBump.image=e.relief,this.sealBump.needsUpdate=!0,this.dirty=!0}};var Eo=class extends To{constructor(...e){super(...e),this.motionPrepared=!1;let t=this.closure.update.bind(this.closure);this.closure.update=(...n)=>{t(...n);for(let s of this.closure.parts)s.material.transparent=!0},this.closure.update(0,0)}async prepareMotion(e){let t=performance.now();await this.environmentReady;for(let n of new Set([...this.maps,this.sealBump]))this.renderer.initTexture(n);await this.renderer.compileAsync(this.scene,this.camera);for(let n of[0,.11,.225,1,e])this.setProgress(n),this.render(),await new Promise(s=>requestAnimationFrame(s));this.motionPrepared=!0,this.preparationMs=performance.now()-t,this.preparedPrograms=this.renderer.info.programs.length}snapshot(){return{...super.snapshot(),runtime:{motionPrepared:this.motionPrepared,preparationMs:this.preparationMs,preparedPrograms:this.preparedPrograms,programs:this.renderer.info.programs.length}}}};var _r=.38,mu=(i,e,t)=>{let n=Math.max(0,Math.min(1,(t-i)/(e-i)));return n*n*(3-2*n)},wo=class{constructor(e,t){this.template=t,this.group=new xn,this.group.name="authored-silk-cord-frames",e.add(this.group),this.maps=[],this.parts=[],this.pending=[0,0],this.pose={phase:"loading"},this.ready=this.load()}async load(){let e=await(await fetch(new URL("./assets/cord-frames.json",import.meta.url))).json();this.manifest=e;let t=new wi,n=0,s=async c=>{let l=await t.loadAsync(new URL(c,import.meta.url).href);return l.colorSpace=Rt,l.generateMipmaps=!1,l.minFilter=l.magFilter=ft,this.maps.push(l),this.onLoadingProgress?.(++n/(e.pages.length+1)),l};this.pages=await Promise.all(e.pages.map(s));let a=await s(e.rear);for(let c of this.pages)c.repeat.set(1/e.columns,1/e.rows);let r=c=>new vn({map:c,transparent:!0,alphaTest:.015,depthTest:!0,depthWrite:!1,toneMapped:!1,side:Tt}),o=new kt(e.worldSize,e.worldSize);this.front=new mt(o,r(this.pages[0])),this.back=new mt(o.clone(),r(a)),this.front.position.z=.635,this.back.position.z=-.014,this.front.renderOrder=3,this.back.renderOrder=-1,this.parts=[this.back,this.front],this.group.add(...this.parts),this.parts.forEach(c=>c.frustumCulled=!1),this.update(...this.pending)}update(e,t){if(this.pending=[e,t],!this.manifest)return;let n=Pt.clamp(e/_r,0,1),s=Math.min(this.manifest.frames-1,Math.round(n*(this.manifest.frames-1))),a=Math.floor(s/16),r=s%16,o=this.pages[a];o.offset.set(r%4/4,1-(Math.floor(r/4)+1)/4),this.front.material.map=o;let c=mu(.77,1,n);this.group.position.set(-4.1*c,t-.16*Math.sin(c*Math.PI),.06*mu(.58,.78,n)),this.group.rotation.z=.09*c,this.group.visible=e<_r,this.pose={phase:n<.08?"take-up":n<.43?"release-first-loop":n<.65?"release-second-loop":n<.78?"open-binding":"lift-clear",frame:s,frames:this.manifest.frames,progress:n,visible:this.group.visible,x:this.group.position.x,y:this.group.position.y,z:this.group.position.z,opacity:1,usesFade:!1,mode:"prebaked transparent 2D frames; fixed frontal viewing",physicalSimulation:!1}}snapshot(){return{...this.pose,sourceSha256:this.manifest?.sourceSha256,decodedRGBABytes:this.manifest?.decodedRGBABytes}}exportFrame(){if(!this.manifest)return"";let e=this.manifest.frameSize,t=this.pose.frame||0,n=Math.floor(t/16),s=t%16,a=document.createElement("canvas");return a.width=a.height=e,a.getContext("2d").drawImage(this.pages[n].image,s%4*e,Math.floor(s/4)*e,e,e,0,0,e,e),a.toDataURL("image/png")}dispose(){for(let e of this.parts)e.geometry.dispose(),e.material.dispose();this.maps.forEach(e=>e.dispose()),this.group.removeFromParent()}};var Ao=class extends Eo{constructor(...e){super(...e),this.closure.dispose(),this.closure=new wo(this.scene,this.template),this.integrated=!0;let t=this.environmentReady;this.environmentReady=Promise.all([t,this.closure.ready]).then(()=>{this.maps.push(...this.closure.maps);for(let s of[this.material.normalMap,this.material.roughnessMap])s.wrapS=s.wrapT=$t,s.repeat.set(1,1),s.needsUpdate=!0;this.material.normalScale.set(.11,.11),this.material.needsUpdate=!0});let n=s=>{s.vertexShader=s.vertexShader.replace("v.z=.009*sin",`float u=q.x/scrollWidth+.5, sheetV=.5-q.y/scrollHeight;
   float diagonal=exp(-pow((sheetV-(.11+.365*u))/.009,2.))*(1.-smoothstep(.42,.55,u));
   float crossfold=exp(-pow((sheetV-(.645+.04*u))/.010,2.));
   v.z=-.008*diagonal-.011*crossfold;
   v.z+=.009*sin`)};for(let s of[this.material,this.sheet.customDepthMaterial]){let a=s.onBeforeCompile;s.onBeforeCompile=r=>{a(r),n(r)},s.customProgramCacheKey=()=>s===this.material?"cord-v14-folds":"cord-v14-fold-shadow",s.needsUpdate=!0}this.setProgress(0)}setProgress(e){if(!this.integrated)return super.setProgress(e);let t=Pt.clamp(e,0,1),n=Pt.clamp((t-_r)/(1-_r),0,1);Is.prototype.setProgress.call(this,.18+.82*n),this.progress=t,this.paperProgress=n,this.closure.update(t,this.height/2+this.sheet.position.y),this.dirty=!0}async prepareMotion(e){let t=performance.now();await this.environmentReady;for(let n of new Set([...this.maps,this.sealBump]))this.renderer.initTexture(n);this.setProgress(0),await this.renderer.compileAsync(this.scene,this.camera);for(let n of[0,.09,.19,.29,.36,.38,1,e])this.setProgress(n),this.render(),await new Promise(s=>requestAnimationFrame(s));this.motionPrepared=!0,this.preparationMs=performance.now()-t,this.preparedPrograms=this.renderer.info.programs.length}snapshot(){return{...super.snapshot(),edition:"silk-cord raster-frame specimen",paperProgress:this.paperProgress,keeperPose:this.closure.snapshot(),keeperMotion:"64 authored frames plus a screen-plane departure",paperMaterial:"unchanged chapter-five v14"}}exportKeeper(){return this.closure.exportFrame()}interaction(){let e=(t,n,s)=>{let a=new q(t,n,s).project(this.camera);return{x:.5+.5*a.x,y:.5+.5*a.y}};return{top:[e(-this.width/2,this.bounds.top,0),e(this.width/2,this.bounds.top,0)],bottom:[e(-this.width/2,this.bounds.bottom,0),e(this.width/2,this.bounds.bottom,0)],keeper:this.closure.group.visible?e(this.closure.group.position.x,this.closure.group.position.y,.65):null,paperProgress:this.paperProgress}}};function gu(i,e={}){fe();let t={SIM_RESOLUTION:e.simResolution||64,DYE_RESOLUTION:512,CAPTURE_RESOLUTION:512,DENSITY_DISSIPATION:e.densityDissipation??.7,VELOCITY_DISSIPATION:.65,PRESSURE:.8,PRESSURE_ITERATIONS:12,CURL:e.curl??12,SPLAT_RADIUS:.1,SPLAT_FORCE:6e3,SHADING:!1,COLORFUL:!1,COLOR_UPDATE_SPEED:10,PAUSED:!1,BACK_COLOR:{r:0,g:0,b:0},TRANSPARENT:!0,BLOOM:!1,BLOOM_ITERATIONS:8,BLOOM_RESOLUTION:256,BLOOM_INTENSITY:.8,BLOOM_THRESHOLD:.6,BLOOM_SOFT_KNEE:.7,SUNRAYS:!1,SUNRAYS_RESOLUTION:196,SUNRAYS_WEIGHT:1};function n(){this.id=-1,this.texcoordX=0,this.texcoordY=0,this.prevTexcoordX=0,this.prevTexcoordY=0,this.deltaX=0,this.deltaY=0,this.down=!1,this.moved=!1,this.color=[30,0,300]}let s=[],a=[];s.push(new n);let{gl:r,ext:o}=c(i);f()&&(t.DYE_RESOLUTION=512),o.supportLinearFiltering||(t.DYE_RESOLUTION=512,t.SHADING=!1,t.BLOOM=!1,t.SUNRAYS=!1),e.dyeResolution&&(t.DYE_RESOLUTION=Math.min(t.DYE_RESOLUTION,e.dyeResolution));function c(R){let Y={alpha:!0,depth:!1,stencil:!1,antialias:!1,preserveDrawingBuffer:!1},W=R.getContext("webgl2",Y),g=!!W;g||(W=R.getContext("webgl",Y)||R.getContext("experimental-webgl",Y));let A,B;g?(W.getExtension("EXT_color_buffer_float"),B=W.getExtension("OES_texture_float_linear")):(A=W.getExtension("OES_texture_half_float"),B=W.getExtension("OES_texture_half_float_linear")),W.clearColor(0,0,0,1);let D=g?W.HALF_FLOAT:A.HALF_FLOAT_OES,O,ae,ge;return g?(O=l(W,W.RGBA16F,W.RGBA,D),ae=l(W,W.RG16F,W.RG,D),ge=l(W,W.R16F,W.RED,D)):(O=l(W,W.RGBA,W.RGBA,D),ae=l(W,W.RGBA,W.RGBA,D),ge=l(W,W.RGBA,W.RGBA,D)),{gl:W,ext:{formatRGBA:O,formatRG:ae,formatR:ge,halfFloatTexType:D,supportLinearFiltering:B}}}function l(R,Y,W,g){if(!h(R,Y,W,g))switch(Y){case R.R16F:return l(R,R.RG16F,R.RG,g);case R.RG16F:return l(R,R.RGBA16F,R.RGBA,g);default:return null}return{internalFormat:Y,format:W}}function h(R,Y,W,g){let A=R.createTexture();R.bindTexture(R.TEXTURE_2D,A),R.texParameteri(R.TEXTURE_2D,R.TEXTURE_MIN_FILTER,R.NEAREST),R.texParameteri(R.TEXTURE_2D,R.TEXTURE_MAG_FILTER,R.NEAREST),R.texParameteri(R.TEXTURE_2D,R.TEXTURE_WRAP_S,R.CLAMP_TO_EDGE),R.texParameteri(R.TEXTURE_2D,R.TEXTURE_WRAP_T,R.CLAMP_TO_EDGE),R.texImage2D(R.TEXTURE_2D,0,Y,4,4,0,W,g,null);let B=R.createFramebuffer();return R.bindFramebuffer(R.FRAMEBUFFER,B),R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,A,0),R.checkFramebufferStatus(R.FRAMEBUFFER)==R.FRAMEBUFFER_COMPLETE}function f(){return/Mobi|Android/i.test(navigator.userAgent)}class u{constructor(Y,W){this.vertexShader=Y,this.fragmentShaderSource=W,this.programs=[],this.activeProgram=null,this.uniforms=[]}setKeywords(Y){let W=0;for(let A=0;A<Y.length;A++)W+=Vo(Y[A]);let g=this.programs[W];if(g==null){let A=m(r.FRAGMENT_SHADER,this.fragmentShaderSource,Y);g=v(this.vertexShader,A),this.programs[W]=g}g!=this.activeProgram&&(this.uniforms=S(g),this.activeProgram=g)}bind(){r.useProgram(this.activeProgram)}}class d{constructor(Y,W){this.uniforms={},this.program=v(Y,W),this.uniforms=S(this.program)}bind(){r.useProgram(this.program)}}function v(R,Y){let W=r.createProgram();return r.attachShader(W,R),r.attachShader(W,Y),r.linkProgram(W),r.getProgramParameter(W,r.LINK_STATUS)||console.trace(r.getProgramInfoLog(W)),W}function S(R){let Y=[],W=r.getProgramParameter(R,r.ACTIVE_UNIFORMS);for(let g=0;g<W;g++){let A=r.getActiveUniform(R,g).name;Y[A]=r.getUniformLocation(R,A)}return Y}function m(R,Y,W){Y=p(Y,W);let g=r.createShader(R);return r.shaderSource(g,Y),r.compileShader(g),r.getShaderParameter(g,r.COMPILE_STATUS)||console.trace(r.getShaderInfoLog(g)),g}function p(R,Y){if(Y==null)return R;let W="";return Y.forEach(g=>{W+="#define "+g+`
`}),W+R}let T=m(r.VERTEX_SHADER,`
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
`),U=m(r.VERTEX_SHADER,`
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
`),y=m(r.FRAGMENT_SHADER,`
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
`),w=m(r.FRAGMENT_SHADER,`
    precision mediump float;
    precision mediump sampler2D;

    varying highp vec2 vUv;
    uniform sampler2D uTexture;

    void main () {
        gl_FragColor = texture2D(uTexture, vUv);
    }
`),b=m(r.FRAGMENT_SHADER,`
    precision mediump float;
    precision mediump sampler2D;

    varying highp vec2 vUv;
    uniform sampler2D uTexture;
    uniform float value;

    void main () {
        gl_FragColor = value * texture2D(uTexture, vUv);
    }
`),P=m(r.FRAGMENT_SHADER,`
    precision mediump float;

    uniform vec4 color;

    void main () {
        gl_FragColor = color;
    }
`),x=m(r.FRAGMENT_SHADER,`
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
`),M=`
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
`,L=m(r.FRAGMENT_SHADER,`
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
`),I=m(r.FRAGMENT_SHADER,`
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
`),z=m(r.FRAGMENT_SHADER,`
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
`),k=m(r.FRAGMENT_SHADER,`
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
`),C=m(r.FRAGMENT_SHADER,`
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
`),G=m(r.FRAGMENT_SHADER,`
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
`),X=m(r.FRAGMENT_SHADER,`
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
    }`,o.supportLinearFiltering?null:["MANUAL_FILTERING"]),$=m(r.FRAGMENT_SHADER,`
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
`),ie=m(r.FRAGMENT_SHADER,`
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
`),Z=m(r.FRAGMENT_SHADER,`
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
`),Q=m(r.FRAGMENT_SHADER,`
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
`),se=m(r.FRAGMENT_SHADER,`
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
`),le=(r.bindBuffer(r.ARRAY_BUFFER,r.createBuffer()),r.bufferData(r.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),r.STATIC_DRAW),r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,r.createBuffer()),r.bufferData(r.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),r.STATIC_DRAW),r.vertexAttribPointer(0,2,r.FLOAT,!1,0,0),r.enableVertexAttribArray(0),(R,Y=!1)=>{R==null?(r.viewport(0,0,r.drawingBufferWidth,r.drawingBufferHeight),r.bindFramebuffer(r.FRAMEBUFFER,null)):(r.viewport(0,0,R.width,R.height),r.bindFramebuffer(r.FRAMEBUFFER,R.fbo)),Y&&(r.clearColor(0,0,0,1),r.clear(r.COLOR_BUFFER_BIT)),r.drawElements(r.TRIANGLES,6,r.UNSIGNED_SHORT,0)});function Me(){let R=r.checkFramebufferStatus(r.FRAMEBUFFER);R!=r.FRAMEBUFFER_COMPLETE&&console.trace("Framebuffer error: "+R)}let Ue,xe,Ke,K,ee,Se,Le=[],ye,ke,vt=null,Be=new d(U,y),je=new d(T,w),tt=new d(T,b),Xe=new d(T,P),ot=new d(T,x),gt=new d(T,L),St=new d(T,I),st=new d(T,z),_t=new d(T,k),F=new d(T,C),Ye=new d(T,G),Ve=new d(T,X),E=new d(T,$),_=new d(T,ie),V=new d(T,Z),H=new d(T,Q),J=new d(T,se),oe=new u(T,M);function ue(){let R=Un(t.SIM_RESOLUTION),Y=Un(t.DYE_RESOLUTION),W=o.halfFloatTexType,g=o.formatRGBA,A=o.formatRG,B=o.formatR,D=o.supportLinearFiltering?r.LINEAR:r.NEAREST;r.disable(r.BLEND),Ue==null?Ue=we(Y.width,Y.height,g.internalFormat,g.format,W,D):Ue=de(Ue,Y.width,Y.height,g.internalFormat,g.format,W,D),xe==null?xe=we(R.width,R.height,A.internalFormat,A.format,W,D):xe=de(xe,R.width,R.height,A.internalFormat,A.format,W,D),Ke=ce(R.width,R.height,B.internalFormat,B.format,W,r.NEAREST),K=ce(R.width,R.height,B.internalFormat,B.format,W,r.NEAREST),ee=we(R.width,R.height,B.internalFormat,B.format,W,r.NEAREST),j(),ne()}function j(){let R=Un(t.BLOOM_RESOLUTION),Y=o.halfFloatTexType,W=o.formatRGBA,g=o.supportLinearFiltering?r.LINEAR:r.NEAREST;Se=ce(R.width,R.height,W.internalFormat,W.format,Y,g),Le.length=0;for(let A=0;A<t.BLOOM_ITERATIONS;A++){let B=R.width>>A+1,D=R.height>>A+1;if(B<2||D<2)break;let O=ce(B,D,W.internalFormat,W.format,Y,g);Le.push(O)}}function ne(){let R=Un(t.SUNRAYS_RESOLUTION),Y=o.halfFloatTexType,W=o.formatR,g=o.supportLinearFiltering?r.LINEAR:r.NEAREST;ye=ce(R.width,R.height,W.internalFormat,W.format,Y,g),ke=ce(R.width,R.height,W.internalFormat,W.format,Y,g)}function ce(R,Y,W,g,A,B){r.activeTexture(r.TEXTURE0);let D=r.createTexture();r.bindTexture(r.TEXTURE_2D,D),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,B),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,B),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE),r.texImage2D(r.TEXTURE_2D,0,W,R,Y,0,g,A,null);let O=r.createFramebuffer();r.bindFramebuffer(r.FRAMEBUFFER,O),r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,D,0),r.viewport(0,0,R,Y),r.clear(r.COLOR_BUFFER_BIT);let ae=1/R,ge=1/Y;return{texture:D,fbo:O,width:R,height:Y,texelSizeX:ae,texelSizeY:ge,attach(he){return r.activeTexture(r.TEXTURE0+he),r.bindTexture(r.TEXTURE_2D,D),he}}}function we(R,Y,W,g,A,B){let D=ce(R,Y,W,g,A,B),O=ce(R,Y,W,g,A,B);return{width:R,height:Y,texelSizeX:D.texelSizeX,texelSizeY:D.texelSizeY,get read(){return D},set read(ae){D=ae},get write(){return O},set write(ae){O=ae},swap(){let ae=D;D=O,O=ae}}}function me(R,Y,W,g,A,B,D){let O=ce(Y,W,g,A,B,D);return je.bind(),r.uniform1i(je.uniforms.uTexture,R.attach(0)),le(O),O}function de(R,Y,W,g,A,B,D){return R.width==Y&&R.height==W||(R.read=me(R.read,Y,W,g,A,B,D),R.write=ce(Y,W,g,A,B,D),R.width=Y,R.height=W,R.texelSizeX=1/Y,R.texelSizeY=1/W),R}function Ce(R){let Y=r.createTexture();r.bindTexture(r.TEXTURE_2D,Y),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.REPEAT),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.REPEAT),r.texImage2D(r.TEXTURE_2D,0,r.RGB,1,1,0,r.RGB,r.UNSIGNED_BYTE,new Uint8Array([255,255,255]));let W={texture:Y,width:1,height:1,attach(A){return r.activeTexture(r.TEXTURE0+A),r.bindTexture(r.TEXTURE_2D,Y),A}},g=new Image;return g.onload=()=>{W.width=g.width,W.height=g.height,r.bindTexture(r.TEXTURE_2D,Y),r.texImage2D(r.TEXTURE_2D,0,r.RGB,r.RGB,r.UNSIGNED_BYTE,g)},g.src=R,W}function Pe(){let R=[];t.SHADING&&R.push("SHADING"),t.BLOOM&&R.push("BLOOM"),t.SUNRAYS&&R.push("SUNRAYS"),oe.setKeywords(R)}Pe(),ue();let ze=Date.now(),N=0;function fe(){let R=Ns(i.clientWidth),Y=Ns(i.clientHeight);return i.width!=R||i.height!=Y?(i.width=R,i.height=Y,!0):!1}function te(R){t.COLORFUL&&(N+=R*t.COLOR_UPDATE_SPEED,N>=1&&(N=br(N,0,1),s.forEach(Y=>{Y.color=Oi()})))}function pe(){a.length>0&&Bo(a.pop()),s.forEach(R=>{R.moved&&(R.moved=!1,Oo(R))})}function ve(R){r.disable(r.BLEND),_.bind(),r.uniform2f(_.uniforms.texelSize,xe.texelSizeX,xe.texelSizeY),r.uniform1i(_.uniforms.uVelocity,xe.read.attach(0)),le(K),V.bind(),r.uniform2f(V.uniforms.texelSize,xe.texelSizeX,xe.texelSizeY),r.uniform1i(V.uniforms.uVelocity,xe.read.attach(0)),r.uniform1i(V.uniforms.uCurl,K.attach(1)),r.uniform1f(V.uniforms.curl,t.CURL),r.uniform1f(V.uniforms.dt,R),le(xe.write),xe.swap(),E.bind(),r.uniform2f(E.uniforms.texelSize,xe.texelSizeX,xe.texelSizeY),r.uniform1i(E.uniforms.uVelocity,xe.read.attach(0)),le(Ke),tt.bind(),r.uniform1i(tt.uniforms.uTexture,ee.read.attach(0)),r.uniform1f(tt.uniforms.value,t.PRESSURE),le(ee.write),ee.swap(),H.bind(),r.uniform2f(H.uniforms.texelSize,xe.texelSizeX,xe.texelSizeY),r.uniform1i(H.uniforms.uDivergence,Ke.attach(0));for(let W=0;W<t.PRESSURE_ITERATIONS;W++)r.uniform1i(H.uniforms.uPressure,ee.read.attach(1)),le(ee.write),ee.swap();J.bind(),r.uniform2f(J.uniforms.texelSize,xe.texelSizeX,xe.texelSizeY),r.uniform1i(J.uniforms.uPressure,ee.read.attach(0)),r.uniform1i(J.uniforms.uVelocity,xe.read.attach(1)),le(xe.write),xe.swap(),Ve.bind(),r.uniform2f(Ve.uniforms.texelSize,xe.texelSizeX,xe.texelSizeY),o.supportLinearFiltering||r.uniform2f(Ve.uniforms.dyeTexelSize,xe.texelSizeX,xe.texelSizeY);let Y=xe.read.attach(0);r.uniform1i(Ve.uniforms.uVelocity,Y),r.uniform1i(Ve.uniforms.uSource,Y),r.uniform1f(Ve.uniforms.dt,R),r.uniform1f(Ve.uniforms.dissipation,t.VELOCITY_DISSIPATION),le(xe.write),xe.swap(),o.supportLinearFiltering||r.uniform2f(Ve.uniforms.dyeTexelSize,Ue.texelSizeX,Ue.texelSizeY),r.uniform1i(Ve.uniforms.uVelocity,xe.read.attach(0)),r.uniform1i(Ve.uniforms.uSource,Ue.read.attach(1)),r.uniform1f(Ve.uniforms.dissipation,t.DENSITY_DISSIPATION),le(Ue.write),Ue.swap()}function re(R){t.BLOOM&&et(Ue.read,Se),t.SUNRAYS&&(en(Ue.read,Ue.write,ye),on(ye,ke,1)),R==null||!t.TRANSPARENT?(r.blendFunc(r.ONE,r.ONE_MINUS_SRC_ALPHA),r.enable(r.BLEND)):r.disable(r.BLEND),t.TRANSPARENT||Ie(R,Bi(t.BACK_COLOR)),R==null&&t.TRANSPARENT&&(r.bindFramebuffer(r.FRAMEBUFFER,null),r.viewport(0,0,r.drawingBufferWidth,r.drawingBufferHeight),r.clearColor(0,0,0,0),r.clear(r.COLOR_BUFFER_BIT)),rt(R)}function Ie(R,Y){Xe.bind(),r.uniform4f(Xe.uniforms.color,Y.r,Y.g,Y.b,1),le(R)}function Ae(R){ot.bind(),r.uniform1f(ot.uniforms.aspectRatio,i.width/i.height),le(R)}function rt(R){let Y=R==null?r.drawingBufferWidth:R.width,W=R==null?r.drawingBufferHeight:R.height;if(oe.bind(),t.SHADING&&r.uniform2f(oe.uniforms.texelSize,1/Y,1/W),r.uniform1i(oe.uniforms.uTexture,Ue.read.attach(0)),t.BLOOM){r.uniform1i(oe.uniforms.uBloom,Se.attach(1)),r.uniform1i(oe.uniforms.uDithering,vt.attach(2));let g=Tr(vt,Y,W);r.uniform2f(oe.uniforms.ditherScale,g.x,g.y)}t.SUNRAYS&&r.uniform1i(oe.uniforms.uSunrays,ye.attach(3)),le(R)}function et(R,Y){if(Le.length<2)return;let W=Y;r.disable(r.BLEND),gt.bind();let g=t.BLOOM_THRESHOLD*t.BLOOM_SOFT_KNEE+1e-4,A=t.BLOOM_THRESHOLD-g,B=g*2,D=.25/g;r.uniform3f(gt.uniforms.curve,A,B,D),r.uniform1f(gt.uniforms.threshold,t.BLOOM_THRESHOLD),r.uniform1i(gt.uniforms.uTexture,R.attach(0)),le(W),St.bind();for(let O=0;O<Le.length;O++){let ae=Le[O];r.uniform2f(St.uniforms.texelSize,W.texelSizeX,W.texelSizeY),r.uniform1i(St.uniforms.uTexture,W.attach(0)),le(ae),W=ae}r.blendFunc(r.ONE,r.ONE),r.enable(r.BLEND);for(let O=Le.length-2;O>=0;O--){let ae=Le[O];r.uniform2f(St.uniforms.texelSize,W.texelSizeX,W.texelSizeY),r.uniform1i(St.uniforms.uTexture,W.attach(0)),r.viewport(0,0,ae.width,ae.height),le(ae),W=ae}r.disable(r.BLEND),st.bind(),r.uniform2f(st.uniforms.texelSize,W.texelSizeX,W.texelSizeY),r.uniform1i(st.uniforms.uTexture,W.attach(0)),r.uniform1f(st.uniforms.intensity,t.BLOOM_INTENSITY),le(Y)}function en(R,Y,W){r.disable(r.BLEND),_t.bind(),r.uniform1i(_t.uniforms.uTexture,R.attach(0)),le(Y),F.bind(),r.uniform1f(F.uniforms.weight,t.SUNRAYS_WEIGHT),r.uniform1i(F.uniforms.uTexture,Y.attach(0)),le(W)}function on(R,Y,W){Be.bind();for(let g=0;g<W;g++)r.uniform2f(Be.uniforms.texelSize,R.texelSizeX,0),r.uniform1i(Be.uniforms.uTexture,R.attach(0)),le(Y),r.uniform2f(Be.uniforms.texelSize,0,R.texelSizeY),r.uniform1i(Be.uniforms.uTexture,Y.attach(0)),le(R)}function Oo(R){let Y=R.deltaX*t.SPLAT_FORCE,W=R.deltaY*t.SPLAT_FORCE;Ds(R.texcoordX,R.texcoordY,Y,W,R.color)}function Bo(R){for(let Y=0;Y<R;Y++){let W=Oi();W.r*=10,W.g*=10,W.b*=10;let g=Math.random(),A=Math.random(),B=1e3*(Math.random()-.5),D=1e3*(Math.random()-.5);Ds(g,A,B,D,W)}}function Ds(R,Y,W,g,A){Ye.bind(),r.uniform1i(Ye.uniforms.uTarget,xe.read.attach(0)),r.uniform1f(Ye.uniforms.aspectRatio,i.width/i.height),r.uniform2f(Ye.uniforms.point,R,Y),r.uniform3f(Ye.uniforms.color,W,g,0),r.uniform1f(Ye.uniforms.radius,vi(t.SPLAT_RADIUS/100)),le(xe.write),xe.swap(),r.uniform1i(Ye.uniforms.uTarget,Ue.read.attach(0)),r.uniform3f(Ye.uniforms.color,A.r,A.g,A.b),le(Ue.write),Ue.swap()}function vi(R){let Y=i.width/i.height;return Y>1&&(R*=Y),R}function Tc(R,Y,W,g){R.id=Y,R.down=!0,R.moved=!1,R.texcoordX=W/i.width,R.texcoordY=1-g/i.height,R.prevTexcoordX=R.texcoordX,R.prevTexcoordY=R.texcoordY,R.deltaX=0,R.deltaY=0,R.color=Oi()}function zo(R,Y,W){R.prevTexcoordX=R.texcoordX,R.prevTexcoordY=R.texcoordY,R.texcoordX=Y/i.width,R.texcoordY=1-W/i.height,R.deltaX=Dn(R.texcoordX-R.prevTexcoordX),R.deltaY=Us(R.texcoordY-R.prevTexcoordY),R.moved=Math.abs(R.deltaX)>0||Math.abs(R.deltaY)>0}function ko(R){R.down=!1}function Dn(R){let Y=i.width/i.height;return Y<1&&(R*=Y),R}function Us(R){let Y=i.width/i.height;return Y>1&&(R/=Y),R}function Oi(){let R=Mr(Math.random(),1,1);return R.r*=.15,R.g*=.15,R.b*=.15,R}function Mr(R,Y,W){let g,A,B,D,O,ae,ge,he;switch(D=Math.floor(R*6),O=R*6-D,ae=W*(1-Y),ge=W*(1-O*Y),he=W*(1-(1-O)*Y),D%6){case 0:g=W,A=he,B=ae;break;case 1:g=ge,A=W,B=ae;break;case 2:g=ae,A=W,B=he;break;case 3:g=ae,A=ge,B=W;break;case 4:g=he,A=ae,B=W;break;case 5:g=W,A=ae,B=ge;break}return{r:g,g:A,b:B}}function Bi(R){return{r:R.r/255,g:R.g/255,b:R.b/255}}function br(R,Y,W){let g=W-Y;return g==0?Y:(R-Y)%g+Y}function Un(R){let Y=r.drawingBufferWidth/r.drawingBufferHeight;Y<1&&(Y=1/Y);let W=Math.round(R),g=Math.round(R*Y);return r.drawingBufferWidth>r.drawingBufferHeight?{width:g,height:W}:{width:W,height:g}}function Tr(R,Y,W){return{x:Y/R.width,y:W/R.height}}function Ns(R){let Y=Math.min(window.devicePixelRatio||1,e.maxPixelRatio||2);return Math.floor(R*Y)}function Vo(R){if(R.length==0)return 0;let Y=0;for(let W=0;W<R.length;W++)Y=(Y<<5)-Y+R.charCodeAt(W),Y|=0;return Y}let Go=e.fieldFactory?.({gl:r,Program:d,baseVertexShader:T,compileShader:m,blit:le,velocity:()=>xe,dye:()=>Ue});return{fields(R,Y,W){Go?.(R,Y,W)},tick(R){fe()&&ue(),ve(Math.min(R,.05)),re(null)},seed(R,Y,W,g=.8){Ye.bind(),r.uniform1f(Ye.uniforms.aspectRatio,i.width/i.height),r.uniform2f(Ye.uniforms.point,R,Y),r.uniform1f(Ye.uniforms.radius,vi(g/100)),r.uniform1i(Ye.uniforms.uTarget,Ue.read.attach(0)),r.uniform3f(Ye.uniforms.color,W,W*.96,W*.9),le(Ue.write),Ue.swap()},stir(R,Y,W,g,A=1){Ye.bind(),r.uniform1f(Ye.uniforms.aspectRatio,i.width/i.height),r.uniform2f(Ye.uniforms.point,R,Y),r.uniform1f(Ye.uniforms.radius,vi(A/100)),r.uniform1i(Ye.uniforms.uTarget,xe.read.attach(0)),r.uniform3f(Ye.uniforms.color,W,g,0),le(xe.write),xe.swap()},resolution(){return{width:xe.width,height:xe.height}},dispose(){r.getExtension("WEBGL_lose_context")?.loseContext()}}}function _u(i){return({gl:e,Program:t,baseVertexShader:n,compileShader:s,blit:a,velocity:r,dye:o})=>{let c=`precision highp float; precision highp sampler2D;
 varying vec2 vUv;uniform sampler2D uTarget;uniform float time,dt,aspect,mode;
 uniform vec4 edges,keeper,regions[8];uniform vec2 span;uniform float cells;
 ${i}
 float potential(vec2 p){return .65*snoise(p*.92+vec2(sin(time*.063),cos(time*.047))*.37)+.19*snoise(p*2.4+vec2(cos(time*.079),sin(time*.053))*.43)+.045*snoise(p*5.6+vec2(time*.025,-time*.017));}
 float strip(float y){return exp(-pow((vUv.y-y)/.055,2.))*smoothstep(span.x-.08,span.x+.06,vUv.x)*(1.-smoothstep(span.y-.06,span.y+.08,vUv.x));}
 void main(){
  vec2 p=vec2(vUv.x*aspect,vUv.y)*3.;vec3 old=texture2D(uTarget,vUv).rgb;
  if(mode<.5){
   float e=.018;vec2 curl=vec2(potential(p+vec2(0,e))-potential(p-vec2(0,e)),-potential(p+vec2(e,0))+potential(p-vec2(e,0)))/(2.*e);
   vec2 wind=curl*1.15;
   vec2 uv=old.xy+dt*wind;
   float top=strip(edges.x),bottom=strip(edges.z);
   uv+=dt*5.5*vec2(0.,top*edges.y+bottom*edges.w)*cells;
   vec2 d=(vUv-keeper.xy)*vec2(aspect,1.);float k=exp(-dot(d,d)/.008);
   uv+=dt*5.0*k*keeper.zw*cells;
   gl_FragColor=vec4(uv,0,1);
  }else{
   float n=.5+.5*potential(p*.72+vec2(3.7,5.1));
   float structure=smoothstep(.22,.86,n);
   float border=max(smoothstep(.24,.43,abs(vUv.x-.5)),smoothstep(.29,.46,abs(vUv.y-.5)));
   float local=0.;
   for(int i=0;i<8;i++){
    vec2 d=(vUv-regions[i].xy)*vec2(aspect,1.);
    float cloud=exp(-dot(d,d)/(regions[i].z*regions[i].z));
    local+=regions[i].w*cloud;
   }
   float desired=(.06+.27*structure)*border+local*(.52+.58*structure);
   vec3 c=max(vec3(0.),old+dt*.32*(desired*vec3(.86,.90,.88)-old*.32));
   gl_FragColor=vec4(c,1.);
  }
 }`,l=new t(n,s(e.FRAGMENT_SHADER,c));return(h,f,u)=>{l.bind();let d=l.uniforms;e.uniform1f(d.time,h),e.uniform1f(d.dt,f),e.uniform1f(d.aspect,e.canvas.width/e.canvas.height),e.uniform4fv(d.edges,u.edges),e.uniform4fv(d.keeper,u.keeper),e.uniform4fv(d["regions[0]"],u.regions),e.uniform2fv(d.span,u.span),e.uniform1f(d.cells,r().height);for(let[v,S]of[[0,r()],[1,o()]])e.uniform1f(d.mode,v),e.uniform1i(d.uTarget,S.read.attach(0)),a(S.write),S.swap()}}}var xr=(i,e,t)=>Math.max(e,Math.min(t,i)),Ro=i=>({x:(i.x+.3)/1.6,y:(i.y+.15)/1.3}),Co=class{constructor(e){this.canvas=e,this.enabled=!0,this.time=0,this.pending=0,this.frames=0,this.previous=null,this.interactionEnergy=0,this.fluid=null,this.randomState=87775857,this.clouds=Array.from({length:8},()=>this.cloud(!0))}random(){return this.randomState=Math.imul(this.randomState,1664525)+1013904223>>>0,this.randomState/4294967296}cloud(e=!1){let t=14+this.random()*17;return{x:.13+this.random()*.74,y:.09+this.random()*.82,r:.13+this.random()*.17,amplitude:.32+this.random()*.42,birth:e?-this.random()*t:this.time,life:t}}regions(){let e=[];this.clouds=this.clouds.map(t=>this.time-t.birth>=t.life?this.cloud():t);for(let t of this.clouds){let n=xr((this.time-t.birth)/t.life,0,1),s=Math.pow(Math.sin(Math.PI*n),2);e.push(t.x,t.y,t.r*(.85+.25*n),t.amplitude*s)}return e}async prepare(e,t,n,s){let a=await(await fetch("vendor/noise2D.glsl")).text();this.fluid=gu(this.canvas,{simResolution:96,dyeResolution:512,maxPixelRatio:1.5,densityDissipation:.24,curl:3,fieldFactory:_u(a)});for(let[o,c,l]of[[.18,.32,.55],[.83,.68,.6],[.3,.79,.34],[.65,.2,.3],[.5,.5,.13]])this.fluid.seed(o,c,l,3);let r={edges:[.7,0,.3,0],keeper:[-2,-2,0,0],span:[.24,.76],regions:this.regions()};for(let o=0;o<36;o++)this.fluid.fields(o/30,1/30,r),this.fluid.tick(1/30),o%6===0&&await new Promise(c=>requestAnimationFrame(c));this.time=1.2,this.resetMotion()}tick(e,t,n,s,a=e,r){if(!this.enabled||!this.fluid||(this.pending+=Math.min(.1,a),this.pending<1/30))return;let o=Math.min(.05,this.pending);this.pending=0,this.time+=o;let c=r??{top:[{x:.2,y:.5+n.top/s},{x:.8,y:.5+n.top/s}],bottom:[{x:.2,y:.5+n.bottom/s},{x:.8,y:.5+n.bottom/s}],keeper:null},l=Ro(c.top[0]),h=Ro(c.bottom[0]),f=Ro(c.top[1]),u=this.previous,d=u&&Math.abs(t-u.progress)<.15,v=d?xr((l.y-u.top)/o,-.6,.6):0,S=d?xr((h.y-u.bottom)/o,-.6,.6):0,m=c.keeper?Ro(c.keeper):null,p=d?u.keeper:null,T=m&&p?xr((m.x-p.x)/o,-.6,.6):0,U=m&&p?xr((m.y-p.y)/o,-.6,.6):0;this.fluid.fields(this.time,o,{edges:[l.y,v,h.y,S],span:[l.x,f.x],keeper:m?[m.x,m.y,T,U]:[-2,-2,0,0],regions:this.regions()}),this.interactionEnergy+=(Math.abs(v)+Math.abs(S)+Math.abs(T)+Math.abs(U))*o,this.previous={top:l.y,bottom:h.y,keeper:m,progress:t},this.fluid.tick(o),this.frames++}resetMotion(){this.previous=null,this.pending=0}setEnabled(e){this.enabled=e,this.canvas.hidden=!e||!this.fluid,this.resetMotion()}snapshot(){return{available:!!this.fluid,enabled:this.enabled,frames:this.frames,time:this.time,interactionEnergy:this.interactionEnergy,model:"2D advected dye; eight spatial cloud lifecycles, multi-scale curl forcing and signed sheet/keeper velocity",simulationHz:30,dyeResolution:512,fixedDirectionalInlet:!1}}dispose(){this.fluid?.dispose()}};var Io=class{constructor(e,t,n){this.from=e,this.to=t,this.duration=Math.max(280,Math.abs(t-e)*5600),this.elapsed=0,this.previous=n}sample(e){this.elapsed+=Math.max(0,Math.min(50,e-this.previous)),this.previous=e;let t=Math.min(1,this.elapsed/this.duration),n=t*t*(3-2*t);return{progress:this.from+(this.to-this.from)*n,done:t===1}}resume(e){this.previous=e}};var xu=Object.freeze({id:"manuscript-memento-v14",width:4.5,height:6.3,coreRadius:.145,layerThickness:.035,fontFamily:"Aboensis",fontUrl:"../chapter-scroll/assets/Aboensis-Regular.otf",skin:"assets/parchment.webp",reverse:"assets/parchment.webp",keeper:"assets/unused-keeper.png",paperNormal:"assets/parchment-normal.jpg",paperRoughness:"assets/parchment-roughness.jpg",environment:"../chapter-scroll-v3/assets/studio.hdr",ornament:"../chapter-scroll-v13/assets/leaf-and-letter.png",ornamentDigest:"e5aa04af52dde8cc3f32d0d9dfac3fe1696ef6d275c0514d7e0c0065f517d9c5",planDigest:"3104ec4b67859f64268c11a327f37a65d1bdfc48c6f75adc24ee702d3f6318fb",ink:"#30251b",rubric:"#58372d"});function vr(i){if(i!==xu.id)throw Error("Unknown scroll series");return xu}function vu(i){let e={...vr(i)};for(let t of["fontUrl","skin","reverse","keeper","paperNormal","paperRoughness","environment","ornament"])e[t]=new URL(e[t],new URL("../chapter-scroll-v14/",import.meta.url)).href;return e}var yr=Object.freeze({id:"second-language-owner",displayName:"Gual Wells"});function hc(i){let e=[[1e3,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];if(i>3999)return String(i);let t="";for(let[n,s]of e)for(;i>=n;)t+=s,i-=n;return t}function yu(i){if(typeof i!="string"||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}(Z|[+-]\d{2}:\d{2})$/.test(i))return!1;let e=i.slice(23),t=e==="Z"?0:Number(e.slice(1,3)),n=e==="Z"?0:Number(e.slice(4,6));if(t>14||n>59||t===14&&n!==0)return!1;let s=Date.parse(i),a=e==="Z"?0:(e[0]==="+"?1:-1)*(t*60+n);return Number.isFinite(s)&&new Date(s+a*6e4).toISOString().slice(0,23)===i.slice(0,23)}function uc(i){if(!i||!["specimen","issued"].includes(i.status)||!i.chapterId||!Number.isSafeInteger(i.chapterNumber)||i.chapterNumber<1||!i.displayTitle?.trim()||!/^[a-f0-9]{64}$/.test(i.chapterDigest))throw Error("Invalid charter identity");if(i.status==="specimen"){if(i.attestation!==null||!yu(i.proof?.sampleTime))throw Error("Proof requires a separate sample timestamp and no attestation")}else{let e=i.attestation;if(i.proof||!e||!e.id||!e.attemptId||!e.assessmentVersion||e.allCorrect!==!0||!yu(e.passedAt)||e.recipientId!==yr.id||typeof e.recipientName!="string"||!e.recipientName.trim()||e.recipientName.length>120)throw Error("Issued charter requires the immutable passing event and recipient snapshot")}return i}function Su(i){if(uc(i),!/^[a-f0-9]{64}$/.test(i.artifactDigest))throw Error("Prepare the charter before rendering its digest");let e=new Date(i.attestation?.passedAt??i.proof.sampleTime),t=Object.fromEntries(new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Shanghai",year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"}).formatToParts(e).map(n=>[n.type,n.value]));return[i.artifactDigest.slice(0,16).toUpperCase().match(/.{4}/g).join(" "),`${t.day} ${t.month} ${t.year}`,`${t.hour}:${t.minute}:${t.second}.${String(e.getUTCMilliseconds()).padStart(3,"0")}  +08:00`]}var w0="SL-MEMENTO-14",Mu=async i=>[...new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(i)))].map(e=>e.toString(16).padStart(2,"0")).join("");function dc(i){uc(i);let e=vr(i.template),t=i.artPlan;if(i.sealVariant!=="oblong"||!t||t.schema!=="second-language.art-plan.v1"||t.source.chapterId!==i.chapterId||t.source.chapterDigest!==i.chapterDigest||t.source.chapterNumber!==i.chapterNumber||t.copy.chapterEnglishTitle!==i.displayTitle||t.resources.ornament.sha256!==e.ornamentDigest||i.artPlanDigest!==e.planDigest)throw Error("Chapter artwork and record do not match");return i}function Sr(i){dc(i);let e=i.status==="issued"?i.attestation.recipientName:yr.displayName,t=`Chapter ${hc(i.chapterNumber)}`,n=i.artPlan.copy;return{institution:"The Second Language",chapter:t,title:n.artTitle,titleLines:n.artTitleLines,chapterTitle:i.displayTitle,recipient:e,stanzas:n.stanzas,paragraphs:n.stanzas.map(s=>s.join(`
`)),colophon:[`For ${e}, in remembrance of ${t}`,"and its trial successfully completed."],sealLegends:["The Second Language","In remembrance"],note:i.status==="issued"?"":"Specimen \u2014 Not issued",issued:i.status==="issued"}}function A0(i){let e=Sr(i),t=i.attestation,n=vr(i.template);return JSON.stringify(["second-language.memento.v3",i.status,i.chapterId,i.chapterNumber,i.chapterDigest,i.chapterTitle,i.displayTitle,yr.id,e.recipient,t?.id??null,t?.attemptId??null,t?.assessmentVersion??null,t?.allCorrect??null,new Date(t?.passedAt??i.proof.sampleTime).toISOString(),w0,i.template,i.artPlanDigest,n.ornamentDigest,i.sealVariant,e.institution,e.chapter,e.title,e.chapterTitle,e.stanzas,e.colophon,e.sealLegends,e.note])}async function bu(i,e){let t=await Mu(e),n={...i,artPlan:JSON.parse(e),artPlanDigest:t};if(dc(n),n.artPlan.copy.artTitleLines.join(" ")!==n.artPlan.copy.artTitle)throw Error("Artistic title line breaks do not match title");let s=A0(n);return{...n,canonicalPayload:s,artifactDigest:await Mu(s),recipient:Sr(n).recipient}}function fc(i){return dc(i),Su(i)}var mc=(i,e=0,t=1)=>Math.max(e,Math.min(t,i));function Po(i,e,t=0){let n=Math.imul(i,374761393)^Math.imul(e,668265263)^t;return n=Math.imul(n^n>>>13,1274126177),((n^n>>>16)>>>0)/4294967295}function Lo(i,e,t=0){let n=Math.floor(i),s=Math.floor(e),a=i-n,r=e-s,o=a*a*(3-2*a),c=r*r*(3-2*r),l=(h,f,u)=>h+(f-h)*u;return l(l(Po(n,s,t),Po(n+1,s,t),o),l(Po(n,s+1,t),Po(n+1,s+1,t),o),c)}var pc=(i,e,t,n,s,a)=>Math.exp(-(((i-t)/s)**2+((e-n)/a)**2));function gc(i,e){let{width:t,height:n}=i,s=i.getContext("2d",{willReadFrequently:!0}),a=s.getImageData(0,0,t,n),r=document.createElement("canvas");r.width=t,r.height=n;let o=r.getContext("2d"),c=o.createImageData(t,n),l=t/2-384,h=0,f=0,u=0;for(let d=0;d<n;d++)for(let v=0;v<t;v++){let S=(d*t+v)*4,m=a.data[S+3]/255,p=.96+.12*(Lo(v/100,d/100,e)-.5),T=Lo(v/3.5,d/3.5,e^8127),U=pc(v-l,d-l,551,436,24,61)*.63+pc(v-l,d-l,111,180,29,47)*.35+pc(v-l,d-l,464,722,31,12)*.32,y=mc(p+.06*(T-.5)-U,.14,1);Lo(v/2,d/2,e^451)>.8&&T>.64&&(y*=.12);let b=.5+.5*Lo(v/49,d/49,e^713),P=mc(m*y);c.data[S]=Math.round(14+b*10),c.data[S+1]=Math.round(9+b*7),c.data[S+2]=Math.round(6+b*4),c.data[S+3]=Math.round(P*255),m>.4&&(u++,y<.5&&h++,y<.72&&f++)}return o.putImageData(c,0,0),{ink:r,stats:{markedPixels:u,lowContactPixels:h,variableContactPixels:f}}}function Tu(i,e){let t=new Uint8ClampedArray(i.data),n=i.width,s=i.height;for(let a=0;a<s;a++)for(let r=0;r<n;r++){let o=(a*n+r)*4,c=e.data[o+3]/255;if(!c)continue;let l=(Math.min(s-1,a+2)*n+Math.min(n-1,r+2))*4,h=(i.data[o]+i.data[o+1]+i.data[o+2])/3,f=(i.data[l]+i.data[l+1]+i.data[l+2])/3,u=mc(.98+(h-f)*.004,.77,1.04),d=c*u;for(let v=0;v<3;v++)t[o+v]=Math.round(i.data[o+v]*(1-d*(1-e.data[o+v]/255)))}return new ImageData(t,n,s)}var _c="SL-KEEPSAKE-1",Eu=896,Di=(i=Eu,e=Eu)=>Object.assign(document.createElement("canvas"),{width:i,height:e}),Do;async function xc(){let i=new Image;i.src="../chapter-scroll-v10/assets/ink-shoulder.png",await i.decode(),Do=Di(256,480);let e=Do.getContext("2d",{willReadFrequently:!0});e.drawImage(i,i.width*.28,i.height*.07,i.width*.45,i.height*.84,0,0,256,480);let t=e.getImageData(0,0,256,480);for(let n=0;n<t.data.length;n+=4)t.data[n+3]*=1-(t.data[n]+t.data[n+1]+t.data[n+2])/765,t.data[n]=t.data[n+1]=t.data[n+2]=255;e.putImageData(t,0,0)}function wu(i,e,t,n,s,a){i.font=`${a}px Aboensis`,i.textAlign="center";let r=[...e],o=r.map(l=>i.measureText(l).width),c=-o.reduce((l,h)=>l+h,0)/2;for(let l=0;l<r.length;l++){let h=n+(s?-1:1)*(c+o[l]/2)/t;i.save(),i.translate(448+Math.cos(h)*t,448+Math.sin(h)*t),i.rotate(h+(s?-Math.PI/2:Math.PI/2)),i.fillText(r[l],0,0),i.restore(),c+=o[l]}}function Au(i,e="oblong"){if(!Do)throw Error("Ink texture not ready");let t=Di(),n=t.getContext("2d");n.fillStyle=n.strokeStyle="white",n.textAlign="center",n.lineCap="round";let s;if(e==="oblong"){n.lineWidth=8.5,n.beginPath(),n.moveTo(100,304),n.bezierCurveTo(340,301,579,305,796,303),n.lineTo(797,576),n.bezierCurveTo(590,578,340,573,99,577),n.closePath(),n.stroke();for(let[f,u,d]of[["The Second Language",410,80],["In remembrance",527,72]]){let v=d,S;do{if(n.font=`${v}px Aboensis`,S=n.measureText(f),S.actualBoundingBoxLeft+S.actualBoundingBoxRight<=620)break;v-=2}while(v>=58);if(v<58)throw Error("Stamp lettering requires another die layout");n.fillText(f,448,u)}s={x:56,y:260,width:784,height:360}}else if(e==="round"){for(let[f,u]of[[330,10],[306,3.5]]){n.lineWidth=u,n.beginPath();for(let d=0;d<=512;d++){let v=d/512*Math.PI*2,S=f+1.4*Math.sin(v*3)+.7*Math.cos(v*11),m=448+Math.cos(v)*S,p=448+Math.sin(v)*S;d?n.lineTo(m,p):n.moveTo(m,p)}n.closePath(),n.stroke()}wu(n,"The Second Language",249,-Math.PI/2,!1,69),wu(n,"In remembrance",250,Math.PI/2,!0,60),n.font="192px Aboensis",n.fillText("SL",448,514),s={x:52,y:52,width:792,height:792}}else throw Error("Unknown stamp");n.save(),n.globalCompositeOperation="destination-out",n.lineWidth=1.7;for(let[f,u,d,v]of[[100,337,18,7],[589,305,12,21],[794,540,15,-10]])n.beginPath(),n.moveTo(f,u),n.lineTo(f+d,u+v),n.stroke();n.restore();let a=gc(t,i),r=Di(),o=r.getContext("2d");o.save(),o.filter="blur(2px)",o.globalAlpha=.25,o.drawImage(a.ink,0,0),o.restore(),o.globalCompositeOperation="destination-out",o.drawImage(t,0,0),o.globalCompositeOperation="source-over",o.drawImage(a.ink,0,0);let c=Di(),l=c.getContext("2d");l.save(),l.translate(e==="round"?772:792,e==="round"?606:532),l.rotate(-.3),l.drawImage(Do,-21,-39,42,78),l.restore(),o.globalAlpha=.74,o.drawImage(gc(c,i^9071).ink,0,0),o.globalAlpha=1;let h=f=>{let u=Di(s.width,s.height);return u.getContext("2d").drawImage(f,s.x,s.y,s.width,s.height,0,0,s.width,s.height),u};return{mask:h(t),ink:h(r),seed:i,variant:e,version:_c,stats:a.stats}}function Ru(i,e,t,n){let s=Di(n.width,n.height),a=s.getContext("2d",{willReadFrequently:!0});a.drawImage(t.ink,0,0,n.width,n.height);let r=i.getContext("2d");r.putImageData(Tu(r.getImageData(n.x,n.y,n.width,n.height),a.getImageData(0,0,n.width,n.height)),n.x,n.y);let o=e.getContext("2d");o.fillStyle="#808080",o.fillRect(0,0,e.width,e.height);let c=Di(t.mask.width,t.mask.height),l=c.getContext("2d");l.drawImage(t.mask,0,0),l.globalCompositeOperation="source-in",l.fillStyle="#303030",l.fillRect(0,0,c.width,c.height),o.save(),o.globalAlpha=.52,o.filter="blur(.7px)",o.drawImage(c,n.x,n.y,n.width,n.height),o.restore()}async function vc(i){let e=new Image;return e.src=i,await e.decode(),e}function R0(i){let e=Sr(i);return[e.chapter,e.title,e.chapterTitle,...e.paragraphs,e.colophon.join(" "),...e.sealLegends,...fc(i),e.note].filter(Boolean)}function yc(i,e){i.replaceChildren();for(let[t,n]of R0(e).entries()){let s=document.createElement(t===1?"h3":"p");s.textContent=n,s.style.whiteSpace="pre-line",i.append(s)}}function Cu(i,e,t,n,s){let a=Sr(i),r=i.artPlan,o=r.layout,c=o.width,l=o.height,h=parseInt(i.artifactDigest.slice(0,8),16);if(c!==2048||l!==2868)throw Error("This paper size needs a verified scroll geometry");let f=()=>Object.assign(document.createElement("canvas"),{width:c,height:l}),u=f(),d=f(),v=f(),S=f(),m=u.getContext("2d"),p=v.getContext("2d");for(let[I,z]of[[u,e],[d,t]]){let k=I.getContext("2d");k.save(),r.resources.paper.variant==="mirror-x"&&(k.translate(c,0),k.scale(-1,1)),k.drawImage(z,0,0,c,l),k.restore()}if(!s)throw Error("Chapter miniature missing");let T=o.ornament,U=Math.min(T.width/s.width,T.height/s.height),y=s.width*U,w=s.height*U;m.globalCompositeOperation="source-atop",m.globalAlpha=T.opacity,m.drawImage(s,T.x+(T.width-y)/2,T.y+(T.height-w)/2,y,w),m.globalAlpha=1;let b=fc(i),P={chapter:[a.chapter],artTitle:a.titleLines,chapterTitle:[a.chapterTitle],stanza1:a.stanzas[0],stanza2:a.stanzas[1],colophon:a.colophon,identity:[b[1],b[2],b[0]],status:[a.note]},x=[],M=o.textSafeRect;for(let I of o.blocks){let z=P[I.id];if(!Array.isArray(z)||!["left","center"].includes(I.align)||!Number.isFinite(I.fontSize)||I.fontSize<40)throw Error("Unsupported artwork text block");p.font=`${I.fontSize}px ${n.fontFamily}`,p.textAlign=I.align,p.textBaseline="alphabetic",p.fillStyle=I.color;for(let[k,C]of z.entries()){if(!C)continue;let G=I.y+k*I.lineHeight,X=p.measureText(C),$=I.x-X.actualBoundingBoxLeft,ie=I.x+X.actualBoundingBoxRight,Z=G-X.actualBoundingBoxAscent,Q=G+X.actualBoundingBoxDescent;if(ie-$>I.width||$<M.x||ie>M.x+M.width||Z<M.y||Q>M.y+M.height)throw Error(`The ${I.id} requires another composition`);if((I.id==="stanza1"||I.id==="stanza2")&&Z<o.reservedOrnamentBottom)throw Error("Verse overlaps miniature");p.fillText(C,I.x,G),x.push({block:I.id,text:C,left:$,right:ie,top:Z,bottom:Q})}}for(let I=0;I<x.length;I++)for(let z=I+1;z<x.length;z++){let k=x[I],C=x[z];if(k.left<C.right&&k.right>C.left&&k.top<C.bottom&&k.bottom>C.top)throw Error(`Text blocks overlap: ${k.block}/${C.block}`)}p.globalCompositeOperation="destination-out",p.globalAlpha=.075;for(let I=0;I<2300;I++)p.fillRect((I*719.27+h%103)%c,(I*437.71+h%71)%l,.6,.8);p.globalAlpha=1,p.globalCompositeOperation="source-over";let L=Au(h,"oblong");return Ru(u,S,L,o.seal),m.globalCompositeOperation="source-atop",m.drawImage(v,0,0),{front:u,back:d,ink:v,relief:S,seal:L,layout:{width:c,height:l,nominalSizeMM:o.nominalSizeMM,artPlanId:r.id,artPlanDigest:i.artPlanDigest,composition:"horizontal-miniature-and-centered-verse",paperVariant:r.resources.paper.variant,sealVersion:_c,sealVariant:"oblong",sealBox:o.seal,ornamentBox:T,ornamentDigest:n.ornamentDigest,printedFonts:[n.fontFamily],textBounds:x,issued:a.issued,recipient:a.recipient,identity:b,artifactDigest:i.artifactDigest,artSeed:h}}}var Ne=i=>document.getElementById(i),Gt=Ne("scrollCanvas"),Sc=Ne("stage"),gi=matchMedia("(prefers-reduced-motion: reduce)"),ht,Yt,Ui,Dt,Ln=!1,xi=!1,Sn=0,Lt=null,Yn=0,Ps=0,Zt=null,In=!1,Iu,Ni=i=>Ne("status").textContent=i;function Fi(){let i=Sn>=.5?"\u6536\u5377":"\u542F\u5377";Ne("toggle").textContent!==i&&(Ne("toggle").textContent=i),Ne("toggle").setAttribute("aria-label",Sn>=.5?"\u6536\u8D77\u85CF\u5377":"\u5C55\u5F00\u85CF\u5377"),Ne("unfoldHint").hidden=Sn>.025||!!Lt||!Ln,Ne("mistToggle").setAttribute("aria-pressed",String(In))}function No(i){Sn=Math.max(0,Math.min(1,i)),ht.setProgress(Sn),Fi()}function _i(){!Yn&&!xi&&!document.hidden&&Ln&&(Lt||ht?.needsMotion||In&&!gi.matches)&&(Yn=requestAnimationFrame(C0))}function Ls(){ht&&Ln&&!xi&&!document.hidden&&ht.render()}function C0(i){if(Yn=0,xi||document.hidden||!Ln)return;let e=i-Ps;if(e<7){_i();return}let t=Math.min(.05,(e||40)/1e3);if(Ps=i,Lt){let n=Lt.sample(i);No(n.progress),n.done&&(Lt=null,Fi(),Ni("\u8BBE\u8BA1\u8BD5\u6837 \xB7 \u5C1A\u672A\u9881\u53D1"))}ht.advance(t),(Lt||ht.needsMotion||ht.dirty)&&Ls(),In&&!gi.matches&&Yt?.tick(t,Sn,ht.bounds,ht.viewHeight,Math.max(.001,e/1e3),ht.interaction()),_i()}function Pn(i,{immediate:e=!1}={}){if(!(!Ln||xi)){if(e||gi.matches){Lt=null,Yt?.resetMotion(),No(i),ht.settle(),Ls(),Ni("\u8BBE\u8BA1\u8BD5\u6837 \xB7 \u5C1A\u672A\u9881\u53D1"),_i();return}Lt=new Io(Sn,i,performance.now()),Fi(),Ni(i?"\u85CF\u5377\u5C55\u5F00\u4E2D\u2026":"\u85CF\u5377\u6536\u8D77\u4E2D\u2026"),_i()}}function Mc(){Pn(Lt?Lt.to?0:1:Sn>=.5?0:1)}function Uo(){if(!ht||xi)return;let{width:i,height:e}=Sc.getBoundingClientRect();ht.resize(i,e),Ls()}function Fo(i){document.body.classList.toggle("scroll-object-only",i),Ne("leaveObject").hidden=!i,requestAnimationFrame(Uo)}async function I0(){Gt.style.visibility="hidden",Ne("mistCanvas").style.visibility="hidden";let i=await fetch("../chapter-scroll-v14/chapter-sample.json",{signal:AbortSignal.timeout(2e4)});if(!i.ok)throw Error("Chapter unavailable");Iu=await i.json();let e=new URL(location.href).searchParams,t=await fetch("../chapter-scroll-v14/art-plan.json",{signal:AbortSignal.timeout(2e4)});if(!t.ok)throw Error("Artwork plan unavailable");Dt=await bu(Iu,await t.text()),Pu();let n=vu(Dt.template),s=new FontFace(n.fontFamily,`url(${n.fontUrl})`);document.fonts.add(await s.load());let[a,r,o,c]=await Promise.all([n.skin,n.reverse,n.keeper,n.ornament].map(vc));await xc(),Ui=Cu(Dt,a,r,n,c),P0(),ht=new Ao(Gt,Ui,o,n),ht.closure.onLoadingProgress=h=>{Ne("loading").textContent=h<1?`\u6B63\u5728\u8F7D\u5165\u7CFB\u7EF3\u2026 ${Math.round(h*100)}%`:"\u6B63\u5728\u51C6\u5907\u85CF\u5377\u2026"};let l=gi.matches||e.get("open")==="1"?1:0;if(new ResizeObserver(Uo).observe(Sc),Uo(),Ne("loading").textContent="\u6B63\u5728\u51C6\u5907\u85CF\u5377\u2026",await ht.prepareMotion(l),gi.matches)Ne("mistCanvas").hidden=!0;else try{Yt=new Co(Ne("mistCanvas")),await Yt.prepare(l,ht.bounds,ht.viewHeight,ht.interaction())}catch(h){console.warn("Mist unavailable",h),Yt?.dispose(),Yt=null}Yt?.fluid||(In=!1,Ne("mistToggle").disabled=!0,Ne("mistToggle").textContent="\u9759\u666F"),Yt?.setEnabled(In),Ln=!0,No(l),ht.settle(),Ls(),Ps=performance.now(),Ne("keeperDetail").src=ht.exportKeeper(),Gt.style.visibility="",Ne("mistCanvas").style.visibility="",Ne("loading").hidden=!0;for(let h of["toggle","replay","detail","objectOnly"])Ne(h).disabled=!1;Fi(),_i(),new URL(location.href).searchParams.get("view")==="object"&&Fo(!0),window.scrollSpecimen=Object.freeze({open:()=>Pn(1),close:()=>Pn(0),setProgress:h=>Pn(h,{immediate:!0}),atmosphere:h=>bc(h),snapshot:()=>({...ht.snapshot(),ready:Ln,animating:!!Lt,chapterId:Dt.chapterId,issued:!1,layout:Ui.layout,mist:Yt?.snapshot()??{available:!1}}),exportObject:()=>ht.exportObject(),exportDocument:()=>Ui.front.toDataURL("image/png"),exportKeeper:()=>ht.exportKeeper(),exportSeal:()=>Ui.seal.ink.toDataURL("image/png"),exportSealHeight:()=>Ui.relief.toDataURL("image/png"),exportRecord:()=>({status:Dt.status,recipient:Dt.recipient,sha256:Dt.artifactDigest,canonicalPayload:Dt.canonicalPayload,proof:Dt.proof,sealVariant:Dt.sealVariant,artPlanDigest:Dt.artPlanDigest,source:Dt.artPlan.source})})}function Pu(){yc(Ne("transcriptContent"),Dt),yc(Ne("fallbackDocument"),Dt),Ne("proofIdentity").textContent=`\u5F52\u5C5E\uFF1A${Dt.recipient}
\u6837\u54C1\u65F6\u95F4\uFF1A${Dt.proof.sampleTime}
SHA-256\uFF1A${Dt.artifactDigest}`}function P0(){Pu(),Ne("detailImage").src=Ui.front.toDataURL("image/png")}function bc(i){In=!!i&&!gi.matches&&!!Yt?.fluid,Yt?.setEnabled(In),Fi(),!In&&!Lt&&!ht?.needsMotion&&(cancelAnimationFrame(Yn),Yn=0),_i()}Ne("toggle").addEventListener("click",Mc);Ne("unfoldHint").addEventListener("click",Mc);Ne("replay").addEventListener("click",()=>{Pn(0,{immediate:!0}),Pn(1)});Ne("mistToggle").addEventListener("click",()=>bc(!In));Ne("detail").addEventListener("click",()=>{Ne("transcriptDialog").showModal()});Ne("detailZoom").addEventListener("click",()=>{let i=document.querySelector(".scroll-document-detail"),e=i.dataset.zoom!=="true";i.dataset.zoom=String(e),Ne("detailZoom").setAttribute("aria-pressed",String(e)),Ne("detailZoom").textContent=e?"\u5168\u9875":"\u653E\u5927",i.scrollLeft=0});Ne("transcriptDialog").addEventListener("click",i=>{i.target===Ne("transcriptDialog")&&Ne("transcriptDialog").close()});Ne("objectOnly").addEventListener("click",()=>Fo(!0));Ne("leaveObject").addEventListener("click",()=>Fo(!1));document.addEventListener("keydown",i=>{i.key==="Escape"&&Fo(!1)});Gt.addEventListener("pointerdown",i=>{if(!Ln||xi||i.pointerType==="mouse"&&i.button!==0)return;let e=Lt?.to;Lt=null,Zt={id:i.pointerId,y:i.clientY,p:Sn,moved:!1,target:e},Gt.setPointerCapture(i.pointerId)});Gt.addEventListener("pointermove",i=>{if(!Zt||Zt.id!==i.pointerId)return;let e=i.clientY-Zt.y;Math.abs(e)>9&&(Zt.moved=!0),Zt.moved&&(No(Zt.p+e/(Sc.clientHeight*.64)),Ls())});Gt.addEventListener("pointerup",i=>{if(!Zt||Zt.id!==i.pointerId)return;let{moved:e,target:t}=Zt;Zt=null,Gt.hasPointerCapture(i.pointerId)&&Gt.releasePointerCapture(i.pointerId),e?Pn(Sn>=.5?1:0):t!==void 0?Pn(t?0:1):Mc()});Gt.addEventListener("pointercancel",()=>{let i=Zt?.target;Zt=null,i!==void 0?Pn(i):(Fi(),Ni("\u8BBE\u8BA1\u8BD5\u6837 \xB7 \u5C1A\u672A\u9881\u53D1"))});Gt.addEventListener("lostpointercapture",()=>{Zt=null});document.addEventListener("visibilitychange",()=>{document.hidden?(cancelAnimationFrame(Yn),Yn=0,Zt=null,Yt?.resetMotion()):(Ps=performance.now(),Lt?.resume(Ps),Ls(),_i())});gi.addEventListener("change",()=>{gi.matches&&(bc(!1),Lt&&Pn(Lt.to,{immediate:!0}))});Gt.addEventListener("webglcontextlost",i=>{i.preventDefault(),xi=!0,Lt=null,cancelAnimationFrame(Yn),Yn=0,Yt?.setEnabled(!1),Ne("fallback").hidden=!1,Ne("unfoldHint").hidden=!0;for(let e of["toggle","replay","objectOnly"])Ne(e).disabled=!0;Ni("\u7ACB\u4F53\u663E\u793A\u4E2D\u65AD\uFF0C\u53EF\u67E5\u770B\u9759\u6001\u5377\u9875\u3002")});Gt.addEventListener("webglcontextrestored",async()=>{xi=!1,Ln=!1,Gt.style.visibility="hidden",Ne("loading").hidden=!1;try{Uo(),await ht.prepareMotion(Sn),Yt?.resetMotion(),Ln=!0,Ne("fallback").hidden=!0,Gt.style.visibility="",Ne("loading").hidden=!0;for(let i of["toggle","replay","objectOnly"])Ne(i).disabled=!1;Yt?.setEnabled(In),Ps=performance.now(),Fi(),_i()}catch(i){console.error(i),Ne("loading").hidden=!0,Ne("fallback").hidden=!1,Ni("\u7ACB\u4F53\u663E\u793A\u6682\u4E0D\u53EF\u7528\uFF0C\u53EF\u67E5\u770B\u9759\u6001\u5377\u9875\u3002")}});I0().catch(i=>{console.error(i),Ne("loading").hidden=!0,Gt.hidden=!0,Ne("fallback").hidden=!1,Ne("unfoldHint").hidden=!0,Ni("\u85CF\u5377\u6682\u4E0D\u53EF\u7528\uFF0C\u5DF2\u4FDD\u7559\u91CA\u8BFB\u3002")});
