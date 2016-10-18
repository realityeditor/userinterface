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


/**
 * @desc Constructor used to define every logic node generated in the Object. It does not need to contain its own ID
 * since the object is created within the nodes with the ID as object name.
 **/

/**********************************************************************************************************************
 ******************************************** Constructors ************************************************************
 **********************************************************************************************************************/

/**
 * @desc This is the default constructor for the Hybrid Object.
 * It contains information about how to render the UI and how to process the internal data.
 **/

function Objects() {
    // The ID for the object will be broadcasted along with the IP. It consists of the name with a 12 letter UUID added.
    this.objectId = null;
    // The name for the object used for interfaces.
    this.name = "";
    // The IP address for the object is relevant to point the Reality Editor to the right server.
    // It will be used for the UDP broadcasts.
    this.ip = "localhost";
    // The version number of the Object.
    this.version = "1.7.0";

    this.protocol = "R1";
    // The (t)arget (C)eck(S)um is a sum of the checksum values for the target files.
    this.tcs = null;
    // Reality Editor: This is used to possition the UI element within its x axis in 3D Space. Relative to Marker origin.
    this.x = 0;
    // Reality Editor: This is used to possition the UI element within its y axis in 3D Space. Relative to Marker origin.
    this.y = 0;
    // Reality Editor: This is used to scale the UI element in 3D Space. Default scale is 1.
    this.scale = 1;
    // Unconstrained positioning in 3D space
    this.matrix = [];
    // Used internally from the reality editor to indicate if an object should be rendered or not.
    this.visible = false;
    // Used internally from the reality editor to trigger the visibility of naming UI elements.
    this.visibleText = false;
    // Used internally from the reality editor to indicate the editing status.
    this.visibleEditing = false;
    // every object holds the developer mode variable. It indicates if an object is editable in the Reality Editor.
    this.developer = true;
    // Intended future use is to keep a memory of the last matrix transformation when interacted.
    // This data can be used for interacting with objects for when they are not visible.
    this.memory = {}; // TODO use this to store UI interface for image later.
    // Stores all the links that emerge from within the object. If a IOPoint has new data,
    // the server looks through the Links to find if the data has influence on other IOPoints or Objects.
    this.links = {};
    // Stores all IOPoints. These points are used to keep the state of an object and process its data.
    this.nodes = {};
    // The arrangement of nodes for crafting.
    this.logic = {};
}

/**
 * @desc The Link constructor is used every time a new link is stored in the links object.
 * The link does not need to keep its own ID since it is created with the link ID as Obejct name.
 **/

function Link() {
    // The origin object from where the link is sending data from
    this.objectA = null;
    // The origin IOPoint from where the link is taking its data from
    this.nodeA = null;
    // if origin location is a Logic Node then set to Logic Node output location (which is a number between 0 and 3) otherwise null
    this.logicA = null;
    // Defines the type of the link origin. Currently this function is not in use.
    this.namesA = ["",""];
    // The destination object to where the origin object is sending data to.
    // At this point the destination object accepts all incoming data and routs the data according to the link data sent.
    this.objectB = null;
    // The destination IOPoint to where the link is sending data from the origin object.
    // objectB and nodeB will be send with each data package.
    this.nodeB = null;
    // if destination location is a Logic Node then set to logic block input location (which is a number between 0 and 3) otherwise null
    this.logicB = null;
    // Defines the type of the link destination. Currently this function is not in use.
    this.namesB = ["",""];
    // check that there is no endless loop in the system
    this.loop = false;
    // Will be used to test if a link is still able to find its destination.
    // It needs to be discussed what to do if a link is not able to find the destination and for what time span.
    this.health = 0; // todo use this to test if link is still valid. If not able to send for some while, kill link.
}

/**
 * @desc Constructor used to define every nodes generated in the Object. It does not need to contain its own ID
 * since the object is created within the nodes with the ID as object name.
 **/

function Node() {
    // the name of each link. It is used in the Reality Editor to show the IO name.
    this.name = "";
    // the actual data of the node
    this.item = [new Data(), {}, {}, {}]; // todo maybe value
    // Reality Editor: This is used to possition the UI element within its x axis in 3D Space. Relative to Marker origin.
    this.x = 0;
    // Reality Editor: This is used to possition the UI element within its y axis in 3D Space. Relative to Marker origin.
    this.y = 0;
    // Reality Editor: This is used to scale the UI element in 3D Space. Default scale is 1.
    this.scale = 1;
    // Unconstrained positioning in 3D space
    this.matrix = [];
    // defines the nodeInterface that is used to process data of this type. It also defines the visual representation
    // in the Reality Editor. Such data points interfaces can be found in the nodeInterface folder.
    // todo appearance should be removed eventually as there is only one kind of appearance
    this.appearance = "logicNode";
    // defines the origin Hardware interface of the IO Point. For example if this is arduinoYun the Server associates
    // this IO Point with the Arduino Yun hardware interface.
    //this.type = "arduinoYun"; // todo "arduinoYun", "virtual", "edison", ... make sure to define yours in your internal_module file
    // indicates how much calls per second is happening on this node
    this.stress = 0;
}

