function loadJSON(path, success, error) { //generic function to get JSON
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          if (success)
            success(JSON.parse(xhr.responseText));
        } else {
          if (error)
            error(xhr);
        }
      }
    };
    xhr.open("GET", path, true);
    xhr.send();
  }
  
  loadJSON('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json',
    dataset,
    function(xhr) {
      console.error(xhr);
    }
  );

  function dataset(data) {
      //store JSON data
    const dataset = data;

    //create SVG
    const w = 1000;
    const h = 700;
    const padding = 40;

    //create svg
    
    const svg = d3.select("body")
                .append("svg")
                .attr("class", "svg")
                .attr("width", w)
                .attr("height", h);
    
    //create scales for axes and data
    var current = d3.timeFormat("%M:%S");
    var year = d3.timeFormat("%Y");
    var colors = ["blue", "orange"];

    //xScale based on years from min to max taken from data
    const times = dataset.map(function(d) {
      //split minutes and second
    var timing = d.Time.split(":");
    //use time format to create a date, from where we extract the minutes and seconds
    //giving a basic year and month and day, the data will be evaluates as different only in minutes and seconds
    timing = new Date(1986,0,0,0,timing[0],timing[1]);
    return timing;});

    const years = dataset.map(function(d) {
      var newYear = d.Year;
      newYear = new Date(newYear, 1,1,0,0,0);
      return newYear;
    });

    const minTiming = d3.min(times)
    const maxTiming = d3.max(times)

    const minYear = new Date(1993, 1,1,0,0,0)
    const maxYear = new Date (2016,1,1,0,0,0)
    
    const xScale = d3.scaleTime()
                    .domain([minYear, maxYear])
                    .range([padding, w - padding]);

    const yScale = d3.scaleTime()
                    .domain([maxTiming, minTiming])
                    .range([h - padding, padding]);
  
    
    const xAxis = d3.axisBottom()
    .scale(xScale)
    .tickFormat(year);
    
                
    const yAxis = d3.axisLeft()
    .scale(yScale)
    //it will convert the date into minutes and seconds value, but the data will stillbe parsed as full dates 
    .tickFormat(current);

    svg.append("g")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .attr("id", "x-axis")
    .call(xAxis);

    svg.append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);
    
    //create data for times and years

    console.log()

    var tooltip = d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("visibility", "hidden");

    d3.select("#title")
    .text("Best times in cyclism and related accusation of Doping")

    svg.selectAll(".dot")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("data-xvalue", (d, i) => year(years[i]))
    .attr("data-yvalue", (d, i) => times[i])
    .attr("cx", (d,i) => xScale(years[i]))
    .attr("cy", (d,i) => yScale(times[i]))
    .attr("r", 6)
    .style("fill", function(d) {if (d.Doping != "") { return "orange"} else {return "blue"}})
    .on("mouseover", function(d,i) {
      tooltip.style("visibility", "visible")
      .style("top", yScale(times[i]) + "px")
      .style("left", xScale(years[i])+ 200 + "px")
      .attr("data-year", d.Year)
      .html(d.Name + " (" + d.Year + ")" + " Time: " + d.Time +  "<br>Accusation: <br>" + d.Doping)
    })
    .on("mouseout", function(d) {
      tooltip.style("visibility", "hidden")
    })
  
    //create legend

    var legend = svg.selectAll(".legend")
    .data(colors)
    .enter()
    .append("g")
    .attr("transform", function(d, i) { return "translate(0," + i * (h /100) + ")"; });
    
    legend.append("rect")
    .attr("class", "legend")
    .attr("id", "legend")
    .attr("height", 20)
    .attr("width", 20)
    .style("fill", function(d,i) {
      if (i == 0) {
        return "orange";
      }
      return "blue";
    })
    .attr("x", w - 40)
    .attr("y", (d, i) => h - 500 + (i * 30))

    legend.append("text")
    .attr("x", w - 55)
    .attr("y", (d, i) => h - 500 + (i * 30))
    .style("text-anchor", "end")
    .text(function(d, i){
      if (i == 0) {
        return "Doping allegations";
      }
      return "No Doping allegations";
    })
    ;


  }