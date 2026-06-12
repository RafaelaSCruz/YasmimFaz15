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
    float4 _132 = baseTex.sample(baseTexSmplr, in.uv1);
    float4 _138 = _MainTex.sample(_MainTexSmplr, in.uv0);
    bool _145 = buffer.blendAlphaState == 2;
    float4 _420;
    float4 _426;
    if (_145)
    {
        bool _151 = buffer.fgAlphaState != buffer.blendAlphaState;
        bool _158;
        if (_151)
        {
            _158 = _138.w > 0.0;
        }
        else
        {
            _158 = _151;
        }
        float4 _423;
        if (_158)
        {
            float3 _166 = _138.xyz / float3(_138.w);
            float4 _369 = _138;
            _369.x = _166.x;
            float4 _371 = _369;
            _371.y = _166.y;
            float4 _373 = _371;
            _373.z = _166.z;
            _423 = _373;
        }
        else
        {
            _423 = _138;
        }
        bool _179 = buffer.bgAlphaState != buffer.blendAlphaState;
        bool _185;
        if (_179)
        {
            _185 = _132.w > 0.0;
        }
        else
        {
            _185 = _179;
        }
        float4 _427;
        if (_185)
        {
            float3 _193 = _132.xyz / float3(_132.w);
            float4 _377 = _132;
            _377.x = _193.x;
            float4 _379 = _377;
            _379.y = _193.y;
            float4 _381 = _379;
            _381.z = _193.z;
            _427 = _381;
        }
        else
        {
            _427 = _132;
        }
        _426 = _427;
        _420 = _423;
    }
    else
    {
        float4 _425;
        if ((buffer.fgAlphaState != 0) && (buffer.fgAlphaState != buffer.blendAlphaState))
        {
            float3 _214 = _138.xyz * _138.w;
            float4 _384 = _138;
            _384.x = _214.x;
            float4 _386 = _384;
            _386.y = _214.y;
            float4 _388 = _386;
            _388.z = _214.z;
            _425 = _388;
        }
        else
        {
            _425 = _138;
        }
        float4 _428;
        if ((buffer.bgAlphaState != 0) && (buffer.bgAlphaState != buffer.blendAlphaState))
        {
            float3 _233 = _132.xyz * _132.w;
            float4 _391 = _132;
            _391.x = _233.x;
            float4 _393 = _391;
            _393.y = _233.y;
            float4 _395 = _393;
            _395.z = _233.z;
            _428 = _395;
        }
        else
        {
            _428 = _132;
        }
        _426 = _428;
        _420 = _425;
    }
    if (_145)
    {
        float _247 = fast::min(buffer._alpha, 1.0);
        float _250 = _420.w * _247;
        float _283 = fma(-_250, _426.w, fma(_420.w, _247, _426.w));
        out.gl_FragColor = float4(((((_420.xyz * _250) * (1.0 - _426.w)) + ((_426.xyz * _426.w) * fma(-_420.w, _247, 1.0))) + ((_420.xyz * _426.xyz) * (_250 * _426.w))) / float3(fast::max(_283, 9.9999999747524270787835121154785e-07)), _283);
    }
    else
    {
        float4 _263 = _420 * fast::min(buffer._alpha, 1.0);
        float _331 = _263.w;
        float3 _342 = _263.xyz;
        out.gl_FragColor = float4(fma(_342, _426.xyz, (_342 * (1.0 - _426.w)) + (_426.xyz * (1.0 - _331))), fma(-_331, _426.w, _331 + _426.w));
    }
    return out;
}

