--@input float curTime = 0.0{"widget":"slider","min":0,"max":10}

local exports = exports or {}
local SeekModeScript = SeekModeScript or {}
SeekModeScript.__index = SeekModeScript

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
    self.blur0mat:setTex("u_mattingmask", self.myMatting)
    -- self.grabCam = comp.entity.scene:findEntityBy("grabCam")
    -- self.grabCam2 = comp.entity.scene:findEntityBy("grabAlphaCam")
    --"Transform"、"AnimSeqComponent"
end

function SeekModeScript:onUpdate(comp, detalTime)

end


function SeekModeScript:onEvent(sys,event)
    -- print("event.args.get: ")
    if event.args:get(0) == "segMask"  then
        local bgMask = event.args:get(1)
        self.blur0mat:getTex("u_mattingmask"):storage(bgMask)
    end
    if event.args:get(0) == "blend_mode"  then
        local mode = event.args:get(1)
        self.blur0mat:setFloat("u_blendMode",mode)
    end
    if event.args:get(0) == "preview_color"  then
        local color = event.args:get(1)
        self.blur0mat:setVec4("u_previewColor", color)
    end
end

exports.SeekModeScript = SeekModeScript
return exports






