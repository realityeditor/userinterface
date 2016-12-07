/**
 * @preserve
 *
 *                                      .,,,;;,'''..
 *                                  .'','...     ..',,,.
 *                                .,,,,,,',,',;;:;,.  .,l,
 *                               .,',.     ...     ,;,   :l.
 *                              ':;.    .'.:do;;.    .c   ol;'.
 *       ';;'                   ;.;    ', .dkl';,    .c   :; .'.',::,,'''.
 *      ',,;;;,.                ; .,'     .'''.    .'.   .d;''.''''.
 *     .oxddl;::,,.             ',  .'''.   .... .'.   ,:;..
 *      .'cOX0OOkdoc.            .,'.   .. .....     'lc.
 *     .:;,,::co0XOko'              ....''..'.'''''''.
 *     .dxk0KKdc:cdOXKl............. .. ..,c....
 *      .',lxOOxl:'':xkl,',......'....    ,'.
 *           .';:oo:...                        .
 *                .cd,      ╔═╗┌┬┐┬┌┬┐┌─┐┬─┐    .
 *                  .l;     ║╣  │││ │ │ │├┬┘    '
 *                    'l.   ╚═╝─┴┘┴ ┴ └─┘┴└─   '.
 *                     .o.                   ...
 *                      .''''','.;:''.........
 *                           .'  .l
 *                          .:.   l'
 *                         .:.    .l.
 *                        .x:      :k;,.
 *                        cxlc;    cdc,,;;.
 *                       'l :..   .c  ,
 *                       o.
 *                      .,
 *
 *              ╦ ╦┬ ┬┌┐ ┬─┐┬┌┬┐  ╔═╗┌┐  ┬┌─┐┌─┐┌┬┐┌─┐
 *              ╠═╣└┬┘├┴┐├┬┘│ ││  ║ ║├┴┐ │├┤ │   │ └─┐
 *              ╩ ╩ ┴ └─┘┴└─┴─┴┘  ╚═╝└─┘└┘└─┘└─┘ ┴ └─┘
 *
 *
 * Created by Valentin on 10/22/14.
 *
 * Copyright (c) 2015 Valentin Heun
 *
 * All ascii characters above must be included in any redistribution.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
/*********************************************************************************************************************
 ******************************************** TODOS *******************************************************************
 **********************************************************************************************************************

 **
 * TODO
 **

 **********************************************************************************************************************
 ******************************************** constant settings *******************************************************
 **********************************************************************************************************************/

var ec = 0;
var disp = {};

var uiButtons;
var guiButtonImage;
var httpPort = 8080;
var timeForContentLoaded = 240; // temporary set to 1000x with the UI Recording mode for video recording
var timeCorrection = {delta: 0, now: 0, then: 0};

/**********************************************************************************************************************
 ******************************************** global variables  *******************************************************
 **********************************************************************************************************************/

