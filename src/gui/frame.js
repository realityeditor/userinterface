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
    postData(url, frame, function(err, response) {
        if (err) {
            console.error('frameCreate', err);
            return;
        }
        if (!response.frameId) {
            return;
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

    var url = 'http://' + object.ip + ':' + httpPort + '/object/' + objectId + '/frames/' + frameId;
    postData(url, frame, function(err) {
        if (err) {
            console.error('frameUpdate', err);
            return;
        }
    });
}

function Frame(src) {
    this.src = src;
    this.x = 0;
    this.y = 0;
    this.width = 500;
    this.height = 500;
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
    Frame: Frame
};

})(realityEditor);
