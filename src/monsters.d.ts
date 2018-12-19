declare module NodeJS {
  interface Global {
    currentMonsters: Map<string, Monster[]>;
  }
}
