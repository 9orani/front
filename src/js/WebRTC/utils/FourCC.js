export class FourCC {
    /**
     * {Number} _code;
     */

    /**
     *
     * @param {String} a
     * @param {String} b
     * @param {String} c
     * @param {String} d
     */
    constructor(a, b, c, d) {
        this._code = (a.charCodeAt() << 24) | (b.charCodeAt() << 16) | (c.charCodeAt() << 8) | d.charCodeAt();
    }

    /**
     * @returns {Number}
     */
    toInt32() {
        return this._code;
    }
}
