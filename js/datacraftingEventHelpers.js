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

function convertToMoveBlock(contents) {
  // contents.isMoving = true;
  // setTempBlock(contents);
}

function moveBlockToPosition(contents, pointerX, pointerY) {
  var grid = globalStates.currentLogic.grid;

  var domElement = getDomElementForBlock(contents.block); // contents.block.domElement; // getDomElement();
  domElement.style.left = pointerX - offsetForItem(contents.item);
  domElement.style.top = pointerY - grid.blockRowHeight/2;
}

function offsetForItem(item) {
  var grid = globalStates.currentLogic.grid;

  return grid.blockColWidth/2 + item * (grid.blockColWidth + grid.marginColWidth);
}

// function moveBlockToPosition(contents, pointerX, pointerY) {
//   var domElement = getDomElementForBlock(contents.block); // contents.block.domElement; // getDomElement();
//   setDomCenter(domElement, pointerX + offsetForItem(contents.item), pointerY);
//   // TODO: handle grid-snap logic here or in parent function?
// }

// function offsetForItem(item) {
//   var grid = globalStates.currentLogic.grid;
//   return item * (grid.blockColWidth + grid.marginColWidth);
// }

// function setDomCenter(domElement, centerX, centerY) {
//   var bounds = domElement.getBoundingClientRect();
//   domElement.style.left = centerX - bounds.width/2;
//   domElement.style.top = centerY - bounds.height/2;
// }

function canConnectBlocks(contents1, contents2) {
  return !areBlocksEqual(contents1.block, contents2.block);
}

function canPlaceBlockInCell(tappedContents, cell) {
  var grid = globalStates.currentLogic.grid;
  if (!cell || !tappedContents) return false;
  var cellsOver = grid.getCellsOver(cell, tappedContents.block.blockSize, tappedContents.item);
  var canPlaceBlock = true;
  cellsOver.forEach( function(cell) {
    if (!cell || !cell.canHaveBlock() || cell.blockAtThisLocation()) {
      canPlaceBlock = false;
    }
  });
  return canPlaceBlock;
}

function styleBlockForPlacement(contents, shouldHighlight) {
  var domElement = getDomElementForBlock(contents.block); // contents.block.domElement; // getDomElement();
  if (shouldHighlight) {
    domElement.style.opacity = 1.00;
  } else {
    domElement.style.opacity = 0.50;
  }
}

function placeBlockInCell(contents, cell) {
  if (cell) {
    contents.block.x = (cell.location.col / 2) - contents.item;
    contents.block.y = (cell.location.row / 2);
    contents = null;
  } else {
    removeTappedContents(contents);
  }
  updateGrid(globalStates.currentLogic.grid);
}

function removeTappedContents(contents) {
  removeBlock(globalStates.currentLogic, contents.block);
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
  tempLine.start = {
    x: startX,
    y: startY
  };
  tempLine.end = {
    x: endX,
    y: endY
  };
}

function resetLinkLine() {
  tempLine.start = null;
  tempLine.end = null;
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
  return blockDomElements[block.globalId];
}
