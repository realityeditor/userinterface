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

createNameSpace("realityEditor.gui.pocket");

realityEditor.gui.pocket.pocketButtonAction = function() {

	console.log("state: " + globalStates.pocketButtonState);

	var indexChange = (globalStates.guiState === "logic") ? 4 : 0;

	if (globalStates.pocketButtonState === true) {
		console.log("buttonon");
		if (!globalStates.UIOffMode)    document.getElementById('pocketButton').src = pocketButtonImage[0+indexChange].src;
		globalStates.pocketButtonState = false;

		if (globalStates.guiState === 'logic') {
		realityEditor.gui.crafting.blockMenuVisible();
			console.log("blockMenuVisible");
		}
	}
	else {
		console.log("buttonoff");
		if (!globalStates.UIOffMode)    document.getElementById('pocketButton').src = pocketButtonImage[2+indexChange].src;
		globalStates.pocketButtonState = true;

		if (globalStates.guiState === 'logic') {
			realityEditor.gui.crafting.blockMenuHide();
		}
	}

};

realityEditor.gui.pocket.setPocketPosition = function(evt){
    
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

/**
 * The Pocket button. Turns into a larger version or a delete button when
 * the user is creating memories or when the user is dragging saved
 * memories/programming blocks, respectively.
 */
(function(exports) {

    var buttonImages = [];
    var bigPocketImages = [];
    var bigTrashImages = [];
    var pocket;
    var palette;
    var uiButtons;
    var button;
    var bigPocketButton;
    var bigTrashButton;

    var inMemoryDeletion = false;

    var realityElements = [
        {
            name: 'reality-control-slider-kinetic',
            width: 206,
            height: 526
        },
        {
            name: 'reality-control-slider-kinetic-2d',
            width: 526,
            height: 526
        },
        {
            name: 'reality-sensor-graph',
            width: 304,
            height: 304
        },
        {
            name: 'reality-sensor-linear',
            width: 204,
            height: 52
        },
        {
            name: 'reality-sensor-digital',
            width: 52,
            height: 52
        }
    ];

    function pocketInit() {
        realityEditor.gui.buttons.preload(buttonImages,
            'png/pocket.png', 'png/pocketOver.png', 'png/pocketSelect.png', 'png/pocketEmpty.png'
        );
        realityEditor.gui.buttons.preload(bigPocketImages,
            'png/bigPocket.png', 'png/bigPocketOver.png', 'png/bigPocketSelect.png', 'png/bigPocketEmpty.png'
        );
        realityEditor.gui.buttons.preload(bigTrashImages,
            'png/bigTrash.png', 'png/bigTrashOver.png', 'png/bigTrashSelect.png', 'png/bigTrashEmpty.png'
        );

        pocket = document.querySelector('.pocket');
        palette = document.querySelector('.palette');

        uiButtons = document.getElementById('UIButtons');

        button = document.getElementById('pocketButton');
        bigPocketButton = document.getElementById('bigPocketButton');
        bigTrashButton = document.getElementById('bigTrashButton');

        // On touching an element-template, upload to currently visible object
        pocket.addEventListener('pointerdown', function(evt) {
            if (!evt.target.classList.contains('element-template')) {
                return;
            }
            var objectIds = Object.keys(globalObjects);
            if (objectIds.length !== 1) {
                return;
            }
            var parentObject = objects[objectIds[0]];
            var src = evt.target.dataset.src;
            var width = evt.target.dataset.width;
            var height = evt.target.dataset.height;
            var frame = new realityEditor.gui.frame.Frame(src, width, height);

            var tempMatrix = [];
            var r = globalMatrix.r;

            var arUtilities = realityEditor.gui.ar.utilities;
            arUtilities.multiplyMatrix(globalObjects[objectIds[0]], globalStates.projectionMatrix, r);
            arUtilities.multiplyMatrix(rotateX, r, tempMatrix);
            parentObject.temp = tempMatrix;
            var matrixTouch = arUtilities.screenCoordinatesToMatrixXY(parentObject, [evt.clientX, evt.clientY]);
            frame.x = matrixTouch[0];
            frame.y = matrixTouch[1];
            realityEditor.gui.frame.create(objectIds[0], frame);
            pocketHide();
        });

        function isPocketWanted() {
            if (pocketShown()) {
                return true;
            }
            if (globalStates.preferencesButtonState) {
                return false;
            }
            if (globalStates.editingNode) {
                return false;
            }
            if (inMemoryDeletion) {
                return false;
            }
            return globalStates.guiState === "ui" || globalStates.guiState === "node";
        }

        button.addEventListener('pointerenter', function() {
            if (!isPocketWanted()) {
                return;
            }

            if (pocketButtonIsBig()) {
                return;
            }

            // Show hover
            button.src = buttonImages[1].src;

            if (!globalProgram.objectA) {
                return;
            }

            toggleShown();
        });
        ec++;

        button.addEventListener('pointerup', function() {
            if (!isPocketWanted()) {
                return;
            }

            if (pocketButtonIsBig()) {
                return;
            }

            toggleShown();
        });
        ec++;

        button.addEventListener('pointerleave', function() {
            if (!isPocketWanted()) {
                return;
            }

            // Undo the hover state
            updateButtons();
        });
        ec++;

        bigPocketButton.addEventListener('pointerenter', function() {
            if (!isPocketWanted()) {
                return;
            }

            if (!pocketButtonIsBig()) {
                return;
            }

            if (realityEditor.gui.memory.memoryCanCreate()) {
                realityEditor.gui.memory.createMemory();
                if (globalStates.guiState === "node") {
                    globalStates.drawDotLine = false;
                }
            }

            toggleShown();
            bigPocketButton.src = bigPocketImages[1].src;
        });
        ec++;

        bigPocketButton.addEventListener('pointerleave', function() {
            if (!isPocketWanted()) {
                return;
            }

            // Undo the hover state
            updateButtons();
        });
        ec++;

        createPocketUIPalette();
		pocketHide();
    }

    function pocketButtonIsBig() {
        return uiButtons.classList.contains('bigPocket');
    }

    function toggleShown() {
        if (pocketShown()) {
            pocketHide();
        } else {
            pocketShow();
        }
    }


    function pocketShow() {
        pocket.classList.add('pocketShown');
        updateButtons();
        if (globalStates.guiState === "node") {
            palette.style.display = 'none';
        } else {
            palette.style.display = 'block';
        }
    }

    function pocketHide() {
        pocket.classList.remove('pocketShown');
        uiButtons.classList.remove('bigPocket', 'bigTrash');
        updateButtons();
    }

    function updateButtons() {
        if (pocketShown()) {
            button.src = buttonImages[2].src;
            bigPocketButton.src = bigPocketImages[2].src;
            bigTrashButton.src = bigTrashImages[2].src;
        } else {
            button.src = buttonImages[0].src;
            bigPocketButton.src = bigPocketImages[0].src;
            bigTrashButton.src = bigTrashImages[0].src;
        }
    }

    function pocketShown() {
        return pocket.classList.contains('pocketShown');
    }

    function pocketOnMemoryCreationStart() {
        uiButtons.classList.add('bigPocket');
        bigPocketButton.src = bigPocketImages[0].src;
    }

    function pocketOnMemoryCreationStop() {
        uiButtons.classList.remove('bigPocket');
    }

    function pocketOnMemoryDeletionStart() {
        uiButtons.classList.add('bigTrash');
        inMemoryDeletion = true;
        bigTrashButton.src = bigTrashImages[0].src;
    }

    function pocketOnMemoryDeletionStop() {
        inMemoryDeletion = false;
        uiButtons.classList.remove('bigTrash');
    }

    function createPocketUIPalette() {
        for (var i = 0; i<realityElements.length; i++){
            var element = realityElements[i];
            var container = document.createElement('div');
            container.classList.add('element-template');
            container.dataset.src = 'bower_components/' + element.name + '/index.html';

            container.dataset.width = element.width;
            container.dataset.height = element.height;

            var elt = document.createElement('iframe');
            elt.classList.add('palette-element');
            elt.src = 'bower_components/' + element.name + '/index.html?demo=true';

            container.appendChild(elt);
            palette.appendChild(container);

            var paletteElementSize = Math.floor(parseFloat(window.getComputedStyle(container).width)) - 6;

            var scale = Math.min(
                paletteElementSize / element.width,
                paletteElementSize / element.height,
                1
            );

            elt.style.transform = 'scale(' + scale + ')';

            var offsetX = (paletteElementSize - element.width * scale) / 2;
            var offsetY = (paletteElementSize - element.height * scale) / 2;

            elt.style.marginTop = offsetY + 'px';
            elt.style.marginLeft = offsetX + 'px';
        }
    }

    exports.pocketInit = pocketInit;
    exports.pocketShown = pocketShown;
    exports.pocketShow = pocketShow;
    exports.pocketHide = pocketHide;
    exports.pocketOnMemoryCreationStart = pocketOnMemoryCreationStart;
    exports.pocketOnMemoryCreationStop = pocketOnMemoryCreationStop;
    exports.pocketOnMemoryDeletionStart = pocketOnMemoryDeletionStart;
    exports.pocketOnMemoryDeletionStop = pocketOnMemoryDeletionStop;

}(realityEditor.gui.pocket));
