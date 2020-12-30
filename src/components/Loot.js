import Entity from "./Entity";

class Loot extends Entity {
    action(verb, world) {
        if (verb === 'bump') {
            world.player.attributes.gold += this.attributes?.amount | 0;
            world.player.add(this);
            world.addToHistory(`You picked up a ${this.attributes.name}`)
            world.remove(this);
        }

        if (verb === 'drop') {
            console.log("drop", this);
        }
    }
}

export default Loot;