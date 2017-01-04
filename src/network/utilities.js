realityEditor = realityEditor || {};
realityEditor.network = realityEditor.network || {};

realityEditor.network.utilities = {

    /**
     * @desc rename object[before] to object[after], deleting object[before]
     * @param {Object} object
     * @param {String} before
     * @param {String} after
     * @return {Object}
     **/

    rename : function(object, before, after) {
        if (typeof object[before] !== "undefined") {
            object[after] = object[before];
            delete object[before];
        }
    }
};
