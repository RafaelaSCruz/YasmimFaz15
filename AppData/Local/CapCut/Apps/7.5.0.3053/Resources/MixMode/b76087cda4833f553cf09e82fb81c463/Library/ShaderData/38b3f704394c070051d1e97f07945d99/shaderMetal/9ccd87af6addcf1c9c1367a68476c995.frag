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
    float4 _824;
    float4 _830;
    if (_278)
    {
        bool _284 = buffer.fgAlphaState != buffer.blendAlphaState;
        bool _290;
        if (_284)
        {
            _290 = _272.w > 0.0;
        }
        else
        {
            _290 = _284;
        }
        float4 _827;
        if (_290)
        {
            float3 _298 = _272.xyz / float3(_272.w);
            float4 _751 = _272;
            _751.x = _298.x;
            float4 _753 = _751;
            _753.y = _298.y;
            float4 _755 = _753;
            _755.z = _298.z;
            _827 = _755;
        }
        else
        {
            _827 = _272;
        }
        bool _308 = buffer.bgAlphaState != buffer.blendAlphaState;
        bool _314;
        if (_308)
        {
            _314 = _266.w > 0.0;
        }
        else
        {
            _314 = _308;
        }
        float4 _831;
        if (_314)
        {
            float3 _322 = _266.xyz / float3(_266.w);
            float4 _759 = _266;
            _759.x = _322.x;
            float4 _761 = _759;
            _761.y = _322.y;
            float4 _763 = _761;
            _763.z = _322.z;
            _831 = _763;
        }
        else
        {
            _831 = _266;
        }
        _830 = _831;
        _824 = _827;
    }
    else
    {
        float4 _829;
        if ((buffer.fgAlphaState != 0) && (buffer.fgAlphaState != buffer.blendAlphaState))
        {
            float3 _343 = _272.xyz * _272.w;
            float4 _766 = _272;
            _766.x = _343.x;
            float4 _768 = _766;
            _768.y = _343.y;
            float4 _770 = _768;
            _770.z = _343.z;
            _829 = _770;
        }
        else
        {
            _829 = _272;
        }
        float4 _832;
        if ((buffer.bgAlphaState != 0) && (buffer.bgAlphaState != buffer.blendAlphaState))
        {
            float3 _362 = _266.xyz * _266.w;
            float4 _773 = _266;
            _773.x = _362.x;
            float4 _775 = _773;
            _775.y = _362.y;
            float4 _777 = _775;
            _777.z = _362.z;
            _832 = _777;
        }
        else
        {
            _832 = _266;
        }
        _830 = _832;
        _824 = _829;
    }
    if (_278)
    {
        float _376 = fast::min(buffer._alpha, 1.0);
        float _379 = _824.w * _376;
        float _423 = fma(-_379, _830.w, fma(_824.w, _376, _830.w));
        float _836;
        if (_824.x == 0.0)
        {
            _836 = _824.x;
        }
        else
        {
            _836 = fast::max(1.0 - ((1.0 - _830.x) / _824.x), 0.0);
        }
        float _837;
        if (_824.y == 0.0)
        {
            _837 = _824.y;
        }
        else
        {
            _837 = fast::max(1.0 - ((1.0 - _830.y) / _824.y), 0.0);
        }
        float _838;
        if (_824.z == 0.0)
        {
            _838 = _824.z;
        }
        else
        {
            _838 = fast::max(1.0 - ((1.0 - _830.z) / _824.z), 0.0);
        }
        out.gl_FragColor = float4(((((_824.xyz * _379) * (1.0 - _830.w)) + ((_830.xyz * _830.w) * fma(-_824.w, _376, 1.0))) + (float3(_836, _837, _838) * (_379 * _830.w))) / float3(fast::max(_423, 9.9999999747524270787835121154785e-07)), _423);
    }
    else
    {
        float4 _392 = _824 * fast::min(buffer._alpha, 1.0);
        float _529 = _392.w;
        float _537 = _529 * _830.w;
        float _540 = _392.x;
        float _833;
        do
        {
            bool _575 = _540 == 0.0;
            if (_575 && (_830.x == _830.w))
            {
                _833 = fma(_830.x, 1.0 - _529, _537);
                break;
            }
            else
            {
                if (_575)
                {
                    _833 = _830.x * (1.0 - _529);
                    break;
                }
            }
            _833 = fma(_537, 1.0 - fast::min(1.0, ((_830.w - _830.x) * _529) / fast::max(_540 * _830.w, 9.9999999747524270787835121154785e-07)), fma(_540, 1.0 - _830.w, _830.x * (1.0 - _529)));
            break;
        } while(false);
        float _549 = _392.y;
        float _834;
        do
        {
            bool _635 = _549 == 0.0;
            if (_635 && (_830.y == _830.w))
            {
                _834 = fma(_830.y, 1.0 - _529, _537);
                break;
            }
            else
            {
                if (_635)
                {
                    _834 = _830.y * (1.0 - _529);
                    break;
                }
            }
            _834 = fma(_537, 1.0 - fast::min(1.0, ((_830.w - _830.y) * _529) / fast::max(_549 * _830.w, 9.9999999747524270787835121154785e-07)), fma(_549, 1.0 - _830.w, _830.y * (1.0 - _529)));
            break;
        } while(false);
        float _558 = _392.z;
        float _835;
        do
        {
            bool _695 = _558 == 0.0;
            if (_695 && (_830.z == _830.w))
            {
                _835 = fma(_830.z, 1.0 - _529, _537);
                break;
            }
            else
            {
                if (_695)
                {
                    _835 = _830.z * (1.0 - _529);
                    break;
                }
            }
            _835 = fma(_537, 1.0 - fast::min(1.0, ((_830.w - _830.z) * _529) / fast::max(_558 * _830.w, 9.9999999747524270787835121154785e-07)), fma(_558, 1.0 - _830.w, _830.z * (1.0 - _529)));
            break;
        } while(false);
        out.gl_FragColor = float4(_833, _834, _835, fma(-_529, _830.w, _529 + _830.w));
    }
    return out;
}

