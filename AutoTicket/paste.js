'use strict';
function intToSentiment(num) {
  if (num < 0) {return "Negative";}
  else if (num == 0) {return "Neutral";}
  else if (num > 0) {return "Positive";}
  else {return "";}
}

function formatChannelName(name, link) {
  //TODO: add more channels?
  if (name == "FACEBOOK") {
    if(link.includes("sleepnumbercareers")) {
      return "Career's Facebook";
    } else {
      return "Facebook";
    }
  }
  else if (name == "TWITTER") {return "Twitter";}
  else if (name == "INSTAGRAM") {return "Instagram";}
  else {return "";}
}

function findLocation(name, link, visibility) {
  if (name == "FACEBOOK") {
    //TODO: wasn't able to find a wall post to test. Not sure if this is working correctly
    if (visibility == "Private") {
      return "PM / DM";
    } else if (link.includes("comment")) {
      return "Comment / Tweet";
    } else {
      return "Wall Post";
    }
  } else if (name == "TWITTER") {
    if (visibility == "Private") {
      return "PM / DM";
    } else {
      return "Comment / Tweet";
    }
  } else if (name == "INSTAGRAM") {
    return "Tier2";
  } else {
    return "";
  }
}

function autofill() {
  //TODO: error handling

  //retrieve the JSON and use it to fill in data on Elementool
  chrome.storage.local.get("MsgData", function(result) {
    let msgInfo = result["MsgData"].data;

  // replace link with its screen name if link is not
  // 1. url or 2. starts with @
  if (msgInfo.hasOwnProperty('textEntities')){
    if(msgInfo.textEntities.hasOwnProperty('message')){
      if(msgInfo.textEntities.message[0].hasOwnProperty('screenName')){
        let replaceStart = msgInfo.textEntities.message[0].indices[0];
        let replaceEnd = msgInfo.textEntities.message[0].indices[1];
        let replaceWord = msgInfo.textEntities.message[0].screenName;
        let msgLength = msgInfo.content.text.length;
        if(msgInfo.content.text.substring(replaceStart, replaceStart+1) != "@"){
          msgInfo.content.text = msgInfo.content.text.substring(0, replaceStart) + replaceWord + msgInfo.content.text.substring(replaceEnd, msgLength);
        }
      }
    }
  }

  //Customer's Post
  document.querySelector("#steps_to_reproduce").value = msgInfo.content.text;

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
  document.querySelector("#igtxtLeft37").select();
  window.getSelection().removeAllRanges();

  // AM or PM
  // format PM
  let mIndex = time.indexOf("M");
  document.querySelector("#Left37_ampm").value = time.substr(mIndex-1, mIndex);

  //Date of Sleep Number Reply
  let dateOfReplyField = document.querySelector("#Left38");
  let replyDate = new Date();
  let replyDateString = ('0' + (replyDate.getMonth()+ 1)).slice(-2) + '/' +
                        ('0' + replyDate.getDate()).slice(-2) + '/' +
                        replyDate.getFullYear();
  dateOfReplyField.readOnly = false;
  dateOfReplyField.value = replyDateString;
  dateOfReplyField.readOnly = true;

  if (msgInfo.hasOwnProperty('enrichments')){
    if (msgInfo.enrichments.hasOwnProperty('sentiment')){
      //Tonality
      document.querySelector("#Memo64").value = intToSentiment(msgInfo.enrichments.sentiment);
    }
  }

  if (msgInfo.hasOwnProperty('channelType') && msgInfo.hasOwnProperty('permalink')){
        //Social Media Channel
        document.querySelector("#Memo34").value = formatChannelName(msgInfo.channelType, msgInfo.permalink);
        if (msgInfo.hasOwnProperty('workflow')){
          if (msgInfo.workflow.hasOwnProperty('customProperties')){
            if (msgInfo.workflow.customProperties.hasOwnProperty('5c490fd3e4b0afd92c3e6a7a')){
              //Interaction Location
              document.querySelector("#Memo71").value = findLocation(msgInfo.channelType, msgInfo.permalink, msgInfo.workflow.customProperties["5c490fd3e4b0afd92c3e6a7a"][0]);
            // } else {
            //   document.querySelector("#Memo71").value = findLocation(msgInfo.channelType, msgInfo.permalink, "Public"); // default to be public
            }
          }
        }
      }

    //AutoTicket checkbox
    document.querySelector("#Memo84").checked = true;

    //Customer Number (if known)
    //document.querySelector("#Memo41").value = "000001";

    //Link to Interaction
    //document.querySelector("#Right40").value = "https://www.sprinklr.com";

    //Customer Name
    document.querySelector("#Memo42").value = msgInfo.senderProfile.username;
  });

  //now that the data has been used, remove it from local storage
  chrome.storage.local.remove(["MsgData"], function() {
    console.log("deleted MsgData JSON.");
  });
}


autofill();
