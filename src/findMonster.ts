var monsterData = require("./monsters.json");

export function findMonster(inputString: string) {
  // Toggles whether to have full action/ability detail
  let full: boolean = false;
  if (inputString.substr(0, 6) == "--full") {
    inputString = inputString.substring(7);
    full = true;
  }
  let mon = monsterData.find((monster: any) => {
    return monster.name == inputString;
  });

  // All of this is just formatting the message.
  // Fields are included conditionally if the given monster has values for them.

  const monsterMessage: string = `Monster: ${mon.name} (${mon.alignment})
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
    ${
      mon.special_abilities
        ? "***Abilities:*** " +
          mon.special_abilities
            .map((ability: any) => {
              return full
                ? `
                **${ability.name}**vs
        ${ability.desc} ${
                    ability.attack_bonus
                      ? `
        Attack Bonus: ${ability.attack_bonus}`
                      : ""
                  } ${
                    ability.damage_dice
                      ? `
                  Damage Dice: ${ability.damage_dice}`
                      : ""
                  }`
                : ability.name;
            })
            .toString()
        : ""
    } ${
    mon.actions
      ? "***Actions***: " +
        mon.actions
          .map((action: any) => {
            return full
              ? `
              **${action.name}**
        ${action.desc} ${
                  action.attack_bonus
                    ? `
        Attack Bonus: ${action.attack_bonus}`
                    : ""
                } ${
                  action.damage_dice || action.damage_bonus
                    ? `
                    Damage: ${action.damage_dice +
                      (action.damage_bonus
                        ? action.damage_bonus + " bonus"
                        : "")}`
                    : ""
                }`
              : action.name;
          })
          .toString()
      : ""
  }
    ${
      mon.legendary_actions
        ? "***Legendary Actions***: " +
          mon.legendary_actions.map((action: any) => {
            return full
              ? `
              **${action.name}**
        ${action.desc} ${
                  action.attack_bonus
                    ? `
        Attack Bonus: ${action.attack_bonus}`
                    : ""
                }`
              : action.name;
          })
        : ""
    }
    `;

  return monsterMessage;
}
