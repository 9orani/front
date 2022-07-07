import { FourCC } from '../utils/FourCC';
import { MemoryHelper } from '../utils/MemoryHelper';

export class StateEvent {
    static get format() {
        return new FourCC('S', 'T', 'A', 'T').toInt32();
    }

    /**
     * field offset 0
     * @member {InputEvent} baseEvent;
     *
     * field offset 20
     * @member {Number} stateFormat;
     *
     * field offset 24
     * @member {ArrayBuffer} stateData;
     */

    /**
     *
     * @param {InputDevice} device
     * @param {Number} time
     * @returns {StateEvent}
     */
    static from(device, time) {
        return StateEvent.fromState(device.currentState, device.deviceId, time);
    }

    /**
     *
     * @param {IInputState} state
     * @param {Number} deviceId
     * @param {Number} time
     */
    static fromState(state, deviceId, time) {
        const stateData = state.buffer;
        const stateSize = stateData.byteLength;
        const eventSize = InputEvent.size + MemoryHelper.sizeOfInt + stateSize;

        let stateEvent = new StateEvent();
        stateEvent.baseEvent = new InputEvent(
            StateEvent.format,
            eventSize,
            deviceId,
            time
        );
        stateEvent.stateFormat = state.format;
        stateEvent.stateData = stateData;
        return stateEvent;
    }

    /**
     * @returns {ArrayBuffer}
     */
    get buffer() {
        const stateSize = this.stateData.byteLength;
        const size = InputEvent.size + MemoryHelper.sizeOfInt + stateSize;
        let _buffer = new ArrayBuffer(size);
        let uint8View = new Uint8Array(_buffer);
        let dataView = new DataView(_buffer);

        uint8View.set(new Uint8Array(this.baseEvent.buffer), 0);
        dataView.setInt32(InputEvent.size, this.stateFormat, true);
        uint8View.set(
            new Uint8Array(this.stateData),
            InputEvent.size + MemoryHelper.sizeOfInt
        );

        return _buffer;
    }
}
