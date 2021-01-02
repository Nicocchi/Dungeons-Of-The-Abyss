import { Player } from "./entity";
import Spawner from "./Spawner";
import { Map } from "./map";
import { randomNumber, randomRegInt } from "../utils/utils";
import { Vector2 } from "./math";

class Engine {
    constructor(width, height, tilesize) {
        this.width = width;
        this.height = height;
        this.tilesize = tilesize;
        this.entities = [new Player(0, 0, 16)];
        this.monsters = [];
        this.loot = [];
        this.entitiesToDraw = this.entities;
        this.history = [
            <p style={{ color: "#ffff00" }}>Welcome to Dungeons of the Abyss</p>,
            "Press ? to display help menu",
        ];
        this.levelGenerated = false;
        this.map = null;
        this.loading = true;
        this.floor = 1;
    }

    get player() {
        return this.entities[0];
    }

    init() {
        this.loading = true;
        this.levelGenerated = false;
        this.map = new Map(this.width, this.height);
        this.map.createBSPMap(this.width, this.height, 20);
        this.map.createBinaryMap();
        console.log("Map", this.map);

        // Clear all entities except the player
        this.entities = this.entities.filter((e) => e === this.player);
        this.entitiesToDraw = this.entities;
        this.monsters = [];

        this.moveToSpace(this.player);

        this.spawn();
        this.loading = false;
    }

    // Return entity at given x,y location
    getEntityAtLocation(x, y, id) {
        return this.entities.find((entity) => entity.x === x && entity.y === y && entity.id !== id);
    }

    getMonsterAtLocation(x, y, id) {
        return this.monsters.find((entity) => entity.x === x && entity.y === y);
    }

    changeDungeons() {
        let entity = this.getEntityAtLocation(this.player.x, this.player.y, this.player.id);
        entity.action("bump", this);
        this.floor += 1;
        return;
    }

    pathfinding() {
        let pathStart = [this.width, this.height];
        let pathEnd = [0, 0];
        let currentPath = [];

        while (currentPath.length == 0) {
            pathStart = [Math.floor(Math.random() * this.width), Math.floor(Math.random() * this.height)];
            pathEnd = [Math.floor(Math.random() * this.width), Math.floor(Math.random() * this.height)];
            // if (this.map.binaryMap[pathStart[0]][pathStart[1]] == 0) currentPath = findPath(this.map.binaryMap, pathStart, pathEnd, "Manhattan");
        }
    }

    movePlayer(dx, dy) {
        this.moveMonster();
        let tempPlayer = this.player.copy();
        tempPlayer.move(dx, dy);
        let entity = this.getEntityAtLocation(tempPlayer.x, tempPlayer.y, tempPlayer.id);
        let monster = this.getMonsterAtLocation(tempPlayer.x, tempPlayer.y);
        if (entity && entity.attributes.name !== "Stairs") {
            entity.action("bump", this);
            return;
        }

        if (monster) {
            monster.action("bump", this);
            return;
        }

        if (!this.isWall(tempPlayer.x, tempPlayer.y)) {
            this.player.move(dx, dy);
            this.entitiesToDraw.push(this.player);
            // this.addToHistory(<p style={{ color: "#c23538" }}>Path is blocked</p>);
        }
    }

    moveMonster() {
        const num = randomRegInt(0, 3);
        for (let i = 0; i < this.monsters.length; i++) {
            // console.log(this.entities[i])
            let tempEntity = this.monsters[i].copy();
            
            // console.log(tempEntity.id, this.entities[i].id)
            // console.log("Entity", entity);
            
            let value = new Vector2();
            switch (num) {
                case 0:
                    value = new Vector2(-1, 0);
                    break;
                case 1:
                    value = new Vector2(0, -1);
                    break;
                case 2:
                    value = new Vector2(1, 0);
                    break;
                case 3:
                    value = new Vector2(0, 1);
                    break;
                default:
                    value = new Vector2(0, 0);
                    break;
            }
            tempEntity.move(value.x, value.y);
            let entity = this.getEntityAtLocation(tempEntity.x, tempEntity.y, this.monsters[i].id);
            if (entity) return;
            if (!this.isWall(tempEntity.x, tempEntity.y)) {
                this.monsters[i].move(value.x, value.y);
            }
        }
    }

    // Adds an entity to the world
    add(entity) {
        if (entity.attributes.type === "monster") {
            this.monsters.push(entity);
        } else {
            this.entities.push(entity);
            this.entitiesToDraw.push(entity);
        }
        
    }

    // Removes an entity from the world
    remove(entity) {
        entity.moved = false;
        if (entity.attributes.type === "monster") {
            this.monsters = this.monsters.filter((e) => {
                return e !== entity;
            });
        }
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

    // Generates coords for an entity. If position is on wall, re-generate.
    generateCoords(world) {
        let x = randomNumber(world.width - 1);
        let y = randomNumber(world.width - 1);
        if (
            world.map.binaryMap[x][y] === 1 ||
            world.map.binaryMap[x][y] === 2 ||
            world.map.binaryMap[x][y] === undefined
        ) {
            return this.generateCoords(world);
        } else {
            const coords = {
                x,
                y,
                worldPosition: world.map.binaryMap[x][y],
            };
            return coords;
        }
    }

    // Spawns entities.
    spawn() {
        let spawner = new Spawner(this);
        spawner.spawnLoot(3);
        spawner.spawnMonsters(6);
        spawner.spawnStairs();
    }

    // Draw the map
    draw(context) {
        if (!this.map) return;
        // Only draw walls if the level isn't already generated/renewed.
        // This prevents the world from updating the walls continously, since walls do not
        // change.
        if (!this.levelGenerated) {
            for (let x = 0; x < this.width; x++) {
                for (let y = 0; y < this.height; y++) {
                    this.drawFloor(context, x, y);
                    if (this.map.binaryMap[x][y] === 1) this.drawWall(context, x, y);
                }
            }
        }

        // Draw entities
        this.entitiesToDraw.forEach((entity) => {
            let m_context = document.getElementById("loot-canvas").getContext("2d");
            entity.draw(m_context, this.width, this.height, this.tilesize);
            this.entitiesToDraw = this.entitiesToDraw.filter((e) => e !== entity);
        });

        this.monsters.forEach(entity => {
            let m_context = document.getElementById("mon-canvas").getContext("2d");
            entity.draw(m_context, this.width, this.height, this.tilesize);
        })
    }

    drawFloor(context, x, y) {
        context.fillStyle = "#000";

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
        var m_canvas = document.getElementById("wall-canvas");
        var m_context = m_canvas.getContext("2d");
        m_context.clearRect(0, 0, this.width * this.tilesize, this.height * this.tilesize);
        image.addEventListener("load", () => {
            m_context.drawImage(image, x * this.tilesize, y * this.tilesize);
        });
        this.levelGenerated = true;
    }

    // Check if entity at position is at a wall
    isWall(x, y) {
        return (
            this.map.binaryMap[x] === undefined || this.map.binaryMap[y] === undefined || this.map.binaryMap[x][y] === 1
        );
    }

    addToHistory(history) {
        this.history.push(history);
        if (this.history.length > 14) this.history.shift();
    }
}

export default Engine;
