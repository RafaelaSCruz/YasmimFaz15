local exports = exports or {}
local SeekModeScript = SeekModeScript or {}
SeekModeScript.__index = SeekModeScript


function SeekModeScript.new(construct, ...)
    local self = setmetatable({}, SeekModeScript)
    if construct and SeekModeScript.constructor then
        SeekModeScript.constructor(self, ...)
    end
    self.startTime = 0.0
    self.endTime = 3.0
    self.curTime = 0.0

    self.contrast = 1.0
    self.pivot = 0.435
    return self
end


function SeekModeScript:constructor()
end


local function getSigmoidXFactor(contrast)
    local res = math.exp(8.33 * contrast - 12.16) + 5.82 * contrast - 1.72
    return res
end


local function getSigmoid(x, contrast, pivot)
    local a = getSigmoidXFactor(contrast)
    local s = 1.0 / (1.0 + math.exp(-a * (x - pivot)))
    local y = s + pivot - 0.5       -- sigmoid value
    local k = a * s * (1.0 - s)     -- sigmoid derivative
    return y, k
end


function SeekModeScript:onUpdate(comp, detalTime)
    if Amaz.Macros and Amaz.Macros.EditorSDK then
        self.buildScript = comp.entity.scene:findEntityBy("Camera_entity"):getComponent("ScriptComponent")
        local scriptObj = self:getLuaObj(self.buildScript)
        if scriptObj then
            self:seekToTime(comp, scriptObj.curTime - self.startTime)
        end
    else
        self:seekToTime(comp, self.curTime - self.startTime)
    end
end


function SeekModeScript:start(comp)
end


function SeekModeScript:onStart(comp)
    self.material = comp.entity.scene:findEntityBy("FliterEntity-2FFE6ABD"):getComponent("MeshRenderer").material
end


function SeekModeScript:getLuaObj(scriptComponent)
    if scriptComponent then
        local script = scriptComponent:getScript()
        if script then
            local luaObj = Amaz.ScriptUtils.getLuaObj(script)
            return luaObj
        end
    end
    return nil
end


function SeekModeScript:seekToTime(comp, time)
    if self.first == nil then
        self.first = true
        self:start(comp)
    end

    local entities = comp.entity.scene.entities
    for i = 1, entities:size() do
        if entities:get(i - 1).name ~= "SeekModeScript" then
            local scriptComp = entities:get(i - 1):getComponent("ScriptComponent")
            if scriptComp then
                local scriptLuaObj = self:getLuaObj(scriptComp)
                if scriptLuaObj.seekToTime then
                    scriptLuaObj:seekToTime(scriptComp, time)
                end
            end
        end
    end
end


function SeekModeScript:onEvent(sys, event)

    if event.type == Amaz.AppEventType.SetEffectIntensity then
        if event.args:get(0) == "intensity" then
            -- local intensity = event.args:get(1) + 1.0

            local intensity = event.args:get(1)
            if intensity <= 0.0 then
                self.contrast = intensity * 0.4 + 1.0
            else
                self.contrast = intensity * 0.6 + 1.0
            end

            -- Interface parameters
            self.material:setFloat("Contrast", self.contrast)
            self.material:setFloat("Pivot", self.pivot)  -- Non-public

            -- Non-Interface parameters
            local xFactor = getSigmoidXFactor(self.contrast)
            local y0, k0 = getSigmoid(0.0, self.contrast, self.pivot)
            local y1, k1 = getSigmoid(1.0, self.contrast, self.pivot)
            local yp, kp = getSigmoid(self.pivot, self.contrast, self.pivot)
            local y0Diff = 0.0 - y0
            local y1Diff = 1.0 - y1
            local k0Diff = kp - k0
            local k1Diff = kp - k1

            self.material:setFloat("XFactor", xFactor)
            self.material:setFloat("Y0Diff", y0Diff)
            self.material:setFloat("Y1Diff", y1Diff)
            self.material:setFloat("K0Diff", k0Diff)
            self.material:setFloat("K1Diff", k1Diff)
            self.material:setFloat("KPivot", kp)  
        end
    end
end


exports.SeekModeScript = SeekModeScript
return exports
