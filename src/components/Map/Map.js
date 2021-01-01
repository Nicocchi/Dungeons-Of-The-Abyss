import Leaf from "./Leaf";

class Map {
    constructor() {
        this.bspMap = {
            leafs: [],
            rooms: [],
            halls: []
        };
    }

    draw(ctx) {
        // Draw the room and hallway if it exists
        this.bspMap.leafs.forEach((l) => {
            ctx.beginPath();
            ctx.strokeStyle = "#8b2628";
            ctx.strokeRect(l.x * 16, l.y * 16, l.width * 16, l.height * 16);

            if (l.room !== null) {
                this.bspMap.rooms.push(l.room);

                this.bspMap.rooms.forEach((c, i) => {
                    ctx.beginPath();
                    ctx.strokeStyle = "#4b268b";
                    ctx.fillRect(c.x * 16, c.y * 16, c.width * 16, c.height * 16);
                });

                this.bspMap.halls.forEach((c, i) => {
                    c.forEach((h) => {
                        ctx.beginPath();
                        ctx.strokeStyle = "#8b5428";
                        ctx.fillRect(h.x * 16, h.y * 16, h.width * 16, h.height * 16);
                    });
                });
            }

            if (l.halls !== null && l.halls.length > 0) {
                this.bspMap.halls.push(l.halls);
            }
        });
    }

    createBSPMap(width, height, maxLeafSize) {
        let root = new Leaf(0, 0, width, height); // Root Leaf
        this.bspMap.leafs.push(root);

        // Loop through every Leaf until no more Leafs can be split
        let didSplit = true;
        while (didSplit) {
            didSplit = false;
            this.bspMap.leafs.forEach((l) => {
                // If this Leaf is not already split
                if (l.leftChild === null && l.rightChild === null) {
                    // If this Leaf is too big, or 75% chance...
                    if (l.width > maxLeafSize || l.height > maxLeafSize) {
                        // Split the Leaf!
                        if (l.split()) {
                            // If we did split, push the child leaf to the Array so it can loop into them next
                            this.bspMap.leafs.push(l.leftChild);
                            this.bspMap.leafs.push(l.rightChild);
                            didSplit = true;
                        }
                    }
                }
            });
        }

        // Iterate through each Leaf and create a room in each one
        root.createRooms();
    }
}

export default Map;
