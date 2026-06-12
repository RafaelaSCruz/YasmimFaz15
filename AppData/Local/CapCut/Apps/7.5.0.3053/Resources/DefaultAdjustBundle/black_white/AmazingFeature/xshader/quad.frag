precision highp float;
varying highp vec2 uv0;
uniform sampler2D u_Albedo;

uniform float Slope;
uniform float Bias;


void main()
{
    // gl_FragColor = texture2D(u_albedo, uv0);
    vec4 color = texture2D(u_Albedo, uv0);
    color.r = Slope * color.r + Bias;
    color.g = Slope * color.g + Bias;
    color.b = Slope * color.b + Bias;

    gl_FragColor = clamp(color, 0.0, 1.0);
}

