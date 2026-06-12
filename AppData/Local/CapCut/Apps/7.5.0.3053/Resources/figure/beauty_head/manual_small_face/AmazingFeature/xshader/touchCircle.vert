precision highp float;
attribute vec3 attPosition;
attribute vec2 attTexcoord0;
varying vec2 texcoord0;

uniform vec4 u_ScreenParams;
uniform float circle_radius;
uniform vec2 circle_position;

void main ()
{
    vec2 scale = vec2(circle_radius * 2.0) / u_ScreenParams.xy;
    gl_Position = vec4(attPosition.xy * scale + circle_position, 0.0, 1.0);

    texcoord0 = attTexcoord0;
}
