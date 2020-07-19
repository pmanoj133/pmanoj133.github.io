// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 1520 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#bar1")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("data/bar1.csv", function(data) {
  // Add X axis
  var barData = d3.nest()
  .key(function(d) { return d.country; })
  .rollup(function(v) { return d3.mean(v, function(d) { return d.Happiness_score; }); })
  .entries(data);

  var dotData = d3.nest()
  .key(function(d) { return d.country; })
  .rollup(function(v) { return d3.mean(v, function(d) { return d.Healthy_life_expectancy_at_birth; }); })
  .entries(data);

  console.log(dotData)

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

  // Bars
  svg.selectAll("mybar")
    .data(barData)
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.value); })
      .attr("width", x.bandwidth())
      .attr("fill", "#69b3a2")
      // no bar at the beginning thus:
      .attr("height", function(d) { return height - y(0); }) // always equal to 0
      .attr("y", function(d) { return y(0); })

  // Animation
  svg.selectAll("rect")
    .transition()
    .duration(800)
    .attr("y", function(d) { return y(d.value); })
    .attr("height", function(d) { return height - y(d.Value); })
    .delay(function(d,i){console.log(i) ; return(i*100)})

    // Add X axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width/2 + margin.left)
        .attr("y", height + margin.top + 20)
        .text("Country");

    // Y axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", -margin.top - height/2 + 20)
        .text("Happiness Score")

  // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
  // Its opacity is set to 0: we don't see it by default.
  var tooltip = d3.select("#bar1")
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
      .html("Country:" + d.CountryName + "<br>  Average Happiness Score:" + d.AvgHappinessScore + "<br> Average Log GDP Per Capita:" + d.AvgLogGDP)
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
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.AvgLogGDP); } )
      .attr("cy", function (d) { return y(d.AvgHappinessScore); } )
      .attr("r", 5)
      .style("fill", "#69b3a2")
      .style("opacity", 0.8)
      .style("stroke", "white")
    .on("mouseover", mouseover )
    .on("mousemove", mousemove )
    .on("mouseleave", mouseleave )

})
