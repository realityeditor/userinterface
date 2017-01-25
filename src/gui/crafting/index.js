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
 * Modified by Valentin Heun 2016, 2017
 * Modified by Benjamin Reynholds 2016, 2017
 * Modified by James Hobin 2016, 2017
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

    var previousLogic = globalStates.currentLogic;
    
    var logic = grid.parentLogic();
    globalStates.currentLogic = logic;

    // *** this does all the backend work ***
    grid.recalculateAllRoutes();


    // UPDATE THE UI IF OPEN
    var blockContainer = document.getElementById('blocks');
    
    if (globalStates.currentLogic && grid.parentLogic() && (grid.parentLogic().uuid === globalStates.currentLogic.uuid) && blockContainer) {

        // reset domElements 
        for (var domKey in logic.guiState.blockDomElements) {
            var blockDomElement = logic.guiState.blockDomElements[domKey];

            // remove dom elements if their blocks are gone or needs to be reset
            if (this.shouldRemoveBlockDom(blockDomElement)) {
                blockDomElement.parentNode.removeChild(blockDomElement);
                delete logic.guiState.blockDomElements[domKey];
            }
        }

        // add new domElement for each block that needs one
        for (var blockKey in logic.blocks) {
            var block = logic.blocks[blockKey];
            if (block.isPortBlock) continue; // don't render invisible input/output blocks

            if (realityEditor.gui.crafting.grid.isBlockOutsideGrid(block, grid) && !block.isPortBlock) { // don't render blocks offscreen
                continue;
            }

            // only add if the block doesn't already have one
            var blockDomElement = logic.guiState.blockDomElements[block.globalId];
            if (!blockDomElement) {
                this.addDomElementForBlock(block, grid);
            }

        }
    }
    
    globalStates.currentLogic = previousLogic;
};

realityEditor.gui.crafting.forceRedraw = function(logic) {
    var _this = this;
    for (var key in logic.blocks) {
        if (!logic.blocks.hasOwnProperty(key)) continue;
        if (logic.blocks[key].isPortBlock) continue;
        _this.removeBlockDom(logic.blocks[key]);
    }
    this.updateGrid(logic.grid);
    this.redrawDataCrafting();
};

    // todo: pass in logic instead of using currentLogic
realityEditor.gui.crafting.removeBlockDom = function(block) {
    var blockDomElement = this.eventHelper.getDomElementForBlock(block);
    if (blockDomElement) {
        blockDomElement.parentNode.removeChild(blockDomElement);
        delete globalStates.currentLogic.guiState.blockDomElements[block.globalId];   
    }
};

    // todo: pass in logic instead of using currentLogic
realityEditor.gui.crafting.shouldRemoveBlockDom = function(blockDomElement) {
    return (this.getBlockForDom(blockDomElement) === null); // remove the dom if there isn't a corresponding block
};

    // todo: pass in logic instead of using currentLogic
realityEditor.gui.crafting.getBlockForDom = function(blockDomElement) {
    if (!globalStates.currentLogic) return null;
    for (var blockKey in globalStates.currentLogic.blocks) {
        var block = globalStates.currentLogic.blocks[blockKey];
        if (globalStates.currentLogic.guiState.blockDomElements[block.globalId] === blockDomElement) {
            return block;
        }
    }
    return null;
};

    // todo: pass in logic instead of using currentLogic
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
        var blockIcon = this.getBlockIcon(globalStates.currentLogic, block.type, true);
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

       /* var blockTitle2 = document.createElement('div');
        blockTitle2.setAttribute('class', 'blockTitle');
        blockTitle2.innerHTML = "&nbsp;&nbsp;"+block.name+"&nbsp;&nbsp;";
  //      blockTitle2.style.backgroundColor = "rgba(0,0,0,0.5)";
        blockTitle2.style.width = blockContents.style.width;
        blockContents.appendChild(blockTitle2);
*/

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

realityEditor.gui.crafting.getBlockIcon = function(logic, blockName, labelSwitch) {
   // if(!label) label = false;
    var keys = this.eventHelper.getServerObjectLogicKeys(logic);

    if (blockIconCache[keys.logicKey] === undefined) {
        blockIconCache[keys.logicKey] = {};
    }

    // download icon to cache if not already there
    if (blockIconCache[keys.logicKey][blockName] === undefined) {
        var icon = new Image();
        icon.src = 'http://' + keys.ip + ':' + httpPort + '/logicBlock/' + blockName + "/icon.svg";
        blockIconCache[keys.logicKey][blockName] = icon;

        var label = new Image();
        label.src = 'http://' + keys.ip + ':' + httpPort + '/logicBlock/' + blockName + "/label.svg";
        blockIconCache[keys.logicKey][blockName+"label"] = label;
    }

    // otherwise just directly return from cache
    if(labelSwitch === false) {
        return blockIconCache[keys.logicKey][blockName];
    }
    else {
        return blockIconCache[keys.logicKey][blockName+"label"];
    }

};

