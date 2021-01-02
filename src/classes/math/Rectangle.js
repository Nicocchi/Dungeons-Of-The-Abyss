import Vector2 from "./Vector2";

class Rectangle {
    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.top = this.y;
        this.topLeft = new Vector2(this.x, this.y);
        this.bottom = this.y + this.height;
        this.bottomRight = new Vector2(this.x + this.width, this.y + this.height);
        this.left = this.x;
        this.right = this.x + this.width;
        this.size = new Vector2(this.width, this.height);

    }
}

export default Rectangle;
