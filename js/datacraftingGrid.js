
function Grid(containerWidth, containerHeight) {

    this.size = 7; // number of rows and columns
    this.blockColWidth = 2 * (containerWidth / 11);
    this.blockRowHeight = (containerHeight / 7);
    this.marginColWidth = (containerWidth / 11);
    this.marginRowHeight = this.blockRowHeight;

    this.cells = []; // array of [Cell] objects

    // initialize list of cells using the size of the grid
    for (var row = 0; row < this.size; row++) {
        for (var col = 0; col < this.size; col++) {
            var cellLocation = new CellLocation(col, row);
            var cell = new Cell(cellLocation);
            this.cells.push(cell);
        }
    }
}











