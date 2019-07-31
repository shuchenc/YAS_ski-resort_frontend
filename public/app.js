const config = 
{
	"db": {
		"URL": "bolt://hobby-iekihenlakdagbkeclogcjdl.dbs.graphenedb.com:24787",
		"username": "app140927832-IH7vmI",
		"password": "b.NRucqiEr48F8.XBjkdiyczzFF8C1l"
	},
	"backend": {
		"hostDomain": "https://yas-ski-resort.herokuapp.com/",
		"backupDomain": "http://localhost:8080"
    }
}

function init() {
    window.config = config;
    window.curCanvas = 0;
    document.cache = {};
    addNavBarClickHandler();
    document.defaultQuery = { 
        uri: "/places",
        dom_id: "places"
    };
    var uri, id;
    window.addEventListener('keyup', event => {
        if (event.keyCode === 13) {
            getData(makeUri(), id, printTable);
        }
    });
    document.getElementById("refresh_button").onclick = (() => getData(makeUri(), id, printTable));
}

function parseData(clicked_dom_id, data) {
    // parse
    //console.log(Object.keys(data[0]));
    if (clicked_dom_id == "visits" && data.length > 0 && "relationship" in data[0]) {
        var row;
        data.forEach((e, i, arr) => {
            row = {};
            row.sid = e.skier.sid;
            row.skillLevel = e.skier.skillLevel
            row.place = e.place.name;
            row.timeIn = e.relationship.timeIn;
            row.timeOut = e.relationship.timeOut;
            
            data[i] = row;
        });
    }
    return data;
} 

function printTable(data, table_id) {
    if (!data) {
        alert("Nothing retrieved...");
        return;
    }

    table_id = table_id || "query_table";
    var table = document.getElementById(table_id);
    var table_info = document.getElementById(`${table_id}_info`);
    /* clean the canvas*/
    table.innerHTML = "";
    table_info.innerHTML = "";
    
    if (!Array.isArray(data)) {
        data = [data];
    }
    var n = data.length;
    if (n == 0) {
        alert("Empty table, nothing to print...");
        return;
    }
    table_info.innerHTML = `Fetching ${n} rows...`;
    const keys = Object.keys(data[0]);
    var m = keys.length;
    if (m == 0 || n == 0) {
        alert("Empty table, nothing to print...");
        return;
    }
    var row, cell, i, j;
    console.log(`Printing ${n} rows...`);
    //print header
    row = document.createElement('tr');
    for (j = 0; j < m; j++) {
        cell = row.insertCell(j);
        cell.innerHTML = keys[j];
    }
    table.appendChild(row);
    for (i = 0; i < n; i++) {
        //row = table.insertRow(i+1);
        row = document.createElement('tr');
        for (j = 0; j < m; j++) {
            //cell = row.insertCell(j);
            cell = document.createElement('td');
            cell.innerHTML = data[i][keys[j]];
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    table_info.innerHTML = `${n} rows fetched.`;
    plotGraph(document.getElementById("query_table_div").offsetWidth, 750);
}

function plotGraph(svgWidth, svgHeight, id) {
    // javascript
    //var id = document.curClickedNavId;
    id = id || document.curClickedNavId || "visits";
    var data = document.cache[makeUri(id)];
    if (!data) {
        return;
    }
    d3.select("svg").selectAll("*").remove();
    var n = data.length;
    var map = {};
    var keyword;
    if (id == "visits") {
        keyword = "place";
    } else if (id == "skiers") {
        keyword = "skillLevel";
    } else if (id == "places") {
        keyword = "type";
    } else {
        return;
    }
    for (var i = 0; i < n; i++) {
        var place = data[i][keyword];
        if (place in map) {
            map[place] += 1;
        } else {
            map[place] = 1;
        }
    }
    //var dataset = [80, 100, 56, 120, 180, 30, 40, 120, 160];
    var key=[];
    var dataset=[];
    Object.keys(map).forEach(function(k){
        key.push(k);
        dataset.push(map[k]);
    });

    svgWidth = svgWidth || 500;
    svgHeight = svgHeight || 300;
    var barPadding = 2;
    // set the dimensions and margins of the graph
    var margin = {top: 60, right: 20, bottom: 100, left: 40},
    width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.top - margin.bottom;
    var barWidth = (width / dataset.length);


    var svg = d3.select('svg')
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .append("g")
        .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1)
          .domain(key);

    var xAxis = d3.axisBottom(x);
    var xAxisTranslate = height;

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset)])
        .range([0, height]);
        
    var barChart = svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", function(d) {
            return height - yScale(d);
        })
        .attr("height", function(d) { 
            return yScale(d); 
        })
        .attr("width", barWidth - barPadding)
        .attr("transform", "translate(0, " + margin.top  +")")
        .attr("transform", function (d, i) {
            var translate = [barWidth * i, 0]; 
            return "translate("+ translate +")";
        });

    var text = svg.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .text(function(d) {
            return d;
        })
        .attr("y", function(d, i) {
            return height - yScale(d) - 5;
        })
        .attr("x", function(d, i) {
            return barWidth * i;
        })
        .attr("fill", "#A64C38");

    var x = svg.append("g")
        .attr("transform", "translate(0, " + xAxisTranslate  +")")
        .style("text-anchor", "middle")
        .call(xAxis)
        .selectAll("text")	
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-70)" 
                });
}

