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

createNameSpace("realityEditor.gui.ar.draw");

/**********************************************************************************************************************
 ******************************************** update and draw the 3D Interface ****************************************
 **********************************************************************************************************************/

/**
 * @desc main update loop called 30 fps with an array of found transformation matrices
 * @param visibleObjects
 **/


realityEditor.gui.ar.draw.update = function(visibleObjects) {

//    console.log(JSON.stringify(visibleObjects));
    this.ar.utilities.timeSynchronizer(timeCorrection);
    //disp = uiButtons.style.display;
    //uiButtons.style.display = 'none';

    if (globalStates.guiState === "logic") {
        // todo maybe animation frame
        this.gui.crafting.redrawDataCrafting();
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
           this.ar.utilities.multiplyMatrix(globalObjects[objectKey], globalStates.projectionMatrix, r);
            this.ar.utilities.multiplyMatrix(rotateX, r, tempMatrix);

            //  var tempMatrix2 = multiplyMatrix(globalObjects[objectKey], globalStates.projectionMatrix);

            //   document.getElementById("controls").innerHTML = (toAxisAngle(tempMatrix2)[0]).toFixed(1)+" "+(toAxisAngle(tempMatrix2)[1]).toFixed(1);

            if (globalStates.guiState ==="ui" || Object.keys(generalObject.nodes).length === 0) {
                this.drawTransformed(objectKey, objectKey, generalObject, tempMatrix, "ui", thisGlobalStates, thisGlobalCanvas, thisGlobalLogic, thisGlobalDOMCach, thisGlobalMatrix);
                this.addElement(objectKey, objectKey, "http://" + generalObject.ip + ":" + httpPort + "/obj/" + generalObject.name + "/", generalObject, "ui", thisGlobalStates);
            }
            else {
                this.hideTransformed(objectKey, objectKey, generalObject, "ui");
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

                if (globalStates.guiState ==="node" || globalStates.guiState === "logic") {
                    this.drawTransformed(objectKey, nodeKey, generalNode, tempMatrix, generalNode.type, thisGlobalStates, thisGlobalCanvas, thisGlobalLogic, thisGlobalDOMCach, thisGlobalMatrix);


                    this.addElement(objectKey, nodeKey, "nodes/" + generalNode.type + "/index.html", generalNode, generalNode.type, thisGlobalStates);

                } else {
                    this.hideTransformed(objectKey, nodeKey, generalNode, generalNode.type);
                }
            }

            for (var nodeKey in generalObject.frames) {
                generalNode = generalObject.frames[nodeKey];
                if (globalStates.guiState === "ui") {
                    this.drawTransformed(objectKey, nodeKey, generalNode, tempMatrix, "ui", thisGlobalStates, thisGlobalCanvas, thisGlobalLogic, thisGlobalDOMCach, thisGlobalMatrix);
                    var keyedSrc = generalNode.src;
                    if (keyedSrc.indexOf('?') >= 0) {
                        keyedSrc += '&';
                    } else {
                        keyedSrc += '?';
                    }
                    keyedSrc += 'nodeKey=' + nodeKey;
                    this.addElement(objectKey, nodeKey, keyedSrc, generalNode, "ui", thisGlobalStates);
                } else {
                    this.hideTransformed(objectKey, nodeKey, generalNode, "ui");
                }
            }
        }

        else {
            generalObject.objectVisible = false;

            this.hideTransformed(objectKey, objectKey, generalObject, "ui");

            for (var nodeKey in generalObject.nodes) {
                // if (!generalObject.nodes.hasOwnProperty(nodeKey)) {  continue;  }
                this.hideTransformed(objectKey, nodeKey, generalObject.nodes[nodeKey], generalObject.nodes[nodeKey].type);
            }

            for (var nodeKey in generalObject.frames) {
                this.hideTransformed(objectKey, nodeKey, generalObject.frames[nodeKey], "ui");
            }

            this.killObjects(objectKey, generalObject);
        }

    }

    // draw all lines
    if ( (globalStates.guiState ==="node"|| globalStates.guiState === "logic") && !globalStates.editingMode) {
        for (var objectKey in objects) {
            this.ar.lines.drawAllLines(objects[objectKey], thisGlobalCanvas.context);
        }
        this.ar.lines.drawInteractionLines();
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
            this.ar.utilities.multiplyMatrix(globalObjects[globalLogic.farFrontElement], globalStates.projectionMatrix, r);
            this.ar.utilities.multiplyMatrix(rotateX, r, thisMatrix);

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

            if ( (globalStates.guiState === "node" || globalStates.guiState === "logic") && generalNode.type === "logic") {
                this.drawTransformed(objectKey, nodeKey, generalNode,
                    thisMatrix, generalNode.type, globalStates, globalCanvas, globalLogic, globalDOMCach, globalMatrix);

                this.addElement(objectKey, nodeKey, "nodes/" + generalNode.type + "/index.html", generalNode, generalNode.type, globalStates);

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
};

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

realityEditor.gui.ar.draw.drawTransformed = function (objectKey, nodeKey, thisObject, thisTransform2, type, globalStates, globalCanvas, globalLogic, globalDOMCach, globalMatrix) {


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
                thisObject.temp = this.ar.utilities.copyMatrix(thisTransform2);
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

                if (globalStates.editingMode || globalStates.editingNode === nodeKey) {

                    // todo test if this can be made touch related
                    if (type === "logic") {
                        thisObject.temp = this.ar.utilities.copyMatrix(thisTransform2);
                    }


                    if (globalMatrix.matrixtouchOn === nodeKey) {
                        //if(globalStates.unconstrainedPositioning===true)
                        thisObject.temp = this.ar.utilities.copyMatrix(thisTransform2);

                        //  console.log(thisObject.temp);

                        if (globalMatrix.copyStillFromMatrixSwitch) {
                            globalMatrix.visual = this.ar.utilities.copyMatrix(thisTransform2);
                            if (typeof thisObject.matrix === "object")
                                if (thisObject.matrix.length > 0)
                                // thisObject.begin = copyMatrix(multiplyMatrix(thisObject.matrix, thisObject.temp));
                                    this.ar.utilities.multiplyMatrix(thisObject.matrix, thisObject.temp, thisObject.begin);

                                else
                                    thisObject.begin = this.ar.utilities.copyMatrix(thisObject.temp);
                            else
                                thisObject.begin = this.ar.utilities.copyMatrix(thisObject.temp);

                            if (globalStates.unconstrainedPositioning === true)
                            // thisObject.matrix = copyMatrix(multiplyMatrix(thisObject.begin, invertMatrix(thisObject.temp)));

                                this.ar.utilities.multiplyMatrix(thisObject.begin,  this.ar.utilities.invertMatrix(thisObject.temp), thisObject.matrix);

                            globalMatrix.copyStillFromMatrixSwitch = false;
                        }

                        if (globalStates.unconstrainedPositioning === true)
                            thisTransform2 = globalMatrix.visual;

                    }

                    if (typeof thisObject.matrix[1] !== "undefined") {
                        if (thisObject.matrix.length > 0) {
                            if (globalStates.unconstrainedPositioning === false) {
                                //thisObject.begin = copyMatrix(multiplyMatrix(thisObject.matrix, thisObject.temp));
                                this.ar.utilities.multiplyMatrix(thisObject.matrix, thisObject.temp, thisObject.begin);
                            }

                            var r = globalMatrix.r, r2 = globalMatrix.r2;
                            this.ar.utilities.multiplyMatrix(thisObject.begin,  this.ar.utilities.invertMatrix(thisObject.temp), r);
                            this.ar.utilities.multiplyMatrix(finalMatrixTransform2, r, r2);
                            this.ar.utilities.estimateIntersection(nodeKey, r2, thisObject);
                        } else {
                            this.ar.utilities.estimateIntersection(nodeKey, null, thisObject);
                        }

                    } else {

                        this.ar.utilities.estimateIntersection(nodeKey, null, thisObject);
                    }
                }

                if (thisObject.matrix.length < 13) {

                    this.ar.utilities.multiplyMatrix(finalMatrixTransform2, thisTransform2, thisTransform);
                } else {
                    var r = globalMatrix.r;
                    this.ar.utilities.multiplyMatrix(thisObject.matrix, thisTransform2, r);
                    this.ar.utilities.multiplyMatrix(finalMatrixTransform2, r, thisTransform);

                    // thisTransform = multiplyMatrix(finalMatrixTransform2, multiplyMatrix(thisObject.matrix, thisTransform2));
                }

                //    else {
                //        multiplyMatrix(finalMatrixTransform2, thisTransform2,thisTransform);
                //   }

                // console.log(nodeKey);
                // console.log(globalDOMCach["thisObject" + nodeKey]);
                // console.log(globalDOMCach["thisObject" + nodeKey].visibility);

                this.webkitTransformMatrix3d(globalDOMCach["thisObject" + nodeKey], thisTransform);

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

                    this.cout(thisMsg);
                    globalDOMCach["iframe" + nodeKey].contentWindow.postMessage(
                        JSON.stringify(thisMsg), '*');
                    //  console.log("I am here");

                }
            } else {

                thisObject.screenLinearZ = (((10001 - (20000 / thisObject.screenZ)) / 9999) + 1) / 2;
                // map the linearized zBuffer to the final ball size
                thisObject.screenLinearZ = this.ar.utilities.map(thisObject.screenLinearZ, 0.996, 1, 50, 1);

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
                    if (this.ar.utilities.insidePoly(globalStates.pointerPosition, globalLogic.rectPoints)) {
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

};

realityEditor.gui.ar.draw.webkitTransformMatrix3d = function (thisDom, thisTransform) {
    thisDom.style.webkitTransform = 'matrix3d(' +
        thisTransform.toString() + ')';
};

/**
 * @desc
 * @param objectKey
 * @param nodeKey
 * @param thisObject
 * @return
 **/

realityEditor.gui.ar.draw.hideTransformed = function (objectKey, nodeKey, thisObject, type) {
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

        this.cout("hideTransformed");
    }
};

