const { Amaz, Bach, MobileCV2, ByteNN } = require("./bach");

const AEPixelFormat = Bach.AEPixelFormat;
const cv = Amaz.JSWrapCV;
const cvType = MobileCV2.DataType;
const cvCodes = MobileCV2.ColorConversionCodes;

class MainSystem {
    constructor() {
        this.name = "MainSystem";
        this.params = {};
        this.params.script_path = "AmazingFeature/alg/MainSystem.js";
        this.params.face_count = 1;
        this.params.face_adjust_yunfu = "";
        this.params.face_adjust_fuling = "";
        this.params.face_adjust_lunkuopinghua = "";
    }

    log(...args) {
        //console.warn(...args);
    }

    parseModelConfig() {
        let configStr = this.MainSystemAlg.getParam("model_config");
        console.log(`[parseModelConfig]: parsing ${configStr}`);

        let modelConfigs = {};
        try {
            modelConfigs = JSON.parse(configStr);
        } catch (error) {
            console.error(`[parseModelConfig]: parse ${configStr} failed`);
            return;
        }

        for (let key in modelConfigs) {
            this.modelConfigs[key] = modelConfigs[key];
        }
    }

    loadCpuModel(model) {
        console.log(`[loadCpuModel]: loading model ${model.name}, path ${model.path}`);
        let modelName = "yunfu";
        let modelConfig = this.modelConfigs[modelName];
        if (modelConfig == null) {
            console.error(`[loadCpuModel]: modelConfig is null`);
            return 0x10;
        }
        if (this.platform == "Mac") {
            modelConfig.forwardType = ByteNN.ForwardType.METAL;
        }
        if (this.u8_mode) {
            modelConfig.forwardType = ByteNN.ForwardType.OPENCL;
        }
        let engine = Bach.Compute.createInferenceEngine(modelConfig);
        if (this.u8_mode) {
            engine.setProperties({
                precision: ByteNN.PrecisionMode.LowPrecision,
            });
        }
        let cacheDir = this.MainSystemAlg.getCacheDir();
        let errCode = engine.loadModel(model, cacheDir, cacheDir);
        if (errCode != 0) {
            console.error(`[loadCpuModel]: bytenn init failed: ${errCode}`);
            return 0x100;
        }
        this.gamma = modelConfig.gamma;
        this.inferenceEngine = engine;
        this.inferenceTensors = engine.tensors;
        return 0;
    }

    loadGpuModel(model) {
        console.log(`[loadGpuModel]: loading model ${model.name}`);
        let modelName = "yunfu";
        let modelConfig = this.modelConfigs[modelName];
        if (modelConfig == null) {
            console.error(`[loadCpuModel]: modelConfig is null`);
            return 0x10;
        }
        let pipeline = Bach.Compute.createInferencePipeline(
            this.computeEngine,
            modelConfig
        );
        let cacheDir = this.MainSystemAlg.getCacheDir();
        let errCode = pipeline.loadModel(model, cacheDir, cacheDir);
        if (errCode != 0) {
            console.error(`[loadGpuModel]: bytenn init failed: ${errCode}`);
            return 0x100;
        }
        this.gamma = modelConfig.gamma;
        this.inferencePipeline = pipeline;
        this.inferenceTextures = [pipeline.textures];
        return 0;
    }

    doLoadModel(model) {
        this.parseModelConfig();
        if (this.gpu_mode) {
            return this.loadGpuModel(model);
        } else {
            return this.loadCpuModel(model);
        }
    }

