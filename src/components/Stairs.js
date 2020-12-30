import Entity from "./Entity";
import Spawner from "./Spawner";

class Stairs extends Entity {
    attributes = {
        name: "Stairs",
        color: "black",
        ascii: ">",
        offset: { x: 0, y: 0 },
        imgSrc: "/images/Stairs_001.png" 
    };

    action(verb, world) {
        if (verb === 'bump') {
            world.addToHistory("You move down the stairs...");
            world.setLevelGenerated(false);
            world.createCellularMap();
            world.player.x = 0;
            world.player.y = 0;
            world.moveToSpace(world.player);
            world.entities = world.entities.filter(e => e === world.player);
            world.entitiesToDraw = world.entities;
            let spawner = new Spawner(world);
            spawner.spawnLoot(10);
            spawner.spawnMonsters(6);
            spawner.spawnStairs();
        }
    }
}

export default Stairs;
