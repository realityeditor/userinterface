var states = {
    extendedTracking: false,
    editingMode: false,
    clearSkyState: false,
    externalState: "",
    logoAnimation:false
};

window.addEventListener("message", function (e) {

    var msg = JSON.parse(e.data);

    if (msg.getSettings) {

        console.log(msg.getSettings);
        states.extendedTracking = msg.getSettings.extendedTracking;
        states.editingMode = msg.getSettings.editingMode;
        states.clearSkyState = msg.getSettings.clearSkyState;
        states.instantState = msg.getSettings.instantState;
        states.externalState = msg.getSettings.externalState;


        setSettings("extendedTracking",  states.extendedTracking);
        setSettings("lockingState",  false);
        setSettings("instantState", states.instantState);
        setSettings("editingMode",  states.editingMode);
        setSettings("clearSkyState",  states.clearSkyState);
        setSettings("externalText", states.externalState);
    }

    console.log(msg);
    if(msg.startAnimation === false){
        if(objectInterval) {
            clearInterval(objectInterval);
        }
        states.logoAnimation = false;
    }

    if(msg.startAnimation === true){
        if(typeof callObjects !== "undefined") {
            objectInterval = setInterval(callObjects, 4000);
        }
        if(typeof step !== "undefined") {
            window.requestAnimationFrame(step);
        }
        states.logoAnimation = true;
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
