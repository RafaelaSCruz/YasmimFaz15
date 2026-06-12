---@class SeekModeScript: ScriptComponent
---@field brightnessIntensity number [UI(Range={-1., 1.}, Drag)]

local exports = exports or {}
local SeekModeScript = SeekModeScript or {}
SeekModeScript.__index = SeekModeScript


local function getBrightnessParam(brightnessIntensity)
    local brightnessParam = brightnessIntensity
    if brightnessIntensity > 0 and brightnessIntensity <= 0.7 then
        brightnessParam = 0.3 * brightnessIntensity
    elseif brightnessIntensity > 0.7 and brightnessIntensity <= 1.0 then
        brightnessParam = 0.6333 * brightnessIntensity - 0.2333
    end
    return brightnessParam
end


function SeekModeScript.new(construct, ...)
    local self = setmetatable({}, SeekModeScript)
    if construct and SeekModeScript.constructor then SeekModeScript.constructor(self, ...) end
    self.brightnessIntensity = 0.
    self.brightnessParam = 0.

    return self
end


function SeekModeScript:onStart(comp)
    self.matBrightness = comp.entity:searchEntity("EntityBrightness"):getComponent("MeshRenderer").material
end


function SeekModeScript:onUpdate(comp, deltaTime)
    self.matBrightness:setFloat("u_brightnessParam", self.brightnessParam)
end


function SeekModeScript:onEvent(sys,event)
    if event.type == Amaz.AppEventType.SetEffectIntensity then
        if event.args:get(0) == "intensity" then
            self.brightnessIntensity = event.args:get(1)
            self.brightnessParam = getBrightnessParam(self.brightnessIntensity)
        end
    end
end

exports.SeekModeScript = SeekModeScript
return exports
