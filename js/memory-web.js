// objectId: {
//   objectLinks: {},
//   objectValues: {}
// }

function createMemoryWeb() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    var nodes = Object.keys(objectExp).map(function(id) {
        return {id: id, name: objectExp[id].name};
    });

    var links = [];
    for (var linkId in objectExp.objectLinks) {
        links.push({
            source: objectLinks[linkId].ObjectA,
            target: objectLinks[linkId].ObjectB,
        });
    }


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
        .force('link', d3.forceLink().distance(200))
        .force('charge', d3.forceManyBody().strength(-500))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('sides', forceSides);

    var svg = d3.select('body').append('svg')
        .attr('width', width)
        .attr('height', height);

    force.nodes(nodes);

    force.force('link')
        .links(links);

    var link = svg.selectAll('.link')
        .data(links)
        .enter()
            .append('line')
            .attr('class', 'link');

    var node = svg.selectAll('.node')
        .data(nodes)
        .enter().append('rect')
            .attr('class', 'node')
            .attr('width', 100)
            .attr('height', 100)
            .attr('fill', '#00d1ff');

    node.on('mousedown', function(d) {
    });

    force.on('tick', function() {
        link.attr('x1', function(d) { return d.source.x; })
            .attr('y1', function(d) { return d.source.y; })
            .attr('x2', function(d) { return d.target.x; })
            .attr('y2', function(d) { return d.target.y; });

        node.attr('x', function(d) { return d.x - 50; })
            .attr('y', function(d) { return d.y - 50; });
    });
}
