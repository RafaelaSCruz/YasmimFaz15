local exports = exports or {}
local liquefy = liquefy or {}
liquefy.__index = liquefy

-- input
local MANUAL_BRUSH_STATE = "manual_brush_state"
local MANUAL_BRUSH_STATE_CIRCLE_ENABLE = "circle_enable"
local MANUAL_BRUSH_STATE_CIRCLE_WIDTH = "circle_width"
local MANUAL_BRUSH_STATE_CIRCLE_COLOR = "circle_color"
local MANUAL_BRUSH_STATE_CANVAS_WIDTH = "canvas_width"
local MANUAL_BRUSH_STATE_CANVAS_HEIGHT = "canvas_height"
local MANUAL_BRUSH_STATE_CANVAS_SCALE = "canvas_scale"
local MANUAL_BRUSH_STATE_PREVIEW_SCALE = "preview_scale"
local MANUAL_DEFORM_PRESET = "manual_deformation_algorithm_preset"
local MANUAL_DEFORM_PREVIEW = "manual_deformation_preview"
local MANUAL_DEFORM_ADD = "manual_deformation_add"
local MANUAL_DEFORM_UNDO = "manual_deformation_undo"
local MANUAL_DEFORM_REDO = "manual_deformation_redo"
local MANUAL_DEFORM_CLEAR_REDO = "manual_deformation_clear_redo"
local MANUAL_DEFORM_FINISH = "manual_deformation_finish"
local MANUAL_DEFORM_RESET = "manual_deformation_reset"
local MANUAL_DEFORM_APPLY_ALL = "manual_deformation_apply_all"
local MANUAL_DEFORM_BRUSH_SIZE = "size"
local MANUAL_DEFORM_BRUSH_STEP = "step"
local MANUAL_DEFORM_BRUSH_INTENSITY = "intensity"
local MANUAL_DEFORM_BRUSH_HARDNESS = "hardness"
local MANUAL_DEFORM_STROKE_BEGIN_X = "begin_x"
local MANUAL_DEFORM_STROKE_BEGIN_Y = "begin_y"
local MANUAL_DEFORM_STROKE_END_X = "end_x"
local MANUAL_DEFORM_STROKE_END_Y = "end_y"
local MANUAL_DEFORM_STROKE_IS_VALID = "is_valid"

-- output
local FACE_ID = "id"
local FACE_INDEX = "index"
local MANUAL_DEFORM_STATE = "manual_deformation_state"
local MANUAL_DEFORM_STATE_ENABLE = "enable"
local MANUAL_DEFORM_STATE_PROTECT = "protection"
local MANUAL_DEFORM_STATE_START = "is_start"
local MANUAL_DEFORM_STATE_FINISH = "is_finish"
local MANUAL_DEFORM_STATE_UNDO_COUNT = "undo_count"
local MANUAL_DEFORM_STATE_REDO_COUNT = "redo_count"
local MANUAL_DEFORM_ALGO = "manual_deformation_algorithm"
local MANUAL_DEFORM_ALGO_VERTEX_PATH = "vertex_list_path"
local MANUAL_DEFORM_ALGO_VERTEX_PREFIX = "vertex_list_prefix"
local MANUAL_DEFORM_ALGO_VERTEX_NAME = "vertex_list_name"

-- runtime
local MANUAL_DEFORM_ORIGIN_VERTEX_NAME = "origin_list_name"
local MANUAL_DEFORM_DEFAULT_VERTEX_NAME = "default_list_name"
local MANUAL_DEFORM_UNDO_VERTEX_NAME = "undo_list_name"
local MANUAL_DEFORM_REDO_VERTEX_NAME = "redo_list_name"
local MIN = math.min
local MAX = math.max
local EPSC = 0.001
local VIDEO_FLIP_X = "video_flip_x"
local VIDEO_FLIP_Y = "video_flip_y"
local SEGMENT_ID = "segmentId"
local LOG_TAG = "FACE_BEAUTY_TAG liquefy.lua"

