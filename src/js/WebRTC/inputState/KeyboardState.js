import { IInputState } from './IInputState';
import { FourCC } from '../utils/FourCC';
import { MemoryHelper } from '../utils/MemoryHelper';

export class KeyboardState extends IInputState {
    static get sizeInBits() {
        return Keyboard.keycount;
    }
    static get sizeInBytes() {
        return (KeyboardState.sizeInBits + 7) >> 3;
    }
    static get format() {
        return new FourCC('K', 'E', 'Y', 'S').toInt32();
    }

    /**
     * field offset 0
     * @number {ArrayBuffer} keys;
     */

    /**
     * @param {KeyboardEvent} event
     */
    constructor(event, state) {
        super();
        if (state == null || state.keys == null) {
            this.keys = new ArrayBuffer(KeyboardState.sizeInBytes);
        } else {
            this.keys = state.keys;
        }
        let value = false;
        switch (event.type) {
            case 'keydown':
                value = true;
                break;
            case 'keyup':
                value = false;
                break;
            default:
                throw new Error(`unknown event type ${event.type})`);
        }
        const key = Keymap[event.code];
        MemoryHelper.writeSingleBit(this.keys, key, value);
    }

    /**
     * @returns {ArrayBuffer}
     */
    get buffer() {
        return this.keys;
    }

    /**
     * @returns {Number}
     */
    get format() {
        return KeyboardState.format;
    }
}