    doInit(alg) {
        console.log("doInit");
        alg.addOutputType(0, Amaz.AlgorithmResultType.SCRIPT);
        alg.addOutputType(1, Amaz.AlgorithmResultType.SCRIPT);
        this.MainSystemAlg = alg;

        let engine = alg.app.engine;
        this.computeEngine = engine;

        let gpu_mode = alg.getParam("gpu_mode");
        this.gpu_mode = gpu_mode == 1;

        let u8_mode = alg.getParam("u8_mode");
        this.u8_mode = u8_mode == 1 && !this.gpu_mode;

        this.platform = Amaz.Platform.name();
        this.log(`[doInit]: platform: ${this.platform}`);

        let face_count = alg.getParam("face_count");
        if (face_count != null) {
            this.params.face_count = face_count;
        }

        this.faceAdjustValues = {};
        this.faceIdMap = {};
        this.freidIdMap = {};
        this.modelConfigs = {};
        if (this.gpu_mode) {
            this.inferencePipeline = null;
            this.inferenceTextures = null;
        } else {
            this.inferenceEngine = null;
            this.inferenceTensors = null;
        }

        let model_key = alg.getParam("model_key");
        this.model_key = model_key;
        let u8_model_key = alg.getParam("u8_model_key");
        this.u8_model_key = u8_model_key;

        model_key = this.u8_mode ? u8_model_key : model_key;
        console.log(`[doInit]: loading model ${model_key}`);
        alg.loadAlgorithmModel(model_key);
        if (this.gpu_mode && this.inferencePipeline == null) {
            console.log(`[doInit]: load gpu model failed, try cpu mode`);
            this.gpu_mode = false;
            alg.loadAlgorithmModel(this.model_key);
        }
        if (this.u8_mode && this.inferenceEngine == null) {
            console.log(`[doInit]: load u8 model failed, try fp32 mode`);
            this.u8_mode = false;
            alg.loadAlgorithmModel(this.model_key);
        }
        if (this.gpu_mode) {
            this.affineWarpPipeline =
                Bach.Compute.createAffineWarpPipeline(engine);
            this.alphaBlendPipeline =
                Bach.Compute.createAlphaBlendPipeline(engine);
            this.latentInTexture = Bach.Compute.createTexture(
                engine,
                1,
                1,
                AEPixelFormat.RGBA32SFLOAT
            );
        } else {
            this.latentImage = new Float32Array([0.0, 0.0, 0.0]);
            this.latentImageU8 = new Uint8Array([0, 0, 0]);
            this.cropImageF32 = cv.Mat();
            this.cropImageU8 = cv.Mat();
            this.ganImageU8 = cv.Mat();
            this.flowImageU8Half = cv.Mat();
            this.flowImageU8 = cv.Mat();
        }
    }

    doDestroy() {
        console.log("doDestroy");
    }

    parseFaceAdjustParamsForType(type, str) {
        if (str.length == 0) return;
        let values = null;
        try {
            values = JSON.parse(str);
        } catch (error) {
            console.error(
                `[parseFaceAdjustParams]: parse ${str} for ${type} failed`
            );
            return;
        }
        let faceAdjustValues = {};
        for (const value of values) {
            let index = value.id;
            let intensity = value.intensity;
            if (intensity == null || intensity < 0 || intensity > 1) continue;
            faceAdjustValues[index] = intensity;
        }
        this.faceAdjustValues[type] = faceAdjustValues;
    }

    parseFaceAdjustParams() {
        this.parseFaceAdjustParamsForType(0, this.params.face_adjust_yunfu);
        this.parseFaceAdjustParamsForType(1, this.params.face_adjust_fuling);
        this.parseFaceAdjustParamsForType(
            2,
            this.params.face_adjust_lunkuopinghua
        );
    }

    doApply(dirtyParams) {
        let filterKeySet = new Set(["face_count"]);
        let faceAdjustParams = new Set([
            "face_adjust_yunfu",
            "face_adjust_fuling",
            "face_adjust_lunkuopinghua",
        ]);
        for (const param of faceAdjustParams) {
            filterKeySet.add(param);
        }
        let keySet = dirtyParams.getVectorKeys();
        let faceAdjustParamsChanged = false;
        for (let i = 0; i < keySet.size(); ++i) {
            let theKey = keySet.get(i);
            if (!filterKeySet.has(theKey)) continue;
            let theValue = dirtyParams.get(theKey);
            if (this.params[theKey] != theValue) {
                this.params[theKey] = theValue;
                if (faceAdjustParams.has(theKey)) {
                    faceAdjustParamsChanged = true;
                }
            }
        }
        if (faceAdjustParamsChanged) {
            this.parseFaceAdjustParams();
        }
    }

