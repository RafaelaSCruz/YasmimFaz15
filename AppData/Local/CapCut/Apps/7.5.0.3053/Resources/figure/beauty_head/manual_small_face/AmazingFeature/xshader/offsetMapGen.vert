precision highp float;

attribute vec2 position;
attribute vec2 positionOffset;
attribute vec2 texcoord0;

varying vec2 uvOffset;

#ifdef FacialProtect
uniform sampler2D facialMask;
#else
uniform sampler2D liquefyMask;
#endif

void main() 
{
#ifdef FacialProtect
    float weight = texture2D(facialMask, vec2(texcoord0.x, 1.0 - texcoord0.y)).r;
    float max_offset = 0.05;
#else
    float weight = texture2D(liquefyMask, vec2(texcoord0.x, 1.0 - texcoord0.y)).r;
    float max_offset = 0.5;
#endif

    vec2 newPostion = position + min(max(positionOffset, vec2(-max_offset)), vec2(max_offset)) * weight;
    gl_Position = vec4(newPostion.x, -newPostion.y, 0.0, 1.0);

    vec2 uvCur = newPostion * 0.5 + 0.5;
    uvOffset = texcoord0 - uvCur;
}
