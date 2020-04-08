# AutoTicket
AutoTicket is a chrome extension that ease the process to copy customer conversations from Sprinklr and paste to Elementool.

## How to use AutoTicket
<a href="https://github.umn.edu/sleepnumber4950/AutoTicket/blob/version2/User%20Instructions.pdf">User Guide</a>

## Branch Description
| Status          | Branch                  | Description                                   |
|-----------------|-------------------------|-----------------------------------------------|
| **base branch** | **version 2**           | 1. get MessageID in "Agent Console" view      |
|                 |                         | 2. fetch message by MessagID                  |
| publication     | reduced_permission      | fixes on permissions to publish to Google     |

## File Description
| Filename                            | Description                                                               |
| ----------------------------------- | ------------------------------------------------------------------------- |
| manifest.json                       | chrome extension manifest                                                 |
| getMsgID.js                         | extract messageID from sprinklr webpage                                   |
| background.js                       | 1. listen to commands and check if commands are called in the correct tab |
|                                     | 2. make API call                                                          |
|                                     | 3. put API response json to storage                                       |
| paste.js                            | 1. get response json from storage                                         |
|                                     | 2. find corresponding data in json and fill elementool table              |
|                                     | 3. delete data from storage                                               |
| hello.html, helloStyle.css          | floating prompt when hover above extension icon                           |
| icon16.png, icon48.png, icon128.png | chrome extension icon in different resolution                             |

## [Sprinklr API Call] <sup>5
| Elementool Table Entry           | Query Selector      |     | API Response JSON Value <sup>1                                             | AutoTicket Behavior | Remark                                     |
| -------------------------------- | ------------------- | --- | -------------------------------------------------------------------------- | ------------------- | ------------------------------------------ |
| Tonality                         | #Memo64             |     | `data.enrichments.sentiment`                                               | Leave empty         | Excluded because Sprinklr's tonality sucks |
| Follow Up                        |                     |     | /                                                                          | Leave Empty         | What is "follow up"?                       |
| Issue                            |                     |     | /                                                                          | Leave Empty         | Unable to determine without ML             |
| Social Media Channel             | #Memo34             |     | `data.channelType`                                                         | Fill <sup>2         |                                            |
|                                  |                     |     | `data.permalink`                                                           |                     |                                            |
| Interaction Location             | #Memo71             |     | `data.channelType`                                                         | Fill <sup>3         |                                            |
|                                  |                     |     | `data.permalink`                                                           |                     |                                            |
|                                  |                     |     | `data.permalink.workflow.customProperties ["5c490fd3e4b0afd92c3e6a7a"][0]` |                     | `messageType`                              |
| Customer Name                    | #Memo42             |     | `data.senderProfile.username`                                              | Fill                |                                            |
| Customer Number                  | #Memo41             |     | /                                                                          | Leave Empty         |                                            |
| Customer's Post                  | #steps_to_reproduce |     | `data.content.text`                                                        | Fill <sup>4         |                                            |
|                                  |                     |     | `data.textEntities.message[0]`                                             |                     |                                            |
| Sleep Number's Response          |                     |     | /                                                                          | Leave Empty         |                                            |
| Additional Details               |                     |     | /                                                                          | Leave Empty         |                                            |
| Link to Interaction              | #Right40            |     | /                                                                          | Leave Empty         |                                            |
| Reported By                      |                     |     | /                                                                          | Do Not Change       | Filled by Elementool                       |
| Date of Customer Post            | #Left36             |     | `data.createdTime`                                                         | Fill                |                                            |
| Time of Customer Post            | #igtxtLeft37        |     | Same As Above                                                              | Fill                |                                            |
| Time of Customer Post AM/PM      | #Left37_ampm        |     | Same As Above                                                              | Fill                |                                            |
| Date of Sleep Number Reply       | #Left38             |     | /                                                                          | Fill                | Current System Time                        |
| Time of Sleep Number Reply       |                     |     | /                                                                          | Leave Empty         |                                            |
| Time of Sleep Number Reply AM/PM |                     |     | /                                                                          | Leave Empty         |                                            |


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

| IF                                                              | THEN                               | Remark |
| --------------------------------------------------------------- | ---------------------------------- | ------ |
| hyperlink starts with "#" or "@"                                | keep original                      |        |
| hyperlink that has `msgInfo.textEntities.message[i].url`        | show url                           |        |
| hyperlink that has `msgInfo.textEntities.message[i].screenName` | show screenName                    |        |
| from YouTube                                                    | add "***YOUTUBE COMMENT***" before |        |
| Others                                                          | replace with "REDACTED"            | Email  |

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
