--@input float curTime = 0.0{"widget":"slider","min":0,"max":1}
--@input float RRR = 0.0{"widget":"slider","min":0,"max":1}
--@input float GGG = 0.0{"widget":"slider","min":0,"max":1}
--@input float BBB = 0.0{"widget":"slider","min":0,"max":1}
--@input float INTENSITY = 0.0{"widget":"slider","min":0,"max":1}
--@input float SHADOW = 0.0{"widget":"slider","min":0,"max":1}
--@input float EDGE_SMOOTH = 0.0{"widget":"slider","min":0,"max":1}
--@input float SPILL = 0.0{"widget":"slider","min":0,"max":1}

local exports = exports or {}
local SeekModeScript = SeekModeScript or {}
SeekModeScript.__index = SeekModeScript
function SeekModeScript.new(construct, ...)
    local self = setmetatable({}, SeekModeScript)
    if construct and SeekModeScript.constructor then SeekModeScript.constructor(self, ...) end
    self.startTime = 0.0
    self.endTime = 3.0
    self.curTime = 0.0
    self.width = 1920.0
    self.height = 1080.0

    self.selectedColour = Amaz.Vector4f(0.0,0.0,0.0,1.0);
    self.intensity = 0.0;
    self.shadow = 0.0;
    self.edge_smooth = 0.0;
    self.spill = 0.0;


    self.edit_mode = false;
    return self
end

function SeekModeScript:constructor()

end


function SeekModeScript:onUpdate(comp, detalTime)
    if (self.edit_mode) then
    --测试用
        local props = comp.entity:getComponent("ScriptComponent").properties
        if props:has("curTime") then
            self:seekToTime(comp, props:get("curTime"))
        end
    else
    --实际用
        self:seekToTime(comp, self.curTime - self.startTime)
    end
end

function SeekModeScript:onStart(comp)
    self.material = comp.entity:getComponent("MeshRenderer").material
    self.width = Amaz.BuiltinObject:getInputTextureWidth()
    self.height = Amaz.BuiltinObject:getInputTextureHeight()
    if self.width > 0 and self.height > 0 then
        self.material:setFloat("widthOffset", 1.0 / self.width)
        self.material:setFloat("heightOffset", 1.0 / self.height)
    else
        self.material:setFloat("widthOffset", 0.0)
        self.material:setFloat("heightOffset", 0.0)
    end

    self.material:setVec4("selectedColour", self.selectedColour);
    self.material:setFloat("inputIntensity", self.intensity);
    self.material:setFloat("inputShadow", self.shadow);
    self.material:setFloat("inputEdgeSmooth", self.edge_smooth);
    self.material:setFloat("inputSpill", self.spill);
    
    local tex_smooth= self.material:getTex("smoothMapTexturex")
    if tex_smooth ~= nil then
        if tex_smooth.height ~= self.height or tex_smooth.width ~= self.width then
            tex_smooth.height = self.height;
            tex_smooth.width = self.width;
            self.material:setTex("smoothMapTexturex", tex_smooth)
        end
    end
    
    local tex_alpha = self.material:getTex("alphaMapTexture")
    if tex_alpha ~= nil then
        if tex_alpha.height ~= self.height or tex_alpha.width ~= self.width then
            tex_alpha.height = self.height;
            tex_alpha.width = self.width;
            self.material:setTex("alphaMapTexture", tex_alpha)
        end
    end
  
end

function SeekModeScript:getParamsFromEditor(comp)
    local props = comp.entity:getComponent("ScriptComponent").properties
    self.selectedColour.x = props:get("RRR");
    self.selectedColour.y = props:get("GGG");
    self.selectedColour.z = props:get("BBB");
    self.intensity = props:get("INTENSITY");
    self.shadow = props:get("SHADOW");
    self.edge_smooth = props:get("EDGE_SMOOTH")
    self.spill = props:get("SPILL")
end


function SeekModeScript:seekToTime(comp, time)
    -- if self.first == nil then
    --     self.first = true
    --     self:start(comp)
    -- end

    if (self.edit_mode) then
        self:getParamsFromEditor(comp);
        self.material:setVec4("selectedColour", self.selectedColour);
        self.material:setFloat("inputIntensity", self.intensity);
        self.material:setFloat("inputShadow", self.shadow);
        self.material:setFloat("inputEdgeSmooth", self.edge_smooth);
        self.material.setFloat("inputSpill", self.spill);
    end
end

function SeekModeScript:onEvent(comp, event)
    local tex_smooth =  self.material:getTex("smoothMapTexturex")
    local tex_alpha =  self.material:getTex("alphaMapTexture")
    self.width = Amaz.BuiltinObject:getInputTextureWidth()
    self.height = Amaz.BuiltinObject:getInputTextureHeight()
    self.material:setFloat("widthOffset", 1.0 / self.width)
    self.material:setFloat("heightOffset", 1.0 / self.height)

    if tex_smooth ~= nil then
        if tex_smooth.height ~= self.height or tex_smooth.width ~= self.width then
            tex_smooth.height = self.height;
            tex_smooth.width = self.width;
            self.material:setTex("smoothMapTexturex", tex_smooth)
        end
    end

    if tex_alpha ~= nil then
        if tex_alpha.height ~= self.height or tex_alpha.width ~= self.width then
            tex_alpha.height = self.height;
            tex_alpha.width = self.width;
            self.material:setTex("alphaMapTexture", tex_alpha)
        end
    end


    Amaz.LOGE("AE_TEXT_TAG", "ONEVENT");
    if event.type == Amaz.AppEventType.SetEffectIntensity then
        if event.args:get(0) == "color" then
            local color = event.args:get(1);
            if (color ~= nil) then
                self.selectedColour.x = color:get(0);
                self.selectedColour.y = color:get(1);
                self.selectedColour.z = color:get(2);
                self.selectedColour.w = color:get(3);
                self.material:setVec4("selectedColour", self.selectedColour);
            end
        elseif event.args:get(0) == "intensity" then
            local intensity = event.args:get(1);
            if (intensity ~= nil) then
                self.intensity = intensity;
                self.material:setFloat("inputIntensity", self.intensity);
            end
        elseif event.args:get(0) == "shadow" then
            local shadow = event.args:get(1);
            if (shadow ~= nil) then
                self.shadow = shadow;
                self.material:setFloat("inputShadow", self.shadow);
            end
        elseif event.args:get(0) == "edge_smooth" then
            local edge_smooth = event.args:get(1);
            if (edge_smooth ~= nil) then
                self.edge_smooth = edge_smooth;
                self.material:setFloat("inputEdgeSmooth", self.edge_smooth);
            end
        elseif event.args:get(0) == "spill" then
            local spill = event.args:get(1);
            if (spill ~= nil) then
                self.spill = spill;
                self.material:setFloat("inputSpill", self.spill);
            end
        elseif event.args:get(0) == "reset_params" then
            self.intensity = 0.0;
            self.material:setFloat("inputIntensity", self.intensity);
            self.shadow = 0.0;
            self.material:setFloat("inputShadow", self.shadow);
            self.spill = 0.0;
            self.material:setFloat("inputSpill", self.spill);
            self.edge_smooth = 0.0;
            self.material:setFloat("inputEdgeSmooth", self.edge_smooth);
        end
    end
end

exports.SeekModeScript = SeekModeScript
return exports

