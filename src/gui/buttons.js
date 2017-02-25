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
 * Copyright (c) 2015 Valentin Heun
 * Modified by Valentin Heun 2014, 2015, 2016, 2017
 * Modified by Benjamin Reynholds 2016, 2017
 * Modified by James Hobin 2016, 2017
 *
 * All ascii characters above must be included in any redistribution.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

createNameSpace("realityEditor.gui.buttons");
var blockTabImage = [];

/**
 * @desc
 * @param array
 **/

realityEditor.gui.buttons.preload = function(array) {
	for (var i = 0; i < this.preload.arguments.length - 1; i++) {
		array[i] = new Image();
		array[i].src = this.preload.arguments[i + 1];
	}

	this.cout("preload");
};


/**
 * @desc
 **/

realityEditor.gui.buttons.guiButtonUp = function(event){
		if(event.button !== "gui") return;

        realityEditor.gui.menus.buttonOff("main",["logic","logicPocket","logicSetting","setting","pocket"]);
        realityEditor.gui.menus.buttonOn("main",["gui"]);


        realityEditor.gui.pocket.pocketHide();
        globalStates.guiState = "ui";
        if (globalStates.guiState !== "logic") {
            if (DEBUG_DATACRAFTING) {
                realityEditor.gui.crafting.craftingBoardVisible(); // TODO: BEN DEBUG - revert to previous line
            } else {
                realityEditor.gui.crafting.craftingBoardHide();
            }
        }

	};

realityEditor.gui.buttons.logicButtonUp = function(event){
        if(event.button !== "logic") return;

        realityEditor.gui.menus.buttonOff("main",["gui","logicPocket","logicSetting","setting","pocket"]);
        realityEditor.gui.menus.buttonOn("main",["logic"]);

        realityEditor.gui.pocket.pocketHide();

        globalStates.guiState = "node";

        realityEditor.gui.crafting.craftingBoardHide();
    };

realityEditor.gui.buttons.resetButtonUp = function(event) {
        if (event.button !== "reset") return;

        realityEditor.gui.menus.off("editing",["reset"]);


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

                realityEditor.network.sendResetContent(key, key, "ui");
            }

            if (globalStates.guiState ==="node") {
                for (var subKey in tempResetObject.nodes) {
                    var tempResetValue = tempResetObject.nodes[subKey];



                    tempResetValue.matrix = [];

                    // tempResetValue.x = randomIntInc(0, 200) - 100;
                    // tempResetValue.y = randomIntInc(0, 200) - 100;
                    tempResetValue.scale = 1;

                    realityEditor.network.sendResetContent(key, subKey, tempResetValue.type);
                }
            }

        }
    };



realityEditor.gui.buttons.unconstrainedButtonUp = function(event) {
        if (event.button !== "unconstrained") return;

        if (globalStates.unconstrainedPositioning === true) {

            realityEditor.gui.menus.off("editing", ["unconstrained"]);
            globalStates.unconstrainedPositioning = false;
        }
        else {
            realityEditor.gui.menus.on("editing", ["unconstrained"]);
            globalStates.unconstrainedPositioning = true;
        }
    };

realityEditor.gui.buttons.settingButtonUp = function(event) {
        if (event.button !== "setting" && event.button !== "logicSetting") return;

       // realityEditor.gui.menus.on("main", ["setting"]);

        realityEditor.gui.pocket.pocketHide();

        if (globalStates.guiState === "logic") {
            realityEditor.gui.crafting.eventHelper.hideBlockSettings();
            realityEditor.gui.menus.off("crafting", ["logicSetting"]);
            return;
        }


        if (globalStates.settingsButtonState === true) {

            this.gui.settings.hideSettings();

            if(!globalStates.realityState) {
                realityEditor.gui.menus.buttonOff("setting", ["setting"]);
            } else {
                realityEditor.gui.menus.buttonOff("reality", ["setting"]);
            }

            overlayDiv.style.display = "inline";

            if (globalStates.editingMode) {
                realityEditor.gui.menus.on("editing", []);
            }
        }
        else {
            this.gui.settings.showSettings();
        }
    };

realityEditor.gui.buttons.freezeButtonUp = function(event) {
    if (event.button !== "freeze") return;

    realityEditor.gui.pocket.pocketHide();

    if (globalStates.freezeButtonState === true) {

        realityEditor.gui.menus.buttonOff("default", ["freeze"]);

        globalStates.freezeButtonState = false;
        var memoryBackground = document.querySelector('.memoryBackground');
        memoryBackground.innerHTML = '';
        window.location.href = "of://unfreeze";
    }
    else {
        realityEditor.gui.menus.buttonOn("default", ["freeze"]);
        globalStates.freezeButtonState = true;
        window.location.href = "of://freeze";
    }
};

realityEditor.gui.buttons.lockButtonUp = function(event) {
    if (event.button !== "lock") return;
    
    console.log("activate lock button");
    
    var LOCK_TYPE_FULL = "full";
    realityEditor.device.security.lockVisibleNodesAndLinks(LOCK_TYPE_FULL);
};

realityEditor.gui.buttons.halflockButtonUp = function(event) {
    if (event.button !== "halflock") return;

    console.log("activate halflock button");

    var LOCK_TYPE_HALF = "half";
    realityEditor.device.security.lockVisibleNodesAndLinks(LOCK_TYPE_HALF);
};

realityEditor.gui.buttons.unlockButtonUp = function(event) {
    if (event.button !== "unlock") return;

    console.log("activate unlock button");
    
    realityEditor.device.security.unlockVisibleNodesAndLinks();
};

