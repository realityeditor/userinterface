(function(exports) {
var pointers = {};

var requestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame || function(cb) {setTimeout(cb, 17);};

/**
 * @constructor
 * @param {Object} link - Link object with information regarding connection
 * @param {Object} isObjectA - Whether this pointer is based on ObjectA or ObjectB
 * using it as a basis for its position.
 */
function MemoryPointer(link, isObjectA) {
    this.link = link;
    this.isObjectA = isObjectA;

    this.element = document.createElement('div');
    this.element.classList.add('memoryContainer');
    this.element.classList.add('memoryPointer');
    this.element.setAttribute('touch-action', 'none');

    document.querySelector('.memoryPointerContainer').appendChild(this.element);

    this.memory = new MemoryContainer(this.element); // TODO

    this.memory.set(this.getObject());
    this.x = 0;
    this.y = 0;
    this.alive = true;

    this.update = this.update.bind(this);
    this.update();

    pointers[this.getObject().objectId] = this;
}

MemoryPointer.prototype.getObject = function() {
    if (this.isObjectA) {
        return objects[this.link.objectA];
    } else {
        return objects[this.link.objectB];
    }
};

MemoryPointer.prototype.getConnectedObject = function() {
    if (this.isObjectA) {
        return objects[this.link.objectB];
    } else {
        return objects[this.link.objectA];
    }
};

MemoryPointer.prototype.getConnectedValue = function() {
    if (this.isObjectA) {
        return this.getConnectedObject().objectValues[this.link.nodeB];
    } else {
        return this.getConnectedObject().objectValues[this.link.nodeA];
    }
};

MemoryPointer.prototype.update = function() {
    var object = this.getObject();
    var connectedObject = this.getConnectedObject();
    if (!object || !connectedObject) {
        this.remove();
        return
    }
    if (object.objectVisible || !connectedObject.objectVisible) {
        this.remove();
        return;
    }
    if (globalStates.guiButtonState || globalStates.editingMode) {
        // Remove if no longer in connection-drawing mode
        this.remove();
        return;
    }

    requestAnimationFrame(this.update);
}

MemoryPointer.prototype.draw = function() {
    var connectedValue = this.getConnectedValue();
    this.x = connectedValue.screenX - 150;
    this.y = connectedValue.screenY - 50;
    this.element.style.transform = 'translate(' + this.x + 'px,' + this.y + 'px)';
};

MemoryPointer.prototype.remove = function() {
    this.alive = false;
    this.memory.remove();
    delete pointers[this.getObject().objectId];
};

function getMemoryPointerWithId(id) {
    if (pointers[id]) {
        return pointers[id];
    }
}

exports.MemoryPointer = MemoryPointer;
exports.getMemoryPointerWithId = getMemoryPointerWithId;
}(window));
