export class Monster {
  name: string;
  type: string;
  hp: number;
  status: string = "";
  initiative: number;
  constructor(monsterType: string, monsterNum: number = 1, initiative: number = -100) {
    this.name = monsterType + (monsterNum == undefined ? '' : monsterNum.toString());
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
