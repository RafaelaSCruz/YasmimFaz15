--@input float curTime = 0.0{"widget":"slider","min":0,"max":10}

local function clamp (value, min, max)
    return math.min(math.max(min, value), max)
end
local function mix (x, y, a)
    return x + (y - x) * a
end
local function step (edge0, edge1, value)
    return math.min(math.max(0, (value - edge0) / (edge1 - edge0)), 1)
end
local function smoothstep (edge0, edge1, value)
    local t = math.min(math.max(0, (value - edge0) / (edge1 - edge0)), 1)
    return t * t * (3 - t - t)
end

local MIN_SPEED = 0.5 / 3
local MAX_SPEED = 2.0 / 3
local DURATION = 1
local MAG = 2.5

local exports = exports or {}
local SeekModeScript = SeekModeScript or {}
SeekModeScript.__index = SeekModeScript
function SeekModeScript.new(construct, ...)
    local self = setmetatable({}, SeekModeScript)
    if construct and SeekModeScript.constructor then SeekModeScript.constructor(self, ...) end
    self.startTime = 0.0
    self.endTime = 3.0
    self.curTime = 0.0
    self.width = 0
    self.height = 0
    self.speed = 0.5
    self.distance = 0.8
    self.number = 0.8
    return self
end

function SeekModeScript:constructor()

end

function SeekModeScript:onUpdate(comp, detalTime)
     --local props = comp.entity:getComponent("ScriptComponent").properties
     --if props:has("curTime") then
     --    self:seekToTime(comp, props:get("curTime"))
     --end
    self:seekToTime(comp, self.curTime - self.startTime)
end

function SeekModeScript:onStart(comp)
    self.pass0Material = comp.entity.scene:findEntityBy("Pass0"):getComponent("MeshRenderer").sharedMaterials:get(0)
    self.pass3Material = comp.entity:getComponent("MeshRenderer").sharedMaterials:get(0)
    self.pass4Material = comp.entity.scene:findEntityBy("Pass4"):getComponent("MeshRenderer").sharedMaterials:get(0)
end

function SeekModeScript:seekToTime(comp, time)
    -- if self.first == nil then
    --     self.first = true
    --     self:start(comp)
    -- end
    -- self.animSeqCom:seekToTime(time)

    local w = Amaz.BuiltinObject:getInputTextureWidth()
    local h = Amaz.BuiltinObject:getInputTextureHeight()
    if math.abs(w/(h + 0.0001) - self.width/(self.height + 0.0001)) > 0.001 then
        if w<h then
            self.width=720
            self.height = h/w*720
        else
            self.width = w/h*720
            self.height = 720
        end
        -- self.width = w
        -- self.height = h
        self.pass0Material:setInt("inputWidth",self.width)
        self.pass0Material:setInt("inputHeight",self.height)
        self.pass3Material:setInt("inputWidth",self.width)
        self.pass3Material:setInt("inputHeight",self.height)
        local x = 2.0
        self.pass4Material:setVec2("iResolution", Amaz.Vector2f(self.width/x, self.height/x))
    end

    local progress = (self.curTime - self.startTime) / (self.endTime - self.startTime)
    local intensity = 0
    if self.speed <= 1/100 then
        intensity = 1
    elseif self.speed < 1/3 then
        intensity = step(mix(2, 1, step(1/100, 1/3, self.speed)), 0, progress)
    else
        intensity = step(mix(1, 0.5, step(1/3, 1/1, self.speed)), 0, progress)
    end

    if self.number>0.995 and self.distance<0.005 then
        local myins=0
        self.pass0Material:setFloat("blurSize", myins)
        self.pass3Material:setFloat("blurSize", myins)
    else
        self.pass0Material:setFloat("blurSize", self.number*intensity*4.0*0.15)
        self.pass3Material:setFloat("blurSize", self.number*intensity*4.0*0.15)
    end

    if(self.distance>0.5) then
        local myDis = 1.0
        self.pass4Material:setFloat("mysize", self.distance * 120.0 + 1.0)
        self.pass4Material:setFloat("blurSize", myDis * MAG * 0.5 * intensity)
    else
        local myNum = 60
        self.pass4Material:setFloat("mysize", myNum)
        self.pass4Material:setFloat("blurSize", self.distance * MAG * 1.0 * intensity)
    end
end

function SeekModeScript:onEvent(sys, event)
    if("effects_adjust_number" == event.args:get(0)) then
        local intensity = 1.0-event.args:get(1)
        self.number=intensity
        --self.pass0Material:setFloat("blurSize", intensity*4.0*0.15)
        --self.pass3Material:setFloat("blurSize", intensity*4.0*0.15)
    end
    if("effects_adjust_intensity" == event.args:get(0)) then
        local intensity = event.args:get(1)
        self.distance=intensity
        --if(intensity>0.5) then
        --    local myDis=1.0
        --    self.pass4Material:setFloat("mysize",intensity * 120.0+1.0)
        --    self.pass4Material:setFloat("blurSize",myDis*0.5)
        --else
        --    local myNum=60
        --    self.pass4Material:setFloat("mysize",myNum)
        --    self.pass4Material:setFloat("blurSize",intensity * 1.0)
        --end
    end
    if("effects_adjust_speed" == event.args:get(0)) then
        local intensity = event.args:get(1)
        self.speed=intensity
    end
    --if self.number>0.995 and self.distance<0.005 then
    --    local myins=0
    --    self.pass0Material:setFloat("blurSize", myins)
    --    self.pass3Material:setFloat("blurSize", myins)
    --end
end

exports.SeekModeScript = SeekModeScript
return exports
