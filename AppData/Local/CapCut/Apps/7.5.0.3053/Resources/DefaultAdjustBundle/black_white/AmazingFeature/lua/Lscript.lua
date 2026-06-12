local exports = exports or {}
local Lscript = Lscript or {}
---@class Lscript:ScriptComponent 


Lscript.__index = Lscript

function Lscript.new(construct, ...)
    local self = setmetatable({}, Lscript)
    if construct and Lscript.constructor then Lscript.constructor(self, ...) end

    self.white = 0.0
    self.black = 0.0

    return self
end


function Lscript:constructor()
    self.name = "scriptComp"
end


function Lscript:onStart(comp)
    self.white = 0.0
    self.black = 0.0
    self.material = comp.entity:getComponent("MeshRenderer").material

end


local function getControlPoints(whiteIntensity, blackIntensity)
    -- initialization, (xw, yw) is white control point, (xb, yb) is black control point
    local xw = 1.0
    local yw = 1.0
    local xb = 0.0
    local yb = 0.0
    local MAX_RANGE = 0.5
    local EPS = 0.005

    -- white control points are located at top or right border
    -- black control points are located at bottom or left border
    if whiteIntensity >= 0.0 then
        xw = 1.0 - whiteIntensity * MAX_RANGE
        yw = 1.0
    else
        xw = 1.0
        yw = 1.0 + whiteIntensity * MAX_RANGE
    end

    if blackIntensity >= 0.0 then
        xb = 0.0
        yb = blackIntensity * MAX_RANGE
    else
        xb = -blackIntensity * MAX_RANGE
        yb = 0.0
    end

    

    -- rectify the points
    xw = math.max(xw, EPS)
    yw = math.max(yw, EPS)
    xb = math.min(xb, xw - EPS)
    yb = math.min(yb, yw - EPS)

    return xw, yw, xb, yb
end


local function getLinearCoef(xw, yw, xb, yb)
    local slope = (yw - yb) / (xw - xb)
    local bias = yb - slope * xb
    return slope, bias
end


function Lscript:onUpdate(comp, deltaTime)
    local xw, yw, xb, yb = getControlPoints(self.white, self.black)
    local slope, bias = getLinearCoef(xw, yw, xb, yb)
    self.material:setFloat("Slope", slope)
    self.material:setFloat("Bias", bias)
end

function Lscript:onEvent(sys, event)
    if event.type == Amaz.AppEventType.SetEffectIntensity then
        if event.args:get(0) == "white_intensity" then
            local intensity = event.args:get(1)
            self.white = tonumber(intensity)
        end
        if event.args:get(0) == "black_intensity" then
            local intensity = event.args:get(1)
            self.black = tonumber(intensity)
        end
        if event.args:size() == 2 and event.args:get(0) == "reset_params" and event.args:get(1) == 1 then
            self.white = 0.0
            self.black = 0.0
        end
    end
end

exports.Lscript = Lscript
return exports
