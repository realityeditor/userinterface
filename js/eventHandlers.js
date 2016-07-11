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
    console.log(this.nodeId);
    if (!globalStates.editingMode) {
        if (globalStates.guiState ==="node") {
            if (!globalProgram.objectA) {
                globalProgram.objectA = this.objectId;
                globalProgram.nodeA = this.nodeId;

                if(objects[this.objectId].nodes[this.nodeId].type === "logic"){
                    globalProgram.logicA = 0;
                }

               // if(this.type === "logic")
                 //   globalProgram.logicA = globalProgram.logicSelector;
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
        globalProgram.logicSelector = 4;
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

            if(this.nodeId === globalProgram.nodeA && this.type === "logic"){
                craftingBoardVisible(this.objectId, this.nodeId);
            }

            var thisTempObject = objects[globalProgram.objectA];
            var thisTempObjectLinks = thisTempObject.links;

            globalProgram.objectB = this.objectId;
            globalProgram.nodeB = this.nodeId;
          //  if(this.type === "logic")
            //    globalProgram.logicB = globalProgram.logicSelector;

            var thisOtherTempObject = objects[globalProgram.objectB];

            var okForNewLink = checkForNetworkLoop(globalProgram.objectA, globalProgram.nodeA, globalProgram.logicA, globalProgram.objectB, globalProgram.nodeB, globalProgram.logicB);

            //  window.location.href = "of://event_" + objects[globalProgram.objectA].visible;

            if (okForNewLink) {
                var thisKeyId = uuidTimeShort();

                var namesA, namesB;

                    if(globalProgram.logicA !== false){

                        var color;

                        if(globalProgram.logicA === 0) color = "BLUE";
                        if(globalProgram.logicA === 1) color = "GREEN";
                        if(globalProgram.logicA === 2) color = "YELLOW";
                        if(globalProgram.logicA === 3) color = "RED";

                        namesA = [thisTempObject.name, thisTempObject.nodes[globalProgram.nodeA].name +":"+color];
                    } else {
                        namesA =  [thisTempObject.name, thisTempObject.nodes[globalProgram.nodeA].name];
                    }

                    if(globalProgram.logicB !== false){

                        var color;

                        if(globalProgram.logicB === 0) color = "BLUE";
                        if(globalProgram.logicB === 1) color = "GREEN";
                        if(globalProgram.logicB === 2) color = "YELLOW";
                        if(globalProgram.logicB === 3) color = "RED";

                        namesB = [thisOtherTempObject.name, thisOtherTempObject.nodes[globalProgram.nodeB].name +":"+color];
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
              //  if(globalProgram.logicA === false && globalProgram.logicB === false) {
                    uploadNewLink(thisTempObject.ip, globalProgram.objectA, thisKeyId, thisTempObjectLinks[thisKeyId]);
              //  }
            }

            // set everything back to false
            globalProgram.objectA = false;
            globalProgram.nodeA = false;
            globalProgram.logicA = false;
            globalProgram.objectB = false;
            globalProgram.nodeB = false;
            globalProgram.logicB = false;
            globalProgram.logicSelector = 4;
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

        globalProgram.logicSelector = 4;

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
    evt.preventDefault();
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
    evt.preventDefault();

    globalStates.pointerPosition = [evt.clientX, evt.clientY];

    overlayDiv.style.left = evt.clientX - 60;
    overlayDiv.style.top = evt.clientY - 60;


    setPocketPossition(evt);

}


function setPocketPossition (evt){


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

        if (pocketItem.pocket.nodes[pocketItemId]) {

            globalLogic.farFrontElement = "";
            globalLogic.frontDepth = 10000000000;

            for (var thisOtherKey in globalObjects) {
                if (globalObjects[thisOtherKey][14] < globalLogic.frontDepth) {
                    globalLogic.frontDepth = globalObjects[thisOtherKey][14];
                    globalLogic.farFrontElement = thisOtherKey;
                }
            }

            var thisItem = pocketItem.pocket.nodes[pocketItemId];

            if (globalLogic.farFrontElement !== "" && thisItem.screenZ !== 2 && thisItem.screenZ) {

                var logicCount = 0;
                for(var key in objects[globalLogic.farFrontElement].nodes) {
                    if(objects[globalLogic.farFrontElement].nodes[key].type === "logic"){
                      logicCount++;
                    }
                }
                thisItem.name = "LOGIC"+logicCount;

                objects[globalLogic.farFrontElement].nodes[pocketItemId] = thisItem;

                globalDOMCach[pocketItemId].objectId = globalLogic.farFrontElement;

                uploadNewLogicNode(objects[globalLogic.farFrontElement].ip, globalLogic.farFrontElement, pocketItemId, thisItem);

            }
            hideTransformed("pocket", pocketItemId, pocketItem.pocket.nodes[pocketItemId], "logic");
            delete pocketItem.pocket.nodes[pocketItemId];
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

    overlayDiv.style.visibility = "hidden";

    overlayDiv.classList.remove('overlayMemory');
    if (overlayDiv.style.background) {
        overlayDiv.style.background = '';
        window.location.href = 'of://clearMemory';
    }

    cout("documentPointerUp");


// this is relevant for the pocket button to be interact with
    globalStates.pocketButtonDown = false;
    globalStates.pocketButtonUp = false;


};

/**
 * When the pointer goes down, show the overlay and position it at the
 * pointer's location. If in GUI mode, mark the overlay as holding a memory
 * Save its location to globalStates.pointerPosition
 * @param evt
 */
function documentPointerDown(evt) {
    globalStates.pointerPosition = [evt.clientX, evt.clientY];

    // overlayImg.src = overlayImage[globalStates.overlay].src;
    overlayDiv.style.display = "inline";
    overlayDiv.style.left = evt.clientX - 60;
    overlayDiv.style.top = evt.clientY - 60;
    if (globalStates.guiButtonState) {
        overlayDiv.classList.add('overlayMemory');
    }

/*
    // todo for testing only

    pocketItemId = uuidTime();


  pocketItem.pocket.nodes[pocketItemId] = new Logic();


    var thisItem = pocketItem.pocket.nodes[pocketItemId];


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
       // thisObject.nodes = {};
        thisObject.protocol = "R1";






    thisObject.visibleCounter = timeForContentLoaded;
    thisObject.objectVisible = true;

    //addElement("pocket", pocketItemId, "nodes/" + thisItem.type + "/index.html",  pocketItem.pocket, "logic",globalStates);


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
        globalStates.editingModeKind = this.type;
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

            tempThisObject = objects[globalStates.editingModeObject].nodes[globalStates.editingModeLocation];
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

                tempThisObject = objects[globalStates.editingModeObject].nodes[globalStates.editingModeLocation];

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

        // todo for now we just send nodes but no logic locations. ---- Became obsolete because the logic nodes are now normal nodes
      //  if(globalStates.editingModeKind=== "node") {
            if (typeof content.x === "number" && typeof content.y === "number" && typeof content.scale === "number") {
                postData('http://' + objects[globalStates.editingModeObject].ip + ':' + httpPort + '/object/' + globalStates.editingModeObject + "/size/" + globalStates.editingModeLocation, content);
            }
       // }

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
 * @param ip
 * @param thisObjectKey
 * @param thisKey
 * @param content
 **/

function uploadNewLogicNode(ip, thisObjectKey, thisLogicKey, logic) {
    cout("sending Logic Node");
    // /logic/*/*/node/
    var simpleLogic = convertLogicToServerFormat(logic);
    postData('http://' + ip + ':' + httpPort + '/logic/' + thisObjectKey + "/" + thisLogicKey + "/node/", simpleLogic);
    // postData('http://' +ip+ ':' + httpPort+"/", content);
    cout("uploadNewLogicNode");
}

/**
 * @desc
 * @param ip
 * @param thisObjectKey
 * @param thisKey
 * @param content
 **/

function uploadNewBlock(ip, thisObjectKey, thisLogicKey, thisBlockKey, block) {
    cout("sending Block");
    // /logic/*/*/block/*/
    postData('http://' + ip + ':' + httpPort + '/logic/' + thisObjectKey + "/" + thisLogicKey + "/block/" + thisBlockKey, block);
    // postData('http://' +ip+ ':' + httpPort+"/", content);
    cout("uploadNewBlock");
}

/**
 * @desc
 * @param ip
 * @param thisObjectKey
 * @param thisKey
 * @return
 **/

function deleteBlockFromObject(ip, thisObjectKey, thisLogicKey, thisBlockKey) {
// generate action for all links to be reloaded after upload
    cout("I am deleting a block: " + ip);
    // /logic/*/*/block/*/
    deleteData('http://' + ip + ':' + httpPort + '/logic/' + thisObjectKey + "/" + thisLogicKey + "/block/" + thisBlockKey);
    cout("deleteBlockFromObject");
}

/**
 * @desc
 * @param ip
 * @param thisObjectKey
 * @param thisKey
 * @return
 **/

function moveBlockPosition(ip, thisObjectKey, thisLogicKey, thisBlockKey, content) {
// generate action for all links to be reloaded after upload
    cout("I am moving a block: " + ip);
    // /logic/*/*/block/*/
    if (typeof content.x === "number" && typeof content.y === "number") {
        postData('http://' + ip + ':' + httpPort + '/logic/' + thisObjectKey + "/" + thisLogicKey +"/blockPosition/" + thisBlockKey, content);
        cout("moveBlockPosition");
    }
}

/**
 * @desc
 * @param ip
 * @param thisObjectKey
 * @param thisKey
 * @param content
 **/

function uploadNewBlockLink(ip, thisObjectKey, thisLogicKey, thisBlockLinkKey, blockLink) {
    cout("sending Block Link");
    var simpleBlockLink = convertBlockLinkToServerFormat(blockLink);

    // /logic/*/*/link/*/
    postData('http://' + ip + ':' + httpPort + '/logic/' + thisObjectKey + "/" + thisLogicKey + "/link/" + thisBlockLinkKey, simpleBlockLink);
    // postData('http://' +ip+ ':' + httpPort+"/", content);
    cout("uploadNewBlockLink");
}

/**
 * @desc
 * @param ip
 * @param thisObjectKey
 * @param thisKey
 * @return
 **/

function deleteBlockLinkFromObject(ip, thisObjectKey, thisLogicKey, thisBlockLinkKey) {
// generate action for all links to be reloaded after upload
    cout("I am deleting a block link: " + ip);
    // /logic/*/*/link/*/
    deleteData('http://' + ip + ':' + httpPort + '/logic/' + thisObjectKey + "/" + thisLogicKey + "/link/" + thisBlockLinkKey);
    cout("deleteBlockLinkFromObject");
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
