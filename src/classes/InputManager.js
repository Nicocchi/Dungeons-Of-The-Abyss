class InputManager {
    observers = [];

    subscribe(fn) {
        this.observers.push(fn);
    }

    unsubscribe(fn) {
        this.observers = this.observers.filter(subscriber => subscriber !== fn);
    }

    broadcast(action, data) {
        this.observers.forEach(subscriber => subscriber(action, data));
    }

    handleKeys = e => {
        e.preventDefault();

        switch(e.keyCode) {
            case 37: // Left
                this.broadcast('move', {x: -1, y: 0});
                break;
            case 38: // Up
                this.broadcast('move', {x: 0, y: -1});
                break;
            case 39: // Right
                this.broadcast('move', {x: 1, y: 0});
                break;
            case 40: // Down
                this.broadcast('move', {x: 0, y: 1});
                break;
            case 13:
                this.broadcast('changeDungeons', null)
            default:
                break;
        }
    }

    // Start listening to events
    bindKeys() {
        document.addEventListener('keydown', this.handleKeys)
    }

    // Remove events
    unbindKeys() {
        document.removeEventListener('keydown', this.handleKeys)
    }
}

export default InputManager;