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
 * TODO -
 **

 **********************************************************************************************************************
 ******************************************** GUI content *********************+++*************************************
 **********************************************************************************************************************/


var freezeButtonImage = [];
var guiButtonImage = [];
var preferencesButtonImage = [];
var reloadButtonImage = [];
var resetButtonImage = [];
var unconstButtonImage = [];
var editingButtonImage = [];
var pocketButtonImage = [];
var loadNewUiImage = [];
var blockTabImage = [];

/**********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * @desc
 **/

function GUI() {

    preload(freezeButtonImage,
        'png/freeze.png', 'png/freezeOver.png', 'png/freezeSelect.png', 'png/freezeEmpty.png'
    );
    preload(guiButtonImage,
        'png/intOneOver.png', 'png/intOneSelect.png', 'png/intTwoOver.png', 'png/intTwoSelect.png', 'png/intEmpty.png', 'png/intThree.png'
    );

    preload(pocketButtonImage,
        'png/pocket.png', 'png/pocketOver.png', 'png/pocketSelect.png', 'png/pocketEmpty.png', 'png/blockPocket.png', 'png/blockPocketOver.png', 'png/blockPocketSelect.png'
    );

    preload(preferencesButtonImage,
        'png/pref.png', 'png/prefOver.png', 'png/prefSelect.png', 'png/prefEmpty.png', 'png/blockPref.png', 'png/blockPrefOver.png', 'png/blockPrefSelect.png'
    );
    preload(reloadButtonImage,
        'png/reloadOver.png', 'png/reload.png', 'png/reloadEmpty.png'
    );
    preload(resetButtonImage,
        'png/reset.png', 'png/resetOver.png', 'png/resetSelect.png', 'png/resetEmpty.png'
    );

    preload(unconstButtonImage,
        'png/unconst.png', 'png/unconstOver.png', 'png/unconstSelect.png', 'png/unconstEmpty.png'
    );

    preload(loadNewUiImage,
        'png/load.png', 'png/loadOver.png'
    );

    preload(blockTabImage,
        'png/iconBlocks.png', 'png/iconEvents.png', 'png/iconSignals.png', 'png/iconMath.png', 'png/iconWeb.png'
    );

    document.getElementById("guiButtonImage1").addEventListener("touchstart", function () {
        if (!globalStates.UIOffMode)     document.getElementById('guiButtonImage').src = guiButtonImage[0].src;
        // kickoff();
    });
    ec++;

    document.getElementById("guiButtonImage1").addEventListener("touchend", function () {
        if (!globalStates.UIOffMode)      document.getElementById('guiButtonImage').src = guiButtonImage[1].src;

        globalStates.guiState = "ui";

        if (globalStates.guiState !== "logic") {
            if (DEBUG_DATACRAFTING) {
                craftingBoardVisible(); // TODO: BEN DEBUG - revert to previous line
            } else {
                craftingBoardHide();
            }
        }
    });
    ec++;

    document.getElementById("guiButtonImage2").addEventListener("touchstart", function () {
        if (!globalStates.UIOffMode)     document.getElementById('guiButtonImage').src = guiButtonImage[2].src;
    });
    ec++;

    document.getElementById("guiButtonImage2").addEventListener("touchend", function () {

        if (!globalStates.UIOffMode)     document.getElementById('guiButtonImage').src = guiButtonImage[3].src;
        globalStates.guiState = "node";
        craftingBoardHide();
    });
    ec++;

    document.getElementById("extendedTrackingSwitch").addEventListener("change", function () {
        if (document.getElementById("extendedTrackingSwitch").checked) {
            globalStates.extendedTracking = true;
            window.location.href = "of://extendedTrackingOn";
        } else {
            globalStates.extendedTracking = false;
            window.location.href = "of://extendedTrackingOff";
        }
    });
    ec++;

    document.getElementById("editingModeSwitch").addEventListener("change", function () {

        if (document.getElementById("editingModeSwitch").checked) {
            addEventHandlers();
            globalStates.editingMode = true;
            window.location.href = "of://developerOn";
            globalMatrix.matrixtouchOn = "";
        } else {
            removeEventHandlers();
            globalStates.editingMode = false;
            window.location.href = "of://developerOff";
        }
    });
    ec++;

    document.getElementById("turnOffUISwitch").addEventListener("change", function () {
        if (document.getElementById("turnOffUISwitch").checked) {
            globalStates.UIOffMode = true;
            timeForContentLoaded = 240000;
            window.location.href = "of://clearSkyOn";

        } else {
            globalStates.UIOffMode = false;
            timeForContentLoaded = 240;
            window.location.href = "of://clearSkyOff";

        }
    });
    ec++;

    document.getElementById("resetButton").addEventListener("touchstart", function () {
        if (!globalStates.UIOffMode)    document.getElementById('resetButton').src = resetButtonImage[1].src;

    });
    ec++;

    document.getElementById("resetButton").addEventListener("touchend", function () {

        if (!globalStates.UIOffMode)    document.getElementById('resetButton').src = resetButtonImage[0].src;
        //  window.location.href = "of://loadNewUI"+globalStates.newURLText;

        for (var key in objects) {
            if (!globalObjects.hasOwnProperty(key)) {
                continue;
            }

            var tempResetObject = objects[key];

            if (globalStates.guiState ==="ui") {
                tempResetObject.matrix = [];

                tempResetObject.x = 0;
                tempResetObject.y = 0;
                tempResetObject.scale = 1;

                sendResetContent(key, key, "ui");
            }

            if (globalStates.guiState ==="node") {
            for (var subKey in tempResetObject.nodes) {
                var tempResetValue = tempResetObject.nodes[subKey];



                    tempResetValue.matrix = [];

                   // tempResetValue.x = randomIntInc(0, 200) - 100;
                   // tempResetValue.y = randomIntInc(0, 200) - 100;
                    tempResetValue.scale = 1;

                    sendResetContent(key, subKey, tempResetValue.type);
                }
            }

        }

    });
    ec++;

    /**
     * @desc
     * @param object
     * @param node
     **/

    function sendResetContent(object, node, type) {
// generate action for all links to be reloaded after upload

        var tempThisObject = {};
        if (type === "node") {
            tempThisObject = objects[object].nodes[node];
        } else if(type === "logic"){
            // todo might result in error??
            tempThisObject = objects[object].nodes[node];
        }
        else if (type === "ui"){
            tempThisObject = objects[object];
        }
        var content = {};
        content.x = tempThisObject.x;
        content.y = tempThisObject.y;
        content.scale = tempThisObject.scale;

        if (typeof tempThisObject.matrix === "object") {
            content.matrix = tempThisObject.matrix;
        }

        if (typeof content.x === "number" && typeof content.y === "number" && typeof content.scale === "number") {
            postData('http://' + objects[object].ip + ':' + httpPort + '/object/' + object + "/size/" + node, content);
        }

    }

    document.getElementById("unconstButton").addEventListener("touchstart", function () {
        if (!globalStates.UIOffMode) document.getElementById('unconstButton').src = unconstButtonImage[1].src;
    });
    ec++;

    document.getElementById("unconstButton").addEventListener("touchend", function () {
        if (globalStates.unconstrainedPositioning === true) {
            if (!globalStates.UIOffMode)    document.getElementById('unconstButton').src = unconstButtonImage[0].src;
            globalStates.unconstrainedPositioning = false;

        }
        else {
            if (!globalStates.UIOffMode)    document.getElementById('unconstButton').src = unconstButtonImage[2].src;
            globalStates.unconstrainedPositioning = true;

        }

    });
    ec++;

    document.getElementById("loadNewUI").addEventListener("touchstart", function () {
        if (globalStates.extendedTracking === true) {
            if (!globalStates.UIOffMode)    document.getElementById('loadNewUI').src = loadNewUiImage[3].src;
        }
        else {
            if (!globalStates.UIOffMode)    document.getElementById('loadNewUI').src = loadNewUiImage[1].src;
        }
    });
    ec++;

    document.getElementById("loadNewUI").addEventListener("touchend", function () {

        if (!globalStates.UIOffMode)    document.getElementById('loadNewUI').src = loadNewUiImage[0].src;
        window.location.href = "of://loadNewUI" + globalStates.newURLText;

    });
    ec++;

    document.getElementById("preferencesButton").addEventListener("touchstart", function () {
        if (!globalStates.UIOffMode)    document.getElementById('preferencesButton').src = preferencesButtonImage[1].src;
    });
    ec++;

    document.getElementById("preferencesButton").addEventListener("touchend", function () {

        if (globalStates.guiState === "logic") {
            hideBlockSettings();
            document.getElementById('preferencesButton').src = preferencesButtonImage[4].src;
            return;
        }

        if (globalStates.preferencesButtonState === true) {
            preferencesHide();
            overlayDiv.style.display = "none";

            if (globalStates.editingMode) {
                document.getElementById('resetButton').style.visibility = "visible";
                document.getElementById('unconstButton').style.visibility = "visible";
                document.getElementById('resetButtonDiv').style.display = "inline";
                document.getElementById('unconstButtonDiv').style.display = "inline";
            }

            if (globalStates.UIOffMode) {
                document.getElementById('preferencesButton').src = preferencesButtonImage[3].src;
                document.getElementById('feezeButton').src = freezeButtonImage[3].src;
                document.getElementById('reloadButton').src = reloadButtonImage[2].src;
                document.getElementById('guiButtonImage').src = guiButtonImage[4].src;
                document.getElementById('resetButton').src = resetButtonImage[3].src;
                document.getElementById('unconstButton').src = unconstButtonImage[3].src;
                document.getElementById('pocketButton').src = pocketButtonImage[3].src;
            }

        }
        else {

            document.getElementById('resetButton').style.visibility = "hidden";
            document.getElementById('unconstButton').style.visibility = "hidden";
            document.getElementById('resetButtonDiv').style.display = "none";
            document.getElementById('unconstButtonDiv').style.display = "none";

            addElementInPreferences();

            preferencesVisible();

            overlayDiv.style.display = "inline";

            if (globalStates.UIOffMode) {
                document.getElementById('preferencesButton').src = preferencesButtonImage[0].src;
                document.getElementById('feezeButton').src = freezeButtonImage[0].src;
                document.getElementById('reloadButton').src = reloadButtonImage[0].src;
                document.getElementById('guiButtonImage').src = guiButtonImage[1].src;
                document.getElementById('resetButton').src = resetButtonImage[0].src;
                document.getElementById('unconstButton').src = unconstButtonImage[0].src;
                document.getElementById('pocketButton').src = pocketButtonImage[0].src;
            }

        }

    });
    ec++;

    /**
    * Freeze Button
     */

    document.getElementById("feezeButton").addEventListener("touchstart", function () {
        if (!globalStates.UIOffMode) document.getElementById('feezeButton').src = freezeButtonImage[1].src;
    });
    ec++;
    document.getElementById("feezeButton").addEventListener("touchend", function () {
        if (globalStates.feezeButtonState === true) {
            if (!globalStates.UIOffMode)    document.getElementById('feezeButton').src = freezeButtonImage[0].src;
            globalStates.feezeButtonState = false;
            window.location.href = "of://unfreeze";
        }
        else {
            if (!globalStates.UIOffMode)    document.getElementById('feezeButton').src = freezeButtonImage[2].src;
            globalStates.feezeButtonState = true;
            window.location.href = "of://freeze";
        }

    });


    /**
     * Pocket Button
     */
    var thisPocket =  document.getElementById("pocketButton");
 /*

    document.getElementById("pocketButton").addEventListener("touchstart", function () {
        if (!globalStates.UIOffMode) document.getElementById('pocketButton').src = pocketButtonImage[1].src;
    });
    ec++;
    document.getElementById("pocketButton").addEventListener("touchend", function () {
        if (globalStates.pocketButtonState === true) {
            if (!globalStates.UIOffMode)    document.getElementById('pocketButton').src = pocketButtonImage[0].src;
            globalStates.pocketButtonState = false;

        }
        else {
            if (!globalStates.UIOffMode)    document.getElementById('pocketButton').src = pocketButtonImage[2].src;
        }

    });

*/
    thisPocket.addEventListener("pointerdown", function () {console.log("pointerdown");
        globalStates.pocketButtonDown = true;

    }, false);

    thisPocket.addEventListener("pointerup", function () { console.log("pointerup");
       if(globalStates.pocketButtonDown){
           pocketButtonAction()
       }
        globalStates.pocketButtonDown = false;
        globalStates.pocketButtonUp = true;
    }, false);

    thisPocket.addEventListener("pointerenter", function () { console.log("pointerenter");

        var indexChange = (globalStates.guiState === "logic") ? 4 : 0;
        if (!globalStates.UIOffMode) document.getElementById('pocketButton').src = pocketButtonImage[1+indexChange].src;

        // this is where the virtual point disapears!


        if (pocketItem.pocket.nodes[pocketItemId]) {
            pocketItem.pocket.objectVisible = false;


                hideTransformed("pocket", pocketItemId, pocketItem.pocket.nodes[pocketItemId], "logic");
                delete pocketItem.pocket.nodes[pocketItemId];
            }



    }, false);


    thisPocket.addEventListener("pointerleave", function (evt) { console.log("pointerleave");

        var indexChange = (globalStates.guiState === "logic") ? 4 : 0;
        if (globalStates.pocketButtonState === true) {
            if (!globalStates.UIOffMode)    document.getElementById('pocketButton').src = pocketButtonImage[0+indexChange].src;
        }
        else {
            if (!globalStates.UIOffMode)    document.getElementById('pocketButton').src = pocketButtonImage[2+indexChange].src;
        }

        // this is where the virtual point creates object



        // todo for testing only
        if (globalStates.pocketButtonDown === true && globalStates.guiState ==="node") {

            pocketItemId = uuidTime();
            console.log(pocketItemId);
            pocketItem.pocket.nodes[pocketItemId] = new Logic();

            var thisItem = pocketItem.pocket.nodes[pocketItemId];

            thisItem.x = globalStates.pointerPosition[0] - (globalStates.height / 2);
            thisItem.y = globalStates.pointerPosition[1] - (globalStates.width / 2);

            // else {
            // var matrixTouch =  screenCoordinatesToMatrixXY(thisItem, [evt.clientX,evt.clientY]);
            // thisItem.x = matrixTouch[0];
            // thisItem.y = matrixTouch[1];
            //}
            thisItem.loaded = false;

            var thisObject = pocketItem.pocket;
            // this is a work around to set the state of an objects to not being visible.
            thisObject.objectId = "pocket";
            thisObject.name = "pocket";
            thisObject.objectVisible = false;
            thisObject.screenZ = 1000;
            thisObject.fullScreen = false;
            thisObject.sendMatrix = false;
            thisObject.loaded = false;
            thisObject.integerVersion = 170;
            thisObject.matrix = [];
            // thisObject.nodes = {};
            thisObject.protocol = "R1";

           //
            //thisObject.visibleCounter = timeForContentLoaded;

            //addElement("pocket", pocketItemId, "nodes/" + thisItem.type + "/index.html",  pocketItem.pocket, "logic",globalStates);

        }
        setPocketPossition(evt);

        //TODO: this is a debug method to create random blocks by dragging out from the pocket button while in crafting mode. should be removed eventually.
        /*
        if (globalStates.pocketButtonDown === true && globalStates.guiState === "logic" && !globalStates.currentLogic.tempBlock) {
            console.log("create new block from pocket");

            // Returns a random integer between min (included) and max (excluded)
            // Using Math.round() will give you a non-uniform distribution!
            function getRandomInt(min, max) {
              min = Math.ceil(min);
              max = Math.floor(max);
              return Math.floor(Math.random() * (max - min)) + min;
            }

            var blockWidth = getRandomInt(1,5); //1;
            var itemSelected = 0;

            createTempBlockOnPointer(blockWidth, evt.pageX, evt.pageY, itemSelected);
        }
        */

        // globalStates.pocketButtonDown = false;
       // globalStates.pocketButtonUp = false;
    }, false);




    function pocketButtonAction() {

        console.log("state: " + globalStates.pocketButtonState);

        var indexChange = (globalStates.guiState === "logic") ? 4 : 0;

        if (globalStates.pocketButtonState === true) {
            console.log("buttonon");
            if (!globalStates.UIOffMode)    document.getElementById('pocketButton').src = pocketButtonImage[0+indexChange].src;
            globalStates.pocketButtonState = false;

            if (globalStates.guiState === 'logic') {
                blockMenuVisible();
                console.log("blockMenuVisible");
            }
        }
        else {
            console.log("buttonoff");
            if (!globalStates.UIOffMode)    document.getElementById('pocketButton').src = pocketButtonImage[2+indexChange].src;
            globalStates.pocketButtonState = true;

            if (globalStates.guiState === 'logic') {
                blockMenuHide();
            }
        }

    }




    ec++;
    document.getElementById("reloadButton").addEventListener("touchstart", function () {
        if (!globalStates.UIOffMode)    document.getElementById('reloadButton').src = reloadButtonImage[0].src;
        window.location.href = "of://reload";
    });
    ec++;
    document.getElementById("reloadButton").addEventListener("touchend", function () {
        // location.reload(true);

        window.open("index.html?v=" + Math.floor((Math.random() * 100) + 1));
    });
    ec++;
    cout("GUI");
}

