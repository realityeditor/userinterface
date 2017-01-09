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

}

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

}