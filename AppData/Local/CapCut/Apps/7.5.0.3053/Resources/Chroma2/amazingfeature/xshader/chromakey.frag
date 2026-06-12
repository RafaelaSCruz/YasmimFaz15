precision highp float;
varying vec2 uv0;

uniform sampler2D inputImageTexture;
uniform vec4 selectedColour;
uniform float inputIntensity;
uniform float inputShadow;
uniform float widthOffset;
uniform float heightOffset;

vec3 hsv2xyz2(vec3 hsv) {
    float z = hsv.z * 1.73205/3.0;
    float x = cos(hsv.x * 2.0 * 3.1415926535) * hsv.y * hsv.z;
    float y = sin(hsv.x * 2.0 * 3.1415926535) * hsv.y * hsv.z;
    return vec3(x,y,z);
}

float softEdge(float factor, float diff, float intensity) {
    return min(exp(factor * (diff - intensity)), 1.0);
}

vec3 rgb_2_yuv(vec3 rgb)
{
    highp vec3 yuv;
    yuv.x = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
    yuv.y = -0.14710802 * rgb.r + -0.28880402 * rgb.g + 0.435912 * rgb.b + 0.5;
    yuv.z = 0.61477697 * rgb.r -0.514799 * rgb.g  - 0.099978 * rgb.b + 0.5;
    return yuv;
}


vec3 rgb_2_hsv(vec3 c){
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)),d / (q.x + e),q.x);
}

