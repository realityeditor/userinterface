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
var button;
var uiButtons;


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
    bigTrashButton = document.getElementById('bigPocketButton');

    button.addEventListener('touchstart', function() {
        button.src = buttonImages[1].src;
    });

    ec++;
    button.addEventListener('touchend', function() {
        if (pocketShown()) {
            button.src = buttonImages[0].src
            element.classList.remove('pocketShown');
        } else {
            show();
        }
    });
    ec++;

    bigPocketButton.addEventListener('pointerenter', function() {
        show();
    });

    element = document.querySelector('.pocket');
}

function show() {
    element.classList.add('pocketShown');
    bigPocketButton.src = bigPocketImages[2].src;
    button.src = buttonImages[2].src
}

function hide() {
    element.classList.remove('pocketShown');
    bigPocketButton.src = bigPocketImages[0].src;
    button.src = buttonImages[0].src
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

exports.pocketInit = pocketInit;
exports.pocketShown = pocketShown;
exports.pocketOnMemoryCreationStart = pocketOnMemoryCreationStart;
exports.pocketOnMemoryCreationStop = pocketOnMemoryCreationStop;

}(window));