/**
 * @desc
 * @param objectKey
 * @param nodeKey
 * @param thisUrl
 * @param thisObject
 * @return
 **/

realityEditor.gui.ar.draw.addElement = function (objectKey, nodeKey, thisUrl, thisObject, type, globalStates) {

    if (globalStates.notLoading !== true && globalStates.notLoading !== nodeKey && thisObject.loaded !== true) {



        console.log("did load object " + objectKey + ", node " + nodeKey);

        if (typeof thisObject.frameSizeX === 'undefined') {
            thisObject.frameSizeX = thisObject.width;
        }

        if (typeof thisObject.frameSizeY === 'undefined') {
            thisObject.frameSizeY = thisObject.height;
        }

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
        addIframe.style.width = (thisObject.width || 0) + "px";
        addIframe.style.height = (thisObject.height || 0) + "px";
        addIframe.style.left = ((globalStates.height - thisObject.frameSizeY) / 2) + "px";
        addIframe.style.top = ((globalStates.width - thisObject.frameSizeX) / 2) + "px";
        addIframe.style.visibility = "hidden";
        addIframe.src = thisUrl;
        addIframe.dataset.nodeKey = nodeKey;
        addIframe.dataset.objectKey = objectKey;
        addIframe.className = "main";
        addIframe.setAttribute("onload", 'realityEditor.network.onElementLoad("' + objectKey + '","' + nodeKey + '")');
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

        globalDOMCach[nodeKey].addEventListener("pointerdown", realityEditor.device.onTouchDown.bind(realityEditor.device), false);
        ec++;
        globalDOMCach[nodeKey].addEventListener("pointerup", realityEditor.device.onTrueTouchUp.bind(realityEditor.device), false);
        ec++;
        theObject.addEventListener("pointerenter", realityEditor.device.onTouchEnter.bind(realityEditor.device), false);
        ec++;

        theObject.addEventListener("pointerleave", realityEditor.device.onTouchLeave.bind(realityEditor.device), false);
        ec++;

        theObject.addEventListener("pointermove", realityEditor.device.onTouchMove.bind(realityEditor.device), false);
        ec++;

        if (globalStates.editingMode) {
            // todo this needs to be changed backword
            // if (objects[objectKey].developer) {
            theObject.addEventListener("touchstart", realityEditor.device.onMultiTouchStart.bind(realityEditor.device), false);
            ec++;
            theObject.addEventListener("touchmove", realityEditor.device.onMultiTouchMove.bind(realityEditor.device), false);
            ec++;
            theObject.addEventListener("touchend", realityEditor.device.onMultiTouchEnd.bind(realityEditor.device), false);
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
        this.cout("addElementInPreferences");
    }
};

/**
 * @desc
 * @param objectKey
 * @param thisObject
 * @return
 **/

realityEditor.gui.ar.draw.killObjects = function (objectKey, thisObject) {

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
                this.cout("could not find any");
            }
            thisObject.nodes[nodeKey].loaded = false;
        }
        this.cout("killObjects");
    }
};

realityEditor.gui.ar.draw.deleteNode = function (objectId, nodeId) {

    delete objects[objectId].nodes[nodeId];
    if (globalDOMCach["thisObject" + nodeId]) {
        if (globalDOMCach["thisObject" + nodeId].parentNode) {
            globalDOMCach["thisObject" + nodeId].parentNode.removeChild(globalDOMCach["thisObject" + nodeId]);
        }
        delete globalDOMCach["thisObject" + nodeId];
    }
    delete globalDOMCach["iframe" + nodeId];
    delete globalDOMCach[nodeId];
    delete globalDOMCach["canvas" + nodeId];

};

realityEditor.gui.ar.draw.deleteFrame = function (objectId, frameId) {

    delete objects[objectId].frames[frameId];
    globalDOMCach["thisObject" + frameId].parentNode.removeChild(globalDOMCach["thisObject" + frameId]);
    delete globalDOMCach["thisObject" + frameId];
    delete globalDOMCach["iframe" + frameId];
    delete globalDOMCach[frameId];
    delete globalDOMCach["canvas" + frameId];

};


