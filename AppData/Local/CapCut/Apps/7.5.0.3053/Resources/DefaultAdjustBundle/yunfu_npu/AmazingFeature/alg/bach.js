const Amaz = effect.Bach;

const ByteNN = {};

ByteNN.DataFormat = {
    NCHW: 0,
    NHWC: 1,
};

ByteNN.DataType = {
    U8: 0,
    Int8: 1,
    Int16: 2,
    Uint16: 3,
    Float: 4,
    Fp16: 5,
    Double: 6,
};

ByteNN.ErrorCode = {
    SUCCESS: 0,
    ERR_MEMORY_ALLOC: 1,
    NOT_IMPLEMENTED: 2,
    ERR_UNEXPECTED: 3,
    ERR_DATANOMATCH: 4,
    INPUT_DATA_ERROR: 5,
    CALL_BACK_STOP: 6,
    BACKEND_FALLBACK: 7,
    NULL_POINTER: 8,
    INVALID_POINTER: 9,
    INVALID_MODEL: 10,
    INFER_SIZE_ERROR: 11,
    NOT_SUPPORT: 12,
    DESTROYED_ERROR: 13,
    WRONG_LICENSE: 14,
    BROKEN_MODEL: 15,
    EARLY_STOP: 16,
};

ByteNN.ForwardType = {
    CPU: 0, // Android, iOS, Mac, Windows and Linux
    GPU: 1, // Android, iOS, Mac, Windows
    DSP: 2, // Android, iOS
    NPU: 3, // Android
    Auto: 4, // Android, iOS, Mac, Windows and Linux
    METAL: 5, // iOS
    OPENCL: 6, // Android, Mac, Windows
    OPENGL: 7,
    VULKAN: 8,
    CUDA: 9, // Windows, Linux
    CoreML: 10, // iOS and Mac
};

ByteNN.DeviceIOType = {
    CPUBuffer: 0,
    GLTexture: 1,
    CLImage: 2,
    CLBuffer: 3,
    CVPixelBuffer: 4,
    MTLTexture: 5,
    MTLBuffer: 6,
    CUDABuffer: 7,
    AhardwareBuffer: 8,
    IONBuffer: 9,
    ExtendedBuffer: 10,
};

ByteNN.PowerMode = {
    NormalPower: 0,
    HighPower: 1,
    LowPower: 2,
};

ByteNN.PrecisionMode = {
    NormalPrecision: 0,
    HighPrecision: 1,
    LowPrecision: 2,
};

const MobileCV2 = {};

