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
 **/


realityEditor.device.activateNodeMove = function(nodeKey) {

	//globalStates.editingModeHaveObject = true;
	if (document.getElementById(nodeKey)) {
		var thisObject2 = document.getElementById(nodeKey);
		if (thisObject2.type === 'ui') {
			thisObject2.style.visibility = 'visible';
		}

		//thisObject2.className = "mainProgram";
		var thisObject5 = document.getElementById("canvas" + nodeKey);
		thisObject5.style.display = "inline";

		//if(thisObject.developer) {
		thisObject2.addEventListener("touchstart", realityEditor.device.onMultiTouchStart.bind(realityEditor.device), false);
		ec++;
		thisObject2.addEventListener("touchmove", realityEditor.device.onMultiTouchMove.bind(realityEditor.device), false);
		ec++;
		thisObject2.addEventListener("touchend", realityEditor.device.onMultiTouchEnd.bind(realityEditor.device), false);
		ec++;
		thisObject2.addEventListener("pointerup", realityEditor.device.onMultiTouchEnd.bind(realityEditor.device), false);
		ec++;
		//}
	}
};

realityEditor.device.deactivateNodeMove = function(nodeKey) {

	if (document.getElementById(nodeKey)) {
		var thisObject2 = document.getElementById(nodeKey);
		if (thisObject2.type === 'ui') {
			thisObject2.style.visibility = 'hidden';
		}

		//thisObject2.className = "mainEditing";
		document.getElementById("canvas" + nodeKey).style.display = "none";

		//    if(thisObject.developer) {
		thisObject2.removeEventListener("touchstart", realityEditor.device.onMultiTouchStart, false);
		thisObject2.removeEventListener("touchmove", realityEditor.device.onMultiTouchMove, false);
		thisObject2.removeEventListener("touchend", realityEditor.device.onMultiTouchEnd, false);
		ec--;
		ec--;
		ec--;
		thisObject2.removeEventListener("pointerup", realityEditor.device.onMultiTouchEnd, false);
		ec--;
		//  }
	}
};

realityEditor.device.activateMultiTouch = function() {

	globalCanvas.canvas.addEventListener("touchstart", realityEditor.device.onMultiTouchCanvasStart.bind(realityEditor.device), false);
	ec++;
	globalCanvas.canvas.addEventListener("touchmove", realityEditor.device.onMultiTouchCanvasMove.bind(realityEditor.device), false);
	ec++;

};

realityEditor.device.deactivateMultiTouch = function() {
	globalCanvas.canvas.removeEventListener("touchstart", realityEditor.device.onMultiTouchCanvasStart, false);
	ec--;
	globalCanvas.canvas.removeEventListener("touchmove", realityEditor.device.onMultiTouchCanvasMove, false);
	ec--;

};

realityEditor.device.endTrash = function(nodeID) {

	realityEditor.device.deactivateMultiTouch();
	if (!globalStates.editingMode) {
		realityEditor.device.deactivateNodeMove(nodeID);
	}
	setTimeout(function() {
        realityEditor.gui.menus.buttonOn("main",[]);
		//realityEditor.gui.pocket.pocketOnMemoryDeletionStop();
	}, 0);
	globalStates.editingNode = null;
};



realityEditor.device.addEventHandlers = function() {

	realityEditor.device.activateMultiTouch();

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

                thisObject3.addEventListener("touchstart", realityEditor.device.onMultiTouchStart.bind(realityEditor.device), false);
                ec++;
                thisObject3.addEventListener("touchmove", realityEditor.device.onMultiTouchMove.bind(realityEditor.device), false);
                ec++;
                thisObject3.addEventListener("touchend", realityEditor.device.onMultiTouchEnd.bind(realityEditor.device), false);
                ec++;
                //}
            }

            for (var thisSubKey in generalObject2.nodes) {
			//	console.log("nodes: "+thisSubKey);
				realityEditor.device.activateNodeMove(thisSubKey);
            }

            for (var frameKey in generalObject2.frames) {
                var elt = document.getElementById(frameKey);
                if (!elt) {
                    continue;
                }
                elt.style.visibility = "visible";

                var canvas = document.getElementById("canvas" + frameKey);
                canvas.style.display = "inline";

                elt.addEventListener("touchstart", realityEditor.device.onMultiTouchStart);
                ec++;
                elt.addEventListener("touchmove", realityEditor.device.onMultiTouchMove);
                ec++;
                elt.addEventListener("touchend", realityEditor.device.onMultiTouchEnd);
                ec++;
            }
        }
    }

    cout("addEventHandlers");
};




