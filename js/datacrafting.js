/**
 * Created by Benjamin Reynolds on 9/02/16.
 *
 * Copyright (c) 2016 Benjamin Reynolds
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/*
 * This file contains the backend for the grid-based routing system used in the
 * datacrafting environment.
 * 
 * To use, instantiate a new Grid object with a given
 * size (only size = 7 has been tested), and pixel dimensions for rows and
 * columns. Blocks and Links can be added to the Grid.
 * 
 * Calling recalculateAllRoutes computes routes for each link. Then calling 
 * getPointsForLink for each link returns x,y coordinates for drawing.
 */

/*
 * TODO: expose only the public methods using a module exports, and keep internal utilities private
 */

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   Data Structures - Definitions
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// the grid is the overall data structure for managing block locations and calculating routes between them
function Grid(size, blockColWidth, blockRowHeight, marginColWidth, marginRowHeight) {
    this.size = size; // number of rows and columns
    this.blockColWidth = blockColWidth; // width of cells in columns with blocks
    this.blockRowHeight = blockRowHeight; // height of cells in columns with blocks
    this.marginColWidth = marginColWidth; // width of cells in columns without blocks (the margins)
    this.marginRowHeight = marginRowHeight; // height of cells in rows without blocks (the margins)

    this.cells = []; // array of [Cell] objects
    this.links = []; // array of [Link] objects
    this.tempLink = null; // Link object - null when not drawing a new link

    // initialize list of cells using the size of the grid
    for (var row = 0; row < this.size; row++) {
        for (var col = 0; col < this.size; col++) {
            var cellLocation = new CellLocation(col, row);
            var cell = new Cell(cellLocation);
            this.cells.push(cell);
        }
    }
}

// the cell has a location in the grid, possibly an associated Block object
//  and DOM element, and a list of which routes pass through the cell
function Cell(location) {
    this.location = location; // CellLocation
    this.routeTrackers = []; // [RouteTracker]
    this.block = null;
    this.domElement = null; // <IMG> element
}

function Block(cell) {
    this.cell = cell; // Cell
    this.domElement = null;
}

// represents the row/column location of a cell, and optionally an x/y offset from the center of that cell
function CellLocation(col,row) {
    this.col = col;
    this.row = row;
    this.offsetX = 0;
    this.offsetY = 0;
}

// the link contains the start and end blocks that it connects, the route between them,
// and some additional data for rendering it
function Link(startBlock, endBlock) {
    this.startBlock = startBlock; // Block object
    this.endBlock = endBlock; // Block object
    this.route = null; // Route object
    this.pointData = null; // list of [{screenX, screenY}]
    this.ballAnimationCount = 0;
}

// the route contains the corner points and the list of all cells it passes through
function Route(initialCellLocations) {
    this.cellLocations = []; // [CellLocation]
    this.allCells = []; // [Cell]

    if (initialCellLocations !== undefined) {
        var that = this;
        initialCellLocations.forEach( function(location) {
            that.addLocation(location.col,location.row);
        });
    }
}

