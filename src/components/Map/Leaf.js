import Point from "./Point";
import Rectangle from "./Rectangle";
import { randomNumber } from "../Utils/utils";
import Vector2 from "./Vector2";

class Leaf {
    constructor(x = 0, y = 0, width = 1, height = 1, minLeafSize = 6) {
        this.minLeafSize = minLeafSize;
        // Position and size
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.leftChild = null; // The Leaf's left child Leaf
        this.rightChild = null; // The Leaf's right child Leaf
        this.room = null; // The room that is inside this Leaf
        this.halls = []; // Hallways to connect this Leaf to other Leafs
    }

    // Split the Leaf into two children
    split() {
        // Begin splitting th leaf into two children
        if (this.leftChild !== null || this.rightChild !== null) return false; // We're already split

        // Determine direction of split.
        // If the width is >25% larger than height, split vertically
        // If the height is >25% larger than the width, split horizontally
        // otherwise split randomly

        let splitH = Math.floor(Math.random() * Math.floor(1));
        if (this.width > this.height && this.width / this.height >= 1.25) {
            splitH = false;
        } else if (this.height > this.width && this.height / this.width >= 1.25) {
            splitH = true;
        }

        let max = (splitH ? this.height : this.width) - this.minLeafSize; // determine the maximum height or width
        if (max <= this.minLeafSize) return false; // the area is too small to split any more

        let split = randomNumber(this.minLeafSize, max); // Determine where it's going to split

        // Create the left and right children based on the direction of the split
        if (splitH) {
            this.leftChild = new Leaf(this.x, this.y, this.width, split);
            this.rightChild = new Leaf(this.x, this.y + split, this.width, this.height - split);
        } else {
            this.leftChild = new Leaf(this.x, this.y, split, this.height);
            this.rightChild = new Leaf(this.x + split, this.y, this.width - split, this.height);
        }

        return true;
    }

    generateRectArea(rect) {
        let area = [];
        for (let j = 0; j < rect.height; j++) {
            let row = [];
            for (let i = 0; i < rect.width; i++) {
                row.push(new Vector2(rect.x + i, rect.y + j));
            }
            area.push(row);
        }

        return area;
    }

    // Create rooms in each of the Leafs. Starting from the biggest (root) Leaf
    // all the way to the smallest Leafs with no children.
    createRooms() {
        // Generates all the rooms and hallways for this Leaf and all of its children
        if (this.leftChild !== null || this.rightChild !== null) {
            // This leaf has been split, so go into the children leafs
            if (this.leftChild !== null) this.leftChild.createRooms();
            if (this.rightChild !== null) this.rightChild.createRooms();

            // If there are both left and right children in this Leaf, create a hallway between them
            if (this.leftChild !== null && this.rightChild !== null) {
                this.createHall(this.leftChild.getRoom(), this.rightChild.getRoom());
            }
        } else {
            // This Leaf is ready to make a room
            let roomSize = new Point();
            let roomPos = new Point();
            // The room can be between 3 x 3 tiles to the size of the leaf - 2
            roomSize = new Point(randomNumber(3, this.width - 2), randomNumber(3, this.height - 2));

            // Place the room within the Leaf, but don't put it right against the side of the Leaf (that would merge rooms together)
            roomPos = new Point(
                randomNumber(1, this.width - roomSize.x - 1),
                randomNumber(1, this.height - roomSize.y - 1)
            );

            // this.room = {x: this.x + roomPos.x, y: this.y + roomPos.y, width: roomSize.x, height: roomSize.y}
            // this.room = new Rectangle(this.x + roomPos.x, this.y + roomPos.y, roomSize.x, roomSize.y);
            const rect = new Rectangle(this.x + roomPos.x, this.y + roomPos.y, roomSize.x, roomSize.y);
            const area = this.generateRectArea(rect);
            this.room = {
                rect,
                area,
            };
        }
    }

    getRoom() {
        // Iterate all the way through these leafs to find a room, if one exists.
        if (this.room !== null) return this.room;

        let lRoom = { x: 0, y: 0 };
        let rRoom = { x: 0, y: 0 };
        if (this.leftChild !== null) lRoom = this.leftChild.getRoom();
        if (this.rightChild !== null) rRoom = this.rightChild.getRoom();
        if (lRoom === null && rRoom === null) {
            return null;
        } else if (rRoom === null) {
            return lRoom;
        } else if (lRoom === null) {
            return rRoom;
        } else if (Math.floor(Math.random() * Math.floor(1.25)) > 1.25) {
            return lRoom;
        } else {
            return rRoom;
        }
    }