/**
 * @desc
 * @param evt
 **/


realityEditor.device.touchTimer = null;

realityEditor.device.onTouchDown = function(evt) {
    
    var target = evt.currentTarget;
	console.log(target.nodeId);

    if (!realityEditor.device.security.isNodeActionAllowed(target.objectId, target.nodeId, "edit")) {
        return;
    }
    
	if (!globalStates.editingMode) {
		if (globalStates.guiState ==="node") {
			if (!globalProgram.objectA) {
				globalProgram.objectA = target.objectId;
				globalProgram.nodeA = target.nodeId;

				var type = objects[target.objectId].nodes[target.nodeId].type;

				if (type === "logic" || type === "node") {

					if(!globalStates.editingMode) {
						this.touchTimer = setTimeout(function () {
							globalProgram.objectA = false;
							globalProgram.nodeA = false;
							globalStates.editingNode = target.nodeId;
							//globalStates.editingMode = true;
							console.log("hello");
							globalStates.editingModeObject = target.objectId;
							realityEditor.device.activateMultiTouch();
							realityEditor.device.activateNodeMove(target.nodeId);
							if (type === "logic") {
								realityEditor.gui.menus.on("bigTrash",[]);
							}
							//realityEditor.gui.pocket.pocketOnMemoryDeletionStart();

						}, globalStates.moveDelay);
					}


                    if (type === "node") {
                        globalProgram.logicA = false;
                    }
					 else {
                        globalProgram.logicA = 0;
                    }
				}

				// if(this.type === "logic")
				//   globalProgram.logicA = globalProgram.logicSelector;
			}
		}
	} else {
		globalStates.editingModeObject = target.objectId;
		globalStates.editingModeLocation = target.nodeId;
		globalStates.editingModeKind = target.type;
		globalStates.editingNode = target.nodeId;
		globalStates.editingModeHaveObject = true;
	}
	cout("touchDown");
};

realityEditor.device.beginTouchEditing = function(target) {
	globalProgram.objectA = false;
	globalProgram.nodeA = false;

	globalStates.editingNode = target.nodeId;
	globalStates.editingModeObject = target.objectId;
	globalStates.editingModeLocation = target.nodeId;
	globalStates.editingModeKind = target.type;
	globalStates.editingModeHaveObject = true;

	realityEditor.device.activateMultiTouch();
	realityEditor.device.activateNodeMove(target.nodeId);
	// Only display the trash can if it's something we can delete (a frame)
	if (target.objectId !== target.nodeId) {
        realityEditor.gui.menus.on("bigTrash",[]);
		//realityEditor.gui.pocket.pocketOnMemoryDeletionStart();
	}

	realityEditor.device.onMultiTouchStart({
		currentTarget: target
	});
};

realityEditor.device.getEditingModeObject = function() {
    var objectId = globalStates.editingModeObject;
    var nodeId = globalStates.editingModeLocation;
    if (objectId !== nodeId) {
        if (globalStates.editingModeKind === 'ui') {
            return objects[objectId].frames[nodeId];
        } else {
            return objects[objectId].nodes[nodeId];
        }
    } else {
        return objects[objectId];
    }
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
	cout("falseTouchUp");
};

/**********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * @desc
 **/

