import { IInputState } from './IInputState.js';
import { FourCC } from '../utils/FourCC.js';
import { MemoryHelper } from '../utils/MemoryHelper.js';

export class GamepadState extends IInputState {
    static get size() {
        return 28;
    }
    static get format() {
        return new FourCC('G', 'P', 'A', 'D').toInt32();
    }

    /**
     * field offset 0
     * @member buttons;
     *
     * field offset 4
     * @member leftStick;
     *
     * field offset 12
     * @member rightStick;
     *
     * field offset 20
     * @member leftTrigger;
     *
     * field offset 24
     * @member rightTrigger;
     */

    /**
     *
     * @param {GamepadButtonEvent | GamepadAxisEvent} event
     */
    constructor(event) {
        super();
        const gamepad = event.gamepad;
        const buttons = event.gamepad.buttons;

        this.buttons = new ArrayBuffer(4);
        this.leftStick = [gamepad.axes[0], -gamepad.axes[1]];
        this.rightStick = [gamepad.axes[2], -gamepad.axes[3]];
        this.leftTrigger = buttons[6].value;
        this.rightTrigger = buttons[7].value;

        // see https://w3c.github.io/gamepad/#remapping
        MemoryHelper.writeSingleBit(
            this.buttons,
            GamepadButton.A,
            buttons[0].pressed
        );
        MemoryHelper.writeSingleBit(
            this.buttons,
            GamepadButton.B,
            buttons[1].pressed
        );
        MemoryHelper.writeSingleBit(
            this.buttons,
            GamepadButton.X,
            buttons[2].pressed
        );
        MemoryHelper.writeSingleBit(
            this.buttons,
            GamepadButton.Y,
            buttons[3].pressed
        );
        MemoryHelper.writeSingleBit(
            this.buttons,
            GamepadButton.LeftShoulder,
            buttons[4].pressed
        );
        MemoryHelper.writeSingleBit(
            this.buttons,
            GamepadButton.RightShoulder,
            buttons[5].pressed
        );
        MemoryHelper.writeSingleBit(
            this.buttons,
            GamepadButton.LeftTrigger,
            buttons[6].pressed
        );
        MemoryHelper.writeSingleBit(
            this.buttons,
            GamepadButton.RightTrigger,
            buttons[7].pressed
        );
        MemoryHelper.writeSingleBit(
            this.buttons,
            GamepadButton.Select,
            buttons[8].pressed
        );
        MemoryHelper.writeSingleBit(
            this.buttons,
            GamepadButton.Start,
            buttons[9].pressed
        );
        MemoryHelper.writeSingleBit(
            this.buttons,
            GamepadButton.LeftStick,
            buttons[10].pressed
        );
        MemoryHelper.writeSingleBit(
            this.buttons,
            GamepadButton.RightStick,
            buttons[11].pressed
        );
        MemoryHelper.writeSingleBit(
            this.buttons,
            GamepadButton.DpadUp,
            buttons[12].pressed
        );
        MemoryHelper.writeSingleBit(
            this.buttons,
            GamepadButton.DpadDown,
            buttons[13].pressed
        );
        MemoryHelper.writeSingleBit(
            this.buttons,
            GamepadButton.DpadLeft,
            buttons[14].pressed
        );
        MemoryHelper.writeSingleBit(
            this.buttons,
            GamepadButton.DpadRight,
            buttons[15].pressed
        );
    }

    /**
     * @returns {ArrayBuffer}
     */
    get buffer() {
        const size = GamepadState.size;
        let _buffer = new ArrayBuffer(size);
        let view = new DataView(_buffer);

        view.setUint32(0, new Uint32Array(this.buttons)[0], true);
        view.setFloat32(4, this.leftStick[0], true);
        view.setFloat32(8, this.leftStick[1], true);
        view.setFloat32(12, this.rightStick[0], true);
        view.setFloat32(16, this.rightStick[1], true);
        view.setFloat32(20, this.leftTrigger, true);
        view.setFloat32(24, this.rightTrigger, true);

        return _buffer;
    }

    /**
     * @returns {Number}
     */
    get format() {
        return GamepadState.format;
    }
}
