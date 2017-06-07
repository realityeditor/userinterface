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


/**
 * @desc
 **/

createNameSpace("realityEditor.device");

realityEditor.device.onload = function () {

        //window.location.href = "of://kickoff";


    realityEditor.gui.menus.init();

   realityEditor.gui.menus.off("main",["gui","reset","unconstrained"]);
    realityEditor.gui.menus.on("main",["gui"]);
    globalStates.realityState= false;

	globalStates.tempUuid = realityEditor.device.utilities.uuidTimeShort();
	console.log("-----------------------------:  "+globalStates.tempUuid);
	console.log("starting up GUI");
	uiButtons = document.getElementById("GUI");
	overlayDiv = document.getElementById('overlay');

	realityEditor.gui.buttons.draw();
	realityEditor.gui.memory.initMemoryBar();
	realityEditor.gui.pocket.pocketInit();

	console.log(globalStates.platform);

	if (globalStates.platform !== 'iPad' && globalStates.platform !== 'iPhone' && globalStates.platform !== 'iPod touch') {
		globalStates.platform = false;
	}

	globalCanvas.canvas = document.getElementById('canvas');
	globalCanvas.canvas.width = globalStates.height;
	globalCanvas.canvas.height = globalStates.width;

	globalCanvas.context = canvas.getContext('2d');

	//if (globalStates.platform) {
		window.location.href = "of://kickoff";
	//	}

	globalCanvas.canvas.addEventListener("pointerdown", realityEditor.device.onCanvasPointerDown.bind(realityEditor.device), false);
	ec++;

	document.addEventListener("pointermove", realityEditor.device.onDocumentPointerMove.bind(realityEditor.device), false);
	ec++;
	document.addEventListener("pointerdown", realityEditor.device.onDocumentPointerDown.bind(realityEditor.device), false);
	//document.addEventListener("pointerdown", getPossition, false);
	ec++;
	document.addEventListener("pointerup", realityEditor.device.onDocumentPointerUp.bind(realityEditor.device), false);
	ec++;
	window.addEventListener("message", realityEditor.network.onInternalPostMessage.bind(realityEditor.network), false);
	ec++;
	overlayDiv.addEventListener('touchstart', function (e) {
		e.preventDefault();
	});

	this.cout("onload");

};


window.onload = realityEditor.device.onload;
