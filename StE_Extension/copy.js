'use strict';

//get the message ID from the current page
let messageID = document.querySelector(".messageId.flex-row-container").querySelector('[role="presentation"]').innerHTML;
//send the message ID to background.js
chrome.runtime.sendMessage(messageID);
