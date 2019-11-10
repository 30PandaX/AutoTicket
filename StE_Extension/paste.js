'use strict';

function autofill() {
  //Date of Customer Post
  //NOTE: might not be able to automate this. Elementool forces use of GUI to select date.

  //Time of  Customer Post
  document.querySelector("#igtxtLeft37").value = "12:00";
  //AM or PM
  document.querySelector("#Left37_ampm").value = "PM";

  //Tonality
  document.querySelector("#Memo64").value = "Positive";

  //Social Media Channel
  document.querySelector("#Memo34").value = "Twitter";

  //Interaction Location
  document.querySelector("#Memo71").value = "Comment / Tweet";

  //Customer Name
  document.querySelector("#Memo42").value = "John Smith";

  //Customer Number (if known)
  document.querySelector("#Memo41").value = "000001";

  //Customer's Post
  document.querySelector("#steps_to_reproduce").value = "Hello world";

  //Link to Interaction
  document.querySelector("#Right40").value = "https://www.sprinklr.com";
}


autofill();