MobileCV2.ColorConversionCodes = {
    COLOR_BGR2BGRA: 0,
    COLOR_RGB2RGBA: 0,
    COLOR_BGRA2BGR: 1,
    COLOR_RGBA2RGB: 1,
    COLOR_BGR2RGBA: 2,
    COLOR_RGB2BGRA: 2,
    COLOR_RGBA2BGR: 3,
    COLOR_BGRA2RGB: 3,
    COLOR_BGR2RGB: 4,
    COLOR_RGB2BGR: 4,
    COLOR_BGRA2RGBA: 5,
    COLOR_RGBA2BGRA: 5,
    COLOR_BGR2GRAY: 6,
    COLOR_RGB2GRAY: 7,
    COLOR_GRAY2BGR: 8,
    COLOR_GRAY2RGB: 8,
    COLOR_GRAY2BGRA: 9,
    COLOR_GRAY2RGBA: 9,
    COLOR_BGRA2GRAY: 10,
    COLOR_RGBA2GRAY: 11,
    COLOR_BGR2BGR565: 12,
    COLOR_RGB2BGR565: 13,
    COLOR_BGR5652BGR: 14,
    COLOR_BGR5652RGB: 15,
    COLOR_BGRA2BGR565: 16,
    COLOR_RGBA2BGR565: 17,
    COLOR_BGR5652BGRA: 18,
    COLOR_BGR5652RGBA: 19,
    COLOR_GRAY2BGR565: 20,
    COLOR_BGR5652GRAY: 21,
    COLOR_BGR2BGR555: 22,
    COLOR_RGB2BGR555: 23,
    COLOR_BGR5552BGR: 24,
    COLOR_BGR5552RGB: 25,
    COLOR_BGRA2BGR555: 26,
    COLOR_RGBA2BGR555: 27,
    COLOR_BGR5552BGRA: 28,
    COLOR_BGR5552RGBA: 29,
    COLOR_GRAY2BGR555: 30,
    COLOR_BGR5552GRAY: 31,
    COLOR_BGR2XYZ: 32,
    COLOR_RGB2XYZ: 33,
    COLOR_XYZ2BGR: 34,
    COLOR_XYZ2RGB: 35,
    COLOR_BGR2YCrCb: 36,
    COLOR_RGB2YCrCb: 37,
    COLOR_YCrCb2BGR: 38,
    COLOR_YCrCb2RGB: 39,
    COLOR_BGR2HSV: 40,
    COLOR_RGB2HSV: 41,
    COLOR_BGR2Lab: 44,
    COLOR_RGB2Lab: 45,
    COLOR_BGR2Luv: 50,
    COLOR_RGB2Luv: 51,
    COLOR_BGR2HLS: 52,
    COLOR_RGB2HLS: 53,
    COLOR_HSV2BGR: 54,
    COLOR_HSV2RGB: 55,
    COLOR_Lab2BGR: 56,
    COLOR_Lab2RGB: 57,
    COLOR_Luv2BGR: 58,
    COLOR_Luv2RGB: 59,
    COLOR_HLS2BGR: 60,
    COLOR_HLS2RGB: 61,
    COLOR_BGR2HSV_FULL: 66,
    COLOR_RGB2HSV_FULL: 67,
    COLOR_BGR2HLS_FULL: 68,
    COLOR_RGB2HLS_FULL: 69,
    COLOR_HSV2BGR_FULL: 70,
    COLOR_HSV2RGB_FULL: 71,
    COLOR_HLS2BGR_FULL: 72,
    COLOR_HLS2RGB_FULL: 73,
    COLOR_LBGR2Lab: 74,
    COLOR_LRGB2Lab: 75,
    COLOR_LBGR2Luv: 76,
    COLOR_LRGB2Luv: 77,
    COLOR_Lab2LBGR: 78,
    COLOR_Lab2LRGB: 79,
    COLOR_Luv2LBGR: 80,
    COLOR_Luv2LRGB: 81,
    COLOR_BGR2YUV: 82,
    COLOR_RGB2YUV: 83,
    COLOR_YUV2BGR: 84,
    COLOR_YUV2RGB: 85,
    COLOR_YUV2RGB_NV12: 90,
    COLOR_YUV2BGR_NV12: 91,
    COLOR_YUV2RGB_NV21: 92,
    COLOR_YUV2BGR_NV21: 93,
    COLOR_YUV420sp2RGB: 92,
    COLOR_YUV420sp2BGR: 93,
    COLOR_YUV2RGBA_NV12: 94,
    COLOR_YUV2BGRA_NV12: 95,
    COLOR_YUV2RGBA_NV21: 96,
    COLOR_YUV2BGRA_NV21: 97,
    COLOR_YUV420sp2RGBA: 96,
    COLOR_YUV420sp2BGRA: 97,
    COLOR_YUV2RGB_YV12: 98,
    COLOR_YUV2BGR_YV12: 99,
    COLOR_YUV2RGB_IYUV: 100,
    COLOR_YUV2BGR_IYUV: 101,
    COLOR_YUV2RGB_I420: 100,
    COLOR_YUV2BGR_I420: 101,
    COLOR_YUV420p2RGB: 98,
    COLOR_YUV420p2BGR: 99,
    COLOR_YUV2RGBA_YV12: 102,
    COLOR_YUV2BGRA_YV12: 103,
    COLOR_YUV2RGBA_IYUV: 104,
    COLOR_YUV2BGRA_IYUV: 105,
    COLOR_YUV2RGBA_I420: 104,
    COLOR_YUV2BGRA_I420: 105,
    COLOR_YUV420p2RGBA: 102,
    COLOR_YUV420p2BGRA: 103,
    COLOR_YUV2GRAY_420: 106,
    COLOR_YUV2GRAY_NV21: 106,
    COLOR_YUV2GRAY_NV12: 106,
    COLOR_YUV2GRAY_YV12: 106,
    COLOR_YUV2GRAY_IYUV: 106,
    COLOR_YUV2GRAY_I420: 106,
    COLOR_YUV420sp2GRAY: 106,
    COLOR_YUV420p2GRAY: 106,
    COLOR_YUV2RGB_UYVY: 107,
    COLOR_YUV2BGR_UYVY: 108,
    COLOR_YUV2RGB_Y422: 107,
    COLOR_YUV2BGR_Y422: 108,
    COLOR_YUV2RGB_UYNV: 107,
    COLOR_YUV2BGR_UYNV: 108,
    COLOR_YUV2RGBA_UYVY: 111,
    COLOR_YUV2BGRA_UYVY: 112,
    COLOR_YUV2RGBA_Y422: 111,
    COLOR_YUV2BGRA_Y422: 112,
    COLOR_YUV2RGBA_UYNV: 111,
    COLOR_YUV2BGRA_UYNV: 112,
    COLOR_YUV2RGB_YUY2: 115,
    COLOR_YUV2BGR_YUY2: 116,
    COLOR_YUV2RGB_YVYU: 117,
    COLOR_YUV2BGR_YVYU: 118,
    COLOR_YUV2RGB_YUYV: 115,
    COLOR_YUV2BGR_YUYV: 116,
    COLOR_YUV2RGB_YUNV: 115,
    COLOR_YUV2BGR_YUNV: 116,
    COLOR_YUV2RGBA_YUY2: 119,
    COLOR_YUV2BGRA_YUY2: 120,
    COLOR_YUV2RGBA_YVYU: 121,
    COLOR_YUV2BGRA_YVYU: 122,
    COLOR_YUV2RGBA_YUYV: 119,
    COLOR_YUV2BGRA_YUYV: 120,
    COLOR_YUV2RGBA_YUNV: 119,
    COLOR_YUV2BGRA_YUNV: 120,
    COLOR_YUV2GRAY_UYVY: 123,
    COLOR_YUV2GRAY_YUY2: 124,
    COLOR_YUV2GRAY_Y422: 123,
    COLOR_YUV2GRAY_UYNV: 123,
    COLOR_YUV2GRAY_YVYU: 124,
    COLOR_YUV2GRAY_YUYV: 124,
    COLOR_YUV2GRAY_YUNV: 124,
    COLOR_RGBA2mRGBA: 125,
    COLOR_mRGBA2RGBA: 126,
    COLOR_RGB2YUV_I420: 127,
    COLOR_BGR2YUV_I420: 128,
    COLOR_RGB2YUV_IYUV: 127,
    COLOR_BGR2YUV_IYUV: 128,
    COLOR_RGBA2YUV_I420: 129,
    COLOR_BGRA2YUV_I420: 130,
    COLOR_RGBA2YUV_IYUV: 129,
    COLOR_BGRA2YUV_IYUV: 130,
    COLOR_RGB2YUV_YV12: 131,
    COLOR_BGR2YUV_YV12: 132,
    COLOR_RGBA2YUV_YV12: 133,
    COLOR_BGRA2YUV_YV12: 134,
    COLOR_BayerBG2BGR: 46,
    COLOR_BayerGB2BGR: 47,
    COLOR_BayerRG2BGR: 48,
    COLOR_BayerGR2BGR: 49,
    COLOR_BayerBG2RGB: 48,
    COLOR_BayerGB2RGB: 49,
    COLOR_BayerRG2RGB: 46,
    COLOR_BayerGR2RGB: 47,
    COLOR_BayerBG2GRAY: 86,
    COLOR_BayerGB2GRAY: 87,
    COLOR_BayerRG2GRAY: 88,
    COLOR_BayerGR2GRAY: 89,
    COLOR_BayerBG2BGR_VNG: 62,
    COLOR_BayerGB2BGR_VNG: 63,
    COLOR_BayerRG2BGR_VNG: 64,
    COLOR_BayerGR2BGR_VNG: 65,
    COLOR_BayerBG2RGB_VNG: 64,
    COLOR_BayerGB2RGB_VNG: 65,
    COLOR_BayerRG2RGB_VNG: 62,
    COLOR_BayerGR2RGB_VNG: 63,
    COLOR_BayerBG2BGR_EA: 135,
    COLOR_BayerGB2BGR_EA: 136,
    COLOR_BayerRG2BGR_EA: 137,
    COLOR_BayerGR2BGR_EA: 138,
    COLOR_BayerBG2RGB_EA: 137,
    COLOR_BayerGB2RGB_EA: 138,
    COLOR_BayerRG2RGB_EA: 135,
    COLOR_BayerGR2RGB_EA: 136,
    COLOR_BayerBG2BGRA: 139,
    COLOR_BayerGB2BGRA: 140,
    COLOR_BayerRG2BGRA: 141,
    COLOR_BayerGR2BGRA: 142,
    COLOR_BayerBG2RGBA: 141,
    COLOR_BayerGB2RGBA: 142,
    COLOR_BayerRG2RGBA: 139,
    COLOR_BayerGR2RGBA: 140,
    COLOR_BGRA2YCbCr: 143,
    COLOR_RGBA2YCbCr: 144,
    COLOR_YCbCr2BGRA: 145,
    COLOR_YCbCr2RGBA: 146,
    COLOR_BGBA2YCbCr_nv12: 147,
    COLOR_RGBA2YUV: 148,
    COLOR_YUV2RGBA: 149,
    COLOR_COLORCVT_MAX: 150,
    COLOR_RGBA2YUV_NV12: 151,
};

