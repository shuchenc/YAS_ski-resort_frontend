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
    var d = document.getElementById("query_table");
    // jQuery cross domain ajax
    $.ajax({
        type: 'GET',
        url: "https://yas-ski-resort.herokuapp.com/places",
        crossDomain: true,
        headers: {  'Access-Control-Allow-Origin': '*' },
        //dataType: 'jsonp',
        success: (function (data) {
            console.log(data);
        }),
        error: function() { alert('Failed!'); }
    });
}

function getData(d, uri) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', config.backend.hostDomain+uri);
    //xhr.setRequestHeader("Access-Control-Request-Headers", "x-requested-with");
    xhr.onload = function() {
        if (xhr.status === 200) {
            d.innerHTML = xhr.responseText;
        }
        else {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();
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