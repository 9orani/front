import { Mouse } from './input/Mouse';
import { Keyboard } from './input/Keyboard';
import { TouchScreen } from './input/TouchScreen';
import { StateEvent } from './inputEvent/StateEvent';
import { TextEvent } from './inputEvent/TextEvent';

import { LocalInputManager } from './LocalInputManager';
import { GamepadHandler } from './GamepadHandler';
import { PointerCorrector } from './utils/PointCorrector';

export class Sender extends LocalInputManager {
    constructor(element) {
        super();

        this._devices = [];
        this._element = element;
        this._corrector = new PointerCorrector(
            this._element.videoWidth,
            this._element.videoHeight,
            this._element.getBoundingClientRect()
        );

        this._element.addEventListener(
            'resize',
            this._onResizeEvent.bind(this),
            false
        );

        const observer = new ResizeObserver(this._onResizeEvent.bind(this));
        observer.observe(this._element);
    }

    _onResizeEvent() {
        this._corrector.reset(
            this._element.videoWidth,
            this._element.videoHeight,
            this._element.getBoundingClientRect()
        );
    }

    _onTouchEvent(event) {
        this.touchScreen.queueEvent(event, this.timeSinceStartup);
        for (let touch of this.touchScreen.currentState.touchData) {
            this._queueStateEvent(touch, this.touchScreen);
        }
    }

    addTouchScreen() {
        const descriptionTouch = {
            m_InterfaceName: 'RawInput',
            m_DeviceClass: 'Touch',
            m_Manufacturer: '',
            m_Product: '',
            m_Serial: '',
            m_Version: '',
            m_Capabilities: '',
        };
        this.touchScreen = new TouchScreen(
            'Touchscreen',
            'Touchscreen',
            4,
            '',
            descriptionTouch
        );
        this._devices.push(this.touchScreen);

        this._element.addEventListener(
            'touchend',
            this._onTouchEvent.bind(this),
            false
        );
        this._element.addEventListener(
            'touchstart',
            this._onTouchEvent.bind(this),
            false
        );
        this._element.addEventListener(
            'touchcancel',
            this._onTouchEvent.bind(this),
            false
        );
        this._element.addEventListener(
            'touchmove',
            this._onTouchEvent.bind(this),
            false
        );
        this._element.addEventListener(
            'click',
            this._onTouchEvent.bind(this),
            false
        );
    }
}
