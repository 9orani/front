import { InputDevice } from './InputDevice.js';
import { GamepadState } from '../inputState/GamepadState.js';

export class Gamepad extends InputDevice {
    /**
     * @param {GamepadButtonEvent | GamepadAxisEvent} event
     */
    queueEvent(event) {
        this.updateState(new GamepadState(event));
    }
}
