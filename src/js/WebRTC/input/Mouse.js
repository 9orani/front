import { InputDevice } from './InputDevice.js';
import { MouseState } from '../inputState/MouseState.js';

export class Mouse extends InputDevice {
    /**
     * @param {(MouseEvent|WheelEvent)} event
     */
    queueEvent(event) {
        this.updateState(new MouseState(event));
    }
}
