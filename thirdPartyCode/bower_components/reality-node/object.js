/**
 * @preserve
 *
 *                                     .,,,;;,'''..
 *                                 .'','...     ..',,,.
 *                               .,,,,,,',,',;;:;,.  .,l,
 *                              .,',.     ...     ,;,   :l.
 *                             ':;.    .'.:do;;.    .c   ol;'.
 *      ';;'                   ;.;    ', .dkl';,    .c   :; .'.',::,,'''.
 *     ',,;;;,.                ; .,'     .'''.    .'.   .d;''.''''.
 *    .oxddl;::,,.             ',  .'''.   .... .'.   ,:;..
 *     .'cOX0OOkdoc.            .,'.   .. .....     'lc.
 *    .:;,,::co0XOko'              ....''..'.'''''''.
 *    .dxk0KKdc:cdOXKl............. .. ..,c....
 *     .',lxOOxl:'':xkl,',......'....    ,'.
 *          .';:oo:...                        .
 *               .cd,    ╔═╗┌─┐┬─┐┬  ┬┌─┐┬─┐   .
 *                 .l;   ╚═╗├┤ ├┬┘└┐┌┘├┤ ├┬┘   '
 *                   'l. ╚═╝└─┘┴└─ └┘ └─┘┴└─  '.
 *                    .o.                   ...
 *                     .''''','.;:''.........
 *                          .'  .l
 *                         .:.   l'
 *                        .:.    .l.
 *                       .x:      :k;,.
 *                       cxlc;    cdc,,;;.
 *                      'l :..   .c  ,
 *                      o.
 *                     .,
 *
 *             ╦ ╦┬ ┬┌┐ ┬─┐┬┌┬┐  ╔═╗┌┐  ┬┌─┐┌─┐┌┬┐┌─┐
 *             ╠═╣└┬┘├┴┐├┬┘│ ││  ║ ║├┴┐ │├┤ │   │ └─┐
 *             ╩ ╩ ┴ └─┘┴└─┴─┴┘  ╚═╝└─┘└┘└─┘└─┘ ┴ └─┘
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

/* global io */

