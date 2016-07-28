// objectId: {
//   objectLinks: {},
//   objectValues: {}
// }

(function(exports) {
var memoryElements = [];

function createMemoryWeb() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    var svg = d3.select('body').append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('class', 'memoryWeb');

    var nodes = Object.keys(objectExp).map(function(id) {
        return {id: id, obj: objectExp[id]};
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
        for (var linkId in obj.objectLinks) {
            links.push({
                source: obj.objectLinks[linkId].ObjectA,
                target: obj.objectLinks[linkId].ObjectB,
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

}(window));
