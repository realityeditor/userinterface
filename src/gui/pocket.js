

createNameSpace("realityEditor.gui.pocket");

realityEditor.gui.pocket.pocketButtonAction = function() {

	console.log("state: " + globalStates.pocketButtonState);

	var indexChange = (globalStates.guiState === "logic") ? 4 : 0;

	if (globalStates.pocketButtonState === true) {
		console.log("buttonon");
		if (!globalStates.UIOffMode)    document.getElementById('pocketButton').src = pocketButtonImage[0+indexChange].src;
		globalStates.pocketButtonState = false;

		if (globalStates.guiState === 'logic') {
		realityEditor.gui.crafting.blockMenuVisible();
			console.log("blockMenuVisible");
		}
	}
	else {
		console.log("buttonoff");
		if (!globalStates.UIOffMode)    document.getElementById('pocketButton').src = pocketButtonImage[2+indexChange].src;
		globalStates.pocketButtonState = true;

		if (globalStates.guiState === 'logic') {
			realityEditor.gui.crafting.blockMenuHide();
		}
	}

}

realityEditor.gui.pocket.setPocketPossition = function(evt){


	if(pocketItem.pocket.nodes[pocketItemId]){

		var thisItem = pocketItem.pocket.nodes[pocketItemId];

		if(globalLogic.farFrontElement==="") {
			thisItem.x = evt.clientX - (globalStates.height / 2);
			thisItem.y = evt.clientY - (globalStates.width / 2);

		}
		else {
			if(thisItem.screenZ !==2 && thisItem.screenZ) {

				//  console.log(thisItem.screenZ);
				// console.log(screenCoordinatesToMatrixXY(thisItem, [evt.clientX, evt.clientY]));
				var matrixTouch = screenCoordinatesToMatrixXY(thisItem, [evt.clientX, evt.clientY]);
				// console.log(thisItem);
				thisItem.x = matrixTouch[0];
				thisItem.y = matrixTouch[1];

			}
		}


		//  pocketItem.pocket.x = evt.clientX;
		// pocketItem.pocket.y = evt.clientY;



	}

}