/**
 * @desc
 **/

function preferencesHide() {
    if (!globalStates.UIOffMode)    document.getElementById('preferencesButton').src = preferencesButtonImage[0].src;
    globalStates.preferencesButtonState = false;
    document.getElementById("preferences").style.visibility = "hidden"; //= "hidden";
    document.getElementById("preferences").style.dispaly = "none"; //= "hidden";
    cout("preferencesHide");
}

/**
 * @desc
 **/

function preferencesVisible() {
    if (!globalStates.UIOffMode)    document.getElementById('preferencesButton').src = preferencesButtonImage[2].src;
    globalStates.preferencesButtonState = true;
    document.getElementById("preferences").style.visibility = "visible"; //
    document.getElementById("preferences").style.display = "inline"; //= "hidden";
    cout("preferencesVisible");
}


/**
 * @desc
 **/

function craftingBoardVisible(objectKey, nodeKey) {
    // update side menu buttons
    document.getElementById('guiButtonImage').src = guiButtonImage[5].src;
    document.getElementById('preferencesButton').src = preferencesButtonImage[4].src;
    globalStates.pocketButtonState = true;
    document.getElementById('pocketButton').src = pocketButtonImage[4].src;
    globalStates.guiState = "logic";
    document.getElementById("craftingBoard").style.visibility = "visible";
    document.getElementById("craftingBoard").style.display = "inline";
    cout("craftingBoardVisible for object: " + objectKey + " and node: "+nodeKey);

    if (DEBUG_DATACRAFTING) { // TODO: BEN DEBUG - turn off debugging!
        var logic = new Logic();
        initializeDatacraftingGrid(logic); 
    } else {
        var nodeLogic = objects[objectKey].nodes[nodeKey];
        initializeDatacraftingGrid(nodeLogic);
    }
}

