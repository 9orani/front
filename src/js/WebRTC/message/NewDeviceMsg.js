import { Message } from './Message.js';
import { MessageType } from '../constants/MessageType.js';

export class NewDeviceMsg {
    /**
     * @param {InputDevice} device
     * @returns {Message}
     */
    static create(device) {
        const data = {
            name: device.name,
            layout: device.layout,
            deviceId: device.deviceId,
            variants: device.variants,
            description: device.description,
        };
        const json = JSON.stringify(data);
        let buffer = new ArrayBuffer(json.length * 2); // 2 bytes for each char
        let view = new Uint8Array(buffer);
        const length = json.length;
        for (let i = 0; i < length; i++) {
            view[i] = json.charCodeAt(i);
        }
        return new Message(0, MessageType.NewDevice, buffer);
    }
}
