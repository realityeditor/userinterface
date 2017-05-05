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

    this.object = null;
    this.connectedNode = null;
    this.connectedNodeKey = null;
    this.connectedObject = null;

    if (this.isObjectA) {
        this.object = objects[this.link.objectA];
        this.connectedObject = objects[this.link.objectB];
        this.connectedNodeKey = this.link.nodeB;
    } else {
        this.object = objects[this.link.objectB];
        this.connectedObject = objects[this.link.objectA];
        this.connectedNodeKey = this.link.nodeA;
    }
    this.connectedNode = this.connectedObject.nodes[this.connectedNodeKey];

    this.element = document.createElement('div');
    this.element.classList.add('memoryContainer');
    this.element.classList.add('memoryPointer');
    this.element.setAttribute('touch-action', 'none');

    document.querySelector('.memoryPointerContainer').appendChild(this.element);

    this.memory = new realityEditor.gui.memory.MemoryContainer(this.element);
    this.memory.set(this.object);

    // TODO could calculate center of mass of other points and select location opposite that
    var baseDistance = (this.connectedNode.screenLinearZ || 5) * 30;
    var baseTheta = Math.random() * 2 * Math.pi;
    this.x = Math.cos(baseTheta) * baseDistance;
    this.y = Math.sin(baseTheta) * baseDistance;

    this.alive = true;
    this.lastDraw = Date.now();
    this.idleTimeout = 250;

    this.beginForceSimulation();

    this.update = this.update.bind(this);
    this.update();

    pointers[this.object.objectId] = this;
}

MemoryPointer.prototype.update = function() {
    var object = this.object;
    var connectedObject = this.connectedObject;
    if (!this.alive) {
        this.remove();
        return;
    }
    if (!object || !connectedObject) {
        this.remove();
        return;
    }
    if (object.objectVisible) {
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

    this.updateForceSimulation();
    requestAnimationFrame(this.update);
};

MemoryPointer.prototype.beginForceSimulation = function() {
    this.simNode = {
        id: 'this',
        x: this.x,
        y: this.y
    };
    this.forceNodes = [this.simNode];

    for (var nodeKey in this.connectedObject.nodes) {
        var node = this.connectedObject.nodes[nodeKey];
        this.forceNodes.push({
            id: nodeKey,
            fx: node.screenX - this.connectedNode.screenX,
            fy: node.screenY - this.connectedNode.screenY
        });
    }

    var links = [{
        source: this.connectedNodeKey,
        target: 'this'
    }];

    this.force = d3.forceSimulation()
        .force('link', d3.forceLink().distance(80).id(function(d) { return d.id; }))
        .force('charge', d3.forceManyBody().strength(-80));

    this.force.nodes(this.forceNodes);

    this.force.force('link')
        .links(links);

    this.force.stop();
};

MemoryPointer.prototype.updateForceSimulation = function() {
    for (var i = 0; i < this.forceNodes.length; i++) {
        var forceNode = this.forceNodes[i];
        if (forceNode.id === 'this') {
            continue;
        }
        var node = this.connectedObject.nodes[forceNode.id];
        if (!node) {
            continue;
        }
        forceNode.fx = node.screenX - this.connectedNode.screenX;
        forceNode.fy = node.screenY - this.connectedNode.screenY;
    }

    this.force.alpha(1);
    this.force.force('link').distance((this.connectedNode.screenLinearZ || 5) * 30);
    this.force.tick();

    this.x = this.simNode.x + this.connectedNode.screenX;
    this.y = this.simNode.y + this.connectedNode.screenY;
};



MemoryPointer.prototype.draw = function() {
    if (!this.alive) {
        return;
    }

    this.lastDraw = Date.now();

    var cvZ = this.connectedNode.screenLinearZ || 10;
    var scale = cvZ / 10;

    var tol = 60 * scale;

    var connectedNodeIsOffscreen = (this.connectedNode.screenX < -tol) ||
        (this.connectedNode.screenY < -tol) ||
        (this.connectedNode.screenX > globalStates.height + tol) ||
        (this.connectedNode.screenY > globalStates.width + tol);

    if (!connectedNodeIsOffscreen) {
        if (this.x < tol) {
            this.x = tol;
        }
        if (this.y < tol) {
            this.y = tol;
        }
        if (this.x > globalStates.height - tol) {
            this.x = globalStates.height - tol;
        }
        if (this.y > globalStates.width - tol) {
            this.y = globalStates.width - tol;
        }
    }

    this.element.style.transform = 'translate3d(' + this.x + 'px,' + this.y + 'px, 2px) scale(' + scale + ')';
};

MemoryPointer.prototype.remove = function() {
    this.alive = false;
    this.memory.remove();
    delete pointers[this.object.objectId];
};

function getMemoryPointerWithId(id) {
    if (pointers[id] && !pointers[id].alive) {
        delete pointers[id];
    }
    return pointers[id];
}

exports.MemoryPointer = MemoryPointer;
exports.getMemoryPointerWithId = getMemoryPointerWithId;

}(realityEditor.gui.memory));
