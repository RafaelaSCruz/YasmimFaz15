precision lowp float;
varying highp vec2 uv0;
uniform sampler2D u_inputTex;
uniform sampler2D u_maskTex;
uniform sampler2D u_featureTex;
uniform vec4 u_maskPreviewColor;
uniform float u_useInputTex;
uniform float u_usePreviewColor;

void main()
{
    vec4 inputColor = texture2D(u_inputTex, uv0);
    vec4 maskColor = texture2D(u_maskTex, uv0);
    vec4 featureColor = texture2D(u_featureTex, uv0);

    if (maskColor.a == 0.0)
    {
        featureColor = mix(u_maskPreviewColor, featureColor, maskColor.a);
        featureColor.rgb = mix(featureColor.rgb, inputColor.rgb, featureColor.a * (1.0 - maskColor.a));
    }
    
    if (u_useInputTex > 0.0)
    {
        gl_FragColor = mix(inputColor, featureColor, maskColor.r);
    }
    else
    {
        gl_FragColor = mix(vec4(0.0), featureColor, maskColor.r);
    }
}