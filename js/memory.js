/**
 * Memory Bar
 *
 * Allows user creation and selection of memories (images of objects that allow interaction).
 * Sends of://memorize%d and of://remember%d. Receives receiveThumbnail with
 * memory image thumbnail.
 */
(function(exports) {
var activeThumbnail = '';

function initMemoryBar() {
    var memories = [].slice.call(document.querySelectorAll('.memory'));

    memories.forEach(function(memory) {
        memory.addEventListener('pointerdown', onMemoryPointerDown);
        memory.addEventListener('pointerup', onMemoryPointerUp);
        memory.addEventListener('pointerenter', onMemoryPointerEnter);
    });

    overlayDiv.addEventListener('transitionend', onOverlayTransitionEnd);
}

function destroyMemoryBar() {
    var memories = [].slice.call(document.querySelectorAll('.memory'));

    memories.forEach(function(memory) {
        memory.removeEventListener('pointerdown', onMemoryPointerDown);
        memory.removeEventListener('pointerup', onMemoryPointerUp);
    });

    overlayDiv.removeEventListener('transitionend', onOverlayTransitionEnd);
}

function getMemoryIndex(memoryElement) {
    return [].slice.call(memoryElement.parentElement.children).indexOf(memoryElement);
}

function remember(memoryElement) {
    window.location.href = 'of://remember' + getMemoryIndex(memoryElement);
    if (!globalStates.UIOffMode) {
        document.getElementById('feezeButton').src = freezeButtonImage[2].src;
    }
    globalStates.feezeButtonState = true;
}


function onMemoryPointerUp(event) {
    if (activeThumbnail) {
        this.style.background = 'url(' + activeThumbnail + ')';
        overlayDiv.style.background = '';
        activeThumbnail = '';
        window.location.href = 'of://memorize' + getMemoryIndex(this);
    }
}

function onMemoryPointerEnter(event) {
    if (!overlayDiv.classList.contains('overlayMemory')) {
        // We are drawing a connection or otherwise not caring about memories
        remember(this);
    }
}

function onMemoryPointerDown(event) {
    if (this.style.background) {
        remember(this);
    }
}

function onOverlayTransitionEnd(event) {
    if (overlayDiv.classList.contains('overlayMemory')) {
        window.location.href = 'of://createMemory';
    }
}

function receiveThumbnail(thumbnailUrl) {
    overlayDiv.style.background = 'url(' + thumbnailUrl + ')';
    activeThumbnail = thumbnailUrl;
}

exports.initMemoryBar = initMemoryBar;
exports.destroyMemoryBar = destroyMemoryBar;
exports.receiveThumbnail = receiveThumbnail;

})(window);