MobileCV2.ShapeMatchModes = {
    CONTOURS_MATCH_I1: 1,
    CONTOURS_MATCH_I2: 2,
    CONTOURS_MATCH_I3: 3,
};

MobileCV2.CovarFlags = {
    COVAR_SCRAMBLED: 0,
    COVAR_NORMAL: 1,
    COVAR_USE_AVG: 2,
    COVAR_SCALE: 4,
    COVAR_ROWS: 8,
    COVAR_COLS: 16,
};

MobileCV2.DataType = {
    CV_8U: 0,
    CV_8UC1: 0,
    CV_8UC2: 8,
    CV_8UC3: 16,
    CV_8UC4: 24,
    CV_8S: 1,
    CV_8SC1: 1,
    CV_8SC2: 9,
    CV_8SC3: 17,
    CV_8SC4: 25,
    CV_16U: 2,
    CV_16UC1: 2,
    CV_16UC2: 10,
    CV_16UC3: 18,
    CV_16UC4: 26,
    CV_16S: 3,
    CV_16SC1: 3,
    CV_16SC2: 11,
    CV_16SC3: 19,
    CV_16SC4: 27,
    CV_32S: 4,
    CV_32SC1: 4,
    CV_32SC2: 12,
    CV_32SC3: 20,
    CV_32SC4: 28,
    CV_32F: 5,
    CV_32FC1: 5,
    CV_32FC2: 13,
    CV_32FC3: 21,
    CV_32FC4: 29,
    CV_64F: 6,
    CV_64FC1: 6,
    CV_64FC2: 14,
    CV_64FC3: 22,
    CV_64FC4: 30,
};

