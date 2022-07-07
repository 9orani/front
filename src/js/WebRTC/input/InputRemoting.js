export class InputRemoting {
    /**
     * @param {LocalInputManager} manager
     */
    constructor(manager) {
        this._localManager = manager;
        this._subscribers = new Array();
        this._sending = false;
    }

    startSending() {
        if (this._sending) {
            return;
        }
        this._sending = true;

        const onEvent = (e) => {
            this._sendEvent(e.detail.event);
        };

        const onDeviceChange = (e) => {
            this._sendDeviceChange(e.detail.device, e.detail.change);
        };

        this._localManager.setStartTime(Date.now() / 1000);
        this._localManager.onEvent.addEventListener('event', onEvent);
        this._localManager.onEvent.addEventListener(
            'changedeviceusage',
            onDeviceChange
        );
        this._sendInitialMessages();
    }

    stopSending() {
        if (!this._sending) {
            return;
        }
        this._sending = false;
    }

    /**
     *
     * @param {Observer} observer
     */
    subscribe(observer) {
        this._subscribers.push(observer);
    }

    _sendInitialMessages() {
        this._sendAllGeneratedLayouts();
        this._sendAllDevices();
    }

    _sendAllGeneratedLayouts() {
        // todo:
    }

    _sendAllDevices() {
        var devices = this._localManager.devices;
        if (devices == null) return;
        for (const device of devices) {
            this._sendDevice(device);
        }
    }

    _sendDevice(device) {
        const newDeviceMessage = NewDeviceMsg.create(device);
        this._send(newDeviceMessage);

        // Send current state. We do this here in this case as the device
        // may have been added some time ago and thus have already received events.

        // todo:
        // const stateEventMessage = NewEventsMsg.createStateEvent(device);
        // this._send(stateEventMessage);
    }

    _sendEvent(event) {
        const message = NewEventsMsg.create(event);
        this._send(message);
    }

    _sendDeviceChange(device, change) {
        if (this._subscribers == null) return;

        let msg = null;
        switch (change) {
            case InputDeviceChange.Added:
                msg = NewDeviceMsg.Create(device);
                break;
            case InputDeviceChange.Removed:
                msg = RemoveDeviceMsg.Create(device);
                break;
            case InputDeviceChange.UsageChanged:
                msg = ChangeUsageMsg.Create(device);
                break;
            default:
                return;
        }
        this._send(msg);
    }

    _send(message) {
        for (let subscriber of this._subscribers) {
            subscriber.onNext(message);
        }
    }
}
