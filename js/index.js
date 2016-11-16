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
                    thisObject.sendAcceleration = false;
                    thisObject.integerVersion = parseInt(objects[thisKey].version.replace(/\./g, ""));

                    if (thisObject.matrix === null || typeof thisObject.matrix !== "object") {
                        thisObject.matrix = [];
                    }

                    for (var nodeKey in objects[thisKey].nodes) {
                        thisObject = objects[thisKey].nodes[nodeKey];
                        if (thisObject.matrix === null || typeof thisObject.matrix !== "object") {
                            thisObject.matrix = [];
                        }
                        thisObject.loaded = false;
                        thisObject.visible = false;

                        if(thisObject.type === "logic") {
                            thisObject.guiState = new LogicGUIState();
                            var container = document.getElementById('craftingBoard');
                            thisObject.grid = new Grid(container.clientWidth, container.clientHeight);
                            convertLinksFromServer(thisObject);
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
                            rename(thisObject, "plugin", "type");
                            rename(thisObject, "appearance", "type");
                            thisObject.data = {
                                value: thisObject.value,
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

                    addObjectMemory(objects[thisKey]);

                    addElementInPreferences();
                }
            });
        }
    }
}

// convert links from in/out -> block not in edge row into 2 links, one from in/out->edge and another from edge->block
// this puts the data in a format that is convenient for the UI while keeping the server data efficient
function convertLinksFromServer(logic) {

    globalStates.currentLogic = logic;

    for (var linkKey in logic.links) {
        var link = logic.links[linkKey];

        if (isInOutBlock(link.nodeA) && logic.blocks[link.nodeB].y !== 0) {
            // create separate links from in->edge and edge->block
            var x = link.nodeA.slice(-1);
            addBlockLink(link.nodeA, edgePlaceholderName(true, x), link.logicA, link.logicB, true);
            addBlockLink(edgePlaceholderName(true, x), link.nodeB, link.logicA, link.logicB, true);

            delete logic.links[linkKey];

        } else if (isInOutBlock(link.nodeB) && logic.blocks[link.nodeA].y !== 3) {

            // create separate links from block->edge and edge->out
            var x = link.nodeB.slice(-1);
            addBlockLink(link.nodeA, edgePlaceholderName(false, x), link.logicA, link.logicB, true);
            addBlockLink(edgePlaceholderName(false, x), link.nodeB, link.logicA, link.logicB, true);

            delete logic.links[linkKey];
        }
    }

    globalStates.currentLogic = null;
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

function action(thisAction) {

    if (thisAction.reloadLink) {
        getData('http://' + thisAction.reloadLink.ip + ':' + httpPort + '/object/' + thisAction.reloadLink.id, thisAction.reloadLink.id, function (req, thisKey) {

            if (objects[thisKey].integerVersion < 170) {
                objects[thisKey].links = req.links;
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
                rename(objects[thisKey], "objectValues", "nodes");

                for (var nodeKey in objects[thisKey].nodes) {
                    thisObject = objects[thisKey].nodes[nodeKey];
                    rename(thisObject, "plugin", "type");
                    rename(thisObject, "appearance", "type");
                    thisObject.data = {
                        value: thisObject.value,
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

    if (thisAction.loadMemory) {
        var id = thisAction.loadMemory.id;
        var url = 'http://' + thisAction.loadMemory.ip + ':' + httpPort + '/object/' + id;

        getData(url, id, function (req, thisKey) {
            cout('received memory', req.memory);
            objects[thisKey].memory = req.memory;
            addObjectMemory(objects[thisKey]);
        });
    }
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
                if (req.status === 200) {
                    // JSON.parse(req.responseText) etc.
                    if(req.responseText)
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

    var r = [];
    globalStates.realProjectionMatrix = matrix;

    multiplyMatrix(scaleZ, matrix, r);
    multiplyMatrix(r, viewportScaling, globalStates.projectionMatrix);
    window.location.href = "of://gotProjectionMatrix";

}

/**********************************************************************************************************************
 ******************************************** update and draw the 3D Interface ****************************************
 **********************************************************************************************************************/

/**
 * @desc main update loop called 30 fps with an array of found transformation matrices
 * @param visibleObjects
 **/


function update(visibleObjects) {

//    console.log(JSON.stringify(visibleObjects));
    timeSynchronizer(timeCorrection);
    //disp = uiButtons.style.display;
    //uiButtons.style.display = 'none';


    if (globalStates.guiState === "logic") {
        window.requestAnimationFrame(redrawDatacrafting);
    }


    globalObjects = visibleObjects;

    var thisGlobalCanvas = globalCanvas;
    if (thisGlobalCanvas.hasContent === true) {
        thisGlobalCanvas.context.clearRect(0, 0, globalCanvas.canvas.width, globalCanvas.canvas.height);
        thisGlobalCanvas.hasContent = false;
    }

    var destinationString;

    var thisGlobalStates = globalStates;

    var thisGlobalLogic = globalLogic;
    var thisGlobalDOMCach = globalDOMCach;
    var thisGlobalMatrix = globalMatrix;

    for (var objectKey in objects) {
        if (!objects.hasOwnProperty(objectKey)) {
            continue;
        }

        var generalObject = objects[objectKey];

        //if(  globalStates.pointerPosition[0]>0)
        //console.log(generalObject);
        // I changed this to has property.
        if (globalObjects.hasOwnProperty(objectKey)) {

            generalObject.visibleCounter = timeForContentLoaded;
            generalObject.objectVisible = true;

            // tempMatrix = multiplyMatrix(rotateX, multiplyMatrix(globalObjects[objectKey], globalStates.projectionMatrix));

            var tempMatrix = [];
            var r = globalMatrix.r;
            multiplyMatrix(globalObjects[objectKey], globalStates.projectionMatrix, r);
            multiplyMatrix(rotateX, r, tempMatrix);

            //  var tempMatrix2 = multiplyMatrix(globalObjects[objectKey], globalStates.projectionMatrix);

            //   document.getElementById("controls").innerHTML = (toAxisAngle(tempMatrix2)[0]).toFixed(1)+" "+(toAxisAngle(tempMatrix2)[1]).toFixed(1);

            if (globalStates.guiState ==="ui" || Object.keys(generalObject.nodes).length === 0) {
                drawTransformed(objectKey, objectKey, generalObject, tempMatrix, "ui", thisGlobalStates, thisGlobalCanvas, thisGlobalLogic, thisGlobalDOMCach, thisGlobalMatrix);
                addElement(objectKey, objectKey, "http://" + generalObject.ip + ":" + httpPort + "/obj/" + generalObject.name + "/", generalObject, "ui", thisGlobalStates);
            }
            else {
                hideTransformed(objectKey, objectKey, generalObject, "ui");
            }

            // do this for staying compatible with older versions but use new routing after some time.
            // dataPointInterfaces are clearly their own thing and should not be part of obj
            // once added, they will be associated with the object via the editor postMessages anyway.
            if (generalObject.integerVersion >= 170) {
                destinationString = "/nodes/";
            } else {
                if (generalObject.integerVersion > 40) {
                    destinationString = "/dataPointInterfaces/";
                } else {
                    destinationString = "/obj/dataPointInterfaces/";
                }
            }

            var generalNode;
            for (nodeKey in generalObject.nodes) {
                // if (!generalObject.nodes.hasOwnProperty(nodeKey)) { continue; }

                generalNode = generalObject.nodes[nodeKey];

                if (globalStates.guiState ==="node") {
                    drawTransformed(objectKey, nodeKey, generalNode, tempMatrix, generalNode.type, thisGlobalStates, thisGlobalCanvas, thisGlobalLogic, thisGlobalDOMCach, thisGlobalMatrix);


                    addElement(objectKey, nodeKey, "nodes/" + generalNode.type + "/index.html", generalNode, generalNode.type, thisGlobalStates);

                } else {
                    hideTransformed(objectKey, nodeKey, generalNode, generalNode.type);
                }
            }
        }

        else {
            generalObject.objectVisible = false;

            hideTransformed(objectKey, objectKey, generalObject, "ui");

            for (var nodeKey in generalObject.nodes) {
                // if (!generalObject.nodes.hasOwnProperty(nodeKey)) {  continue;  }
                hideTransformed(objectKey, nodeKey, generalObject.nodes[nodeKey], generalObject.nodes[nodeKey].type);
            }

            killObjects(objectKey, generalObject);
        }

    }

    // draw all lines
    if (globalStates.guiState ==="node" && !globalStates.editingMode) {
        for (var objectKey in objects) {
            drawAllLines(objects[objectKey], thisGlobalCanvas.context);

        }
        drawInteractionLines();
        //  cout("drawlines");
    }

    // todo this is a test for the pocket

    // todo finishing up this

    if(pocketItem.pocket.nodes[pocketItemId]) {
        var generalObject = pocketItem["pocket"];
        // if(  globalStates.pointerPosition[0]>0)
        //console.log(generalObject);
        generalObject.visibleCounter = timeForContentLoaded;
        generalObject.objectVisible = true;

        var generalNode;
        objectKey = "pocket";

        var thisMatrix = [];

        globalLogic.farFrontElement = "";
        globalLogic.frontDepth = 10000000000;

        for (var thisOtherKey in globalObjects) {
            if (globalObjects[thisOtherKey][14] < globalLogic.frontDepth) {
                globalLogic.frontDepth = globalObjects[thisOtherKey][14];
                globalLogic.farFrontElement = thisOtherKey;
            }
        }

        if (globalLogic.farFrontElement in globalObjects) {
            // console.log(globalLogic.farFrontElement);

            var r = globalMatrix.r;
            multiplyMatrix(globalObjects[globalLogic.farFrontElement], globalStates.projectionMatrix, r);
            multiplyMatrix(rotateX, r, thisMatrix);

        } else {

            thisMatrix = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ]
        }

        for (var nodeKey in generalObject.nodes) {
            //console.log(document.getElementById("iframe"+ nodeKey));
            generalNode = generalObject.nodes[nodeKey];

            if (globalStates.guiState === "node" && generalNode.type === "logic") {
                drawTransformed(objectKey, nodeKey, generalNode,
                    thisMatrix, generalNode.type, globalStates, globalCanvas, globalLogic, globalDOMCach, globalMatrix);

                addElement(objectKey, nodeKey, "nodes/" + generalNode.type + "/index.html", generalNode, generalNode.type, globalStates);

                /* } else {
                 hideTransformed("pocket", nodeKey, generalNode, "logic");
                 }*/
            }
        }
    }
    /// todo Test

    if(globalStates.acceleration.motion!= 0){
        globalStates.acceleration = {
            x : 0,
            y : 0,
            z : 0,
            alpha: 0,
            beta: 0,
            gamma: 0,
            motion:0
        }
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

var finalMatrixTransform2;
var thisTransform = [];
var thisKey;
var thisSubKey;

function drawTransformed(objectKey, nodeKey, thisObject, thisTransform2, type, globalStates, globalCanvas, globalLogic, globalDOMCach, globalMatrix) {


    var objectKey = objectKey;
    var nodeKey = nodeKey;
    var thisObject = thisObject;
    var thisTransform2 = thisTransform2;
    var type = type;
    var globalCanvas = globalCanvas;
    var globalStates = globalStates;
    var globalLogic = globalLogic;
    var globalDOMCach = globalDOMCach;
    var globalMatrix = globalMatrix;

    //console.log(JSON.stringify(thisTransform2));

    if (globalStates.notLoading !== nodeKey && thisObject.loaded === true) {
        if (!thisObject.visible) {
            thisObject.visible = true;
            globalDOMCach["thisObject" + nodeKey].style.display = 'inline';
            globalDOMCach["iframe" + nodeKey].style.visibility = 'visible';
            globalDOMCach["iframe" + nodeKey].contentWindow.postMessage(
                JSON.stringify(
                    {
                        visibility: "visible"
                    }), '*');

            if (type === "node") {
                globalDOMCach[nodeKey].style.visibility = 'visible';
                // document.getElementById("text" + nodeKey).style.visibility = 'visible';
                if (globalStates.editingMode) {
                    globalDOMCach["canvas" + nodeKey].style.display = 'inline';
                } else {
                    globalDOMCach["canvas" + nodeKey].style.display = 'none';
                }
            } else if (type === "ui") {
                if (globalStates.editingMode) {
                    if (!thisObject.visibleEditing && thisObject.developer) {
                        thisObject.visibleEditing = true;
                        globalDOMCach[nodeKey].style.visibility = 'visible';
                        // showEditingStripes(nodeKey, true);
                        globalDOMCach["canvas" + nodeKey].style.display = 'inline';

                        //document.getElementById(nodeKey).className = "mainProgram";
                    }
                } else {
                    globalDOMCach["canvas" + nodeKey].style.display = 'none';
                }
            }


            else if (type === "logic") {
                thisObject.temp = copyMatrix(thisTransform2);
                globalDOMCach[nodeKey].style.visibility = 'visible';
                // document.getElementById("text" + nodeKey).style.visibility = 'visible';
                if (globalStates.editingMode) {
                    globalDOMCach["canvas" + nodeKey].style.display = 'inline';
                } else {
                    globalDOMCach["canvas" + nodeKey].style.display = 'none';
                }
            }

            /*
            else if (type === "logic") {


                    thisObject.temp = copyMatrix(thisTransform2);

                if (globalStates.editingMode) {
                    if (!thisObject.visibleEditing && thisObject.developer) {
                        thisObject.visibleEditing = true;
                        globalDOMCach[nodeKey].style.visibility = 'visible';
                        // showEditingStripes(nodeKey, true);
                        globalDOMCach["canvas" + nodeKey].style.display = 'inline';

                        //document.getElementById(nodeKey).className = "mainProgram";
                    }
                } else {
                    globalDOMCach["canvas" + nodeKey].style.display = 'none';
                }
            }*/

        }
        if (thisObject.visible) {
            // this needs a better solution
            if (thisObject.fullScreen !== true) {

                finalMatrixTransform2 = [
                    thisObject.scale, 0, 0, 0,
                    0, thisObject.scale, 0, 0,
                    0, 0, 1, 0,
                    thisObject.x, thisObject.y, 0, 1
                ];

                if (globalStates.editingMode) {

                    // todo test if this can be made touch related
                    if (type === "logic") {
                        thisObject.temp = copyMatrix(thisTransform2);
                    }


                    if (globalMatrix.matrixtouchOn === nodeKey) {
                        //if(globalStates.unconstrainedPositioning===true)
                        thisObject.temp = copyMatrix(thisTransform2);

                      //  console.log(thisObject.temp);

                        if (globalMatrix.copyStillFromMatrixSwitch) {
                            globalMatrix.visual = copyMatrix(thisTransform2);
                            if (typeof thisObject.matrix === "object")
                                if (thisObject.matrix.length > 0)
                                // thisObject.begin = copyMatrix(multiplyMatrix(thisObject.matrix, thisObject.temp));
                                    multiplyMatrix(thisObject.matrix, thisObject.temp, thisObject.begin);

                                else
                                    thisObject.begin = copyMatrix(thisObject.temp);
                            else
                                thisObject.begin = copyMatrix(thisObject.temp);

                            if (globalStates.unconstrainedPositioning === true)
                            // thisObject.matrix = copyMatrix(multiplyMatrix(thisObject.begin, invertMatrix(thisObject.temp)));

                                multiplyMatrix(thisObject.begin, invertMatrix(thisObject.temp), thisObject.matrix);

                            globalMatrix.copyStillFromMatrixSwitch = false;
                        }

                        if (globalStates.unconstrainedPositioning === true)
                            thisTransform2 = globalMatrix.visual;

                    }

                    if (typeof thisObject.matrix[1] !== "undefined") {
                        if (thisObject.matrix.length > 0) {
                            if (globalStates.unconstrainedPositioning === false) {
                                //thisObject.begin = copyMatrix(multiplyMatrix(thisObject.matrix, thisObject.temp));
                                multiplyMatrix(thisObject.matrix, thisObject.temp, thisObject.begin);
                            }

                            var r = globalMatrix.r, r2 = globalMatrix.r2;
                            multiplyMatrix(thisObject.begin, invertMatrix(thisObject.temp), r);
                            multiplyMatrix(finalMatrixTransform2, r, r2);
                            estimateIntersection(nodeKey, r2, thisObject);
                        } else {
                            estimateIntersection(nodeKey, null, thisObject);
                        }

                    } else {

                        estimateIntersection(nodeKey, null, thisObject);
                    }
                }

                if (thisObject.matrix.length < 13) {

                    multiplyMatrix(finalMatrixTransform2, thisTransform2, thisTransform);
                } else {
                    var r = globalMatrix.r;
                    multiplyMatrix(thisObject.matrix, thisTransform2, r);
                    multiplyMatrix(finalMatrixTransform2, r, thisTransform);

                    // thisTransform = multiplyMatrix(finalMatrixTransform2, multiplyMatrix(thisObject.matrix, thisTransform2));
                }

                //    else {
                //        multiplyMatrix(finalMatrixTransform2, thisTransform2,thisTransform);
                //   }

                // console.log(nodeKey);
                // console.log(globalDOMCach["thisObject" + nodeKey]);
                // console.log(globalDOMCach["thisObject" + nodeKey].visibility);

                webkitTransformMatrix3d(globalDOMCach["thisObject" + nodeKey], thisTransform);

                // this is for later
                // The matrix has been changed from Vuforia 3 to 4 and 5. Instead of  thisTransform[3][2] it is now thisTransform[3][3]
                thisObject.screenX = thisTransform[12] / thisTransform[15] + (globalStates.height / 2);
                thisObject.screenY = thisTransform[13] / thisTransform[15] + (globalStates.width / 2);
                thisObject.screenZ = thisTransform[14];

            }
            if (type === "ui") {

                if (thisObject.sendMatrix === true || thisObject.sendAcceleration === true) {

                    var thisMsg = {};
                    
                    if(thisObject.sendMatrix === true) {
                        thisMsg.modelViewMatrix = globalObjects[objectKey];
                    }

                    if(thisObject.sendAcceleration === true) {
                        thisMsg.acceleration = globalStates.acceleration;
                    }

                    cout(thisMsg);
                    globalDOMCach["iframe" + nodeKey].contentWindow.postMessage(
                        JSON.stringify(thisMsg), '*');
                  //  console.log("I am here");

                }
            } else {

                thisObject.screenLinearZ = (((10001 - (20000 / thisObject.screenZ)) / 9999) + 1) / 2;
                // map the linearized zBuffer to the final ball size
                thisObject.screenLinearZ = map(thisObject.screenLinearZ, 0.996, 1, 50, 1);

            }


            if (type === "logic" && objectKey!=="pocket"){

                if (globalStates.pointerPosition[0] > -1 && globalProgram.objectA) {

                    var size = (thisObject.screenLinearZ * 40) * thisObject.scale;
                    var x = thisObject.screenX;
                    var y = thisObject.screenY;

                    globalCanvas.hasContent = true;

                    globalLogic.rectPoints = [
                        [x - (-1 * size), y - (-0.42 * size)],
                        [x - (-1 * size), y - (0.42 * size)],
                        [x - (-0.42 * size), y - (size)],
                        [x - (0.42 * size), y - (size)],
                        [x - (size), y - (0.42 * size)],
                        [x - (size), y - (-0.42 * size)],
                        [x - (0.42 * size), y - (-1 * size)],
                        [x - (-0.42 * size), y - (-1 * size)]
                    ];
                   /* var context = globalCanvas.context;
                    context.setLineDash([]);
                    // context.restore();
                    context.beginPath();
                    context.moveTo(globalLogic.rectPoints[0][0], globalLogic.rectPoints[0][1]);
                    context.lineTo(globalLogic.rectPoints[1][0], globalLogic.rectPoints[1][1]);
                    context.lineTo(globalLogic.rectPoints[2][0], globalLogic.rectPoints[2][1]);
                    context.lineTo(globalLogic.rectPoints[3][0], globalLogic.rectPoints[3][1]);
                    context.lineTo(globalLogic.rectPoints[4][0], globalLogic.rectPoints[4][1]);
                    context.lineTo(globalLogic.rectPoints[5][0], globalLogic.rectPoints[5][1]);
                    context.lineTo(globalLogic.rectPoints[6][0], globalLogic.rectPoints[6][1]);
                    context.lineTo(globalLogic.rectPoints[7][0], globalLogic.rectPoints[7][1]);
                    context.closePath();

                    if (globalLogic.farFrontElement === nodeKey) {
                        context.strokeStyle = "#ff0000";
                    } else {
                        context.strokeStyle = "#f0f0f0";
                    }*/
                    if (insidePoly(globalStates.pointerPosition, globalLogic.rectPoints)) {
                       if(thisObject.animationScale ===0 && !globalStates.editingMode)
                        globalDOMCach["logic" + nodeKey].className = "mainEditing scaleIn";
                        thisObject.animationScale =1;
                    }
                    else {
                        if(thisObject.animationScale ===1)
                        globalDOMCach["logic" + nodeKey].className = "mainEditing scaleOut";
                        thisObject.animationScale =0;
                    }

                   // context.stroke();
                } else{
                    if(thisObject.animationScale ===1) {
                        globalDOMCach["logic" + nodeKey].className = "mainEditing scaleOut";
                        thisObject.animationScale =0;
                    }
                }

            }



        }
    }

}

/**********************************************************************************************************************
 **********************************************************************************************************************/

function webkitTransformMatrix3d(thisDom, thisTransform) {
    thisDom.style.webkitTransform = 'matrix3d(' +
        thisTransform.toString() + ')';
}
/*
 function renderText(thisTransform){

 return thisTransform[0] + ',' + thisTransform[1] + ',' + thisTransform[2] + ',' + thisTransform[3] + ',' +
 thisTransform[4] + ',' + thisTransform[5] + ',' + thisTransform[6] + ',' + thisTransform[7] + ',' +
 thisTransform[8] + ',' + thisTransform[9] + ',' + thisTransform[10] + ',' + thisTransform[11] + ',' +
 thisTransform[12] + ',' + thisTransform[13] + ',' + thisTransform[14] + ',' + thisTransform[15];
 }

 */
// thisDom.style.webkitTransform = 'matrix3d('+thisTransform.toString()+')';
/**
 * @desc
 * @param objectKey
 * @param nodeKey
 * @param thisObject
 * @return
 **/

function hideTransformed(objectKey, nodeKey, thisObject, type) {
    if (thisObject.visible === true) {
        globalDOMCach["thisObject" + nodeKey].style.display = 'none';
        globalDOMCach["iframe" + nodeKey].style.visibility = 'hidden';
        globalDOMCach["iframe" + nodeKey].contentWindow.postMessage(
            JSON.stringify(
                {
                    visibility: "hidden"
                }), '*');

        thisObject.visible = false;
        thisObject.visibleEditing = false;

        globalDOMCach[nodeKey].style.visibility = 'hidden';
        globalDOMCach["canvas" + nodeKey].style.display = 'none';

        cout("hideTransformed");
    }
}

/**********************************************************************************************************************
 ****************************************** datacrafting update  ******************************************************
 **********************************************************************************************************************/

function updateGrid(grid) {
    console.log("update grid!");

    // *** this does all the backend work ***
    grid.recalculateAllRoutes();

    var guiState = globalStates.currentLogic.guiState;

    // reset domElements 
    for (var domKey in guiState.blockDomElements) {
        var blockDomElement = guiState.blockDomElements[domKey];

        // remove dom elements if their blocks are gone or needs to be reset
        if (shouldRemoveBlockDom(blockDomElement)) {
            blockDomElement.parentNode.removeChild(blockDomElement);
            delete guiState.blockDomElements[domKey];
        }
    }

    // add new domElement for each block that needs one
    for (var blockKey in globalStates.currentLogic.blocks) {
        var block = globalStates.currentLogic.blocks[blockKey];
        if (block.isPortBlock) continue; // don't render invisible input/output blocks
        if (isBlockOutsideGrid(block, grid) && !isPortBlock(block)) { // cleanup incorrectly setup blocks // TODO: prevent this in the first place rather than checking each time
            removeBlock(globalStates.currentLogic, blockKey);
            continue;
        }

        // only add if the block doesn't already have one
        var blockDomElement = guiState.blockDomElements[block.globalId];
        if (!blockDomElement) {
            addDomElementForBlock(block, grid);
        }

    }
}

function removeBlockDom(block) {
    var blockDomElement = getDomElementForBlock(block);
    blockDomElement.parentNode.removeChild(blockDomElement);
    delete globalStates.currentLogic.guiState.blockDomElements[block.globalId];
}

function shouldRemoveBlockDom(blockDomElement) {
    return (getBlockForDom(blockDomElement) === null);
}

function getBlockForDom(blockDomElement) {
    for (var blockKey in globalStates.currentLogic.blocks) {
        var block = globalStates.currentLogic.blocks[blockKey];
        if (globalStates.currentLogic.guiState.blockDomElements[block.globalId] === blockDomElement) {
            return block;
        }
    }
    return null;
}

function addDomElementForBlock(block, grid, isTempBlock) {
    var blockDomElement = document.createElement('div');
    blockDomElement.setAttribute('class','blockDivPlaced');

    var blockContents = document.createElement('div');
    blockContents.setAttribute('class', 'menuBlockContents');
    blockContents.setAttribute("touch-action", "none");
    blockDomElement.appendChild(blockContents);

    // add icon and title to block
    if (block.name) {
        var iconImage = document.createElement("img");
        iconImage.setAttribute('class', 'blockIcon');
        iconImage.src = getBlockIcon(globalStates.currentLogic, block.type).src;
        blockContents.appendChild(iconImage);

        var blockTitle = document.createElement('div');
        blockTitle.setAttribute('class', 'blockTitle');
        blockTitle.innerHTML = block.name;
        blockContents.appendChild(blockTitle);
    }
    blockDomElement.style.display = 'inline-block';

    // if we're adding a temp block, it doesn't have associated cells it can use to calculate position. we need to remember to set position to pointer afterwards
    if (!isTempBlock) { //TODO: is there a way to set position for new blocks consistently?
        var firstCell = getCellForBlock(grid, block, 0);
        var firstCellCenterX = grid.getCellCenterX(firstCell);
        blockDomElement.style.left = firstCellCenterX - grid.blockColWidth/2;
        blockDomElement.style.top = grid.getCellCenterY(firstCell) - grid.blockRowHeight/2;
    }

    blockDomElement.style.width = getBlockPixelWidth(block,grid);
    blockDomElement.style.height = grid.blockRowHeight;

    var indicatorWidth = 10;
    
    for (var i=0; i < block.blockSize; i++) {
        var isActiveInput = block.activeInputs[i];
        var isActiveOutput = block.activeOutputs[i];
        if (isActiveInput) {
            var inputIndicatorDiv = document.createElement('div');
            inputIndicatorDiv.setAttribute('class', 'inputIndicator');
            inputIndicatorDiv.style.width = indicatorWidth;
            inputIndicatorDiv.style.height = 0.5 * indicatorWidth;
            inputIndicatorDiv.style.left = offsetForItem(i) - 0.5 * indicatorWidth;
            inputIndicatorDiv.style.borderBottomLeftRadius = 0.5 * indicatorWidth;
            inputIndicatorDiv.style.borderBottomRightRadius = 0.5 * indicatorWidth;
            blockDomElement.appendChild(inputIndicatorDiv);
        }
        if (isActiveOutput) {
            var outputIndicatorDiv = document.createElement('div');
            outputIndicatorDiv.setAttribute('class', 'outputIndicator');
            outputIndicatorDiv.style.width = indicatorWidth;
            outputIndicatorDiv.style.height = 0.5 * indicatorWidth;
            outputIndicatorDiv.style.left = offsetForItem(i) - 0.5 * indicatorWidth;
            outputIndicatorDiv.style.bottom = -0.5 * indicatorWidth;
            outputIndicatorDiv.style.borderBottomLeftRadius = 0.5 * indicatorWidth;
            outputIndicatorDiv.style.borderBottomRightRadius = 0.5 * indicatorWidth;
            blockDomElement.appendChild(outputIndicatorDiv);
        }
    }

    var blockContainer = document.getElementById('blocks');
    blockContainer.appendChild(blockDomElement);

    var guiState = globalStates.currentLogic.guiState;
    guiState.blockDomElements[block.globalId] = blockDomElement;
}

// updates datacrafting visuals each frame
// renders all the links for a datacrafting grid, draws cut line if present, draws temp block if present
function redrawDatacrafting() {
    if (!globalStates.currentLogic) return;
    var grid = globalStates.currentLogic.grid;

    var canvas = document.getElementById("datacraftingCanvas");
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height);

    forEachLink( function(link) {
        var startCell =  getCellForBlock(grid, blockWithID(link.nodeA, globalStates.currentLogic), link.logicA);
        var endCell =  getCellForBlock(grid, blockWithID(link.nodeB, globalStates.currentLogic), link.logicB);
        drawDatacraftingLine(ctx, link, 5, startCell.getColorHSL(), endCell.getColorHSL(), timeCorrection);
    });

    var cutLine = globalStates.currentLogic.guiState.cutLine;
    if (cutLine.start && cutLine.end) {
        drawSimpleLine(ctx, cutLine.start.x, cutLine.start.y, cutLine.end.x, cutLine.end.y, "#FFFFFF", 3);
    }

    var tempLine = globalStates.currentLogic.guiState.tempLine;
    if (tempLine.start && tempLine.end) {
        drawSimpleLine(ctx, tempLine.start.x, tempLine.start.y, tempLine.end.x, tempLine.end.y, tempLine.color, 3);
    }

    var tappedContents = globalStates.currentLogic.guiState.tappedContents;
    if (tappedContents) {
        var domElement = getDomElementForBlock(tappedContents.block);
        if (!domElement) return;

        globalStates.currentLogic.guiState.tempIncomingLinks.forEach( function(linkData) {
            var startCell = getCellForBlock(grid, blockWithID(linkData.nodeA, globalStates.currentLogic), linkData.logicA);
            if (!startCell && isInOutBlock(linkData.nodeA)) {
                var col = linkData.nodeA.slice(-1) * 2;
                startCell = grid.getCell(col, 0);
            }
            var startX = grid.getCellCenterX(startCell);
            var startY = grid.getCellCenterY(startCell);

            var xOffset =  0.5 * grid.blockColWidth + (grid.blockColWidth + grid.marginColWidth) * linkData.logicB;
            var endX = parseInt(domElement.style.left) + xOffset;
            var endY = parseInt(domElement.style.top) + domElement.clientHeight/2;
            var startColor = startCell.getColorHSL();
            var lineColor = 'hsl('+startColor.h+','+startColor.s+'%,'+startColor.l+'%)';

            drawSimpleLine(ctx, startX, startY, endX, endY, lineColor, 2);
        });

        globalStates.currentLogic.guiState.tempOutgoingLinks.forEach( function(linkData) {
            var xOffset =  0.5 * grid.blockColWidth + (grid.blockColWidth + grid.marginColWidth) * linkData.logicA;
            var startX = parseInt(domElement.style.left) + xOffset;
            var startY = parseInt(domElement.style.top) + domElement.clientHeight/2;

            var endCell = getCellForBlock(grid, blockWithID(linkData.nodeB, globalStates.currentLogic), linkData.logicB);
            if (!endCell && isInOutBlock(linkData.nodeB)) {
                var col = linkData.nodeB.slice(-1) * 2;
                endCell = grid.getCell(col, 6);
            }
            var endX = grid.getCellCenterX(endCell);
            var endY = grid.getCellCenterY(endCell);
            var endColor = endCell.getColorHSL();
            var lineColor = 'hsl('+endColor.h+','+endColor.s+'%,'+endColor.l+'%)';

            drawSimpleLine(ctx, startX, startY, endX, endY, lineColor, 2);
        });
    }
}

/**********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * Construct and insert the list of objects into the preferences display
 */
function addElementInPreferences() {
    cout("addedObject");

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

function addElement(objectKey, nodeKey, thisUrl, thisObject, type, globalStates) {

    if (globalStates.notLoading !== true && globalStates.notLoading !== nodeKey && thisObject.loaded !== true) {



        console.log("did load object " + objectKey + ", node " + nodeKey);

        thisObject.animationScale =0;
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

        var addContainer = document.createElement('div');
        addContainer.id = "thisObject" + nodeKey;
        addContainer.style.width = globalStates.height + "px";
        addContainer.style.height = globalStates.width + "px";
        addContainer.style.display = "none";
        addContainer.style.border = 0;
       // addContainer.setAttribute("background-color", "lightblue");

        addContainer.className = "main";

        var addIframe = document.createElement('iframe');
        addIframe.id = "iframe" + nodeKey;
        addIframe.frameBorder = 0;
        addIframe.style.width = "0px";
        addIframe.style.height = "0px";
        addIframe.style.left = ((globalStates.height - thisObject.frameSizeY) / 2) + "px";
        addIframe.style.top = ((globalStates.width - thisObject.frameSizeX) / 2) + "px";
        addIframe.style.visibility = "hidden";
        addIframe.src = thisUrl;
        addIframe.className = "main";
        addIframe.setAttribute("onload", 'on_load("' + objectKey + '","' + nodeKey + '")');
        addIframe.setAttribute("sandbox", "allow-forms allow-pointer-lock allow-same-origin allow-scripts");

        var addOverlay = document.createElement('div');
        // addOverlay.style.backgroundColor = "red";
        addOverlay.id = nodeKey;
        addOverlay.frameBorder = 0;
        addOverlay.style.width = thisObject.frameSizeX + "px";
        addOverlay.style.height = thisObject.frameSizeY + "px";
        addOverlay.style.left = ((globalStates.height - thisObject.frameSizeY) / 2) + "px";
        addOverlay.style.top = ((globalStates.width - thisObject.frameSizeX) / 2) + "px";
        addOverlay.style.visibility = "hidden";
        addOverlay.className = "mainEditing";

        // todo the event handlers need to be bound to non animated ui elements for fast movements.
        // todo the lines need to end at the center of the square.


        if(type=== "logic") {
            var addLogic;
            var size = 200;
            addLogic = document.createElement('div');
            // addOverlay.style.backgroundColor = "red";
            addLogic.id = "logic" + nodeKey;
            addLogic.style.width = size + "px";
            // addOverlay.style.height = thisObject.frameSizeY + "px";
            addLogic.style.height = size + "px";
            addLogic.style.left = ((thisObject.frameSizeX - size) / 2) + "px";
            addLogic.style.top = ((thisObject.frameSizeY- size) / 2) + "px";
            addLogic.style.visibility = "hidden";
            addLogic.className = "mainEditing";
           /* addLogic.innerHTML =
                '<svg id="SVG'+nodeKey+'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
                '<path id="logic4" fill="#00ffff" d="M50,0V50H0V30A30,30,0,0,1,30,0Z"/>' +
                '<path id="logic3" fill="#00ff00" d="M100,30V50H50V0H70A30,30,0,0,1,100,30Z"/>' +
                '<path id="logic2" fill="#ff007c" d="M100,50V70a30,30,0,0,1-30,30H50V50Z"/>>' +
                '<path id="logic1" fill="#ffff00" d="M50,50v50H30A30,30,0,0,1,0,70V50Z"/>' +
                '</svg>';*/

            var svgContainer = document.createElementNS('http://www.w3.org/2000/svg', "svg");
            svgContainer.setAttributeNS(null,"viewBox", "0 0 100 100");

            var svgElement=[];
             svgElement.push(document.createElementNS("http://www.w3.org/2000/svg","path"));
            svgElement[0].setAttributeNS(null,"fill","#00ffff");
            svgElement[0].setAttributeNS(null,"d","M50,0V50H0V30A30,30,0,0,1,30,0Z");
            svgElement.push(document.createElementNS("http://www.w3.org/2000/svg","path"));
            svgElement[1].setAttributeNS(null,"fill","#00ff00");
            svgElement[1].setAttributeNS(null,"d","M100,30V50H50V0H70A30,30,0,0,1,100,30Z");
            svgElement.push(document.createElementNS("http://www.w3.org/2000/svg","path"));
            svgElement[2].setAttributeNS(null,"fill","#ffff00");
            svgElement[2].setAttributeNS(null,"d","M100,50V70a30,30,0,0,1-30,30H50V50Z");
            svgElement.push(document.createElementNS("http://www.w3.org/2000/svg","path"));
            svgElement[3].setAttributeNS(null,"fill","#ff007c");
            svgElement[3].setAttributeNS(null,"d","M50,50v50H30A30,30,0,0,1,0,70V50Z");

            for (var i=0;i<svgElement.length;i++){
                svgContainer.appendChild(svgElement[i]);
                svgElement[i].number = i;
                svgElement[i].addEventListener('pointerenter', function(){
                    globalProgram.logicSelector = this.number;

                    if(globalProgram.nodeA === nodeKey)
                        globalProgram.logicA = this.number;
                    else
                        globalProgram.logicB = this.number;

                    console.log(globalProgram.logicSelector);
                });
                addLogic.appendChild(svgContainer);

                addOverlay.appendChild(addLogic);
                globalDOMCach["logic" + nodeKey] = addLogic;

            };
        }

        var addCanvas = document.createElement('canvas');
        addCanvas.id = "canvas" + nodeKey;
        addCanvas.style.width = "100%";
        addCanvas.style.height = "100%";
        addCanvas.className = "mainCanvas";

        document.getElementById("GUI").appendChild(addContainer);

        addContainer.appendChild(addIframe);
        addOverlay.appendChild(addCanvas);
        addContainer.appendChild(addOverlay);

        globalDOMCach["thisObject" + nodeKey] = addContainer;
        globalDOMCach["iframe" + nodeKey] = addIframe;
        globalDOMCach[nodeKey] = addOverlay;
        globalDOMCach["canvas" + nodeKey] = addCanvas;

        var theObject = addOverlay;
        globalDOMCach[nodeKey].style["touch-action"] = "none";

        globalDOMCach[nodeKey].addEventListener("pointerdown", touchDown, false);
        ec++;
        globalDOMCach[nodeKey].addEventListener("pointerup", trueTouchUp, false);
        ec++;
        theObject.addEventListener("pointerenter", touchEnter, false);
        ec++;

        theObject.addEventListener("pointerleave", touchLeave, false);
        ec++;


        if (globalStates.editingMode) {
            // todo this needs to be changed backword
            // if (objects[objectKey].developer) {
            theObject.addEventListener("touchstart", MultiTouchStart, false);
            ec++;
            theObject.addEventListener("touchmove", MultiTouchMove, false);
            ec++;
            theObject.addEventListener("touchend", MultiTouchEnd, false);
            ec++;
            theObject.className = "mainProgram";
            //  }
        }
        theObject.objectId = objectKey;
        theObject.nodeId = nodeKey;
        theObject.type = type;

        if (type === "node") {
            theObject.style.visibility = "visible";
            // theObject.style.display = "initial";
        } else if (type === "logic") {
            theObject.style.visibility = "visible";
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

        globalDOMCach["thisObject" + objectKey].parentNode.removeChild(globalDOMCach["thisObject" + objectKey]);
        delete globalDOMCach["thisObject" + objectKey];
        delete globalDOMCach["iframe" + objectKey];
        delete globalDOMCach[objectKey];
        delete globalDOMCach["canvas" + objectKey];

        delete  globalDOMCach[objectKey];

        for (var nodeKey in thisObject.nodes) {
            try {

                globalDOMCach["thisObject" + nodeKey].parentNode.removeChild(globalDOMCach["thisObject" + nodeKey]);
                delete   globalDOMCach["thisObject" + nodeKey];
                delete  globalDOMCach["iframe" + nodeKey];
                delete globalDOMCach[nodeKey];
                delete globalDOMCach["canvas" + nodeKey];

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
    var nodes;
    var version = 170;
    if (!objects[objectKey]) {
        nodes = {};
    } else {
        nodes = objects[objectKey].nodes;
        version = objects[objectKey].integerVersion;
    }

    var oldStyle = {
        obj: objectKey,
        pos: nodeKey,
        objectValues: nodes
    };

    var newStyle = {
        object: objectKey,
        node: nodeKey,
        nodes: nodes
    };

    if (version < 170) {
        newStyle = oldStyle;
    }
    globalDOMCach["iframe" + nodeKey].contentWindow.postMessage(
        JSON.stringify(newStyle), '*');
    cout("on_load");
}