const Bach = {};

Bach.AEPixelFormat = {
    INVALID: -1,
    RGBA8UNORM: 0,
    BGRA8UNORM: 1,
    BGR8UNORM: 2,
    RGB8UNORM: 3,
    GRAY8: 4,
    YUV420P: 5,
    NV12: 6,
    NV21: 7,
    RG8UNORM: 8,
    RGBA16SFLOAT: 9,
    RGBA32SFLOAT: 10,
};

Bach.Compute = {};

Bach.Compute.OperatorType = {
    CUSTOM: 0,
    AFFINE_WARP: 1,
    ALPHA_BLEND: 2,
    INFERENCE: 3,
    INVALID: 4,
};

Bach.Compute.BackendType = {
    CPU: 0,
    GLES30: 1,
    GLES31: 2,
    METAL: 3,
    COREML: 4,
    GPU_AUTO: 5,
    INVALID: 6,
};

const vertexShader = `precision lowp float;
attribute vec3 inPosition;
attribute vec2 inTexCoord;
varying vec2 fragTexCoord;
void main() {
    gl_Position = vec4(inPosition, 1.0);
    fragTexCoord = inTexCoord;
}
`;

const alphaBlendFragmentShader = `precision lowp float;
uniform sampler2D _MainTex;
uniform vec4 convert_alpha;
uniform vec4 convert_beta;
varying vec2 fragTexCoord;
void main()
{
    gl_FragColor = texture2D(_MainTex, fragTexCoord) * convert_alpha + convert_beta;
}
`;

