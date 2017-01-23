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

    var realityElements = [
        'reality-closed-loop-circle',
        'reality-closed-loop-slider-2d',
        'reality-closed-loop-slider',
        'reality-control-button',
        'reality-control-circle',
        'reality-control-circle-2d',
        'reality-control-slider',
        'reality-control-slider-2d',
        'reality-control-slider-kinetic',
        'reality-control-slider-kinetic-2d',
        'reality-control-switch',
        'reality-control-switch-multi',
        'reality-sensor-digital',
        'reality-sensor-graph',
        'reality-sensor-linear',
        'reality-sensor-orientation',
        'reality-sensor-rotation'
    ];

    var paletteElementsResized = false;
    var paletteElements = [];

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
            realityEditor.gui.frame.create(objectIds[0], new realityEditor.gui.frame.Frame(evt.target.dataset.src));
            pocketHide();
        });

        function isPocketWanted() {
            if (pocketShown()) {
                return true;
            }
            if (globalStates.preferencesButtonState) {
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

            if (globalStates.guiState === 'node' && !globalProgram.objectA) {
                return;
            }

            toggleShown();
            // Show hover
            button.src = buttonImages[1].src;
        });
        ec++;

        button.addEventListener('pointerup', function() {
            if (!isPocketWanted()) {
                return;
            }

            if (pocketButtonIsBig()) {
                return;
            }

            if (globalStates.guiState !== 'node') {
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
        if (!paletteElementsResized) {
            for (var i = 0; i < paletteElements.length; i++) {
                resizePaletteElement(paletteElements[i]);
            }
            paletteElementsResized = true;
        }
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
        bigTrashButton.src = bigTrashImages[0].src;
    }

    function pocketOnMemoryDeletionStop() {
        uiButtons.classList.remove('bigTrash');
    }

    function resizePaletteElement(element) {
        var bounds = element.getBoundingClientRect();
        var parentBounds = element.parentNode.getBoundingClientRect();

        var scale = Math.min(parentBounds.width / bounds.width, parentBounds.height / bounds.height, 1);
        element.style.transform = 'scale(' + scale + ')';
        element.style.width = parentBounds.width + 'px';
        element.style.height = parentBounds.height + 'px';
    }

    function createPocketUIPalette() {
        for (var i = 0; i<realityElements.length; i++){
            var element = realityElements[i];
            var container = document.createElement('div');
            container.classList.add('palette-container');
            container.classList.add('element-template');
            container.dataset.src = '/bower_components/' + element + '/index.html';

            var elt = document.createElement('iframe');
            elt.classList.add('palette-element');
            elt.src = '/bower_components/' + element + '/index.html?demo=true';
            paletteElements.push(elt);
            container.appendChild(elt);

            palette.appendChild(container);
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
