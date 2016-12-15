var TS_NONE = "NONE";
var TS_TAP_BLOCK = "TAP_BLOCK";
var TS_HOLD = "HOLD_BLOCK";
var TS_MOVE = "MOVE_BLOCK";
var TS_CONNECT = "CONNECT_BLOCK";
var TS_CUT = "CUT";

var touchState = TS_NONE;

// var tappedContents = null;
var cutLineStart = null;

var startTapTime;

var HOLD_TIME_THRESHOLD = 300;

var activeHoldTimer = null;

// var tempIncomingLinks = [];
// var tempOutgoingLinks = [];

function pointerDown(e) {
    
    // we can assume we are in TS_NONE

    var cell = getCellOverPointer(e.pageX, e.pageY);
    if (!cell) return; // tapped on menu
    var contents = getCellContents(cell);
    
    if (contents && !isOutputBlock(contents.block)) {
        touchState = TS_TAP_BLOCK;
        // var block = contents.block;
        // var item = contents.item;
        globalStates.currentLogic.guiState.tappedContents = contents;

        // TODO: holding changes to TS_HOLD
            // one way of doing this is to record the tap down time
            // and compare it when you leave the cell
            // but that won't update visual state of cell?
            // ... could use a timed css animation to create same effect

        startTapTime = Date.now();

        var thisTappedContents = contents;
        activeHoldTimer = setTimeout( function() {
            //if (globalStates.currentLogic.guiState.tappedContents === thisTappedContents &&
            //    touchState === TS_TAP_BLOCK) {
                styleBlockForHolding(thisTappedContents, true);
            //}
        }, HOLD_TIME_THRESHOLD);

        //styleBlockForHolding(globalStates.currentLogic.guiState.tappedContents, true);

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
    var tappedContents = globalStates.currentLogic.guiState.tappedContents;

    if (touchState === TS_TAP_BLOCK) {

        // if you moved to a different cell, go to TS_CONNECT
        if (!areCellsEqual(cell, tappedContents.cell)) {
            styleBlockForHolding(tappedContents, false);
            if (canDrawLineFrom(tappedContents)) {
                touchState = TS_CONNECT;
                clearTimeout(activeHoldTimer);
            } else {
                touchState = TS_NONE;
                clearTimeout(activeHoldTimer);
            }
        
        // otherwise if enough time has passed, change to TS_HOLD
        } else if (!isPortBlock(contents.block)) {

            if (Date.now() - startTapTime > HOLD_TIME_THRESHOLD) {
                console.log("enough time has passed -> HOLD (" + (Date.now() - startTapTime) + ")");
                touchState = TS_HOLD;
                clearTimeout(activeHoldTimer);
                styleBlockForHolding(globalStates.currentLogic.guiState.tappedContents, true);
            }
        }

    } else if (touchState === TS_HOLD) {

        // if you moved to a different cell, go to TS_MOVE
        // remove the block and create a temp block

        //if (!areCellsEqual(cell, tappedContents.cell)) {
            touchState = TS_MOVE;
            convertToTempBlock(tappedContents);
            moveBlockDomToPosition(tappedContents, e.pageX, e.pageY);
        //}

    } else if (touchState === TS_CONNECT) {

        // if you are over an elligible block, create a temp link and re-route grid
        if (contents && canConnectBlocks(tappedContents, contents)){ //&& !areBlocksTempConnected(tappedContents, contents)) { //TODO: don't keep doing this if we already have a temp link line between the two
            resetLinkLine();
            if (!areBlocksTempConnected(tappedContents, contents)) {
                createTempLink(tappedContents, contents);
            }

        // if you aren't over an elligible block, draw a line to current position        
        } else {
            drawLinkLine(tappedContents, e.pageX, e.pageY);
        }

    } else if (touchState === TS_MOVE) {
        // snap if to grid position if necessary, otherwise just move block to pointer position
        var didSnap = snapBlockToCellIfPossible(tappedContents, cell, e.pageX, e.pageY); //TODO: move to inside the canPlaceBlockInCell block to avoid redundant checks
        if (!didSnap) {
            moveBlockDomToPosition(tappedContents, e.pageX, e.pageY);
        }

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
    var tappedContents = globalStates.currentLogic.guiState.tappedContents;

    if (touchState === TS_TAP_BLOCK) {
        // for now -> do nothing
        // but in the future -> this will open the block settings screen
        styleBlockForHolding(tappedContents, false);
        clearTimeout(activeHoldTimer);

        if (!isPortBlock(contents.block)) {
            if (Date.now() - startTapTime < (HOLD_TIME_THRESHOLD/2)) {
                openBlockSettings(tappedContents.block);
            }
        }

    } else if (touchState === TS_HOLD) {
        // holding (not moving) a block means haven't left the cell
        // so do nothing (just put it down)
        styleBlockForHolding(tappedContents, false);

    } else if (touchState === TS_CONNECT) {

        // if you are over an elligible block, remove temp link and add real link
        if (contents && canConnectBlocks(tappedContents, contents)) {
            createLink(tappedContents, contents, globalStates.currentLogic.guiState.tempLink);
            resetTempLink();        
        } else {
            resetLinkLine();
            resetTempLink(); // TODO: decide whether it's better to resetTempLink, or create a permanent link here with the last updated templink
        }

    } else if (touchState === TS_MOVE) {

        // remove entirely if dragged to menu
        if (didPointerLeave) {
            removeTappedContents(tappedContents);
        } else {
            if (canPlaceBlockInCell(tappedContents, cell)) {
                placeBlockInCell(tappedContents, cell); // move the block to the cell you're over
            } else {
                placeBlockInCell(tappedContents, tappedContents.cell); // return the block to its original cell
            }
        }

    } else if (touchState === TS_CUT) {
        cutIntersectingLinks();
        resetCutLine();
    }

    globalStates.currentLogic.guiState.tappedContents = null;
    cutLineStart = null;
    touchState = TS_NONE;

    console.log("pointerUp ->" + touchState + "(" + didPointerLeave + ")");//, e.target, e.currentTarget);
}