(function(exports) {

if (typeof exports.realityObject !== 'undefined') {
  return;
}

var realityObject = {
    node: '',
    object: '',
    modelViewMatrix: [],
    projectionMatrix: [],
    visibility: 'visible',
    sendMatrix: false,
    sendAcceleration: false,
    sendFullScreen: false,
    height: '100%',
    width: '100%',
    socketIoScript: {},
    socketIoRequest: {},
    socketIoUrl: '',
    style: document.createElement('style'),
    messageCallBacks: {},
    version: 170
};

// adding css styles nessasary for acurate 3D transformations.
realityObject.style.type = 'text/css';
realityObject.style.innerHTML = 'body, html{ height: 100%; margin:0; padding:0;}';
document.getElementsByTagName('head')[0].appendChild(realityObject.style);

var hybridObjects = [];

function loadObjectSocketIo(object) {
  var script = document.createElement('script');
  script.type = 'text/javascript';

  var url = 'http://' + object.ip + ':8080';
  realityObject.socketIoUrl = url;
  script.src = url + '/socket.io/socket.io.js';

  script.addEventListener('load', function() {
    for (var i = 0; i < hybridObjects.length; i++) {
      var ho = hybridObjects[i];
      ho.injectIo();
    }
  });

  document.body.appendChild(script);
}

/**
 ************************************************************
 */

// function for resizing the windows.

window.addEventListener('message', function (MSG) {
    var msgContent = JSON.parse(MSG.data);
    for (var key in realityObject.messageCallBacks) {
        realityObject.messageCallBacks[key](msgContent);
    }
}, false);

function tryResend() {
  var windowMatches = window.location.search.match(/nodeKey=([^&]+)/);
  if (!windowMatches) {
    return;
  }
  var nodeKey = windowMatches[1];
  parent.postMessage(JSON.stringify({resendOnElementLoad: true, nodeKey: nodeKey}), '*');
}

tryResend();

realityObject.messageCallBacks.mainCall = function (msgContent) {

    if (msgContent.objectData) {
        if (!realityObject.node) {
            loadObjectSocketIo(msgContent.objectData);
        }
    }

    if (typeof msgContent.node !== 'undefined') {

        if (realityObject.sendFullScreen === false) {
            realityObject.height = document.body.scrollHeight;
            realityObject.width = document.body.scrollWidth;
        }

        parent.postMessage(JSON.stringify(
            {
                version: realityObject.version,
                node: msgContent.node,
                object: msgContent.object,
                height: realityObject.height,
                width: realityObject.width,
                sendMatrix: realityObject.sendMatrix,
                sendAcceleration: realityObject.sendAcceleration,
                fullScreen: realityObject.sendFullScreen
            }
            )
            // this needs to contain the final interface source
            , '*');

        var alreadyLoaded = !!realityObject.node;
        realityObject.node = msgContent.node;
        realityObject.object = msgContent.object;

        if (!alreadyLoaded) {
          for (var i = 0; i < hybridObjects.length; i++) {
            hybridObjects[i].injectPostMessage();
          }
        }
    }

    if (typeof msgContent.modelViewMatrix !== 'undefined') {
        realityObject.modelViewMatrix = msgContent.modelViewMatrix;
    }

    if (typeof msgContent.projectionMatrix !== 'undefined') {
        realityObject.projectionMatrix = msgContent.projectionMatrix;
    }

    if (typeof msgContent.visibility !== 'undefined') {
        realityObject.visibility = msgContent.visibility;
    }

};

/**
 ************************************************************
 */

function HybridObject() {
    this.pendingSends = [];
    this.pendingIos = [];

    var self = this;
    function makeSendStub(name) {
        return function() {
            self.pendingSends.push({name: name, args: arguments});
        };
    }

    function makeIoStub(name) {
        return function() {
            self.pendingIos.push({name: name, args: arguments});
        };
    }

    if (realityObject.object) {
        this.injectPostMessage();
    } else {
        this.sendGlobalMessage = makeSendStub('sendGlobalMessage');
        this.sendCreateNode = makeSendStub('sendCreateNode');
        this.subscribeToMatrix = makeSendStub('subscribeToMatrix');
        this.subscribeToAcceleration = makeSendStub('subscribeToAcceleration');
        this.setFullScreenOn = makeSendStub('setFullScreenOn');
        this.setFullScreenOff = makeSendStub('setFullScreenOff');
    }

    this.addGlobalMessageListener = function(callback) {
        realityObject.messageCallBacks.globalMessageCall = function (msgContent) {
            if (typeof msgContent.globalMessage !== 'undefined') {
                callback(msgContent.globalMessage);
            }
        };
    };

    this.addMatrixListener = function(callback) {
        realityObject.messageCallBacks.matrixCall = function (msgContent) {
            if (typeof msgContent.modelViewMatrix !== 'undefined') {
                callback(msgContent.modelViewMatrix, realityObject.projectionMatrix);
            }
        };
    };

    this.addAccelerationListener = function (callback) {
        realityObject.messageCallBacks.AccelerationCall = function (msgContent) {
            if (typeof msgContent.acceleration !== 'undefined') {
                callback(msgContent.acceleration);
            }
        };
    };

    /**
     ************************************************************
     */

    this.getVisibility = function () {
        return realityObject.visibility;
    };

    /**
     ************************************************************
     */

    this.addVisibilityListener = function (callback) {
        realityObject.messageCallBacks.visibilityCall = function (msgContent) {
            if (typeof msgContent.visibility !== 'undefined') {
                callback(msgContent.visibility);
            }
        };
    };

    /**
     ************************************************************
     */

    this.getPossitionX = function () {
        return realityObject.modelViewMatrix[12];
    };

    /**
     ************************************************************
     */

    this.getPossitionY = function () {
        return realityObject.modelViewMatrix[13];
    };

    /**
     ************************************************************
     */

    this.getPossitionZ = function () {
        return realityObject.modelViewMatrix[14];
    };

    /**
     ************************************************************
     */

    this.getProjectionMatrix = function () {
        return realityObject.projectionMatrix;
    };

    /**
     ************************************************************
     */

    this.getModelViewMatrix = function () {
        return realityObject.modelViewMatrix;
    };

    if (typeof io !== 'undefined') {
        this.injectIo();
    } else {
        this.ioObject = {
            on: function() {
              console.log('ioObject.on stub called, please don\'t');
            }
        };
        this.write = makeIoStub('write');
        this.read = makeIoStub('read');
        this.readRequest = makeIoStub('readRequest');
        this.addReadListener = makeIoStub('addReadListener');
    }

    hybridObjects.push(this);
}

HybridObject.prototype.injectIo = function() {
    var self = this;

    this.ioObject = io.connect(realityObject.socketIoUrl);
    this.oldNumberList = {};

    this.sendRealityEditorSubscribe = setInterval(function () {
        if (realityObject.object) {
            self.ioObject.emit('/subscribe/realityEditor', JSON.stringify({object: realityObject.object}));
            clearInterval(self.sendRealityEditorSubscribe);
        }
    }, 10);

    /**
     ************************************************************
     */


    this.write = function (node, value, mode, unit, unitMin, unitMax) {
        mode = mode || 'f';
        unit = unit || false;
        unitMin = unitMin || 0;
        unitMax = unitMax || 1;

        var data = {value: value, mode: mode, unit: unit, unitMin: unitMin, unitMax: unitMax};
        if (!(node in self.oldNumberList)) {
            self.oldNumberList[node] = null;
        }

        if (self.oldNumberList[node] !== value) {
            this.ioObject.emit('object', JSON.stringify({
                object: realityObject.object,
                node: realityObject.node + node,
                data: data
            }));
        }
        self.oldNumberList[node] = value;
    };

    /**
     ************************************************************
     */

    this.readRequest = function (node) {
        this.ioObject.emit('/object/readRequest', JSON.stringify({object: realityObject.object, node: realityObject.node + node}));
    };

    /**
     ************************************************************
     */

    this.read = function (node, msg) {
        if (msg.node === realityObject.node + node) {
            return msg.item[0].number;
        } else {
            return undefined;
        }
    };

    /**
     ************************************************************
     */

    this.addReadListener = function (node, callback) {
        self.ioObject.on('object', function (msg) {
            var thisMsg = JSON.parse(msg);
            if (typeof thisMsg.node !== 'undefined') {
                if (thisMsg.node === realityObject.node + node) {
                    if (thisMsg.data) {
                        callback(thisMsg.data.value);
                    }
                }
            }
        });
    };

    console.log('socket.io is loaded and injected');

    for (var i = 0; i < this.pendingIos.length; i++) {
        var pendingIo = this.pendingIos[i];
        this[pendingIo.name].apply(this, pendingIo.args);
    }
    this.pendingIos = [];
};

HybridObject.prototype.injectPostMessage = function() {
    this.sendGlobalMessage = function (ohMSG) {
        parent.postMessage(JSON.stringify({
            version: realityObject.version,
            node: realityObject.node,
            object: realityObject.object,
            globalMessage: ohMSG
        }), '*');
    };

    this.sendCreateNode = function (name) {
        parent.postMessage(JSON.stringify({
            version: realityObject.version,
            node: realityObject.node,
            object: realityObject.object,
            createNode: {name: name}
        }), '*');
    };

    // subscriptions
    this.subscribeToMatrix = function() {
        realityObject.sendMatrix = true;

        if (realityObject.sendFullScreen === false) {
            realityObject.height = document.body.scrollHeight;
            realityObject.width = document.body.scrollWidth;
        }

        parent.postMessage(JSON.stringify({
            version: realityObject.version,
            node: realityObject.node,
            object: realityObject.object,
            height: realityObject.height,
            width: realityObject.width,
            sendMatrix: realityObject.sendMatrix,
            sendAcceleration: realityObject.sendAcceleration,
            fullScreen: realityObject.sendFullScreen
        }), '*');
    };

    // subscriptions
    this.subscribeToAcceleration = function () {
        realityObject.sendAcceleration = true;
        parent.postMessage(JSON.stringify({
            version: realityObject.version,
            node: realityObject.node,
            object: realityObject.object,
            height: realityObject.height,
            width: realityObject.width,
            sendMatrix: realityObject.sendMatrix,
            sendAcceleration: realityObject.sendAcceleration,
            fullScreen: realityObject.sendFullScreen
        }), '*');
    };

    this.setFullScreenOn = function() {
        realityObject.sendFullScreen = true;
        console.log('fullscreen is loaded');

        realityObject.height = '100%';
        realityObject.width = '100%';

        parent.postMessage(JSON.stringify({
            version: realityObject.version,
            node: realityObject.node,
            object: realityObject.object,
            height: realityObject.height,
            width: realityObject.width,
            sendMatrix: realityObject.sendMatrix,
            sendAcceleration: realityObject.sendAcceleration,
            fullScreen: realityObject.sendFullScreen
        }), '*');
    };

    /**
     ************************************************************
     */

    this.setFullScreenOff = function () {
        realityObject.sendFullScreen = false;

        realityObject.height = document.body.scrollHeight;
        realityObject.width = document.body.scrollWidth;

        parent.postMessage(JSON.stringify({
            version: realityObject.version,
            node: realityObject.node,
            object: realityObject.object,
            height: realityObject.height,
            width: realityObject.width,
            sendMatrix: realityObject.sendMatrix,
            sendAcceleration: realityObject.sendAcceleration,
            fullScreen: realityObject.sendFullScreen
        }), '*');
    };

    for (var i = 0; i < this.pendingSends.length; i++) {
        var pendingSend = this.pendingSends[i];
        this[pendingSend.name].apply(this, pendingSend.args);
    }
    this.pendingSends = [];
};

var touchTimer = null;
var sendTouchEvents = false;
var startCoords = {
  x: 0,
  y: 0
};
var touchMoveTolerance = 100;

function getTouchX(event) {
  return event.changedTouches[0].screenX;
}

function getTouchY(event) {
  return event.changedTouches[0].screenY;
}

function sendTouchEvent(event) {
  parent.postMessage(JSON.stringify({
    version: realityObject.version,
    node: realityObject.node,
    object: realityObject.object,
    touchEvent: {
      type: event.type,
      x: getTouchX(event),
      y: getTouchY(event)
    }
  }), '*');
}

document.body.addEventListener('touchstart', function() {
  if (touchTimer) {
    return;
  }

  startCoords.x = getTouchX(event);
  startCoords.y = getTouchY(event);

  touchTimer = setTimeout(function() {
    parent.postMessage(JSON.stringify({
      version: realityObject.version,
      node: realityObject.node,
      object: realityObject.object,
      beginTouchEditing: true
    }), '*');
    sendTouchEvents = true;
    touchTimer = null;
  }, 400);
});

document.body.addEventListener('touchmove', function(event) {
  if (sendTouchEvents) {
    sendTouchEvent(event);
  } else if (touchTimer) {
    var dx = getTouchX(event) - startCoords.x;
    var dy = getTouchY(event) - startCoords.y;
    if (dx * dx + dy * dy > touchMoveTolerance) {
      clearTimeout(touchTimer);
      touchTimer = null;
    }
  }
});

document.body.addEventListener('touchend', function(event) {
  if (sendTouchEvents) {
    sendTouchEvent(event);
  }
  clearTimeout(touchTimer);
  touchTimer = null;
});

window.addEventListener('message', function (msg) {
  var msgContent = JSON.parse(msg.data);
  if (msgContent.stopTouchEditing) {
    sendTouchEvents = false;
  }
});

exports.realityObject = realityObject;
exports.HybridObject = HybridObject;

}(window));