// contains useful data for keeping track of how a route passes through a cell
function RouteTracker(route, params) {
    this.route = route;
    this.containsVertical = params["vertical"]; // todo: convert all dictionaries to {vertical: vertical} instead of {"vertical":vertical} syntax
    this.containsHorizontal = params["horizontal"];
    // todo: add this.isStart and this.isEnd
    this.isStart = false;
    this.isEnd = false;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   Data Structures - Methods
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////
//  CELL LOCATION METHODS  //
/////////////////////////////

// gets the center x coordinate of this cell row/column location
// varies depending on whether this is in a block row or margin row
CellLocation.prototype.getCenterX = function(blockColWidth, marginColWidth) {
    var leftEdgeX = 0;
    if (this.col % 2 === 0) { // this is a block cell
        leftEdgeX = (this.col / 2) * (blockColWidth + marginColWidth);
        return leftEdgeX + blockColWidth/2;

    } else { // this is a margin cell
        leftEdgeX = Math.ceil(this.col / 2) * blockColWidth + Math.floor(this.col / 2) * marginColWidth;
        return leftEdgeX + marginColWidth/2;
    }
};

// gets the center y coordinate of this cell row/column location
// varies depending on whether this is in a block row or margin row
CellLocation.prototype.getCenterY = function(blockRowHeight, marginRowHeight) {
    var topEdgeY = 0;
    if (this.row % 2 === 0) { // this is a block cell
        topEdgeY = (this.row / 2) * (blockRowHeight + marginRowHeight);
        return topEdgeY + blockRowHeight/2;

    } else { // this is a margin cell
        topEdgeY = Math.ceil(this.row / 2) * blockRowHeight + Math.floor(this.row / 2) * marginRowHeight;
        return topEdgeY + marginRowHeight/2;
    }
};

////////////////////
//  CELL METHODS  //
////////////////////

Cell.prototype.canHaveBlock = function() {
    return (this.location.col % 2 == 0) && (this.location.row % 2 == 0);
}

// utility - counts the number of horizontal routes in a cell
Cell.prototype.countHorizontalRoutes = function() {
    return this.routeTrackers.filter(function(value) { return value.containsHorizontal; }).length;
};

// utility - counts the number of vertical routes in a cell
// optionally excludes start or endpoints so that routes starting in a
// block cell don't count as overlapping routes ending in a block cell
Cell.prototype.countVerticalRoutes = function(excludeStartPoints, excludeEndPoints) {
    return this.routeTrackers.filter(function(value) {
        return value.containsVertical && !((value.isStart && excludeStartPoints) || (value.isEnd && excludeEndPoints));
    }).length;
};

// utility - checks whether the cell has a vertical route tracker for the given route
Cell.prototype.containsVerticalSegmentOfRoute = function(route) {
    var containsVerticalSegment = false;
    this.routeTrackers.forEach( function(routeTracker) {
        if (routeTracker.route === route && routeTracker.containsVertical) {
            containsVerticalSegment = true;
        }
    });
    return containsVerticalSegment;
};

// utility - checks whether the cell has a horizontal route tracker for the given route
Cell.prototype.containsHorizontalSegmentOfRoute = function(route) {
    var containsHorizontalSegment = false;
    this.routeTrackers.forEach( function(routeTracker) {
        if (routeTracker.route === route && routeTracker.containsHorizontal) {
            containsHorizontalSegment = true;
        }
    });
    return containsHorizontalSegment;
};

// utility - gets the hue for cells in a given column
Cell.prototype.getColorHSL = function() {
    var blockColumn = Math.floor(this.location.col / 2);
    var colorMap = { blue: {h: 180}, green: {h: 122}, yellow: {h: 59}, red: {h:333} };
    var colorName = ['blue','green','yellow','red'][blockColumn];
    return colorMap[colorName];
};

/////////////////////
//  ROUTE METHODS  //
/////////////////////

// adds a new corner location to a route
Route.prototype.addLocation = function(col, row) {
    var skip = false;
    this.cellLocations.forEach(function(cellLocation) {
        if (cellLocation.col === col && cellLocation.row === row) { // implicitly prevent duplicate points from being added
            skip = true;
        }
    });
    if (!skip) {
        this.cellLocations.push(new CellLocation(col, row));
    }
};

// utility - outputs how far a route travels left/right and up/down, for
// use in choosing the order of routes so that they usually don't cross
Route.prototype.getOrderPreferences = function() {
    var lastCell = this.cellLocations[this.cellLocations.length-1];
    var firstCell = this.cellLocations[0];
    return {
        horizontal: lastCell.col - firstCell.col,
        vertical: lastCell.row - firstCell.row
    };
};

////////////////////
//  LINK METHODS  //
////////////////////

// calculates useful pointData for drawing lines with varying color/weight/etc,
// by determining how far along the line each corner is located (as a percentage)
Link.prototype.preprocessPointsForDrawing = function(points) {
    var lengths = []; // size = lines.length-1
    for (var i = 1; i < points.length; i++) {
        var p1 = points[i-1];
        var p2 = points[i];

        var dx = p2.screenX - p1.screenX;
        var dy = p2.screenY - p1.screenY;

        var dist = Math.sqrt(dx * dx + dy * dy);
        lengths.push(dist);
    }

    var totalLength = lengths.reduce(function(a,b){return a + b;}, 0);

    var prevPercent = 0.0;
    var percentages = [prevPercent];
    percentages.push.apply(percentages, lengths.map(function(length){ prevPercent += length/totalLength; return prevPercent; }));

    this.pointData = {
        points: points,
        totalLength: totalLength,
        lengths: lengths,
        percentages: percentages
    };
};


Link.prototype.getXYPositionAtPercentage = function(percent) {
    var pointData = this.pointData;
    if (percent >= 0 && percent <= 1) {
        var indexBefore = 0;
        for (var i = 1; i < pointData.points.length; i++) {
            var nextPercent = pointData.percentages[i];
            if (nextPercent > percent) {
                indexBefore = i-1;
                break;
            }
        }

        var x1 = pointData.points[indexBefore].screenX;
        var y1 = pointData.points[indexBefore].screenY;
        var x2 = pointData.points[indexBefore+1].screenX;
        var y2 = pointData.points[indexBefore+1].screenY;

        var percentOver = percent - pointData.percentages[indexBefore];
        var alpha = percentOver / (pointData.percentages[indexBefore+1] - pointData.percentages[indexBefore]);
        var x = (1 - alpha) * x1 + alpha * x2;
        var y = (1 - alpha) * y1 + alpha * y2;

        return {
            screenX: x,
            screenY: y
        };

    } else {
        return null;
    }
}

////////////////////
//  GRID METHODS  //
////////////////////

// utility - returns the x,y coordinates of corners for a link so that they can be rendered
// (includes the offsets - these are the actual points to draw on the screen exactly as is)
Grid.prototype.getPointsForLink = function(link) {
    var points = [];
    if (link.route !== null) {
        var that = this;
        link.route.cellLocations.forEach( function(location) {
            var screenX = that.getColumnCenterX(location.col) + location.offsetX;
            var screenY = that.getRowCenterY(location.row) + location.offsetY;
            points.push({
                "screenX": screenX,
                "screenY": screenY
            });
        });

    }
    return points;
};

// creates a link from start to end locations if they contain blocks and don't already have a link
Grid.prototype.addLinkFromTo = function(col1, row1, col2, row2) {
    var startBlock = this.getCell(col1,row1).block;
    var endBlock = this.getCell(col2,row2).block;
    if (startBlock !== null && endBlock !== null) {
        var link = new Link(startBlock, endBlock);
        if (!this.doesLinkAlreadyExist(link)) {
            this.links.push(link);
            return link;
        }
    }
    return null;
};

// removes a given link
Grid.prototype.removeLink = function(link) {
    var index = this.links.indexOf(link);
    if (index > -1) {
        this.links.splice(index, 1);
    }
};

// removes all links
Grid.prototype.clearLinks = function() {
    this.links = [];
    this.tempLink = null;
};

// utility - looks at all permanent links to see whether new link is a duplicate
Grid.prototype.doesLinkAlreadyExist = function(newLink) {
    var alreadyExists = false;
    this.links.forEach( function(link) { // note: intentionally used grid.links.forEach rather than grid.forEachLink because we don't want to compare this with tempLink or we'll always get false positives
        if (newLink.startBlock.cell.location === link.startBlock.cell.location && newLink.endBlock.cell.location === link.endBlock.cell.location) {
            alreadyExists = true;
        }
    });
    return alreadyExists;
};

// sets the tempLink if it isn't a duplicate
Grid.prototype.setTempLink = function(newTempLink) {
    if (!this.doesLinkAlreadyExist(newTempLink)) {
        this.tempLink = newTempLink;
    }
};

// utility - calculates the total width and height of the grid using the sizes of the cells
Grid.prototype.getPixelDimensions = function() {
    var width = Math.ceil(this.size/2) * this.blockColWidth +  Math.floor(this.size/2) * this.marginColWidth;
    var height = Math.ceil(this.size/2) * this.blockRowHeight +  Math.floor(this.size/2) * this.marginRowHeight;
    return {
        "width": width,
        "height": height
    };
}

// utility - gets a cell at a given grid location
Grid.prototype.getCell = function(col, row) {
    if (row >= 0 && row < this.size && col >= 0 && col < this.size) {
        return this.cells[row * this.size + col];
    }
};

// utility - gets width of cell, which differs for cols with blocks vs margins
Grid.prototype.getCellWidth = function(col) {
    return (col % 2 === 0) ? this.blockColWidth : this.marginColWidth;
};

// utility - gets height of cell, which differs for rows with blocks vs margins
Grid.prototype.getCellHeight = function(row) {
    return (row % 2 === 0) ? this.blockRowHeight : this.marginRowHeight;
};

// utility - gets x position of cell
Grid.prototype.getCellCenterX = function(cell) {
    return cell.location.getCenterX(this.blockColWidth, this.marginColWidth);
};

// utility - gets y position of cell
Grid.prototype.getCellCenterY = function(cell) {
    return cell.location.getCenterY(this.blockRowHeight, this.marginRowHeight);
};

// utility - gets x position for a column 
Grid.prototype.getColumnCenterX = function(col) {
    return this.getCellCenterX(this.getCell(col,0));
};

// utility - gets y position for a row
Grid.prototype.getRowCenterY = function(row) {
    return this.getCellCenterY(this.getCell(0,row));
};

// performs actions on all links (including tempLink if it exists)
Grid.prototype.forEachLink = function(action) {
    this.links.forEach(action);
    if (this.tempLink !== null) {
        action(this.tempLink);
    }
};

// returns a list containing grid.links and also grid.tempLink if it exists
Grid.prototype.allLinks = function() {
    var allLinks = [];
    allLinks.push.apply(allLinks, this.links);
    if (this.tempLink !== null) {
        allLinks.push(this.tempLink);
    }
    return allLinks;
};

// performs action on all cells that can have a block (not the empty margins)
Grid.prototype.forEachPossibleBlockCell = function(action) {
    this.cells.filter( function(cell) {
        return cell.canHaveBlock();
    }).forEach( function(cell) {
        action(cell);
    });
};

// utility - true iff a cell between the start and end actually contains a block
Grid.prototype.areBlocksBetween = function(startCell, endCell) {
    var blocksBetween = this.getCellsBetween(startCell, endCell).filter( function(cell) {
        return cell.block !== null;
    });
    return blocksBetween.length > 0;
};

// utility - looks vertically below a location until it finds a block, or null if none in that column
Grid.prototype.getFirstBlockBelow = function(col, row) {
    for (var r = row+1; r < this.size; r++) {
        var cell = this.getCell(col,r);
        if (cell.block !== null) {
            return cell.block;
        }
    }
    return null;
};

// *** main method for routing ***
// first, calculates the routes (which cells they go thru)
// next, offsets each so that they don't visually overlap
// lastly, prepares points so that they can be easily rendered
Grid.prototype.recalculateAllRoutes = function() {
    var that = this;

    that.resetCellRouteCounts(); // step 1 works

    that.forEachLink( function(link) {
        that.calculateLinkRoute(link);  // step 2 works
    });

    var overlaps = that.determineMaxOverlaps();
    that.calculateOffsets(overlaps);

    that.forEachLink( function(link) {
        var points = that.getPointsForLink(link);
        link.preprocessPointsForDrawing(points);
    });
};

// resets the number of "horizontal" or "vertical" segments contained to 0 for all cells
Grid.prototype.resetCellRouteCounts = function() {
    this.cells.forEach(function(cell) {
        cell.routeTrackers = [];
    });
};

// given a link, calculates all the corner points between the start block and end block,
// and sets the route of the link to contain the corner points and all the cells between
Grid.prototype.calculateLinkRoute = function(link) {
    var startLocation = link.startBlock.cell.location;
    var endLocation = link.endBlock.cell.location;

    var route = new Route([startLocation]);

    // by default lines loop around the right of blocks, except for last column or if destination is to left of start
    var sideToApproachOn = 1; // to the right
    if (endLocation.col < startLocation.col || startLocation.col === 6) {
        sideToApproachOn = -1; // to the left
    }

    if (startLocation.row < endLocation.row) {
        // simplifies edge case when block is directly below by skipping rest of points
        var areBlocksBetweenInStartColumn = this.areBlocksBetween(this.getCell(startLocation.col, startLocation.row), this.getCell(startLocation.col, endLocation.row));// new CellLocation(startLocation.col, endLocation.row));

        if (startLocation.col !== endLocation.col || areBlocksBetweenInStartColumn) {

            // first point continues down vertically as far as it can go without hitting another block
            var firstBlockBelow = this.getFirstBlockBelow(startLocation.col, startLocation.row);
            var rowToDrawDownTo = endLocation.row-1;
            if (firstBlockBelow !== null) {
                rowToDrawDownTo = Math.min(firstBlockBelow.cell.location.row-1, rowToDrawDownTo);
            }
            route.addLocation(startLocation.col, rowToDrawDownTo);

            if (rowToDrawDownTo < endLocation.row-1) {
                // second point goes horizontally to the side of the start column
                route.addLocation(startLocation.col+sideToApproachOn, rowToDrawDownTo);
                // fourth point goes vertically to the side of the end column
                route.addLocation(startLocation.col+sideToApproachOn, endLocation.row-1);
            }

            // fifth point goes horizontally until it is directly above center of end block
            route.addLocation(endLocation.col, endLocation.row-1);
        }

    } else {

        if (startLocation.row < this.size-1) { // first point is vertically below the start, except for bottom row
            route.addLocation(startLocation.col, startLocation.row+1);
            route.addLocation(startLocation.col + sideToApproachOn, startLocation.row+1);
        } else { // start from side of bottom row
            route.addLocation(startLocation.col + sideToApproachOn, startLocation.row);
        }

        // different things happen if destination is top row or not...
        if (endLocation.row > 0) {
            // if not top row, next point is above and to the side of the destination
            route.addLocation(startLocation.col + sideToApproachOn, endLocation.row-1);
            // last point is directly vertically above the end block
            route.addLocation(endLocation.col, endLocation.row-1);

        } else { // if it's going to the top row, approach from the side rather than above it

            // if there's nothing blocking the line from getting to the side of the end block, last point goes there
            var cellsBetween = this.getCellsBetween(this.getCell(startLocation.col, 0), this.getCell(endLocation.col, endLocation.row)); //new CellLocation(startLocation.col,0), endLocation);
            var blocksBetween = cellsBetween.filter(function(cell){return cell.block !== null;});
            if (blocksBetween.length === 0) {
                route.addLocation(startLocation.col + sideToApproachOn, 0);

            } else { // final exception! if there are blocks horizontally between start and end in top row, go under and up
                // first extra point stops below top row in the column next to the start block, creating a vertical line
                route.addLocation(startLocation.col + sideToApproachOn, 1);
                // next extra point goes horizontally over to the column of the last block
                route.addLocation(endLocation.col - sideToApproachOn, 1);
                // final extra point goes vertically up to the direct side of the end block
                route.addLocation(endLocation.col - sideToApproachOn, 0);
            }
        }
    }

    route.addLocation(endLocation.col, endLocation.row);
    this.calculateAllCellsContainingRoute(route);
    link.route = route;
};

// utility - true iff cells are in same row
Grid.prototype.areCellsHorizontal = function(cell1, cell2) {
    if (cell1 === null || cell2 === null || cell1 === undefined || cell2 === undefined) { return false; }
    return cell1.location.row === cell2.location.row;
};

// utility - true iff cells are in same column
Grid.prototype.areCellsVertical = function(cell1, cell2) {
    if (cell1 === null || cell2 === null || cell1 === undefined || cell2 === undefined) { return false; }
    return cell1.location.col === cell2.location.col;
};

// utility - for a given cell in a route, looks at the previous and next cells in the route to
// figure out if the cell contains a vertical path, horizontal path, or both (it's a corner)
Grid.prototype.getLineSegmentDirections = function(prevCell,currentCell,nextCell) {
    var containsHorizontal = false;
    var containsVertical = false;
    if (this.areCellsHorizontal(currentCell, prevCell) ||
        this.areCellsHorizontal(currentCell, nextCell)) {
        containsHorizontal = true;
    }

    if (this.areCellsVertical(currentCell, prevCell) ||
        this.areCellsVertical(currentCell, nextCell)) {
        containsVertical = true;
    }
    return {
        "horizontal": containsHorizontal,
        "vertical": containsVertical
    };
};

// utility - if cells are in a line horizontally or vertically, returns all the cells in between them
Grid.prototype.getCellsBetween = function(cell1, cell2) {
    var cellsBetween = [];
    if (this.areCellsHorizontal(cell1, cell2)) {
        var minCol = Math.min(cell1.location.col, cell2.location.col);
        var maxCol = Math.max(cell1.location.col, cell2.location.col);
        cellsBetween.push.apply(cellsBetween, this.cells.filter( function(cell) {
            return cell.location.row === cell1.location.row && cell.location.col > minCol && cell.location.col < maxCol;
        }));

    } else if (this.areCellsVertical(cell1, cell2)) {
        var minRow = Math.min(cell1.location.row, cell2.location.row);
        var maxRow = Math.max(cell1.location.row, cell2.location.row);
        cellsBetween.push.apply(cellsBetween, this.cells.filter( function(cell) {
            return cell.location.col === cell1.location.col && cell.location.row > minRow && cell.location.row < maxRow;
        }));
    }
    return cellsBetween;
};

// Given the corner points for a route, finds all the cells in between, and labels each with
// "horizontal", "vertical", or both depending on which way the route goes thru that cell
Grid.prototype.calculateAllCellsContainingRoute = function(route) {
    var allCells = [];

    for (var i=0; i < route.cellLocations.length; i++) {

        var prevCell = null;
        var currentCell = null;
        var nextCell = null;

        currentCell = this.getCell(route.cellLocations[i].col, route.cellLocations[i].row);
        if (i > 0) {
            prevCell = this.getCell(route.cellLocations[i-1].col, route.cellLocations[i-1].row);
        }
        if (i < route.cellLocations.length-1) {
            nextCell = this.getCell(route.cellLocations[i+1].col, route.cellLocations[i+1].row);
        }
        var segmentDirections = this.getLineSegmentDirections(prevCell, currentCell, nextCell);

        var routeTracker = new RouteTracker(route, segmentDirections); // corners have both vertical and horizontal. end point has only vertical //todo: except for top/bottom row
        if (prevCell === null) {
            routeTracker.isStart = true;
        }
        if (nextCell === null) {
            routeTracker.isEnd = true;
        }
        currentCell.routeTrackers.push(routeTracker);
        allCells.push(currentCell); // add endpoint cell for each segment

        var cellsBetween = this.getCellsBetween(currentCell, nextCell);
        var areNextHorizontal = this.areCellsHorizontal(currentCell, nextCell);
        var areNextVertical = !areNextHorizontal; // mutually exclusive
        cellsBetween.forEach( function(cell) {
            var routeTracker = new RouteTracker(route, {"horizontal": areNextHorizontal, "vertical": areNextVertical});
            cell.routeTrackers.push(routeTracker);
        });
        allCells.push.apply(allCells, cellsBetween);
    }
    route.allCells = allCells;
};

// After routes have been calculated and overlaps have been counted, determines the x,y offset for
// each point so that routes don't overlap one another and are spaced evenly within the cells
Grid.prototype.calculateOffsets = function(overlaps) {
    var colRouteOverlaps = overlaps.colRouteOverlaps;
    var rowRouteOverlaps = overlaps.rowRouteOverlaps;

    var that = this;

    for (var c = 0; c < this.size; c++) {
        var maxOffset = 0.5 * this.getCellWidth(c);
        var minOffset = -1 * maxOffset;

        var routeOverlaps = colRouteOverlaps[c];

        var numRoutesProcessed = new Array(this.size).fill(0);
        var numRoutesProcessedExcludingStart = new Array(this.size).fill(0);
        var numRoutesProcessedExcludingEnd = new Array(this.size).fill(0);

        routeOverlaps.forEach( function(routeOverlap) {
            var route = routeOverlap.route;
            var maxOverlap = routeOverlap.maxOverlap;

            var firstCellInRoute = that.getCell(route.cellLocations[0].col, route.cellLocations[0].row);
            var lastCellInRoute = that.getCell(route.cellLocations[route.cellLocations.length-1].col, route.cellLocations[route.cellLocations.length-1].row);

            var lineNumber = 0;
            route.allCells.filter(function(cell){return cell.location.col === c;}).forEach( function(cell) {
                var numProcessed = 0;

                if (cell === firstCellInRoute) {
                    // exclude endpoints... use numRoutesProcessedExcludingEnd
                    numProcessed = numRoutesProcessedExcludingEnd[cell.location.row];
                } else if (cell === lastCellInRoute) {
                    // exclude startpoints... use numRoutesProcessedExcludingStart
                    numProcessed = numRoutesProcessedExcludingStart[cell.location.row];
                } else {
                    numProcessed = numRoutesProcessed[cell.location.row];
                }

                if (cell.containsVerticalSegmentOfRoute(route)) {
                    lineNumber = Math.max(lineNumber, numProcessed);
                }
            });
            lineNumber += 1;

            // todo: use maxOverlap of any route in this cell? or does maxOverlap already take care of that?
            var numPartitions = maxOverlap + 1;
            var width = maxOffset - minOffset;
            var spacing = width/(numPartitions);
            var offsetX = minOffset + lineNumber * spacing;
            if (maxOverlap === 0) offsetX = 0; // edge case - never adjust lines that don't overlap anything

            route.cellLocations.filter(function(location){return location.col === c;}).forEach( function(location) {
                location.offsetX = offsetX;
            });

            route.allCells.filter(function(cell){return cell.location.col === c}).forEach( function(cell) {
                if (cell !== firstCellInRoute) {
                    // exclude endpoints... use numRoutesProcessedExcludingEnd
                    numRoutesProcessedExcludingStart[cell.location.row] += 1;

                }
                if (cell !== lastCellInRoute) {
                    // exclude startpoints... use numRoutesProcessedExcludingStart
                    numRoutesProcessedExcludingEnd[cell.location.row] += 1;

                } //else {

                if (cell.containsVerticalSegmentOfRoute(route)) {
                    numRoutesProcessed[cell.location.row] += 1;
                }
            });
        });
        //console.log("col numRoutesProcessed", numRoutesProcessed);
    }

    for (var r = 0; r < this.size; r++) {
        var maxOffset = 0.5 * this.getCellHeight(r);
        var minOffset = -1 * maxOffset;
        var routeOverlaps = rowRouteOverlaps[r];
        var numRoutesProcessed = new Array(this.size).fill(0);

        routeOverlaps.forEach( function(routeOverlap) {
            var route = routeOverlap.route;
            var maxOverlap = routeOverlap.maxOverlap;

            var lineNumber = 0;
            route.allCells.filter(function(cell){return cell.location.row === r;}).forEach( function(cell) {
                if (cell.containsHorizontalSegmentOfRoute(route)) {
                    lineNumber = Math.max(lineNumber, numRoutesProcessed[cell.location.col]);
                }
            });
            lineNumber += 1; // actual number is one bigger than the number of routes processed
            // note: line number should never exceed maxOverlap... something went wrong if it did...

            // todo: use maxOverlap of any route in this cell? causes more things to shift but would make more correct
            var numPartitions = maxOverlap + 1;
            var width = maxOffset - minOffset;
            var spacing = width/(numPartitions);
            var offsetY = minOffset + lineNumber * spacing;
            if (maxOverlap === 0) offsetY = 0; // edge case - never adjust lines that don't overlap anything

            route.cellLocations.filter(function(location){return location.row === r;}).forEach( function(location) {
                location.offsetY = offsetY;
            });

            route.allCells.filter(function(cell){return cell.location.row === r}).forEach( function(cell) {
                if (cell.containsHorizontalSegmentOfRoute(route)) {
                    numRoutesProcessed[cell.location.col] += 1;
                }
            });
        });
        //console.log("row numRoutesProcessed", numRoutesProcessed);
    }
};

// counts how many routes overlap eachother in each row and column, and sorts them, so that
// they can be displaced around the center of the row/column and not overlap one another
Grid.prototype.determineMaxOverlaps = function() {
    var colRouteOverlaps = [];
    var horizontallySortedLinks;
    for (var c = 0; c < this.size; c++) {
        var thisColRouteOverlaps = [];
        // for each route in column
        var that = this;

        // decreases future overlaps of links in the grid by sorting them left/right
        // so that links going to the left don't need to cross over links going to the right
        horizontallySortedLinks = that.allLinks().sort(function(link1, link2){
            var p1 = link1.route.getOrderPreferences();
            var p2 = link2.route.getOrderPreferences();
            var horizontalOrder = p1.horizontal - p2.horizontal;
            var verticalOrder = p1.vertical - p2.vertical;
            // special case if link stays in same column as the start block
            var dCol1 = link1.endBlock.cell.location.col - link1.startBlock.cell.location.col;
            var dCol2 = link2.endBlock.cell.location.col - link2.startBlock.cell.location.col;

            if (p1.vertical >= 0 && p2.vertical >= 0) {
                if (dCol1 === 0 && dCol2 === 0) { // in start col, bottom -> last
                    return verticalOrder;
                }
                if (dCol1 === 0 && dCol2 !== 0) { // lines to right of start col -> last, those to left -> first
                    return -1 * dCol2;
                }
                if (dCol1 > 0 && dCol2 > 0) { // to right of start col, topright diagonal bands -> last
                    var diagonalOrder = horizontalOrder - verticalOrder;
                    if (diagonalOrder === 0) { // within same diagonal band, top -> last
                        return -1 * verticalOrder;
                    } else {
                        return diagonalOrder;
                    }
                }
                if (dCol1 < 0 && dCol2 < 0) { // to left of start col, bottomright diagonal bands -> last
                    var diagonalOrder = horizontalOrder + verticalOrder;
                    if (diagonalOrder === 0) { // within same diagonal band, bottom -> last
                        return verticalOrder;
                    } else {
                        return diagonalOrder;
                    }
                }
            }

            // by default, if it doesn't fit into one of those special cases, just sort by horizontal distance
            return horizontalOrder;
            //return 10 * (p1.horizontal - p2.horizontal) + 1 * (Math.abs(p2.vertical) - Math.abs(p1.vertical));
        });

        horizontallySortedLinks.forEach( function(link) {
            // filter a list of cells containing that route and that column
            var routeCellsInThisCol = link.route.allCells.filter(function(cell){return cell.location.col === c;});
            if (routeCellsInThisCol.length > 0) { // does this route contain this column?
                var maxOverlappingVertical = 0;
                // get the max vertical overlap of those cells
                // only need to do this step for columns not rows because it has to do with vertical start/end points in block cells
                var firstCellInRoute = that.getCell(link.route.cellLocations[0].col,link.route.cellLocations[0].row);
                var lastCellInRoute = that.getCell(link.route.cellLocations[link.route.cellLocations.length-1].col, link.route.cellLocations[link.route.cellLocations.length-1].row);
                routeCellsInThisCol.forEach(function(cell) {
                    var excludeStartPoints = (cell === lastCellInRoute);
                    var excludeEndPoints = (cell === firstCellInRoute);
                    //excludeStartPoints = false;
                    //excludeEndPoints = false;
                    maxOverlappingVertical = Math.max(maxOverlappingVertical, cell.countVerticalRoutes(excludeStartPoints,excludeEndPoints)); //todo: should we also keep references to the routes this overlaps?
                });
                // store value in a data structure for that col,route pair
                thisColRouteOverlaps.push({
                    route: link.route, // column index can be determined from position in array
                    maxOverlap: maxOverlappingVertical
                });
            }
        });
        colRouteOverlaps.push(thisColRouteOverlaps);
    }

    var rowRouteOverlaps = [];
    // for each route in column
    for (var r = 0; r < this.size; r++) {
        var thisRowRouteOverlaps = [];
        that.allLinks().sort(function(link1, link2){
            // vertically sorts them so that links starting near horizontal center of block are below those
            // starting near edges, so they don't overlap. requires that we sort horizontally before vertically
            var centerIndex = Math.ceil((horizontallySortedLinks.length-1)/2);
            var index1 = horizontallySortedLinks.indexOf(link1);
            var distFromCenter1 = Math.abs(index1 - centerIndex);
            var index2 = horizontallySortedLinks.indexOf(link2);
            var distFromCenter2 = Math.abs(index2 - centerIndex);
            return distFromCenter2 - distFromCenter1;
            //return 10 * (p1.vertical - p2.vertical) + 1 * (Math.abs(p2.horizontal) - Math.abs(p1.horizontal));

        }).forEach( function(link) {

        //this.forEachLink( function(link) {
            var routeCellsInThisRow = link.route.allCells.filter(function(cell){return cell.location.row === r;});
            if (routeCellsInThisRow.length > 0) { // does this route contain this column?
                var maxOverlappingHorizontal = 0;
                routeCellsInThisRow.forEach(function(cell) {
                    maxOverlappingHorizontal = Math.max(maxOverlappingHorizontal, cell.countHorizontalRoutes());
                });
                thisRowRouteOverlaps.push({
                    route: link.route, // column index can be determined from position in array
                    maxOverlap: maxOverlappingHorizontal
                });
            }
        });
        rowRouteOverlaps.push(thisRowRouteOverlaps);
    }
    return {
        colRouteOverlaps: colRouteOverlaps,
        rowRouteOverlaps: rowRouteOverlaps
    };
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   Block Placement Methods
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Grid.prototype.getCellFromXY = function(xCoord, yCoord) {
    var col;
    var row;

    var colPairIndex = xCoord / (this.blockColWidth + this.marginColWidth);
    var fraction = colPairIndex - Math.floor(colPairIndex);

    if (fraction <= this.blockColWidth / (this.blockColWidth + this.marginColWidth)) {
        col = Math.floor(colPairIndex) * 2;
    } else {
        col = Math.floor(colPairIndex) * 2 + 1;
    }

    var rowPairIndex = yCoord / (this.blockRowHeight + this.marginRowHeight);
    var fraction = rowPairIndex - Math.floor(rowPairIndex);

    if (fraction <= this.blockRowHeight / (this.blockRowHeight + this.marginRowHeight)) {
        row = Math.floor(rowPairIndex) * 2;
    } else {
        row = Math.floor(rowPairIndex) * 2 + 1;
    }

    return this.getCell(col, row);
}