function liquefy.new(construct, ...)
    local self = setmetatable({}, liquefy)

    -- param
    self.circleEnable = 0
    self.circleScale = 1
    self.isStarted = 0
    self.isFinished = 0
    self.maxFaceNum = 10
    self.maxDisplayNum = 5
    self.lastIdArray = {}
    self.faceDeformInitFlags = {}
    self.faceDeformActions = {}
    self.faceDeformMaps = {}
    self.faceDeformMapFlags = {}
    self.faceDeformMapAddIds = {}
    self.faceDeformMapCopyIds = {}
    self.faceDeformHistory = Amaz.HistoryStack()

    return self
end

function liquefy:onStart(comp, script)
    local scene = comp.entity.scene
    self.scriptProps = comp.properties
    self.faceDeformState = self.scriptProps:get(MANUAL_DEFORM_STATE)
    local segmentId = self.scriptProps:get(SEGMENT_ID)
    if segmentId ~= nil then
        self.logTag = string.format('%s %s', LOG_TAG, segmentId)
    else
        self.logTag = LOG_TAG
    end
    self.inputWidth = Amaz.BuiltinObject:getInputTextureWidth()
    self.inputHeight = Amaz.BuiltinObject:getInputTextureHeight()

    self.liquefyCameras = {}
    self.liquefyEntities = {}
    self.liquefyComps = {}
    self.liquefyRenderers = {}
    self.reshapeEntities = {}
    self.reshapeRenderers = {}
    for i = 0, self.maxFaceNum - 1 do
        self.liquefyCameras[i] = scene:findEntityBy("camera_" .. i)
        self.liquefyEntities[i] = scene:findEntityBy("liquefy_" .. i)
        self.liquefyComps[i] = self.liquefyEntities[i]:getComponent("ManualLiquefy")
        self.liquefyRenderers[i] = self.liquefyEntities[i]:getComponent("MeshRenderer")
        self.reshapeEntities[i] = scene:findEntityBy("reshape_" .. i)
        self.reshapeRenderers[i] = self.reshapeEntities[i]:getComponent("MeshRenderer")
        ---Amaz.LOGS(self.logTag, "onStart add liquefy entity " .. self.liquefyEntities[i].name .. " reshape entity " .. self.reshapeEntities[i].name)
    end
    self.blurHEntity = scene:findEntityBy("blur_h")
    self.blurHRenderer = self.blurHEntity:getComponent("MeshRenderer")
    self.blurVEntity = scene:findEntityBy("blur_v")
    self.blurVRenderer = self.blurVEntity:getComponent("MeshRenderer")
    self.touchEntity = scene:findEntityBy("circle")
    self.touchRenderer = self.touchEntity:getComponent("MeshRenderer")
end

function liquefy:onUpdate(comp, deltaTime)

    ---Amaz.LOGS(self.logTag, "liquefy:onUpdate")

    -- get face info by size order
    self:updateFaceInfoBySize()

    -- update face with valid track id
    if self.isStarted == 0 then
        self:lateStart(comp)
    end
    if self.isStarted == 1 then
        self:update(comp, deltaTime)
    end
end

function liquefy:lateStart(comp)
    ---Amaz.LOGS(self.logTag, "lateStart self.isStarted == 0")
    if self.vertexRootPath == nil or self.vertexPrefix == nil then
        return
    end
    ---Amaz.LOGS(self.logTag, "lateStart self.isStarted == 1 vertex root path: " .. self.vertexRootPath .. " vertex prefix: " .. self.vertexPrefix)

    -- init face params
    self.isStarted = 1
    self.isFinished = 0
    for i = 0, self.maxFaceNum - 1 do
        self.lastIdArray[i] = -1
    end
end

