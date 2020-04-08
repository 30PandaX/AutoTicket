'use strict';

function getID() {
  //get the message ID from the current page
  let str = document.getElementsByClassName("_1w_y").innerHTML;
  let messageID = str.substring(30, str.length);
  //send the message ID to background.js
  chrome.runtime.sendMessage(messageID);
}

getID();
