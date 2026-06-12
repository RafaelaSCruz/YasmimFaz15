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
    float4 _137 = baseTex.sample(baseTexSmplr, in.uv1);
    float4 _143 = _MainTex.sample(_MainTexSmplr, in.uv0);
    bool _150 = buffer.blendAlphaState == 2;
    float4 _432;
    float4 _438;
    if (_150)
    {
        bool _156 = buffer.fgAlphaState != buffer.blendAlphaState;
        bool _163;
        if (_156)
        {
            _163 = _143.w > 0.0;
        }
        else
        {
            _163 = _156;
        }
        float4 _435;
        if (_163)
        {
            float3 _171 = _143.xyz / float3(_143.w);
            float4 _379 = _143;
            _379.x = _171.x;
            float4 _381 = _379;
            _381.y = _171.y;
            float4 _383 = _381;
            _383.z = _171.z;
            _435 = _383;
        }
        else
        {
            _435 = _143;
        }
        bool _184 = buffer.bgAlphaState != buffer.blendAlphaState;
        bool _190;
        if (_184)
        {
            _190 = _137.w > 0.0;
        }
        else
        {
            _190 = _184;
        }
        float4 _439;
        if (_190)
        {
            float3 _198 = _137.xyz / float3(_137.w);
            float4 _387 = _137;
            _387.x = _198.x;
            float4 _389 = _387;
            _389.y = _198.y;
            float4 _391 = _389;
            _391.z = _198.z;
            _439 = _391;
        }
        else
        {
            _439 = _137;
        }
        _438 = _439;
        _432 = _435;
    }
    else
    {
        float4 _437;
        if ((buffer.fgAlphaState != 0) && (buffer.fgAlphaState != buffer.blendAlphaState))
        {
            float3 _219 = _143.xyz * _143.w;
            float4 _394 = _143;
            _394.x = _219.x;
            float4 _396 = _394;
            _396.y = _219.y;
            float4 _398 = _396;
            _398.z = _219.z;
            _437 = _398;
        }
        else
        {
            _437 = _143;
        }
        float4 _440;
        if ((buffer.bgAlphaState != 0) && (buffer.bgAlphaState != buffer.blendAlphaState))
        {
            float3 _238 = _137.xyz * _137.w;
            float4 _401 = _137;
            _401.x = _238.x;
            float4 _403 = _401;
            _403.y = _238.y;
            float4 _405 = _403;
            _405.z = _238.z;
            _440 = _405;
        }
        else
        {
            _440 = _137;
        }
        _438 = _440;
        _432 = _437;
    }
    if (_150)
    {
        float _252 = fast::min(buffer._alpha, 1.0);
        float _255 = _432.w * _252;
        float _288 = fma(-_255, _438.w, fma(_432.w, _252, _438.w));
        out.gl_FragColor = float4(((((_432.xyz * _255) * (1.0 - _438.w)) + ((_438.xyz * _438.w) * fma(-_432.w, _252, 1.0))) + (fast::min(_432.xyz, _438.xyz) * (_255 * _438.w))) / float3(fast::max(_288, 9.9999999747524270787835121154785e-07)), _288);
    }
    else
    {
        float4 _268 = _432 * fast::min(buffer._alpha, 1.0);
        float _335 = _268.w;
        float3 _346 = _268.xyz;
        out.gl_FragColor = float4(((_346 * (1.0 - _438.w)) + (_438.xyz * (1.0 - _335))) + fast::min(_346 * _438.w, _438.xyz * _335), fma(-_335, _438.w, _335 + _438.w));
    }
    return out;
}

