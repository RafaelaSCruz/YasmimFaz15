local exports = exports or {}
local SeekModeScript = SeekModeScript or {}
SeekModeScript.__index = SeekModeScript
function SeekModeScript.new(construct, ...)
    local self = setmetatable({}, SeekModeScript)
    if construct and SeekModeScript.constructor then
        SeekModeScript.constructor(self, ...)
    end
    self.custom_mask_preview_color = Amaz.Vector4f(0.0, 0.0, 0.0, 1.0)
    return self
end

function SeekModeScript:constructor()
end

function SeekModeScript:onUpdate(comp, detalTime)
    self.material:setVec4("u_maskPreviewColor", self.custom_mask_preview_color)
end

function SeekModeScript:onStart(comp)
    self.material = comp.entity:searchEntity("blend"):getComponent("MeshRenderer").material
end

function SeekModeScript:seekToTime(comp, time)
end

function SeekModeScript:onEvent(sys, event)
    if event.type == Amaz.AppEventType.SetEffectIntensity then
        if event.args:get(0) == "previewColor" then
            local value = event.args:get(1)
            self.custom_mask_preview_color = Amaz.Vector4f(value:get(0), value:get(1), value:get(2), value:get(3))
        end
    end
end

exports.SeekModeScript = SeekModeScript
return exports