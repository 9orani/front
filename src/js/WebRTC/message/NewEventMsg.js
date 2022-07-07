import { Message } from './Message.js';
import { MessageType } from '../constants/MessageType.js';

export class NewEventsMsg {
    /**
     *
     * @param {InputDevice} device
     * @returns {Message}
     */
    static createStateEvent(device) {
        const events = StateEvent.from(device);
        return NewEventsMsg.create(events);
    }

    /**
     *
     * @param {StateEvent} event
     * @returns {Message}
     */
    static create(event) {
        return new Message(0, MessageType.NewEvents, event.buffer);
    }
}
