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
 *              ╦ ╦┬ ┬┌┐ ┬─┐┬┌┬┐  ╔═╗┌┐  ┬┌─┐┌─┐┌┬┐┌─┐
 *              ╠═╣└┬┘├┴┐├┬┘│ ││  ║ ║├┴┐ │├┤ │   │ └─┐
 *              ╩ ╩ ┴ └─┘┴└─┴─┴┘  ╚═╝└─┘└┘└─┘└─┘ ┴ └─┘
 *
 *
 * Created by Valentin on 10/22/14.
 *
 * Copyright (c) 2015 Valentin Heun
 *
 * All ascii characters above must be included in any redistribution.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

var version = "Version 1.8";
var timeCorrection = { delta:0, now:0, then:0};
var logoSize = {W:(1785/2)*1.5, H: 1035*1.5, offsetX: 100, offsetY: 60};

var c = document.getElementById("reLogo");
var ctx = c.getContext("2d");

var line =
    [{p1:[936, 144],p2:[1658, 131],l1:118 / 4.5,l2:114 / 4.5,ballAnimationCount:0},
        {p1:[936, 144],p2:[111, 780],l1:118 / 4.5,l2:101 / 4.5,ballAnimationCount:0},
        {p1:[936, 144],p2:[1440, 735],l1:118 / 4.5,l2:78 / 4.5,ballAnimationCount:0},
        {p1:[1658, 131],p2:[993, 920],l1:114 / 4.5,l2:99 / 4.5,ballAnimationCount:0},
        {p1:[993, 920],p2:[626, 722],l1:99 / 4.5,l2:32 / 4.5,ballAnimationCount:0},
        {p1:[993, 920],p2:[1398, 920],l1:99 / 4.5,l2:32 / 4.5,ballAnimationCount:0}];

var thePoint =
    [{p1:[936, 144],l1:118},
        {p1:[1658, 131],l1:114},
        {p1:[111, 780],l1:101},

        {p1:[1440, 735],l1:78},
        {p1:[993, 920],l1:99},
        {p1:[626, 722],l1:32},
        {p1:[1398, 920],l1:32}];


var text = [{p1:[160, 533],l1:210},
    {p1:[178, 622],l1:68},{p1:[178, 160],l1:68}];

var shadow = 40;

// window.onresize=logoResize;

//window.onload = logoResize;
logoResize();

function logoResize() {

    for (var i1 = 0; i1 < line.length; i1++) {
        line[i1] = {
            p1: [logoSize.offsetX + map(line[i1].p1[0], 0, 1785, 0, logoSize.W),
                logoSize.offsetY + map(line[i1].p1[1], 0, 1035, 0, 1035 / 1785 * logoSize.W)]

            , p2: [logoSize.offsetX + map(line[i1].p2[0], 0, 1785, 0, logoSize.W),
                logoSize.offsetY + map(line[i1].p2[1], 0, 1035, 0, 1035 / 1785 * logoSize.W)]

            , l1: map(line[i1].l1, 0, 1785, 0, logoSize.W),
            l2: map(line[i1].l2, 0, 1785, 0, logoSize.W),
            ballAnimationCount: 0
        };
    }

    for (i1 = 0; i1 < thePoint.length; i1++) {
        thePoint[i1] = {
            p1: [logoSize.offsetX + map(thePoint[i1].p1[0], 0, 1785, 0, logoSize.W),
                logoSize.offsetY + map(thePoint[i1].p1[1], 0, 1035, 0, 1035 / 1785 * logoSize.W)]

            , l1: map(thePoint[i1].l1, 0, 1785, 0, logoSize.W)
        };
    }

    for (i1 = 0; i1 < text.length; i1++) {
        text[i1] = {
            p1: [logoSize.offsetX + map(text[i1].p1[0], 0, 1785, 0, logoSize.W),
                logoSize.offsetY + map(text[i1].p1[1], 0, 1035, 0, 1035 / 1785 * logoSize.W)]

            , l1: map(text[i1].l1, 0, 1785, 0, logoSize.W)
        };
    }

    shadow = map(shadow, 0, 1785, 0, logoSize.W);
}

//ctx.scale(0.5,0.5);

function logo() {
    timeSynchronizer(timeCorrection);
    ctx.clearRect(0, 0, c.width, c.height);

    for(var i1 = 0; i1<line.length; i1++){
        drawLine(ctx, line[i1].p1, line[i1].p2, line[i1].l1, line[i1].l2, line[i1],timeCorrection,0,2,0.04);
    }

    for(var e1 = 0; e1<thePoint.length; e1++){
        drawCircle(ctx, thePoint[e1].p1, thePoint[e1].l1);
    }

    ctx.shadowColor = "#969696";
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    //  ctx.shadowBlur = shadow;
    ctx.fillStyle = '#000000';
    ctx.font="normal normal 900 "+text[0].l1+"px Futura";
    ctx.fillText("Reality Editor",text[0].p1[0],text[0].p1[1]);
    ctx.fillStyle = '#000000';
    ctx.font="normal normal 900 "+text[1].l1+"px Futura";
    ctx.fillText(version,text[1].p1[0],text[1].p1[1]);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#000000';
    ctx.font="normal normal 900 "+text[1].l1+"px Futura";
    ctx.fillText("",text[2].p1[0],text[2].p1[1]);
    ctx.shadowBlur = 0;
}

function drawCircle(ctx, point, bSize){
    ctx.beginPath();
    ctx.arc(point[0],point[1], bSize, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#222222';
    ctx.fill();
    ctx.lineWidth = bSize/8.4286;
    ctx.strokeStyle = '#00ffff';
    ctx.stroke();
}

function step(){
    logo();
    window.requestAnimationFrame(step);

}
window.requestAnimationFrame(step);