/**
 * @desc
 **/

function craftingBoardHide() {
    // remove the block menu if it's showing
    resetBlockMenu();
    // reset side menu buttons
    document.getElementById('preferencesButton').src = preferencesButtonImage[0].src;
    document.getElementById('pocketButton').src = pocketButtonImage[0].src;
    // hide the crafting board div
    document.getElementById("craftingBoard").style.visibility = "hidden";
    document.getElementById("craftingBoard").style.display = "none";
    // reset the contents of the crafting board div so that another node's logic can be fresh loaded into it
    resetCraftingBoard();
}

/**
 * @desc
 **/

function blockMenuVisible() {
    // create the menu if it doesn't already exist, otherwise just show it
    var existingMenu = document.getElementById('menuContainer');
    if (existingMenu) {
        existingMenu.style.display = 'inline';
        redisplayTabSelection();
        redisplayBlockSelection();
    } else {
        initializeBlockMenu(function() {
          redisplayTabSelection(); // wait for callback to ensure menu fully loaded
          redisplayBlockSelection();
        });
    }
}

/**
 * @desc
 **/

function blockMenuHide() {
    var existingMenu = document.getElementById('menuContainer');
    if (existingMenu) {
        existingMenu.style.display = 'none';
        if (!globalStates.pocketButtonState) {
          globalStates.pocketButtonState = true;
          document.getElementById('pocketButton').src = pocketButtonImage[4].src;
        }
    }
}

