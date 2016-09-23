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
 * @param evt
 **/

function touchDown(evt) {
    if (!globalStates.editingMode) {
        if (globalStates.guiState ==="node") {
            if (!globalProgram.objectA) {
                globalProgram.objectA = this.objectId;
                globalProgram.nodeA = this.nodeId;
                if(this.kind === "logic")
                    globalProgram.logicA = 0;
            }
        }
    } else {
        globalStates.editingModeObject = this.objectId;
        globalStates.editingModeLocation = this.nodeId;
        globalStates.editingModeHaveObject = true;
    }
    cout("touchDown");
}

/**********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * @desc
 **/

function falseTouchUp() {
    if (globalStates.guiState ==="node") {
        globalProgram.objectA = false;
        globalProgram.nodeA = false;
        globalProgram.logicA = false;
    }
    globalCanvas.hasContent = true;
    cout("falseTouchUp");
}

/**********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * @desc
 **/

function trueTouchUp() {
    if (globalStates.guiState ==="node") {
        if (globalProgram.objectA) {

            if(this.nodeId === globalProgram.nodeA && this.kind === "logic"){
                craftingBoardVisible(this.objectId, this.nodeId);
            }

            var thisTempObject = objects[globalProgram.objectA];
            var thisTempObjectLinks = thisTempObject.links;

            globalProgram.objectB = this.objectId;
            globalProgram.nodeB = this.nodeId;
            if(this.kind === "logic")
                globalProgram.logicB = 0;

            var thisOtherTempObject = objects[globalProgram.objectB];

            var okForNewLink = checkForNetworkLoop(globalProgram.objectA, globalProgram.nodeA, globalProgram.logicA, globalProgram.objectB, globalProgram.nodeB, globalProgram.logicB);

            //  window.location.href = "of://event_" + objects[globalProgram.objectA].visible;

            if (okForNewLink) {
                var thisKeyId = uuidTimeShort();

                var namesA, namesB;

                    if(globalProgram.logicA !== false){
                        namesA = "";
                    } else {
                        namesA =  [thisTempObject.name, thisTempObject.nodes[globalProgram.nodeA].name];
                    }

                    if(globalProgram.logicB !== false){
                        namesB = "";
                    } else {
                        namesB =  [thisOtherTempObject.name, thisOtherTempObject.nodes[globalProgram.nodeB].name];
                    }




                thisTempObjectLinks[thisKeyId] = {
                    objectA: globalProgram.objectA,
                    objectB: globalProgram.objectB,
                    nodeA: globalProgram.nodeA,
                    nodeB: globalProgram.nodeB,
                    logicA: globalProgram.logicA,
                    logicB: globalProgram.logicB,
                    namesA: namesA,
                    namesB: namesB
                };

                // push new connection to objectA
                //todo this is a work around to not crash the server. only temporarly for testing
                if(globalProgram.logicA === false && globalProgram.logicB === false) {
                    uploadNewLink(thisTempObject.ip, globalProgram.objectA, thisKeyId, thisTempObjectLinks[thisKeyId]);
                }
            }

            // set everything back to false
            globalProgram.objectA = false;
            globalProgram.nodeA = false;
            globalProgram.logicA = false;
            globalProgram.objectB = false;
            globalProgram.nodeB = false;
            globalProgram.logicB = false;
        }
    }
    globalCanvas.hasContent = true;

    cout("trueTouchUp");
}


function touchEnter () {
    var contentForFeedback;

    if (globalProgram.nodeA === this.id || globalProgram.nodeA === false) {
        contentForFeedback = 3;
        globalSVGCach["overlayImgRing"].setAttribute("r", "58");
        globalSVGCach["overlayImgRing"].setAttribute("stroke", '#f9f90a');

    } else {

        if (checkForNetworkLoop(globalProgram.objectA, globalProgram.nodeA, globalProgram.logicA, this.objectId, this.nodeId, 0)) {
            contentForFeedback = 2; // overlayImg.src = overlayImage[2].src;
            globalSVGCach["overlayImgRing"].setAttribute("r", "58");
            globalSVGCach["overlayImgRing"].setAttribute("stroke", '#3af431');
        }

        else {
            contentForFeedback = 0; // overlayImg.src = overlayImage[0].src;
            globalSVGCach["overlayImgRing"].setAttribute("r", "58");
            globalSVGCach["overlayImgRing"].setAttribute("stroke", '#ff019f');
        }
    }

    globalDOMCach["iframe" + this.nodeId].contentWindow.postMessage(
        JSON.stringify(
            {
                uiActionFeedback: contentForFeedback
            })
        , "*");

    //   document.getElementById('overlayImg').src = overlayImage[contentForFeedback].src;
}


