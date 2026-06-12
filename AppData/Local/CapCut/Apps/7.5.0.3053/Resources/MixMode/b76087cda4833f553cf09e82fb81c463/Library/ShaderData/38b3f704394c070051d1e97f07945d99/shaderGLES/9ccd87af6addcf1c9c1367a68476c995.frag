// color burn

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

#define COLOR_BURN(f, b)  (((f) == 0.0) ? (f) : max((1.0 - ((1.0 - (b)) / (f))), 0.0))

vec4 ColorBurnBlendStraight(vec4 fg, vec4 bg)
{
    float alpha = fg.a + bg.a - fg.a * bg.a;
    vec3 color = vec3(COLOR_BURN(fg.r, bg.r), COLOR_BURN(fg.g, bg.g), COLOR_BURN(fg.b, bg.b));
    color = fg.rgb * fg.a * (1.0 - bg.a) + bg.rgb * bg.a * (1.0 - fg.a) + fg.a * bg.a * color;
    return vec4(color / max(alpha, Eps), alpha);
}

float ColorBurn(float fc, float bc, float fa, float ba)
{
    if (fc == 0.0 && bc == ba) {
        return bc * (1.0 - fa) + fa * ba;
    } else if (fc == 0.0) {
        return bc * (1.0 - fa);
    }
    float t = max(fc * ba, Eps);
    return fc * (1.0 - ba) + bc * (1.0 - fa) + fa * ba * (1.0 - min(1.0, (ba - bc) * fa / t));
}

vec4 ColorBurnBlendPreMul(vec4 fg, vec4 bg)
{
    float alpha = fg.a + bg.a - fg.a * bg.a;
    return vec4(ColorBurn(fg.r, bg.r, fg.a, bg.a), ColorBurn(fg.g, bg.g, fg.a, bg.a),
                ColorBurn(fg.b, bg.b, fg.a, bg.a), alpha);
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
        gl_FragColor = ColorBurnBlendStraight(fg, bg);
    } else { // pre multiply
        fg *= min(_alpha, 1.0);
        gl_FragColor = ColorBurnBlendPreMul(fg, bg);
    }
}
