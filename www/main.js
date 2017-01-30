var theDB;

function init() {

  console.log("Entering init");
  alert("init");
  
  console.log("Leaving init");
}

function gotoMap() {
  $.mobile.changePage("#viewMap", "slide", false, true);
}
