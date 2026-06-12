precision highp float;
varying highp vec2 uv0;
uniform sampler2D u_inputTexture;

uniform float u_brightnessParam;

void main()
{
    vec4 color = texture2D(u_inputTexture, uv0);

    // the following part is to finetune parameter for pow function.
    float p = 0.;
    if (u_brightnessParam > 0.) {
        p = 1.0 + u_brightnessParam * 5.0;
    } else {
        p = 1.0 / (1.0 - u_brightnessParam * 2.5);
        color.rgb -= -u_brightnessParam * 0.01; // add a small negative offset when darkening brightness.
    }

    // the following equation `y = 1 - pow(1 - x, p)` is the result of
    // rotating `y = pow(x, p)` 180 degree around (0.5, 0.5)
    color.rgb = 1. - pow(1. - color.rgb, vec3(p));
    gl_FragColor = clamp(color, 0., 1.);
}
