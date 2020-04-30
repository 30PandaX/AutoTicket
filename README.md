

# Introduction
AutoTicket is a chrome extension that ease the process to copy customer conversations from Sprinklr and paste to Elementool.

### Table of Content
- [Installation & Update](#Installation-&-Update)
- [Commands](#Commands)
- [Requirements and Limitations](#Requirements-and-Limitations)
- [Permissions](#Permissions)
- [Developer Guide](#Develoepr-Guide)
  - [Branch Description](#Branch-Description)
  - [File Description](#File-Description)
  - [Map of Ticket Content](#Map-of-Ticket-Content)
  - [Future Development](#Future-Development)

# Installation & Update
Visit the [AutoTicket chrome extension page] to install.
Extensions are updated by Chrome without user intervention in 3-6 hours.

Users can force Google Chrome to update extensions immediately by performing the following steps:
1. go to chrome://extensions
2. turn on developer mode
3. click the "Update" button that appears and wait for the “Extensions updated” confirmation message in the bottom left corner of the screen
4. turn off developer mode

> More Details on [How to install and manage extensions].

# Commands
AutoTicket requires Sprinklr or Elementool webpage being active when user invoke the following keystrokes to perform corresponding actions.

* `Alt + c` - copy from Sprinklr
* `Alt + v` - paste to Elementool

# Requirements and Limitations
AutoTicket requires Sprinklr API functionalities which requires:
- Sprinklr account (Email: randy.vu@sleepnumber.com) and Sprinklr developer account (Username: sleepnumber4950) being active
- Sprinklr API authentication token being updated every 30 days

AutoTicket requires Google Chrome Extension functionalities which requires:
- Chrome
- Chrome webstore developer account for manually update API authentication
> For getting new tokens and pushing updates, checkout the [maintenance guide].


AutoTicket is limited by Sprinklr to have at most:
- 10 copy actions per second
- 250 copy actions per hour

# Permissions
AutoTicket requires the following:

* **Read and write to local storage**: required for temporarily storing data between coping and pasting
* **Access to activeTab**: required for accessing case info on Sprinklr and pasting data on Elementool
* **[Sprinklr API Call]<sup>5</sup>**: required for gather required data to fill ticket


# Developer Guide
> For bug fixing and future developement use.

### Branch Description
| Status          | Branch                  | Description                                   |
|-----------------|-------------------------|-----------------------------------------------|
| **base branch** | **version 2**           | 1. get MessageID in "Agent Console" view      |
|                 |                         | 2. fetch message by MessagID                  |

### File Description
| Filename                            | Description                                                                          |
| ----------------------------------- | ------------------------------------------------------------------------------------ |
| manifest.json                       | chrome extension manifest                                                            |
| getMsgID.js                         | extract messageID from sprinklr webpage                                              |
| background.js                       | 1. listen to commands and check if commands are called in the correct tab            |
|                                     | 2. make API call                                                                     |
|                                     | 3. put API response json to storage                                                  |
| paste.js                            | 1. get response json from storage                                                    |
|                                     | 2. find corresponding data in json and fill elementool table                         |
|                                     | 3. delete data from storage                                                          |
| hello.html, helloStyle.css          | floating prompt when hover above extension icon                                      |
| icon16.png, icon48.png, icon128.png | chrome extension icon in different resolution                                        |
| README.md                           | documentation                                                                        |
| maintenance Guide.md                | guide for developer and maintainer to get new token and push updates (not yet added) |
| Testing Installation Update Guide   | guide for testing users to install and update chrome extension                       |

### Map of Ticket Content
| Elementool Table Entry           | Query Selector      |     | API Response JSON Value <sup>1                                             | AutoTicket Behavior | Remark                                       |
| -------------------------------- | ------------------- | --- | -------------------------------------------------------------------------- | ------------------- | -------------------------------------------- |
| Tonality                         | #Memo64             |     | `data.enrichments.sentiment`                                               | Leave empty         | Commented because Sprinklr's tonality sucks  |
| Follow Up                        |                     |     | /                                                                          | Leave Empty         | What is "follow up"?                         |
| Issue                            |                     |     | /                                                                          | Leave Empty         | Unable to determine without Machine Learning |
| Social Media Channel             | #Memo34             |     | `data.channelType`                                                         | Fill <sup>2         |                                              |
|                                  |                     |     | `data.permalink`                                                           |                     |                                              |
| Interaction Location             | #Memo71             |     | `data.channelType`                                                         | Fill <sup>3         |                                              |
|                                  |                     |     | `data.permalink`                                                           |                     |                                              |
|                                  |                     |     | `data.permalink.workflow.customProperties ["5c490fd3e4b0afd92c3e6a7a"][0]` |                     | `messageType`                                |
| Customer Name                    | #Memo42             |     | `data.senderProfile.username`                                              | Fill                |                                              |
| Customer Number                  | #Memo41             |     | /                                                                          | Leave Empty         |                                              |
| Customer's Post                  | #steps_to_reproduce |     | `data.content.text`                                                        | Fill <sup>4         |                                              |
|                                  |                     |     | `data.textEntities.message[0]`                                             |                     |                                              |
| Sleep Number's Response          |                     |     | /                                                                          | Leave Empty         |                                              |
| Additional Details               |                     |     | /                                                                          | Leave Empty         |                                              |
| Link to Interaction              | #Right40            |     | /                                                                          | Leave Empty         |                                              |
| Reported By                      |                     |     | /                                                                          | Do Not Change       | Filled by Elementool                         |
| Date of Customer Post            | #Left36             |     | `data.createdTime`                                                         | Fill                |                                              |
| Time of Customer Post            | #igtxtLeft37        |     | Same As Above                                                              | Fill                |                                              |
| Time of Customer Post AM/PM      | #Left37_ampm        |     | Same As Above                                                              | Fill                |                                              |
| Date of Sleep Number Reply       | #Left38             |     | /                                                                          | Fill                | Current System Time                          |
| Time of Sleep Number Reply       |                     |     | /                                                                          | Leave Empty         |                                              |
| Time of Sleep Number Reply AM/PM |                     |     | /                                                                          | Leave Empty         |                                              |

### Future Development
* Expand channelType such as LinkedIn (through Sprinklr) and SleepNumber Website reviews
* Combine multiple un-replied comments into one Elementool tickets
* True clipboard behavior
* Remove the required maintenance process by finding permanent token, or eliminating token usage (gather data with querySelector), or finding automated token update process
* Add machine learning to identify customer's tonality and issue


#### Footnote
1: `data` = `response.json().data`

2: How to determine Social Media Channel

| `channelType` | Social Media Channel              | Remark                                                                                                 |
| ------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------ |
| FACEBOOK      | "Career's Facebook" or "Facebook" | "Career's Facebook" permalink contains "facebook.com/sleepnumbercareers" or "facebook.com/71091028689" |
| TWITTER       | "Twitter"                         |                                                                                                        |
| INSTAGRAM     | "Instagram"                       |                                                                                                        |
| YOUTUBE       | "Facebook"                        | Because Elementool doesn't have YouTube. Add speical mark before Customer's Post.                      |
| Others        | ""                                | Leave Empty                                                                                            |

3: How to determine Interaction Location

| `channelType` | Public                     | Private       | Remark                                |
| ------------- | -------------------------- | ------------- | ------------------------------------- |
| FACEBOOK      | Comment/Tweet or Wall Post | PM/DM         | Wall Post is rare. What is Wall Post? |
| TWITTER       | Comment/Tweet              | PM/DM         |                                       |
| INSTAGRAM     | Tier2                      | Tier2         |                                       |
| YOUTUBE       | Comment/Tweet              | Comment/Tweet |                                       |
| Others        | ""                         | ""            | Leave Empty                           |

4: Changes on Customer's Post

| IF                                                              | THEN                                  | Remark |
| --------------------------------------------------------------- | ------------------------------------- | ------ |
| hyperlink starts with "#" or "@"                                | keep original                         |        |
| hyperlink that has `msgInfo.textEntities.message[i].url`        | show url                              |        |
| hyperlink that has `msgInfo.textEntities.message[i].screenName` | show screenName                       |        |
| `channelType` is  YouTube                                       | add "\*\*\*YOUTUBE COMMENT***" before |        |
| Others                                                          | replace with "REDACTED"               | Email  |

5: Assumptions made on what's inside API Response json

| API Response JSON Value        | Assumption                                                                   | Conditional Check Before Accessing       |
| ------------------------------ | ---------------------------------------------------------------------------- | ---------------------------------------- |
| `data.enrichments.sentiment`   | May not be present                                                           | Yes                                      |
| `data.channelType`             | Always present                                                               | No                                       |
| `data.permalink`               | Always present in Facebook and public Twitter <br> Not present in Twitter PM | Yes; used to identify PM/DM from Twitter |
| `messageType`                  | May not be present                                                           | Yes                                      |
| `data.content.text`            | Always present                                                               | No                                       |
| `data.textEntities.message[0]` | May not be present                                                           | Yes                                      |
| `data.senderProfile.username`  | Always present                                                               | No                                       |
| `data.createdTime`             | Always present                                                               | No                                       |

[Sprinklr API Call]: https://developer.sprinklr.com/docs/read/api_20/messages_api_20/Fetch_Message_by_ID_and_Source_Type
[AutoTicket chrome extension page]: https://chrome.google.com/webstore/detail/autoticket/gbijbmobpffbljlndmckfafkmkdacdcn
[How to install and manage extensions]: https://support.google.com/chrome_webstore/answer/2664769?hl=en
[maintenance guide]: https://github.com/SleepNumberInc/AutoTicket/blob/version2/maintenance%20Guide.pdf