realityEditor.device.onTrueTouchUp = function(evt){
    var target = evt.currentTarget;
	if (globalStates.guiState ==="node") {
		if (globalProgram.objectA) {

			if(target.nodeId === globalProgram.nodeA && target.type === "logic"){
                if (realityEditor.device.security.isNodeActionAllowed(target.objectId, target.nodeId, "edit")) {
                    realityEditor.gui.crafting.craftingBoardVisible(target.objectId, target.nodeId);
                }
			}

			globalProgram.objectB = target.objectId;
			globalProgram.nodeB = target.nodeId;

            if (realityEditor.device.security.isNodeActionAllowed(target.objectId, target.nodeId, "create")) {
                realityEditor.network.postLinkToServer(globalProgram, objects);
            }

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

    realityEditor.device.endTrash(target.nodeId);

    if(target.type === 'logic' && evt.pageX >= (globalStates.height-60)){

        for(var objectKey in objects){
            var thisObject = objects[objectKey];
            for (linkKey in thisObject.links){
                var thisLink = thisObject.links[linkKey];
                if(((thisLink.objectA === target.objectId) && (thisLink.nodeA === target.nodeId)) ||
                    ((thisLink.objectB === target.objectId) && (thisLink.nodeB === target.nodeId))
                ){
                    delete thisLink;
                    realityEditor.network.deleteLinkFromObject(thisObject.ip, objectKey, linkKey);
                }
            }
        }

        realityEditor.gui.ar.draw.deleteNode(target.objectId, target.nodeId);

        realityEditor.network.deleteNodeFromObject(objects[target.objectId].ip, target.objectId, target.nodeId);

    } else if (target.type === 'logic' || target.type === 'node') {
        if (target.objectId !== "pocket") {
            realityEditor.network.sendResetContent(target.objectId, target.nodeId, target.type);
        }
    }

	cout("trueTouchUp");
};



realityEditor.device.onTouchEnter = function(evt) {
    var target = evt.currentTarget;
	var contentForFeedback;

	if (globalProgram.nodeA === this.id || globalProgram.nodeA === false) {
		contentForFeedback = 3;

		// todo why is the globalDomCash not used?

		overlayDiv.classList.add('overlayAction');
	} else {

		if (realityEditor.network.checkForNetworkLoop(globalProgram.objectA, globalProgram.nodeA, globalProgram.logicA, target.objectId, target.nodeId, 0)) {
			contentForFeedback = 2; // overlayImg.src = overlayImage[2].src;
			overlayDiv.classList.add('overlayPositive');
		}

		else {
			contentForFeedback = 0; // overlayImg.src = overlayImage[0].src;
			overlayDiv.classList.add('overlayNegative');
		}
	}

	globalDOMCach["iframe" + target.nodeId].contentWindow.postMessage(
		JSON.stringify(
			{
				uiActionFeedback: contentForFeedback
			})
		, "*");

	//   document.getElementById('overlayImg').src = overlayImage[contentForFeedback].src;
};

realityEditor.device.onTouchLeave = function(evt) {
    var target = evt.currentTarget;

	if(!globalStates.editingMode) {
		clearTimeout(realityEditor.device.touchTimer);

		if(globalStates.editingNode) {
			if (globalStates.editingModeKind === 'logic') {
				realityEditor.device.endTrash(target.nodeId);
			}
		}
	}

	globalProgram.logicSelector = 4;

	overlayDiv.classList.remove('overlayPositive');
	overlayDiv.classList.remove('overlayNegative');
	overlayDiv.classList.remove('overlayAction');

	cout("leave");

	if(globalDOMCach["iframe" + target.nodeId]) {
		globalDOMCach["iframe" + target.nodeId].contentWindow.postMessage(
			JSON.stringify(
				{
					uiActionFeedback: 1
				})
			, "*");

	}



};

realityEditor.device.trashActivated = true;

realityEditor.device.onTouchMove = function(evt) {
	var target = evt.currentTarget;
	//if(globalStates.editingMode == true) {
	if(evt.pageX >= (globalStates.height-60)){



		if(!realityEditor.device.trashActivated) {
			overlayDiv.classList.remove('overlayAction');
			overlayDiv.classList.add('overlayNegative');

			realityEditor.device.trashActivated = true;
		}

	} else {
		if(realityEditor.device.trashActivated) {

			overlayDiv.classList.remove('overlayNegative');
			overlayDiv.classList.add('overlayAction');

			realityEditor.device.trashActivated = false;
		}

	}

		if(	globalStates.editingNode === target.nodeId) {

			globalStates.editingModeObjectX = evt.pageX;
			globalStates.editingModeObjectY = evt.pageY;

			var tempThisObject = null;
			if (target.type === 'logic' || target.type === 'node') {
				tempThisObject = objects[target.objectId].nodes[target.nodeId];
			} else {
				tempThisObject = realityEditor.device.getEditingModeObject();
			}

			var matrixTouch = realityEditor.gui.ar.utilities.screenCoordinatesToMatrixXY(tempThisObject, [evt.pageX, evt.pageY]);

			if (matrixTouch) {
				tempThisObject.x = matrixTouch[0];
				tempThisObject.y = matrixTouch[1];
			}
			//}
		}

	if(!globalStates.editingMode) {
		clearTimeout(realityEditor.device.touchTimer);
	}
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

	cout("canvasPointerDown");
};

/**********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * @desc
 * @param evt
 **/

realityEditor.device.onDocumentPointerMove = function (evt) {
	evt.preventDefault();

	globalStates.pointerPosition = [evt.clientX, evt.clientY];

	// Translate up 6px to be above pocket layer
	overlayDiv.style.transform = 'translate3d(' + evt.clientX + 'px,' + evt.clientY + 'px,6px)';

    realityEditor.gui.pocket.setPocketPosition(evt);
};


/**********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * @desc
 * @param evt
 **/

realityEditor.device.onDocumentPointerUp = function(evt) {

	globalStates.pointerPosition = [-1, -1];

	// clear the timeout that makes the logic nodes moveable.
	clearTimeout(realityEditor.device.touchTimer);
    
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

				// make sure that logic nodes only stick to 2.0 server version
                if(realityEditor.network.testVersion(globalLogic.farFrontElement)>165) {
                    objects[globalLogic.farFrontElement].nodes[pocketItemId] = thisItem;

                    var _thisNode = document.getElementById("iframe" + pocketItemId);
                    if (_thisNode) {
                        if (_thisNode._loaded)
                            realityEditor.network.onElementLoad(globalLogic.farFrontElement, pocketItemId);
                    }

                    globalDOMCach[pocketItemId].objectId = globalLogic.farFrontElement;

                    realityEditor.network.postNewLogicNode(objects[globalLogic.farFrontElement].ip, globalLogic.farFrontElement, pocketItemId, thisItem);
                }

			}
			realityEditor.gui.ar.draw.hideTransformed("pocket", pocketItemId, pocketItem.pocket.nodes[pocketItemId], "logic");
			delete pocketItem.pocket.nodes[pocketItemId];
		}
	}


	globalStates.overlay = 0;

	if (globalStates.guiState ==="node") {
		realityEditor.device.onFalseTouchUp();
		if (!globalProgram.objectA && globalStates.drawDotLine) {
			realityEditor.gui.ar.lines.deleteLines(globalStates.drawDotLineX, globalStates.drawDotLineY, evt.clientX, evt.clientY);
		}
		globalStates.drawDotLine = false;
	}
	globalCanvas.hasContent = true;

	// todo why is this just hidden and not display none??

	overlayDiv.style.display = "none";

	overlayDiv.classList.remove('overlayMemory');
	overlayDiv.classList.remove('overlayAction');
	overlayDiv.classList.remove('overlayPositive');
	overlayDiv.classList.remove('overlayNegative');

    if (globalStates.guiState !== "logic" && !globalStates.realityState) {
        realityEditor.gui.menus.on("main",[]);
    }
	
    //realityEditor.gui.pocket.pocketOnMemoryCreationStop();
	if (overlayDiv.style.backgroundImage !== '' && overlayDiv.style.backgroundImage !== 'none') {
		overlayDiv.style.backgroundImage = 'none';
		window.location.href = 'of://clearMemory';
	}

	cout("documentPointerUp");


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

	overlayDiv.style.display = "inline";
	// Translate up 6px to be above pocket layer
	overlayDiv.style.transform = 'translate3d(' + evt.clientX + 'px,' + evt.clientY + 'px,6px)';
	if (globalStates.guiButtonState && !globalStates.freezeButtonState) {
		// If the event is hitting the background
		if (evt.target.id === 'canvas') {
			overlayDiv.classList.add('overlayMemory');
		}
	}
    
    // when in locking mode, don't start the pocket if you tap on the area over the locking buttons
    var ignoreLockingButtons = true;
    if (globalStates.lockingMode) {
        ignoreLockingButtons = (window.innerWidth - evt.clientX > 255) || (window.innerHeight - evt.clientY > 65);
    }

	if (realityEditor.gui.memory.memoryCanCreate() && !globalStates.realityState && window.innerWidth - evt.clientX > 65) {
            realityEditor.gui.menus.on("bigPocket", []);
	}

	cout("documentPointerDown");
};

