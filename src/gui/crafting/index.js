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
 *      ╦═╗┌─┐┌─┐┬  ┬┌┬┐┬ ┬  ╔═╗┌┬┐┬┌┬┐┌─┐┬─┐  ╔═╗┬─┐┌─┐ ┬┌─┐┌─┐┌┬┐
 *      ╠╦╝├┤ ├─┤│  │ │ └┬┘  ║╣  │││ │ │ │├┬┘  ╠═╝├┬┘│ │ │├┤ │   │
 *      ╩╚═└─┘┴ ┴┴─┘┴ ┴  ┴   ╚═╝─┴┘┴ ┴ └─┘┴└─  ╩  ┴└─└─┘└┘└─┘└─┘ ┴
 *
 *
 * Created by Valentin on 10/22/14.
 *
 * Copyright (c) 2016 Benjamin Reynholds
 * Modified by Valentin Heun 2016
 * Modified by Benjamin Reynholds 2016
 * Modified by James Hobin 2016
 *
 * All ascii characters above must be included in any redistribution.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

createNameSpace("realityEditor.gui.crafting");

realityEditor.gui.crafting.updateGrid = function(grid) {
    console.log("update grid!");

    // *** this does all the backend work ***
    grid.recalculateAllRoutes();

    var guiState = globalStates.currentLogic.guiState;

    // reset domElements 
    for (var domKey in guiState.blockDomElements) {
        var blockDomElement = guiState.blockDomElements[domKey];

        // remove dom elements if their blocks are gone or needs to be reset
        if (this.shouldRemoveBlockDom(blockDomElement)) {
            blockDomElement.parentNode.removeChild(blockDomElement);
            delete guiState.blockDomElements[domKey];
        }
    }

    // add new domElement for each block that needs one
    for (var blockKey in globalStates.currentLogic.blocks) {
        var block = globalStates.currentLogic.blocks[blockKey];
        if (block.isPortBlock) continue; // don't render invisible input/output blocks
        if (this.grid.isBlockOutsideGrid(block, grid) && !this.eventHelper.isPortBlock(block)) { // cleanup incorrectly setup blocks // TODO: prevent this in the first place rather than checking each time
            this.grid.removeBlock(globalStates.currentLogic, blockKey);
            continue;
        }

        // only add if the block doesn't already have one
        var blockDomElement = guiState.blockDomElements[block.globalId];
        if (!blockDomElement) {
            this.addDomElementForBlock(block, grid);
        }

    }
};

realityEditor.gui.crafting.removeBlockDom = function(block) {
    var blockDomElement = this.eventHelper.getDomElementForBlock(block);
    blockDomElement.parentNode.removeChild(blockDomElement);
    delete globalStates.currentLogic.guiState.blockDomElements[block.globalId];
};

realityEditor.gui.crafting.shouldRemoveBlockDom = function(blockDomElement) {
    return (this.getBlockForDom(blockDomElement) === null);
};

realityEditor.gui.crafting.getBlockForDom = function(blockDomElement) {
    for (var blockKey in globalStates.currentLogic.blocks) {
        var block = globalStates.currentLogic.blocks[blockKey];
        if (globalStates.currentLogic.guiState.blockDomElements[block.globalId] === blockDomElement) {
            return block;
        }
    }
    return null;
};

