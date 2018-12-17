var Discord = require("discord.io");
var logger = require("winston");

var auth = require("./auth.json");
var { help } = require("./help");
var { findSpell } = require("./findSpell");
var { findMonster } = require("./findMonster");

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console(), {
  colorize: true
});
logger.level = "debug";
// Initialize Discord Bot
var bot = new Discord.Client({
  token: auth.token,
  autorun: true
});
bot.on("ready", function(evt: any) {
  logger.info("Connected");
  logger.info("Logged in as: ");
  logger.info(bot.username + " - (" + bot.id + ")");
});
console.log(findMonster("--full Adult Blue Dracolich"));

bot.on("message", function(
  user: string,
  userID: number,
  channelID: any,
  message: string,
  evt: any
) {
  // TODO: monster ability/action query
  try {
    let response = "";
    if (message.substring(0, 5) == "/help") {
      response = help();
    }

    if (message.substring(0, 6) == "/spell") {
      response = findSpell(message.substring(7));
    }

    if (message.substring(0, 11) == "/DM monster") {
      response = findMonster(message.substring(12));
    }

    bot.sendMessage({
      to: channelID,
      message: response
    });
  } catch (err) {
    console.error(err);
  }
});