function addNavBarClickHandler() {
    var dom = document.getElementsByClassName("sidenav")[0];
    var i;
    console.log(dom.children, dom.children.length);
    for (i = 0; i < dom.children.length; i++) {
        dom.children[i].onclick = function () {
            for (var j = 0; j < this.parentElement.children.length; j++) {
                this.parentElement.children[j].classList.remove("highlight");
            }
            this.classList.add("highlight");
            navElementClicked(this.id);
        };
    }
}

function navElementClicked(id) {
    document.curClickedNavId = id;
    var uri = makeUri(id);
    //console.log(uri);
    setStates(id, uri);
}

function setStates(id, uri, conditions) {
    document.curClickedNavId = id;
    document.curQueryUri = uri;
}

function makeUri(id) {
    id = id || document.curClickedNavId || document.defaultQuery.dom_id;
    var uri = id;
    if (id == "places") {
        var end = document.querySelector('input[name="Places"]:checked').value;
        console.log("end", end);
        if (end == "other") {
            console.log(document.getElementById("other_place_name").value);
            uri = uri + "/" + document.getElementById("other_place_name").value;
        } else if (end != "all") {
            uri = uri + "/" + end;
        }
    } else if (id == "visits") {
        uri += getConditionsUri();
    }
    return uri;
}

function getConditionsUri() {
    var condition_uri = "";
    if (!document.curConditions) {
        var params = "?";
        params = params + "dayOfWeek=" + document.getElementById("dayOfWeek").value;
        params = params + "&season=" +  document.getElementById("Season").value.toUpperCase();
        params = params + "&weather=" +  document.getElementById("Weather").value.toUpperCase();

        condition_uri += params;
    }
    return condition_uri;
}

function getData(uri, dom_id, next) {
    uri = uri || document.curQueryUri || document.defaultQuery.uri;
    dom_id = dom_id || document.curClickedNavId || document.defaultQuery.dom_id;
    if (document.cache[uri]) {
        console.log("found cached data");
        var data = document.cache[uri];
        next(data);
    } else {
        // not found in cache, 
        // jQuery cross domain ajax
        console.log(`fetching data from backend api: ${config.backend.hostDomain + uri}`);
        $.ajax({
            type: 'GET',
            url: config.backend.hostDomain + uri,
            success: (function (data) {
                console.log(`${data.length} rows of data fetched successfully from ${uri}`);
                var parsed = parseData(dom_id, data);
                document.cache[uri] = data; // cache the results
                next(data);
            }),
            error: function() { alert('Failed!'); }
        });
    }
}