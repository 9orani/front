import { Mouse } from './input/Mouse.js';
import { Keyboard } from './input/Keyboard.js';
import { TouchScreen } from './input/TouchScreen.js';
import { Gamepad } from './input/Gamepad.js';

import { StateEvent } from './inputEvent/StateEvent.js';
import { TextEvent } from './inputEvent/TextEvent.js';

import { LocalInputManager } from './LocalInputManager.js';
import { GamepadHandler } from './GamepadHandler.js';
import { PointerCorrector } from './utils/PointCorrector.js';

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

    _queueStateEvent(state, device) {
        const stateEvent = StateEvent.fromState(
            state,
            device.deviceId,
            this.timeSinceStartup
        );
        const e = new CustomEvent('event', {
            detail: { event: stateEvent, device: device },
        });
        super.onEvent.dispatchEvent(e);
    }
    _queueTextEvent(device, character) {
        const textEvent = TextEvent.create(
            device.deviceId,
            character,
            this.timeSinceStartup
        );
        const e = new CustomEvent('event', {
            detail: { event: textEvent, device: device },
        });
        super.onEvent.dispatchEvent(e);
    }

    _onMouseEvent(event) {
        this.mouse.queueEvent(event);
        this.mouse.currentState.position = this._corrector.map(
            this.mouse.currentState.position
        );
        this._queueStateEvent(this.mouse.currentState, this.mouse);
    }
    _onKeyEvent(event) {
        if (event.type == 'keydown') {
            if (!event.repeat) {
                // StateEvent
                this.keyboard.queueEvent(event);
                this._queueStateEvent(
                    this.keyboard.currentState,
                    this.keyboard
                );
            }
            // TextEvent
            const key = event.key.charCodeAt(0);
            this._queueTextEvent(this.keyboard, key);
        } else if (event.type == 'keyup') {
            this.keyboard.queueEvent(event);
            this._queueStateEvent(this.keyboard.currentState, this.keyboard);
        }
    }
    _onWheelEvent(event) {
        this.mouse.queueEvent(event);
        this._queueStateEvent(this.mouse.currentState, this.mouse);
    }
    _onTouchEvent(event) {
        this.touchScreen.queueEvent(event, this.timeSinceStartup);
        for (let touch of this.touchScreen.currentState.touchData) {
            this._queueStateEvent(touch, this.touchScreen);
        }
    }
    _onGamepadEvent(event) {
        switch (event.type) {
            case 'gamepadconnected': {
                this._gamepadHandler.addGamepad(event.gamepad);
                break;
            }
            case 'gamepaddisconnected': {
                this._gamepadHandler.removeGamepad(event.gamepad);
                break;
            }
            case 'gamepadupdated': {
                this.gamepad.queueEvent(event);
                this._queueStateEvent(this.gamepad.currentState, this.gamepad);
                break;
            }
        }
    }

    addMouse() {
        const descriptionMouse = {
            m_InterfaceName: 'RawInput',
            m_DeviceClass: 'Mouse',
            m_Manufacturer: '',
            m_Product: '',
            m_Serial: '',
            m_Version: '',
            m_Capabilities: '',
        };
        this.mouse = new Mouse('Mouse', 'Mouse', 1, '', descriptionMouse);
        this._devices.push(this.mouse);

        this._element.addEventListener(
            'click',
            this._onMouseEvent.bind(this),
            false
        );
        this._element.addEventListener(
            'mousedown',
            this._onMouseEvent.bind(this),
            false
        );
        this._element.addEventListener(
            'mouseup',
            this._onMouseEvent.bind(this),
            false
        );
        this._element.addEventListener(
            'mousemove',
            this._onMouseEvent.bind(this),
            false
        );
        this._element.addEventListener(
            'wheel',
            this._onWheelEvent.bind(this),
            false
        );
    }

    addKeyboard() {
        const descriptionKeyboard = {
            m_InterfaceName: 'RawInput',
            m_DeviceClass: 'Keyboard',
            m_Manufacturer: '',
            m_Product: '',
            m_Serial: '',
            m_Version: '',
            m_Capabilities: '',
        };
        this.keyboard = new Keyboard(
            'Keyboard',
            'Keyboard',
            2,
            '',
            descriptionKeyboard
        );
        this._devices.push(this.keyboard);

        document.addEventListener('keyup', this._onKeyEvent.bind(this), false);
        document.addEventListener(
            'keydown',
            this._onKeyEvent.bind(this),
            false
        );
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

    addGamepad() {
        const descriptionGamepad = {
            m_InterfaceName: 'RawInput',
            m_DeviceClass: 'Gamepad',
            m_Manufacturer: '',
            m_Product: '',
            m_Serial: '',
            m_Version: '',
            m_Capabilities: '',
        };
        this.gamepad = new Gamepad(
            'Gamepad',
            'Gamepad',
            3,
            '',
            descriptionGamepad
        );
        this._devices.push(this.gamepad);

        window.addEventListener(
            'gamepadconnected',
            this._onGamepadEvent.bind(this),
            false
        );
        window.addEventListener(
            'gamepaddisconnected',
            this._onGamepadEvent.bind(this),
            false
        );
        this._gamepadHandler = new GamepadHandler();
        this._gamepadHandler.addEventListener(
            'gamepadupdated',
            this._onGamepadEvent.bind(this),
            false
        );
    }
}
