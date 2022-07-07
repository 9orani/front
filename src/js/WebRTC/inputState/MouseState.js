import { IInputState } from './IInputState';
import { FourCC } from '../utils/FourCC';
import { MemoryHelper } from '../utils/MemoryHelper';

export class MouseState extends IInputState {
    static get size() {
        return 30;
    }
    static get format() {
        return new FourCC('M', 'O', 'U', 'S').toInt32();
    }

    /**
     * field offset 0
     * @member {Array} position;
     *
     * field offset 8
     * @member {Array} delta;
     *
     * field offset 16
     * @member {Array} scroll;
     *
     * field offset 24
     * @member {ArrayBuffer} buttons;
     *
     * field offset 26
     * @member {Array} displayIndex;
     *
     * field offset 28
     * @member {Array} clickCount;
     */

    /**
     * @param {MouseEvent | WheelEvent} event
     */
    constructor(event) {
        super();

        this.position = [event.clientX, event.clientY];
        this.delta = [event.movementX, -event.movementY];
        this.scroll = [0, 0];
        if (event.type === 'wheel') {
            this.scroll = [event.deltaX, event.deltaY];
        }
        this.buttons = new ArrayBuffer(2);

        const left = event.buttons & (1 << 0);
        const right = event.buttons & (1 << 1);
        const middle = event.buttons & (1 << 2);
        const back = event.buttons & (1 << 3);
        const forward = event.buttons & (1 << 4);

        MemoryHelper.writeSingleBit(this.buttons, MouseButton.Left, left);
        MemoryHelper.writeSingleBit(this.buttons, MouseButton.Right, right);
        MemoryHelper.writeSingleBit(this.buttons, MouseButton.Middle, middle);
        MemoryHelper.writeSingleBit(this.buttons, MouseButton.Forward, forward);
        MemoryHelper.writeSingleBit(this.buttons, MouseButton.Back, back);
    }

    /**
     * @returns {ArrayBuffer}
     */
    get buffer() {
        const size = MouseState.size;
        const buttons = new Uint16Array(this.buttons)[0];
        let _buffer = new ArrayBuffer(size);
        let view = new DataView(_buffer);

        view.setFloat32(0, this.position[0], true);
        view.setFloat32(4, this.position[1], true);
        view.setFloat32(8, this.delta[0], true);
        view.setFloat32(12, this.delta[1], true);
        view.setFloat32(16, this.scroll[0], true);
        view.setFloat32(20, this.scroll[1], true);
        view.setUint16(24, buttons, true);
        view.setUint16(26, this.displayIndex, true);
        view.setUint16(28, this.clickCount, true);

        return _buffer;
    }

    /**
     * @returns {Number}
     */
    get format() {
        return MouseState.format;
    }
}
