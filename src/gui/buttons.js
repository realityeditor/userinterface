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
var memoryWebButtonImage = [];
var pocketButtonImage = [];

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


        if (globalStates.preferencesButtonState === true) {
            this.gui.preferences.preferencesHide();

            realityEditor.gui.menus.off("setting", ["setting"]);

            overlayDiv.style.display = "inline";

            if (globalStates.editingMode) {
                realityEditor.gui.menus.on("editing", []);
            }

            if (globalStates.UIOffMode) {
                // If clearSky is hiding the buttons, make sure the buttons are hidden as preferences exits
               // document.body.classList.add('clearSky');
              //  realityEditor.gui.menus.on("clearSky", []);
            }

        }
        else {

            realityEditor.gui.menus.on("setting", ["setting"]);

            this.gui.preferences.addElementInPreferences();

            this.gui.preferences.preferencesVisible();

            overlayDiv.style.display = "none";

            if (globalStates.UIOffMode) {
                // If clearSky is hiding the buttons, make sure the buttons are
                // hidden as preferences appears.
               // document.body.classList.add('clearSky');
                //  realityEditor.gui.menus.on("clearSky", []);
            }

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



realityEditor.gui.buttons.draw = function() {
    /*
    this.preload(blockTabImage,
        'png/iconBlocks.png', 'png/iconEvents.png', 'png/iconSignals.png', 'png/iconMath.png', 'png/iconWeb.png'
    );*/

    this.preload(loadNewUiImage, 'png/load.png', 'png/loadOver.png');

    document.getElementById("extendedTrackingSwitch").addEventListener("change", function () {
		if (document.getElementById("extendedTrackingSwitch").checked) {
			globalStates.extendedTracking = true;
			window.location.href = "of://extendedTrackingOn";
		} else {
			globalStates.extendedTracking = false;
			window.location.href = "of://extendedTrackingOff";
		}
	}.bind(this));
	ec++;

	document.getElementById("editingModeSwitch").addEventListener("change", function () {

		if (document.getElementById("editingModeSwitch").checked) {

           // realityEditor.gui.menus.on("editing",[]);

			this.realityEditor.device.addEventHandlers();
			globalStates.editingMode = true;

            window.location.href = "of://developerOn";
			globalMatrix.matrixtouchOn = "";
		} else {

          //  realityEditor.gui.menus.on("setting",[]);

			this.realityEditor.device.removeEventHandlers();
			globalStates.editingMode = false;
			window.location.href = "of://developerOff";
		}
	}.bind(this));
	ec++;

	document.getElementById("turnOffUISwitch").addEventListener("change", function () {
		if (document.getElementById("turnOffUISwitch").checked) {

          //  realityEditor.gui.menus.on("clearSky",[]);

			globalStates.UIOffMode = true;
			timeForContentLoaded = 240000;
			window.location.href = "of://clearSkyOn";

			document.body.classList.add('clearSky');
		} else {

           // realityEditor.gui.menus.on("main",[]);


			globalStates.UIOffMode = false;
			timeForContentLoaded = 240;
			window.location.href = "of://clearSkyOff";

			document.body.classList.remove('clearSky');
		}
	}.bind(this));
	ec++;


	/**
	 * @desc
	 * @param object
	 * @param node
	 **/




	document.getElementById("loadNewUI").addEventListener("touchstart", function () {
		if (globalStates.extendedTracking === true) {
			document.getElementById('loadNewUI').src = loadNewUiImage[3].src;
		}
		else {
			document.getElementById('loadNewUI').src = loadNewUiImage[1].src;
		}
	}.bind(this));
	ec++;

	console.log("add new UI button");
	document.getElementById("loadNewUI").addEventListener("touchend", function () {
		document.getElementById('loadNewUI').src = loadNewUiImage[0].src;
		console.log("of://loadNewUI"+globalStates.newURLText);
		window.location.href = "of://loadNewUI"+globalStates.newURLText;

	}.bind(this));
	ec++;

}

	/**
	 * Freeze Button
	 */


/*
	document.getElementById("reloadButton").addEventListener("touchstart", function () {
		document.getElementById('reloadButton').src = reloadButtonImage[0].src;
		window.location.href = "of://reload";
	}.bind(this));
	ec++;

	document.getElementById("reloadButton").addEventListener("touchend", function () {
		// location.reload(true);
	}.bind(this));
	ec++;
	*/

	/**
	 * Pocket Button
	 */



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

/*
	document.getElementById("reloadButton").addEventListener("touchstart", function () {
		if (!globalStates.UIOffMode)    document.getElementById('reloadButton').src = reloadButtonImage[0].src;
		window.location.href = "of://reload";
	}.bind(this));
	ec++;
	document.getElementById("reloadButton").addEventListener("touchend", function () {
		// location.reload(true);

		window.open("index.html?v=" + Math.floor((Math.random() * 100) + 1));
	}.bind(this));
	ec++;


	var memoryWebButton = document.getElementById('memoryWebButton');
	memoryWebButton.addEventListener('touchstart', function() {
		if (!globalStates.UIOffMode) {
			memoryWebButton.src = memoryWebButtonImage[1].src;
		}
	}.bind(this));

	ec++;
	memoryWebButton.addEventListener('touchend', function() {
		if (document.querySelector('.memoryWeb')) {
			if (!globalStates.UIOffMode) {
				memoryWebButton.src = memoryWebButtonImage[0].src
			}
			removeMemoryWeb();
		} else {
			if (!globalStates.UIOffMode) {
				memoryWebButton.src = memoryWebButtonImage[2].src
			}
			createMemoryWeb();
		}
	}.bind(this));
	ec++;

	this.cout("GUI");
};
*/
