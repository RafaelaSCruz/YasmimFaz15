precision highp float;
varying vec2 uv0;

uniform sampler2D inputImageTexture;
uniform float inputIntensity;
uniform float inputEdgeSmooth;
uniform float widthOffset;
uniform float heightOffset;
uniform sampler2D alphaMapTexture;


void main() {
    const float EPS = 0.001;
    if (inputIntensity < EPS)
    {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
    else
    {
        float alpha = texture2D(alphaMapTexture, uv0).x;
        if (inputEdgeSmooth < EPS)
        {
            gl_FragColor = vec4(alpha, alpha, alpha, 1.0);
        }
        else
        {
            float alpha_ = 0.0;
            float L = min(1.0 / widthOffset, 1.0 / heightOffset) * 0.014;
            int r = int(inputEdgeSmooth * L);
            int kernel_size = r * 2 + 1;
            float weight = 0.0;
            float max_alp = alpha;
	        float min_alp = alpha;
            for (int j = kernel_size - 1; j >= 0; j--)
            {
                vec2 offset= vec2(widthOffset * float(j - kernel_size / 2), 0.0);
                vec2 coordinate = uv0 + offset;
                coordinate = clamp(coordinate, 0.0, 1.0);
                float pt_alpha = texture2D(alphaMapTexture, coordinate).x;
                alpha_ += pt_alpha;
                weight += 1.0;
                max_alp = max(max_alp, pt_alpha);
		        min_alp = min(min_alp, pt_alpha);
            }
            alpha_ = clamp(alpha_ / max(0.001, weight), 0.0, 1.0);
            gl_FragColor = vec4(alpha_, max_alp, min_alp, 1.0);
        }
    }
}
