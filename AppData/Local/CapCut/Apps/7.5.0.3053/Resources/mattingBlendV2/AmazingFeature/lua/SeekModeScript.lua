--@input float curTime = 0.0{"widget":"slider","min":0,"max":10}

local exports = exports or {}
local SeekModeScript = SeekModeScript or {}
SeekModeScript.__index = SeekModeScript

local INTENSITY_EPSC = 0.001

function SeekModeScript.new(construct, ...)
    local self = setmetatable({}, SeekModeScript)
    if construct and SeekModeScript.constructor then SeekModeScript.constructor(self, ...) end
    self.startTime = 0.0
    self.endTime = 10.0  
    self.curTime = 0.0
    self.width = 0
    self.height = 0
    self.lastfpsNum = -1
    self.speed = 1.0
    
    return self
end

function SeekModeScript:onStart(comp)
    self.blur0mat = comp.entity:getComponent("MeshRenderer").material
    self.myMatting = Amaz.Texture2D()

end

function SeekModeScript:onUpdate(comp, detalTime)
    if math.abs(self.erode_dilate_kernel_size) < INTENSITY_EPSC and self.enable_reverse < 0.5 and self.blur_kernel_size < INTENSITY_EPSC then
        self.blur0mat:setTex("u_mattingmask", self.myMatting)
    else
        local mattingMaskTex = Amaz.BuiltinObject.getUserTexture("#MattingMask")
        self.blur0mat:setTex("u_mattingmask", mattingMaskTex)
    end
end


function SeekModeScript:onEvent(sys,event)
    if event.args:get(0) == "blend_mode"  then
        local mode = event.args:get(1)
        self.blur0mat:setFloat("u_blendMode",mode)
    end
    if event.args:get(0) == "preview_color"  then
        local color = event.args:get(1)
        self.blur0mat:setVec4("u_previewColor", color)
    end

    if event.args:get(0) == "erode_dilate_kernel_size"  then
        self.erode_dilate_kernel_size = event.args:get(1)
    end
    if event.args:get(0) == "blur_kernel_size"  then
        self.blur_kernel_size = event.args:get(1)
    end
    if event.args:get(0) == "enable_reverse" then
        self.enable_reverse = event.args:get(1)
    end
     -- print("event.args.get: ")
    if event.args:get(0) == "segMask"  then
        local bgMask = event.args:get(1)
        if math.abs(self.erode_dilate_kernel_size) < INTENSITY_EPSC and self.enable_reverse < 0.5 and self.blur_kernel_size < INTENSITY_EPSC then
            self.myMatting:storage(bgMask)
        end
    end
end

exports.SeekModeScript = SeekModeScript
return exports