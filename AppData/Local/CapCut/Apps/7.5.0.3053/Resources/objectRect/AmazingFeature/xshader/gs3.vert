attribute vec2 a_xy;
attribute vec2 a_uv;

uniform float u_step_x;
uniform float u_step_y;
uniform float u_intensity;

varying highp vec2 v_uv[9];

void main() {
    vec2 uv = a_uv;
    vec2 dp = vec2(u_step_x, u_step_y) * u_intensity;
    v_uv[0] = uv;
    v_uv[1] = uv - dp * 1.407333;
    v_uv[2] = uv + dp * 1.407333;
    v_uv[3] = uv - dp * 3.294215;
    v_uv[4] = uv + dp * 3.294215;
    v_uv[5] = uv - dp * 5.351806;
    v_uv[6] = uv + dp * 5.351806;
    v_uv[7] = uv - dp * 7.302940;
    v_uv[8] = uv + dp * 7.302940;
    gl_Position = vec4(a_xy, 0.0, 1.0);
}