function liquefy:update(comp, time)
    -- default disable liquefy and reshape feature
    for i = 0, self.maxFaceNum - 1 do
        self.liquefyCameras[i].visible = false
        self.liquefyEntities[i].visible = false
        self.reshapeEntities[i].visible = false
    end
    if self.faceDeformState:get(MANUAL_DEFORM_STATE_ENABLE) == 0 then
        ---Amaz.LOGS(self.logTag, "update manual deformation is disable")
        return
    end

    -- update render state
    self.inputWidth = Amaz.BuiltinObject:getInputTextureWidth()
    self.inputHeight = Amaz.BuiltinObject:getInputTextureHeight()
    self.blurHRenderer.material:setVec2("blurStep", Amaz.Vector2f(2 / self.inputWidth, 0))
    self.blurVRenderer.material:setVec2("blurStep", Amaz.Vector2f(0, 2 / self.inputHeight))
    -- ---Amaz.LOGS(self.logTag, "update self.inputWidth " .. self.inputWidth .. " self.inputHeight " .. self.inputHeight)

    -- update face params with valid track id in max display num
    for i = 1, self.maxFaceNum do
        local faceInfo = self.faceInfoBySize[i]
        local id = faceInfo.id
        local index = faceInfo.index
        local size = faceInfo.size
        if id ~= -1 and i <= self.maxDisplayNum then
            local liquefyComp = self.liquefyComps[index]
            local deformMap = self.faceDeformMaps[id]
            local defaultMap = self.faceDeformMaps[-1]

            -- add deform params when has true init flag
            if self.faceDeformInitFlags[id] == true and deformMap == nil then
                deformMap = Amaz.Map()
                deformMap:set(FACE_ID, id)
                if defaultMap then
                    deformMap:set(MANUAL_DEFORM_ALGO_VERTEX_NAME, MANUAL_DEFORM_DEFAULT_VERTEX_NAME)
                else
                    deformMap:set(MANUAL_DEFORM_ALGO_VERTEX_NAME, MANUAL_DEFORM_ORIGIN_VERTEX_NAME)
                end
                self.faceDeformMaps[id] = deformMap
            end
            -- apply face reshape when has deform param
            if deformMap ~= nil then
                ---Amaz.LOGS(self.logTag, "update apply deform params in track id " .. id .. " in index " .. index .. " with size " .. size)
                -- reset offset map when has true init flag or diff tracked id
                if self.faceDeformInitFlags[id] == true or self.lastIdArray[index] ~= id then
                    ---Amaz.LOGS(self.logTag, "update refresh vertex list in track id " .. id .. " in index " .. index)
                    self:setVertexState(liquefyComp, deformMap:get(MANUAL_DEFORM_ALGO_VERTEX_NAME))
                    self.liquefyCameras[index].visible = true
                    self.liquefyEntities[index].visible = true
                end
                self.reshapeEntities[index].visible = true
            elseif defaultMap ~= nil then
                ---Amaz.LOGS(self.logTag, "update apply default params in track id " .. id .. " in index " .. index .. " with size " .. size)
                -- reset offset map when has true init flag or diff tracked id
                if self.faceDeformInitFlags[-1] == true or self.lastIdArray[index] ~= id then
                    ---Amaz.LOGS(self.logTag, "update refresh default list in track id " .. id .. " in index " .. index)
                    self:setVertexState(liquefyComp, defaultMap:get(MANUAL_DEFORM_ALGO_VERTEX_NAME))
                    self.liquefyCameras[index].visible = true
                    self.liquefyEntities[index].visible = true
                end
                self.reshapeEntities[index].visible = true
            end

            -- apply curr deform actions
            if self.faceDeformActions[id] ~= nil then
                local deformAction = self.faceDeformActions[id]
                if self.circleEnable == 1 then
                    self:setTouchCircle(deformAction, self.faceDeformMapFlags[id] == nil)
                end
                if deformAction:get(MANUAL_DEFORM_STROKE_IS_VALID) == 1 then
                    local deformIndex = deformAction:get(FACE_INDEX)
                    if deformIndex == nil or deformIndex == index then
                        -- ---Amaz.LOGS(self.logTag, "update apply actions in track id " .. id .. " in index " .. index)
                        self:setTouchInfo(liquefyComp, deformAction)
                        self.faceDeformMapAddIds[index] = id
                    else
                        -- ---Amaz.LOGS(self.logTag, "update copy actions in track id " .. id .. " in index " .. index)
                        self.faceDeformMapCopyIds[index] = id
                    end
                -- else
                --     ---Amaz.LOGS(self.logTag, "update no valid actions in track id " .. id .. " in index " .. index)
                end
            end
            self.lastIdArray[index] = id
        else
            -- ---Amaz.LOGS(self.logTag, "not update invalid track id " .. id .. " in index " .. index .. " with size " .. size)
            self.lastIdArray[index] = -1
        end
    end
