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
/*********************************************************************************************************************
 ******************************************** TODOS *******************************************************************
 **********************************************************************************************************************

 **
 * TODO -
 **

 **********************************************************************************************************************
 ******************************************** GUI content *********************+++*************************************
 **********************************************************************************************************************/


var freezeButtonImage = [];
var guiButtonImage = [];
var preferencesButtonImage = [];
var reloadButtonImage = [];
var resetButtonImage = [];
var unconstButtonImage = [];
var editingButtonImage = [];
var pocketButtonImage = [];
var loadNewUiImage = [];

/**********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * @desc
 **/

function GUI() {

    preload(freezeButtonImage,
        'png/freeze.png', 'png/freezeOver.png', 'png/freezeSelect.png', 'png/freezeEmpty.png'
    );
    preload(guiButtonImage,
        'png/intOneOver.png', 'png/intOneSelect.png', 'png/intTwoOver.png', 'png/intTwoSelect.png', 'png/intEmpty.png', 'png/intThree.png'
    );

    preload(pocketButtonImage,
        'png/pocket.png', 'png/pocketOver.png', 'png/pocketSelect.png', 'png/pocketEmpty.png'
    );

    preload(preferencesButtonImage,
        'png/pref.png', 'png/prefOver.png', 'png/prefSelect.png', 'png/prefEmpty.png'
    );
    preload(reloadButtonImage,
        'png/reloadOver.png', 'png/reload.png', 'png/reloadEmpty.png'
    );
    preload(resetButtonImage,
        'png/reset.png', 'png/resetOver.png', 'png/resetSelect.png', 'png/resetEmpty.png'
    );

    preload(unconstButtonImage,
        'png/unconst.png', 'png/unconstOver.png', 'png/unconstSelect.png', 'png/unconstEmpty.png'
    );

    preload(loadNewUiImage,
        'png/load.png', 'png/loadOver.png'
    );

    document.getElementById("guiButtonImage1").addEventListener("touchstart", function () {
        if (!globalStates.UIOffMode)     document.getElementById('guiButtonImage').src = guiButtonImage[0].src;
        // kickoff();
    });
    ec++;

    document.getElementById("guiButtonImage1").addEventListener("touchend", function () {
        if (globalStates.guiState ==="node") {
            if (!globalStates.UIOffMode)      document.getElementById('guiButtonImage').src = guiButtonImage[1].src;
            globalStates.guiState = "ui";
        }
        else {
            if (!globalStates.UIOffMode)     document.getElementById('guiButtonImage').src = guiButtonImage[1].src;
        }

    });
    ec++;

    document.getElementById("guiButtonImage2").addEventListener("touchstart", function () {
        if (!globalStates.UIOffMode)     document.getElementById('guiButtonImage').src = guiButtonImage[2].src;
    });
    ec++;

    document.getElementById("guiButtonImage2").addEventListener("touchend", function () {
        if (globalStates.guiState ==="ui") {
            if (!globalStates.UIOffMode)     document.getElementById('guiButtonImage').src = guiButtonImage[3].src;
            globalStates.guiState = "node";
        }
        else {
            if (!globalStates.UIOffMode)    document.getElementById('guiButtonImage').src = guiButtonImage[3].src;
        }
    });
    ec++;

    document.getElementById("extendedTrackingSwitch").addEventListener("change", function () {
        if (document.getElementById("extendedTrackingSwitch").checked) {
            globalStates.extendedTracking = true;
            window.location.href = "of://extendedTrackingOn";
        } else {
            globalStates.extendedTracking = false;
            window.location.href = "of://extendedTrackingOff";
        }
    });
    ec++;

    document.getElementById("editingModeSwitch").addEventListener("change", function () {

        if (document.getElementById("editingModeSwitch").checked) {
            addEventHandlers();
            globalStates.editingMode = true;
            window.location.href = "of://developerOn";
            globalMatrix.matrixtouchOn = "";
        } else {
            removeEventHandlers();
            globalStates.editingMode = false;
            window.location.href = "of://developerOff";
        }
    });
    ec++;

    document.getElementById("turnOffUISwitch").addEventListener("change", function () {
        if (document.getElementById("turnOffUISwitch").checked) {
            globalStates.UIOffMode = true;
            timeForContentLoaded = 240000;
            window.location.href = "of://clearSkyOn";

        } else {
            globalStates.UIOffMode = false;
            timeForContentLoaded = 240;
            window.location.href = "of://clearSkyOff";

        }
    });
    ec++;

    document.getElementById("resetButton").addEventListener("touchstart", function () {
        if (!globalStates.UIOffMode)    document.getElementById('resetButton').src = resetButtonImage[1].src;

    });
    ec++;

    document.getElementById("resetButton").addEventListener("touchend", function () {

        if (!globalStates.UIOffMode)    document.getElementById('resetButton').src = resetButtonImage[0].src;
        //  window.location.href = "of://loadNewUI"+globalStates.newURLText;

        for (var key in objects) {
            if (!globalObjects.hasOwnProperty(key)) {
                continue;
            }

            var tempResetObject = objects[key];

            if (globalStates.guiState ==="ui") {
                tempResetObject.matrix = [];

                tempResetObject.x = 0;
                tempResetObject.y = 0;
                tempResetObject.scale = 1;

                sendResetContent(key, key);
            }

            for (var subKey in tempResetObject.nodes) {
                var tempResetValue = tempResetObject.nodes[subKey];

                if (globalStates.guiState ==="node") {

                    tempResetValue.matrix = [];

                    tempResetValue.x = randomIntInc(0, 200) - 100;
                    tempResetValue.y = randomIntInc(0, 200) - 100;
                    tempResetValue.scale = 1;

                    sendResetContent(key, subKey);
                }

            }

        }

    });
    ec++;

    /**
     * @desc
     * @param object
     * @param node
     **/

    function sendResetContent(object, node) {
// generate action for all links to be reloaded after upload

        var tempThisObject = {};
        if (object != node) {
            tempThisObject = objects[object].nodes[node];
        } else {
            tempThisObject = objects[object];
        }

        var content = {};
        content.x = tempThisObject.x;
        content.y = tempThisObject.y;
        content.scale = tempThisObject.scale;

        if (typeof tempThisObject.matrix === "object") {
            content.matrix = tempThisObject.matrix;
        }

        if (typeof content.x === "number" && typeof content.y === "number" && typeof content.scale === "number") {
            postData('http://' + objects[object].ip + ':' + httpPort + '/object/' + object + "/size/" + node, content);
        }

    }

    document.getElementById("unconstButton").addEventListener("touchstart", function () {
        if (!globalStates.UIOffMode) document.getElementById('unconstButton').src = unconstButtonImage[1].src;
    });
    ec++;

    document.getElementById("unconstButton").addEventListener("touchend", function () {
        if (globalStates.unconstrainedPositioning === true) {
            if (!globalStates.UIOffMode)    document.getElementById('unconstButton').src = unconstButtonImage[0].src;
            globalStates.unconstrainedPositioning = false;

        }
        else {
            if (!globalStates.UIOffMode)    document.getElementById('unconstButton').src = unconstButtonImage[2].src;
            globalStates.unconstrainedPositioning = true;

        }

    });
    ec++;

    document.getElementById("loadNewUI").addEventListener("touchstart", function () {
        if (globalStates.extendedTracking === true) {
            if (!globalStates.UIOffMode)    document.getElementById('loadNewUI').src = loadNewUiImage[3].src;
        }
        else {
            if (!globalStates.UIOffMode)    document.getElementById('loadNewUI').src = loadNewUiImage[1].src;
        }
    });
    ec++;

    document.getElementById("loadNewUI").addEventListener("touchend", function () {

        if (!globalStates.UIOffMode)    document.getElementById('loadNewUI').src = loadNewUiImage[0].src;
        window.location.href = "of://loadNewUI" + globalStates.newURLText;

    });
    ec++;

    document.getElementById("preferencesButton").addEventListener("touchstart", function () {
        if (!globalStates.UIOffMode)    document.getElementById('preferencesButton').src = preferencesButtonImage[1].src;
    });
    ec++;

    document.getElementById("preferencesButton").addEventListener("touchend", function () {
        if (globalStates.preferencesButtonState === true) {
            preferencesHide();
            overlayDiv.style.display = "none";

            if (globalStates.editingMode) {
                document.getElementById('resetButton').style.visibility = "visible";
                document.getElementById('unconstButton').style.visibility = "visible";
                document.getElementById('resetButtonDiv').style.display = "inline";
                document.getElementById('unconstButtonDiv').style.display = "inline";
            }

            if (globalStates.UIOffMode) {
                document.getElementById('preferencesButton').src = preferencesButtonImage[3].src;
                document.getElementById('feezeButton').src = freezeButtonImage[3].src;
                document.getElementById('reloadButton').src = reloadButtonImage[2].src;
                document.getElementById('guiButtonImage').src = guiButtonImage[4].src;
                document.getElementById('resetButton').src = resetButtonImage[3].src;
                document.getElementById('unconstButton').src = unconstButtonImage[3].src;
                document.getElementById('pocketButton').src = pocketButtonImage[3].src;
            }

        }
        else {

            document.getElementById('resetButton').style.visibility = "hidden";
            document.getElementById('unconstButton').style.visibility = "hidden";
            document.getElementById('resetButtonDiv').style.display = "none";
            document.getElementById('unconstButtonDiv').style.display = "none";

            addElementInPreferences();

            preferencesVisible();

            overlayDiv.style.display = "inline";

            if (globalStates.UIOffMode) {
                document.getElementById('preferencesButton').src = preferencesButtonImage[0].src;
                document.getElementById('feezeButton').src = freezeButtonImage[0].src;
                document.getElementById('reloadButton').src = reloadButtonImage[0].src;
                document.getElementById('guiButtonImage').src = guiButtonImage[1].src;
                document.getElementById('resetButton').src = resetButtonImage[0].src;
                document.getElementById('unconstButton').src = unconstButtonImage[0].src;
                document.getElementById('pocketButton').src = pocketButtonImage[0].src;
            }

        }

    });
    ec++;

    /**
    * Freeze Button
     */

    document.getElementById("feezeButton").addEventListener("touchstart", function () {
        if (!globalStates.UIOffMode) document.getElementById('feezeButton').src = freezeButtonImage[1].src;
    });
    ec++;
    document.getElementById("feezeButton").addEventListener("touchend", function () {
        if (globalStates.feezeButtonState === true) {
            if (!globalStates.UIOffMode)    document.getElementById('feezeButton').src = freezeButtonImage[0].src;
            globalStates.feezeButtonState = false;
            window.location.href = "of://unfreeze";
        }
        else {
            if (!globalStates.UIOffMode)    document.getElementById('feezeButton').src = freezeButtonImage[2].src;
            globalStates.feezeButtonState = true;
            window.location.href = "of://freeze";
        }

    });


    /**
     * Pocket Button
     */
    var thisPocket =  document.getElementById("pocketButton");
 /*

    document.getElementById("pocketButton").addEventListener("touchstart", function () {
        if (!globalStates.UIOffMode) document.getElementById('pocketButton').src = pocketButtonImage[1].src;
    });
    ec++;
    document.getElementById("pocketButton").addEventListener("touchend", function () {
        if (globalStates.pocketButtonState === true) {
            if (!globalStates.UIOffMode)    document.getElementById('pocketButton').src = pocketButtonImage[0].src;
            globalStates.pocketButtonState = false;

        }
        else {
            if (!globalStates.UIOffMode)    document.getElementById('pocketButton').src = pocketButtonImage[2].src;
        }

    });

*/
    thisPocket.addEventListener("pointerdown", function () {console.log("pointerdown");
        globalStates.pocketButtonDown = true;

    }, false);

    thisPocket.addEventListener("pointerup", function () { console.log("pointerup");
       if(globalStates.pocketButtonDown){
           pocketButtonAction()
       }
        globalStates.pocketButtonDown = false;
        globalStates.pocketButtonUp = true;
    }, false);

    thisPocket.addEventListener("pointerenter", function () { console.log("pointerenter");


        if (!globalStates.UIOffMode) document.getElementById('pocketButton').src = pocketButtonImage[1].src;

        // this is where the virtual point disapears!


        if (pocketItem.pocket.logic[pocketItemId]) {
            pocketItem.pocket.objectVisible = false;


                hideTransformed("pocket", pocketItemId, pocketItem.pocket.logic[pocketItemId], "logic");
                delete pocketItem.pocket.logic[pocketItemId];
            }



    }, false);


    thisPocket.addEventListener("pointerleave", function (evt) { console.log("pointerleave");

        if (globalStates.pocketButtonState === true) {
            if (!globalStates.UIOffMode)    document.getElementById('pocketButton').src = pocketButtonImage[0].src;
        }
        else {
            if (!globalStates.UIOffMode)    document.getElementById('pocketButton').src = pocketButtonImage[2].src;
        }

        // this is where the virtual point creates object



        // todo for testing only
        if (globalStates.pocketButtonDown === true && globalStates.guiState ==="node") {

            pocketItemId = uuidTime();
            console.log(pocketItemId);
            pocketItem.pocket.logic[pocketItemId] = new Logic();

            var thisItem = pocketItem.pocket.logic[pocketItemId];

            thisItem.x = globalStates.pointerPosition[0] - (globalStates.height / 2);
            thisItem.y = globalStates.pointerPosition[1] - (globalStates.width / 2);

            // else {
            // var matrixTouch =  screenCoordinatesToMatrixXY(thisItem, [evt.clientX,evt.clientY]);
            // thisItem.x = matrixTouch[0];
            // thisItem.y = matrixTouch[1];
            //}
            thisItem.loaded = false;

            var thisObject = pocketItem.pocket;
            // this is a work around to set the state of an objects to not being visible.
            thisObject.objectId = "pocket";
            thisObject.name = "pocket";
            thisObject.objectVisible = false;
            thisObject.screenZ = 1000;
            thisObject.fullScreen = false;
            thisObject.sendMatrix = false;
            thisObject.loaded = false;
            thisObject.integerVersion = 170;
            thisObject.matrix = [];
            // thisObject.logic = {};
            thisObject.protocol = "R1";

           //
            //thisObject.visibleCounter = timeForContentLoaded;

            //addElement("pocket", pocketItemId, "nodes/" + thisItem.appearance + "/index.html",  pocketItem.pocket, "logic",globalStates);

        }
        setPocketPossition(evt);

        // globalStates.pocketButtonDown = false;
       // globalStates.pocketButtonUp = false;
    }, false);




    function pocketButtonAction() {

        if (globalStates.pocketButtonState === true) {
            console.log("buttonon");
            if (!globalStates.UIOffMode)    document.getElementById('pocketButton').src = pocketButtonImage[0].src;
            globalStates.pocketButtonState = false;
        }
        else {
            console.log("buttonoff");
            if (!globalStates.UIOffMode)    document.getElementById('pocketButton').src = pocketButtonImage[2].src;
            globalStates.pocketButtonState = true;
        }

    }




    ec++;
    document.getElementById("reloadButton").addEventListener("touchstart", function () {
        if (!globalStates.UIOffMode)    document.getElementById('reloadButton').src = reloadButtonImage[0].src;
        window.location.href = "of://reload";
    });
    ec++;
    document.getElementById("reloadButton").addEventListener("touchend", function () {
        // location.reload(true);

        window.open("index.html?v=" + Math.floor((Math.random() * 100) + 1));
    });
    ec++;
    cout("GUI");
}

