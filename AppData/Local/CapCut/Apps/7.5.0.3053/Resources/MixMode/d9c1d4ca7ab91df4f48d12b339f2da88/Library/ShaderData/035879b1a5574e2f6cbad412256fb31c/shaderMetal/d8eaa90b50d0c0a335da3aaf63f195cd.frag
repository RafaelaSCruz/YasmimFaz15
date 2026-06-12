#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    int blendAlphaState;
    int fgAlphaState;
    int bgAlphaState;
    float _alpha;
};

struct main0_out
{
    float4 gl_FragColor [[color(0)]];
};

struct main0_in
{
    float2 uv0 [[user(uv0)]];
    float2 uv1 [[user(uv1)]];
};

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> baseTex [[texture(0)]], texture2d<float> _MainTex [[texture(1)]], sampler baseTexSmplr [[sampler(0)]], sampler _MainTexSmplr [[sampler(1)]])
{
    main0_out out = {};
    float4 _130 = baseTex.sample(baseTexSmplr, in.uv1);
    float4 _136 = _MainTex.sample(_MainTexSmplr, in.uv0);
    bool _143 = buffer.blendAlphaState == 2;
    float4 _414;
    float4 _420;
    if (_143)
    {
        bool _149 = buffer.fgAlphaState != buffer.blendAlphaState;
        bool _156;
        if (_149)
        {
            _156 = _136.w > 0.0;
        }
        else
        {
            _156 = _149;
        }
        float4 _417;
        if (_156)
        {
            float3 _164 = _136.xyz / float3(_136.w);
            float4 _365 = _136;
            _365.x = _164.x;
            float4 _367 = _365;
            _367.y = _164.y;
            float4 _369 = _367;
            _369.z = _164.z;
            _417 = _369;
        }
        else
        {
            _417 = _136;
        }
        bool _177 = buffer.bgAlphaState != buffer.blendAlphaState;
        bool _183;
        if (_177)
        {
            _183 = _130.w > 0.0;
        }
        else
        {
            _183 = _177;
        }
        float4 _421;
        if (_183)
        {
            float3 _191 = _130.xyz / float3(_130.w);
            float4 _373 = _130;
            _373.x = _191.x;
            float4 _375 = _373;
            _375.y = _191.y;
            float4 _377 = _375;
            _377.z = _191.z;
            _421 = _377;
        }
        else
        {
            _421 = _130;
        }
        _420 = _421;
        _414 = _417;
    }
    else
    {
        float4 _419;
        if ((buffer.fgAlphaState != 0) && (buffer.fgAlphaState != buffer.blendAlphaState))
        {
            float3 _212 = _136.xyz * _136.w;
            float4 _380 = _136;
            _380.x = _212.x;
            float4 _382 = _380;
            _382.y = _212.y;
            float4 _384 = _382;
            _384.z = _212.z;
            _419 = _384;
        }
        else
        {
            _419 = _136;
        }
        float4 _422;
        if ((buffer.bgAlphaState != 0) && (buffer.bgAlphaState != buffer.blendAlphaState))
        {
            float3 _231 = _130.xyz * _130.w;
            float4 _387 = _130;
            _387.x = _231.x;
            float4 _389 = _387;
            _389.y = _231.y;
            float4 _391 = _389;
            _391.z = _231.z;
            _422 = _391;
        }
        else
        {
            _422 = _130;
        }
        _420 = _422;
        _414 = _419;
    }
    if (_143)
    {
        float _245 = fast::min(buffer._alpha, 1.0);
        float _248 = _414.w * _245;
        float _281 = fma(-_248, _420.w, fma(_414.w, _245, _420.w));
        out.gl_FragColor = float4(((((_414.xyz * _248) * (1.0 - _420.w)) + ((_420.xyz * _420.w) * fma(-_414.w, _245, 1.0))) + (fma(-_414.xyz, _420.xyz, _414.xyz + _420.xyz) * (_248 * _420.w))) / float3(fast::max(_281, 9.9999999747524270787835121154785e-07)), _281);
    }
    else
    {
        float4 _261 = _414 * fast::min(buffer._alpha, 1.0);
        float _335 = _261.w;
        float3 _346 = _261.xyz;
        out.gl_FragColor = float4(fma(-_346, _420.xyz, _346 + _420.xyz), fma(-_335, _420.w, _335 + _420.w));
    }
    return out;
}