end

function liquefy:onLateUpdate(comp, deltaTime)
    if self.isStarted == 1 then
        self:lateUpdate(comp, deltaTime)
    end
end

function liquefy:lateUpdate(comp, time)
    if self.faceDeformState:get(MANUAL_DEFORM_STATE_ENABLE) == 0 then
        ---Amaz.LOGS(self.logTag, "lateUpdate manual deformation is disable")
        return
    end

    for index, id in pairs(self.faceDeformMapAddIds) do
        local mapFlag = self.faceDeformMapFlags[id]
        local liquefyComp = self.liquefyComps[index]
        local liquefyMesh = self.liquefyRenderers[index].mesh
        local vertexFile = nil
        if mapFlag == true then
            ---Amaz.LOGS(self.logTag, "lateUpdate update history in track id " .. id)
            local deformMap = self.faceDeformMaps[id]
            local undoVertex = deformMap:get(MANUAL_DEFORM_ALGO_VERTEX_NAME)
            local redoVertex = self:getUniqueName(self.vertexPrefix)
            local historyBlock = Amaz.Vector()
            self:addHistoryMap(historyBlock, id, undoVertex, redoVertex)
            self.faceDeformHistory:push(historyBlock)

            vertexFile = redoVertex
            deformMap:set(MANUAL_DEFORM_ALGO_VERTEX_NAME, vertexFile)
            liquefyComp:saveVertexState(self:getFullPath(self.vertexRootPath, vertexFile))
        end

        for index2, id2 in pairs(self.faceDeformMapCopyIds) do
            if id2 == id then
                ---Amaz.LOGS(self.logTag, "lateUpdate copy mesh from index " .. index .. " to index " .. index2)
                self.liquefyRenderers[index2].mesh.vertices = liquefyMesh.vertices
                if mapFlag == true then
                    self:setVertexState(self.liquefyComps[index2], vertexFile)
                end
            end
        end
    end

    -- clear all flags
    self.faceDeformInitFlags = {}
    self.faceDeformActions = {}
    self.faceDeformMapFlags = {}
    self.faceDeformMapAddIds = {}
    self.faceDeformMapCopyIds = {}

    -- update states
    self.faceDeformState:set(MANUAL_DEFORM_STATE_START, self.isStarted)
    self.faceDeformState:set(MANUAL_DEFORM_STATE_FINISH, self.isFinished)
    self.faceDeformState:set(MANUAL_DEFORM_STATE_UNDO_COUNT, self.faceDeformHistory:getUndoCount())
    self.faceDeformState:set(MANUAL_DEFORM_STATE_REDO_COUNT, self.faceDeformHistory:getRedoCount())

    -- update face deform params
    local faceDeformParams = Amaz.Vector()
    for id, deformMap in pairs(self.faceDeformMaps) do
        local vertexFile = deformMap:get(MANUAL_DEFORM_ALGO_VERTEX_NAME)
        if vertexFile ~= MANUAL_DEFORM_ORIGIN_VERTEX_NAME and vertexFile ~= MANUAL_DEFORM_DEFAULT_VERTEX_NAME then
            faceDeformParams:pushBack(deformMap)
        end
    end
    self.scriptProps:set(MANUAL_DEFORM_ALGO, faceDeformParams)
