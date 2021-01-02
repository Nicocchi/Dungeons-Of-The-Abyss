/**
 * Easily generate a random number between a range.
 *
 * @param {number} [min=0] - Minimum number. Default is 0.
 * @param {number} [max=10] - Maximum number. Default is 10.
 * @param {boolean} [absolute=false] - If the value should be an absolute value.
 * @returns {number}
 */
function randomRegInt(min = 0, max = 10, absolute = false) {
    if (!absolute) {
        return Math.floor(Math.random() * (1 + max - min) + min);
    } else {
        return Math.abs(Math.floor(Math.random() * (1 + max - min) + min));
    }
}

/**
 * Generates a random number.
 *
 * @param {*} max - Number to stop at
 * @returns {number}
 */
function randomNumber(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

export { randomRegInt, randomNumber };
