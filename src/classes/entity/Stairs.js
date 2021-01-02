import Entity from "./Entity";

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
            world.init();
        }
    }
}

export default Stairs;
