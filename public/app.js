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
    addNavBarClickHandler();
}

function printTable(table, data) {
    if (!data) {
        alert("Nothing retrieved...");
        return;
    }

    /* clean the canvas*/
    table.innerHTML = "";

    var n = data.length;
    if (n == 0) {
        alert("Empty table, nothing to print...");
        return;
    }
    const keys = Object.keys(data[0]);
    var m = keys.length;
    if (m == 0 || n == 0) {
        alert("Empty table, nothing to print...");
        return;
    }
    var row, cell, i, j;
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
}

function addNavBarClickHandler() {
    var dom = document.getElementsByClassName("sidenav")[0];
    var i;
    console.log(dom.children, dom.children.length);
    for (i = 0; i < dom.children.length; i++) {
        dom.children[i].onclick = function () {navElementClicked(this.id);};
    }
}

function navElementClicked(id) {
    var uri = id;
    if (id == "places") {
        var end = document.querySelector('#place-filter:checked').value;
        console.log("end", end);
        if (end != "all") {
            uri = uri + "/" + end;
        }
    } else if (id == "visits") {
        var params = "?";
        params = params + "dayOfWeek=" + document.getElementsByName("dayOfWeek")[0].value;
        params = params + "&season=" +  document.querySelector('#season-filter:checked').value.toUpperCase();
        params = params + "&weather=" +  document.querySelector('#weather-filter:checked').value.toUpperCase();

        uri += params;
    }
    document.curClickedNavId = id;
    //console.log(uri);
    getData(document.getElementById("query_table"), uri, printTable);
}

function getData(d, uri, next) {
    // jQuery cross domain ajax
    console.log(config.backend.hostDomain + uri);
    $.ajax({
        type: 'GET',
        url: config.backend.hostDomain + uri,
        success: (function (data) {
            next(d, data);
        }),
        error: function() { alert('Failed!'); }
    });
}

function createXMLHttp() {
    //If XMLHttpRequest is available then using it
    if (typeof XMLHttpRequest !== undefined) {
      return new XMLHttpRequest;
    //if window.ActiveXObject is available than the user is using IE...so we have to create the newest version XMLHttp object
    } else if (window.ActiveXObject) {
      var ieXMLHttpVersions = ['MSXML2.XMLHttp.5.0', 'MSXML2.XMLHttp.4.0', 'MSXML2.XMLHttp.3.0', 'MSXML2.XMLHttp', 'Microsoft.XMLHttp'],
          xmlHttp;
      //In this array we are starting from the first element (newest version) and trying to create it. If there is an
      //exception thrown we are handling it (and doing nothing ^^)
      for (var i = 0; i < ieXMLHttpVersions.length; i++) {
        try {
          xmlHttp = new ActiveXObject(ieXMLHttpVersions[i]);
          return xmlHttp;
        } catch (e) {
        }
      }
    }
  }