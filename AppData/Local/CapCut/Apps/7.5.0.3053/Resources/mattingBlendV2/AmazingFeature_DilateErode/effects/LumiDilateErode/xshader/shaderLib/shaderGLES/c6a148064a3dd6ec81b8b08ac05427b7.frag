precision highp float;
precision highp int;

uniform vec4 u_ScreenParams;
uniform float normSize;
uniform float kernelSize;
uniform mediump sampler2D inputImageTexture0;
uniform mediump sampler2D inputImageTexture;
uniform float channel;

varying vec2 v_uv;

void main()
{
    float _32 = abs(kernelSize);
    vec2 _t1 = vec2(_32 / 15.0) / ((u_ScreenParams.xy / vec2(min(u_ScreenParams.x, u_ScreenParams.y))) * normSize);
    mediump vec4 _48 = texture2D(inputImageTexture0, v_uv);
    vec4 _t2 = _48;
    vec4 _t3 = texture2D(inputImageTexture, v_uv);
    float _t4 = _t3.x;
    float _t5 = _t3.y;
    float _t7 = _t3.z;
    for (float _t8 = 1.0; _t8 <= 15.0; _t8 += 1.0)
    {
        vec4 _t9 = texture2D(inputImageTexture, v_uv + vec2(0.0, _t8 * _t1.y));
        float _90 = _t9.x;
        float _94 = _t9.y;
        _t9 = texture2D(inputImageTexture, v_uv + vec2(0.0, (-_t8) * _t1.y));
        _t4 = max(max(_t4, _90), _t9.x);
        _t5 = min(min(_t5, _94), _t9.y);
    }
    if (kernelSize >= 0.0)
    {
        _t7 = _t4;
    }
    else
    {
        _t7 = _t5;
    }
    if (kernelSize < 0.0)
    {
        _t7 = pow(clamp(_t7 - ((_t4 - _t3.z) * (_32 / 5.0)), 0.0, 1.0), 1.0 + (_32 / 4.0));
    }
    if (channel < 0.5)
    {
        gl_FragData[0] = vec4(_48.xyz, 1.0) * _t7;
    }
    else
    {
        gl_FragData[0] = vec4(vec3(_t7), 1.0) * _t2.w;
    }
}

