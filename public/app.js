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
    document.cache = {};
    addNavBarClickHandler();
    document.defaultQuery = { 
        uri: "/places",
        dom_id: "places"
    };
    var uri, id;
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
    row = table.insertRow(0);
    for (j = 0; j < m; j++) {
        cell = row.insertCell(j);
        cell.innerHTML = keys[j];
    }
    for (i = 0; i < n; i++) {
        row = table.insertRow(i+1);
        for (j = 0; j < m; j++) {
            cell = row.insertCell(j);
            cell.innerHTML = data[i][keys[j]];
        }
    }
    table_info.innerHTML = `${n} rows fetched.`;
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