/**********************************************************************************************************************
 ******************************************* datacrafting GUI  *******************************************************
 **********************************************************************************************************************/

function addDatacraftingEventListeners() {
    if (globalStates.currentLogic) {
        var datacraftingEventDiv = document.getElementById('datacraftingEventDiv');
        datacraftingEventDiv.addEventListener("pointerdown", pointerDown);
        datacraftingEventDiv.addEventListener("pointermove", pointerMove);
        datacraftingEventDiv.addEventListener("pointerup", pointerUp);
    }
}

function removeDatacraftingEventListeners() {
    if (globalStates.currentLogic) {
        var datacraftingEventDiv = document.getElementById('datacraftingEventDiv');
        datacraftingEventDiv.removeEventListener("pointerdown", pointerDown);
        datacraftingEventDiv.removeEventListener("pointermove", pointerMove);
        datacraftingEventDiv.removeEventListener("pointerup", pointerUp);
    }
}

function resetCraftingBoard() {
    removeDatacraftingEventListeners();
    resetTempLogicState(globalStates.currentLogic);
    var container = document.getElementById('craftingBoard');
    while (container.hasChildNodes()) {
        container.removeChild(container.lastChild);
    }
    globalStates.currentLogic = null;
}

function resetTempLogicState(logic) {
    if (logic) {
        logic.guiState.tempLink = null;
        logic.guiState.tappedContents = null;
        logic.guiState.tempIncomingLinks = [];
        logic.guiState.tempOutgoingLinks = [];
    }
}

