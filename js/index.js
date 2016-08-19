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
 * TODO + Data is loaded from the Object
 * TODO + Generate and delete link
 * TODO + DRAw interface based on Object
 * TODO + Check the coordinates of targets. Incoperate the target size
 * TODO - Check if object is in the right range
 * TODO - add reset button on every target
 * TODO - Documentation before I leave
 * TODO - Arduino Library
 **

 /**********************************************************************************************************************
 ******************************************** Data IO *******************************************
 **********************************************************************************************************************/

// Functions to fill the data of the object

/**
 * @desc Adding new objects to the reality editor database via http ajax
 * @param {String|Array} beat an array in the form {id: "", ip: ""}
 **/

function addHeartbeatObject(beat) {
    /*
     if (globalStates.platform) {
     window.location.href = "of://gotbeat_" + beat.id;
     }
     */
    if (beat.id) {
        if (!objects[beat.id]) {
            getData('http://' + beat.ip + ':' + httpPort + '/object/' + beat.id, beat.id, function (req, thisKey) {
                if (req && thisKey) {
                    objects[thisKey] = req;
                    var thisObject = objects[thisKey];
                    // this is a work around to set the state of an objects to not being visible.
                    thisObject.objectVisible = false;
                    thisObject.screenZ = 1000;
                    thisObject.fullScreen = false;
                    thisObject.sendMatrix = false;
                    thisObject.integerVersion = parseInt(objects[thisKey].version.replace(/\./g, ""));

                    if (thisObject.matrix === null || typeof thisObject.matrix !== "object") {
                        thisObject.matrix = [];
                    }

                    for (var nodeKey in objects[thisKey].nodes) {
                        thisObject = objects[thisKey].nodes[nodeKey];
                        if (thisObject.matrix === null || typeof thisObject.matrix !== "object") {
                            thisObject.matrix = [];
                        }
                    }

                    if (!thisObject.protocol) {
                        thisObject.protocol = "R0";
                    }

                    if (thisObject.integerVersion < 170) {

                        rename(thisObject, "folder", "name");
                        rename(thisObject, "objectValues", "nodes");
                        rename(thisObject, "objectLinks", "links");
                        delete thisObject["matrix3dMemory"];

                        for (var linkKey in objects[thisKey].links) {
                            thisObject = objects[thisKey].links[linkKey];

                            rename(thisObject, "ObjectA", "objectA");
                            rename(thisObject, "locationInA", "nodeA");
                            rename(thisObject, "ObjectNameA", "nameA");

                            rename(thisObject, "ObjectB", "objectB");
                            rename(thisObject, "locationInB", "nodeB");
                            rename(thisObject, "ObjectNameB", "nameB");
                            rename(thisObject, "endlessLoop", "loop");
                            rename(thisObject, "countLinkExistance", "health");
                        }

                        for (var nodeKey in objects[thisKey].nodes) {
                            thisObject = objects[thisKey].nodes[nodeKey];
                            rename(thisObject, "plugin", "appearance");
                            thisObject.item = {
                                number: thisObject.value,
                                mode: thisObject.mode,
                                unit: "",
                                unitMin: 0,
                                unitMax: 1
                            };
                            delete thisObject.value;
                            delete thisObject.mode;

                        }

                    }
                    cout(JSON.stringify(objects[thisKey]));
                    addElementInPreferences();
                }
            });
        }
    }
}

/**
 * @desc
 * @param deviceName
 **/

function setDeviceName(deviceName) {
    globalStates.device = deviceName;
    console.log("The Reality Editor is loaded on a " + globalStates.device);
}

/**
 * @desc
 * @param developerState
 * @param extendedTrackingState
 * @param clearSkyState
 * @param externalState
 **/

