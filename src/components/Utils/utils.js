/**
 * Easily generate a random number between a range
 *
 * @param {number} [min=0]
 * @param {number} [max=10]
 * @param {boolean} [absolute=false]
 * @returns
 */
function randomNumber(min = 0, max = 10, absolute = false) {
    if (!absolute) {
        return Math.floor(Math.random() * (1 + max - min) + min);
    } else {
        return Math.abs(Math.floor(Math.random() * (1 + max - min) + min));
    }
}

export { randomNumber }