float doChromaKey(vec4 textureColor, vec3 bg_color, float intensity, float shadow)
{
    float alpha = 0.0;
    highp vec3 color_yuv = rgb_2_yuv(textureColor.rgb);
    highp vec3 bg_yuv = rgb_2_yuv(bg_color);
    highp vec3 offset_yuv = bg_yuv;
    float K_ = clamp(3.0 * (intensity - 0.15), 0.0, 1.0);
    float K_ins = clamp(10.0 * (intensity - 0.05), 0.0, 1.0);
    float sb = sqrt((0.5 - bg_yuv.y) * (0.5 - bg_yuv.y) + (0.5 - bg_yuv.z) * (0.5 - bg_yuv.z));
    float intensity_ratio = max(1.0, min(10.0, 2.0 / max(0.1, sb)));
    offset_yuv.y = (bg_yuv.y - 0.5) * (1.0 + K_ins * intensity * intensity_ratio) + 0.5;
    offset_yuv.z = (bg_yuv.z - 0.5) * (1.0 + K_ins * intensity * intensity_ratio) + 0.5;
    color_yuv = clamp(color_yuv, 0.0, 1.0);
    float intensity_ = sqrt(intensity) * 1.8;
    float X = max(0.1, (0.18 - 0.1 * color_yuv.x * bg_yuv.x + 0.01));
    X = mix(0.05, X, K_ins);
    float L = sqrt((offset_yuv.y - bg_yuv.y) * (offset_yuv.y - bg_yuv.y) + (offset_yuv.z - bg_yuv.z) * (offset_yuv.z - bg_yuv.z));
    float dis_uv = sqrt((color_yuv.y - bg_yuv.y) * (color_yuv.y - bg_yuv.y) + (color_yuv.z - bg_yuv.z) * (color_yuv.z - bg_yuv.z)) + sqrt((color_yuv.y - offset_yuv.y) * (color_yuv.y - offset_yuv.y) + (color_yuv.z - offset_yuv.z) * (color_yuv.z - offset_yuv.z));
    
    float sf = sqrt((0.5 - color_yuv.y) * (0.5 - color_yuv.y) + (0.5 - color_yuv.z) * (0.5 - color_yuv.z));
    float sb_ = min(max(sb, 0.05), 0.6);
    float weight_sb = clamp(color_yuv.x * 1.0 / max(0.2, bg_yuv.x), 0.0, 1.0) * (1.0 - clamp(sb * sb * 4.0, 0.0, 1.0));
    weight_sb = mix(weight_sb, 0.0, clamp((intensity - 0.4) * 5.0, 0.0, 1.0));
    dis_uv = max(0.0, (dis_uv - L) - sb_ * mix(1.0, sb_, weight_sb) * intensity_);

    float auv = 1.0 / X * dis_uv;
    float s_b = 1.4 * sb;
    auv = pow(max(auv, 0.0), 2.0 - s_b);
    float ay = abs(color_yuv.x - bg_yuv.x) / max(1.0 - bg_yuv.x, bg_yuv.x);
    ay =  14.2857 * (ay - 0.2 * intensity_ * intensity_);
    float weight_y = clamp(1.5 - sb * 20.0, 0.0, 1.0);

    vec3 hsv = rgb_2_hsv(textureColor.rgb);
    vec3 hsv_bg = rgb_2_hsv(bg_color.rgb);
    float hsv_weight = clamp(15.0 * (hsv_bg.y * hsv_bg.z - 0.02), 0.0, 1.0);
    float a_hsv = 0.0;
    weight_y = max(weight_y, 1.0 - hsv_weight);
    weight_y = mix(1.0, weight_y, K_);
    if (hsv_weight>0.001)
    {  
        float h_weight = min(abs(hsv.x - hsv_bg.x), 1.0 - abs(hsv.x - hsv_bg.x));
        float diff_h = 0.12 + 0.1 * clamp((intensity - 0.4) * 2.0, 0.0, 1.0);
        h_weight = clamp((h_weight - diff_h) * 12.0, 0.0, 1.0);
        float intensity_hsv = (hsv_bg.y * hsv_bg.z - 0.1) * (1.0 - intensity) * (1.0 - intensity);
        float k_sv = 10.0 + 50.0 * clamp(intensity - 0.4, 0.0, 1.0);
        a_hsv = (1.0 - clamp(k_sv * (hsv.y * hsv.z - intensity_hsv), 0.0, 1.0));
        a_hsv = 1.0 - (1.0 - h_weight) * (1.0 - a_hsv);
        a_hsv = hsv_weight * mix(a_hsv, 0.0, clamp((intensity - 0.85) * 8.0, 0.0, 1.0));
        float hsv_weight_ = clamp(25.0 * (hsv_bg.y * hsv_bg.z - 0.25), 0.0, 1.0);
        weight_y = weight_y * mix(1.0, 1.0 - hsv_weight_, clamp((intensity - 0.0) * 10.0, 0.0, 1.0));   
    }

    //a_hsv = max((1.0 - clamp(12.0 * (hsv.y * hsv.z - 0.001), 0.0, 1.0)) * hsv_weight, a_hsv);
    alpha = max(a_hsv, max(ay * weight_y, auv));
    float k_alp = clamp((intensity  - 0.5) * 4.0, 0.0, 1.0) + 1.0;
    alpha = min(alpha, clamp((alpha - 0.5) * k_alp + 0.4, 0.0, 1.0));
    if (shadow > 0.001)
    {
        float dis2 = length(hsv2xyz2(rgb_2_hsv(textureColor.rgb)) - vec3(0.0, 0.0, 1.73205 * 1.33333333));
        float sh = (shadow - 0.3) * 4.0;
        sh =  1.0 / (1.0 + exp(-sh));
        float shadow_ = mix(1.73205 * 1.33333, 2.0, sh);
        float alp_shadow = 1.0 - softEdge(30.0, shadow_, dis2);
        alpha = max(alp_shadow, alpha);
    }
    
    alpha = clamp((alpha - 0.2) * 1.25, 0.0, 1.0);
    return alpha;
}

void main() {
    const float EPS = 0.001;
   
    if (inputIntensity < EPS) {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
    else {
        vec4 bg_color = selectedColour;
        vec4 rgba = texture2D(inputImageTexture, uv0);
        float alpha = doChromaKey(rgba, bg_color.rgb, inputIntensity, inputShadow);
        gl_FragColor = vec4(alpha, alpha, alpha, 1.0);
    }
}
