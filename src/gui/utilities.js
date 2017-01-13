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


createNameSpace("realityEditor.gui.utilities");

/**********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * @desc
 * @param
 * @param
 * @return {Boolean}
 **/
realityEditor.gui.utilities.checkLineCross = function (x11, y11, x12, y12, x21, y21, x22, y22, w, h) {
	var l1 = this.lineEq(x11, y11, x12, y12),
		l2 = this.lineEq(x21, y21, x22, y22);

	var interX = this.calculateX(l1, l2); //calculate the intersection X value
	if (interX > w || interX < 0) {
		return false; //false if intersection of lines is output of canvas
	}
	var interY = this.calculateY(l1, interX);
	// cout("interX, interY",interX, interY);

	if (!interY || !interX) {
		return false;
	}
	if (interY > h || interY < 0) {
		return false; //false if intersection of lines is output of canvas
	}
	//  cout("point on line --- checking on segment now");
	return (this.checkBetween(x11, x12, interX) && this.checkBetween(y11, y12, interY)
	&& this.checkBetween(x21, x22, interX) && this.checkBetween(y21, y22, interY));
};

/**********************************************************************************************************************
 **********************************************************************************************************************/

//function for calculating the line equation.
//returns [m, b], where this corresponds to y = mx + b
//y = [(y1-y2)/(x1-x2), -(y1-y2)/(x1-x2)*x1 + y1]

/**
 * @desc
 * @param
 * @param
 * @return {Number|Array}
 **/

realityEditor.gui.utilities.lineEq = function (x1, y1, x2, y2) {
	var m = this.slopeCalc(x1, y1, x2, y2);
	// if(m == 'vertical'){
	//     return ['vertical', 'vertical'];
	// }
	return [m, -1 * m * x1 + y1];

};

/**********************************************************************************************************************
 **********************************************************************************************************************/

//function for calucating the slope of given points
//slope has to be multiplied by -1 because the y-axis value increases we we go down

/**
 * @desc
 * @param
 * @param
 * @return {Number}
 **/

realityEditor.gui.utilities.slopeCalc = function (x1, y1, x2, y2) {
	if ((x1 - x2) == 0) {
		return 9999; //handle cases when slope is infinity
	}
	return (y1 - y2) / (x1 - x2);
};

/**********************************************************************************************************************
 **********************************************************************************************************************/

//calculate the intersection x value given two line segment
//param: [m1,b1], [m2,b2]
//return x -> the x value

/**
 * @desc
 * @param
 * @param
 * @return {Number}
 **/

realityEditor.gui.utilities.calculateX = function (seg1, seg2) {
	return (seg2[1] - seg1[1]) / (seg1[0] - seg2[0]);
};

/**********************************************************************************************************************
 **********************************************************************************************************************/

//calculate y given x and the line equation

/**
 * @desc
 * @param
 * @param
 * @return {Number}
 **/

realityEditor.gui.utilities.calculateY = function (seg1, x) {
	return seg1[0] * x + seg1[1];
};

/**********************************************************************************************************************
 **********************************************************************************************************************/

//given two end points of the segment and some other point p,
//return true - if p is between thw two segment points,  false otherwise

/**
 * @desc
 * @param
 * @param
 * @return {Boolean}
 **/

realityEditor.gui.utilities.checkBetween = function (e1, e2, p) {
	const marg2 = 2;
	// cout("e1,e2,p :",e1,e2,p);
	if (e1 - marg2 <= p && p <= e2 + marg2) {
		return true;
	}
	if (e2 - marg2 <= p && p <= e1 + marg2) {
		return true;
	}

	return false;
};
