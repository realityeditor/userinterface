// done
function getCellOverPointer(pointerX, pointerY) {
  var grid = globalStates.currentLogic.grid;
  // returns cell if position is within grid bounds, null otherwise
  return grid.getCellFromPointerPosition(pointerX, pointerY);
}

// done
function getCellContents(cell) {
  // use grid methods to get block/item overlapping this cell
  if (cell) {
    var block = cell.blockAtThisLocation();
    if (block) {
      var item = cell.itemAtThisLocation();
      return {
        block: block,
        item: item,
        cell: cell
      };
    }
  }
  return null;
}

function areCellsEqual(cell1, cell2) {
  return (cell1.location.col === cell2.location.col)
      && (cell1.location.row === cell2.location.row);
}

function areBlocksEqual(block1, block2) {
  return (block1.globalId === block2.globalId);
}

function convertToTempBlock(contents) {
  contents.block.isTempBlock = true;
  updateTempLinkOutlinesForBlock(contents);
}

function moveBlockDomToPosition(contents, pointerX, pointerY) {
  var grid = globalStates.currentLogic.grid;
  var domElement = getDomElementForBlock(contents.block); 
  if (!domElement) return;
  domElement.style.left = pointerX - offsetForItem(contents.item);
  domElement.style.top = pointerY - grid.blockRowHeight/2;
}

function snapBlockToCellIfPossible(contents, cell, pointerX, pointerY) {
  var grid = globalStates.currentLogic.grid;
  if (canPlaceBlockInCell(contents, cell)) {
    var dX = Math.abs(pointerX - grid.getCellCenterX(cell)) / (grid.blockColWidth/2);
    var dY = Math.abs(pointerY - grid.getCellCenterY(cell)) / (grid.blockRowHeight/2);
    var shouldSnap = (dX * dX + dY * dY) < 0.5; // only snaps to grid if tighter bound is overlapped
    if (shouldSnap) {
      moveBlockDomToPosition(contents, grid.getCellCenterX(cell), grid.getCellCenterY(cell));
      return true;
    }
  }
  return false;
}

function offsetForItem(item) {
  var grid = globalStates.currentLogic.grid;
  return grid.blockColWidth/2 + item * (grid.blockColWidth + grid.marginColWidth);
}

function canConnectBlocks(contents1, contents2) {
  return !areBlocksEqual(contents1.block, contents2.block)
      && (contents2.block.activeInputs[contents2.item] === true);
}

function canDrawLineFrom(contents) {
  return (contents.block.activeOutputs[contents.item] === true);
}

function areBlocksTempConnected(contents1, contents2) {
  var tempLink = globalStates.currentLogic.tempLink;
  if (!tempLink) return false;

  return areBlocksEqual(blockWithID(tempLink.nodeA, globalStates.currentLogic), contents1.block) &&
          areBlocksEqual(blockWithID(tempLink.nodeB, globalStates.currentLogic), contents2.block) &&
          tempLink.logicA === contents1.item &&
          tempLink.logicB === contents2.item;
}

function canPlaceBlockInCell(tappedContents, cell) {
  var grid = globalStates.currentLogic.grid;
  if (!cell || !tappedContents) return false;
  var cellsOver = grid.getCellsOver(cell, tappedContents.block.blockSize, tappedContents.item);
  var canPlaceBlock = true;
  cellsOver.forEach( function(cell) {
    if (!cell || !cell.canHaveBlock() || (cell.blockAtThisLocation() && !cell.blockAtThisLocation().isTempBlock && !cell.blockAtThisLocation().isPortBlock)) {
      canPlaceBlock = false;
    }
  });
  return canPlaceBlock;
}

function styleBlockForHolding(contents, startHold) {
  var domElement = getDomElementForBlock(contents.block);
  if (!domElement) return;
  if (startHold) {
    domElement.setAttribute('class','blockDivHighlighted');
  } else {
    domElement.setAttribute('class','blockDivPlaced');
  }

}

function styleBlockForPlacement(contents, shouldHighlight) {
  var domElement = getDomElementForBlock(contents.block);
  if (!domElement) return;
  if (shouldHighlight) {
    domElement.style.opacity = 1.00;
  } else {
    domElement.style.opacity = 0.50;
  }
}

function shouldUploadBlock(block) {
  return !isInOutBlock(block.globalId) && !isPortBlock(block);
}

function shouldUploadBlockLink(blockLink) {
  if (!blockLink) return false;
  return !isInOutLink(blockLink);
}

