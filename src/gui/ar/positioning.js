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


createNameSpace("realityEditor.gui.ar.positioning");

/**
 * @desc
 * @param touch
 **/

realityEditor.gui.ar.positioning.onScaleEvent = function(touch) {
	var thisRadius = Math.sqrt(Math.pow((globalStates.editingModeObjectX - touch.pageX), 2) + Math.pow((globalStates.editingModeObjectY - touch.pageY), 2));
	var thisScale = (thisRadius - globalStates.editingScaledistance) / 300 + globalStates.editingScaledistanceOld;

	// cout(thisScale);

	var tempThisObject = {};
	if (globalStates.editingModeObject != globalStates.editingModeLocation) {
		tempThisObject = objects[globalStates.editingModeObject].nodes[globalStates.editingModeLocation];
	} else {
		tempThisObject = objects[globalStates.editingModeObject];
	}
	if (thisScale < 0.2)thisScale = 0.2;
	if (typeof thisScale === "number" && thisScale > 0) {
		tempThisObject.scale = thisScale;
	}
	globalCanvas.context.clearRect(0, 0, globalCanvas.canvas.width, globalCanvas.canvas.height);
	//drawRed(globalCanvas.context, [globalStates.editingModeObjectX,globalStates.editingModeObjectY],[touch.pageX,touch.pageY],globalStates.editingScaledistance);
	this.ar.lines.drawBlue(globalCanvas.context, [globalStates.editingModeObjectX, globalStates.editingModeObjectY], [touch.pageX, touch.pageY], globalStates.editingScaledistance);

	if (thisRadius < globalStates.editingScaledistance) {

		this.ar.lines.drawRed(globalCanvas.context, [globalStates.editingModeObjectX, globalStates.editingModeObjectY], [touch.pageX, touch.pageY], thisRadius);

	} else {
		this.ar.lines.drawGreen(globalCanvas.context, [globalStates.editingModeObjectX, globalStates.editingModeObjectY], [touch.pageX, touch.pageY], thisRadius);

	}
	this.cout("scaleEvent");
};
