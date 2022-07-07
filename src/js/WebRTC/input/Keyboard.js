import { InputDevice } from './InputDevice.js';
import { KeyboardState } from '../inputState/KeyboardState.js';

export class Keyboard extends InputDevice {
    static get keycount() {
        return 110;
    }
    /**
     *
     * @param {KeyboardEvent} event
     */
    queueEvent(event) {
        this.updateState(new KeyboardState(event, this.currentState));
    }
}
