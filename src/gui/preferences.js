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


createNameSpace("realityEditor.gui.preferences");

realityEditor.gui.preferences.preferencesHide = function() {
	document.getElementById('preferencesButton').src = preferencesButtonImage[0].src;
	globalStates.preferencesButtonState = false;
	document.getElementById("preferences").style.visibility = "hidden"; //= "hidden";
	document.getElementById("preferences").style.display = "none"; //= "hidden";
	clearInterval(globalStates.thisAndthat.interval);
	this.cout("preferencesHide");
}

/**
 * @desc
 **/

realityEditor.gui.preferences.preferencesVisible = function() {
	document.getElementById('preferencesButton').src = preferencesButtonImage[2].src;
	globalStates.preferencesButtonState = true;
	document.getElementById("preferences").style.visibility = "visible"; //
	document.getElementById("preferences").style.display = "inline"; //= "hidden";
	var _this = this;
	globalStates.thisAndthat.interval = setInterval(function() {
		_this.addElementInPreferences();
	}, 200);
	this.cout("preferencesVisible");

};


/**
 * Construct and insert the list of objects into the preferences display
 */
realityEditor.gui.preferences.addElementInPreferences = function() {
	this.cout("addedObject");

	var htmlContent = "";

	htmlContent += "<div class='Interfaces objectEntry objectName'>Name</div>";

	htmlContent += "<div class='Interfaces objectEntry objectIP'>IP</div>";

	htmlContent += "<div class='Interfaces objectEntry objectVersion'>Version</div>";

	htmlContent += "<div class='Interfaces objectEntry objectIO'>Nodes</div>";

	htmlContent += "<div class='Interfaces objectEntry objectLinks'>Links</div>";


	// Construct the entries for each current object. Turns into a row through
	// convenient wrapping

	var bgSwitch = false;
	var bgcolor = "";

	for (var keyPref in objects) {

		if (bgSwitch) {
			bgcolor = "background-color: #a0a0a0;";
			bgSwitch = false;
		} else {
			bgcolor = "background-color: #aaaaaa;";
			bgSwitch = true;
		}

		htmlContent += "<div class='Interfaces objectEntry objectName' id='" +
			"name" + keyPref +
			"' style='" + bgcolor + "'>" +
			objects[keyPref].name
			+ "</div>";

		htmlContent += "<div class='Interfaces objectEntry objectIP' id='" +
			"ip" + keyPref +
			"' style='" + bgcolor + "'>" +
			objects[keyPref].ip
			+ "</div>";

		htmlContent += "<div class='Interfaces objectEntry objectVersion' id='" +
			"version" + keyPref +
			"' style='" + bgcolor + "'>" +
			objects[keyPref].version
			+ "</div>";

		var anzahl = 0;

		for (var subkeyPref2 in objects[keyPref].nodes) {
			anzahl++;
		}

		htmlContent += "<div class='Interfaces objectEntry objectIO' id='" +
			"io" + keyPref +
			"' style='" + bgcolor + "'>" +
			anzahl
			+ "</div>";

		anzahl = 0;

		for (var subkeyPref in objects[keyPref].links) {
			anzahl++;
		}

		htmlContent += "<div class='Interfaces objectEntry objectLinks' id='" +
			"links" + keyPref +
			"' style='" + bgcolor + "'>" +
			anzahl
			+ "</div>";

	}

	document.getElementById("content2").innerHTML = htmlContent;

	this.cout("addElementInPreferences");
};