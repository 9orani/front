import { Message } from './Message';
import { MessageType } from '../constants/MessageType';
import { MemoryHelper } from '../utils/MemoryHelper';

export class RemoveDeviceMsg {
    /**
     *
     * @param {InputDevice} device
     * @returns {Message}
     */
    static create(device) {
        let buffer = new ArrayBuffer(MemoryHelper.sizeOfInt);
        let view = new DataView(buffer);
        view.setInt32(device.deviceId);
        return new Message(0, MessageType.RemoveDevice, buffer);
    }
}
