class Entity {
    // x & y are on grid coordinates
    constructor(x, y, size, attributes) {
        this.x = x;
        this.y = y;
        this.prevX = 0;
        this.prevY = 0;
        this.moved = false;
        this.size = size;
        // this.img = new Image(16, 16);
        // this.loaded = false;
        this.attributes = { ...attributes };
        // var self = this;
        // this.img.onload = function() { self.loaded = true; }

        // this.img.onload();
    }

    action(verb, world) {
        console.log(`Verb: ${verb}`);
    }

    // Draw the entity
    draw(context) {
        // if (this.prevX !== this.x && this.prevY !== this.y || this.moved === false) {

        // console.log(`${this.attributes.name} -> PrevX: ${this.prevX} | X: ${this.x} || Loaded: ${this.loaded}`);
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
            // m_context.save();
            m_context.clearRect(0, 0, width, height);
            // m_context.drawImage(
            //     image,
            //     this.x * this.size + (this.attributes.offset ? this.attributes.offset.x : 0),
            //     this.y * this.size + (this.attributes.offset ? this.attributes.offset.y : 0)
            // );
            image.addEventListener("load", () => {
                m_context.drawImage(
                    image,
                    this.x * this.size + (this.attributes.offset ? this.attributes.offset.x : 0),
                    this.y * this.size + (this.attributes.offset ? this.attributes.offset.y : 0)
                );
            });
            // this.moved = true;
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
        // }
    }
}

export default Entity;
