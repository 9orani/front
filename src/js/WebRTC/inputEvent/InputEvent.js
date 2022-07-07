export class InputEvent {
    static get invalidEventId() {
        return 0;
    }
    static get size() {
        return 20;
    }

    /**
     * field offset 0
     * @member {Number} type;
     *
     * field offset 4
     * @member {Number} sizeInBytes;
     *
     * field offset 6
     * @member {Number} deviceId;
     *
     * field offset 8
     * @member {Number} time;
     *
     * field offset 16
     * @member {Number} eventId;
     */

    /**
     *
     * @param {Number} type
     * @param {Number} sizeInBytes
     * @param {Number} deviceId
     * @param {Number} time
     */
    constructor(type, sizeInBytes, deviceId, time) {
        this.type = type;
        this.sizeInBytes = sizeInBytes;
        this.deviceId = deviceId;
        this.time = time;
        this.eventId = InputEvent.invalidEventId;
    }

    /**
     * @returns {ArrayBuffer}
     */
    get buffer() {
        let _buffer = new ArrayBuffer(InputEvent.size);
        let view = new DataView(_buffer);

        view.setInt32(0, this.type, true);
        view.setInt16(4, this.sizeInBytes, true);
        view.setInt16(6, this.deviceId, true);
        view.setFloat64(8, this.time, true);
        view.setInt16(16, this.sizeInBytes, true);

        return _buffer;
    }
}
