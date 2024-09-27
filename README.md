# TwitchBot

https://twurple.js.org/docs/examples/chat/basic-bot.html

2. Obtain an access token from Twitch
   Visit this site, with the CLIENT_ID and REDIRECT_URI placeholders replaced with your client ID and redirect URI, respectively:

https://id.twitch.tv/oauth2/authorize?client_id=CLIENT_ID
&redirect_uri=REDIRECT_URI
&response_type=code
&scope=chat:read+chat:edit
Log in with the account you want to use for your bot and confirm the access to Twitch. You should get redirected to your redirect URI with a query parameter named code.

Using a tool like Insomnia or Postman, make a POST request to this URL, again, with all placeholders replaced:

https://id.twitch.tv/oauth2/token?client_id=CLIENT_ID
&client_secret=CLIENT_SECRET
&code=CODE_FROM_LAST_REQUEST
&grant_type=authorization_code
&redirect_uri=REDIRECT_URI
