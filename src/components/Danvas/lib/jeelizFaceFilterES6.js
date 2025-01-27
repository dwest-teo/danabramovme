/**
 * Jeeliz Face Filter - https://github.com/jeeliz/jeelizFaceFilter
 *
 * Copyright 2018 Jeeliz ( https://jeeliz.com )
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function pa(a, b, d) {
  return a * (1 - d) + b * d;
}
function ra(a, b) {
  var d = new XMLHttpRequest();
  d.open('GET', a, !0);
  d.withCredentials = !1;
  d.onreadystatechange = function() {
    4 === d.readyState && 200 === d.status && b(d.responseText);
  };
  d.send();
}
function ua(a, b, d) {
  return Math.min(Math.max((d - a) / (b - a), 0), 1);
}
function va(a) {
  switch (a) {
    case 'relu':
      return 'gl_FragColor=max(vec4(0.,0.,0.,0.),gl_FragColor);';
    case 'elu':
      return 'gl_FragColor=mix(exp(-abs(gl_FragColor))-vec4(1.,1.,1.,1.),gl_FragColor,step(0.,gl_FragColor));';
    case 'elu01':
      return 'gl_FragColor=mix(0.1*exp(-abs(gl_FragColor))-vec4(0.1,0.1,0.1,0.1),gl_FragColor,step(0.,gl_FragColor));';
    case 'arctan':
      return 'gl_FragColor=atan(3.14159265359*texture2D(u0,vUV))/3.14159265359;';
    case 'copy':
      return '';
    default:
      return !1;
  }
}
function wa(a, b) {
  var d = b % 8;
  return (a[(b - d) / 8] >> (7 - d)) & 1;
}
function xa(a) {
  var b = JSON.parse(a);
  a = b.ne;
  var d = b.nf,
    e = b.n,
    g =
      'undefined' === typeof btoa
        ? Buffer.from(b.data, 'base64').toString('latin1')
        : atob(b.data),
    f = g.length,
    k;
  b = new Uint8Array(f);
  for (k = 0; k < f; ++k) b[k] = g.charCodeAt(k);
  g = new Float32Array(e);
  f = new Float32Array(d);
  k = a + d + 1;
  var m, q;
  for (m = 0; m < e; ++m) {
    var h = k * m;
    var t = 0 === wa(b, h) ? 1 : -1;
    var x = h + 1;
    var u = 1,
      A = 0;
    for (q = x + a - 1; q >= x; --q) (A += u * wa(b, q)), (u *= 2);
    q = A;
    x = b;
    u = h + 1 + a;
    A = f;
    var B = 0,
      C = A.length;
    for (h = u; h < u + C; ++h) (A[B] = wa(x, h)), ++B;
    for (h = x = 0; h < d; ++h) x += f[h] * Math.pow(2, -h - 1);
    t =
      0 === x && 0 === q
        ? 0
        : t * (1 + x) * Math.pow(2, 1 + q - Math.pow(2, a - 1));
    g[m] = t;
  }
  return g;
}
var l = (function() {
    function a(a, b) {
      a = c.createShader(a);
      c.shaderSource(a, b);
      c.compileShader(a);
      return c.getShaderParameter(a, c.COMPILE_STATUS) ? a : !1;
    }
    function b(b, d) {
      b = a(c.VERTEX_SHADER, b);
      d = a(c.FRAGMENT_SHADER, d);
      var E = c.createProgram();
      c.attachShader(E, b);
      c.attachShader(E, d);
      c.linkProgram(E);
      return E;
    }
    function d(a) {
      void 0 === a.Y &&
        (a.Y =
          'precision lowp float;attribute vec2 a0;varying vec2 vv0;void main(){gl_Position=vec4(a0,0.,1.),vv0=a0*.5+vec2(.5,.5);}');
      void 0 === a.sa && (a.sa = ['a0']);
      void 0 === a.ea && (a.ea = [2]);
      if (void 0 === a.precision || 'highp' === a.precision) a.precision = q;
      a.id = k++;
      void 0 !== a.Lc &&
        a.Lc.forEach(function(b, d) {
          a.c = a.c.replace(b, a.Ca[d]);
        });
      a.$a = 0;
      a.ea.forEach(function(b) {
        a.$a += 4 * b;
      });
      a.Ba = b(a.Y, 'precision ' + a.precision + ' float;\n' + a.c);
      a.m = {};
      a.f.forEach(function(b) {
        a.m[b] = c.getUniformLocation(a.Ba, b);
      });
      a.attributes = {};
      a.fa = [];
      a.sa.forEach(function(b) {
        var d = c.getAttribLocation(a.Ba, b);
        a.attributes[b] = d;
        a.fa.push(d);
      });
      if (a.h) {
        c.useProgram(a.Ba);
        f = a;
        g = a.id;
        for (var d in a.h) c.uniform1i(a.m[d], a.h[d]);
      }
      a.Dd = !0;
    }
    function e(a) {
      ya.Rc(K);
      g !== a.id &&
        (K.R(),
        (g = a.id),
        (f = a),
        c.useProgram(a.Ba),
        a.fa.forEach(function(a) {
          0 !== a && c.enableVertexAttribArray(a);
        }));
    }
    var g = -1,
      f = !1,
      k = 0,
      m = !1,
      q = 'highp',
      h = ['u1'],
      t = ['u0'],
      x = { u1: 0 },
      u = { u0: 0 },
      A = { u1: 0, u2: 1 },
      B = { u3: 0 },
      C = {
        s0: {
          c:
            'uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vv0);}',
          f: h,
          h: x,
        },
        s1: {
          c:
            'uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vv0);}',
          f: h,
          h: x,
          precision: 'lowp',
        },
        s2: {
          c:
            'uniform sampler2D u1,u2;varying vec2 vv0;void main(){vec4 a=texture2D(u2,vv0),b=texture2D(u1,vv0);gl_FragColor=a*b;}',
          f: ['u1', 'u2'],
          h: A,
        },
        s3: {
          c:
            'uniform sampler2D u1;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u1,vv0);gl_FragColor=a.r*f;}',
          f: h,
          h: x,
        },
        s4: {
          c:
            'uniform sampler2D u1,u2;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u2,vv0),b=texture2D(u1,vv0);gl_FragColor=a.a*b.r*f;}',
          f: ['u1', 'mask'],
          h: A,
        },
        s5: {
          c:
            'uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vec2(1.-vv0.x,vv0.y));}',
          f: h,
          h: x,
        },
        s6: {
          c:
            'uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vec2(vv0.x,1.-vv0.y));}',
          f: h,
          h: x,
        },
        s7: {
          c:
            'uniform sampler2D u0;uniform float u4;varying vec2 vv0;void main(){vec4 a=texture2D(u0,vv0);gl_FragColor=a*u4;}',
          f: ['u0', 'u4'],
          h: u,
        },
        s8: {
          c:
            'uniform sampler2D u0;uniform float u4;varying vec2 vv0;const vec4 g=vec4(.25,.25,.25,.25),e=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u0,vv0);float b=dot(a*u4,g);gl_FragColor=b*e;}',
          f: ['u0', 'u4'],
          h: u,
        },
        s9: {
          c:
            'uniform sampler2D u1;varying vec2 vv0;const vec4 e=vec4(1.,1.,1.,1.);void main(){float a=.25*dot(e,texture2D(u1,vv0));gl_FragColor=a*e;}',
          f: h,
          h: x,
        },
        s10: {
          c:
            'uniform sampler2D u1,u5;uniform float u6;const vec4 f=vec4(1.,1.,1.,1.);varying vec2 vv0;void main(){vec4 a=texture2D(u1,vv0),b=texture2D(u5,vv0);gl_FragColor=mix(b,a,u6*f);}',
          f: ['u1', 'u5', 'u6'],
          h: { u1: 0, u5: 1 },
        },
        s11: {
          c:
            'uniform sampler2D u1;uniform vec2 u7;varying vec2 vv0;void main(){gl_FragColor=.25*(texture2D(u1,vv0+u7)+texture2D(u1,vv0+u7*vec2(1.,-1.))+texture2D(u1,vv0+u7*vec2(-1.,-1.))+texture2D(u1,vv0+u7*vec2(-1.,1.)));}',
          f: ['u1', 'u7'],
          h: x,
        },
        s12: {
          c:
            'uniform sampler2D u1;uniform vec4 u8;varying vec2 vv0;float g(float a,float b){a=floor(a)+.5;return floor(a/exp2(b));}float h(float a,float b){return floor(a*exp2(b)+.5);}float i(float a,float b){return mod(a,h(1.,b));}float e(float c,float a,float b){a=floor(a+.5),b=floor(b+.5);return i(g(c,a),b-a);}vec4 k(float a){if(a==0.)return vec4(0.,0.,0.,0.);float l=128.*step(a,0.);a=abs(a);float c=floor(log2(a)),m=c+127.,b=(a/exp2(c)-1.)*8388608.,d=m/2.,n=fract(d)*2.,o=floor(d),p=e(b,0.,8.),q=e(b,8.,16.),r=n*128.+e(b,16.,23.),j=l+o;return vec4(p,q,r,j)/255.;}void main(){float a=dot(texture2D(u1,vv0),u8);gl_FragColor=k(a);}',
          f: ['u1', 'u8'],
          h: x,
        },
        s13: {
          c:
            'uniform sampler2D u0;varying vec2 vv0;const vec4 e=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u0,vv0),b=e/(e+exp(-a));gl_FragColor=b;}',
          f: t,
          h: u,
        },
        s14: {
          c:
            'uniform sampler2D u0;varying vec2 vv0;const vec4 e=vec4(0.,0.,0.,0.);void main(){vec4 a=texture2D(u0,vv0);gl_FragColor=max(e,a);}',
          f: t,
          h: u,
        },
        s15: {
          c:
            'uniform sampler2D u0;varying vec2 vv0;const vec4 e=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u0,vv0);gl_FragColor=mix(exp(-abs(a))-e,a,step(0.,a));}',
          f: t,
          h: u,
        },
        s16: {
          c:
            'uniform sampler2D u0;varying vec2 vv0;const vec4 e=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u0,vv0),b=exp(-abs(a))-e;gl_FragColor=mix(.1*b,a,step(0.,a));}',
          f: t,
          h: u,
        },
        s17: {
          c:
            'uniform sampler2D u0,u6,u9;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u0,vv0),c=texture2D(u6,vv0),d=texture2D(u9,vv0),b=a/d;gl_FragColor=c*mix(exp(-abs(b))-f,b,step(0.,a));}',
          f: ['u0', 'u6', 'u9'],
          h: { u0: 0, u6: 1, u9: 2 },
        },
        s18: {
          c:
            'uniform sampler2D u0;const float e=3.141593;varying vec2 vv0;void main(){gl_FragColor=atan(e*texture2D(u0,vv0))/e;}',
          f: t,
          h: u,
        },
        s19: {
          c:
            'uniform sampler2D u0;varying vec2 vv0;const vec4 e=vec4(1.,1.,1.,1.),g=vec4(.5,.5,.5,.5);void main(){vec4 a=texture2D(u0,vv0),b=log(e+a);gl_FragColor=b;}',
          f: t,
          h: u,
        },
        s20: {
          c:
            'uniform sampler2D u0;uniform float gain;varying vec2 vv0;void main(){vec4 a=texture2D(u0,vv0);gl_FragColor=exp(a);}',
          f: ['u0', 'u10'],
          h: u,
        },
        s21: {
          c:
            'uniform sampler2D u0,u11;uniform float u12;const vec2 f=vec2(.5,.5);const float g=1e-5;const vec4 h=vec4(1.,1.,1.,1.),i=vec4(0.,0.,0.,0.);varying vec2 vv0;void main(){vec4 a=texture2D(u11,f);float b=u12*u12;vec4 c=max(b*a,g*h);gl_FragColor=texture2D(u0,vv0)/c;}',
          f: ['u0', 'u13', 'u12'],
          h: { u0: 0, u13: 1 },
        },
        s22: {
          c:
            'uniform sampler2D u1;uniform vec2 u14;varying vec2 vv0;void main(){float a=u14.x*u14.y;vec2 b=floor(vv0*a)/a,c=fract(vv0*a),d=floor(b*u14.y),g=floor(u14.x*fract(b*u14.y)),f=(g*u14.y+d)/a;gl_FragColor=texture2D(u1,f+c/a);}',
          f: ['u1', 'u14'],
          h: x,
        },
        s23: {
          c:
            'uniform sampler2D u15,u16,u17;varying vec2 vv0;void main(){vec4 a=texture2D(u17,vv0);vec2 b=a.rg,c=a.ba;vec4 d=texture2D(u15,b),e=texture2D(u16,c);gl_FragColor=d*e;}',
          f: ['u15', 'u16', 'u17'],
          h: { u16: 0, u15: 1, u17: 2 },
        },
        s24: {
          c:
            'uniform float u18;uniform sampler2D u15,u16;varying vec2 vv0;void main(){vec2 a=fract(vv0*u18);vec4 b=texture2D(u15,vv0),c=texture2D(u16,a);gl_FragColor=b*c;}',
          f: ['u16', 'u15', 'u18'],
          h: { u16: 0, u15: 1 },
        },
        s25: {
          c:
            'uniform float u18;uniform sampler2D u15,u16,u19,u20,u21,u22;varying vec2 vv0;const vec4 e=vec4(1.,1.,1.,1.),g=vec4(1e-3,1e-3,1e-3,1e-3);void main(){vec2 i=vv0*u18,m=floor(i),c=i-m;vec4 n=texture2D(u15,vv0),d=texture2D(u16,c),a=texture2D(u22,vv0);a=a*255.;vec4 o=texture2D(u19,c),p=texture2D(u20,c),q=texture2D(u21,c),j=step(-g,-a),b=e-j,k=b*step(-e-g,-a);b*=e-k;vec4 h=b*step(-2.*e-g,-a);b*=e-h;vec4 l=b;d=j*d+k*o+h*p+l*q,gl_FragColor=n*d;}',
          f: 'u15 u16 u18 u22 u19 u20 u21'.split(' '),
          h: { u16: 0, u15: 1, u22: 3, u19: 4, u20: 5, u21: 6 },
        },
        s26: {
          c:
            'uniform sampler2D u15,u16,u23;uniform float u18,u24,u25,u26;varying vec2 vv0;const vec2 j=vec2(1.,1.);void main(){vec2 a=floor(u24*vv0),g=u24*vv0-a;float b=u18/u24;vec2 c=floor(g*b),d=g*b-c,h=(a+d)/u24;float l=u24*u26/u18;vec2 m=l*c,i=(m+d*u25)/u26,e=step(i,j);vec4 n=texture2D(u15,h),o=texture2D(u16,i),p=n*o*e.x*e.y,k=texture2D(u23,h);gl_FragColor=p*u25*u25+k;}',
          f: 'u15 u16 u18 u24 u25 u26 u23'.split(' '),
          h: { u16: 0, u15: 1, u23: 2 },
        },
        s27: {
          c:
            'uniform sampler2D u15,u16;varying vec2 vv0;void main(){vec4 a=texture2D(u15,vv0),b=texture2D(u16,vv0);gl_FragColor=a*b;}',
          f: ['u15', 'u16'],
          h: { u16: 0, u15: 1 },
        },
        s28: {
          c:
            'uniform sampler2D u1,u23;uniform float u27;varying vec2 vv0;void main(){gl_FragColor=texture2D(u23,vv0)+u27*texture2D(u1,vv0);}',
          f: ['u1', 'u23', 'u27'],
          h: { u1: 0, u23: 1 },
        },
        s29: {
          c:
            'varying vec2 vv0;uniform sampler2D u1;const vec4 g=vec4(1.,1.,1.,1.),e=vec4(.299,.587,.114,0.);void main(){vec4 a=texture2D(u1,vv0);gl_FragColor=dot(a,e)*g;}',
          f: h,
          h: x,
          precision: 'lowp',
        },
        s30: {
          c:
            'varying vec2 vv0;uniform sampler2D u1,u2;uniform float u28;const vec4 g=vec4(1.,1.,1.,1.);void main(){vec4 a=vec4(0.);a-=texture2D(u1,vec2(vv0.x-u28,vv0.y-u28))*1.,a-=texture2D(u1,vec2(vv0.x-u28,vv0.y))*2.,a-=texture2D(u1,vec2(vv0.x-u28,vv0.y+u28))*1.,a+=texture2D(u1,vec2(vv0.x+u28,vv0.y-u28))*1.,a+=texture2D(u1,vec2(vv0.x+u28,vv0.y))*2.,a+=texture2D(u1,vec2(vv0.x+u28,vv0.y+u28))*1.;vec4 b=vec4(0.);b-=texture2D(u1,vec2(vv0.x-u28,vv0.y-u28))*1.,b-=texture2D(u1,vec2(vv0.x,vv0.y-u28))*2.,b-=texture2D(u1,vec2(vv0.x+u28,vv0.y-u28))*1.,b+=texture2D(u1,vec2(vv0.x-u28,vv0.y+u28))*1.,b+=texture2D(u1,vec2(vv0.x,vv0.y+u28))*2.,b+=texture2D(u1,vec2(vv0.x+u28,vv0.y+u28))*1.;vec3 c=sqrt(a.rgb*a.rgb+b.rgb*b.rgb);vec4 e=vec4(c,texture2D(u1,vv0).a),f=texture2D(u2,vv0);gl_FragColor=f.a*e.r*g;}',
          f: ['u1', 'u2', 'u28'],
          h: A,
        },
        s31: {
          c:
            'varying vec2 vv0;uniform sampler2D u1,u2;uniform float u28;const vec4 j=vec4(1.,1.,1.,1.);const vec2 k=vec2(1.,1.);void main(){float i=0.;vec2 l=k*u28,b,c;float d,a,g=0.;for(float f=-4.;f<=4.;f+=1.)for(float e=-4.;e<=4.;e+=1.)b=vec2(f,e),d=length(b)/2.,a=exp(-d*d),c=vv0+l*b,a=1.,i+=a*texture2D(u1,c).r,g+=a;vec4 m=texture2D(u2,vv0);gl_FragColor=m.a*(texture2D(u1,c).r-i/g)*j;}',
          f: ['u1', 'u2', 'u28'],
          h: A,
        },
        s32: {
          c:
            'uniform sampler2D u3;uniform vec2 u7;varying vec2 vv0;vec4 e(vec4 a,vec4 b){vec4 c=step(a,b);return mix(a,b,c);}const vec2 h=vec2(.5,.5),i=vec2(1.,0.),j=vec2(0.,1.);void main(){vec2 a=vv0-u7*h;vec4 b=texture2D(u3,a),c=texture2D(u3,a+u7*i),d=texture2D(u3,a+u7*j),k=texture2D(u3,a+u7),l=e(b,c),g=e(d,k);gl_FragColor=e(l,g);}',
          f: ['u3', 'u7'],
          h: B,
        },
        s33: {
          c:
            'uniform sampler2D u3;uniform vec2 u7;varying vec2 vv0;const vec2 j=vec2(1.,0.),k=vec2(0.,1.),l=vec2(2.,0.),m=vec2(0.,2.);vec4 e(vec4 a,vec4 b){vec4 c=step(a,b);return mix(a,b,c);}vec4 f(vec2 a){vec4 b=texture2D(u3,a),c=texture2D(u3,a+u7*j),d=texture2D(u3,a+u7*k),g=texture2D(u3,a+u7),i=e(b,c),h=e(d,g);return e(i,h);}void main(){vec2 a=vv0+u7*vec2(-.55,-1.05);vec4 b=f(a),c=f(a+u7*l),d=f(a+u7*2.),g=f(a+u7*m),i=e(b,c),h=e(d,g);gl_FragColor=e(i,h);}',
          f: ['u3', 'u7'],
          h: B,
        },
        s34: {
          c:
            'uniform sampler2D u1;varying vec2 vv0;void main(){vec4 a=texture2D(u1,vv0);gl_FragColor=a*a;}',
          f: ['u1'],
          h: x,
          precision: 'lowp',
        },
        s35: {
          c:
            'uniform sampler2D u1;uniform vec2 u7;varying vec2 vv0;const vec4 g=vec4(1.,1.,1.,1.);const float d=15444.;void main(){vec4 a=1001./d*texture2D(u1,vv0-3.*u7)+2002./d*texture2D(u1,vv0-2.*u7)+3003./d*texture2D(u1,vv0-u7)+3432./d*texture2D(u1,vv0)+3003./d*texture2D(u1,vv0+u7)+2002./d*texture2D(u1,vv0+2.*u7)+1001./d*texture2D(u1,vv0+3.*u7);gl_FragColor=a;}',
          f: ['u7', 'u1'],
          h: x,
          precision: 'lowp',
        },
        s36: {
          c:
            'uniform sampler2D u1,u29,u30;varying vec2 vv0;const vec4 g=vec4(1.,1.,1.,1.);const float h=.1;void main(){vec4 a=texture2D(u29,vv0),b=texture2D(u30,vv0),c=texture2D(u1,vv0),d=max(g*h,b-a*a),f=sqrt(d);gl_FragColor=(c-a)/f;}',
          f: ['u1', 'u29', 'u30'],
          h: { u1: 0, u29: 1, u30: 2 },
        },
      },
      F = {
        s37: {
          c:
            'uniform float u18,u31;uniform sampler2D u15,u16,u23;varying vec2 vv0;const vec2 o=vec2(0.,0.),h=vec2(1.,1.),i=vec2(.5,.5),m=vec2(.01,.01);void main(){vec4 j=texture2D(u23,vv0);float f=1.1111;vec2 a,l,b=o,c=m/u18,k=floor(vv0*u18+c);float p=f*u18;vec2 n=h*(f-1.)/2.;for(float d=0.;d<1.1111;d+=1.){b.x=d;for(float e=0.;e<1.1111;e+=1.)b.y=e,a=(k+i+u31*(b-n))/u18,a+=step(a,-c),a-=step(h-c,a),l=(k*f+b+i)/p,j+=texture2D(u15,l)*texture2D(u16,a);}gl_FragColor=j,gl_FragColor*=2.2222;}',
          f: ['u18', 'u15', 'u16', 'u23', 'u31'],
          Ca: ['1.1111', 'gl_FragColor\\*=2.2222;'],
        },
        s38: {
          c:
            'uniform float u18,u31,u26;uniform sampler2D u15,u16,u23;varying vec2 vv0;const vec2 m=vec2(0.,0.),j=vec2(1.,1.),n=vec2(.5,.5),u=vec2(.01,.01);void main(){vec4 p=texture2D(u23,vv0);float q=1.1111,i=3.3333;vec2 a,s,t,r,b=m,c=m,d=u/u26,o=floor(vv0*u18+d);float k=q*u26;vec2 v=j*(q-1.)/2.;float w=k/u18;vec2 x=o*i;for(float g=0.;g<1.1111;g+=1.){b.x=g;for(float f=0.;f<1.1111;f+=1.){b.y=f;for(float h=0.;h<3.3333;h+=1.){c.x=h;for(float e=0.;e<3.3333;e+=1.)c.y=e,t=x+c+i*u31*(b-v),a=(t+n)/u26,a+=step(a,-d),a-=step(j-d,a),r=b*i+c,s=(o*w+r+n)/k,p+=texture2D(u15,s)*texture2D(u16,a);}}}gl_FragColor=p,gl_FragColor*=2.2222;}',
          f: 'u18 u26 u15 u16 u23 u31'.split(' '),
          Ca: ['1.1111', 'gl_FragColor\\*=2.2222;', '3.3333'],
        },
      },
      K = {
        Ta: function() {
          return m;
        },
        l: function() {
          if (!m) {
            q = 'highp';
            for (var a in C) d(C[a], a);
            l.set('s0');
            c.enableVertexAttribArray(0);
            a = za.l();
            m = !0;
            return a;
          }
        },
        Rb: function(a) {
          a.forEach(function(a) {
            K.Qb(a);
          });
        },
        Qb: function(a) {
          C[a.id] = a;
          d(a, a.id);
        },
        pb: function(a, b, e) {
          b || (b = a);
          C[b] = Object.create(F[a]);
          F[a].Ca &&
            F[a].Ca.forEach(function(a, d) {
              C[b].c = C[b].c.replace(new RegExp(a, 'g'), e[d]);
            });
          d(C[b], b);
        },
        set: function(a) {
          e(C[a]);
        },
        mc: function(a) {
          return 'undefined' !== typeof C[a];
        },
        qd: function() {
          return f.nd;
        },
        R: function() {
          -1 !== g &&
            ((g = -1),
            f.fa.forEach(function(a) {
              0 !== a && c.disableVertexAttribArray(a);
            }));
        },
        Ya: function() {
          var a = 0;
          f.fa.forEach(function(b, d) {
            d = f.ea[d];
            c.vertexAttribPointer(b, d, c.FLOAT, !1, f.$a, a);
            a += 4 * d;
          });
        },
        hb: function() {
          c.enableVertexAttribArray(0);
        },
        oa: function() {
          c.vertexAttribPointer(f.fa[0], 2, c.FLOAT, !1, 8, 0);
        },
        Ib: function(a, b) {
          c.uniform1i(f.m[a], b);
        },
        u: function(a, b) {
          c.uniform1f(f.m[a], b);
        },
        P: function(a, b, d) {
          c.uniform2f(f.m[a], b, d);
        },
        Sd: function(a, b) {
          c.uniform2fv(f.m[a], b);
        },
        Td: function(a, b) {
          c.uniform3fv(f.m[a], b);
        },
        Sc: function(a, b, d, e) {
          c.uniform3f(f.m[a], b, d, e);
        },
        Jb: function(a, b) {
          c.uniform4fv(f.m[a], b);
        },
        Ud: function(a, b) {
          c.uniformMatrix2fv(f.m[a], !1, b);
        },
        Vd: function(a, b) {
          c.uniformMatrix3fv(f.m[a], !1, b);
        },
        Wd: function(a, b) {
          c.uniformMatrix4fv(f.m[a], !1, b);
        },
        J: function(a, b) {
          K.set(a);
          b.forEach(function(a) {
            switch (a.type) {
              case '4f':
                c.uniform4fv(f.m[a.name], a.value);
                break;
              case '3f':
                c.uniform3fv(f.m[a.name], a.value);
                break;
              case '2f':
                c.uniform2fv(f.m[a.name], a.value);
                break;
              case '1f':
                c.uniform1f(f.m[a.name], a.value);
                break;
              case '1i':
                c.uniform1i(f.m[a.name], a.value);
                break;
              case 'mat2':
                c.uniformMatrix2fv(f.m[a.name], !1, a.value);
                break;
              case 'mat3':
                c.uniformMatrix3fv(f.m[a.name], !1, a.value);
                break;
              case 'mat4':
                c.uniformMatrix4fv(f.m[a.name], !1, a.value);
            }
          });
        },
      };
    return K;
  })(),
  c = !1,
  Ba = (function() {
    function a(a) {
      console.log('ERROR in ContextFeedForward : ', a);
      return !1;
    }
    var b = !1,
      d = !1,
      e = !1,
      g = !1,
      f = !0,
      k = !1,
      m = {
        w: function() {
          return b.width;
        },
        L: function() {
          return b.height;
        },
        rd: function() {
          return b;
        },
        pd: function() {
          return c;
        },
        o: function() {
          return f;
        },
        flush: function() {
          c.flush();
        },
        rc: function() {
          k || (k = new Uint8Array(b.width * b.height * 4));
          c.readPixels(0, 0, b.width, b.height, c.RGBA, c.UNSIGNED_BYTE, k);
          return k;
        },
        td: function() {
          return b.toDataURL('image/jpeg');
        },
        ud: function() {
          w.I();
          d ||
            ((d = document.createElement('canvas')), (e = d.getContext('2d')));
          d.width = b.width;
          d.height = b.height;
          var a = m.rc(),
            f = e.createImageData(d.width, d.height),
            g,
            k,
            u = d.width,
            A = d.height,
            B = f.data;
          for (k = 0; k < A; ++k) {
            var C = A - k - 1;
            for (g = 0; g < u; ++g) {
              var F = 4 * (k * u + g);
              var K = 4 * (C * u + g);
              B[F] = a[K];
              B[F + 1] = a[K + 1];
              B[F + 2] = a[K + 2];
              B[F + 3] = a[K + 3];
            }
          }
          e.putImageData(f, 0, 0);
          return d.toDataURL('image/png');
        },
        sd: function(a) {
          !d &&
            a &&
            ((d = document.createElement('canvas')), (e = d.getContext('2d')));
          var f = a ? d : document.createElement('canvas');
          f.width = b.width;
          f.height = b.height;
          (a ? e : f.getContext('2d')).drawImage(b, 0, 0);
          return f;
        },
        l: function(d) {
          d.fc && !d.ia
            ? (b = document.getElementById(d.fc))
            : d.ia && (b = d.ia);
          b || (b = document.createElement('canvas'));
          b.width = d && void 0 !== d.width ? d.width : 512;
          b.height = d && void 0 !== d.height ? d.height : 512;
          'undefined' === typeof d && (d = {});
          void 0 === d.premultipliedAlpha && (d.premultipliedAlpha = !1);
          void 0 === d.rb && (d.rb = !0);
          void 0 === d.antialias && (d.antialias = !1);
          var e = {
              antialias: d.antialias,
              alpha: !0,
              preserveDrawingBuffer: !0,
              premultipliedAlpha: d.premultipliedAlpha,
              stencil: !1,
              depth: d.rb,
            },
            k;
          if (
            (k =
              /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream)
          )
            (k = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/)),
              (k = 12 === parseInt(k[1], 10));
          k || (c = b.getContext('webgl2', e));
          c
            ? (f = !0)
            : ((c = b.getContext('webgl', e)) ||
                (c = b.getContext('experimental-webgl', e)),
              (f = !1));
          if (!c) return a('WebGL is not enabled');
          (g = c.getExtension('WEBGL_lose_context')) &&
            b.addEventListener('webglcontextlost', d.Hc, !1);
          if (!z.l()) return a('Not enough capabilities');
          if (!z.ac() && f)
            return a('Your configuration cannot process color buffer float');
          c.clearColor(0, 0, 0, 0);
          c.disable(c.DEPTH_TEST);
          c.disable(c.BLEND);
          c.disable(c.DITHER);
          c.disable(c.STENCIL_TEST);
          c.GENERATE_MIPMAP_HINT && c.hint(c.GENERATE_MIPMAP_HINT, c.FASTEST);
          c.disable(c.SAMPLE_ALPHA_TO_COVERAGE);
          c.disable(c.SAMPLE_COVERAGE);
          return !0;
        },
        yc: function() {
          if (!l.l()) return !1;
          c.depthFunc(c.LEQUAL);
          c.clearDepth(1);
          return !0;
        },
      };
    return m;
  })(),
  ya = (function() {
    var a = 'undefined' === typeof l ? JEShaders : l;
    return {
      Rc: function(b) {
        a !== b && (a.R(), (a = b));
      },
      Ta: function() {
        return a.Ta();
      },
      oa: function() {
        a.oa();
      },
      Ya: function() {
        a.Ya();
      },
      R: function() {
        a.R();
      },
      set: function(b) {
        a.set(b);
      },
    };
  })(),
  M = (function() {
    var a,
      b,
      d = 0,
      e = -2,
      g = -2,
      f = !1,
      k = {
        reset: function() {
          g = e = -2;
        },
        l: function() {
          f ||
            ((a = c.createBuffer()),
            c.bindBuffer(c.ARRAY_BUFFER, a),
            c.bufferData(
              c.ARRAY_BUFFER,
              new Float32Array([-1, -1, 3, -1, -1, 3]),
              c.STATIC_DRAW
            ),
            (b = c.createBuffer()),
            c.bindBuffer(c.ELEMENT_ARRAY_BUFFER, b),
            c.bufferData(
              c.ELEMENT_ARRAY_BUFFER,
              new Uint16Array([0, 1, 2]),
              c.STATIC_DRAW
            ),
            k.ga_(),
            (f = !0));
        },
        a: function(a) {
          var b = d++,
            f = a.ca.length,
            k = c.createBuffer();
          c.bindBuffer(c.ARRAY_BUFFER, k);
          c.bufferData(
            c.ARRAY_BUFFER,
            a.Mb instanceof Float32Array ? a.Mb : new Float32Array(a.Mb),
            c.STATIC_DRAW
          );
          e = b;
          if (a.ca) {
            var m = c.createBuffer();
            c.bindBuffer(c.ELEMENT_ARRAY_BUFFER, m);
            if (65536 > a.ca.length) {
              var u = Uint16Array;
              var A = c.UNSIGNED_SHORT;
              var B = 2;
            } else (u = Uint32Array), (A = c.UNSIGNED_INT), (B = 4);
            c.bufferData(
              c.ELEMENT_ARRAY_BUFFER,
              a.ca instanceof u ? a.ca : new u(a.ca),
              c.STATIC_DRAW
            );
            g = b;
          }
          var C = {
            $b: function(a) {
              e !== b && (c.bindBuffer(c.ARRAY_BUFFER, k), (e = b));
              a && ya.Ya();
            },
            Yb: function() {
              g !== b && (c.bindBuffer(c.ELEMENT_ARRAY_BUFFER, m), (g = b));
            },
            bind: function(a) {
              C.$b(a);
              C.Yb();
            },
            ld: function() {
              c.drawElements(c.TRIANGLES, f, A, 0);
            },
            md: function(a, b) {
              c.drawElements(c.TRIANGLES, a, A, b * B);
            },
            remove: function() {
              c.deleteBuffer(k);
              a.ca && c.deleteBuffer(m);
              C = null;
            },
          };
          return C;
        },
        ga_: function() {
          -1 !== e && (c.bindBuffer(c.ARRAY_BUFFER, a), (e = -1));
          -1 !== g && (c.bindBuffer(c.ELEMENT_ARRAY_BUFFER, b), (g = -1));
        },
        g: function(a, b) {
          a && M.ga_();
          b && ya.oa();
          c.drawElements(c.TRIANGLES, 3, c.UNSIGNED_SHORT, 0);
        },
        qc: function() {
          c.deleteBuffer(a);
          c.deleteBuffer(b);
        },
      };
    return k;
  })(),
  w = (function() {
    var a,
      b,
      d,
      e = !1,
      g = { v: -2, oc: 1 };
    return {
      l: function() {
        if (!e) {
          a = c.createFramebuffer();
          var f = z.o();
          b = f && c.DRAW_FRAMEBUFFER ? c.DRAW_FRAMEBUFFER : c.FRAMEBUFFER;
          d = f && c.READ_FRAMEBUFFER ? c.READ_FRAMEBUFFER : c.FRAMEBUFFER;
          e = !0;
        }
      },
      wd: function() {
        return b;
      },
      Pa: function() {
        return d;
      },
      aa: function() {
        return c.FRAMEBUFFER;
      },
      yd: function() {
        return g;
      },
      od: function() {
        return a;
      },
      a: function(d) {
        void 0 === d.qb && (d.qb = !1);
        var e = d.pa ? d.pa : !1,
          f = d.width,
          q = void 0 !== d.height ? d.height : d.width,
          h = a,
          t = !1,
          x = !1,
          u = 0;
        e && ((f = f ? f : e.w()), (q = q ? q : e.L()));
        var A = {
          Hb: function() {
            x || ((h = c.createFramebuffer()), (x = !0), (u = g.oc++));
          },
          Pb: function() {
            A.Hb();
            A.j();
            t = c.createRenderbuffer();
            c.bindRenderbuffer(c.RENDERBUFFER, t);
            c.renderbufferStorage(c.RENDERBUFFER, c.DEPTH_COMPONENT16, f, q);
            c.framebufferRenderbuffer(b, c.DEPTH_ATTACHMENT, c.RENDERBUFFER, t);
            c.clearDepth(1);
          },
          bind: function(a, d) {
            u !== g.v && (c.bindFramebuffer(b, h), (g.v = u));
            e && e.j();
            d && c.viewport(0, 0, f, q);
            a && c.clear(c.COLOR_BUFFER_BIT | c.DEPTH_BUFFER_BIT);
          },
          dd: function() {
            u !== g.v && (c.bindFramebuffer(b, h), (g.v = u));
          },
          clear: function() {
            c.clear(c.COLOR_BUFFER_BIT | c.DEPTH_BUFFER_BIT);
          },
          gd: function() {
            c.clear(c.COLOR_BUFFER_BIT);
          },
          hd: function() {
            c.clear(c.DEPTH_BUFFER_BIT);
          },
          Tc: function() {
            c.viewport(0, 0, f, q);
          },
          j: function() {
            u !== g.v && (c.bindFramebuffer(b, h), (g.v = u));
          },
          rtt: function(a) {
            e = a;
            g.v !== u && (c.bindFramebuffer(c.FRAMEBUFFER, h), (g.v = u));
            a.j();
          },
          I: function() {
            c.bindFramebuffer(b, null);
            g.v = -1;
          },
          resize: function(a, b) {
            f = a;
            q = b;
            t &&
              (c.bindRenderbuffer(c.RENDERBUFFER, t),
              c.renderbufferStorage(c.RENDERBUFFER, c.DEPTH_COMPONENT16, f, q));
          },
          remove: function() {
            c.bindFramebuffer(b, h);
            c.framebufferTexture2D(
              b,
              c.COLOR_ATTACHMENT0,
              c.TEXTURE_2D,
              null,
              0
            );
            t &&
              c.framebufferRenderbuffer(
                b,
                c.DEPTH_ATTACHMENT,
                c.RENDERBUFFER,
                null
              );
            c.bindFramebuffer(b, null);
            c.deleteFramebuffer(h);
            t && c.deleteRenderbuffer(t);
            A = null;
          },
        };
        d.qb && A.Pb();
        return A;
      },
      I: function() {
        c.bindFramebuffer(b, null);
        g.v = -1;
      },
      Zc: function() {
        c.bindFramebuffer(b, null);
        c.clear(c.COLOR_BUFFER_BIT | c.DEPTH_BUFFER_BIT);
        c.viewport(0, 0, z.w(), z.L());
        g.v = -1;
      },
      reset: function() {
        g.v = -2;
      },
      S: function() {
        0 !== g.v && (c.bindFramebuffer(b, a), (g.v = 0));
      },
      clear: function() {
        c.viewport(0, 0, z.w(), z.L());
        c.clear(c.COLOR_BUFFER_BIT);
      },
    };
  })(),
  V = (function() {
    function a(a) {
      c.bindTexture(c.TEXTURE_2D, a);
    }
    function b(a) {
      ja[0] = a;
      a = sa[0];
      var b = (a >> 16) & 32768,
        d = (a >> 12) & 2047,
        L = (a >> 23) & 255;
      return 103 > L
        ? b
        : 142 < L
        ? b | 31744 | ((255 == L ? 0 : 1) && a & 8388607)
        : 113 > L
        ? ((d |= 2048), b | ((d >> (114 - L)) + ((d >> (113 - L)) & 1)))
        : (b = (b | ((L - 112) << 10) | (d >> 1)) + (d & 1));
    }
    function d(a) {
      var d = new Uint16Array(a.length);
      a.forEach(function(a, L) {
        d[L] = b(a);
      });
      return d;
    }
    function e() {
      if (null !== W.Qa) return W.Qa;
      var a = f(d([1, 1, 1, 1]));
      return null === a ? !0 : (W.Qa = a);
    }
    function g() {
      if (null !== W.Ra) return W.Ra;
      var a = f(new Uint8Array([255, 255, 255, 255]));
      return null === a ? !0 : (W.Ra = a);
    }
    function f(a) {
      if (!ya.Ta() || !B) return null;
      a = Q.a({ isFloat: !1, G: !0, array: a, width: 1 });
      w.I();
      c.viewport(0, 0, 1, 1);
      c.clearColor(0, 0, 0, 0);
      c.clear(c.COLOR_BUFFER_BIT);
      ya.set('s0');
      a.bb(0);
      M.g(!1, !0);
      var b = new Uint8Array(4);
      c.readPixels(0, 0, 1, 1, c.RGBA, c.UNSIGNED_BYTE, b);
      b = 0.9 < b[0];
      a.remove();
      w.S();
      return b;
    }
    var k = 0,
      m,
      q = 0,
      h,
      t = !1,
      x,
      u,
      A,
      B = !1,
      C = !1,
      F,
      K,
      E,
      aa = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]],
      da = !1,
      na = !1,
      ja = new Float32Array(1),
      sa = new Int32Array(ja.buffer),
      W = { Qa: null, Ra: null },
      Q = {
        l: function() {
          if (!B) {
            u = [c.RGB, !1, c.RGB, c.RGBA];
            A = [c.RGB, !1, c.RGB, c.RGBA];
            m = [
              c.TEXTURE0,
              c.TEXTURE1,
              c.TEXTURE2,
              c.TEXTURE3,
              c.TEXTURE4,
              c.TEXTURE5,
              c.TEXTURE6,
              c.TEXTURE7,
            ];
            da = 'undefined' !== typeof JEContext;
            na = 'undefined' !== typeof z;
            da && JEContext.Kd() && m.push(c.TEXTURE8, c.TEXTURE9);
            h = [-1, -1, -1, -1, -1, -1, -1, -1];
            x = [c.UNSIGNED_BYTE, c.FLOAT, c.FLOAT];
            if (!t) {
              for (var a = new Float32Array(16384), b = 0; 16384 > b; ++b)
                a[b] = 2 * Math.random() - 1;
              t = {
                random: Q.a({ isFloat: !0, isPot: !0, array: a, width: 64 }),
                Lb: Q.a({
                  isFloat: !1,
                  isPot: !0,
                  width: 1,
                  array: new Uint8Array([0, 0, 0, 0]),
                }),
              };
            }
            B = !0;
          }
        },
        xc: function() {
          Q.$c();
        },
        Bd: function() {
          return t.Lb;
        },
        $c: function() {
          x[1] = z.va();
        },
        Nc: function() {
          A = u = [c.RGBA, c.RGBA, c.RGBA, c.RGBA];
        },
        Md: function(a, b) {
          l.set('s1');
          w.I();
          var d = a.w(),
            L = a.L();
          c.viewport(0, 0, d, L);
          a.b(0);
          M.g(!1, !1);
          c.readPixels(0, 0, d, L, c.RGBA, c.UNSIGNED_BYTE, b);
        },
        pc: function(b, d, e) {
          c.activeTexture(c.TEXTURE0);
          k = 0;
          var L = c.createTexture();
          a(L);
          var f = z.o() && c.RGBA32F ? c.RGBA32F : c.FLOAT;
          d = d instanceof Float32Array ? d : new Float32Array(d);
          var g = Math.log(d.length) / Math.log(2);
          g !== Math.floor(g) &&
            (c.texParameteri(c.TEXTURE_2D, c.TEXTURE_WRAP_S, c.CLAMP_TO_EDGE),
            c.texParameteri(c.TEXTURE_2D, c.TEXTURE_WRAP_T, c.CLAMP_TO_EDGE));
          c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MAG_FILTER, c.NEAREST);
          c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MIN_FILTER, c.NEAREST);
          c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, e);
          c.texImage2D(c.TEXTURE_2D, 0, c.RGBA, b.w(), b.L(), 0, c.RGBA, f, d);
          a(null);
          c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, !1);
          w.S();
          l.set('s0');
          b.A();
          c.clearColor(0, 0, 0, 0);
          c.clear(c.COLOR_BUFFER_BIT);
          a(L);
          M.g(!0, !1);
          c.deleteTexture(L);
        },
        a: function(b) {
          function f() {
            a(N);
            ba && c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, ba);
            b.isPot
              ? (c.texParameteri(
                  c.TEXTURE_2D,
                  c.TEXTURE_WRAP_S,
                  b.ub ? c.MIRRORED_REPEAT : c.REPEAT
                ),
                c.texParameteri(
                  c.TEXTURE_2D,
                  c.TEXTURE_WRAP_T,
                  b.U ? c.MIRRORED_REPEAT : c.REPEAT
                ))
              : (c.texParameteri(
                  c.TEXTURE_2D,
                  c.TEXTURE_WRAP_S,
                  c.CLAMP_TO_EDGE
                ),
                c.texParameteri(
                  c.TEXTURE_2D,
                  c.TEXTURE_WRAP_T,
                  c.CLAMP_TO_EDGE
                ));
            b.wa &&
              'undefined' !== typeof JESETTINGS &&
              c.texParameterf(
                c.TEXTURE_2D,
                JEContext.vd().TEXTURE_MAX_ANISOTROPY_EXT,
                JESETTINGS.bd
              );
            c.texParameteri(
              c.TEXTURE_2D,
              c.TEXTURE_MAG_FILTER,
              b.isLinear ? c.LINEAR : c.NEAREST
            );
            b.isLinear
              ? c.texParameteri(
                  c.TEXTURE_2D,
                  c.TEXTURE_MIN_FILTER,
                  b.isMipmap && !ka ? c.NEAREST_MIPMAP_LINEAR : c.LINEAR
                )
              : c.texParameteri(
                  c.TEXTURE_2D,
                  c.TEXTURE_MIN_FILTER,
                  b.isMipmap && !ka ? c.NEAREST_MIPMAP_NEAREST : c.NEAREST
                );
            S = u[b.ma - 1];
            P = A[b.ma - 1];
            U = x[t];
            if (z.o()) {
              var d = c.RGBA32F;
              S === c.RGBA && U === c.FLOAT && d && (P = d);
              S === c.RGB && U === c.FLOAT && d && ((P = d), (S = c.RGBA));
            }
            if ((b.G && !b.isFloat) || (b.isFloat && b.isMipmap && za.Ac()))
              (d = c.RGBA16F) && (P = d), (U = z.va());
            b.xb && 'undefined' !== typeof c.texStorage2D && (Z = b.xb);
            b.vb && 4 === b.ma && (S = JEContext.zd());
            if (b.D) c.texImage2D(c.TEXTURE_2D, 0, P, S, U, b.D);
            else if (b.url) c.texImage2D(c.TEXTURE_2D, 0, P, S, U, v);
            else if (G) {
              try {
                var e = c.getError();
                e !== c.NO_ERROR && console.log('GLERR in SharedTexture :', e);
                c.texImage2D(c.TEXTURE_2D, 0, P, n, r, 0, S, U, G);
                c.getError() !== c.NO_ERROR &&
                  (c.texImage2D(c.TEXTURE_2D, 0, P, n, r, 0, S, U, null),
                  c.getError() !== c.NO_ERROR &&
                    c.texImage2D(
                      c.TEXTURE_2D,
                      0,
                      c.RGBA,
                      n,
                      r,
                      0,
                      c.RGBA,
                      c.UNSIGNED_BYTE,
                      null
                    ));
              } catch (cb) {
                c.texImage2D(c.TEXTURE_2D, 0, P, n, r, 0, S, U, null);
              }
              b.isKeepArray || (G = null);
            } else c.texImage2D(c.TEXTURE_2D, 0, P, n, r, 0, S, U, null);
            if (b.isMipmap)
              if (!ka && J) J.Oa(), (qa = !0);
              else if (ka) {
                e = Math.log(Math.min(n, r)) / Math.log(2);
                la = Array(1 + e);
                la[0] = N;
                for (d = 1; d <= e; ++d) {
                  var f = Math.pow(2, d);
                  var g = n / f;
                  f = r / f;
                  var O = c.createTexture();
                  a(O);
                  c.texParameteri(
                    c.TEXTURE_2D,
                    c.TEXTURE_MIN_FILTER,
                    c.NEAREST
                  );
                  c.texParameteri(
                    c.TEXTURE_2D,
                    c.TEXTURE_MAG_FILTER,
                    c.NEAREST
                  );
                  c.texImage2D(c.TEXTURE_2D, 0, P, g, f, 0, S, U, null);
                  a(null);
                  la[d] = O;
                }
                qa = !0;
              }
            a(null);
            h[k] = -1;
            ba && c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, !1);
            p = !0;
            R && J && (R(J), (R = !1));
          }
          'undefined' === typeof b.isFloat && (b.isFloat = !1);
          'undefined' === typeof b.G && (b.G = !1);
          'undefined' === typeof b.isPot && (b.isPot = !0);
          'undefined' === typeof b.isLinear && (b.isLinear = !1);
          'undefined' === typeof b.isMipmap && (b.isMipmap = !1);
          'undefined' === typeof b.Ga && (b.Ga = !1);
          void 0 === b.wa && (b.wa = !1);
          void 0 === b.U && (b.U = !1);
          void 0 === b.ub && (b.ub = !1);
          void 0 === b.vb && (b.vb = !1);
          void 0 === b.ma && (b.ma = 4);
          void 0 === b.sb && (b.sb = !1);
          'undefined' === typeof b.isFlipY &&
            (b.isFlipY = b.url || b.array ? !0 : !1);
          'undefined' === typeof b.isKeepArray && (b.isKeepArray = !1);
          b.data &&
            ((b.array =
              'string' === typeof b.data
                ? xa(b.data)
                : b.isFloat
                ? new Float32Array(b.data)
                : new Uint8Array(b.data)),
            (b.isFlipY = !1));
          var t = 0,
            L = b.D ? !0 : !1,
            B = null,
            X = null,
            ca = !1,
            W = null;
          b.isFloat && (b.G = !0);
          b.G && (t = 1);
          b.sb || z.o() || !b.isFloat || !na || z.eb() || (b.isFloat = !1);
          b.isFloat && (t = 2);
          b.wa && da && !JEContext.Fd() && (b.wa = !1);
          var N = c.createTexture(),
            R = b.Ga,
            v = null,
            G = !1,
            n = 0,
            r = 0,
            p = !1,
            H = q++,
            ma = !1,
            D,
            Y,
            ja,
            ea,
            P,
            S,
            U,
            ba = b.isFlipY,
            ka =
              b.G && b.isMipmap && 'undefined' !== typeof za && !za.cc()
                ? !0
                : !1,
            la,
            Z = -1,
            qa = !1;
          'undefined' !== typeof b.width &&
            b.width &&
            ((n = b.width),
            (r = 'undefined' !== typeof b.height && b.height ? b.height : n));
          var J = {
            get: function() {
              return N;
            },
            w: function() {
              return n;
            },
            L: function() {
              return r;
            },
            Cd: function() {
              return b.url;
            },
            Gd: function() {
              return b.isFloat;
            },
            Id: function() {
              return b.G;
            },
            Jd: function() {
              return b.isLinear;
            },
            Oa: function() {
              c.generateMipmap(c.TEXTURE_2D);
            },
            cb: function(b, d) {
              ka ? (b || (b = J.mb()), J.Da(d), a(la[b]), (h[d] = -1)) : J.b(d);
            },
            mb: function() {
              -1 === Z && (Z = Math.log(n) / Math.log(2));
              return Z;
            },
            kb: function(b) {
              if (ka) {
                b || (b = J.mb());
                l.set('s11');
                J.Da(0);
                var d,
                  e = n,
                  f = r;
                for (d = 1; d <= b; ++d)
                  (e /= 2),
                    (f /= 2),
                    l.P('u7', 0.25 / e, 0.25 / f),
                    c.viewport(0, 0, e, f),
                    a(la[d - 1]),
                    c.framebufferTexture2D(
                      w.aa(),
                      c.COLOR_ATTACHMENT0,
                      c.TEXTURE_2D,
                      la[d],
                      0
                    ),
                    M.g(!1, 1 === d);
                h[0] = -1;
              } else J.Oa();
            },
            Da: function(a) {
              a !== k && (c.activeTexture(m[a]), (k = a));
            },
            b: function(b) {
              if (!p) return !1;
              J.Da(b);
              if (h[b] === H) return !1;
              a(N);
              h[b] = H;
              return !0;
            },
            bb: function(b) {
              c.activeTexture(m[b]);
              k = b;
              a(N);
              h[b] = H;
            },
            j: function() {
              c.framebufferTexture2D(
                w.aa(),
                c.COLOR_ATTACHMENT0,
                c.TEXTURE_2D,
                N,
                0
              );
            },
            A: function() {
              c.viewport(0, 0, n, r);
              c.framebufferTexture2D(
                w.aa(),
                c.COLOR_ATTACHMENT0,
                c.TEXTURE_2D,
                N,
                0
              );
            },
            Zd: function() {
              c.framebufferTexture2D(
                w.aa(),
                c.COLOR_ATTACHMENT0,
                c.TEXTURE_2D,
                null,
                0
              );
            },
            resize: function(a, b) {
              n = a;
              r = b;
              f();
            },
            clone: function(a) {
              a = Q.a({
                width: n,
                height: r,
                G: b.G,
                isFloat: b.isFloat,
                isLinear: b.isLinear,
                U: b.U,
                isFlipY: a ? !ba : ba,
                isPot: b.isPot,
              });
              ya.set('s0');
              w.S();
              a.j();
              c.viewport(0, 0, n, r);
              J.b(0);
              M.g(!0, !0);
              return a;
            },
            Tc: function() {
              c.viewport(0, 0, n, r);
            },
            remove: function() {
              c.deleteTexture(N);
              J = null;
            },
            refresh: function() {
              J.bb(0);
              ba && c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, !0);
              L
                ? c.texImage2D(c.TEXTURE_2D, 0, P, S, c.UNSIGNED_BYTE, b.D)
                : c.texImage2D(c.TEXTURE_2D, 0, P, n, r, 0, S, U, G);
              ba && c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, !1);
            },
            fb: function() {
              var a = n * r * 4;
              Y = [
                new Uint8Array(a),
                new Uint8Array(a),
                new Uint8Array(a),
                new Uint8Array(a),
              ];
              D = [
                new Float32Array(Y[0].buffer),
                new Float32Array(Y[1].buffer),
                new Float32Array(Y[2].buffer),
                new Float32Array(Y[3].buffer),
              ];
              ja = new Uint8Array(4 * a);
              ea = new Float32Array(ja.buffer);
              ma = !0;
            },
            Gb: function() {
              ma || J.fb();
              c.readPixels(0, 0, n, 4 * r, c.RGBA, c.UNSIGNED_BYTE, ja);
              var a,
                b = n * r,
                d = 2 * b,
                e = 3 * b;
              for (a = 0; a < b; ++a)
                (D[0][a] = ea[a]),
                  (D[1][a] = ea[a + b]),
                  (D[2][a] = ea[a + d]),
                  (D[3][a] = ea[a + e]);
              return D;
            },
            gb: function() {
              w.I();
              l.set('s12');
              J.b(0);
              c.viewport(0, 0, n, 4 * r);
              for (var a = 0; 4 > a; ++a)
                c.viewport(0, r * a, n, r), l.Jb('u8', aa[a]), M.g(!1, 0 === a);
            },
            $d: function(b) {
              var d = U === x[0] && !g();
              a(N);
              ba && c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, ba);
              d
                ? (ca ||
                    ((B = document.createElement('canvas')),
                    (B.width = n),
                    (B.height = r),
                    (X = B.getContext('2d')),
                    (W = X.createImageData(n, r)),
                    (ca = !0)),
                  W.data.set(b),
                  X.putImageData(W, 0, 0),
                  c.texImage2D(c.TEXTURE_2D, 0, P, S, U, B))
                : c.texImage2D(c.TEXTURE_2D, 0, P, n, r, 0, S, U, b);
              h[k] = H;
              ba && c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, !1);
            },
            ae: function(b, d) {
              a(N);
              c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, d);
              c.texImage2D(c.TEXTURE_2D, 0, P, S, U, b);
              h[k] = H;
              d && c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL, !1);
            },
            Od: function(a, d) {
              var e = n * r,
                f = 4 * e;
              a = b.G ? (a ? 'RGBE' : 'JSON') : 'RGBA';
              d && (a = d);
              d = z.o() && !1;
              switch (a) {
                case 'RGBE':
                  var O = 's39';
                  break;
                case 'JSON':
                  O = d ? 's0' : 's12';
                  break;
                case 'RGBA':
                case 'RGBAARRAY':
                  O = 's6';
              }
              ma ||
                ('RGBA' === a || 'RGBE' === a || 'RGBAARRAY' === a
                  ? ((Y = new Uint8Array(f)), (ma = !0))
                  : 'JSON' !== a || d || J.fb());
              w.I();
              l.set(O);
              J.b(0);
              if ('RGBA' === a || 'RGBE' === a || 'RGBAARRAY' === a) {
                c.viewport(0, 0, n, r);
                M.g(!0, !0);
                c.readPixels(0, 0, n, r, c.RGBA, c.UNSIGNED_BYTE, Y);
                if ('RGBAARRAY' === a) return { data: Y };
                C ||
                  ((F = document.createElement('canvas')),
                  (K = F.getContext('2d')),
                  (C = !0));
                F.width = n;
                F.height = r;
                E = K.createImageData(n, r);
                E.data.set(Y);
                K.putImageData(E, 0, 0);
                var g = F.toDataURL('image/png');
              } else if ('JSON' === a)
                if (d)
                  (g = new Float32Array(e)),
                    c.viewport(0, 0, n, r),
                    M.g(!0, !0),
                    c.readPixels(0, 0, n, r, c.RGBA, c.FLOAT, g);
                else {
                  for (g = 0; 4 > g; ++g)
                    c.viewport(0, r * g, n, r), l.Jb('u8', aa[g]), M.g(!g, !g);
                  J.Gb();
                  g = Array(e);
                  for (O = 0; O < e; ++O)
                    (g[4 * O] = D[0][O]),
                      (g[4 * O + 1] = D[1][O]),
                      (g[4 * O + 2] = D[2][O]),
                      (g[4 * O + 3] = D[3][O]);
                }
              return {
                format: a,
                data: g,
                width: n,
                height: r,
                isMirrorY: b.U,
                isFlipY: 'RGBA' === a ? b.isFlipY : !b.isFlipY,
              };
            },
          };
          b.isMipmap && !ka && p && !qa && (J.Oa(), (qa = !0));
          if (b.url)
            a(N),
              c.texImage2D(
                c.TEXTURE_2D,
                0,
                c.RGBA,
                1,
                1,
                0,
                c.RGBA,
                c.UNSIGNED_BYTE,
                null
              ),
              (v = new Image()),
              (v.kd = 'Anonymous'),
              (v.crossOrigin = 'Anonymous'),
              (v.src = b.url),
              (v.onload = function() {
                n = v.width;
                r = v.height;
                f();
              });
          else if (b.D) {
            var oa = function() {
              n = void 0 !== b.D.videoWidth ? b.D.videoWidth : b.D.width;
              r = void 0 !== b.D.videoHeight ? b.D.videoHeight : b.D.height;
              n ? f() : setTimeout(oa, 1);
            };
            oa();
          } else
            b.array
              ? (b.G && !b.isFloat
                  ? b.array instanceof Uint16Array
                    ? ((G = b.array), f())
                    : e()
                    ? ((G = d(b.array)), f())
                    : (f(), Q.pc(J, b.array, ba))
                  : ((G = b.isFloat
                      ? b.array instanceof Float32Array
                        ? b.array
                        : new Float32Array(b.array)
                      : b.array instanceof Uint8Array
                      ? b.array
                      : new Uint8Array(b.array)),
                    f()),
                b.isKeepArray ||
                  (G && G !== b.array && (G = null), delete b.array))
              : f();
          J.uc = J.w;
          R && p && (R(J), (R = !1));
          return J;
        },
        I: function(b) {
          b !== k && (c.activeTexture(m[b]), (k = b));
          h[b] = -1;
          a(null);
        },
        ed: function(a) {
          t.random.b(a);
        },
        reset: function() {
          for (var a = 0; a < m.length; ++a) h[a] = -1;
          k = -1;
        },
        Nd: function() {
          k = -1;
        },
        Xd: function() {
          for (var a = 0; a < m.length; ++a) Q.I(a);
        },
        qc: function() {
          t && (t.random.remove(), t.Lb.remove());
        },
        Yd: function(a, b) {
          if ('RGBA' === a.format || 'RGBE' === a.format) {
            var d = new Image();
            d.src = a.data;
            d.onload = function() {
              Q.a({
                U: a.isMirrorY,
                isFlipY: a.isFlipY,
                isFloat: !1,
                D: d,
                Ga: function(d) {
                  if ('RGBA' === a.format) b(d);
                  else {
                    var e = a.width,
                      f = a.height,
                      g = Q.a({
                        U: a.isMirrorY,
                        isFloat: !0,
                        width: e,
                        height: f,
                        isFlipY: a.isFlipY,
                      });
                    w.S();
                    c.viewport(0, 0, e, f);
                    l.set('s40');
                    g.j();
                    d.b(0);
                    M.g(!0, !0);
                    Q.I(0);
                    b(g);
                    c.flush();
                    setTimeout(d.remove, 50);
                  }
                },
              });
            };
          } else
            'JSON' === a.format
              ? b(
                  Q.a({
                    isFloat: !0,
                    isFlipY: a.isFlipY,
                    width: a.width,
                    height: a.height,
                    array: new Float32Array(a.data),
                  })
                )
              : b(!1);
        },
      };
    return Q;
  })(),
  Ea = {
    a: function(a) {
      var b = [V.a(a), V.a(a)],
        d = [b[1], b[0]],
        e = d,
        g = {
          Qc: function(a) {
            e[1].j();
            e[0].b(a);
            g.Kb();
          },
          Rd: function(a) {
            e[1].A();
            e[0].b(a);
            g.Kb();
          },
          Kb: function() {
            e = e === b ? d : b;
          },
          refresh: function() {
            e[0].refresh();
            e[1].refresh();
          },
          b: function(a) {
            e[0].b(a);
          },
        };
      return g;
    },
  },
  z = (function() {
    function a() {
      b = 'undefined' === typeof Ba ? JEContext : Ba;
      d = !0;
    }
    var b,
      d = !1,
      e = !1,
      g = !1,
      f = !1,
      k = !1,
      m = !1,
      q = !1,
      h = !1,
      t = !1,
      x = !1,
      u = !1,
      A = !0,
      B = !0,
      C = !0,
      F,
      K = 'undefined' === typeof window ? {} : window,
      E = {
        l: function() {
          if (d) return !0;
          a();
          E.ib();
          E.Na();
          E.kc();
          E.lc();
          w.l();
          V.l();
          if (!E.gc()) return !1;
          M.l();
          V.xc();
          return !0;
        },
        w: function() {
          d || a();
          return b.w();
        },
        L: function() {
          d || a();
          return b.L();
        },
        o: function() {
          d || a();
          return b.o();
        },
        kc: function() {
          u = (x =
            c.getExtension('EXT_color_buffer_float') ||
            c.getExtension('WEBGL_color_buffer_float') ||
            c.getExtension('OES_color_buffer_float'))
            ? !0
            : !1;
          K.GL_EXT_COLORBUFFERFLOAT = x;
        },
        lc: function() {
          c.getExtension('EXT_color_buffer_half_float') ||
            c.getExtension('WEBGL_color_buffer_half_float') ||
            c.getExtension('OES_color_buffer_half_float');
        },
        ib: function() {
          if (!e) {
            this.o() ||
              ((g =
                c.getExtension('OES_texture_float') ||
                c.getExtension('MOZ_OES_texture_float') ||
                c.getExtension('WEBKIT_OES_texture_float')),
              (k = (K.GL_EXT_FLOAT = g) ? !0 : !1));
            if (k || this.o())
              (f =
                c.getExtension('OES_texture_float_linear') ||
                c.getExtension('MOZ_OES_texture_float_linear') ||
                c.getExtension('WEBKIT_OES_texture_float_linear')),
                (K.GL_EXT_FLOATLINEAR = f);
            e = !0;
          }
        },
        Na: function() {
          if (!t) {
            if (!this.o()) {
              if (
                (m =
                  c.getExtension('OES_texture_half_float') ||
                  c.getExtension('MOZ_OES_texture_half_float') ||
                  c.getExtension('WEBKIT_OES_texture_half_float'))
              )
                (F = m.HALF_FLOAT_OES), (q = !0);
              K.GL_EXT_HALFFLOAT = m;
            }
            if (q || this.o())
              (h =
                c.getExtension('OES_texture_half_float_linear') ||
                c.getExtension('MOZ_OES_texture_half_float_linear') ||
                c.getExtension('WEBKIT_OES_texture_half_float_linear')),
                (K.GL_EXT_HALFFLOATLINEAR = h);
            t = !0;
          }
        },
        va: function() {
          if (E.o()) return c.HALF_FLOAT;
          E.Na();
          return q ? F : c.FLOAT;
        },
        eb: function() {
          return A;
        },
        bc: function() {
          return B;
        },
        fd: function() {
          return C;
        },
        ac: function() {
          return u;
        },
        ic: function() {
          B = A = !0;
          var a = c.createFramebuffer();
          c.bindFramebuffer(c.FRAMEBUFFER, a);
          var b = c.createTexture();
          c.bindTexture(c.TEXTURE_2D, b);
          c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MAG_FILTER, c.NEAREST);
          c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MIN_FILTER, c.NEAREST);
          c.texImage2D(
            c.TEXTURE_2D,
            0,
            E.o() && c.RGBA32F ? c.RGBA32F : c.RGBA,
            1,
            1,
            0,
            c.RGBA,
            c.FLOAT,
            null
          );
          c.framebufferTexture2D(
            w.aa(),
            c.COLOR_ATTACHMENT0,
            c.TEXTURE_2D,
            b,
            0
          );
          var d = c.checkFramebufferStatus(w.Pa());
          d !== c.FRAMEBUFFER_COMPLETE && (A = !1);
          c.texImage2D(
            c.TEXTURE_2D,
            0,
            E.o() && c.RGBA16F ? c.RGBA16F : c.RGBA,
            1,
            1,
            0,
            c.RGBA,
            E.va(),
            null
          );
          c.framebufferTexture2D(
            w.aa(),
            c.COLOR_ATTACHMENT0,
            c.TEXTURE_2D,
            b,
            0
          );
          d = c.checkFramebufferStatus(w.Pa());
          d !== c.FRAMEBUFFER_COMPLETE && (B = !1);
          c.bindTexture(c.TEXTURE_2D, null);
          c.bindFramebuffer(c.FRAMEBUFFER, null);
          c.deleteTexture(b);
          c.deleteFramebuffer(a);
        },
        hc: function() {
          var a = w.a({ width: 1 });
          a.Hb();
          var b = V.a({ width: 1, isFloat: !0, ma: 3 });
          a.j();
          b.j();
          c.flush();
          c.checkFramebufferStatus(w.Pa()) !== c.FRAMEBUFFER_COMPLETE
            ? (V.Nc(), (C = !1))
            : (C = !0);
          a.remove();
          b.remove();
        },
        gc: function() {
          E.ic();
          if (!A && !B) return !1;
          E.hc();
          return !0;
        },
      };
    return E;
  })(),
  za = (function() {
    var a = !1,
      b = [0.8, 1, 0.8, 1],
      d = 0,
      e,
      g = new Uint8Array(4),
      f = b.concat(b, b, b),
      k = !0,
      m = {
        l: function() {
          function b(a, b, d, e) {
            c.texParameteri(
              c.TEXTURE_2D,
              c.TEXTURE_MIN_FILTER,
              e ? c.NEAREST_MIPMAP_NEAREST : c.LINEAR
            );
            try {
              var f = c.getError();
              f !== c.NO_ERROR &&
                console.log('GLERR in test_mipmapping() :', f);
              c.texImage2D(c.TEXTURE_2D, 0, a, 2, 2, 0, c.RGBA, b, d);
              f = c.getError();
              if (f !== c.NO_ERROR) return !1;
            } catch (aa) {
              return !1;
            }
            e && c.generateMipmap(c.TEXTURE_2D);
            M.ga_();
            M.g(!1, !0);
            c.readPixels(0, 0, 1, 1, c.RGBA, c.UNSIGNED_BYTE, g);
            f = c.getError();
            f === c.INVALID_OPERATION &&
              'undefined' !== typeof c.PIXEL_PACK_BUFFER &&
              (c.bindBuffer(c.PIXEL_PACK_BUFFER, null),
              c.readPixels(0, 0, 1, 1, c.RGBA, c.UNSIGNED_BYTE, g),
              (f = c.getError()));
            return f !== c.NO_ERROR ? !1 : 0 !== g[0];
          }
          function h(a) {
            return z.eb() && b(x, c.FLOAT, new Float32Array(f), a)
              ? ((d = 3), !0)
              : !1;
          }
          function m(a) {
            return z.bc()
              ? b(u, z.va(), new Uint16Array(f), a) ||
                b(u, c.FLOAT, new Float32Array(f), a)
                ? ((d = 2), !0)
                : !1
              : !1;
          }
          z.ib();
          z.Na();
          var x = c.RGBA,
            u = c.RGBA;
          if (Ba.o()) {
            var A = c.RGBA32F;
            A && (x = A);
            (A = c.RGBA16F) && (u = A);
          }
          M.l();
          w.reset();
          w.I();
          c.viewport(0, 0, 1, 1);
          l.set('s0');
          a = !0;
          e = c.createTexture();
          c.activeTexture(c.TEXTURE0);
          c.bindTexture(c.TEXTURE_2D, e);
          c.texParameteri(c.TEXTURE_2D, c.TEXTURE_WRAP_S, c.REPEAT);
          c.texParameteri(c.TEXTURE_2D, c.TEXTURE_WRAP_T, c.REPEAT);
          c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MAG_FILTER, c.NEAREST);
          if (m(!0) || h(!0)) return !0;
          k = !1;
          if (m(!1) || h(!1)) return !0;
          if (Ba.o()) {
            u = x = c.RGBA;
            if (m(!0) || h(!0)) return !0;
            k = !1;
            if (m(!1) || h(!1)) return !0;
          }
          return !1;
        },
        cc: function() {
          return k;
        },
        xd: function() {
          return d;
        },
        Hd: function() {
          a || m.l();
          return 3 === d;
        },
        Ac: function() {
          a || m.l();
          return 2 === d;
        },
      };
    return m;
  })(),
  Fa = {
    a: function(a) {
      var b = V.a(a.alpha),
        d = V.a(a.beta);
      return {
        jc: function() {
          b.b(1);
          d.b(2);
        },
      };
    },
  },
  Ia = {
    a: function(a) {
      var b = a.Vc;
      b.index = a.index;
      b.W = a.W;
      b.parent = a.parent;
      switch (b.type) {
        case 'input':
          a = Ga.a(b);
          break;
        default:
          a = Ha.a(b);
      }
      return a;
    },
  },
  Ga = {
    a: function(a) {
      'undefined' === typeof a.sift && (a.sift = !1);
      'undefined' === typeof a.DWT && (a.DWT = !1);
      'undefined' === typeof a.blur && (a.blur = !1);
      'undefined' === typeof a.siftOutWidth && (a.siftOutWidth = !1);
      'undefined' === typeof a.filterBank && (a.filterBank = !1);
      'undefined' === typeof a.poolType && (a.poolType = 'max');
      'undefined' === typeof a.postpreprocessing &&
        (a.postpreprocessing = 'copy');
      'undefined' === typeof a.density && (a.density = 1);
      a.filterBank &&
        (FilterBank.Qd(a.poolType, a.postpreprocessing),
        FilterBank.Pd(a.density));
      var b = !1;
      if (a.mask) {
        b = !0;
        SETTINGS && void 0 !== SETTINGS.Xb && (a.mask = SETTINGS.Xb + a.mask);
        var d = V.a({ isFloat: !1, url: a.mask });
      }
      var e = !1,
        g = 'undefined' !== typeof a.preprocessing ? a.preprocessing : !1,
        f = !1;
      a.sift
        ? Sift.l({ wc: c, ia: !1, width: a.size, Ld: a.siftOutWidth })
        : a.DWT && DWT.l({ wc: c, ia: !1, width: a.size });
      switch (g) {
        case 'sobel':
          var k = 's30';
          f = !0;
          break;
        case 'meanNormalization':
          k = 's31';
          f = !0;
          break;
        case 'grayScale':
          k = 's29';
          f = !1;
          break;
        case 'copy':
          k = 's0';
          break;
        case 'inputLightRegulation':
          k = 's29';
          Ja.l({ width: a.size, zb: a.nBlurPass, zc: !1 });
          e = !0;
          break;
        case 'direct':
        case 'none':
          k = !1;
          break;
        default:
          k = 's3';
      }
      b && (k += 'Mask');
      if (a.blur) var m = V.a({ isFloat: !1, isPot: !1, width: a.size });
      var q = V.a({ isFloat: !1, isPot: !1, width: a.size }),
        h = {
          w: function() {
            return a.sift ? Sift.ba() : a.filterBank ? FilterBank.ba() : a.size;
          },
          ba: function() {
            return h.w();
          },
          tc: function() {
            return a.sift
              ? Sift.la()
              : a.DWT
              ? DWT.la()
              : a.filterBank
              ? FilterBank.la()
              : e
              ? Ja.la()
              : q;
          },
          F: function() {
            w.S();
            a.blur &&
              (m.A(),
              l.set('s41'),
              l.P('u7', 1 / a.size, 1 / a.size),
              M.g(!1, !0),
              m.b(0));
            k &&
              (l.set(k),
              f && l.u('u28', 1 / a.size),
              q.A(),
              b && d.b(1),
              M.g(!1, !1),
              q.b(0),
              e
                ? Ja.Aa(q)
                : a.sift
                ? (l.R(), Sift.Aa())
                : a.DWT
                ? (l.R(), DWT.Aa(4))
                : a.filterBank && (l.R(), FilterBank.Aa(q)));
          },
        };
      return h;
    },
  },
  Ha = {
    a: function(a) {
      'undefined' === typeof a.disableNormalize && (a.disableNormalize = !1);
      var b = [],
        d = [],
        e,
        g,
        f = !1,
        k,
        m = !0,
        q,
        h,
        t = a.isReorganize ? a.isReorganize : !1,
        x = a.kernelsNumber ? !0 : !1,
        u = a.dynPelu ? Fa.a(a.dynPelu) : !1,
        A = u ? !0 : !1,
        B = { isEnabled: !1 },
        C;
      if ('softmax' === a.type) {
        a.activation = 'softmax';
        a.size = Math.pow(
          2,
          Math.ceil(Math.log(Math.sqrt(a.num_classes)) / Math.log(2))
        );
        a.sparsity = 'undefined' !== typeof a.sparsity ? a.sparsity : a.W.ba();
        a.gain = 'undefined' !== typeof a.gain ? a.gain : 1;
        l.J('s20', [{ type: '1f', name: 'u10', value: a.gain }]);
        var F = V.a({ isFloat: !0, isPot: !1, width: a.size }),
          K = V.a({ isFloat: !0, isPot: !1, width: a.size, isMipmap: !0 });
        m = !1;
        var E = new Uint8Array(Math.pow(4 * a.size, 2)),
          aa;
        for (aa = 0; aa < a.size * a.size; ++aa) {
          var da = aa < a.num_classes ? 255 : 0;
          E[4 * aa] = da;
          E[4 * aa + 1] = da;
          E[4 * aa + 2] = da;
          E[4 * aa + 3] = da;
        }
        var na = V.a({ isFloat: !1, isPot: !1, width: a.size, array: E });
      } else
        a.cost
          ? ((a.sparsity =
              'undefined' !== typeof a.sparsity ? a.sparsity : a.W.ba()),
            (m = !1))
          : 'full' === a.connectivityUp && (a.sparsity = a.W.ba());
      var ja = {
          elu: 's15',
          elu01: 's16',
          relu: 's14',
          arctan: 's18',
          sigmoid: 's13',
          copy: 's0',
          softplus: 's19',
          softmax: 's20',
          dynPelu: 's17',
        }[a.activation],
        sa = a.sparsity * a.sparsity,
        W = !1,
        Q = a.size;
      if (a.maxPooling) {
        switch (a.maxPooling.size) {
          case 2:
            var L = 's32';
            break;
          case 4:
            L = 's33';
        }
        W = !0;
        Q /= a.maxPooling.size;
        var fa = V.a({ isFloat: !0, isPot: !1, width: Q });
      }
      var T = void 0 !== a.Gc && a.Gc ? !0 : !1,
        ia = null,
        ha = null,
        X = null;
      T &&
        ((ia = 's42' + a.index.toString()),
        l.pb('s42', ia, [((a.normalization.n - 1) / 2).toFixed(1)]),
        l.J(ia, [
          { type: '1i', name: 'u1', value: 0 },
          { type: '2f', name: 'u7', value: [1 / a.size, 1 / a.size] },
          { type: '1f', name: 'u6', value: a.normalization.alpha },
          { type: '1f', name: 'u9', value: a.normalization.beta },
          { type: '1f', name: 'u32', value: a.normalization.k },
        ]),
        (ha = V.a({ isFloat: !0, isPot: !0, width: a.size })),
        (X = V.a({ isFloat: !0, isPot: !0, width: a.size })));
      var ca, ta, N, R;
      m && (R = V.a({ isFloat: !0, isPot: !1, width: a.size }));
      var v = V.a(a.bias),
        G,
        n = {
          w: function() {
            return a.size;
          },
          ba: function() {
            return Q;
          },
          nb: function() {
            return a.num_classes;
          },
          Zb: function(a) {
            C.b(a);
          },
          Jc: function() {
            a.remap &&
              a.remap.isEnabled &&
              (B = {
                isEnabled: !0,
                Cc: V.a({
                  isFloat: !1,
                  isFlipY: !1,
                  array: new Uint8Array(a.remap.maskTexture.data),
                  width: a.remap.maskTexture.width,
                  isPot: !1,
                }),
                layers: a.remap.layers.map(function(b) {
                  return a.parent.sc(b);
                }),
                depth: a.remap.depth,
              });
          },
          Pc: function() {
            switch (a.connectivityUp) {
              case 'gaussian':
                G = Ka.a(a.connectivity);
                break;
              case 'direct':
                G = La.a(a.connectivity);
                break;
              case 'square':
                G = Ma.a(a.connectivity);
                break;
              case 'squareFast':
                G = Na.a(a.connectivity, a.activation);
                break;
              case 'full':
                G = Oa.a(a.connectivity);
                break;
              case 'conv':
                (h = a.kernelsNumber),
                  (G = Pa.a(a.connectivity)),
                  t &&
                    (q = V.a({
                      width: Q,
                      isFloat: !0,
                      isFlipY: !1,
                      isPot: !1,
                    }));
            }
            if (G.X) {
              var b = a.size * a.sparsity;
              ta = Math.log(b / a.size) / Math.log(2);
              ca = V.a({
                isMipmap: !0,
                isFloat: !0,
                isPot: !0,
                width: b,
                xb: ta,
              });
              N = V.a({ isFloat: !0, isPot: !0, width: a.size });
            }
          },
          F: function(b, d) {
            C = b;
            G.X
              ? (ca.A(),
                x && v.b(2),
                G.F(B),
                ca.b(0),
                ca.kb(ta),
                N.A(),
                x ? l.set('s0') : (l.set('s28'), l.u('u27', sa), v.b(1)),
                ca.cb(ta, 0),
                M.g(!1, !1),
                l.set(ja),
                T ? ha.j() : R.j(),
                N.b(0),
                A && u.jc(),
                M.g(!1, !1))
              : (R.A(), v.b(1), G.F());
            T &&
              (l.set(ia),
              X.j(),
              ha.b(0),
              M.g(!1, !1),
              l.set('s43'),
              l.u('u6', 1),
              R.j(),
              X.b(1),
              M.g(!1, !1));
            if (m)
              return (
                W
                  ? (fa.A(),
                    R.b(0),
                    l.set(L),
                    l.P('u7', 1 / a.size, 1 / a.size),
                    M.g(!1, !1),
                    (d = fa))
                  : (d = R),
                d.b(0),
                t &&
                  (q.j(),
                  l.set('s22'),
                  l.P('u14', h, Q / h),
                  M.g(!1, !1),
                  (d = q),
                  q.b(0)),
                d
              );
            if ('softmax' === a.type) {
              l.set('s20');
              R.b(0);
              F.j();
              M.g(!1, !1);
              a.disableNormalize
                ? (b = F)
                : (l.set('s2'),
                  F.b(0),
                  na.b(1),
                  K.j(),
                  M.g(!1, !1),
                  l.set('s0'),
                  g.A(),
                  K.b(0),
                  K.kb(!1),
                  M.g(!1, !1),
                  l.set('s21'),
                  e.A(),
                  K.cb(!1, 0),
                  l.u('u12', R.uc()),
                  g.b(1),
                  M.g(!1, !1),
                  (b = e));
              if (d) {
                switch (f) {
                  case 'cpuRGBAAvg':
                    break;
                  default:
                    var p = n.Fb(b);
                }
                return p;
              }
              return !1;
            }
            if (a.cost) {
              l.set('gpuRawAvg' === f ? 's8' : 's7');
              d = R;
              a.disableNormalize ||
                (l.u('u4', 1 / a.size), e.A(), R.b(0), M.g(!1, !1), (d = e));
              switch (f) {
                case 'cpuRGBA2Float':
                  d.gb();
                  p = n.Fb(d);
                  k(p);
                  break;
                case 'gpuRawAvg':
                case 'gpuRaw':
                  d.b(0), k(d);
              }
              return !1;
            }
          },
          ec: function(h) {
            h && 'undefined' !== typeof h.Eb && ((f = h.Eb), (k = h.Ic));
            R = V.a({
              isFloat: !0,
              isPot: !0,
              isMipmap: 'softmax' === a.type,
              width: a.size,
            });
            'softmax' === a.type &&
              (g = V.a({ isFloat: !0, isPot: !0, width: 1 }));
            var m = 0,
              x = 0,
              q =
                'undefined' !== typeof a.num_classes && a.num_classes
                  ? a.num_classes
                  : a.size * a.size;
            for (h = 0; h < q; ++h)
              b.push(m + (a.size - 1 - x) * a.size),
                d.push([-1, -1, -1, -1]),
                ++m,
                m === a.size && ((m = 0), ++x);
            a.disableNormalize ||
              (e = V.a({ isFloat: !0, isPot: !0, width: a.size }));
          },
          Fb: function(a) {
            a.gb();
            var e = a.Gb();
            b.forEach(function(a, b) {
              d[b][0] = e[0][a];
              d[b][1] = e[1][a];
              d[b][2] = e[2][a];
              d[b][3] = e[3][a];
            });
            return d;
          },
        };
      a.W && n.Pc(a.W);
      return n;
    },
  };
function Qa() {
  var a = { Ed: !1 },
    b,
    d,
    e;
  a || (a = {});
  this.sc = function(a) {
    return b[a];
  };
  this.Mc = function(a) {
    var f = !1;
    b = a.map(function(a, b) {
      return (f = a = Ia.a({ index: b, parent: this, Vc: a, W: f }));
    });
    d = b[0];
    e = b[b.length - 1];
    b.forEach(function(a, b) {
      0 !== b && a.Jc();
    });
  };
  this.F = function(a, d) {
    var e = d;
    b.forEach(function(b) {
      e = b.F(e, a);
    });
    return e;
  };
  this.lb = function() {
    return d.w();
  };
  this.la = function() {
    return e.tc();
  };
  this.Oc = function(a) {
    e.ec(a);
  };
  this.nb = function() {
    return e.nb();
  };
}
var La = {
    a: function(a) {
      var b = V.a(a.weights);
      delete a.weights.data;
      return {
        X: !0,
        ka: function() {
          return 1;
        },
        vc: function() {
          return b;
        },
        F: function() {
          l.set('s27');
          b.b(1);
          M.g(!1, !1);
        },
      };
    },
  },
  Oa = {
    a: function(a) {
      var b = a.fromLayerSize,
        d = V.a(a.weights);
      return {
        X: !0,
        ka: function() {
          return b;
        },
        F: function(b) {
          if (b.isEnabled) {
            l.set('s25');
            b.Cc.b(3);
            var e,
              f = Math.min(b.layers.length, b.depth);
            for (e = 0; e < f; ++e) b.layers[e].Zb(4 + e);
          } else l.set('s24');
          l.u('u18', a.toLayerSize);
          d.b(1);
          M.g(!1, !1);
        },
      };
    },
  },
  Ka = {
    a: function(a) {
      var b = a.toSparsity * a.toLayerSize,
        d = b / a.fromLayerSize,
        e = V.a(a.weights);
      V.a({
        width: b,
        isFloat: !0,
        array: new Float32Array(a.fromBindings),
        isPot: !0,
      });
      var g = V.a({
        width: b,
        isFloat: !0,
        array: new Float32Array(a.toBindings),
        isPot: !0,
      });
      return {
        X: !0,
        ka: function() {
          return d;
        },
        F: function() {
          l.set('s23');
          e.b(1);
          g.b(2);
          M.g(!1, !0);
        },
      };
    },
  },
  Ma = {
    a: function(a) {
      var b = a.fromLayerSize,
        d = a.toLayerSize,
        e = a.toSparsity,
        g = e * d,
        f = g / b,
        k = b / d,
        m,
        q,
        h,
        t,
        x = 0,
        u = 0,
        A = 0,
        B = Array(e * d * e * d * 4),
        C = Array(e * d * e * d * 4),
        F = Array(b * b);
      for (m = 0; m < F.length; ++m) F[m] = 0;
      var K = Math.floor(e / 2),
        E = 0.5 / d,
        aa = 0.5 / b,
        da = 0.5 / g;
      for (m = 0; m < d; ++m)
        for (q = 0; q < d; ++q) {
          var na = Math.round(m * k);
          var ja = Math.round(q * k);
          var sa = m / d;
          var W = q / d;
          sa += E;
          W += E;
          for (h = 0; h < e; ++h)
            for (t = 0; t < e; ++t) {
              var Q = x / g;
              var L = u / g;
              var fa = na + h - K;
              var T = ja + t - K;
              0 > fa && (fa += b);
              0 > T && (T += b);
              fa >= b && (fa -= b);
              T >= b && (T -= b);
              var ia = fa / b;
              var ha = T / b;
              L = 1 - L - 1 / g;
              ia += aa;
              ha += aa;
              Q += da;
              L += da;
              var X = m * e + h,
                ca = q * e + t;
              ca = d * e - ca - 1;
              X = ca * d * e + X;
              B[4 * X] = Q;
              B[4 * X + 1] = L;
              B[4 * X + 2] = ia;
              B[4 * X + 3] = ha;
              ia = F[T * b + fa]++;
              ha = ia % f;
              fa = fa * f + ha;
              T = T * f + (ia - ha) / f;
              T = b * f - 1 - T;
              T = T * b * f + fa;
              C[4 * T] = Q;
              C[4 * T + 1] = L;
              C[4 * T + 2] = sa;
              C[4 * T + 3] = W;
              ++x >= g && ((x = 0), ++u);
              ++A;
            }
        }
      var ta = V.a(a.weights);
      V.a({ width: g, isFloat: !0, array: new Float32Array(C), isPot: !0 });
      C = null;
      var N = V.a({
        width: g,
        isFloat: !0,
        array: new Float32Array(B),
        isPot: !0,
      });
      B = null;
      return {
        X: !0,
        ka: function() {
          return f;
        },
        F: function() {
          l.set('s23');
          ta.b(1);
          N.b(2);
          M.g(!1, !1);
        },
      };
    },
  },
  Pa = {
    a: function(a) {
      var b = a.kernelsNumber,
        d = a.toSparsity,
        e = (d * a.toLayerSize) / a.fromLayerSize,
        g = V.a(a.weights);
      return {
        X: !0,
        ka: function() {
          return e;
        },
        Ad: function() {
          return d;
        },
        vc: function() {
          return g;
        },
        F: function() {
          l.set('s26');
          l.u('u24', b);
          l.u('u25', d);
          l.u('u18', a.toLayerSize);
          l.u('u26', a.fromLayerSize);
          g.b(1);
          M.g(!1, !1);
        },
      };
    },
  },
  Na = {
    a: function(a, b) {
      var d = a.fromLayerSize,
        e = a.toLayerSize,
        g = a.toSparsity,
        f = a.stride ? a.stride : 1,
        k = (g * e) / d,
        m = e < d,
        q = d / e,
        h = V.a(a.weights),
        t =
          's44' +
          [d.toString(), e.toString(), g.toString(), f.toString(), b].join('_');
      l.mc(t) ||
        ((a = va(b)),
        (e = [
          { type: '1f', name: 'u18', value: e },
          { type: '1f', name: 'u31', value: f },
        ]),
        m && e.push({ type: '1f', name: 'u26', value: d }),
        (d = [(m ? k : g).toFixed(1), a]),
        m && d.push(q.toFixed(1)),
        l.pb(m ? 's38' : 's37', t, d),
        l.J(
          t,
          e.concat([
            { type: '1i', name: 'u16', value: 0 },
            { type: '1i', name: 'u23', value: 1 },
            { type: '1i', name: 'u15', value: 3 },
          ])
        ));
      return {
        X: !1,
        ka: function() {
          return k;
        },
        F: function() {
          l.set(t);
          h.b(3);
          M.g(!1, !1);
        },
      };
    },
  },
  Ja = (function() {
    var a, b, d, e, g, f, k, m, q;
    return {
      l: function(h) {
        a = h.zb ? h.zb : 3;
        b = h.width ? h.width : 64;
        e = h.zc ? !0 : !1;
        h = { isFloat: !1, width: b, isPot: !1, isFlipY: !1 };
        g = V.a(h);
        f = V.a(h);
        k = V.a(h);
        m = V.a(h);
        q = V.a({ isFloat: !0, width: b, isPot: !1, isFlipY: !1 });
        d = 1 / b;
      },
      Aa: function(b) {
        l.set('s35');
        for (var h = 0; h < a; ++h)
          g.j(),
            l.P('u7', d, 0),
            M.g(e, !1),
            f.j(),
            g.b(0),
            l.P('u7', 0, d),
            M.g(e, !1),
            f.b(0);
        l.set('s34');
        m.j();
        b.b(0);
        M.g(e);
        l.set('s35');
        for (h = 0; h < a; ++h)
          k.j(),
            m.b(0),
            l.P('u7', d, 0),
            M.g(e, !1),
            m.j(),
            k.b(0),
            l.P('u7', 0, d),
            M.g(e, !1);
        l.set('s36');
        q.j();
        b.b(0);
        f.b(1);
        m.b(2);
        M.g(e, !1);
        q.b(0);
      },
      la: function() {
        return q;
      },
    };
  })();
function Ra(a, b) {
  a[b] = !0;
  a.setAttribute(b, 'true');
}
function Sa() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}
function Ta() {
  var a = navigator.userAgent.toLowerCase();
  return -1 !== a.indexOf('safari') && -1 === a.indexOf('chrome') ? !0 : !1;
}
function Ua() {
  return navigator.mediaDevices && navigator.mediaDevices.getUserMedia
    ? !0
    : !1;
}
function Va(a) {
  if (!a) return a;
  var b = !1;
  if (a.video) {
    var d = function(a) {
      var b = {};
      'undefined' !== typeof a.min && (b.min = a.min);
      'undefined' !== typeof a.max && (b.max = a.max);
      'undefined' !== typeof a.ideal && (b.ideal = a.ideal);
      return b;
    };
    b = {};
    'undefined' !== typeof a.video.width && (b.width = d(a.video.width));
    'undefined' !== typeof a.video.height && (b.height = d(a.video.height));
    'undefined' !== typeof a.video.facingMode &&
      (b.facingMode = a.video.facingMode);
  }
  b = { audio: a.audio, video: b };
  'undefined' !== typeof a.deviceId && (b.deviceId = a.deviceId);
  return b;
}
function Wa(a) {
  var b = a.video.width;
  a.video.width = a.video.height;
  a.video.height = b;
  return a;
}
function Xa(a) {
  function b(a) {
    return [
      480,
      576,
      640,
      648,
      720,
      768,
      800,
      960,
      1080,
      1152,
      1280,
      1366,
      1920,
    ].sort(function(b, d) {
      return Math.abs(b - a) - Math.abs(d - a);
    });
  }
  function d(b) {
    e.push(b(Va(a)));
  }
  var e = [];
  if (!a || !a.video) return e;
  if (a.video.width && a.video.height) {
    if (a.video.width.ideal && a.video.height.ideal)
      for (
        var g = b(a.video.width.ideal).slice(0, 3),
          f = b(a.video.height.ideal).slice(0, 3),
          k = 0,
          m;
        k < g.length;
        ++k
      ) {
        m = g[k];
        for (var q = 0, h; q < f.length; ++q)
          if (
            ((h = f[q]),
            m !== a.video.width.ideal || h !== a.video.height.ideal)
          ) {
            var t = Math.max(m, h) / Math.min(m, h);
            t < 4 / 3 - 0.1 ||
              t > 16 / 9 + 0.1 ||
              d(function(a) {
                a.video.width.ideal = m;
                a.video.height.ideal = h;
                return a;
              });
          }
      }
    d(function(a) {
      return Wa(a);
    });
  }
  a.video.width &&
    a.video.height &&
    (a.video.width.ideal &&
      a.video.height.ideal &&
      d(function(a) {
        delete a.video.width.ideal;
        delete a.video.height.ideal;
        return a;
      }),
    d(function(a) {
      delete a.video.width;
      delete a.video.height;
      return a;
    }));
  a.video.facingMode &&
    (d(function(a) {
      delete a.video.facingMode;
      return a;
    }),
    a.video.width &&
      a.video.height &&
      d(function(a) {
        Wa(a);
        delete a.video.facingMode;
        return a;
      }));
  e.push({ audio: a.audio, video: !0 });
  return e;
}
function Ya(a) {
  try {
    var b = window.matchMedia('(orientation: portrait)').matches ? !0 : !1;
  } catch (e) {
    b = window.innerHeight > window.innerWidth;
  }
  if (b && a && a.video) {
    b = a.video.width;
    var d = a.video.height;
    b &&
      d &&
      b.ideal &&
      d.ideal &&
      b.ideal > d.ideal &&
      ((a.video.height = b), (a.video.width = d));
  }
}
function Za(a) {
  a.volume = 0;
  Ra(a, 'muted');
  if (Ta()) {
    if (1 === a.volume) {
      var b = function() {
        a.volume = 0;
        window.removeEventListener('mousemove', b, !1);
        window.removeEventListener('touchstart', b, !1);
      };
      window.addEventListener('mousemove', b, !1);
      window.addEventListener('touchstart', b, !1);
    }
    setTimeout(function() {
      a.volume = 0;
      Ra(a, 'muted');
    }, 5);
  }
}
function $a(a, b, d, e) {
  function g(a) {
    f || ((f = !0), d(a));
  }
  var f = !1;
  navigator.mediaDevices
    .getUserMedia(e)
    .then(function(d) {
      function e() {
        setTimeout(function() {
          if (a.currentTime) {
            var e = a.videoWidth,
              h = a.videoHeight;
            if (0 === e || 0 === h) g('VIDEO_NULLSIZE');
            else {
              e && (a.style.width = e.toString() + 'px');
              h && (a.style.height = h.toString() + 'px');
              e = { dc: null, Uc: null, Dc: null };
              try {
                var k = d.getVideoTracks()[0];
                k &&
                  ((e.Dc = k),
                  (e.dc = k.getCapabilities()),
                  (e.Uc = k.getSettings()));
              } catch (x) {}
              Ta() || Sa()
                ? a.parentNode && null !== a.parentNode
                  ? (f || b(a, d, e),
                    setTimeout(function() {
                      a.play();
                    }, 100))
                  : (document.body.appendChild(a),
                    Za(a),
                    f || b(a, d, e),
                    setTimeout(function() {
                      a.style.transform = 'scale(0.0001,0.0001)';
                      a.style.position = 'fixed';
                      a.style.bottom = '0px';
                      a.style.right = '0px';
                      Za(a);
                      setTimeout(function() {
                        a.play();
                      }, 100);
                    }, 80))
                : f || b(a, d, e);
            }
          } else g('VIDEO_NOTSTARTED');
        }, 700);
      }
      'undefined' !== typeof a.srcObject
        ? (a.srcObject = d)
        : ((a.src = window.URL.createObjectURL(d)), (a.videoStream = d));
      Za(a);
      a.addEventListener(
        'loadeddata',
        function() {
          var b = a.play();
          Za(a);
          'undefined' === typeof b
            ? e()
            : b
                .then(function() {
                  e();
                })
                .catch(function() {
                  g('VIDEO_PLAYPROMISEREJECTED');
                });
        },
        !1
      );
    })
    .catch(function(a) {
      g(a);
    });
}
function ab(a, b, d) {
  var e = Ua() ? document.createElement('video') : !1;
  e
    ? Ua()
      ? (d &&
          d.video &&
          (Sa() && Ya(d),
          d.video.width &&
            d.video.width.ideal &&
            (e.style.width = d.video.width.ideal + 'px'),
          d.video.height &&
            d.video.height.ideal &&
            (e.style.height = d.video.height.ideal + 'px')),
        Ra(e, 'autoplay'),
        Ra(e, 'playsinline'),
        d && d.audio ? (e.volume = 0) : Ra(e, 'muted'),
        $a(
          e,
          a,
          function() {
            function g(d) {
              if (0 === d.length) b('INVALID_FALLBACKCONSTRAINS');
              else {
                var f = d.shift();
                $a(
                  e,
                  a,
                  function() {
                    g(d);
                  },
                  f
                );
              }
            }
            var f = Xa(d);
            g(f);
          },
          d
        ))
      : b && b('MEDIASTREAMAPI_NOTFOUND')
    : b && b('VIDEO_NOTPROVIDED');
}
function bb(a) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices)
    return a(!1, 'NOTSUPPORTED'), !1;
  navigator.mediaDevices
    .enumerateDevices()
    .then(function(b) {
      (b = b.filter(function(a) {
        return (
          a.kind &&
          -1 !== a.kind.toLowerCase().indexOf('video') &&
          a.label &&
          a.deviceId
        );
      })) &&
      b.length &&
      0 < b.length
        ? a(b, !1)
        : a(!1, 'NODEVICESFOUND');
    })
    .catch(function() {
      a(!1, 'PROMISEREJECTED');
    });
}
window.JEEFACEFILTERAPI = (function() {
  var a, b, d, e, g, f, k, m, q, h, t, x, u, A;
  function B(a) {
    if (r !== n.pause) {
      var b = r === n.play ? H.Ea : v.Wb;
      qa = setTimeout(E.bind(null, a), b);
    }
  }
  function C() {
    if (-1 !== [n.play, n.V].indexOf(r)) return !1;
    r = n.play;
    I.timestamp = Date.now();
    J && window.cancelAnimationFrame(J);
    E(0);
  }
  function F(a, b, d, e, f) {
    a = 4 * (3 * b + a) + d;
    return e + (ka[a] / 255 + ka[a + 12] / 65025) * (f - e);
  }
  function K() {
    w.S();
    M.reset();
    V.reset();
    l.R();
    l.hb();
    c.disable(c.DEPTH_TEST);
    c.disable(c.BLEND);
    M.ga_();
    l.oa();
  }
  function E() {
    if (r !== n.pause) {
      l.hb();
      M.reset();
      M.ga_();
      c.disable(c.DEPTH_TEST);
      w.S();
      l.oa();
      if (!p.Sa) {
        var a = p.element.currentTime - p.za;
        0 > a && (p.za = p.element.currentTime);
        1e3 * a < v.ad ||
          (p.pa.refresh(),
          (p.za += a),
          l.set('s47'),
          p.qa.A(),
          p.pa.b(0),
          M.g(!1, !1));
      }
      if (y.K.length > I.H) y.K.splice(0, y.K.length - I.H);
      else for (; y.K.length < I.H; ) y.K.push(0);
      if (1 !== y.i)
        if (Z.every(W)) {
          for (var b = 0, d = (a = 0); d < Z.length; ++d)
            Z[d].detected > b && ((b = Z[d].detected), (a = 0));
          for (b = 0; b < I.H; ++b) y.K[b] = a;
        } else {
          b = 0;
          a = !1;
          for (d = y.wb; b < I.H; ++b) {
            if (W(Z[d]))
              if (a) {
                do ++d === y.i && (d = 0);
                while (W(Z[d]));
              } else a = !0;
            y.K[b] = d++;
            d >= y.i && (d = 0);
          }
          y.wb = d;
        }
      for (a = 0; a < I.H; ++a)
        (y.T = y.K[a]),
          (y.Va = (0.5 + y.T) / y.i),
          (y.tb = y.K.lastIndexOf(y.T) === a),
          l.set('s48'),
          H.$ && l.u('u37', Z[y.T].rz),
          1 !== y.i && l.u('u36', y.Va),
          U.A(),
          p.qa.b(0),
          ba.b(1),
          M.g(!1, !1),
          U.b(0),
          ma.F(!1, U);
      a = Date.now();
      I.ja = a - I.timestamp;
      I.timestamp = a;
      D.nDetectsPerLoop ||
        ((a = v.Fa),
        (I.Bb = I.Ab / I.ja),
        (I.Cb = I.Bb * a + I.Cb * (1 - a)),
        (I.Db = 1e3 / I.ja),
        (I.da = I.Db * v.Fa + I.da * (1 - v.Fa)),
        I.da > v.Z[1]
          ? ((a = v.ra[1]),
            1 < y.i &&
              ((a += 1), (b = Z.filter(Q).length), (a *= Math.max(1, b))),
            (I.H = Math.min(I.H + 1, a)),
            (I.da = (v.Z[0] + v.Z[1]) / 2))
          : I.da < v.Z[0] &&
            ((I.H = Math.max(I.H - 1, v.ra[0])),
            (I.da = (v.Z[0] + v.Z[1]) / 2)));
      w.I();
      c.viewport(0, 0, 3, 2 * y.i);
      l.set('s46');
      ba.b(0);
      M.g(!1, !1);
      c.readPixels(0, 0, 3, 2 * y.i, c.RGBA, c.UNSIGNED_BYTE, ka);
      for (a = 0; a < y.i; ++a)
        if (-1 !== y.K.indexOf(a)) {
          var e = a;
          b = la[e];
          var f = [e];
          d = Z[e];
          var g = Ca[e],
            h = 2 * e;
          b.ua = F(1, h, 3, 0, 1);
          d.detected = pa(d.detected, b.ua, v.Sb);
          if (b.ua < v.Ua) H.$ && (d.rz = 0);
          else {
            b.x = F(0, h, 1, -1, 1);
            b.y = F(0, h, 2, -1, 1);
            b.M = F(0, h, 3, 0, 1);
            b.Wa = F(1, h, 0, -oa[0], oa[0]);
            b.Xa = F(1, h, 1, -oa[1], oa[1]);
            b.na = F(1, h, 2, -oa[2], oa[2]);
            for (var k = 0; k < v.ya; ++k) b.jb[k] = v.nc[k](F(2, h, k, 0, 1));
            f.La = b.x - d.x;
            f.Ma = b.y - d.y;
            f.Ka = b.M - d.s;
            f.Ha = b.Wa - d.rx;
            f.Ia = b.Xa - d.ry;
            f.Ja = H.$ ? b.na : b.na - d.rz;
            h = Math.sqrt(f.La * f.La + f.Ma * f.Ma + f.Ka * f.Ka) / I.ja;
            f = Math.sqrt(f.Ha * f.Ha + f.Ia * f.Ia + f.Ja * f.Ja) / I.ja;
            h =
              1 -
              ua(Y.translationFactorRange[0], Y.translationFactorRange[1], h);
            f = 1 - ua(Y.rotationFactorRange[0], Y.rotationFactorRange[1], f);
            f =
              h *
              f *
              ua(Y.qualityFactorRange[0], Y.qualityFactorRange[1], b.ua);
            e = g[++Da[e] % g.length] = f;
            for (h = 0; h < g.length; ++h) e = Math.min(e, g[h]);
            e = Math.max(0.5, e);
            f = Math.min(e, f);
            g = pa(Y.alphaRange[1], Y.alphaRange[0], Math.pow(f, v.Ub));
            d.x = pa(d.x, b.x, g);
            d.y = pa(d.y, b.y, g);
            d.s = pa(d.s, b.M, g);
            d.rx = pa(d.rx, b.Wa, g);
            d.ry = pa(d.ry, b.Xa, g);
            d.rz = H.$ ? d.rz + g * b.na : pa(d.rz, b.na, g);
            g = Math.max(g, v.Tb);
            for (e = 0; e < v.ya; ++e)
              d.expressions[e] = pa(d.expressions[e], b.jb[e], g);
            ++b.xa;
          }
        }
      w.Zc();
      w.reset();
      V.reset();
      c.enable(c.DEPTH_TEST);
      H.ta && (1 === y.i ? H.ta(Z[0]) : H.ta(Z));
      c.disable(c.BLEND);
      if (r === n.play || r === n.V) J = window.requestAnimationFrame(B);
    }
  }
  function aa() {
    function a(a) {
      for (var b = [], d = 0; d < y.i; ++d) b.push(Object.assign({}, a));
      return b;
    }
    p.qa = V.a({ isPot: !1, isLinear: !0, isFloat: !1, width: ea, height: P });
    U = V.a({ isPot: !0, isFloat: !1, width: ma.lb() });
    var b = {
      width: 3,
      height: y.i,
      isFloat: !0,
      isPot: !1,
      array: (function(a) {
        for (var b = new Float32Array(a.length * y.i), d = 0, e; d < y.i; ++d)
          for (e = 0; e < a.length; ++e) b[d * a.length + e] = a[e];
        return b;
      })(
        new Float32Array([
          0,
          D.borderWidth,
          D.borderHeight,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
        ])
      ),
    };
    ba = Ea.a(b);
    ka = new Uint8Array(8 * b.width * y.i);
    la = a({
      ua: 0,
      x: 0,
      y: 0,
      M: 1,
      Wa: 0,
      Xa: 0,
      na: 0,
      jb: new Float32Array(v.ya),
      xa: 0,
    });
    Z = a({
      detected: 0,
      x: 0,
      y: 0,
      s: 1,
      rx: 0,
      ry: 0,
      rz: 0,
      expressions: new Float32Array(v.ya),
    });
    a({ La: 0, Ma: 0, Ka: 0, Ha: 0, Ia: 0, Ja: 0 });
  }
  function da() {
    l.J('s48', [
      { type: '1i', name: 'u1', value: 0 },
      { type: '1i', name: 'u34', value: 1 },
      { type: '2f', name: 'u35', value: S },
      { type: '1f', name: 'u36', value: 0.5 },
      { type: '1f', name: 'u37', value: 0 },
    ]);
    l.J('s49', [
      { type: '1i', name: 'u38', value: 0 },
      { type: '1i', name: 'u34', value: 1 },
      { type: '1f', name: 'u41', value: v.Yc },
      { type: '1f', name: 'u42', value: v.Ob },
      { type: '1f', name: 'u43', value: v.Nb },
      {
        type: '3f',
        name: 'u40',
        value: [v.Za[0] * S[0], v.Za[1] * S[1], v.Za[2]],
      },
      { type: '1f', name: 'u36', value: 0.5 },
      { type: '1f', name: 'u44', value: 1 },
      { type: '1f', name: 'u37', value: 0 },
    ]);
    var a = [{ type: '1i', name: 'u38', value: 0 }];
    l.J('s50', a);
    l.J('s51', a);
    l.J('s46', [
      { type: '1i', name: 'u34', value: 0 },
      { type: '1f', name: 'u47', value: S[0] },
      { type: '2f', name: 'u46', value: [0, 0.5 / y.i] },
    ]);
  }
  function na() {
    var O = ma.lb(),
      n = ea / O;
    f = D.minScale * n;
    k = D.maxScale * n;
    m = (1 - 2 * D.borderWidth) / D.nStepsX;
    q = (1 - 2 * D.borderHeight) / D.nStepsY;
    h = (k - f) / D.nStepsScale;
    t = D.borderWidth;
    x = D.borderHeight;
    u = 1 - D.borderWidth;
    A = 1 - D.borderHeight;
    S = [O / ea, O / P];
    a = D.borderWidth;
    b = D.borderHeight;
    d = f;
    e = D.borderWidth;
    g = D.borderHeight;
    Aa = f;
  }
  function ja(a) {
    var b = H.ab;
    'JSON' !==
      b
        .toUpperCase()
        .split('.')
        .pop() && (b += v.save);
    ra(b, function(b) {
      b = JSON.parse(b);
      b.exportData &&
        b.exportData.thetaXYZfactor &&
        (oa = b.exportData.thetaXYZfactor);
      a(b);
    });
  }
  function sa() {
    if (
      Ba.l({
        ia: H.N,
        width: ea,
        height: P,
        debug: !1,
        Hc: function() {
          N('GLCONTEXT_LOST');
        },
        antialias: !0,
        premultipliedAlpha: !0,
      })
    ) {
      if (Ba.yc()) return !0;
      N('GL_INCOMPATIBLE');
      return !1;
    }
    N('GL_INCOMPATIBLE');
    return !1;
  }
  function W(a) {
    return a.detected < v.Ua;
  }
  function Q(a) {
    return a.detected > v.Ua;
  }
  function L(a, b, d, e) {
    return d > a
      ? Math.max(0, a + b / 2 - (d - e / 2))
      : Math.max(0, d + e / 2 - (a - b / 2));
  }
  function fa() {
    return la.some(function(a, b) {
      if (b === y.T) return !1;
      b = la[y.T];
      if (b.xa > a.xa || 3 > a.xa || L(b.x / 2, b.M, a.x / 2, a.M) < v.yb * b.M)
        return !1;
      var d = ea / P;
      return L(b.y / 2, b.M * d, a.y / 2, a.M * d) > v.yb * b.M * d;
    });
  }
  function T() {
    var O = y.T;
    ba.Qc(1);
    1 !== y.i &&
      (c.viewport(0, 0, 3, y.i),
      l.set('s0'),
      l.Ib('u1', 1),
      M.g(!1, !1),
      l.Ib('u1', 0));
    c.viewport(0, O, 1, 1);
    l.set('s49');
    H.$ && l.u('u37', Z[O].rz);
    1 !== y.i && l.u('u36', y.Va);
    if (1 < y.i) {
      var n = fa() ? 0 : 1;
      l.u('u44', n);
    }
    l.Sc('u39', e, g, Aa);
    M.g(!1, !1);
    y.tb &&
      (c.viewport(1, O, 1, 1),
      l.set('s50'),
      M.g(!1, !1),
      c.viewport(2, O, 1, 1),
      l.set('s51'),
      M.g(!1, !1));
    d += h;
    d > k &&
      ((a += m), (d = f), a > u && ((a = t), (b += q), b > A && (b = x)));
    e = a + 0.8 * (Math.random() - 0.5) * m;
    g = b + 0.8 * (Math.random() - 0.5) * q;
    Aa = d + 0.8 * (Math.random() - 0.5) * h;
  }
  function ia() {
    p.pa = V.a({ D: p.element, isPot: !1, isFloat: !1, isFlipY: !0 });
  }
  function ha() {
    l.J('s47', [
      { type: '1i', name: 'u1', value: 0 },
      { type: 'mat2', name: 'u33', value: p.C },
    ]);
  }
  function X() {
    p.B[0] = 0.5;
    p.B[1] = 0.5;
    var a = p.O[1] / p.O[0],
      b = Ba.L() / Ba.w();
    90 === Math.abs(G.rotate) && (a = 1 / a);
    a > b ? (p.B[1] *= b / a) : (p.B[0] *= a / b);
    l.J('s49', [{ name: 'u45', type: '1f', value: b }]);
    p.C[0] = 0;
    p.C[1] = 0;
    p.C[2] = 0;
    p.C[3] = 0;
    switch (G.rotate) {
      case 0:
        p.C[0] = p.B[0];
        p.C[3] = p.B[1];
        break;
      case 180:
        p.C[0] = -p.B[0];
        p.C[3] = -p.B[1];
        break;
      case 90:
        p.C[1] = p.B[0];
        p.C[2] = -p.B[1];
        break;
      case -90:
        (p.C[1] = -p.B[0]), (p.C[2] = p.B[1]);
    }
  }
  function ca(a, b) {
    if (r === n.error) return !1;
    var d = a.videoHeight;
    p.O[0] = a.videoWidth;
    p.O[1] = d;
    p.element = a;
    b && b();
    return !0;
  }
  function ta(a, b, d) {
    a && a();
    a = {
      video: {
        facingMode: { ideal: G.facingMode },
        width: { min: G.minWidth, max: G.maxWidth, ideal: G.idealWidth },
        height: { min: G.minHeight, max: G.maxHeight, ideal: G.idealHeight },
      },
      audio: !1,
    };
    G.deviceId && (a.deviceId = G.deviceId);
    ab(
      function(a) {
        b && b(a);
        d(a);
      },
      function() {
        N('WEBCAM_UNAVAILABLE');
      },
      a
    );
  }
  function N(a) {
    r !== n.error && ((r = n.error), H.ha && H.ha(a));
  }
  function R(a, b) {
    for (var d in a) 'undefined' !== typeof b[d] && (a[d] = b[d]);
    b === D &&
      D.nDetectsPerLoop &&
      ((I.H = D.nDetectsPerLoop), (I.Ab = D.nDetectsPerLoop));
  }
  var v = {
      save: 'NNC.json',
      Vb: 0,
      Wb: 25,
      Fa: 0.2,
      Z: [45, 55],
      cd: 1 / 3.5,
      ra: [2, 6],
      Kc: {
        minScale: 0.15,
        maxScale: 0.6,
        borderWidth: 0.2,
        borderHeight: 0.2,
        nStepsX: 6,
        nStepsY: 5,
        nStepsScale: 3,
        nDetectsPerLoop: 0,
      },
      Za: [0.092, 0.092, 0.3],
      Yc: 50,
      yb: 0.12,
      Ua: 0.6,
      Ec: 8,
      Ob: 0.75,
      Nb: 1,
      Wc: {
        translationFactorRange: [0.0015, 0.005],
        rotationFactorRange: [0.003, 0.02],
        qualityFactorRange: [0.9, 0.98],
        alphaRange: [0.05, 1],
      },
      Xc: [0.65, 1, 0.262],
      Sb: 0.2,
      Ub: 2,
      Tb: 0.1,
      Fc: 8,
      ya: 1,
      nc: [ua.bind(null, 0.3, 0.75)],
      ad: 20,
    },
    G = {
      facingMode: 'user',
      idealWidth: 800,
      idealHeight: 600,
      minWidth: 480,
      maxWidth: 1280,
      minHeight: 480,
      maxHeight: 1280,
      rotate: 0,
    },
    n = { Bc: -1, error: -2, ob: 0, play: 1, pause: 2, V: 3 },
    r = n.ob,
    p = {
      Sa: !1,
      element: !1,
      pa: !1,
      qa: !1,
      O: [0, 0],
      B: [0.5, 0.5],
      C: [0.5, 0, 0, 0.5],
      za: 0,
    },
    H = { ha: !1, ta: !1, ab: './', N: !1, Ea: v.Vb, $: !1 },
    ma,
    D = Object.create(v.Kc),
    Y = Object.create(v.Wc);
  var Aa = (d = g = e = b = a = k = f = A = u = x = t = h = q = m = 0);
  var ea,
    P,
    S,
    U,
    ba,
    ka,
    la,
    Z,
    qa = !1,
    J = !1,
    oa = v.Xc,
    y = { i: 1, T: 0, K: [0], tb: !1, wb: 0, Va: 0 },
    I = {
      ja: 0,
      timestamp: 0,
      Bb: 0,
      Cb: 0,
      H: v.ra[0],
      Ab: v.ra[0],
      Db: 0,
      da: 0,
      jd: 1,
    },
    Ca = [],
    Da = [];
  return {
    init: function(a) {
      function b() {
        r !== n.error &&
          2 === ++e &&
          (X(),
          ia(),
          ha(),
          H.ha &&
            (H.ha(!1, {
              GL: c,
              canvasElement: H.N,
              videoTexture: p.qa.get(),
              maxFacesDetected: y.i,
            }),
            K()),
          C());
      }
      if (r !== n.ob)
        return a.callbackReady && a.callbackReady('ALREADY_INITIALIZED'), !1;
      r = n.Bc;
      a.callbackReady && (H.ha = a.callbackReady);
      a.callbackTrack && (H.ta = a.callbackTrack);
      'undefined' !== typeof a.animateDelay && (H.Ea = a.animateDelay);
      'undefined' !== typeof a.NNCpath && (H.ab = a.NNCpath);
      'undefined' !== typeof a.maxFacesDetected &&
        (y.i = Math.max(1, a.maxFacesDetected));
      'undefined' !== typeof a.followZRot && (H.$ = a.followZRot ? !0 : !1);
      if (y.i > v.Ec) return N('MAXFACES_TOOHIGH'), !1;
      if (!a.canvasId) return N('NO_CANVASID'), !1;
      H.N = document.getElementById(a.canvasId);
      if (!H.N) return N('INVALID_CANVASID'), !1;
      ea = H.N.width;
      P = H.N.height;
      if (!ea || !P) return N('INVALID_CANVASDIMENSIONS'), !1;
      for (var d = 0; d < y.i; ++d) Ca.push(new Float32Array(v.Fc)), Da.push(0);
      a.scanSettings && R(D, a.scanSettings);
      a.stabilizationSettings && R(Y, a.stabilizationSettings);
      var e = 0;
      a.videoSettings && a.videoSettings.videoElement
        ? ca(a.videoSettings.videoElement, b)
        : (a.videoSettings && R(G, a.videoSettings),
          ta(a.onWebcamAsk, a.onWebcamGet, function(a) {
            ca(a, b);
          }));
      ja(function(a) {
        if (!sa()) return !1;
        ma = new Qa();
        ma.Mc(a.layers);
        ma.Oc({ Eb: 'gpuRawAvg', Ic: T });
        l.Rb([
          {
            id: 's47',
            name: '_',
            Y:
              'attribute vec2 a0;uniform mat2 u33;varying vec2 vv0;void main(){gl_Position=vec4(a0,0.,1.),vv0=vec2(.5,.5)+u33*a0;}',
            sa: ['a0'],
            ea: [2],
            c:
              'uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vv0);}',
            f: ['u1', 'u33'],
            precision: 'lowp',
          },
          {
            id: 's48',
            name: '_',
            c:
              'uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vv0);}',
            Y:
              'attribute vec2 a0;uniform sampler2D u34;uniform vec2 u35;uniform float u36,u37;varying vec2 vv0;void main(){vec4 a=texture2D(u34,vec2(.17,u36));vec2 d=a.gb,e=a.a*u35;float b=cos(u37),c=sin(u37);vec2 g=mat2(b,c,-c,b)*a0;vv0=d+g*.5*e,gl_Position=vec4(a0,0.,1.);}',
            sa: ['a0'],
            ea: [2],
            f: ['u1', 'u34', 'u35', 'u36', 'u37'],
            precision: 'lowp',
          },
          {
            id: 's49',
            name: '_',
            c:
              'uniform sampler2D u38,u34;uniform vec3 u39,u40;uniform float u41,u42,u43,u36,u44,u37,u45;const vec4 n=vec4(1.,1.,1.,1.),o=vec4(0.,0.,0.,0.),e=vec4(.25,.25,.25,.25);void main(){vec4 g=texture2D(u38,vec2(.625,.625)),h=texture2D(u38,vec2(.875,.625)),a=texture2D(u34,vec2(.17,u36));float b=dot(g,e),i=dot(h,e);bool j=b>u42&&b>i+u43;j?a.r=2.:a.r>u41?a.r=0.:a.r>1.9?a.r+=1.:0.,a.r*=u44;if(a.r<.9)a=vec4(1.,u39);else{a.r*=step(1.9,a.r);float k=dot(e,texture2D(u38,vec2(.875,.875))),l=dot(e,texture2D(u38,vec2(.125,.625))),m=dot(e,texture2D(u38,vec2(.375,.625))),c=cos(u37),d=sin(u37);vec2 f=mat2(c,d*u45,-d/u45,c)*vec2(k,l);a.gba+=vec3(f,m)*u40*a.a;}gl_FragColor=a;}',
            Y: 'attribute vec2 a0;void main(){gl_Position=vec4(a0,0.,1.);}',
            f: 'u38 u34 u39 u41 u40 u44 u37 u45 u42 u43 u36'.split(' '),
          },
          {
            id: 's50',
            name: '_',
            Y: 'attribute vec2 a0;void main(){gl_Position=vec4(a0,0.,1.);}',
            c:
              'uniform sampler2D u38;const vec4 e=vec4(.25,.25,.25,.25);const vec3 g=vec3(.5,.5,.5);void main(){float a=dot(e,texture2D(u38,vec2(.125,.875))),b=dot(e,texture2D(u38,vec2(.375,.875))),c=dot(e,texture2D(u38,vec2(.625,.875))),d=dot(e,texture2D(u38,vec2(.625,.625)));vec3 f=vec3(a,b,c)*.5+g;gl_FragColor=vec4(f,d);}',
            f: ['u38'],
          },
          {
            id: 's51',
            name: '_',
            Y: 'attribute vec2 a0;void main(){gl_Position=vec4(a0,0.,1.);}',
            c:
              'uniform sampler2D u38;const vec4 e=vec4(.25,.25,.25,.25);void main(){float a=dot(e,texture2D(u38,vec2(.25,.25)));gl_FragColor=vec4(a,0.,0.,0.);}',
            f: ['u38'],
          },
          {
            id: 's46',
            name: '_',
            c:
              'uniform sampler2D u34;uniform vec2 u46;uniform float u47;varying vec2 vv0;void main(){float g=step(.5,mod(gl_FragCoord.y+1.5,2.)),c=step(.33,vv0.x);vec4 a=texture2D(u34,vv0+u46);a.a=mix(a.a*u47,a.a,c);vec4 d=floor(255.*a),f=255.*(255.*a-d),b=mix(d,f,g)/255.;b.x=mix(step(a.x,1.5),b.x,c),gl_FragColor=b;}',
            f: ['u34', 'u47', 'u46'],
          },
        ]);
        aa();
        na();
        da();
        b();
      });
      return !0;
    },
    toggle_pause: function(a) {
      if (-1 !== [n.play, n.pause, n.V].indexOf(r))
        return (
          a
            ? -1 === [n.play, n.V].indexOf(r)
              ? (a = !1)
              : (qa && (clearTimeout(qa), (qa = !1)),
                J && (window.cancelAnimationFrame(J), (J = !1)),
                (r = n.pause),
                (a = !0))
            : (a = C()),
          a
        );
    },
    toggle_slow: function(a) {
      -1 !== [n.play, n.pause, n.V].indexOf(r) &&
        -1 !== [n.play, n.V].indexOf(r) &&
        (r = a ? n.V : n.play);
    },
    set_animateDelay: function(a) {
      H.Ea = a;
    },
    resize: function() {
      var a = H.N.width,
        b = H.N.height;
      if (a === ea && b === P) return !1;
      ea = a;
      P = b;
      na();
      da();
      X();
      ha();
      return !0;
    },
    set_inputTexture: function(a, b, d) {
      p.O[0] = b;
      p.O[1] = d;
      p.Sa = !0;
      X();
      K();
      ha();
      l.set('s47');
      p.qa.A();
      c.activeTexture(c.TEXTURE0);
      c.bindTexture(c.TEXTURE_2D, a);
      M.g(!0, !0);
    },
    reset_inputTexture: function() {
      p.O[0] = p.element.videoWidth;
      p.O[1] = p.element.videoHeight;
      p.Sa = !1;
      X();
      ha();
    },
    get_videoDevices: function(a) {
      return bb(a);
    },
    set_scanSettings: function(a) {
      R(D, a);
      na();
      da();
    },
    set_stabilizationSettings: function(a) {
      R(Y, a);
    },
    update_videoElement: function(a, b) {
      ca(a, function() {
        ia();
        X();
        b && b();
      });
    },
  };
})();
if (typeof module !== 'undefined') {
  module.exports = JEEFACEFILTERAPI;
}
