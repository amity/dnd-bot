var monsterData = require("./monsters.json");

export function spawnMonster(userID: string, inputString: string): string {
  // Parse input: "?number monsterName"
  let count = 1;
  if (!isNaN(Number(inputString.split("*")[1]))) {
    // If starts with monster*num, creates num monsters, and sets monster name to the first part.
    count = Number(inputString.split("*")[1]);
    inputString = inputString.split("*")[0];
  }

  // Create monster set for user if it doesn't currently exist
  if (global.currentMonsters.get(userID) === undefined) {
    global.currentMonsters.set(userID, new Array<Monster>());
  }
  // Increment ID number by currently existing monsters of specified type.
  const currentMonsterOfType: number = getMonsters(userID, inputString).length;
  count += currentMonsterOfType;

  // Adds new monsters until provided count is reached.
  for (let i = 1 + currentMonsterOfType; i <= count; i++) {
    global.currentMonsters.get(userID)!.push(new Monster(inputString, i));
  }
  // Figure that people will be checking the list of monsters more often than adding, so this sorts on addition.
  global.currentMonsters.get(userID)!.sort((m1, m2) => {
    return m1.name > m2.name ? 1 : -1;
  });
  // Returns all monsters of the type the user has created.
  return `${global.currentMonsters
    .get(userID)!
    .filter((monster: Monster) => {
      return monster.isType(inputString);
    })
    .join("")}`;
}

export function damageMonster(userID: string, inputString: any): string {
  let inputs: Array<string> = inputString.split(" ");
  const damageTicks = inputs.shift();
  let resultsMessage = "";
  // Parse inputString into dmg and monstername(s)
  for (let monsterName of inputs) {
    let monsterDamageMessage = "";
    let monster = global.currentMonsters.get(userID)!.find(
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
        global.currentMonsters.get(userID)!.splice(
          global.currentMonsters.get(userID)!.findIndex((monster: Monster) => {
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

export function clearMonsters(userID: string): string {
  global.currentMonsters.delete(userID);
  return "Monsters cleared.";
}

export function getMonsters(userID: string, monsterType?: string): Monster[] {
  // If monster type specified
  if (
    monsterType &&
    global.currentMonsters.get(userID) &&
    global.currentMonsters.get(userID)!.some((monster: Monster) => {
      return monster.isType(monsterType);
    })
  ) {
    return global.currentMonsters.get(userID)!.filter((monster: Monster) => {
      return monster.isType(monsterType);
    });
  } else
    return global.currentMonsters.get(userID) === undefined
      ? new Array<Monster>()
      : global.currentMonsters.get(userID)!;
}

export class Monster {
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
