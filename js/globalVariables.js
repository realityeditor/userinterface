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
    datacraftingVisible: true,
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
    editingModeHaveObject: false,
    angX: 0,
    angY: 0,
    angZ: 0,
    unconstrainedPositioning: false
};

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
    logicSelector:0
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

// const gridSize = 7;
// var grid = null;
// var globalStates.currentLogic = null;

var tempStartBlock = null; // the block you started dragging from
var tempEndBlock = null; // the block you dragged onto
var isPointerDown = false; // always tells you whether the pointer is currently down or up
var isTempLinkBeingDrawn = false; // becomes true when you start dragging out of a block
var isPointerInActiveBlock = false; // always tells you whether the pointer is over a filled block
var isCutLineBeingDrawn = false;

// stores the images for the blocks in each column
var blockImgMap = {
    "filled":["png/datacrafting/blue.png", "png/datacrafting/green.png", "png/datacrafting/yellow.png", "png/datacrafting/red.png"],
    "empty":["png/datacrafting/blue-empty.png", "png/datacrafting/green-empty.png", "png/datacrafting/yellow-empty.png", "png/datacrafting/red-empty.png"]
};

var cutLine = {
    start: null,
    end: null
};

