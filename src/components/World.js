import { Map } from "rot-js";
import Player from "./Player";

class World {
    constructor(width, height, tilesize) {
        this.width = width;
        this.height = height;
        this.tilesize = tilesize;
        this.entities = [new Player(0, 0, 16)];
        this.entitiesToDraw = this.entities;
        this.history = ["You entered the dungeon.", '---'];
        this.levelGenerated = false;

        // Create the worldmap
        this.worldmap = new Array(this.width);
        for (let x = 0; x < this.width; x++) {
            this.worldmap[x] = new Array(this.height);
        }
    }

    get player() {
        return this.entities[0];
    }

    // Return entity at given x,y location
    getEntityAtLocatoin(x, y) {
        return this.entities.find(entity => entity.x === x && entity.y === y);
    }

    setLevelGenerated(generated) {
        this.levelGenerated = generated;
    }

    movePlayer(dx, dy, context) {
        let tempPlayer = this.player.copyPlayer();
        tempPlayer.move(dx, dy);
        let entity = this.getEntityAtLocatoin(tempPlayer.x, tempPlayer.y);
        if (entity) {
            entity.action('bump', this);
            return;
        }

        if (this.isWall(tempPlayer.x, tempPlayer.y)) {
            // console.log(`Way blocked at ${tempPlayer.x}:${tempPlayer.y}!`);
        } else {
            this.player.move(dx, dy);
            this.entitiesToDraw.push(this.player)
        }
    }

    // useItem(item) {
    //     console.log("USE", item);
    //     switch(item.attributes.type) {
    //         case "health-potion": {
    //             this.player.heal(item.attributes.healAmount);
    //             this.player.inventory = this.player.inventory.filter(e => e !== item);
    //             var m_ctx2 = document.getElementById('loot-canvas').getContext('2d')
    //             this.draw(m_ctx2);
    //         }
    //     }
    // }

    // Adds an entity to the world
    add(entity) {
        this.entities.push(entity);
        this.entitiesToDraw.push(entity);
    }

    // Removes an entity from the world
    remove(entity) {
        entity.moved = false;
        this.entities = this.entities.filter(e => {return e !== entity});
        this.entitiesToDraw = this.entities;
    }

    // Moves an entity to a space not in a wall or occupied by another entity
    moveToSpace(entity) {
        for (let x = entity.x; x < this.width; x++) {
            for (let y = entity.y; y < this.height; y++) {
                if (this.worldmap[x][y] === 0 && !this.getEntityAtLocatoin(x, y)) {
                    entity.x = x;
                    entity.y = y;
                    return;
                }
            }
        }
    }

    // Generate a random map
    createRandomMap() {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                this.worldmap[x][y] = Math.round(Math.random()); // Puts either a 0 or 1 in the tile
            }
        }
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
        var m_canvas = document.getElementById('fg-canvas')
        var m_ctx2 = document.getElementById('loot-canvas').getContext('2d')
        var m_context = m_canvas.getContext('2d');
        m_context.clearRect(0, 0, this.width * this.tilesize, this.height * this.tilesize);
        m_ctx2.clearRect(0, 0, this.width * this.tilesize, this.height * this.tilesize);
    }

    // Draw the map
    draw(context) {
        // Only draw walls if the level isn't already generated/renewed.
        // This prevents the world from updating the walls continously, since walls do not
        // change.
        if (!this.levelGenerated) {
            for (let x = 0; x < this.width; x++) {
                for (let y = 0; y < this.height; y++) {
                    if (this.worldmap[x][y] === 1) this.drawWall(context, x, y);
                }
            }
        }

        // Draw entities
        //TODO: Check if entity position has updates, if so, only draw that entites update
        // this.entities.forEach((entity) => {
        //     entity.draw(context);
        // });
        this.entitiesToDraw.forEach((entity) => {
            entity.draw(context);
            this.entitiesToDraw = this.entitiesToDraw.filter(e => e !== entity);
        });
    }

    // Draw the wall
    drawWall(context, x, y) {
        context.fillStyle = "#fff";

        // Draw the wall on the foreground canvas
        const image = new Image(16, 16);
        image.src = 'images/BrickWall_001.png';
        var m_canvas = document.getElementById('fg-canvas')
        var m_context = m_canvas.getContext('2d');
        m_context.drawImage(image, x * this.tilesize, y * this.tilesize);
        image.addEventListener("load", () => {
            // console.log("Draw WALL")
            m_context.drawImage(image, x * this.tilesize, y * this.tilesize);
        })
        this.levelGenerated = true;
    }

    // Check if entity at position is at a wall
    isWall(x, y) {
        return this.worldmap[x] === undefined || this.worldmap[y] === undefined || this.worldmap[x][y] === 1;
    }

    addToHistory(history) {
        this.history.push(history);
        if (this.history.length > 6) this.history.shift();
    }
}

export default World;