function setStates(developerState, extendedTrackingState, clearSkyState, externalState) {

    globalStates.extendedTrackingState = extendedTrackingState;
    globalStates.developerState = developerState;
    globalStates.clearSkyState = clearSkyState;
    globalStates.externalState = externalState;

    if (clearSkyState) {
        // globalStates.UIOffMode = true;
        //  timeForContentLoaded = 240000;
        // document.getElementById("turnOffUISwitch").checked = true;
    }

    if (developerState) {
        addEventHandlers();
        globalStates.editingMode = true;
        document.getElementById("editingModeSwitch").checked = true;
    }

    if (extendedTrackingState) {
        globalStates.extendedTracking = true;
        document.getElementById("extendedTrackingSwitch").checked = true;
    }

    if (globalStates.externalState !== "") {
        document.getElementById("newURLText").value = globalStates.externalState;
    }

    if (globalStates.editingMode) {
        document.getElementById('resetButton').style.visibility = "visible";
        document.getElementById('unconstButton').style.visibility = "visible";
        document.getElementById('resetButtonDiv').style.display = "inline";
        document.getElementById('unconstButtonDiv').style.display = "inline";
    }

    // Once all the states are send the alternative checkbox is loaded
    // Its a bad hack to place it here, but it works

    if (typeof checkBoxElements === "undefined") {
        var checkBoxElements = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));

        checkBoxElements.forEach(function (html) {
            var switchery = new Switchery(html, {size: 'large', speed: '0.2s', color: '#1ee71e'});

        });
    }
}

/**
 * @desc
 * @param action
 **/

function action(action) {
    var thisAction = JSON.parse(action);

    if (thisAction.reloadLink) {
        getData('http://' + thisAction.reloadLink.ip + ':' + httpPort + '/object/' + thisAction.reloadLink.id, thisAction.reloadLink.id, function (req, thisKey) {

            if (objects[thisKey].integerVersion < 170) {
                objects[thisKey].links = req.links;
                for (var linkKey in objects[thisKey].links) {
                    thisObject = objects[thisKey].links[linkKey];

                    rename(thisObject, "objectA", "objectA");
                    rename(thisObject, "nodeA", "nodeA");
                    rename(thisObject, "nameA", "nameA");

                    rename(thisObject, "objectB", "objectB");
                    rename(thisObject, "nodeB", "nodeB");
                    rename(thisObject, "nameB", "nameB");
                    rename(thisObject, "endlessLoop", "loop");
                    rename(thisObject, "countLinkExistance", "health");
                }
            }
            else {
                objects[thisKey].links = req.links;
            }

            // cout(objects[thisKey]);
            cout("got links");
        });

    }

    if (thisAction.reloadObject) {
        getData('http://' + thisAction.reloadObject.ip + ':' + httpPort + '/object/' + thisAction.reloadObject.id, thisAction.reloadObject.id, function (req, thisKey) {
            objects[thisKey].x = req.x;
            objects[thisKey].y = req.y;
            objects[thisKey].scale = req.scale;

            if (objects[thisKey].integerVersion < 170) {
                objects[thisKey].nodes = req.objectValues;

                for (var nodeKey in objects[thisKey].nodes) {
                    thisObject = objects[thisKey].nodes[nodeKey];
                    rename(thisObject, "plugin", "appearance");
                    thisObject.item = {
                        number: thisObject.value,
                        mode: thisObject.mode,
                        unit: "",
                        unitMin: 0,
                        unitMax: 1
                    };
                    delete thisObject.value;
                    delete thisObject.mode;
                }
            }
            else {
                objects[thisKey].nodes = req.nodes;
            }

            // cout(objects[thisKey]);
            cout("got links");
        });
    }

    cout("found action: " + action);

}

/**********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * @desc
 * @param url
 * @param thisKey
 * @param callback
 * @return
 **/

function getData(url, thisKey, callback) {
    var req = new XMLHttpRequest();
    try {
        req.open('GET', url, true);
        // Just like regular ol' XHR
        req.onreadystatechange = function () {
            if (req.readyState === 4) {
                if (req.status >= 200 && req.status < 400) {
                    // JSON.parse(req.responseText) etc.
                    callback(JSON.parse(req.responseText), thisKey)
                } else {
                    // Handle error case
                    cout("could not load content");
                }
            }
        };
        req.send();

    }
    catch (e) {
        cout("could not connect to" + url);
    }
}

/**********************************************************************************************************************
 **********************************************************************************************************************/
// set projection matrix

/**
 * @desc
 * @param matrix
 **/

