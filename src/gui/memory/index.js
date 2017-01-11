/**
 * @preserve
 *
 *                                      .,,,;;,'''..
 *                                  .'','...     ..',,,.
 *                                .,,,,,,',,',;;:;,.  .,l,
 *                               .,',.     ...     ,;,   :l.
 *                              ':;.    .'.:do;;.    .c   ol;'.
 *       ';;'                   ;.;    ', .dkl';,    .c   :; .'.',::,,'''.
 *      ',,;;;,.                ; .,'     .'''.    .'.   .d;''.''''.
 *     .oxddl;::,,.             ',  .'''.   .... .'.   ,:;..
 *      .'cOX0OOkdoc.            .,'.   .. .....     'lc.
 *     .:;,,::co0XOko'              ....''..'.'''''''.
 *     .dxk0KKdc:cdOXKl............. .. ..,c....
 *      .',lxOOxl:'':xkl,',......'....    ,'.
 *           .';:oo:...                        .
 *                .cd,      ╔═╗┌┬┐┬┌┬┐┌─┐┬─┐    .
 *                  .l;     ║╣  │││ │ │ │├┬┘    '
 *                    'l.   ╚═╝─┴┘┴ ┴ └─┘┴└─   '.
 *                     .o.                   ...
 *                      .''''','.;:''.........
 *                           .'  .l
 *                          .:.   l'
 *                         .:.    .l.
 *                        .x:      :k;,.
 *                        cxlc;    cdc,,;;.
 *                       'l :..   .c  ,
 *                       o.
 *                      .,
 *
 *      ╦═╗┌─┐┌─┐┬  ┬┌┬┐┬ ┬  ╔═╗┌┬┐┬┌┬┐┌─┐┬─┐  ╔═╗┬─┐┌─┐ ┬┌─┐┌─┐┌┬┐
 *      ╠╦╝├┤ ├─┤│  │ │ └┬┘  ║╣  │││ │ │ │├┬┘  ╠═╝├┬┘│ │ │├┤ │   │
 *      ╩╚═└─┘┴ ┴┴─┘┴ ┴  ┴   ╚═╝─┴┘┴ ┴ └─┘┴└─  ╩  ┴└─└─┘└┘└─┘└─┘ ┴
 *
 *
 * Created by Valentin on 10/22/14.
 *
 * Copyright (c) 2016 James Hobin
 * Modified by Valentin Heun 2016, 2017
 * Modified by James Hobin 2016, 2017
 * Modified by Benjamin Reynholds 2016, 2017
 *
 * All ascii characters above must be included in any redistribution.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * Memory Bar
 *
 * Allows user creation and selection of memories (images of objects that allow interaction).
 * Sends of://memorize and of://remember/?data=%d. Receives receiveThumbnail with
 * memory image thumbnail.
 */

createNameSpace("realityEditor.gui.memory");