function getServerObjectLogicKeys(logic) {
  for (var key in objects) {
    var object = objects[key];
    for (var logicKey in object.nodes) {
      if(object.nodes[logicKey].type === "logic") {
        if (object.nodes[logicKey] === logic) {
          return {
            ip: objects[key].ip,
            objectKey: key,
            logicKey: logicKey
          }
        }
      }
    }
  }
  return null;
}

function placeBlockInCell(contents, cell) {
  var grid = globalStates.currentLogic.grid;
  if (cell) {
    var prevCell = getCellForBlock(grid, contents.block, contents.item);
    var newCellsOver = grid.getCellsOver(cell, contents.block.blockSize, contents.item);

    // if it's being moved to the top or bottom rows, delete the invisible port block underneath
    // this also saves the links connected to those port blocks so we can add them to the new block
    var portLinkData = removePortBlocksIfNecessary(newCellsOver);

    contents.block.x = Math.floor((cell.location.col / 2) - (contents.item));
    contents.block.y = (cell.location.row / 2);
    contents.block.isTempBlock = false;

    if (shouldUploadBlock(contents.block)) {
      var keys = getServerObjectLogicKeys(globalStates.currentLogic);
      moveBlockPosition(keys.ip, keys.objectKey, keys.logicKey, contents.block.globalId, {x: contents.block.x, y: contents.block.y});
    }

    //if (!isInOutBlock(contents.block.globalId) && !isPortBlock(contents.block)) {
    //  for (var key in objects) {
    //    var object = objects[key];
    //    for (var logicKey in object.nodes) {
    //      if (object.nodes[logicKey] === globalStates.currentLogic) {
    //        moveBlockPosition(objects[key].ip, key, logicKey, contents.block.globalId, {x: contents.block.x, y: contents.block.y});
    //      }
    //    }
    //  }
    //}

    removeBlockDom(contents.block); // remove do so it can be re-rendered in the correct place

    convertTempLinkOutlinesToLinks(contents);

    portLinkData.forEach( function(linkData) {

      var nodeA = blockWithID(linkData.nodeA, globalStates.currentLogic);
      var nodeB = blockWithID(linkData.nodeB, globalStates.currentLogic);

      // if we deleted a link from the top row, add it to this block if possible
      if (nodeB && !nodeA) {
        if (contents.block.activeOutputs[linkData.logicA] === true) {
          addBlockLink(contents.block.globalId, linkData.nodeB, linkData.logicA, linkData.logicB, true);
        }
      // if we deleted a link to the bottom row, add it to this block if possible
      } else if (nodeA && !nodeB) {
        if (contents.block.activeInputs[linkData.logicB] === true) {
          addBlockLink(linkData.nodeA, contents.block.globalId, linkData.logicA, linkData.logicB, true);
        }
      }
    });

    if (contents.block.y === 0 || contents.block.y === 3) {
      updateInOutLinks(contents.block.globalId);        
    }

    // if it's being moved away from the top or bottom rows, re-add the invisible port block underneath
    if (prevCell) {
      var prevCellsOver = grid.getCellsOver(prevCell, contents.block.blockSize, contents.item);
      replacePortBlocksIfNecessary(prevCellsOver);
    }
    contents = null;

  } else {
    removeTappedContents(contents);
  }
  updateGrid(globalStates.currentLogic.grid);
}

function removePortBlocksIfNecessary(cells) {
  var portLinkData = [];
  cells.forEach( function(cell, i) {
    if (cell) {
      var existingBlock = cell.blockAtThisLocation();
      if (existingBlock && isPortBlock(existingBlock)) {
          if (isInputBlock(existingBlock)) {
            var outgoingLinks = getOutgoingLinks(existingBlock);
            outgoingLinks.forEach(function(link) {
              portLinkData.push({
                nodeA: null,
                nodeB: link.nodeB,
                logicA: i,
                logicB: link.logicB
              });
            });
          } else if (isOutputBlock(existingBlock)) {
            var incomingLinks = getIncomingLinks(existingBlock);
            incomingLinks.forEach(function(link) {
              portLinkData.push({
                nodeA: link.nodeA,
                nodeB: null,
                logicA: link.logicA,
                logicB: i
              });
            });
          }
          removeBlock(globalStates.currentLogic, existingBlock.globalId);
      }
    }
  });
  return portLinkData;
}

function getOutgoingLinks(block) {
  var outgoingLinks = [];
  for (var linkKey in globalStates.currentLogic.links) {
    var link = globalStates.currentLogic.links[linkKey];
    if (link.nodeA === block.globalId) {
      outgoingLinks.push(link);
    }
  }
  return outgoingLinks;
}

