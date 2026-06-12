precision highp float;
varying vec2 uv0;

uniform sampler2D inputImageTexture;
uniform sampler2D smoothMapTexturex;
uniform vec4 selectedColour;
uniform float inputIntensity;
uniform float inputEdgeSmooth;
uniform float inputSpill;
uniform float widthOffset;
uniform float heightOffset;


vec3 rgb_2_yuv(vec3 rgb)
{
    highp vec3 yuv;
    yuv.x = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
    yuv.y = -0.14710802 * rgb.r + -0.28880402 * rgb.g + 0.435912 * rgb.b + 0.5;
    yuv.z = 0.61477697 * rgb.r -0.514799 * rgb.g  - 0.099978 * rgb.b + 0.5;
    return yuv;
}

vec3 yuv_2_rgb(vec3 yuv)
{
    mediump vec3 rgb;
    rgb.r = yuv.x + 1.14 * yuv.z - 0.57;
    rgb.g = yuv.x - 0.395 * yuv.y - 0.581 * yuv.z + 0.488;
    rgb.b = yuv.x + 2.032 * yuv.y - 1.016;
    return rgb;
}

vec3 rgb_2_hsv(vec3 c){
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)),d / (q.x + e),q.x);
}

vec3 hsv_2_rgb(vec3 c)
{
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

float calDis(vec3 rgb, float c)
{
    float max_ = max(rgb.r, rgb.b);
    float min_ = min(rgb.r, rgb.b);
    return clamp(rgb.g - ((max_ - min_) * c * max_ + min_), 0.0, 1.0);
}

float mod_h(float h)
{
    float h_ = h;
    if (h > 1.0) {
        h_ = h - 1.0;
    }
    else if (h < 0.0) {
        h_ =  h + 1.0;
    }
    return h_;
}

vec4 processColor(vec4 rgba, vec4 bg_color, float alpha, float inputspill)
{
    vec4 fixColor = rgba;
    const float EPS = 0.001;
    float weight = 1.0;
    fixColor.rgb = mix(fixColor.rgb, rgba.rgb, weight);
    rgba.rgb = fixColor.rgb;
    
    vec3 yuv_base = rgb_2_yuv(fixColor.rgb);
    yuv_base.y = 0.5;
    yuv_base.z = 0.5;
    vec3 fixColor_base = yuv_2_rgb(yuv_base);
    fixColor_base.rgb = clamp(fixColor_base.rgb, 0.0, 1.0);
    
    vec3 hsv = rgb_2_hsv(fixColor.rgb);
    vec3 hsv_bg = rgb_2_hsv(bg_color.rgb);
    
    float d_ = 0.02;
    float h = hsv.x;
    float h_bg = hsv_bg.x;
    if (h < 0.33333 + d_ && h > 0.33333 - d_)
    {
        h = 0.33333 - d_;
    }
    else if(h >= 0.33333 + d_)
    {
        h = h - d_ * 2.0;
    }
    if (h_bg < 0.33333 + d_ && h_bg > 0.33333 - d_)
    {
        h_bg = 0.33333 - d_;
    }
    else if(h_bg >= 0.33333 + d_)
    {
        h_bg = h_bg - d_ * 2.0;
    }
    
    float h_round = clamp(float(int(hsv_bg.x * 3.0 + 0.5)) / 3.0, 0.0, 1.0);
    float h_weight = min(abs(h - h_bg), 1.0 - 2.0 * d_ - abs(h - h_bg));
    if (inputspill > EPS)
    {
        float h_weight_base = 1.0 - clamp((h_weight - 0.1) * 12.0, 0.0, 1.0);
        fixColor_base.rgb = mix(rgba.rgb, fixColor_base.rgb, h_weight_base);
    }
    else
    {
        fixColor_base.rgb = rgba.rgb;
    }
    
    float h_offset = min(abs(h_round - 0.33333), 1.0 - abs(h_round - 0.33333));
    float flag = 1.0;
    if (hsv_bg.x > 0.33333 && hsv_bg.x < 0.83333)
    {
        flag = -1.0;
    }
    hsv.x = mod_h(hsv.x + flag * h_offset);
    vec3 fixColor_ = hsv_2_rgb(hsv);
    hsv_bg.x = mod_h(hsv_bg.x + flag * h_offset);
    vec3 selectedColour_ = hsv_2_rgb(hsv_bg);
    
    vec3 yuv = rgb_2_yuv(fixColor_.rgb);
    vec3 yuv_b = rgb_2_yuv(selectedColour_.rgb);
    
    float s_c = sqrt(pow(yuv.y - 0.5, 2.0)+pow(yuv.z - 0.5, 2.0));
    float s_c_b = sqrt(pow(yuv_b.y - 0.5, 2.0)+pow(yuv_b.z - 0.5, 2.0));
    float s = clamp(0.66 - 5.0 * s_c, 0.0, 1.0);
    float spill_ = inputspill - 0.25;
    float A_color = 1.0 - calDis(fixColor_, 1.0 - spill_ * (1.0 + s)) / max(0.01, calDis(selectedColour_, 1.0));
    A_color = max(A_color, alpha / 3.0);
    A_color = clamp(A_color, 0.0001, 1.0);
    fixColor.rgb = (fixColor_ - (1.0 - A_color) * selectedColour_) / A_color;
    
    float maxrb = max(fixColor.r, fixColor.b);
    float minrb = min(fixColor.r, fixColor.b);
    fixColor.g = mix(fixColor.g, min(fixColor.g, (maxrb - minrb) * 0.9 * maxrb + minrb), inputspill);
    
    fixColor.rgb = clamp(fixColor.rgb, 0.0, 1.0);
    vec3 fixYUV = rgb_2_yuv(fixColor.rgb);
    float weight_y = min(1.0 - alpha, min(weight, 1.0 - A_color));
    float kuv = clamp(s_c * 10.0, 0.0, 1.0);
    kuv = (1.0 - A_color) * kuv;
    kuv = mix(kuv, 1.0 - clamp((h_weight - 0.3) * 10.0, 0.0, 1.0), 1.0 - clamp((hsv.z-0.05)*2.0,0.0, 1.0));
    fixYUV.x =   fixYUV.x * weight_y + (1.0 - weight_y) * yuv.x;
    fixYUV.y =  fixYUV.y * (1.0 - kuv) + kuv * 0.5;
    fixYUV.z =  fixYUV.z * (1.0 - kuv) + kuv * 0.5;
    fixColor.rgb = yuv_2_rgb(fixYUV);
    fixColor.rgb = clamp(fixColor.rgb, 0.0, 1.0);
    
    hsv = rgb_2_hsv(fixColor.rgb);
    hsv.x = mod_h(hsv.x - flag * h_offset);
    fixColor.rgb = hsv_2_rgb(hsv);
    fixColor.rgb = mix(fixColor.rgb, fixColor_base.rgb, (1.0 - min(1.0, 2.5 * inputspill)));
    fixColor.rgb = mix(rgba.rgb, fixColor.rgb, clamp(s_c_b * 10.0, 0.0, 1.0));
    
    return fixColor;
}

void main() {
    const float EPS = 0.001;
    vec4 rgba = texture2D(inputImageTexture, uv0);
    rgba.rgb *= rgba.a;
    float alpha = texture2D(smoothMapTexturex, uv0).x;
    float alpha_ori = rgba.a;
    if (inputIntensity > EPS)
    {
        if (inputEdgeSmooth > EPS)
        {
            float alpha_ = 0.0;
            float L = min(1.0 / widthOffset, 1.0 / heightOffset) * 0.014;
            int r = int(inputEdgeSmooth * L);
            int kernel_size = r * 2 + 1;
            float weight = 0.0;
            float max_alp = texture2D(smoothMapTexturex, uv0).y;
	        float min_alp = texture2D(smoothMapTexturex, uv0).z;
            for (int i = kernel_size - 1; i >= 0; i--)
            {
                vec2 offset= vec2(0.0, heightOffset * float(i - kernel_size / 2));
                vec2 coordinate = uv0 + offset;
                coordinate = clamp(coordinate, 0.0, 1.0);
                float pt_alpha = texture2D(smoothMapTexturex, coordinate).x;
                alpha_ += pt_alpha;
                weight += 1.0;
                max_alp = max(max_alp, pt_alpha);
		        min_alp = min(min_alp, pt_alpha);
            }
            alpha_ = clamp(alpha_ / max(0.001, weight), 0.0, 1.0);
            float t_ = 0.5 + inputEdgeSmooth / 3.0;
            alpha_ = clamp((alpha_ - t_) * (float(r) / 5.0 + 1.0) + t_, min_alp, max_alp);
            float alpha_mix = min(alpha, alpha_);
            alpha = mix(alpha_mix, alpha_, clamp(7.0 * inputEdgeSmooth, 0.0, 1.0));
        }
    }
    if (inputSpill > EPS)
    {
        rgba = processColor(rgba, selectedColour, alpha, inputSpill);
    }
    gl_FragColor = rgba * alpha;
    gl_FragColor.a *= alpha_ori;
}