const affineWarpFragmentShader = `precision lowp float;
uniform sampler2D _MainTex;
uniform mat3 invTransMatrix;
uniform vec4 convert_alpha;
uniform vec4 convert_beta;
varying vec2 fragTexCoord;

void main()
{
    vec3 uv = invTransMatrix * vec3(fragTexCoord.xy, 1.0);
    gl_FragColor = texture2D(_MainTex, uv.xy) * convert_alpha + convert_beta;
}
`;

Bach.Compute.Shaders = {
    vertexShader,
    affineWarpFragmentShader,
    alphaBlendFragmentShader,
};

class Pipeline {
    constructor(pipeline) {
        this.pipeline = pipeline;
        this.textures = {};
    }
    setProperty(key, value) {
        return this.pipeline.setProperty(key, value);
    }
    dispatch() {
        const ExecStatus = {
            NOT_INITIALIZED: 0,
            SUCCESS: 1,
            FAIL: 2,
        };
        let errCode = this.pipeline.dispatch();
        switch (errCode) {
            default:
                return errCode;
            case ExecStatus.SUCCESS:
                return 0;
            case ExecStatus.FAIL:
                return -1;
            case ExecStatus.NOT_INITIALIZED:
                return -2;
        }
    }
    setInputBuffer(name, texture) {
        return this.pipeline.setInputBuffer(name, texture);
    }
    setOutputBuffer(name, texture) {
        return this.pipeline.setOutputBuffer(name, texture);
    }
    // only for inference pipeline
    loadModel(model, oclKernelBinPath, runtimeLibLoadingPath) {
        return this.pipeline.loadModel(
            model,
            oclKernelBinPath,
            runtimeLibLoadingPath
        );
    }
    // only for affine/blend pipeline
    setConvertAlpha(vec) {
        let value = new Amaz.Vector4f(vec[0], vec[1], vec[2], vec[3]);
        return this.setProperty("convert_alpha", value);
    }
    setConvertBeta(vec) {
        let value = new Amaz.Vector4f(vec[0], vec[1], vec[2], vec[3]);
        return this.setProperty("convert_beta", value);
    }
    // only for affine pipeline
    setTransformMatrix(vec) {
        let value = new Amaz.Matrix3x3f(
            vec[0],
            vec[1],
            vec[2],
            vec[3],
            vec[4],
            vec[5],
            vec[6],
            vec[7],
            vec[8]
        );
        return this.setProperty("invTransMatrix", value);
    }
}
Bach.Compute.Pipeline = Pipeline;

Bach.Compute.createTexture = (engine, width, height, format) => {
    return engine.createTex(width, height, format);
};

Bach.Compute.createPipeline = (engine, type, backendType) => {
    return new Pipeline(engine.createPipeline(type, backendType));
};

