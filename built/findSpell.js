var spellData = require("../spells.json");

module.exports = {
  findSpell: function(inputString) {
    let mySpell = spellData.find(spell => {
      return spell.name == inputString;
    });
    if (!mySpell) {
      return "Error: Spell not found.";
    }
    let requirements;
    switch (mySpell.components) {
      case "V":
        requirements = "Verbal";
        break;
      case "S":
        requirements = "Somatic";
        break;
      case "V, S":
        requirements = "Verbal, Somatic";
        break;
      case "V, M":
        requirements = `Verbal, Material: ${mySpell.material}`;
        break;
      case "S, M":
        requirements = `Somatic, Material: ${mySpell.material}`;
        break;
      case "V, S, M":
        requirements = `Verbal, Somatic, Material: ${mySpell.material}`;
        break;
    }
    requirements = (mySpell.ritual ? "Ritual + " : "") + requirements;
    const spellMessage = `
      Spell: ${mySpell.name}
      Description: ${
        mySpell.desc.length > 1500
          ? mySpell.desc.substr(0, 1500) + "..."
          : mySpell.desc
      }
      Range: ${mySpell.range}
      Duration: ${mySpell.duration} ${
      mySpell.concentration ? ", **Concentrated**" : ""
    }
      Cast time: ${mySpell.casting_time}
      Level: ${mySpell.level} ${mySpell.school} for ${mySpell.class}
      `;
    return spellMessage;
  }
};