function setProjectionMatrix(matrix) {
    // globalStates.projectionMatrix = matrix;

    //  generate all transformations for the object that needs to be done ASAP
    var scaleZ = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 2, 0,
        0, 0, 0, 1
    ];

    var corX = 0;
    var corY = 0;

    // iPhone 5(GSM), iPhone 5 (GSM+CDMA)
    if (globalStates.device === "iPhone5,1" || globalStates.device === "iPhone5,2") {
        corX = 0;
        corY = -3;
    }

    // iPhone 5c (GSM), iPhone 5c (GSM+CDMA)
    if (globalStates.device === "iPhone5,3" || globalStates.device === "iPhone5,4") {
        // not yet tested todo add values
        corX = 0;
        corY = 0;
    }

    // iPhone 5s (GSM), iPhone 5s (GSM+CDMA)
    if (globalStates.device === "iPhone6,1" || globalStates.device === "iPhone6,2") {
        corX = -3;
        corY = -1;

    }

    // iPhone 6 plus
    if (globalStates.device === "iPhone7,1") {
        // not yet tested todo add values
        corX = 0;
        corY = 0;
    }

    // iPhone 6
    if (globalStates.device === "iPhone7,2") {
        corX = -4.5;
        corY = -6;
    }

    // iPhone 6s
    if (globalStates.device === "iPhone8,1") {
        // not yet tested todo add values
        corX = 0;
        corY = 0;
    }

    // iPhone 6s Plus
    if (globalStates.device === "iPhone8,2") {
        corX = -0.3;
        corY = -1.5;
    }

    // iPad
    if (globalStates.device === "iPad1,1") {
        // not yet tested todo add values
        corX = 0;
        corY = 0;
    }

    // iPad 2 (WiFi), iPad 2 (GSM), iPad 2 (CDMA), iPad 2 (WiFi)
    if (globalStates.device === "iPad2,1" || globalStates.device === "iPad2,2" || globalStates.device === "iPad2,3" || globalStates.device === "iPad2,4") {
        corX = -31;
        corY = -5;
    }

    // iPad Mini (WiFi), iPad Mini (GSM), iPad Mini (GSM+CDMA)
    if (globalStates.device === "iPad2,5" || globalStates.device === "iPad2,6" || globalStates.device === "iPad2,7") {
        // not yet tested todo add values
        corX = 0;
        corY = 0;
    }

    // iPad 3 (WiFi), iPad 3 (GSM+CDMA), iPad 3 (GSM)
    if (globalStates.device === "iPad3,1" || globalStates.device === "iPad3,2" || globalStates.device === "iPad3,3") {
        corX = -3;
        corY = -1;
    }
    //iPad 4 (WiFi), iPad 4 (GSM), iPad 4 (GSM+CDMA)
    if (globalStates.device === "iPad3,4" || globalStates.device === "iPad3,5" || globalStates.device === "iPad3,6") {
        corX = -5;
        corY = 17;
    }

    // iPad Air (WiFi), iPad Air (Cellular)
    if (globalStates.device === "iPad4,1" || globalStates.device === "iPad4,2") {
        // not yet tested todo add values
        corX = 0;
        corY = 0;
    }

    // iPad mini 2G (WiFi) iPad mini 2G (Cellular)
    if (globalStates.device === "iPad4,4" || globalStates.device === "iPad4,5") {
        corX = -11;
        corY = 6.5;
    }

    var viewportScaling = [
        globalStates.height, 0, 0, 0,
        0, -globalStates.width, 0, 0,
        0, 0, 1, 0,
        corX, corY, 0, 1
    ];

    globalStates.realProjectionMatrix = matrix;

    globalStates.projectionMatrix = multiplyMatrix(multiplyMatrix(scaleZ, matrix), viewportScaling);
    window.location.href = "of://gotProjectionMatrix";

}

/**********************************************************************************************************************
 ******************************************** update and draw the 3D Interface ****************************************
 **********************************************************************************************************************/

/**
 * @desc Is called, when there is no new video frame with new transformation data
 **/

function updateReDraw() {
    timeCorrection(timeCorrection);
    disp = uiButtons.style.display;
    uiButtons.style.display = 'none';
    uiButtons.style.display = disp;
}

/**
 * @desc main update loop called 30 fps with an array of found transformation matrices
 * @param visibleObjects
 **/

