precision highp float;
varying highp vec2 uv0;
uniform sampler2D inputImageTexture;

// Interface parameters
uniform float Pivot;
uniform float Contrast;

// Non-Interface parameters
uniform float XFactor;
uniform float Y0Diff;
uniform float Y1Diff;
uniform float K0Diff;
uniform float K1Diff;
uniform float KPivot;


float getSigmoid(float x, float a, float pivot)
{
    float res = 1.0 / (1.0 + exp(-a * (x - pivot))) + pivot - 0.5;
    return res;
}


float getSigmoidDerivative(float x, float a, float pivot)
{
    float s = 1.0 / (1.0 + exp(-a * (x - pivot)));
    float k = a * s * (1.0 - s);
    return k;
}

float enchanceContrast(float x, float a, float pivot, float y0Diff, float k0Diff, float y1Diff, float k1Diff, float kPivot)
{
    float res = getSigmoid(x, a, pivot);
    float k = getSigmoidDerivative(x, a, pivot);
    if (x <= pivot){
        float scale = (kPivot - k) / k0Diff;
        scale = scale * scale; 
        res = res + scale * y0Diff;
    } else {
        float scale = (kPivot - k) / k1Diff;
        scale = scale * scale; 
        res = res + scale * y1Diff;
    }
    return res;
}


void main()
{
    vec4 color = texture2D(inputImageTexture, uv0);
    if (Contrast <= 1.0) {
        color.rgb = Contrast * (color.rgb - Pivot) + Pivot;
    } else {
        color.r = enchanceContrast(color.r, XFactor, Pivot, Y0Diff, K0Diff, Y1Diff, K1Diff, KPivot);
        color.g = enchanceContrast(color.g, XFactor, Pivot, Y0Diff, K0Diff, Y1Diff, K1Diff, KPivot);
        color.b = enchanceContrast(color.b, XFactor, Pivot, Y0Diff, K0Diff, Y1Diff, K1Diff, KPivot);
    }
    color.rgb = clamp(color.rgb, 0.0, 1.0);
    gl_FragColor = color;
}
