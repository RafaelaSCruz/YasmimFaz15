precision highp float;
varying vec2 origCoord;
varying vec2 maskCoord;

uniform sampler2D u_FBOTexture;
uniform sampler2D offsetTexture;

uniform float inputWidth;
uniform float inputHeight;
uniform float scaleFactor;

uniform vec2 x_axis;
uniform vec2 y_axis;

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
    vec2 modelSize = vec2(1280, 1280);
    vec2 imgSize = vec2(inputWidth, inputHeight);

    vec4 offsetColor = texture2D(offsetTexture, maskCoord);
    vec2 offsetUV = vec4ToVec2(offsetColor);
    vec2 offsetCoord = offsetUV * 2.0 - 1.0;

    offsetCoord = offsetCoord * scaleFactor;
    offsetCoord = offsetCoord.x * x_axis + offsetCoord.y * y_axis;
    offsetCoord = offsetCoord * modelSize / imgSize;

    vec4 fboColor = texture2D(u_FBOTexture, origCoord);
    vec2 fboUV = vec4ToVec2(fboColor);
    vec2 fboCoord = fboUV * 2.0 - 1.0;

    vec2 resultCoord = offsetCoord + fboCoord;
    vec2 resultUV = resultCoord * 0.5 + 0.5;
    gl_FragColor = vec2ToVec4(resultUV);
}
