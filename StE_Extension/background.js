'use strict';

function copyToStorage(info) {
  //TODO: replace 'value' with meaningful data from Sprinklr
  var value = info;

  //set key:value pair in local storage
  chrome.storage.local.set({SprinklrData: value}, function() {
    console.log("Stored message: "+value);
  });

}

async function apiCall(caseNo) {
  let key = 'byt9mu7ugfau3qyarkc6mwzp' ;
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

  let response = await fetch('https://api2.sprinklr.com/api/v2/case/case-numbers?case-number='+caseNo, config);
  console.log(response);
  let info = await response.json();
  console.log(info);
  console.log(info.data[0].description)

  copyToStorage(info);
};


//listen for user commands
chrome.commands.onCommand.addListener(function(command) {
  //console.log('Command:', command);

  if (command == "copyFromSprinklr") {
    //get the active tab from the current window (the tab that the user clicked on most recently)
    chrome.tabs.query({active:true, lastFocusedWindow:true}, function(tab) {
      //get ID of current tab and run paste.js in that tab
      //but first, make sure that the user is in an Elementool window
      //TODO: check for more specific path (rather than just sprinklr.com)?
      if(tab[0].url.includes("sprinklr.com")) {
        apiCall(69902);
        //chrome.tabs.executeScript(tab[0].id, {file: 'copy.js'});
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
