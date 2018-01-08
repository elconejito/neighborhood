/**
 * First we will load all of this project's JavaScript dependencies which
 * include Vue and Vue Resource. This gives a great starting point for
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

/* global $ */
/* global d3 */

let Utility = {
  formatCurrency: (number, short = false) => {
      if ( short ) {
          return '$' + number.toFixed(0).slice(0, -3) + 'k';
      } else {
          return '$' + number.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,").replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
      }
  }
};

let monthNames = [ "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC" ];

let buildChart = function(selector, stat) {
  // Make the chart square
  let chartWidth = $(selector).parent().width();
  let chartHeight = (chartWidth * .5) - 20;  // 20 px bottom margin

  // Scales
  let x = d3.scaleBand()
    .rangeRound([0, chartWidth])
    .paddingInner(0.1);
  let y = d3.scaleLinear()
    .range([chartHeight, 0]);

  // X-Axis labels
  let xAxis = d3.axisBottom()
    .scale(x);

  // Define the chart
  let chart = d3.select(selector)
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

let buildChartAmount = function(selector, stat) {
  // Make the chart square
  let chartWidth = $(selector).parent().width();
  let chartHeight = (chartWidth * .5) - 20;  // 20 px bottom margin

  // Scales
  let x = d3.scaleBand()
    .rangeRound([0, chartWidth])
    .paddingInner(0.1);
  let y = d3.scaleLinear()
    .range([chartHeight, 0]);

  // X-Axis labels
  let xAxis = d3.axisBottom()
    .scale(x);

  // Define the chart
  let chart = d3.select(selector)
    .attr("width", chartWidth)
    .attr("height", chartHeight + 20);

  $.get('api/stats/' + stat)
  .done(function(data) {
    x.domain(data.map(function(d) { return monthNames[d.month - 1]; }));
    y.domain([
      d3.min(data, function (d) {
        return d.amount.toFixed(0);
      }) - 10000,
      d3.max(data, function (d) {
        return d.amount.toFixed(0);
      })
    ]);

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
        .attr("y", function(d) {
          return y(d.amount.toFixed(0));
        })
        .attr("height", function(d) {
          return chartHeight - y(d.amount.toFixed(0));
        })
        .attr("width", x.bandwidth());

    chart.selectAll(".label")
    .data(data)
    .enter().append("text")
    .attr("class", function(d) {
      if ( y(d.amount.toFixed(0)) < 30 ) {
        return "label label-inside";
      } else {
        return "label";
      }
    })
    .attr("x", function(d) { return x(monthNames[d.month - 1]) + (x.bandwidth() / 2); })
    .attr("y", function(d) {
      if (y(d.amount.toFixed(0)) < 30) {
        return y(d.amount.toFixed(0)) + 15;
      } else {
        return y(d.amount.toFixed(0)) - 15;
      }
    })
    .attr("dy", ".35em")
    .text(function(d) {
      return Utility.formatCurrency(d.amount, true);
    });
  });
};

$( document ).ready(function() {
    console.log("ready!");
    
    if ( $(".data-chart").length ) {
        $(".data-chart").each(function() {
            buildChart(this, $(this).data('method'));
        });
    }

  if ( $(".data-chart-amount").length ) {
    $(".data-chart-amount").each(function() {
      buildChartAmount(this, $(this).data('method'));
    });
  }
    
    if ( $(".data-list").length ) {
        $(".data-list").each(function(index, list) {
            $.get('api/stats/' + $(this).data('method'))
                .done(function(data) {
                    if ( data.length ) {
                      let table = $(list).find('table');

                      $.each(data, (i, sale) => {
                        let tableRow = $('<tr>');
                        let address = $('<a>', {
                            'href': sale.location.urls
                        }).text(sale.location.number + ' ' + sale.location.address);

                        tableRow
                            .append($('<td>').text(moment(sale.price_date).format('MMM DD')))
                            .append($('<td>').append(address))
                            .append($('<td>').text(Utility.formatCurrency(sale.price)).addClass('text-right'));

                        table.append(tableRow);
                      });
                    }
                });
        });
    }
});