    resizeInferenceTextures(length) {
        if (length <= this.inferenceTextures.length) return;
        let currentLength = this.inferenceTextures.length;
        let textures = this.inferenceTextures[0];
        for (let i = currentLength; i < length; ++i) {
            this.inferenceTextures.push(
                Bach.Compute.copyInferenceTextures(this.computeEngine, textures)
            );
        }
    }

    updateFaceIdMap(input) {
        let map = {};
        let count = input.getFreidInfoCount();
        this.log(`[updateFaceIdMap]: freidInfoCount ${count}`);
        for (let i = 0; i < count; ++i) {
            let freidInfo = input.getFreidInfo(i);
            let faceId = freidInfo.faceid;
            let trackId = freidInfo.trackid;
            map[faceId] = trackId;
            this.log(`[updateFaceIdMap]: trackId ${faceId} -> ${trackId}`);
        }
        this.freidIdMap = map;
        map = {};
        count = input.getFaceCount();
        this.log(`[updateFaceIdMap]: faceCount ${count}`);
        for (let i = 0; i < count; ++i) {
            let faceInfo = input.getFaceBaseInfo(i);
            let faceId = faceInfo.ID;
            map[i] = faceId;
            this.log(`[updateFaceIdMap]: faceId ${i} -> ${faceId}`);
        }
        this.faceIdMap = map;
    }

    getIntensitiesForFace(index) {
        let intensities = [0, 0, 0];
        let faceId = this.faceIdMap[index];
        let traceId = this.freidIdMap[faceId];
        if (traceId != null) {
            for (let i = 0; i < 3; ++i) {
                let faceAdjustValues = this.faceAdjustValues[i];
                if (faceAdjustValues == null) continue;
                if (faceAdjustValues[traceId] != null) {
                    intensities[i] = faceAdjustValues[traceId];
                } else if (faceAdjustValues[-1] != null) {
                    intensities[i] = faceAdjustValues[-1];
                }
            }
        } else {
            this.log(`[updateLatentImageForFace]: traceId is null`);
        }
        this.log(
            `[getIntensitiesForFace]: ${index} -> intensities ${intensities[0]}, ${intensities[1]}, ${intensities[2]}`
        );
        return intensities;
    }

    updateLatentImage(intensities, image) {
        for (let i = 0; i < 3; ++i) {
            image[i] = intensities[i];
        }
    }

    updateLatentTexture(intensities, texture) {
        this.alphaBlendPipeline.setConvertAlpha([0, 0, 0, 0]);
        this.alphaBlendPipeline.setConvertBeta([
            intensities[0],
            intensities[1],
            intensities[2],
            0.0,
        ]);
        this.alphaBlendPipeline.setInputBuffer(
            "_MainTex",
            this.latentInTexture
        );
        this.alphaBlendPipeline.setOutputBuffer("output", texture);
        this.alphaBlendPipeline.dispatch();
    }

    checkIntensityValidity(intensities) {
        return (
            intensities[0] != 0 || intensities[1] != 0 || intensities[2] != 0
        );
    }

    doExecute(nodeContext) {
        if (this.gpu_mode) {
            return this.doExecuteGpu(nodeContext);
        } else {
            return this.doExecuteCpu(nodeContext);
        }
    }

