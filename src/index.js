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

/**********************************************************************************************************************
 ******************************************** global namespace *******************************************************
 **********************************************************************************************************************/
/*
var realityEditor = realityEditor || {
		constructors: {
			Object: {},
			Link: {},
			Node: {},
			LogicNode: {},
			LogicGUIState: {},
			BlockLink: {},
			Block: {},
			EdgeBlock: {},
			Data: {}
		},
		objects: {},
		states: {},
		device: {
            addEventHandlers: {},
			onTouchDown: {},
			onFalseTouchUp: {},
			onTrueTouchUp: {},
			onTouchEnter: {},
			onTouchLeave: {},
			onCanvasPointerDown: {},
            onDocumentPointerMove: {},
			onDocumentPointerUp: {},
			onDocumentPointerDown: {},
			onMultiTouchStart: {},
			onMultiTouchMove: {},
			onMultiTouchEnd: {},
			onMultiTouchCanvasStart: {},
			onMultiTouchCanvasMove: {},
			setDeviceName: {},
			setStates: {},
			removeEventHandlers: {},
            onload: {},
            utilities: {
				newURLTextLoad: {},
				uuidTime: {},
				uuidTimeShort: {},
				randomIntInc: {}
			}
		},
		network: {
			addHeartbeatObject: {},
			onAction: {},
			onInternalPostMessage: {},
			deleteData: {},
			deleteLinkFromObject: {},
			deleteBlockFromObject: {},
			deleteBlockLinkFromObject: {},
			getData: {},
			postData: {},
            postLinkToServer: {},
			postNewLink: {},
			postNewBlockLink: {},
			postNewLogicNode: {},
			postNewBlockPosition: {},
			postNewBlock: {},
			checkForNetworkLoop: {},
            sendResetContent: {},
            onElementLoad: {},
			utilities: {
				rename: {}
			}
		},
		gui: {
			canvasCache: {},
			domCache: {},
            setup: {},
			utilities: {
				checkLineCross: {},
				lineEq: {},
				slopeCalc: {},
				calculateX: {},
				calculateY: {},
				checkBetween: {}
			},
			ar: {
				matrixStates: {},
				setProjectionMatrix: {},
				draw: {
					update: {},
					drawTransformed: {},
					webkitTransformMatrix3d: {},
					hideTransformed: {},
					addElement: {},
					killObjects: {},
					onIframeLoad: {}
				},
				positioning: {
					onScaleEvent: {}
				},
				lines: {
					temporaryLink: {},
					deleteLines: {},
					drawAllLines: {},
					drawInteractionLines: {},
					drawLine: {},
					drawDotLine: {},
					drawGreen: {},
					drawRed: {},
					drawBlue: {},
					drawYellow: {},
					drawSimpleLine: {}
				},
				utilities: {
                    timeSynchronizer: {},
                    map: {},
                    multiplyMatrix: {},
					multiplyMatrix4: {},
					copyMatrix: {},
					invertMatrix: {},
					toAxisAngle: {},
					screenCoordinatesToMatrixXY: {},
					insidePoly: {},
                    estimateIntersection: {}
				}
			},
			buttons: {
				imageCache: {},
				preload: {},
                
			},
			pocket: {
				pocketItem: {"pocket": new Objects()},
				pocketItemId: "",
                pocketButtonAction: {},
				setPocketPosition: {},
                pocketInit: {},
                pocketShown: {},
                pocketShow: {},
                pocketHide: {},
                pocketOnMemoryCreationStart: {},
                pocketOnMemoryCreationStop: {},
                pocketOnMemoryDeletionStart: {},
                pocketOnMemoryDeletionStop: {}
			},
			settings: {
				hideSettings: {},
				showSettings: {},
			},
			crafting: {
				logicStates: {},
				updateGrid: {},
				addDomElementForBlock: {},
				redrawDataCrafting: {},
				drawDataCraftingLine: {},
				craftingBoardVisible: {},
				craftingBoardHide: {},
				blockMenuVisible: {},
				blockMenuHide: {},
				addDataCraftingEventListeners: {},
				removeDataCraftingEventListeners: {},
				resetCraftingBoard: {},
				resetTempLogicState: {},
				initializeDataCraftingGrid: {},
				initLogicInOutBlocks: {},
				utilities: {
					toBlockJSON: {},
					convertBlockLinkToServerFormat: {},
					convertLogicToServerFormat: {},
                    convertLinksFromServer: {}
                },
				blockMenu: {
					initializeBlockMenu: {},
					resetBlockMenu: {},
					redisplayTabSelection: {},
					redisplayBlockSelection: {}
				},
				grid: {
					Grid: function (width, height) {
					},
					Cell: function (location) {
					},
					CellLocation: function (col, row) {
					},
					Route: function (cellLocations) {
					},
					RouteSegment: function (route, horz, vert) {
					},
					getCellForBlock: {},
                    getBlockPixelWidth: {},
					isBlockOutsideGrid: {},
					convertGridPosToBlockPos: {},
					convertBlockPosToGridPos: {},
					addBlockLink: {},
					blockWithID: {},
					addBlock: {},
					updateInOutLinks: {},
                    isEdgePlaceholderLink: {},
                    isEdgePlaceholderBlock: {},
					isInOutBlock: {},
					forEachLink: {},
					setTempLink: {},
					removeBlockLink: {},
					removeBlock: {},
					removeLinksForBlock: {},
				},
				eventHelper: {
					getCellOverPointer: {},
					getCellContents: {},
					areCellsEqual: {},
					areBlocksEqual: {},
					convertToTempBlock: {},
					moveBlockDomToPosition: {},
					snapBlockToCellIfPossible: {},
					offsetForItem: {},
					canConnectBlocks: {},
					canDrawLineFrom: {},
					areBlocksTempConnected: {},
					canPlaceBlockInCell: {},
					styleBlockForHolding: {},
					styleBlockForPlacement: {},
					shouldUploadBlock: {},
					shouldUploadBlockLink: {},
					getServerObjectLogicKeys: {},
					placeBlockInCell: {},
					removePortBlocksIfNecessary: {},
					getOutgoingLinks: {},
					getIncomingLinks: {},
					replacePortBlocksIfNecessary: {},
					updateTempLinkOutlinesForBlock: {},
					convertTempLinkOutlinesToLinks: {},
					blocksExist: {},
					resetTempLinkOutlines: {},
					removeTappedContents: {},
					createTempLink: {},
					resetTempLink: {},
					drawLinkLine: {},
					resetLinkLine: {},
					drawCutLine: {},
					resetCutLine: {},
					createLink: {},
					cutIntersectingLinks: {},
					getDomElementForBlock: {},
					generateBlockGlobalId: {},
					isPortBlock: {},
					isInputBlock: {},
					isOutputBlock: {},
					addBlockFromMenu: {},
					openBlockSettings: {},
					handleBlockSettingsChange: {},
					hideBlockSettings: {}
				},
				eventHandlers: {
					onPointerDown: {},
					onPointerMove: {},
					onPointerUp: {}
				}
			},
			memory: {
				MemoryContainer: function (element) {
				},
				MemoryPointer: function (link, isObjectA) {
				},
				initMemoryBar: function () {
				},
				removeMemoryBar: function () {
				},
				receiveThumbnail: function (thumbnailUrl) {
				},
				addObjectMemory: function (obj) {
				},
				getMemoryWithId: function (id) {
				},
				getMemoryPointerWithId: function (id) {
				},
				memoryCanCreate: function () {
				},
				createMemoryWeb: function () {
				},
				removeMemoryWeb: function () {
				}
			},
			advertisement: {
				temporaryLink: {},
				timeout: {},
				links: {},
				logic: {},
				touchStart: {},
				touchEnd: {},
				draw: {},
				reset: {}
			}
		}
	};
	*/

/**
 * @desc This function generates all required namespaces and initializes a namespace if not existing.
 * Additional it includes pointers to each subspace.
 *
 * Inspired by code examples from:
 * https://www.kenneth-truyers.net/2013/04/27/javascript-namespaces-and-modules/
 *
 * @param namespace string of the full namespace path
 * @return object that presents the actual used namespace
 **/
var createNameSpace = createNameSpace || function (namespace) {
		var splitNameSpace = namespace.split("."), object = this, object2;
		for (var i = 0; i < splitNameSpace.length; i++) {
			object = object[splitNameSpace[i]] = object[splitNameSpace[i]] || {};
			object2 = this;
			for (var e = 0; e < i; e++) {
				object2 = object2[splitNameSpace[e]];
				object[splitNameSpace[e]] = object[splitNameSpace[e]] || object2;
				object.cout = this.cout;
			}
		}
		return object;
	};
