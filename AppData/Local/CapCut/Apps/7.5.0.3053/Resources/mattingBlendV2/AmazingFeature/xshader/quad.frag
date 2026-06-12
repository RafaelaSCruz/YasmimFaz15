precision lowp float;
varying highp vec2 uv0;
uniform sampler2D u_albedo;
uniform sampler2D u_mattingmask;
uniform float u_blendMode;
uniform vec4 u_previewColor;
void main()
{
    vec4 inputColor = texture2D(u_albedo, uv0);
    vec4 bgColor = mix(vec4(0),inputColor,u_blendMode);
    vec4 fColor = mix(inputColor,u_previewColor,u_previewColor.a);
    fColor = mix(inputColor,fColor,u_blendMode);
    fColor.a = inputColor.a;
    gl_FragColor = mix(bgColor,fColor,texture2D(u_mattingmask, uv0).r);
}
