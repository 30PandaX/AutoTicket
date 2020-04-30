# Pushing Updates to Chrome Web Store

### Things to update:
- `token` on line 5 of **background.js**
- `version` on line 3 of **manifest.json**
> Increment the version number so that Chrome detects there's an update.

### Steps:
1. You need AutoTicket source code. If you don't have one, you can download from GitHub.
2. Open **background.js** with Notepad
3. Request a new token, [details.](#Requesting-New-Access-Token)
4. Replace the token. Note: please make sure you didn't leave extra empty space or delete the quotation marks.
5. Open **manifest.json** with Notepad
6. Increment the version number. *Example: change 1.2.1 to 1.2.2*
7. Save both files.
8. Go to https://chrome.google.com/webstore/devconsole/
9. (I will have to ask Panda how to update this.)


# Requesting New Access Token
## WARNING: New Access Token will make old token INVALID!!

### Access Token Generation (Step 1/2)
1. Open a browser
2. Go to this address
https://api2.sprinklr.com/oauth/authorize?client_id=byt9mu7ugfau3qyarkc6mwzp&response_type=code&redirect_uri=https://www.sleepnumber.com/
3. Login to Sprinklr and give access
4. You will be redirected to SleepNumber's site, the address will contain code we need for step 2.

sample redirected address: https://www.sleepnumber.com/?code=5dca0ea7990a74a97cd72&state=null

sample code: 5dca0ea7990a74a97cd72

*This code will expire in 10 minutes.*

### Access Token Generation (Step 2/2)

1. Open Postman, find `[POST] Receive Access Token` in Sprinklr API collection
2. Replace {{path}} with a slash /
3. In Params tab, replace `client_id`, `client_secret` with key and secret found at [my account at Sprinklr developer website]
(Remove brackets as well)
4. Replace `code` with the code got from step 1
5. Click "Send" and you will get `Access Code` for API calls
6. **Refresh Token is possible with `[POST] Receive Refresh Token`**

### Make API Call

1. Using `[GET] Case Read-Case Number` as an example
(69902 is a working case number)
2. Remove {{path}}
3. In Authorization tab, select `Bearer Token` type, token is `Access Code`
4. Click "Send" and you will get case data in JSON

# How to Make Sprinklr API Call with Postman

Reference: [Getting Started Guide]

### Set up

1. Download and install [Postman]
2. Go to [Sprinklr API Doc]
3. Click `Run in Postman` on top right corner to `Import` Sprinklr API to Postman
4. Additional API calls can be found [Sprinklr API Overview]


   [Postman]: <https://www.getpostman.com/downloads/>
   [Sprinklr API Doc]: <https://api-docs.sprinklr.com/?version=latest>
   [my account at Sprinklr developer website]: <https://developer.sprinklr.com/apps/mykeys>
   [Sprinklr API Overview]: <https://developer.sprinklr.com/docs/read/API_Overview>
   [Getting Started Guide]: <https://developer.sprinklr.com/docs/read/api_overview/Getting_Started>
