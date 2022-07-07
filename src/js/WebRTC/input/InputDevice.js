export class InputDevice {
    /**
     *
     * name;
     * layout;
     * deviceId;
     * variants;
     * description;
     *
     * _inputState;
     */

    /**
     *
     * @param {Number} name
     * @param {String} layout
     * @param {Number} deviceId
     * @param {String} variants
     * @param {Object} description
     */
    constructor(name, layout, deviceId, variants, description) {
        this.name = name;
        this.layout = layout;
        this.deviceId = deviceId;
        this.variants = variants;
        this.description = description;

        this._inputState = null;
    }

    /**
     *
     * @param {IInputState} state
     */
    updateState(state) {
        this._inputState = state;
    }

    queueEvent(event) {
        throw new Error(`Please implement this method. event:${event}`);
    }

    /**
     * @returns {IInputState}
     */
    get currentState() {
        return this._inputState;
    }
}
