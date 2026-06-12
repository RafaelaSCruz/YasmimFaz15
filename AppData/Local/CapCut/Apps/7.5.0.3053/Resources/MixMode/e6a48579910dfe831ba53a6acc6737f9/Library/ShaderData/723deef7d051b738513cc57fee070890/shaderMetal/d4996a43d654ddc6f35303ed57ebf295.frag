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
    float4 _266 = baseTex.sample(baseTexSmplr, in.uv1);
    float4 _272 = _MainTex.sample(_MainTexSmplr, in.uv0);
    bool _278 = buffer.blendAlphaState == 2;
    float4 _798;
    float4 _804;
    if (_278)
    {
        bool _284 = buffer.fgAlphaState != buffer.blendAlphaState;
        bool _291;
        if (_284)
        {
            _291 = _272.w > 0.0;
        }
        else
        {
            _291 = _284;
        }
        float4 _801;
        if (_291)
        {
            float3 _299 = _272.xyz / float3(_272.w);
            float4 _722 = _272;
            _722.x = _299.x;
            float4 _724 = _722;
            _724.y = _299.y;
            float4 _726 = _724;
            _726.z = _299.z;
            _801 = _726;
        }
        else
        {
            _801 = _272;
        }
        bool _309 = buffer.bgAlphaState != buffer.blendAlphaState;
        bool _315;
        if (_309)
        {
            _315 = _266.w > 0.0;
        }
        else
        {
            _315 = _309;
        }
        float4 _805;
        if (_315)
        {
            float3 _323 = _266.xyz / float3(_266.w);
            float4 _730 = _266;
            _730.x = _323.x;
            float4 _732 = _730;
            _732.y = _323.y;
            float4 _734 = _732;
            _734.z = _323.z;
            _805 = _734;
        }
        else
        {
            _805 = _266;
        }
        _804 = _805;
        _798 = _801;
    }
    else
    {
        float4 _803;
        if ((buffer.fgAlphaState != 0) && (buffer.fgAlphaState != buffer.blendAlphaState))
        {
            float3 _344 = _272.xyz * _272.w;
            float4 _737 = _272;
            _737.x = _344.x;
            float4 _739 = _737;
            _739.y = _344.y;
            float4 _741 = _739;
            _741.z = _344.z;
            _803 = _741;
        }
        else
        {
            _803 = _272;
        }
        float4 _806;
        if ((buffer.bgAlphaState != 0) && (buffer.bgAlphaState != buffer.blendAlphaState))
        {
            float3 _363 = _266.xyz * _266.w;
            float4 _744 = _266;
            _744.x = _363.x;
            float4 _746 = _744;
            _746.y = _363.y;
            float4 _748 = _746;
            _748.z = _363.z;
            _806 = _748;
        }
        else
        {
            _806 = _266;
        }
        _804 = _806;
        _798 = _803;
    }
    if (_278)
    {
        float _377 = fast::min(buffer._alpha, 1.0);
        float _380 = _798.w * _377;
        float _424 = fma(-_380, _804.w, fma(_798.w, _377, _804.w));
        float _810;
        if (_804.x < 0.5)
        {
            _810 = (2.0 * _804.x) * _798.x;
        }
        else
        {
            _810 = fma((1.0 - _804.x) * (-2.0), 1.0 - _798.x, 1.0);
        }
        float _811;
        if (_804.y < 0.5)
        {
            _811 = (2.0 * _804.y) * _798.y;
        }
        else
        {
            _811 = fma((1.0 - _804.y) * (-2.0), 1.0 - _798.y, 1.0);
        }
        float _812;
        if (_804.z < 0.5)
        {
            _812 = (2.0 * _804.z) * _798.z;
        }
        else
        {
            _812 = fma((1.0 - _804.z) * (-2.0), 1.0 - _798.z, 1.0);
        }
        out.gl_FragColor = float4(((((_798.xyz * _380) * (1.0 - _804.w)) + ((_804.xyz * _804.w) * fma(-_798.w, _377, 1.0))) + (float3(_810, _811, _812) * (_380 * _804.w))) / float3(fast::max(_424, 9.9999999747524270787835121154785e-07)), _424);
    }
    else
    {
        float4 _393 = _798 * fast::min(buffer._alpha, 1.0);
        float _545 = _393.w;
        float _813 = -_545;
        float _556 = _393.x;
        float _807;
        do
        {
            if ((2.0 * _804.x) < _804.w)
            {
                _807 = fma(2.0 * _556, _804.x, fma(_556, 1.0 - _804.w, _804.x * (1.0 - _545)));
                break;
            }
            _807 = fma(_813, _804.w, fma(_556 * (-2.0), _804.x, fma(_556, 1.0 + _804.w, _804.x * (1.0 + _545))));
            break;
        } while(false);
        float _565 = _393.y;
        float _808;
        do
        {
            if ((2.0 * _804.y) < _804.w)
            {
                _808 = fma(2.0 * _565, _804.y, fma(_565, 1.0 - _804.w, _804.y * (1.0 - _545)));
                break;
            }
            _808 = fma(_813, _804.w, fma(_565 * (-2.0), _804.y, fma(_565, 1.0 + _804.w, _804.y * (1.0 + _545))));
            break;
        } while(false);
        float _574 = _393.z;
        float _809;
        do
        {
            if ((2.0 * _804.z) < _804.w)
            {
                _809 = fma(2.0 * _574, _804.z, fma(_574, 1.0 - _804.w, _804.z * (1.0 - _545)));
                break;
            }
            _809 = fma(_813, _804.w, fma(_574 * (-2.0), _804.z, fma(_574, 1.0 + _804.w, _804.z * (1.0 + _545))));
            break;
        } while(false);
        out.gl_FragColor = float4(_807, _808, _809, fma(_813, _804.w, _545 + _804.w));
    }
    return out;
}

