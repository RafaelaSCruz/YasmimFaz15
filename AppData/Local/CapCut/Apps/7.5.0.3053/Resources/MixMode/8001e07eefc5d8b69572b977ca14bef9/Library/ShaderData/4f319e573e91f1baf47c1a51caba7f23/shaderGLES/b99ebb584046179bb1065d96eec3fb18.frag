// multiply

precision mediump float;

uniform sampler2D _MainTex;
uniform sampler2D baseTex;
uniform float _alpha;
uniform int blendAlphaState; // 1: pre-multiplied, 2: straight
uniform int fgAlphaState;
uniform int bgAlphaState;

varying vec2 uv0;
varying vec2 uv1;

const float Eps = 1e-6;

vec4 MultiplyBlendStraight(vec4 fg, vec4 bg)
{
    float alpha = fg.a + bg.a - fg.a * bg.a;
    vec3 color = fg.rgb * bg.rgb;
    color = fg.rgb * fg.a * (1.0 - bg.a) + bg.rgb * bg.a * (1.0 - fg.a) + fg.a * bg.a * color;
    return vec4(color / max(alpha, Eps), alpha);
}

vec4 MultiplyBlendPreMul(vec4 fg, vec4 bg)
{
    float alpha = fg.a + bg.a - fg.a * bg.a;
    vec3 color = fg.rgb * (1.0 - bg.a) + bg.rgb * (1.0 - fg.a) + fg.rgb * bg.rgb;
    return vec4(color, alpha);
}

void main (void) {
    vec4 bg = texture2D(baseTex, uv1);
    vec4 fg = texture2D(_MainTex, uv0);

    if (blendAlphaState == 2) { // straight
        if (fgAlphaState != blendAlphaState && fg.a > 0.0) {
            fg.rgb /= fg.a;
        }
        if (bgAlphaState != blendAlphaState && bg.a > 0.0) {
            bg.rgb /= bg.a;
        }
    } else {
        if (fgAlphaState != 0 && fgAlphaState != blendAlphaState) {
            fg.rgb *= fg.a;
        }
        if (bgAlphaState != 0 && bgAlphaState != blendAlphaState) {
            bg.rgb *= bg.a;
        }
    }

    if (blendAlphaState == 2) { // straight alpha
        fg.a *= min(_alpha, 1.0);
        gl_FragColor = MultiplyBlendStraight(fg, bg);
    } else { // pre multiply
        fg *= min(_alpha, 1.0);
        gl_FragColor = MultiplyBlendPreMul(fg, bg);
    }
}
