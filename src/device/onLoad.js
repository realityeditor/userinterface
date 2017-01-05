/**
 * @desc
 **/

createNameSpace("realityEditor.device");

realityEditor.device.onload = function () {
	console.log("starting up GUI");
	uiButtons = document.getElementById("GUI");
	guiButtonImage= document.getElementById("guiButtonImage");
	overlayDiv = document.getElementById('overlay');

	realityEditor.gui.buttons.draw();
	initMemoryBar();
	pocketInit();

	console.log(globalStates.platform);

	if (globalStates.platform !== 'iPad' && globalStates.platform !== 'iPhone' && globalStates.platform !== 'iPod touch') {
		globalStates.platform = false;
	}



	if (globalStates.platform === 'iPhone') {
		document.getElementById("logButtonDiv").style.visibility = "hidden";
		// document.getElementById("reloadButtonDiv").style.visibility = "hidden";
		//   document.getElementById("preferencesButtonDiv").style.bottom = "36px";

		var editingInterface = document.getElementById("content2title");
		editingInterface.style.fontSize = "12px";
		editingInterface.style.left = "38%";
		editingInterface.style.right = "22%";

		editingInterface = document.getElementById("content1title");
		editingInterface.style.fontSize = "12px";
		editingInterface.style.left = "2%";
		editingInterface.style.right = "65%";

		editingInterface = document.getElementById("content2");
		editingInterface.style.fontSize = "9px";
		editingInterface.style.left = "38%";
		editingInterface.style.right = "22%";
		editingInterface.style.bottom = "14%";

		editingInterface = document.getElementById("content11");
		editingInterface.style.fontSize = "12px";
		editingInterface.style.width = "40%";

		editingInterface = document.getElementById("content12");
		editingInterface.style.fontSize = "12px";
		editingInterface.style.width = "60%";

		editingInterface = document.getElementById("content13");
		editingInterface.style.fontSize = "12px";
		editingInterface.style.width = "40%";

		editingInterface = document.getElementById("content14");
		editingInterface.style.fontSize = "12px";
		editingInterface.style.width = "60%";

		editingInterface = document.getElementById("content15");
		editingInterface.style.fontSize = "12px";
		editingInterface.style.width = "40%";
		editingInterface.innerHTML = '<b>External Interface</b><br>';

		editingInterface = document.getElementById("content16");
		editingInterface.style.fontSize = "12px";
		editingInterface.style.width = "60%";

		editingInterface = document.getElementById("content18");
		editingInterface.style.visibility = 'hidden';

		editingInterface = document.getElementById("content1");
		editingInterface.style.fontSize = "12px";
		editingInterface.style.left = "2%";
		editingInterface.style.right = "65%";
		editingInterface.style.bottom = "14%";

	} else {
		editingInterface = document.getElementById("content15");
		editingInterface.style.paddingTop = "13px";

		editingInterface = document.getElementById("content20");
		editingInterface.innerHTML = '<input id="newURLText"' +

			"style='text-align: left; font-family: Helvetica Neue, Helvetica, Arial; font-size: large;   -webkit-user-select: text;'" +
			'type="text" name="newURL"  size="27" placeholder="http://..."' + "oninput='newURLTextLoad()'><br>";
	}

	globalCanvas.canvas = document.getElementById('canvas');
	globalCanvas.canvas.width = globalStates.height;
	globalCanvas.canvas.height = globalStates.width;

	globalCanvas.context = canvas.getContext('2d');

	if (globalStates.platform) {
		window.location.href = "of://kickoff";
	}

	globalCanvas.canvas.addEventListener("pointerdown", realityEditor.device.onCanvasPointerDown, false);
	ec++;

	document.addEventListener("pointermove", realityEditor.device.getPossition, false);
	ec++;
	document.addEventListener("pointerdown", realityEditor.device.onDocumentPointerDown, false);
	//document.addEventListener("pointerdown", getPossition, false);
	ec++;
	document.addEventListener("pointerup", realityEditor.device.onDocumentPointerUp, false);
	ec++;
	window.addEventListener("message", realityEditor.network.onInternalPostMessage, false);
	ec++;
	overlayDiv.addEventListener('touchstart', function (e) {
		e.preventDefault();
	});

	this.cout("onload");

};


window.onload = realityEditor.device.onload;