'use strict';

//listen for user commands
chrome.commands.onCommand.addListener(function(command) {
  //console.log('Command:', command);

  if (command == "copyFromSprinklr") {
    //TODO

  } else if (command == "pasteToElementool") {
    //get the active tab from the current window (the tab that the user clicked on most recently)
    chrome.tabs.query({active:true, lastFocusedWindow:true}, function(tab) {
      //get ID of current tab and run paste.js in that tab
      //but first, make sure that the user is in an Elementool window
      if(tab[0].url.includes("elementool.com")) {
        chrome.tabs.executeScript(tab[0].id, {file: 'paste.js'});
      } else {
        alert("This command (Ctrl+Shift+V) only works in Elementool");
      }
    });
  }

});