end

function liquefy:onEvent(comp, event)
    if event.type == Amaz.AppEventType.SetEffectIntensity then
        self:handleIntensityEvent(comp, event.args)
    end
end

function liquefy:handleIntensityEvent(comp, args)
    local inputKey = args:get(0)
    local inputValue = args:get(1)
    ---Amaz.LOGS(self.logTag, "handleIntensityEvent set " .. inputKey)

    if inputKey == VIDEO_FLIP_X then
        for i = 0, self.maxFaceNum - 1 do
            self.liquefyComps[i].flipHorizontal = inputValue
        end
        for id, deformMap in pairs(self.faceDeformMaps) do
            self.faceDeformInitFlags[id] = true
        end
    elseif inputKey == VIDEO_FLIP_Y then
        for i = 0, self.maxFaceNum - 1 do
            self.liquefyComps[i].flipVertical = inputValue
        end
        for id, deformMap in pairs(self.faceDeformMaps) do
            self.faceDeformInitFlags[id] = true
        end
    elseif inputKey == MANUAL_BRUSH_STATE then
        if inputValue ~= nil then
            self.circleEnable = inputValue:get(MANUAL_BRUSH_STATE_CIRCLE_ENABLE)
            local canvasWidth = inputValue:get(MANUAL_BRUSH_STATE_CANVAS_WIDTH)
            local canvasHeight = inputValue:get(MANUAL_BRUSH_STATE_CANVAS_HEIGHT)
            local canvasScale = inputValue:get(MANUAL_BRUSH_STATE_CANVAS_SCALE)
            local previewScale = inputValue:get(MANUAL_BRUSH_STATE_PREVIEW_SCALE)
            if canvasWidth ~= nil and canvasHeight ~= nil and canvasScale ~= nil and previewScale ~= nil then
                self.circleScale = MAX(self.inputWidth / canvasWidth, self.inputHeight / canvasHeight) / canvasScale / previewScale
                -- ---Amaz.LOGS(self.logTag, "handleIntensityEvent canvasScale " .. canvasScale .. " previewScale " .. previewScale .. " circleScale " .. self.circleScale)
            end
            local circleWidth = inputValue:get(MANUAL_BRUSH_STATE_CIRCLE_WIDTH)
            if circleWidth ~= nil then
                self.touchRenderer.material:setFloat("circle_width", circleWidth * self.circleScale)
            end
            local circleColor = inputValue:get(MANUAL_BRUSH_STATE_CIRCLE_COLOR)
            if circleColor ~= nil then
                self.touchRenderer.material:setVec4("circle_color", Amaz.Vector4f(circleColor:get(0), circleColor:get(1), circleColor:get(2), circleColor:get(3)))
            end
        end
    elseif inputKey == MANUAL_DEFORM_STATE then
        if inputValue ~= nil then
            local faceDeformEnable = inputValue:get(MANUAL_DEFORM_STATE_ENABLE)
            local faceDeformProtect = inputValue:get(MANUAL_DEFORM_STATE_PROTECT)
            if self.faceDeformState:get(MANUAL_DEFORM_STATE_PROTECT) ~= faceDeformProtect then
                for i = 0, self.maxFaceNum - 1 do
                    self:toggleMacro(self.liquefyRenderers[i].material, "FacialProtect", faceDeformProtect)
                end
                for id, deformMap in pairs(self.faceDeformMaps) do
                    self.faceDeformInitFlags[id] = true
                end
            end
            self.faceDeformState:set(MANUAL_DEFORM_STATE_ENABLE, faceDeformEnable)
            self.faceDeformState:set(MANUAL_DEFORM_STATE_PROTECT, faceDeformProtect)
        end
    elseif inputKey == MANUAL_DEFORM_PRESET then
        if inputValue ~= nil then
            self.vertexRootPath = inputValue:get(MANUAL_DEFORM_ALGO_VERTEX_PATH)
            self.vertexPrefix = inputValue:get(MANUAL_DEFORM_ALGO_VERTEX_PREFIX)
        end
    elseif inputKey == MANUAL_DEFORM_PREVIEW or inputKey == MANUAL_DEFORM_ADD then
        if inputValue ~= nil then
            local inputId = inputValue:get(FACE_ID)
            if inputId >= 0 then
                ---Amaz.LOGS(self.logTag, "handleIntensityEvent add action in track id " .. inputId)
                self.faceDeformActions[inputId] = inputValue
                self.faceDeformInitFlags[inputId] = true
                if inputKey == MANUAL_DEFORM_ADD then
                    self.faceDeformMapFlags[inputId] = true
                end
            end
        end
    elseif inputKey == MANUAL_DEFORM_RESET then
        local historyBlock = Amaz.Vector()
        for id, deformMap in pairs(self.faceDeformMaps) do
            ---Amaz.LOGS(self.logTag, "handleIntensityEvent update history in track id " .. id)
            local undoVertex = deformMap:get(MANUAL_DEFORM_ALGO_VERTEX_NAME)
            local redoVertex = MANUAL_DEFORM_ORIGIN_VERTEX_NAME
            deformMap:set(MANUAL_DEFORM_ALGO_VERTEX_NAME, redoVertex)
            self:addHistoryMap(historyBlock, id, undoVertex, redoVertex)
            self.faceDeformInitFlags[id] = true
        end
        self.faceDeformHistory:push(historyBlock)
    elseif inputKey == MANUAL_DEFORM_APPLY_ALL then
        if inputValue ~= nil then
            local inputId = inputValue:get(FACE_ID)
            local inputVertex = inputValue:get(MANUAL_DEFORM_ALGO_VERTEX_NAME)
            if not inputVertex or #inputVertex <= 0 then
                inputVertex = MANUAL_DEFORM_ORIGIN_VERTEX_NAME
            end
            local deformMap = self.faceDeformMaps[inputId]
            if deformMap == nil then
                deformMap = Amaz.Map()
                deformMap:set(FACE_ID, inputId)
                deformMap:set(MANUAL_DEFORM_ALGO_VERTEX_NAME, MANUAL_DEFORM_ORIGIN_VERTEX_NAME)
                self.faceDeformMaps[inputId] = deformMap
            end
            local historyBlock = Amaz.Vector()
            for id, deformMap in pairs(self.faceDeformMaps) do
                ---Amaz.LOGS(self.logTag, "handleIntensityEvent update history in track id " .. id)
                local undoVertex = deformMap:get(MANUAL_DEFORM_ALGO_VERTEX_NAME)
                local redoVertex = inputVertex
                deformMap:set(MANUAL_DEFORM_ALGO_VERTEX_NAME, redoVertex)
                self:addHistoryMap(historyBlock, id, undoVertex, redoVertex)
                self.faceDeformInitFlags[id] = true
            end
            self.faceDeformHistory:push(historyBlock)
        end
    elseif inputKey == MANUAL_DEFORM_UNDO or inputKey == MANUAL_DEFORM_REDO then
        local historyBlock = nil
        local undoFlag = true
        if inputKey == MANUAL_DEFORM_UNDO then
            historyBlock = self.faceDeformHistory:undo()
            undoFlag = true
        else
            historyBlock = self.faceDeformHistory:redo()
            undoFlag = false
        end
        if historyBlock ~= nil then
            for i = 0, historyBlock:size() - 1 do
                local historyMap = historyBlock:get(i)
                local historyId = nil
                local historyVertex = nil
                if undoFlag == true then
                    historyId = historyMap:get(FACE_ID)
                    historyVertex = historyMap:get(MANUAL_DEFORM_UNDO_VERTEX_NAME)
                else
                    historyId = historyMap:get(FACE_ID)
                    historyVertex = historyMap:get(MANUAL_DEFORM_REDO_VERTEX_NAME)
                end
                ---Amaz.LOGS(self.logTag, "handleIntensityEvent apply history in track id " .. historyId)
                local deformMap = self.faceDeformMaps[historyId]
                deformMap:set(MANUAL_DEFORM_ALGO_VERTEX_NAME, historyVertex)
                self.faceDeformInitFlags[historyId] = true
            end
        end
    elseif inputKey == MANUAL_DEFORM_CLEAR_REDO then
        self.faceDeformHistory:clearRedo()
    elseif inputKey == MANUAL_DEFORM_FINISH then
        self.faceDeformHistory:clearAll()
        self.isFinished = 1
    elseif inputKey == MANUAL_DEFORM_ALGO then
        self.faceDeformHistory:clearAll()
        self.isStarted = 0
        for id, deformMap in pairs(self.faceDeformMaps) do
            self.faceDeformMaps[id] = nil
            self.faceDeformInitFlags[id] = true
        end
        local inputSize = inputValue:size()
        for i = 0, inputSize - 1 do
            local inputMap = inputValue:get(i)
            local inputId = inputMap:get(FACE_ID)
            self.faceDeformMaps[inputId] = inputMap
            self.faceDeformInitFlags[inputId] = true
        end
    end
