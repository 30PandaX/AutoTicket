'use strict';

async function apiCall() {
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

  let response = await fetch('https://api2.sprinklr.com/api/v2/case/case-numbers?case-number=69902', config);
  console.log(response);
  let info = await response.json();
  console.log(info);
}

function copyToStorage() {
  //TODO: replace 'value' with meaningful data from Sprinklr
  var value = "Hello World";

  //set key:value pair in local storage
  chrome.storage.local.set({SprinklrData: value}, function() {
    console.log("Stored message: "+value);
  });

}

//apiCall();

//copyToStorage();
