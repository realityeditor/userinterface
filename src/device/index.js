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

createNameSpace("realityEditor.device");

/**
 * @desc
 * @param evt
 **/

realityEditor.device.onTouchDown = function(evt) {
	console.log(this.nodeId);
	if (!globalStates.editingMode) {
		if (globalStates.guiState ==="node") {
			if (!globalProgram.objectA) {
				globalProgram.objectA = this.objectId;
				globalProgram.nodeA = this.nodeId;

				if(objects[this.objectId].nodes[this.nodeId].type === "logic"){
					globalProgram.logicA = 0;
				}

				// if(this.type === "logic")
				//   globalProgram.logicA = globalProgram.logicSelector;
			}
		}
	} else {
		globalStates.editingModeObject = this.objectId;
		globalStates.editingModeLocation = this.nodeId;
		globalStates.editingModeHaveObject = true;
	}
	this.cout("touchDown");
};

/**********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * @desc
 **/

realityEditor.device.onFalseTouchUp= function() {
	if (globalStates.guiState ==="node") {
		globalProgram.objectA = false;
		globalProgram.nodeA = false;
		globalProgram.logicA = false;
		globalProgram.logicSelector = 4;
	}
	globalCanvas.hasContent = true;
	this.cout("falseTouchUp");
};

/**********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * @desc
 **/

realityEditor.device.onTrueTouchUp = function(){
	if (globalStates.guiState ==="node") {
		if (globalProgram.objectA) {

			if(this.nodeId === globalProgram.nodeA && this.type === "logic"){
				this.gui.crafting.craftingBoardVisible(this.objectId, this.nodeId);
			}

			globalProgram.objectB = this.objectId;
			globalProgram.nodeB = this.nodeId;

			this.realityEditor.network.postLinkToServer(globalProgram, objects);

			// set everything back to false
			globalProgram.objectA = false;
			globalProgram.nodeA = false;
			globalProgram.logicA = false;
			globalProgram.objectB = false;
			globalProgram.nodeB = false;
			globalProgram.logicB = false;
			globalProgram.logicSelector = 4;
		}
	}
	globalCanvas.hasContent = true;

	this.cout("trueTouchUp");
};


realityEditor.device.onTouchEnter = function() {
	var contentForFeedback;

	if (globalProgram.nodeA === this.id || globalProgram.nodeA === false) {
		contentForFeedback = 3;

		// todo why is the globalDomCash not used?

		overlayDiv.classList.add('overlayAction');
	} else {

		if (this.realityEditor.network.checkForNetworkLoop(globalProgram.objectA, globalProgram.nodeA, globalProgram.logicA, this.objectId, this.nodeId, 0)) {
			contentForFeedback = 2; // overlayImg.src = overlayImage[2].src;
			overlayDiv.classList.add('overlayPositive');
		}

		else {
			contentForFeedback = 0; // overlayImg.src = overlayImage[0].src;
			overlayDiv.classList.add('overlayNegative');
		}
	}

	globalDOMCach["iframe" + this.nodeId].contentWindow.postMessage(
		JSON.stringify(
			{
				uiActionFeedback: contentForFeedback
			})
		, "*");

	//   document.getElementById('overlayImg').src = overlayImage[contentForFeedback].src;
};

realityEditor.device.onTouchLeave = function() {

	globalProgram.logicSelector = 4;

	overlayDiv.classList.remove('overlayPositive');
	overlayDiv.classList.remove('overlayNegative');
	overlayDiv.classList.remove('overlayAction');

	this.cout("leave");

	globalDOMCach["iframe" + this.nodeId].contentWindow.postMessage(
		JSON.stringify(
			{
				uiActionFeedback: 1
			})
		, "*");

};

/**********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * @desc
 * @param evt
 **/

realityEditor.device.onCanvasPointerDown = function(evt) {
	evt.preventDefault();
	if (globalStates.guiState ==="node" && !globalStates.editingMode) {
		if (!globalProgram.objectA) {
			globalStates.drawDotLine = true;
			globalStates.drawDotLineX = evt.clientX;
			globalStates.drawDotLineY = evt.clientY;

		}
	}

	this.cout("canvasPointerDown");
};