// global namespace
var realityEditor = realityEditor || {
        constructors: {
            Object: {},
            Link: {},
            Node: {},
            LogicNode: {},
            LogicGUIState: {},
            BlockLink: {},
            BlockNode: {},
            EdgeBlockNode: {},
            Data: {}
        },
        objects: {},
        states: {},
        device: {
            addEventHandlers: {},
            onLoad: {},
            onTouchDown: {},
            onFalseTouchUp: {},
            onTrueTouchUp: {},
            onTouchEnter: {},
            onTouchLeave: {},
            onCanvasPointerDown: {},
            onDocumentPointerUp: {},
            onDocumentPointerDown: {},
            onMultiTouchStart: {},
            onMultiTouchMove: {},
            onMultiTouchEnd: {},
            onMultiTouchCanvasStart: {},
            onMultiTouchCanvasMove: {},
            setDeviceName: {},
            setStates: {},
            removeEventHandlers: {},
            utilities: {
                cout: {},
                newURLTextLoad: {},
                map: {},
                uuidTime: {},
                uuidTimeShort: {},
                randomIntInc: {}
            }
        },
        network: {
            addHeartbeatObject: {},
            onAction: {},
            onPostMessage: {},
            deleteData: {},
            deleteLinkFromObject: {},
            deleteBlockFromObject: {},
            deleteBlockLinkFromObject: {},
            postLinkToServer: {},
            getData: {},
            postData: {},
            postNewLink: {},
            postNewBlockLink: {},
            postNewLogicNode: {},
            postNewBlockPosition: {},
            postNewBlock: {},
            checkForNetworkLoop: {},
            utilities: {
                rename: {}
            }
        },
        gui: {
            canvasCache: {},
            domCache: {},
            utilities: {
                getPosition: {},

                timeSynchronizer: {},
                checkLineCross: {},
                lineEq: {},
                slopeCalc: {},
                calculateX: {},
                calculateY: {},
                checkBetween: {},

                getCenterOfPoints: {},
                sortPointsClockwise: {},
                getCornersClockwise: {},
                areCornersEqual: {},
                areCornerPairsIdentical: {},
                areCornerPairsSymmetric: {},
                areCornersAdjacent: {},
                areCornersOppositeZ: {},
                addCornerPairToOppositeCornerPairs: {},
                estimateIntersection: {}
            },
            setup: {},
            ar: {
                matrixStates: {},
                setProjectionMatrix: {},
                draw: {
                    update: {},
                    drawTransformed: {},
                    webkitTransformMatrix3d: {},
                    hideTransformed: {},
                    addElement: {},
                    killObjects: {},
                    onIframeLoad: {}
                },
                positioning: {
                    onScaleEvent: {}
                },
                lines: {
                    temporaryLink: {},
                    deleteLines: {},
                    drawAllLines: {},
                    drawInteractionLines: {},
                    drawLine: {},
                    drawDotLine: {},
                    drawGreen: {},
                    drawRed: {},
                    drawBlue: {},
                    drawYellow: {},
                    drawSimpleLine: {}
                },
                utilities: {
                    multiplyMatrix: {},
                    multiplyMatrix4: {},
                    copyMatrix: {},
                    invertMatrix: {},
                    toAxisAngle: {},
                    screenCoordinatesToMatrixXY: {},
                    insidePoly: {}
                }
            },
            buttons: {
                imageCache: {},
                preload: {}
            },
            pocket: {
                pocketItem: {"pocket": new Objects()},
                pocketItemId: "",
                setPocketPosition: {}
            },
            preferences: {
                addElementInPreferences: {},
                preferencesHide: {},
                preferencesVisible: {}
            },
            crafting: {
                logicStates: {},
                updateGrid: {},
                addDomElementForBlock: {},
                redrawDataCrafting: {},
                drawDataCraftingLine: {},
                craftingBoardVisible: {},
                craftingBoardHide: {},
                blockMenuVisible: {},
                blockMenuHide: {},
                addDataCraftingEventListeners: {},
                removeDataCraftingEventListeners: {},
                resetCraftingBoard: {},
                resetTempLogicState: {},
                initializeDataCraftingGrid: {},
                initLogicInOutBlocks: {},
                utilities: {
                    toBlockJSON: {},
                    toLogicJSON: {},
                    convertBlockLinkToServerFormat: {},
                    convertLogicToServerFormat: {},
                    readTextFile: {},
                    parseJSONToLogic: {},
                    blockColorMap: {}
                },
                blockMenu: {
                    initializeBlockMenu: {},
                    resetBlockMenu: {},
                    menuLoadBlocksNew: {},
                    menuLoadBlocks: {},
                    defaultBlockData: {},
                    menuTabSelected: {},
                    redisplayTabSelection: {},
                    redisplayBlockSelection: {},
                    blockMenuPointerDown: {},
                    blockMenuPointerUp: {},
                    blockMenuPointerLeave: {},
                    blockMenuPointerMove: {}
                },
                grid: {
                    Grid: function (width, height) {
                    },
                    Cell: function (location) {
                    },
                    CellLocation: function (col, row) {
                    },
                    Route: function (cellLocations) {
                    },
                    RouteSegment: function (route, horz, vert) {
                    },
                    getBlock: {},
                    getCellForBlock: {},
                    getBlockOverlappingPosition: {},
                    isBlockOutsideGrid: {},
                    convertGridPosToBlockPos: {},
                    convertBlockPosToGridPos: {},
                    addBlockLink: {},
                    blockWithID: {},
                    addBlock: {},
                    updateInOutLinks: {},
                    isInOutLink: {},
                    isInOutBlock: {},
                    forEachLink: {},
                    allLinks: {},
                    setTempLink: {},
                    removeBlockLink: {},
                    removeBlock: {},
                    removeLinksForBlock: {},
                    doesLinkAlreadyExist: {},
                    areBlockLinksEqual: {},
                    preprocessPointsForDrawing: {}
                },
                eventHelper: {
                    getCellOverPointer: {},
                    getCellContents: {},
                    areCellsEqual: {},
                    areBlocksEqual: {},
                    convertToTempBlock: {},
                    moveBlockDomToPosition: {},
                    snapBlockToCellIfPossible: {},
                    offsetForItem: {},
                    canConnectBlocks: {},
                    canDrawLineFrom: {},
                    areBlocksTempConnected: {},
                    canPlaceBlockInCell: {},
                    styleBlockForHolding: {},
                    styleBlockForPlacement: {},
                    shouldUploadBlock: {},
                    shouldUploadBlockLink: {},
                    getServerObjectLogicKeys: {},
                    placeBlockInCell: {},
                    removePortBlocksIfNecessary: {},
                    getOutgoingLinks: {},
                    getIncomingLinks: {},
                    replacePortBlocksIfNecessary: {},
                    updateTempLinkOutlinesForBlock: {},
                    convertTempLinkOutlinesToLinks: {},
                    blocksExist: {},
                    resetTempLinkOutlines: {},
                    removeTappedContents: {},
                    createTempLink: {},
                    resetTempLink: {},
                    drawLinkLine: {},
                    resetLinkLine: {},
                    drawCutLine: {},
                    resetCutLine: {},
                    createLink: {},
                    cutIntersectingLinks: {},
                    getDomElementForBlock: {},
                    generateBlockGlobalId: {},
                    isPortBlock: {},
                    isInputBlock: {},
                    isOutputBlock: {},
                    addBlockFromMenu: {},
                    openBlockSettings: {},
                    handleBlockSettingsChange: {},
                    hideBlockSettings: {}
                },
                eventHandlers: {
                    pointerDown: {},
                    pointerMove: {},
                    pointerUp: {}
                }
            },
            memory: {
                MemoryContainer: function (element) {
                },
                MemoryPointer: function (link, isObjectA) {
                },
                initMemoryBar: function () {
                },
                removeMemoryBar: function () {
                },
                receiveThumbnail: function (thumbnailUrl) {
                },
                addObjectMemory: function (obj) {
                },
                getMemoryWithId: function (id) {
                },
                getMemoryPointerWithId: function (id) {
                },
                memoryCanCreate: function () {
                },
                createMemoryWeb: function () {
                },
                removeMemoryWeb: function () {
                }
            },
            advertisement: {
                temporaryLink: {},
                timeout: {},
                links: {},
                logic: {},
                touchStart: {},
                touchEnd: {},
                draw: {},
                reset: {}
            }
        }
    };

