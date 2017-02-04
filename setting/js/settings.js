var states = {
    extendedTracking: false,
    editingMode: false,
    clearSkyState: false,
    externalState: ""
};

window.addEventListener("message", function (e) {

    var msg = JSON.parse(e.data);

    if (msg.getSettings) {

        console.log(msg.getSettings);
        states.extendedTracking = msg.getSettings.extendedTracking;
        states.editingMode = msg.getSettings.editingMode;
        states.clearSkyState = msg.getSettings.clearSkyState;
        states.externalState = msg.getSettings.externalState;
        setSettings("extendedTracking",  states.extendedTracking);
        setSettings("lockingState",  false);
        setSettings("instantState",  false);
        setSettings("editingMode",  states.editingMode);
        setSettings("clearSky",  states.clearSkyState);
        setSettings("externalText", states.externalState);


    }
});


function setSettings (id,state) {
    if(!document.getElementById(id)) return;

    if(id === "externalText"){
        if(state !== "") {
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


 function newURLTextLoad() {
     states.externalState = encodeURIComponent(document.getElementById('externalText').value);
};

function reloadUI() {
    if(states.externalState !=="" && states.externalState !=="http") {
        window.location.href = "of://loadNewUI" + states.externalState;
    }
}

window.onload =loadSettingsPost;


loadSettingsPost();

function loadSettingsPost() {
    parent.postMessage(
        //  Gett all the Setting states.
        JSON.stringify({settings: {
            getSettings : true
        }
        })
        // this needs to contain the final interface source
        , "*");
};

    document.addEventListener('toggle',
        function (e) {
            var msg = {};
            msg.settings = {};
            msg.settings.setSettings = {};
            msg.settings.setSettings[e.target.id] = e.detail.isActive;
            parent.postMessage(JSON.stringify(msg), "*");
        }
    );
