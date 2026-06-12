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
    float4 _138 = baseTex.sample(baseTexSmplr, in.uv1);
    float4 _144 = _MainTex.sample(_MainTexSmplr, in.uv0);
    bool _151 = buffer.blendAlphaState == 2;
    float4 _434;
    float4 _440;
    if (_151)
    {
        bool _157 = buffer.fgAlphaState != buffer.blendAlphaState;
        bool _164;
        if (_157)
        {
            _164 = _144.w > 0.0;
        }
        else
        {
            _164 = _157;
        }
        float4 _437;
        if (_164)
        {
            float3 _172 = _144.xyz / float3(_144.w);
            float4 _381 = _144;
            _381.x = _172.x;
            float4 _383 = _381;
            _383.y = _172.y;
            float4 _385 = _383;
            _385.z = _172.z;
            _437 = _385;
        }
        else
        {
            _437 = _144;
        }
        bool _185 = buffer.bgAlphaState != buffer.blendAlphaState;
        bool _191;
        if (_185)
        {
            _191 = _138.w > 0.0;
        }
        else
        {
            _191 = _185;
        }
        float4 _441;
        if (_191)
        {
            float3 _199 = _138.xyz / float3(_138.w);
            float4 _389 = _138;
            _389.x = _199.x;
            float4 _391 = _389;
            _391.y = _199.y;
            float4 _393 = _391;
            _393.z = _199.z;
            _441 = _393;
        }
        else
        {
            _441 = _138;
        }
        _440 = _441;
        _434 = _437;
    }
    else
    {
        float4 _439;
        if ((buffer.fgAlphaState != 0) && (buffer.fgAlphaState != buffer.blendAlphaState))
        {
            float3 _220 = _144.xyz * _144.w;
            float4 _396 = _144;
            _396.x = _220.x;
            float4 _398 = _396;
            _398.y = _220.y;
            float4 _400 = _398;
            _400.z = _220.z;
            _439 = _400;
        }
        else
        {
            _439 = _144;
        }
        float4 _442;
        if ((buffer.bgAlphaState != 0) && (buffer.bgAlphaState != buffer.blendAlphaState))
        {
            float3 _239 = _138.xyz * _138.w;
            float4 _403 = _138;
            _403.x = _239.x;
            float4 _405 = _403;
            _405.y = _239.y;
            float4 _407 = _405;
            _407.z = _239.z;
            _442 = _407;
        }
        else
        {
            _442 = _138;
        }
        _440 = _442;
        _434 = _439;
    }
    if (_151)
    {
        float _253 = fast::min(buffer._alpha, 1.0);
        float _256 = _434.w * _253;
        float _289 = fma(-_256, _440.w, fma(_434.w, _253, _440.w));
        out.gl_FragColor = float4(((((_434.xyz * _256) * (1.0 - _440.w)) + ((_440.xyz * _440.w) * fma(-_434.w, _253, 1.0))) + (fast::max(_434.xyz, _440.xyz) * (_256 * _440.w))) / float3(fast::max(_289, 9.9999999747524270787835121154785e-07)), _289);
    }
    else
    {
        float4 _269 = _434 * fast::min(buffer._alpha, 1.0);
        float _337 = _269.w;
        float3 _348 = _269.xyz;
        out.gl_FragColor = float4(((_348 * (1.0 - _440.w)) + (_440.xyz * (1.0 - _337))) + fast::max(_348 * _440.w, _440.xyz * _337), fma(-_337, _440.w, _337 + _440.w));
    }
    return out;
}