function update(visibleObjects) {
//    console.log(JSON.stringify(visibleObjects));
    timeSynchronizer(timeCorrection);
    //disp = uiButtons.style.display;
    //uiButtons.style.display = 'none';

    if (globalStates.feezeButtonState == false) {
        globalObjects = visibleObjects;
    }
    /* if (consoleText !== "") {
     consoleText = "";
     document.getElementById("consolelog").innerHTML = "";
     }
     conalt = "";*/

    if (globalCanvas.hasContent === true) {
        globalCanvas.context.clearRect(0, 0, globalCanvas.canvas.width, globalCanvas.canvas.height);
        globalCanvas.hasContent = false;
    }

    for (var objectKey in objects) {
        if (!objects.hasOwnProperty(objectKey)) {
            continue;
        }
        var generalObject = objects[objectKey];

        // I changed this to has property.
        if (globalObjects.hasOwnProperty(objectKey)) {

            generalObject.visibleCounter = timeForContentLoaded;
            generalObject.objectVisible = true;

            var tempMatrix = multiplyMatrix(rotateX, multiplyMatrix(globalObjects[objectKey], globalStates.projectionMatrix));

            //  var tempMatrix2 = multiplyMatrix(globalObjects[objectKey], globalStates.projectionMatrix);

            //   document.getElementById("controls").innerHTML = (toAxisAngle(tempMatrix2)[0]).toFixed(1)+" "+(toAxisAngle(tempMatrix2)[1]).toFixed(1);

            if (globalStates.guiButtonState || Object.keys(generalObject.nodes).length === 0) {
                drawTransformed(objectKey, objectKey, generalObject, tempMatrix);
                addElement(objectKey, objectKey, "http://" + generalObject.ip + ":" + httpPort + "/obj/" + generalObject.name + "/", generalObject);
            }
            else {
                hideTransformed(objectKey, objectKey, generalObject);
            }

            // do this for staying compatible with older versions but use new routing after some time.
            // dataPointInterfaces are clearly their own thing and should not be part of obj
            // once added, they will be associated with the object via the editor postMessages anyway.

            var destinationString;
            if (generalObject.integerVersion >= 170) {
                destinationString = "/nodes/";
            } else {
                if (generalObject.integerVersion > 40) {
                    destinationString = "/dataPointInterfaces/";
                } else {
                    destinationString = "/obj/dataPointInterfaces/";
                }
            }

            for (var nodeKey in generalObject.nodes) {
                // if (!generalObject.nodes.hasOwnProperty(nodeKey)) { continue; }

                var generalNode = generalObject.nodes[nodeKey];

                if (!globalStates.guiButtonState) {
                    drawTransformed(objectKey, nodeKey, generalNode, tempMatrix);

                    addElement(objectKey, nodeKey, "http://" + generalObject.ip + ":" + httpPort + destinationString + generalNode.appearance + "/", generalNode);

                } else {
                    hideTransformed(objectKey, nodeKey, generalNode);
                }
            }
        }

        else {
            generalObject.objectVisible = false;

            hideTransformed(objectKey, objectKey, generalObject);

            for (var nodeKey in generalObject.nodes) {
                // if (!generalObject.nodes.hasOwnProperty(nodeKey)) {  continue;  }
                hideTransformed(objectKey, nodeKey, generalObject.nodes[nodeKey]);
            }

            killObjects(objectKey, generalObject);
        }

        if (globalStates.logButtonState) {
            consoleText += JSON.stringify(generalObject.links);
            consoleText += objectLog(objectKey);
        }

    }

    // draw all lines
    if (!globalStates.guiButtonState && !globalStates.editingMode) {
        for (var objectKey in objects) {
            drawAllLines(objects[objectKey], globalCanvas.context);

        }
        drawInteractionLines();
        //  cout("drawlines");
    }

    if (globalStates.logButtonState) {
        generalLog(consoleText);
    }
}

/**********************************************************************************************************************
 ******************************************** 3D Transforms & Utilities ***********************************************
 **********************************************************************************************************************/

/**
 * @desc
 * @param objectKey
 * @param nodeKey
 * @param thisObject
 * @param thisTransform2
 * @return
 **/