/**
 * @desc
 * @param evt
 **/

realityEditor.device.onMultiTouchStart = function(evt) {
	if (evt.preventDefault) {
		evt.preventDefault();
	}
	var target = evt.currentTarget;
// generate action for all links to be reloaded after upload

	if (globalStates.editingMode && evt.targetTouches.length === 1) {
		console.log("--------------------------------"+target.objectId);
		globalStates.editingModeObject = target.objectId;
		globalStates.editingModeLocation = target.nodeId;
		globalStates.editingModeKind = target.type;
		globalStates.editingModeHaveObject = true;
		if(target.type === "logic")
        realityEditor.gui.menus.on("bigTrash",[]);
		//realityEditor.gui.pocket.pocketOnMemoryDeletionStart();
	}
	globalMatrix.matrixtouchOn = target.nodeId;
	globalMatrix.copyStillFromMatrixSwitch = true;
	cout("MultiTouchStart");
};

/**
 * @desc
 * @param evt
 **/

realityEditor.device.onMultiTouchMove = function(evt) {
	if(evt.pageX) {
		evt.touches = [{},{}];
		evt.touches[0].pageX = evt.pageX;
		evt.targetTouches = [1,1];
	}
	if(evt.pageY) {
		evt.touches = [{},{}];
		evt.touches[0].pageY = evt.pageY;
		evt.targetTouches = [1,1];
	}

	evt.preventDefault();

// generate action for all links to be reloaded after upload

	// cout(globalStates.editingModeHaveObject + " " + globalStates.editingMode + " " + globalStates.editingModeHaveObject + " " + globalStates.editingMode);

	if (globalStates.editingModeHaveObject && globalStates.editingMode && evt.targetTouches.length === 1) {

		var touch = evt.touches[0];

		globalStates.editingModeObjectX = touch.pageX;
		globalStates.editingModeObjectY = touch.pageY;



		var tempThisObject = realityEditor.device.getEditingModeObject();

		var matrixTouch = realityEditor.gui.ar.utilities.screenCoordinatesToMatrixXY(tempThisObject, [touch.pageX, touch.pageY]);

		if (matrixTouch) {
			tempThisObject.x = matrixTouch[0];
			tempThisObject.y = matrixTouch[1];
		}
	}

	if (globalStates.editingModeHaveObject && globalStates.editingMode && evt.targetTouches.length === 2) {
		realityEditor.gui.ar.positioning.onScaleEvent(evt.touches[1]);
	}

	cout("MultiTouchMove");
};

