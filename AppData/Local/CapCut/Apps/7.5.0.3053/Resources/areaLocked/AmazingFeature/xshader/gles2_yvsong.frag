precision highp float;

varying vec2 fTexCoord;
uniform sampler2D _MainTex;
void main() 
{
    float smoothRange = 0.005;
    float smoothMask = smoothstep(0., smoothRange, fTexCoord.x)*smoothstep(0., smoothRange, fTexCoord.y)
                    *(1.-smoothstep(1.-smoothRange, 1., fTexCoord.x))*(1.-smoothstep(1.-smoothRange, 1., fTexCoord.y));
    gl_FragColor = texture2D(_MainTex, fTexCoord)*smoothMask;
}
