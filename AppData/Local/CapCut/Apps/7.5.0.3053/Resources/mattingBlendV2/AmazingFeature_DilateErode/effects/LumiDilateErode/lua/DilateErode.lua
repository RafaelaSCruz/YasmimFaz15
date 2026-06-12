local exports = exports or {}
local DilateErode = DilateErode or {}
DilateErode.__index = DilateErode
---@class DilateErode: ScriptComponent
---@field erode_dilate_kernel_size number
---@field blur_kernel_size number
---@field enable_reverse number
---@field kernelType number
---@field channel number
---@field mode number
---@field textLines number
---@field inputEdgeSmooth number
---@field InputTex Texture
---@field OutputTex Texture
---@field lumiSharedRt Vector [UI(Type="Texture")]

local AE_EFFECT_TAG = 'AE_EFFECT_TAG LumiTag'

function DilateErode.new(construct, ...)
    local self = setmetatable({}, DilateErode)

    self.InputTex = nil
    self.OutputTex = nil

    return self
end

function DilateErode:onStart(comp)
    self.entity = comp.entity
    self.TAG = AE_EFFECT_TAG .. ' ' .. self.entity.name

    self:start(comp)
end

function DilateErode:start(comp)
    self.first = true
    self.properties = comp.properties

    self.cameraH = comp.entity:searchEntity("Camera_entity_convolution")
    self.cameraV = comp.entity:searchEntity("Camera_entity_convolution_2")
    self.cameraR = comp.entity:searchEntity("Camera_entity_convolution_3")
    self.cameraBlur = comp.entity:searchEntity("Camera_entity_blur")
    self.cameraSmooth = comp.entity:searchEntity("Camera_entity_smooth")
    self.camera = comp.entity:searchEntity("Camera")

    self.materialH = comp.entity:searchEntity("convolution_renderer"):getComponent("MeshRenderer").material
    self.materialV = comp.entity:searchEntity("convolution_renderer_2"):getComponent("MeshRenderer").material
    self.materialR = comp.entity:searchEntity("convolution_renderer_3"):getComponent("MeshRenderer").material
    self.materialBlur = comp.entity:searchEntity("convolution_blur"):getComponent("MeshRenderer").material
    self.materialSmooth = comp.entity:searchEntity("smooth"):getComponent("MeshRenderer").material

    self.hCamera = self.cameraH:getComponent("Camera")
    self.vCamrea = self.cameraV:getComponent("Camera")
    self.rCamera = self.cameraR:getComponent("Camera")
    self.blurCamera = self.cameraBlur:getComponent("Camera")
    self.smoothCamera = self.cameraSmooth:getComponent("Camera")
    self.camera = self.camera:getComponent("Camera")
    
    self.midTex = self.lumiSharedRt:get(0)
    self.midTex02 = self.lumiSharedRt:get(1)
end

