createNameSpace("realityEditor.gui.settings");

realityEditor.gui.settings.setSettings = function (id, state) {
    if (!document.getElementById(id)) return;

    if (id === "externalText") {
        if (state !== "") {
            document.getElementById(id).value = state;
        }
        return;
    }
    
    if (id === "lockText") {
        //if (state !== "") {
        //    document.getElementById(id).value = state; // TODO: do we need this?
        //}
        return;
    }

    if (id) {
        if (state) {

            document.getElementById(id).classList.add('active'); // TODO: doesn't really need this change, revert to previous?
            
            //document.getElementById(id).className = "toggle active";
        } else {

            document.getElementById(id).classList.remove('active');

            //document.getElementById(id).className = "toggle";
        }
    }
    
    if (id === "lockingToggle") {
        this.updateLockUI();
        //document.getElementById("lockText").disabled = document.getElementById(id).classList.contains('active');  //e.detail.isActive;
    }
    
    //    if (!state) {
    //        document.getElementById(id).firstElementChild.style.transform = "translate3d(0px, 0px, 0px);";
    //    }
    //    //    document.getElementById("lockText").disabled = state;
    //    //    console.log("change text disabled " + document.getElementById("lockText").disabled);
    //}
};

realityEditor.gui.settings.updateLockUI = function() {
    document.getElementById("lockText").disabled = document.getElementById('lockingToggle').classList.contains('active');  //e.detail.isActive;
};

realityEditor.gui.settings.newURLTextLoad = function () {
    this.states.externalState = encodeURIComponent(document.getElementById('externalText').value);
};

realityEditor.gui.settings.reloadUI = function () {
    if (this.states.externalState !== "" && this.states.externalState !== "http") {
        console.log("window.location.href = " + "of://loadNewUI" + this.states.externalState);
        window.location.href = "of://loadNewUI" + this.states.externalState;
    }
};

realityEditor.gui.settings.newLockTextLoad = function () {
    this.states.lockPassword = encodeURIComponent(document.getElementById('lockText').value);
    console.log("lockPassword = " + this.states.lockPassword);
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
            this.states.lockingMode = msg.getSettings.lockingMode;
            this.states.lockPassword = msg.getSettings.lockPassword;

            this.states.realityState = msg.getSettings.realityState;

            this.setSettings("extendedTracking", this.states.extendedTracking);
            this.setSettings("instantState", this.states.instantState);
            this.setSettings("editingMode", this.states.editingMode);
            this.setSettings("clearSkyState", this.states.clearSkyState);
            this.setSettings("externalText", this.states.externalState);
            this.setSettings("lockingToggle", this.states.lockingMode);
            this.setSettings("lockText", this.states.lockPassword);
            
            //if (!this.states.lockingMode) {
            //    document.getElementById('lockingToggle').firstChild.style.transform = "translate3d(0px, 0px, 0px);";
            //}

            this.setSettings("realityState", this.states.realityState);

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
            if (e.target.id === "lockingToggle") {
                
                msg.settings.setSettings['lockPassword'] = realityEditor.gui.settings.states.lockPassword;
                realityEditor.gui.settings.updateLockUI();

                //if (id === "lockingToggle") {
                //    document.getElementById("lockText").disabled = e.detail.isActive;
                    //console.log("change text disabled " + document.getElementById("lockText").disabled);
                //}
            }
            parent.postMessage(JSON.stringify(msg), "*");
        }
    );

};

window.onload = realityEditor.gui.settings.loadSettingsPost;
realityEditor.gui.settings.loadSettingsPost();
