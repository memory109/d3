var data = [1, -4, 7, 2, 9, 13, 5, 8, 2, 9],
    barHeight = 50,
    barPadding = 10,
    svgHeight = (barHeight + barPadding) * data.length,
    svgWidth = 500;

var svg = d3.select('#container')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);
var scale = d3.scaleLinear()
    .domain([0, d3.max(data)])
    .range([0, svgWidth]);

var bar = svg.selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .attr('transform', function(d, i) {
        return 'translate(0,' + i * (barHeight + barPadding) + ')';
    });

bar.append('rect')
    .attr('width', function(d) {
        if (d < 0) {
            d = 0;
        }
        return scale(d);
    })
    .attr('height', barHeight)
    .style('fill', 'steelblue');
bar.append('text')
    .text(function(d) {
        return d;
    })
    .style('fill', 'black')
    .attr("x", function(d) {
        return scale(d);
    })
    .attr('y', barHeight / 2)
    .attr('text-anchor', 'end');
