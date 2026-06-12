precision highp float;

uniform sampler2D u_base;
uniform sampler2D u_src0;
uniform float u_opacity0;

varying vec2 v_uv;


void main () {
    vec4 base = texture2D(u_base, v_uv);
    vec4 src0 = texture2D(u_src0, v_uv) * u_opacity0;
    base = src0 + base * (1.0 - src0.a);
    gl_FragColor = base;
}