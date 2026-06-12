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
    float4 _152 = baseTex.sample(baseTexSmplr, in.uv1);
    float4 _158 = _MainTex.sample(_MainTexSmplr, in.uv0);
    bool _165 = buffer.blendAlphaState == 2;
    float4 _462;
    float4 _468;
    if (_165)
    {
        bool _171 = buffer.fgAlphaState != buffer.blendAlphaState;
        bool _177;
        if (_171)
        {
            _177 = _158.w > 0.0;
        }
        else
        {
            _177 = _171;
        }
        float4 _465;
        if (_177)
        {
            float3 _185 = _158.xyz / float3(_158.w);
            float4 _407 = _158;
            _407.x = _185.x;
            float4 _409 = _407;
            _409.y = _185.y;
            float4 _411 = _409;
            _411.z = _185.z;
            _465 = _411;
        }
        else
        {
            _465 = _158;
        }
        bool _198 = buffer.bgAlphaState != buffer.blendAlphaState;
        bool _204;
        if (_198)
        {
            _204 = _152.w > 0.0;
        }
        else
        {
            _204 = _198;
        }
        float4 _469;
        if (_204)
        {
            float3 _212 = _152.xyz / float3(_152.w);
            float4 _415 = _152;
            _415.x = _212.x;
            float4 _417 = _415;
            _417.y = _212.y;
            float4 _419 = _417;
            _419.z = _212.z;
            _469 = _419;
        }
        else
        {
            _469 = _152;
        }
        _468 = _469;
        _462 = _465;
    }
    else
    {
        float4 _467;
        if ((buffer.fgAlphaState != 0) && (buffer.fgAlphaState != buffer.blendAlphaState))
        {
            float3 _233 = _158.xyz * _158.w;
            float4 _422 = _158;
            _422.x = _233.x;
            float4 _424 = _422;
            _424.y = _233.y;
            float4 _426 = _424;
            _426.z = _233.z;
            _467 = _426;
        }
        else
        {
            _467 = _158;
        }
        float4 _470;
        if ((buffer.bgAlphaState != 0) && (buffer.bgAlphaState != buffer.blendAlphaState))
        {
            float3 _252 = _152.xyz * _152.w;
            float4 _429 = _152;
            _429.x = _252.x;
            float4 _431 = _429;
            _431.y = _252.y;
            float4 _433 = _431;
            _433.z = _252.z;
            _470 = _433;
        }
        else
        {
            _470 = _152;
        }
        _468 = _470;
        _462 = _467;
    }
    if (_165)
    {
        float _266 = fast::min(buffer._alpha, 1.0);
        float _269 = _462.w * _266;
        float _302 = fma(-_269, _468.w, fma(_462.w, _266, _468.w));
        out.gl_FragColor = float4(((((_462.xyz * _269) * (1.0 - _468.w)) + ((_468.xyz * _468.w) * fma(-_462.w, _266, 1.0))) + (fast::max((_462.xyz + _468.xyz) - float3(1.0), float3(0.0)) * (_269 * _468.w))) / float3(fast::max(_302, 9.9999999747524270787835121154785e-07)), _302);
    }
    else
    {
        float4 _282 = _462 * fast::min(buffer._alpha, 1.0);
        float _354 = _282.w;
        float3 _365 = _282.xyz;
        out.gl_FragColor = float4(((_365 * (1.0 - _468.w)) + (_468.xyz * (1.0 - _354))) + fast::max(((_365 * _468.w) + (_468.xyz * _354)) - float3(_354 * _468.w), float3(0.0)), fma(-_354, _468.w, _354 + _468.w));
    }
    return out;
}

