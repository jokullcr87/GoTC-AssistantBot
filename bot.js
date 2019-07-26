var logger = require('winston');
var auth = require('./auth.json');

// Configure logger settings
logger.remove(logger.transports.Console);
// logger.add(new logger.transports.Console, {
//     colorize: true
// });
// logger.level = 'debug';

// require the discord.js module
const Discord = require('discord.js');

// create a new Discord client
const client = new Discord.Client();

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log(`${client.user.id} Ready!`);
});

// login to Discord with your app's token
client.login(auth.token);

client.on('message', message => {
  console.log(message.content);
	console.log(message.member.guild.id);
  if (message.content.startsWith(`<@${client.user.id}>`) || message.content.startsWith(`<@!${client.user.id}>`)) {
    console.log('Valid command!!!');
    const messageArray = message.content.split(' ');
    console.log(messageArray);
    if (messageArray[1].toLowerCase() === 'zeroed') {
      console.log('zeroed command');
    	// send back "Pong." to the channel the message was sent in
      const attachment = new Discord.Attachment('https://i.imgur.com/w3duR07.png');
          // Send the attachment in the message channel with a content
      message.channel.send(attachment);
    } else if (messageArray[1].toLowerCase() === 'change-name') {
      console.log("change-name command!");
      if (messageArray.length != 3) {
        message.reply(`The usage of the change-name command is:\n<@!${client.user.id}> change-name <desired_name>`);
        return;
      }
      message.member.setNickname(messageArray[2]).catch(error => message.reply(`An error occurred: ${error.message}`));

    } else if (messageArray[1].toLowerCase() === 'scout-report') {
      console.log("scout-report command!");
      if (messageArray.length != 4) {
        message.reply(`The usage of the scout-report command is:\n\n<@!${client.user.id}> scout-report <type> <quantity>\n\nTypes:\n\tUB1: Unbubbled K16-K17 enemy\n\tUB2: Unbubbled K18-K19 enemy`);
        return;
      }

      var type = messageArray[2].toUpperCase();
      var quantity = parseInt(messageArray[3]);
      var points = 0;
      if (type === 'UB1') {
        points = 20;
      } else if (type === 'UB2') {
        points = 25;
      } else {
        return;
      }

      message.reply(`Congratulations! :confetti_ball:\nYour report has a value of ${points * quantity} :crown:\n\nThey will be submitted for review.`);

      //unbubbled enemy +k16 - k17 - 20 loyalty points
      //unbubbled enemy +k18 - k19 - 25 loyalty points
    } else if (messageArray[1].toLowerCase() === 'bounty') {
      if (messageArray.length != 4) {
        message.reply(`The usage of the bounty command is:\n<@!${client.user.id}> bounty <X> <Y>`);
        return;
      }

      if (message.attachments == null) {
        message.reply('Your bounty report must include a screenshot!'); return;
      }

      message.reply(`Thanks for finding the location of a wanted castle!\n\nYou'll be rewarded with 150 :crown:`);

      var bountiesChannel = message.member.guild.channels.find(ch => ch.name === 'bounties');
      bountiesChannel.send(`@everyone, ${message.member} found the location of a bounty at (X${messageArray[2]},Y${messageArray[3]})!\n\nHappy hunting :smiley:`, new Discord.Attachment(message.attachments.first().url));

    }
  }
});
