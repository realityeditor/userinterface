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

createNameSpace("realityEditor.gui.crafting.blockMenu");

realityEditor.gui.crafting.blockMenu.initializeBlockMenu = function(callback) {
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
        menuTab.addEventListener('pointerdown', this.onMenuTabSelected);

        var menuTabIcon = document.createElement('img');
        menuTabIcon.setAttribute('class', 'menuTabIcon');
        menuTabIcon.setAttribute('src', blockTabImage[i].src);
        menuTabIcon.setAttribute('touch-action', 'none');
        menuTab.appendChild(menuTabIcon);

        logic.guiState.menuTabDivs.push(menuTab);
        menuSideContainer.appendChild(menuTab);
    }

    this.menuLoadBlocks( function(blockData) {

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
                blockContents.addEventListener('pointerdown', this.onBlockMenuPointerDown);
                blockContents.addEventListener('pointerup', this.onBlockMenuPointerUp);
                blockContents.addEventListener('pointerleave', this.onBlockMenuPointerLeave);
                blockContents.addEventListener('pointermove', this.onBlockMenuPointerMove);
                block.appendChild(blockContents);
                logic.guiState.menuBlockDivs.push(block);
                row.appendChild(block);
            }
        }
        callback();
    });
};

realityEditor.gui.crafting.blockMenu.resetBlockMenu = function() {
    if (globalStates.currentLogic) {
        var guiState = globalStates.currentLogic.guiState;
        guiState.menuBlockDivs.forEach(function(blockDiv) {
            blockDiv.firstChild.removeEventListener('pointerdown', this.onBlockMenuPointerDown);
            blockDiv.firstChild.removeEventListener('pointerup', this.onBlockMenuPointerUp);
            blockDiv.firstChild.removeEventListener('pointerleave', this.onBlockMenuPointerLeave);
            blockDiv.firstChild.removeEventListener('pointermove', this.onBlockMenuPointerMove);
        });
    }
    var container = document.getElementById('menuContainer');
    if (container) {
        while (container.hasChildNodes()) {
            container.removeChild(container.lastChild);
        }
    }
};

realityEditor.gui.crafting.blockMenu.menuLoadBlocks = function(callback) {
    var keys = this.crafting.eventHelper.getServerObjectLogicKeys(globalStates.currentLogic);
    this.realityEditor.network.getData('http://' + keys.ip + ':' + httpPort + '/availableLogicBlocks', keys.objectKey, function (req, thisKey) {
        console.log("did get available blocks", req, thisKey);
        callback(req);
    });
};

realityEditor.gui.crafting.blockMenu.onMenuTabSelected = function(e) {
    e.preventDefault();
    var guiState = globalStates.currentLogic.guiState;
    guiState.menuSelectedTab = e.target.tabIndex;
    if (guiState.menuSelectedTab < 0) guiState.menuSelectedTab = e.target.parentNode.tabIndex;
    if (guiState.menuSelectedTab < 0) guiState.menuSelectedTab = 0;
    this.redisplayTabSelection();
    this.redisplayBlockSelection();
}

realityEditor.gui.crafting.blockMenu.redisplayTabSelection = function() {
    var guiState = globalStates.currentLogic.guiState;
    guiState.menuTabDivs.forEach(function(tab) {
        if (guiState.menuSelectedTab === tab.tabIndex) {
            tab.setAttribute('class', 'menuTabSelected');
        } else {
            tab.setAttribute('class', 'menuTab');
        }
    });
};

realityEditor.gui.crafting.blockMenu.redisplayBlockSelection = function() {
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
        iconImage.src = getBlockIcon(globalStates.currentLogic, thisBlockData.type).src;
        blockDiv.firstChild.appendChild(iconImage);

        var blockTitle = document.createElement('div');
        blockTitle.setAttribute('class', 'blockTitle');
        blockTitle.innerHTML = thisBlockData.name;
        blockDiv.firstChild.appendChild(blockTitle);

        blockDiv.style.display = 'inline-block';
    }

    // clear the remaining block divs
    for (var i = blocksInThisSection.length; i < guiState.menuBlockDivs.length; i++) {
        var blockDiv = guiState.menuBlockDivs[i];
        blockDiv.blockData = '';
        blockDiv.style.display = 'none';
    }
};

realityEditor.gui.crafting.blockMenu.onBlockMenuPointerDown = function(e) {
    e.preventDefault();
    var guiState = globalStates.currentLogic.guiState;
    guiState.menuBlockToAdd = null;
    guiState.menuIsPointerDown = true;
    guiState.menuSelectedBlock = e.currentTarget;
    guiState.menuSelectedBlock.parentNode.setAttribute('class', 'menuBlock blockDivMovingAble');
    guiState.menuBlockToAdd = e.currentTarget.parentNode;
}

realityEditor.gui.crafting.blockMenu.onBlockMenuPointerUp = function(e) {
    e.preventDefault();
    var guiState = globalStates.currentLogic.guiState;
    guiState.menuIsPointerDown = false;
    if (guiState.menuSelectedBlock) {
        guiState.menuSelectedBlock.parentNode.setAttribute('class', 'menuBlock');
    }
    guiState.menuSelectedBlock = null;
    guiState.menuBlockToAdd = null;
};

realityEditor.gui.crafting.blockMenu.onBlockMenuPointerLeave = function(e) {
    e.preventDefault();
    var guiState = globalStates.currentLogic.guiState;
    if (guiState.menuIsPointerDown) {
        if (guiState.menuSelectedBlock) {
            guiState.menuSelectedBlock.parentNode.setAttribute('class', 'menuBlock');
        }
    }
    guiState.menuSelectedBlock = null;
    guiState.menuBlockToAdd = null;
};

realityEditor.gui.crafting.blockMenu.onBlockMenuPointerMove = function(e) {
    e.preventDefault();
    var guiState = globalStates.currentLogic.guiState;
    if (guiState.menuBlockToAdd) {
        var blockJSON = guiState.menuBlockToAdd.blockData;
        var blockRect = guiState.menuBlockToAdd.getBoundingClientRect();
        var pointerX = blockRect.left + blockRect.width/2;
        var pointerY = blockRect.top + blockRect.height/2;
        this.crafting.eventHelper.addBlockFromMenu(blockJSON, pointerX, pointerY);
        guiState.menuBlockToAdd = null;
        this.crafting.blockMenuHide();
    }
};
