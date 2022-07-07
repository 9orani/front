import { InputDevice } from './InputDevice.js';
import { TouchScreenState } from '../inputState/TouchScreenState.js';

export class TouchScreen extends InputDevice {
    /**
     * @param {TouchScreenEvent} event
     */
    queueEvent(event, time) {
        this.updateState(new TouchScreenState(event, this.currentState, time));
    }
}
