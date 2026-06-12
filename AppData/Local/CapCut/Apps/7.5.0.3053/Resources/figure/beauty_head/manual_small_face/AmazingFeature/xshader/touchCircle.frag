precision highp float;
varying vec2 texcoord0;

uniform float circle_width;
uniform float circle_radius;
uniform vec4 circle_color;

void main ()
{
    float dist = distance(texcoord0, vec2(0.5));
    float mask1 = 1.0 - smoothstep(0.5 - 0.5 / circle_radius, 0.5, dist);
    float mask2 = smoothstep(0.5 - (circle_width + 0.5) / circle_radius, 0.5 - circle_width / circle_radius, dist);
    gl_FragColor = vec4(circle_color.rgb, 1.0) * mask1 * mask2;
}