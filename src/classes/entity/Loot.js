import Entity from "./Entity";

class Loot extends Entity {
    action(verb, world) {
        if (verb === "bump") {
            if (world.player.inventory.length < 15) {
                world.player.attributes.gold += this.attributes?.amount | 0;
                world.player.add(this);
                world.addToHistory(`You picked up a ${this.attributes.name}`);
                world.remove(this);
            } else {
            world.addToHistory(<p>Your inventory is full!</p>);
            }
        }

        if (verb === "drop") {
            console.log("drop", this);
        }
    }
}

export default Loot;