(function(exports) {
    var imageCache = {};

    function MemoryContainer(element) {
        this.element = element;
        this.image = null;
        this.backgroundImage = null;
        this.memory = null;
        this.dragging = false;
        this.dragTimer = null;

        this.onPointerUp = this.onPointerUp.bind(this);
        this.onPointerEnter = this.onPointerEnter.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);

        this.element.addEventListener('pointerup', this.onPointerUp);
        this.element.addEventListener('pointerenter', this.onPointerEnter);
    }

    MemoryContainer.prototype.set = function(obj) {
        this.obj = obj;
        var urlBase = 'http://' + obj.ip + ':8080/obj/' + obj.name + '/memory/';
        var image = urlBase + 'memory.jpg';

        this.backgroundImage = document.createElement('img');
        this.backgroundImage.classList.add('memoryBackgroundImage');
        this.backgroundImage.setAttribute('touch-action', 'none');
        this.backgroundImage.src = image;

        var thumbnail = urlBase + 'memoryThumbnail.jpg';

        this.memory = {
            id: obj.objectId,
            image: image,
            thumbnail: thumbnail,
            matrix: obj.memory.matrix
        };
        this.element.dataset.objectId = this.memory.id;


        if (!this.image) {
            var cachedImage = imageCache[thumbnail];
            if (cachedImage && !cachedImage.parentNode && cachedImage.src === thumbnail) {
                this.image = cachedImage;
                this.createImage();
            } else {
                this.createImage();
                this.image.src = thumbnail;
            }
        }

        imageCache[thumbnail] = this.image;
    };

    MemoryContainer.prototype.clear = function() {
        this.obj = null;
        this.memory = null;
        this.removeImage();
        delete this.element.dataset.objectId;
    };

    MemoryContainer.prototype.removeImage = function() {
        this.image.removeEventListener('touchstart', this.onTouchStart);
        this.image.removeEventListener('touchmove', this.onTouchMove);
        this.image.removeEventListener('touchend', this.onTouchEnd);
        this.image.removeEventListener('pointerenter', this.onPointerEnter);
        this.image.parentNode.removeChild(this.image);
        this.image = null;
    };

    MemoryContainer.prototype.onTouchStart = function(event) {
        this.lastTouch = {
            left: event.touches[0].clientX,
            top: event.touches[0].clientY
        };

        this.dragTimer = setTimeout(function() {
            this.startDragging();
        }.bind(this), 100);
    };

    MemoryContainer.prototype.startDragging = function() {
        if (!this.memory) {
            return;
        }
        this.dragging = true;

        var rect = this.image.getBoundingClientRect();
        this.image.classList.add('memoryDragging');
        this.image.style.transform = 'translate(' + rect.left + 'px,' + rect.top + 'px)';

        this.image.parentNode.removeChild(this.image);
        document.querySelector('.memoryDragContainer').appendChild(this.image);

        this.dragDelta = {
            top: rect.top - this.lastTouch.top,
            left: rect.left - this.lastTouch.left
        };

        var isBar = barContainers.indexOf(this) >= 0;

        if (isBar) {
            realityEditor.gui.pocket.pocketOnMemoryDeletionStart();
        } else {
            realityEditor.gui.pocket.pocketOnMemoryCreationStart();
        }
    };

    MemoryContainer.prototype.onTouchMove = function() {
        var touch = {
            left: event.touches[0].clientX,
            top: event.touches[0].clientY
        };

        if (this.dragging) {
            var top = touch.top + this.dragDelta.top + 'px';
            var left = touch.left + this.dragDelta.left + 'px';
            this.image.style.transform = 'translate(' + left + ',' + top + ')';
        }
    };

    MemoryContainer.prototype.stopDragging = function() {
        if (!this.dragging) {
            return;
        }
        this.dragging = false;

        var isBar = barContainers.indexOf(this) >= 0;

        if (isBar) {
            realityEditor.gui.pocket.pocketOnMemoryDeletionStop();
        } else {
            realityEditor.gui.pocket.pocketOnMemoryCreationStop();
        }

        var imageRect = this.image.getBoundingClientRect();

        this.image.style.transform = '';
        this.image.classList.remove('memoryDragging');
        this.image.parentNode.removeChild(this.image);
        this.element.appendChild(this.image);

        if (isBar) {
            var rightMostContainer = barContainers[barContainers.length - 1];
            if (imageRect.left - this.dragDelta.left > rightMostContainer.element.getBoundingClientRect().right) {
                this.clear();
                return;
            }
        }

        var containerRect = this.element.getBoundingClientRect();

        if (isBar) {
            // Move requested
            if (imageRect.right < containerRect.left || imageRect.left > containerRect.right) {
                var newContainer = getBarContainerAtLeft(imageRect.left);
                if (newContainer) {
                    newContainer.set(this.obj);
                    this.clear();
                }
            }
        } else {
            // Move into bar
            if (imageRect.top < memoryBarHeight) {
                var newContainer = getBarContainerAtLeft(imageRect.left);
                if (newContainer) {
                    newContainer.set(this.obj);
                }
            } else {
                // Didn't move into bar, pocket should close
                realityEditor.gui.pocket.pocketHide();
            }
        }
    };

    MemoryContainer.prototype.onPointerUp = function() {
        if (this.dragTimer) {
            clearTimeout(this.dragTimer);
            this.dragTimer = null;
        }

        if (activeThumbnail) {
            if (!this.image) {
                this.createImage();
            }
            this.image.src = activeThumbnail;

            overlayDiv.style.backgroundImage = 'none';
            overlayDiv.classList.remove('overlayMemory');
            overlayDiv.classList.remove('overlayMemoryInstant');
            overlayDiv.style.visibility = 'hidden';
            activeThumbnail = '';
            var potentialObjects = Object.keys(globalObjects);
            if (potentialObjects.length !== 1) {
                console.warn('Memorization attempted with multiple objects');
            } else {
                var objId = potentialObjects[0];
                barContainers.forEach(function(container) {
                    if (container.memory && container.memory.id === objId) {
                        container.clear();
                    }
                });

                pendingMemorizations[objId || ''] = this;
                window.location.href = 'of://memorize';
                event.stopPropagation();
            }
            realityEditor.gui.pocket.pocketOnMemoryCreationStop();
        } else if (this.dragging) {
            return;
        } else {
            this.remember();
        }
    };

    MemoryContainer.prototype.onPointerEnter = function() {
        if (overlayDiv.classList.contains('overlayMemory')) {
            return;
        }
        if (this.dragTimer) {
            return;
        }
        this.remember();
    };

    MemoryContainer.prototype.onTouchEnd = function() {
        // Defer stopping to the next event loop when onPointerUp will have already
        // occurred.
        setTimeout(function() {
            this.stopDragging();
        }.bind(this), 0);
    };


    MemoryContainer.prototype.remember = function() {
        if (!this.memory && !this.image) {
            return;
        }

        if (document.querySelector('.memoryWeb')) {
            removeMemoryWeb();
        }

        realityEditor.gui.pocket.pocketHide();

        var memoryBackground = document.querySelector('.memoryBackground');
        memoryBackground.innerHTML = '';
        memoryBackground.appendChild(this.backgroundImage);

        var href = 'of://remember/';

        if (this.memory) {
            href += '?data=' + encodeURIComponent(JSON.stringify(
                    {id: this.memory.id, matrix: this.memory.matrix}
                ));
        }

        window.location.href = href;

        document.getElementById('freezeButton').src = freezeButtonImage[2].src;
        globalStates.freezeButtonState = true;
    };

    MemoryContainer.prototype.remove = function() {
        this.element.parentNode.removeChild(this.element);
        this.element.removeEventListener('pointerup', this.onPointerUp);
        this.element.removeEventListener('pointerenter', this.onPointerEnter);
        this.removeImage();
    };

    MemoryContainer.prototype.createImage = function() {
        if (!this.image) {
            this.image = document.createElement('img');
        }
        if (!this.image.parentNode) {
            this.element.appendChild(this.image);
        }
        this.image.setAttribute('touch-action', 'none');
        this.image.classList.add('memory');
        this.image.addEventListener('touchstart', this.onTouchStart);
        this.image.addEventListener('touchmove', this.onTouchMove);
        this.image.addEventListener('touchend', this.onTouchEnd);
        this.image.addEventListener('pointerenter', this.onPointerEnter);

    };


    var activeThumbnail = '';
    var barContainers = [];
    var pendingMemorizations = {};
    var memoryBarHeight = 80;

    function getBarContainerAtLeft(left) {
        // Assumes bar containers are in order of DOM insertion
        for (var i = 0; i < barContainers.length; i++) {
            var barContainer = barContainers[i];
            var barRect = barContainer.element.getBoundingClientRect();
            if (left > barRect.left && left < barRect.right) {
                return barContainer;
            }
        }
        return null;
    }

    function url(href) {
        return 'url(' + href + ')';
    }

    function initMemoryBar() {
        var memoryBar = document.querySelector('.memoryBar');
        for (var i = 0; i < 6; i++) {
            var memoryContainer = document.createElement('div');
            memoryContainer.classList.add('memoryContainer');
            memoryContainer.setAttribute('touch-action', 'none');
            memoryBar.appendChild(memoryContainer);

            var container = new MemoryContainer(memoryContainer);
            barContainers.push(container);
        }

        overlayDiv.addEventListener('transitionend', onOverlayTransitionEnd);
    }

    function removeMemoryBar() {
        barContainers.forEach(function(container) {
            container.remove();
        });
        barContainers = [];

        overlayDiv.removeEventListener('transitionend', onOverlayTransitionEnd);
    }

    function onOverlayTransitionEnd(event) {
        if (overlayDiv.classList.contains('overlayMemory')) {
            window.location.href = 'of://createMemory';
            realityEditor.gui.pocket.pocketOnMemoryCreationStart();
        }
    }

    function receiveThumbnail(thumbnailUrl) {
        if (overlayDiv.classList.contains('overlayMemory')) {
            overlayDiv.style.backgroundImage = url(thumbnailUrl);
            activeThumbnail = thumbnailUrl;
        }
    }

    function addObjectMemory(obj) {
        if (!obj.memory || Object.keys(obj.memory).length === 0) {
            return;
        }

        var freeMemory;
        if (pendingMemorizations.hasOwnProperty(obj.objectId)) {
            freeMemory = pendingMemorizations[obj.objectId];
            delete pendingMemorizations[obj.objectId];
        } else {
            freeMemory = barContainers.filter(function(container) {
                // Container either doesn't have a memory or the memory is of this object
                return !container.memory || container.memory.id === obj.objectId;
            })[0];

            if (!freeMemory) {
                console.warn('There are no free memory slots');
                return;
            }
        }

        barContainers.forEach(function(container) {
            if (container.memory && container.memory.id === obj.objectId) {
                container.clear();
            }
        });

        freeMemory.set(obj);
    }

    function getMemoryWithId(id) {
        for (var i = 0; i < barContainers.length; i++) {
            var barContainer = barContainers[i];
            if (barContainer.memory && barContainer.memory.id === id) {
                return barContainer;
            }
        }
        return null;
    }

    function memoryCanCreate() {
        // Exactly one visible object
        if (Object.keys(globalObjects).length !== 1 || typeof globalObjects.dummy !== 'undefined') {
            return false;
        }
        // User is in ui mode
        if (globalStates.guiState !== 'ui') {
            return false;
        }
        if (globalStates.freezeButtonState) {
            return false;
        }
        if (realityEditor.gui.pocket.pocketShown()) {
            return false;
        }
        return true;
    }

    exports.initMemoryBar = initMemoryBar;
    exports.removeMemoryBar = removeMemoryBar;
    exports.receiveThumbnail = receiveThumbnail;
    exports.addObjectMemory = addObjectMemory;
    exports.MemoryContainer = MemoryContainer;
    exports.getMemoryWithId = getMemoryWithId;
    exports.memoryCanCreate = memoryCanCreate;

}(realityEditor.gui.memory));

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

        var globalIndex = Object.keys(objects).indexOf(this.getObject().objectId);
        var theta = 2 * Math.PI * globalIndex / Object.keys(objects).length;
        this.offsetX = Math.cos(theta) * 20;
        this.offsetY = Math.sin(theta) * 20;

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
        var cvX = connectedValue.screenX || 0;
        var cvY = connectedValue.screenY || 0;
        var cvZ = connectedValue.screenLinearZ || 10;
        var scale = cvZ / 10;

        var deltaX = cvX - this.offsetX * cvZ - this.x;
        var deltaY = cvY - this.offsetY * cvZ - this.y;
        var alpha = 0.66;
        this.x += deltaX * alpha;
        this.y += deltaY * alpha;
        this.element.style.transform = 'translate3d(' + this.x + 'px,' + this.y + 'px, 2px) scale(' + scale + ')';
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
}(realityEditor.gui.memory));

