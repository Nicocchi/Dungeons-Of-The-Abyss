import Leaf from "./Leaf";
import Vector2 from "./Vector2";

class Map {
    constructor(width = 0, height = 0) {
        this.bspMap = {
            leafs: [],
            rooms: [],
            halls: [],
            hallAmount: 0,
            roomAmount: 0,
        };
        this.width = width;
        this.height = height;

        this.binaryMap = new Array(this.width);
        for (let x = 0; x < this.width; x++) {
            this.binaryMap[x] = new Array(this.height);
        }
    }

    // Draw the room and hallway if it exists
    drawDebug(ctx, width, height, tilesize) {
        console.log("Draw Debug");
        // Draw BSP Sections
        this.bspMap.leafs.forEach((l) => {
            ctx.beginPath();
            ctx.strokeStyle = "#8b2628";
            ctx.strokeRect(l.x * tilesize, l.y * tilesize, l.width * tilesize, l.height * tilesize);
        });

        // Draw rooms
        this.bspMap.rooms.forEach((room, i) => {
            ctx.beginPath();
            ctx.fillStyle = "#000";
            ctx.fillRect(
                room.rect.x * tilesize,
                room.rect.y * tilesize,
                room.rect.width * tilesize,
                room.rect.height * tilesize
            );
        });

        // Draw halls
        this.bspMap.halls.forEach((c, i) => {
            c.forEach((h) => {
                ctx.beginPath();
                ctx.fillStyle = "#013c56";
                ctx.fillRect(h.x * tilesize, h.y * tilesize, h.width * tilesize, h.height * tilesize);
            });
        });

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                ctx.fillStyle = "rgba(166, 5, 104, 0.1)";
                if (this.bspMap.rooms.some((room) => room.x !== x) && this.bspMap.rooms.some((room) => room.y !== y)) {
                    ctx.fillRect(x * tilesize, y * tilesize, tilesize, tilesize);
                }
            }
        }
    }

    // Draw the room and hallway if it exists
    draw(ctx, width, height, tilesize) {
        // Draw rooms
        this.bspMap.rooms.forEach((c, i) => {
            ctx.beginPath();
            ctx.fillStyle = "#000";

            const image = new Image();
            image.src = "images/FloorTile001.png";
            var m_canvas = document.getElementById("bg-canvas");
            var m_context = m_canvas.getContext("2d");
            image.addEventListener("load", () => {
                m_context.drawImage(image, c.x * tilesize, c.y * tilesize);
            });
            ctx.fillRect(c.x * tilesize, c.y * tilesize, c.width * tilesize, c.height * tilesize);
        });

        // Draw halls
        this.bspMap.halls.forEach((c, i) => {
            c.forEach((h) => {
                ctx.beginPath();
                ctx.fillStyle = "#000";
                ctx.fillRect(h.x * 16, h.y * 16, h.width * 16, h.height * 16);
            });
        });

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                ctx.fillStyle = "rgba(166, 5, 104, 0.1)";
                if (this.bspMap.rooms.some((room) => room.x !== x) && this.bspMap.rooms.some((room) => room.y !== y)) {
                    // ctx.fillRect(x * 16, y * 16, 16, 16);

                    const image = new Image();
                    image.src = "images/BrickWall_003.png";
                    var m_canvas = document.getElementById("wall-canvas");
                    var m_context = m_canvas.getContext("2d");
                    image.addEventListener("load", () => {
                        // m_context.drawImage(image, x * tilesize, y * tilesize);
                    });
                }
            }
        }
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

        // Add the rooms and halls
        this.bspMap.leafs.forEach((l) => {
            if (l.room !== null) {
                this.bspMap.rooms.push(l.room);
            }

            if (l.halls !== null && l.halls.length > 0) {
                this.bspMap.halls.push(l.halls[0]);
            }
        });
    }


    /**
     * Creates a binary map of the BSP map. Stores inside the map's binaryMap object.
     *
     * @memberof Map
     */
    createBinaryMap() {
        // Create a vector2 grid on the base map
        for (let x = 0; x < this.binaryMap.length; x++) {
            for (let y = 0; y < this.binaryMap[x].length; y++) {
                const point = new Vector2(x, y);
                this.binaryMap[x][y] = point;
            }
        }

        let vectors = []; // To store all our vectors in for checking later

        // Loop through the rooms and add the vector points to the vector array
        for (let r = 0; r < this.bspMap.rooms.length; r++) {
            for (let a = 0; a < this.bspMap.rooms[r].area.length; a++) {
                this.roomCount += this.bspMap.rooms[r].area[a].length;
                const tempVects = vectors.concat(this.bspMap.rooms[r].area[a]);
                vectors = tempVects;
            }
        }

        // Same as the rooms, loop and add it's vector points to the vector array
        for (let h = 0; h < this.bspMap.halls.length; h++) {
            for (let a = 0; a < this.bspMap.halls[h].area.length; a++) {
                this.hallCount += this.bspMap.halls[h].area[a].length;
                const tempVects = vectors.concat(this.bspMap.halls[h].area[a]);
                vectors = tempVects;
            }
        }

        // Now, re-loop through the binary map and check if the vector coords exists 
        // inside the vector array
        for (let x = 0; x < this.binaryMap.length; x++) {
            for (let y = 0; y < this.binaryMap[x].length; y++) {
                const point = this.binaryMap[x][y];
                vectors.some((v) => v.x === point.x && v.y === point.y)
                    ? (this.binaryMap[x][y] = 0)
                    : (this.binaryMap[x][y] = 1);
            }
        }
    }
}

export default Map;
