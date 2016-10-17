var TS_NONE = "NONE";
var TS_TAP_BLOCK = "TAP_BLOCK";
var TS_HOLD = "HOLD_BLOCK";
var TS_MOVE = "MOVE_BLOCK";
var TS_CONNECT = "CONNECT_BLOCK";
var TS_CUT = "CUT";

var touchState = TS_NONE;

var tappedContents = null;
var cutLineStart = null;

var startTapTime;

function pointerDown(e) {
    
    // we can assume we are in TS_NONE

    var cell = getCellOverPointer(e.pageX, e.pageY);
    if (!cell) return; // tapped on menu
    var contents = getCellContents(cell);
    
    if (contents) {
        touchState = TS_TAP_BLOCK;
        // var block = contents.block;
        // var item = contents.item;
        tappedContents = contents;

        // TODO: holding changes to TS_HOLD
            // one way of doing this is to record the tap down time
            // and compare it when you leave the cell
            // but that won't update visual state of cell?
            // ... could use a timed css animation to create same effect

        startTapTime = Date.now();

        // blockDomElements[tappedContents.block.globalId].setAttribute('class','blockTitleHighlighted');

    } else {
        touchState = TS_CUT;
        cutLineStart = {
            x: e.pageX,
            y: e.pageY
        };
    }

    console.log("pointerDown ->" + touchState);//, e.target, e.currentTarget);
}

function pointerMove(e) {

    var cell = getCellOverPointer(e.pageX, e.pageY);
    if (!cell) { // moved to menu
        return pointerUp(e, true);
    }
    var contents = getCellContents(cell);

    if (touchState === TS_TAP_BLOCK) {

        // if you moved to a different cell, go to TS_CONNECT
        if (!areCellsEqual(cell, tappedContents.cell)) {
            touchState = TS_CONNECT;
        
        // otherwise if enough time has passed, change to TS_HOLD
        } else {
            if (Date.now() - startTapTime > 500) {
                console.log("enough time has passed -> HOLD");
                touchState = TS_HOLD;
            }
        }

    } else if (touchState === TS_HOLD) {

        // if you moved to a different cell, go to TS_MOVE
        // remove the block and create a temp block

        if (!areCellsEqual(cell, tappedContents.cell)) {
            touchState = TS_MOVE;
            convertToTempBlock(tappedContents);
            moveBlockToPosition(tappedContents, e.pageX, e.pageY);
        }

    } else if (touchState === TS_CONNECT) {

        // if you are over an elligible block, create a temp link and re-route grid
        if (contents && canConnectBlocks(tappedContents, contents)) {
            resetLinkLine();
            createTempLink(tappedContents, contents);

        // if you aren't over an elligible block, draw a line to current position        
        } else {
            drawLinkLine(tappedContents, e.pageX, e.pageY);
        }

    } else if (touchState === TS_MOVE) {

        // move the temp block
        moveBlockToPosition(tappedContents, e.pageX, e.pageY);

        // if you are over an elligible cell, style temp block to highlighted
        var cell = getCellOverPointer(e.pageX, e.pageY);
        if (canPlaceBlockInCell(tappedContents, cell)) {
            styleBlockForPlacement(tappedContents, true);

        // if you aren't over an elligible cell, style temp block to faded
        } else {
            styleBlockForPlacement(tappedContents, false);
        }

    } else if (touchState === TS_CUT) {

        // draw the cut line from cutLineStart to current position

        var cutLineEnd = {
            x: e.pageX,
            y: e.pageY
        };

        drawCutLine(cutLineStart, cutLineEnd);

    }

    console.log("pointerMove ->" + touchState);//, e.target, e.currentTarget);
}

function pointerUp(e, didPointerLeave) {
    if (e.target !== e.currentTarget) return; // prevents event bubbling

    var cell = getCellOverPointer(e.pageX, e.pageY);
    var contents = getCellContents(cell);

    if (touchState === TS_TAP_BLOCK) {
        // for now -> do nothing
        // but in the future -> this will open the block settings screen
        openBlockSettings(tappedContents.block);

    } else if (touchState === TS_HOLD) {
        // holding (not moving) a block means haven't left the cell
        // so do nothing (just put it down)

    } else if (touchState === TS_CONNECT) {

        // if you are over an elligible block, remove temp link and add real link
        if (contents && canConnectBlocks(tappedContents, contents)) {
            createLink(tappedContents, contents, globalStates.currentLogic.tempLink);
            resetTempLink();        
        } else {
            resetLinkLine();
        }

    } else if (touchState === TS_MOVE) {

        // remove entirely if dragged to menu
        if (didPointerLeave) {
            removeTappedContents(tappedContents);
        } else {
            if (canPlaceBlockInCell(tappedContents, cell)) {
                placeBlockInCell(tappedContents, cell);
            } else {
                placeBlockInCell(tappedContents, tappedContents.cell);
            }
        }

        /*
        // if you are over an elligible cell, add block to that cell        
        if (canPlaceBlockInCell(tappedContents, cell)) {

            placeBlockInCell(tappedContents, cell);

        } else {
            
            // return block to start position if tap up,
            // but delete it entirely if dragged to menu
            
            if (!didPointerLeave) {
                placeBlockInCell(tappedContents, tappedContents.cell);
            } else {
                removeTappedContents(tappedContents);
            }

        }
        */

    } else if (touchState === TS_CUT) {
        cutIntersectingLinks();
        resetCutLine();
    }

    tappedContents = null;
    cutLineStart = null;
    touchState = TS_NONE;

    console.log("pointerUp ->" + touchState + "(" + didPointerLeave + ")");//, e.target, e.currentTarget);
}

// function pointerLeave(e) {
//     if (e.target !== e.currentTarget) return;

// }

// function pointerLeave(e) {
//     if (e.target !== e.currentTarget) return; // prevents event bubbling

//     var bounds = e.currentTarget.getBoundingClientRect();
//     if (e.pageX > bounds.width) {
//         console.log("pointer leave");
//         pointerUp(e, true);
//     } else {
//         console.log("pointer up");
//         pointerUp(e, false);
//     }

//     // console.log("pointerLeave ->" + touchState);//, e.target, e.currentTarget);
// }

function addBlockFromMenu(blockJSON, pointerX, pointerY) {
    // var name = blockJSON.name;
    // var width = blockJSON.width;
    var globalId = generateBlockGlobalId();
    var addedBlock = addBlock(-1, -1, blockJSON, globalId);
    addDomElementForBlock(addedBlock, globalStates.currentLogic.grid, true);

    tappedContents = {
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
