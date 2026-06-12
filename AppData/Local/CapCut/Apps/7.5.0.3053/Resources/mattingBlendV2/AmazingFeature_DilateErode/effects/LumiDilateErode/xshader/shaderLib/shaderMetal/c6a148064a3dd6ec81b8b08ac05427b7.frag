#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float4 u_ScreenParams;
    float normSize;
    float kernelSize;
    float channel;
};

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float2 v_uv [[user(locn0)]];
};

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> inputImageTexture0 [[texture(0)]], texture2d<float> inputImageTexture [[texture(1)]], sampler inputImageTexture0Smplr [[sampler(0)]], sampler inputImageTextureSmplr [[sampler(1)]])
{
    main0_out out = {};
    float _32 = abs(buffer.kernelSize);
    float2 _t1 = float2(_32 / 15.0) / ((buffer.u_ScreenParams.xy / float2(fast::min(buffer.u_ScreenParams.x, buffer.u_ScreenParams.y))) * buffer.normSize);
    float4 _48 = inputImageTexture0.sample(inputImageTexture0Smplr, in.v_uv);
    float4 _t2 = _48;
    float4 _t3 = inputImageTexture.sample(inputImageTextureSmplr, in.v_uv);
    float _t4 = _t3.x;
    float _t5 = _t3.y;
    float _t7 = _t3.z;
    for (float _t8 = 1.0; _t8 <= 15.0; _t8 += 1.0)
    {
        float4 _t9 = inputImageTexture.sample(inputImageTextureSmplr, (in.v_uv + float2(0.0, _t8 * _t1.y)));
        float _90 = _t9.x;
        float _94 = _t9.y;
        _t9 = inputImageTexture.sample(inputImageTextureSmplr, (in.v_uv + float2(0.0, (-_t8) * _t1.y)));
        _t4 = fast::max(fast::max(_t4, _90), _t9.x);
        _t5 = fast::min(fast::min(_t5, _94), _t9.y);
    }
    if (buffer.kernelSize >= 0.0)
    {
        _t7 = _t4;
    }
    else
    {
        _t7 = _t5;
    }
    if (buffer.kernelSize < 0.0)
    {
        _t7 = pow(fast::clamp(_t7 - ((_t4 - _t3.z) * (_32 / 5.0)), 0.0, 1.0), 1.0 + (_32 / 4.0));
    }
    if (buffer.channel < 0.5)
    {
        out.o_fragColor = float4(_48.xyz, 1.0) * _t7;
    }
    else
    {
        out.o_fragColor = float4(float3(_t7), 1.0) * _t2.w;
    }
    return out;
}

