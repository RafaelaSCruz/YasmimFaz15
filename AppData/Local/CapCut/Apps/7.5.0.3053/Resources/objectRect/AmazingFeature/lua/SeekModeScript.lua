local function Log (fmt, ...)
    Amaz.LOGW("jorgen", string.format(fmt, ...))
end
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
local function mirror (range, value)
    local round = value / range
    local roundF = 1 - math.abs(round % 2 - 1)
    local roundI = math.floor(round)
    return roundF, roundI
end


local exports = exports or {}
local SeekModeScript = SeekModeScript or {}
SeekModeScript.__index = SeekModeScript

---@param scene Scene
function SeekModeScript:create (node, data, w, h, scene)
    node.scene = scene
    node.frame_prefab = Amaz.PrefabManager.loadPrefab(scene.assetMgr.rootDir, "prefabs/frame.prefab")
    node.frames_camera = scene:findEntityBy("frames_camera"):getComponent("Camera")
    node.frames_idle = {}
    node.frames_work = {}

    node.blur1x = scene:findEntityBy("blur1x"):getComponent("MeshRenderer").material
    node.blur1y = scene:findEntityBy("blur1y"):getComponent("MeshRenderer").material

    node.rt0 = node.frames_camera.renderTexture
end

function SeekModeScript:layout (node, data, w, h)
    node.frames_camera.orthoScale = h * 0.5
    node.blur1x:setFloat("u_step_x", 1 / w)
    node.blur1y:setFloat("u_step_y", 1 / h)
    node.rt0.width = w
    node.rt0.height = h
end

