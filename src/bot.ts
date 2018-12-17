var Discord = require("discord.io");
var logger = require("winston");

var auth = require("./auth.json");
var { help } = require("./help");
var { findSpell } = require("./findSpell");
var { findMonster } = require("./findMonster");
// var { spawnMonster } = require("./spawnMonster");

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

bot.on("message", function(
  user: string,
  userID: number,
  channelID: any,
  message: string,
  evt: any
) {
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

    if (message.substring(0, 6) == "/spawn") {
      response = spawnMonster(userID, message.substring(7));
    }

    if (message.substring(0, 6) == "/dmg") {
      response = spawnMonster(userID, message.substring(7));
    }

    bot.sendMessage({
      to: channelID,
      message: response
    });
  } catch (err) {
    console.error(err);
  }
});

var monsterData = require("./monsters.json");

// this should invoke a closure

// dictionary of userID's (DM) to access array of monsters

// TODO: move this to its own file
function spawnMonster(userID: number, inputString: string) {
  return "";
}

function damageMonster(userID: number, inputString: string) {
  // Parse inputString into dmg and monstername(s)
}

function clearMonsters() {}
