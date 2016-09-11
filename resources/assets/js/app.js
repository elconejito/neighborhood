/**
 * Main script
 */
 
/* global $ */
/* global d3 */

$( document ).ready(function() {
    console.log("ready!");
    console.log("Starting D3");
    
    var data = [];
    
    $.get('api/stats/price')
        .done(function(response) {
            console.log('Starting price $.get()');
            console.log(response);
            
            var findMax = [];
            $.each(response, function(k, v) {
                findMax.push(v.count);
            });
            data = response;
            
            console.log(data);
            console.log(findMax);
            
            var x = d3.scale.linear()
                .domain([0, d3.max(findMax)])
                .range([0, 100]);
            
            d3.select(".chart")
                .selectAll("div")
                    .data(data)
                .enter().append("div")
                    .style("width", function(d) {
                        return x(d.count) + "%";
                    })
                    .classed("bar", true)
                    .text(function(d) {
                        return d.count;
                    });
        });
});