/**********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * @desc
 * @param evt
 **/

realityEditor.device.getPossition = function (evt) {
	evt.preventDefault();

	globalStates.pointerPosition = [evt.clientX, evt.clientY];

	// Translate up 6px to be above pocket layer
	overlayDiv.style.transform = 'translate3d(' + evt.clientX + 'px,' + evt.clientY + 'px,6px)';

	this.setPocketPossition(evt);

}


realityEditor.device.setPocketPossition = function (evt){


	if(pocketItem.pocket.nodes[pocketItemId]){

		var thisItem = pocketItem.pocket.nodes[pocketItemId];

		if(globalLogic.farFrontElement==="") {
			thisItem.x = evt.clientX - (globalStates.height / 2);
			thisItem.y = evt.clientY - (globalStates.width / 2);

		}
		else {
			if(thisItem.screenZ !==2 && thisItem.screenZ) {

				//  console.log(thisItem.screenZ);
				// console.log(screenCoordinatesToMatrixXY(thisItem, [evt.clientX, evt.clientY]));
				var matrixTouch = this.realityEditor.gui.ar.utilities.screenCoordinatesToMatrixXY(thisItem, [evt.clientX, evt.clientY]);
				// console.log(thisItem);
				thisItem.x = matrixTouch[0];
				thisItem.y = matrixTouch[1];

			}
		}


		//  pocketItem.pocket.x = evt.clientX;
		// pocketItem.pocket.y = evt.clientY;



	}

};


/**********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * @desc
 * @param evt
 **/

realityEditor.device.onDocumentPointerUp = function(evt) {

	globalStates.pointerPosition = [-1, -1];




	if (globalStates.pocketButtonDown) {
		pocketItem.pocket.objectVisible = false;

		if (pocketItem.pocket.nodes[pocketItemId]) {

			globalLogic.farFrontElement = "";
			globalLogic.frontDepth = 10000000000;

			for (var thisOtherKey in globalObjects) {
				if (globalObjects[thisOtherKey][14] < globalLogic.frontDepth) {
					globalLogic.frontDepth = globalObjects[thisOtherKey][14];
					globalLogic.farFrontElement = thisOtherKey;
				}
			}

			var thisItem = pocketItem.pocket.nodes[pocketItemId];

			if (globalLogic.farFrontElement !== "" && thisItem.screenZ !== 2 && thisItem.screenZ) {

				var logicCount = 0;
				for(var key in objects[globalLogic.farFrontElement].nodes) {
					if(objects[globalLogic.farFrontElement].nodes[key].type === "logic"){
						logicCount++;
					}
				}
				thisItem.name = "LOGIC"+logicCount;

				objects[globalLogic.farFrontElement].nodes[pocketItemId] = thisItem;

				globalDOMCach[pocketItemId].objectId = globalLogic.farFrontElement;

				this.realityEditor.network.postNewLogicNode(objects[globalLogic.farFrontElement].ip, globalLogic.farFrontElement, pocketItemId, thisItem);

			}
			this.realityEditor.gui.ar.draw.hideTransformed("pocket", pocketItemId, pocketItem.pocket.nodes[pocketItemId], "logic");
			delete pocketItem.pocket.nodes[pocketItemId];
		}
	}


	globalStates.overlay = 0;

	if (globalStates.guiState ==="node") {
		this.onFalseTouchUp();
		if (!globalProgram.objectA && globalStates.drawDotLine) {
			this.realityEditor.gui.ar.lines.deleteLines(globalStates.drawDotLineX, globalStates.drawDotLineY, evt.clientX, evt.clientY);
		}
		globalStates.drawDotLine = false;
	}
	globalCanvas.hasContent = true;

	// todo why is this just hidden and not display none??

	overlayDiv.style.visibility = "hidden";

	overlayDiv.classList.remove('overlayMemory');
	overlayDiv.classList.remove('overlayMemoryInstant');
	pocketOnMemoryCreationStop();
	if (overlayDiv.style.backgroundImage !== 'none') {
		overlayDiv.style.backgroundImage = 'none';
		window.location.href = 'of://clearMemory';
	}

	this.cout("documentPointerUp");


// this is relevant for the pocket button to be interact with
	globalStates.pocketButtonDown = false;
	globalStates.pocketButtonUp = false;


};

