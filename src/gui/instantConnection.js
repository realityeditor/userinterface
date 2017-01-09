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

realityEditor.gui = realityEditor.gui || {};

realityEditor.gui.instantConnect = {
    links : {
        objectA: false,
        nodeA: false,
        logicA:false,
        namesA:["test","object"],
        objectB: false,
        nodeB: false,
        logicB:false,
        namesB:["",""]
    },
    timeout:undefined,

    logic: function (advertiseConnection) {

        if (!(advertiseConnection.object in objects)) return;
        if (!(advertiseConnection.node in objects[advertiseConnection.object].nodes)) return;
        console.log(advertiseConnection.object + ":" + advertiseConnection.node);

        var B = advertiseConnection;
        var A = this.links;

        if (A.objectA === false) {

            var thisConnectionPage = document.getElementById("advertisedConnections");
            thisConnectionPage.style.display = "inline";

            A.objectA = B.object;
            A.nodeA = B.node;
            A.logicA = B.logic;
            A.namesA[0] = B.names[0];
            A.namesA[1] = B.names[1];

            this.draw(this.links, "waiting");

        } else {

            // var thisConnectionPage =  document.getElementById("advertisedConnections");

            if (A.objectA === B.object && A.nodeA === B.node && A.logicA === B.logic) {
                return;
            }

            var thisTempObject = objects[this.links.objectA];
            var thisTempObjectLinks = thisTempObject.links;

            for (var thisSubKey in thisTempObjectLinks) {
                if ((thisTempObjectLinks[thisSubKey].objectA === A.objectA &&
                    thisTempObjectLinks[thisSubKey].objectB === B.object &&
                    thisTempObjectLinks[thisSubKey].nodeA === A.nodeA &&
                    thisTempObjectLinks[thisSubKey].nodeB === B.node)
                    ||
                    (thisTempObjectLinks[thisSubKey].objectA === B.object &&
                    thisTempObjectLinks[thisSubKey].objectB === A.objectA &&
                    thisTempObjectLinks[thisSubKey].nodeA === B.node &&
                    thisTempObjectLinks[thisSubKey].nodeB === A.nodeA)
                ) {
                    A.objectB = B.object;
                    A.nodeB = B.node;
                    A.logicB = B.logic;
                    A.namesB[0] = B.names[0];
                    A.namesB[1] = B.names[1];

                    realityEditor.network.deleteLinkFromObject(objects[A.objectA].ip, A.objectA, thisSubKey);
                    delete thisTempObjectLinks[thisSubKey];
                    this.draw(A, "disconnected");
                    this.reset();
                    return;
                }

            }

            if (!realityEditor.network.checkForNetworkLoop(A.objectA, A.nodeA, A.logicA, B.object, B.node, B.logic)) {
                this.draw(A, "not working");
                this.reset();
                return;
            }

            A.objectB = B.object;
            A.nodeB = B.node;
            A.logicB = B.logic;
            A.namesB[0] = B.names[0];
            A.namesB[1] = B.names[1];
            realityEditor.network.postLinkToServer(A, objects);
            this.draw(A, "connected");
            this.reset();

        }

    },

    touchStart: function () {
        var thisDiv = document.getElementById("clickMich");
        thisDiv.style.backgroundColor = "#888888";
    },

    touchEnd: function () {
        this.reset();

        var thisConnectionPage = document.getElementById("advertisedConnections");
        thisConnectionPage.style.display = "none";

        var thisDiv = document.getElementById("clickMich");
        thisDiv.style.backgroundColor = "#777777";
    },

    draw: function (link, message) {

        var canvas = document.getElementById('testCanvas'),
            ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#00ffff';

        //
        ctx.fillStyle = "#666666";
        ctx.beginPath();

        ctx.lineTo(568, 0);
        ctx.lineTo(568, 320);
        if (message === "connected" || message === "disconnected") {
            ctx.lineTo(0, 320);
            ctx.lineTo(0, 0);
        } else {
            ctx.lineTo(200, 320);
            ctx.lineTo(200, 0);
        }

        ctx.closePath();
        ctx.fill();
        // }
        /*
         ctx.fillStyle = "#777777";
         ctx.beginPath();
         ctx.moveTo(1, 1);
         ctx.lineTo(506, 1);
         ctx.lineTo(506, 125);
         ctx.lineTo(1, 125);
         ctx.lineTo(1, 1);
         ctx.closePath();
         ctx.fill();
         ctx.stroke();
         */

        ctx.fillStyle = "#777777";
        ctx.beginPath();
        ctx.moveTo(506, 1);
        ctx.lineTo(506, 320);
        ctx.lineTo(200, 320);
        ctx.lineTo(200, 1);
        ctx.lineTo(506, 1);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        var thisY = 93 + 50;
        var thisWidth = 140;
        var thisX = (320 / 2) - (thisWidth / 2) + 45;

        if (message === "disconnected") {
            var my_gradient = ctx.createLinearGradient(58 + thisY, 0, 0 + thisY, 0);
            my_gradient.addColorStop(0, "#777777");
            my_gradient.addColorStop(1, "#ff007c");
            ctx.fillStyle = my_gradient;
        }
        else if (message === "connected") {
            var my_gradient = ctx.createLinearGradient(58 + thisY, 0, 0 + thisY, 0);
            my_gradient.addColorStop(0, "#777777");
            my_gradient.addColorStop(1, "#00ff00");
            ctx.fillStyle = my_gradient;
        } else {
            ctx.fillStyle = "#777777";
        }
        ctx.beginPath();
        ctx.moveTo(58 + thisY, 0 + thisX);
        ctx.lineTo(28 + thisY, 0 + thisX);
        ctx.lineTo(0 + thisY, (thisWidth / 2) + thisX);
        ctx.lineTo(28 + thisY, thisWidth + thisX);
        ctx.lineTo(58 + thisY, thisWidth + thisX);
        //ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#666666";
        ctx.beginPath();
        ctx.moveTo(200, 1);
        ctx.lineTo(400, 1);
        ctx.lineTo(400, 90);
        ctx.lineTo(200, 90);

        ctx.closePath();
        ctx.stroke();

        ctx.textAlign = "center";

        ctx.save();
        ctx.rotate(Math.PI / 2);
        ctx.fillStyle = "#ffffff";
        ctx.font = "35px Calibri, Helvetica, sans-serif";
        ctx.fillText(link.namesA[0] + ":" + link.namesA[1], 160, -443);
        ctx.restore();

        if (message === "connected" || message === "disconnected") {
            ctx.save();
            ctx.rotate(Math.PI / 2);
            ctx.fillStyle = "#ffffff";
            ctx.font = "35px Calibri, Helvetica, sans-serif";
            ctx.fillText(link.namesB[0] + ":" + link.namesB[1], 160, -50);
            ctx.restore();

        } else {
            ctx.save();
            ctx.rotate(Math.PI / 2);
            ctx.fillStyle = "#ffffff";
            ctx.font = "35px Calibri, Helvetica, sans-serif";
            ctx.fillText("connecting with...", 160, -65);
            ctx.restore();
        }

        if (message) {
            ctx.save();
            ctx.rotate(Math.PI / 2);
            ctx.fillStyle = "#ffffff";
            ctx.font = "20px Calibri, Helvetica, sans-serif";
            ctx.fillText(message, 160 + 45, -180);
            ctx.restore();
        } else {
            ctx.save();
            ctx.rotate(Math.PI / 2);
            ctx.fillStyle = "#ffffff";
            ctx.font = "20px Calibri, Helvetica, sans-serif";
            ctx.fillText("waiting", 160 + 45, -180);
            ctx.restore();
        }

        ctx.save();
        ctx.rotate(Math.PI / 2);
        ctx.fillStyle = "#ffffff";
        ctx.font = "20px Calibri, Helvetica, sans-serif";

        var xx = 0;
        for (var x in objects[link.objectA].links) {
            var thisLink = objects[link.objectA].links[x];
            if (thisLink.nodeA === link.nodeA) {
                ctx.fillText(thisLink.namesB[0] + ":" + thisLink.namesB[1], 160 + 45, -345 + (xx * 25));
                xx++;
            }
        }
        /*
         for(var x in objects[link.objectB].links){
         var thisLink = objects[link.objectB].links[x];
         ctx.fillText(thisLink.namesA[0]+":"+thisLink.namesA[1], 160 + 45, -345 + (xx * 25));
         xx++;
         }
         */

        if (xx > 0) {
            ctx.fillText("allready connected...", 160 + 45, -380);
        }
        ctx.restore();

        if (message === "connected" || message === "disconnected" || message === "not working") {
            this.timeout = setTimeout(function () {
                if (!realityEditor.instantConnect.links.objectA) {
                    var thisConnectionPage = document.getElementById("advertisedConnections");
                    thisConnectionPage.style.display = "none";
                }
                realityEditor.instantConnect.timeout = undefined;
            }, 2000);
        } else {
            if (typeof this.timeout !== "undefined")
                clearTimeout(this.timeout);
        }

    },

    reset: function(){
        this.links.objectA = false;
        this.links.nodeA = false;
        this.links.logicA = false;
        this.links.namesA = ["",""];
        this.links.objectB = false;
        this.links.nodeB = false;
        this.links.logicB = false;
        this.links.namesB = ["",""];
    }
};

