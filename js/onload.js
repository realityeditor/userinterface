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
 ******************************************** onload content **********************************************************
 **********************************************************************************************************************/

/**
 * @desc
 **/

window.onload = function () {

    console.log("starting up GUI");
    uiButtons = document.getElementById("GUI");
    guiButtonImage= document.getElementById("guiButtonImage");
    overlayDiv = document.getElementById('overlay');
    globalSVGCach["overlayImgRing"] = document.getElementById('overlayImg').getElementById('overlayImgRing');

    GUI();

    console.log(globalStates.platform);

    if (globalStates.platform !== 'iPad' && globalStates.platform !== 'iPhone' && globalStates.platform !== 'iPod touch') {
        globalStates.platform = false;
    }



    if (globalStates.platform === 'iPhone') {
        document.getElementById("logButtonDiv").style.visibility = "hidden";
        // document.getElementById("reloadButtonDiv").style.visibility = "hidden";
        //   document.getElementById("preferencesButtonDiv").style.bottom = "36px";

        var editingInterface = document.getElementById("content2title");
        editingInterface.style.fontSize = "12px";
        editingInterface.style.left = "38%";
        editingInterface.style.right = "22%";

        editingInterface = document.getElementById("content1title");
        editingInterface.style.fontSize = "12px";
        editingInterface.style.left = "2%";
        editingInterface.style.right = "65%";

        editingInterface = document.getElementById("content2");
        editingInterface.style.fontSize = "9px";
        editingInterface.style.left = "38%";
        editingInterface.style.right = "22%";
        editingInterface.style.bottom = "14%";

        editingInterface = document.getElementById("content11");
        editingInterface.style.fontSize = "12px";
        editingInterface.style.width = "40%";

        editingInterface = document.getElementById("content12");
        editingInterface.style.fontSize = "12px";
        editingInterface.style.width = "60%";

        editingInterface = document.getElementById("content13");
        editingInterface.style.fontSize = "12px";
        editingInterface.style.width = "40%";

        editingInterface = document.getElementById("content14");
        editingInterface.style.fontSize = "12px";
        editingInterface.style.width = "60%";

        editingInterface = document.getElementById("content15");
        editingInterface.style.fontSize = "12px";
        editingInterface.style.width = "40%";
        editingInterface.innerHTML = '<b>External Interface</b><br>';

        editingInterface = document.getElementById("content16");
        editingInterface.style.fontSize = "12px";
        editingInterface.style.width = "60%";

        editingInterface = document.getElementById("content18");
        editingInterface.style.visibility = 'hidden';

        editingInterface = document.getElementById("content1");
        editingInterface.style.fontSize = "12px";
        editingInterface.style.left = "2%";
        editingInterface.style.right = "65%";
        editingInterface.style.bottom = "14%";

    } else {
        editingInterface = document.getElementById("content15");
        editingInterface.style.paddingTop = "13px";

        editingInterface = document.getElementById("content20");
        editingInterface.innerHTML = '<input id="newURLText"' +

            "style='text-align: left; font-family: Helvetica Neue, Helvetica, Arial; font-size: large;   -webkit-user-select: text;'" +
            'type="text" name="newURL"  size="27" placeholder="http://..."' + "oninput='newURLTextLoad()'><br>";
    }

    globalCanvas.canvas = document.getElementById('canvas');
    globalCanvas.canvas.width = globalStates.height;
    globalCanvas.canvas.height = globalStates.width;

    globalCanvas.context = canvas.getContext('2d');

    if (globalStates.platform) {
        window.location.href = "of://kickoff";
    }

    document.handjs_forcePreventDefault = true;
    globalCanvas.canvas.handjs_forcePreventDefault = true;

    globalCanvas.canvas.addEventListener("pointerdown", canvasPointerDown, false);
    ec++;

    document.addEventListener("pointermove", getPossition, false);
    ec++;
    document.addEventListener("pointerdown", documentPointerDown, false);
    //document.addEventListener("pointerdown", getPossition, false);
    ec++;
    document.addEventListener("pointerup", documentPointerUp, false);
    ec++;
    window.addEventListener("message", postMessage, false);
    ec++;
    overlayDiv.addEventListener('touchstart', function (e) {
        e.preventDefault();
    });

    cout("onload");

};

/**
 * @desc
 * @param e
 * @return {}
 **/

