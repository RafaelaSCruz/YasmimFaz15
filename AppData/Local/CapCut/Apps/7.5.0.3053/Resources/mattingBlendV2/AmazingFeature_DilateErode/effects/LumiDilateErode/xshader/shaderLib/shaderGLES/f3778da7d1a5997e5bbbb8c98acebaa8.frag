precision highp float;
precision highp int;

uniform float channel;
uniform vec4 u_ScreenParams;
uniform float normSize;
uniform float kernelSize;
uniform mediump sampler2D inputImageTexture;

varying vec2 v_uv;

float _f0(vec2 _p0)
{
    return ((step(0.0, _p0.x) * step(0.0, _p0.y)) * step(_p0.x, 1.0)) * step(_p0.y, 1.0);
}

float _f1(mediump sampler2D _p0, vec2 _p1)
{
    if (channel < 0.5)
    {
        vec2 param = _p1;
        return texture2D(_p0, _p1).w * _f0(param);
    }
    else
    {
        if (channel < 1.5)
        {
            vec2 param_1 = _p1;
            vec4 _t0 = texture2D(_p0, _p1) * _f0(param_1);
            return ((0.2989999949932098388671875 * _t0.x) + (0.58700001239776611328125 * _t0.y)) + (0.114000000059604644775390625 * _t0.z);
        }
    }
    return texture2D(_p0, _p1).w;
}

void main()
{
    vec2 _t2 = vec2(abs(kernelSize) / 15.0) / ((u_ScreenParams.xy / vec2(min(u_ScreenParams.x, u_ScreenParams.y))) * normSize);
    vec2 param = v_uv;
    float _136 = _f1(inputImageTexture, param);
    float _t5 = _136;
    float _t6 = _136;
    for (float _t8 = 1.0; _t8 <= 15.0; _t8 += 1.0)
    {
        vec2 param_1 = v_uv + vec2(_t8 * _t2.x, 0.0);
        float _160 = _f1(inputImageTexture, param_1);
        _t5 = max(_t5, _160);
        _t6 = min(_t6, _160);
        vec2 param_2 = v_uv + vec2((-_t8) * _t2.x, 0.0);
        float _176 = _f1(inputImageTexture, param_2);
        _t5 = max(_t5, _176);
        _t6 = min(_t6, _176);
    }
    gl_FragData[0] = vec4(_t5, _t6, _136, 1.0);
}

