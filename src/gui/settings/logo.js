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
createNameSpace("realityEditor.gui.settings.logo");

//window.onload = function () {

realityEditor.gui.settings.logo.version = "Version 1.8";
realityEditor.gui.settings.logo.timeCorrection = {delta: 0, now: 0, then: 0};
realityEditor.gui.settings.logo.logoSize = {W: (1785 / 2) * 1.5, H: 1035 * 1.5, offsetX: 100, offsetY: 60};

realityEditor.gui.settings.logo.c = document.getElementById("reLogo");
realityEditor.gui.settings.logo.ctx = document.getElementById("reLogo").getContext("2d");

realityEditor.gui.settings.logo.line = [{
    p1: [936, 144],
    p2: [1658, 131],
    l1: 118 / 4.5,
    l2: 114 / 4.5,
    ballAnimationCount: 0
},
    {p1: [936, 144], p2: [111, 780], l1: 118 / 4.5, l2: 101 / 4.5, ballAnimationCount: 0},
    {p1: [936, 144], p2: [1440, 735], l1: 118 / 4.5, l2: 78 / 4.5, ballAnimationCount: 0},
    {p1: [1658, 131], p2: [993, 920], l1: 114 / 4.5, l2: 99 / 4.5, ballAnimationCount: 0},
    {p1: [993, 920], p2: [626, 722], l1: 99 / 4.5, l2: 32 / 4.5, ballAnimationCount: 0},
    {p1: [993, 920], p2: [1398, 920], l1: 99 / 4.5, l2: 32 / 4.5, ballAnimationCount: 0}];

realityEditor.gui.settings.logo.thePoint = [{p1: [936, 144], l1: 118},
    {p1: [1658, 131], l1: 114},
    {p1: [111, 780], l1: 101},

    {p1: [1440, 735], l1: 78},
    {p1: [993, 920], l1: 99},
    {p1: [626, 722], l1: 32},
    {p1: [1398, 920], l1: 32}];

realityEditor.gui.settings.logo.text = [{p1: [160, 533], l1: 210},
    {p1: [178, 622], l1: 68}, {p1: [178, 160], l1: 68}];

realityEditor.gui.settings.logo.shadowX = 40;
realityEditor.gui.settings.logo.shadow = 40;

// window.onresize=logoResize;

//window.onload = logoResize;

realityEditor.gui.settings.logo.logoResize = function () {

    for (var i1 = 0; i1 < this.line.length; i1++) {
        this.line[i1] = {
            p1: [this.logoSize.offsetX + realityEditor.gui.ar.utilities.map(this.line[i1].p1[0], 0, 1785, 0, this.logoSize.W),
                this.logoSize.offsetY + realityEditor.gui.ar.utilities.map(this.line[i1].p1[1], 0, 1035, 0, 1035 / 1785 * this.logoSize.W)]

            ,
            p2: [this.logoSize.offsetX + realityEditor.gui.ar.utilities.map(this.line[i1].p2[0], 0, 1785, 0, this.logoSize.W),
                this.logoSize.offsetY + realityEditor.gui.ar.utilities.map(this.line[i1].p2[1], 0, 1035, 0, 1035 / 1785 * this.logoSize.W)]

            ,
            l1: realityEditor.gui.ar.utilities.map(this.line[i1].l1, 0, 1785, 0, this.logoSize.W),
            l2: realityEditor.gui.ar.utilities.map(this.line[i1].l2, 0, 1785, 0, this.logoSize.W),
            ballAnimationCount: 0
        };
    }

    for (i1 = 0; i1 < this.thePoint.length; i1++) {
        this.thePoint[i1] = {
            p1: [this.logoSize.offsetX + realityEditor.gui.ar.utilities.map(this.thePoint[i1].p1[0], 0, 1785, 0, this.logoSize.W),
                this.logoSize.offsetY + realityEditor.gui.ar.utilities.map(this.thePoint[i1].p1[1], 0, 1035, 0, 1035 / 1785 * this.logoSize.W)]

            , l1: realityEditor.gui.ar.utilities.map(this.thePoint[i1].l1, 0, 1785, 0, this.logoSize.W)
        };
    }

    for (i1 = 0; i1 < this.text.length; i1++) {
        this.text[i1] = {
            p1: [this.logoSize.offsetX + realityEditor.gui.ar.utilities.map(this.text[i1].p1[0], 0, 1785, 0, this.logoSize.W),
                this.logoSize.offsetY + realityEditor.gui.ar.utilities.map(this.text[i1].p1[1], 0, 1035, 0, 1035 / 1785 * this.logoSize.W)]

            , l1: realityEditor.gui.ar.utilities.map(this.text[i1].l1, 0, 1785, 0, this.logoSize.W)
        };
    }

    this.shadow = realityEditor.gui.ar.utilities.map(this.shadowX, 0, 1785, 0, this.logoSize.W);
}

realityEditor.gui.settings.logo.logoResize();
//ctx.scale(0.5,0.5);

realityEditor.gui.settings.logo.logo = function () {
    realityEditor.gui.ar.utilities.timeSynchronizer(this.timeCorrection);
    this.ctx.clearRect(0, 0, this.c.width, this.c.height);

    for (var i1 = 0; i1 < this.line.length; i1++) {
        realityEditor.gui.ar.lines.drawLine(this.ctx, this.line[i1].p1, this.line[i1].p2, this.line[i1].l1, this.line[i1].l2, this.line[i1], this.timeCorrection, 0, 2, 0.04);
    }

    for (var e1 = 0; e1 < this.thePoint.length; e1++) {
        this.drawCircle(this.ctx, this.thePoint[e1].p1, this.thePoint[e1].l1);
    }

    this.ctx.shadowColor = "#969696";
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
    //  ctx.shadowBlur = shadow;
    this.ctx.fillStyle = '#000000';
    this.ctx.font = "normal normal 900 " + this.text[0].l1 + "px Futura";
    this.ctx.fillText("Reality Editor", this.text[0].p1[0], this.text[0].p1[1]);
    this.ctx.fillStyle = '#000000';
    this.ctx.font = "normal normal 900 " + this.text[1].l1 + "px Futura";
    this.ctx.fillText(this.version, this.text[1].p1[0], this.text[1].p1[1]);
    this.ctx.shadowBlur = 0;
    this.ctx.fillStyle = '#000000';
    this.ctx.font = "normal normal 900 " + this.text[1].l1 + "px Futura";
    this.ctx.fillText("", this.text[2].p1[0], this.text[2].p1[1]);
    this.ctx.shadowBlur = 0;
};

realityEditor.gui.settings.logo.drawCircle = function (ctx, point, bSize) {
    ctx.beginPath();
    ctx.arc(point[0], point[1], bSize, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#222222';
    ctx.fill();
    ctx.lineWidth = bSize / 8.4286;
    ctx.strokeStyle = '#00ffff';
    ctx.stroke();
};

realityEditor.gui.settings.logo.step = function () {

    if (realityEditor.gui.settings.states.settingsButton) {

        this.logo();
        window.requestAnimationFrame(realityEditor.gui.settings.logo.step);
    } else return;
}.bind(realityEditor.gui.settings.logo);
//  window.requestAnimationFrame(step);
//}