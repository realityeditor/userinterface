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

createNameSpace("realityEditor.gui.menus");



/**
 * @desc
 * @param array
 **/

realityEditor.gui.menus.buttons = {
    	back: {},
		bigPocket: {},
    	bigTrash: {},
    	freeze:{},
		logicPocket:{},
    	logicSetting:{},
		gui: {},
		logic: {},
		pocket: {},
		reset: {},
		setting: {},
		unconstrained: {}
};

realityEditor.gui.menus.menus = {
    default: {gui: "blue", logic: "blue", pocket: "blue", setting: "blue", freeze: "blue"},
    main: {gui: "blue", logic: "blue", pocket: "blue", setting: "blue", freeze: "blue"},
    logic: {gui: "blue", logic: "blue", pocket: "blue", setting: "blue", freeze: "blue"},
    gui: {gui: "blue", logic: "blue", pocket: "blue", setting: "blue", freeze: "blue"},
    setting: {gui: "blue", logic: "blue", pocket: "blue", setting: "blue", freeze: "blue"},
    editing: {gui: "blue", logic: "blue", pocket: "blue", setting: "blue", freeze: "blue", reset: "blue", unconstrained: "blue"},
    crafting: {back: "blue", logicPocket: "green", logicSetting: "blue", freeze: "blue"},
    bigTrash: {bigTrash: "red"},
    bigPocket: {bigPocket: "green"},
    // clear sky needs some more work.
    clearSky: {}
};

realityEditor.gui.menus.getVisibility = function(item){
if(this.buttons[item].item.style.visibility !== "hidden"){
    return true;
}else {
    return false;
}
};

realityEditor.gui.menus.history = [];

realityEditor.gui.menus.historySteps = 5;

realityEditor.gui.menus.getElements = function (element) {
    var svgDoc,l;
		if (element === "logic" || element === "gui") {
            svgDoc = document.getElementById("mainButton");
    } else {
            svgDoc = document.getElementById(element+"Button");
    }

    l = document.getElementById(element+"ButtonDiv");


    var svgElement;

    if (element === "gui") {
        svgElement= {item: svgDoc, overlay: l,  bg:svgDoc.getElementById("bg0"), state: ["",""]}
    } else if (element === "logic") {
        svgElement= {item: svgDoc, overlay: l,  bg:svgDoc.getElementById("bg1"), state: ["",""]}
    } else {
        svgElement= {item: svgDoc, overlay: l, bg:svgDoc.getElementById("bg"), state: ["",""]}
    }

    svgElement.bg.setAttribute("class", "blue inactive");

    svgElement.overlay.button = element;
    return svgElement;
};

realityEditor.gui.menus.init = function () {
    for (key in this.buttons) {
        this.buttons[key] = this.getElements(key);

        if( this.buttons[key].overlay) {
            this.buttons[key].overlay.addEventListener("pointerdown",
                function (evt) {
                evt.button = this.button;
                realityEditor.gui.menus.pointerDown(evt);
            }, false);

            this.buttons[key].overlay.addEventListener("pointerup",
                function (evt) {
                    evt.button = this.button;
                    realityEditor.gui.menus.pointerUp(evt);
                }, false);

            this.buttons[key].overlay.addEventListener("pointerenter",
                function (evt) {
                    evt.button = this.button;
                    realityEditor.gui.menus.pointerEnter(evt);
                }, false);

            this.buttons[key].overlay.addEventListener("pointerleave",
                function (evt) {
                    evt.button = this.button;
                    realityEditor.gui.menus.pointerLeave(evt);
                }, false);

            this.buttons[key].overlay.addEventListener("pointermove",
                function (evt) {
                    evt.button = this.button;
                    realityEditor.gui.menus.pointerMove(evt);
                }, false);

        }
    };
	//  document.getElementById("UIButtons").style.visibility = "visible";
};

realityEditor.gui.menus.on = function(menuDiv, buttonArray) {
    console.log(menuDiv);
    if(realityEditor.gui.menus.history.length>=realityEditor.gui.menus.historySteps) {
        realityEditor.gui.menus.history.shift();
    }
    realityEditor.gui.menus.history.push(menuDiv);

    if(globalStates.editingMode){
        if(menuDiv === "main" || menuDiv === "gui" ||menuDiv === "logic"){
            menuDiv = "editing";
        }
    }

    // activate menu Items
    for(var key in this.buttons){
		if(key in this.menus[menuDiv]){
			this.buttons[key].item.style.visibility = "visible";
            this.buttons[key].overlay.style.visibility = "visible";
		} else {
            this.buttons[key].item.style.visibility = "hidden";
            this.buttons[key].overlay.style.visibility = "hidden";
		}
	}

	for(var i = 0; i< buttonArray.length;i++){
        var keyI = buttonArray[i];
        if(keyI in this.buttons){
    		if(keyI in this.menus[menuDiv]) {
    			console.log(menuDiv);
                this.buttons[keyI].bg.setAttribute("class", this.menus[menuDiv][keyI]+" active");
			}
		}
	}
};

