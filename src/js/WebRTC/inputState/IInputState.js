export class IInputState {
    /**
     * @returns {ArrayBuffer}
     */
    get buffer() {
        throw new Error('Please implement this field');
    }
    /**
     * @returns {Number}
     */
    get format() {
        throw new Error('Please implement this field');
    }
}
