var width = 500,
    height = 250,
    margin = { left: 50, top: 20, right: 20, bottom: 20 },
    gWidth = width - margin.left - margin.right,
    gHeight = height - margin.top - margin.bottom;
//svg
var svg = d3.select('#container')
    .append('svg')
    //width height
    .attr('width', width) //attribute
    .attr('height', height);
var g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var data = [1, 3, 5, 9, 7, 6, 3];
var scaleX = d3.scaleLinear()
    .domain([0, data.length - 1])
    .range([0, gWidth]);
var scaleY = d3.scaleLinear()
    .domain([0, d3.max(data)])
    .range([gHeight, 0]);

var areaGenerator = d3.area()
    .x(function(d, i) {
        return scaleX(i); //0,1,2,3...
    })
    .y0(gHeight)
    .y1(function(d) {
        return scaleY(d); //3,56,30...
    })
    .curve(d3.curveBasis); //平滑曲线

g.append('path')
    .classed('areaPath', true)
    .attr('d', areaGenerator(data))

// var xAxis = d3.axisBottom(scaleX);
// var yAxis = d3.axisLeft(scaleY);
// g.append('g')
//     .call(xAxis)
//     .attr('transform', 'translate(0,' + gHeight + ')');
// g.append('g')
//     .call(yAxis)
//     .append('text')
//     .text('Price($)')
//     .attr('fill','black')
//     .attr('transform','rotate(-90)')
//     .attr('text-anchor','end')
//     .attr('dy','1.5em');