var globalStates = {
    debug: false,
    overlay: 0,
    device: "",
    // drawWithLines
    ballDistance: 14,
    ballSize: 6,
    ballAnimationCount: 0,

    width: window.screen.width,
    height: window.screen.height,
    guiState: "ui",
    UIOffMode: false,
    preferencesButtonState: false,
    extendedTracking: false,
    currentLogic: null,

    extendedTrackingState: false,
    developerState: false,
    clearSkyState: false,
    externalState: "",
    sendMatrix3d: false,
    sendAcl: false,

    pocketButtonState: false,
    pocketButtonDown: false,
    pocketButtonUp: false,
    feezeButtonState: false,
    logButtonState: false,
    editingMode: false,
    guiURL: "",
    newURLText: "",
    platform: navigator.platform,
    lastLoop: 0,
    notLoading: "",
    drawDotLine: false,
    drawDotLineX: 0,
    drawDotLineY: 0,
    pointerPosition: [0, 0],
    projectionMatrix: [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ],
    realProjectionMatrix: [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ],
    acceleration:{
            x : 0,
            y : 0,
            z : 0,
            alpha: 0,
            beta: 0,
            gamma: 0,
            motion:0
        },
    sendAcceleration : false,
    editingModeHaveObject: false,
    angX: 0,
    angY: 0,
    angZ: 0,
    unconstrainedPositioning: false,
    thisAndthat : {
        interval: undefined,
        timeout: undefined
    }
};

var g = globalStates; // BEN TODO: REMOVE DEBUG ALIAS

var globalCanvas = {};

var globalLogic ={
     size:0,
 x:0,
y:0,
    rectPoints: [],
    farFrontElement:"",
    frontDepth: 1000000


};

var pocketItem  = {"pocket" : new Objects()};
var pocketItemId = "";


var globalSVGCach = {};

var globalDOMCach = {};

var globalObjects = "";

var globalProgram = {
    objectA: false,
    nodeA: false,
    logicA:false,
    objectB: false,
    nodeB: false,
    logicB:false,
    logicSelector:4
};

var objects = {};

var globalMatrix = {
    temp: [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ],
    begin: [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ],
    end: [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ],
    r: [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ],
    r2: [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ],
    matrixtouchOn: false,
    copyStillFromMatrixSwitch: false
};

var consoleText = "";
var rotateX = [
    1, 0, 0, 0,
    0, -1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
];

var testInterlink = {};

var overlayDiv;
//var overlayImg;
//var overlayImage = [];

/**********************************************************************************************************************
 ***************************************** datacrafting variables  ****************************************************
 **********************************************************************************************************************/

 var blockColorMap = {
    bright:["#2DFFFE", "#29FD2F", "#FFFD38", "#FC157D"], // blue, green, yellow, red
    faded:["#EAFFFF", "#EAFFEB", "#FFFFEB", "#FFE8F2"] // lighter: blue, green, yellow, red
}
var activeBlockColor = "#E6E6E6"; // added blocks are grey
var movingBlockColor = "#FFFFFF"; // blocks turn white when you start to drag them

var DEBUG_DATACRAFTING = false; // when TRUE -> shows crafting board just by tapping on first menu item (DEBUG mode)
