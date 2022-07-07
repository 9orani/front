import { IInputState } from './IInputState.js';
import { FourCC } from '../utils/FourCC.js';
import { TouchPhase } from '../constants/TouchPhase.js';
import { TouchFlags } from '../constants/TouchFlags.js';

export class TouchScreenState extends IInputState {
    static get maxTouches() {
        return 10;
    }
    static get format() {
        return new FourCC('T', 'S', 'C', 'R').toInt32();
    }

    /**
     * @param {TouchEvent} event
     * @param {TouchScreenState} state
     * @param {Date} time
     */
    constructor(event, state, time) {
        super();

        switch (event.type) {
            case 'click': {
                this.touchData = new Array(state.touchData.length);
                for (let i = 0; i < state.touchData.length; i++) {
                    this.touchData[i] = state.touchData[i];
                    if (this.touchData[i].phaseId == TouchPhase.Ended) {
                        this.touchData[i].tapCount = 1;
                        this.touchData[i].flags |= TouchFlags.Tap;
                    }
                }
                break;
            }
            default: {
                let touches = event.changedTouches;
                this.touchData = new Array(touches.length);
                for (let i = 0; i < touches.length; i++) {
                    this.touchData[i] = new TouchState(
                        touches[i],
                        event.type,
                        time
                    );
                }
                break;
            }
        }
    }

    /**
     * @returns {ArrayBuffer}
     */
    get buffer() {
        const size = TouchState.size * this.touchData.length;
        let _buffer = new ArrayBuffer(size);
        let view = new Uint8Array(_buffer);
        for (let i = 0; i < this.touchData.length; i++) {
            view.set(
                new Uint8Array(this.touchData[i].buffer),
                TouchState.size * i
            );
        }
        return _buffer;
    }

    /**
     * @returns {Number}
     */
    get format() {
        return TouchScreenState.format;
    }
}