/**
 * @desc
 * @param evt
 **/

realityEditor.device.onMultiTouchEnd = function(evt) {
	if (evt.preventDefault) {
		evt.preventDefault();
	}

// generate action for all links to be reloaded after upload
	if (globalStates.editingModeHaveObject) {
		if (globalStates.editingMode) {
            realityEditor.gui.menus.on("main",[]);
			//realityEditor.gui.pocket.pocketOnMemoryDeletionStop();
		}
		if (globalStates.editingNode) {
			if ((!globalStates.editingMode) && globalStates.editingModeKind === 'ui') {
				globalDOMCach[globalStates.editingNode].style.visibility = 'hidden';
			}
			realityEditor.device.onTrueTouchUp(evt);
		}

		cout("start");
		// this is where it should be send to the object..

		var tempThisObject = realityEditor.device.getEditingModeObject();

		var content = {};
		content.x = tempThisObject.x;
		content.y = tempThisObject.y;
		content.scale = tempThisObject.scale;

		if (globalStates.unconstrainedPositioning === true) {
			realityEditor.gui.ar.utilities.multiplyMatrix(tempThisObject.begin, realityEditor.gui.ar.utilities.invertMatrix(tempThisObject.temp),tempThisObject.matrix);
			content.matrix = tempThisObject.matrix;

		}
		content.lastEditor = globalStates.tempUuid;

		// todo for now we just send nodes but no logic locations. ---- Became obsolete because the logic nodes are now normal nodes
		//  if(globalStates.editingModeKind=== "node") {
        if (globalStates.editingModeKind === 'ui' && globalStates.editingModeObject !== globalStates.editingModeLocation) {
            realityEditor.gui.frame.update(globalStates.editingModeObject, globalStates.editingModeLocation);
            // reposition all of this frame's nodes relative to their parent
            var object = objects[globalStates.editingModeObject];
            var frameId = globalStates.editingModeLocation;
            var frame = tempThisObject;

            for (var nodeId in object.nodes) {
                var node = object.nodes[nodeId];
                if (node.frame !== frameId) {
                    continue;
                }
                node.x = frame.x + (Math.random() - 0.5) * 160;
                node.y = frame.y + (Math.random() - 0.5) * 160;
            }

			if (evt.pageX > window.innerWidth - 60) {
				realityEditor.gui.frame.delete(globalStates.editingModeObject, frameId);
			}
		} else if (typeof content.x === "number" && typeof content.y === "number" && typeof content.scale === "number") {
			realityEditor.network.postData('http://' + objects[globalStates.editingModeObject].ip + ':' + httpPort + '/object/' + globalStates.editingModeObject + "/size/" + globalStates.editingModeLocation, content);
		}
		// }

		globalStates.editingModeHaveObject = false;
		globalCanvas.hasContent = true;
		globalMatrix.matrixtouchOn = "";
	}
	cout("MultiTouchEnd");
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

		var tempThisObject = realityEditor.device.getEditingModeObject();
		globalStates.editingScaledistanceOld = tempThisObject.scale;
	}
	cout("MultiTouchCanvasStart");
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
		realityEditor.gui.ar.positioning.onScaleEvent(touch);

	}
	cout("MultiTouchCanvasMove");
};