    doExecuteCpu(nodeContext) {
        if (this.inferenceEngine == null) return;

        const DefaultGraph = nodeContext.graphName;
        const FaceAlignNode = "FaceAlign_jybeauty";

        let engine = this.computeEngine;

        let input = nodeContext.getInputResult();
        let nhFaceCount = input.getNHImageInfoCount(
            DefaultGraph,
            FaceAlignNode
        );
        if (nhFaceCount == 0) return 0x81;

        this.updateFaceIdMap(input);

        let outputMap = nodeContext.getOutputMap();
        outputMap.clear();

        let faceCount = Math.min(nhFaceCount, this.params.face_count);

        for (let i = 0; i < faceCount; ++i) {
            let intensities = this.getIntensitiesForFace(i);
            if (!this.checkIntensityValidity(intensities)) {
                this.log(`[doExecuteCpu]: skip face ${i}`);
                continue;
            }
            outputMap.set(`gan${i}`, 1);

            let infInTensors = this.inferenceTensors.inputs;
            let infInTensor0 = infInTensors[0];
            let infInTensor1 = infInTensors[1];

            let nhImage = input.getNHImageInfo(DefaultGraph, FaceAlignNode, i);
            let cropImage = cv.Mat(nhImage.image);

            if (this.u8_mode) {
                this.cropImageU8 = cropImage;
                infInTensor0.raw_data = this.cropImageU8.data;
            } else {
                cv.cvtColor(
                    cropImage,
                    this.cropImageU8,
                    cvCodes.COLOR_RGBA2RGB
                );
                this.cropImageU8.convertTo(
                    this.cropImageF32,
                    cvType.CV_32FC3,
                    2 / 255,
                    -1
                );
                infInTensor0.raw_data = this.cropImageF32.data;
            }

            this.updateLatentImage(intensities, this.latentImage);
            if (this.u8_mode) {
                for (let j = 0; j < this.latentImage.length; ++j) {
                    this.latentImageU8[j] = this.latentImage[j] * 255;
                }
                infInTensor1.raw_data = this.latentImageU8.buffer;
            } else {
                infInTensor1.raw_data = this.latentImage.buffer;
            }
            this.inferenceEngine.setInputTensors(infInTensors);
            this.inferenceEngine.inference();

            let infOutTensors = this.inferenceEngine.getOutputTensors();
            if (this.u8_mode) {
                let infOutTensor0 = infOutTensors[0];
                let outImage = cv.Mat(infOutTensor0);
                this.log(
                    `[doExecuteCpu]: outImage ${outImage.cols}x${outImage.rows}`
                );
                let width = outImage.cols / 2;
                let height = outImage.rows;
                let ganImage = cv.Mat(outImage, [0, 0, width, height]);
                let flowImage = cv.Mat(outImage, [width, 0, width, height]);
                this.ganImageU8 = ganImage.deepCopy();
                this.flowImageU8 = flowImage.deepCopy();
            } else {
                let infOutTensor0 = infOutTensors[0];
                let infOutTensor1 = infOutTensors[1];
                let ganImage = cv.Mat(infOutTensor0);
                ganImage.convertTo(
                    this.ganImageU8,
                    cvType.CV_8UC4,
                    255 / 2,
                    255 / 2
                );
                let flowImage = cv.Mat(infOutTensor1);
                flowImage.convertTo(
                    this.flowImageU8Half,
                    cvType.CV_8UC2,
                    (255 / 2) * this.gamma * 8,
                    255 / 2
                );
                cv.merge(
                    [this.flowImageU8Half, this.flowImageU8Half],
                    this.flowImageU8
                );
            }

            let ganTex = nodeContext.getOutputGPUTexture(
                engine,
                this.ganImageU8.cols,
                this.ganImageU8.rows,
                AEPixelFormat.RGBA8UNORM,
                i * 2,
                1
            );
            ganTex.loadCPUData(this.ganImageU8.data);

            let flowTex = nodeContext.getOutputGPUTexture(
                engine,
                this.flowImageU8.cols,
                this.flowImageU8.rows,
                AEPixelFormat.RGBA8UNORM,
                i * 2 + 1,
                1
            );
            flowTex.loadCPUData(this.flowImageU8.data);
        }
    }

