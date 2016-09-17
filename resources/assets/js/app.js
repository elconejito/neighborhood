/**
 * Main script
 */
 
/* global $ */
/* global d3 */
var monthNames = [ "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC" ];
    
var buildChart = function(selector, stat) {
    // Make the chart square
    var chartWidth = $(selector).parent().width();
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
    var chart = d3.select(selector)
        .attr("width", chartWidth)
        .attr("height", chartHeight + 20);

    $.get('api/stats/' + stat)
        .done(function(data) {
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
            
            chart.selectAll(".label")
                    .data(data)
                .enter().append("text")
                    .attr("class", function(d) {
                        if ( y(d.count) < 30 ) {
                            return "label label-inside";
                        } else {
                            return "label";
                        }
                    })
                    .attr("x", function(d) { return x(monthNames[d.month - 1]) + (x.bandwidth() / 2); })
                    .attr("y", function(d) {
                        if ( y(d.count) < 30 ) {
                            return y(d.count) + 15;
                        } else {
                            return y(d.count) - 15;
                        }
                    })
                    .attr("dy", ".35em")
                    .text(function(d) { return d.count; });
        });
};

$( document ).ready(function() {
    console.log("ready!");
    
    $(".data-chart").each(function() {
        buildChart(this, $(this).data('method'));
    });
    
    $(".data-list").each(function() {
        $.get('api/stats/' + $(this).data('method'))
            .done(function(data) {
                console.log(data);
            });
    });
});