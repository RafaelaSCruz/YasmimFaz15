// soft light

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

// #define SOFT_LIGHT(f, b)  (((f) < 0.5) ? (2.0 * (b) * (f) + (b) * (b) * (1.0 - 2.0 * (f))) :\
//                                          (sqrt(b) * (2.0 * (f) - 1.0) + 2.0 * (b) * (1.0 - (f))))

float SOFT_LIGHT(float f, float b) {
    if (f < 0.5) {
        return 2.0 * (b) * (f) + (b) * (b) * (1.0 - 2.0 * (f));
    }
    else {
        return sqrt(b) * (2.0 * (f) - 1.0) + 2.0 * (b) * (1.0 - (f));
    }
}

vec4 SoftLightBlendStraight(vec4 fg, vec4 bg)
{
    float alpha = fg.a + bg.a - fg.a * bg.a;
    vec3 color = vec3(SOFT_LIGHT(fg.r, bg.r), SOFT_LIGHT(fg.g, bg.g), SOFT_LIGHT(fg.b, bg.b));
    color = fg.rgb * fg.a * (1.0 - bg.a) + bg.rgb * bg.a * (1.0 - fg.a) + fg.a * bg.a * color;
    return vec4(color / max(alpha, Eps), alpha);
}

float SoftLightPreMul(float fc, float bc, float fa, float ba)
{
    float t = bc / max(ba, Eps);
    if (2.0 * fc <= fa) {
        return fc * (1.0 - ba) + bc * (1.0 - fa) + bc * (fa + (2.0 * fc - fa) * (1.0 - t));
    }
    return fc * (1.0 - ba) + bc * (1.0 + fa) + sqrt(t) * (2.0 * fc * ba - fa * ba) - 2.0 * fc * bc;
}

vec4 SoftLightBlendPreMul(vec4 fg, vec4 bg)
{
    float alpha = fg.a + bg.a - fg.a * bg.a;
    return vec4(SoftLightPreMul(fg.r, bg.r, fg.a, bg.a), SoftLightPreMul(fg.g, bg.g, fg.a, bg.a),
                SoftLightPreMul(fg.b, bg.b, fg.a, bg.a), alpha);
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
        gl_FragColor = SoftLightBlendStraight(fg, bg);
    } else { // pre multiply
        fg *= min(_alpha, 1.0);
        gl_FragColor = SoftLightBlendPreMul(fg, bg);
    }
}