function drawTransformed(objectKey, nodeKey, thisObject, thisTransform2) {

    if (globalStates.notLoading !== nodeKey && thisObject.loaded === true) {
        if (!thisObject.visible) {
            thisObject.visible = true;

            document.getElementById("thisObject" + nodeKey).style.display = 'inline';

            var thisIframe = document.getElementById("iframe" + nodeKey);
            thisIframe.style.visibility = 'visible';
            thisIframe.contentWindow.postMessage(
                JSON.stringify(
                    {
                        visibility: "visible"
                    }), '*');

            if (objectKey !== nodeKey) {
                document.getElementById(nodeKey).style.visibility = 'visible';
                // document.getElementById("text" + nodeKey).style.visibility = 'visible';
                if (globalStates.editingMode) {
                    document.getElementById("canvas" + nodeKey).style.display = 'inline';
                } else {
                    document.getElementById("canvas" + nodeKey).style.display = 'none';
                }
            }

            if (objectKey === nodeKey) {
                if (globalStates.editingMode) {
                    if (!thisObject.visibleEditing && thisObject.developer) {
                        thisObject.visibleEditing = true;
                        document.getElementById(nodeKey).style.visibility = 'visible';
                        // showEditingStripes(nodeKey, true);
                        document.getElementById("canvas" + nodeKey).style.display = 'inline';

                        //document.getElementById(nodeKey).className = "mainProgram";
                    }
                } else {
                    document.getElementById("canvas" + nodeKey).style.display = 'none';
                }
            }

        }

        // this needs a better solution
        if (thisObject.fullScreen !== true) {

            var finalMatrixTransform2 = [
                thisObject.scale, 0, 0, 0,
                0, thisObject.scale, 0, 0,
                0, 0, 1, 0,
                thisObject.x, thisObject.y, 0, 1
            ];

            var thisTransform = [];

            if (globalStates.editingMode) {
                if (globalMatrix.matrixtouchOn === nodeKey) {
                    //if(globalStates.unconstrainedPositioning===true)
                    thisObject.temp = copyMatrix(thisTransform2);

                    if (globalMatrix.copyStillFromMatrixSwitch) {
                        globalMatrix.visual = copyMatrix(thisTransform2);
                        if (typeof thisObject.matrix === "object")
                            if (thisObject.matrix.length > 0)
                                thisObject.begin = copyMatrix(multiplyMatrix(thisObject.matrix, thisObject.temp));
                            else
                                thisObject.begin = copyMatrix(thisObject.temp);
                        else
                            thisObject.begin = copyMatrix(thisObject.temp);

                        if (globalStates.unconstrainedPositioning === true)
                            thisObject.matrix = copyMatrix(multiplyMatrix(thisObject.begin, invertMatrix(thisObject.temp)));

                        globalMatrix.copyStillFromMatrixSwitch = false;
                    }

                    if (globalStates.unconstrainedPositioning === true)
                        thisTransform2 = globalMatrix.visual;

                }

                if (typeof thisObject.matrix === "object") {
                    if (thisObject.matrix.length > 0) {
                        if (globalStates.unconstrainedPositioning === false) {
                            thisObject.begin = copyMatrix(multiplyMatrix(thisObject.matrix, thisObject.temp));
                        }
                        estimateIntersection(nodeKey, multiplyMatrix(finalMatrixTransform2, multiplyMatrix(thisObject.begin, invertMatrix(thisObject.temp))));
                    } else {
                        estimateIntersection(nodeKey, [
                            1, 0, 0, 0,
                            0, 1, 0, 0,
                            0, 0, 1, 0,
                            0, 0, 0, 1
                        ]);
                    }

                } else {
                    estimateIntersection(nodeKey, [
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        0, 0, 0, 1
                    ]);
                }
            }

            if (typeof thisObject.matrix === "object") {
                if (thisObject.matrix.length > 0) {
                    thisTransform = multiplyMatrix(finalMatrixTransform2, multiplyMatrix(thisObject.matrix, thisTransform2));
                } else {
                    thisTransform = multiplyMatrix(finalMatrixTransform2, thisTransform2);
                }
            }
            else {
                thisTransform = multiplyMatrix(finalMatrixTransform2, thisTransform2);
            }
            document.getElementById("thisObject" + nodeKey).style.webkitTransform = 'matrix3d(' +
                thisTransform[0] + ',' + thisTransform[1] + ',' + thisTransform[2] + ',' + thisTransform[3] + ',' +
                thisTransform[4] + ',' + thisTransform[5] + ',' + thisTransform[6] + ',' + thisTransform[7] + ',' +
                thisTransform[8] + ',' + thisTransform[9] + ',' + thisTransform[10] + ',' + thisTransform[11] + ',' +
                thisTransform[12] + ',' + thisTransform[13] + ',' + thisTransform[14] + ',' + thisTransform[15] + ')';

            // this is for later
            // The matrix has been changed from Vuforia 3 to 4 and 5. Instead of  thisTransform[3][2] it is now thisTransform[3][3]
            thisObject.screenX = thisTransform[12] / thisTransform[15] + (globalStates.height / 2);
            thisObject.screenY = thisTransform[13] / thisTransform[15] + (globalStates.width / 2);
            thisObject.screenZ = thisTransform[14];

        }

        if (thisObject.sendMatrix === true) {
            if (objectKey === nodeKey) {
                cout(globalObjects[objectKey]);
                document.getElementById("iframe" + nodeKey).contentWindow.postMessage(
                    JSON.stringify({modelViewMatrix: globalObjects[objectKey]}), '*');
            }
        }
    }

}

