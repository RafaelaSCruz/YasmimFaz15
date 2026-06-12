precision highp float;

uniform vec2 u_size;
uniform vec2 u_paint;
uniform vec4 u_color;

varying vec2 v_xy;


bool ball42 (bvec2 a, bvec2 b) {
    return all(bvec4(a, b));
}

float fany41 (bool a, bool b, bool c, bool d) {
    return float(any(bvec4(a, b, c, d)));
}


void main () {
    vec2 size = u_size;
    vec2 w = u_paint.xx;
    vec2 l = u_paint.yy - u_paint.xx;

    vec4 xyxy = vec4(v_xy, v_xy);
    vec4 box0 = vec4(0.0, 0.0, size);
    vec4 box1 = vec4(box0.xy + w, box0.zw - w);
    vec4 box2 = vec4(box1.xy + l, box1.zw - l);

    bvec4 lb1 = lessThanEqual(vec4(box0.xy, v_xy), vec4(v_xy, box1.xy));
    bvec4 lb2 = lessThanEqual(vec4(box0.xy, v_xy), vec4(v_xy, box2.xy));
    bvec4 rt1 = lessThanEqual(vec4(box1.zw, v_xy), vec4(v_xy, box0.zw));
    bvec4 rt2 = lessThanEqual(vec4(box2.zw, v_xy), vec4(v_xy, box0.zw));

    float any_h = fany41(ball42(lb2.xz, lb1.yw), ball42(lb2.xz, rt1.yw), ball42(rt2.xz, lb1.yw), ball42(rt2.xz, rt1.yw));
    float any_v = fany41(ball42(lb1.xz, lb2.yw), ball42(lb1.xz, rt2.yw), ball42(rt1.xz, lb2.yw), ball42(rt1.xz, rt2.yw));
    float colorize = min(any_h + any_v, 1.0);

    gl_FragColor = mix(vec4(0.0), u_color, colorize);
}