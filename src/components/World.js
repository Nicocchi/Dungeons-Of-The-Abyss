import { Map, RNG } from "rot-js";
import Player from "./Player";
import Spawner from "./Spawner";
import Map2 from "./Map/Map";
import Vector2 from "./Map/Vector2";

class World {
    constructor(width, height, tilesize) {
        this.width = width;
        this.height = height;
        this.tilesize = tilesize;
        this.entities = [new Player(0, 0, 16)];
        this.entitiesToDraw = this.entities;
        this.history = [
            <p style={{ color: "#ffff00" }}>Welcome to Dungeons of the Abyss</p>,
            "Press ? to display help menu",
        ];
        this.levelGenerated = false;
        this.map = new Map2();

        // Create the worldmap
        this.worldmap = new Array(this.width);
        for (let x = 0; x < this.width; x++) {
            this.worldmap[x] = new Array(this.height);
        }

        this.worldmap2 = new Array(this.width);
        for (let x = 0; x < this.width; x++) {
            this.worldmap2[x] = new Array(this.height);
        }
        this.mousePos = new Vector2();
    }

    get player() {
        return this.entities[0];
    }

    // Return entity at given x,y location
    getEntityAtLocatoin(x, y) {
        return this.entities.find((entity) => entity.x === x && entity.y === y);
    }

    setLevelGenerated(generated) {
        this.levelGenerated = generated;
    }

    movePlayer(dx, dy, context) {
        let tempPlayer = this.player.copyPlayer();
        tempPlayer.move(dx, dy);
        let entity = this.getEntityAtLocatoin(tempPlayer.x, tempPlayer.y);
        if (entity) {
            entity.action("bump", this);
            return;
        }

        if (this.isWall(tempPlayer.x, tempPlayer.y)) {
            this.addToHistory(<p style={{ color: "#c23538" }}>Path is blocked</p>);
            // console.log(`Way blocked at ${tempPlayer.x}:${tempPlayer.y}!`);
        } else {
            this.player.move(dx, dy);
            this.entitiesToDraw.push(this.player);
        }
    }

    // Adds an entity to the world
    add(entity) {
        this.entities.push(entity);
        this.entitiesToDraw.push(entity);
    }

    // Removes an entity from the world
    remove(entity) {
        entity.moved = false;
        this.entities = this.entities.filter((e) => {
            return e !== entity;
        });
        this.entitiesToDraw = this.entities;
    }

    // Moves an entity to a space not in a wall or occupied by another entity
    moveToSpace(entity) {
        const coords = this.generateCoords(this);
        entity.x = coords.x;
        entity.y = coords.y;
    }