realityEditor.gui.crafting.addDomElementForBlock = function(block, grid, isTempBlock) {
    var blockDomElement = document.createElement('div');
    blockDomElement.setAttribute('class','blockDivPlaced');

    var blockContents = document.createElement('div');
    blockContents.setAttribute('class', 'menuBlockContents');
    blockContents.setAttribute("touch-action", "none");
    blockDomElement.appendChild(blockContents);

    // add icon and title to block
    if (block.name) {

        // show image full width and height of block if able to find
        var blockIcon = this.getBlockIcon(globalStates.currentLogic, block.type);
        if (blockIcon) {
            var iconImage = document.createElement("img");
            iconImage.setAttribute('class', 'blockIcon');
            iconImage.src = blockIcon.src;
            blockContents.appendChild(iconImage);

            // Show name if there isn't an image to show
        } else {
            var blockTitle = document.createElement('div');
            blockTitle.setAttribute('class', 'blockTitle');
            blockTitle.innerHTML = block.name;
            blockContents.appendChild(blockTitle);
        }

        // add a transparent div on top to display stripes when moving the block
        var moveDiv = document.createElement("div");
        moveDiv.setAttribute('class', 'blockMoveDiv');
        blockContents.appendChild(moveDiv);
    }
    blockDomElement.style.display = 'inline-block';

    // if we're adding a temp block, it doesn't have associated cells it can use to calculate position. we need to remember to set position to pointer afterwards
    if (!isTempBlock) { //TODO: is there a way to set position for new blocks consistently?
        var firstCell = this.grid.getCellForBlock(grid, block, 0);
        var firstCellCenterX = grid.getCellCenterX(firstCell);
        blockDomElement.style.left = firstCellCenterX - grid.blockColWidth/2;
        blockDomElement.style.top = grid.getCellCenterY(firstCell) - grid.blockRowHeight/2;
    }

    blockDomElement.style.width = this.grid.getBlockPixelWidth(block,grid);
    blockDomElement.style.height = grid.blockRowHeight;

    var blockContainer = document.getElementById('blocks');
    blockContainer.appendChild(blockDomElement);

    var guiState = globalStates.currentLogic.guiState;
    guiState.blockDomElements[block.globalId] = blockDomElement;
};

realityEditor.gui.crafting.getBlockIcon = function(logic, blockName) {
    var keys = this.eventHelper.getServerObjectLogicKeys(logic);

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

// updates datacrafting visuals each frame
// renders all the links for a datacrafting grid, draws cut line if present, draws temp block if present
realityEditor.gui.crafting.redrawDataCrafting = function() {
    if (!globalStates.currentLogic) return;
    var grid = globalStates.currentLogic.grid;

    var canvas = document.getElementById("datacraftingCanvas");
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height);

    this.grid.forEachLink( function(link) {
        var startCell =  this.grid.getCellForBlock(grid, this.grid.blockWithID(link.nodeA, globalStates.currentLogic), link.logicA);
        var endCell =  this.grid.getCellForBlock(grid, this.grid.blockWithID(link.nodeB, globalStates.currentLogic), link.logicB);
        this.drawDataCraftingLine(ctx, link, 5, startCell.getColorHSL(), endCell.getColorHSL(), timeCorrection);
    });

    var cutLine = globalStates.currentLogic.guiState.cutLine;
    if (cutLine.start && cutLine.end) {
        this.realityEditor.gui.ar.lines.drawSimpleLine(ctx, cutLine.start.x, cutLine.start.y, cutLine.end.x, cutLine.end.y, "#FFFFFF", 3);
    }

    var tempLine = globalStates.currentLogic.guiState.tempLine;
    if (tempLine.start && tempLine.end) {
        this.realityEditor.gui.ar.lines.drawSimpleLine(ctx, tempLine.start.x, tempLine.start.y, tempLine.end.x, tempLine.end.y, tempLine.color, 3);
    }

    var tappedContents = globalStates.currentLogic.guiState.tappedContents;
    if (tappedContents) {
        var domElement = this.eventHelper.getDomElementForBlock(tappedContents.block);
        if (!domElement) return;

        globalStates.currentLogic.guiState.tempIncomingLinks.forEach( function(linkData) {
            var startCell = this.grid.getCellForBlock(grid, this.grid.blockWithID(linkData.nodeA, globalStates.currentLogic), linkData.logicA);
            if (!startCell && this.grid.isInOutBlock(linkData.nodeA)) {
                var col = linkData.nodeA.slice(-1) * 2;
                startCell = grid.getCell(col, 0);
            }
            var startX = grid.getCellCenterX(startCell);
            var startY = grid.getCellCenterY(startCell);

            var xOffset =  0.5 * grid.blockColWidth + (grid.blockColWidth + grid.marginColWidth) * linkData.logicB;
            var endX = parseInt(domElement.style.left) + xOffset;
            var endY = parseInt(domElement.style.top) + domElement.clientHeight/2;
            var startColor = startCell.getColorHSL();
            var lineColor = 'hsl('+startColor.h+','+startColor.s+'%,'+startColor.l+'%)';

            this.realityEditor.gui.ar.lines.drawSimpleLine(ctx, startX, startY, endX, endY, lineColor, 2);
        });

        globalStates.currentLogic.guiState.tempOutgoingLinks.forEach( function(linkData) {
            var xOffset =  0.5 * grid.blockColWidth + (grid.blockColWidth + grid.marginColWidth) * linkData.logicA;
            var startX = parseInt(domElement.style.left) + xOffset;
            var startY = parseInt(domElement.style.top) + domElement.clientHeight/2;

            var endCell = this.grid.getCellForBlock(grid, this.grid.blockWithID(linkData.nodeB, globalStates.currentLogic), linkData.logicB);
            if (!endCell && this.grid.isInOutBlock(linkData.nodeB)) {
                var col = linkData.nodeB.slice(-1) * 2;
                endCell = grid.getCell(col, 6);
            }
            var endX = grid.getCellCenterX(endCell);
            var endY = grid.getCellCenterY(endCell);
            var endColor = endCell.getColorHSL();
            var lineColor = 'hsl('+endColor.h+','+endColor.s+'%,'+endColor.l+'%)';

            this.realityEditor.gui.ar.lines.drawSimpleLine(ctx, startX, startY, endX, endY, lineColor, 2);
        });
    }
};

