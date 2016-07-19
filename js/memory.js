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

function getElements() {
    return [].slice.call(document.querySelectorAll('.memory'));
}

function url(href) {
    return 'url(' + href + ')';
}

function clearMemory(index) {
    memories[index] = null;
    var element = getElements()[index];
    element.style.backgroundImage = 'none';
}

function setMemory(index, memory) {
    for (var i = 0; i < memories.length; i++) {
        if (memories[i] && memories[i].id === memory.id) {
            clearMemory(i);
        }
    }

    memories[index] = memory;
    var element = getElements()[index];

    var preloadImage = document.createElement('img');
    preloadImage.onload = function() {
        element.style.backgroundImage = url(memory.image);
        element.classList.remove('memoryPlaceholder');
    };
    preloadImage.src = memory.image;
}

function initMemoryBar() {
    getElements().forEach(function(memory) {
        memory.addEventListener('pointerdown', onMemoryPointerDown);
        memory.addEventListener('pointerup', onMemoryPointerUp);
        memory.addEventListener('pointerenter', onMemoryPointerEnter);
    });

    overlayDiv.addEventListener('transitionend', onOverlayTransitionEnd);
}

function destroyMemoryBar() {
    getElements().forEach(function(memory) {
        memory.removeEventListener('pointerdown', onMemoryPointerDown);
        memory.removeEventListener('pointerup', onMemoryPointerUp);
    });

    overlayDiv.removeEventListener('transitionend', onOverlayTransitionEnd);
}

function getMemoryIndex(memoryElement) {
    return [].slice.call(memoryElement.parentElement.children).indexOf(memoryElement);
}

function remember(memoryElement) {
    var i = getMemoryIndex(memoryElement)
    var memory = memories[i];
    if (!memory) {
        return;
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
        var index = getMemoryIndex(this);

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
        pendingMemorizations[potentialObjects[0] || ''] = index;
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
        for (freeMemory = 0; freeMemory < memories.length; freeMemory++) {
            if (memories[freeMemory]) {
                continue;
            }
            break;
        }
        if (freeMemory >= getElements().length) {
            console.warn('There are no free memory slots');
            return;
        }
    }

    setMemory(freeMemory, {
        image: 'http://' + obj.ip + ':8080/obj/' + obj.name + '/memory/memory.jpg',
        matrix: obj.memory.matrix,
        id: obj.objectId
    });
}

exports.initMemoryBar = initMemoryBar;
exports.destroyMemoryBar = destroyMemoryBar;
exports.receiveThumbnail = receiveThumbnail;
exports.addObjectMemory = addObjectMemory;

})(window);
