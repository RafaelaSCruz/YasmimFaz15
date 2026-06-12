#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float channel;
    float4 u_ScreenParams;
    float normSize;
    float kernelSize;
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
    float2 _t2 = float2(abs(buffer.kernelSize) / 15.0) / ((buffer.u_ScreenParams.xy / float2(fast::min(buffer.u_ScreenParams.x, buffer.u_ScreenParams.y))) * buffer.normSize);
    float2 param = in.v_uv;
    float _136 = _f1(inputImageTexture, inputImageTextureSmplr, param, buffer.channel);
    float _t5 = _136;
    float _t6 = _136;
    for (float _t8 = 1.0; _t8 <= 15.0; _t8 += 1.0)
    {
        float2 param_1 = in.v_uv + float2(_t8 * _t2.x, 0.0);
        float _160 = _f1(inputImageTexture, inputImageTextureSmplr, param_1, buffer.channel);
        _t5 = fast::max(_t5, _160);
        _t6 = fast::min(_t6, _160);
        float2 param_2 = in.v_uv + float2((-_t8) * _t2.x, 0.0);
        float _176 = _f1(inputImageTexture, inputImageTextureSmplr, param_2, buffer.channel);
        _t5 = fast::max(_t5, _176);
        _t6 = fast::min(_t6, _176);
    }
    out.o_fragColor = float4(_t5, _t6, _136, 1.0);
    return out;
}

