createNameSpace("realityEditor.gui.settings");

realityEditor.gui.settings.setSettings = function (id, state) {
    if (!document.getElementById(id)) return;

    if (id === "externalText") {
        if (state !== "") {
            document.getElementById(id).value = state;
        }
        return;
    }

    if (id) {
        if (state) {
            document.getElementById(id).className = "toggle active";
        } else {
            document.getElementById(id).className = "toggle";
        }
    }
}

realityEditor.gui.settings.newURLTextLoad = function () {
    this.states.externalState = encodeURIComponent(document.getElementById('externalText').value);
};

realityEditor.gui.settings.reloadUI = function () {
    if (this.states.externalState !== "" && this.states.externalState !== "http") {
        console.log("window.location.href = " + "of://loadNewUI" + this.states.externalState);
        window.location.href = "of://loadNewUI" + this.states.externalState;
    }
};

realityEditor.gui.settings.loadSettingsPost = function () {
    parent.postMessage(
        //  Gett all the Setting states.
        JSON.stringify({
            settings: {
                getSettings: true
            }
        })
        // this needs to contain the final interface source
        , "*");

    window.addEventListener("message", function (e) {

        var msg = JSON.parse(e.data);

        if (msg.getSettings) {

            this.states.extendedTracking = msg.getSettings.extendedTracking;
            this.states.editingMode = msg.getSettings.editingMode;
            this.states.clearSkyState = msg.getSettings.clearSkyState;
            this.states.instantState = msg.getSettings.instantState;
            this.states.externalState = msg.getSettings.externalState;
            this.states.settingsButton = msg.getSettings.settingsButton;

            this.setSettings("extendedTracking", this.states.extendedTracking);
            this.setSettings("lockingState", false);
            this.setSettings("instantState", this.states.instantState);
            this.setSettings("editingMode", this.states.editingMode);
            this.setSettings("clearSkyState", this.states.clearSkyState);
            this.setSettings("externalText", this.states.externalState);

            if (typeof realityEditor.gui.settings.logo !== "undefined" && this.states.settingsButton && !this.states.animationFrameRequested) {
                this.states.animationFrameRequested = true;
                window.requestAnimationFrame(realityEditor.gui.settings.logo.step);
            }

            if (!this.states.settingsButton) {
                this.states.animationFrameRequested = false;
            }

            if (typeof this.callObjects !== "undefined" && this.states.settingsButton && !this.states.setInt) {
                this.states.setInt = true;
                this.objectInterval = setInterval(this.callObjects, 1000);
            }

            if (!this.states.settingsButton) {
                this.states.setInt = false;
                if (typeof this.objectInterval !== "undefined") {
                    clearInterval(this.objectInterval);
                }
            }
        }
    }.bind(realityEditor.gui.settings));

    document.addEventListener('toggle',
        function (e) {
            var msg = {};
            msg.settings = {};
            msg.settings.setSettings = {};
            msg.settings.setSettings[e.target.id] = e.detail.isActive;
            parent.postMessage(JSON.stringify(msg), "*");
        }
    );

};

window.onload = realityEditor.gui.settings.loadSettingsPost;
realityEditor.gui.settings.loadSettingsPost();