/**
 * @desc Constructor used to define every logic node generated in the Object. It does not need to contain its own ID
 * since the object is created within the nodes with the ID as object name.
 **/

function Logic() {
    this.name = "";
    // data for logic blocks. depending on the blockSize which one is used.
    this.item = [new Data(), new Data(), new Data(), new Data()];
    // Reality Editor: This is used to possition the UI element within its x axis in 3D Space. Relative to Marker origin.
    this.x = 0;
    // Reality Editor: This is used to possition the UI element within its y axis in 3D Space. Relative to Marker origin.
    this.y = 0;
    // Reality Editor: This is used to scale the UI element in 3D Space. Default scale is 1.
    this.scale = 1;
    // Unconstrained positioning in 3D space
    this.matrix = [];
    // if showLastSettingFirst is true then lastSetting is the name of the last block that was moved or set.
    this.lastSetting = false;

    this.lastSettingBlock = "";
    // the iconImage is in png or jpg format and will be stored within the logicBlock folder. A reference is placed here.
    this.iconImage = null;
    // nameInput are the names given for each IO.
    this.nameInput = ["", "", "", ""];
    // nameOutput are the names given for each IO
    this.nameOutput = ["", "", "", ""];
    // the array of possible connections within the logicBlock.
    // if a block is set, a new Node instance is coppied in to the spot.
    /*  this.block = [
     [[null, 0], [null, 0], [null, 0], [null, 0]],
     [[null, 0], [null, 0], [null, 0], [null, 0]],
     [[null, 0], [null, 0], [null, 0], [null, 0]],
     [[null, 0], [null, 0], [null, 0], [null, 0]]
     ];*/

    this.appearance = "logicNode";

    this.links = {};
    this.blocks = {};
    this.tempLink = null;

    this.tappedContents = null;
    this.tempIncomingLinks = [];
    this.tempOutgoingLinks = [];
}

/**
 * @desc The Link constructor for Blocks is used every time a new logic Link is stored in the logic Node.
 * The block link does not need to keep its own ID since it is created with the link ID as Object name.
 **/

function BlockLink() {
    // origin block UUID
    this.blockA = null;
    // item in that block
    this.itemA = 0;
    // destination block UUID
    this.blockB = null;
    // item in that block
    this.itemB = 0;
    // check if the links are looped.
    this.loop = false;
    // Will be used to test if a link is still able to find its destination.
    // It needs to be discussed what to do if a link is not able to find the destination and for what time span.
    this.health = 0; // todo use this to test if link is still valid. If not able to send for some while, kill link.
    // keeps track of the path from the start block to end block and how to draw it
    this.route = null;
    this.ballAnimationCount = 0;
}

/**
 * @desc Constructor used to define every block within the logicNode.
 * The block does not need to keep its own ID since it is created with the link ID as Object name.
 **/


function Block() {
    // name of the block
    this.name = "";

    this.x = null;
    this.y = null;
    // amount of elements the IO point is created of. Single IO nodes have the size 1.
    this.blockSize = 1;
    // the global / world wide id of the actual reference block design.
    this.globalId = null;
    // the checksum should be identical with the checksum for the persistent package files of the reference block design.
    this.checksum = null; // checksum of the files for the program
    // data for logic blocks. depending on the blockSize which one is used.
    this.item = [new Data(), new Data(), new Data(), new Data()];
    // experimental. This are objects for data storage. Maybe it makes sense to store data in the general object
    // this would allow the the packages to be persistent. // todo discuss usability with Ben.
    this.privateData = {};
    this.publicData = {};

    // IO for logic
    // define how many inputs are active.
    this.activeInputs = [true, false, false, false];
    // define how many outputs are active.
    this.activeOutputs = [true, false, false, false];
    // define the names of each active IO
    this.nameInput = ["", "", "", ""];
    this.nameOutput = ["", "", "", ""];
    // A specific icon for the node, png or jpg.
    this.iconImage = null;
    // Text within the node, if no icon is available.
    this.text = "";
    // indicates how much calls per second is happening on this block
    this.stress = 0;

    this.domElement = null;
    this.isTempBlock = false;
}

/**
 * @desc Definition for Values that are sent around.
 **/

function Data() {
    // storing the numerical content send between nodes. Range is between 0 and 1.
    this.number = 0;
    // Defines the kind of data send. At this point we have 3 active data modes and one future possibility.
    // (f) defines floating point values between 0 and 1. This is the default value.
    // (d) defines a digital value exactly 0 or 1.
    // (+) defines a positive step with a floating point value for compatibility.
    // (-) defines a negative step with a floating point value for compatibility.
    this.mode = "f";
    // string of the name for the unit used (for Example "C", "F", "cm"). Default is set to no unit.
    this.unit = "";
    // scale of the unit that is used. Usually the scale is between 0 and 1.
    this.unitMin = 0;
    this.unitMax = 1;
}