function SeekModeScript:update (node, data, time, progress, w, h)
    if not self.frames.dirty then
        return
    end
    local stroke = self.frames.stroke
    local paint = Amaz.Vector2f(stroke[1], stroke[2])
    local color = Amaz.Vector4f(stroke[3], stroke[4], stroke[5], 1)
    local count = 0

    Log(" ")
    Log(" ")
    Log(" ##### %s.%03d #####", os.date("%H:%M:%S"), Amaz.Os.getTime() % 1 * 1000)
    Log(" screen size: [%d %d]", w, h)
    Log(" rect: %d", #self.frames)
    for i, req in ipairs(self.frames) do
        count = count + 1
        local frame = node.frames_work[count]
        if not frame then
            frame = table.remove(node.frames_idle)
            table.insert(node.frames_work, frame)
        end
        if not frame then
            frame = node.scene:addInstantiatedPrefabToEntity(node.frame_prefab, node.frames_camera.entity)
            frame.layer = 1
            frame.name = "frame_"..(#node.frames_idle + #node.frames_work)
            table.insert(node.frames_work, frame)
        end
        frame.visible = true

        local material = frame:getComponent("MeshRenderer").material
        local l = step(-1, 1, req[1]) * w
        local r = step(-1, 1, req[3]) * w
        local b = step(-1, 1, req[4]) * h
        local t = step(-1, 1, req[2]) * h
        local fw = r - l
        local fh = t - b
        material:setVec2("u_size", Amaz.Vector2f(fw, fh))
        material:setVec2("u_paint", paint)
        material:setVec4("u_color", color)

        local transform = frame:getComponent("Transform")
        local x = (l + r - w) * 0.5
        local y = (b + t - h) * 0.5
        transform.localScale = Amaz.Vector3f(fw * 0.5, fh * 0.5, 1)
        transform.localPosition = Amaz.Vector3f(x, y, -1)

        Log(" rect %03d:", i)
        Log("     params: [%.3f %.3f %.3f %.3f]", req[1], req[2], req[3], req[4])
        Log("     rect: [%.3f %.3f %.3f %.3f]",
                x + w * 0.5 - fw * 0.5,
                y + h * 0.5 + fh * 0.5,
                x + w * 0.5 + fw * 0.5,
                y + h * 0.5 - fh * 0.5)
        Log("     size: [%.3f %.3f]", fw, fh)
        Log("     position: [%.3f %.3f]", x + w * 0.5, y + h * 0.5)
    end

    while #node.frames_work > count do
        local frame = table.remove(node.frames_work)
        frame.visible = false
        table.insert(node.frames_idle, frame)
    end
    self.frames.dirty = false
    Log(" work: %d", #node.frames_work)
    Log(" idle: %d", #node.frames_idle)
end



function SeekModeScript.new (construct, ...)
    local self = setmetatable({}, SeekModeScript)
    self.w = 0
    self.h = 0
    self.startTime = 0.0
    self.endTime = 10.0
    self.curTime = 0.0
    self.node = {}
    self.data = {}
    self.frames = {
        dirty = true,
        stroke = {5, 50, 1, 0, 0},
        --{-0.5, 0.5, 0.5, -0.5},
        --{-0.6, -0.6, 0.6, -0.9},
    }
    return self
end

function SeekModeScript:onStart (comp)
    local scene = comp.entity.scene
    local order = 0
    local layer = 1
    local function setLayerRecursion (node)
        node.entity.layer = order
        for i = 0, node.children:size() - 1 do
            setLayerRecursion(node.children:get(i))
        end
    end
    local nodes = scene:findEntityBy("@Pipeline"):getComponent("Transform").children
    for i = 0, nodes:size() - 1 do
        local node = nodes:get(i)
        local entity = node.entity
        local camera = entity:getComponent("Camera")
        if camera then
            order = order + 1
            layer = layer * 2
            entity.layer = 0
            camera.renderOrder = order
            camera.layerVisibleMask = Amaz.DynamicBitset.new(64, string.format("%#x", layer))
        end
        setLayerRecursion(node)
    end
    self.w = Amaz.BuiltinObject.getInputTextureWidth()
    self.h = Amaz.BuiltinObject.getInputTextureHeight()
    self:create(self.node, self.data, self.w, self.h, comp.entity.scene)
    self:layout(self.node, self.data, self.w, self.h)
end

function SeekModeScript:onUpdate (comp, dt)
    if Editor then
        self.curTime = self.curTime + dt
    end
    local w = Amaz.BuiltinObject.getInputTextureWidth()
    local h = Amaz.BuiltinObject.getInputTextureHeight()
    if w ~= self.w or h ~= self.h then
        self.w = w
        self.h = h
        self:layout(self.node, self.data, w, h)
    end
    local t = self.curTime - self.startTime
    local T = self.endTime - self.startTime
    self:update(self.node, self.data, t, t / T, w, h)
end

local VISIBLE_STATUS = 0
function SeekModeScript:onEvent (comp, event)
    local args = event.args

---#ifdef DEV
--//    if event.type == Amaz.EventType.TOUCH then
--//        local pointer = args:get(0)
--//        local type = pointer.type
--//        if type == Amaz.TouchType.TOUCH_BEGAN then
--//            local root = Amaz.Map()
--//            root:set("lineSize", Amaz.Map())
--//            root:get("lineSize"):set("value", Amaz.FloatVector())
--//            root:get("lineSize"):get("value"):pushBack(6)
--//            root:get("lineSize"):get("value"):pushBack(17)
--//            root:set("lineColor", Amaz.Map())
--//            root:get("lineColor"):set("value", Amaz.FloatVector())
--//            root:get("lineColor"):get("value"):pushBack(0.996)
--//            root:get("lineColor"):get("value"):pushBack(0.173)
--//            root:get("lineColor"):get("value"):pushBack(0.333)
--//            root:set("frames", Amaz.Vector())
--//            if VISIBLE_STATUS == 1 then
--//                for i = 1, math.random(1, 5) do
--//                    root:get("frames"):pushBack(Amaz.Map())
--//                    root:get("frames"):get(i - 1):set("state", Amaz.Map())
--//                    root:get("frames"):get(i - 1):get("state"):set("value", 1)
--//                    root:get("frames"):get(i - 1):set("rect", Amaz.Map())
--//                    root:get("frames"):get(i - 1):get("rect"):set("value", Amaz.FloatVector())
--//                    root:get("frames"):get(i - 1):get("rect"):get("value"):pushBack(mix(-1, 0, math.random()))
--//                    root:get("frames"):get(i - 1):get("rect"):get("value"):pushBack(mix(-1, 0, math.random()))
--//                    root:get("frames"):get(i - 1):get("rect"):get("value"):pushBack(mix(0, 1, math.random()))
--//                    root:get("frames"):get(i - 1):get("rect"):get("value"):pushBack(mix(0, 1, math.random()))
--//                end
--//            end
--//            args:set(0, "trackFrames")
--//            args:pushBack(root)
--//            VISIBLE_STATUS = 1 - VISIBLE_STATUS
--//        end
--//    end
---#endif

    if "trackFrames" == args:get(0) then
        local src = args:get(1)
        local dst = {dirty = true}

        Log("  ")
        Log("##### trackFrames: %s.%03d #####", os.date("%H:%M:%S"), Amaz.Os.getTime() % 1 * 1000)
        local lineSize = src:get("lineSize"):get("value")
        Log("    lineSize: [%.3f %.3f]", lineSize:get(0), lineSize:get(1))
        local lineColor = src:get("lineColor"):get("value")
        Log("    lineColor: [%.3f %.3f %.3f]", lineColor:get(0), lineColor:get(1), lineColor:get(2))
        dst.stroke = {lineSize:get(0), lineSize:get(1), lineColor:get(0), lineColor:get(1), lineColor:get(2)}
        local frames = src:get("frames")
        Log("    frames:")
        for i = 0, frames:size() - 1 do
            local frame = frames:get(i)
            local state = frame:get("state"):get("value")
            if state == 1 then
                local rect = frame:get("rect"):get("value")
                Log("        rect: [%.3f %.3f %.3f %.3f]", rect:get(0), rect:get(1), rect:get(2), rect:get(3))
                table.insert(dst, {rect:get(0), -rect:get(1), rect:get(2), -rect:get(3)})
            end
        end
        self.frames = dst
    end

end



exports.SeekModeScript = SeekModeScript
return exports
