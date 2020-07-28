// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 760 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#scatter")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom+50)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("data/scatter.csv", function(data) {
  // Add X axis
  var x = d3.scaleLinear()
    .domain([6,12])
    .range([0,width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([2,8])
    .range([height,0]);
  svg.append("g")
    .call(d3.axisLeft(y));

    // Add X axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width/2 + margin.left)
        .attr("y", height + margin.top + 20)
        .text("Avg GDP Per Capita");

    // Y axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", -margin.top - height/2 + 20)
        .text("Happiness Score")

  // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
  // Its opacity is set to 0: we don't see it by default.
  var tooltip = d3.select("#scatter")
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
      .html("Country:<strong>" + d.CountryName + "</strong><br>  Average Happiness Score:<strong>" + d3.format("0.2f")(d.AvgHappinessScore) + "</strong><br> Average Log GDP Per Capita:<strong>" + d3.format("0.2f")(d.AvgLogGDP)+"</strong>")
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

    svg.append('g')
      .selectAll("anno")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", function (d) { return x(7.0); } )
        .attr("cy", function (d) { return y(3.25); } )
        .attr("r", 75)

    console.log(data.filter(function(d){return d.CountryName == 'Central African Republic';}))
    console.log("latest2")
    svg.append('g').selectAll("text")
       .data(data.filter(function(d){return d.CountryName == 'Central African Republic';}))
       .enter()
       .append("text")
       // Add your code below this line
       .text("Country with lowest AvgLogGDP and lowest happiness score")
       .attr("x", function(d) { return x(d.AvgLogGDP)+5; })
       .attr("y", function(d) { return y(d.AvgHappinessScore); })
       .attr("fill", "red");

})
