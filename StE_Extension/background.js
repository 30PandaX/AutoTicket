'use strict';

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
  //Fetch Case by Case Number
  let responseCase = await fetch('https://api2.sprinklr.com/api/v2/case/case-numbers?case-number='+caseNo, config);
  let infoCase = await responseCase.json();

  //'infoCase' is the JSON object that is to be placed in storage
  //set key:value pair in local storage
  chrome.storage.local.set({CaseData: infoCase}, function() {
    console.log("Stored infoCase JSON.");
  });

  //Fetch Profile by sntype and snUserId
  let contactId = infoCase.data[0].contact.id;
  let snType = contactId.substr(0, contactId.indexOf("_"));
  let snUserId = contactId.substr(contactId.indexOf("_")+1);
  let responseProfile = await fetch('https://api2.sprinklr.com/api/v2/profile?snType='+snType+'&snUserId='+snUserId, config);
  let infoProfile = await responseProfile.json();
  chrome.storage.local.set({ProfileData: infoProfile}, function() {
    console.log("Stored ProfileData JSON.");
  });
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
        let caseNoStartIndex = tab[0].url.indexOf("qId=NUM_") + 8;
        let caseNoEndIndex = tab[0].url.indexOf("&", caseNoStartIndex) ;
        let caseNo = parseInt(tab[0].url.substr(caseNoStartIndex, caseNoEndIndex));
        apiCall(caseNo);
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