/**********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * @desc
 * @param objectKey
 * @param nodeKey
 * @param thisObject
 * @return
 **/

function hideTransformed(objectKey, nodeKey, thisObject) {
    if (thisObject.visible === true) {
        document.getElementById("thisObject" + nodeKey).style.display = 'none';

        var thisIframe = document.getElementById("iframe" + nodeKey);
        thisIframe.style.visibility = 'hidden';
        thisIframe.contentWindow.postMessage(
            JSON.stringify(
                {
                    visibility: "hidden"
                }), '*');

        thisObject.visible = false;
        thisObject.visibleEditing = false;
        document.getElementById(nodeKey).style.visibility = 'hidden';
        document.getElementById("canvas" + nodeKey).style.display = 'none';

        cout("hideTransformed");
    }
}

/**********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * @desc
 **/

function addElementInPreferences() {
    cout("addedObject");

    var htmlContent = "";

    htmlContent += "<div class='Interfaces'" +
        " style='position: relative;  float: left; height: 20px; width: 34%;  text-align: center;  line-height: 20px; vertical-align: middle;display: table-cell; font-family: Helvetica Neue, Helvetica, Arial;background-color: #a0a0a0; -webkit-transform-style: preserve-3d;'>" +
        "Name</div>";
    htmlContent += "<div class='Interfaces'" +
        " style='position: relative;  float: left; height: 20px; width: 30%;  text-align: center;  line-height: 20px; vertical-align: middle;display: table-cell;  font-family: Helvetica Neue, Helvetica, Arial;background-color: #a0a0a0; -webkit-transform-style: preserve-3d;'>" +
        "IP</div>";

    htmlContent += "<div class='Interfaces'" +
        " style='position: relative;  float: left; height: 20px; width: 14%;  text-align: center;  line-height: 20px; vertical-align: middle;display: table-cell;  font-family: Helvetica Neue, Helvetica, Arial;background-color: #a0a0a0; -webkit-transform-style: preserve-3d; '>" +
        "Version</div>";

    htmlContent += "<div class='Interfaces'" +
        " style='position: relative;  float: left; height: 20px; width: 11%;  text-align: center;  line-height: 20px; vertical-align: middle;display: table-cell;  font-family: Helvetica Neue, Helvetica, Arial; background-color: #a0a0a0;-webkit-transform-style: preserve-3d;'>" +
        "Nodes</div>";

    htmlContent += "<div class='Interfaces'" +
        " style='position: relative;  float: left; height: 20px; width: 11%;  text-align: center;  line-height: 20px; vertical-align: middle;display: table-cell;  font-family: Helvetica Neue, Helvetica, Arial; background-color: #a0a0a0;-webkit-transform-style: preserve-3d;'>" +
        "Links</div>";

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

        htmlContent += "<div class='Interfaces' id='" +
            "name" + keyPref +
            "' style='position: relative;  float: left; height: 20px; width: 35%; text-align: center;  line-height: 20px; vertical-align: middle;display: table-cell; font-family: Helvetica Neue, Helvetica, Arial;" + bgcolor + " -webkit-transform-style: preserve-3d; " +
            "'>";

        htmlContent += objects[keyPref].name;

        htmlContent += "</div><div class='Interfaces' id='" +
            "name" + keyPref +
            "' style='position: relative;  float: left; height: 20px; width: 30%;  text-align: center;  line-height: 20px; vertical-align: middle;display: table-cell;  font-family: Helvetica Neue, Helvetica, Arial;" + bgcolor + " -webkit-transform-style: preserve-3d; " +
            "'>" +
            objects[keyPref].ip
            + "</div>";

        htmlContent += "<div class='Interfaces' id='" +
            "version" + keyPref +
            "' style='position: relative;  float: left; height: 20px; width: 16%;  text-align: center;  line-height: 20px; vertical-align: middle;display: table-cell; font-family: Helvetica Neue, Helvetica, Arial; " + bgcolor + "-webkit-transform-style: preserve-3d;" +
            "'>" +
            objects[keyPref].version
            + "</div>";

        var anzahl = 0;

        for (var subkeyPref2 in objects[keyPref].nodes) {
            anzahl++;
        }

        htmlContent += "<div class='Interfaces' id='" +
            "io" + keyPref +
            "' style='position: relative;  float: left; height: 20px; width: 7%;   text-align: center;  line-height: 20px; vertical-align: middle;display: table-cell;  font-family: Helvetica Neue, Helvetica, Arial;" + bgcolor + "-webkit-transform-style: preserve-3d;" +
            "'>" +
            anzahl
            + "</div>";

        anzahl = 0;

        for (var subkeyPref in objects[keyPref].links) {
            anzahl++;
        }

        htmlContent += "<div class='Interfaces' id='" +
            "links" + keyPref +
            "' style='position: relative;  float: left; height: 20px; width: 12%;  text-align: center;  line-height: 20px; vertical-align: middle;display: table-cell;  font-family: Helvetica Neue, Helvetica, Arial;" + bgcolor + "-webkit-transform-style: preserve-3d;" +
            "'>" +
            anzahl
            + "</div>";

    }

    document.getElementById("content2").innerHTML = htmlContent;

    cout("addElementInPreferences");
}

