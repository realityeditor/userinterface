/**
 * @preserve
 *
 *                                      .,,,;;,'''..
 *                                  .'','...     ..',,,.
 *                                .,,,,,,',,',;;:;,.  .,l,
 *                               .,',.     ...     ,;,   :l.
 *                              ':;.    .'.:do;;.    .c   ol;'.
 *       ';;'                   ;.;    ', .dkl';,    .c   :; .'.',::,,'''.
 *      ',,;;;,.                ; .,'     .'''.    .'.   .d;''.''''.
 *     .oxddl;::,,.             ',  .'''.   .... .'.   ,:;..
 *      .'cOX0OOkdoc.            .,'.   .. .....     'lc.
 *     .:;,,::co0XOko'              ....''..'.'''''''.
 *     .dxk0KKdc:cdOXKl............. .. ..,c....
 *      .',lxOOxl:'':xkl,',......'....    ,'.
 *           .';:oo:...                        .
 *                .cd,      ╔═╗┌┬┐┬┌┬┐┌─┐┬─┐    .
 *                  .l;     ║╣  │││ │ │ │├┬┘    '
 *                    'l.   ╚═╝─┴┘┴ ┴ └─┘┴└─   '.
 *                     .o.                   ...
 *                      .''''','.;:''.........
 *                           .'  .l
 *                          .:.   l'
 *                         .:.    .l.
 *                        .x:      :k;,.
 *                        cxlc;    cdc,,;;.
 *                       'l :..   .c  ,
 *                       o.
 *                      .,
 *
 *      ╦═╗┌─┐┌─┐┬  ┬┌┬┐┬ ┬  ╔═╗┌┬┐┬┌┬┐┌─┐┬─┐  ╔═╗┬─┐┌─┐ ┬┌─┐┌─┐┌┬┐
 *      ╠╦╝├┤ ├─┤│  │ │ └┬┘  ║╣  │││ │ │ │├┬┘  ╠═╝├┬┘│ │ │├┤ │   │
 *      ╩╚═└─┘┴ ┴┴─┘┴ ┴  ┴   ╚═╝─┴┘┴ ┴ └─┘┴└─  ╩  ┴└─└─┘└┘└─┘└─┘ ┴
 *
 *
 * Created by Valentin on 10/22/14.
 *
 * Copyright (c) 2015 Valentin Heun
 * Modified by Valentin Heun 2014, 2015, 2016, 2017
 * Modified by Benjamin Reynholds 2016, 2017
 * Modified by James Hobin 2016, 2017
 *
 * All ascii characters above must be included in any redistribution.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

createNameSpace("realityEditor.gui.search");

realityEditor.gui.search.list = {
    milk: {text:"Milk", state: null},
    wheat: {text:"Wheat", state: null},
    nuts: {text:"Nuts", state: null},

    fish : {text:"Fish", state: null},
    pork : {text:"Pork", state: null},
    beef: {text:"Beef", state: null},

    vegetarian: {text:"Vegetarian", state: null},
    cornSyrup: {text:"Corn Syrup", state: null},
    organic: {text:"Organic", state: null}
};

//set item in storage.
if(typeof localStorage["searchList"] !== "undefined"){
    var thisSearchList = JSON.parse(localStorage["searchList"]);
    for(var key in thisSearchList){
      if(key in realityEditor.gui.search.list){
          realityEditor.gui.search.list[key].state = thisSearchList[key].state;
      }
    }
}

realityEditor.gui.search.visible = false;

realityEditor.gui.search.switch = function(id, state){

    if(state == null){
        document.getElementById(id+"0").style.display = "inline";
        document.getElementById(id+"1").style.display = "none";
        document.getElementById(id+"2").style.display = "none";
    } else if(state == false){
        document.getElementById(id+"0").style.display = "none";
        document.getElementById(id+"1").style.display = "inline";
        document.getElementById(id+"2").style.display = "none";
    } else if(state == true){
        document.getElementById(id+"0").style.display = "none";
        document.getElementById(id+"1").style.display = "none";
        document.getElementById(id+"2").style.display = "inline";
    }
};



realityEditor.gui.search.add = function () {
    realityEditor.gui.search.visible = true;
    document.getElementById("searchDiv").style.display = "inline";

    for (var buttonName in this.list) {
        var searchButtonContainer = document.createElement('div');
        searchButtonContainer.classList.add("searchCell");
        searchButtonContainer.id =  buttonName+"searchButton";
        searchButtonContainer.search =  buttonName;
        searchButtonContainer.onclick = function () {
            var that = realityEditor.gui.search;

            if( that.list[this.search].state == null){
                that.list[this.search].state =false;
                that.switch(this.search, false);
            } else if( that.list[this.search].state == false){
                that.list[this.search].state =true;
                that.switch(this.search, true);
            } else if( that.list[this.search].state == true){
                that.list[this.search].state = null;
                that.switch(this.search, null);
            }
            realityEditor.gui.buttons.sendInterfaces("realitySearch");
            localStorage["searchList"] = JSON.stringify(that.list);
        };

        var searchButtonContent = document.createElement('div');
        searchButtonContent.id = buttonName +"searchButtonContent";
        searchButtonContent.className = "searchItem";

        var button1 = document.createElement('img');
        button1.id = buttonName + "0";
        button1.src = "svg/search/empty.svg";
        button1.style.height = "33px";
        button1.style.width = "33px";
        button1.style.display = "inline";

        var button2 = document.createElement('img');
        button2.id = buttonName + "1";
        button2.src = "svg/search/negative.svg";
        button1.style.height = "33px";
        button1.style.width = "33px";
        button2.style.display = "none";

        var button3 = document.createElement('img');
        button3.id = buttonName + "2";
        button3.src = "svg/search/positive.svg";
        button1.style.height = "33px";
        button1.style.width = "33px";
        button3.style.display = "none";

        var searchButtonText = document.createElement('div');
        searchButtonText.id = "searchText" + buttonName;
        searchButtonText.className = "searchText";
        searchButtonText.innerText = this.list[buttonName].text;



        searchButtonContent.appendChild(button1);
        searchButtonContent.appendChild(button2);
        searchButtonContent.appendChild(button3);

        searchButtonContainer.appendChild(searchButtonContent);
        searchButtonContainer.appendChild(searchButtonText);

        document.getElementById("searchDiv").appendChild(searchButtonContainer);

        this.switch(buttonName, this.list[buttonName].state);
    }

};
realityEditor.gui.search.getVisibility = function (){
    return this.visible;
}

realityEditor.gui.search.getSearch = function (){
    return this.list;
}

realityEditor.gui.search.remove = function (){
    realityEditor.gui.search.visible = false;
    if( document.getElementById("searchDiv").style.display === "inline") {
        document.getElementById("searchDiv").innerHTML = "";
        document.getElementById("searchDiv").style.display = "none";
    }
};
