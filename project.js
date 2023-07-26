d3.csv("https://raw.githubusercontent.com/YL117/CS416Final/main/data/time_series_covid19_deaths_US.csv")
.then (function (data) {
    const columnNames = Object.keys(data[0]);
    const indexRegion = columnNames.indexOf("Admin2");
    const indexState = columnNames.indexOf("Province_State");
    const indexLatitude = columnNames.indexOf("Lat");
    const indexLongitude = columnNames.indexOf("Long_");
    const indexPopulation = columnNames.indexOf("Population");
    const rowCount = data.length;
    const columnCount = columnNames.length;

    const width = 700;
    const margin = 80;
    const height = 500;
    const barHeight_scene1 = 20;
    const textDist_scene1 = 65;
    const barDist_scene1 = 50;

    const hover_detail_y_scene2 = 140;

    const first_date = columnNames[indexPopulation + 1];
    const last_date = columnNames[columnCount - 1];
    
    const scene3_initial_date = "12/31/21"

    var parseDate = d3.timeParse("%m/%d/%y");
    var formatDate = d3.timeFormat("%Y-%m-%d");

    var pivottedAndReducedData = [];
    for(let r = 1; r < rowCount; r++) {
        const rowCurrent = Object.values(data[r]);
        for(let c = indexPopulation + 1; c < columnCount; c++) {
            var newRow = {};
            newRow["Region"] = rowCurrent[indexRegion];
            newRow["State"] = rowCurrent[indexState];
            newRow["Latitute"] = rowCurrent[indexLatitude];
            newRow["Longitude"] = rowCurrent[indexLongitude];
            newRow["Population"] = rowCurrent[indexPopulation];
            newRow["Date"] = columnNames[c];
            newRow["Accumulative_Death"] = rowCurrent[c];
            if (c == indexPopulation + 1)
                newRow["Incremental_Death"] = 0;
            else
                newRow["Incremental_Death"] = rowCurrent[c] - rowCurrent[c-1];
            pivottedAndReducedData.push(newRow);
        }
    }

    var svg = d3.select("body").append("svg")
        .attr("height","100%")
        .attr("width","100%");
    
    var g_scene1_root = svg.append("g");
    var g_scene1_text = g_scene1_root.append("g");
    g_scene1_text.append("text")
        .text(function () {return "US Deceased Count of States by CVOID-19 on December 31st";} )
        .attr("x", function () {return (width - this.getComputedTextLength()) / 2;})
        .attr("y", margin)
        .attr("class","text");
    
    const scaleX_scene1 = d3.scaleLinear().domain([0,100000]).range([0,width - 200]);

    var filter_2022 = pivottedAndReducedData.filter(d => d.Date == "12/31/22");
    var rollup_2022 = d3.rollup(
        filter_2022,
        v => d3.sum(v,d => d.Accumulative_Death),
        d => d.State);
    var processedRollup_2022 = Array.from(rollup_2022,
        ([state, death]) => ({State:state,Accumulative_Death:death, Date: "12/31/22"}));
    var sortedRollup_2022 = processedRollup_2022
        .sort(function (a,b) {
            return b.Accumulative_Death - a.Accumulative_Death;
        })
        .filter(function (d,i) {
            return i < 10;
        });

    const stateHighestDeath2022 = sortedRollup_2022.map(d => d.State);
    
    var g_scene1_2022 = g_scene1_root.append("g");
    g_scene1_2022.selectAll("rect")
        .data(sortedRollup_2022)
        .enter().append("rect")
        .attr("width", function(d) {return scaleX_scene1(d.Accumulative_Death);})
        .attr("class","bar_2022")
        .attr("height", barHeight_scene1)
        .attr("x", margin)
        .attr("y", function(d, i) {return (i * barDist_scene1) + margin + barDist_scene1;});

    g_scene1_2022.selectAll("text")
        .data(sortedRollup_2022)
        .enter().append("text")
        .text(function(d) {return d.Accumulative_Death;})
        .attr("class","text")
        .attr("x", function(d) {return scaleX_scene1(d.Accumulative_Death) + 75;})
        .attr("y", function(d, i) {return (i * barDist_scene1) + margin + barDist_scene1 / 2 + textDist_scene1;});
    
    var filter_2021 = pivottedAndReducedData.filter(d => d.Date == "12/31/21");
    var rollup_2021 = d3.rollup(
        filter_2021,
        v => d3.sum(v,d => d.Accumulative_Death),
        d => d.State);
    var processedRollup_2021 = Array.from(rollup_2021,
        ([state, death]) => ({State:state,Accumulative_Death:death, Date: "12/31/21"}));
    var sortedRollup_2021 = processedRollup_2021
        .sort(function (a,b) {
            aIndex = stateHighestDeath2022.indexOf(a.State);
            bIndex = stateHighestDeath2022.indexOf(b.State);
            if (aIndex == -1 && bIndex == -1)
                return a.Accumulative_Death < b.Accumulative_Death;
            if (aIndex == -1)
                return 1;
            if (bIndex == -1)
                return -1;
            return aIndex - bIndex;
        })
        .filter(function (d,i) {
            return i < 10;
        });

    var g_scene1_2021 = g_scene1_root.append("g");
    g_scene1_2021.selectAll("rect")
        .data(sortedRollup_2021)
        .enter().append("rect")
        .attr("width", function(d) {return scaleX_scene1(d.Accumulative_Death);})
        .attr("class","bar_2021")
        .attr("height", barHeight_scene1)
        .attr("x", margin)
        .attr("y", function(d, i) {return (i * barDist_scene1) + margin + barDist_scene1;});

    g_scene1_2021.selectAll("text")
        .data(sortedRollup_2021)
        .enter().append("text")
        .text(function(d) {return d.Accumulative_Death;})
        .attr("class","text")
        .attr("x", function(d) {return scaleX_scene1(d.Accumulative_Death) + 25;})
        .attr("y", function(d, i) {return (i * barDist_scene1) + margin + barDist_scene1 / 2 + textDist_scene1;});
    
    var filter_2020 = pivottedAndReducedData.filter(d => d.Date == "12/31/20");
    var rollup_2020 = d3.rollup(
        filter_2020,
        v => d3.sum(v,d => d.Accumulative_Death),
        d => d.State);
    var processedRollup_2020 = Array.from(rollup_2020,
        ([state, death]) => ({State:state,Accumulative_Death:death, Date:"12/31/20"}));
    var sortedRollup_2020 = processedRollup_2020
        .sort(function (a,b) {
            aIndex = stateHighestDeath2022.indexOf(a.State);
            bIndex = stateHighestDeath2022.indexOf(b.State);
            if (aIndex == -1 && bIndex == -1)
                return a.Accumulative_Death < b.Accumulative_Death;
            if (aIndex == -1)
                return 1;
            if (bIndex == -1)
                return -1;
            return aIndex - bIndex;
        })
        .filter(function (d,i) {
            return i < 10;
        });

    var g_scene1_2020 = g_scene1_root.append("g");
    g_scene1_2020.selectAll("rect")
        .data(sortedRollup_2020)
        .enter().append("rect")
        .attr("width", function(d) {return scaleX_scene1(d.Accumulative_Death);})
        .attr("class","bar_2020")
        .attr("height", barHeight_scene1)
        .attr("x", margin)
        .attr("y", function(d, i) {return (i * barDist_scene1) + margin + barDist_scene1;});

    g_scene1_2020.selectAll("text")
        .data(sortedRollup_2020)
        .enter().append("text")
        .text(function(d) {return d.Accumulative_Death;})
        .attr("class","text")
        .attr("x", margin)
        .attr("y", function(d, i) {return (i * barDist_scene1) + margin + barDist_scene1 / 2 + textDist_scene1;});

    var g_scene1_axis = g_scene1_root.append("g")
        .attr("transform","translate(" + margin + "," + (height + margin + 100) + ")")
        .call(d3.axisBottom(scaleX_scene1).ticks(10));

    var g_scene1_labels = g_scene1_root.append("g")
        .selectAll("text")
        .data(sortedRollup_2022)
        .enter().append("text")
        .attr("class","text")
        .text(function(d) {return d.State;})
        .attr("x", function (d) {return width - this.getComputedTextLength();})
        .attr("y", function (d, i) {return (i * barDist_scene1) + margin + barDist_scene1 * 1.5;});
    
    // var g_scene1_labels = g_scene1_root.append("g")
    //     .selectAll("text")
    //     .data(sortedRollup_2021)
    //     .enter().append("text")
    //     .attr("class","text")
    //     .text(function(d) {return d.State;})
    //     .attr("x", function (d) {return width + 100 - this.getComputedTextLength();})
    //     .attr("y", function (d, i) {return (i * barDist_scene1) + 50;});

    // var g_scene1_labels = g_scene1_root.append("g")
    //     .selectAll("text")
    //     .data(sortedRollup_2020)
    //     .enter().append("text")
    //     .attr("class","text")
    //     .text(function(d) {return d.State;})
    //     .attr("x", function (d) {return width - this.getComputedTextLength();})
    //     .attr("y", function (d, i) {return (i * barDist_scene1) + 50;});
    
    const annotations1_scene1 = [
    {
        note: {
            label: "Recorded on Dec 31st of 2020, 2021, 2022, from left to right and bright to dark." /* (d) => `Accumulative Death ${d.Accumulative_Death}` */,
            title: "Accumulative Deceased Count"/* (d) => `${d.State},${d.Date}` */,
        },
        x: 320,
        y: 360,
        dy: 160,
        dx: 40,
        // accessors: {
        //     State: (d) => d.State,
        //     Accumulative_Death: (d) => d.Accumulative_Death,
        //     Date: (d) => d.Date
        // }
    }
    ];

    const makeAnnotations1_scene1 = d3.annotation()
        // .editMode(true)
        // .notePadding(15)        
        .annotations(annotations1_scene1);

    g_scene1_root.append("g")
        .call(makeAnnotations1_scene1);

    const annotations2_scene1 = [
    {
        note: {
            label: "Note that except for Texas which remain 2nd highest, the order does change. The current order is based on 2022." /* (d) => `Accumulative Death ${d.Accumulative_Death}` */,
            title: "States with most deceased"/* (d) => `${d.State},${d.Date}` */,
        },
        x: width - 70,
        y: 150,
        dy: 180,
        dx: -140,
        // accessors: {
        //     State: (d) => d.State,
        //     Accumulative_Death: (d) => d.Accumulative_Death,
        //     Date: (d) => d.Date
        // }
    }
    ];

    const makeAnnotations2_scene1 = d3.annotation()
        // .editMode(true)
        // .notePadding(15)        
        .annotations(annotations2_scene1);

    g_scene1_root.append("g")
        .call(makeAnnotations2_scene1);

    var g_scene2_root = svg.append("g");
    var g_scene2_text = g_scene2_root.append("g");
    g_scene2_text.append("text")
        .text(function () {return "US accumulative deceased by state on 1st of each month";} )
        .attr("x", function () {return (width - this.getComputedTextLength()) / 2;})
        .attr("y", margin)
        .attr("class","text");

    const filter_scene2 = pivottedAndReducedData
        .filter(d => (parseDate(d.Date)).getDate() == 1 && stateHighestDeath2022.indexOf(d.State) != -1);
    
    const scaleY_scene2 = d3.scaleLinear().domain([0,100000]).range([height,0]);
    const scaleX_scene2 = d3.scaleTime().domain([parseDate(first_date),parseDate(last_date)]).range([0,width]);

    var g_scene2 = g_scene2_root.append("g");
    const colors_scene2 = ["black", "gray", "slategray", "darkgray", "lightgray"];

    var g_scene2_legend = g_scene2_root.append("g");
    g_scene2_legend.selectAll("dot").data(colors_scene2)
        .enter().append("circle")
        .attr("cx", margin)
        .attr("cy", function (d, i) {return margin * 2 + 20 * i;})
        .attr("r", 5)
        .attr("fill", function (d) {return d});
    g_scene2_legend.selectAll("text").data(stateHighestDeath2022.slice(0,5))
        .enter().append("text")
        .attr("x", margin * 1.5)
        .attr("y", function (d, i) {return margin * 2 + 5 + 20 * i;})
        .text(function (d) {return d})
        .attr("class", "text");
    var scene2_detail_text = g_scene2_legend.append("text")
        .attr("x", margin * 3)
        .attr("y", hover_detail_y_scene2)
        .attr("class", "text");

    for (let si = 0; si < 5; si++) {
        const data_state = filter_scene2.filter(d => d.State == stateHighestDeath2022[si]);
        var death_state = [];
        for (let day = indexPopulation + 1; day < columnCount; day++) {
            const date = parseDate(columnNames[day]);
            if (date.getDate() != 1)
                continue;
            const data_date = data_state.filter(d => d.Date == columnNames[day]);
            const sumOverState = d3.rollup(data_date, v => d3.sum(v, d => d.Accumulative_Death), d => d.State);
            death_state.push(Array.from(sumOverState, ([state, death]) => ({Accumulative_Death:death, Date:date, State:state}))[0]);
        }

        var g_scene2_si = g_scene2.append("g");
        g_scene2_si.selectAll("dot")
            .data(death_state)
            .enter().append("circle")
            .attr("transform", "translate(" + margin + "," + margin + ")")
            .attr("cx", function (d) { return scaleX_scene2(d.Date); })
            .attr("cy", function (d) { return scaleY_scene2(d.Accumulative_Death); })
            .attr("r", 5)
            .style("fill", function (d,i) { return colors_scene2[si] })
            .on("mouseover", function (event, d) {
                scene2_detail_text.text(function () {return d.State + ", " + formatDate(d.Date) + ": "+ d.Accumulative_Death;});
            })
            .on("mouseout", function (event, d) {
                scene2_detail_text.text("");
            })
        
        const line_scene2 = d3.line()
            .x(function(d) { return scaleX_scene2(d.Date); }) 
            .y(function(d) { return scaleY_scene2(d.Accumulative_Death); }) 
            .curve(d3.curveMonotoneX);
        
        g_scene2_si.append("path")
            .datum(death_state) 
            .attr("class", "line") 
            .attr("transform", "translate(" + margin + "," + margin + ")")
            .attr("d", line_scene2)
            .style("fill", "none")
            .style("stroke", function (d,i) { return colors_scene2[si] })
            .style("stroke-width", "2");
    }
    var g_scene2_axis_b = g_scene2_root.append("g")
        .attr("transform","translate(" + margin + "," + (height + margin) + ")")
        .call(d3.axisBottom(scaleX_scene2).ticks(10));

    var g_scene2_axis_r = g_scene2_root.append("g")
        .attr("transform","translate(" + (width + margin) + "," + margin + ")")
        .call(d3.axisRight(scaleY_scene2).ticks(10));
    
    const annotations1_scene2 = [
    {
        note: {
            label: "The accumulative accumulative is monotone increasing, expectedly. Hover over a dot to reveal detail." /* (d) => `Accumulative Death ${d.Accumulative_Death}` */,
            title: "Progressive Deceased Count"/* (d) => `${d.State},${d.Date}` */,
        },
        x: 610,
        y: 360,
        dy: 30,
        dx: 40,
        // accessors: {
        //     State: (d) => d.State,
        //     Accumulative_Death: (d) => d.Accumulative_Death,
        //     Date: (d) => d.Date
        // }
    }
    ];

    const makeAnnotations1_scene2 = d3.annotation()
        // .editMode(true)
        // .notePadding(15)        
        .annotations(annotations1_scene2);

    g_scene2_root.append("g")
        .call(makeAnnotations1_scene2);

    const annotations2_scene2 = [
    {
        note: {
            label: "The data is sampled at the start of each month. There is much to display, so the states are limited to 5." /* (d) => `Accumulative Death ${d.Accumulative_Death}` */,
            title: "States with most Deceased"/* (d) => `${d.State},${d.Date}` */,
        },
        x: 180,
        y: 250,
        dy: 50,
        dx: -50,
        // accessors: {
        //     State: (d) => d.State,
        //     Accumulative_Death: (d) => d.Accumulative_Death,
        //     Date: (d) => d.Date
        // }
    }
    ];

    const makeAnnotations2_scene2 = d3.annotation()
        // .editMode(true)
        // .notePadding(15)        
        .annotations(annotations2_scene2);

    g_scene2_root.append("g")
        .call(makeAnnotations2_scene2);
    

    var g_scene3_root = svg.append("g");
    var g_slider_scene3 = g_scene3_root.append("g");

    g_scene3_root.append("text")
        .attr("y", margin / 2)
        .attr("class", "text")
        .text("US Geo Map Accumulative Deceased Count by Region, State, Date")
        .attr("x", function () {return margin + (width - this.getComputedTextLength()) / 2;});

    var formatDateFilter = d3.timeFormat("%-m/%-d/%y");
    const scale_slider_scene3 = d3.scaleTime().domain([parseDate(first_date),parseDate(last_date)]).range([0,width]);
    var dragBackground = g_slider_scene3.append("rect")
        .attr("x", margin + 10)
        .attr("y", margin + 5)
        .attr("width", width)
        .attr("height", 30)
        .attr("class", "slider-background");
    var dragPointer = g_slider_scene3.append("rect")
        .attr("x", margin + scale_slider_scene3(parseDate(scene3_initial_date)))
        .attr("y", margin)
        .attr("width", 20)
        .attr("height", 40)
        .attr("class", "slider");
    var dragHint = g_slider_scene3.append("text")
        .attr("height", 40)
        .attr("class", "text")
        .text(formatDate(parseDate(scene3_initial_date)))
        .attr("x", margin + scale_slider_scene3(parseDate(scene3_initial_date)))
        .attr("y", margin + 60);

    const filtered_last_day_scene3 = pivottedAndReducedData.filter(d => d.Date == scene3_initial_date);
    // var topology = {
    //     type: "Topology",
    //     objects: {
    //         points: {
    //             type: "GeometryCollection",
    //             geometries: filtered_first_day.map(
    //                 function (d) {
    //                     return {
    //                         type: "Point",
    //                         properties: {
    //                             Region: d.Region,
    //                             State: d.State
    //                         },
    //                         coordinates: [d.Longitude, d.Latitute]
    //                     }
    //                 }
    //             )
    //         }
    //     }
    // }
    // document.write(JSON.stringify(topology))
    
    var scene3_detail_text = g_scene3_root.append("g")
        .append("text")
        .attr("x", width)
        .attr("y", height + 220)
        .attr("class", "text");
    var scene3_detail_text2 = g_scene3_root.append("g")
        .append("text")
        .attr("x", width)
        .attr("y", height + 240)
        .attr("class", "text");

    var g_scene3 = g_scene3_root.append("g")
        .attr("transform","translate(" + margin + "," + margin * 2 + ")");

    // const filtered_first_day = pivottedAndReducedData.filter(d => d.Date == first_date);

    const uniqueStates = [... new Set(pivottedAndReducedData.map((d) => d.State))];

    const colorByState = d3.scaleOrdinal().domain(uniqueStates)
        .range(d3.range(uniqueStates.length).map(() => d3.interpolateRainbow(Math.random(12345))));
    
    const scaleY_scene3 = d3.scaleLinear().domain([24, 50]).range([height,0]);
    const scaleX_scene3 = d3.scaleLinear().domain([-125, -65]).range([0,width]);
    const scaleR_scene3 = d3.scaleLog().domain([1,1000]).range([0.5,2.5]);

    g_scene3.selectAll("dot")
        .data(filtered_last_day_scene3)
        .enter().append("circle")
        .attr("cx", function (d) {return scaleX_scene3(d.Longitude);})
        .attr("cy", function (d) {return scaleY_scene3(d.Latitute);})
        .attr("r", function (d) {
            if (d.Accumulative_Death <= 0)
                return 0;
            return scaleR_scene3(d.Accumulative_Death);
        })
        .attr("fill", function (d) {
            return colorByState(d.State);
        })
        .on("mouseover", function (event, d) {
            scene3_detail_text.text(d.Region + ", " + d.State + ", " + formatDate(parseDate(d.Date)))
                .attr("x", function () {return margin + (width - this.getComputedTextLength()) / 2;})
            scene3_detail_text2.text("Accumulative Deceased: " + d.Accumulative_Death +
                ", Incremental Deceased: " + d.Incremental_Death)
                    .attr("x", function () {return margin + (width - this.getComputedTextLength()) / 2;})
        })
        .on("mouseout", function (event, d) {
            scene3_detail_text.text("");
            scene3_detail_text2.text("");
        });

    var sliderDrag = d3.drag()
        .on("drag", function (event) {
            var newx = event.x;
            if (newx < margin)
                newx = margin;
            else if (newx > width + margin)
                newx = width + margin;
            dragPointer.attr("x",newx).attr("y", margin);
            dragHint.attr("x",newx).text(formatDate(scale_slider_scene3.invert(newx-margin)));
        })
        .on("end", function (event) {
            var newx = event.x;
            if (newx < margin)
                newx = margin;
            else if (newx > width + margin)
                newx = width + margin;
            const date_to_filter = formatDateFilter(scale_slider_scene3.invert(newx-margin));
            const filteredDate_scene3 = pivottedAndReducedData.filter(d => d.Date == date_to_filter);
            g_scene3.selectAll("circle").remove()
            g_scene3.selectAll("dot")
                .data(filteredDate_scene3)
                .enter().append("circle")
                .attr("cx", function (d) {return scaleX_scene3(d.Longitude);})
                .attr("cy", function (d) {return scaleY_scene3(d.Latitute);})
                .attr("r", function (d) {
                    if (d.Accumulative_Death <= 0)
                        return 0;
                    return scaleR_scene3(d.Accumulative_Death);
                })
                .attr("fill", function (d) {
                    return colorByState(d.State);
                })
                .on("mouseover", function (event, d) {
                    scene3_detail_text.text(d.Region + ", " + d.State + ", " + formatDate(parseDate(d.Date)))
                        .attr("x", function () {return margin + (width - this.getComputedTextLength()) / 2;})
                    scene3_detail_text2.text("Accumulative Deceased: " + d.Accumulative_Death +
                        ", Incremental Deceased: " + d.Incremental_Death)
                            .attr("x", function () {return margin + (width - this.getComputedTextLength()) / 2;})
                })
                .on("mouseout", function (event, d) {
                    scene3_detail_text.text("");
                    scene3_detail_text2.text("");
                });
        });
    
    dragPointer.call(sliderDrag);

    var g_scene3_axis_b = g_scene3_root.append("g")
        .attr("transform","translate(" + margin + "," + (height + margin * 2) + ")")
        .call(d3.axisBottom(scaleX_scene3).ticks(10));

    var g_scene3_axis_l = g_scene3_root.append("g")
        .attr("transform","translate(" + margin * 0.5 + "," + margin * 2 + ")")
        .call(d3.axisLeft(scaleY_scene3).ticks(10));

    const annotations1_scene3 = [
    {
        note: {
            label: "The slider allow changing the date, which changes the date used for filtering" /* (d) => `Accumulative Death ${d.Accumulative_Death}` */,
            title: "Date slider"/* (d) => `${d.State},${d.Date}` */,
        },
        x: 750,
        y: 150,
        dy: 30,
        dx: 10,
        // accessors: {
        //     State: (d) => d.State,
        //     Accumulative_Death: (d) => d.Accumulative_Death,
        //     Date: (d) => d.Date
        // }
    }
    ];

    const makeAnnotations1_scene3 = d3.annotation()
        // .editMode(true)
        // .notePadding(15)        
        .annotations(annotations1_scene3);

    g_scene3_root.append("g")
        .call(makeAnnotations1_scene3);

    const annotations2_scene3 = [
    {
        note: {
            label: "The dots represent a region. It changes size based on accumulative deceased count. Same state means same color." /* (d) => `Accumulative Death ${d.Accumulative_Death}` */,
            title: "Geo Map"/* (d) => `${d.State},${d.Date}` */,
        },
        x: 700,
        y: 350,
        dy: 50,
        dx: 50,
        // accessors: {
        //     State: (d) => d.State,
        //     Accumulative_Death: (d) => d.Accumulative_Death,
        //     Date: (d) => d.Date
        // }
    }
    ];

    const makeAnnotations2_scene3 = d3.annotation()
        // .editMode(true)
        // .notePadding(15)        
        .annotations(annotations2_scene3);

    g_scene3_root.append("g")
        .call(makeAnnotations2_scene3);
    // document.write(JSON.stringify(topology));
    // const connections = topojson.meshArcs(topology, topology.objects.points);
    // document.write(JSON.stringify(connections));
    // const line_scene3 = d3.line()
    //     .x(function(d) { return scaleX_scene3(d.x); }) 
    //     .y(function(d) { return scaleY_scene3(d.y); }) 
    //     .curve(d3.curveLinear);
    // var g_scene3_background = g_scene3.selectAll("path")
    //     .datum(connections)
    //     .enter().append("line")
    //     .attr("d", d3.geoPath().projection(null))
    //     .style("fill", "none")
    //     .style("stroke", "slategray")
    //     .style("stroke-width", "2");

    var g_transition_root = svg.append("g")
    var current_scene = 1;

    var g_button1 = g_transition_root.append("g");
    var button1 = g_button1.append("rect")
        .attr("x", margin / 2)
        .attr("y", margin / 2 - 25)
        .attr("width", 20)
        .attr("height", 40)
        .attr("class", "bar_selector");
    g_button1.append("text")
        .text("1")
        .attr("x", function () { return (margin + this.getComputedTextLength()) / 2;})
        .attr("y", margin / 2)
        .attr("class", "button_text");

    var g_button2 = g_transition_root.append("g");
    var button2 = g_button2.append("rect")
        .attr("x", margin)
        .attr("y", margin / 2 - 25)
        .attr("width", 20)
        .attr("height", 40)
        .attr("class", "bar_selector_unselected");
    g_button2.append("text")
        .text("2")
        .attr("x", function () { return margin + this.getComputedTextLength() / 2;})
        .attr("y", margin / 2)
        .attr("class", "button_text");

    var g_button3 = g_transition_root.append("g");
    var button3 = g_button3.append("rect")
        .attr("x", margin * 3 / 2)
        .attr("y", margin / 2 - 25)
        .attr("width", 20)
        .attr("height", 40)
        .attr("class", "bar_selector_unselected");
    g_button3.append("text")
        .text("3")
        .attr("x", function () { return (margin * 3 + this.getComputedTextLength()) / 2;})
        .attr("y", margin / 2)
        .attr("class", "button_text");


    g_scene1_root.attr("class","g_root_visible");
    g_scene2_root.attr("class","g_root_invisible").attr("opacity",0);
    g_scene3_root.attr("class","g_root_invisible").attr("opacity",0);

    button1.on("click", function (event) {
        button1.attr("class", "bar_selector");
        button2.attr("class", "bar_selector_unselected");
        button3.attr("class", "bar_selector_unselected");

        var delay = 0;
        if (current_scene == 2) {
            g_scene2_root.transition().duration(1000)
                .attr("class","g_root_invisible")
                .attrTween("opacity", function () {
                    var i = d3.interpolate(100,0)
                    return (t => i(t))
                });
            delay = 1000;
        }
        else if (current_scene == 3) {
            g_scene3_root.transition().duration(1000)
                .attr("class","g_root_invisible")
                .attrTween("opacity", function () {
                    var i = d3.interpolate(100,0)
                    return (t => i(t))
                });
            delay = 1000;
        }
        current_scene = 1;
        if (delay > 0) {
            g_scene1_root.transition().delay(delay).duration(1000)
                .attr("class","g_root_visible")
                .attrTween("opacity", function () {
                    var i = d3.interpolate(0,100)
                    return (t => i(t))
                });
        }
    });

    button2.on("click", function (event) {
        button2.attr("class", "bar_selector");
        button1.attr("class", "bar_selector_unselected");
        button3.attr("class", "bar_selector_unselected");

        var delay = 0;
        if (current_scene == 1) {
            g_scene1_root.transition().duration(1000)
                .attr("class","g_root_invisible")
                .attrTween("opacity", function () {
                    var i = d3.interpolate(100,0)
                    return (t => i(t))
                });
            delay = 1000;
        }
        else if (current_scene == 3) {
            g_scene3_root.transition().duration(1000)
                .attr("class","g_root_invisible")
                .attrTween("opacity", function () {
                    var i = d3.interpolate(100,0)
                    return (t => i(t))
                });
            delay = 1000;
        }
        current_scene = 2;
        if (delay > 0) {
            g_scene2_root.transition().delay(delay).duration(1000)
                .attr("class","g_root_visible")
                .attrTween("opacity", function () {
                    var i = d3.interpolate(0,100)
                    return (t => i(t))
                });
        }
    });

    button3.on("click", function (event) {
        button3.attr("class", "bar_selector");
        button1.attr("class", "bar_selector_unselected");
        button2.attr("class", "bar_selector_unselected");

        var delay = 0;
        if (current_scene == 1) {
            g_scene1_root.transition().duration(1000)
                .attr("class","g_root_invisible")
                .attrTween("opacity", function () {
                    var i = d3.interpolate(100,0)
                    return (t => i(t))
                });
            delay = 1000;
        }
        else if (current_scene == 2) {
            g_scene2_root.transition().duration(1000)
                .attr("class","g_root_invisible")
                .attrTween("opacity", function () {
                    var i = d3.interpolate(100,0)
                    return (t => i(t))
                });
            delay = 1000;
        }
        current_scene = 3;
        if (delay > 0) {
            g_scene3_root.transition().delay(delay).duration(1000)
                .attr("class","g_root_visible")
                .attrTween("opacity", function () {
                    var i = d3.interpolate(0,100)
                    return (t => i(t))
                });
        }
    });
});
// var scene1 = [];
// var scene2 = [];
// var scene3 = [];

// var data_scene1 = [];
// var data_scene2 = [];
// var data_scene3 = [];


// svg.selectAll("rect")
//     .data([indexRegion, indexState, indexState])
//     .enter().append("rect")
//     .attr("height", function(d) {return Math.abs(d * 10);})
//     .attr("width","40")
//     .attr("x", function(d, i) {return i * 60 + 25;})
//     .attr("y", function(d) {return 200 - Math.abs(d * 10);})
//     .attr("class","bar");