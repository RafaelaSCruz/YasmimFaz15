--@input float curTime = 0.0{"widget":"slider","min":0,"max":3.0}

local exports = exports or {}
local SeekModeScript = SeekModeScript or {}
SeekModeScript.__index = SeekModeScript
function SeekModeScript.new(construct, ...)
    local self = setmetatable({}, SeekModeScript)
    if construct and SeekModeScript.constructor then SeekModeScript.constructor(self, ...) end
    self.startTime = 0.0
    self.endTime = 3.0
    self.curTime = 0.0

    self.inputWidth = -1
    self.inputHeight = -1
    self.waterMarkWidth = -1
    self.waterMarkHeight = -1

    self.language = nil
    self.languageDirty = false

    return self
end

function SeekModeScript:constructor()

end

function SeekModeScript:onUpdate(comp, detalTime)
    if self.languageDirty then
        self:updateWaterMarkTexture(comp)
    end
end



function SeekModeScript:updateWaterMarkTexture(comp)

    self.languageDirty = false
    
    if self.language ~= nil and self.language ~= "" then

        local scene = comp.entity.scene
        local assetMgr = scene.assetMgr
        local rootDir = assetMgr.rootDir
       
        local imagePath = rootDir.."image/ic_mask_"..self.language..".png"
        local texture = comp.entity.scene.assetMgr:SyncLoad(imagePath)
        if texture ~= nil and texture.image ~= nil then
            self.waterMarkMeterial:setTex("waterMarkTexture",texture)
        end
    end
end


function SeekModeScript:onStart(comp)
    if self.waterMarkMeterial == nil then
        self.waterMarkMeterial = comp.entity.scene:findEntityBy("water_mark"):getComponent("MeshRenderer").material
    end

    if self.languageDirty then
        self:updateWaterMarkTexture(comp) 
    end

    self:viewSizeEvent()
    
end

function SeekModeScript:viewSizeEvent()
    
    local w = Amaz.BuiltinObject:getInputTextureWidth()
    local h = Amaz.BuiltinObject:getInputTextureHeight()
    if w > h then
        local ratioY = 1.0
        local ratioX = 1.0 * w / h
        self.waterMarkMeterial:setFloat("ratioX", ratioX)
        self.waterMarkMeterial:setFloat("ratioY", ratioY)
    else
        local ratioX = 1.0
        local ratioY = 1.0 * h / w
        self.waterMarkMeterial:setFloat("ratioX", ratioX)
        self.waterMarkMeterial:setFloat("ratioY", ratioY)
    end
 
end

function SeekModeScript:onEvent(sys, event)
    if event.type == 2 then
        self:viewSizeEvent()
    end
    
    if event.type == 10007 then
        local event_result = event.args:get(0)
        if event_result == "lang" then
            if self.language ~= event.args:get(1) then
                self.language = event.args:get(1)
                self.languageDirty = true
            end
        end
    end

    
end
exports.SeekModeScript = SeekModeScript
return exports