/**
 * When the pointer goes down, show the overlay and position it at the
 * pointer's location. If in GUI mode, mark the overlay as holding a memory
 * Save its location to globalStates.pointerPosition
 * @param evt
 */
realityEditor.device.onDocumentPointerDown = function(evt) {
	globalStates.pointerPosition = [evt.clientX, evt.clientY];

	overlayDiv.style.visibility = "visible";
	// Translate up 6px to be above pocket layer
	overlayDiv.style.transform = 'translate3d(' + evt.clientX + 'px,' + evt.clientY + 'px,6px)';
	if (globalStates.guiButtonState && !globalStates.freezeButtonState) {
		// If the event is hitting the background
		if (evt.target.id === 'canvas') {
			overlayDiv.classList.add('overlayMemory');
		}
	}

	if (memoryCanCreate() && window.innerWidth - evt.clientX > 65) {
		pocketOnMemoryCreationStart();
	}

	/*
	 // todo for testing only

	 pocketItemId = uuidTime();


	 pocketItem.pocket.nodes[pocketItemId] = new Logic();


	 var thisItem = pocketItem.pocket.nodes[pocketItemId];


	 if(globalLogic.farFrontElement==="") {
	 thisItem.x = evt.clientX - (globalStates.height / 2);
	 thisItem.y = evt.clientY - (globalStates.width / 2);
	 }
	 // else {
	 // var matrixTouch =  screenCoordinatesToMatrixXY(thisItem, [evt.clientX,evt.clientY]);
	 // thisItem.x = matrixTouch[0];
	 // thisItem.y = matrixTouch[1];
	 //}
	 thisItem.scale = 1;
	 thisItem.loaded = false;

	 var thisObject = pocketItem.pocket;
	 // this is a work around to set the state of an objects to not being visible.
	 thisObject.objectId = "pocket";
	 thisObject.name =  "pocket";
	 thisObject.objectVisible = false;
	 thisObject.screenZ = 1000;
	 thisObject.fullScreen = false;
	 thisObject.sendMatrix = false;
	 thisObject.loaded = false;
	 thisObject.integerVersion = 170;
	 thisObject.matrix = [];
	 // thisObject.nodes = {};
	 thisObject.protocol = "R1";






	 thisObject.visibleCounter = timeForContentLoaded;
	 thisObject.objectVisible = true;

	 //addElement("pocket", pocketItemId, "nodes/" + thisItem.type + "/index.html",  pocketItem.pocket, "logic",globalStates);


	 */
	this.cout("documentPointerDown");
};

/**
 * @desc
 * @param evt
 **/

realityEditor.device.onMultiTouchStart = function(evt) {
	evt.preventDefault();
// generate action for all links to be reloaded after upload

	if (globalStates.editingMode && evt.targetTouches.length === 1) {
		console.log("--------------------------------"+this.objectId);
		globalStates.editingModeObject = this.objectId;
		globalStates.editingModeLocation = this.nodeId;
		globalStates.editingModeKind = this.type;
		globalStates.editingModeHaveObject = true;
	}
	globalMatrix.matrixtouchOn = this.nodeId;
	globalMatrix.copyStillFromMatrixSwitch = true;
	this.cout("MultiTouchStart");
};

/**
 * @desc
 * @param evt
 **/

realityEditor.device.onMultiTouchMove = function(evt) {
	evt.preventDefault();
// generate action for all links to be reloaded after upload

	// cout(globalStates.editingModeHaveObject + " " + globalStates.editingMode + " " + globalStates.editingModeHaveObject + " " + globalStates.editingMode);

	if (globalStates.editingModeHaveObject && globalStates.editingMode && evt.targetTouches.length === 1) {

		var touch = evt.touches[0];

		globalStates.editingModeObjectX = touch.pageX;
		globalStates.editingModeObjectY = touch.pageY;

		var tempThisObject = {};
		if (globalStates.editingModeObject !== globalStates.editingModeLocation) {

			tempThisObject = objects[globalStates.editingModeObject].nodes[globalStates.editingModeLocation];
			// console.log(objects[globalStates.editingModeObject]);
		} else {
			tempThisObject = objects[globalStates.editingModeObject];
		}

		var matrixTouch = realityEditor.gui.ar.utilities.screenCoordinatesToMatrixXY(tempThisObject, [touch.pageX, touch.pageY]);

		if (matrixTouch) {
			tempThisObject.x = matrixTouch[0];
			tempThisObject.y = matrixTouch[1];
		}
	}

	if (globalStates.editingModeHaveObject && globalStates.editingMode && evt.targetTouches.length === 2) {
		this.realityEditor.gui.ar.positioning.onScaleEvent(evt.touches[1]);
	}

	this.cout("MultiTouchMove");
};

