'use strict';

function copyToStorage(info) {
  //'info' is the JSON object that is to be placed in storage
  //set key:value pair in local storage
  chrome.storage.local.set({SprinklrData: info}, function() {
    console.log("Stored JSON.");
  });
}

async function apiCall(caseNo) {
  let key = 'byt9mu7ugfau3qyarkc6mwzp';
  let token = 'q8nCb2suOOoFrTh/gOpvdg1qhPNzPj6p3aVMMWE7y9BhMTA5ZDQxYTBhNDljNzIzMDk5NjlkYzYwMThjMTc2OQ==';
  let config = {
    method: 'GET',
    headers: {
      'key': key,
      'Authorization': 'Bearer '+token,
      'Content-Type': 'application/json',
      'Accept' : 'application/json'
    }
  };
  //now we are ready to make the API call
  let response = await fetch('https://api2.sprinklr.com/api/v2/case/case-numbers?case-number='+caseNo, config);
  let info = await response.json();

  //put the JSON into storage
  copyToStorage(info);
};


//listen for user commands
chrome.commands.onCommand.addListener(function(command) {
  if (command == "copyFromSprinklr") {
    //get the active tab from the current window (the tab that the user clicked on most recently)
    chrome.tabs.query({active:true, lastFocusedWindow:true}, function(tab) {
      //get ID of current tab and run paste.js in that tab
      //but first, make sure that the user is in an Elementool window
      //TODO: check for more specific path (rather than just sprinklr.com)?
      if(tab[0].url.includes("sprinklr.com")) {
        //TODO: get the case number from the Sprinklr page rather than using hard-coded value
        apiCall(69902);
      } else {
        //TODO: Should we display an alert, or would it be better to not do anything?
        alert("This command (Alt+C) only works in Sprinklr");
      }
    });
  } else if (command == "pasteToElementool") {
    //get the active tab from the current window (the tab that the user clicked on most recently)
    chrome.tabs.query({active:true, lastFocusedWindow:true}, function(tab) {
      //get ID of current tab and run paste.js in that tab
      //but first, make sure that the user is in an Elementool window
      //TODO: check for more specific path (rather than just elementool.com)?
      if(tab[0].url.includes("elementool.com")) {
        chrome.tabs.executeScript(tab[0].id, {file: 'paste.js'});
      } else {
        //TODO: Should we display an alert, or would it be better to not do anything?
        alert("This command (Alt+V) only works in Elementool");
      }
    });
  }
});
