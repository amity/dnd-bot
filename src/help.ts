export function help() {
  return `Hi! I'm here to help you play DnD.
    Available commands:
    - \`/spell XXX\`: Prints details for spell of name XXX.
    - \`/monster XXX\`: Prints details for monster of name XXX.

    - \`/monsters\`: Prints all living monsters currently spawned by the user and their HPs.
    - \`/spawn monsterType[*num]\`: Spawns one monster of type monsterName, or multiple by appending \`*num\`. (e.g. \`/spawn Goblin\`, or \`/spawn Goblin*3\`)
    - \`/dmg num monsterName\`: Deals {num} damage to {monsterName}. Additional monsters to be damaged can be appended separated by a space. (e.g. \`/dmg 6 Goblin1 Goblin3\`). Monsters brought below 0 HP by damage are destroyed.
    - \`/status statusName monsterName\`: Inflicts {statusName} status on {monsterName}. Additional monsters to be afflicted can be appended separated by a space. (e.g. \`/status paralyzed Goblin1 Goblin3\`). Note that this allows any user inputted "status", so you can also use this to keep notes on monsters.

    - \`/initiative\`: Prints sorted initiative for all living mobs.
    - \`/initiative roll (name) (modifier)\`: Sets the initiative for a creature (or creates a new creature, if not existing) via a random d20 roll combined with the specified modifier. For example, \`/initiative roll Taliyah -3\`. Additional creatures can be appended separated by a space.
    - \`/initiative set (name) (value)\`: Functions the same as \`/initiative roll\`, but by setting values directly rather than rolling for them.

    - \`/clear\`: Clears all monsters spawned by the player (and all initiatives).
    - \`/help\`: Prints this help menu!

    Want to add me to a server you mod? Invite me at https://discordapp.com/oauth2/authorize?&client_id=523218118873710630&scope=bot&permissions=8.
    Note that if I appear offline, I am under maintenance. Thanks for your patience!
    My source code lives at https://github.com/soph-iest/dnd-bot.
    `;
}



