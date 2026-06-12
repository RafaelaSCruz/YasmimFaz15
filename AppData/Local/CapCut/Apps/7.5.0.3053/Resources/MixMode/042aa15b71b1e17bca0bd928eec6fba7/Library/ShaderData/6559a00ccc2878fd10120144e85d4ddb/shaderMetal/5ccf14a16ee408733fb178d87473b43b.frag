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
    float4 _275 = baseTex.sample(baseTexSmplr, in.uv1);
    float4 _281 = _MainTex.sample(_MainTexSmplr, in.uv0);
    bool _287 = buffer.blendAlphaState == 2;
    float4 _923;
    float4 _929;
    if (_287)
    {
        bool _293 = buffer.fgAlphaState != buffer.blendAlphaState;
        bool _300;
        if (_293)
        {
            _300 = _281.w > 0.0;
        }
        else
        {
            _300 = _293;
        }
        float4 _926;
        if (_300)
        {
            float3 _308 = _281.xyz / float3(_281.w);
            float4 _856 = _281;
            _856.x = _308.x;
            float4 _858 = _856;
            _858.y = _308.y;
            float4 _860 = _858;
            _860.z = _308.z;
            _926 = _860;
        }
        else
        {
            _926 = _281;
        }
        bool _318 = buffer.bgAlphaState != buffer.blendAlphaState;
        bool _324;
        if (_318)
        {
            _324 = _275.w > 0.0;
        }
        else
        {
            _324 = _318;
        }
        float4 _930;
        if (_324)
        {
            float3 _332 = _275.xyz / float3(_275.w);
            float4 _864 = _275;
            _864.x = _332.x;
            float4 _866 = _864;
            _866.y = _332.y;
            float4 _868 = _866;
            _868.z = _332.z;
            _930 = _868;
        }
        else
        {
            _930 = _275;
        }
        _929 = _930;
        _923 = _926;
    }
    else
    {
        float4 _928;
        if ((buffer.fgAlphaState != 0) && (buffer.fgAlphaState != buffer.blendAlphaState))
        {
            float3 _353 = _281.xyz * _281.w;
            float4 _871 = _281;
            _871.x = _353.x;
            float4 _873 = _871;
            _873.y = _353.y;
            float4 _875 = _873;
            _875.z = _353.z;
            _928 = _875;
        }
        else
        {
            _928 = _281;
        }
        float4 _931;
        if ((buffer.bgAlphaState != 0) && (buffer.bgAlphaState != buffer.blendAlphaState))
        {
            float3 _372 = _275.xyz * _275.w;
            float4 _878 = _275;
            _878.x = _372.x;
            float4 _880 = _878;
            _880.y = _372.y;
            float4 _882 = _880;
            _882.z = _372.z;
            _931 = _882;
        }
        else
        {
            _931 = _275;
        }
        _929 = _931;
        _923 = _928;
    }
    if (_287)
    {
        float _386 = fast::min(buffer._alpha, 1.0);
        float _389 = _923.w * _386;
        float _441 = fma(-_389, _929.w, fma(_923.w, _386, _929.w));
        float _935;
        do
        {
            if (_923.x < 0.5)
            {
                _935 = fma(2.0 * _929.x, _923.x, (_929.x * _929.x) * fma(-2.0, _923.x, 1.0));
                break;
            }
            else
            {
                _935 = fma(sqrt(_929.x), fma(2.0, _923.x, -1.0), (2.0 * _929.x) * (1.0 - _923.x));
                break;
            }
        } while(false);
        float _936;
        do
        {
            if (_923.y < 0.5)
            {
                _936 = fma(2.0 * _929.y, _923.y, (_929.y * _929.y) * fma(-2.0, _923.y, 1.0));
                break;
            }
            else
            {
                _936 = fma(sqrt(_929.y), fma(2.0, _923.y, -1.0), (2.0 * _929.y) * (1.0 - _923.y));
                break;
            }
        } while(false);
        float _937;
        do
        {
            if (_923.z < 0.5)
            {
                _937 = fma(2.0 * _929.z, _923.z, (_929.z * _929.z) * fma(-2.0, _923.z, 1.0));
                break;
            }
            else
            {
                _937 = fma(sqrt(_929.z), fma(2.0, _923.z, -1.0), (2.0 * _929.z) * (1.0 - _923.z));
                break;
            }
        } while(false);
        out.gl_FragColor = float4(((((_923.xyz * _389) * (1.0 - _929.w)) + ((_929.xyz * _929.w) * fma(-_923.w, _386, 1.0))) + (float3(_935, _936, _937) * (_389 * _929.w))) / float3(fast::max(_441, 9.9999999747524270787835121154785e-07)), _441);
    }
    else
    {
        float _666;
        float4 _402 = _923 * fast::min(buffer._alpha, 1.0);
        float _619 = _402.w;
        float _627 = _619 * _929.w;
        float _939 = -_619;
        float _630 = _402.x;
        float _932;
        do
        {
            _666 = fast::max(_929.w, 9.9999999747524270787835121154785e-07);
            float _667 = _929.x / _666;
            float _669 = 2.0 * _630;
            if (_669 <= _619)
            {
                _932 = fma(_929.x, fma(fma(2.0, _630, _939), 1.0 - _667, _619), fma(_630, 1.0 - _929.w, _929.x * (1.0 - _619)));
                break;
            }
            _932 = fma(_630 * (-2.0), _929.x, fma(sqrt(_667), fma(_669, _929.w, -_627), fma(_630, 1.0 - _929.w, _929.x * (1.0 + _619))));
            break;
        } while(false);
        float _639 = _402.y;
        float _933;
        do
        {
            float _732 = _929.y / _666;
            float _734 = 2.0 * _639;
            if (_734 <= _619)
            {
                _933 = fma(_929.y, fma(fma(2.0, _639, _939), 1.0 - _732, _619), fma(_639, 1.0 - _929.w, _929.y * (1.0 - _619)));
                break;
            }
            _933 = fma(_639 * (-2.0), _929.y, fma(sqrt(_732), fma(_734, _929.w, -_627), fma(_639, 1.0 - _929.w, _929.y * (1.0 + _619))));
            break;
        } while(false);
        float _648 = _402.z;
        float _934;
        do
        {
            float _797 = _929.z / _666;
            float _799 = 2.0 * _648;
            if (_799 <= _619)
            {
                _934 = fma(_929.z, fma(fma(2.0, _648, _939), 1.0 - _797, _619), fma(_648, 1.0 - _929.w, _929.z * (1.0 - _619)));
                break;
            }
            _934 = fma(_648 * (-2.0), _929.z, fma(sqrt(_797), fma(_799, _929.w, -_627), fma(_648, 1.0 - _929.w, _929.z * (1.0 + _619))));
            break;
        } while(false);
        out.gl_FragColor = float4(_932, _933, _934, fma(_939, _929.w, _619 + _929.w));
    }
    return out;
}

