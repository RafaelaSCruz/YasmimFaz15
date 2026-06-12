#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float channel;
    float kernelSize;
    float radius;
    float4 u_ScreenParams;
    float normSize;
};

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float2 v_uv [[user(locn0)]];
};

static inline __attribute__((always_inline))
float2x2 _f2(thread const float& _p0)
{
    return float2x2(float2(cos(_p0), sin(_p0)), float2(-sin(_p0), cos(_p0)));
}

static inline __attribute__((always_inline))
float _f0(thread const float2& _p0)
{
    return ((step(0.0, _p0.x) * step(0.0, _p0.y)) * step(_p0.x, 1.0)) * step(_p0.y, 1.0);
}

static inline __attribute__((always_inline))
float _f1(texture2d<float> _p0, sampler _p0Smplr, thread const float2& _p1, constant float& channel)
{
    if (channel < 0.5)
    {
        float2 param = _p1;
        return _p0.sample(_p0Smplr, _p1).w * _f0(param);
    }
    else
    {
        if (channel < 1.5)
        {
            float2 param_1 = _p1;
            float4 _t0 = _p0.sample(_p0Smplr, _p1) * _f0(param_1);
            return ((0.2989999949932098388671875 * _t0.x) + (0.58700001239776611328125 * _t0.y)) + (0.114000000059604644775390625 * _t0.z);
        }
    }
    return _p0.sample(_p0Smplr, _p1).w;
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> inputImageTexture [[texture(0)]], sampler inputImageTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    float param = 2.3999631404876708984375;
    float2x2 _125 = _f2(param);
    float _t2 = 1.0;
    float2 _t3 = float2(0.0, abs(buffer.kernelSize / buffer.radius));
    float2 _153 = float2(1.0) / ((buffer.u_ScreenParams.xy / float2(fast::min(buffer.u_ScreenParams.x, buffer.u_ScreenParams.y))) * buffer.normSize);
    float4 _160 = inputImageTexture.sample(inputImageTextureSmplr, in.v_uv);
    float4 _t6 = _160;
    float2 param_1 = in.v_uv;
    float _164 = _f1(inputImageTexture, inputImageTextureSmplr, param_1, buffer.channel);
    float _t7 = _164;
    float _t8 = _164;
    float _t9 = _164;
    for (float _t11 = 0.0; _t11 < 60.0; _t11 += 1.0)
    {
        float _180 = _t2;
        float _183 = _180 + (1.0 / _180);
        _t2 = _183;
        float2 _185 = _t3;
        float2 _186 = _125 * _185;
        _t3 = _186;
        float2 param_2 = float2(in.v_uv + ((_153 * (_183 - 1.0)) * _186));
        float _200 = _f1(inputImageTexture, inputImageTextureSmplr, param_2, buffer.channel);
        _t8 = fast::max(_t8, _200);
        _t9 = fast::min(_t9, _200);
    }
    if (buffer.kernelSize >= 0.0)
    {
        _t7 = _t8;
    }
    else
    {
        _t7 = _t9;
    }
    if (buffer.kernelSize < 0.0)
    {
        float _227 = abs(buffer.kernelSize);
        _t7 = pow(fast::clamp(_t7 - ((_t8 - _164) * (_227 / 5.0)), 0.0, 1.0), 1.0 + (_227 / 4.0));
    }
    if (buffer.channel < 0.5)
    {
        out.o_fragColor = float4(_160.xyz, 1.0) * _t7;
    }
    else
    {
        out.o_fragColor = float4(float3(_t7), 1.0) * _t6.w;
    }
    return out;
}

