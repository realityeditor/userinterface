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
        //    document.getElementById("adminModeSwitch").click(); //.checked = false; // TODO: how to do this in new settings menu?       
        //}
        //realityEditor.gui.settings.setSettings("lockingState", false);
        //document.getElementById("settingsIframe").contentWindow.postMessage(JSON.stringify({getSettings: {lockingToggle: false}}), "*");

        globalStates.lockingMode = false;
        globalStates.lockPassword = null;
        
        document.getElementById("settingsIframe").contentWindow.postMessage(JSON.stringify({getSettings: {
            extendedTracking: globalStates.extendedTracking,
            editingMode: globalStates.editingMode,
            clearSkyState: globalStates.clearSkyState,
            instantState: globalStates.instantState,
            externalState: globalStates.externalState,
            settingsButton : globalStates.settingsButtonState,
            lockingMode: globalStates.lockingMode,
            lockPassword: globalStates.lockPassword
        }
        }), "*");
        
        //globalStates.authenticatedUser = null;
        
    } else {
        console.log("authentication success");
        globalStates.lockingMode = true;
        //globalStates.authenticatedUser = encryptedId;
        console.log("Is locking mode on now? " + globalStates.lockingMode + " ...and lockPassword = " + globalStates.lockPassword);
    }
};

realityEditor.device.security.lockVisibleNodesAndLinks = function(lockType) {
    var visibleNodes = realityEditor.gui.ar.getVisibleNodes();
    console.log("visibleNodes = ", visibleNodes);

    visibleNodes.forEach( function(keys) {
        var content = {
            lockPassword: globalStates.lockPassword,
            lockType: lockType
        };
        realityEditor.network.postNewLockToNode(objects[keys.objectKey].ip, keys.objectKey, keys.nodeKey, content);
    });

    var visibleLinks = realityEditor.gui.ar.getVisibleLinks(visibleNodes);
    console.log("visibleLinks = ", visibleLinks);

    visibleLinks.forEach( function(keys) {
        var content = {
            lockPassword: globalStates.lockPassword,
            lockType: lockType
        };
        realityEditor.network.postNewLockToLink(objects[keys.objectKey].ip, keys.objectKey, keys.linkKey, content);
    });
};

realityEditor.device.security.unlockVisibleNodesAndLinks = function() {
    var visibleNodes = realityEditor.gui.ar.getVisibleNodes();
    console.log("visibleNodes = ", visibleNodes);

    visibleNodes.forEach( function(keys) {
        realityEditor.network.deleteLockFromNode(objects[keys.objectKey].ip, keys.objectKey, keys.nodeKey, globalStates.lockPassword);
    });

    var visibleLinks = realityEditor.gui.ar.getVisibleLinks(visibleNodes);
    console.log("visibleLinks = ", visibleLinks);

    visibleLinks.forEach( function(keys) {
        realityEditor.network.deleteLockFromLink(objects[keys.objectKey].ip, keys.objectKey, keys.linkKey, globalStates.lockPassword);
    });
};





// actionType = "edit", "create", "lock", "unlock"
realityEditor.device.security.isNodeActionAllowed = function(objectKey, nodeKey, actionType) {
    var node = objects[objectKey].nodes[nodeKey];
    var lockPassword = node.lockPassword;
    var lockType = node.lockType;
    var isLocked = !!lockPassword && !!lockType;
    
    if (!isLocked) return true; // if the node isn't locked, of course this action is allowed
    
    if (lockType === "half" && !(actionType === "lock" || actionType === "unlock")) return true; // a half locked node can be modified but not un/locked unless correct password

    if ((lockPassword === globalStates.lockPassword) && (actionType === "lock" || actionType === "unlock")) return true; // if the user owns the lock, they can lock or unlock it
    
    return false; // otherwise nothing is allowed
};

// TODO: do we need separate methods for link and node, or are they equivalent?
// actionType = "delete", "lock", "unlock"
realityEditor.device.security.isLinkActionAllowed = function(objectKey, linkKey, actionType) {
    var link = objects[objectKey].links[linkKey];
    var lockPassword = link.lockPassword;
    var lockType = link.lockType;
    var isLocked = !!lockPassword && !!lockType;
    
    if (!isLocked) return true; // if the link isn't locked, of couse this action is allowed

    if (lockType === "half" && !(actionType === "lock" || actionType === "unlock")) return true; // a half locked node can be modified but not un/locked unless correct password

    if ((lockPassword === globalStates.lockPassword) && (actionType === "lock" || actionType === "unlock")) return true; // if the user owns the lock, they can lock or unlock it 

    return false; // otherwise nothing is allowed
};

// TODO: debug only
// temporary method that can be called from the console to unlock all objects, in case they get locked by an inaccessible device
realityEditor.device.security.debugUnlockAll = function() {
    for (var objectKey in objects) {
        if (!objects.hasOwnProperty(objectKey)) continue;

        // unlock all nodes
        for (var nodeKey in objects[objectKey].nodes) {
            if (!objects[objectKey].nodes.hasOwnProperty(nodeKey)) continue;

            realityEditor.network.deleteLockFromNode(objects[objectKey].ip, objectKey, nodeKey, "DEBUG");
        }
        
        // unlock all links
        for (var linkKey in objects[objectKey].links) {
            if (!objects[objectKey].links.hasOwnProperty(linkKey)) continue;

            realityEditor.network.deleteLockFromLink(objects[objectKey].ip, objectKey, linkKey, "DEBUG");
        }
    }
};