end

function liquefy:setTouchCircle(action, is_move)
    -- update touch circle
    if is_move == true then
        local radius = action:get(MANUAL_DEFORM_BRUSH_SIZE) * 0.5 * self.circleScale
        local end_x = action:get(MANUAL_DEFORM_STROKE_END_X)
        local end_y = action:get(MANUAL_DEFORM_STROKE_END_Y)
        self.touchEntity.visible = true
        self.touchRenderer.material:setFloat("circle_radius", radius)
        self.touchRenderer.material:setVec2("circle_position", Amaz.Vector2f(end_x, end_y))
    else
        self.touchEntity.visible = false
    end
end

function liquefy:setTouchInfo(comp, action)
    -- set liquefy params
    local radius = action:get(MANUAL_DEFORM_BRUSH_SIZE) * 0.5 * self.circleScale
    local intensity = action:get(MANUAL_DEFORM_BRUSH_INTENSITY)
    local hardness = action:get(MANUAL_DEFORM_BRUSH_HARDNESS)
    local step = action:get(MANUAL_DEFORM_BRUSH_STEP)
    local start_x = action:get(MANUAL_DEFORM_STROKE_BEGIN_X)
    local start_y = action:get(MANUAL_DEFORM_STROKE_BEGIN_Y)
    local end_x = action:get(MANUAL_DEFORM_STROKE_END_X)
    local end_y = action:get(MANUAL_DEFORM_STROKE_END_Y)
    comp.radius = radius
    comp.intensity = intensity
    comp.hardness = hardness
    -- ---Amaz.LOGS(self.logTag, "setTouchInfo radius " .. radius .. " intensity " .. intensity .. " hardness " .. hardness .. " step " .. step .. " start_x " .. start_x .. " start_y " .. start_y .. " end_x " .. end_x .. " end_y " .. end_y)

    -- update liquefy touch info
    local pos_s = Amaz.Vector2f(start_x * 0.5 + 0.5, start_y * 0.5 + 0.5)
    local pos_t = Amaz.Vector2f(end_x * 0.5 + 0.5, end_y * 0.5 + 0.5)
    local vec_st = pos_t - pos_s
    local vec_st_scale = vec_st:scale(Amaz.Vector2f(self.inputWidth, self.inputHeight))
    local dist = vec_st_scale:magnitude()
    if dist <= EPSC then
        return
    end
    local deltaD = math.min(dist, radius * step) / dist

    local i = 1
    while i * deltaD <= 1 do
        local pos_0 = pos_s:lerp(pos_t, (i - 1) * deltaD)
        local pos_1 = pos_s:lerp(pos_t, i * deltaD)
        -- ---Amaz.LOGS(self.logTag, "setTouchInfo pos_0.x " .. pos_0.x .. " pos_0.y " .. pos_0.y .. " pos_1.x " .. pos_1.x .. " pos_1.y " .. pos_1.y)
        comp:addTouchInfo(pos_0, pos_1)
        i = i + 1
    end
