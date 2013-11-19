

        var width = 1000,
            height = 100,
            padding = 20;

        d3.json("data/dalailama_timeline_200.json", function (data) { 

                var timeformat = d3.time.format("%a %b %d %H:%M:%S %Z %Y").parse;

                var timeScale = d3.time.scale()
                    .domain([new Date(data[0].created_at), d3.time.day.offset(new Date(data[data.length - 1].created_at), 1)])
                    .range([padding, width-padding]);

                var yScale = d3.scale.linear()
                    .domain([0, d3.max(data, function (d) {return d.retweet_count})])
                    .range([padding, height-padding]);

                var xAxis = d3.svg.axis()
                    .scale(timeScale)
                    .orient('bottom')
                    .ticks(5)
                    // .ticks(d3.time.years)
                    // .tickFormat(d3.time.format('%Y'))
                    .tickSize(height-10)
                    ;
                var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient('right')
                    .ticks(2)
                    .tickSize(10);

                data.forEach(function(d) {
                    d.date = timeformat(d.created_at);
                    d.close = +d.close;
                    });

                var svg = d3.select("#lama").append("svg")
                    .attr("width", width)
                    .attr("height", height)

                svg.selectAll("circle")
                    .data(data)
                    .enter()
                        .append("circle")
                        .attr("r", 3)
                        .attr("cx", function (d){ return timeScale(new Date(d.created_at));})
                        .attr("cy", function (d){return yScale(d.retweet_count);})
                        .style("stroke", function (d){
                            if(d.retweeted === true) {return "3DBC7C"}
                            else {return "FBAA1C"}
                            ;})
                        .style("fill-opacity", 0)

                        .on("mouseover", function(d) {

                            //Get this bar's x/y values, then augment for the tooltip
                            var xPosition = parseFloat(d3.select(this).attr("cx"));
                            var yPosition = parseFloat(d3.select(this).attr("cy"))-10;

                            //Create the tooltip label
                            svg.append("text")
                                .attr("class", "tooltip")
                                .attr("id", "tooltip")
                                .attr("x", xPosition)
                                .attr("y", yPosition)
                                .text(d.text)
                                ;

                       })
                       .on("mouseout", function() {
                       
                            //Remove the tooltip
                            d3.select("#tooltip").remove();
                            
                       })


                svg.append("g")
                    .attr("class", "axis")
                    .call(xAxis)
                    ;

                svg.append("g")
                    .attr("class", "axis")
                    .call(yAxis)
                    ;
        });
        
