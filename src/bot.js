var Discord = require("discord.io");
var logger = require("winston");
var auth = require("../auth.json");

var spellData = require("./spells.json");
var monsterData = require("./monsters.json");

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
bot.on("ready", function(evt) {
  logger.info("Connected");
  logger.info("Logged in as: ");
  logger.info(bot.username + " - (" + bot.id + ")");
});

bot.on("message", function(user, userID, channelID, message, evt) {
  // TODO: refactor spell and monster out into functions that are called in main one

  // Our bot needs to know if it will execute a command
  // It will listen for messages that will start with `!`
  if (message.substring(0, 6) == "/spell") {
    const response = findSpell(message.substring(7));
    bot.sendMessage({
      to: channelID,
      message: response
    });
  }

  if (message.substring(0, 8) == "/monster") {
    const monsterName = message.substring(9);
    let myMonster = monsterData.find(monster => {
      return monster.name == monsterName;
    });
  }
});

function findSpell(inputString) {
  let mySpell = spellData.find(spell => {
    return spell.name == inputString;
  });
  let requirements;
  switch (mySpell.components) {
    case "V":
      requirements = "Verbal";
      break;
    case "S":
      requirements = "Somatic";
      break;
    case "V, S":
      requirements = "Verbal, Somatic";
      break;
    case "V, M":
      requirements = `Verbal, Material: ${mySpell.material}`;
      break;
    case "S, M":
      requirements = `Somatic, Material: ${mySpell.material}`;
      break;
    case "V, S, M":
      requirements = `Verbal, Somatic, Material: ${mySpell.material}`;
      break;
  }
  requirements = (mySpell.ritual ? "Ritual + " : "") + requirements;
  const spellMessage = `
    Spell: ${mySpell.name}
    Description: ${
      mySpell.desc.length > 1500
        ? mySpell.desc.substr(0, 1500) + "..."
        : mySpell.desc
    }
    Range: ${mySpell.range}
    Duration: ${mySpell.duration} ${
    mySpell.concentration ? ", **Concentrated**" : ""
  }
    Cast time: ${mySpell.casting_time}
    Level: ${mySpell.level} ${mySpell.school} for ${mySpell.class}
    `;
  return spellMessage;
}

function findMonster(inputString) {
  let myMonster = monsterData.find(monster => {
    return monster.name == inputString;
  });
}
