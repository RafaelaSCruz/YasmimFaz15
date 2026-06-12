#pragma clang diagnostic ignored "-Wmissing-prototypes"
#pragma clang diagnostic ignored "-Wmissing-braces"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

template<typename T, size_t Num>
struct spvUnsafeArray
{
    T elements[Num ? Num : 1];
    
    thread T& operator [] (size_t pos) thread
    {
        return elements[pos];
    }
    constexpr const thread T& operator [] (size_t pos) const thread
    {
        return elements[pos];
    }
    
    device T& operator [] (size_t pos) device
    {
        return elements[pos];
    }
    constexpr const device T& operator [] (size_t pos) const device
    {
        return elements[pos];
    }
    
    constexpr const constant T& operator [] (size_t pos) const constant
    {
        return elements[pos];
    }
    
    threadgroup T& operator [] (size_t pos) threadgroup
    {
        return elements[pos];
    }
    constexpr const threadgroup T& operator [] (size_t pos) const threadgroup
    {
        return elements[pos];
    }
};

struct buffer_t
{
    float2 u_ScreenParams;
};

struct main0_out
{
    float2 uv [[user(locn0)]];
    float2 adj_uv_0 [[user(locn1)]];
    float2 adj_uv_1 [[user(locn2)]];
    float2 adj_uv_2 [[user(locn3)]];
    float2 adj_uv_3 [[user(locn4)]];
    float2 adj_uv_4 [[user(locn5)]];
    float2 adj_uv_5 [[user(locn6)]];
    float2 adj_uv_6 [[user(locn7)]];
    float2 adj_uv_7 [[user(locn8)]];
    float2 adj_uv_8 [[user(locn9)]];
    float2 adj_uv_9 [[user(locn10)]];
    float4 gl_Position [[position]];
};

struct main0_in
{
    float2 position [[attribute(0)]];
    float2 texcoord0 [[attribute(1)]];
};

vertex main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer)
{
    main0_out out = {};
    spvUnsafeArray<float2, 10> adj_uv = {};
    spvUnsafeArray<float2, 10> _t0;
    _t0[0] = float2(-0.008333000354468822479248046875, 0.014433999545872211456298828125);
    _t0[1] = float2(0.008333000354468822479248046875, 0.014433999545872211456298828125);
    _t0[2] = float2(-0.0058929999358952045440673828125, 0.0058929999358952045440673828125);
    _t0[3] = float2(0.0058929999358952045440673828125);
    _t0[4] = float2(-0.01666699908673763275146484375, 0.0);
    _t0[5] = float2(0.01666699908673763275146484375, 0.0);
    _t0[6] = float2(-0.0058929999358952045440673828125);
    _t0[7] = float2(0.0058929999358952045440673828125, -0.0058929999358952045440673828125);
    _t0[8] = float2(-0.008333000354468822479248046875, -0.014433999545872211456298828125);
    _t0[9] = float2(0.008333000354468822479248046875, -0.014433999545872211456298828125);
    out.gl_Position = sign(float4(in.position, 0.0, 1.0));
    float _76 = fast::min(buffer.u_ScreenParams.x, buffer.u_ScreenParams.y);
    float _81 = _76 / buffer.u_ScreenParams.x;
    float _86 = _76 / buffer.u_ScreenParams.y;
    for (int _t4 = 0; _t4 < 10; _t4++)
    {
        adj_uv[_t4] = in.texcoord0 + float2(_t0[_t4].x * _81, _t0[_t4].y * _86);
    }
    out.uv = in.texcoord0;
    out.adj_uv_0 = adj_uv[0];
    out.adj_uv_1 = adj_uv[1];
    out.adj_uv_2 = adj_uv[2];
    out.adj_uv_3 = adj_uv[3];
    out.adj_uv_4 = adj_uv[4];
    out.adj_uv_5 = adj_uv[5];
    out.adj_uv_6 = adj_uv[6];
    out.adj_uv_7 = adj_uv[7];
    out.adj_uv_8 = adj_uv[8];
    out.adj_uv_9 = adj_uv[9];
    out.gl_Position.z = (out.gl_Position.z + out.gl_Position.w) * 0.5;       // Adjust clip-space for Metal
    return out;
}