(function(exports) {
    var memoryElements = [];

    function createMemoryWeb() {
        var width = window.innerWidth;
        var height = window.innerHeight;

        var svg = d3.select('body').append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('class', 'memoryWeb');

        var nodes = Object.keys(objects).map(function(id) {
            return {id: id, obj: objects[id]};
        }).filter(function(node) {
            return node.obj.memory;
        });

        var container = document.createElement('div');
        container.classList.add('memoryWeb');
        document.body.appendChild(container);

        var memoryElements = nodes.map(function(node) {
            var objectId = node.id;
            var element = document.createElement('div');
            element.classList.add('memoryContainer');
            element.setAttribute('touch-action', 'none');
            // TODO: possible FOUC
            container.appendChild(element);
            var memoryContainer = new MemoryContainer(element);
            memoryContainer.set(node.obj);
            return memoryContainer;
        });

        var links = [];
        nodes.forEach(function(node) {
            var obj = node.obj;
            for (var linkId in obj.links) {
                links.push({
                    source: obj.links[linkId].objectA,
                    target: obj.links[linkId].objectB,
                });
            }
        });

        function forceSides(alpha) {
            var tol = 55;
            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                if (node.x < tol) {
                    node.x = tol;
                }
                if (node.y < tol) {
                    node.y = tol;
                }
                if (node.x > width - tol) {
                    node.x = width - tol;
                }
                if (node.y > height - tol) {
                    node.y = height - tol;
                }
            }
        }

        var force = d3.forceSimulation()
            .force('link', d3.forceLink().distance(200).id(function(d) { return d.id; }))
            .force('charge', d3.forceManyBody().strength(-500))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('sides', forceSides);


        force.nodes(nodes);

        force.force('link')
            .links(links);

        var link = svg.selectAll('.link')
            .data(links)
            .enter()
            .append('line')
            .attr('class', 'link')
            .attr('stroke', '#01fffc');

        force.on('tick', function() {
            link.attr('x1', function(d) { return d.source.x; })
                .attr('y1', function(d) { return d.source.y; })
                .attr('x2', function(d) { return d.target.x; })
                .attr('y2', function(d) { return d.target.y; });

            for (var i = 0; i < nodes.length; i++) {
                memoryElements[i].element.style.left = nodes[i].x;
                memoryElements[i].element.style.top = nodes[i].y;
            }
        });
    }

    function removeMemoryWeb() {
        memoryElements.forEach(function(element) {
            element.remove();
        });
        var webs = [].slice.call(document.querySelectorAll('.memoryWeb'));
        webs.forEach(function(web) {
            web.parentNode.removeChild(web);
        });
        document.getElementById('memoryWebButton').src = memoryWebButtonImage[0].src
    }

    exports.createMemoryWeb = createMemoryWeb;
    exports.removeMemoryWeb = removeMemoryWeb;

}(realityEditor.gui.memory));