realityEditor.gui.menus.off = function(menuDiv, buttonArray) {

    if(realityEditor.gui.menus.history.length>=realityEditor.gui.menus.historySteps) {
        realityEditor.gui.menus.history.shift();
    }
    realityEditor.gui.menus.history.push(menuDiv);

    if(globalStates.editingMode){
        if(menuDiv === "main" || menuDiv === "gui" ||menuDiv === "logic"){
            menuDiv = "editing";
        }
    }

    // activate menu Items
    for(var key in this.buttons){
        if(key in this.menus[menuDiv]){
            this.buttons[key].item.style.visibility = "visible";
        } else {
            this.buttons[key].item.style.visibility = "hidden";
        }
    }

    for(var i = 0; i< buttonArray.length;i++){
        var keyI = buttonArray[i];
        if(keyI in this.buttons){
            if(keyI in this.menus[menuDiv]) {
                this.buttons[keyI].bg.setAttribute("class", this.menus[menuDiv][keyI]+ " inactive");
            }
        }
    }

};


realityEditor.gui.menus.buttonOn = function(menuDiv,buttonArray) {

    for(var i = 0; i< buttonArray.length;i++){
        var keyI = buttonArray[i];
        if(keyI in this.buttons){

                this.buttons[keyI].bg.setAttribute("class", this.menus[menuDiv][keyI]+" active");

        }
    }
};


realityEditor.gui.menus.buttonOff = function(menuDiv,buttonArray) {

    for(var i = 0; i< buttonArray.length;i++){
        var keyI = buttonArray[i];
        if(keyI in this.buttons){

                this.buttons[keyI].bg.setAttribute("class", this.menus[menuDiv][keyI]+" inactive");

        }
    }
};



realityEditor.gui.menus.back = function() {

	if(this.history[this.history.length-1])
	{
		var menuDiv = this.history[this.history.length-1];


    for(var key in this.buttons){
        if(key in this.menus[menuDiv]){
            this.buttons[key].item.style.display = "inline";
        } else {
            this.buttons[key].item.style.display = "none";
        }
    }
    }
    this.history.pop();
};



realityEditor.gui.menus.pointerDown = function(event) {
console.log("Down on: "+event.button);

    realityEditor.gui.buttons.pocketButtonDown(event);

};

realityEditor.gui.menus.pointerUp = function(event) {
    console.log("Up on: "+event.button);

    realityEditor.gui.buttons.guiButtonUp(event);
    realityEditor.gui.buttons.logicButtonUp(event);
    realityEditor.gui.buttons.resetButtonUp(event);
    realityEditor.gui.buttons.unconstrainedButtonUp(event);
    realityEditor.gui.buttons.settingButtonUp(event);
    realityEditor.gui.buttons.freezeButtonUp(event);
    realityEditor.gui.buttons.pocketButtonUp(event);


    if(event.button === "back"){
        if(realityEditor.gui.menus.history.length>0) {
            realityEditor.gui.menus.history.pop();
            var lastMenu = realityEditor.gui.menus.history.length - 1;
            realityEditor.gui.menus.on(lastMenu, []);

            // if you want action based on the menu item, place it here
        }
    }
};

realityEditor.gui.menus.pointerEnter = function(event) {
    console.log("Enter on: "+event.button);

    realityEditor.gui.buttons.pocketButtonEnter(event);

    // make button react to touch
    var button = realityEditor.gui.menus.buttons;
    button[event.button].state[0] = button[event.button].bg.classList[0];
    button[event.button].state[1] = button[event.button].bg.classList[1];
    button[event.button].bg.setAttribute("class",   button[event.button].state[0]+" touched");
};

realityEditor.gui.menus.pointerLeave = function(event) {
    console.log("Leave on: "+event.button);

    realityEditor.gui.buttons.pocketButtonLeave(event);


    // make button react to touch
    var button = realityEditor.gui.menus.buttons;
  //  button[event.button].bg.setAttribute("class",   button[event.button].state[0]+" "+ button[event.button].state[1]);
};

realityEditor.gui.menus.pointerMove = function(event) {
    console.log("Move on: "+event.button);
};

