import { InputDevice } from './InputDevice';
import { TouchScreenState } from '../inputState/TouchScreenState';

export class TouchScreen extends InputDevice {
    /**
     * @param {TouchScreenEvent} event
     */
    queueEvent(event, time) {
        this.updateState(new TouchScreenState(event, this.currentState, time));
    }
}
