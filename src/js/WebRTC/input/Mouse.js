import { InputDevice } from './InputDevice';
import { MouseState } from '../inputState/MouseState';

export class Mouse extends InputDevice {
    /**
     * @param {(MouseEvent|WheelEvent)} event
     */
    queueEvent(event) {
        this.updateState(new MouseState(event));
    }
}
