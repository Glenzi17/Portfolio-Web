import { useEffect, useRef } from 'react';
import { reduced, touch } from '../lib/motion.js';

/* Fundo "líquido" azul-oceano com retícula e grão, gerado em WebGL.
   Ruído com domain warping → rampa de cor (marinho → azul → água) →
   retícula de pontos nos meios-tons + grão. Anda devagar, desvia um
   pouco em direção ao mouse e pausa fora da tela. Sem WebGL, fica o
   gradiente em CSS do pai (.fluid-host). */

const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;

const FRAG = `
precision mediump float;
uniform vec2 r; uniform float t; uniform vec2 m; uniform float s; uniform float px;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h(i), h(i + vec2(1., 0.)), f.x), mix(h(i + vec2(0., 1.)), h(i + vec2(1., 1.)), f.x), f.y);
}
float fbm(vec2 p){
  float v = 0., a = .5;
  for (int k = 0; k < 3; k++) { v += a * n(p); p = mat2(1.6, 1.2, -1.2, 1.6) * p; a *= .5; }
  return v;
}
vec3 ramp(float x){
  vec3 c0 = vec3(.051, .082, .125);   // #0d1520 marinho quase preto
  vec3 c1 = vec3(.075, .263, .592);   // #134397 azul royal
  vec3 c2 = vec3(.086, .376, .671);   // #1660ab azul principal
  vec3 c3 = vec3(.122, .502, .694);   // #1f80b1 azul-ciano
  vec3 c4 = vec3(.341, .745, .686);   // #57beaf água
  vec3 c5 = vec3(.80, .96, .88);      // brilho mentolado
  if (x < .25) return mix(c0, c1, x / .25);
  if (x < .5) return mix(c1, c2, (x - .25) / .25);
  if (x < .72) return mix(c2, c3, (x - .5) / .22);
  if (x < .9) return mix(c3, c4, (x - .72) / .18);
  return mix(c4, c5, (x - .9) / .1);
}
void main(){
  vec2 uv = gl_FragCoord.xy / r;
  vec2 p = (gl_FragCoord.xy - .5 * r) / min(r.x, r.y) * .62 + s;
  float T = t * .045;
  vec2 q = vec2(fbm(p + vec2(0., T)), fbm(p + vec2(5.2, 1.3) - T));
  vec2 w = vec2(fbm(p + 2.2 * q + vec2(1.7, 9.2) + T * 1.3 + m * .25),
                fbm(p + 2.2 * q + vec2(8.3, 2.8) - T * 1.1));
  float f = fbm(p + 1.8 * w);
  float x = clamp((f - .34) * 2.5 + (w.x - .5) * .6, 0., 1.);
  vec3 col = ramp(x);
  // veios de luz (as dobras brilhantes do tecido)
  float ridge = 1. - smoothstep(0., .02, abs(f - .58));
  col += vec3(.55, .85, .75) * ridge * smoothstep(.5, .85, x) * .55;
  // retícula de pontos a 45° nos meios-tons
  vec2 g = mat2(.7071, -.7071, .7071, .7071) * gl_FragCoord.xy / (3.2 * px);
  float d = length(fract(g) - .5);
  float lum = dot(col, vec3(.299, .587, .114));
  float dotm = 1. - smoothstep(.0, .12, d - sqrt(lum) * .5);
  col *= mix(.8, 1.07, dotm);
  // grão
  col += (h(gl_FragCoord.xy + fract(t) * 91.7) - .5) * .06;
  // leve vinheta nas bordas
  col *= mix(.78, 1., smoothstep(0., .55, 1. - length(uv - .5)));
  gl_FragColor = vec4(col, 1.);
}`;

export default function Fluid({ seed = 0 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas && canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl) { canvas && canvas.remove(); return undefined; }

    const sh = (type, src) => { const o = gl.createShader(type); gl.shaderSource(o, src); gl.compileShader(o); return o; };
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.remove(); return undefined; }
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW); // triângulo que cobre a tela
    const loc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (k) => gl.getUniformLocation(prog, k);
    const uR = u('r'), uT = u('t'), uM = u('m'), uS = u('s'), uPx = u('px');
    gl.uniform1f(uS, seed);

    // Resolução contida: a textura é granulada de propósito, e isso poupa GPU
    const scale = touch ? 0.5 : Math.min(window.devicePixelRatio || 1, 1.25);
    const resize = () => {
      const w = Math.max(1, Math.round(canvas.clientWidth * scale));
      const hgt = Math.max(1, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== hgt) { canvas.width = w; canvas.height = hgt; gl.viewport(0, 0, w, hgt); }
      gl.uniform2f(uR, w, hgt);
      gl.uniform1f(uPx, scale);
    };

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e) => {
      const b = canvas.getBoundingClientRect();
      mouse.tx = ((e.clientX - b.left) / b.width - 0.5) * 2;
      mouse.ty = -((e.clientY - b.top) / b.height - 0.5) * 2;
    };

    let raf = 0, visible = false, t0 = performance.now();
    const draw = (now) => {
      mouse.x += (mouse.tx - mouse.x) * 0.04; mouse.y += (mouse.ty - mouse.y) * 0.04;
      gl.uniform1f(uT, (now - t0) / 1000 + seed * 10);
      gl.uniform2f(uM, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = (now) => { draw(now); if (visible) raf = requestAnimationFrame(loop); };

    resize();
    draw(t0);
    if (reduced) return undefined; // um quadro estático

    const ro = new ResizeObserver(() => { resize(); if (!visible) draw(performance.now()); });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);
    if (!touch) window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      window.removeEventListener('mousemove', onMove);
      const ext = gl.getExtension('WEBGL_lose_context'); if (ext) ext.loseContext();
    };
  }, [seed]);

  return <canvas className="fluid" ref={ref} aria-hidden="true" />;
}
