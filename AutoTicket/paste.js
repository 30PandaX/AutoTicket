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
    //first check if it's an instagram post that sprinklr classified as facebook
    //for example, this seems to be the case for instagram dark post comments
    if(link.includes("instagram.com")) {
      return "Instagram";
    }
    //sometimes sprinklr provides a link of the form www.facebook.com/71091028689
    //instead of www.facebook.com/sleepnumbercareers
    //www.facebook.com/71091028689 just redirects to sleepnumbercareers, so check for either
    if(link.includes("facebook.com/sleepnumbercareers") || link.includes("facebook.com/71091028689")) {
      return "Career's Facebook";
    } else {
      return "Facebook";
    }
  }
  else if (name == "TWITTER") {return "Twitter";}
  else if (name == "INSTAGRAM") {return "Instagram";}
  else if (name == "YOUTUBE") {return "Facebook";}
  else {return "";}
}

function findLocation(name, link, visibility) {
  if (name == "FACEBOOK") {
    //first check if it's an instagram post that sprinklr classified as facebook
    //for example, this seems to be the case for instagram dark post comments
    if(link.includes("instagram.com")) {
      return "Tier2";
    }
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
  } else if (name == "YOUTUBE"){
    return "Comment / Tweet";
  } else {
    return "";
  }
}

function replaceTextEntities(messages, text){
  for (var i = 0; i < messages.length; i++) {
    let message = messages[i];
    let replaceStart = message.indices[0];
    let replaceEnd = message.indices[1];
    let tag = text.substring(replaceStart, replaceStart+1);
    if (tag != "@" && tag != "#") {
      var replaceWord = "REDACTED";
      if (message.hasOwnProperty('screenName')) {
        replaceWord = message.screenName;
      } else if (message.hasOwnProperty('url')) {
        replaceWord = message.url;
      }
      text = text.substring(0, replaceStart) + replaceWord + text.substring(replaceEnd, text.length);
    }
  }
  return text;
}

function addSpecialNote(name, text) {
  if (name == "YOUTUBE") {
    return "***YOUTUBE COMMENT***\n" + text;
  } else {
    return text;
  }
}

function autofill() {
  //TODO: error handling

  //retrieve the JSON and use it to fill in data on Elementool
  chrome.storage.local.get("MsgData", function(result) {
    let msgInfo = result["MsgData"].data;

  // Always show links tagged with @ or #
  // Display screen name and url
  // Other types of links will be REDACTED
  if (msgInfo.hasOwnProperty('textEntities')){
    if(msgInfo.textEntities.hasOwnProperty('message')){
      msgInfo.content.text = replaceTextEntities(msgInfo.textEntities.message, msgInfo.content.text);
    }
  }

  // add special identifier for SN internal use, eg: "***YOUTUBE COMMENT***"
  msgInfo.content.text = addSpecialNote(msgInfo.channelType, msgInfo.content.text);

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
      // document.querySelector("#Memo64").value = intToSentiment(msgInfo.enrichments.sentiment);
      // Editing the extension to exclude tonality -- Katy
    }
  }

  //Social Media Channel
  document.querySelector("#Memo34").value = formatChannelName(msgInfo.channelType, msgInfo.permalink);

  var visibility = "Public";  // default to public
  if (msgInfo.hasOwnProperty('permalink')){
        if (msgInfo.hasOwnProperty('workflow')){
          if (msgInfo.workflow.hasOwnProperty('customProperties')){
            if (msgInfo.workflow.customProperties.hasOwnProperty('5c490fd3e4b0afd92c3e6a7a')){
              visibility = msgInfo.workflow.customProperties["5c490fd3e4b0afd92c3e6a7a"][0];
            // } else {
            //   if (msgInfo.workflow.customProperties.hasOwnProperty('5c3f7af3e4b00ecbb34f5434')) { // Sourced From Listening
            //     if(msgInfo.workflow.customProperties["5c3f7af3e4b00ecbb34f5434"][0] == "No") {
            //       visibility = "Private";
            //     }
            //   }
            }
            //Interaction Location
            document.querySelector("#Memo71").value = findLocation(msgInfo.channelType, msgInfo.permalink, visibility);
          }
        }
      } else {
        //Interaction Location
        document.querySelector("#Memo71").value = findLocation(msgInfo.channelType, "", "Private");
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
