var Discord = require("discord.io");
var logger = require("winston");

var auth = require("./auth.json");
var { help } = require("./help");
var { findSpell } = require("./findSpell");
var { findMonster } = require("./findMonster");
// var { spawnMonster } = require("./spawnMonster");

// var currentMonsters:any = new Object();
var currentMonsters: Map<string, Monster[]> = new Map<string, Array<Monster>>();

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
  if (message.substring(0, 5) == "/help") {
    // /help
    response = help();
  }

  if (message.substring(0, 6) == "/spell") {
    // /spell spellName
    try {
      response = findSpell(message.substring(7));
    } catch (error) {
      response =
        "Error: please make sure the spell you are looking for exists, and you have formatted your query `/spell xxxxx`";
    }
  }

  if (message.substring(0, 8) == "/monster") {
    // /DM monster monsterType
    try {
      response = findMonster(message.substring(9));
    } catch (error) {
      response =
        "Error: please make sure the monster you are looking for exists, and you have formatted your query `/monster xxxxx`";
    }
  }

  // User-specific functions
  if (message.substring(0, 6) == "/spawn") {
    // /spawn monsterType(*number)
    response = spawnMonster(userID, message.substring(7));
  }

  if (message.substring(0, 9) == "/monsters") {
    // /monsters
    response =
      getMonsters(userID).length == 0
        ? "No monsters present."
        : getMonsters(userID).join("");
  }

  if (message.substring(0, 4) == "/dmg") {
    // /dmg num monsterName (monsterName2 ...)
    response = damageMonster(userID, message.substring(5));
  }

  if (message.substring(0, 6) == "/clear") {
    // /clear
    response = clearMonsters(userID);
  }

  // if (message.substring(0, 7) == "/status") {
  //   response = statusMonster();
  // }

  bot.sendMessage({
    to: channelID,
    message: response
  });
});

var monsterData = require("./monsters.json");

// dictionary of userID's (DM) to access array of monsters

// TODO: move this to its own file
// TODO: Input error checks on all these
function spawnMonster(userID: string, inputString: string): string {
  // Parse input: "?number monsterName"
  let count = 1;
  if (!isNaN(Number(inputString.split("*")[1]))) {
    // If starts with monster*num, creates num monsters, and sets monster name to the first part.
    count = Number(inputString.split("*")[1]);
    inputString = inputString.split("*")[0];
  }

  // Create monster set for user if it doesn't currently exist
  if (currentMonsters.get(userID) === undefined) {
    currentMonsters.set(userID, new Array<Monster>());
  }
  // Increment ID number by currently existing monsters of specified type.
  const currentMonsterOfType: number = getMonsters(userID, inputString).length;
  count += currentMonsterOfType;

  // Adds new monsters until provided count is reached.
  for (let i = 1 + currentMonsterOfType; i <= count; i++) {
    currentMonsters.get(userID)!.push(new Monster(inputString, i));
  }
  // Figure that people will be checking the list of monsters more often than adding, so this sorts on addition.
  currentMonsters.get(userID)!.sort((m1, m2) => {
    return m1.name > m2.name ? 1 : -1;
  });
  // Returns all monsters of the type the user has created.
  return `${currentMonsters
    .get(userID)!
    .filter((monster: Monster) => {
      return monster.isType(inputString);
    })
    .join("")}`;
}

function damageMonster(userID: string, inputString: any): string {
  let inputs: Array<string> = inputString.split(" ");
  const damageTicks = inputs.shift();
  let resultsMessage = "";
  // Parse inputString into dmg and monstername(s)
  for (let monsterName of inputs) {
    let monsterDamageMessage = "";
    let monster = currentMonsters.get(userID)!.find(
      (monster: Monster): boolean => {
        return monster.name == monsterName;
      }
    );
    if (monster === undefined) {
      monsterDamageMessage = `Error: ${monsterName} not found
      `;
    } else {
      monsterDamageMessage = monster.damage(Number(damageTicks));
      if (monsterDamageMessage.includes("has been defeated")) {
        // Removes monster from array if it has been defeated.
        currentMonsters.get(userID)!.splice(
          currentMonsters.get(userID)!.findIndex((monster: Monster) => {
            return monster.name == monsterName;
          }),
          1
        );
      }
    }
    resultsMessage += monsterDamageMessage;
  }
  return resultsMessage;
}

function clearMonsters(userID: string): string {
  currentMonsters.delete(userID);
  return "Monsters cleared.";
}

function getMonsters(userID: string, monsterType?: string): Monster[] {
  // If monster type specified
  if (
    monsterType &&
    currentMonsters.get(userID) &&
    currentMonsters.get(userID)!.some((monster: Monster) => {
      return monster.isType(monsterType);
    })
  ) {
    return currentMonsters.get(userID)!.filter((monster: Monster) => {
      return monster.isType(monsterType);
    });
  } else
    return currentMonsters.get(userID) === undefined
      ? new Array<Monster>()
      : currentMonsters.get(userID)!;
}

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
