var monsterData = require("./monsters.json");

export function spawnMonster(channelID: string, inputString: string): string {
  // Parse input: "?number monsterName"
  let count = 1;
  if (!isNaN(Number(inputString.split("*")[1]))) {
    // If starts with monster*num, creates num monsters, and sets monster name to the first part.
    count = Number(inputString.split("*")[1]);
    inputString = inputString.split("*")[0];
  }

  // Create monster set for user if it doesn't currently exist
  if (global.currentMonsters.get(channelID) === undefined) {
    global.currentMonsters.set(channelID, new Array<Monster>());
  }
  // Increment ID number by currently existing monsters of specified type.
  const currentMonsterOfType: number = getMonsters(channelID, inputString).length;
  count += currentMonsterOfType;

  // Adds new monsters until provided count is reached.
  for (let i = 1 + currentMonsterOfType; i <= count; i++) {
    global.currentMonsters.get(channelID)!.push(new Monster(inputString, i));
  }
  // Figure that people will be checking the list of monsters more often than adding, so this sorts on addition.
  global.currentMonsters.get(channelID)!.sort((m1, m2) => {
    return m1.name > m2.name ? 1 : -1;
  });
  // Returns all monsters of the type the user has created.
  return `${global.currentMonsters
    .get(channelID)!
    .filter((monster: Monster) => {
      return monster.isType(inputString);
    })
    .join("")}`;
}

export function getMonsters(channelID: string, monsterType?: string): Monster[] {
  // If monster type specified
  if (
    monsterType &&
    global.currentMonsters.get(channelID) &&
    global.currentMonsters.get(channelID)!.some((monster: Monster) => {
      return monster.isType(monsterType);
    })
  ) {
    return global.currentMonsters.get(channelID)!.filter((monster: Monster) => {
      return monster.isType(monsterType);
    });
  } else
    return global.currentMonsters.get(channelID) === undefined
      ? new Array<Monster>()
      : global.currentMonsters.get(channelID)!;
}

export function damageMonster(channelID: string, inputString: any): string {
  let inputs: Array<string> = inputString.split(" ");
  const damageTicks = inputs.shift();
  let resultsMessage = "";
  // Parse inputString into dmg and monstername(s)
  for (let monsterName of inputs) {
    let monsterDamageMessage = "";
    let monster = global.currentMonsters.get(channelID)!.find(
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
        global.currentMonsters.get(channelID)!.splice(
          global.currentMonsters.get(channelID)!.findIndex((monster: Monster) => {
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

export function statusMonster(channelID: string, inputString: string): string {
  let inputs: string[] = inputString.split(" ");
  const status = inputs.shift();
  let responseString = "";
  for (let monsterName of inputs) {
    let myMonster = global.currentMonsters.get(channelID)!.find(monster => {
      return monster.name == monsterName;
    });
    if (myMonster) {
      responseString += myMonster.addStatus(status!);
    } else
      responseString += `${monsterName} not found.
    `;
  }
  return responseString;
}

export function clearMonsters(channelID: string): string {
  global.currentMonsters.delete(channelID);
  return "Monsters cleared.";
}

export class Monster {
  name: string;
  type: string;
  hp: number;
  status: string = "";
  initiative: number;
  constructor(monsterType: string, monsterNum: number = 1, initiative: number = -100) {
    this.name = monsterType + monsterNum.toString();
    this.type = monsterType;
    this.initiative = initiative;
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