/**
 * @desc
 * @param evt
 **/

realityEditor.device.onMultiTouchEnd = function(evt) {


	evt.preventDefault();
// generate action for all links to be reloaded after upload
	if (globalStates.editingModeHaveObject) {

		this.cout("start");
		// this is where it should be send to the object..

		var tempThisObject = {};
		if (globalStates.editingModeObject != globalStates.editingModeLocation) {

			tempThisObject = objects[globalStates.editingModeObject].nodes[globalStates.editingModeLocation];

		} else {
			tempThisObject = objects[globalStates.editingModeObject];
		}

		var content = {};
		content.x = tempThisObject.x;
		content.y = tempThisObject.y;
		content.scale = tempThisObject.scale;

		if (globalStates.unconstrainedPositioning === true) {
			this.realityEditor.gui.ar.utilities.multiplyMatrix(tempThisObject.begin, this.realityEditor.gui.ar.utilities.invertMatrix(tempThisObject.temp),tempThisObject.matrix);
			content.matrix = tempThisObject.matrix;

		}

		// todo for now we just send nodes but no logic locations. ---- Became obsolete because the logic nodes are now normal nodes
		//  if(globalStates.editingModeKind=== "node") {
		if (typeof content.x === "number" && typeof content.y === "number" && typeof content.scale === "number") {
			this.realityEditor.network.postData('http://' + objects[globalStates.editingModeObject].ip + ':' + httpPort + '/object/' + globalStates.editingModeObject + "/size/" + globalStates.editingModeLocation, content);
		}
		// }

		globalStates.editingModeHaveObject = false;
		globalCanvas.hasContent = true;
		globalMatrix.matrixtouchOn = "";
	}
	this.cout("MultiTouchEnd");
};

/**
 * @desc
 * @param evt
 **/

realityEditor.device.onMultiTouchCanvasStart = function(evt) {

	globalStates.overlay = 1;

	evt.preventDefault();
// generate action for all links to be reloaded after upload
	if (globalStates.editingModeHaveObject && globalStates.editingMode && evt.targetTouches.length === 1) {

//todo this will move in to the virtual pocket.
		var touch = evt.touches[1];


		globalStates.editingScaleX = touch.pageX;
		globalStates.editingScaleY = touch.pageY;
		globalStates.editingScaledistance = Math.sqrt(Math.pow((globalStates.editingModeObjectX - globalStates.editingScaleX), 2) + Math.pow((globalStates.editingModeObjectY - globalStates.editingScaleY), 2));

		var tempThisObject = {};
		if (globalStates.editingModeObject != globalStates.editingModeLocation) {
			tempThisObject = objects[globalStates.editingModeObject].nodes[globalStates.editingModeLocation];
		} else {
			tempThisObject = objects[globalStates.editingModeObject];
		}
		globalStates.editingScaledistanceOld = tempThisObject.scale;
	}
	this.cout("MultiTouchCanvasStart");
};

/**
 * @desc
 * @param evt
 **/

realityEditor.device.onMultiTouchCanvasMove = function(evt) {
	evt.preventDefault();
// generate action for all links to be reloaded after upload
	if (globalStates.editingModeHaveObject && globalStates.editingMode && evt.targetTouches.length === 1) {
		var touch = evt.touches[1];

		//globalStates.editingModeObjectY
		//globalStates.editingScaleX
		this.realityEditor.gui.ar.positioning.onScaleEvent(touch)

	}
	this.cout("MultiTouchCanvasMove");
};


