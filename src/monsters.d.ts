declare module NodeJS {
  interface Global {
    currentMonsters: Map<string, Monster[]>;
    dmSet: Set<string>;
  }
}