Bach.Compute.createCustomPipeline = (engine, vertexShader, fragmentShader) => {
    return new Pipeline(
        engine.createPipeline(
            Bach.Compute.OperatorType.CUSTOM,
            Bach.Compute.BackendType.GLES30,
            { vert: vertexShader, frag: fragmentShader }
        )
    );
};

/* model's format
model = {
    name: "sample",
    forwardType: 1,
    inputs: [
        { name: "data1", size: [512, 512], format: 10 },
        { name: "data2", size: [512, 512], format: 10 },
    ],
    outputs: [
        { name: "Tanh_1", size: [512, 512], format: 10 },
        { name: "Tanh_2", size: [512, 512], format: 10 },
    ],
};
*/

Bach.Compute.createInferenceTextures = (engine, model) => {
    const createTextures = (infos) => {
        let textures = [];
        for (let info of infos) {
            let name = info.name;
            let size = info.size;
            let format = info.format;
            let texture = Bach.Compute.createTexture(
                engine,
                size[0],
                size[1],
                format
            );
            textures.push({ name, size, format, texture });
        }
        return textures;
    };
    let inputs = createTextures(model.inputs);
    let outputs = createTextures(model.outputs);
    return { inputs, outputs };
};

Bach.Compute.copyInferenceTextures = (engine, textures) => {
    return Bach.Compute.createInferenceTextures(engine, textures);
};

Bach.Compute.applyInferenceTextures = (pipeline, textures) => {
    for (let texture of textures.inputs) {
        pipeline.setInputBuffer(texture.name, texture.texture);
    }
    for (let texture of textures.outputs) {
        pipeline.setOutputBuffer(texture.name, texture.texture);
    }
};

Bach.Compute.createInferencePipeline = (engine, model) => {
    let forwardType = model.forwardType;
    let backendType = null;
    if (forwardType == ByteNN.ForwardType.CoreML) {
        backendType = Bach.Compute.BackendType.COREML;
    } else {
        backendType = Bach.Compute.BackendType.GPU_AUTO;
    }
    let pipeline = Bach.Compute.createPipeline(
        engine,
        Bach.Compute.OperatorType.INFERENCE,
        backendType
    );
    pipeline.setProperty("type", forwardType);
    let textures = Bach.Compute.createInferenceTextures(engine, model);
    pipeline.textures = textures;
    const createTextureNames = (textures) => {
        let names = new Amaz.StringVector();
        for (let texture of textures) {
            names.pushBack(texture.name);
        }
        return names;
    };
    let inputNames = createTextureNames(textures.inputs);
    let outputNames = createTextureNames(textures.outputs);
    pipeline.setProperty("inputNames", inputNames);
    pipeline.setProperty("outputNames", outputNames);
    Bach.Compute.applyInferenceTextures(pipeline, textures);
    return pipeline;
};

Bach.Compute.createAffineWarpPipeline = (engine) => {
    let pipeline = Bach.Compute.createCustomPipeline(
        engine,
        Bach.Compute.Shaders.vertexShader,
        Bach.Compute.Shaders.affineWarpFragmentShader
    );
    pipeline.setConvertAlpha([1, 1, 1, 1]);
    pipeline.setConvertBeta([0, 0, 0, 0]);
    return pipeline;
};

Bach.Compute.createAlphaBlendPipeline = (engine) => {
    let pipeline = Bach.Compute.createCustomPipeline(
        engine,
        Bach.Compute.Shaders.vertexShader,
        Bach.Compute.Shaders.alphaBlendFragmentShader
    );
    pipeline.setConvertAlpha([1, 1, 1, 1]);
    pipeline.setConvertBeta([0, 0, 0, 0]);
    return pipeline;
};

