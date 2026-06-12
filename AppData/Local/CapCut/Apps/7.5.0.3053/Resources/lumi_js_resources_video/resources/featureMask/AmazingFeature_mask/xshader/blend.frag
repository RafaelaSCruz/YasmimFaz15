precision lowp float;
varying highp vec2 uv0;
uniform sampler2D u_maskTex;
uniform sampler2D u_inputTex;
uniform vec4 u_maskPreviewColor;
uniform int u_blendWithMask;

void main()
{
    vec4 maskColor = texture2D(u_maskTex, uv0);
    vec4 inputColor = texture2D(u_inputTex, uv0);
    if (u_blendWithMask == 0)
    {
        gl_FragColor = inputColor;
    }
    else if (u_blendWithMask > 0 && maskColor.b == 1.0)
    {
        gl_FragColor = inputColor;
    }
    else if (maskColor.a == 0.0)
    {
        vec4 fgColor = mix(u_maskPreviewColor, inputColor, u_maskPreviewColor.a);
        vec4 blendColor = mix(inputColor, fgColor, maskColor.r);
        blendColor.a = inputColor.a;
        gl_FragColor = blendColor;
    }
    else
    {
        inputColor = inputColor * maskColor.r;
        gl_FragColor = inputColor;
    }   
}