/**
 * @desc
 * @param objectKey
 * @param nodeKey
 * @param thisUrl
 * @param thisObject
 * @return
 **/

function addElement(objectKey, nodeKey, thisUrl, thisObject) {
    if (globalStates.notLoading !== true && globalStates.notLoading !== nodeKey && thisObject.loaded !== true) {

        thisObject.loaded = true;
        thisObject.visibleEditing = false;
        globalStates.notLoading = nodeKey;

        if (typeof thisObject.begin !== "object") {
            thisObject.begin = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ];

        }

        if (typeof thisObject.temp !== "object") {
            thisObject.temp = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ];

        }

        var addDoc = document.createElement('div');
        addDoc.id = "thisObject" + nodeKey;
        addDoc.style.width = globalStates.height + "px";
        addDoc.style.height = globalStates.width + "px";
        addDoc.style.display = "none";
        addDoc.style.border = 0;
        addDoc.className = "main";
        document.getElementById("GUI").appendChild(addDoc);

        var tempAddContent =
            "<iframe id='iframe" + nodeKey + "' onload='on_load(\"" +
            objectKey + "\",\"" + nodeKey + "\")' frameBorder='0' " +
            "style='width:0px; height:0px;" +
            "top:" + ((globalStates.width - thisObject.frameSizeX) / 2) + "px; left:" +
            ((globalStates.height - thisObject.frameSizeY) / 2) + "px; visibility: hidden;' " +
            "src='" + thisUrl + "' class='main' sandbox='allow-forms allow-pointer-lock allow-same-origin allow-scripts'>" +
            "</iframe>";

        tempAddContent += "<div id='" + nodeKey + "' frameBorder='0' style='width:" + thisObject.frameSizeX + "px; height:" + thisObject.frameSizeY + "px;" +
            "top:" + ((globalStates.width - thisObject.frameSizeX) / 2) + "px; left:" + ((globalStates.height - thisObject.frameSizeY) / 2) + "px; visibility: hidden;' class='mainEditing'>" +
            "<canvas id='canvas" + nodeKey + "'style='width:100%; height:100%;' class='mainCanvas'></canvas>" +
            "</div>" +
            "";

        document.getElementById("thisObject" + nodeKey).innerHTML = tempAddContent;
        var theObject = document.getElementById(nodeKey);
        theObject.style["touch-action"] = "none";
        theObject["handjs_forcePreventDefault"] = true;
        theObject.addEventListener("pointerdown", touchDown, false);
        ec++;
        theObject.addEventListener("pointerup", trueTouchUp, false);
        ec++;
        theObject.addEventListener("pointerenter", function (e) {
            var contentForFeedback;

            if (globalProgram.nodeA === this.id || globalProgram.nodeA === false) {
                contentForFeedback = 3;
            } else {

                if (checkForNetworkLoop(globalProgram.objectA, globalProgram.nodeA, this.objectId, this.nodeId))
                    contentForFeedback = 2; // overlayImg.src = overlayImage[2].src;
                else
                    contentForFeedback = 0; // overlayImg.src = overlayImage[0].src;
            }

            document.getElementById("iframe" + this.nodeId).contentWindow.postMessage(
                JSON.stringify(
                    {
                        uiActionFeedback: contentForFeedback
                    })
                , "*");

            document.getElementById('overlayImg').src = overlayImage[contentForFeedback].src;

        }, false);
        ec++;

        theObject.addEventListener("pointerleave", function () {

            document.getElementById('overlayImg').src = overlayImage[1].src;

            cout("leave");

            document.getElementById("iframe" + this.nodeId).contentWindow.postMessage(
                JSON.stringify(
                    {
                        uiActionFeedback: 1
                    })
                , "*");

        }, false);
        ec++;

        if (globalStates.editingMode) {
            if (objects[objectKey].developer) {
                theObject.addEventListener("touchstart", MultiTouchStart, false);
                ec++;
                theObject.addEventListener("touchmove", MultiTouchMove, false);
                ec++;
                theObject.addEventListener("touchend", MultiTouchEnd, false);
                ec++;
                theObject.className = "mainProgram";
            }
        }
        theObject.objectId = objectKey;
        theObject.nodeId = nodeKey;

        if (nodeKey !== objectKey) {
            theObject.style.visibility = "visible";
            // theObject.style.display = "initial";
        }
        else {
            theObject.style.visibility = "hidden";
            //theObject.style.display = "none";
        }
        cout("addElementInPreferences");
    }
}

