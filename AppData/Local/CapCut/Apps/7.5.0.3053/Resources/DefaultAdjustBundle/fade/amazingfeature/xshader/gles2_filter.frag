precision highp float;
uniform sampler2D _MainTex;
uniform sampler2D inputImageTexture2;
varying vec2 uv0;
uniform float intensity;

#define uAlbedo inputImageTexture2
#define uSampler _MainTex


vec4 applyLut3D(vec4 color, sampler2D lutTexture, float gridSampleX, float gridSampleY, float gridNumX, float gridNumY)
{
    // gridSample and gridNum: for a ordinary 512*512 3D LUT, gridSampleX = gridSampleY = 64, gridNumX = gridNumY = 8

    float gridNum = gridNumX * gridNumY;
    float lutWidth = gridSampleX * gridNumX;
    float lutHeight = gridSampleY * gridNumY;
    float gridSizeX = 1. / gridNumX;    // grid size is in uv scale (0, 1)
    float gridSizeY = 1. / gridNumY;

    // 1. find adjacent color grids using blue channel
    // 2. look up (interpolate) red and green values in two grids respectively
    // 3. interoplate color1 and color2 using fract(blue) as weight to get final result

    // get color1
    float blue = color.b * (gridNum - 1.);
    vec2 gridPos = vec2(0.);    // gridPos is 2D index for red-green grid, which is integer
    float gridIndex = floor(blue);
    gridPos.y = floor(gridIndex / gridNumX);
    gridPos.x = gridIndex - gridPos.y * gridNumX;
    float scaleX = 1. / gridNumX - 1. / lutWidth;
    float scaleY = 1. / gridNumY - 1. / lutHeight;
    vec2 texturePos = vec2(0.); // texturePos is uv coordinate
    texturePos.x = gridPos.x * gridSizeX + 0.5 / lutWidth + scaleX * color.r;
    texturePos.y = gridPos.y * gridSizeY + 0.5 / lutHeight + scaleY * color.g;
    vec4 color1 = texture2D(lutTexture, texturePos);

    // get color2, the computation of `gridPos` and `texturePos` are exactly the same with preceding code
    gridIndex = ceil(blue);
    gridPos.y = floor(gridIndex / gridNumX);
    gridPos.x = gridIndex - gridPos.y * gridNumX;
    texturePos.x = gridPos.x * gridSizeX + 0.5 / lutWidth + scaleX * color.r;
    texturePos.y = gridPos.y * gridSizeY + 0.5 / lutHeight + scaleY * color.g;
    vec4 color2 = texture2D(lutTexture, texturePos);
    
    vec4 resultColor = mix(color1, color2, fract(blue));
    return resultColor;
}

void main() 
{
    float slider_progress = abs(intensity);
    vec4 curColor = texture2D(uSampler, uv0);
    vec4 newColor = applyLut3D(curColor, uAlbedo, 17., 17., 17., 1.);
    newColor = mix(curColor,newColor,slider_progress);
    newColor.a = curColor.a;
    gl_FragColor = clamp(newColor, 0., 1.);

}
