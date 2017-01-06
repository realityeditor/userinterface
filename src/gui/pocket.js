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
 * Modified by Benjamin Reynholds 2016
 * Modified by James Hobin 2016
 * Modified by Valentin Heun 2016
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

realityEditor.gui.pocket.setPocketPossition = function(evt){
    
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
				var matrixTouch = screenCoordinatesToMatrixXY(thisItem, [evt.clientX, evt.clientY]);
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
 *
 * Functions expected to be invoked globally are prefixed with "pocket"
 */
(function(exports) {

    var buttonImages = [];
    var bigPocketImages = [];
    var bigTrashImages = [];
    var element;
    var uiButtons;
    var button;
    var bigPocketButton;
    var bigTrashButton;

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

        uiButtons = document.getElementById('UIButtons');

        button = document.getElementById('pocketButton');
        bigPocketButton = document.getElementById('bigPocketButton');
        bigTrashButton = document.getElementById('bigTrashButton');

        button.addEventListener('pointerenter', function() {
            if (globalStates.guiState !== "ui" && !globalProgram.objectA) {
                return;
            }

            if (pocketButtonIsBig()) {
                return;
            }

            toggleShown();
            // Show hover
            button.src = buttonImages[1].src;
        });

        ec++;

        button.addEventListener('pointerleave', function() {
            if (globalStates.guiState !== "ui" && !globalProgram.objectA) {
                return;
            }

            // Undo the hover state
            updateButtons();
        });
        ec++;

        bigPocketButton.addEventListener('pointerenter', function() {
            if (globalStates.guiState !== "ui") {
                return;
            }

            if (!pocketButtonIsBig()) {
                return;
            }

            if (realityEditor.gui.memory.memoryCanCreate()) {
                overlayDiv.classList.add('overlayMemoryInstant');
                overlayDiv.classList.add('overlayMemory');
            }

            toggleShown();
            bigPocketButton.src = bigPocketImages[1].src;
        });
        ec++;

        bigPocketButton.addEventListener('pointerleave', function() {
            if (globalStates.guiState !== "ui") {
                return;
            }

            // Undo the hover state
            updateButtons();
        });
        ec++;

        element = document.querySelector('.pocket');
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
        element.classList.add('pocketShown');
        updateButtons();
    }

    function pocketHide() {
        element.classList.remove('pocketShown');
        uiButtons.classList.remove('bigPocket');
        uiButtons.classList.remove('bigTrash');
        updateButtons();
    }

    function updateButtons() {
        if (pocketShown()) {
            button.src = buttonImages[2].src
            bigPocketButton.src = bigPocketImages[2].src;
            bigTrashButton.src = bigTrashImages[2].src;
        } else {
            button.src = buttonImages[0].src
            bigPocketButton.src = bigPocketImages[0].src;
            bigTrashButton.src = bigTrashImages[0].src;
        }
    }

    function pocketShown() {
        return element.classList.contains('pocketShown');
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

    exports.pocketInit = pocketInit;
    exports.pocketShown = pocketShown;
    exports.pocketShow = pocketShow;
    exports.pocketHide = pocketHide;
    exports.pocketOnMemoryCreationStart = pocketOnMemoryCreationStart;
    exports.pocketOnMemoryCreationStop = pocketOnMemoryCreationStop;
    exports.pocketOnMemoryDeletionStart = pocketOnMemoryDeletionStart;
    exports.pocketOnMemoryDeletionStop = pocketOnMemoryDeletionStop;

}(realityEditor.gui.pocket));
