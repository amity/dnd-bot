# DnD Bot

A simple bot to help players and DMs with managing 5e DnD games.
Built with `npm start` (compiles the TS, copies all other files, and runs out of `/built` destination folder), but users should interact with it as a Discord bot, which can be added to your server by visiting \***\*\_\_\_\*\***.

The bot can be DM'd, or called in any server which it has been granted access to.

Current commands:

- `/spell (spellName)` will return information for the given spell.
- `/DM monster (monsterName)` will return information for the given monster. Please note that in most circumstances, players should not necessarily have access to all of this information, so this command should be reserved for DMs by DMs. 😏
  - Optionally, `/DM monster --full (monsterName)` will also print all information about the monster's actions and abilities.
- `/spawn (monsterName)`
- `/help` displays a quick informational message.

Planned expansions:

- Managing instanced monsters, HP and location
- (Long shot): ASCII GUI for field representation
- TBA