/**
 * @desc
 * @param deviceName
 **/

realityEditor.device.setDeviceName = function(deviceName) {
	globalStates.device = deviceName;
	console.log("The Reality Editor is loaded on a " + globalStates.device);
}

/**
 * @desc
 **/

realityEditor.device.removeEventHandlers = function() {

	globalCanvas.canvas.removeEventListener("touchstart", realityEditor.device.onMultiTouchCanvasStart, false);
	ec--;
	globalCanvas.canvas.removeEventListener("touchmove", realityEditor.device.onMultiTouchCanvasMove, false);
	ec--;
	for (var thisKey in objects) {
		var generalObject2 = objects[thisKey];
		if (generalObject2.developer) {
			if (document.getElementById(thisKey)) {
				var thisObject3 = document.getElementById(thisKey);
				thisObject3.style.visibility = "hidden";
				// this is a typo but maybe relevant?
				//  thisObject3.className = "mainEditing";

				document.getElementById("canvas" + thisKey).style.display = "none";

				thisObject3.removeEventListener("touchstart", realityEditor.device.onMultiTouchStart, false);
				thisObject3.removeEventListener("touchmove", realityEditor.device.onMultiTouchMove, false);
				thisObject3.removeEventListener("touchend", realityEditor.device.onMultiTouchEnd, false);
				ec--;
				ec--;
				ec--;
				//  }
			}

			for (var thisSubKey in generalObject2.nodes) {
				if (document.getElementById(thisSubKey)) {
					var thisObject2 = document.getElementById(thisSubKey);
					//thisObject2.className = "mainEditing";
					document.getElementById("canvas" + thisSubKey).style.display = "none";

					//    if(thisObject.developer) {
					thisObject2.removeEventListener("touchstart", realityEditor.device.onMultiTouchStart, false);
					thisObject2.removeEventListener("touchmove", realityEditor.device.onMultiTouchMove, false);
					thisObject2.removeEventListener("touchend", realityEditor.device.onMultiTouchEnd, false);
					ec--;
					ec--;
					ec--;
					//  }
				}
			}
		}
	}

	this.cout("removeEventHandlers");
};


/**
 * @desc
 **/

realityEditor.device.addEventHandlers = function() {

	globalCanvas.canvas.addEventListener("touchstart", realityEditor.device.onMultiTouchCanvasStart, false);
	ec++;
	globalCanvas.canvas.addEventListener("touchmove", realityEditor.device.onMultiTouchCanvasMove, false);
	ec++;

	for (var thisKey in objects) {
		var generalObject2 = objects[thisKey];

		if (generalObject2.developer) {

			if (document.getElementById(thisKey)) {
				var thisObject3 = document.getElementById(thisKey);
				//  if (globalStates.guiState) {
				thisObject3.style.visibility = "visible";

				var thisObject4 = document.getElementById("canvas" + thisKey);
				thisObject4.style.display = "inline";

				// }

				// thisObject3.className = "mainProgram";

				thisObject3.addEventListener("touchstart", realityEditor.device.onMultiTouchStart, false);
				ec++;
				thisObject3.addEventListener("touchmove", realityEditor.device.onMultiTouchMove, false);
				ec++;
				thisObject3.addEventListener("touchend", realityEditor.device.onMultiTouchEnd, false);
				ec++;
				//}
			}

			for (var thisSubKey in generalObject2.nodes) {
				if (document.getElementById(thisSubKey)) {
					var thisObject2 = document.getElementById(thisSubKey);

					//thisObject2.className = "mainProgram";

					var thisObject5 = document.getElementById("canvas" + thisSubKey);
					thisObject5.style.display = "inline";

					//if(thisObject.developer) {
					thisObject2.addEventListener("touchstart", realityEditor.device.onMultiTouchStart, false);
					ec++;
					thisObject2.addEventListener("touchmove", realityEditor.device.onMultiTouchMove, false);
					ec++;
					thisObject2.addEventListener("touchend", realityEditor.device.onMultiTouchEnd, false);
					ec++;
					//}
				}
			}
		}
	}

	this.cout("addEventHandlers");
}
