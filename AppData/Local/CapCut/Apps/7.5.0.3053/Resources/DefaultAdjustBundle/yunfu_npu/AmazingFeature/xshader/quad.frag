precision highp float;
varying vec2 uv;
//varying vec2 uv_screen;

uniform sampler2D u_flow;
uniform sampler2D u_gan;

uniform sampler2D u_input;

uniform mat4 u_mvpMat;
uniform mat4 u_mvpMat_rev;

uniform sampler2D u_blurmask;
uniform float u_h;

void main() {
  // magnify the intensity for better visualization
  vec4 flow = texture2D(u_flow, uv);
  float mask = texture2D(u_blurmask, uv).r;
  flow = (flow - 0.5) * 0.125;
  vec2 uv_gan = uv + flow.xy * mask * step(0.001, u_h);
  uv_gan = clamp(uv_gan, 0.0, 1.0);
  vec4 pos_gan = vec4(uv_gan * 2.0 - 1.0, 0.0, 1.0) * vec4(1.0, -1.0, 1.0, 1.0);
  vec4 pos_src = u_mvpMat * pos_gan;
  vec2 uv_src = pos_src.xy * 0.5 + 0.5;

  vec4 gan = texture2D(u_gan, uv_gan);
  vec4 src = texture2D(u_input, uv_src);
  float nonZeroSrcAlpha = step(0.0, -src.a) * 0.000001 + src.a; 
  src.rgb /= nonZeroSrcAlpha;
  gan.a *= mask;

  gl_FragColor = vec4(mix(src.rgb, gan.rgb, gan.a), src.a * mask);
}
