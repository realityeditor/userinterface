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
 * All ascii characters above must be included in any redistribution.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

createNameSpace("realityEditor.gui.frame");

(function(realityEditor) {

/**
 * Sanitize a potentially bloated frame object, keeping only the
 * keys present in the frame constructor
 * @param {Object} frame
 * @return {Frame}
 */
function sanitizeFrame(frame) {
    var sanitizedFrame = new Frame(frame.src);
    for (var key in sanitizedFrame) {
        sanitizedFrame[key] = frame[key];
    }
    return sanitizedFrame;
}

/**
 * Upload frame to object on server
 *
 * @param {String} objectId
 * @param {ObjectFrame} frame
 */
function create(objectId, frame) {
    var object = objects[objectId];
    var url = 'http://' + object.ip + ':' + httpPort + '/object/' + objectId + '/frames/';
    frame = sanitizeFrame(frame);
    frame.lastEditor = globalStates.tempUuid;
    realityEditor.network.postData(url, frame, function(err, response) {
        if (err) {
            console.error('frameCreate', err);
            return;
        }
        if (!response.frameId) {
            return;
        }
        if (!object.frames) {
            object.frames = {};
        }
        object.frames[response.frameId] = frame;
    });
}

/**
 * Update a frame on the server
 *
 * @param {String} objectId
 * @param {String} frameId
 */
function update(objectId, frameId) {
    var object = objects[objectId];
    var frame = sanitizeFrame(object.frames[frameId]);
    frame.lastEditor = globalStates.tempUuid;

    var url = 'http://' + object.ip + ':' + httpPort + '/object/' + objectId + '/frames/' + frameId;
    realityEditor.network.postData(url, frame, function(err) {
        if (err) {
            console.error('frameUpdate', err);
            return;
        }
    });
}

/**
 * Delete a frame on the server
 *
 * @param {String} objectId
 * @param {String} frameId
 */
function deleteFrame(objectId, frameId) {
    var object = objects[objectId];
    var url = 'http://' + object.ip + ':' + httpPort + '/object/' + objectId + '/frames/' + frameId;
    realityEditor.network.deleteData(url, {lastEditor: globalStates.tempUuid});
    deleteLocally(objectId, frameId);
}

function deleteLocally(objectId, frameId) {
    var object = objects[objectId];

    // clean up locally, copy-pasted from server.js

    realityEditor.gui.ar.draw.deleteFrame(objectId, frameId);

    // Delete frame's nodes
    var deletedNodes = {};
    for (var nodeId in object.nodes) {
        var node = object.nodes[nodeId];
        if (node.frame === frameId) {
            deletedNodes[nodeId] = true;
            realityEditor.gui.ar.draw.deleteNode(objectId, nodeId);
        }
    }

    // Delete links involving frame's nodes
    for (var linkObjectId in objects) {
        var linkObject = objects[linkObjectId];

        for (var linkId in linkObject.links) {
            var link = linkObject.links[linkId];
            if (link.objectA === objectId || link.objectB === objectId) {
                if (deletedNodes[link.nodeA] || deletedNodes[link.nodeB]) {
                    delete linkObject.links[linkId];
                }
            }
        }
    }
}

function Frame(src, width, height) {
    this.src = src;
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.scale = 1;
    this.developer = true;
    this.matrix = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];
}

realityEditor.gui.frame = {
    create: create,
    update: update,
    delete: deleteFrame,
    deleteLocally: deleteLocally,
    Frame: Frame
};

})(realityEditor);
