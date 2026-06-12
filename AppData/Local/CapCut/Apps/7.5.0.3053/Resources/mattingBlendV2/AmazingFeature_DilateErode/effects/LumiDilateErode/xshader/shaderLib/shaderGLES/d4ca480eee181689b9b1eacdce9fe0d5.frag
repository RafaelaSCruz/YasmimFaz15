precision highp float;
precision highp int;

uniform mediump sampler2D alphaMapTexture;
uniform float inputEdgeSmooth;
uniform float widthOffset;

varying vec2 uv0;

float _f0(float _p0, float _p1)
{
    return (0.3989399969577789306640625 * exp((((-0.5) * _p0) * _p0) / (_p1 * _p1))) / _p1;
}

void main()
{
    mediump vec4 _40 = texture2D(alphaMapTexture, uv0);
    if (inputEdgeSmooth < 0.001000000047497451305389404296875)
    {
        gl_FragData[0] = vec4(_40.xxx, 1.0);
    }
    else
    {
        float _t1 = 0.0;
        float _t6 = 0.0;
        for (mediump int _t8 = 42; _t8 >= 0; _t8--)
        {
            vec2 _110 = vec2(widthOffset * float(_t8 - 21), 0.0);
            vec2 _t10 = uv0 + ((_110 * 2.0) * inputEdgeSmooth);
            if (inputEdgeSmooth < 0.20000000298023223876953125)
            {
                if ((_t8 > 23) || (_t8 < 19))
                {
                    continue;
                }
                _t10 = uv0 + ((_110 * 8.0) * inputEdgeSmooth);
            }
            vec2 _141 = _t10;
            vec2 _144 = clamp(_141, vec2(0.0), vec2(1.0));
            _t10 = _144;
            float param = (abs(float(_t8 - 21)) / 21.0) * 15.0;
            float param_1 = 4.0;
            float _165 = _f0(param, param_1);
            _t1 += (pow(texture2D(alphaMapTexture, _144).x, 1.39999997615814208984375) * _165);
            _t6 += _165;
        }
        float _178 = _t1;
        float _185 = pow(clamp(_178 / _t6, 0.0, 1.0), 0.71428573131561279296875);
        _t1 = _185;
        gl_FragData[0] = vec4(_185, 0.0, 0.0, 1.0);
    }
}

