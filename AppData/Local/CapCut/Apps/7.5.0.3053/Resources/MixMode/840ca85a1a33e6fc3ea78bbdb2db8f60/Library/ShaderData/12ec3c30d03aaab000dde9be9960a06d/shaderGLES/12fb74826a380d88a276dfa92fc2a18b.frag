// hard light

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

#define HARD_LIGHT(f, b)  ((f) < 0.5 ? (2.0 * (f) * (b)) : (1.0 - 2.0 * (1.0 - (f)) * (1.0 - (b))))

vec4 HardLightBlendStraight(vec4 fg, vec4 bg)
{
    float alpha = fg.a + bg.a - fg.a * bg.a;
    vec3 color = vec3(HARD_LIGHT(fg.r, bg.r), HARD_LIGHT(fg.g, bg.g), HARD_LIGHT(fg.b, bg.b));
    color = fg.rgb * fg.a * (1.0 - bg.a) + bg.rgb * bg.a * (1.0 - fg.a) + fg.a * bg.a * color;
    return vec4(color / max(alpha, Eps), alpha);
}

float HardLightPreMul(float fc, float bc, float fa, float ba)
{
    if (2.0 * fc < fa) {
        return fc * (1.0 - ba) + bc * (1.0 - fa) + 2.0 * fc * bc;
    }
    return fc * (1.0 + ba) + bc * (1.0 + fa) - 2.0 * fc * bc - fa * ba;
}

vec4 HardLightBlendPreMul(vec4 fg, vec4 bg)
{
    float alpha = fg.a + bg.a - fg.a * bg.a;
    return vec4(HardLightPreMul(fg.r, bg.r, fg.a, bg.a), HardLightPreMul(fg.g, bg.g, fg.a, bg.a),
                HardLightPreMul(fg.b, bg.b, fg.a, bg.a), alpha);
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
        gl_FragColor = HardLightBlendStraight(fg, bg);
    } else { // pre multiply
        fg *= min(_alpha, 1.0);
        gl_FragColor = HardLightBlendPreMul(fg, bg);
    }
}
