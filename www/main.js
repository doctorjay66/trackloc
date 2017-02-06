var theDB;

function init() {

  console.log("Entering init");
  alert("init");
  theDB = window.openDatabase("ltDB", "1.0", "Loc Tracker", 100 * 1024);
  if(theDB) {
    console.log(theDB);
    console.log("Creating table");
    theDB.transaction(createTable, onTxError, onTxSuccess);
    console.log("Finished creating table");
  } else {
    console.log("theDB object has not been created");
    alert("this code shouldn't ever execute");
  }
  console.log("Leaving init");
}

function createTable(tx) {
  console.log("Entering createTable");
  var sqlStr = 'CREATE TABLE IF NOT EXISTS LOCTRACK (lat INT, long INT, notes TEXT)';
  console.log(sqlStr);
  tx.executeSql(sqlStr, [], onSqlSuccess, onSqlError);
  console.log("Leaving createTable");
}

function onTxSuccess() {
  console.log("TX: success");
}

function onTxError(tx, err) {
  console.log("Entering onTxError");
  var msgText;
  //Did we get an error object (we should have)?
  if(err) {
    //Tell the user what happened
    msgText = "TX: " + err.message + " (" + err.code + ")";
  } else {
    msgText = "TX: Unkown error";
  }
  console.error(msgText);
  alert(msgText);
  console.log("Leaving onTxError");
}

function onSqlSuccess(tx, res) {
  console.log("SQL: success");
  if(res) {
    console.log(res);
  }
}

function onSqlError(tx, err) {
  console.log("Entering onSqlError");
  var msgText;
  if(err) {
    msgText = "SQL: " + err.message + " (" + err.code + ")";
  } else {
    msgText = "SQL: Unknown error";
  }
  console.error(msgText);
  alert(msgText);
  console.log("Leaving onSqlError");
}

function insertRecord(tx) {
  var sqlStr = 'INSERT INTO LOCTRACK (lat, long, notes) VALUES (?, ?, ?)';
  var tmpLat = document.getElementById('editLat').value;
  var tmpLng = document.getElementById('editLong').value;
  var tmpNotes = document.getElementById('editnotes').value;
  alert(tmpLat);
  tx.executeSql(sqlStr, [tmpLat, tmpLng, tmpNotes], onSqlSuccess, onSqlError);
}

function saveRecord() {
  //theDB.transaction(insData, onTxError, onTxSuccess);
  //alert(lat);alert(lng);
  theDB.transaction(insertRecord, onTxError, onTxSuccess);
}

function openView(viewType) {
  var sqlStr = 'SELECT lat, long, notes FROM LOCTRACK';
  theDB.transaction(function(tx) {
    tx.executeSql(sqlStr, [], onQuerySuccess, onQueryFailure);
    }, onTxError, onTxSuccess);
}

function onQuerySuccess(tx, results) {
  console.log("Entering onQuerySuccess");
  if(results.rows) {
    console.log("Rows: " + results.rows);
    var htmlStr = "";
    var len = results.rows.length;
    if(len > 0) {
      for(var i = 0; i < len; i++) {
        var lat = results.rows.item(i).lat;
        var lng = results.rows.item(i).long;
        var notes = results.rows.item(i).notes;
        htmlStr += '<li>Lat: ' + lat + '&nbsp;' + notes+ '</li>';
        //htmlStr += '<li>Lat:</b> ' + lat + '</li>';
        //alert(lat);
      }
      $("#listview").html(htmlStr);
    } else {
      //This should never happen
      alert("No rows.");
    }
  } else {
    alert("No records match selection criteria.");
  }
  console.log("Leaving openView");
}

function onQueryFailure(tx, err) {
  console.log("Entering onQueryFailure");
  var msgText;
  if(err) {
    msgText = "Query: " + err;
  } else {
    msgText = "Query: Unknown error";
  }
  console.error(msgText);
  alert(msgText);
  console.log("Leaving onQueryFailure");
}

function gotoListView() {
  openView(1);
  $.mobile.changePage("#listview", "slide", false, true);
}
