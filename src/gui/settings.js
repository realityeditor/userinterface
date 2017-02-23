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


createNameSpace("realityEditor.gui.settings");

realityEditor.gui.settings.hideSettings = function() {

    console.log("this is what I want to show:  ",globalStates.clearSkyState);

	globalStates.settingsButtonState = false;

    document.getElementById("settingsIframe").contentWindow.postMessage(JSON.stringify({getSettings: {
        extendedTracking: globalStates.extendedTracking,
        editingMode: globalStates.editingMode,
        clearSkyState: globalStates.clearSkyState,
        instantState: globalStates.instantState,
        externalState: globalStates.externalState,
        settingsButton : globalStates.settingsButtonState,
        lockingMode: globalStates.lockingMode,
        lockPassword: globalStates.lockPassword,
        realityState: globalStates.realityState
    }
    }), "*");

	document.getElementById("settingsIframe").style.visibility = "hidden";
	document.getElementById("settingsIframe").style.display = "none";


    if (globalStates.clearSkyState) {
        document.getElementById("UIButtons").classList.add('clearSky');
    } else {
        document.getElementById("UIButtons").classList.remove('clearSky');
    }

	this.cout("hide Settings");
};

/**
 * @desc
 **/
/*
timeForContentLoaded = 240000;
window.location.href = "of://clearSkyOn";

document.body.classList.add('clearSky');
} else {


    // realityEditor.gui.menus.on("main",[]);


    globalStates.UIOffMode = false;
    timeForContentLoaded = 240;

*/

realityEditor.gui.settings.showSettings = function() {

    if(!globalStates.realityState) {
        realityEditor.gui.menus.on("setting", ["setting"]);
    }
    else {
        realityEditor.gui.menus.on("settingReality", ["setting"]);
    }


	globalStates.settingsButtonState = true;
	document.getElementById("settingsIframe").style.visibility = "visible";
	document.getElementById("settingsIframe").style.display = "inline";

    document.getElementById("settingsIframe").contentWindow.postMessage(JSON.stringify({getSettings: {
        extendedTracking: globalStates.extendedTracking,
        editingMode: globalStates.editingMode,
        clearSkyState: globalStates.clearSkyState,
        instantState: globalStates.instantState,
        externalState: globalStates.externalState,
        settingsButton : globalStates.settingsButtonState,
        lockingMode: globalStates.lockingMode,
        lockPassword: globalStates.lockPassword,
        realityState: globalStates.realityState
    }
    }), "*");

    overlayDiv.style.display = "none";

    if(document.getElementById("UIButtons").classList.contains('clearSky')) {
        document.getElementById("UIButtons").classList.remove('clearSky');
    }

    this.cout("show Settings");
};