realityEditor.gui.buttons.draw = function() {

    this.preload(blockTabImage,
        'png/iconBlocks.png', 'png/iconEvents.png', 'png/iconSignals.png', 'png/iconMath.png', 'png/iconWeb.png'
    );

	/**
	 * @desc
	 * @param object
	 * @param node
	 **/


};


realityEditor.gui.buttons.pocketButtonDown = function(event) {
        if (event.button !== "pocket" && event.button !== "logicPocket") return;

        if (globalStates.guiState !== "node" && globalStates.guiState !== "logic") {
            return;
        }

        globalStates.pocketButtonDown = true;

};


realityEditor.gui.buttons.pocketButtonUp = function(event) {
    if (event.button !== "pocket" && event.button !== "logicPocket") return;

    realityEditor.gui.pocket.onPocketButtonUp();

    if (globalStates.guiState !== "node" && globalStates.guiState !== "logic") {
        return;
    }

    if(globalStates.pocketButtonDown){
        this.gui.pocket.pocketButtonAction();
    }
    globalStates.pocketButtonDown = false;
    globalStates.pocketButtonUp = true;

};

realityEditor.gui.buttons.pocketButtonEnter = function(event) {
    if (event.button !== "pocket") return;

    realityEditor.gui.pocket.onPocketButtonEnter();

    if (globalStates.guiState !== "node" && globalStates.guiState !== "logic") {
        return;
    }

    if (pocketItem.pocket.nodes[pocketItemId]) {
        pocketItem.pocket.objectVisible = false;

        this.gui.ar.draw.hideTransformed("pocket", pocketItemId, pocketItem.pocket.nodes[pocketItemId], "logic");
        delete pocketItem.pocket.nodes[pocketItemId];
    }
};

realityEditor.gui.buttons.pocketButtonLeave = function(event) {
    if (event.button !== "pocket") return;

    if (globalStates.guiState !== "node" && globalStates.guiState !== "logic") {
        return;
    }

    // var currentMenu = globalStates.guiState === "logic" ? "logic" : "main";
    // if (globalStates.pocketButtonState === true) {
    //     realityEditor.gui.menus.off(currentMenu, ["pocket"]);
    //     // 0 is off, 2 is on
    //  // todo   if (!globalStates.UIOffMode)    document.getElementById('pocketButton').src = pocketButtonImage[0+indexChange].src;
    // }
    // else {
    //     realityEditor.gui.menus.on(currentMenu ,["pocket"]);
    //   // todo  if (!globalStates.UIOffMode)    document.getElementById('pocketButton').src = pocketButtonImage[2+indexChange].src;
    // }

    // this is where the virtual point creates object

    // todo for testing only
    if (globalStates.pocketButtonDown === true && globalStates.guiState ==="node") {

        pocketItemId = realityEditor.device.utilities.uuidTime();
        console.log(pocketItemId);
        pocketItem.pocket.nodes[pocketItemId] = new Logic();

        var thisItem = pocketItem.pocket.nodes[pocketItemId];

            thisItem.uuid = pocketItemId;

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
    realityEditor.gui.pocket.setPocketPosition(event);
};

realityEditor.gui.buttons.bigPocketButtonEnter = function(event) {
    if (event.button !== "bigPocket") {
        return;
    }

    realityEditor.gui.pocket.onBigPocketButtonEnter();
};

/**
 *
 *   REALITY
 *
 */

realityEditor.gui.buttons.realityGuiButtonUp = function (event) {
    if (event.button !== "realityGui") return;

    realityEditor.gui.menus.buttonOff("reality", ["realityGui", "realityInfo", "realityTag", "realitySearch", "realityWork"]);
    realityEditor.gui.menus.on("realityInfo", ["realityGui"]);

    // Add your functionality here.
};

realityEditor.gui.buttons.realityInfoButtonUp = function (event) {
    if (event.button !== "realityInfo") return;


    realityEditor.gui.menus.buttonOff("reality", ["realityTag", "realitySearch", "realityWork"]);
    realityEditor.gui.menus.on("realityInfo", ["realityInfo", "realityGui"]);

    // Add your functionality here.
};

realityEditor.gui.buttons.realityTagButtonUp = function (event) {
    if (event.button !== "realityTag") return;

    realityEditor.gui.menus.buttonOff("reality", ["realityGui", "realityInfo", "realityTag", "realitySearch", "realityWork"]);
    realityEditor.gui.menus.on("reality", ["realityTag"]);

    // Add your functionality here.
};

realityEditor.gui.buttons.realitySearchButtonUp = function (event) {
    if (event.button !== "realitySearch") return;

    realityEditor.gui.menus.buttonOff("reality", ["realityGui", "realityInfo", "realityTag", "realitySearch", "realityWork"]);
    realityEditor.gui.menus.on("reality", ["realitySearch"]);

    if(realityEditor.gui.search.getVisibility()){
        realityEditor.gui.search.remove();
    } else
{
    realityEditor.gui.search.add();
}

    // Add your functionality here.
};

realityEditor.gui.buttons.realityWorkButtonUp = function (event) {
    if (event.button !== "realityWork") return;

    realityEditor.gui.menus.buttonOff("reality", ["realityGui", "realityInfo", "realityTag", "realitySearch", "realityWork"]);
    realityEditor.gui.menus.on("reality", ["realityWork"]);

    // Add your functionality here.
};