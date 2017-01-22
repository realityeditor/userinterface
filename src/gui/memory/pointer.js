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
 * Copyright (c) 2016 James Hobin
 * Modified by Valentin Heun 2016, 2017
 * Modified by James Hobin 2016, 2017
 * Modified by Benjamin Reynholds 2016, 2017
 *
 * All ascii characters above must be included in any redistribution.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

createNameSpace("realityEditor.gui.memory");

(function(exports) {

var pointers = {};

var requestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame || function(cb) {setTimeout(cb, 17);};

/**
 * @constructor
 * @param {Object} link - Link object with information regarding connection
 * @param {Object} isObjectA - Whether this pointer is based on ObjectA or ObjectB
 * using it as a basis for its position.
 */
function MemoryPointer(link, isObjectA) {
    this.link = link;
    this.isObjectA = isObjectA;

    this.element = document.createElement('div');
    this.element.classList.add('memoryContainer');
    this.element.classList.add('memoryPointer');
    this.element.setAttribute('touch-action', 'none');

    document.querySelector('.memoryPointerContainer').appendChild(this.element);

    this.memory = new realityEditor.gui.memory.MemoryContainer(this.element); // TODO

    this.memory.set(this.getObject());
    this.x = 0;
    this.y = 0;

    var globalIndex = Object.keys(objects).indexOf(this.getObject().objectId);
    var theta = 2 * Math.PI * globalIndex / Object.keys(objects).length;
    this.offsetX = Math.cos(theta) * 20;
    this.offsetY = Math.sin(theta) * 20;

    this.alive = true;
    this.lastDraw = Date.now();
    this.idleTimeout = 100;

    this.update = this.update.bind(this);
    this.update();

    pointers[this.getObject().objectId] = this;
}

MemoryPointer.prototype.getObject = function() {
    if (this.isObjectA) {
        return objects[this.link.objectA];
    } else {
        return objects[this.link.objectB];
    }
};

MemoryPointer.prototype.getConnectedObject = function() {
    if (this.isObjectA) {
        return objects[this.link.objectB];
    } else {
        return objects[this.link.objectA];
    }
};

MemoryPointer.prototype.getConnectedValue = function() {
    if (this.isObjectA) {
        return this.getConnectedObject().nodes[this.link.nodeB];
    } else {
        return this.getConnectedObject().nodes[this.link.nodeA];
    }
};

MemoryPointer.prototype.update = function() {
    var object = this.getObject();
    var connectedObject = this.getConnectedObject();
    if (!object || !connectedObject) {
        this.remove();
        return;
    }
    if (object.objectVisible || !connectedObject.objectVisible) {
        this.remove();
        return;
    }
    if (globalStates.guiState !== 'node') {
        // Remove if no longer in connection-drawing mode
        this.remove();
        return;
    }
    if (this.lastDraw + this.idleTimeout < Date.now()) {
        this.remove();
        return;
    }

    requestAnimationFrame(this.update);
};

MemoryPointer.prototype.draw = function() {
    this.lastDraw = Date.now();

    var connectedValue = this.getConnectedValue();
    var cvX = connectedValue.screenX || 0;
    var cvY = connectedValue.screenY || 0;
    var cvZ = connectedValue.screenLinearZ || 10;
    var scale = cvZ / 10;

    var deltaX = cvX - this.offsetX * cvZ - this.x;
    var deltaY = cvY - this.offsetY * cvZ - this.y;
    var alpha = 0.66;
    this.x += deltaX * alpha;
    this.y += deltaY * alpha;
    this.element.style.transform = 'translate3d(' + this.x + 'px,' + this.y + 'px, 2px) scale(' + scale + ')';
};

MemoryPointer.prototype.remove = function() {
    this.alive = false;
    this.memory.remove();
    delete pointers[this.getObject().objectId];
};

function getMemoryPointerWithId(id) {
    return pointers[id];
}

exports.MemoryPointer = MemoryPointer;
exports.getMemoryPointerWithId = getMemoryPointerWithId;

}(realityEditor.gui.memory));
