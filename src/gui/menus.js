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
    main: {gui: "blue", logic: "blue", pocket: "blue", setting: "blue", freeze: "blue"},
    editing: {back: "blue", pocket: "blue", setting: "blue", freeze: "blue", reset: "blue", unconstrained: "blue"},
    logic: {back: "blue", logicPocket: "green", logicSetting: "blue", freeze: "blue"},
    bigTrash: {bigTrash: "red"},
    bigPocket: {bigPocket: "green"},
    clearSky: {}
};

realityEditor.gui.menus.history = [];

realityEditor.gui.menus.getElements = function (element) {
    var o;
		if (element === "logic" || element === "gui") {
        o = document.getElementById("mainButton");
    } else {
        o = document.getElementById(element+"Button");
    }
    var svgDoc = o.contentDocument;

    var linkElm = svgDoc.createElementNS("http://www.w3.org/1999/xhtml", "link");
    linkElm.setAttribute("href", "menu.css");
    linkElm.setAttribute("type", "text/css");
    linkElm.setAttribute("rel", "stylesheet");
    svgDoc.getElementById("Layer_1").appendChild(linkElm);

    var svgElement;
    if (element === "gui") {
        svgElement= {item: o,  bg:svgDoc.getElementById("bg0"), state: false}
    } else if (element === "logic") {
        svgElement= {item: o,  bg:svgDoc.getElementById("bg1"), state: false}
    } else {
        svgElement= {item: o,  bg:svgDoc.getElementById("bg"), state: false}
    }
    svgElement.bg.button = element;
    return svgElement;
};

realityEditor.gui.menus.init = function () {
    for (key in this.buttons) {
        this.buttons[key] = this.getElements(key);

        if( this.buttons[key].bg) {
            this.buttons[key].bg.addEventListener("pointerdown",
                function (evt) {
                console.log("testtest");
                evt.button = this.button;
                realityEditor.gui.menus.pointerDown(evt);
            }, false);

            this.buttons[key].bg.addEventListener("pointerup",
                function (evt) {
                    evt.button = this.button;
                    realityEditor.gui.menus.pointerUp(evt);
                }, false);

            this.buttons[key].bg.addEventListener("pointerenter",
                function (evt) {
                    evt.button = this.button;
                    realityEditor.gui.menus.pointerEnter(evt);
                }, false);

            this.buttons[key].bg.addEventListener("pointerleave",
                function (evt) {
                    evt.button = this.button;
                    realityEditor.gui.menus.pointerLeave(evt);
                }, false);

            this.buttons[key].bg.addEventListener("pointermove",
                function (evt) {
                    evt.button = this.button;
                    realityEditor.gui.menus.pointerMove(evt);
                }, false);

        }
    };
	//  document.getElementById("UIButtons").style.visibility = "visible";
};

realityEditor.gui.menus.on = function(menuDiv, buttonArray) {
    realityEditor.gui.menus.history.push(menuDiv);

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
    			console.log(menuDiv);
                this.buttons[keyI].bg.setAttribute("class", this.menus[menuDiv][keyI]+ " active");
			}
		}
	}
};

realityEditor.gui.menus.off = function(menuDiv, buttonArray) {
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
};

realityEditor.gui.menus.pointerUp = function(event) {
    console.log("Up on: "+event.button);
};

realityEditor.gui.menus.pointerEnter = function(event) {
    console.log("Enter on: "+event.button);
};

realityEditor.gui.menus.pointerLeave = function(event) {
    console.log("Leave on: "+event.button);
};

realityEditor.gui.menus.pointerMove = function(event) {
    console.log("Move on: "+event.button);
};

