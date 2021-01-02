class Entity {
    // x & y are on grid coordinates
    constructor(x, y, size, attributes) {
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

    // Draw the entity
    draw(context) {
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
            let m_canvas = document.getElementById("loot-canvas");
            let m_context = m_canvas.getContext('2d');
            const { width, height } = m_canvas.getBoundingClientRect();
            m_context.clearRect(0, 0, width, height);
            image.addEventListener("load", () => {
                m_context.drawImage(
                    image,
                    this.x * this.size + (this.attributes.offset ? this.attributes.offset.x : 0),
                    this.y * this.size + (this.attributes.offset ? this.attributes.offset.y : 0)
                );
            });
            m_context.restore();
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