function getIncomingLinks(block) {
  var incomingLinks = [];
  for (var linkKey in globalStates.currentLogic.links) {
    var link = globalStates.currentLogic.links[linkKey];
    if (link.nodeB === block.globalId) {
      incomingLinks.push(link);
    }
  }
  return incomingLinks;
}

function replacePortBlocksIfNecessary(cells) {
  cells.forEach( function(cell) {
    if (cell && !cell.blockAtThisLocation()) {
      if (cell.location.row === 0 || cell.location.row === globalStates.currentLogic.grid.size-1) {
        // var blockJSON = toBlockJSON("edge", 1); //TODO: encode all info here
        var width = 1;
        var privateData = {};
        var publicData = {};
        var activeInputs = (cell.location.row === 0) ? [false, false, false, false] : [true, false, false, false];
        var activeOutputs = (cell.location.row === 0) ? [true, false, false, false] : [false, false, false, false];
        var nameInput = ["","","",""];
        var nameOutput = ["","","",""];
        var blockPos = convertGridPosToBlockPos(cell.location.col, cell.location.row);
        var inOrOut = blockPos.y === 0 ? "In" : "Out";
        var name = "edgePlaceholder" + inOrOut + blockPos.x;
        var globalId = name;
        var blockJSON = toBlockJSON(name, width, privateData, publicData, activeInputs, activeOutputs, nameInput, nameOutput);
        var block = addBlock(blockPos.x, blockPos.y, blockJSON, globalId, true);
      }
    }
  });
}

function updateTempLinkOutlinesForBlock(contents) {
  for (var linkKey in globalStates.currentLogic.links) {
    var link = globalStates.currentLogic.links[linkKey];
    if (link.nodeB === contents.block.globalId) {
      globalStates.currentLogic.guiState.tempIncomingLinks.push({
          nodeA: link.nodeA,
          logicA: link.logicA,
          logicB: link.logicB
      });
    
    } else if (link.nodeA === contents.block.globalId) {
      globalStates.currentLogic.guiState.tempOutgoingLinks.push({
          logicA: link.logicA,
          nodeB: link.nodeB,
          logicB: link.logicB
      });
    }
  }

  removeLinksForBlock(globalStates.currentLogic, contents.block.globalId);
}

function convertTempLinkOutlinesToLinks(contents) {
  globalStates.currentLogic.guiState.tempIncomingLinks.forEach( function(linkData) {
    if (blocksExist(linkData.nodeA, contents.block.globalId)) {
      addBlockLink(linkData.nodeA, contents.block.globalId, linkData.logicA, linkData.logicB, true);
    }
  });

  globalStates.currentLogic.guiState.tempOutgoingLinks.forEach( function(linkData) {
    if (blocksExist(linkData.nodeB, contents.block.globalId)) {
      addBlockLink(contents.block.globalId, linkData.nodeB, linkData.logicA, linkData.logicB, true);
    }
  });

  resetTempLinkOutlines();
}

function blocksExist(block1ID, block2ID) {
  var blocks = globalStates.currentLogic.blocks;
  return !!(blocks[block1ID]) && !!(blocks[block2ID]);
}

function resetTempLinkOutlines() {
  globalStates.currentLogic.guiState.tempIncomingLinks = [];
  globalStates.currentLogic.guiState.tempOutgoingLinks = [];
}

function removeTappedContents(contents) {
  var grid = globalStates.currentLogic.grid;
  resetTempLinkOutlines();
  removeBlock(globalStates.currentLogic, contents.block.globalId);

  // replace port blocks if necessary
  var prevCell = getCellForBlock(grid, contents.block, contents.item);
  if (prevCell) {
    var prevCellsOver = grid.getCellsOver(prevCell, contents.block.blockSize, contents.item);
    replacePortBlocksIfNecessary(prevCellsOver);
  }

  contents = null;
  updateGrid(globalStates.currentLogic.grid);
}

function createTempLink(contents1, contents2) {
  var newTempLink = addBlockLink(contents1.block.globalId, contents2.block.globalId, contents1.item, contents2.item, false);
  setTempLink(newTempLink);
  updateGrid(globalStates.currentLogic.grid);
}

function resetTempLink() {
  setTempLink(null);
  updateGrid(globalStates.currentLogic.grid);
}

function drawLinkLine(contents, endX, endY) {
  var grid = globalStates.currentLogic.grid;
  var tempLine = globalStates.currentLogic.guiState.tempLine;
  // actual drawing happens in index.js loop, we just need to set endpoint here
  var startX = grid.getCellCenterX(contents.cell);
  var startY = grid.getCellCenterY(contents.cell);
  var hsl = contents.cell.getColorHSL();
  var lineColor = 'hsl(' + hsl.h + ', '+ hsl.s +'%,'+ hsl.l +'%)';
  tempLine.start = {
    x: startX,
    y: startY
  };
  tempLine.end = {
    x: endX,
    y: endY
  };
  tempLine.color = lineColor;
}

