# AutoTicket
## Branch Description
| Status          | Branch                  | Description                                   |
|-----------------|-------------------------|-----------------------------------------------|
| empty           | master                  | empty                                         |
| deprecated      | initial_version         | 1. get CaseID from "Engagement Dashboard" url |
|                 |                         | 2. make multiple API calls to get MessageID   |
|                 |                         | 3. fetch message by MessagID                  |
| **base branch** | **version 2**           | 1. get MessageID in "Agent Console" view      |
|                 |                         | 2. fetch message by MessagID                  |
| empty           | version_3_url_messageID | empty                                         |
| deprecated      | post_presentation       | function added to base branch                 |

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
