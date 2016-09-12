/**
 * Main script
 */
 
/* global $ */
/* global d3 */

$( document ).ready(function() {
    console.log("ready!");
    console.log("Starting D3");
    
    var data = [];
    var monthNames = [
        "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
    ];
    // Make the chart square
    var chartWidth = $(".chart").parent().width();
    var chartHeight = chartWidth - 20;  // 20 px bottom margin

    // Scales
    var x = d3.scaleBand()
        .rangeRound([0, chartWidth])
        .paddingInner(0.1);
    var y = d3.scaleLinear()
        .range([chartHeight, 0]);

    // X-Axis labels
    var xAxis = d3.axisBottom()
        .scale(x);

    // Define the chart
    var chart = d3.select(".chart")
        .attr("width", chartWidth)
        .attr("height", chartHeight + 20);

    $.get('api/stats/price')
        .done(function(data) {
            console.log('Starting price $.get()');
            console.log(data);

            x.domain(data.map(function(d) { return monthNames[d.month - 1]; }));
            y.domain([0, d3.max(data, function (d) { return d.count; })]);

            // Add the X-Axis labels all the way at the bottom
            chart.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + chartHeight + ")")
                .call(xAxis);

            chart.selectAll(".bar")
                    .data(data)
                .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", function(d) { return x(monthNames[d.month - 1]); })
                    .attr("y", function(d) { return y(d.count); })
                    .attr("height", function(d) { return chartHeight - y(d.count); })
                    .attr("width", x.bandwidth());
            
            console.log('after .bar');
            
            chart.selectAll(".label")
                    .data(data)
                .enter().append("text")
                    .attr("class", "label")
                    .attr("x", function(d) { return x(monthNames[d.month - 1]) + (x.bandwidth() / 2); })
                    .attr("y", function(d) { return y(d.count) - 15; })
                    .attr("dy", ".35em")
                    .text(function(d) { return d.count; });
                    
            console.log('after text');
        });
});