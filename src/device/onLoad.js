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

  realityEditor.device.initCordova();

};

realityEditor.device.initCordova = function() {

  var options = {
    databaseXmlFile: 'PluginTest.xml',
    targetList: [ 'logo', 'iceland', 'canterbury-grass', 'brick-lane', 'cordovaVuforiaTarget' ],
    overlayMessage: 'Point your camera at a test image...',
    vuforiaLicense: '__PLACEHOLDER_ADD_YOUR_VUFORIA_LICENSE_HERE__',
    autostopOnImageFound: false
  };

  navigator.VuforiaPlugin.startVuforia(
    options,
    function(data) {
      // To see exactly what `data` can return, see 'Success callback `data` API' within the plugin's documentation.

      if (data.markersFound) {
        realityEditor.device.processDetectedMarkers(data);

      } else if(data.status.markersFound) {
        realityEditor.device.processDetectedMarkers(data.result);

      } else if(data.status.imageFound) {
        alert("Image name: "+ data.result.imageName +"\n Image mat:  " + data.result.modelViewMatrix);

      } else if (data.status.manuallyClosed) {
        alert("User manually closed Vuforia by pressing back!");
      }
    },
    function(data) {
      alert("Error: " + data);
    }
  );
}

realityEditor.device.processDetectedMarkers = function(jsonObject) {

  if (JSON.stringify(globalStates.realProjectionMatrix) === "[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]") {
    console.log("update projection matrix");
    var parsedProjectionMatrix = JSON.parse(jsonObject.projectionMatrix);
    realityEditor.gui.ar.setProjectionMatrix(parsedProjectionMatrix);
  }

  /*
  Plugin method for transformations
  */
  console.log(jsonObject.markersFound);

  var objectForTransform = {};
  jsonObject.markersFound.forEach(function(elt) {
    objectForTransform[elt.name] = JSON.parse(elt.modelViewMatrix);
  });

  realityEditor.gui.ar.draw.update(objectForTransform);
}


window.onload = realityEditor.device.onload;
