import { FourCC } from '../utils/FourCC';
import { TouchPhase } from '../constants/TouchPhase';

export class TouchState {
    static get format() {
        return new FourCC('T', 'O', 'U', 'C').toInt32();
    }
    static get size() {
        return 56;
    }
    static incrementTouchId() {
        if (TouchState._currentTouchId === undefined) {
            TouchState._currentTouchId = 0;
        }
        return ++TouchState._currentTouchId;
    }
    static prevTouches() {
        if (TouchState._prevTouches === undefined) {
            // max touch count is 10
            TouchState._prevTouches = new Array(10);
        }
        return TouchState._prevTouches;
    }

    /**
     * field offset 0
     * @number {Number} touchId;
     * field offset 4
     * @number {Number[]} position;
     * field offset 12
     * @number {Number[]} delta;
     * field offset 20
     * @number {Number} pressure;
     * field offset 24
     * @number {Number[]} radius;
     * field offset 32
     * @number {Number} phase;
     * field offset 33
     * @number {Number} tapCount;
     * field offset 34
     * @number {Number} displayIndex;
     * field offset 35
     * @number {Number} flag;
     * field offset 36
     * @number {Number} padding;
     * field offset 40
     * @number {Number} startTime;
     * field offset 48
     * @number {Number[]} startPosition;
     */

    /**
     * @param {Touch} touch
     * @param {TouchState} state
     * @param {String} type
     */
    constructor(touch, type, time) {
        let phaseId = TouchPhase.Stationary;

        switch (type) {
            case 'touchstart':
                phaseId = TouchPhase.Began;
                break;
            case 'touchend':
                phaseId = TouchPhase.Ended;
                break;
            case 'touchmove':
                phaseId = TouchPhase.Moved;
                break;
            case 'touchcancel':
                phaseId = TouchPhase.Canceled;
                break;
        }

        let touchId = 0;
        let state = null;

        if (phaseId == TouchPhase.Began) {
            touchId = TouchState.incrementTouchId();
        } else {
            state = TouchState.prevTouches[touch.identifier];
            touchId = state.touchId;
        }

        this.touchId = touchId;
        this.position = [touch.pageX, -touch.pageY];

        if (phaseId == TouchPhase.Moved) {
            this.delta = [
                this.position[0] - state.position[0],
                this.position[1] - state.position[1],
            ];
        } else {
            this.delta = [0, 0];
        }

        this.pressure = touch.force;
        this.radius = [touch.radiusX, touch.radiusY];
        this.phaseId = phaseId;
        this.tapCount = 0;
        this.displayIndex = 0;
        this.flags = 0;
        this.padding = 0;

        if (phaseId == TouchPhase.Began) {
            this.startTime = time;
            this.startPosition = this.position.slice();
        } else {
            this.startTime = state.startTime;
            this.startPosition = state.startPosition.slice();
        }

        // cache state
        TouchState.prevTouches[touch.identifier] = this;
    }

    /**
     * @returns {ArrayBuffer}
     */
    get buffer() {
        const size = TouchState.size; // todo
        let _buffer = new ArrayBuffer(size);
        let view = new DataView(_buffer);

        view.setInt32(0, this.touchId, true);
        view.setFloat32(4, this.position[0], true);
        view.setFloat32(8, this.position[1], true);
        view.setFloat32(12, this.delta[0], true);
        view.setFloat32(16, this.delta[1], true);
        view.setFloat32(20, this.pressure, true);
        view.setFloat32(24, this.radius[0], true);
        view.setFloat32(28, this.radius[1], true);
        view.setInt8(32, this.phaseId, true);
        view.setInt8(33, this.tapCount, true);
        view.setInt8(34, this.displayIndex, true);
        view.setInt8(35, this.flags, true);
        view.setInt32(36, this.padding, true);
        view.setFloat64(40, this.startTime, true);
        view.setFloat32(48, this.startPosition[0], true);
        view.setFloat32(52, this.startPosition[1], true);

        return _buffer;
    }

    /**
     * @returns {Number}
     */
    get format() {
        return TouchState.format;
    }
}
