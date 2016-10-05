var grid = globalState.currentLogic.grid;

// done
function getCellOverPointer(pointerX, pointerY) {
  // returns cell if position is within grid bounds, null otherwise
  return grid.getCellFromPointerPosition(pointerX, pointerY);
}

// done
function getCellContents(cell) {
  // use grid methods to get block/item overlapping this cell
  var block = cell.blockAtThisLocation();
  var item = cell.itemAtThisLocation();
  return {
    block: block,
    item: item,
    cell: cell,
    isMoving: false
  };
}

function areCellsEqual(cell1, cell2) {
  return (cell1.location.col === cell2.location.col)
      && (cell1.location.row === cell2.location.row);
}

function areBlocksEqual(block1, block2) {
  return (block1.globalId === block2.globalId);
}

function convertToMoveBlock(contents) {
  contents.isMoving = true;
}

function moveBlockToPosition(contents, pointerX, pointerY) {
  var domElement = contents.block.getDomElement();
  setDomCenter(domElement, pointerX, pointerY);
}

function setDomCenter(domElement, centerX, centerY) {
  var bounds = domElement.getBoundingClientRect();
  domElement.style.left = centerX - bounds.width/2;
  domElement.style.top = centerY - bounds.height/2;
}

function canConnectBlocks(contents1, contents2) {
  return !areBlocksEqual(contents1.block, contents2.block);
}

function canPlaceBlockInCell(tappedContents, cell) {
  if (!cell || !tappedContents) return false;
  var cellsOver = grid.getCellsOver(cell, tappedContents.block.blockSize, tappedContents.item);
  var canPlaceBlock = true;
  cellsOver.forEach( function(cell) {
    if (!cell.canHaveBlock() || cell.blockAtThisLocation()) {
      canPlaceBlock = false;
    }
  });
  return canPlaceBlock;
}

function styleBlockForPlacement(contents, shouldHighlight) {

}


function createTempLink(contents1, contents2) {
  newTempLink = addBlockLink(contents1.block, contents2.block, contents1.item, contents2.item, false);
  setTempLink(newTempLink);
}

function resetTempLink() {
  setTempLink(null);
}

function drawLinkLine(contents, endX, endY) {
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

function createLink(contents1, contents2) {

}

function placeBlockInCell(contents, cell) {

}

function removeTappedContents(contents) {

}
