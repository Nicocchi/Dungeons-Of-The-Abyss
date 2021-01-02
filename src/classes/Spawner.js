import { randomNumber } from "../utils/utils";
import { Loot, Monster, Stairs } from "./entity";

// Table of loot
const lootTable = [
    {
        name: "Long Sword",
        color: "darkgrey",
        ascii: "/",
        offset: { x: 0, y: -4 },
        imgSrc: "/images/Sword_001.png",
        type: "weapon",
        atk: 4,
    },
    {
        name: "Health Potion",
        color: "red",
        ascii: "!",
        offset: { x: 0, y: -6 },
        imgSrc: "/images/HealthPotion_001.png",
        healAmount: 3,
        type: "health-potion",
    },
    {
        name: "Gold Coin",
        color: "yellow",
        ascii: "$",
        offset: { x: 0, y: 0 },
        imgSrc: "/images/GoldBar_001.png",
        amount: 10,
        type: "gold",
    },
    {
        name: "Light Armour",
        color: "lightgrey",
        ascii: "[",
        offset: { x: 0, y: 0 },
        imgSrc: "/images/Armour_001.png",
        type: "armour",
        def: 4,
    },
];

// Table of monsters
const monsterTable = [
    { name: "Ogre", color: "lightgrey", ascii: "O", offset: { x: 0, y: 0 }, health: 6, imgSrc: "/images/Ogre_001.png" },
    { name: "Snake", color: "green", ascii: "k", offset: { x: 0, y: 0 }, health: 3, imgSrc: "/images/Snake_001.png" },
    {
        name: "Slime",
        color: "darkgreen",
        ascii: "S",
        offset: { x: 0, y: 0 },
        health: 2,
        imgSrc: "/images/Slime_001.png",
    },
    // { name: "Dragon", color: "red", ascii: "D", offset: { x: 0, y: -6 }, health: 10, imgSrc: "/images/Dragon_001.png" },
];

// Spawns entities
class Spawner {
    constructor(world) {
        this.world = world;
    }

    // Spawn an entity and move to world
    spawn(spawnCount, createEntity) {
        for (let count = 0; count < spawnCount; count++) {
            let entity = createEntity();
            this.world.add(entity);
            this.world.moveToSpace(entity);
        }
    }

    // Spawn random loot
    spawnLoot(spawnCount) {
        this.spawn(spawnCount, () => {
            return new Loot(0, 0, this.world.tilesize, lootTable[randomNumber(lootTable.length)]);
        });
    }

    // Spawn random monsters
    spawnMonsters(spawnCount) {
        this.spawn(spawnCount, () => {
            return new Monster(0, 0, this.world.tilesize, monsterTable[randomNumber(monsterTable.length)]);
        });
    }

    // Spawn the stairs
    spawnStairs() {
        let stairs = new Stairs(0, 0, this.world.tilesize);
        this.world.add(stairs);
        this.world.moveToSpace(stairs);
    }
}

export default Spawner;
