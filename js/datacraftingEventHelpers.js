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
    cell: cell
  };
}

function areCellsEqual(cell1, cell2) {
  return (cell1.location.col === cell2.location.col)
      && (cell1.location.row === cell2.location.row);
}

function convertToMoveBlock(contents) {

}

function moveBlockToPosition(contents, pointerX, pointerY) {

}

function canConnectBlocks(contents1, contents2) {

}

function createTempLink(contents1, contents2) {

}

function drawLinkLine(contents, endX, endY) {

}

function canPlaceBlockInCell(tappedContents, cell) {

}

function styleBlockForPlacement(contents, shouldHighlight) {

}

function drawCutLine(start, end) {

}

function resetTempLink() {

}

function createLink(contents1, contents2) {

}

function placeBlockInCell(contents, cell) {

}

function removeTappedContents(contents) {

}

function removeCutLine() {

}