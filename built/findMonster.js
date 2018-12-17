var monsterData = require("../monsters.json");

module.exports = {
  findMonster: function(inputString) {
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
    **${mon.strength}** STR, **${mon.dexterity}** DEX, **${
      mon.constitution
    }** CON
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
};
