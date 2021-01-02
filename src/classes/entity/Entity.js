import shortid from "shortid";

class Entity {
    // x & y are on grid coordinates
    constructor(x, y, size, attributes) {
        this.id = shortid.generate();
        this.x = x;
        this.y = y;
        this.prevX = 0;
        this.prevY = 0;
        this.moved = false;
        this.size = size;
        this.attributes = { ...attributes };
        // Stats
    }

    action(verb, world) {
        console.log(`Verb: ${verb}`);
    }

    // Move the player
    move(dx, dy) {
        if (this.attributes.health <= 0) return;
        this.x += dx;
        this.y += dy;
        this.prevX += dx;
        this.prevY += dy;
    }

    copy() {
        let newEntity = new Entity();
        Object.assign(newEntity, this);
        return newEntity;
    }

    // Draw the entity
    draw(context, width, height, tilesize) {
        if (this.attributes.imgSrc) {
            if (this.attributes.type === "player") {
                const image = new Image(16, 16);
                image.src = this.attributes.imgSrc;
                let m_canvasP = document.getElementById('player-canvas')
                let m_contextP = m_canvasP.getContext('2d');
                const { width, height } = m_canvasP.getBoundingClientRect();
                m_contextP.clearRect(0, 0, width, height);
                image.addEventListener("load", () => {
                    m_contextP.drawImage(
                        image,
                        this.x * this.size + (this.attributes.offset ? this.attributes.offset.x : 0),
                        this.y * this.size + (this.attributes.offset ? this.attributes.offset.y : 0)
                    );
                });
                this.moved = false;
                return;
            }

            // Loot and currently monsters
            const image = new Image(16, 16);
            image.src = this.attributes.imgSrc;
            // let m_canvas = document.getElementById("loot-canvas");
            // let m_context = m_canvas.getContext('2d');
            // const { width, height } = m_canvas.getBoundingClientRect();
            context.clearRect(0, 0, width * tilesize, height * tilesize);
            image.addEventListener("load", () => {
                context.drawImage(
                    image,
                    this.x * this.size + (this.attributes.offset ? this.attributes.offset.x : 0),
                    this.y * this.size + (this.attributes.offset ? this.attributes.offset.y : 0)
                );
            });
            context.restore();
            return;
        }
        context.fillStyle = this.attributes.color || "white";
        context.textBaseline = "hanging";
        context.font = "16px Helvetica";
        context.fillText(
            this.attributes.ascii,
            this.x * this.size + (this.attributes.offset ? this.attributes.offset.x : 0),
            this.y * this.size + (this.attributes.offset ? this.attributes.offset.y : 0)
        );
    }
}

export default Entity;
