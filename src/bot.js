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
  // TODO: monster ability/action query

  let response = "";
  if (message.substring(0, 5) == "/help") {
    response = `Hi! I'm here to help you play DnD.
    Available commands:
    \`/spell XXX\`: Prints details for spell of name XXX.
    \`/SecretDMcommand XXX\`: Prints details for monster of name XXX.
    \`/help\`: Prints this help menu!

    Note that I won't work unless I'm being hosted.
    My source code lives at https://github.com/soph-iest/dnd-bot.
    `;
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
  let mon = monsterData.find(monster => {
    return monster.name == inputString;
  });

  const monsterMessage = `Monster: ${mon.name} (${mon.alignment})
  ${mon.size + mon.type}, ${mon.subtype}
  ***Stats:***
  ${mon.hit_points} HP, Armor Class ${mon.armor_class}, CR ${
    mon.challenge_rating
  }
  Speed: ${mon.speed}    Stealth: ${mon.stealth}
  **${mon.strength}** STR, **${mon.dexterity}** DEX, **${mon.constitution}** CON
  **${mon.intelligence}** INT, **${mon.wisdom}** WIS, **${mon.charisma}** CHA
  ${
    mon.perception
      ? `Perception: ${mon.perception}
  `
      : ""
  }${mon.strength_save ? `STR Save: ${mon.strength_save},  ` : ""}${
    mon.dexterity_save ? `DEX Save: ${mon.dexterity_save},  ` : ""
  }${mon.constitution_save ? `CON Save: ${mon.constitution_save},  ` : ""}${
    mon.intelligence_save ? `INT Save: ${mon.intelligence_save},  ` : ""
  }${mon.wisdom_save ? `WIS Save: ${mon.wisdom_save},  ` : ""}${
    mon.charisma_save ? `CHA Save: ${mon.charisma_save},  ` : ""
  }
  ***Traits:***
  Weak to: ${mon.damage_vulnerabilities}
  Resists: ${mon.damage_resistances}
  Immune to: ${mon.damage_immunities} ${
    mon.damage_immunities && mon.condition_immunities ? "and" : ""
  } ${mon.condition_immunities}
  Senses: ${mon.senses}
  Languages: ${mon.languages}
  **Abilities**: ${mon.special_abilities
    .map(ability => {
      return ability.name;
    })
    .toString()}
  ${
    mon.actions
      ? "**Actions**: " +
        mon.actions
          .map(action => {
            return action.name;
          })
          .toString()
      : ""
  }
  ${
    mon.legendary_actions
      ? "**Legendary Actions**: " +
        mon.legendary_actions.map(action => {
          return action.name;
        })
      : ""
  }
  `;

  return monsterMessage;
}
