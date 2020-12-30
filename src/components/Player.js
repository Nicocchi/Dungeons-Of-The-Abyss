import Entity from "./Entity";

class Player extends Entity {
    inventory = [];

    attributes = {
        name: "Player",
        ascii: "@",
        health: 10,
        gold: 0,
        offset: {x: 0, y: -6},
        imgSrc: "/images/Person_001.png" ,
        type: "player"
    }

    // Move the player
    move(dx, dy) {
        if (this.attributes.health <= 0) return;
        this.x += dx;
        this.y += dy;
        this.prevX += dx;
        this.prevY += dy;
    }

    use(item) {
        console.log("USE", item);
        switch(item.attributes.type) {
            case "health-potion": {
                this.heal(item.attributes.healAmount);
                this.inventory = this.inventory.filter(e => e !== item);
                break;
            }
            default:
                break;
        }
    }

    heal(amount) {
        this.attributes.health += amount;
    }

    // Add item to inventory
    add(item) {
        this.inventory.push(item);
    }

    copyPlayer() {
        let newPlayer = new Player();
        Object.assign(newPlayer, this);
        return newPlayer;
    }
}

export default Player;
