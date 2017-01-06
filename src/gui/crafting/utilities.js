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
 * Copyright (c) 2016 Benjamin Reynholds
 * Modified by Valentin Heun 2016
 * Modified by Benjamin Reynholds 2016
 * Modified by James Hobin 2016
 *
 * All ascii characters above must be included in any redistribution.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

createNameSpace("realityEditor.crafting.utilities");

realityEditor.crafting.utilities.toBlockJSON = function(type, name, blockSize, privateData, publicData, activeInputs, activeOutputs, nameInput, nameOutput) {
    return {
        type: type,
        name: name,
        blockSize: blockSize,
        privateData: privateData,
        publicData: publicData,
        activeInputs: activeInputs,
        activeOutputs: activeOutputs,
        nameInput: nameInput,
        nameOutput: nameOutput
    };
};

realityEditor.crafting.utilities.convertBlockLinkToServerFormat = function(blockLink) {
    var serverLink = {};

    var keysToSkip = ["route"]; //, "nodeA", "nodeB"
    for (var key in blockLink) {
        if (!blockLink.hasOwnProperty(key)) continue;
        if (keysToSkip.indexOf(key) > -1) continue;
        serverLink[key] = blockLink[key];
    }

    serverLink["route"] = null;

    return serverLink;
};

// strips away unnecessary data from logic node that can be easily regenerated
realityEditor.crafting.utilities.convertLogicToServerFormat = function(logic) {

    var logicServer = {};

    var keysToSkip = ["guiState", "grid", "blocks"];
    for (var key in logic) {
        if (!logic.hasOwnProperty(key)) continue;
        if (keysToSkip.indexOf(key) > -1) continue;
        logicServer[key] = logic[key];
    }

    // VERY IMPORTANT: otherwise the node will think it's already loaded
    // and won't load from the server next time you open the app
    logicServer["loaded"] = false;
    logicServer["visible"] = false;

    // don't upload in/out blocks, those are always the same and live in the editor?
    logicServer["blocks"] = {};
    for (var key in logic.blocks) {
        if (!logic.blocks.hasOwnProperty(key)) continue;
        if (!this.crafting.grid.isInOutBlock(key)) {
            logicServer.blockData[key] = logic.blocks[key];
        }
    }

    return logicServer;
};