// should only be called once to initialize a blank datacrafting interface and data model
function initializeDatacraftingGrid(logic) {
    globalStates.currentLogic = logic;

    var container = document.getElementById('craftingBoard');

    // initializes the data model for the datacrafting board
    logic.grid = new Grid(container.clientWidth, container.clientHeight);

    var datacraftingCanvas = document.createElement('canvas');
    datacraftingCanvas.setAttribute('id', 'datacraftingCanvas');
    container.appendChild(datacraftingCanvas);

    var sidebarBackground = document.createElement('div');
    sidebarBackground.setAttribute('id', 'sidebarBackground');
    container.appendChild(sidebarBackground);

    var dimensions = logic.grid.getPixelDimensions();
    datacraftingCanvas.width = dimensions.width;
    datacraftingCanvas.style.width = dimensions.width;
    datacraftingCanvas.height = dimensions.height;
    datacraftingCanvas.style.height = dimensions.height;

    // holds the colored background blocks
    var blockPlaceholdersContainer = document.createElement('div');
    blockPlaceholdersContainer.setAttribute('id', 'blockPlaceholders');
    container.appendChild(blockPlaceholdersContainer);

    for (var rowNum = 0; rowNum < logic.grid.size; rowNum+=2) {
        var rowDiv = document.createElement('div');
        rowDiv.setAttribute("class", "row");
        blockPlaceholdersContainer.appendChild(rowDiv);

        for (var colNum = 0; colNum < logic.grid.size; colNum++) {
            if (colNum % 2 === 0) {
                var blockPlaceholder = document.createElement('div');
                var className = (colNum === logic.grid.size - 1) ? "blockPlaceholderLastCol" : "blockPlaceholder";
                blockPlaceholder.setAttribute("class", className);
                var colorMapKey = (rowNum === 0 || rowNum === 6) ? "bright" : "faded";
                blockPlaceholder.style.backgroundColor = blockColorMap[colorMapKey][colNum/2];
                rowDiv.appendChild(blockPlaceholder);
            }
        }
    }

    initLogicInOutBlocks();

    var portCells = logic.grid.cells.filter(function(cell) {
        return cell.canHaveBlock() && (cell.location.row === 0 || cell.location.row === logic.grid.size-1);
    });
    replacePortBlocksIfNecessary(portCells);

    // add a container where the real blocks will eventually be added
    var blocksContainer = document.createElement('div');
    blocksContainer.setAttribute('id', 'blocks');
    container.appendChild(blocksContainer);

    // an invisible div on top captures all the touch events and handles them properly
    var datacraftingEventDiv = document.createElement('div');
    datacraftingEventDiv.setAttribute('id', 'datacraftingEventDiv');
    datacraftingEventDiv.setAttribute("touch-action", "none");
    container.appendChild(datacraftingEventDiv);

    updateGrid(logic.grid);
    addDatacraftingEventListeners();
}

