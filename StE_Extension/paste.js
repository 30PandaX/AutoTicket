'use strict';
function intToSentiment(num) {
  if (num == -1) {return "Negative";}
  else if (num == 0) {return "Neutral";}
  else if (num == 1) {return "Positive";}
  else {return "";}
}

function formatChannelName(name) {
  //TODO: add more channels?
  if (name == "FACEBOOK") {return "Facebook";}
  else if (name == "TWITTER") {return "Twitter";}
  else {return "";}
}

function autofill() {
  //TODO: error handling

  //retrieve the JSON and use it to fill in data on Elementool
  chrome.storage.local.get("MsgData", function(result) {
    let msgInfo = result["MsgData"].data;

    // Date of Customer Post
    // format 11/15/2019
    let date = new Date(msgInfo.createdTime);
    let dateOfCustomer = document.querySelector("#Left36");
    let datestring = ('0' + (date.getMonth()+ 1)).slice(-2) + '/' +
                    ('0' + date.getDate()).slice(-2) + '/' +
                    date.getFullYear();

    dateOfCustomer.readOnly = false;

    dateOfCustomer.value = datestring;
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
    document.querySelector("#Memo64").value = intToSentiment(msgInfo.enrichments.sentiment);

    //Social Media Channel
    document.querySelector("#Memo34").value = formatChannelName(msgInfo.channelType);

    //Interaction Location
    //document.querySelector("#Memo71").value =

    //Customer Number (if known)
    //document.querySelector("#Memo41").value = "000001";

    //Customer's Post
    document.querySelector("#steps_to_reproduce").value = msgInfo.content.text;

    //Link to Interaction
    // document.querySelector("#Right40").value = msgInfo.permalink;

    //Customer Name
    document.querySelector("#Memo42").value = msgInfo.senderProfile.username; // or username
  });

  //now that the data has been used, remove it from local storage
  chrome.storage.local.remove(["MsgData"], function() {
    console.log("deleted MsgData JSON.");
  });
}


autofill();
