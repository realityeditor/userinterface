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

function onMemoryPointerUp(event) {
    console.log('onMemoryPointerUp');
    console.log(event);
    console.log(this);

    if (activeThumbnail) {
        this.style.background = 'url(' + activeThumbnail + ')';
        overlayDiv.style.background = '';
        activeThumbnail = '';
        window.location.href = 'of://memorize' + getMemoryIndex(this);
    }
}

function onMemoryPointerDown(event) {
    console.log('onMemoryPointerDown');
    console.log(event);
    console.log(this);
    if (this.style.background) {
        window.location.href = 'of://remember' + getMemoryIndex(this);
    }
}

function onOverlayTransitionEnd(event) {
    console.log('transitionhasended');
    if (overlayDiv.classList.contains('overlayMemory')) {
        window.location.href = 'of://getThumbnail';
    }
}

function receiveThumbnail(thumbnailUrl) {
    console.log('receiving thumbnail');
    overlayDiv.style.background = 'url(' + thumbnailUrl + ')';
    activeThumbnail = thumbnailUrl;
}

exports.initMemoryBar = initMemoryBar;
exports.destroyMemoryBar = destroyMemoryBar;
exports.receiveThumbnail = receiveThumbnail;

})(window);
