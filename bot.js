var http = require('http');
var https = require('https');
var Discord = require('./discord.js');
var _ = require('lodash');
var auth = require('./auth.json');

TEST_MODE = false;
MUST_SEE_COUNT = TEST_MODE ? 1 : 1;
MUST_SEE_EMOJI_CODE = 'mustsee';
RECIPIENT_CHANNEL_NAME = TEST_MODE ? 'must-see-test' : 'must-see';
TOKEN = TEST_MODE ? auth.test_token : auth.token;

// Initialize Discord Bot
const bot = new Discord.Client();
bot.login(TOKEN);

bot.on('ready', function(evt) {
  console.log('Bot is ready and armed!');
});

bot.on('messageReactionAdd', function(messageReaction, user) {
  var message = messageReaction.message;

  // We don't want the must see from the recipient channel to count
  if (message.channel.name != RECIPIENT_CHANNEL_NAME) {

    var mustsee = message.reactions.find(function(reaction) {
      return reaction.emoji.name == MUST_SEE_EMOJI_CODE;
    });

    var recipientChannel = bot.channels.find(function(channel) {
      return channel.type == "text" && channel.name == RECIPIENT_CHANNEL_NAME;
    });

    if (mustsee.count == MUST_SEE_COUNT) {
      var messageAuthor = message.author;
      var messageIntro = "_Behold! A new must-see by **" + message.author.username + "**:_\n\n";

      var messageContent = messageIntro + message.content;
      var messageAttachments = message.attachments.map(function(attachment) {
        return new Discord.Attachment(attachment.url, attachment.filename);
      });

      recipientChannel.send(messageContent, { files: messageAttachments });
    }
  }
});

// SIDE WEB-APP USED ONLY TO PREVENT HEROKU FROM SLEEPING

const express = require('express');
const app = express();

// set the port of our application
// process.env.PORT lets the port be set by Heroku
const port = process.env.PORT || 5000;

// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the `public` directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

// set the home page route
app.get('/', (request, response) => {
  // ejs render automatically looks in the views folder
  response.render('index');
});

app.listen(port, () => {
  // will echo 'Our app is running on http://localhost:5000 when run locally'
  console.log('Our app is running on http://localhost:' + port);
});


// pings server every 15 minutes to prevent dynos from sleeping
setInterval(() => {
  if (!TEST_MODE)
    https.get('https://discord-must-see-bot.herokuapp.com');
}, 900000);
