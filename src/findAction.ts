var monsterData = require("./monsters.json");

export default function findAction(inputString: string) {
  let monsterName: string, actionName: string;
  [monsterName, actionName] = inputString.split(" ");

  let monster = monsterData.find((monster: any) => {
    return monster.name == monsterName;
  });
  let action = monster.actions.find((action: any) => {
    return action.name == actionName;
  });

  if (action) {
    const actionMessage: string = `${monster.name}'s ${action.name}
    ${action.desc}
    Attack Bonus: ${action.attack_bonus}
    Damage: ${action.damage_dice}, ${action.damage_bonus} bonus
    `;
    return actionMessage;
  }
}
