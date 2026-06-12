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
    float4 _272 = baseTex.sample(baseTexSmplr, in.uv1);
    float4 _278 = _MainTex.sample(_MainTexSmplr, in.uv0);
    bool _284 = buffer.blendAlphaState == 2;
    float4 _854;
    float4 _860;
    if (_284)
    {
        bool _290 = buffer.fgAlphaState != buffer.blendAlphaState;
        bool _296;
        if (_290)
        {
            _296 = _278.w > 0.0;
        }
        else
        {
            _296 = _290;
        }
        float4 _857;
        if (_296)
        {
            float3 _304 = _278.xyz / float3(_278.w);
            float4 _781 = _278;
            _781.x = _304.x;
            float4 _783 = _781;
            _783.y = _304.y;
            float4 _785 = _783;
            _785.z = _304.z;
            _857 = _785;
        }
        else
        {
            _857 = _278;
        }
        bool _314 = buffer.bgAlphaState != buffer.blendAlphaState;
        bool _320;
        if (_314)
        {
            _320 = _272.w > 0.0;
        }
        else
        {
            _320 = _314;
        }
        float4 _861;
        if (_320)
        {
            float3 _328 = _272.xyz / float3(_272.w);
            float4 _789 = _272;
            _789.x = _328.x;
            float4 _791 = _789;
            _791.y = _328.y;
            float4 _793 = _791;
            _793.z = _328.z;
            _861 = _793;
        }
        else
        {
            _861 = _272;
        }
        _860 = _861;
        _854 = _857;
    }
    else
    {
        float4 _859;
        if ((buffer.fgAlphaState != 0) && (buffer.fgAlphaState != buffer.blendAlphaState))
        {
            float3 _349 = _278.xyz * _278.w;
            float4 _796 = _278;
            _796.x = _349.x;
            float4 _798 = _796;
            _798.y = _349.y;
            float4 _800 = _798;
            _800.z = _349.z;
            _859 = _800;
        }
        else
        {
            _859 = _278;
        }
        float4 _862;
        if ((buffer.bgAlphaState != 0) && (buffer.bgAlphaState != buffer.blendAlphaState))
        {
            float3 _368 = _272.xyz * _272.w;
            float4 _803 = _272;
            _803.x = _368.x;
            float4 _805 = _803;
            _805.y = _368.y;
            float4 _807 = _805;
            _807.z = _368.z;
            _862 = _807;
        }
        else
        {
            _862 = _272;
        }
        _860 = _862;
        _854 = _859;
    }
    if (_284)
    {
        float _382 = fast::min(buffer._alpha, 1.0);
        float _385 = _854.w * _382;
        float _429 = fma(-_385, _860.w, fma(_854.w, _382, _860.w));
        float _866;
        if (_854.x == 1.0)
        {
            _866 = _854.x;
        }
        else
        {
            _866 = fast::min(_860.x / (1.0 - _854.x), 1.0);
        }
        float _867;
        if (_854.y == 1.0)
        {
            _867 = _854.y;
        }
        else
        {
            _867 = fast::min(_860.y / (1.0 - _854.y), 1.0);
        }
        float _868;
        if (_854.z == 1.0)
        {
            _868 = _854.z;
        }
        else
        {
            _868 = fast::min(_860.z / (1.0 - _854.z), 1.0);
        }
        out.gl_FragColor = float4(((((_854.xyz * _385) * (1.0 - _860.w)) + ((_860.xyz * _860.w) * fma(-_854.w, _382, 1.0))) + (float3(_866, _867, _868) * (_385 * _860.w))) / float3(fast::max(_429, 9.9999999747524270787835121154785e-07)), _429);
    }
    else
    {
        float4 _398 = _854 * fast::min(buffer._alpha, 1.0);
        float _532 = _398.w;
        float _540 = _532 * _860.w;
        float _543 = _398.x;
        float _863;
        do
        {
            bool _579 = _543 == _532;
            if (_579 && (_860.x == 0.0))
            {
                _863 = fma(_543, 1.0 - _860.w, _540);
                break;
            }
            else
            {
                if (_579)
                {
                    _863 = fma(_532, _860.w, fma(_543, 1.0 - _860.w, _860.x * (1.0 - _532)));
                    break;
                }
            }
            _863 = fma(_540, fast::min(1.0, (_860.x * _532) / fast::max(_860.w * (_532 - _543), 9.9999999747524270787835121154785e-07)), fma(_543, 1.0 - _860.w, _860.x * (1.0 - _532)));
            break;
        } while(false);
        float _552 = _398.y;
        float _864;
        do
        {
            bool _648 = _552 == _532;
            if (_648 && (_860.y == 0.0))
            {
                _864 = fma(_552, 1.0 - _860.w, _540);
                break;
            }
            else
            {
                if (_648)
                {
                    _864 = fma(_532, _860.w, fma(_552, 1.0 - _860.w, _860.y * (1.0 - _532)));
                    break;
                }
            }
            _864 = fma(_540, fast::min(1.0, (_860.y * _532) / fast::max(_860.w * (_532 - _552), 9.9999999747524270787835121154785e-07)), fma(_552, 1.0 - _860.w, _860.y * (1.0 - _532)));
            break;
        } while(false);
        float _561 = _398.z;
        float _865;
        do
        {
            bool _717 = _561 == _532;
            if (_717 && (_860.z == 0.0))
            {
                _865 = fma(_561, 1.0 - _860.w, _540);
                break;
            }
            else
            {
                if (_717)
                {
                    _865 = fma(_532, _860.w, fma(_561, 1.0 - _860.w, _860.z * (1.0 - _532)));
                    break;
                }
            }
            _865 = fma(_540, fast::min(1.0, (_860.z * _532) / fast::max(_860.w * (_532 - _561), 9.9999999747524270787835121154785e-07)), fma(_561, 1.0 - _860.w, _860.z * (1.0 - _532)));
            break;
        } while(false);
        out.gl_FragColor = float4(_863, _864, _865, fma(-_532, _860.w, _532 + _860.w));
    }
    return out;
}

