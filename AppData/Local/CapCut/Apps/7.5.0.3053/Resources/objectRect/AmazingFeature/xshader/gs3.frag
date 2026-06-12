precision highp float;

uniform sampler2D u_tex;

varying highp vec2 v_uv[9];

void main () {
	vec4 sum = vec4(0.0);
	sum += texture2D(u_tex, v_uv[0]) * 0.133571;
	sum += texture2D(u_tex, v_uv[1]) * 0.233308;
	sum += texture2D(u_tex, v_uv[2]) * 0.233308;
	sum += texture2D(u_tex, v_uv[3]) * 0.135928;
	sum += texture2D(u_tex, v_uv[4]) * 0.135928;
	sum += texture2D(u_tex, v_uv[5]) * 0.051383;
	sum += texture2D(u_tex, v_uv[6]) * 0.051383;
	sum += texture2D(u_tex, v_uv[7]) * 0.012595;
	sum += texture2D(u_tex, v_uv[8]) * 0.012595;
	gl_FragColor = sum;
}