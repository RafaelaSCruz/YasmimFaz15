precision highp float;
varying highp vec2 uv0;
uniform sampler2D inputImageTexture;
uniform sampler2D waterMarkTexture;
uniform float ratioX;
uniform float ratioY;
uniform float factor;

void main()
{
    vec2 waterUV = vec2(uv0.x * ratioX * factor, 0.0 - uv0.y * ratioY * factor);
    vec4 waterMarkColor = texture2D(waterMarkTexture,waterUV);

    vec4 inputColor = texture2D(inputImageTexture, uv0);
    vec3 outputColor = inputColor.rgb * (1.0 - waterMarkColor.a) + waterMarkColor.rgb;
    // float outputAlpha = inputColor.a * (1.0 - waterMarkColor.a) + waterMarkColor.a;
    gl_FragColor = vec4(outputColor, inputColor.a);
}