realityEditor.gui.crafting.drawDataCraftingLine = function(context, linkObject, lineStartWeight, startColor, endColor, timeCorrector ) {
    var mathPI = 2*Math.PI;
    var spacer = 2.3;

    var pointData = linkObject.route.pointData;

    var blueToRed = (startColor.h === 180) && (endColor.h === 333);
    var redToBlue = (startColor.h === 333) && (endColor.h === 180);

    var percentIncrement = (lineStartWeight * spacer)/pointData.totalLength;

    if (linkObject.ballAnimationCount >= percentIncrement) {
        linkObject.ballAnimationCount = 0;
    }

    var hue = startColor;
    var transitionColorRight = (endColor.h - startColor.h > 180 || blueToRed);
    var transitionColorLeft = (endColor.h - startColor.h < -180 || redToBlue);
    var color;

    for (var i = 0; i < 1.0; i += percentIncrement) {
        var percentage = i + linkObject.ballAnimationCount;
        var position = linkObject.route.getXYPositionAtPercentage(percentage);
        if (position !== null) {
            if (transitionColorRight) {
                // looks better to go down rather than up
                hue = ((1.0 - percentage) * startColor.h + percentage * (endColor.h - 360)) % 360;
            } else if (transitionColorLeft) {
                // looks better to go up rather than down
                hue = ((1.0 - percentage) * startColor.h + percentage * (endColor.h + 360)) % 360;
            } else {
                hue = (1.0 - percentage) * startColor.h + percentage * endColor.h;
            }
            context.beginPath();
            context.fillStyle = 'hsl(' + hue + ', 100%, 60%)';
            context.arc(position.screenX, position.screenY, lineStartWeight, 0, mathPI);
            context.fill();
        }
    }

    var numFramesForAnimationLoop = 30;
    linkObject.ballAnimationCount += percentIncrement/numFramesForAnimationLoop;
};

/**
 * @desc
 **/

realityEditor.gui.crafting.craftingBoardVisible = function(objectKey, nodeKey) {
    // update side menu buttons
    document.getElementById('guiButtonImage').src = guiButtonImage[5].src;
    document.getElementById('preferencesButton').src = preferencesButtonImage[4].src;
    globalStates.pocketButtonState = true;
    document.getElementById('pocketButton').src = pocketButtonImage[4].src;
    globalStates.guiState = "logic";
    document.getElementById("craftingBoard").style.visibility = "visible";
    document.getElementById("craftingBoard").style.display = "inline";
    this.cout("craftingBoardVisible for object: " + objectKey + " and node: "+nodeKey);

    if (DEBUG_DATACRAFTING) { // TODO: BEN DEBUG - turn off debugging!
        var logic = new LogicNode();
        this.initializeDataCraftingGrid(logic);
    } else {
        var nodeLogic = objects[objectKey].nodes[nodeKey];
        this.initializeDataCraftingGrid(nodeLogic);
    }
};

/**
 * @desc
 **/

realityEditor.gui.crafting.craftingBoardHide = function() {
    // remove the block menu if it's showing
    this.blockMenu.resetBlockMenu();
    // reset side menu buttons
    document.getElementById('preferencesButton').src = preferencesButtonImage[0].src;
    document.getElementById('pocketButton').src = pocketButtonImage[0].src;
    // hide the crafting board div
    document.getElementById("craftingBoard").style.visibility = "hidden";
    document.getElementById("craftingBoard").style.display = "none";
    // reset the contents of the crafting board div so that another node's logic can be fresh loaded into it
    this.resetCraftingBoard();
};