end

function liquefy:setVertexState(comp, name)
    if name == MANUAL_DEFORM_DEFAULT_VERTEX_NAME then
        local defaultMap = self.faceDeformMaps[-1]
        name = defaultMap:get(MANUAL_DEFORM_ALGO_VERTEX_NAME)
    end
    if name == MANUAL_DEFORM_ORIGIN_VERTEX_NAME then
        comp:resetVertexState()
    else
        local path = self:getFullPath(self.vertexRootPath, name)
        comp:loadVertexState(path)
    end
end

function liquefy:toggleMacro(material, name, enable)
    if enable == 1 then
        material:enableMacro(name, true)
    else
        material:disableMacro(name)
    end
end

function liquefy:addHistoryMap(block, id, undo_vertex, redo_vertex)
    local historyMap = Amaz.Map()
    historyMap:set(FACE_ID, id)
    historyMap:set(MANUAL_DEFORM_UNDO_VERTEX_NAME, undo_vertex)
    historyMap:set(MANUAL_DEFORM_REDO_VERTEX_NAME, redo_vertex)
    block:pushBack(historyMap)
end

function liquefy:updateFaceInfoBySize()
    self.faceInfoBySize = {}

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local faceCount = result:getFaceCount()

    ---Amaz.LOGS(self.logTag, "liquefy:updateFaceInfoBySize faceCount: " .. faceCount)

    local freidCount = result:getFreidInfoCount()

    ---Amaz.LOGS(self.logTag, "liquefy:updateFaceInfoBySize freidCount: " .. freidCount)
    for i = 0, self.maxFaceNum - 1 do
        local trackId = -1
        local faceSize = 0
        local faceYaw = 0.0
        if i < faceCount then
            local baseInfo = result:getFaceBaseInfo(i)
            local faceId = baseInfo.ID
            local faceRect = baseInfo.rect
            for j = 0, freidCount - 1 do
                local freidInfo = result:getFreidInfo(j)
                if faceId == freidInfo.faceid then
                    trackId = freidInfo.trackid
                    faceYaw = baseInfo.yaw
                end
            end
            faceSize = faceRect.width * faceRect.height
        end
        table.insert(self.faceInfoBySize, {
            index = i,
            id = trackId,
            size = faceSize,
            yaw = faceYaw
        })

        ---Amaz.LOGS(self.logTag, "liquefy:updateFaceInfoBySize the index : " ..i..", trackId : "..trackId)
    end
    table.sort(self.faceInfoBySize, function(a, b)
        if (math.abs(a.size - b.size) > 0.000001) then 
            return a.size > b.size
        else
            return math.abs(a.yaw) < math.abs(b.yaw)
        end 
    end)
end

function liquefy:getFullPath(root, name)
    return string.format('%s/%s', root, name)
end

function liquefy:getUniqueName(prefix)
    local seed = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f' }
    local tb = {}
    for i = 1, 8 do
        table.insert(tb, seed[math.random(1, 16)])
    end
    return string.format('%s-%s-%s',
    prefix,
    os.time(),
    table.concat(tb)
    )
end

exports.liquefy = liquefy
return exports