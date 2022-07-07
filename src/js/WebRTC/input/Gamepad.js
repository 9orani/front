import { InputDevice } from './InputDevice';
import { GamepadState } from '../inputState/GamepadState';

export class Gamepad extends InputDevice {
    /**
     * @param {GamepadButtonEvent | GamepadAxisEvent} event
     */
    queueEvent(event) {
        this.updateState(new GamepadState(event));
    }
}
