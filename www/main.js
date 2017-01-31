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

function gotoMap() {
  $.mobile.changePage("#viewMap", "slide", false, true);
}
