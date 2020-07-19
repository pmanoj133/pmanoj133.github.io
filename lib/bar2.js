// set the dimensions and margins of the graph
var margin = {top: 10, right: 60, bottom: 60, left: 60},
    width = 3040 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#bar2")
  .append("svg")
    .attr("width", width + margin.left + margin.right + 50)
    .attr("height", height + margin.top + margin.bottom + 100)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("data/bar2.csv", function(data) {
  // Add X axis
  var barData = d3.nest()
  .key(function(d) { return d.country; })
  .rollup(function(v) { return d3.mean(v, function(d) { return d.Happiness_score; }); })
  .entries(data);

  var dotData = d3.nest()
  .key(function(d) { return d.country; })
  .rollup(function(v) { return d3.mean(v, function(d) { return d.household; }); })
  .entries(data);

  var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(barData.map(function(d) { return d.key; }))
    .padding(0.2);

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 8])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

    // Add Y axis
    var rY = d3.scaleLinear()
      .domain(d3.extent(dotData, function(d) {return d.value;}))
      .range([ height, 0]);
    svg.append("g")
      .attr("transform", "translate(" + width + ", 0)")
      .call(d3.axisRight(rY));

var barTooltip = d3.select("#bar2")
        .append("div")
        .style("opacity", 0)
        .attr("class", "bartooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("position", "absolute")
        .style("width", "auto")
        .style("height", "auto")

        var barMousemove = function(d) {
          barTooltip
            .html("Country:<strong>" + d.key + "</strong><br>  Happiness Score:" + d.value +"</strong>")
            .style("left", (d3.event.pageX + 15) + "px")
            .style("top", (d3.event.pageY - 28) + "px")
            .style("left", (d3.mouse(this)[0]+90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
            .style("top", (d3.mouse(this)[1]) + "px")
        }

        var barMouseover = function(d) {
          barTooltip
            .style("opacity", 1)
        }

        var barMouseleave = function(d) {
          barTooltip
            .transition()
            .duration(200)
            .style("opacity", 0)
        }

  // Bars
  svg.selectAll("bar2")
    .data(barData)
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.key); })
      .attr("width", x.bandwidth())
      .attr("fill", "#69b3a2")
      // no bar at the beginning thus:
      .attr("height", function(d) { return height - y(0); }) // always equal to 0
      .attr("y", function(d) { return y(d.value); })
      .on("mouseover", barMouseover )
      .on("mousemove", barMousemove )
      .on("mouseleave", barMouseleave )

  // Animation
  svg.selectAll("rect")
    .transition()
    .duration(100)
    .attr("y", function(d) { return y(d.value); })
    .attr("height", function(d) { return height - y(d.value); })
    .delay(function(d,i){console.log(i) ; return(i*20);})

    // Add X axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width/2 + margin.left)
        .attr("y", height + margin.top + 100)
        .text("Country");

    // Y axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", -margin.top - height/2 + 40)
        .text("Happiness Score")

        svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", width + 50)
            .attr("x", -margin.top - height/2 + 40)
            .text("GINI index of household")

  // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
  // Its opacity is set to 0: we don't see it by default.
  var tooltip = d3.select("#bar2")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("position", "absolute")
    .style("width", "auto")
    .style("height", "auto")


  // A function that change this tooltip when the user hover a point.
  // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
  var mouseover = function(d) {
    d3.select(this).transition()
    .duration('100')
    .attr("r", 7);
    tooltip
      .style("opacity", 1)
  }

  var mousemove = function(d) {
    tooltip
      .html("Country: <strong>" + d.key + " </strong> <br> GINI index of household:<strong>" + d.value + "</strong>" )
      .style("left", (d3.event.pageX + 15) + "px")
      .style("top", (d3.event.pageY - 28) + "px")
      .style("left", (d3.mouse(this)[0]+90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (d3.mouse(this)[1]) + "px")
  }

  // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
  var mouseleave = function(d) {
    d3.select(this).transition()
    .duration('100')
    .attr("r", 5);
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  }

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(dotData)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.key); } )
      .attr("cy", function (d) { return rY(d.value); } )
      .attr("r", 5)
      .style("fill", "#e8214b")
      .style("opacity", 0.9)
      .style("stroke", "white")
    .on("mouseover", mouseover )
    .on("mousemove", mousemove )
    .on("mouseleave", mouseleave )

})
