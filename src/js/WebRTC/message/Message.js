import { MemoryHelper } from '../utils/MemoryHelper.js';

export class Message {
    /**
     * field offset 0
     * {Number} participant_id;
     *
     * field offset 4
     * {Number} type;
     *
     * field offset 8
     * {Number} length;
     *
     * field offset 12
     * {ArrayBuffer} data;
     */

    /**
     *
     * @param {number} participantId
     * @param {MessageType} type
     * @param {ArrayBuffer} data
     */
    constructor(participantId, type, data) {
        this.participant_id = participantId;
        this.type = type;
        this.length = data.byteLength;
        this.data = data;
    }

    /**
     *
     * @returns {ArrayBuffer}
     */
    get buffer() {
        const totalSize =
            MemoryHelper.sizeOfInt + // size of this.participant_id
            MemoryHelper.sizeOfInt + // size of this.type
            MemoryHelper.sizeOfInt + // size of this.length
            this.data.byteLength; // size of this.data

        let buffer = new ArrayBuffer(totalSize);
        let dataView = new DataView(buffer);
        let uint8view = new Uint8Array(buffer);

        dataView.setUint32(0, this.participant_id, true);
        dataView.setUint32(4, this.type, true);
        dataView.setUint32(8, this.length, true);
        uint8view.set(new Uint8Array(this.data), 12);

        return buffer;
    }
}
