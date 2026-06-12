precision highp float;
varying highp vec2 uv0;
uniform sampler2D u_albedo;

uniform float SA;
uniform float HA;


float processShadow(float x, float a)
{
    float x2 = x * x;
    float x3 = x2 * x;
    float res = pow(x, a) + (a - 1.0) * (x2 - x3);
    return res;
}


float processHighlight(float x, float a)
{
    float t = 1.0 - x;
    float t2 = t * t;
    float t3 = t2 * t;
    float res = 1.0 - pow(t, a) - (a - 1.0) * (t2 - t3);
    return res;
}


void main()
{
    // gl_FragColor = texture2D(u_albedo, uv0);
    vec4 color = texture2D(u_albedo, uv0);

    color.r = processHighlight(color.r, HA);
    color.g = processHighlight(color.g, HA);
    color.b = processHighlight(color.b, HA);

    color.r = processShadow(color.r, SA);
    color.g = processShadow(color.g, SA);
    color.b = processShadow(color.b, SA);

    gl_FragColor = clamp(color, 0.0, 1.0);
}
