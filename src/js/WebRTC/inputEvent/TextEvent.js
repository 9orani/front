import { FourCC } from '../utils/FourCC.js';
import { MemoryHelper } from '../utils/MemoryHelper.js';
import { InputEvent } from './InputEvent.js';

export class TextEvent {
    static get format() {
        return new FourCC('T', 'E', 'X', 'T').toInt32();
    }

    /**
     * field offset 0
     * @member {InputEvent} baseEvent;
     *
     * field offset 20
     * @member {Number} character;
     */

    /**
     * 
     * @param {Number} deviceId 
     * @param {Number} character
     * @param {Number} time 
     * @returns {TextEvent}
  
     */
    static create(deviceId, character, time) {
        const eventSize = InputEvent.size + MemoryHelper.sizeOfInt;
        let event = new TextEvent();

        event.baseEvent = new InputEvent(
            TextEvent.format,
            eventSize,
            deviceId,
            time
        );
        event.character = character;

        return event;
    }

    /**
     * @returns {ArrayBuffer}
     */
    get buffer() {
        const size = InputEvent.size + MemoryHelper.sizeOfInt;
        let _buffer = new ArrayBuffer(size);
        let arrayView = new Uint8Array(_buffer);
        let dataView = new DataView(_buffer);

        arrayView.set(new Uint8Array(this.baseEvent.buffer), 0);
        dataView.setInt32(InputEvent.size, this.character, true);

        return _buffer;
    }
}
