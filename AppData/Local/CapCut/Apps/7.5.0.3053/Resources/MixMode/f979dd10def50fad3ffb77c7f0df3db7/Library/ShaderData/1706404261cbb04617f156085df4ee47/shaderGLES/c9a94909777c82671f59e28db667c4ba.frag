// color dodge, normal

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

vec4 NormalBlendStraight(vec4 fg, vec4 bg)
{
    float alpha = fg.a + bg.a - fg.a * bg.a;
    vec3 color = fg.rgb * fg.a * (1.0 - bg.a) + bg.rgb * bg.a * (1.0 - fg.a) + fg.a * bg.a * fg.rgb;
    return vec4(color / max(alpha, Eps), alpha);
}

vec4 NormalBlendPreMul(vec4 fg, vec4 bg)
{
    float alpha = fg.a + bg.a - fg.a * bg.a;
    return vec4(fg.rgb + bg.rgb * (1.0 - fg.a), alpha);
}

#define COLOR_DODGE(f, b) (((f) == 1.0) ? (f) : min((b) / (1.0 - (f)), 1.0))

vec4 ColorDodgeBlendStraight(vec4 fg, vec4 bg)
{
    float alpha = fg.a + bg.a - fg.a * bg.a;
    vec3 color = vec3(COLOR_DODGE(fg.r, bg.r), COLOR_DODGE(fg.g, bg.g), COLOR_DODGE(fg.b, bg.b));
    color = fg.rgb * fg.a * (1.0 - bg.a) + bg.rgb * bg.a * (1.0 - fg.a) + fg.a * bg.a * color;
    return vec4(color / max(alpha, Eps), alpha);
}

float ColorDodgePreMul(float fc, float bc, float fa, float ba)
{
    if (fc == fa && bc == 0.0) {
        return fc * (1.0 - ba) + fa * ba;
    } else if (fc == fa) {
        return fc * (1.0 - ba) + bc * (1.0 - fa) + fa * ba;
    }
    float t = max(ba * (fa - fc), Eps);
    return fc * (1.0 - ba) + bc * (1.0 - fa) + fa * ba * min(1.0, bc * fa / t);
}

vec4 ColorDodgeBlendPreMul(vec4 fg, vec4 bg)
{
    float alpha = fg.a + bg.a - fg.a * bg.a;
    return vec4(ColorDodgePreMul(fg.r, bg.r, fg.a, bg.a), ColorDodgePreMul(fg.g, bg.g, fg.a, bg.a),
                ColorDodgePreMul(fg.b, bg.b, fg.a, bg.a), alpha);
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
        gl_FragColor = ColorDodgeBlendStraight(fg, bg);
    } else { // pre multiply
        fg *= min(_alpha, 1.0);
        gl_FragColor = ColorDodgeBlendPreMul(fg, bg);
    }
}
