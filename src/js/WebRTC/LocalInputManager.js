export class LocalInputManager {
    constructor() {
        this._onevent = new EventTarget();
    }

    /**
     * event type 'event', 'changedeviceusage'
     * @return {Event}
     */
    get onEvent() {
        return this._onevent;
    }

    /**
     * @return {Event}
     */
    get devices() {
        throw new Error(`Please implement this method.`);
    }

    /**
     * @return {Number} time (sec)
     */
    get startTime() {
        return this._startTime;
    }

    /**
     * @return {Number} time (sec)
     */
    get timeSinceStartup() {
        return Date.now() / 1000 - this.startTime;
    }

    /**
     * @param {Number} time (sec)
     */
    setStartTime(time) {
        this._startTime = time;
    }
}
