import { Mouse } from './input/Mouse';
import { Keyboard } from './input/Keyboard';
import { TouchScreen } from './input/Touchscreen';
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
}