function initLogicInOutBlocks() {
    for (var y = -1; y <= 4; y+= 5) {
        var namePrefix = y === -1 ? "in" : "out";
        for (var x = 0; x <= 3; x++) {
            var name = namePrefix + x;
            var activeInputs = (y === -1) ? [false, false, false, false] : [true, false, false, false];
            var activeOutputs = (y === -1) ? [true, false, false, false] : [false, false, false, false];
            var blockJSON = toBlockJSON(name, 1, {}, {}, activeInputs, activeOutputs, ["","","",""], ["","","",""]);
            var globalId = name;
            var block = addBlock(x, y, blockJSON, globalId, true);
        }
    }
}

function toBlockJSON(name, blockSize, privateData, publicData, activeInputs, activeOutputs, nameInput, nameOutput) {
    return {
        name: name,
        blockSize: blockSize,
        privateData: privateData,
        publicData: publicData,
        activeInputs: activeInputs,
        activeOutputs: activeOutputs,
        nameInput: nameInput,
        nameOutput: nameOutput
    };
}

function convertBlockLinkToServerFormat(blockLink) {
    var serverLink = {};

    var keysToSkip = ["route"]; //, "nodeA", "nodeB"
    for (var key in blockLink) {
        if (!blockLink.hasOwnProperty(key)) continue;
        if (keysToSkip.indexOf(key) > -1) continue;
        serverLink[key] = blockLink[key];
    }

    serverLink["route"] = null;

    return serverLink;
}

// strips away unnecessary data from logic node that can be easily regenerated
function convertLogicToServerFormat(logic) {

    var logicServer = {};

    var keysToSkip = ["guiState", "grid", "blocks"];
    for (var key in logic) {
        if (!logic.hasOwnProperty(key)) continue;
        if (keysToSkip.indexOf(key) > -1) continue;
        logicServer[key] = logic[key];
    }

    // VERY IMPORTANT: otherwise the node will think it's already loaded
    // and won't load from the server next time you open the app
    logicServer["loaded"] = false;
    logicServer["visible"] = false;

    // don't upload in/out blocks, those are always the same and live in the editor?
    logicServer["blocks"] = {};
    for (var key in logic.blocks) {
        if (!logic.blocks.hasOwnProperty(key)) continue;
        if (!isInOutBlock(key)) {
            logicServer.blockData[key] = logic.blocks[key];
        }
    }

    return logicServer;
}