/**
 * @desc
 **/

realityEditor.gui.crafting.blockMenuVisible = function() {
    //temporarily hide all other datacrafting divs. redisplay them when menu hides
    document.getElementById("datacraftingCanvas").style.display = "none";
    document.getElementById("blockPlaceholders").style.display = "none";
    document.getElementById("blocks").style.display = "none";
    document.getElementById("datacraftingEventDiv").style.display = "none";

    // create the menu if it doesn't already exist, otherwise just show it
    var existingMenu = document.getElementById('menuContainer');
    if (existingMenu) {
        existingMenu.style.display = 'inline';
        this.blockMenu.redisplayTabSelection();
        this.blockMenu.redisplayBlockSelection();
    } else {
        this.blockMenu.initializeBlockMenu(function() {
            this.blockMenu.redisplayTabSelection(); // wait for callback to ensure menu fully loaded
            this.blockMenu.redisplayBlockSelection();
        });
    }
};

/**
 * @desc
 **/

realityEditor.gui.crafting.blockMenuHide = function() {

    //temporarily hide all other datacrafting divs. redisplay them when menu hides
    document.getElementById("datacraftingCanvas").style.display = "";
    document.getElementById("blockPlaceholders").style.display = "";
    document.getElementById("blocks").style.display = "";
    document.getElementById("datacraftingEventDiv").style.display = "";
    
    var existingMenu = document.getElementById('menuContainer');
    if (existingMenu) {
        existingMenu.style.display = 'none';
        if (!globalStates.pocketButtonState) {
            globalStates.pocketButtonState = true;
            document.getElementById('pocketButton').src = pocketButtonImage[4].src;
        }
    }
};


realityEditor.gui.crafting.addDatacraftingEventListeners = function() {
    if (globalStates.currentLogic) {
        var datacraftingEventDiv = document.getElementById('datacraftingEventDiv');
        if (!datacraftingEventDiv) return;
        datacraftingEventDiv.addEventListener("pointerdown", this.eventHandlers.onPointerDown.bind(this.eventHandlers));
        datacraftingEventDiv.addEventListener("pointermove", this.eventHandlers.onPointerMove.bind(this.eventHandlers));
        datacraftingEventDiv.addEventListener("pointerup", this.eventHandlers.onPointerUp.bind(this.eventHandlers));
    }
};

realityEditor.gui.crafting.removeDatacraftingEventListeners = function() {
    if (globalStates.currentLogic) {
        var datacraftingEventDiv = document.getElementById('datacraftingEventDiv');
        if (!datacraftingEventDiv) return;
        datacraftingEventDiv.removeEventListener("pointerdown", this.eventHandlers.onPointerDown);
        datacraftingEventDiv.removeEventListener("pointermove", this.eventHandlers.onPointerMove);
        datacraftingEventDiv.removeEventListener("pointerup", this.eventHandlers.onPointerUp);
    }
};

realityEditor.gui.crafting.resetCraftingBoard = function() {
    this.removeDatacraftingEventListeners();
    this.resetTempLogicState(globalStates.currentLogic);
    var container = document.getElementById('craftingBoard');
    while (container.hasChildNodes()) {
        container.removeChild(container.lastChild);
    }
    globalStates.currentLogic = null;
};

realityEditor.gui.crafting.resetTempLogicState = function(logic) {
    if (logic) {
        delete logic.guiState;
        logic.guiState = new LogicGUIState();
    }
};

