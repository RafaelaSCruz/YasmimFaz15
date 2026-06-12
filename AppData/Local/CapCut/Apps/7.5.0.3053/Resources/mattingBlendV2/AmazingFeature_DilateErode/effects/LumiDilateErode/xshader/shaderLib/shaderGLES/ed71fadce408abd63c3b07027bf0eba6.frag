precision highp float;
precision highp int;

uniform float channel;
uniform float kernelSize;
uniform float radius;
uniform vec4 u_ScreenParams;
uniform float normSize;
uniform mediump sampler2D inputImageTexture;

varying vec2 v_uv;

mat2 _f2(float _p0)
{
    return mat2(vec2(cos(_p0), sin(_p0)), vec2(-sin(_p0), cos(_p0)));
}

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
    float param = 2.3999631404876708984375;
    mat2 _125 = _f2(param);
    float _t2 = 1.0;
    vec2 _t3 = vec2(0.0, abs(kernelSize / radius));
    vec2 _153 = vec2(1.0) / ((u_ScreenParams.xy / vec2(min(u_ScreenParams.x, u_ScreenParams.y))) * normSize);
    mediump vec4 _160 = texture2D(inputImageTexture, v_uv);
    vec4 _t6 = _160;
    vec2 param_1 = v_uv;
    float _164 = _f1(inputImageTexture, param_1);
    float _t7 = _164;
    float _t8 = _164;
    float _t9 = _164;
    for (float _t11 = 0.0; _t11 < 60.0; _t11 += 1.0)
    {
        float _180 = _t2;
        float _183 = _180 + (1.0 / _180);
        _t2 = _183;
        vec2 _185 = _t3;
        vec2 _186 = _125 * _185;
        _t3 = _186;
        vec2 param_2 = vec2(v_uv + ((_153 * (_183 - 1.0)) * _186));
        float _200 = _f1(inputImageTexture, param_2);
        _t8 = max(_t8, _200);
        _t9 = min(_t9, _200);
    }
    if (kernelSize >= 0.0)
    {
        _t7 = _t8;
    }
    else
    {
        _t7 = _t9;
    }
    if (kernelSize < 0.0)
    {
        float _227 = abs(kernelSize);
        _t7 = pow(clamp(_t7 - ((_t8 - _164) * (_227 / 5.0)), 0.0, 1.0), 1.0 + (_227 / 4.0));
    }
    if (channel < 0.5)
    {
        gl_FragData[0] = vec4(_160.xyz, 1.0) * _t7;
    }
    else
    {
        gl_FragData[0] = vec4(vec3(_t7), 1.0) * _t6.w;
    }
}