function initializeBlockMenu(callback) {
    var logic = globalStates.currentLogic;

    var craftingBoard = document.getElementById('craftingBoard');

    var container = document.createElement('div');
    container.setAttribute('id', 'menuContainer');
    craftingBoard.appendChild(container);

    var menuBlockContainer = document.createElement('div');
    menuBlockContainer.setAttribute('id', 'menuBlockContainer');
    container.appendChild(menuBlockContainer);

    var menuSideContainer = document.createElement('div');
    menuSideContainer.setAttribute('id', 'menuSideContainer');
    container.appendChild(menuSideContainer);

    var menuCols = 4;
    var menuRows = 6;
    var menuNumTabs = 5;
    logic.guiState.menuSelectedTab = 0;
    logic.guiState.menuTabDivs = [];
    logic.guiState.menuIsPointerDown = false;
    logic.guiState.menuSelectedBlock = null;
    logic.guiState.menuBlockDivs = [];

    // create menu tabs for block categories
    for (var i = 0; i < menuNumTabs; i++) {
        var menuTab = document.createElement('div');
        menuTab.setAttribute('class', 'menuTab');
        menuTab.setAttribute('tabIndex', i);
        menuTab.setAttribute('touch-action', 'none');
        menuTab.addEventListener('pointerdown', menuTabSelected);

        var menuTabIcon = document.createElement('img');
        menuTabIcon.setAttribute('class', 'menuTabIcon');
        menuTabIcon.setAttribute('src', blockTabImage[i].src);
        menuTabIcon.setAttribute('touch-action', 'none');
        // menuTabIcon.addEventListener('pointerdown', menuTabIconSelected);

        menuTab.appendChild(menuTabIcon);

        logic.guiState.menuTabDivs.push(menuTab);
        menuSideContainer.appendChild(menuTab);
    }

    menuLoadBlocks( function(blockData) {

        // load each block from the downloaded json and add it to the appropriate category
        for (var key in blockData) {
            if (!blockData.hasOwnProperty(key)) continue;
            var block = blockData[key];

            var categoryIndex = 0;
            if (block.category) {
              categoryIndex = block.category - 1;
            }
            var categoryMenu = logic.guiState.menuBlockData[categoryIndex];
            categoryMenu[key] = block;
        }

        console.log("menuBlockData = ");
        console.log(logic.guiState.menuBlockData);

        for (var r = 0; r < menuRows; r++) {
            var row = document.createElement('div');
            menuBlockContainer.appendChild(row);
            for (var c = 0; c < menuCols; c++) {
                var block = document.createElement('div');
                block.setAttribute('class', 'menuBlock');
                var blockContents = document.createElement('div');
                blockContents.setAttribute('class', 'menuBlockContents');
                blockContents.setAttribute("touch-action", "none");
                blockContents.addEventListener('pointerdown', blockMenuPointerDown);
                blockContents.addEventListener('pointerup', blockMenuPointerUp);
                blockContents.addEventListener('pointerleave', blockMenuPointerLeave);
                blockContents.addEventListener('pointermove', blockMenuPointerMove);
                block.appendChild(blockContents);
                logic.guiState.menuBlockDivs.push(block);
                row.appendChild(block);
            }
        }
        callback();
    });
}

function resetBlockMenu() {
    if (globalStates.currentLogic) {
        var guiState = globalStates.currentLogic.guiState;
        guiState.menuBlockDivs.forEach(function(blockDiv) {
            blockDiv.firstChild.removeEventListener('pointerdown', blockMenuPointerDown);
            blockDiv.firstChild.removeEventListener('pointerup', blockMenuPointerUp);
            blockDiv.firstChild.removeEventListener('pointerleave', blockMenuPointerLeave);
            blockDiv.firstChild.removeEventListener('pointermove', blockMenuPointerMove);
        });
    }
    var container = document.getElementById('menuContainer');
    if (container) {
        while (container.hasChildNodes()) {
            container.removeChild(container.lastChild);
        }
    }
}

function menuLoadBlocks(callback) {
    console.log("should get available blocks");
    var keys = getServerObjectLogicKeys(globalStates.currentLogic);
    getData('http://' + keys.ip + ':' + httpPort + '/availableLogicBlocks', keys.objectKey, function (req, thisKey) {
        console.log("did get available blocks");
        console.log(req);
        console.log(thisKey);
        callback(req);
    });
}

function menuTabSelected(e) {
    e.preventDefault();

    var guiState = globalStates.currentLogic.guiState;
    guiState.menuSelectedTab = e.target.tabIndex;
    if (guiState.menuSelectedTab < 0) guiState.menuSelectedTab = e.target.parentNode.tabIndex;
    if (guiState.menuSelectedTab < 0) guiState.menuSelectedTab = 0;
    redisplayTabSelection();
    redisplayBlockSelection();
}