// updates datacrafting visuals each frame
// renders all the links for a datacrafting grid, draws cut line if present, draws temp block if present
realityEditor.gui.crafting.redrawDataCrafting = function() {
    if (!globalStates.currentLogic) return;
    var grid = globalStates.currentLogic.grid;
    var _this = this;

    var canvas = document.getElementById("datacraftingCanvas");
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height);

    grid.forEachLink( function(link) {
        var startCell =  _this.grid.getCellForBlock(grid, _this.grid.blockWithID(link.nodeA, globalStates.currentLogic), link.logicA);
        var endCell =  _this.grid.getCellForBlock(grid, _this.grid.blockWithID(link.nodeB, globalStates.currentLogic), link.logicB);
        _this.drawDataCraftingLine(ctx, link, 5, startCell.getColorHSL(), endCell.getColorHSL(), timeCorrection);
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
            var startCell = _this.grid.getCellForBlock(grid, _this.grid.blockWithID(linkData.nodeA, globalStates.currentLogic), linkData.logicA);
            if (!startCell && _this.grid.isInOutBlock(linkData.nodeA)) {
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

            _this.realityEditor.gui.ar.lines.drawSimpleLine(ctx, startX, startY, endX, endY, lineColor, 2);
        });

        globalStates.currentLogic.guiState.tempOutgoingLinks.forEach( function(linkData) {
            var xOffset =  0.5 * grid.blockColWidth + (grid.blockColWidth + grid.marginColWidth) * linkData.logicA;
            var startX = parseInt(domElement.style.left) + xOffset;
            var startY = parseInt(domElement.style.top) + domElement.clientHeight/2;

            var endCell = _this.grid.getCellForBlock(grid, _this.grid.blockWithID(linkData.nodeB, globalStates.currentLogic), linkData.logicB);
            if (!endCell && _this.grid.isInOutBlock(linkData.nodeB)) {
                var col = linkData.nodeB.slice(-1) * 2;
                endCell = grid.getCell(col, 6);
            }
            var endX = grid.getCellCenterX(endCell);
            var endY = grid.getCellCenterY(endCell);
            var endColor = endCell.getColorHSL();
            var lineColor = 'hsl('+endColor.h+','+endColor.s+'%,'+endColor.l+'%)';

            _this.realityEditor.gui.ar.lines.drawSimpleLine(ctx, startX, startY, endX, endY, lineColor, 2);
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


        document.getElementById('freezeButton').src = freezeButtonImage[2].src;
        globalStates.freezeButtonState = true;
        window.location.href = "of://freeze";



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
        var logic = new Logic();
        this.initializeDataCraftingGrid(logic);
    } else {
        var nodeLogic = objects[objectKey].nodes[nodeKey];
        if (!nodeLogic.guiState) {
            console.log("adding new LogicGUIState");
            nodeLogic.guiState = new LogicGUIState();
        }
        this.initializeDataCraftingGrid(nodeLogic);
    }
};

/**
 * @desc
 **/

realityEditor.gui.crafting.craftingBoardHide = function() {

    if(globalStates.currentLogic) {
        document.getElementById('freezeButton').src = freezeButtonImage[0].src;
        globalStates.freezeButtonState = false;
        var memoryBackground = document.querySelector('.memoryBackground');
        memoryBackground.innerHTML = '';
        window.location.href = "of://unfreeze";
    }


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
    var _this = this;
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
            _this.blockMenu.redisplayTabSelection(); // wait for callback to ensure menu fully loaded
            _this.blockMenu.redisplayBlockSelection();
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
        document.addEventListener("pointermove", this.eventHandlers.onPointerMove.bind(this.eventHandlers));
        datacraftingEventDiv.addEventListener("pointerup", this.eventHandlers.onPointerUp.bind(this.eventHandlers));
        datacraftingEventDiv.addEventListener("pointercancel", this.eventHandlers.onPointerUp.bind(this.eventHandlers));
    }
};

realityEditor.gui.crafting.removeDatacraftingEventListeners = function() {
    if (globalStates.currentLogic) {
        var datacraftingEventDiv = document.getElementById('datacraftingEventDiv');
        if (!datacraftingEventDiv) return;
        datacraftingEventDiv.removeEventListener("pointerdown", this.eventHandlers.onPointerDown);
        document.removeEventListener("pointermove", this.eventHandlers.onPointerMove);
        datacraftingEventDiv.removeEventListener("pointerup", this.eventHandlers.onPointerUp);
        datacraftingEventDiv.removeEventListener("pointercancel", this.eventHandlers.onPointerUp);
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
    container.className = "craftingBoardBlur";

    // initializes the data model for the datacrafting board
    logic.grid = new this.grid.Grid(container.clientWidth - menuBarWidth, container.clientHeight, logic.uuid);

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
