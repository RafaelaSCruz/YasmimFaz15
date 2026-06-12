---@class ScriptComp: ScriptComponent
---@field shadow double [UI(Display="shadow", Range={-1, 1}, Slider)]
---@field highlight double [UI(Display="highlight", Range={-1, 1}, Slider)]


local exports = exports or {}
local ScriptComp = ScriptComp or {}
ScriptComp.__index = ScriptComp


function ScriptComp.new(construct, ...)
    local self = setmetatable({}, ScriptComp)

    if construct and ScriptComp.constructor then ScriptComp.constructor(self, ...) end
    self.shadow = 0
    self.highlight = 0
    return self
end


function ScriptComp:constructor()
end


function ScriptComp:onStart(comp)
    self.shadow = 0
    self.highlight = 0
    self.material = comp.entity.scene:findEntityBy("HighlightShadow"):getComponent("MeshRenderer").material
end


-- Formula of shadow is y = x^a + (a-1)(x^2 - x^3). 
-- Formula of highlight is y = 1 - (1-x)^a - (a-1)((1-x)^2 - (1-x)^3)
-- The following two functions is to obtain `a` in shadow and highlight formulae
-- intensity must be normalized between [-1, 1]
local function getShadowCoef(intensity)
    local p = intensity
    local p2 = p * p
    local p3 = p2 * p
    local p4 = p3 * p
    local res = 1.0 - 0.503 * p + 0.183 * p2 - 0.147 * p3 + 0.067 * p4
    return res
end


local function getHighlightCoef(intensity)
    local p = intensity
    local p2 = p * p
    local p3 = p2 * p
    local p4 = p3 * p
    local res = 1.0 + 0.503 * p + 0.183 * p2 + 0.147 * p3 + 0.067 * p4
    return res
end


function ScriptComp:onUpdate(comp, deltaTime)
    local shadowCoef = getShadowCoef(self.shadow)
    self.material:setFloat("SA", shadowCoef)

    local highlightCoef = getHighlightCoef(self.highlight)
    self.material:setFloat("HA", highlightCoef)
end


function ScriptComp:onEvent(sys, event)
    if event.type == Amaz.AppEventType.SetEffectIntensity then
        if event.args:get(0) == "shadow_intensity" then
            local intensity = event.args:get(1)
            self.shadow = intensity
        end
        if event.args:get(0) == "highlight_intensity" then
            local intensity = event.args:get(1)
            self.highlight = intensity
        end
    end

    if event.args:size() == 2 and event.args:get(0) == "reset_params" and event.args:get(1) == 1 then
        self.shadow = 0
        self.highlight = 0
    end
end


exports.ScriptComp = ScriptComp
return exports
