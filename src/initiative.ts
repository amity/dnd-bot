export function initiative(channelID: string, inputString: string): string {
    const terms = inputString.split(' ');
    let currentMobs: Array<Monster>;

    if(terms[0] != 'set' && terms[0] != 'roll') {
        currentMobs = global.currentMonsters.get(channelID)!;
        if(!currentMobs) { // No mobs yet
            return 'Please instantiate some creatures with /spawn, /rollinitiative, or /setinitiative.'
        }
    }
    else {
        currentMobs = global.currentMonsters.get(channelID)!;

        // Create monster set for channel if it doesn't currently exist
        if (currentMobs === undefined) {
            global.currentMonsters.set(channelID, new Array<Monster>());
            currentMobs = new Array<Monster>(); // weird code but only one get
        }

        // Handle each mob by setting initiative or creating new mob w/ specified init
        for(let i=1; i < terms.length; i += 2){
            const initiative = terms[0] == 'roll' ?
                Math.floor(Math.random() * 21) + parseInt(terms[i+1]) :
                parseInt(terms[i+1])
            const existingMonster = currentMobs.find((mob) => mob.name == terms[i]);
            existingMonster ?
                existingMonster.initiative = initiative :
                currentMobs.push(new Monster(terms[i], undefined, initiative))
        }

        global.currentMonsters.set(channelID, currentMobs);
    }


    // Figure that people will be checking the list of monsters more often than adding, so this sorts on addition.
    const sortedMobs = currentMobs.filter((mob => mob.initiative != -100)).sort((m1, m2) => {
        return m1.initiative > m2.initiative ? 1 : -1;
    });
    return `${sortedMobs.map(mob => mob.name + ": " + mob.initiative).join(`
`)}`;
}


