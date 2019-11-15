'use strict';

function autofill() {
  //Date of Customer Post
  var dateOfCustomer = document.querySelector("#Left36");
  dateOfCustomer.readOnly = false;
  dateOfCustomer.value = "11/15/2019";
  dateOfCustomer.readOnly = true;

  //Time of  Customer Post
  document.querySelector("#igtxtLeft37").value = "12:00";
  //AM or PM
  document.querySelector("#Left37_ampm").value = "PM";

  //Tonality
  document.querySelector("#Memo64").value = "Positive";

  //Social Media Channel
  document.querySelector("#Memo34").value = "Twitter";

  //Interaction Location
  document.querySelector("#Memo71").value = "Comment / Tweet";

  //Customer Name
  document.querySelector("#Memo42").value = "John Smith";

  //Customer Number (if known)
  document.querySelector("#Memo41").value = "000001";

  //Customer's Post
  document.querySelector("#steps_to_reproduce").value = "Hello world";

  //Link to Interaction
  document.querySelector("#Right40").value = "https://www.sprinklr.com";
}


function getFromStorage() {
  //TODO: error handling

  chrome.storage.local.get("SprinklrData", function(result) {
    //alert(JSON.stringify(result));

    console.log("retrieved message: "+result["SprinklrData"]);
  });

  //now that the data has been used, remove it from local storage
  chrome.storage.local.remove(["SprinklrData"], function() {
    console.log("deleted message");
  });
}


getFromStorage();

autofill();
