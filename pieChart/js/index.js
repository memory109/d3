d3.csv('data.csv', type, function(data) {
    var width = 400,
        height = 400,
        margin = { left: 30, right: 30, top: 30, bottom: 30 };

    var svg = d3.select('#container')
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    var g = svg.append('g')
        .attr('transform', 'translate(200,200)');

    var arc = d3.arc()
        .innerRadius(100)
        .outerRadius(200);
    var arcData = d3.pie()
        .value(function(d) {
            return d.population;
        });
    console.log(arcData(data));
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    g.selectAll('path')
        .data(arcData(data))
        .enter()
        .append('path')
        .attr('d', arc)
        .style('fill', function(d, i) {
            return color(i);
        });
    g.selectAll('text')
        .data(arcData(data))
        .enter()
        .append('text')
        .text(function(d) {
            return d.data.education;
        })
        .attr('transform', function(d) {
            return 'translate(' + arc.centroid(d) + ')';
        })
        .attr('text-anchor','middle');
});

function type(d) {
    d.population = +d.population;
    return d;
}
