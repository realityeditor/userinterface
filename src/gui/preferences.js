
createNameSpace("realityEditor.gui.preferences");

realityEditor.gui.preferences.preferencesHide = function() {
	document.getElementById('preferencesButton').src = preferencesButtonImage[0].src;
	globalStates.preferencesButtonState = false;
	document.getElementById("preferences").style.visibility = "hidden"; //= "hidden";
	document.getElementById("preferences").style.display = "none"; //= "hidden";
	clearInterval(globalStates.thisAndthat.interval);
	this.cout("preferencesHide");
}

/**
 * @desc
 **/

realityEditor.gui.preferences.preferencesVisible = function() {
	document.getElementById('preferencesButton').src = preferencesButtonImage[2].src;
	globalStates.preferencesButtonState = true;
	document.getElementById("preferences").style.visibility = "visible"; //
	document.getElementById("preferences").style.display = "inline"; //= "hidden";
	var _this = this;
	globalStates.thisAndthat.interval = setInterval(function() {
		_this.addElementInPreferences();
	}, 200);
	this.cout("preferencesVisible");

};


/**
 * Construct and insert the list of objects into the preferences display
 */
realityEditor.gui.preferences.addElementInPreferences = function() {
	this.cout("addedObject");

	var htmlContent = "";

	htmlContent += "<div class='Interfaces objectEntry objectName'>Name</div>";

	htmlContent += "<div class='Interfaces objectEntry objectIP'>IP</div>";

	htmlContent += "<div class='Interfaces objectEntry objectVersion'>Version</div>";

	htmlContent += "<div class='Interfaces objectEntry objectIO'>Nodes</div>";

	htmlContent += "<div class='Interfaces objectEntry objectLinks'>Links</div>";


	// Construct the entries for each current object. Turns into a row through
	// convenient wrapping

	var bgSwitch = false;
	var bgcolor = "";

	for (var keyPref in objects) {

		if (bgSwitch) {
			bgcolor = "background-color: #a0a0a0;";
			bgSwitch = false;
		} else {
			bgcolor = "background-color: #aaaaaa;";
			bgSwitch = true;
		}

		htmlContent += "<div class='Interfaces objectEntry objectName' id='" +
			"name" + keyPref +
			"' style='" + bgcolor + "'>" +
			objects[keyPref].name
			+ "</div>";

		htmlContent += "<div class='Interfaces objectEntry objectIP' id='" +
			"ip" + keyPref +
			"' style='" + bgcolor + "'>" +
			objects[keyPref].ip
			+ "</div>";

		htmlContent += "<div class='Interfaces objectEntry objectVersion' id='" +
			"version" + keyPref +
			"' style='" + bgcolor + "'>" +
			objects[keyPref].version
			+ "</div>";

		var anzahl = 0;

		for (var subkeyPref2 in objects[keyPref].nodes) {
			anzahl++;
		}

		htmlContent += "<div class='Interfaces objectEntry objectIO' id='" +
			"io" + keyPref +
			"' style='" + bgcolor + "'>" +
			anzahl
			+ "</div>";

		anzahl = 0;

		for (var subkeyPref in objects[keyPref].links) {
			anzahl++;
		}

		htmlContent += "<div class='Interfaces objectEntry objectLinks' id='" +
			"links" + keyPref +
			"' style='" + bgcolor + "'>" +
			anzahl
			+ "</div>";

	}

	document.getElementById("content2").innerHTML = htmlContent;

	this.cout("addElementInPreferences");
};