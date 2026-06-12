precision lowp float;
varying highp vec2 uv0;
uniform sampler2D u_inputTex;
uniform sampler2D u_featureTex;
uniform sampler2D u_maskTex;
uniform vec4 u_maskPreviewColor;

void main()
{
    vec4 maskColor = texture2D(u_maskTex, uv0);
    vec4 featureColor = texture2D(u_featureTex, uv0);
    vec4 inputColor = texture2D(u_inputTex, uv0);

    if (maskColor.a == 0.0)
    {
        featureColor.rgb = mix(inputColor.rgb, u_maskPreviewColor.rgb, u_maskPreviewColor.a);
        featureColor.rgb = mix(featureColor.rgb, inputColor.rgb, (1.0 - maskColor.r));
        featureColor.a = inputColor.a;
    }
    float alp = featureColor.a + inputColor.a - featureColor.a * inputColor.a;
    featureColor.rgb = featureColor.rgb + (1.0 - featureColor.a) * inputColor.rgb;
    featureColor.a = alp;

    gl_FragColor = featureColor; 
}
