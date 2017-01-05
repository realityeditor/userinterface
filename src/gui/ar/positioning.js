
createNameSpace("realityEditor.gui.ar.positioning");

/**
 * @desc
 * @param touch
 **/

realityEditor.gui.ar.positioning.onScaleEvent = function(touch) {
	var thisRadius = Math.sqrt(Math.pow((globalStates.editingModeObjectX - touch.pageX), 2) + Math.pow((globalStates.editingModeObjectY - touch.pageY), 2));
	var thisScale = (thisRadius - globalStates.editingScaledistance) / 300 + globalStates.editingScaledistanceOld;

	// cout(thisScale);

	var tempThisObject = {};
	if (globalStates.editingModeObject != globalStates.editingModeLocation) {
		tempThisObject = objects[globalStates.editingModeObject].nodes[globalStates.editingModeLocation];
	} else {
		tempThisObject = objects[globalStates.editingModeObject];
	}
	if (thisScale < 0.2)thisScale = 0.2;
	if (typeof thisScale === "number" && thisScale > 0) {
		tempThisObject.scale = thisScale;
	}
	globalCanvas.context.clearRect(0, 0, globalCanvas.canvas.width, globalCanvas.canvas.height);
	//drawRed(globalCanvas.context, [globalStates.editingModeObjectX,globalStates.editingModeObjectY],[touch.pageX,touch.pageY],globalStates.editingScaledistance);
	this.ar.lines.drawBlue(globalCanvas.context, [globalStates.editingModeObjectX, globalStates.editingModeObjectY], [touch.pageX, touch.pageY], globalStates.editingScaledistance);

	if (thisRadius < globalStates.editingScaledistance) {

		this.ar.lines.drawRed(globalCanvas.context, [globalStates.editingModeObjectX, globalStates.editingModeObjectY], [touch.pageX, touch.pageY], thisRadius);

	} else {
		this.ar.lines.drawGreen(globalCanvas.context, [globalStates.editingModeObjectX, globalStates.editingModeObjectY], [touch.pageX, touch.pageY], thisRadius);

	}
	this.cout("scaleEvent");
}