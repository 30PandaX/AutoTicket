'use strict';

function copyToStorage() {
  //TODO: replace 'value' with meaningful data from Sprinklr
  var value = "Hello World";

  //set key:value pair in local storage
  chrome.storage.local.set({SprinklrData: value}, function() {
    console.log("Stored message: "+value);
  });

}

copyToStorage();
