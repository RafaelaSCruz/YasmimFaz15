local exports = exports or {}
local SeekModeScript = SeekModeScript or {}
SeekModeScript.__index = SeekModeScript
function SeekModeScript.new(construct, ...)
    local self = setmetatable({}, SeekModeScript)
    if construct and SeekModeScript.constructor then
        SeekModeScript.constructor(self, ...)
    end
    -- This HSL effect has two color origins: 8 default colors and <=10 user picked colors
    self.defaultColorNum = 8
    self.userColorNum = 10
    self.maxSliderValue = 100

    self.defaultSliderParam = {}
    for i = 1, self.defaultColorNum do
        self.defaultSliderParam[i] = Amaz.Vector3f(0.0, 0.0, 0.0)
    end

    self.defaultColorName = {"HSLRed", "HSLOrange", "HSLYellow", "HSLGreen", "HSLCyan", "HSLBlue", "HSLPurple", "HSLMagenta"}
    self.defaultColorMap = {}
    for i = 1, self.defaultColorNum do
        local colorName = self.defaultColorName[i]
        self.defaultColorMap[colorName] = i
    end

    self.userColor = {}
    self.userSliderParam = {}
    for i = 1, self.userColorNum do
        self.userColor[i] = Amaz.Vector3f(0.0, 0.0, 0.0)
        self.userSliderParam[i] = Amaz.Vector3f(0.0, 0.0, 0.0)
    end

    return self
end


local function isArrayContain(array, value)
    for i = 1, #array do
        if array[i] == value then
            return true
        end
    end
    return false
end


local function hexToColor(hexCode)
    --[[
        Convert string type hex code to number type color, normalized by 255 so as to between [0, 1].

        hexCode: string type hex code, e.g. "01#ad8a86"， 01 before # means order of color, ad8a86 after # means color code
    ]]
    local hexOrder = string.sub(hexCode, 1, 2)
    local hexR = string.sub(hexCode, 4, 5)
    local hexG = string.sub(hexCode, 6, 7)
    local hexB = string.sub(hexCode, 8, 9)

    local order = tonumber(hexOrder, 16) + 1
    local r = tonumber(hexR, 16) / 255.
    local g = tonumber(hexG, 16) / 255.
    local b = tonumber(hexB, 16) / 255.
    return order, r, g, b
end

local function splitColorString(colorString)
    local idx = string.find(colorString, "_")
    local colorName = string.sub(colorString, 1, idx - 1)
    local sliderName = string.sub(colorString, idx + 1, string.len(colorString))
    return colorName, sliderName
end

function SeekModeScript:reset_param()
    for i = 1, self.defaultColorNum do
        self.defaultSliderParam[i] = Amaz.Vector3f(0.0, 0.0, 0.0)
        self.material:setVec3("u_defaultParam_" .. i, Amaz.Vector3f(0.0, 0.0, 0.0))
    end

    for i = 1, self.userColorNum do
        self.userSliderParam[i] = Amaz.Vector3f(0.0, 0.0, 0.0)
        self.material:setVec3("u_userParam_" .. i, Amaz.Vector3f(0.0, 0.0, 0.0))
    end
end


function SeekModeScript:constructor()
end


function SeekModeScript:onUpdate(comp, detalTime)
    self:seekToTime(comp, detalTime)

    for i = 1, self.defaultColorNum do
        self.material:setVec3("u_defaultParam_" .. i, self.defaultSliderParam[i])
    end

    for i = 1, self.userColorNum do
        self.material:setVec3("u_userColor_" .. i, self.userColor[i])
        self.material:setVec3("u_userParam_" .. i, self.userSliderParam[i])
    end
end

function SeekModeScript:start(comp)
    self.material = comp.entity:getComponent("MeshRenderer").sharedMaterials:get(0)
    self.reset_param(self)
end

function SeekModeScript:seekToTime(comp, time)
    if self.first == nil then
        self.first = true
        self:start(comp)
    end
end

function SeekModeScript:onEvent(sys, event)
    if event.args:size() == 2 and event.args:get(0) == "reset_params" and event.args:get(1) == 1 then
        self.reset_param(self)
    else
        local colorString = event.args:get(0)
        local sliderParam = event.args:get(1)
        local colorName, sliderName = splitColorString(colorString)

        if isArrayContain(self.defaultColorName, colorName) == true then
            local order = self.defaultColorMap[colorName]
            if sliderName == "H" then
                self.defaultSliderParam[order].x = (sliderParam * 2. - 1.) * self.maxSliderValue
            elseif sliderName == "S" then
                self.defaultSliderParam[order].y = (sliderParam * 2. - 1.) * self.maxSliderValue
            elseif sliderName == "L" then
                self.defaultSliderParam[order].z = (sliderParam * 2. - 1.) * self.maxSliderValue
            end

            -- if (sliderParam ~= nil and sliderParam:size() >= 3) then
            --     -- sliderParam[0, 1, 2] = hue, saturation lightness
            --     self.defaultSliderParam[order].x = (sliderParam:get(0) * 2. - 1.) * self.maxSliderValue
            --     self.defaultSliderParam[order].y = (sliderParam:get(1) * 2. - 1.) * self.maxSliderValue
            --     self.defaultSliderParam[order].z = (sliderParam:get(2) * 2. - 1.) * self.maxSliderValue
            -- end
            -- -- Amaz.LOGE("default color name", colorName)
        else
            local order, r, g, b = hexToColor(colorName)
            self.userColor[order] = Amaz.Vector3f(r, g, b)
            -- local sliderParam = event.args:get(1)
            if sliderName == "H" then
                self.userSliderParam[order].x = (sliderParam * 2. - 1.) * self.maxSliderValue
                self.userSliderParam[order].x = self.userSliderParam[order].x * 0.3
            elseif sliderName == "S" then
                self.userSliderParam[order].y = (sliderParam * 2. - 1.) * self.maxSliderValue
            elseif sliderName == "L" then
                self.userSliderParam[order].z = (sliderParam * 2. - 1.) * self.maxSliderValue
                self.userSliderParam[order].z = self.userSliderParam[order].z * 0.3
            end

            -- if (sliderParam ~= nil and sliderParam:size() >= 3) then
            --     -- sliderParam[0, 1, 2] = hue, saturation lightness
            --     self.userSliderParam[order].x = (sliderParam:get(0) * 2. - 1.) * self.maxSliderValue
            --     self.userSliderParam[order].y = (sliderParam:get(1) * 2. - 1.) * self.maxSliderValue
            --     self.userSliderParam[order].z = (sliderParam:get(2) * 2. - 1.) * self.maxSliderValue

            --     self.userSliderParam[order].x = self.userSliderParam[order].x * 0.3
            --     self.userSliderParam[order].z = self.userSliderParam[order].z * 0.3
            -- end
        end
    end
end


exports.SeekModeScript = SeekModeScript
return exports
