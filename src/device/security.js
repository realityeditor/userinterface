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
 * Modified by Benjamin Reynolds 2016, 2017
 * Modified by James Hobin 2016, 2017
 *
 * All ascii characters above must be included in any redistribution.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * Created by benreynolds on 2/7/17.
 */

createNameSpace("realityEditor.device.security");

realityEditor.device.security.authenticateSessionForUser = function(encryptedId) {
    console.log("js did run");
    console.log("authenticating with userId: " + encryptedId);
    if (encryptedId === null) {
        console.log("authentication failed");
        //if (document.getElementById("adminModeSwitch").checked) {
        //    document.getElementById("adminModeSwitch").click(); //.checked = false;            
        //}
        globalStates.lockingMode = false;
        globalStates.authenticatedUser = null;
        console.log("Is admin mode on now? " + globalStates.lockingMode);
    } else {
        console.log("success");
        globalStates.lockingMode = true;
        globalStates.authenticatedUser = encryptedId;
        console.log("Is admin mode on now? " + globalStates.lockingMode);
    }
    //console.log(objectExp);
};

// TODO: can the lock owner change locked objects? i don't think they should be able to

// actionType = "move", "delete", "lock", "unlock" // TODO: do we need actionType?
realityEditor.device.security.isNodeActionAllowed = function(objectKey, nodeKey, actionType) {
    var node = objects[objectKey].nodes[nodeKey];
    var lockHolder = node.lockHolder;
    var isLocked = !!lockHolder;
    
    if (!isLocked) return true; // if the node isn't locked, of course this action is allowed

    var currentUser = globalStates.authenticatedUser;

    if ((lockHolder === currentUser) && (actionType === "lock" || actionType === "unlock")) return true; // if the user owns the lock, they can lock or unlock it //do anything
    
    return false; // otherwise nothing is allowed
};

// TODO: should only nodes have locks, and links inherit those? or links have their own locks?
realityEditor.device.security.isLinkActionAllowed = function(objectKeyA, nodeKeyA, objectKeyB, nodeKeyB, actionType) {
    var nodeA = objects[objectKeyA].nodes[nodeKeyA];
    var lockHolderA = nodeA.lockHolder;
    var isLockedA = !!lockHolderA;

    var nodeB = objects[objectKeyB].nodes[nodeKeyB];
    var lockHolderB = nodeB.lockHolder;
    var isLockedB = !!lockHolderB;
    
    if (!isLockedA && !isLockedB) return true; // if both nodes aren't locked, of course this action is allowed

    //var currentUser = globalStates.authenticatedUser;

    //if (lockHolderA === currentUser && lockHolderB === currentUser) return true; // if the user owns both locks, they can do anything

    return false; // otherwise nothing is allowed
};

//realityEditor.device.security.isObjectActionAllowed = function(objectKey, actionType) {
//    var object = objects[objectKey];
//    // TODO: implement
//};


