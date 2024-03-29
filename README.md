# DnD Bot

### UPDATE: With Discord sunsetting Gateway v5, the Discord.io library this bot is built on is no longer functioning, and cannot be revived without refactoring to a different core library. As a result, the bot has been deprecated for the time being. Thank you for using SpellBot!

---

A simple bot to help players and DMs with managing 5e DnD games.
Built with `npm start` (compiles the TS, copies all other files, and runs out of `/built` destination folder), but users should interact with it as a Discord bot, which can be added to your server by following the instructions below.

The bot can be messaged directly, or called in any server which it has been granted access to.

## To add to your server:
Visit https://discord.com/oauth2/authorize?&client_id=523218118873710630&scope=bot&permissions=8 and authorize the bot to enter your server. That's it!
You can also message it directly, rather than in a server.

## Current commands:

Parentheses indicate the query inside should be replaced with user input; brackets indicate optional parameters. (The parentheses and brackets themselves should not be included in issued commands.)

### Lookup:

- `/DM me`: Toggles whether the user is marked as a DM, allowing them to look up monsters.
- `/spell (spellName)` will return information for the given spell.
- `/monster [--full ](monsterType)` will return information for the given monster. Please note that in most circumstances, players should not necessarily have access to all of this information, so this command should typically be reserved for DMs' DMs. If the user is not marked as a DM, monster lookup will be unavailable.
  - Including `--full` will also print detailed information about the monster's actions and abilities.

### Instancing:

- `/spawn (monsterType)[*num]`: Spawns one monster of type `monsterType` in the current instance, or multiple monsters of the same type by appending `*num`. (e.g. `/spawn Goblin`, or `/spawn Goblin*3`.)
- `/monsters`: Prints all living monsters currently spawned in the user's instance, and their HPs.
- `/initiative`: Prints sorted initiative for all living mobs.
- `/initiative roll (name) (modifier)`: Sets the initiative for a creature (or creates a new creature, if not existing) via a random d20 roll combined with the specified modifier. For example, `/initiative roll Taliyah -3`. Additional creatures can be appended separated by a space.
- `/initiative set (name) (value)`: Functions the same as `/initiative roll`, but by setting values directly rather than rolling for them.
- `/dmg (num) (monsterName)`: Deals `num` damage to `monsterName`. Additional monsters to be damaged can be appended separated by a space, e.g. `/dmg 6 Goblin1 Goblin3`. Monsters brought below 0 HP by damage are destroyed.
- `/status (statusName) (monsterName)`: Inflicts `statusName` status on `monsterName`. Additional monsters to be afflicted can be appended separated by a space, e.g. `/status paralyzed Goblin1 Goblin3`. Note that this allows any user-entered "status", so you could also use this to keep notes on monsters.
- `/clear`: Clears all monsters in the player's instance.
- `/help` displays a quick informational message.

Planned expansions:

- Printing the DM-ness of all users in a channel (or just making them all non-DM but the one issuing the command.)
- Character management
- (Long shot): ASCII GUI for field representation
- TBA
