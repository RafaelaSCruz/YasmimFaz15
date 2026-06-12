precision highp float;
varying highp vec2 uv;

uniform sampler2D originTexture;
uniform sampler2D offsetTexture;
uniform vec2 blurStep;

vec2 vec4ToVec2(vec4 val)
{
    float a = val.x + val.y / 255.0;
    float b = val.z + val.w / 255.0;
    return vec2(a, b);
}

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
    float offset[3];
    offset[0] = 0.0;
    offset[1] = 1.385;
    offset[2] = 3.230;
    float weight[3];
    weight[0] = 0.228;
    weight[1] = 0.316;
    weight[2] = 0.070;

    vec2 offsetUV = vec4ToVec2(texture2D(offsetTexture, uv));
    vec2 result = offsetUV * weight[0];
    for(int i = 1; i < 3; ++i)
    {
        vec2 blurRadius = blurStep * offset[i];
        offsetUV = vec4ToVec2(texture2D(offsetTexture, uv + blurRadius));
        result += offsetUV * weight[i];
        offsetUV = vec4ToVec2(texture2D(offsetTexture, uv - blurRadius));
        result += offsetUV * weight[i];
    }

    vec2 offsetCoord = result * 2.0 - 1.0;
    gl_FragColor = texture2D(originTexture, uv + offsetCoord);
}