    generateCoords(world) {
        let x = this.getRandomInt(world.width - 1);
        let y = this.getRandomInt(world.width - 1);
        if (world.worldmap[x][y] === 1 || world.worldmap[x][y] === undefined) {
            return this.generateCoords(world);
        } else {
            const coords = {
                x,
                y,
                worldPosition: world.worldmap[x][y],
            };
            return coords;
        }
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    // Generate a random map
    createRandomMap() {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                this.worldmap[x][y] = Math.round(Math.random()); // Puts either a 0 or 1 in the tile
            }
        }
    }

    addCell(map, x, y) {
        map[x][y] = { x, y };
    }

    createBSPMap() {
        this.map = new Map2(this.worldmap2);
        this.map.createBSPMap(this.width, this.height, 20);
        console.log("Map", this.map);
        // for (let x = 0; x < this.width; x++) {
        //     this.worldmap2[x] = [];
        //     for (let y = 0; y < this.height; y++) {
        //         this.addCell(this.worldmap2, x, y);
        //     }
        // }

        // for (let x1 = 0; x1 < this.width; x1++) {
        //     for (let y1 = 0; y1 < this.height; y1++) {
        //         // map2.rooms.forEach(rm => {
        //         //     rm === 1 ? this.worldmap2[x1][y1] = 1 : this.worldmap2[x1][y1] = 0
        //         // })
        //     }
        // }
    }

    // Generate a rogue map
    createRogueMap() {
        var map = new Map.Rogue(this.width, this.height, { cellHeight: 3, cellWidth: 6 });
        console.log(map);
        var userCallback = (x, y, value) => {
            // Make sure there are walls on all the edges
            if (x === 0 || y === 0 || x === this.width - 1 || y === this.height - 1) {
                this.worldmap[x][y] = 1; // Create walls around the edges of map
                return;
            }
            this.worldmap[x][y] = value === 0 ? 0 : 1;
        };

        map.create(userCallback);
        const coords = this.generateCoords(this);
        this.player.x = coords.x;
        this.player.y = coords.y;
        this.moveToSpace(this.player);

        this.entitiesToDraw = this.entities;
        var m_canvas = document.getElementById("fg-canvas");
        var m_ctx2 = document.getElementById("loot-canvas").getContext("2d");
        var m_context = m_canvas.getContext("2d");
        m_context.clearRect(0, 0, this.width * this.tilesize, this.height * this.tilesize);
        m_ctx2.clearRect(0, 0, this.width * this.tilesize, this.height * this.tilesize);
    }

    spawn() {
        let spawner = new Spawner(this);
        spawner.spawnLoot(3);
        spawner.spawnMonsters(6);
        spawner.spawnStairs();
    }

    // Generate a cellular map
    createCellularMap() {
        var map = new Map.Cellular(this.width, this.height, { connected: true });
        map.randomize(0.5);
        var userCallback = (x, y, value) => {
            // Make sure there are walls on all the edges
            if (x === 0 || y === 0 || x === this.width - 1 || y === this.height - 1) {
                this.worldmap[x][y] = 1; // Create walls around the edges of map
                return;
            }
            this.worldmap[x][y] = value === 0 ? 1 : 0;
        };

        map.create(userCallback);
        map.connect(userCallback, 1);

        this.entitiesToDraw = this.entities;
        var m_canvas = document.getElementById("fg-canvas");
        var m_ctx2 = document.getElementById("loot-canvas").getContext("2d");
        var m_context = m_canvas.getContext("2d");
        m_context.clearRect(0, 0, this.width * this.tilesize, this.height * this.tilesize);
        m_ctx2.clearRect(0, 0, this.width * this.tilesize, this.height * this.tilesize);
    }

    // Draw the map
    draw(context) {
        // Only draw walls if the level isn't already generated/renewed.
        // This prevents the world from updating the walls continously, since walls do not
        // change.
        this.map.draw(context);
        if (!this.levelGenerated) {
            for (let x = 0; x < this.width; x++) {
                for (let y = 0; y < this.height; y++) {
                    // this.drawFloor(context, x, y);
                    // this.drawWall2(context, x, y, this.map)
                    // if (this.worldmap[x][y] === 1) this.drawWall(context, x, y);
                }
            }
        }

        // Draw entities
        this.entitiesToDraw.forEach((entity) => {
            entity.draw(context);
            this.entitiesToDraw = this.entitiesToDraw.filter((e) => e !== entity);
        });
    }

    drawFloor(context, x, y) {
        context.fillStyle = "#fff";

        // Draw the floor on the background canvas
        const image = new Image();
        image.src = "images/FloorTile_002.png";
        var m_canvas = document.getElementById("bg-canvas");
        var m_context = m_canvas.getContext("2d");
        image.addEventListener("load", () => {
            m_context.drawImage(image, x * this.tilesize, y * this.tilesize);
        });
    }

    // Draw the wall
    drawWall(context, x, y) {
        context.fillStyle = "#fff";

        // Draw the wall on the foreground canvas
        const image = new Image();
        image.src = "images/BrickWall_003.png";
        var m_canvas = document.getElementById("fg-canvas");
        var m_context = m_canvas.getContext("2d");
        image.addEventListener("load", () => {
            m_context.drawImage(image, x * this.tilesize, y * this.tilesize);
        });
        this.levelGenerated = true;
    }

    // Check if entity at position is at a wall
    isWall(x, y) {
        return this.worldmap[x] === undefined || this.worldmap[y] === undefined || this.worldmap[x][y] === 1;
    }

    addToHistory(history) {
        this.history.push(history);
        if (this.history.length > 14) this.history.shift();
    }

    
}

function search(x, y, myArray) {
    if (myArray === undefined) return false;
    for (var i = 0; i < myArray.length; i++) {
        if (myArray[i].x === x && myArray[i].y === y) {
            return true;
        }
    }
}

export default World;