/**
 * @desc
 * @param deviceName
 **/

realityEditor.device.setDeviceName = function(deviceName) {
	globalStates.device = deviceName;
	console.log("The Reality Editor is loaded on a " + globalStates.device);
};

/**
 * @desc
 * @param developerState
 * @param extendedTrackingState
 * @param clearSkyState
 * @param externalState
 **/

realityEditor.device.setStates = function (developerState, extendedTrackingState, clearSkyState, instantState, externalState, realityState) {

    globalStates.extendedTrackingState = extendedTrackingState;
    globalStates.developerState = developerState;
    globalStates.clearSkyState = clearSkyState;
    globalStates.instantState = instantState;
    globalStates.externalState = externalState;
    globalStates.realityState = realityState;

    if (globalStates.clearSkyState) {
        document.getElementById("UIButtons").classList.add('clearSky');
    } else {
        document.getElementById("UIButtons").classList.remove('clearSky');
    }

	if (globalStates.realityState) {
            realityEditor.gui.menus.on("realityInfo",["realityGui"]);
            globalStates.realityState = true;
	} else {
            realityEditor.gui.menus.off("main",["gui","reset","unconstrained"]);
            realityEditor.gui.menus.on("main",["gui"]);
            globalStates.realityState = false;
	}

    if (developerState) {
        realityEditor.device.addEventHandlers();
        globalStates.editingMode = true;
    }

    if (extendedTrackingState) {
        globalStates.extendedTracking = true;
    }

    if (globalStates.editingMode) {
        realityEditor.gui.menus.on("editing", []);
    }
};

/**
 * @desc
 **/

realityEditor.device.removeEventHandlers = function() {

	realityEditor.device.deactivateMultiTouch();
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
				realityEditor.device.deactivateNodeMove(thisSubKey);
			}

            for (var frameKey in generalObject2.frames) {
                var elt = document.getElementById(frameKey);
                if (!elt) {
                    continue;
                }
                elt.style.visibility = "hidden";

                var canvas = document.getElementById("canvas" + frameKey);
                canvas.style.display = "none";

                elt.removeEventListener("touchstart", realityEditor.device.onMultiTouchStart);
                ec--;
                elt.removeEventListener("touchmove", realityEditor.device.onMultiTouchMove);
                ec--;
                elt.removeEventListener("touchend", realityEditor.device.onMultiTouchEnd);
                ec--;
            }
		}
	}

	cout("removeEventHandlers");
};
