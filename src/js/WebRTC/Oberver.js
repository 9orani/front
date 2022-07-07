export class Observer {
    /**
     *
     * @param {RTCDataChannel} channel
     */
    constructor(channel) {
        this.channel = channel;
    }
    /**
     *
     * @param {Message} message
     */
    onNext(message) {
        if (this.channel == null || this.channel.readyState != 'open') {
            return;
        }
        this.channel.send(message.buffer);
    }
}