function DilateErode:updateMaterial()
    if self.first == nil then
        return
    end
    
    self.materialH:setFloat("kernelSize", self.erode_dilate_kernel_size / 8.0);
    self.materialV:setFloat("kernelSize", self.erode_dilate_kernel_size / 8.0);
    self.materialR:setFloat("kernelSize", self.erode_dilate_kernel_size / 8.0);

    self.materialBlur:setFloat("inputEdgeSmooth", self.blur_kernel_size / 100.0)
    self.materialSmooth:setFloat("inputEdgeSmooth", self.blur_kernel_size / 100.0)
    self.materialSmooth:setFloat("inputSpill", 0.10)
    self.materialSmooth:setFloat("enable_reverse", self.enable_reverse)

    local width = self.OutputTex.width
    local height = self.OutputTex.height
    local rescale = math.min(width, height) / 720
    width = width / rescale
    height = height / rescale
    if width > 0 and height > 0 then
        self.materialBlur:setFloat("widthOffset", 1.0 / width)
        self.materialBlur:setFloat("heightOffset", 1.0 / height)
        self.materialSmooth:setFloat("widthOffset", 1.0 / width)
        self.materialSmooth:setFloat("heightOffset", 1.0 / height)
    else
        self.materialBlur:setFloat("widthOffset", 0.0)
        self.materialBlur:setFloat("heightOffset", 0.0)
        self.materialSmooth:setFloat("widthOffset", 0.0)
        self.materialSmooth:setFloat("heightOffset", 0.0)
    end
    self.materialH:setFloat("channel", self.channel);
    self.materialV:setFloat("channel", self.channel);
    self.materialR:setFloat("channel", self.channel);
    self.materialBlur:setFloat("channel", self.channel);

    self.materialH:setTex("inputImageTexture", self.InputTex)
    self.materialV:setTex("inputImageTexture", self.midTex)
    self.materialV:setTex("inputImageTexture0", self.InputTex)
    self.materialR:setTex("inputImageTexture", self.InputTex)

    self.materialBlur:setTex("alphaMapTexture", self.midTex02)
    self.materialSmooth:setTex("smoothMapTexturex", self.midTex)
    self.materialSmooth:setTex("inputImageTexture", self.midTex02)

    local normSize = 240
    if self.mode < 0.5 then
        normSize = 60 * math.max(1, math.floor(self.textLines+0.5))
    end
    self.materialH:setFloat("normSize", normSize);
    self.materialV:setFloat("normSize", normSize);
    self.materialR:setFloat("normSize", normSize);
    -- self.materialBlur:setFloat("normSize", 240);

    local radius = 11.125
    -- for i=1, math.min(60, math.max(10, math.abs(self.kernelSize*5)+1)) do
    --     radius = radius + 1.0 / radius;
    -- end
    self.materialR:setFloat("radius", radius-1);

    if self.kernelType > 0.5 then
        self.cameraH.visible = false
        self.cameraV.visible = false
        self.cameraR.visible = true
    else
        self.cameraH.visible = true
        self.cameraV.visible = true
        self.cameraR.visible = false
    end

    if self.erode_dilate_kernel_size == 0 then
        -- 没有扩展/腐蚀
        self.cameraH.visible = false
        self.cameraV.visible = false
        self.cameraR.visible = false
        self.materialBlur:setTex("alphaMapTexture", self.InputTex)
    end
end

function DilateErode:onUpdate(comp, detalTime)
    local width = self.OutputTex.width
    local height = self.OutputTex.height
    local rescale = math.min(width, height) / 720
    width = width / rescale
    height = height / rescale
    if self.midTex.width ~= width * .5 or self.midTex.height ~= height * .5 then
        self.midTex.width = width * .5
        self.midTex.height = height * .5
        self.midTex02.width = width * .5
        self.midTex02.height = height * .5
    end
    if self.blur_kernel_size < 20 then
        self.midTex.width = width * (1.0 - 0.5 * self.blur_kernel_size / 20)
        self.midTex.height = height * (1.0 - 0.5 * self.blur_kernel_size / 20)
        self.midTex02.width = width * (1.0 - 0.5 * self.blur_kernel_size / 20)
        self.midTex02.height = height * (1.0 - 0.5 * self.blur_kernel_size / 20)
    end

    if self.first == nil then
        self:start(comp)
    end

    Amaz.BuiltinObject.addUserTexture("#MattingMask", self.OutputTex)

    self.hCamera.renderTexture = self.midTex
    self.vCamrea.renderTexture = self.midTex02
    self.rCamera.renderTexture = self.midTex02
    self.blurCamera.renderTexture = self.midTex
    self.smoothCamera.renderTexture = self.midTex02
    self.camera.renderTexture = self.OutputTex

    local props = comp.entity:getComponent("ScriptComponent").properties
    if props:has("InputTex") then
        self.InputTex = props:get("InputTex")
    end
    if props:has("erode_dilate_kernel_size") then
        self.erode_dilate_kernel_size = props:get("erode_dilate_kernel_size")
    end
    if props:has("blur_kernel_size") then
        self.blur_kernel_size = props:get("blur_kernel_size")
    end
    if props:has("enable_reverse") then
        self.enable_reverse = props:get("enable_reverse")
    end
    if props:has("kernelType") then
        self.kernelType = props:get("kernelType")
    end
    if props:has("channel") then
        self.channel = props:get("channel")
    end


    self:updateMaterial()
end

exports.DilateErode = DilateErode
return exports
