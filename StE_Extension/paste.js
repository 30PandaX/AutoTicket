'use strict';

function autofill() {
  //TODO: error handling

  //retrieve the JSON and use it to fill in data on Elementool
  chrome.storage.local.get("CaseData", function(result) {
    let infoCase = result["CaseData"].data[0];

    // Date of Customer Post
    // format 11/15/2019
    let date = new Date(infoCase.createdTime);
    let dateOfCustomer = document.querySelector("#Left36");
    dateOfCustomer.readOnly = false;
    dateOfCustomer.value = date.toLocaleDateString();
    dateOfCustomer.readOnly = true;

    // Time of Customer Post
    // format 12:00
    let time = date.toLocaleTimeString();
    let secondColonIndex = time.indexOf(":", 4);
    document.querySelector("#igtxtLeft37").value = time.substr(0, secondColonIndex);
    // AM or PM
    // format PM
    let mIndex = time.indexOf("M");
    document.querySelector("#Left37_ampm").value = time.substr(mIndex-1, mIndex);;

    //Tonality
    document.querySelector("#Memo64").value = infoCase.workflow.customFields["5c3f7f66e4b00ecbb3523869"];

    //Interaction Location
    document.querySelector("#Memo71").value = "Comment / Tweet";

    //Customer Number (if known)
    document.querySelector("#Memo41").value = "000001";

    //Customer's Post
    document.querySelector("#steps_to_reproduce").value = infoCase.description;

    //Link to Interaction
    document.querySelector("#Right40").value = "https://www.sprinklr.com";
  });

  chrome.storage.local.get("ProfileData", function(result) {
    let infoProfile = result["ProfileData"].data;

    //Customer Name
    document.querySelector("#Memo42").value = infoProfile.profiles[0].name; // or username

    //Social Media Channel
    var snChannel = infoProfile.profiles[0].channelType.toLowerCase();
    snChannel = snChannel.charAt(0).toUpperCase()+snChannel.slice(1);
    document.querySelector("#Memo34").value = snChannel;

  });

  //now that the data has been used, remove it from local storage
  chrome.storage.local.remove(["CaseData"], function() {
    console.log("deleted CaseData JSON.");
  });

  chrome.storage.local.remove(["ProfileData"], function() {
    console.log("deleted ProfileData JSON.");
  });


}


autofill();