// should only be called once to initialize a blank datacrafting interface and data model
realityEditor.gui.crafting.initializeDataCraftingGrid = function(logic) {
    globalStates.currentLogic = logic;

    var container = document.getElementById('craftingBoard');

    // initializes the data model for the datacrafting board
    logic.grid = new this.grid.Grid(container.clientWidth - menuBarWidth, container.clientHeight);

    var datacraftingCanvas = document.createElement('canvas');
    datacraftingCanvas.setAttribute('id', 'datacraftingCanvas');
    container.appendChild(datacraftingCanvas);

    var dimensions = logic.grid.getPixelDimensions();
    datacraftingCanvas.width = dimensions.width;
    datacraftingCanvas.style.width = dimensions.width;
    datacraftingCanvas.height = dimensions.height;
    datacraftingCanvas.style.height = dimensions.height;

    // holds the colored background blocks
    var blockPlaceholdersContainer = document.createElement('div');
    blockPlaceholdersContainer.setAttribute('id', 'blockPlaceholders');
    container.appendChild(blockPlaceholdersContainer);

    for (var rowNum = 0; rowNum < logic.grid.size; rowNum++) {

        if (rowNum % 2 === 0) {

            var rowDiv = document.createElement('div');
            rowDiv.setAttribute("class", "blockPlaceholderRow");
            rowDiv.style.height = logic.grid.blockRowHeight;
            blockPlaceholdersContainer.appendChild(rowDiv);

            for (var colNum = 0; colNum < logic.grid.size; colNum++) {
                if (colNum % 2 === 0) {
                    var blockPlaceholder = document.createElement('div');
                    var className = (colNum === logic.grid.size - 1) ? "blockPlaceholderLastCol" : "blockPlaceholder";
                    blockPlaceholder.setAttribute("class", className);
                    //var colorMapKey = (rowNum === 0 || rowNum === 6) ? "bright" : "faded";
                    //blockPlaceholder.style.backgroundColor = blockColorMap[colorMapKey][colNum/2];
                    blockPlaceholder.style.border = "2px solid " + blockColorMap[colNum / 2]; //rgb(45, 255, 254);"
                    if (rowNum === 0 || rowNum === 6) {
                        var labelContainer = document.createElement("div");
                        labelContainer.setAttribute("class", "blockPlaceholderLabel");
                        var label = document.createElement("div");
                        label.style.color = blockColorMap[colNum / 2];
                        label.innerHTML = (rowNum === 0) ? "IN" : "OUT";
                        labelContainer.appendChild(label);
                        blockPlaceholder.appendChild(labelContainer);
                    }
                    rowDiv.appendChild(blockPlaceholder);
                }
            }

        } else {

            var rowDiv = document.createElement('div');
            rowDiv.setAttribute("class", "blockPlaceholderRow");
            rowDiv.style.height = logic.grid.marginRowHeight;
            blockPlaceholdersContainer.appendChild(rowDiv);

            for (var colNum = 0; colNum < logic.grid.size; colNum++) {
                if (colNum % 2 === 0) {
                    var columnHighlight = document.createElement('div');
                    var className = (colNum === logic.grid.size - 1) ? "columnHighlightLastCol" : "columnHighlight";
                    columnHighlight.setAttribute("class", className);
                    //var colorMapKey = (rowNum === 0 || rowNum === 6) ? "bright" : "faded";
                    //blockPlaceholder.style.backgroundColor = blockColorMap[colorMapKey][colNum/2];
                    columnHighlight.style.background = columnHighlightColorMap[colNum/2];
                    rowDiv.appendChild(columnHighlight);
                }
            }

        }
    }

    this.initLogicInOutBlocks();

    var portCells = logic.grid.cells.filter(function(cell) {
        return cell.canHaveBlock() && (cell.location.row === 0 || cell.location.row === logic.grid.size-1);
    });
    this.eventHelper.replacePortBlocksIfNecessary(portCells);

    // add a container where the real blocks will eventually be added
    var blocksContainer = document.createElement('div');
    blocksContainer.setAttribute('id', 'blocks');
    container.appendChild(blocksContainer);

    // an invisible div on top captures all the touch events and handles them properly
    var datacraftingEventDiv = document.createElement('div');
    datacraftingEventDiv.setAttribute('id', 'datacraftingEventDiv');
    datacraftingEventDiv.setAttribute("touch-action", "none");
    container.appendChild(datacraftingEventDiv);

    this.updateGrid(logic.grid);
    this.addDatacraftingEventListeners();
};

realityEditor.gui.crafting.initLogicInOutBlocks = function() {
    for (var y = -1; y <= 4; y+= 5) {
        var namePrefix = y === -1 ? "in" : "out";
        for (var x = 0; x <= 3; x++) {
            var type = namePrefix;
            var name = namePrefix + x;
            var activeInputs = (y === -1) ? [false, false, false, false] : [true, false, false, false];
            var activeOutputs = (y === -1) ? [true, false, false, false] : [false, false, false, false];
            var blockJSON = this.utilities.toBlockJSON(type, name, 1, {}, {}, activeInputs, activeOutputs, ["","","",""], ["","","",""]);
            var globalId = name;
            var block = this.grid.addBlock(x, y, blockJSON, globalId, true);
        }
    }
};