function touchLeave () {
        globalSVGCach["overlayImgRing"].setAttribute("r", "30");
        globalSVGCach["overlayImgRing"].setAttribute("stroke", '#00ffff');

        // document.getElementById('overlayImg').src = overlayImage[1].src;

        cout("leave");

        globalDOMCach["iframe" + this.nodeId].contentWindow.postMessage(
            JSON.stringify(
                {
                    uiActionFeedback: 1
                })
            , "*");

}

/**********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * @desc
 * @param evt
 **/

function canvasPointerDown(evt) {
    if (globalStates.guiState ==="node" && !globalStates.editingMode) {
        if (!globalProgram.objectA) {
            globalStates.drawDotLine = true;
            globalStates.drawDotLineX = evt.clientX;
            globalStates.drawDotLineY = evt.clientY;

        }
    }

    cout("canvasPointerDown");
}

/**********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * @desc
 * @param evt
 **/

function getPossition(evt) {

    globalStates.pointerPosition = [evt.clientX, evt.clientY];

    overlayDiv.style.left = evt.clientX - 60;
    overlayDiv.style.top = evt.clientY - 60;


    setPocketPossition(evt);


    cout("getPossition");

}


function setPocketPossition (evt){


    if(pocketItem.pocket.logic[pocketItemId]){


        var thisItem = pocketItem.pocket.logic[pocketItemId];

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

/**********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * @desc
 * @param evt
 **/

function documentPointerUp(evt) {

    globalStates.pointerPosition = [-1, -1];




    if (globalStates.pocketButtonDown) {
        pocketItem.pocket.objectVisible = false;

        if (pocketItem.pocket.logic[pocketItemId]) {

            globalLogic.farFrontElement = "";
            globalLogic.frontDepth = 10000000000;

            for (var thisOtherKey in globalObjects) {
                if (globalObjects[thisOtherKey][14] < globalLogic.frontDepth) {
                    globalLogic.frontDepth = globalObjects[thisOtherKey][14];
                    globalLogic.farFrontElement = thisOtherKey;
                }
            }

            var thisItem = pocketItem.pocket.logic[pocketItemId];

            if (globalLogic.farFrontElement !== "" && thisItem.screenZ !== 2 && thisItem.screenZ) {
                objects[globalLogic.farFrontElement].logic[pocketItemId] = thisItem;

                globalDOMCach[pocketItemId].objectId = globalLogic.farFrontElement;

            }
            hideTransformed("pocket", pocketItemId, pocketItem.pocket.logic[pocketItemId], "logic");
            delete pocketItem.pocket.logic[pocketItemId];
        }
    }


    globalStates.overlay = 0;

    if (globalStates.guiState ==="node") {
        falseTouchUp();
        if (!globalProgram.objectA && globalStates.drawDotLine) {
            deleteLines(globalStates.drawDotLineX, globalStates.drawDotLineY, evt.clientX, evt.clientY);
        }
        globalStates.drawDotLine = false;
    }
    globalCanvas.hasContent = true;

    overlayDiv.style.display = "none";

    cout("documentPointerUp");


// this is relevant for the pocket button to be interact with
    globalStates.pocketButtonDown = false;
    globalStates.pocketButtonUp = false;


};

/**
 * @desc
 * @param evt
 **/

function documentPointerDown(evt) {

    globalStates.pointerPosition = [evt.clientX, evt.clientY];

    // overlayImg.src = overlayImage[globalStates.overlay].src;

    overlayDiv.style.display = "inline";
    overlayDiv.style.left = evt.clientX - 60;
    overlayDiv.style.top = evt.clientY - 60;


/*
    // todo for testing only

    pocketItemId = uuidTime();


  pocketItem.pocket.logic[pocketItemId] = new Logic();


    var thisItem = pocketItem.pocket.logic[pocketItemId];


    if(globalLogic.farFrontElement==="") {
        thisItem.x = evt.clientX - (globalStates.height / 2);
        thisItem.y = evt.clientY - (globalStates.width / 2);
    }
   // else {
       // var matrixTouch =  screenCoordinatesToMatrixXY(thisItem, [evt.clientX,evt.clientY]);
       // thisItem.x = matrixTouch[0];
       // thisItem.y = matrixTouch[1];
    //}
    thisItem.scale = 1;
    thisItem.loaded = false;

    var thisObject = pocketItem.pocket;
    // this is a work around to set the state of an objects to not being visible.
    thisObject.objectId = "pocket";
    thisObject.name =  "pocket";
    thisObject.objectVisible = false;
    thisObject.screenZ = 1000;
    thisObject.fullScreen = false;
    thisObject.sendMatrix = false;
    thisObject.loaded = false;
    thisObject.integerVersion = 170;
        thisObject.matrix = [];
       // thisObject.logic = {};
        thisObject.protocol = "R1";






    thisObject.visibleCounter = timeForContentLoaded;
    thisObject.objectVisible = true;

    //addElement("pocket", pocketItemId, "nodes/" + thisItem.appearance + "/index.html",  pocketItem.pocket, "logic",globalStates);


*/
    cout("documentPointerDown");
}

/**
 * @desc
 * @param evt
 **/

function MultiTouchStart(evt) {
    evt.preventDefault();
// generate action for all links to be reloaded after upload

    if (globalStates.editingMode && evt.targetTouches.length === 1) {
        console.log("--------------------------------"+this.objectId);
        globalStates.editingModeObject = this.objectId;
        globalStates.editingModeLocation = this.nodeId;
        globalStates.editingModeKind = this.kind;
        globalStates.editingModeHaveObject = true;
    }
    globalMatrix.matrixtouchOn = this.nodeId;
    globalMatrix.copyStillFromMatrixSwitch = true;
    cout("MultiTouchStart");
}

/**
 * @desc
 * @param evt
 **/

function MultiTouchMove(evt) {
    evt.preventDefault();
// generate action for all links to be reloaded after upload

    // cout(globalStates.editingModeHaveObject + " " + globalStates.editingMode + " " + globalStates.editingModeHaveObject + " " + globalStates.editingMode);

    if (globalStates.editingModeHaveObject && globalStates.editingMode && evt.targetTouches.length === 1) {

        var touch = evt.touches[0];

        globalStates.editingModeObjectX = touch.pageX;
        globalStates.editingModeObjectY = touch.pageY;

        var tempThisObject = {};
        if (globalStates.editingModeObject !== globalStates.editingModeLocation) {
            if(globalStates.editingModeKind=== "node")
            tempThisObject = objects[globalStates.editingModeObject].nodes[globalStates.editingModeLocation];
            if(globalStates.editingModeKind=== "logic")
              tempThisObject = objects[globalStates.editingModeObject].logic[globalStates.editingModeLocation];
           // console.log(objects[globalStates.editingModeObject]);
        } else {
            tempThisObject = objects[globalStates.editingModeObject];
        }

       var matrixTouch = screenCoordinatesToMatrixXY(tempThisObject, [touch.pageX, touch.pageY]);

        if (matrixTouch) {
            tempThisObject.x = matrixTouch[0];
            tempThisObject.y = matrixTouch[1];
        }
    }

    if (globalStates.editingModeHaveObject && globalStates.editingMode && evt.targetTouches.length === 2) {
        scaleEvent(evt.touches[1]);
    }

    cout("MultiTouchMove");
}

/**
 * @desc
 * @param evt
 **/

function MultiTouchEnd(evt) {


    evt.preventDefault();
// generate action for all links to be reloaded after upload
    if (globalStates.editingModeHaveObject) {

        cout("start");
        // this is where it should be send to the object..

        var tempThisObject = {};
        if (globalStates.editingModeObject != globalStates.editingModeLocation) {

            if(globalStates.editingModeKind=== "node")
                tempThisObject = objects[globalStates.editingModeObject].nodes[globalStates.editingModeLocation];
            if(globalStates.editingModeKind=== "logic")
                tempThisObject = objects[globalStates.editingModeObject].logic[globalStates.editingModeLocation];

        } else {
            tempThisObject = objects[globalStates.editingModeObject];
        }

        var content = {};
        content.x = tempThisObject.x;
        content.y = tempThisObject.y;
        content.scale = tempThisObject.scale;

        if (globalStates.unconstrainedPositioning === true) {
            multiplyMatrix(tempThisObject.begin, invertMatrix(tempThisObject.temp),tempThisObject.matrix);
            content.matrix = tempThisObject.matrix;

        }

        // todo for now we just send nodes but no logic locations.
        if(globalStates.editingModeKind=== "node") {
            if (typeof content.x === "number" && typeof content.y === "number" && typeof content.scale === "number") {
                postData('http://' + objects[globalStates.editingModeObject].ip + ':' + httpPort + '/object/' + globalStates.editingModeObject + "/size/" + globalStates.editingModeLocation, content);
            }
        }

        globalStates.editingModeHaveObject = false;
        globalCanvas.hasContent = true;
        globalMatrix.matrixtouchOn = "";
    }
    cout("MultiTouchEnd");
}

/**
 * @desc
 * @param evt
 **/

function MultiTouchCanvasStart(evt) {

    globalStates.overlay = 1;

    evt.preventDefault();
// generate action for all links to be reloaded after upload
    if (globalStates.editingModeHaveObject && globalStates.editingMode && evt.targetTouches.length === 1) {

//todo this will move in to the virtual pocket.
        var touch = evt.touches[1];


        globalStates.editingScaleX = touch.pageX;
        globalStates.editingScaleY = touch.pageY;
        globalStates.editingScaledistance = Math.sqrt(Math.pow((globalStates.editingModeObjectX - globalStates.editingScaleX), 2) + Math.pow((globalStates.editingModeObjectY - globalStates.editingScaleY), 2));

        var tempThisObject = {};
        if (globalStates.editingModeObject != globalStates.editingModeLocation) {
            tempThisObject = objects[globalStates.editingModeObject].nodes[globalStates.editingModeLocation];
        } else {
            tempThisObject = objects[globalStates.editingModeObject];
        }
        globalStates.editingScaledistanceOld = tempThisObject.scale;
    }
    cout("MultiTouchCanvasStart");
}

/**
 * @desc
 * @param evt
 **/

function MultiTouchCanvasMove(evt) {
    evt.preventDefault();
// generate action for all links to be reloaded after upload
    if (globalStates.editingModeHaveObject && globalStates.editingMode && evt.targetTouches.length === 1) {
        var touch = evt.touches[1];

        //globalStates.editingModeObjectY
        //globalStates.editingScaleX
        scaleEvent(touch)

    }
    cout("MultiTouchCanvasMove");
}

/**
 * @desc
 * @param touch
 **/

function scaleEvent(touch) {
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
    drawBlue(globalCanvas.context, [globalStates.editingModeObjectX, globalStates.editingModeObjectY], [touch.pageX, touch.pageY], globalStates.editingScaledistance);

    if (thisRadius < globalStates.editingScaledistance) {

        drawRed(globalCanvas.context, [globalStates.editingModeObjectX, globalStates.editingModeObjectY], [touch.pageX, touch.pageY], thisRadius);

    } else {
        drawGreen(globalCanvas.context, [globalStates.editingModeObjectX, globalStates.editingModeObjectY], [touch.pageX, touch.pageY], thisRadius);

    }
    cout("scaleEvent");
}

/**
 * @desc
 * @param url
 * @param body
 **/

function postData(url, body) {

    var request = new XMLHttpRequest();
    var params = JSON.stringify(body);
    request.open('POST', url, true);
    request.onreadystatechange = function () {
        if (request.readyState == 4) cout("It worked!");
    };
    request.setRequestHeader("Content-type", "application/json");
    //request.setRequestHeader("Content-length", params.length);
    // request.setRequestHeader("Connection", "close");
    request.send(params);
    cout("postData");
}

/**
 * @desc
 * @param url
 **/

function deleteData(url) {

    var request = new XMLHttpRequest();
    request.open('DELETE', url, true);
    request.onreadystatechange = function () {
        if (request.readyState == 4) cout("It deleted!");
    };
    request.setRequestHeader("Content-type", "application/json");
    //request.setRequestHeader("Content-length", params.length);
    // request.setRequestHeader("Connection", "close");
    request.send();
    cout("deleteData");
}

/**
 * @desc
 * @param ip
 * @param thisObjectKey
 * @param thisKey
 * @param content
 **/

function uploadNewLink(ip, thisObjectKey, thisKey, content) {
// generate action for all links to be reloaded after upload
    cout("sending Link");
    postData('http://' + ip + ':' + httpPort + '/object/' + thisObjectKey + "/link/" + thisKey, content);
    // postData('http://' +ip+ ':' + httpPort+"/", content);
    cout("uploadNewLink");

}

/**
 * @desc
 * @param ip
 * @param thisObjectKey
 * @param thisKey
 * @return
 **/

function deleteLinkFromObject(ip, thisObjectKey, thisKey) {
// generate action for all links to be reloaded after upload
    cout("I am deleting a link: " + ip);
    deleteData('http://' + ip + ':' + httpPort + '/object/' + thisObjectKey + "/link/" + thisKey);
    cout("deleteLinkFromObject");
}

/**
 * @desc
 **/

function addEventHandlers() {

    globalCanvas.canvas.addEventListener("touchstart", MultiTouchCanvasStart, false);
    ec++;
    globalCanvas.canvas.addEventListener("touchmove", MultiTouchCanvasMove, false);
    ec++;

    for (var thisKey in objects) {
        var generalObject2 = objects[thisKey];

        if (generalObject2.developer) {

            if (document.getElementById(thisKey)) {
                var thisObject3 = document.getElementById(thisKey);
                //  if (globalStates.guiState) {
                thisObject3.style.visibility = "visible";

                var thisObject4 = document.getElementById("canvas" + thisKey);
                thisObject4.style.display = "inline";

                // }

                // thisObject3.className = "mainProgram";

                thisObject3.addEventListener("touchstart", MultiTouchStart, false);
                ec++;
                thisObject3.addEventListener("touchmove", MultiTouchMove, false);
                ec++;
                thisObject3.addEventListener("touchend", MultiTouchEnd, false);
                ec++;
                //}
            }

            for (var thisSubKey in generalObject2.nodes) {
                if (document.getElementById(thisSubKey)) {
                    var thisObject2 = document.getElementById(thisSubKey);

                    //thisObject2.className = "mainProgram";

                    var thisObject5 = document.getElementById("canvas" + thisSubKey);
                    thisObject5.style.display = "inline";

                    //if(thisObject.developer) {
                    thisObject2.addEventListener("touchstart", MultiTouchStart, false);
                    ec++;
                    thisObject2.addEventListener("touchmove", MultiTouchMove, false);
                    ec++;
                    thisObject2.addEventListener("touchend", MultiTouchEnd, false);
                    ec++;
                    //}
                }
            }
        }
    }

    cout("addEventHandlers");
}

/**
 * @desc
 **/

function removeEventHandlers() {

    globalCanvas.canvas.removeEventListener("touchstart", MultiTouchCanvasStart, false);
    ec--;
    globalCanvas.canvas.removeEventListener("touchmove", MultiTouchCanvasMove, false);
    ec--;
    for (var thisKey in objects) {
        var generalObject2 = objects[thisKey];
        if (generalObject2.developer) {
            if (document.getElementById(thisKey)) {
                var thisObject3 = document.getElementById(thisKey);
                thisObject3.style.visibility = "hidden";
                // this is a typo but maybe relevant?
                //  thisObject3.className = "mainEditing";

                document.getElementById("canvas" + thisKey).style.display = "none";

                thisObject3.removeEventListener("touchstart", MultiTouchStart, false);
                thisObject3.removeEventListener("touchmove", MultiTouchMove, false);
                thisObject3.removeEventListener("touchend", MultiTouchEnd, false);
                ec--;
                ec--;
                ec--;
                //  }
            }

            for (var thisSubKey in generalObject2.nodes) {
                if (document.getElementById(thisSubKey)) {
                    var thisObject2 = document.getElementById(thisSubKey);
                    //thisObject2.className = "mainEditing";
                    document.getElementById("canvas" + thisSubKey).style.display = "none";

                    //    if(thisObject.developer) {
                    thisObject2.removeEventListener("touchstart", MultiTouchStart, false);
                    thisObject2.removeEventListener("touchmove", MultiTouchMove, false);
                    thisObject2.removeEventListener("touchend", MultiTouchEnd, false);
                    ec--;
                    ec--;
                    ec--;
                    //  }
                }
            }

        }
    }

    cout("removeEventHandlers");
}

/**********************************************************************************************************************
 ************************************** datacrafting event handlers  *************************************************
 **********************************************************************************************************************/

// clicking down on a block enables drawing a temporary link from this block
// (this behavior continues in the blockPointerLeave method)
function blockPointerDown(e) {
    e.preventDefault();

    if (e.target.cell.blockAtThisLocation()) {
        isPointerDown = true;
        setTimeout( function() {
            if (isPointerDown && !isTempLinkBeingDrawn) {
                cellToMoveBlockFrom = e.target.cell;
                isMarginSelected = false;
                var firstCell = e.target.cell;
                var blockWidth = e.target.cell.blockAtThisLocation().blockSize;
                var itemSelected = e.target.cell.itemAtThisLocation();
                var allCellsForThisBlock = globalStates.currentLogic.grid.getCellsOver(firstCell,blockWidth,itemSelected,true);
                highlightCellsBlocksForMove(allCellsForThisBlock);
            }
        }, 500);
    }
}

// if your pointer leaves a filled block and the pointer is down, start drawing temp link from this source
function blockPointerLeave(e) {
    e.preventDefault();

    isPointerInActiveBlock = false;
    if (e.target.cell.blockAtThisLocation() === null) return;
    if (isPointerDown && cellToMoveBlockFrom) {
        removeBlockFromCellAndCreateTempBlockAt(cellToMoveBlockFrom, e.pageX, e.pageY);
    } else if (isPointerDown && !isTempLinkBeingDrawn) {
        isTempLinkBeingDrawn = true;
        tempStartBlock = e.target.cell.blockAtThisLocation();
        tempStartItem = e.target.cell.itemAtThisLocation();
        tempLine.start = {
            x: globalStates.currentLogic.grid.getCellCenterX(e.target.cell),
            y: globalStates.currentLogic.grid.getCellCenterY(e.target.cell)
        }
        var startColor = e.target.cell.getColorHSL();
        tempLine.color = 'hsl('+startColor.h+','+startColor.s+'%,'+startColor.l+'%)';
    }
}

// if your pointer enters a different block while temp link is being drawn, render a new link to that destination
function blockPointerEnter(e) {
    e.preventDefault();

    if (e.target.cell.blockAtThisLocation() === null) return;
    isPointerInActiveBlock = true;
    if (isTempLinkBeingDrawn) {
        tempEndBlock = e.target.cell.blockAtThisLocation();
        if (!tempStartBlock || !tempEndBlock) return;
        // erases temp link if you enter the start block again
        var newTempLink = null;
        if (tempStartBlock !== tempEndBlock) {
            newTempLink = addBlockLink(tempStartBlock, tempEndBlock, tempStartItem, e.target.cell.itemAtThisLocation(), false);
        }
        setTempLink(newTempLink);
        updateGrid(globalStates.currentLogic.grid); // need to recalculate routes with new temp link
    }
}

// if you release the pointer over a block, the temporary link becomes permanent
function blockPointerUp(e) {
    var tempLink = globalStates.currentLogic.tempLink;
    e.preventDefault();

    if (e.target.cell.blockAtThisLocation() === null) return;
    isPointerDown = false;
    isTempLinkBeingDrawn = false;
    tempLine.start = null;
    tempLine.end = null;
    if (cellToMoveBlockFrom) {
        var firstCell = e.target.cell;
        var blockWidth = e.target.cell.blockAtThisLocation().blockSize;
        var itemSelected = e.target.cell.itemAtThisLocation();
        var allCellsForThisBlock = globalStates.currentLogic.grid.getCellsOver(firstCell,blockWidth,itemSelected,true);
        unhighlightCellsBlocksForMove(allCellsForThisBlock);
    }
    cellToMoveBlockFrom = null;
    isMarginSelected = false;
    if (tempLink) {
        //only create link if identical link doesn't already exist
        if (!doesLinkAlreadyExist(tempLink)) {
            // add link to data structure
            var addedLink = addBlockLink(tempLink.blockA, tempLink.blockB, tempLink.itemA, tempLink.itemB, true);
            if (addedLink) {
                addedLink.route = tempLink.route; // copy over the route rather than recalculating everything
                addedLink.ballAnimationCount = tempLink.ballAnimationCount;
            }
        }
        setTempLink(null);
    }
}

function datacraftingContainerPointerLeave(e) {
    datacraftingContainerPointerUp(e, true);
}

// releasing pointer anywhere on datacrafting container deletes a temp link
// if drawing one, or executes a cut line to delete links it crosses
function datacraftingContainerPointerUp(e, didPointerLeave) {
    var tempBlock = globalStates.currentLogic.tempBlock;
    var grid = globalStates.currentLogic.grid;
    e.preventDefault();

    if (isCutLineBeingDrawn) {
        isCutLineBeingDrawn = false;
        if (cutLine.start && cutLine.end){
            checkForCutIntersections();
        }
        cutLine.start = null;
        cutLine.end = null;
    }
    if (isTempLinkBeingDrawn) {
        tempLine.start = null;
        tempLine.end = null;
    }
    if (!isPointerInActiveBlock) {
        isPointerDown = false;
        isTempLinkBeingDrawn = false;
        setTempLink(null);
    }
    var cellOver = grid.getCellFromPointerPosition(e.pageX, e.pageY);
    if (cellOver) {
        var marginBlockOver = cellOver.blockOverlappingThisMargin();
        if (marginBlockOver) {
            var cellToMoveFrom = grid.getCell(cellOver.location.col-1,cellOver.location.row);
            var blockWidth = marginBlockOver.blockSize;
            var itemSelected = cellToMoveFrom.itemAtThisLocation();
            var allCellsForThisBlock = grid.getCellsOver(cellToMoveFrom,blockWidth,itemSelected,true);
            unhighlightCellsBlocksForMove(allCellsForThisBlock);
        }
    }
    if (tempBlock) {
        tempBlock.domElement.parentNode.removeChild(tempBlock.domElement);
        if (!didPointerLeave) { // no possibility of converting temp block to permanent block if event was triggered by dragging out onto the menu
            var marginOffset = isMarginSelected ? (grid.blockColWidth + grid.marginColWidth)/2 : 0;
            var firstCellOver = grid.getCellFromPointerPosition(e.pageX-marginOffset, e.pageY);
            var canAddBlock = canAddBlockAtCell(firstCellOver, tempBlock);
            var blockPos = null;
            if (canAddBlock) {
                // add block to new cell position
                blockPos = convertGridPosToBlockPos(firstCellOver.location.col, firstCellOver.location.row);
            } else if (cellToMoveBlockFrom) {
                // if pointerup while moving a block and you're not on a cell it can be added to, return it to its starting position
                blockPos = convertGridPosToBlockPos(cellToMoveBlockFrom.location.col, cellToMoveBlockFrom.location.row);
            }
            if (blockPos) {
                blockPos.x -= tempBlock.itemSelected; // offset so selected item stays on pointer
                var block = addBlock(blockPos.x, blockPos.y, tempBlock.width, tempBlock.name);
                if (tempBlock.incomingLinks) {
                    tempBlock.incomingLinks.forEach( function(linkData) {
                        addBlockLink(linkData.blockA, block, linkData.itemA, linkData.itemB, true);
                    });
                }
                if (tempBlock.outgoingLinks) {
                    tempBlock.outgoingLinks.forEach( function(linkData) {
                        addBlockLink(block, linkData.blockB, linkData.itemA, linkData.itemB, true);
                    });
                }
                updateGrid(grid);
            }
        }
        globalStates.currentLogic.tempBlock = null;
    }
    cellToMoveBlockFrom = null;
    isMarginSelected = false;
}

// clicking down in datacrafting container outside of blocks creates a new cut line
function datacraftingContainerPointerDown(e) {
    var grid = globalStates.currentLogic.grid;
    e.preventDefault();

    var cellOver = grid.getCellFromPointerPosition(e.pageX, e.pageY);
    var marginBlockOver = cellOver.blockOverlappingThisMargin();
    if (marginBlockOver) {
        isPointerDown = true;
        setTimeout( function() {
            console.log("start move, not link");
            if (isPointerDown && !isTempLinkBeingDrawn) {
                var cellOver = grid.getCellFromPointerPosition(e.pageX, e.pageY);
                cellToMoveBlockFrom = grid.getCell(cellOver.location.col-1,cellOver.location.row);
                isMarginSelected = true;
                var blockWidth = marginBlockOver.blockSize;
                var itemSelected = cellToMoveBlockFrom.itemAtThisLocation();
                var allCellsForThisBlock = grid.getCellsOver(cellToMoveBlockFrom,blockWidth,itemSelected,true);
                highlightCellsBlocksForMove(allCellsForThisBlock);
            }
        }, 500);
    } else if (!isCutLineBeingDrawn && !isPointerInActiveBlock) {
        isCutLineBeingDrawn = true;
        cutLine.start = {
            x: e.pageX,
            y: e.pageY
        };
    }
}

// moving pointer in datacrafting container updates endpoint of cut line
function datacraftingContainerPointerMove(e) {
    var tempBlock = globalStates.currentLogic.tempBlock;
    var grid = globalStates.currentLogic.grid;
    e.preventDefault();

    if (isCutLineBeingDrawn) {
        cutLine.end = {
            x: e.pageX,
            y: e.pageY
        };
    }
    if (isTempLinkBeingDrawn) {
        tempLine.end = {
            x: e.pageX,
            y: e.pageY
        };
    }
    if (tempBlock) {
        var marginOffset = isMarginSelected ? (grid.blockColWidth + grid.marginColWidth)/2 : 0;
        tempBlock.domElement.style.left = e.pageX - grid.blockColWidth/2 - tempBlock.itemSelected * (grid.blockColWidth + grid.marginColWidth) - marginOffset;
        tempBlock.domElement.style.top = e.pageY - grid.blockRowHeight/2;
        // check if we are over a valid set of cells - if so, opacity=1, if not opacity=0.75
        var firstCellOver = grid.getCellFromPointerPosition(e.pageX-marginOffset, e.pageY);
        var canAddBlock = canAddBlockAtCell(firstCellOver, tempBlock);
        if (canAddBlock) {
            tempBlock.domElement.style.opacity = 1.00;

            // snap block to grid if you can add it at this cell
            var dX = Math.abs(e.pageX - grid.getCellCenterX(firstCellOver) - marginOffset) / (grid.blockColWidth/2);
            var dY = Math.abs(e.pageY - grid.getCellCenterY(firstCellOver)) / (grid.blockRowHeight/2);
            var shouldSnap = (dX * dX + dY * dY) < 0.5; // only snaps to grid if tighter bound is overlapped
            if (shouldSnap) {
                var snappedLeft = grid.getCellCenterX(firstCellOver) - grid.blockColWidth/2 - tempBlock.itemSelected * (grid.blockColWidth + grid.marginColWidth);
                var snappedTop = grid.getCellCenterY(firstCellOver) - grid.blockRowHeight/2;
                tempBlock.domElement.style.left = snappedLeft;
                tempBlock.domElement.style.top = snappedTop;
            }

        } else {
            tempBlock.domElement.style.opacity = 0.50;
        }

    } else {
        var cellOver = grid.getCellFromPointerPosition(e.pageX, e.pageY);
        if (isPointerDown && cellToMoveBlockFrom && cellToMoveBlockFrom !== cellOver) {
            removeBlockFromCellAndCreateTempBlockAt(cellToMoveBlockFrom, e.pageX, e.pageY);
        }
    }
}

function removeBlockFromCellAndCreateTempBlockAt(cellToMove, pageX, pageY) {
    // remove block from cellToMove
    var blockToMove = cellToMove.blockAtThisLocation();
    if (blockToMove) {
        var blockSize = blockToMove.blockSize;
        var itemSelected = cellToMove.itemAtThisLocation();
        if (cellToMove) {
            var allCellsForThisBlock = globalStates.currentLogic.grid.getCellsOver(cellToMoveBlockFrom,blockSize,itemSelected,true);
            unhighlightCellsBlocksForMove(allCellsForThisBlock);
        }
        var incomingLinks = [];
        var outgoingLinks = [];
        for (var linkKey in globalStates.currentLogic.links) {
            var link = globalStates.currentLogic.links[linkKey];
            if (link.blockB === blockToMove) {
                incomingLinks.push({
                    blockA: link.blockA,
                    itemA: link.itemA,
                    itemB: link.itemB
                });
            
            } else if (link.blockA === blockToMove) {
                outgoingLinks.push({
                    itemA: link.itemA,
                    blockB: link.blockB,
                    itemB: link.itemB
                });
            }
        }
        removeBlock(globalStates.currentLogic, blockToMove);
        updateGrid(globalStates.currentLogic.grid);
        // add temp block to pointer
        createTempBlockOnPointer(blockSize, pageX, pageY, itemSelected, incomingLinks, outgoingLinks);
    }
    // cellToMoveBlockFrom = null;
}

function createTempBlockOnPointer(blockSize, centerX, centerY, itemSelected, incomingLinks, outgoingLinks) {
    var grid = globalStates.currentLogic.grid;

    var newBlockImg = document.createElement('div');
    newBlockImg.setAttribute("class", "newBlock"+blockSize);
    newBlockImg.setAttribute("id", "newBlock"+uuidTime());
    newBlockImg.setAttribute("touch-action", "none");
    newBlockImg.style.opacity = 0.75;
    var marginOffset = isMarginSelected ? (grid.blockColWidth + grid.marginColWidth)/2 : 0;
    var leftPositionWithoutMargin = (centerX - grid.blockColWidth/2 - itemSelected * (grid.blockColWidth + grid.marginColWidth));
    newBlockImg.style.left = (leftPositionWithoutMargin - marginOffset) + "px";
    newBlockImg.style.top = (centerY - grid.blockRowHeight/2) + "px";
    globalStates.currentLogic.tempBlock = {
        domElement: newBlockImg,
        name: "test", //todo: change this to represent which block you are adding
        width: blockSize,
        itemSelected: itemSelected,
        incomingLinks: incomingLinks,
        outgoingLinks: outgoingLinks
    };
    var blocksContainer = document.getElementById('blocks');
    blocksContainer.appendChild(newBlockImg);
}