/**********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * @desc
 * @param objectKey
 * @param thisObject
 * @return
 **/

function killObjects(objectKey, thisObject) {

    if (thisObject.visibleCounter > 0) {
        thisObject.visibleCounter--;
    } else if (thisObject.loaded) {
        thisObject.loaded = false;

        var tempElementDiv = document.getElementById("thisObject" + objectKey);
        tempElementDiv.parentNode.removeChild(tempElementDiv);

        for (var nodeKey in thisObject.nodes) {
            try {
                tempElementDiv = document.getElementById("thisObject" + nodeKey);
                tempElementDiv.parentNode.removeChild(tempElementDiv);
            } catch (err) {
                cout("could not find any");
            }
            thisObject.nodes[nodeKey].loaded = false;
        }
        cout("killObjects");
    }
}

/**********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * @desc
 * @param objectKey
 * @param nodeKey
 * @return
 **/

function on_load(objectKey, nodeKey) {

    globalStates.notLoading = false;
    // window.location.href = "of://event_test_"+nodeKey;

    // cout("posting Msg");
    var oldStyle = {
        obj: objectKey,
        pos: nodeKey,
        objectValues: objects[objectKey].nodes
    };

    var newStyle = {
        object: objectKey,
        node: nodeKey,
        nodes: objects[objectKey].nodes
    };

    if (objects[objectKey].integerVersion < 170) {
        newStyle = oldStyle;
    }

    document.getElementById("iframe" + nodeKey).contentWindow.postMessage(
        JSON.stringify(newStyle), '*');
    cout("on_load");
}