Bach.Compute.normalizeAffine = (affine, srcSize, dstSize) => {
    let xs = srcSize[0];
    let ys = srcSize[1];
    let xd = dstSize[0];
    let yd = dstSize[1];
    return new Amaz.Matrix3x3f(
        affine.get(0, 0) * (xd / xs), // 0,0
        affine.get(1, 0) * (xd / ys), // 1,0
        affine.get(2, 0) * xd, // 2,0
        affine.get(0, 1) * (yd / xs), // 0,1
        affine.get(1, 1) * (yd / ys), // 1,1
        affine.get(2, 1) * yd, // 2,1
        affine.get(0, 2) * (1 / xs), // 0,2
        affine.get(1, 2) * (1 / ys), // 1,2
        affine.get(2, 2) * 1 // 2,2
    );
};

class Engine {
    constructor() {
        this.engine = null;
        this.config = {};
        this.tensors = {};
        this.ready = false;
    }
    setProperties(properties) {
        for (let key in properties) {
            this.config[key] = properties[key];
        }
    }
    setInputTensors(tensors) {
        return this.engine.SetInput(tensors);
    }
    getOutputTensors() {
        let tensors = [];
        this.engine.GetOutput(tensors);
        this.tensors.outputs = tensors;
        return tensors;
    }
    release() {
        return this.engine.Release();
    }
    inference() {
        return this.engine.Inference();
    }
    isReady() {
        if (!this.ready) {
            return false;
        }
        if (this.tensors.inputs == null) {
            let inputTensors = [];
            let outputTensors = [];
            this.engine.GetInputConfig(inputTensors);
            this.engine.GetOutput(outputTensors);
            this.tensors.inputs = inputTensors;
            this.tensors.outputs = outputTensors;
        }
        return true;
    }
    loadModel(model, oclKernelBinPath, runtimeLibLoadingPath) {
        console.error(`oclKernelBinPath: ${oclKernelBinPath}`);
        console.error(`runtimeLibLoadingPath: ${runtimeLibLoadingPath}`);
        let config = new Amaz.JSWrapByteNNConfig();
        config.oclKernelBinPath = oclKernelBinPath;
        config.runtimeLibLoadingPath = runtimeLibLoadingPath;
        config.modelBuffer = model.pData;
        config.modelBufferSize = model.length;
        const setConfig = (keys) => {
            for (let key of keys) {
                let value = this.config[key];
                if (value != null) {
                    config[key] = value;
                }
            }
        };
        setConfig([
            "type",
            "doModelValidation",
            "numThread",
            "inputNames",
            "outputNames",
            "modelName",
            "power",
            "precision",
        ]);
        let engine = new Amaz.JSWrapByteNNEngine();
        let errCode = 0;
        let asyncLoad = Boolean(this.config.asyncLoad);
        let alg = this.config.alg;
        if (asyncLoad && alg != null) {
            console.log("[InferenceEngine]: async load model");
            this.engineConfig = config;
            errCode = engine.Init(
                config,
                (result) => {
                    if (result.code == 0) {
                        this.ready = true;
                        console.log("[InferenceEngine]: load model success");
                    } else {
                        this.ready = false;
                        console.log("[InferenceEngine]: load model failed");
                    }
                },
                alg
            );
        } else {
            this.ready = true;
            errCode = engine.Init(config);
        }
        if (errCode != 0) {
            this.ready = false;
            return errCode;
        }
        this.engine = engine;
        this.isReady();
        return 0;
    }
}
Bach.Compute.Engine = Engine;

Bach.Compute.createInferenceEngine = (model) => {
    let engine = new Bach.Compute.Engine();
    let properties = {};
    // properties.type = model.forwardType;
    properties.type = 3; //force to run npu
    properties.modelName = model.name;
    properties.doModelValidation = model.doModelValidation;
    properties.numThread = model.numThread;
    const getTensorNames = (tensors) => {
        let names = [];
        for (let tensor of tensors) {
            names.push(tensor.name);
        }
        return names;
    };
    properties.inputNames = getTensorNames(model.inputs);
    properties.outputNames = getTensorNames(model.outputs);
    engine.setProperties(properties);
    return engine;
};

exports.ByteNN = ByteNN;
exports.MobileCV2 = MobileCV2;
exports.Bach = Bach;
exports.Amaz = Amaz;
