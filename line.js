psdbs.drawLine = function() {
    var container = $('.line-content');
    var drawLineDur = psdbs.configData.drawLineDur,
        drawLineInterval = psdbs.configData.drawLineInterval;

    var svgWidth = container.width(),
        svgHeight = container.height();

    var contentWidth = svgWidth - 160,
        contentHeight = svgHeight - 100;

    var leftMove = 80,
        topMove = 20;

    var svg = d3.select('.line-content')
        .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    svg.append('text')
        .text('(万)')
        .attr('x', 50)
        .attr('y', (contentHeight + 50))
        .style('fill', '#fff');

    var colorGradient = svg.append('defs')
        .append('linearGradient')
        .attr('id', 'areaColorGradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%')
        .attr('spreadMethod', 'pad');
    colorGradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', 'rgb(226, 70, 118)')
        .attr('stop-opacity', '0.2');
    colorGradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', 'rgb(226, 70, 118)')
        .attr('stop-opacity', '0');

    //横坐标
    var xAxisTicks = [];
    var startTime = psdbs.configData.startTime;
    var hAxis = parseInt(startTime.split(':')[0]),
        mAxis = parseInt(startTime.split(':')[1]);
    for (var i = 0; i < 30; i++) {
        if (mAxis < 10) {
            var string = hAxis + ':0' + mAxis;
        } else {
            var string = hAxis + ':' + mAxis;
        }

        if (mAxis === 59) {
            hAxis++;
            mAxis = 0;
        } else {
            mAxis++;
        }
        if (hAxis === 24) {
            hAxis = 0;
        }
        xAxisTicks.push(string);
    }
    //x轴比例尺
    var xAxisScale = d3.scaleBand()
        .domain(xAxisTicks)
        .rangeRound([0, contentWidth])
        .paddingInner([0.3])
        .paddingOuter([0.3]);
    //x轴
    var xAxis = d3.axisBottom(xAxisScale)
        .tickSizeInner([0])
        .tickSizeOuter([0])
        .tickPadding([10]);
    //添加坐标轴
    //svg.append('g')
    //.classed('axis-container xaxis', true)
    //    .attr('transform', 'translate(' + leftMove + ', ' + (contentHeight + topMove) + ')')
    //    .call(xAxis);
    svg.append("g")
        .classed('axis-container xaxis', true)
        .attr('transform', 'translate(' + leftMove + ', ' + (contentHeight + topMove) + ')')
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "2.8em")
        .attr("dy", ".95em")
        .attr("transform", function(d) {
            return "rotate(45)"
        });
    // 垂直方向的比例尺
    var yScale = d3.scaleLinear()
        .domain([0, 12000])
        .range([0, contentHeight]);
    // y轴比例尺--柱状图
    var yAxisScaleLine = d3.scaleLinear()
        .domain([0, 12000])
        .rangeRound([contentHeight, 0])
        .nice();

    // y轴--柱状图
    var yAxis = d3.axisLeft(yAxisScaleLine)
        .tickSizeInner([0])
        .tickSizeOuter([0])
        .ticks(6, "f")
        .tickPadding([10]);

    svg.append('g')
        .classed('axis-container yaxis', true)
        .attr('transform', 'translate(' + leftMove + ', ' + topMove + ')')
        .call(yAxis);

    //添加水平分割线
    var ticks = [0, 2000, 4000, 6000, 8000, 10000, 12000];
    var horizentalLineContainer = svg.append('g')
        .classed('horizental-line-container', true);

    horizentalLineContainer.selectAll('line')
        .data(ticks)
        .enter()
        .append('line')
        .classed('horizental-line', true)
        .attr('x1', leftMove)
        .attr('x2', (leftMove + contentWidth))
        .attr('y1', function(d, i) {
            return yAxisScaleLine(d) + topMove;
        })
        .attr('y2', function(d, i) {
            return yAxisScaleLine(d) + topMove;
        });
    //添加线的点
    horizentalLineContainer.selectAll('circle')
        .data(ticks)
        .enter()
        .append('circle')
        .attr('cx', (leftMove + 2))
        .attr('cy', function(d, i) {
            return yAxisScaleLine(d) + topMove;
        })
        .attr('r', 4)
        .style('fill', '#fff');


    //添加奇数位的垂直线
    var verticalLineContainer = svg.append('g')
        .classed('vertical-line-container', true);
    verticalLineContainer.selectAll('line')
        .data(xAxisTicks)
        .enter()
        .append('line')
        .classed('vertical-line', true)
        .classed('even', function(d, i) {
            return i % 2 == 1;
        })
        .attr('x1', function(d, i) {
            return xAxisScale(d) + leftMove + xAxisScale.bandwidth() / 2;
        })
        .attr('y1', (contentHeight + topMove))
        .attr('x2', function(d, i) {
            return xAxisScale(d) + leftMove + xAxisScale.bandwidth() / 2;
        })
        .attr('y2', (topMove));

    //添加垂直背景色
    verticalLineContainer.selectAll('rect')
        .data(xAxisTicks)
        .enter()
        .append('rect')
        .classed('vertical-bg', true)
        .classed('even', function(d, i) {
            return i % 2 == 1;
        })
        .attr('width', xAxisScale.step())
        .attr('height', contentHeight)
        .attr('x', function(d, i) {
            return xAxisScale(d) + leftMove + xAxisScale.bandwidth() / 2;
        })
        .attr('y', topMove);


    //划线
    var lineDataset = psdbs.configData.startLineNum;
    var linePathContainer = svg.append('g')
        .classed('line-path-container', true);
    linePathContainer.append('path')
        .classed('line-path', true)
        .style('animation-duration', drawLineDur + 'ms')
        .attr('stroke', '#E24676')
        .attr('stroke-width', '4px')
        .attr('fill', 'none')
        .attr('d', getLinePoints())
        .style('stroke-dashoffset', function() {
            return this.getTotalLength();
        })
        .style('stroke-dasharray', function() {
            return this.getTotalLength();
        });

    addToolTipsTrigger(); //增加触发鼠标悬浮的区域

    //画面积
    d3.timeout(drawLineArea, drawLineDur);
    d3.timeout(reDrawLine, drawLineInterval + drawLineDur);
    var linearea;

    function drawLineArea() {
        if (svg.select('.line-area')) {
            svg.select('.line-area').remove();
        }
        linearea = svg.select('g.line-path-container')
            .append('path')
            .classed('line-area', true)
            .style('fill', 'url(#areaColorGradient)')
            .attr('d', getAreaPath(0));

        linearea.transition()
            .duration([800])
            .attr('d', getAreaPath(1));
        /*.on('end', function() {
            dispatch.call('areaDone');
        })*/
    }

    function getLinePoints() {
        var line = d3.line()
            .x(function(d, i) {
                return xAxisScale(xAxisTicks[i]) + leftMove + xAxisScale.bandwidth() * 0.5;
            })
            .y(function(d, i) {
                return yAxisScaleLine(d) + topMove;
            })
            .curve(d3.curveMonotoneX);
        return line(lineDataset);
    }

    function getAreaPath(state) {
        var area = d3.area()
            .x(function(d, i, arr) {
                if (i == 0) {
                    return xAxisScale(xAxisTicks[i]) + leftMove + xAxisScale.bandwidth() * 0.5;
                } else if (i == arr.length - 1) {
                    return xAxisScale(xAxisTicks[i]) + leftMove + xAxisScale.bandwidth();
                } else {
                    return xAxisScale(xAxisTicks[i]) + leftMove + xAxisScale.bandwidth() * 0.5;
                }
            })
            .y1(function(d, i) {
                return yAxisScaleLine(d) + topMove;
            })
            .curve(d3.curveMonotoneX);
        if (state == 0) {
            area.y0(function(d, i) {
                return yAxisScaleLine(d) + topMove;
            })
        } else if (state == 1) {
            area.y0(function(d, i) {
                return contentHeight + topMove;
            })
        }
        return area(lineDataset);
    }

    function addToolTipsTrigger() {
        if (svg.select('.tool-tip-trigger')) {
            svg.select('.tool-tip-trigger').remove();
        }
        var toolTipeTrigger = svg.append('g')
            .classed('tool-tip-trigger', true);

        toolTipeTrigger.selectAll('rect')
            .data(lineDataset)
            .enter()
            .append('rect')
            .attr('width', xAxisScale.bandwidth())
            .attr('height', contentHeight)
            .attr('x', function(d, i) {
                return xAxisScale(xAxisTicks[i]) + leftMove;
            })
            .attr('y', function(d, i) {
                return topMove;
            })
            .attr('fill', 'transparent')
            .on('mouseenter', function(data, index) {
                show(data, index);
            })
            .on('mouseleave', function() {
                hide();
            });

        var lineTip = toolTipeTrigger.append('g')
            .classed('line-tip', true)
            .attr('transform', 'translate(0, 0)')
            .style('visibility', 'hidden');
        lineTip.append('text')
            .attr('text-anchor', 'middle')
            .attr('x', 0)
            .attr('y', -15)
            .style('fill', '#fff')
            .style('font-size', '18px');
        lineTip.append('circle')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', 10)
            .style('fill', '#F3F3F3');
        lineTip.append('circle')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', 6)
            .style('fill', '#FF82B1');

        function show(d, i) {
            lineTip.attr('transform', function() {
                    var top = yAxisScaleLine(d) + topMove;
                    var left = xAxisScale(xAxisTicks[i]) + leftMove + xAxisScale.bandwidth() / 2;
                    return 'translate(' + left + ',' + top + ')';
                })
                .style('visibility', 'visible');
            lineTip.select('text').text(d);
        }

        function hide() {
            lineTip.style('visibility', 'hidden');
        }
    }


    hAxis = parseInt(startTime.split(':')[0]);
    mAxis = parseInt(startTime.split(':')[1]);

    function reDrawXLine() {
        var xAxisTicks = [];
        for (var i = 0; i < 30; i++) {
            if (mAxis === 59) {
                hAxis++;
                mAxis = 0;
            } else {
                mAxis++;
            }
            if (hAxis === 24) {
                hAxis = 0;
            }
            if (mAxis < 10) {
                var string = hAxis + ':0' + mAxis;
            } else {
                var string = hAxis + ':' + mAxis;
            }
            xAxisTicks.push(string);
        }
        mAxis = parseInt(xAxisTicks[0].split(':')[1]);
        hAxis = parseInt(xAxisTicks[0].split(':')[0]);
        //x轴比例尺
        var xAxisScale = d3.scaleBand()
            .domain(xAxisTicks)
            .rangeRound([0, contentWidth])
            .paddingInner([0.3])
            .paddingOuter([0.3]);
        //x轴
        var xAxis = d3.axisBottom(xAxisScale)
            .tickSizeInner([0])
            .tickSizeOuter([0])
            .tickPadding([10]);
        svg.select('.xaxis').remove();
        //svg.append('g')
        //    .classed('axis-container xaxis', true)
        //    .attr('transform', 'translate(' + leftMove + ', ' + (contentHeight + topMove) + ')')
        //    .call(xAxis);
        svg.append("g")
            .classed('axis-container xaxis', true)
            .attr('transform', 'translate(' + leftMove + ', ' + (contentHeight + topMove) + ')')
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "2.8em")
            .attr("dy", ".95em")
            .attr("transform", function(d) {
                return "rotate(45)"
            });
        lineDataset.shift();
        //var newNumber = 9283;
        var newNumber = randomLineNumber();
        lineDataset.push(newNumber);
        if (svg.select('.line-path-container')) {
            svg.select('.line-path-container').remove();
        }
        var linePathContainer = svg.append('g')
            .classed('line-path-container', true);
        linePathContainer.append('path')
            .classed('line-path', true)
            .style('animation-duration', drawLineDur + 'ms')
            .attr('stroke', '#E24676')
            .attr('stroke-width', '4px')
            .attr('fill', 'none')
            .attr('d', getLinePoints())
            .style('stroke-dashoffset', function() {
                return this.getTotalLength();
            })
            .style('stroke-dasharray', function() {
                return this.getTotalLength();
            });
        addToolTipsTrigger();
        d3.timeout(drawLineArea, drawLineDur);
        var tables1 = $('.table1 .table-content .table-tr');
        var tables2 = $('.table2 .table-content .table-tr');
        for (var i = 0; i < tables1.length; i++) {
            var num = parseInt($(tables1[i]).find('.th-r span').text());
            num += newNumber;
            $(tables1[i]).find('.th-r span').text(num);
        }
        for (var i = 0; i < tables2.length; i++) {
            var num = parseInt($(tables2[i]).find('.th-r span').text());
            num += newNumber;
            $(tables2[i]).find('.th-r span').text(num);
        }
    }

    function randomLineNumber() {
        var temp = parseInt(Math.random() * 11000);
        if (temp < 2000) {
            temp = randomLineNumber();
        }
        return temp;
    }

    function reDrawLine() {
        reDrawXLine();
        linePathContainer.select('path')
            .classed('line-path', false)
            .attr('d', getLinePoints());

        linearea.attr('d', getAreaPath(0));
        setTimeout(function() {
            linePathContainer.select('path')
                .classed('line-path', true);
            setTimeout(function() {
                linearea.transition()
                    .duration([800])
                    .attr('d', getAreaPath(1))
                    .on('end', function() {
                        setTimeout(reDrawLine, drawLineInterval);
                    });
            }, drawLineDur);
        }, 10);

    }

}
