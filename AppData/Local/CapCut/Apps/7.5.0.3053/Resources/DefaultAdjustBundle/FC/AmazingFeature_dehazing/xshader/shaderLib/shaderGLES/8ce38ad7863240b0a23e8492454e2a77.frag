precision highp float;
precision highp int;

uniform mediump sampler2D texture_source;
uniform float strength;
uniform mediump sampler2D texture_skin;
uniform mediump sampler2D texture_trans;
uniform float tv;
uniform float human;
uniform vec4 u_sliderInfos;
uniform float alpha_s_full;
uniform mediump sampler2D texture_curves;
uniform mediump sampler2D texture_color;

varying vec2 uv;
varying vec2 adj_uv[10];

float _f2(vec3 _p0, float _p1)
{
    return exp(((-0.5) * dot(_p0, _p0)) / (_p1 * _p1));
}

vec3 _f0(vec3 _p0)
{
    vec4 _59 = mix(vec4(_p0.zy, -1.0, 0.666666686534881591796875), vec4(_p0.yz, 0.0, -0.3333333432674407958984375), vec4(step(_p0.z, _p0.y)));
    vec4 _t1 = _59;
    vec4 _t2 = mix(vec4(_59.xyw, _p0.x), vec4(_p0.x, _59.yzx), vec4(step(_t1.x, _p0.x)));
    float _94 = _t2.x - min(_t2.w, _t2.y);
    return vec3(abs(_t2.z + ((_t2.w - _t2.y) / ((6.0 * _94) + 1.0000000133514319600180897396058e-10))), _94 / (_t2.x + 1.0000000133514319600180897396058e-10), _t2.x);
}

vec3 _f1(vec3 _p0)
{
    return mix(vec3(1.0), clamp(abs((fract(_p0.xxx + vec3(1.0, 0.666666686534881591796875, 0.3333333432674407958984375)) * 6.0) - vec3(3.0)) - vec3(1.0), vec3(0.0), vec3(1.0)), vec3(_p0.y)) * _p0.z;
}

void main()
{
    vec2 _180 = vec2(uv.x, 1.0 - uv.y);
    float _t8[10];
    _t8[0] = 0.895183026790618896484375;
    _t8[1] = 0.895183026790618896484375;
    _t8[2] = 0.9726979732513427734375;
    _t8[3] = 0.9726979732513427734375;
    _t8[4] = 0.895183026790618896484375;
    _t8[5] = 0.895183026790618896484375;
    _t8[6] = 0.9726979732513427734375;
    _t8[7] = 0.9726979732513427734375;
    _t8[8] = 0.895183026790618896484375;
    _t8[9] = 0.895183026790618896484375;
    vec4 _t9 = texture2D(texture_source, uv);
    if (strength > 0.0089999996125698089599609375)
    {
        float _t10 = 1.0;
        vec3 _t11 = _t9.xyz;
        for (mediump int _t12 = 0; _t12 < 10; _t12++)
        {
            mediump vec3 _247 = texture2D(texture_source, adj_uv[_t12]).xyz;
            vec3 param = _t9.xyz - _247;
            float param_1 = 0.0199999995529651641845703125 * strength;
            float _262 = _f2(param, param_1);
            _t10 += (_t8[_t12] * _262);
            _t11 += ((_247 * _t8[_t12]) * _262);
        }
        vec3 _280 = _t11 / vec3(_t10);
        _t9.x = _280.x;
        _t9.y = _280.y;
        _t9.z = _280.z;
    }
    mediump vec4 _291 = texture2D(texture_skin, _180);
    mediump float _292 = _291.x;
    mediump vec4 _297 = texture2D(texture_trans, _180);
    mediump float _298 = _297.x;
    float _323 = mix(clamp(strength * 1.5, 0.0, 1.0), strength * (1.0 - (_292 * 0.87999999523162841796875)), human);
    vec3 param_2 = ((_t9.xyz - vec3(0.800000011920928955078125)) / vec3(mix(1.0, max(1.0 - (_323 * 0.4000000059604644775390625), mix(_298, mix(_298, tv, max(_292, 0.300000011920928955078125)), human)), u_sliderInfos.x))) + vec3(0.800000011920928955078125);
    vec3 _352 = _f0(param_2);
    vec3 _t21 = _352;
    vec3 _t25 = _352;
    mediump vec4 _375 = texture2D(texture_curves, vec2(clamp(_t21.z, 0.0, 1.0), 0.0));
    mediump float _376 = _375.z;
    _t25.z = mix(mix(_t21.z, _376, 0.0500000007450580596923828125 * _323), mix(_t21.z, _376, 0.2599999904632568359375 * _323), _292);
    mediump vec4 _400 = texture2D(texture_curves, vec2(clamp(_t21.y, 0.0, 1.0), 0.0));
    mediump float _401 = _400.y;
    _t25.y = mix(_t21.y, mix(_t21.y, _401, alpha_s_full * _323), _292);
    _t25.y = mix(_t25.y, mix(_t25.y, mix(_t25.y, _401, 0.60000002384185791015625 * _323), texture2D(texture_curves, vec2(clamp(1.0 - texture2D(texture_color, uv).x, 0.0, 1.0), 0.0)).x), human);
    vec3 param_3 = _t25;
    gl_FragData[0] = vec4(_f1(param_3), 1.0);
}

