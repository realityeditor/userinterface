/**
 * The Pocket button. Turns into a larger version or a delete button when
 * the user is creating memories or when the user is dragging saved
 * memories/programming blocks, respectively.
 *
 * Functions expected to be invoked globally are prefixed with "pocket"
 */
(function(exports) {

var buttonImages = [];
var bigPocketImages = [];
var bigTrashImages = [];
var element;
var uiButtons;
var button;
var bigPocketButton;
var bigTrashButton;
var pointerOverPocketButton = false;

function pocketInit() {
    preload(buttonImages,
        'png/pocket.png', 'png/pocketOver.png', 'png/pocketSelect.png', 'png/pocketEmpty.png'
    );
    preload(bigPocketImages,
        'png/bigPocket.png', 'png/bigPocketOver.png', 'png/bigPocketSelect.png', 'png/bigPocketEmpty.png'
    );
    preload(bigTrashImages,
        'png/bigTrash.png', 'png/bigTrashOver.png', 'png/bigTrashSelect.png', 'png/bigTrashEmpty.png'
    );

    uiButtons = document.getElementById('UIButtons');

    button = document.getElementById('pocketButton');
    bigPocketButton = document.getElementById('bigPocketButton');
    bigTrashButton = document.getElementById('bigTrashButton');

    button.addEventListener('pointerenter', function() {
        if (!pointerOverPocketButton) {
            toggleShown();
        }
        pointerOverPocketButton = true;
        // Show hover
        button.src = buttonImages[1].src;

        if (pocketShown() && !overlayDiv.classList.contains('overlayMemory')) {
            overlayDiv.classList.add('overlayMemoryInstant');
            overlayDiv.classList.add('overlayMemory');
        }
    });
    ec++;

    button.addEventListener('pointerleave', function() {
        if (!uiButtons.classList.contains('bigPocket')) {
            pointerOverPocketButton = false;
        }
        // Undo the hover state
        updateButtons();
    });
    ec++;

    bigPocketButton.addEventListener('pointerenter', function() {
        if (!pointerOverPocketButton) {
            toggleShown();
        }
        pointerOverPocketButton = true;
        bigPocketButton.src = bigPocketImages[1].src;
    });
    ec++;

    bigPocketButton.addEventListener('pointerleave', function() {
        if (uiButtons.classList.contains('bigPocket')) {
            pointerOverPocketButton = false;
        }
        // Undo the hover state
        updateButtons();
    });
    ec++;

    element = document.querySelector('.pocket');
}

function toggleShown() {
    if (pocketShown()) {
        pocketHide();
    } else {
        pocketShow();
    }
}


function pocketShow() {
    element.classList.add('pocketShown');
    updateButtons();
}

function pocketHide() {
    element.classList.remove('pocketShown');
    updateButtons();
}

function updateButtons() {
    if (pocketShown()) {
        button.src = buttonImages[2].src
        bigPocketButton.src = bigPocketImages[2].src;
        bigTrashButton.src = bigTrashImages[2].src;
    } else {
        button.src = buttonImages[0].src
        bigPocketButton.src = bigPocketImages[0].src;
        bigTrashButton.src = bigTrashImages[0].src;
    }
}

function pocketShown() {
    return element.classList.contains('pocketShown');
}

function pocketOnMemoryCreationStart() {
    uiButtons.classList.add('bigPocket');
    bigPocketButton.src = bigPocketImages[0].src;
}

function pocketOnMemoryCreationStop() {
    uiButtons.classList.remove('bigPocket');
}

function pocketOnMemoryDeletionStart() {
    uiButtons.classList.add('bigTrash');
    bigTrashButton.src = bigTrashImages[0].src;
}

function pocketOnMemoryDeletionStop() {
    uiButtons.classList.remove('bigTrash');
}

exports.pocketInit = pocketInit;
exports.pocketShown = pocketShown;
exports.pocketShow = pocketShow;
exports.pocketHide = pocketHide;
exports.pocketOnMemoryCreationStart = pocketOnMemoryCreationStart;
exports.pocketOnMemoryCreationStop = pocketOnMemoryCreationStop;
exports.pocketOnMemoryDeletionStart = pocketOnMemoryDeletionStart;
exports.pocketOnMemoryDeletionStop = pocketOnMemoryDeletionStop;

}(window));