function redisplayTabSelection() {

    var guiState = globalStates.currentLogic.guiState;
    guiState.menuTabDivs.forEach(function(tab) {
        if (guiState.menuSelectedTab === tab.tabIndex) {
            tab.setAttribute('class', 'menuTabSelected');
        } else {
            tab.setAttribute('class', 'menuTab');
        }
    });
}

function getBlockIcon(logic, blockName) {
    var keys = getServerObjectLogicKeys(logic);

    if (blockIconCache[keys.logicKey] === undefined) {
        blockIconCache[keys.logicKey] = {};
    }

    // download icon to cache if not already there
    if (blockIconCache[keys.logicKey][blockName] === undefined) {
        var iconUrl = 'http://' + keys.ip + ':' + httpPort + '/logicBlock/' + blockName + "/icon.png";
        var icon = new Image();
        icon.src = iconUrl;
        blockIconCache[keys.logicKey][blockName] = icon;
    }

    // otherwise just directly return from cache
    return blockIconCache[keys.logicKey][blockName];
}

function redisplayBlockSelection() {
    var guiState = globalStates.currentLogic.guiState;

    var blocksObject = guiState.menuBlockData[guiState.menuSelectedTab];
    var blocksInThisSection = [];
    for (var key in blocksObject) {
        blocksInThisSection.push(blocksObject[key]);
    }

    // reassign as many divs as needed to the current set of blocks
    for (var i = 0; i < blocksInThisSection.length; i++) {
        var blockDiv = guiState.menuBlockDivs[i];
        var thisBlockData = blocksInThisSection[i];
        blockDiv.blockData = thisBlockData;
        blockDiv.firstChild.innerHTML = ""; // reset block contents before adding anything

        // load icon and title
        var iconImage = document.createElement("img");
        iconImage.setAttribute('class', 'blockIcon');
        iconImage.src = getBlockIcon(globalStates.currentLogic, thisBlockData.name).src;
        blockDiv.firstChild.appendChild(iconImage);

        var blockTitle = document.createElement('div');
        blockTitle.setAttribute('class', 'blockTitle');
        blockTitle.innerHTML = thisBlockData.text;
        blockDiv.firstChild.appendChild(blockTitle);

        blockDiv.style.display = 'inline-block';
    }

    // clear the remaining block divs
    for (var i = blocksInThisSection.length; i < guiState.menuBlockDivs.length; i++) {
        var blockDiv = guiState.menuBlockDivs[i];
        blockDiv.blockData = '';
        blockDiv.style.display = 'none';
    }
}

function blockMenuPointerDown(e) {
  e.preventDefault();

  var guiState = globalStates.currentLogic.guiState;
  guiState.menuBlockToAdd = null;
  guiState.menuIsPointerDown = true;
  guiState.menuSelectedBlock = e.currentTarget;
  guiState.menuSelectedBlock.parentNode.setAttribute('class', 'menuBlockSelected');
  guiState.menuBlockToAdd = e.currentTarget.parentNode;
}

function blockMenuPointerUp(e) {
    e.preventDefault();
  
    var guiState = globalStates.currentLogic.guiState;
    guiState.menuIsPointerDown = false;
    if (guiState.menuSelectedBlock) {
        guiState.menuSelectedBlock.parentNode.setAttribute('class', 'menuBlock');
    }
    guiState.menuSelectedBlock = null;
    guiState.menuBlockToAdd = null;
}

function blockMenuPointerLeave(e) {
    e.preventDefault();

    var guiState = globalStates.currentLogic.guiState;
    if (guiState.menuIsPointerDown) {
        if (guiState.menuSelectedBlock) {
            guiState.menuSelectedBlock.parentNode.setAttribute('class', 'menuBlock');        
        }
    }
    guiState.menuSelectedBlock = null;
    guiState.menuBlockToAdd = null;
}

function blockMenuPointerMove(e) {
    e.preventDefault();

    var guiState = globalStates.currentLogic.guiState;
    if (guiState.menuBlockToAdd) {
        var blockJSON = guiState.menuBlockToAdd.blockData;
        var blockRect = guiState.menuBlockToAdd.getBoundingClientRect();
        var pointerX = blockRect.left + blockRect.width/2;
        var pointerY = blockRect.top + blockRect.height/2;
        addBlockFromMenu(blockJSON, pointerX, pointerY);
        guiState.menuBlockToAdd = null;
        blockMenuHide();
    }
}

/**********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * @desc
 * @param array
 **/

function preload(array) {
    for (var i = 0; i < preload.arguments.length - 1; i++) {
        array[i] = new Image();
        array[i].src = preload.arguments[i + 1];
    }

    cout("preload");
}




