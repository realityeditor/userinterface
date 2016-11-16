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

    var globalIndex = Object.keys(objects).indexOf(object.objectId);
    var theta = 2 * Math.PI * globalIndex / Object.keys(objects).length;
    this.offsetX = Math.cos(theta) * 150;
    this.offsetY = Math.sin(theta) * 150;

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
        return this.getConnectedObject().nodes[this.link.nodeB];
    } else {
        return this.getConnectedObject().nodes[this.link.nodeA];
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
    if (globalStates.guiState !== 'node') {
        // Remove if no longer in connection-drawing mode
        this.remove();
        return;
    }

    requestAnimationFrame(this.update);
}

MemoryPointer.prototype.draw = function() {
    var connectedValue = this.getConnectedValue();
    var deltaX = connectedValue.screenX - this.offsetX - this.x;
    var deltaY = connectedValue.screenY - this.offsetY - this.y;
    var alpha = 0.5;
    this.x += deltaX * alpha;
    this.y += deltaY * alpha;
    this.element.style.transform = 'translate(' + this.x + 'px,' + this.y + 'px)';
};

MemoryPointer.prototype.remove = function() {
    this.alive = false;
    this.memory.remove();
    delete pointers[this.getObject().objectId];
};

function getMemoryPointerWithId(id) {
    return pointers[id];
}

exports.MemoryPointer = MemoryPointer;
exports.getMemoryPointerWithId = getMemoryPointerWithId;
}(window));
