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
        // pointerX: pointerX
        // isMoving: false
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
  domElement.style.left = pointerX - offsetForItem(contents.item);
  domElement.style.top = pointerY - grid.blockRowHeight/2;
}

function offsetForItem(item) {
  var grid = globalStates.currentLogic.grid;

  return grid.blockColWidth/2 + item * (grid.blockColWidth + grid.marginColWidth);
}

function canConnectBlocks(contents1, contents2) {
  return !areBlocksEqual(contents1.block, contents2.block) && !isInputBlock(contents2.block);
}

function areBlocksTempConnected(contents1, contents2) {
  var tempLink = globalStates.currentLogic.tempLink;
  if (!tempLink) return false;

  return areBlocksEqual(tempLink.blockA, contents1.block) &&
          areBlocksEqual(tempLink.blockB, contents2.block) &&
          tempLink.itemA === contents1.item &&
          tempLink.itemB === contents2.item;
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

//TODO: modify so that whenever you add a block to a cell with a portBlock, first remove the port block
//      and whenever you remove a block from a cell in top or bottom rows, re-add the port block

function placeBlockInCell(contents, cell) {
  var grid = globalStates.currentLogic.grid;
  if (cell) {
    var prevCell = getCellForBlock(grid, contents.block, contents.item);
    var newCellsOver = grid.getCellsOver(cell, contents.block.blockSize, contents.item);

    removePortBlocksIfNecessary(newCellsOver);

    contents.block.x = Math.floor((cell.location.col / 2) - (contents.item));
    contents.block.y = (cell.location.row / 2);
    contents.block.isTempBlock = false;
    convertTempLinkOutlinesToLinks(contents);

    // removePortBlocksIfNecessary(newCellsOver);
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
  cells.forEach( function(cell) {
    if (cell) {
      var existingBlock = cell.blockAtThisLocation();
      if (existingBlock && isPortBlock(existingBlock)) {
          removeBlock(globalStates.currentLogic, existingBlock);
      }
    }
  });
}

function replacePortBlocksIfNecessary(cells) {
  cells.forEach( function(cell) {
    if (cell && !cell.blockAtThisLocation()) {
      if (cell.location.row === 0 || cell.location.row === globalStates.currentLogic.grid.size-1) {
        var blockJSON = toBlockJSON("edge", 1);
        var blockPos = convertGridPosToBlockPos(cell.location.col, cell.location.row);
        var globalId = "edgeBlock" + uuidTime();
        var block = addBlock(blockPos.x, blockPos.y, blockJSON, globalId);
        block.isPortBlock = true;
      }
    }
  });
}


                // // add invisible blocks to top and bottom edges
                // if (rowNum === 0 || rowNum === logic.grid.size-1) {
                //     var blockJSON = toBlockJSON("edge", 1);
                //     var blockPos = convertGridPosToBlockPos(colNum, rowNum);
                //     var globalId = "edgeBlock" + uuidTime();
                //     var block = addBlock(blockPos.x, blockPos.y, blockJSON, globalId);
                //     block.isPortBlock = true;
                //     // block.isInput = (rowNum === 0);
                //     // block.isOutput = (rowNum === logic.grid.size-1);
                // }

function updateTempLinkOutlinesForBlock(contents) {
  for (var linkKey in globalStates.currentLogic.links) {
    var link = globalStates.currentLogic.links[linkKey];
    if (link.blockB === contents.block) {
      globalStates.currentLogic.tempIncomingLinks.push({
          blockA: link.blockA,
          itemA: link.itemA,
          itemB: link.itemB
      });
    
    } else if (link.blockA === contents.block) {
      globalStates.currentLogic.tempOutgoingLinks.push({
          itemA: link.itemA,
          blockB: link.blockB,
          itemB: link.itemB
      });
    }
  }

  removeLinksForBlock(globalStates.currentLogic, contents.block);
}

function convertTempLinkOutlinesToLinks(contents) {
  globalStates.currentLogic.tempIncomingLinks.forEach( function(linkData) {
    if (blocksExist(linkData.blockA, contents.block)) {
      addBlockLink(linkData.blockA, contents.block, linkData.itemA, linkData.itemB, true);      
    }
  });

  globalStates.currentLogic.tempOutgoingLinks.forEach( function(linkData) {
    if (blocksExist(linkData.blockB, contents.block)) {
      addBlockLink(contents.block, linkData.blockB, linkData.itemA, linkData.itemB, true);
    }
  });

  resetTempLinkOutlines();
}

function blocksExist(block1, block2) {
  var blocks = globalStates.currentLogic.blocks;
  return !!(blocks[block1.globalId]) && !!(blocks[block2.globalId]);
  // return !!globalStates.currentLogic.blocks[blockA.globalId] && !!globalStates.currentLogic.blocks[blockB.globalId]
}

function resetTempLinkOutlines() {
  globalStates.currentLogic.tempIncomingLinks = [];
  globalStates.currentLogic.tempOutgoingLinks = [];
}

function removeTappedContents(contents) {
  var grid = globalStates.currentLogic.grid;
  resetTempLinkOutlines();
  removeBlock(globalStates.currentLogic, contents.block);

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
  newTempLink = addBlockLink(contents1.block, contents2.block, contents1.item, contents2.item, false);
  setTempLink(newTempLink);
  updateGrid(globalStates.currentLogic.grid);
}

function resetTempLink() {
  setTempLink(null);
  updateGrid(globalStates.currentLogic.grid);
}

function drawLinkLine(contents, endX, endY) {
  var grid = globalStates.currentLogic.grid;
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
  tempLine.start = null;
  tempLine.end = null;
  tempLine.color = null;
}

function drawCutLine(start, end) {
  // actual drawing happens in index.js loop, we just need to set endpoint here
  cutLine.start = start;
  cutLine.end = end;
}

function resetCutLine() {
  cutLine.start = null;
  cutLine.end = null;
}

function createLink(contents1, contents2, tempLink) {
  var addedLink = addBlockLink(contents1.block, contents2.block, contents1.item, contents2.item, true);
  if (addedLink && tempLink) {
      addedLink.route = tempLink.route; // copy over the route rather than recalculating everything
      addedLink.ballAnimationCount = tempLink.ballAnimationCount;
  }
}

function cutIntersectingLinks() {
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
  return blockDomElements[block.globalId];
}

function generateBlockGlobalId() {
  return "block" + uuidTime();
}

// new functions

function openBlockSettings(block) {
  console.log(block);
  var craftingBoard = document.getElementById('craftingBoard');
  var blockSettingsContainer = document.createElement('iframe');
  blockSettingsContainer.setAttribute('id', 'blockSettingsContainer');
  blockSettingsContainer.src = 'blocks/'+block.name+'/settings.html';
  craftingBoard.appendChild(blockSettingsContainer);

}

function hideBlockSettings() {
  var container = document.getElementById('blockSettingsContainer');
  if (container) {
    container.parentNode.removeChild(container);
  }
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
