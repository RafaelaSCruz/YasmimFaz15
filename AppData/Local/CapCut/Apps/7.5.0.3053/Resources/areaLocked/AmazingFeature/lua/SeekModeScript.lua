---@class SeekModeScript: ScriptComponent
----@field position Vector3f
----@field rotation Vector3f
----@field scale Vector3f
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
    return self
end

function SeekModeScript:onUpdate(comp, detalTime)
    if Amaz.Macros.EditorSDK then
        self.curTime = self.curTime + detalTime
    end
    self:seekToTime(comp, self.curTime - self.startTime)
end

function SeekModeScript:onStart(comp)
    self.props = comp.properties
    self.tranComp = comp.entity:getComponent("Transform")
    self.cam = comp.entity.scene:findEntityBy('Camera_entity'):getComponent("Camera")
    self.blurEntity = comp.entity.scene:findEntityBy('Gaussian_Blur_Root')
    self.blurEntity.visible = false
    self.cam.clearType = Amaz.CameraClearType.COLOR
    self.blurMixMat = comp.entity.scene:findEntityBy('blurMix'):getComponent("MeshRenderer").material
    -- Amaz.LOGI("suotou start", tostring("start"))
end

function SeekModeScript:seekToTime(comp, time)
    self.tranComp.localPosition = self.position
    self.tranComp.localEulerAngle = self.rotation
    self.tranComp.localScale = self.scale
    -- Amaz.LOGI('suotou mat',tostring(self.cam.projectionMatrix))
end

function SeekModeScript:onEvent(comp, event)
    if event.type == Amaz.AppEventType.SetEffectIntensity then
        local key = event.args:get(0)
        if key == "position" then
            local value = event.args:get(1)
            local w = Amaz.BuiltinObject.getInputTextureWidth()
            local h = Amaz.BuiltinObject.getInputTextureHeight()
            if value.x then
                -- if w > h then
                --     self.position = Amaz.Vector3f(value.x, -value.y * h / w, value.z)
                -- else
                    self.position = Amaz.Vector3f(value.x * w / h, -value.y, value.z)
                -- end
            else
                -- if w > h then
                --     self.position = Amaz.Vector3f(value, -value * h / w, value)
                -- else
                    self.position = Amaz.Vector3f(value * w / h, -value, value)
                -- end
            end
            -- Amaz.LOGI("suotou position", tostring(self.position))
        end
        if key == "rotation" then
            local value = event.args:get(1)
            if value.x then
                self.rotation = value
            else
                self.rotation = Amaz.Vector3f(value, value, value)
            end
            -- Amaz.LOGI("suotou rotation", tostring(self.rotation))
        end
        if key == "scale" then
            local value = event.args:get(1)
            local w = Amaz.BuiltinObject.getInputTextureWidth()
            local h = Amaz.BuiltinObject.getInputTextureHeight()
            if value.x then
                -- if w > h then
                    -- self.scale = Amaz.Vector3f(value.x, value.y * h / w, value.z)
                -- else
                    self.scale = Amaz.Vector3f(value.x * w / h, value.y, value.z)
                -- end
            else
                -- if w > h then
                    -- self.scale = Amaz.Vector3f(value, value * h / w, value)
                -- else
                    self.scale = Amaz.Vector3f(value * w / h, value, value)
                -- end
            end
            -- Amaz.LOGI("suotou scale", tostring(self.scale))
        end
        if key == "scale" then
            local value = event.args:get(1)
            local w = Amaz.BuiltinObject.getInputTextureWidth()
            local h = Amaz.BuiltinObject.getInputTextureHeight()
            if value.x then
                -- if w > h then
                    -- self.scale = Amaz.Vector3f(value.x, value.y * h / w, value.z)
                -- else
                    self.scale = Amaz.Vector3f(value.x * w / h, value.y, value.z)
                -- end
            else
                -- if w > h then
                    -- self.scale = Amaz.Vector3f(value, value * h / w, value)
                -- else
                    self.scale = Amaz.Vector3f(value * w / h, value, value)
                -- end
            end
            Amaz.LOGI("suotou scale", tostring(self.scale))
        end
        if key == "blurBackgroundAlpha" then
            Amaz.LOGI("suotou blurBackgroundAlpha0", 123123)
            local value = event.args:get(1)
            if value < 0.001 then
                self.blurEntity.visible = false
                self.cam.clearType = Amaz.CameraClearType.COLOR
            Amaz.LOGI("suotou blurBackgroundAlpha0", value)
            else
                self.blurEntity.visible = true
                self.cam.clearType = Amaz.CameraClearType.DONT
                self.blurMixMat:setFloat('u_alpha', value)
            Amaz.LOGI("suotou blurBackgroundAlpha1", value)
        end
        end
    end
end

exports.SeekModeScript = SeekModeScript
return exports
