d3.csv('data.csv', type, function(data) {
    console.log(data);
    var barWidth = 50,
        barPadding = 10,
        svgWidth = (barWidth + barPadding) * data.length,
        svgHeight = 500;

    var svg = d3.select('#container')
        .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight + barWidth)
        .attr('transform', 'translate(' + barWidth + ',' + barWidth + ')');

    var scaleY = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) {
                return d.population;
        })])
        .range([svgHeight, 0]);

    var bar = svg.selectAll('g')
        .data(data)
        .enter()
        .append('g')
        .attr('transform', function(d, i) {
            return 'translate(' + i * (barWidth + barPadding) + ',0)';
        });

    bar.append('rect')
        .attr('y', function(d) {
            return scaleY(d.population);
        })
        .attr('width', barWidth)
        .attr('height', function(d) {
            return svgHeight - scaleY(d.population);
        })
        .style('fill', 'steelblue');
    bar.append('text')
        .text(function(d) {
            return d.population;
        })
        .style('fill', 'black')
        .attr("y", function(d) {
            return scaleY(d.population);
        })
        .attr('x', barWidth / 2)
        .attr('dy', 15)
        .attr('text-anchor', 'middle');

});

function type(d) {
    d.population = +d.population;
    return d;
}
