# How to Create New Access Token
## WARNING: New Access Token will make old token INVALID!!

### Access Token Generation (Step 1/2)
1. Open a browser
2. Go to this address
https://api2.sprinklr.com/oauth/authorize?client_id=byt9mu7ugfau3qyarkc6mwzp&response_type=code&redirect_uri=https://www.sleepnumber.com/
3. Login and give access
4. You will be redirected to SleepNumber's site, the address will contain code we need for step 2.

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
