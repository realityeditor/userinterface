/**
 * Memory Bar
 *
 * Allows user creation and selection of memories (images of objects that allow interaction).
 * Sends of://memorize and of://remember/?data=%d. Receives receiveThumbnail with
 * memory image thumbnail.
 */

(function(exports) {

var activeThumbnail = '';
var memories = [];
var pendingMemorizations = {};

function getBarElements() {
    return [].slice.call(document.querySelector('.memoryBar').querySelectorAll('.memory'));
}

function getElements() {
    return [].slice.call(document.querySelectorAll('.memory'));
}

function url(href) {
    return 'url(' + href + ')';
}

function clearBarMemory(elt) {
    elt.style.backgroundImage = 'none';
    delete elt.dataset.objectId;
}

function setMemory(element, obj) {
    var memory = {
        image: 'http://' + obj.ip + ':8080/obj/' + obj.name + '/memory/memory.jpg',
        matrix: obj.memory.matrix,
        id: obj.objectId
    };

    element.dataset.objectId = memory.id;
    memories[memory.id] = memory;

    var elements = getElements().filter(function(elt) {
        return elt.dataset.objectId === memory.id;
    });

    elements.forEach(function(elt) {
        elt.classList.add('memoryPlaceholder');
    });

    var preloadImage = document.createElement('img');
    preloadImage.onload = function() {
        elements.forEach(function(elt) {
            elt.style.backgroundImage = url(memory.image);
            elt.classList.remove('memoryPlaceholder');
        });
    };
    preloadImage.src = memory.image;
}

function addMemoryListeners(element) {
    element.addEventListener('pointerdown', onMemoryPointerDown);
    element.addEventListener('pointerup', onMemoryPointerUp);
    element.addEventListener('pointerenter', onMemoryPointerEnter);
}

function removeMemoryListeners(element) {
    element.removeEventListener('pointerdown', onMemoryPointerDown);
    element.removeEventListener('pointerup', onMemoryPointerUp);
    element.removeEventListener('pointerenter', onMemoryPointerEnter);
}

function initMemoryBar() {
    getBarElements().forEach(function(element) {
        addMemoryListeners(element);
    });

    overlayDiv.addEventListener('transitionend', onOverlayTransitionEnd);
}

function destroyMemoryBar() {
    getBarElements().forEach(function(element) {
        removeMemoryListeners(element);
    });

    overlayDiv.removeEventListener('transitionend', onOverlayTransitionEnd);
}

function remember(memoryElement) {
    var memory = memories[memoryElement.dataset.objectId];
    if (!memory) {
        return;
    }

    if (document.querySelector('.memoryWeb')) {
        destroyMemoryWeb();
    }

    var memoryBackground = document.querySelector('.memoryBackground');
    memoryBackground.style.backgroundImage = url(memory.image);
    window.location.href = 'of://remember/?data=' + encodeURIComponent(JSON.stringify(
        {id: memory.id, matrix: memory.matrix}
    ));
    if (!globalStates.UIOffMode) {
        document.getElementById('feezeButton').src = freezeButtonImage[2].src;
    }
    globalStates.feezeButtonState = true;
}


function onMemoryPointerUp(event) {
    if (activeThumbnail) {
        this.style.backgroundImage = url(activeThumbnail);
        this.classList.add('memoryPlaceholder');

        overlayDiv.style.backgroundImage = 'none';
        overlayDiv.classList.remove('overlayMemory');
        overlayDiv.style.visibility = 'hidden';
        activeThumbnail = '';
        var potentialObjects = Object.keys(globalObjects);
        if (potentialObjects.length !== 1) {
            console.warn('Memorization attempted with multiple objects');
            return;
        }
        pendingMemorizations[potentialObjects[0] || ''] = this;
        window.location.href = 'of://memorize';
        event.stopPropagation();
    }
}

function onMemoryPointerEnter(event) {
    if (!overlayDiv.classList.contains('overlayMemory')) {
        // We are drawing a connection or otherwise not caring about memories
        remember(this);
    }
}

function onMemoryPointerDown(event) {
    remember(this);
}

function onOverlayTransitionEnd(event) {
    if (overlayDiv.classList.contains('overlayMemory')) {
        window.location.href = 'of://createMemory';
    }
}

function receiveThumbnail(thumbnailUrl) {
    overlayDiv.style.backgroundImage = url(thumbnailUrl);
    activeThumbnail = thumbnailUrl;
}

function addObjectMemory(obj) {
    var freeMemory;
    if (pendingMemorizations.hasOwnProperty(obj.objectId)) {
        freeMemory = pendingMemorizations[obj.objectId];
        delete pendingMemorizations[obj.objectId];
    } else {
        freeMemory = getBarElements().filter(function(elt) {
            return !elt.dataset.objectId || elt.dataset.objectId === obj.objectId;
        })[0];

        if (!freeMemory) {
            console.warn('There are no free memory slots');
            return;
        }
    }

    getBarElements().forEach(function(elt) {
        if (elt.dataset.objectId === obj.objectId) {
            clearBarMemory(elt);
        }
    });

    setMemory(freeMemory, obj);
}

exports.initMemoryBar = initMemoryBar;
exports.destroyMemoryBar = destroyMemoryBar;
exports.receiveThumbnail = receiveThumbnail;
exports.addObjectMemory = addObjectMemory;
exports.setMemory = setMemory;
exports.addMemoryListeners = addMemoryListeners;
exports.removeMemoryListeners = removeMemoryListeners;

})(window);
