#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float inputEdgeSmooth;
    float widthOffset;
};

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float2 uv0 [[user(locn0)]];
};

static inline __attribute__((always_inline))
float _f0(thread const float& _p0, thread const float& _p1)
{
    return (0.3989399969577789306640625 * exp((((-0.5) * _p0) * _p0) / (_p1 * _p1))) / _p1;
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> alphaMapTexture [[texture(0)]], sampler alphaMapTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    float4 _40 = alphaMapTexture.sample(alphaMapTextureSmplr, in.uv0);
    if (buffer.inputEdgeSmooth < 0.001000000047497451305389404296875)
    {
        out.o_fragColor = float4(_40.xxx, 1.0);
    }
    else
    {
        float _t1 = 0.0;
        float _t6 = 0.0;
        for (int _t8 = 42; _t8 >= 0; _t8--)
        {
            float2 _110 = float2(buffer.widthOffset * float(_t8 - 21), 0.0);
            float2 _t10 = in.uv0 + ((_110 * 2.0) * buffer.inputEdgeSmooth);
            if (buffer.inputEdgeSmooth < 0.20000000298023223876953125)
            {
                if ((_t8 > 23) || (_t8 < 19))
                {
                    continue;
                }
                _t10 = in.uv0 + ((_110 * 8.0) * buffer.inputEdgeSmooth);
            }
            float2 _141 = _t10;
            float2 _144 = fast::clamp(_141, float2(0.0), float2(1.0));
            _t10 = _144;
            float param = (abs(float(_t8 - 21)) / 21.0) * 15.0;
            float param_1 = 4.0;
            float _165 = _f0(param, param_1);
            _t1 += (pow(alphaMapTexture.sample(alphaMapTextureSmplr, _144).x, 1.39999997615814208984375) * _165);
            _t6 += _165;
        }
        float _178 = _t1;
        float _185 = pow(fast::clamp(_178 / _t6, 0.0, 1.0), 0.71428573131561279296875);
        _t1 = _185;
        out.o_fragColor = float4(_185, 0.0, 0.0, 1.0);
    }
    return out;
}

