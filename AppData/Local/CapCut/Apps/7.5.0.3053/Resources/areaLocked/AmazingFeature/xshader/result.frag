precision highp float;

varying vec2 uv;
uniform sampler2D inputImageTexture;
uniform float u_alpha;
uniform vec4 u_ScreenParams;

void main()
{
    vec4 inputCol = texture2D(inputImageTexture,uv);
    gl_FragColor = inputCol*u_alpha;
}