    doExecuteGpu(nodeContext) {
        if (this.inferencePipeline == null) return;

        const DefaultGraph = nodeContext.graphName;
        const FaceAlignNode = "FaceAlign_jybeauty";

        let engine = this.computeEngine;

        let input = nodeContext.getInputResult();
        let nhFaceCount = input.getNHImageTfmCount(DefaultGraph, FaceAlignNode);
        if (nhFaceCount == 0) return 0x81;

        this.updateFaceIdMap(input);

        let faceCount = Math.min(nhFaceCount, this.params.face_count);

        let blitImage = input.getBlitImage(DefaultGraph, "blit_0");
        let cameraTex = nodeContext.getInputGPUTexture(engine, "src_data_0");
        let outputMap = nodeContext.getOutputMap();
        outputMap.clear();

        this.resizeInferenceTextures(faceCount);

        for (let i = 0; i < faceCount; ++i) {
            let intensities = this.getIntensitiesForFace(i);
            if (!this.checkIntensityValidity(intensities)) {
                this.log(`[doExecuteGpu]: skip face ${i}`);
                continue;
            }
            outputMap.set(`gan${i}`, 1);

            let infTexes = this.inferenceTextures[i];
            let infInTex0 = infTexes.inputs[0].texture;
            let infInTex1 = infTexes.inputs[1].texture;
            let infOutTex0 = infTexes.outputs[0].texture;
            let infOutTex1 = infTexes.outputs[1].texture;

            let tfmInfo = input.getNHImageTfmInfo(
                DefaultGraph,
                FaceAlignNode,
                i
            );
            let affine = Bach.Compute.normalizeAffine(
                tfmInfo.affine,
                [blitImage.width - 0.5, blitImage.height - 0.5],
                [infInTex0.width, infInTex0.height]
            );

            this.affineWarpPipeline.setProperty("invTransMatrix", affine);
            this.affineWarpPipeline.setInputBuffer("_MainTex", cameraTex);
            this.affineWarpPipeline.setOutputBuffer("output", infInTex0);
            this.affineWarpPipeline.setConvertAlpha([2, 2, 2, 2]);
            this.affineWarpPipeline.setConvertBeta([-1, -1, -1, -1]);
            this.affineWarpPipeline.dispatch();

            this.updateLatentTexture(intensities, infInTex1);

            Bach.Compute.applyInferenceTextures(
                this.inferencePipeline,
                infTexes
            );
            this.inferencePipeline.dispatch();

            let ganTex = nodeContext.getOutputGPUTexture(
                engine,
                infOutTex0.width,
                infOutTex0.height,
                AEPixelFormat.RGBA8UNORM,
                i * 2,
                1
            );

            this.alphaBlendPipeline.setInputBuffer("_MainTex", infOutTex0);
            this.alphaBlendPipeline.setOutputBuffer("output", ganTex);
            this.alphaBlendPipeline.setConvertAlpha([0.5, 0.5, 0.5, 0.5]);
            this.alphaBlendPipeline.setConvertBeta([0.5, 0.5, 0.5, 0.5]);
            this.alphaBlendPipeline.dispatch();

            let flowTex = nodeContext.getOutputGPUTexture(
                engine,
                infOutTex1.width,
                infOutTex1.height,
                AEPixelFormat.RGBA8UNORM,
                i * 2 + 1,
                1
            );

            let v = 0.5 * this.gamma * 8;
            this.alphaBlendPipeline.setInputBuffer("_MainTex", infOutTex1);
            this.alphaBlendPipeline.setOutputBuffer("output", flowTex);
            this.alphaBlendPipeline.setConvertAlpha([v, v, v, v]);
            this.alphaBlendPipeline.setConvertBeta([0.5, 0.5, 0.5, 0.5]);
            this.alphaBlendPipeline.dispatch();
        }
    }
}

exports.MainSystem = MainSystem;