function resetLinkLine() {
  var tempLine = globalStates.currentLogic.guiState.tempLine;
  tempLine.start = null;
  tempLine.end = null;
  tempLine.color = null;
}

function drawCutLine(start, end) {
  var cutLine = globalStates.currentLogic.guiState.cutLine;
  // actual drawing happens in index.js loop, we just need to set endpoint here
  cutLine.start = start;
  cutLine.end = end;
}

function resetCutLine() {
  var cutLine = globalStates.currentLogic.guiState.cutLine;
  cutLine.start = null;
  cutLine.end = null;
}

function createLink(contents1, contents2, tempLink) {
  var addedLink = addBlockLink(contents1.block.globalId, contents2.block.globalId, contents1.item, contents2.item, true);
  if (addedLink && tempLink) {
      addedLink.route = tempLink.route; // copy over the route rather than recalculating everything
      addedLink.ballAnimationCount = tempLink.ballAnimationCount;
  }
}

function cutIntersectingLinks() {
  var cutLine = globalStates.currentLogic.guiState.cutLine;
  if (!cutLine || !cutLine.start || !cutLine.end) return;
  var didRemoveAnyLinks = false;
  for (var linkKey in globalStates.currentLogic.links) {
      var didIntersect = false;
      var blockLink = globalStates.currentLogic.links[linkKey];
      var points = globalStates.currentLogic.grid.getPointsForLink(blockLink);
      for (var j = 1; j < points.length; j++) {
          var start = points[j - 1];
          var end = points[j];
          if (checkLineCross(start.screenX, start.screenY, end.screenX, end.screenY, cutLine.start.x, cutLine.start.y, cutLine.end.x, cutLine.end.y)) {
              didIntersect = true;
          }
          if (didIntersect) {
              removeBlockLink(linkKey);
              didRemoveAnyLinks = true;
          }
      }
  }
  if (didRemoveAnyLinks) {
      updateGrid(globalStates.currentLogic.grid);
  }
}

function getDomElementForBlock(block) {
  if (isPortBlock(block)) return;
  return globalStates.currentLogic.guiState.blockDomElements[block.globalId];
}

function generateBlockGlobalId() {
  return "block" + uuidTime();
}

function isPortBlock(block) {
  return block.isPortBlock;
}

function isInputBlock(block) {
  return isPortBlock(block) && block.y === 0;
}

function isOutputBlock(block) {
  return isPortBlock(block) && !isInputBlock(block);
}

// new functions

function addBlockFromMenu(blockJSON, pointerX, pointerY) {
    // var name = blockJSON.name;
    // var width = blockJSON.width;
    var globalId = generateBlockGlobalId();
    var addedBlock = addBlock(-1, -1, blockJSON, globalId);
    addDomElementForBlock(addedBlock, globalStates.currentLogic.grid, true);

    globalStates.currentLogic.guiState.tappedContents = {
        block: addedBlock,
        item: 0,
        cell: null
    };
    touchState = TS_MOVE;

    pointerMove({
        pageX: pointerX,
        pageY: pointerY
    });

}

// TODO: handle differently if can't load iframe? don't display at all?
  // (do some blocks not have settings and therefore opening the settings
  // page should be disabled?)
function openBlockSettings(block) {

  var keys = getServerObjectLogicKeys(globalStates.currentLogic);
  var settingsUrl = 'http://' + keys.ip + ':' + httpPort + '/logicBlock/' + block.name + "/index.html";
  var craftingBoard = document.getElementById('craftingBoard');
  var blockSettingsContainer = document.createElement('iframe');

/*
  blockSettingsContainer.addEventListener('load', function() {
    blockSettingsContainer.contentWindow.openSettingsWithHandler(handleBlockSettingsChange, block);
  });
*/

  blockSettingsContainer.setAttribute('id', 'blockSettingsContainer');
  blockSettingsContainer.src = settingsUrl; //'blocks/'+block.name+'/settings.html';
  // blockSettingsContainer... //post default settings to page
  craftingBoard.appendChild(blockSettingsContainer);
}

function handleBlockSettingsChange(block, params) {
  for (key in params) {
    if (block.publicData.hasOwnProperty(key)) {
      block.publicData[key] = params[key];
    }
  }
}

function hideBlockSettings() {
  var container = document.getElementById('blockSettingsContainer');
  if (container) {
    container.parentNode.removeChild(container);
  }
}
