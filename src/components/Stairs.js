import Entity from "./Entity";
import Map from "./Map/Map";
import Spawner from "./Spawner";

class Stairs extends Entity {
    attributes = {
        name: "Stairs",
        color: "black",
        ascii: ">",
        offset: { x: 0, y: 0 },
        imgSrc: "/images/Stairs_001.png",
    };

    action(verb, world) {
        if (verb === "bump") {
            world.addToHistory("You move down the stairs...");

            // Generate world
            world.setLevelGenerated(false);
            world.map = new Map(world.width, world.height);
            world.map.createBSPMap(world.width, world.height, 20);
            world.map.createBinaryMap();
            // world.init();

            // Re-position player
            world.moveToSpace(world.player);

            // // Clear all entities except the player
            world.entities = world.entities.filter((e) => e === world.player);
            world.entitiesToDraw = world.entities;

            // // Spawn new loot and monsters
            let spawner = new Spawner(world);
            spawner.spawnLoot(10);
            spawner.spawnMonsters(6);
            spawner.spawnStairs();
        }
    }
}

export default Stairs;
