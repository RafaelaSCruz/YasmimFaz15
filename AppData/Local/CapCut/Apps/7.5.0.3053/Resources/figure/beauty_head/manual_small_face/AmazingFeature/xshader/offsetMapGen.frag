precision highp float;
varying highp vec2 uvOffset;

vec4 vec2ToVec4(vec2 val)
{
    float a = floor(val.x * 255.0) / 255.0;
    float b = fract(val.x * 255.0);
    float c = floor(val.y * 255.0) / 255.0;
    float d = fract(val.y * 255.0);
    return vec4(a, b, c, d);
}

void main()
{
    vec2 offset = vec2(uvOffset.x * 0.5 + 0.5, uvOffset.y * 0.5 + 0.5);
    gl_FragColor = vec2ToVec4(offset);
}
