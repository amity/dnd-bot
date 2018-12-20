var Discord = require("discord.io");
var logger = require("winston");

var auth = require("./auth.json");
var monsterData = require("./monsters.json");

var { help } = require("./help");
var { findSpell } = require("./findSpell");
var { findMonster } = require("./findMonster");
var {
  spawnMonster,
  clearMonsters,
  damageMonster,
  getMonsters,
  statusMonster
} = require("./monsterHandling");
var { dmToggle } = require("./dmControls");

global.currentMonsters = new Map<string, Array<Monster>>();
global.dmSet = new Set<string>();

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
  userID: any,
  channelID: any,
  message: string,
  evt: any
) {
  let response = "";
  userID = userID.toString();

  // General functions
  if (message.substring(0, 6) == "/DM me") {
    // /toggles the user
    response = `${user} is ${dmToggle(userID)}`;
  }

  if (message.substring(0, 5) == "/help") {
    // /help
    response = help();
  }

  if (message.substring(0, 6) == "/spell") {
    // /spell spellName
    try {
      response = findSpell(message.substring(7));
    } catch (error) {
      console.error(error);
      response =
        "Error: please make sure the spell you are looking for exists, and you have formatted your query `/spell xxxxx`";
    }
  }

  if (
    message.substring(0, 8) == "/monster" &&
    message.substring(0, 9) != "/monsters"
  ) {
    // /DM monster monsterType
    try {
      response = findMonster(message.substring(9));
    } catch (error) {
      console.error(error);
      response =
        "Error: please make sure the monster you are looking for exists, and you have formatted your query `/monster xxxxx`";
    }
  }

  // User-specific functions
  if (message.substring(0, 6) == "/spawn") {
    // /spawn monsterType(*number)
    try {
      response = spawnMonster(userID, message.substring(7));
    } catch (error) {
      console.error(error);
      response =
        "Error: please make sure the monster you are attempting to spawn exists, and you have formatted your query `/spawn xxxxx`, or optionally, `/spawn xxxx*num`, where num is the number of those monsters you which to spawn.";
    }
  }

  if (message.substring(0, 9) == "/monsters") {
    // /monsters
    try {
      response =
        getMonsters(userID).length == 0
          ? "No monsters present."
          : getMonsters(userID).join("");
    } catch (error) {
      console.error(error);
      response =
        "Error. Sorry, not sure about this one! Please file a bug report by DMing sophie#6047.";
    }
  }

  if (message.substring(0, 4) == "/dmg") {
    // /dmg num monsterName (monsterName2 ...)
    try {
      response = damageMonster(userID, message.substring(5));
    } catch (error) {
      console.error(error);
      response =
        "Error. Please make sure your query is formatted `/dmg num monsterName`, where num is the amount of damage you wish to inflict to the monster of name monsterName. Additional monsters to take damage can be added, separated by a space.";
    }
  }

  if (message.substring(0, 6) == "/clear") {
    // /clear
    try {
      response = clearMonsters(userID);
    } catch (error) {
      console.error(error);
      response =
        "Error. Sorry, not sure about this one! Please file a bug report by DMing sophie#6047.";
    }
  }

  if (message.substring(0, 7) == "/status") {
    try {
      response = statusMonster(userID, message.substring(8));
    } catch (error) {
      console.error(error);
      response =
        "Error adding status to given monster. Please make sure your query is formatted `/status statusName monsterName` where monsterName is the name (e.g. 'Goblin1') of a spawned monster.";
    }
  }

  bot.sendMessage({
    to: channelID,
    message: response
  });
});

class Monster {
  name: string;
  type: string;
  hp: number;
  status: string = "";
  constructor(monsterType: string, monsterNum: number = 1) {
    this.name = monsterType + monsterNum.toString();
    this.type = monsterType;
    this.hp = monsterData.find((monster: any) => {
      return monster.name == monsterType;
    }).hit_points;
  }

  toString(): string {
    return `${this.name}: ${this.hp} HP ${this.status}
        `;
  }

  isType(monsterType: string): boolean {
    return this.type == monsterType;
  }

  damage(ticks: number): string {
    this.hp -= ticks;
    if (this.hp <= 0) {
      return `${this.name} has been defeated.
          `;
    }
    return `${this.name} takes ${ticks} damage, and has ${this.hp} HP remaining.
        `;
  }

  addStatus(newStatus: string): string {
    this.status += newStatus;
    return this.toString();
  }
}
