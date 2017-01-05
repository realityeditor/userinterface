/**
 * Created by heun on 12/27/16.
 */

createNameSpace("realityEditor.device.utilities");

/**
 * @desc function to print to console based on debug mode set to true
 **/
function cout() {
	if (globalStates.debug){
		console.log.apply(this, arguments);
	}
};



/**
 * @desc
 * @param
 * @param
 * @return {String}
 **/

realityEditor.device.utilities.uuidTime = function () {
	var dateUuidTime = new Date();
	var abcUuidTime = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	var stampUuidTime = parseInt(Math.floor((Math.random() * 199) + 1) + "" + dateUuidTime.getTime()).toString(36);
	while (stampUuidTime.length < 12) stampUuidTime = abcUuidTime.charAt(Math.floor(Math.random() * abcUuidTime.length)) + stampUuidTime;
	return stampUuidTime
};

/**
 * @desc
 * @param
 * @param
 * @return {String}
 **/

realityEditor.device.utilities.uuidTimeShort = function () {
	var dateUuidTime = new Date();
	var abcUuidTime = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	var stampUuidTime = parseInt("" + dateUuidTime.getMilliseconds() + dateUuidTime.getMinutes() + dateUuidTime.getHours() + dateUuidTime.getDay()).toString(36);
	while (stampUuidTime.length < 8) stampUuidTime = abcUuidTime.charAt(Math.floor(Math.random() * abcUuidTime.length)) + stampUuidTime;
	return stampUuidTime
};

/**
 * @desc
 * @param
 * @param
 * @return {Number}
 **/

realityEditor.device.utilities.randomIntInc = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};