/**
 * @desc
 **/

function preferencesHide() {
    if (!globalStates.UIOffMode)    document.getElementById('preferencesButton').src = preferencesButtonImage[0].src;
    globalStates.preferencesButtonState = false;
    document.getElementById("preferences").style.visibility = "hidden"; //= "hidden";
    document.getElementById("preferences").style.dispaly = "none"; //= "hidden";
    cout("preferencesHide");
}

/**
 * @desc
 **/

function craftingBoardVisible() {
    if (!globalStates.UIOffMode)    document.getElementById('preferencesButton').src = preferencesButtonImage[2].src;

    if (!globalStates.UIOffMode)    document.getElementById('guiButtonImage').src = guiButtonImage[5].src;

    document.getElementById("craftingBoard").style.visibility = "visible"; //
    document.getElementById("craftingBoard").style.display = "inline"; //= "hidden";
    cout("pcraftingBoardVisible");
}

/**
 * @desc
 **/

function craftingBoardHide() {
    if (!globalStates.UIOffMode)    document.getElementById('preferencesButton').src = preferencesButtonImage[0].src;
    document.getElementById("craftingBoard").style.visibility = "hidden"; //= "hidden";
    document.getElementById("craftingBoard").style.dispaly = "none"; //= "hidden";
    cout("craftingBoardHide");
}

/**********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * @desc
 * @param array
 **/

function preload(array) {
    for (var i = 0; i < preload.arguments.length - 1; i++) {
        array[i] = new Image();
        array[i].src = preload.arguments[i + 1];
    }

    cout("preload");
}




