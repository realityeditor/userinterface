// global namespace
var realityEditor = realityEditor || {
		constructors: {
			Object: {},
			Link: {},
			Node: {},
			LogicNode: {},
			LogicGUIState: {},
			BlockLink: {},
			BlockNode: {},
			EdgeBlockNode: {},
			Data: {}
		},
		objects: {},
		states: {},
		device: {
			addEventHandlers: {},
			onLoad: {},
			onTouchDown: {},
			onFalseTouchUp: {},
			onTrueTouchUp: {},
			onTouchEnter: {},
			onTouchLeave: {},
			onCanvasPointerDown: {},
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
			utilities: {
				cout: {},
				newURLTextLoad: {},
				map: {},
				uuidTime: {},
				uuidTimeShort: {},
				randomIntInc: {}
			},
		},
		network: {
			addHeartbeatObject: {},
			onAction: {},
			onInternalPostMessage: {},
			deleteData: {},
			deleteLinkFromObject: {},
			deleteBlockFromObject: {},
			deleteBlockLinkFromObject: {},
			postLinkToServer: {},
			getData: {},
			postData: {},
			postNewLink: {},
			postNewBlockLink: {},
			postNewLogicNode: {},
			postNewBlockPosition: {},
			postNewBlock: {},
			checkForNetworkLoop: {},
			utilities: {
				rename: {}
			}
		},
		gui: {
			canvasCache: {},
			domCache: {},
			utilities: {
				getPosition: {},

				timeSynchronizer: {},
				checkLineCross: {},
				lineEq: {},
				slopeCalc: {},
				calculateX: {},
				calculateY: {},
				checkBetween: {},

				getCenterOfPoints: {},
				sortPointsClockwise: {},
				getCornersClockwise: {},
				areCornersEqual: {},
				areCornerPairsIdentical: {},
				areCornerPairsSymmetric: {},
				areCornersAdjacent: {},
				areCornersOppositeZ: {},
				addCornerPairToOppositeCornerPairs: {},
				estimateIntersection: {}
			},
			setup: {},
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
					multiplyMatrix: {},
					multiplyMatrix4: {},
					copyMatrix: {},
					invertMatrix: {},
					toAxisAngle: {},
					screenCoordinatesToMatrixXY: {},
					insidePoly: {}
				}
			},
			buttons: {
				imageCache: {},
				preload: {}
			},
			pocket: {
				pocketItem: {"pocket": new Objects()},
				pocketItemId: "",
				setPocketPosition: {}
			},
			preferences: {
				addElementInPreferences: {},
				preferencesHide: {},
				preferencesVisible: {}
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
					toLogicJSON: {},
					convertBlockLinkToServerFormat: {},
					convertLogicToServerFormat: {},
					readTextFile: {},
					parseJSONToLogic: {},
					blockColorMap: {}
				},
				blockMenu: {
					initializeBlockMenu: {},
					resetBlockMenu: {},
					menuLoadBlocksNew: {},
					menuLoadBlocks: {},
					defaultBlockData: {},
					menuTabSelected: {},
					redisplayTabSelection: {},
					redisplayBlockSelection: {},
					blockMenuPointerDown: {},
					blockMenuPointerUp: {},
					blockMenuPointerLeave: {},
					blockMenuPointerMove: {}
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
					getBlock: {},
					getCellForBlock: {},
					getBlockOverlappingPosition: {},
					isBlockOutsideGrid: {},
					convertGridPosToBlockPos: {},
					convertBlockPosToGridPos: {},
					addBlockLink: {},
					blockWithID: {},
					addBlock: {},
					updateInOutLinks: {},
					isInOutLink: {},
					isInOutBlock: {},
					forEachLink: {},
					allLinks: {},
					setTempLink: {},
					removeBlockLink: {},
					removeBlock: {},
					removeLinksForBlock: {},
					doesLinkAlreadyExist: {},
					areBlockLinksEqual: {},
					preprocessPointsForDrawing: {}
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
					pointerDown: {},
					pointerMove: {},
					pointerUp: {}
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
			}
		}
		return object;
	};