var Discord = require('discord.js');
var _ = require('lodash');
var auth = require('./auth.json');

MUST_SEE_COUNT = 2;
MUST_SEE_EMOJI_CODE = 'mustsee';
RECIPIENT_CHANNEL_NAME = 'maxi-best-of';


// Initialize Discord Bot
const bot = new Discord.Client();
bot.login(auth.token);

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