function postMessage(e) {


    var msgContent ={};
    if(e.data){
        msgContent = JSON.parse(e.data);

    } else {
        msgContent = JSON.parse(e);
    }
    
    var tempThisObject = {};
    var thisVersionNumber;

    if (!msgContent.version) {
        thisVersionNumber = 0;
    }
    else {
        thisVersionNumber = msgContent.version;
    }

    if (thisVersionNumber >= 170) {
        if ((!msgContent.object) || (!msgContent.object)) return;
    } else {
        if ((!msgContent.obj) || (!msgContent.pos)) return;
        msgContent.object = msgContent.obj;
        msgContent.node = msgContent.pos;
    }

    if (msgContent.object in objects) {
        if (msgContent.node === msgContent.object) {
            tempThisObject = objects[msgContent.object];
        } else
            if (msgContent.node in objects[msgContent.object].nodes) {
                tempThisObject = objects[msgContent.object].nodes[msgContent.node];
            } else
            if (msgContent.node in objects[msgContent.object].logic) {
                tempThisObject = objects[msgContent.object].logic[msgContent.node];
            } else return;

    } else if(msgContent.object in pocketItem){
        if (msgContent.node === msgContent.object) {
            tempThisObject = pocketItem[msgContent.object];
        } else {
            if (msgContent.node in pocketItem[msgContent.object].logic) {
                tempThisObject = pocketItem[msgContent.object].logic[msgContent.node];
            } else return;
        }

    } else return;

    if (msgContent.width && msgContent.height) {
        var thisMsgNode = document.getElementById(msgContent.node);
        thisMsgNode.style.width = msgContent.width;
        thisMsgNode.style.height = msgContent.height;
        thisMsgNode.style.top = ((globalStates.width - msgContent.height) / 2);
        thisMsgNode.style.left = ((globalStates.height - msgContent.width) / 2);

        thisMsgNode = document.getElementById("iframe" + msgContent.node);
        thisMsgNode.style.width = msgContent.width;
        thisMsgNode.style.height = msgContent.height;
        thisMsgNode.style.top = ((globalStates.width - msgContent.height) / 2);
        thisMsgNode.style.left = ((globalStates.height - msgContent.width) / 2);

    }

    if (typeof msgContent.sendMatrix !== "undefined") {

        if (msgContent.sendMatrix === true) {

            if (tempThisObject.integerVersion >= 32) {

                tempThisObject.sendMatrix = true;
                document.getElementById("iframe" + msgContent.node).contentWindow.postMessage(
                    '{"projectionMatrix":' + JSON.stringify(globalStates.realProjectionMatrix) + "}", '*');
            }
        }
    }


    if (typeof msgContent.sendAcceleration !== "undefined") {
console.log(msgContent.sendAcceleration);
        if (msgContent.sendAcceleration === true) {

            if (tempThisObject.integerVersion >= 32) {

                tempThisObject.sendAcceleration = true;

                if(globalStates.sendAcceleration === false) {
                    globalStates.sendAcceleration = true;
                    if (window.DeviceMotionEvent) {
                        console.log("motion activated");

                        window.addEventListener("deviceorientation", function () {

                        });

                        window.addEventListener("devicemotion", function () {

                            var thisState = globalStates.acceleration;

                            thisState.x = event.acceleration.x;
                            thisState.y = event.acceleration.y;
                            thisState.z = event.acceleration.z;

                            thisState.alpha = event.rotationRate.alpha;
                            thisState.beta = event.rotationRate.beta;
                            thisState.gamma = event.rotationRate.gamma;

                            // Manhattan Distance :-D
                            thisState.motion =
                                Math.abs(thisState.x) +
                                Math.abs(thisState.y) +
                                Math.abs(thisState.z) +
                                Math.abs(thisState.alpha) +
                                Math.abs(thisState.beta) +
                                Math.abs(thisState.gamma);

                        }, false);
                    } else {
                        console.log("DeviceMotionEvent is not supported");
                    }
                }
            }
        }
    }

    if (msgContent.globalMessage) {
        var iframes = document.getElementsByTagName('iframe');
        for (var i = 0; i < iframes.length; i++) {

            if (iframes[i].id !== "iframe" + msgContent.node && iframes[i].style.visibility !== "hidden") {
                var receivingObject = objects[iframes[i].id.substr(6)];
                if (receivingObject.integerVersion >= 32) {
                    var msg = {};
                    if (receivingObject.integerVersion >= 170) {
                        msg = {globalMessage: msgContent.globalMessage};
                    } else {
                        msg = {ohGlobalMessage: msgContent.ohGlobalMessage};
                    }
                    iframes[i].contentWindow.postMessage(JSON.stringify(msg), "*");
                }
            }
        }
    }

        if (typeof msgContent.fullScreen === "boolean") {
            // console.log("gotfullscreenmessage");
            if (msgContent.fullScreen === true) {
                tempThisObject.fullScreen = true;
                console.log("fullscreen: "+tempThisObject.fullScreen);
                document.getElementById("thisObject" + msgContent.node).style.webkitTransform =
                    'matrix3d(1, 0, 0, 0,' +
                    '0, 1, 0, 0,' +
                    '0, 0, 1, 0,' +
                    '0, 0, 0, 1)';

            }
            if (msgContent.fullScreen === false) {

                tempThisObject.fullScreen = false;
            }

        }

};
