import { InputDevice } from './InputDevice';
import { KeyboardState } from '../inputState/KeyboardState';

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
