'use strict';

async function apiCall(msgID) {
  let key = 'byt9mu7ugfau3qyarkc6mwzp';
  let token = 'gqFL7LEelkPYTQ2MrybwR7/MmabIBEuA9HODfPhbYacxMGQ4ZWFjNzMxNTQwMDM5NzkwMWIyODE5NTQ5MmNiZg==';
  let refresh_token = 'y9P+eD4R05OO+FmDJt73Cu2GhU6aObe0W2dHRU0nz6RkMzI1NDdhZjZhN2FmMGMxNjk3MzdmMjk3YzRlYmZhZQ==';
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
  var msgResponse = await fetch('https://api2.sprinklr.com/api/v2/message?sourceType=ACCOUNT&id='+msgID, config);
  var msgInfo = await msgResponse.json();

  if (msgInfo.errors.length > 0) {
    if (msgInfo.errors[0].code == 404) {
      msgResponse = await fetch('https://api2.sprinklr.com/api/v2/message?sourceType=LISTENING&id='+msgID, config);
      msgInfo = await msgResponse.json();
    }
  }

  console.log(msgInfo);

  chrome.storage.local.set({MsgData: msgInfo}, function() {
    console.log("Stored msgInfo JSON.");
  });
};

//listen for message from copy.js once it has found the message ID
chrome.runtime.onMessage.addListener(function(message) {
    //trim the PID_ from the front of the message
    message = message.substring(4);
    console.log(message);
    apiCall(message);
});


//listen for user commands
chrome.commands.onCommand.addListener(function(command) {
  if (command == "copyFromSprinklr") {
    //get the active tab from the current window (the tab that the user clicked on most recently)
    chrome.tabs.query({active:true, lastFocusedWindow:true}, function(tab) {
      //get ID of current tab and run paste.js in that tab
      //but first, make sure that the user is in an Elementool window
      //TODO: check for more specific path (rather than just sprinklr.com)?
      if(tab[0].url.includes("sprinklr.com")) {
        //have copy.js get the message ID from the page's HTML
        chrome.tabs.executeScript(tab[0].id, {file: 'getMsgID.js'});
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
