var data = [1, 400, 7, 2, 960, 13, 5, 8, 2, 9],
    barWidth = 50,
    barPadding = 10,
    svgWidth = (barWidth + barPadding) * data.length,
    svgHeight = 500;

var svg = d3.select('#container')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight + barWidth)
    .attr('transform', 'translate(' + barWidth + ',' + barWidth + ')');

var scaleX = d3.scaleLinear()
    .domain([0, data.length - 1])
    .range([0, svgWidth]);

var scaleY = d3.scaleLinear()
    .domain([0, d3.max(data)])
    .range([svgHeight, 0]);

var bar = svg.selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .attr('transform', function(d, i) {
        return 'translate(' + i * (barWidth + barPadding) + ',0)';
    });

// bar.append('rect')
//     .attr('y', function(d) {
//         return scaleY(d);
//     })
//     .attr('width', barWidth)
//     .attr('height', function(d) {
//         return svgHeight - scaleY(d);
//     })
//     .style('fill', 'steelblue');
// bar.append('text')
//     .text(function(d) {
//         return d;
//     })
//     .style('fill', 'black')
//     .attr("y", function(d) {
//         return scaleY(d);
//     })
//     .attr('x', barWidth / 2)
//     .attr('dy', 15)
//     .attr('text-anchor', 'middle');


svg.append('g')
    .call(d3.axisBottom(scaleX))
    .attr('transform', 'translate(20,' + svgHeight + ')')
    .attr('text-anchor', 'end');
svg.append('g')
    .call(d3.axisLeft(scaleY))
    .attr('transform', 'translate(' + barPadding * 2 + ',0)');
