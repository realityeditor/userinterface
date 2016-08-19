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
 *              ╦ ╦┬ ┬┌┐ ┬─┐┬┌┬┐  ╔═╗┌┐  ┬┌─┐┌─┐┌┬┐┌─┐
 *              ╠═╣└┬┘├┴┐├┬┘│ ││  ║ ║├┴┐ │├┤ │   │ └─┐
 *              ╩ ╩ ┴ └─┘┴└─┴─┴┘  ╚═╝└─┘└┘└─┘└─┘ ┴ └─┘
 *
 *
 * Created by Valentin on 10/22/14.
 *
 * Copyright (c) 2015 Valentin Heun
 *
 * All ascii characters above must be included in any redistribution.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * @desc
 * @param thisKey
 * @return {String}
 **/

function objectLog(thisKey) {
    cout("objectLog");
    var consoleText_ = "";

    consoleText_ += "Object Name: <b>" + objects[thisKey].name;

    if (objects[thisKey].loaded === true) {

        consoleText_ += "</b>; Unloading in <b>" + (objects[thisKey].visibleCounter / 60).toFixed(1) + " sec.";

    } else {
        consoleText_ += "</b>; Content <b>not</b> loaded<b>";

    }

    consoleText_ += "</b>;  Visible: <b>" + objects[thisKey].visible +
    "</b>; MAC: <b>" + objects[thisKey].name +
    "</b>; IP: <b>" + objects[thisKey].ip +
        // "</b><br>Z: "+objects[thisKey].screenZ ;
    "</b>";

    /* for (var key4 in objects[thisKey].nodes) {
     consoleText_ += JSON.stringify(objects[thisKey].nodes[key4]) + "<br>";
     }*/
    return consoleText_;
}

/**********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * @desc
 * @param tempConsoleText
 * @return
 **/

function generalLog(tempConsoleText) {
    cout("generalLog");
    var thisLoop = new Date;
    var fps = 1000 / (thisLoop - globalStates.lastLoop);
    globalStates.lastLoop = thisLoop;


    var GUIElements = 0;

    for (var key3 in objects) {

        if (document.getElementById("iframe" + key3)) {
            GUIElements++;
        }

    }

    tempConsoleText += "<br>framerate: <b>" + parseInt(fps) + "</b><br><br>";
    tempConsoleText += "Currently loaded GUI elements: <b>" + GUIElements + "</b><br>";
    tempConsoleText += "Currently loaded Programming elements: <b>" + (document.getElementById("GUI").getElementsByTagName("iframe").length - GUIElements) + "</b><br><br>";
   // tempConsoleText += JSON.stringify(globalStates).replace(/,/gi, '<br>');
    document.getElementById("consolelog").style.visibility = "visible";
    document.getElementById("consolelog").innerHTML = tempConsoleText;
}