    createHall(l, r) {
        // Connect these two rooms together with hallways.
        // This is trying to figure out which point is where and then either draw a straight line, or a pair of lines
        // to make a right-angle to connect them.

        let point1 = new Point(
            randomNumber(l.rect.left + 1, l.rect.right - 2),
            randomNumber(l.rect.top + 1, l.rect.bottom - 2)
        );
        let point2 = new Point(
            randomNumber(r.rect.left + 1, r.rect.right - 2),
            randomNumber(r.rect.top + 1, r.rect.bottom - 2)
        );

        let w = point2.x - point1.x;
        let h = point2.y - point1.y;

        if (w < 0) {
            if (h < 0) {
                if (Math.floor(Math.random() * Math.floor(1.25)) < 1.25) {
                    const rectA = new Rectangle(point2.x, point1.y, Math.abs(w), 1);
                    const rectB = new Rectangle(point2.x, point2.y, 1, Math.abs(h));
                    const areaA = this.generateRectArea(rectA);
                    const areaB = this.generateRectArea(rectB);
                    const area = areaA.concat(areaB);
                    const hall = {
                        rectA,
                        rectB,
                        area,
                    };
                    this.halls.push(hall);
                } else {
                    const rectA = new Rectangle(point2.x, point2.y, Math.abs(w), 1);
                    const rectB = new Rectangle(point1.x, point2.y, 1, Math.abs(h));
                    const areaA = this.generateRectArea(rectA);
                    const areaB = this.generateRectArea(rectB);
                    const area = areaA.concat(areaB);
                    const hall = {
                        rectA,
                        rectB,
                        area,
                    };
                    this.halls.push(hall);
                }
            } else if (h > 0) {
                if (Math.floor(Math.random() * Math.floor(1.25)) < 1.25) {
                    const rectA = new Rectangle(point2.x, point1.y, Math.abs(w), 1);
                    const rectB = new Rectangle(point2.x, point1.y, 1, Math.abs(h));
                    const areaA = this.generateRectArea(rectA);
                    const areaB = this.generateRectArea(rectB);
                    const area = areaA.concat(areaB);
                    const hall = {
                        rectA,
                        rectB,
                        area,
                    };
                    this.halls.push(hall);
                } else {
                    const rectA = new Rectangle(point2.x, point2.y, Math.abs(w), 1);
                    const rectB = new Rectangle(point1.x, point1.y, 1, Math.abs(h));
                    const areaA = this.generateRectArea(rectA);
                    const areaB = this.generateRectArea(rectB);
                    const area = areaA.concat(areaB);
                    const hall = {
                        rectA,
                        rectB,
                        area,
                    };
                    this.halls.push(hall);
                }
            } else {
                // if (h === 0)
                const rectA = new Rectangle(point2.x, point2.y, Math.abs(w), 1);
                const area = this.generateRectArea(rectA);
                const hall = {
                    rectA,
                    area,
                };
                this.halls.push(hall);
            }
        } else if (w > 0) {
            if (h < 0) {
                if (Math.floor(Math.random() * Math.floor(1.25)) < 1.25) {
                    const rectA = new Rectangle(point1.x, point2.y, Math.abs(w), 1);
                    const rectB = new Rectangle(point1.x, point2.y, 1, Math.abs(h));
                    const areaA = this.generateRectArea(rectA);
                    const areaB = this.generateRectArea(rectB);
                    const area = areaA.concat(areaB);
                    const hall = {
                        rectA,
                        rectB,
                        area,
                    };
                    this.halls.push(hall);
                } else {
                    const rectA = new Rectangle(point1.x, point1.y, Math.abs(w), 1);
                    const rectB = new Rectangle(point2.x, point2.y, 1, Math.abs(h));
                    const areaA = this.generateRectArea(rectA);
                    const areaB = this.generateRectArea(rectB);
                    const area = areaA.concat(areaB);
                    const hall = {
                        rectA,
                        rectB,
                        area,
                    };
                    this.halls.push(hall);
                }
            } else if (h > 0) {
                if (Math.floor(Math.random() * Math.floor(1.25)) < 1.25) {
                    const rectA = new Rectangle(point1.x, point1.y, Math.abs(w), 1);
                    const rectB = new Rectangle(point2.x, point1.y, 1, Math.abs(h));
                    const areaA = this.generateRectArea(rectA);
                    const areaB = this.generateRectArea(rectB);
                    const area = areaA.concat(areaB);
                    const hall = {
                        rectA,
                        rectB,
                        area,
                    };
                    this.halls.push(hall);
                } else {
                    const rectA = new Rectangle(point1.x, point2.y, Math.abs(w), 1);
                    const rectB = new Rectangle(point1.x, point1.y, 1, Math.abs(h));
                    const areaA = this.generateRectArea(rectA);
                    const areaB = this.generateRectArea(rectB);
                    const area = areaA.concat(areaB);
                    const hall = {
                        rectA,
                        rectB,
                        area,
                    };
                    this.halls.push(hall);
                }
            } else {
                // if (h === 0)
                const rectA = new Rectangle(point1.x, point1.y, Math.abs(w), 1);
                const area = this.generateRectArea(rectA);
                const hall = {
                    rectA,
                    area,
                };
                this.halls.push(hall);
            }
        } else {
            // if (w === 0)
            if (h < 0) {
                const rectA = new Rectangle(point2.x, point2.y, 1, Math.abs(h));
                const area = this.generateRectArea(rectA);
                const hall = {
                    rectA,
                    area,
                };
                this.halls.push(hall);
            } else if (h > 0) {
                const rectA = new Rectangle(point1.x, point1.y, 1, Math.abs(h));
                const area = this.generateRectArea(rectA);
                const hall = {
                    rectA,
                    area,
                };
                this.halls.push(hall);
            }
        }
    }
}

export default Leaf;
